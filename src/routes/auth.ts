import { CompositeStorage } from "../storage";
import type { Note } from "@shared/schema";
import { insertBlogPostSchema, updateBlogPostSchema, AnalyticsMetricsType } from "@shared/schema";
import { parseNoteExpirySecondsFromBody } from "@shared/noteExpiry";
import { isValidNoteId } from "@shared/noteId";
import { isPlausibleEmailFormat } from "@shared/isPlausibleEmailFormat";
import type { KVNamespace } from "@cloudflare/workers-types";
import type { Env } from "../types";
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import type { AuthenticatorTransportFuture } from "@simplewebauthn/types";
import * as OTPAuth from "otpauth";
import {
  DEFAULT_CORS_ORIGIN,
  getAllowedOriginFromRequest,
  getSessionCookieKindForRequest,
  isTrustedBrowserOrigin,
  isPagesPreviewBrowserOrigin,
  isWebAuthnRpAllowedOrigin,
  normalizeOrigin,
  PAGES_PRODUCTION_WEB_HOSTS,
  type SessionCookieKind,
  SESSION_COOKIE_PREVIEW_NAME,
  SESSION_COOKIE_PROD_NAME,
  sessionCookieNameForKind,
} from "../trustedOrigins";
import { getApiContentSecurityPolicy, SECURITY_HEADERS } from "../httpSecurity";
import { canonicalizeMagicLinkOrigin } from "@shared/magicLinkOrigin";
import {
  buildMagicLinkEmailContent,
  detectAuthEmailLocale,
  type AuthEmailLocale,
  type MagicLinkEmailPurpose,
} from "@shared/magicLinkEmail";
import { appendMagicLinkReturnTo, sanitizeAuthReturnTo } from "@shared/sanitizeAuthReturnTo";

const getAllowedOrigin = getAllowedOriginFromRequest;

/** Generic passkey failure copy (does not reveal whether a credential is registered). */
const PASSKEY_CLIENT_SAFE_MESSAGE =
  "Sign-in could not be completed. Try again or use a different sign-in method.";

/** Global cap on POSTs across /api/*. Stricter per-route limits below. */
const RATE_LIMIT_GLOBAL_POST = {
  MAX_REQUESTS: 72,
  WINDOW_SECONDS: 60,
  KEY_PREFIX: "rl:post:global:",
};

const RATE_LIMIT_RESERVE = {
  MAX_REQUESTS: 36,
  WINDOW_SECONDS: 60,
  KEY_PREFIX: "rl:post:reserve:",
};

const RATE_LIMIT_NOTE_CREATE = {
  MAX_REQUESTS: 24,
  WINDOW_SECONDS: 60,
  KEY_PREFIX: "rl:post:note:",
};

const RATE_LIMIT_REVEAL = {
  MAX_REQUESTS: 12,
  WINDOW_SECONDS: 60,
  KEY_PREFIX: "rl:reveal:",
};

const AI_VERIFICATION = {
  USES: 5,
  TTL_SECONDS: 10 * 60,
  KEY_PREFIX: "ai_verify:",
};

/** When set (KV), AI paths require a fresh Turnstile token until verification succeeds. */
const TURNSTILE_CHALLENGE = {
  KEY_PREFIX: "turnstile_challenge:",
  TTL_SECONDS: 45 * 60,
  AI_NOTE_WINDOW_SECONDS: 60 * 60,
  AI_NOTE_COUNT_THRESHOLD: 8,
};

const NOTE_RESERVATION = {
  TTL_SECONDS: 5 * 60,
  KEY_PREFIX: "note_reserve:",
};

const SESSION_POLICY = {
  TTL_SECONDS: 60 * 60 * 24 * 7, // 7 days sliding
  ABSOLUTE_TTL_SECONDS: 60 * 60 * 24 * 30, // 30 days absolute
  ROTATE_SECONDS: 60 * 60 * 24, // 24 hours
  /** Half-authenticated (magic link before TOTP): fixed window, no 7-day slide. */
  PENDING_TOTP_SESSION_TTL_SECONDS: 10 * 60,
};

const USER_STATUS_PENDING = "pending";
const USER_STATUS_ACTIVE = "active";
const STEP_UP_WINDOW_SECONDS = 5 * 60;
// First passkey enrollment without an existing passkey: require a recent magic-link / recovery sign-in.
const PASSKEY_FIRST_ENROLL_AUTH_WINDOW_SECONDS = 10 * 60;
// Tighter step-up window for recovery code regeneration (reduces window if session is compromised)
const RECOVERY_CODE_STEP_UP_WINDOW_SECONDS = 2 * 60;

// Recovery-code consume: per-IP window + progressive delay only. Never key lockout or primary
// rate windows by email — unauthenticated callers could otherwise DoS a victim's recovery path.
const RECOVERY_CODE_RATE_LIMIT = {
  MAX_ATTEMPTS_PER_IP: 24,
  WINDOW_SECONDS: 15 * 60, // 15 minute window
  IP_KEY_PREFIX: "recovery_consume_ip:",
  // Progressive delays: delay = BASE_DELAY * 2^(attempts-1), capped at MAX_DELAY
  PROGRESSIVE_BASE_DELAY_MS: 500,
  PROGRESSIVE_MAX_DELAY_MS: 8000,
};

/**
 * Per-account recovery consume **telemetry only** (distributed guessing across many IPs).
 * Never used to block or 429 — victim recovery stays governed by per-IP limits only.
 */
const RECOVERY_CONSUME_ACCOUNT_TELEMETRY = {
  KEY_PREFIX: "recovery_consume_acct:",
  WINDOW_SECONDS: 24 * 60 * 60,
  /** Console warn once per window when crossed */
  WARN_THRESHOLD: 20,
  /** Audit + console error when first crossed, then every +40 in same window */
  ALERT_THRESHOLD: 60,
};

// Magic link send rate limiting (per IP and per email)
const MAGIC_LINK_RATE_LIMIT = {
  MAX_PER_IP: 20, // max magic links per IP per window
  MAX_PER_EMAIL: 20, // max magic links per email per window
  WINDOW_SECONDS: 60 * 60, // 1 hour window
  IP_KEY_PREFIX: "magic_ip_rate:",
  EMAIL_KEY_PREFIX: "magic_email_rate:",
};

/** Public passkey login options — no per-email DB probe; still cap abuse per IP. */
const WEBAUTHN_LOGIN_OPTIONS_RATE_LIMIT = {
  MAX_PER_IP: 60,
  WINDOW_SECONDS: 60 * 60, // 1 hour
  IP_KEY_PREFIX: "wauthn_login_opts_ip:",
};

// Audit log retention policy
const AUDIT_LOG_RETENTION = {
  RETENTION_DAYS: 90, // Keep audit logs for 90 days (GDPR compliance)
  CLEANUP_BATCH_SIZE: 1000, // Delete in batches to avoid timeouts
};

// Recovery-code hashing config (Worker-safe WebCrypto PBKDF2)
const RECOVERY_CODE_SALT_LENGTH = 16; // 16 bytes = 128 bits salt
const RECOVERY_CODE_HASH_LENGTH = 32; // 32 bytes = 256 bits output
const RECOVERY_CODE_PBKDF2_ITERATIONS = 100_000; // Cloudflare WebCrypto cap for PBKDF2

// Session IP binding (optional - can be disabled for mobile users)
const SESSION_IP_BINDING_ENABLED = true; // Set to false to disable IP binding

async function readJsonBody(request: Request): Promise<any> {
  const text = await request.text();
  if (!text) {
    return {};
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Invalid JSON");
  }
}

/** BCP-47 primary subtag only — must match client `SUPPORTED_LANGUAGES`. */
const ACCOUNT_PREFERRED_LANGUAGE_CODES = new Set(["en", "de", "fr", "es"]);

function normalizeAccountPreferredLanguageInput(
  raw: unknown
): { ok: true; value: string | null } | { ok: false; message: string } {
  if (raw === null) return { ok: true, value: null };
  if (raw === "") return { ok: true, value: null };
  if (typeof raw !== "string") {
    return { ok: false, message: "preferredLanguage must be a string or null" };
  }
  const primary = raw.trim().toLowerCase().split("-")[0];
  if (ACCOUNT_PREFERRED_LANGUAGE_CODES.has(primary)) {
    return { ok: true, value: primary };
  }
  return {
    ok: false,
    message:
      "preferredLanguage must be one of en, de, fr, es (or a regional tag such as en-US), or null",
  };
}

/**
 * Normalize TOTP from JSON (string with optional separators, or integer 0–999999).
 * Returns a 6-digit string or "" so the second-factor gate does not ignore valid codes
 * when browsers/clients coerce types.
 */
function normalizeTotpCodeParam(raw: unknown): string {
  if (typeof raw === "string") {
    const digits = raw.replace(/\D/g, "").slice(0, 6);
    return /^\d{6}$/.test(digits) ? digits : "";
  }
  if (typeof raw === "number" && Number.isInteger(raw) && raw >= 0 && raw <= 999_999) {
    return String(raw).padStart(6, "0");
  }
  return "";
}

const SECOND_FACTOR_STEP_UP_MESSAGE =
  "Enter your 6-digit authenticator code, or verify with your passkey on this device first.";
const SECOND_FACTOR_STEP_UP_CODE = "second_factor_step_up_required";

// Get CORS headers
function getCorsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("Origin");
  const allowedOrigin = origin ? getAllowedOrigin(request) : null;

  const headers: Record<string, string> = {
    ...SECURITY_HEADERS,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-admin-token",
    "Access-Control-Allow-Credentials": "true",
    "Content-Security-Policy": getApiContentSecurityPolicy(),
    "Referrer-Policy": "strict-origin-when-cross-origin",
  };

  if (origin) {
    headers["Access-Control-Allow-Origin"] = allowedOrigin ?? "null";
    headers["Vary"] = "Origin";
  }

  return headers;
}

/**
 * Canonical first-party origin for links emailed to users (magic sign-in, email change, etc.).
 * Prefer the browser `Origin` when trusted; never use the Worker `request.url` host (could be the API host).
 * Otherwise `env.PUBLIC_WEB_APP_ORIGIN` if trusted, else {@link DEFAULT_CORS_ORIGIN} from the allowlist.
 */
function getMagicLinkOrigin(env: Env, request: Request): string {
  const origin = request.headers.get("Origin");
  const allowedOrigin = origin ? getAllowedOrigin(request) : null;
  if (allowedOrigin) {
    return canonicalizeMagicLinkOrigin(allowedOrigin, {
      configuredPublicOrigin: env.PUBLIC_WEB_APP_ORIGIN,
      isPreviewOrigin: isPagesPreviewBrowserOrigin,
      isTrustedOrigin: isTrustedBrowserOrigin,
      normalizeOrigin,
    });
  }

  const configured = typeof env.PUBLIC_WEB_APP_ORIGIN === "string" ? env.PUBLIC_WEB_APP_ORIGIN.trim() : "";
  if (configured) {
    if (!isTrustedBrowserOrigin(configured)) {
      console.warn(
        `[AUTH] PUBLIC_WEB_APP_ORIGIN is not in the trusted browser allowlist (${configured}); using DEFAULT_CORS_ORIGIN for emailed links.`,
      );
    } else {
      return normalizeOrigin(configured);
    }
  }

  return DEFAULT_CORS_ORIGIN;
}

function normalizeEmail(email: string | null | undefined): string | null {
  const normalized = email?.trim().toLowerCase() || null;
  return normalized && normalized.length ? normalized : null;
}

async function jitterDelay(minMs = 350, maxMs = 900): Promise<void> {
  const delay = Math.floor(minMs + Math.random() * (maxMs - minMs + 1));
  await new Promise((resolve) => setTimeout(resolve, delay));
}

function getRequestIp(request: Request): string | null {
  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp;
  const forwarded = request.headers.get("x-forwarded-for");
  if (!forwarded) return null;
  return forwarded.split(",")[0]?.trim() || null;
}

/** Soft network binding for magic links: /24 for IPv4, first 3 IPv6 hextets for IPv6 (best-effort). */
function softIpPrefix(ip: string): string {
  const trimmed = ip.trim();
  if (!trimmed) return trimmed;
  if (trimmed.includes(".")) {
    const parts = trimmed.split(".");
    if (parts.length === 4 && parts.every((p) => p.length > 0)) {
      return `${parts[0]}.${parts[1]}.${parts[2]}`;
    }
    return trimmed;
  }
  const segments = trimmed.toLowerCase().split(":").filter(Boolean);
  if (segments.length === 0) return trimmed;
  return segments.slice(0, 3).join(":");
}

/**
 * Stored when issuing a magic link; compared on prepare/consume for risk scoring only.
 * IP prefix and UA hash are weak signals — not authentication; see evaluateMagicLinkContextPolicy.
 */
async function magicLinkSoftContext(request: Request): Promise<{ ipPrefix: string | null; uaHash: string | null }> {
  const ip = getRequestIp(request);
  const ua = request.headers.get("User-Agent")?.trim() || "";
  const ipPrefix = ip ? softIpPrefix(ip) : null;
  const uaNorm = ua.slice(0, 512);
  const uaHash = uaNorm ? await sha256Base64Url(uaNorm) : null;
  return { ipPrefix, uaHash };
}

async function magicLinkContextDriftFlags(
  payload: Record<string, unknown>,
  request: Request,
): Promise<{ ipDrift: boolean; uaDrift: boolean; hasBinding: boolean }> {
  const storedIp = typeof payload.magicIpPrefix === "string" ? payload.magicIpPrefix : null;
  const storedUa = typeof payload.magicUaHash === "string" ? payload.magicUaHash : null;
  const hasBinding = Boolean(storedIp || storedUa);
  const now = await magicLinkSoftContext(request);
  const ipDrift = Boolean(storedIp && now.ipPrefix && storedIp !== now.ipPrefix);
  const uaDrift = Boolean(storedUa && now.uaHash && storedUa !== now.uaHash);
  return { ipDrift, uaDrift, hasBinding };
}

type MagicContextRiskLevel = "low" | "medium" | "high";

type MagicContextPolicyResult = {
  risk: MagicContextRiskLevel;
  ipDrift: boolean;
  uaDrift: boolean;
  automationLikely: boolean;
};

/** Obvious non-browser / automation User-Agents — policy input only; paired with drift signals in evaluateMagicLinkContextPolicy. */
function isLikelyAutomatedUserAgent(ua: string | null): boolean {
  if (!ua || ua.trim().length < 10) return true;
  const s = ua.toLowerCase();
  const indicators = [
    "curl/",
    "wget/",
    "python-requests",
    "libcurl",
    "go-http-client",
    "axios/",
    "scrapy",
    "phantomjs",
    "headlesschrome",
    "selenium",
    "webdriver",
  ];
  return indicators.some((x) => s.includes(x));
}

/**
 * Single policy function for magic-link context: IP/UA drift and automation classify risk.
 * All prepare/consume UX gates use this so behavior cannot drift across call sites.
 */
async function evaluateMagicLinkContextPolicy(
  payload: Record<string, unknown>,
  request: Request,
): Promise<MagicContextPolicyResult> {
  const { ipDrift, uaDrift, hasBinding } = await magicLinkContextDriftFlags(payload, request);
  const automationLikely = isLikelyAutomatedUserAgent(request.headers.get("User-Agent"));

  if (automationLikely) {
    return { risk: "high", ipDrift, uaDrift, automationLikely: true };
  }
  if (hasBinding && ipDrift && uaDrift) {
    return { risk: "high", ipDrift, uaDrift, automationLikely: false };
  }
  if (hasBinding && (ipDrift || uaDrift)) {
    return { risk: "medium", ipDrift, uaDrift, automationLikely: false };
  }
  return { risk: "low", ipDrift, uaDrift, automationLikely: false };
}

async function logMagicLinkContextDriftIfAny(
  env: Env,
  request: Request,
  payload: Record<string, unknown>,
  userId: string,
): Promise<void> {
  const { ipDrift, uaDrift } = await magicLinkContextDriftFlags(payload, request);
  if (!ipDrift && !uaDrift) return;
  await logAuditEvent(env, {
    userId,
    eventType: "magic_link_context_mismatch",
    status: "warning",
    details: { ipSoftMismatch: ipDrift, uaSoftMismatch: uaDrift },
    ip: getRequestIp(request),
    userAgent: request.headers.get("User-Agent"),
  });
}

function getRequestGeo(request: Request): { city: string | null; country: string | null } {
  const cf = (request as any).cf as { city?: string; country?: string } | undefined;
  return {
    city: typeof cf?.city === "string" ? cf.city : null,
    country: typeof cf?.country === "string" ? cf.country : null,
  };
}

function getDeviceLabel(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  const isMobile = /iphone|ipad|android|mobile/.test(ua);
  let os = "Unknown OS";
  if (ua.includes("windows")) os = "Windows";
  else if (ua.includes("mac os x")) os = isMobile ? "iOS" : "macOS";
  else if (ua.includes("android")) os = "Android";
  else if (ua.includes("linux")) os = "Linux";

  let browser = "Unknown Browser";
  if (ua.includes("edg")) browser = "Edge";
  else if (ua.includes("chrome") && !ua.includes("edg")) browser = "Chrome";
  else if (ua.includes("safari") && !ua.includes("chrome")) browser = "Safari";
  else if (ua.includes("firefox")) browser = "Firefox";

  return `${isMobile ? "Mobile" : "Desktop"} • ${os} • ${browser}`;
}

// Safely parse transports JSON from database.
// Supports both formats: raw array ["internal","hybrid"] and object { transports: [...] }.
function parseTransports(transportsJson: string | null | undefined): AuthenticatorTransportFuture[] | undefined {
  if (!transportsJson) return undefined;
  try {
    const parsed = JSON.parse(transportsJson);
    if (Array.isArray(parsed)) return parsed;
    if (parsed && typeof parsed === "object" && Array.isArray(parsed.transports)) {
      return parsed.transports;
    }
    return undefined;
  } catch {
    return undefined;
  }
}

function getPasskeyLabel(transports: string[] | null): string {
  if (!transports || !Array.isArray(transports) || transports.length === 0) {
    return "Synced / Remote Passkey";
  }
  const normalized = transports.map((t) => t.toLowerCase());
  if (normalized.includes("internal")) {
    return "Local Device Passkey";
  }
  if (normalized.some((t) => t === "usb" || t === "nfc" || t === "ble")) {
    return "Security Key / External Device";
  }
  if (normalized.includes("hybrid")) {
    return "Synced / Remote Passkey";
  }
  return "Passkey";
}

function normalizePasskeyDisplayName(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const normalized = raw.trim().replace(/\s+/g, " ");
  if (!normalized) return null;
  return normalized.slice(0, 80);
}

type UsersTableColumns = {
  plan: boolean;
  account_type: boolean;
  business_display_name: boolean;
  email_notifications: boolean;
  preferred_language: boolean;
  allow_hosted_ai: boolean;
};

async function getUsersTableColumns(env: Env): Promise<UsersTableColumns> {
  const defaults: UsersTableColumns = {
    plan: false,
    account_type: false,
    business_display_name: false,
    email_notifications: false,
    preferred_language: false,
    allow_hosted_ai: false,
  };
  if (!env.AUTH_DB) return defaults;
  try {
    const info = await env.AUTH_DB.prepare("PRAGMA table_info(users)").all<{ name: string }>();
    const names = new Set((info.results || []).map((row) => row.name));
    return {
      plan: names.has("plan"),
      account_type: names.has("account_type"),
      business_display_name: names.has("business_display_name"),
      email_notifications: names.has("email_notifications"),
      preferred_language: names.has("preferred_language"),
      allow_hosted_ai: names.has("allow_hosted_ai"),
    };
  } catch {
    return defaults;
  }
}

function buildUserSelect(baseColumns: string[], optionalColumns: UsersTableColumns): string {
  const columns = [...baseColumns];
  if (optionalColumns.plan) columns.push("plan");
  if (optionalColumns.account_type) columns.push("account_type");
  if (optionalColumns.business_display_name) columns.push("business_display_name");
  if (optionalColumns.email_notifications) columns.push("email_notifications");
  if (optionalColumns.preferred_language) columns.push("preferred_language");
  if (optionalColumns.allow_hosted_ai) columns.push("allow_hosted_ai");
  return columns.join(", ");
}

async function webauthnCredentialsHaveDisplayNameColumn(env: Env): Promise<boolean> {
  if (!env.AUTH_DB) return false;
  try {
    const info = await env.AUTH_DB.prepare("PRAGMA table_info(webauthn_credentials)")
      .all<{ name: string }>();
    return (info.results || []).some((row) => row.name === "display_name");
  } catch {
    return false;
  }
}

function generateMagicEmailOtpDigits(): string {
  const buf = new Uint8Array(4);
  crypto.getRandomValues(buf);
  const n = new DataView(buf.buffer).getUint32(0, false) % 1_000_000;
  return String(n).padStart(6, "0");
}

function normalizeMagicEmailCode(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const digits = raw.replace(/\D/g, "").slice(0, 6);
  return digits.length === 6 ? digits : null;
}

async function sendMagicLinkEmail(
  env: Env,
  to: string,
  magicUrl: string,
  options: {
    signInCode: string;
    locale?: AuthEmailLocale;
    purpose?: MagicLinkEmailPurpose;
    hostLabel?: string;
  },
): Promise<{ ok: boolean; error?: string }> {
  const { subject, text, html } = buildMagicLinkEmailContent({
    magicUrl,
    signInCode: options.signInCode,
    locale: options.locale ?? "en",
    purpose: options.purpose ?? "default",
    hostLabel: options.hostLabel,
  });
  return sendEmail(env, { to, subject, text, html });
}

// Generic email sending function
async function sendEmail(
  env: Env,
  options: {
    to: string;
    subject: string;
    text: string;
    html: string;
  }
): Promise<{ ok: boolean; error?: string }> {
  const provider = env.AUTH_EMAIL_PROVIDER?.toLowerCase();
  if (provider !== "resend") {
    return { ok: false, error: "Email provider not configured" };
  }

  const apiKey = env.RESEND_API_KEY;
  const from = env.AUTH_EMAIL_FROM;
  if (!apiKey) {
    return { ok: false, error: "Resend API key not configured" };
  }
  if (!from) {
    return { ok: false, error: "AUTH_EMAIL_FROM not configured" };
  }

  console.log(`[EMAIL] Sending email via Resend: to=${options.to}, subject=${options.subject}`);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    }),
  });

  const responseText = await res.text();
  console.log(`[EMAIL] Resend API response: status=${res.status}, body=${responseText}`);

  if (!res.ok) {
    const message = responseText || res.statusText;
    console.error(`[EMAIL] Resend API error: ${res.status} ${message}`);
    return { ok: false, error: `Resend error: ${res.status} ${message}` };
  }

  try {
    const responseJson = JSON.parse(responseText);
    console.log(`[EMAIL] Resend email sent successfully: id=${responseJson.id || 'unknown'}`);
  } catch (e) {
    console.log(`[EMAIL] Resend email sent successfully (response not JSON)`);
  }

  return { ok: true };
}

// Helper to create JSON response with CORS headers
function jsonResponse(data: any, status: number = 200, request?: Request): Response {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(request
      ? getCorsHeaders(request)
      : {
        ...SECURITY_HEADERS,
        "Access-Control-Allow-Origin": DEFAULT_CORS_ORIGIN,
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, x-admin-token",
        "Content-Security-Policy": getApiContentSecurityPolicy(),
      }),
  };
  if (request) {
    headers["Referrer-Policy"] = "no-referrer";
  }

  // First-party rate-limit cookie: combined with IP for abuse buckets (shared NAT). HttpOnly, not used for analytics.
  if (request) {
    const cookieHeader = request.headers.get("Cookie") || "";
    const hasClientCookie = /(?:^|;\s*)pn_client_id=([^;]+)/.test(cookieHeader);
    if (!hasClientCookie) {
      const clientId = randomId(16);
      const maxAge = 30 * 24 * 60 * 60;
      headers["Set-Cookie"] = `pn_client_id=${clientId}; Path=/; Max-Age=${maxAge}; SameSite=Lax; Secure; HttpOnly`;
    }
  }

  return new Response(JSON.stringify(data), {
    status,
    headers,
  });
}

/** Rate limit bucket for TOTP checks on account takeover actions (aligned with magic-link TOTP verify). */
const SENSITIVE_ACTION_TOTP_RL = {
  MAX_ATTEMPTS: 5,
  WINDOW_SECONDS: 15 * 60,
  KEY_PREFIX_EMAIL_CHANGE: "email_change_totp_rl:",
  KEY_PREFIX_ACCOUNT_DELETE: "account_delete_totp_rl:",
  KEY_PREFIX_PASSKEY_RESET: "passkey_reset_totp_rl:",
  KEY_PREFIX_RECOVERY_GENERATE: "recovery_generate_totp_rl:",
} as const;

/** Returns null when TOTP verified; otherwise an error Response. */
async function verifyTotpForSensitiveAction(
  env: Env,
  request: Request,
  session: { id: string; email: string | null; sessionIdHash: string },
  verifiedTotpSecretRow: { encrypted_secret: string },
  totpCodeTrimmed: string,
  rateLimitPrefix: string,
  totpAuditPhase: string,
): Promise<Response | null> {
  if (!env.TOTP_ENCRYPTION_KEY) {
    return jsonResponse({ message: "TOTP not configured" }, 501, request);
  }

  if (env.AUTH_KV) {
    const rlKey = `${rateLimitPrefix}${session.sessionIdHash}`;
    try {
      const rlData = (await env.AUTH_KV.get(rlKey, "json")) as { count: number } | null;
      if (rlData && rlData.count >= SENSITIVE_ACTION_TOTP_RL.MAX_ATTEMPTS) {
        return jsonResponse({ message: "Too many attempts. Please wait and try again." }, 429, request);
      }
      await env.AUTH_KV.put(rlKey, JSON.stringify({ count: (rlData?.count ?? 0) + 1 }), {
        expirationTtl: SENSITIVE_ACTION_TOTP_RL.WINDOW_SECONDS,
      });
    } catch {
      // non-fatal
    }
  }

  const secret = await decryptTotpSecret(verifiedTotpSecretRow.encrypted_secret, env);
  const accountName = session.email || session.id;
  if (!verifyTotpCode(secret, totpCodeTrimmed, accountName)) {
    await logAuditEvent(env, {
      userId: session.id,
      eventType: "totp_failed",
      status: "failure",
      details: { phase: totpAuditPhase },
      ip: getRequestIp(request),
      userAgent: request.headers.get("User-Agent"),
    });
    return jsonResponse({ message: "Invalid two-step code" }, 400, request);
  }

  if (env.AUTH_KV) {
    try {
      await env.AUTH_KV.delete(`${rateLimitPrefix}${session.sessionIdHash}`);
    } catch {
      /* ignore */
    }
  }
  return null;
}

/**
 * Sensitive actions: passkey users need a fresh WebAuthn step-up unless they submit a valid TOTP
 * (when 2-step verification is enabled). Users without passkeys use TOTP only, or must enroll first.
 * When {@link allowSessionWithoutMfa} is true (e.g. recovery-code generation), a signed-in user with
 * neither passkeys nor TOTP is allowed — matching legacy behavior.
 * Returns a JSON Response to return to the client, or null when satisfied.
 */
async function gateSecondFactorForAccountTakeover(
  env: Env,
  request: Request,
  session: {
    id: string;
    email: string | null;
    lastStepUpAt: string | null;
    sessionIdHash: string;
  },
  hasPasskeys: boolean,
  verifiedTotpSecretRow: { encrypted_secret: string } | null,
  totpCode: unknown,
  rateLimitPrefix: string,
  totpAuditPhase: string,
  stepUpWindowSeconds: number = STEP_UP_WINDOW_SECONDS,
  allowSessionWithoutMfa = false,
): Promise<Response | null> {
  const tcRaw = normalizeTotpCodeParam(totpCode);
  const totpProvided = tcRaw.length > 0;

  if (hasPasskeys && verifiedTotpSecretRow) {
    if (totpProvided) {
      return await verifyTotpForSensitiveAction(
        env,
        request,
        session,
        verifiedTotpSecretRow,
        tcRaw,
        rateLimitPrefix,
        totpAuditPhase,
      );
    }
    if (!isStepUpFresh(session.lastStepUpAt, stepUpWindowSeconds)) {
      return jsonResponse(
        { message: SECOND_FACTOR_STEP_UP_MESSAGE, code: SECOND_FACTOR_STEP_UP_CODE },
        403,
        request,
      );
    }
    return null;
  }

  if (hasPasskeys) {
    if (!isStepUpFresh(session.lastStepUpAt, stepUpWindowSeconds)) {
      return jsonResponse(
        {
          message:
            "Verify with your passkey on this device. If you already did, wait a moment and try again.",
          code: SECOND_FACTOR_STEP_UP_CODE,
        },
        403,
        request,
      );
    }
    return null;
  }

  if (verifiedTotpSecretRow) {
    if (!totpProvided || !/^\d{6}$/.test(tcRaw)) {
      return jsonResponse(
        {
          message: "Two-step verification code required",
          code: "second_factor_code_required",
        },
        400,
        request,
      );
    }
    return await verifyTotpForSensitiveAction(
      env,
      request,
      session,
      verifiedTotpSecretRow,
      tcRaw,
      rateLimitPrefix,
      totpAuditPhase,
    );
  }

  if (allowSessionWithoutMfa) {
    return null;
  }

  return jsonResponse(
    {
      message: "Add a passkey or enable 2-step verification before this action.",
      code: "second_factor_enrollment_required",
    },
    403,
    request,
  );
}

/** Out-of-band proof for account deletion when email-code method is allowed by policy. */
const ACCOUNT_DELETE_EMAIL = {
  KV_PREFIX: "account_delete_email:",
  TTL_SECONDS: 15 * 60,
  ISSUE_MAX: 5,
  ISSUE_WINDOW_SECONDS: 60 * 60,
  VERIFY_MAX: 8,
  VERIFY_WINDOW_SECONDS: 15 * 60,
  ISSUE_RL_PREFIX: "account_delete_email_issue_rl:",
  VERIFY_RL_PREFIX: "account_delete_email_verify_rl:",
} as const;

const ACCOUNT_DELETE_FALLBACK = {
  MARKER_PREFIX: "account_delete_fallback_marker:",
  MARKER_TTL_SECONDS: 10 * 60,
  ISSUE_RL_PREFIX: "account_delete_fallback_issue_rl:",
  ISSUE_MAX: 5,
  ISSUE_WINDOW_SECONDS: 15 * 60,
} as const;

const ACCOUNT_DELETE_PENDING = {
  DELAY_SECONDS: 48 * 60 * 60,
  TOKEN_RL_PREFIX: "account_delete_cancel_verify_rl:",
  TOKEN_VERIFY_MAX: 10,
  TOKEN_VERIFY_WINDOW_SECONDS: 15 * 60,
} as const;

function randomSixDigitNumericCode(): string {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return String(100000 + (buf[0] % 900000));
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function hmacAccountDeleteEmailCode(env: Env, userId: string, code: string): Promise<string | null> {
  if (!magicLinkHmacConfigured(env)) {
    return null;
  }
  const message = `${userId}:account_delete_email:${code}`;
  const keyData = new TextEncoder().encode(env.AUTH_SECRET_KEY!);
  const messageData = new TextEncoder().encode(message);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, messageData);
  return base64UrlEncode(new Uint8Array(signature));
}

/**
 * Validates single-use emailed code; consumes KV entry on success.
 * Returns an error Response or null when satisfied.
 */
async function verifyAccountDeleteEmailCodeProof(
  env: Env,
  request: Request,
  session: { id: string; sessionIdHash: string },
  deleteEmailVerificationCode: unknown,
): Promise<Response | null> {
  const kv = getAuthKv(env);
  if (!kv || !magicLinkHmacConfigured(env)) {
    return jsonResponse({ message: "Auth storage not configured" }, 501, request);
  }

  const rawParam =
    typeof deleteEmailVerificationCode === "string"
      ? deleteEmailVerificationCode.trim().replace(/\D/g, "").slice(0, 6)
      : "";
  if (!/^\d{6}$/.test(rawParam)) {
    return jsonResponse(
      { message: "Email confirmation code required", code: "delete_email_code_required" },
      400,
      request,
    );
  }

  const rlKey = `${ACCOUNT_DELETE_EMAIL.VERIFY_RL_PREFIX}${session.sessionIdHash}`;
  try {
    const rlData = (await kv.get(rlKey, "json")) as { count: number } | null;
    if (rlData && rlData.count >= ACCOUNT_DELETE_EMAIL.VERIFY_MAX) {
      return jsonResponse({ message: "Too many attempts. Please wait and try again." }, 429, request);
    }
    await kv.put(rlKey, JSON.stringify({ count: (rlData?.count ?? 0) + 1 }), {
      expirationTtl: ACCOUNT_DELETE_EMAIL.VERIFY_WINDOW_SECONDS,
    });
  } catch {
    // non-fatal
  }

  const storageKey = `${ACCOUNT_DELETE_EMAIL.KV_PREFIX}${session.id}`;
  const raw = await kv.get(storageKey);
  if (!raw) {
    await logAuditEvent(env, {
      userId: session.id,
      eventType: "account_delete_email_verify_failed",
      status: "failure",
      details: { reason: "no_pending_code" },
      ip: getRequestIp(request),
      userAgent: request.headers.get("User-Agent"),
    });
    return jsonResponse({ message: "Invalid or expired confirmation code" }, 400, request);
  }

  let record: { codeHash: string };
  try {
    record = JSON.parse(raw) as { codeHash: string };
  } catch {
    await kv.delete(storageKey);
    return jsonResponse({ message: "Invalid or expired confirmation code" }, 400, request);
  }

  const expected = await hmacAccountDeleteEmailCode(env, session.id, rawParam);
  if (!expected || !constantTimeEquals(expected, record.codeHash)) {
    await logAuditEvent(env, {
      userId: session.id,
      eventType: "account_delete_email_verify_failed",
      status: "failure",
      details: { reason: "mismatch" },
      ip: getRequestIp(request),
      userAgent: request.headers.get("User-Agent"),
    });
    return jsonResponse({ message: "Invalid confirmation code" }, 400, request);
  }

  await kv.delete(storageKey);
  try {
    await kv.delete(rlKey);
  } catch {
    /* ignore */
  }

  await logAuditEvent(env, {
    userId: session.id,
    eventType: "account_delete_email_verified",
    status: "success",
    details: {},
    ip: getRequestIp(request),
    userAgent: request.headers.get("User-Agent"),
  });
  return null;
}

type AccountDeleteMethod = "passkey" | "totp" | "email_code";

type AccountDeleteVerificationState = {
  hasUsablePasskeys: boolean;
  verifiedTotpRow: { encrypted_secret: string } | null;
  emailVerified: boolean;
  email: string | null;
  emailFallbackEligible: boolean;
};

function getAccountDeleteFallbackMarkerKey(sessionIdHash: string): string {
  return `${ACCOUNT_DELETE_FALLBACK.MARKER_PREFIX}${sessionIdHash}`;
}

async function isAccountDeleteFallbackEligible(
  env: Env,
  sessionIdHash: string,
): Promise<boolean> {
  const kv = getAuthKv(env);
  if (!kv) return false;
  const marker = await kv.get(getAccountDeleteFallbackMarkerKey(sessionIdHash), "text");
  return marker === "1";
}

async function loadAccountDeleteVerificationState(
  env: Env,
  session: { id: string; sessionIdHash: string },
): Promise<AccountDeleteVerificationState> {
  const hasUsablePasskeys = (await countUsableWebauthnCredentialsForUser(env, session.id)) > 0;
  const verifiedTotpRow = await env.AUTH_DB!.prepare(
    "SELECT encrypted_secret FROM totp_secrets WHERE user_id = ? AND verified = 1 LIMIT 1",
  )
    .bind(session.id)
    .first<{ encrypted_secret: string }>();
  const userRow = await env.AUTH_DB!
    .prepare("SELECT email_verified, email FROM users WHERE id = ? LIMIT 1")
    .bind(session.id)
    .first<{ email_verified: number; email: string | null }>();
  const emailVerified = (userRow?.email_verified ?? 0) === 1;
  const hasVerifiedTotp = Boolean(verifiedTotpRow);
  // Strict policy: fallback email is only for passkey-only accounts with no verified TOTP.
  const emailFallbackEligible =
    hasUsablePasskeys && !hasVerifiedTotp && emailVerified
      ? await isAccountDeleteFallbackEligible(env, session.sessionIdHash)
      : false;
  return {
    hasUsablePasskeys,
    verifiedTotpRow: verifiedTotpRow ?? null,
    emailVerified,
    email: userRow?.email ?? null,
    emailFallbackEligible,
  };
}

function buildAccountDeleteMethodList(state: AccountDeleteVerificationState): {
  preferred_method: AccountDeleteMethod | null;
  available_methods: AccountDeleteMethod[];
} {
  const available_methods: AccountDeleteMethod[] = [];
  if (state.hasUsablePasskeys) {
    available_methods.push("passkey");
    if (state.verifiedTotpRow) {
      available_methods.push("totp");
    } else if (state.emailFallbackEligible) {
      available_methods.push("email_code");
    }
  } else if (state.verifiedTotpRow) {
    available_methods.push("totp");
  } else if (state.emailVerified) {
    available_methods.push("email_code");
  }
  return {
    preferred_method: available_methods[0] ?? null,
    available_methods,
  };
}

/**
 * One of passkey (fresh step-up), TOTP, or email code must succeed. Session cookie alone is insufficient.
 * Evaluation order: TOTP (if provided), passkey freshness, email code — so a fresh step-up is not blocked by a wrong email OTP field.
 */
async function satisfyAccountDeleteVerification(
  env: Env,
  request: Request,
  session: {
    id: string;
    email: string | null;
    lastStepUpAt: string | null;
    sessionIdHash: string;
  },
  deleteBody: Record<string, unknown>,
  state: AccountDeleteVerificationState,
): Promise<Response | AccountDeleteMethod> {
  const { hasUsablePasskeys, verifiedTotpRow, emailVerified, emailFallbackEligible } = state;

  if (!hasUsablePasskeys && !verifiedTotpRow && !emailVerified) {
    await logAuditEvent(env, {
      userId: session.id,
      eventType: "account_delete_blocked",
      status: "failure",
      details: { reason: "no_verified_channel" },
      ip: getRequestIp(request),
      userAgent: request.headers.get("User-Agent"),
    });
    return jsonResponse(
      {
        message:
          "We can't verify it's you: verify your email, add a passkey, or enable 2-step verification, then try again.",
        code: "account_delete_no_verified_channel",
      },
      403,
      request,
    );
  }

  const tcRaw = normalizeTotpCodeParam(deleteBody.totpCode);
  const totpProvided = /^\d{6}$/.test(tcRaw);
  const emailRaw =
    typeof deleteBody.deleteEmailVerificationCode === "string"
      ? deleteBody.deleteEmailVerificationCode.trim().replace(/\D/g, "").slice(0, 6)
      : "";
  const emailCodeProvided = /^\d{6}$/.test(emailRaw);

  if (totpProvided && verifiedTotpRow) {
    const block = await verifyTotpForSensitiveAction(
      env,
      request,
      session,
      verifiedTotpRow,
      tcRaw,
      SENSITIVE_ACTION_TOTP_RL.KEY_PREFIX_ACCOUNT_DELETE,
      "account_delete",
    );
    if (block) {
      if (hasUsablePasskeys) {
        await logAuditEvent(env, {
          userId: session.id,
          eventType: "account_delete_fallback_failed",
          status: "failure",
          details: { method: "totp" },
          ip: getRequestIp(request),
          userAgent: request.headers.get("User-Agent"),
        });
      }
      return block;
    }
    return "totp";
  }

  if (hasUsablePasskeys && isStepUpFresh(session.lastStepUpAt)) {
    return "passkey";
  }

  const emailCodeAllowed = (!hasUsablePasskeys && emailVerified) || emailFallbackEligible;
  if (emailCodeProvided && emailCodeAllowed) {
    const block = await verifyAccountDeleteEmailCodeProof(
      env,
      request,
      session,
      deleteBody.deleteEmailVerificationCode,
    );
    if (block) {
      if (hasUsablePasskeys || verifiedTotpRow) {
        await logAuditEvent(env, {
          userId: session.id,
          eventType: "account_delete_fallback_failed",
          status: "failure",
          details: { method: "email_code" },
          ip: getRequestIp(request),
          userAgent: request.headers.get("User-Agent"),
        });
      }
      return block;
    }
    return "email_code";
  }

  if (hasUsablePasskeys && !isStepUpFresh(session.lastStepUpAt)) {
    return jsonResponse(
      { message: SECOND_FACTOR_STEP_UP_MESSAGE, code: SECOND_FACTOR_STEP_UP_CODE },
      403,
      request,
    );
  }

  if (verifiedTotpRow && !totpProvided) {
    return jsonResponse(
      {
        message: "Two-step verification code required",
        code: "second_factor_code_required",
      },
      400,
      request,
    );
  }

  if (emailCodeAllowed && !emailCodeProvided) {
    return jsonResponse(
      {
        message: "Email confirmation code required",
        code: "delete_email_code_required",
      },
      400,
      request,
    );
  }

  return jsonResponse({ message: "Verification required" }, 400, request);
}

async function issueAccountDeleteFallbackMarker(
  env: Env,
  request: Request,
  session: { id: string; sessionIdHash: string },
  reason: string,
  state: AccountDeleteVerificationState,
): Promise<Response | null> {
  if (!state.hasUsablePasskeys || state.verifiedTotpRow || !state.emailVerified) {
    return jsonResponse(
      {
        message:
          "Email fallback is not available for this account. Use passkey or authenticator verification.",
        code: "account_delete_fallback_not_allowed",
      },
      400,
      request,
    );
  }
  const kv = getAuthKv(env);
  if (!kv) {
    return jsonResponse({ message: "Auth storage not configured" }, 501, request);
  }
  const rlKey = `${ACCOUNT_DELETE_FALLBACK.ISSUE_RL_PREFIX}${session.sessionIdHash}`;
  try {
    const rlData = (await kv.get(rlKey, "json")) as { count: number } | null;
    if (rlData && rlData.count >= ACCOUNT_DELETE_FALLBACK.ISSUE_MAX) {
      return jsonResponse({ message: "Too many attempts. Please wait and try again." }, 429, request);
    }
    await kv.put(rlKey, JSON.stringify({ count: (rlData?.count ?? 0) + 1 }), {
      expirationTtl: ACCOUNT_DELETE_FALLBACK.ISSUE_WINDOW_SECONDS,
    });
  } catch {
    // non-fatal
  }
  await kv.put(getAccountDeleteFallbackMarkerKey(session.sessionIdHash), "1", {
    expirationTtl: ACCOUNT_DELETE_FALLBACK.MARKER_TTL_SECONDS,
  });

  await logAuditEvent(env, {
    userId: session.id,
    eventType: "account_delete_fallback_marker_issued",
    status: "success",
    details: { reason },
    ip: getRequestIp(request),
    userAgent: request.headers.get("User-Agent"),
  });
  return null;
}

const AUTH_CHALLENGE = {
  PREFIX: "auth_challenge:",
  TTL_SECONDS: 10 * 60,
};

const AUTH_MAGIC_LINK = {
  PREFIX: "auth_magic:",
  TTL_SECONDS: 10 * 60,
};

const AUTH_MAGIC_PREPARE = {
  PREFIX: "auth_magic_prep:",
  /** Single-use browser bind must be short-lived. */
  TTL_SECONDS: 5 * 60,
  TOKEN_INDEX_PREFIX: "auth_magic_prep_t:",
  /** Per-prepare-nonce guesses for medium-risk email OTP; nonce is cleared after this many wrong codes. */
  EMAIL_OTP_MAX_ATTEMPTS: 5,
};

const MAGIC_PREPARE_COOKIE = "pn_magic_prepare";

function magicPrepareCookieHeader(nonce: string): string {
  return `${MAGIC_PREPARE_COOKIE}=${nonce}; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=${AUTH_MAGIC_PREPARE.TTL_SECONDS}`;
}

function clearMagicPrepareCookieHeader(): string {
  return `${MAGIC_PREPARE_COOKIE}=; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=0`;
}

/** CSRF / cross-origin hardening for magic prepare and consume (JSON POST only). */
function assertTrustedJsonPost(request: Request): Response | null {
  if (request.method !== "POST") {
    return jsonResponse({ message: "Method not allowed" }, 405, request);
  }
  const ct = request.headers.get("Content-Type") || "";
  if (!ct.toLowerCase().includes("application/json")) {
    return jsonResponse({ message: "Content-Type must be application/json" }, 415, request);
  }
  const allowedOrigin = getAllowedOrigin(request);
  if (!allowedOrigin) {
    return jsonResponse(
      { message: "Cross-site request rejected", code: "origin_required" },
      403,
      request,
    );
  }
  const referer = request.headers.get("Referer");
  if (referer) {
    try {
      const refOrigin = new URL(referer).origin;
      if (!isTrustedBrowserOrigin(refOrigin)) {
        return jsonResponse({ message: "Invalid Referer" }, 403, request);
      }
      if (normalizeOrigin(refOrigin) !== normalizeOrigin(allowedOrigin)) {
        return jsonResponse(
          { message: "Cross-site request rejected", code: "origin_referer_mismatch" },
          403,
          request,
        );
      }
    } catch {
      return jsonResponse({ message: "Invalid Referer" }, 403, request);
    }
  }
  return null;
}

const AUTH_EMAIL_CHANGE = {
  PREFIX: "auth_email_change:",
  TTL_SECONDS: 60 * 60, // 1 hour for email change verification
};

type EmailChangeKvPayload = {
  userId: string;
  currentEmail: string;
  newEmail: string;
  createdAt: string;
};

function parseEmailChangeKvPayload(raw: string): { ok: true; payload: EmailChangeKvPayload } | { ok: false } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false };
  }
  if (!parsed || typeof parsed !== "object") return { ok: false };
  const r = parsed as Record<string, unknown>;
  if (typeof r.userId !== "string" || !r.userId.trim()) return { ok: false };
  if (typeof r.currentEmail !== "string" || !r.currentEmail.trim()) return { ok: false };
  if (typeof r.newEmail !== "string" || !r.newEmail.trim()) return { ok: false };
  if (typeof r.createdAt !== "string" || !r.createdAt.trim()) return { ok: false };
  return {
    ok: true,
    payload: {
      userId: r.userId.trim(),
      currentEmail: r.currentEmail.trim().toLowerCase(),
      newEmail: r.newEmail.trim().toLowerCase(),
      createdAt: r.createdAt.trim(),
    },
  };
}

function base64UrlEncode(bytes: Uint8Array): string {
  const binary = String.fromCharCode(...bytes);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function coerceWebAuthnIdToBase64Url(value: unknown, label: string, fallback?: string): string {
  if (typeof value === "string" && value.length > 0) {
    return value;
  }
  if (value instanceof ArrayBuffer) {
    return base64UrlEncode(new Uint8Array(value));
  }
  if (ArrayBuffer.isView(value)) {
    return base64UrlEncode(new Uint8Array(value.buffer, value.byteOffset, value.byteLength));
  }
  if (Array.isArray(value) && value.every((item) => typeof item === "number")) {
    return base64UrlEncode(new Uint8Array(value));
  }
  if (value && typeof value === "object") {
    const maybeRecord = value as Record<string, unknown>;
    if (Array.isArray(maybeRecord.data) && maybeRecord.data.every((item) => typeof item === "number")) {
      return base64UrlEncode(new Uint8Array(maybeRecord.data));
    }
    const entries = Object.entries(maybeRecord);
    if (entries.length) {
      const numericEntries = entries
        .map(([key, val]) => [Number(key), val] as const)
        .filter(([key, val]) => Number.isInteger(key) && typeof val === "number");
      if (numericEntries.length === entries.length) {
        const maxIndex = numericEntries.reduce((max, [key]) => Math.max(max, key), -1);
        const bytes = new Uint8Array(maxIndex + 1);
        for (const [key, val] of numericEntries) {
          bytes[key] = val as number;
        }
        return base64UrlEncode(bytes);
      }
    }
  }
  if (fallback) {
    return fallback;
  }
  throw new Error(`Invalid WebAuthn ${label}.`);
}

function isAuthDebug(env: Env): boolean {
  return env.AUTH_DEBUG === "1" || env.AUTH_DEBUG === "true";
}

/** Always logs to Worker observability (wrangler tail / dashboard). With AUTH_DEBUG=1, JSON includes `debug`, `route`, `phase`. */
function webAuthnErrorResponse(
  env: Env,
  request: Request,
  route: string,
  phase: string,
  err: unknown,
  status = 400
): Response {
  const msg = err instanceof Error ? err.message : String(err);
  const stack = err instanceof Error ? err.stack : undefined;
  console.error(`[WebAuthn] ${route} — ${phase}: ${msg}${stack ? `\n${stack}` : ""}`);
  const body: Record<string, unknown> = {
    message: status >= 500 ? "Internal error" : "Bad request",
  };
  if (isAuthDebug(env)) {
    body.debug = msg;
    body.route = route;
    body.phase = phase;
  }
  return jsonResponse(body, status, request);
}

function base64UrlToBytes(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((value.length + 3) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Whether a stored row could realistically be used with verifyAuthenticationResponse.
 * Excludes empty, truncated, or non-decodable public keys so MFA routing can fall back to TOTP/email
 * when the user only has corrupt placeholder credentials.
 */
function webauthnCredentialRowIsCryptographicallyUsable(credentialId: string, publicKeyB64: string): boolean {
  const id = typeof credentialId === "string" ? credentialId.trim() : "";
  const pkIn = typeof publicKeyB64 === "string" ? publicKeyB64.trim() : "";
  if (id.length < 2 || pkIn.length < 16) {
    return false;
  }
  try {
    const pk = base64UrlToBytes(pkIn);
    if (pk.length < 20) {
      return false;
    }
  } catch {
    return false;
  }
  return true;
}

async function countUsableWebauthnCredentialsForUser(env: Env, userId: string): Promise<number> {
  if (!env.AUTH_DB) return 0;
  try {
    const rows = await env.AUTH_DB.prepare(
      "SELECT credential_id, public_key FROM webauthn_credentials WHERE user_id = ?",
    )
      .bind(userId)
      .all<{ credential_id: string; public_key: string }>();
    let n = 0;
    for (const row of rows.results || []) {
      if (webauthnCredentialRowIsCryptographicallyUsable(row.credential_id, row.public_key)) {
        n += 1;
      }
    }
    return n;
  } catch (err) {
    // Gracefully degrade: a missing table or D1 error should not crash auth endpoints.
    // Returns 0 so callers treat the user as having no passkeys rather than a 500.
    console.error("[countUsableWebauthnCredentials] D1 query failed:", err);
    return 0;
  }
}

function getExpectedOrigin(request: Request): string | string[] | null {
  const origin = request.headers.get("Origin");
  if (!origin) {
    return null;
  }
  const allowedOrigin = getAllowedOrigin(request);
  if (!allowedOrigin) {
    return null;
  }
  return allowedOrigin;
}

const CANONICAL_RPID = "privatenote.ai";

/**
 * Derive rpID only from an already-allowed Origin (never from the Worker URL host).
 * Requires {@link isWebAuthnRpAllowedOrigin}: production Pages hosts use their full hostname as rpID;
 * branch previews are not eligible (they remain API-trusted with a preview session cookie only).
 */
function getExpectedRpIdFromOrigin(allowedOrigin: string | string[] | null): string | null {
  const originStr = allowedOrigin == null ? null : Array.isArray(allowedOrigin) ? allowedOrigin[0] : allowedOrigin;
  if (!originStr) return null;
  if (!isWebAuthnRpAllowedOrigin(originStr)) return null;
  try {
    const hostname = new URL(originStr).hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]") {
      return hostname;
    }
    if (PAGES_PRODUCTION_WEB_HOSTS.has(hostname)) {
      return hostname;
    }
    if (hostname === CANONICAL_RPID || hostname.endsWith(`.${CANONICAL_RPID}`)) {
      return CANONICAL_RPID;
    }
    return null;
  } catch {
    return null;
  }
}

function randomId(bytes = 32): string {
  const buffer = new Uint8Array(bytes);
  crypto.getRandomValues(buffer);
  return base64UrlEncode(buffer);
}

async function sha256Base64Url(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return base64UrlEncode(new Uint8Array(digest));
}

/**
 * Generate a recovery code with ~130 bits entropy (26 base32 chars × 5 bits).
 * Format: XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XX (26 chars, Crockford-style Base32)
 */
function generateRecoveryCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // 32 chars = 5 bits each
  const numChars = 26; // 26 × 5 = 130 bits
  const bytes = new Uint8Array(Math.ceil((numChars * 5) / 8)); // 17 bytes for 130 bits
  crypto.getRandomValues(bytes);
  let raw = "";
  let bits = 0;
  let acc = 0;
  for (let i = 0; i < bytes.length && raw.length < numChars; i++) {
    acc = (acc << 8) | bytes[i];
    bits += 8;
    while (bits >= 5 && raw.length < numChars) {
      bits -= 5;
      raw += alphabet[(acc >>> bits) & 31];
    }
  }
  return raw.match(/.{1,4}/g)?.join("-") ?? raw;
}

/**
 * Constant-time string comparison to prevent timing attacks
 */
function constantTimeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Hash recovery code using Worker-safe PBKDF2.
 */
async function hashRecoveryCode(code: string, salt: string): Promise<string> {
  const saltBuffer = base64UrlToBytes(salt);
  const codeBuffer = new TextEncoder().encode(code);
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    codeBuffer as unknown as ArrayBuffer,
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBuffer as unknown as ArrayBuffer,
      iterations: RECOVERY_CODE_PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    RECOVERY_CODE_HASH_LENGTH * 8
  );
  return base64UrlEncode(new Uint8Array(derivedBits));
}

// ============================================================================
// STRUCTURED AUDIT LOGGING
// ============================================================================

type AuditEventType =
  | "session_created"
  | "session_revoked"
  | "session_rotated"
  | "session_expired"
  | "login_success"
  | "login_failed"
  | "passkey_registered"
  | "passkey_used"
  | "passkey_renamed"
  | "passkey_deleted"
  | "passkey_reset"
  | "recovery_code_generated"
  | "recovery_code_used"
  | "recovery_code_failed"
  | "recovery_consume_guess_spike"
  | "account_deleted"
  | "account_delete_verification_started"
  | "account_delete_passkey_abandoned"
  | "account_delete_stepup_requested"
  | "account_delete_stepup_failed"
  | "account_delete_fallback_marker_issued"
  | "account_delete_fallback_selected"
  | "account_delete_fallback_success"
  | "account_delete_fallback_failed"
  | "account_delete_email_code_issued"
  | "account_delete_email_verified"
  | "account_delete_email_verify_failed"
  | "account_delete_scheduled"
  | "account_delete_cancelled"
  | "account_delete_finalized"
  | "account_delete_blocked"
  | "magic_link_sent"
  | "magic_link_email_failed"
  | "magic_link_used"
  | "magic_link_failed"
  | "magic_link_context_mismatch"
  | "magic_prepare_started"
  | "magic_prepare_replaced"
  | "magic_bind_confirmed"
  | "magic_nonce_mismatch"
  | "magic_context_medium_risk"
  | "magic_context_high_risk"
  | "magic_consume_success"
  | "magic_consume_replay_blocked"
  | "magic_email_otp_exhausted"
  | "rate_limit_exceeded"
  | "ip_mismatch"
  | "step_up_required"
  | "step_up_success"
  | "maintenance_cleanup"
  | "email_change_requested"
  | "email_change_completed"
  | "email_change_failed"
  | "totp_setup_started"
  | "totp_enabled"
  | "totp_verified"
  | "totp_disabled"
  | "totp_failed";

type AuditEventStatus = "success" | "failure" | "warning";

async function logAuditEvent(
  env: Env,
  event: {
    userId?: string | null;
    eventType: AuditEventType;
    status: AuditEventStatus;
    details?: Record<string, unknown>;
    ip?: string | null;
    userAgent?: string | null;
  }
): Promise<void> {
  if (!env.AUTH_DB) return;

  try {
    const detailsJson = event.details ? JSON.stringify(event.details) : null;
    await env.AUTH_DB.prepare(
      "INSERT INTO audit_log (id, user_id, event_type, event_status, details, ip, user_agent, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    )
      .bind(
        crypto.randomUUID(),
        event.userId || null,
        event.eventType,
        event.status,
        detailsJson,
        event.ip || null,
        event.userAgent || null,
        new Date().toISOString()
      )
      .run();
  } catch (error) {
    // Log audit failures to console but don't throw - audit logging should never break auth flow
    console.error("[AUDIT] Failed to log event:", error);
  }
}

/** Non-blocking: counts failed recovery consumes per user in KV for distributed-guess visibility. */
async function recordRecoveryConsumeAccountGuessTelemetry(
  env: Env,
  kv: KVNamespace | undefined,
  userId: string,
  request: Request,
  reason: "invalid_code" | "code_race",
): Promise<void> {
  if (!kv) return;
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - (now % RECOVERY_CONSUME_ACCOUNT_TELEMETRY.WINDOW_SECONDS);
  const key = `${RECOVERY_CONSUME_ACCOUNT_TELEMETRY.KEY_PREFIX}${userId}`;
  try {
    const stored = (await kv.get(key, { type: "json" })) as { count?: number; windowStart?: number } | null;
    let count = 1;
    if (stored && stored.windowStart === windowStart) {
      count = (stored.count || 0) + 1;
    }
    await kv.put(key, JSON.stringify({ count, windowStart }), {
      expirationTtl: RECOVERY_CONSUME_ACCOUNT_TELEMETRY.WINDOW_SECONDS + 120,
    });

    if (count === RECOVERY_CONSUME_ACCOUNT_TELEMETRY.WARN_THRESHOLD) {
      console.warn(
        `[RECOVERY_TELEM_WARN] recovery_consume failures for user_id=${userId} count=${count} in ${RECOVERY_CONSUME_ACCOUNT_TELEMETRY.WINDOW_SECONDS}s window; possible distributed guessing`,
      );
    }

    const alertAt = RECOVERY_CONSUME_ACCOUNT_TELEMETRY.ALERT_THRESHOLD;
    if (count >= alertAt && (count === alertAt || (count - alertAt) % 40 === 0)) {
      console.error(
        `[RECOVERY_TELEM_ALERT] recovery_consume failure spike user_id=${userId} count=${count} reason=${reason}`,
      );
      await logAuditEvent(env, {
        userId,
        eventType: "recovery_consume_guess_spike",
        status: "warning",
        details: {
          count,
          windowSeconds: RECOVERY_CONSUME_ACCOUNT_TELEMETRY.WINDOW_SECONDS,
          reason,
        },
        ip: getRequestIp(request),
        userAgent: request.headers.get("User-Agent"),
      });
    }
  } catch (e) {
    console.error("[RECOVERY_TELEM] telemetry KV error:", e);
  }
}

function getAuthKv(env: Env): KVNamespace | null {
  return env.AUTH_KV || env.NOTES_KV || null;
}

async function storeAuthChallenge(env: Env, key: string, payload: Record<string, unknown>) {
  const kv = getAuthKv(env);
  if (!kv) return false;
  await kv.put(`${AUTH_CHALLENGE.PREFIX}${key}`, JSON.stringify(payload), {
    expirationTtl: AUTH_CHALLENGE.TTL_SECONDS,
  });
  return true;
}

async function consumeAuthChallenge(env: Env, key: string): Promise<Record<string, unknown> | null> {
  const kv = getAuthKv(env);
  if (!kv) return null;
  const value = await kv.get(`${AUTH_CHALLENGE.PREFIX}${key}`);
  if (!value) return null;
  await kv.delete(`${AUTH_CHALLENGE.PREFIX}${key}`);
  try {
    return JSON.parse(value) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function magicLinkHmacConfigured(env: Env): boolean {
  return typeof env.AUTH_SECRET_KEY === "string" && env.AUTH_SECRET_KEY.length > 0;
}

/**
 * Unsigned magic KV entries are allowed only in deliberate dev mode or when the Worker request targets localhost.
 * Deployed hosts (pages, workers.dev, production domain) require AUTH_SECRET_KEY and HMAC on all new tokens.
 */
function isMagicLinkIntegrityRelaxed(env: Env, request?: Request): boolean {
  const v = env.AUTH_ALLOW_UNSIGNED_MAGIC_LINK?.toLowerCase();
  if (v === "1" || v === "true") return true;
  if (request) {
    try {
      const host = new URL(request.url).hostname;
      if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
    } catch {
      /* ignore */
    }
  }
  return false;
}

/**
 * HMAC-SHA256 over token + payload JSON. Returns null when AUTH_SECRET_KEY is unset (store/prepare must not use unsigned paths unless relaxed).
 */
async function signMagicLinkToken(env: Env, token: string, payload: Record<string, unknown>): Promise<string | null> {
  if (!magicLinkHmacConfigured(env)) {
    return null;
  }
  const message = `${token}:${JSON.stringify(payload)}`;
  const keyData = new TextEncoder().encode(env.AUTH_SECRET_KEY!);
  const messageData = new TextEncoder().encode(message);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", cryptoKey, messageData);
  return base64UrlEncode(new Uint8Array(signature));
}

async function verifyMagicLinkToken(
  env: Env,
  token: string,
  payload: Record<string, unknown>,
  signature: string
): Promise<boolean> {
  if (!magicLinkHmacConfigured(env)) {
    return false;
  }
  const expectedSignature = await signMagicLinkToken(env, token, payload);
  if (!expectedSignature) return false;
  return constantTimeEquals(expectedSignature, signature);
}

type StoreMagicLinkResult = { ok: true } | { ok: false; reason: "kv_unavailable" | "hmac_required" };

async function storeMagicLink(
  env: Env,
  token: string,
  payload: Record<string, unknown>,
  request: Request,
): Promise<StoreMagicLinkResult> {
  const kv = getAuthKv(env);
  if (!kv) return { ok: false, reason: "kv_unavailable" };
  const relaxed = isMagicLinkIntegrityRelaxed(env, request);
  if (!relaxed && !magicLinkHmacConfigured(env)) {
    console.error(
      "[Auth] Magic links require AUTH_SECRET_KEY. Set the secret in production, or use wrangler dev against localhost / AUTH_ALLOW_UNSIGNED_MAGIC_LINK=1 for local-only testing.",
    );
    return { ok: false, reason: "hmac_required" };
  }
  const signature = await signMagicLinkToken(env, token, payload);
  if (!relaxed && !signature) {
    return { ok: false, reason: "hmac_required" };
  }
  const storedPayload = signature ? { ...payload, _hmac: signature } : payload;
  const tokenHash = await sha256Base64Url(token);
  await kv.put(`${AUTH_MAGIC_LINK.PREFIX}${tokenHash}`, JSON.stringify(storedPayload), {
    expirationTtl: AUTH_MAGIC_LINK.TTL_SECONDS,
  });
  return { ok: true };
}

/** Admin/deploy diagnostics: mirrors magic/send prerequisites without exposing secrets. */
export function getMagicLinkIssuanceDiagnostics(env: Env, request: Request): {
  authDb: boolean;
  authKv: boolean;
  hmacConfigured: boolean;
  integrityRelaxed: boolean;
  storageReady: boolean;
  emailReady: boolean;
  /** When true, magic/send drops requests without a valid turnstileToken (silent 200); Resend is never called. */
  turnstileSecretConfigured: boolean;
  endToEndReady: boolean;
} {
  const relaxed = isMagicLinkIntegrityRelaxed(env, request);
  const kv = getAuthKv(env);
  const hmac = magicLinkHmacConfigured(env);
  const storageReady = Boolean(env.AUTH_DB && kv && (relaxed || hmac));
  let isLocal = false;
  try {
    const host = new URL(request.url).hostname;
    isLocal = host === "localhost" || host === "127.0.0.1" || host === "[::1]";
  } catch {
    /* ignore */
  }
  const resendOk =
    env.AUTH_EMAIL_PROVIDER?.toLowerCase() === "resend" &&
    typeof env.RESEND_API_KEY === "string" &&
    env.RESEND_API_KEY.length > 0 &&
    typeof env.AUTH_EMAIL_FROM === "string" &&
    env.AUTH_EMAIL_FROM.length > 0;
  const emailReady = isLocal || resendOk;
  const turnstileSecretConfigured =
    typeof env.TURNSTILE_SECRET_KEY === "string" && env.TURNSTILE_SECRET_KEY.length > 0;
  return {
    authDb: Boolean(env.AUTH_DB),
    authKv: Boolean(kv),
    hmacConfigured: hmac,
    integrityRelaxed: relaxed,
    storageReady,
    emailReady,
    turnstileSecretConfigured,
    endToEndReady: storageReady && emailReady,
  };
}

async function parseMagicLinkKvValue(
  env: Env,
  token: string,
  raw: string,
  request?: Request,
): Promise<Record<string, unknown> | null> {
  try {
    const payload = JSON.parse(raw) as Record<string, unknown>;
    const relaxed = isMagicLinkIntegrityRelaxed(env, request);

    if (payload._hmac && typeof payload._hmac === "string") {
      const signature = payload._hmac as string;
      const { _hmac, ...payloadWithoutHmac } = payload;
      const isValid = await verifyMagicLinkToken(env, token, payloadWithoutHmac, signature);
      if (!isValid) {
        console.warn("[Auth] Magic link token HMAC verification failed");
        return null;
      }
      return payloadWithoutHmac;
    }

    if (!relaxed) {
      console.warn("[Auth] Rejected unsigned magic link KV entry (HMAC required in non-relaxed environments).");
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

async function peekMagicLink(env: Env, token: string, request?: Request): Promise<Record<string, unknown> | null> {
  const kv = getAuthKv(env);
  if (!kv) return null;
  const tokenHash = await sha256Base64Url(token);
  const key = `${AUTH_MAGIC_LINK.PREFIX}${tokenHash}`;
  const value = await kv.get(key);
  if (!value) return null;
  return parseMagicLinkKvValue(env, token, value, request);
}

async function consumeMagicLink(
  env: Env,
  token: string,
  request?: Request,
): Promise<Record<string, unknown> | null> {
  const kv = getAuthKv(env);
  if (!kv) return null;
  const tokenHash = await sha256Base64Url(token);
  const key = `${AUTH_MAGIC_LINK.PREFIX}${tokenHash}`;
  const value = await kv.get(key);
  if (!value) return null;
  const parsed = await parseMagicLinkKvValue(env, token, value, request);
  if (!parsed) return null;
  await kv.delete(key);
  return parsed;
}

type MagicPrepareKvRecord = {
  tokenHash: string;
  issuedAt: number;
  /** Unix seconds; KV `expiration` is set to this so OTP retries do not extend TTL. Legacy records omit this. */
  expiresAtSec?: number;
  stage: "prepared";
  risk: "low" | "medium";
  otpHash?: string;
  /** Issued from the original email-submit tab; token alone must not complete sign-in. */
  requireOtp?: boolean;
  /** Remaining wrong-code attempts for medium-risk OTP gate; omitted for low risk. */
  otpAttemptsRemaining?: number;
};

function magicPrepareExpiresAtSec(rec: MagicPrepareKvRecord): number {
  if (typeof rec.expiresAtSec === "number" && Number.isFinite(rec.expiresAtSec)) {
    return Math.floor(rec.expiresAtSec);
  }
  return Math.floor(rec.issuedAt / 1000) + AUTH_MAGIC_PREPARE.TTL_SECONDS;
}

async function persistMagicPrepareRecord(env: Env, nonceKey: string, record: MagicPrepareKvRecord): Promise<void> {
  const kv = getAuthKv(env);
  if (!kv) return;
  const exp = magicPrepareExpiresAtSec(record);
  await kv.put(nonceKey, JSON.stringify(record), { expiration: exp });
}

async function issueMagicPrepareNonce(
  env: Env,
  request: Request,
  token: string,
  record: Pick<MagicPrepareKvRecord, "risk" | "otpHash" | "requireOtp">,
  userIdForAudit: string | null,
): Promise<string | null> {
  const kv = getAuthKv(env);
  if (!kv) return null;
  const tokenHash = await sha256Base64Url(token);
  const indexKey = `${AUTH_MAGIC_PREPARE.TOKEN_INDEX_PREFIX}${tokenHash}`;
  const oldNonceKey = await kv.get(indexKey);
  if (oldNonceKey) {
    await kv.delete(oldNonceKey);
    await logAuditEvent(env, {
      userId: userIdForAudit,
      eventType: "magic_prepare_replaced",
      status: "warning",
      details: { reason: "new_prepare_for_same_token" },
      ip: getRequestIp(request),
      userAgent: request.headers.get("User-Agent"),
    });
  }

  const nonce = randomId(32);
  const nonceKey = `${AUTH_MAGIC_PREPARE.PREFIX}${await sha256Base64Url(nonce)}`;
  const issuedAt = Date.now();
  const expiresAtSec = Math.floor(issuedAt / 1000) + AUTH_MAGIC_PREPARE.TTL_SECONDS;
  const full: MagicPrepareKvRecord = {
    tokenHash,
    issuedAt,
    expiresAtSec,
    stage: "prepared",
    risk: record.risk,
    ...(record.requireOtp ? { requireOtp: true } : {}),
    ...(record.otpHash
      ? { otpHash: record.otpHash, otpAttemptsRemaining: AUTH_MAGIC_PREPARE.EMAIL_OTP_MAX_ATTEMPTS }
      : {}),
  };
  await kv.put(nonceKey, JSON.stringify(full), { expiration: expiresAtSec });
  await kv.put(indexKey, nonceKey, { expiration: expiresAtSec });
  return nonce;
}

async function deleteMagicPrepareState(env: Env, nonceKey: string, tokenHash: string): Promise<void> {
  const kv = getAuthKv(env);
  if (!kv) return;
  await kv.delete(nonceKey);
  await kv.delete(`${AUTH_MAGIC_PREPARE.TOKEN_INDEX_PREFIX}${tokenHash}`);
}

async function verifyMagicPrepareNonceForConsume(
  env: Env,
  request: Request,
  token: string,
): Promise<
  | { ok: true; nonceKey: string; record: MagicPrepareKvRecord }
  | { ok: false; reason: string }
> {
  const cookies = parseCookies(request.headers.get("Cookie"));
  const nonce = cookies[MAGIC_PREPARE_COOKIE];
  if (!nonce?.length) return { ok: false, reason: "missing_cookie" };
  const kv = getAuthKv(env);
  if (!kv) return { ok: false, reason: "kv_unavailable" };
  const nonceKey = `${AUTH_MAGIC_PREPARE.PREFIX}${await sha256Base64Url(nonce)}`;
  const raw = await kv.get(nonceKey);
  if (!raw) return { ok: false, reason: "nonce_unknown_or_used" };
  try {
    const rec = JSON.parse(raw) as MagicPrepareKvRecord;
    const expected = await sha256Base64Url(token);
    if (typeof rec.tokenHash !== "string" || rec.tokenHash !== expected) {
      return { ok: false, reason: "token_hash_mismatch" };
    }
    if (rec.stage !== "prepared") return { ok: false, reason: "invalid_stage" };
    const nowSec = Math.floor(Date.now() / 1000);
    if (typeof rec.issuedAt !== "number" || nowSec > magicPrepareExpiresAtSec(rec)) {
      return { ok: false, reason: "nonce_expired" };
    }
    if ((rec.risk === "medium" || rec.requireOtp === true) && typeof rec.otpHash !== "string") {
      return { ok: false, reason: "missing_otp_in_record" };
    }
    return { ok: true, nonceKey, record: rec };
  } catch {
    return { ok: false, reason: "parse_error" };
  }
}

/**
 * Universal same-browser bind: always issues short-lived single-use prepare state (cookie + KV).
 * Session is never created here — only POST /api/auth/magic/consume can create a session.
 * Medium context risk: emails a 6-digit code; consume must supply it.
 */
async function respondToMagicLinkPrepare(env: Env, request: Request, token: string): Promise<Response> {
  await logAuditEvent(env, {
    userId: null,
    eventType: "magic_prepare_started",
    status: "success",
    details: {},
    ip: getRequestIp(request),
    userAgent: request.headers.get("User-Agent"),
  });

  const payload = await peekMagicLink(env, token, request);
  if (!payload) {
    await logAuditEvent(env, {
      userId: null,
      eventType: "magic_link_failed",
      status: "failure",
      details: { reason: "prepare_token_invalid_or_expired" },
      ip: getRequestIp(request),
      userAgent: request.headers.get("User-Agent"),
    });
    return jsonResponse({ message: "Token expired or invalid" }, 400, request);
  }

  const policy = await evaluateMagicLinkContextPolicy(payload, request);
  const userIdForAudit = typeof payload.userId === "string" ? payload.userId : null;

  if (policy.risk === "high") {
    await logAuditEvent(env, {
      userId: userIdForAudit,
      eventType: "magic_context_high_risk",
      status: "failure",
      details: {
        ipDrift: policy.ipDrift,
        uaDrift: policy.uaDrift,
        automationLikely: policy.automationLikely,
      },
      ip: getRequestIp(request),
      userAgent: request.headers.get("User-Agent"),
    });
    const headers = new Headers(getCorsHeaders(request));
    headers.set("Content-Type", "application/json");
    headers.set("Referrer-Policy", "no-referrer");
    headers.set("Cache-Control", "no-store");
    headers.append("Set-Cookie", clearMagicPrepareCookieHeader());
    appendPnClientIdIfMissing(request, headers);
    return new Response(
      JSON.stringify({
        message:
          "This sign-in link can't be verified from this device or network. Request a new link from the sign-in page.",
        code: "context_high_risk",
      }),
      { status: 403, headers },
    );
  }

  const storedOtpHash = typeof payload.otpHash === "string" ? payload.otpHash : undefined;

  if (policy.risk === "medium") {
    await logAuditEvent(env, {
      userId: userIdForAudit,
      eventType: "magic_context_medium_risk",
      status: "warning",
      details: {
        ipSoftMismatch: policy.ipDrift,
        uaSoftMismatch: policy.uaDrift,
        emailOtpRequired: true,
        otpFromInitialEmail: true,
      },
      ip: getRequestIp(request),
      userAgent: request.headers.get("User-Agent"),
    });
  }

  if (!storedOtpHash) {
    return jsonResponse({ message: "Invalid link data" }, 400, request);
  }
  const otpHash = storedOtpHash;

  const nonce = await issueMagicPrepareNonce(
    env,
    request,
    token,
    {
      risk: policy.risk === "medium" ? "medium" : "low",
      ...(otpHash ? { otpHash } : {}),
    },
    userIdForAudit,
  );
  if (!nonce) {
    return jsonResponse({ message: "Could not start sign-in" }, 500, request);
  }

  await logAuditEvent(env, {
    userId: userIdForAudit,
    eventType: "magic_bind_confirmed",
    status: "success",
    details: { risk: policy.risk, browserBindIssued: true },
    ip: getRequestIp(request),
    userAgent: request.headers.get("User-Agent"),
  });

  const headers = new Headers(getCorsHeaders(request));
  headers.set("Content-Type", "application/json");
  headers.set("Referrer-Policy", "no-referrer");
  headers.set("Cache-Control", "no-store");
  headers.append("Set-Cookie", magicPrepareCookieHeader(nonce));
  appendPnClientIdIfMissing(request, headers);
  return new Response(
    JSON.stringify({
      ok: true,
      riskLevel: policy.risk,
      emailCodeRequired: policy.risk === "medium",
      oneTapAllowed: policy.risk !== "medium",
    }),
    { status: 200, headers },
  );
}

/**
 * Finish sign-in after a valid magic-link token (session cookie + side effects).
 * Caller must obtain `token` only from a POST body — not query strings (avoids prefetch /Referer leakage).
 * Requires prior POST /api/auth/magic/prepare in the same browser and trusted Origin.
 */
async function respondToMagicLinkConsume(
  env: Env,
  request: Request,
  token: string,
  emailCode: unknown,
): Promise<Response> {
  const bindCheck = await verifyMagicPrepareNonceForConsume(env, request, token);
  if (!bindCheck.ok) {
    await logAuditEvent(env, {
      userId: null,
      eventType: "magic_nonce_mismatch",
      status: "failure",
      details: { reason: bindCheck.reason },
      ip: getRequestIp(request),
      userAgent: request.headers.get("User-Agent"),
    });
    return jsonResponse(
      {
        message:
          "Sign-in confirmation missing or expired. Open your email link again, wait for this page to load, then press Continue.",
        code: "magic_bind_required",
      },
      400,
      request,
    );
  }

  const { nonceKey, record } = bindCheck;

  const normalizedOtp = normalizeMagicEmailCode(emailCode);
  const otpRequired = (record.requireOtp === true || record.risk === "medium") && !!record.otpHash;
  const otpVerify = !!record.otpHash && (otpRequired || !!normalizedOtp);

  if (otpRequired && !normalizedOtp) {
    return jsonResponse(
      {
        message: "Enter the 6-digit code we emailed you.",
        code: "magic_email_code_required",
      },
      400,
      request,
    );
  }

  if (otpVerify && record.otpHash) {
    const gotHash = await sha256Base64Url(normalizedOtp!);
    if (!constantTimeEquals(gotHash, record.otpHash)) {
      const cap = AUTH_MAGIC_PREPARE.EMAIL_OTP_MAX_ATTEMPTS;
      let remaining =
        typeof record.otpAttemptsRemaining === "number" && Number.isFinite(record.otpAttemptsRemaining)
          ? Math.min(cap, Math.max(0, Math.floor(record.otpAttemptsRemaining)))
          : cap;
      remaining -= 1;

      if (remaining <= 0) {
        await deleteMagicPrepareState(env, nonceKey, record.tokenHash);
        await logAuditEvent(env, {
          userId: null,
          eventType: "magic_email_otp_exhausted",
          status: "failure",
          details: { reason: "email_otp_attempts_exhausted" },
          ip: getRequestIp(request),
          userAgent: request.headers.get("User-Agent"),
        });
        const headers = new Headers(getCorsHeaders(request));
        headers.set("Content-Type", "application/json");
        headers.set("Referrer-Policy", "no-referrer");
        headers.set("Cache-Control", "no-store");
        headers.append("Set-Cookie", clearMagicPrepareCookieHeader());
        appendPnClientIdIfMissing(request, headers);
        return new Response(
          JSON.stringify({
            message:
              "Too many incorrect codes. Open the sign-in link from your email again to request a fresh code.",
            code: "magic_email_otp_exhausted",
          }),
          { status: 400, headers },
        );
      }

      const updated: MagicPrepareKvRecord = { ...record, otpAttemptsRemaining: remaining };
      await persistMagicPrepareRecord(env, nonceKey, updated);

      await logAuditEvent(env, {
        userId: null,
        eventType: "magic_link_failed",
        status: "failure",
        details: { reason: "magic_email_code_invalid", otpAttemptsRemaining: remaining },
        ip: getRequestIp(request),
        userAgent: request.headers.get("User-Agent"),
      });
      return jsonResponse(
        {
          message: "That code doesn’t match. Check your email and try again.",
          code: "magic_email_code_invalid",
        },
        400,
        request,
      );
    }
  }

  const payload = await consumeMagicLink(env, token, request);
  await deleteMagicPrepareState(env, nonceKey, record.tokenHash);

  if (!payload) {
    await logAuditEvent(env, {
      userId: null,
      eventType: "magic_consume_replay_blocked",
      status: "failure",
      details: { reason: "token_invalid_or_already_used" },
      ip: getRequestIp(request),
      userAgent: request.headers.get("User-Agent"),
    });
    await logAuditEvent(env, {
      userId: null,
      eventType: "magic_link_failed",
      status: "failure",
      details: { reason: "token_invalid_or_expired" },
      ip: getRequestIp(request),
      userAgent: request.headers.get("User-Agent"),
    });
    return jsonResponse({ message: "Token expired or invalid" }, 400, request);
  }
  if (!env.AUTH_DB) {
    return jsonResponse({ message: "Auth database not configured" }, 501, request);
  }
  const payloadEmail = normalizeEmail(typeof payload.email === "string" ? payload.email : null);
  let userId: string | null = typeof payload.userId === "string" ? payload.userId : null;

  if (!userId && payloadEmail) {
    const userResult = await getOrCreateUser(env, payloadEmail, USER_STATUS_PENDING);
    userId = userResult?.id ?? null;
  }
  if (!userId) {
    return jsonResponse({ message: "User creation failed" }, 500, request);
  }

  await logMagicLinkContextDriftIfAny(env, request, payload, userId);

  const nowIso = new Date().toISOString();
  await env.AUTH_DB.prepare(
    "UPDATE users SET status = ?, email_verified = 1, updated_at = ?, last_login_at = ? WHERE id = ?"
  )
    .bind(USER_STATUS_ACTIVE, nowIso, nowIso, userId)
    .run();

  const session = await createSession(env, userId, request, "magic");

  let totpRequired = false;
  const totpCheck = await env.AUTH_DB.prepare(
    "SELECT verified FROM totp_secrets WHERE user_id = ? AND verified = 1 LIMIT 1"
  )
    .bind(userId)
    .first<{ verified: number }>();
  if (totpCheck?.verified === 1 && session?.sessionId) {
    const pendingHash = await sha256Base64Url(session.sessionId);
    const pendingUntil = new Date(
      Date.now() + SESSION_POLICY.PENDING_TOTP_SESSION_TTL_SECONDS * 1000,
    ).toISOString();
    await env.AUTH_DB.prepare(
      "UPDATE sessions SET auth_complete = 0, expires_at = ?, absolute_expires_at = ? WHERE session_id_hash = ?",
    )
      .bind(pendingUntil, pendingUntil, pendingHash)
      .run();
    totpRequired = true;
  }

  await logAuditEvent(env, {
    userId,
    eventType: "magic_link_used",
    status: "success",
    details: { intent: payload.intent },
    ip: getRequestIp(request),
    userAgent: request.headers.get("User-Agent"),
  });

  await logAuditEvent(env, {
    userId,
    eventType: "login_success",
    status: "success",
    details: { authMethod: "magic_link", intent: payload.intent, totpRequired },
    ip: getRequestIp(request),
    userAgent: request.headers.get("User-Agent"),
  });

  await logAuditEvent(env, {
    userId,
    eventType: "magic_consume_success",
    status: "success",
    details: { intent: payload.intent, totpRequired, prepareRisk: record.risk },
    ip: getRequestIp(request),
    userAgent: request.headers.get("User-Agent"),
  });

  const headers = new Headers(getCorsHeaders(request));
  headers.set("Content-Type", "application/json");
  headers.set("Referrer-Policy", "no-referrer");
  headers.set("Cache-Control", "no-store");
  if (session?.sessionId) {
    const cookieMaxAge = totpRequired
      ? SESSION_POLICY.PENDING_TOTP_SESSION_TTL_SECONDS
      : SESSION_POLICY.TTL_SECONDS;
    headers.append(
      "Set-Cookie",
      sessionCookie(session.sessionId, getSessionCookieKindForRequest(request), cookieMaxAge),
    );
  }
  headers.append("Set-Cookie", clearMagicPrepareCookieHeader());
  return new Response(JSON.stringify({ ok: true, totpRequired }), { status: 200, headers });
}

type AuthMethod = "magic" | "passkey" | "recovery";

/** Requires D1 `sessions.client_bucket` (see `scripts/safe-d1-migrate-auth.sh`). */
async function createSession(
  env: Env,
  userId: string,
  request: Request,
  authMethod: AuthMethod,
  opts: {
    authComplete?: boolean;
    /**
     * When set (including `null`), use this for `last_auth_at` instead of `now`.
     * Session rotation must pass the revoked row's value so GET traffic does not
     * refresh "recent sign-in" for first-passkey enrollment (10‑minute window).
     */
    lastAuthAtOverride?: string | null;
  } = {},
): Promise<{ sessionId: string } | null> {
  if (!env.AUTH_DB) return null;
  const now = Date.now();
  const nowIso = new Date(now).toISOString();
  const userAgent = request.headers.get("User-Agent") || "";
  const deviceLabel = getDeviceLabel(userAgent);
  const clientBucket = getClientIdentifier(request);
  await env.AUTH_DB.prepare(
    "UPDATE sessions SET revoked_at = ?, revoked_reason = ? WHERE user_id = ? AND revoked_at IS NULL AND (client_bucket = ? OR (client_bucket IS NULL AND user_agent = ?))"
  )
    .bind(nowIso, "superseded", userId, clientBucket, userAgent)
    .run();
  const sessionId = randomId(32);
  const sessionHash = await sha256Base64Url(sessionId);
  const id = crypto.randomUUID();
  const expiresAt = new Date(now + 1000 * SESSION_POLICY.TTL_SECONDS).toISOString();
  const absoluteExpiresAt = new Date(now + 1000 * SESSION_POLICY.ABSOLUTE_TTL_SECONDS).toISOString();
  const ip = getRequestIp(request);
  const { city, country } = getRequestGeo(request);
  // Passkey and recovery-code sign-in both count as strong verification for step-up-gated actions
  // (e.g. reset passkeys). Magic-link sessions stay without step-up until the user proves passkey/TOTP.
  const lastStepUpAt = authMethod === "passkey" || authMethod === "recovery" ? nowIso : null;
  // Preserve the caller's auth_complete flag; default to 1 (fully authenticated) only for
  // complete sign-in flows. Rotation must pass the original value so pending-TOTP sessions
  // are not silently promoted to fully authenticated.
  const authCompleteValue = opts.authComplete === false ? 0 : 1;
  const lastAuthAtForInsert =
    opts.lastAuthAtOverride !== undefined ? opts.lastAuthAtOverride : nowIso;
  await env.AUTH_DB.prepare(
    "INSERT INTO sessions (id, session_id_hash, user_id, expires_at, absolute_expires_at, created_at, last_seen_at, last_auth_at, last_stepup_at, user_agent, ip, city, country, device_label, client_bucket, auth_complete) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  )
    .bind(
      id,
      sessionHash,
      userId,
      expiresAt,
      absoluteExpiresAt,
      nowIso,
      nowIso,
      lastAuthAtForInsert,
      lastStepUpAt,
      userAgent,
      ip,
      city,
      country,
      deviceLabel,
      clientBucket,
      authCompleteValue,
    )
    .run();

  // Audit log: session created
  await logAuditEvent(env, {
    userId,
    eventType: "session_created",
    status: "success",
    details: { authMethod, sessionId: id, city, country },
    ip,
    userAgent,
  });

  return { sessionId };
}

function sessionCookie(
  sessionId: string,
  kind: SessionCookieKind,
  maxAgeSeconds: number = SESSION_POLICY.TTL_SECONDS,
): string {
  // SameSite=None required for cross-origin requests (frontend on Pages, API on Workers)
  const name = sessionCookieNameForKind(kind);
  return `${name}=${sessionId}; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=${maxAgeSeconds}`;
}

function clearSessionCookieHeader(kind: SessionCookieKind): string {
  const name = sessionCookieNameForKind(kind);
  return `${name}=; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=0`;
}

function applyRotatedSession(
  request: Request,
  headers: Headers,
  session: { newSessionId?: string } | null,
) {
  if (session?.newSessionId) {
    // Use append so we don't overwrite any existing Set-Cookie header(s)
    headers.append("Set-Cookie", sessionCookie(session.newSessionId, getSessionCookieKindForRequest(request)));
  }
}

function isStepUpFresh(lastStepUpAt: string | null, windowSeconds: number = STEP_UP_WINDOW_SECONDS): boolean {
  if (!lastStepUpAt) return false;
  const last = new Date(lastStepUpAt).getTime();
  return Date.now() - last <= windowSeconds * 1000;
}

function isRecentAuthFresh(
  lastAuthAt: string | null,
  windowSeconds: number = PASSKEY_FIRST_ENROLL_AUTH_WINDOW_SECONDS,
): boolean {
  if (!lastAuthAt) return false;
  const last = new Date(lastAuthAt).getTime();
  return Date.now() - last <= windowSeconds * 1000;
}

/** Require recent WebAuthn step-up if the user already has passkeys; otherwise a fresh sign-in (last_auth_at). */
async function requirePasskeyEnrollmentProof(
  env: Env,
  request: Request,
  session: { id: string; lastAuthAt: string | null; lastStepUpAt: string | null },
): Promise<Response | null> {
  if (!env.AUTH_DB) {
    return jsonResponse({ message: "Auth database not configured" }, 501, request);
  }
  const usablePasskeyCount = await countUsableWebauthnCredentialsForUser(env, session.id);
  const hasExistingPasskeys = usablePasskeyCount > 0;

  if (hasExistingPasskeys) {
    if (!isStepUpFresh(session.lastStepUpAt)) {
      return jsonResponse(
        {
          message: "Verify with your passkey before adding a new one.",
          code: "passkey_enroll_step_up_required",
        },
        403,
        request,
      );
    }
  } else if (!isRecentAuthFresh(session.lastAuthAt)) {
    return jsonResponse(
      {
        message:
          "Your sign-in is too old to add a passkey. Sign out, sign in again, and try within a few minutes.",
        code: "passkey_enroll_reauth_required",
      },
      403,
      request,
    );
  }
  return null;
}

/**
 * Registration verify: re-check only first-enrollment “fresh sign-in” bound; step-up is checked at
 * /register/options only so a long WebAuthn ceremony cannot expire the 5-minute step-up window
 * before verify runs (challenge TTL still caps total time).
 */
async function requirePasskeyEnrollmentProofAtRegisterVerify(
  env: Env,
  request: Request,
  session: { id: string; lastAuthAt: string | null; lastStepUpAt: string | null },
): Promise<Response | null> {
  if (!env.AUTH_DB) {
    return jsonResponse({ message: "Auth database not configured" }, 501, request);
  }
  const usablePasskeyCount = await countUsableWebauthnCredentialsForUser(env, session.id);
  const hasExistingPasskeys = usablePasskeyCount > 0;
  if (!hasExistingPasskeys && !isRecentAuthFresh(session.lastAuthAt)) {
    return jsonResponse(
      {
        message:
          "Your sign-in is too old to add a passkey. Sign out, sign in again, and try within a few minutes.",
        code: "passkey_enroll_reauth_required",
      },
      403,
      request,
    );
  }
  return null;
}

function parseCookies(header: string | null): Record<string, string> {
  if (!header) return {};
  return header.split(";").reduce((acc, part) => {
    const [key, ...rest] = part.trim().split("=");
    if (!key) return acc;
    acc[key] = decodeURIComponent(rest.join("="));
    return acc;
  }, {} as Record<string, string>);
}

function appendPnClientIdIfMissing(request: Request, headers: Headers): void {
  const cookieHeader = request.headers.get("Cookie") || "";
  if (/(?:^|;\s*)pn_client_id=/.test(cookieHeader)) return;
  const clientId = randomId(16);
  const maxAge = 30 * 24 * 60 * 60;
  headers.append(
    "Set-Cookie",
    `pn_client_id=${clientId}; Path=/; Max-Age=${maxAge}; SameSite=Lax; Secure; HttpOnly`,
  );
}

/**
 * Revoke all sessions for a user (for security events like password change, etc.)
 */
async function revokeAllUserSessions(
  env: Env,
  userId: string,
  reason: string = "security_event"
): Promise<void> {
  if (!env.AUTH_DB) return;
  await env.AUTH_DB.prepare(
    "UPDATE sessions SET revoked_at = ?, revoked_reason = ? WHERE user_id = ? AND revoked_at IS NULL"
  )
    .bind(new Date().toISOString(), reason, userId)
    .run();

  // Audit log: sessions revoked
  await logAuditEvent(env, {
    userId,
    eventType: "session_revoked",
    status: "success",
    details: { reason, revokeType: "all_sessions" },
  });
}

async function schedulePendingAccountDeletion(
  env: Env,
  request: Request,
  user: { id: string; email: string | null },
): Promise<{ ok: true } | { ok: false; response: Response }> {
  if (!env.AUTH_DB) return { ok: false, response: jsonResponse({ message: "Auth database not configured" }, 501, request) };
  const userEmail = (user.email ?? "").trim().toLowerCase();
  if (!userEmail) {
    return { ok: false, response: jsonResponse({ message: "No verified email on file" }, 400, request) };
  }

  const cancelToken = randomId(32);
  const cancelTokenHash = await sha256Base64Url(cancelToken);
  const requestedAt = new Date();
  const deleteAfterAt = new Date(requestedAt.getTime() + ACCOUNT_DELETE_PENDING.DELAY_SECONDS * 1000);
  const pendingId = crypto.randomUUID();
  const userAgent = request.headers.get("User-Agent");
  const requestIp = getRequestIp(request);
  const webOrigin = getMagicLinkOrigin(env, request);
  const cancelUrl = `${webOrigin}/api/auth/account/delete/cancel?token=${encodeURIComponent(cancelToken)}`;

  const emailResult = await sendEmail(env, {
    to: userEmail,
    subject: "Account deletion scheduled (48 hours) - PrivateNote",
    text:
      `Your PrivateNote account deletion was requested using a backup email verification method.\n\n` +
      `Your account is scheduled for permanent deletion in 48 hours.\n\n` +
      `If this was not you, cancel deletion now:\n${cancelUrl}\n\n` +
      `If you do nothing, deletion will complete automatically after the waiting period.`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Account deletion scheduled</h2>
        <p>Your PrivateNote account deletion was requested using a <strong>backup email verification method</strong>.</p>
        <p>Your account is scheduled for permanent deletion in <strong>48 hours</strong>.</p>
        <p>If this was not you, cancel deletion immediately:</p>
        <p style="margin: 24px 0;">
          <a href="${cancelUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">
            Review cancellation
          </a>
        </p>
      </div>
    `,
  });
  if (!emailResult.ok) {
    console.error("[AUTH] Failed to send pending account deletion email:", emailResult.error);
    return {
      ok: false,
      response: jsonResponse(
        { message: "Could not send the cancellation email. Please try again later." },
        502,
        request,
      ),
    };
  }

  await env.AUTH_DB.prepare(
    `INSERT INTO pending_account_deletions
      (id, user_id, requested_at, delete_after_at, cancel_token_hash, verification_method, cancelled_at, cancelled_reason, created_ip, created_user_agent)
     VALUES (?, ?, ?, ?, ?, ?, NULL, NULL, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET
       requested_at = excluded.requested_at,
       delete_after_at = excluded.delete_after_at,
       cancel_token_hash = excluded.cancel_token_hash,
       verification_method = excluded.verification_method,
       cancelled_at = NULL,
       cancelled_reason = NULL,
       created_ip = excluded.created_ip,
       created_user_agent = excluded.created_user_agent`
  )
    .bind(
      pendingId,
      user.id,
      requestedAt.toISOString(),
      deleteAfterAt.toISOString(),
      cancelTokenHash,
      "email_code",
      requestIp,
      userAgent,
    )
    .run();

  await revokeAllUserSessions(env, user.id, "account_delete_pending");

  await logAuditEvent(env, {
    userId: user.id,
    eventType: "account_delete_scheduled",
    status: "success",
    details: { deleteAfterAt: deleteAfterAt.toISOString(), delayHours: 48 },
    ip: getRequestIp(request),
    userAgent: request.headers.get("User-Agent"),
  });

  return { ok: true };
}

const FREE_TIER_USAGE_LIMITS = {
  notesPerDay: 10,
  aiUsesPerDay: 2,
} as const;

const ACCOUNT_ACTIVITY_EVENT_TYPES = new Set([
  "note_created",
  "ai_note_created",
  "note_opened",
  "note_expired",
]);

type AccountType = "free" | "personal_premium" | "business_premium";

function normalizeAccountType(raw: string | null | undefined): AccountType {
  const value = (raw || "free").toLowerCase();
  if (value === "personal_premium" || value === "pro") return "personal_premium";
  if (value === "business_premium" || value === "business") return "business_premium";
  return "free";
}

function usageLimitsForPlan(plan: string | null | undefined): {
  notesPerDay: number | null;
  aiUsesPerDay: number | null;
} {
  const accountType = normalizeAccountType(plan);
  if (accountType === "personal_premium" || accountType === "business_premium") {
    return { notesPerDay: null, aiUsesPerDay: null };
  }
  return {
    notesPerDay: FREE_TIER_USAGE_LIMITS.notesPerDay,
    aiUsesPerDay: FREE_TIER_USAGE_LIMITS.aiUsesPerDay,
  };
}

/**
 * SQLite `datetime('now')` is UTC clock time without a TZ suffix; JSON clients parsed it as local.
 * Emit RFC3339 UTC (`...Z`) so Intl, Date, and date-fns interpret instants correctly in each viewer's TZ.
 */
function coerceAccountActivityCreatedAtUtcToIso(value: string): string {
  const s = value.trim();
  if (!s) return value;
  if (s.endsWith("Z")) return s;
  if (/GMT|UTC\b/i.test(s)) return value;
  if (/[+-]\d{2}:\d{2}$/.test(s) || /[+-]\d{4}$/.test(s)) return s;

  let candidate = s;
  if (/^\d{4}-\d{2}-\d{2} \d/.test(candidate)) {
    candidate = `${candidate.slice(0, 10)}T${candidate.slice(11)}`;
  }
  const m = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2})(\.\d+)?/.exec(candidate);
  if (!m) return value;
  return `${m[1]}T${m[2]}${m[3] ?? ""}Z`;
}

export async function recordAccountActivity(
  env: Env,
  userId: string,
  eventType: string,
  noteId: string | null
): Promise<void> {
  if (!env.AUTH_DB) return;
  if (!ACCOUNT_ACTIVITY_EVENT_TYPES.has(eventType)) return;
  const id = crypto.randomUUID();
  try {
    await env.AUTH_DB.prepare(
      `INSERT INTO account_activity (id, user_id, event_type, note_id, created_at)
       VALUES (?, ?, ?, ?, datetime('now'))`
    )
      .bind(id, userId, eventType, noteId)
      .run();
  } catch (e) {
    console.warn("[account_activity] insert failed:", e);
  }
}

const RATE_LIMIT_ACCOUNT_ACTIVITY_POST = {
  MAX_REQUESTS: 48,
  WINDOW_SECONDS: 60,
  KEY_PREFIX: "rl:post:acct_act:",
};

export async function getSessionFromRequest(
  env: Env,
  request: Request,
  options: { rotate?: boolean; allowPendingTotp?: boolean } = {}
): Promise<{
  id: string;
  email: string | null;
  sessionRowId: string;
  sessionIdHash: string;
  lastAuthAt: string | null;
  lastStepUpAt: string | null;
  newSessionId?: string;
  authComplete: boolean;
} | null> {
  if (!env.AUTH_DB) return null;
  const cookies = parseCookies(request.headers.get("Cookie"));
  const cookieName = sessionCookieNameForKind(getSessionCookieKindForRequest(request));
  const sessionId = cookies[cookieName];
  if (!sessionId) return null;
  const sessionHash = await sha256Base64Url(sessionId);
  const currentIp = getRequestIp(request);
  const row = await env.AUTH_DB.prepare(
    `SELECT sessions.id as session_row_id, sessions.user_id as user_id, users.email as email, sessions.expires_at as expires_at
            , sessions.absolute_expires_at as absolute_expires_at, sessions.revoked_at as revoked_at
            , sessions.last_seen_at as last_seen_at, sessions.created_at as created_at
            , sessions.last_auth_at as last_auth_at, sessions.last_stepup_at as last_stepup_at
            , sessions.ip as session_ip
            , sessions.auth_complete as auth_complete
     FROM sessions
     LEFT JOIN users ON users.id = sessions.user_id
     WHERE sessions.session_id_hash = ?
     LIMIT 1`
  )
    .bind(sessionHash)
    .first<{
      session_row_id: string;
      user_id: string;
      email: string | null;
      expires_at: string | null;
      absolute_expires_at: string | null;
      revoked_at: string | null;
      last_seen_at: string | null;
      created_at: string | null;
      last_auth_at: string | null;
      last_stepup_at: string | null;
      session_ip: string | null;
      auth_complete: number | null;
    }>();

  if (!row || row.revoked_at) {
    return null;
  }

  const authComplete = (row.auth_complete ?? 1) === 1;
  if (!authComplete && !options.allowPendingTotp) {
    return null;
  }

  /** After IP mismatch we clear step-up in DB; expose that in-memory so sensitive-action gates match. */
  let sessionLastStepUpAt: string | null = row.last_stepup_at ?? null;

  // Optional IP binding check (can be disabled for mobile users)
  if (SESSION_IP_BINDING_ENABLED && row.session_ip && currentIp && row.session_ip !== currentIp) {
    // Soft-bind: do NOT revoke the session on IP change.
    // - Update stored IP to the new one
    // - Clear last_stepup_at so any sensitive operation requires fresh step-up (e.g., passkey)
    await env.AUTH_DB.prepare(
      "UPDATE sessions SET ip = ?, last_stepup_at = NULL WHERE session_id_hash = ? AND revoked_at IS NULL"
    )
      .bind(currentIp, sessionHash)
      .run();
    sessionLastStepUpAt = null;

    // Audit log: IP mismatch (still recorded for visibility and anomaly detection)
    await logAuditEvent(env, {
      userId: row.user_id,
      eventType: "ip_mismatch",
      status: "warning",
      details: { originalIp: row.session_ip, currentIp, sessionRowId: row.session_row_id },
      ip: currentIp,
      userAgent: request.headers.get("User-Agent"),
    });
  }
  const now = Date.now();
  if (row.absolute_expires_at && new Date(row.absolute_expires_at).getTime() < now) {
    await env.AUTH_DB.prepare("UPDATE sessions SET revoked_at = ?, revoked_reason = ? WHERE session_id_hash = ?")
      .bind(new Date().toISOString(), "absolute_expired", sessionHash)
      .run();

    // Audit log: session absolute expiration
    await logAuditEvent(env, {
      userId: row.user_id,
      eventType: "session_expired",
      status: "success",
      details: { reason: "absolute_expired", sessionRowId: row.session_row_id },
      ip: currentIp,
      userAgent: request.headers.get("User-Agent"),
    });

    return null;
  }
  if (row.expires_at && new Date(row.expires_at).getTime() < now) {
    await env.AUTH_DB.prepare("UPDATE sessions SET revoked_at = ?, revoked_reason = ? WHERE session_id_hash = ?")
      .bind(new Date().toISOString(), "expired", sessionHash)
      .run();

    // Audit log: session sliding expiration
    await logAuditEvent(env, {
      userId: row.user_id,
      eventType: "session_expired",
      status: "success",
      details: { reason: "sliding_expired", sessionRowId: row.session_row_id },
      ip: currentIp,
      userAgent: request.headers.get("User-Agent"),
    });

    return null;
  }

  const lastSeenAt = row.last_seen_at || row.created_at;
  const lastSeenMs = lastSeenAt ? new Date(lastSeenAt).getTime() : now;

  let newSessionId: string | undefined;
  // Only rotate fully-authenticated sessions. Pending-TOTP sessions (authComplete=false) must
  // never be rotated: createSession defaults auth_complete to 1, which would bypass the second
  // factor and promote a half-authenticated session to fully authenticated.
  if (options.rotate && authComplete && now - lastSeenMs > SESSION_POLICY.ROTATE_SECONDS * 1000) {
    const rotated = await createSession(env, row.user_id, request, "magic", {
      authComplete: true,
      lastAuthAtOverride: row.last_auth_at ?? null,
    });
    if (rotated?.sessionId) {
      newSessionId = rotated.sessionId;
      await env.AUTH_DB.prepare("UPDATE sessions SET revoked_at = ?, revoked_reason = ? WHERE session_id_hash = ?")
        .bind(new Date().toISOString(), "rotated", sessionHash)
        .run();

      // Audit log: session rotated
      await logAuditEvent(env, {
        userId: row.user_id,
        eventType: "session_rotated",
        status: "success",
        details: { oldSessionRowId: row.session_row_id },
        ip: currentIp,
        userAgent: request.headers.get("User-Agent"),
      });
    }
  } else {
    const seenIso = new Date().toISOString();
    if (authComplete) {
      const nextExpiresAt = new Date(now + 1000 * SESSION_POLICY.TTL_SECONDS).toISOString();
      await env.AUTH_DB.prepare(
        "UPDATE sessions SET last_seen_at = ?, expires_at = ? WHERE session_id_hash = ?",
      )
        .bind(seenIso, nextExpiresAt, sessionHash)
        .run();
    } else {
      // Pending TOTP: do not slide expires_at — fixed short window set at magic-link verify.
      await env.AUTH_DB.prepare(
        "UPDATE sessions SET last_seen_at = ? WHERE session_id_hash = ? AND revoked_at IS NULL",
      )
        .bind(seenIso, sessionHash)
        .run();
    }
  }

  return {
    id: row.user_id,
    email: row.email ?? null,
    sessionRowId: row.session_row_id,
    sessionIdHash: sessionHash,
    lastAuthAt: row.last_auth_at ?? null,
    lastStepUpAt: sessionLastStepUpAt,
    newSessionId,
    authComplete,
  };
}

async function getUserByEmail(
  env: Env,
  email: string
): Promise<{ id: string; status: string; email: string } | null> {
  if (!env.AUTH_DB) return null;
  const existing = await env.AUTH_DB.prepare(
    "SELECT id, status, email FROM users WHERE email = ? LIMIT 1"
  )
    .bind(email)
    .first<{ id: string; status: string | null; email: string }>();
  if (!existing?.id) return null;
  return { id: existing.id, status: existing.status || USER_STATUS_ACTIVE, email: existing.email };
}

/**
 * Get or create a user by email (race-safe).
 * Attempts to create the user first, then falls back to fetching if UNIQUE constraint violation occurs.
 * This ensures no duplicate accounts and handles race conditions gracefully.
 */
async function getOrCreateUser(
  env: Env,
  email: string | null,
  status: string
): Promise<{ id: string; wasCreated: boolean } | null> {
  if (!env.AUTH_DB || !email) return null;

  // Normalize email (should already be normalized, but ensure it)
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) return null;

  // Attempt to create user first (create-first approach)
  const id = crypto.randomUUID();
  const nowIso = new Date().toISOString();
  try {
    await env.AUTH_DB.prepare(
      "INSERT INTO users (id, email, email_verified, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
    )
      .bind(id, normalizedEmail, 0, status, nowIso, nowIso)
      .run();
    return { id, wasCreated: true };
  } catch (error: any) {
    // Handle UNIQUE constraint violation (SQLite/D1 error code 2067)
    // Another request created the user in parallel - fetch and return it
    const isUniqueViolation =
      error?.cause?.code === 2067 ||
      error?.message?.includes("UNIQUE constraint") ||
      error?.message?.includes("UNIQUE constraint failed") ||
      error?.message?.toLowerCase().includes("unique");

    if (isUniqueViolation) {
      // Fetch the existing user created by another request
      const existing = await getUserByEmail(env, normalizedEmail);
      if (existing?.id) {
        return { id: existing.id, wasCreated: false };
      }
      // If we can't find the user, something unexpected happened
      return null;
    }

    // Re-throw other database errors (don't swallow unexpected failures)
    throw error;
  }
}

export async function getTurnstileChallengeRequired(kv: KVNamespace, clientId: string): Promise<boolean> {
  try {
    const v = await kv.get(`${TURNSTILE_CHALLENGE.KEY_PREFIX}${clientId}`);
    return Boolean(v);
  } catch (error) {
    console.warn("[TURNSTILE_CHALLENGE] read failed:", error);
    return false;
  }
}

export async function setTurnstileChallengeRequired(kv: KVNamespace, clientId: string): Promise<void> {
  try {
    await kv.put(`${TURNSTILE_CHALLENGE.KEY_PREFIX}${clientId}`, "1", {
      expirationTtl: TURNSTILE_CHALLENGE.TTL_SECONDS,
    });
  } catch (error) {
    console.warn("[TURNSTILE_CHALLENGE] set failed:", error);
  }
}

export async function clearTurnstileChallengeRequired(kv: KVNamespace, clientId: string): Promise<void> {
  try {
    await kv.delete(`${TURNSTILE_CHALLENGE.KEY_PREFIX}${clientId}`);
  } catch (error) {
    console.warn("[TURNSTILE_CHALLENGE] clear failed:", error);
  }
}

export async function bumpAiNoteCountAndMaybeChallenge(env: Env, clientId: string): Promise<void> {
  const kv = env.ANALYTICS_KV || env.NOTES_KV;
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - (now % TURNSTILE_CHALLENGE.AI_NOTE_WINDOW_SECONDS);
  const key = `ai_note_hour:${clientId}:${windowStart}`;
  try {
    const stored = await kv.get(key, { type: "json" }) as { count?: number } | null;
    const count = (stored?.count ?? 0) + 1;
    await kv.put(key, JSON.stringify({ count }), {
      expirationTtl: TURNSTILE_CHALLENGE.AI_NOTE_WINDOW_SECONDS + 120,
    });
    if (count >= TURNSTILE_CHALLENGE.AI_NOTE_COUNT_THRESHOLD) {
      await setTurnstileChallengeRequired(kv, clientId);
      console.log(
        `[TURNSTILE_CHALLENGE] AI note volume threshold (${count}/${TURNSTILE_CHALLENGE.AI_NOTE_COUNT_THRESHOLD} per hour); challenge marked for client`,
      );
    }
  } catch (error) {
    console.warn("[TURNSTILE_CHALLENGE] bump count failed:", error);
  }
}

export async function handleAuthRoutes(request: Request, env: Env): Promise<Response | null> {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const method = request.method;

  if (!pathname.startsWith("/api/auth/")) {
    return null;
  }

  if (pathname === "/api/auth/webauthn/register/options" && method === "POST") {
    let body: any;
    try {
      body = await readJsonBody(request);
    } catch {
      return jsonResponse({ message: "Invalid JSON" }, 400, request);
    }
    const email = normalizeEmail(typeof body?.email === "string" ? body.email : null);
    if (!env.AUTH_DB) {
      return jsonResponse({ message: "Auth database not configured" }, 501, request);
    }
    const session = await getSessionFromRequest(env, request, { rotate: false });
    if (!session) {
      return jsonResponse({ message: "Authentication required" }, 401, request);
    }
    const enrollProof = await requirePasskeyEnrollmentProof(env, request, session);
    if (enrollProof) {
      return enrollProof;
    }
    const userId = session.id;
    const userEmail = session.email ?? email;
    const allowedOrigin = getExpectedOrigin(request);
    if (!allowedOrigin) {
      return jsonResponse({ message: "Origin not allowed" }, 403, request);
    }
    const rpID = getExpectedRpIdFromOrigin(allowedOrigin);
    if (!rpID) {
      return jsonResponse({ message: "Origin not allowed" }, 403, request);
    }

    const credentials = await env.AUTH_DB.prepare(
      "SELECT credential_id, transports FROM webauthn_credentials WHERE user_id = ?"
    )
      .bind(userId)
      .all<{ credential_id: string; transports: string | null }>();

    let options;
    try {
      options = await generateRegistrationOptions({
        rpName: "PrivateNote.ai",
        rpID,
        userID: new TextEncoder().encode(userId),
        userName: userEmail || `privatenote-${userId.slice(0, 6)}`,
        userDisplayName: userEmail || "PrivateNote User",
        attestationType: "none",
        authenticatorSelection: {
          userVerification: "required",
          // Required so passkey login can use discoverable credentials only (no email-based allowCredentials).
          residentKey: "required",
        },
        excludeCredentials: (credentials.results || [])
          .filter((cred) => typeof cred.credential_id === "string" && cred.credential_id.length > 0)
          .map((cred) => ({
            id: cred.credential_id,
            transports: parseTransports(cred.transports),
          })),
      });
    } catch (err) {
      return webAuthnErrorResponse(
        env,
        request,
        "POST /api/auth/webauthn/register/options",
        "generateRegistrationOptions",
        err,
        500
      );
    }

    const fallbackUserIdBytes = new TextEncoder().encode(userId);
    const fallbackUserName = userEmail || `privatenote-${userId.slice(0, 6)}`;
    const fallbackUserDisplayName = userEmail || "PrivateNote User";
    let normalizedOptions: Record<string, unknown>;
    try {
      normalizedOptions = {
        ...options,
        challenge: coerceWebAuthnIdToBase64Url(options.challenge, "challenge"),
        user: {
          ...(options.user || {}),
          id: coerceWebAuthnIdToBase64Url(options.user?.id ?? fallbackUserIdBytes, "user.id"),
          name: options.user?.name || fallbackUserName,
          displayName: options.user?.displayName || fallbackUserDisplayName,
        },
        excludeCredentials: options.excludeCredentials?.map((cred) => ({
          ...cred,
          id: coerceWebAuthnIdToBase64Url(cred.id, "excludeCredentials.id"),
        })),
      };
    } catch (err) {
      return webAuthnErrorResponse(env, request, "POST /api/auth/webauthn/register/options", "normalizeOptions", err);
    }

    const challengeId = randomId(16);
    const stored = await storeAuthChallenge(env, challengeId, {
      type: "register",
      challenge: normalizedOptions.challenge,
      userId,
      email: userEmail,
      createdAt: Date.now(),
    });
    if (!stored) {
      return jsonResponse({ message: "Auth challenge storage not configured" }, 501, request);
    }

    return jsonResponse({ challengeId, options: normalizedOptions }, 200, request);
  }

  if (pathname === "/api/auth/webauthn/register/verify" && method === "POST") {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ message: "Invalid JSON" }, 400, request);
    }
    const challengeId = body?.challengeId;
    const credential = body?.credential;
    if (!challengeId || !credential) {
      return jsonResponse({ message: "Missing challenge or credential" }, 400, request);
    }

    if (!env.AUTH_DB) {
      return jsonResponse({ message: "Auth database not configured" }, 501, request);
    }

    const session = await getSessionFromRequest(env, request, { rotate: false });
    if (!session) {
      return jsonResponse({ message: "Unauthorized" }, 401, request);
    }
    const enrollProofVerify = await requirePasskeyEnrollmentProofAtRegisterVerify(env, request, session);
    if (enrollProofVerify) {
      return enrollProofVerify;
    }

    const challengeRecord = await consumeAuthChallenge(env, challengeId);
    if (!challengeRecord) {
      return jsonResponse({ message: "Challenge expired" }, 400, request);
    }
    if (challengeRecord.type !== "register" || challengeRecord.userId !== session.id) {
      return jsonResponse({ message: "Unauthorized" }, 401, request);
    }

    const expectedChallenge = String(challengeRecord.challenge || "");
    const expectedOrigin = getExpectedOrigin(request);
    if (!expectedOrigin) {
      return jsonResponse({ message: "Origin not allowed" }, 403, request);
    }
    const expectedRPID = getExpectedRpIdFromOrigin(expectedOrigin);
    if (!expectedRPID) {
      return jsonResponse({ message: "Origin not allowed" }, 403, request);
    }

    let verification;
    try {
      verification = await verifyRegistrationResponse({
        response: credential,
        expectedChallenge,
        expectedOrigin,
        expectedRPID,
        requireUserVerification: true,
      });
    } catch (error) {
      return jsonResponse(
        { message: error instanceof Error ? error.message : "Registration verification failed" },
        400,
        request
      );
    }

    if (!verification.verified || !verification.registrationInfo) {
      return jsonResponse({ message: "Registration not verified" }, 400, request);
    }

    const userId = String(challengeRecord.userId || "");
    if (!userId) {
      return jsonResponse({ message: "Missing user context" }, 400, request);
    }

    const { credentialID, credentialPublicKey, counter } = verification.registrationInfo;
    const credentialId = credentialID;
    const publicKey = base64UrlEncode(credentialPublicKey);
    const transports = Array.isArray(credential?.transports)
      ? credential.transports
      : Array.isArray(credential?.response?.transports)
        ? credential.response.transports
        : null;

    // Track credential metadata (backup flags, device info)
    // Note: The schema stores transports as JSON, which we can extend with metadata
    const registrationInfo = verification.registrationInfo || {};
    const credentialMetadata = {
      transports: transports || [],
      // Extract backup flag from authenticator data if available (may not be present in all authenticators)
      backupEligible: (registrationInfo as any).backupEligible ?? false,
      backupState: (registrationInfo as any).backupState ?? false,
      // Device info from user agent
      deviceInfo: getDeviceLabel(request.headers.get("User-Agent") || ""),
      createdAt: new Date().toISOString(),
    };

    const hasDisplayNameColumn = await webauthnCredentialsHaveDisplayNameColumn(env);
    const insertStatement = hasDisplayNameColumn
      ? "INSERT INTO webauthn_credentials (id, user_id, credential_id, public_key, display_name, counter, transports, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
      : "INSERT INTO webauthn_credentials (id, user_id, credential_id, public_key, counter, transports, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const insertBinding = hasDisplayNameColumn
      ? [
          crypto.randomUUID(),
          userId,
          credentialId,
          publicKey,
          null,
          counter ?? 0,
          JSON.stringify(credentialMetadata),
          new Date().toISOString(),
        ]
      : [
          crypto.randomUUID(),
          userId,
          credentialId,
          publicKey,
          counter ?? 0,
          JSON.stringify(credentialMetadata),
          new Date().toISOString(),
        ];

    await env.AUTH_DB.prepare(insertStatement).bind(...insertBinding).run();

    await env.AUTH_DB.prepare(
      "UPDATE users SET status = ?, email_verified = CASE WHEN email IS NULL THEN email_verified ELSE 1 END, updated_at = ? WHERE id = ?"
    )
      .bind(USER_STATUS_ACTIVE, new Date().toISOString(), userId)
      .run();

    await env.AUTH_DB.prepare(
      "UPDATE sessions SET last_stepup_at = ?, last_auth_at = ? WHERE session_id_hash = ?"
    )
      .bind(new Date().toISOString(), new Date().toISOString(), session.sessionIdHash)
      .run();

    // Security enhancement: Revoke all other sessions that were created via magic link only
    // This ensures that after passkey registration, only passkey-authenticated sessions remain
    // (excluding the current session which now has step-up auth)
    const revokedCount = await env.AUTH_DB.prepare(
      `UPDATE sessions 
       SET revoked_at = ?, revoked_reason = ? 
       WHERE user_id = ? 
         AND revoked_at IS NULL 
         AND session_id_hash != ? 
         AND last_stepup_at IS NULL`
    )
      .bind(new Date().toISOString(), "passkey_registered_security_upgrade", userId, session.sessionIdHash)
      .run();

    const sessionsRevoked = revokedCount?.meta?.changes || 0;
    if (sessionsRevoked > 0) {
      // Audit log: sessions revoked due to passkey registration
      await logAuditEvent(env, {
        userId,
        eventType: "session_revoked",
        status: "success",
        details: {
          reason: "passkey_registered_security_upgrade",
          sessionsRevoked,
          revokeType: "magic_link_only_sessions",
        },
        ip: getRequestIp(request),
        userAgent: request.headers.get("User-Agent"),
      });
    }

    const passkeyCountRow = await env.AUTH_DB.prepare(
      "SELECT COUNT(*) as count FROM webauthn_credentials WHERE user_id = ?",
    )
      .bind(userId)
      .first<{ count: number }>();
    const passkeyCountAfter = passkeyCountRow?.count ?? 0;

    // Audit log: passkey registered
    await logAuditEvent(env, {
      userId,
      eventType: "passkey_registered",
      status: "success",
      details: {
        credentialIdPrefix: credentialId.substring(0, 16) + "...",
        backupEligible: credentialMetadata.backupEligible,
        deviceInfo: credentialMetadata.deviceInfo,
        sessionsRevoked,
        passkeyCountAfter,
        firstPasskeyOnAccount: passkeyCountAfter === 1,
      },
      ip: getRequestIp(request),
      userAgent: request.headers.get("User-Agent"),
    });

    const accountEmail = typeof challengeRecord.email === "string" ? challengeRecord.email.trim().toLowerCase() : "";
    if (accountEmail) {
      const passkeyDevice = credentialMetadata.deviceInfo || "this device";
      const passkeyType = getPasskeyLabel(transports || null);
      const securityUrl = `${getMagicLinkOrigin(env, request)}/account/security`;
      const emailResult = await sendEmail(env, {
        to: accountEmail,
        subject: "Passkey added to your PrivateNote account",
        text:
          `A new passkey was added to your PrivateNote account.\n\n` +
          `Passkey type: ${passkeyType}\n` +
          `Device: ${passkeyDevice}\n\n` +
          `If this was you, no further action is needed.\n\n` +
          `If this was not you, review your passkeys in Security settings and remove any you do not recognize:\n${securityUrl}\n\n` +
          `If anything looks wrong, secure your account immediately and contact support at contact@privatenote.ai.`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Passkey added</h2>
            <p>A new passkey was added to your PrivateNote account.</p>
            <p>
              <strong>Passkey type:</strong> ${passkeyType}<br />
              <strong>Device:</strong> ${passkeyDevice}
            </p>
            <p>If this was you, no further action is needed.</p>
            <p>If this was not you, review your passkeys in Security settings and remove any you do not recognize.</p>
            <p style="margin: 24px 0;">
              <a href="${securityUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">
                Open Security settings
              </a>
            </p>
            <p style="color: #4b5563;">If anything looks wrong, secure your account immediately and contact <a href="mailto:contact@privatenote.ai">contact@privatenote.ai</a>.</p>
          </div>
        `,
      });
      if (!emailResult.ok) {
        console.warn("[AUTH] Failed to send passkey-added email:", emailResult.error);
      }
    }

    return jsonResponse({ ok: true }, 200, request);
  }

  if (pathname === "/api/auth/webauthn/login/options" && method === "POST") {
    let body: any;
    try {
      body = await readJsonBody(request);
    } catch {
      return jsonResponse({ message: "Invalid JSON" }, 400, request);
    }
    if (!env.AUTH_DB) {
      return jsonResponse({ message: "Auth database not configured" }, 501, request);
    }

    const allowedOrigin = getExpectedOrigin(request);
    if (!allowedOrigin) {
      return jsonResponse({ message: "Origin not allowed" }, 403, request);
    }
    const rpID = getExpectedRpIdFromOrigin(allowedOrigin);
    if (!rpID) {
      return jsonResponse({ message: "Origin not allowed" }, 403, request);
    }

    // Optional email is stored on the challenge for diagnostics only — never used to build
    // allowCredentials. Username-first flows that return per-user credential IDs let anyone
    // probe whether an address has passkeys and leak stable credential handles. Login verify
    // resolves the user from the presented credential_id alone (discoverable / resident keys).
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : null;

    const requestUrl = new URL(request.url);
    const isLocal = requestUrl.hostname === "localhost" || requestUrl.hostname === "127.0.0.1";
    const kv = env.RATE_LIMIT_KV || env.AUTH_KV || env.NOTES_KV;
    const clientIp = getRequestIp(request);
    if (kv && !isLocal && clientIp) {
      const now = Math.floor(Date.now() / 1000);
      const windowStart = now - (now % WEBAUTHN_LOGIN_OPTIONS_RATE_LIMIT.WINDOW_SECONDS);
      const ipKey = `${WEBAUTHN_LOGIN_OPTIONS_RATE_LIMIT.IP_KEY_PREFIX}${clientIp}:${windowStart}`;
      try {
        const ipCount = (await kv.get(ipKey, { type: "json" })) as { count: number } | null;
        if (ipCount && ipCount.count >= WEBAUTHN_LOGIN_OPTIONS_RATE_LIMIT.MAX_PER_IP) {
          await logAuditEvent(env, {
            userId: null,
            eventType: "rate_limit_exceeded",
            status: "warning",
            details: { endpoint: "webauthn_login_options", limitType: "ip", ip: clientIp },
            ip: clientIp,
            userAgent: request.headers.get("User-Agent"),
          });
          return jsonResponse({ message: "Too many passkey sign-in attempts. Try again later." }, 429, request);
        }
        await kv.put(ipKey, JSON.stringify({ count: (ipCount?.count || 0) + 1 }), {
          expirationTtl: WEBAUTHN_LOGIN_OPTIONS_RATE_LIMIT.WINDOW_SECONDS + 10,
        });
      } catch (error) {
        console.error("[WEBAUTHN_LOGIN_OPTIONS_RATE_LIMIT] IP rate limit error:", error);
      }
    }

    let options;
    try {
      options = await generateAuthenticationOptions({
        rpID,
        allowCredentials: undefined,
        userVerification: "required",
      });
    } catch (err) {
      return webAuthnErrorResponse(
        env,
        request,
        "POST /api/auth/webauthn/login/options",
        "generateAuthenticationOptions",
        err,
        500
      );
    }

    let normalizedOptions: Record<string, unknown>;
    try {
      normalizedOptions = {
        ...options,
        challenge: coerceWebAuthnIdToBase64Url(options.challenge, "challenge"),
        allowCredentials: options.allowCredentials?.map((cred) => ({
          ...cred,
          id: coerceWebAuthnIdToBase64Url(cred.id, "allowCredentials.id"),
        })),
      };
    } catch (err) {
      return webAuthnErrorResponse(env, request, "POST /api/auth/webauthn/login/options", "normalizeOptions", err);
    }

    const challengeId = randomId(16);
    const stored = await storeAuthChallenge(env, challengeId, {
      type: "login",
      challenge: normalizedOptions.challenge as string,
      email,
      createdAt: Date.now(),
    });
    if (!stored) {
      return jsonResponse({ message: "Auth challenge storage not configured" }, 501, request);
    }

    return jsonResponse({ challengeId, options: normalizedOptions }, 200, request);
  }

  if (pathname === "/api/auth/webauthn/login/verify" && method === "POST") {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ message: "Invalid JSON" }, 400, request);
    }
    const challengeId = body?.challengeId;
    const credential = body?.credential;
    if (!challengeId || !credential) {
      return jsonResponse({ message: "Missing challenge or credential" }, 400, request);
    }
    const challengeRecord = await consumeAuthChallenge(env, challengeId);
    if (!challengeRecord) {
      return jsonResponse({ message: "Challenge expired" }, 400, request);
    }

    if (!env.AUTH_DB) {
      return jsonResponse({ message: "Auth database not configured" }, 501, request);
    }

    const expectedChallenge = String(challengeRecord.challenge || "");
    const expectedOrigin = getExpectedOrigin(request);
    if (!expectedOrigin) {
      return jsonResponse({ message: "Origin not allowed" }, 403, request);
    }
    const expectedRPID = getExpectedRpIdFromOrigin(expectedOrigin);
    if (!expectedRPID) {
      return jsonResponse({ message: "Origin not allowed" }, 403, request);
    }

    let credentialId: string | null = null;
    try {
      credentialId = coerceWebAuthnIdToBase64Url(
        credential?.rawId ?? credential?.id,
        "credential.rawId/id"
      );
    } catch {
      return jsonResponse({ message: "Invalid credential ID" }, 400, request);
    }

    const storedCredential = await env.AUTH_DB.prepare(
      "SELECT id, user_id, credential_id, public_key, counter FROM webauthn_credentials WHERE credential_id = ? LIMIT 1"
    )
      .bind(credentialId)
      .first<{ id: string; user_id: string; credential_id: string; public_key: string; counter: number }>();

    if (!storedCredential) {
      // Audit log: login failed - unknown credential
      await logAuditEvent(env, {
        userId: null,
        eventType: "login_failed",
        status: "failure",
        details: { reason: "unknown_credential", credentialIdPrefix: credentialId.substring(0, 16) + "..." },
        ip: getRequestIp(request),
        userAgent: request.headers.get("User-Agent"),
      });
      return jsonResponse({ message: PASSKEY_CLIENT_SAFE_MESSAGE }, 400, request);
    }

    let verification;
    try {
      verification = await verifyAuthenticationResponse({
        response: credential,
        expectedChallenge,
        expectedOrigin,
        expectedRPID,
        requireUserVerification: true,
        authenticator: {
          credentialID: storedCredential.credential_id,
          credentialPublicKey: base64UrlToBytes(storedCredential.public_key),
          counter: storedCredential.counter || 0,
        },
      });
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      console.error(
        `[WebAuthn] POST /api/auth/webauthn/login/verify — verifyAuthenticationResponse: ${errMsg}`
      );
      await logAuditEvent(env, {
        userId: storedCredential.user_id,
        eventType: "login_failed",
        status: "failure",
        details: { reason: "passkey_verify_exception", context: "webauthn_login" },
        ip: getRequestIp(request),
        userAgent: request.headers.get("User-Agent"),
      });
      return jsonResponse({ message: PASSKEY_CLIENT_SAFE_MESSAGE }, 400, request);
    }

    if (!verification.verified || !verification.authenticationInfo) {
      await logAuditEvent(env, {
        userId: storedCredential.user_id,
        eventType: "login_failed",
        status: "failure",
        details: { reason: "passkey_not_verified", context: "webauthn_login" },
        ip: getRequestIp(request),
        userAgent: request.headers.get("User-Agent"),
      });
      return jsonResponse({ message: PASSKEY_CLIENT_SAFE_MESSAGE }, 400, request);
    }

    if (!verification.authenticationInfo.userVerified) {
      await logAuditEvent(env, {
        userId: storedCredential.user_id,
        eventType: "login_failed",
        status: "failure",
        details: { reason: "passkey_user_not_verified", context: "webauthn_login" },
        ip: getRequestIp(request),
        userAgent: request.headers.get("User-Agent"),
      });
      return jsonResponse({ message: PASSKEY_CLIENT_SAFE_MESSAGE }, 400, request);
    }

    const newCounter = verification.authenticationInfo.newCounter;
    await env.AUTH_DB.prepare(
      "UPDATE webauthn_credentials SET counter = ?, last_used_at = ? WHERE id = ?"
    )
      .bind(newCounter, new Date().toISOString(), storedCredential.id)
      .run();

    await env.AUTH_DB.prepare(
      "UPDATE users SET status = ?, last_login_at = ?, updated_at = ? WHERE id = ?"
    )
      .bind(USER_STATUS_ACTIVE, new Date().toISOString(), new Date().toISOString(), storedCredential.user_id)
      .run();

    const session = await createSession(env, storedCredential.user_id, request, "passkey");

    // Audit log: passkey used successfully
    await logAuditEvent(env, {
      userId: storedCredential.user_id,
      eventType: "passkey_used",
      status: "success",
      details: { credentialIdPrefix: credentialId.substring(0, 16) + "..." },
      ip: getRequestIp(request),
      userAgent: request.headers.get("User-Agent"),
    });

    // Audit log: login success
    await logAuditEvent(env, {
      userId: storedCredential.user_id,
      eventType: "login_success",
      status: "success",
      details: { authMethod: "passkey" },
      ip: getRequestIp(request),
      userAgent: request.headers.get("User-Agent"),
    });

    const headers = new Headers(getCorsHeaders(request));
    headers.set("Content-Type", "application/json");
    if (session?.sessionId) {
      headers.set("Set-Cookie", sessionCookie(session.sessionId, getSessionCookieKindForRequest(request)));
    }
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
  }

  if (pathname === "/api/auth/me" && method === "GET") {
    if (!env.AUTH_DB) {
      return jsonResponse({ message: "Auth database not configured" }, 501, request);
    }
    const session = await getSessionFromRequest(env, request, { rotate: true });
    if (!session) {
      return jsonResponse({ message: "Unauthorized" }, 401, request);
    }
    const userColumns = await getUsersTableColumns(env);
    const userSelect = buildUserSelect(["id", "email", "status", "email_verified", "created_at"], userColumns);
    const user = await env.AUTH_DB.prepare(
      `SELECT ${userSelect} FROM users WHERE id = ? LIMIT 1`
    )
      .bind(session.id)
      .first<{
        id: string;
        email: string | null;
        status: string | null;
        email_verified: number | null;
        created_at: string | null;
        plan?: string | null;
        account_type?: string | null;
        business_display_name?: string | null;
        email_notifications?: number | null;
        preferred_language?: string | null;
      }>();

    const usablePasskeyCount = await countUsableWebauthnCredentialsForUser(env, session.id);

    const headers = new Headers(getCorsHeaders(request));
    headers.set("Content-Type", "application/json");
    applyRotatedSession(request, headers, session);
    return new Response(
      JSON.stringify({
        ok: true,
        id: user?.id ?? session.id,
        email: user?.email ?? null,
        status: user?.status ?? USER_STATUS_ACTIVE,
        hasPasskeys: usablePasskeyCount > 0,
        emailVerified: (user?.email_verified ?? 0) === 1,
        lastStepUpAt: session.lastStepUpAt,
        createdAt: user?.created_at ?? null,
        plan: normalizeAccountType(user?.account_type ?? user?.plan),
        accountType: normalizeAccountType(user?.account_type ?? user?.plan),
        businessDisplayName: user?.business_display_name ?? null,
        emailNotifications: (user?.email_notifications ?? 1) === 1,
        preferredLanguage: user?.preferred_language ?? null,
      }),
      { status: 200, headers }
    );
  }

  if (pathname === "/api/auth/account/summary" && method === "GET") {
    if (!env.AUTH_DB) {
      return jsonResponse({ message: "Auth database not configured" }, 501, request);
    }
    const session = await getSessionFromRequest(env, request, { rotate: true });
    if (!session) {
      return jsonResponse({ message: "Unauthorized" }, 401, request);
    }
    const userColumns = await getUsersTableColumns(env);
    const userSelect = buildUserSelect(["id", "email", "created_at"], userColumns);
    const user = await env.AUTH_DB.prepare(
      `SELECT ${userSelect} FROM users WHERE id = ? LIMIT 1`
    )
      .bind(session.id)
      .first<{
        id: string;
        email: string | null;
        created_at: string | null;
        plan?: string | null;
        account_type?: string | null;
        business_display_name?: string | null;
        email_notifications?: number | null;
        preferred_language?: string | null;
        allow_hosted_ai?: number | null;
      }>();

    const normalizedAccountType = normalizeAccountType(user?.account_type ?? user?.plan);
    const limits = usageLimitsForPlan(normalizedAccountType);
    let notesToday = 0;
    let aiToday = 0;
    let notesMonth = 0;
    let aiMonth = 0;
    try {
      const usageRow = await env.AUTH_DB.prepare(
        `SELECT
          SUM(CASE WHEN event_type = 'note_created' AND date(created_at) = date('now') THEN 1 ELSE 0 END) AS n_day,
          SUM(CASE WHEN event_type = 'ai_note_created' AND date(created_at) = date('now') THEN 1 ELSE 0 END) AS a_day,
          SUM(CASE WHEN event_type = 'note_created' AND strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now') THEN 1 ELSE 0 END) AS n_mo,
          SUM(CASE WHEN event_type = 'ai_note_created' AND strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now') THEN 1 ELSE 0 END) AS a_mo
         FROM account_activity WHERE user_id = ?`
      )
        .bind(session.id)
        .first<{ n_day: number | null; a_day: number | null; n_mo: number | null; a_mo: number | null }>();
      notesToday = Number(usageRow?.n_day ?? 0);
      aiToday = Number(usageRow?.a_day ?? 0);
      notesMonth = Number(usageRow?.n_mo ?? 0);
      aiMonth = Number(usageRow?.a_mo ?? 0);
    } catch (e) {
      console.warn("[account/summary] usage query failed (migration missing?):", e);
    }

    const headers = new Headers(getCorsHeaders(request));
    headers.set("Content-Type", "application/json");
    applyRotatedSession(request, headers, session);
    return new Response(
      JSON.stringify({
        ok: true,
        id: user?.id ?? session.id,
        email: user?.email ?? null,
        createdAt: user?.created_at ?? null,
        plan: normalizedAccountType,
        accountType: normalizedAccountType,
        businessDisplayName: user?.business_display_name ?? null,
        emailNotifications: (user?.email_notifications ?? 1) === 1,
        preferredLanguage: user?.preferred_language ?? null,
        allowHostedAi: userColumns.allow_hosted_ai ? user?.allow_hosted_ai === 1 : false,
        limits: {
          notesPerDay: limits.notesPerDay,
          aiUsesPerDay: limits.aiUsesPerDay,
        },
        usage: {
          notesToday,
          aiToday,
          notesMonth,
          aiMonth,
        },
        storageUsedBytes: null,
      }),
      { status: 200, headers }
    );
  }

  if (pathname === "/api/auth/account/activity" && method === "GET") {
    if (!env.AUTH_DB) {
      return jsonResponse({ message: "Auth database not configured" }, 501, request);
    }
    const session = await getSessionFromRequest(env, request, { rotate: true });
    if (!session) {
      return jsonResponse({ message: "Unauthorized" }, 401, request);
    }
    const url = new URL(request.url);
    const limitRaw = Number(url.searchParams.get("limit") ?? "30");
    const limit = Math.min(100, Math.max(1, Number.isFinite(limitRaw) ? limitRaw : 30));

    let events: Array<{ id: string; type: string; noteId: string | null; createdAt: string }> = [];
    try {
      const res = await env.AUTH_DB.prepare(
        `SELECT id, event_type, note_id, created_at FROM account_activity
         WHERE user_id = ? ORDER BY datetime(created_at) DESC LIMIT ?`
      )
        .bind(session.id, limit)
        .all<{ id: string; event_type: string; note_id: string | null; created_at: string }>();
      events = (res.results || []).map((r) => ({
        id: r.id,
        type: r.event_type,
        noteId: r.note_id,
        createdAt: coerceAccountActivityCreatedAtUtcToIso(r.created_at),
      }));
    } catch (e) {
      console.warn("[account/activity] list failed:", e);
    }

    const headers = new Headers(getCorsHeaders(request));
    headers.set("Content-Type", "application/json");
    applyRotatedSession(request, headers, session);
    return new Response(JSON.stringify({ ok: true, events }), { status: 200, headers });
  }

  if (pathname === "/api/auth/account/activity" && method === "POST") {
    if (!env.AUTH_DB) {
      return jsonResponse({ message: "Auth database not configured" }, 501, request);
    }
    const session = await getSessionFromRequest(env, request, { rotate: false });
    if (!session) {
      return jsonResponse({ message: "Unauthorized" }, 401, request);
    }
    const rl = await checkRateLimit(env, session.id, RATE_LIMIT_ACCOUNT_ACTIVITY_POST);
    if (!rl.allowed) {
      return jsonResponse({ message: "Too many requests" }, 429, request);
    }

    let body: { event?: string; noteId?: string };
    try {
      body = (await request.json()) as { event?: string; noteId?: string };
    } catch {
      return jsonResponse({ message: "Invalid JSON" }, 400, request);
    }
    if (body.event !== "note_opened") {
      return jsonResponse({ message: "Unsupported event" }, 400, request);
    }
    const noteId = typeof body.noteId === "string" ? body.noteId : "";
    if (!isValidNoteId(noteId)) {
      return jsonResponse({ message: "Invalid note id" }, 400, request);
    }

    await recordAccountActivity(env, session.id, "note_opened", noteId);
    const headers = new Headers(getCorsHeaders(request));
    headers.set("Content-Type", "application/json");
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
  }

  if (pathname === "/api/auth/account/preferences" && method === "PATCH") {
    if (!env.AUTH_DB) {
      return jsonResponse({ message: "Auth database not configured" }, 501, request);
    }
    const session = await getSessionFromRequest(env, request, { rotate: true });
    if (!session) {
      return jsonResponse({ message: "Unauthorized" }, 401, request);
    }
    let body: { emailNotifications?: boolean; preferredLanguage?: string | null; allowHostedAi?: boolean };
    try {
      body = (await readJsonBody(request)) as {
        emailNotifications?: boolean;
        preferredLanguage?: string | null;
        allowHostedAi?: boolean;
      };
    } catch {
      return jsonResponse({ message: "Invalid JSON" }, 400, request);
    }
    const hasEmailNotifications = typeof body.emailNotifications === "boolean";
    const hasPreferredLanguage = Object.prototype.hasOwnProperty.call(body, "preferredLanguage");
    const hasAllowHostedAi = typeof body.allowHostedAi === "boolean";
    if (!hasEmailNotifications && !hasPreferredLanguage && !hasAllowHostedAi) {
      return jsonResponse(
        { message: "At least one of emailNotifications, preferredLanguage, or allowHostedAi is required" },
        400,
        request
      );
    }
    const userColumns = await getUsersTableColumns(env);
    if (hasEmailNotifications && !userColumns.email_notifications) {
      return jsonResponse({ message: "Account preferences are not available until auth migrations are applied" }, 501, request);
    }
    if (hasPreferredLanguage && !userColumns.preferred_language) {
      return jsonResponse({ message: "Language preferences are not available until auth migrations are applied" }, 501, request);
    }
    if (hasAllowHostedAi && !userColumns.allow_hosted_ai) {
      return jsonResponse({ message: "Hosted AI preference migration is required" }, 503, request);
    }

    let normalizedPreferredLanguage: string | null | undefined = undefined;
    if (hasPreferredLanguage) {
      const parsed = normalizeAccountPreferredLanguageInput(body.preferredLanguage);
      if (!parsed.ok) {
        return jsonResponse({ message: parsed.message }, 400, request);
      }
      normalizedPreferredLanguage = parsed.value;
    }

    const updates: string[] = [];
    const bindings: Array<number | string | null> = [];
    if (hasEmailNotifications) {
      updates.push("email_notifications = ?");
      bindings.push(body.emailNotifications ? 1 : 0);
    }
    if (hasPreferredLanguage) {
      updates.push("preferred_language = ?");
      bindings.push(normalizedPreferredLanguage ?? null);
    }
    if (hasAllowHostedAi) {
      updates.push("allow_hosted_ai = ?");
      bindings.push(body.allowHostedAi ? 1 : 0);
    }
    updates.push("updated_at = datetime('now')");
    bindings.push(session.id);

    await env.AUTH_DB.prepare(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`)
      .bind(...bindings)
      .run();

    const headers = new Headers(getCorsHeaders(request));
    headers.set("Content-Type", "application/json");
    applyRotatedSession(request, headers, session);
    return new Response(
      JSON.stringify({
        ok: true,
        emailNotifications: hasEmailNotifications ? body.emailNotifications : undefined,
        preferredLanguage: hasPreferredLanguage ? (normalizedPreferredLanguage ?? null) : undefined,
        allowHostedAi: hasAllowHostedAi ? body.allowHostedAi : undefined,
      }),
      { status: 200, headers }
    );
  }

  if (pathname === "/api/auth/webauthn/stepup/options" && method === "POST") {
    if (!env.AUTH_DB) {
      return jsonResponse({ message: "Auth database not configured" }, 501, request);
    }
    const session = await getSessionFromRequest(env, request, { rotate: false });
    if (!session) {
      return jsonResponse({ message: "Unauthorized" }, 401, request);
    }

    const allowedOrigin = getExpectedOrigin(request);
    if (!allowedOrigin) {
      return jsonResponse({ message: "Origin not allowed" }, 403, request);
    }
    const rpID = getExpectedRpIdFromOrigin(allowedOrigin);
    if (!rpID) {
      return jsonResponse({ message: "Origin not allowed" }, 403, request);
    }

    const credentials = await env.AUTH_DB.prepare(
      "SELECT credential_id, transports FROM webauthn_credentials WHERE user_id = ?"
    )
      .bind(session.id)
      .all<{ credential_id: string; transports: string | null }>();
    const validCreds = (credentials.results || []).filter(
      (c) => typeof c.credential_id === "string" && c.credential_id.length > 0
    );
    if (!validCreds.length) {
      return jsonResponse({ message: "No passkeys available" }, 400, request);
    }

    let options;
    try {
      options = await generateAuthenticationOptions({
        rpID,
        allowCredentials: validCreds.map((cred) => ({
          id: cred.credential_id,
          transports: parseTransports(cred.transports),
        })),
        userVerification: "required",
      });
    } catch (err) {
      return webAuthnErrorResponse(
        env,
        request,
        "POST /api/auth/webauthn/stepup/options",
        "generateAuthenticationOptions",
        err,
        500
      );
    }

    let normalizedOptionsStepUp: Record<string, unknown>;
    try {
      normalizedOptionsStepUp = {
        ...options,
        challenge: coerceWebAuthnIdToBase64Url(options.challenge, "challenge"),
        allowCredentials: options.allowCredentials?.map((cred) => ({
          ...cred,
          id: coerceWebAuthnIdToBase64Url(cred.id, "allowCredentials.id"),
        })),
      };
    } catch (err) {
      return webAuthnErrorResponse(env, request, "POST /api/auth/webauthn/stepup/options", "normalizeOptions", err);
    }

    const challengeId = randomId(16);
    const stored = await storeAuthChallenge(env, challengeId, {
      type: "stepup",
      challenge: normalizedOptionsStepUp.challenge as string,
      userId: session.id,
      createdAt: Date.now(),
    });
    if (!stored) {
      return jsonResponse({ message: "Auth challenge storage not configured" }, 501, request);
    }

    return jsonResponse({ challengeId, options: normalizedOptionsStepUp }, 200, request);
  }

  if (pathname === "/api/auth/webauthn/stepup/verify" && method === "POST") {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ message: "Invalid JSON" }, 400, request);
    }
    const challengeId = body?.challengeId;
    const credential = body?.credential;
    if (!challengeId || !credential) {
      return jsonResponse({ message: "Missing challenge or credential" }, 400, request);
    }
    if (!env.AUTH_DB) {
      return jsonResponse({ message: "Auth database not configured" }, 501, request);
    }
    const session = await getSessionFromRequest(env, request, { rotate: false });
    if (!session) {
      return jsonResponse({ message: "Unauthorized" }, 401, request);
    }

    const challengeRecord = await consumeAuthChallenge(env, challengeId);
    if (!challengeRecord || challengeRecord.type !== "stepup" || challengeRecord.userId !== session.id) {
      return jsonResponse({ message: "Challenge expired" }, 400, request);
    }

    const expectedChallenge = String(challengeRecord.challenge || "");
    const expectedOrigin = getExpectedOrigin(request);
    if (!expectedOrigin) {
      return jsonResponse({ message: "Origin not allowed" }, 403, request);
    }
    const expectedRPID = getExpectedRpIdFromOrigin(expectedOrigin);
    if (!expectedRPID) {
      return jsonResponse({ message: "Origin not allowed" }, 403, request);
    }

    let credentialId: string | null = null;
    try {
      credentialId = coerceWebAuthnIdToBase64Url(
        credential?.rawId ?? credential?.id,
        "credential.rawId/id"
      );
    } catch {
      return jsonResponse({ message: "Invalid credential ID" }, 400, request);
    }

    const storedCredential = await env.AUTH_DB.prepare(
      "SELECT id, credential_id, public_key, counter, user_id FROM webauthn_credentials WHERE credential_id = ? AND user_id = ? LIMIT 1"
    )
      .bind(credentialId, session.id)
      .first<{ id: string; credential_id: string; public_key: string; counter: number; user_id: string }>();

    if (!storedCredential) {
      return jsonResponse({ message: PASSKEY_CLIENT_SAFE_MESSAGE }, 400, request);
    }

    let verification;
    try {
      verification = await verifyAuthenticationResponse({
        response: credential,
        expectedChallenge,
        expectedOrigin,
        expectedRPID,
        requireUserVerification: true,
        authenticator: {
          credentialID: storedCredential.credential_id,
          credentialPublicKey: base64UrlToBytes(storedCredential.public_key),
          counter: storedCredential.counter || 0,
        },
      });
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      console.error(
        `[WebAuthn] POST /api/auth/webauthn/stepup/verify — verifyAuthenticationResponse: ${errMsg}`
      );
      await logAuditEvent(env, {
        userId: session.id,
        eventType: "login_failed",
        status: "failure",
        details: { reason: "passkey_verify_exception", context: "webauthn_stepup" },
        ip: getRequestIp(request),
        userAgent: request.headers.get("User-Agent"),
      });
      return jsonResponse({ message: PASSKEY_CLIENT_SAFE_MESSAGE }, 400, request);
    }

    if (!verification.verified || !verification.authenticationInfo) {
      await logAuditEvent(env, {
        userId: session.id,
        eventType: "login_failed",
        status: "failure",
        details: { reason: "passkey_not_verified", context: "webauthn_stepup" },
        ip: getRequestIp(request),
        userAgent: request.headers.get("User-Agent"),
      });
      return jsonResponse({ message: PASSKEY_CLIENT_SAFE_MESSAGE }, 400, request);
    }

    if (!verification.authenticationInfo.userVerified) {
      await logAuditEvent(env, {
        userId: session.id,
        eventType: "login_failed",
        status: "failure",
        details: { reason: "passkey_user_not_verified", context: "webauthn_stepup" },
        ip: getRequestIp(request),
        userAgent: request.headers.get("User-Agent"),
      });
      return jsonResponse({ message: PASSKEY_CLIENT_SAFE_MESSAGE }, 400, request);
    }

    const newCounter = verification.authenticationInfo.newCounter;
    await env.AUTH_DB.prepare(
      "UPDATE webauthn_credentials SET counter = ?, last_used_at = ? WHERE id = ?"
    )
      .bind(newCounter, new Date().toISOString(), storedCredential.id)
      .run();

    await env.AUTH_DB.prepare(
      "UPDATE sessions SET last_stepup_at = ? WHERE session_id_hash = ?"
    )
      .bind(new Date().toISOString(), session.sessionIdHash)
      .run();

    await logAuditEvent(env, {
      userId: session.id,
      eventType: "step_up_success",
      status: "success",
      details: { credentialIdPrefix: credentialId.substring(0, 16) + "...", context: "webauthn_stepup" },
      ip: getRequestIp(request),
      userAgent: request.headers.get("User-Agent"),
    });

    return jsonResponse({ ok: true }, 200, request);
  }

  if (pathname === "/api/auth/passkeys" && method === "GET") {
    if (!env.AUTH_DB) {
      return jsonResponse({ message: "Auth database not configured" }, 501, request);
    }
    const session = await getSessionFromRequest(env, request, { rotate: true });
    if (!session) {
      return jsonResponse({ message: "Unauthorized" }, 401, request);
    }
    const hasDisplayNameColumn = await webauthnCredentialsHaveDisplayNameColumn(env);
    const rows = hasDisplayNameColumn
      ? await env.AUTH_DB.prepare(
          "SELECT id, credential_id, display_name, transports, created_at, last_used_at FROM webauthn_credentials WHERE user_id = ? ORDER BY created_at DESC"
        )
          .bind(session.id)
          .all<{ id: string; credential_id: string; display_name: string | null; transports: string | null; created_at: string; last_used_at: string | null }>()
      : await env.AUTH_DB.prepare(
          "SELECT id, credential_id, transports, created_at, last_used_at FROM webauthn_credentials WHERE user_id = ? ORDER BY created_at DESC"
        )
          .bind(session.id)
          .all<{ id: string; credential_id: string; transports: string | null; created_at: string; last_used_at: string | null }>();

    const passkeys = (rows.results || []).map((row) => {
      const transports = parseTransports(row.transports) || null;
      const generatedLabel = getPasskeyLabel(transports);
      const displayName = "display_name" in row && typeof row.display_name === "string" ? row.display_name.trim() : "";
      return {
        id: row.id,
        createdAt: row.created_at,
        lastUsedAt: row.last_used_at,
        transports,
        label: displayName || generatedLabel,
        generatedLabel,
        customLabel: displayName || null,
      };
    });

    const headers = new Headers(getCorsHeaders(request));
    headers.set("Content-Type", "application/json");
    applyRotatedSession(request, headers, session);
    return new Response(JSON.stringify({ ok: true, passkeys }), { status: 200, headers });
  }

  if (pathname.startsWith("/api/auth/passkeys/") && method === "PATCH") {
    if (!env.AUTH_DB) {
      return jsonResponse({ message: "Auth database not configured" }, 501, request);
    }
    const session = await getSessionFromRequest(env, request, { rotate: false });
    if (!session) {
      return jsonResponse({ message: "Unauthorized" }, 401, request);
    }

    const hasDisplayNameColumn = await webauthnCredentialsHaveDisplayNameColumn(env);
    if (!hasDisplayNameColumn) {
      return jsonResponse(
        { message: "Passkey naming is not available until the latest database migration is applied." },
        409,
        request,
      );
    }

    const passkeyId = pathname.slice("/api/auth/passkeys/".length).trim();
    if (!passkeyId) {
      return jsonResponse({ message: "Passkey not found" }, 404, request);
    }

    let body: Record<string, unknown>;
    try {
      body = await readJsonBody(request);
    } catch {
      return jsonResponse({ message: "Invalid JSON" }, 400, request);
    }

    const displayName = normalizePasskeyDisplayName(body.displayName);
    const existing = await env.AUTH_DB.prepare(
      "SELECT id, display_name FROM webauthn_credentials WHERE id = ? AND user_id = ? LIMIT 1"
    )
      .bind(passkeyId, session.id)
      .first<{ id: string; display_name: string | null }>();
    if (!existing) {
      return jsonResponse({ message: "Passkey not found" }, 404, request);
    }

    await env.AUTH_DB.prepare("UPDATE webauthn_credentials SET display_name = ? WHERE id = ? AND user_id = ?")
      .bind(displayName, passkeyId, session.id)
      .run();

    await logAuditEvent(env, {
      userId: session.id,
      eventType: "passkey_renamed",
      status: "success",
      details: { passkeyId, renamed: true },
      ip: getRequestIp(request),
      userAgent: request.headers.get("User-Agent"),
    });

    return jsonResponse({ ok: true, displayName }, 200, request);
  }

  if (pathname.startsWith("/api/auth/passkeys/") && method === "DELETE") {
    if (!env.AUTH_DB) {
      return jsonResponse({ message: "Auth database not configured" }, 501, request);
    }
    const session = await getSessionFromRequest(env, request, { rotate: false });
    if (!session) {
      return jsonResponse({ message: "Unauthorized" }, 401, request);
    }

    const passkeyId = pathname.slice("/api/auth/passkeys/".length).trim();
    if (!passkeyId) {
      return jsonResponse({ message: "Passkey not found" }, 404, request);
    }

    const existing = await env.AUTH_DB.prepare(
      "SELECT id FROM webauthn_credentials WHERE id = ? AND user_id = ? LIMIT 1"
    )
      .bind(passkeyId, session.id)
      .first<{ id: string }>();
    if (!existing) {
      return jsonResponse({ message: "Passkey not found" }, 404, request);
    }

    const hasPasskeys = (await countUsableWebauthnCredentialsForUser(env, session.id)) > 0;
    const verifiedTotpRow = await env.AUTH_DB.prepare(
      "SELECT encrypted_secret FROM totp_secrets WHERE user_id = ? AND verified = 1 LIMIT 1"
    )
      .bind(session.id)
      .first<{ encrypted_secret: string }>();

    const deleteGate = await gateSecondFactorForAccountTakeover(
      env,
      request,
      session,
      hasPasskeys,
      verifiedTotpRow,
      undefined,
      SENSITIVE_ACTION_TOTP_RL.KEY_PREFIX_PASSKEY_RESET,
      "passkey_reset",
    );
    if (deleteGate) return deleteGate;

    await env.AUTH_DB.prepare("DELETE FROM webauthn_credentials WHERE id = ? AND user_id = ?")
      .bind(passkeyId, session.id)
      .run();

    await logAuditEvent(env, {
      userId: session.id,
      eventType: "passkey_deleted",
      status: "success",
      details: { passkeyId },
      ip: getRequestIp(request),
      userAgent: request.headers.get("User-Agent"),
    });

    return jsonResponse({ ok: true }, 200, request);
  }

  if (pathname === "/api/auth/passkeys/reset" && method === "POST") {
    if (!env.AUTH_DB) {
      return jsonResponse({ message: "Auth database not configured" }, 501, request);
    }
    const session = await getSessionFromRequest(env, request, { rotate: false });
    if (!session) {
      return jsonResponse({ message: "Unauthorized" }, 401, request);
    }

    let resetBody: Record<string, unknown>;
    try {
      resetBody = await readJsonBody(request);
    } catch {
      return jsonResponse({ message: "Invalid JSON" }, 400, request);
    }
    const hasPasskeysReset = (await countUsableWebauthnCredentialsForUser(env, session.id)) > 0;
    const verifiedTotpRowReset = await env.AUTH_DB.prepare(
      "SELECT encrypted_secret FROM totp_secrets WHERE user_id = ? AND verified = 1 LIMIT 1",
    )
      .bind(session.id)
      .first<{ encrypted_secret: string }>();

    const resetGate = await gateSecondFactorForAccountTakeover(
      env,
      request,
      session,
      hasPasskeysReset,
      verifiedTotpRowReset,
      resetBody.totpCode,
      SENSITIVE_ACTION_TOTP_RL.KEY_PREFIX_PASSKEY_RESET,
      "passkey_reset",
    );
    if (resetGate) return resetGate;

    await env.AUTH_DB.prepare(
      "DELETE FROM webauthn_credentials WHERE user_id = ?"
    )
      .bind(session.id)
      .run();

    // Audit log: passkey reset
    await logAuditEvent(env, {
      userId: session.id,
      eventType: "passkey_reset",
      status: "success",
      details: { action: "all_passkeys_deleted" },
      ip: getRequestIp(request),
      userAgent: request.headers.get("User-Agent"),
    });

    // Revoke all sessions on passkey reset (security event)
    await revokeAllUserSessions(env, session.id, "passkey_reset");

    return jsonResponse({ ok: true }, 200, request);
  }

  if (pathname === "/api/auth/sessions" && method === "GET") {
    if (!env.AUTH_DB) {
      return jsonResponse({ message: "Auth database not configured" }, 501, request);
    }
    const session = await getSessionFromRequest(env, request, { rotate: true });
    if (!session) {
      return jsonResponse({ message: "Unauthorized" }, 401, request);
    }
    const rows = await env.AUTH_DB.prepare(
      "SELECT id, session_id_hash, expires_at, absolute_expires_at, revoked_at, revoked_reason, created_at, last_seen_at, user_agent, ip, city, country, device_label FROM sessions WHERE user_id = ? AND revoked_at IS NULL ORDER BY created_at DESC"
    )
      .bind(session.id)
      .all<{
        id: string;
        session_id_hash: string;
        expires_at: string | null;
        absolute_expires_at: string | null;
        revoked_at: string | null;
        revoked_reason: string | null;
        created_at: string | null;
        last_seen_at: string | null;
        user_agent: string | null;
        ip: string | null;
        city: string | null;
        country: string | null;
        device_label: string | null;
      }>();

    const sessions = (rows.results || []).map((row) => ({
      id: row.id,
      createdAt: row.created_at,
      lastSeenAt: row.last_seen_at,
      expiresAt: row.expires_at,
      absoluteExpiresAt: row.absolute_expires_at,
      revokedAt: row.revoked_at,
      revokedReason: row.revoked_reason,
      userAgent: row.user_agent,
      ip: row.ip,
      city: row.city,
      country: row.country,
      deviceLabel: row.device_label,
      current: row.session_id_hash === session.sessionIdHash,
    }));

    const headers = new Headers(getCorsHeaders(request));
    headers.set("Content-Type", "application/json");
    applyRotatedSession(request, headers, session);
    return new Response(JSON.stringify({ ok: true, sessions }), { status: 200, headers });
  }

  if (pathname === "/api/auth/sessions/revoke" && method === "POST") {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ message: "Invalid JSON" }, 400, request);
    }
    const sessionId = typeof body?.sessionId === "string" ? body.sessionId : null;
    if (!env.AUTH_DB) {
      return jsonResponse({ message: "Auth database not configured" }, 501, request);
    }
    const session = await getSessionFromRequest(env, request, { rotate: false });
    if (!session) {
      return jsonResponse({ message: "Unauthorized" }, 401, request);
    }
    if (!sessionId) {
      return jsonResponse({ message: "Missing sessionId" }, 400, request);
    }
    const nowIso = new Date().toISOString();
    await env.AUTH_DB.prepare(
      "UPDATE sessions SET revoked_at = ?, revoked_reason = ? WHERE id = ? AND user_id = ?"
    )
      .bind(nowIso, "user_revoked", sessionId, session.id)
      .run();

    const headers = new Headers(getCorsHeaders(request));
    headers.set("Content-Type", "application/json");
    if (sessionId === session.sessionRowId) {
      headers.set("Set-Cookie", clearSessionCookieHeader(getSessionCookieKindForRequest(request)));
    }
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
  }

  if (pathname === "/api/auth/sessions/revoke-all" && method === "POST") {
    if (!env.AUTH_DB) {
      return jsonResponse({ message: "Auth database not configured" }, 501, request);
    }
    const session = await getSessionFromRequest(env, request, { rotate: false });
    if (!session) {
      return jsonResponse({ message: "Unauthorized" }, 401, request);
    }
    const nowIso = new Date().toISOString();
    // Revoke all sessions except the current one
    await env.AUTH_DB.prepare(
      "UPDATE sessions SET revoked_at = ?, revoked_reason = ? WHERE user_id = ? AND revoked_at IS NULL AND session_id_hash != ?"
    )
      .bind(nowIso, "user_revoked_all", session.id, session.sessionIdHash)
      .run();

    const headers = new Headers(getCorsHeaders(request));
    headers.set("Content-Type", "application/json");
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
  }

  if (pathname === "/api/auth/recovery-codes/status" && method === "GET") {
    if (!env.AUTH_DB) {
      return jsonResponse({ message: "Auth database not configured" }, 501, request);
    }
    const session = await getSessionFromRequest(env, request, { rotate: true });
    if (!session) {
      return jsonResponse({ message: "Unauthorized" }, 401, request);
    }
    const stats = await env.AUTH_DB.prepare(
      "SELECT COUNT(*) as remaining, MAX(created_at) as generated_at FROM recovery_codes WHERE user_id = ? AND used_at IS NULL"
    )
      .bind(session.id)
      .first<{ remaining: number; generated_at: string | null }>();

    const headers = new Headers(getCorsHeaders(request));
    headers.set("Content-Type", "application/json");
    applyRotatedSession(request, headers, session);
    return new Response(JSON.stringify({ ok: true, remaining: stats?.remaining ?? 0, generatedAt: stats?.generated_at ?? null }), { status: 200, headers });
  }

  if (pathname === "/api/auth/recovery-codes/generate" && method === "POST") {
    if (!env.AUTH_DB) {
      return jsonResponse({ message: "Auth database not configured" }, 501, request);
    }
    const session = await getSessionFromRequest(env, request, { rotate: false });
    if (!session) {
      return jsonResponse({ message: "Unauthorized" }, 401, request);
    }

    let recoveryBody: Record<string, unknown>;
    try {
      recoveryBody = await readJsonBody(request);
    } catch {
      return jsonResponse({ message: "Invalid JSON" }, 400, request);
    }
    const hasPasskeysForRecovery = (await countUsableWebauthnCredentialsForUser(env, session.id)) > 0;
    const verifiedTotpRowRecovery = await env.AUTH_DB.prepare(
      "SELECT encrypted_secret FROM totp_secrets WHERE user_id = ? AND verified = 1 LIMIT 1",
    )
      .bind(session.id)
      .first<{ encrypted_secret: string }>();

    const recoveryGate = await gateSecondFactorForAccountTakeover(
      env,
      request,
      session,
      hasPasskeysForRecovery,
      verifiedTotpRowRecovery,
      recoveryBody.totpCode,
      SENSITIVE_ACTION_TOTP_RL.KEY_PREFIX_RECOVERY_GENERATE,
      "recovery_code_generate",
      RECOVERY_CODE_STEP_UP_WINDOW_SECONDS,
      true,
    );
    if (recoveryGate) return recoveryGate;

    // Delete only unused codes; used codes are retained for audit/forensics (used_at set)
    await env.AUTH_DB.prepare("DELETE FROM recovery_codes WHERE user_id = ? AND used_at IS NULL")
      .bind(session.id)
      .run();

    const codes: string[] = [];
    for (let i = 0; i < 8; i += 1) {
      const code = generateRecoveryCode();
      const salt = randomId(RECOVERY_CODE_SALT_LENGTH);
      const codeHash = await hashRecoveryCode(code, salt);
      await env.AUTH_DB.prepare(
        "INSERT INTO recovery_codes (id, user_id, code_hash, salt, created_at) VALUES (?, ?, ?, ?, ?)"
      )
        .bind(crypto.randomUUID(), session.id, codeHash, salt, new Date().toISOString())
        .run();
      codes.push(code);
    }

    // Audit log: recovery codes generated
    await logAuditEvent(env, {
      userId: session.id,
      eventType: "recovery_code_generated",
      status: "success",
      details: { codesCount: codes.length },
      ip: getRequestIp(request),
      userAgent: request.headers.get("User-Agent"),
    });

    // Notify user by email so they know if they did not initiate this (account may be compromised)
    const userEmail = (session.email ?? "").trim().toLowerCase();
    if (userEmail) {
      const recoveryEmailWebOrigin = getMagicLinkOrigin(env, request);
      const recoveryEmailLogoUrl = `${recoveryEmailWebOrigin}/brand/privateNote-logo-lockup.png`;
      const emailResult = await sendEmail(env, {
        to: userEmail,
        subject: "Recovery codes regenerated - PrivateNote",
        text: `Your PrivateNote recovery codes were regenerated. Your previous unused recovery codes no longer work.\n\nIf you did not do this, please secure your account (change password if applicable, revoke other sessions, and add or verify your passkey) from Security Settings.\n\nThis is an automated security notification.`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px;">
              <tr>
                <td>
                  <a href="${recoveryEmailWebOrigin}" style="text-decoration: none;">
                    <img src="${recoveryEmailLogoUrl}" alt="PrivateNote" width="200" border="0" style="display: block; max-width: 200px; height: auto; border: 0; outline: none;" />
                  </a>
                </td>
              </tr>
            </table>
            <h2>Recovery codes regenerated</h2>
            <p>Your PrivateNote recovery codes were regenerated. Your previous <strong>unused</strong> recovery codes no longer work.</p>
            <p>If you did not do this, please secure your account:</p>
            <ul>
              <li>Revoke other sessions from Security Settings</li>
              <li>Add or verify your passkey</li>
            </ul>
            <p style="color: #666; font-size: 14px;">This is an automated security notification.</p>
          </div>
        `,
      });
      if (!emailResult.ok) {
        console.error("[AUTH] Failed to send recovery-codes-regenerated email:", emailResult.error);
      }
    }

    return jsonResponse({ ok: true, codes }, 200, request);
  }

  if (pathname === "/api/auth/recovery/consume" && method === "POST") {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ message: "Invalid JSON" }, 400, request);
    }
    if (!env.AUTH_DB) {
      return jsonResponse({ message: "Auth database not configured" }, 501, request);
    }
    const email = normalizeEmail(typeof body?.email === "string" ? body.email : null);
    const code = typeof body?.code === "string" ? body.code.trim().toUpperCase() : null;
    if (!email || !code) {
      await jitterDelay();
      return jsonResponse({ message: "Invalid recovery attempt" }, 400, request);
    }

    const clientIp = getRequestIp(request);
    const requestUrl = new URL(request.url);
    const isLocal =
      requestUrl.hostname === "localhost" || requestUrl.hostname === "127.0.0.1";
    const kv = env.RATE_LIMIT_KV || env.AUTH_KV || env.NOTES_KV;
    let currentAttempts = 0;

    if (kv && !isLocal && clientIp) {
      const now = Math.floor(Date.now() / 1000);
      const windowStart = now - (now % RECOVERY_CODE_RATE_LIMIT.WINDOW_SECONDS);
      const rateLimitKey = `${RECOVERY_CODE_RATE_LIMIT.IP_KEY_PREFIX}${clientIp}`;

      try {
        const stored = (await kv.get(rateLimitKey, { type: "json" })) as {
          count?: number;
          windowStart?: number;
        } | null;

        if (stored && stored.windowStart === windowStart) {
          currentAttempts = stored.count || 0;
          if (currentAttempts >= RECOVERY_CODE_RATE_LIMIT.MAX_ATTEMPTS_PER_IP) {
            await logAuditEvent(env, {
              userId: null,
              eventType: "rate_limit_exceeded",
              status: "warning",
              details: {
                endpoint: "recovery_code_consume",
                limitType: "ip",
                ip: clientIp,
              },
              ip: clientIp,
              userAgent: request.headers.get("User-Agent"),
            });
            await jitterDelay();
            return jsonResponse(
              { message: "Too many recovery attempts from this network. Please try again later." },
              429,
              request,
            );
          }
          await kv.put(rateLimitKey, JSON.stringify({ count: currentAttempts + 1, windowStart }), {
            expirationTtl: RECOVERY_CODE_RATE_LIMIT.WINDOW_SECONDS + 10,
          });
          currentAttempts += 1;
        } else {
          await kv.put(rateLimitKey, JSON.stringify({ count: 1, windowStart }), {
            expirationTtl: RECOVERY_CODE_RATE_LIMIT.WINDOW_SECONDS + 10,
          });
          currentAttempts = 1;
        }

        if (currentAttempts > 1) {
          const progressiveDelay = Math.min(
            RECOVERY_CODE_RATE_LIMIT.PROGRESSIVE_BASE_DELAY_MS * Math.pow(2, currentAttempts - 1),
            RECOVERY_CODE_RATE_LIMIT.PROGRESSIVE_MAX_DELAY_MS,
          );
          await new Promise((resolve) => setTimeout(resolve, progressiveDelay));
        }
      } catch (error) {
        console.error("[RECOVERY_RATE_LIMIT] Error checking rate limit:", error);
        // Fail open on error
      }
    }

    const user = await env.AUTH_DB.prepare(
      "SELECT id, email FROM users WHERE email = ? LIMIT 1"
    )
      .bind(email)
      .first<{ id: string; email: string }>();
    if (!user?.id) {
      await jitterDelay();
      return jsonResponse({ message: "Invalid recovery attempt" }, 400, request);
    }

    const records = await env.AUTH_DB.prepare(
      "SELECT id, code_hash, salt FROM recovery_codes WHERE user_id = ? AND used_at IS NULL"
    )
      .bind(user.id)
      .all<{ id: string; code_hash: string; salt: string }>();

    // Constant-time comparison: always check all records to prevent timing attacks
    let matchedId: string | null = null;
    for (const record of records.results || []) {
      const candidate = await hashRecoveryCode(code, record.salt);
      if (constantTimeEquals(candidate, record.code_hash)) {
        matchedId = record.id;
        // Don't break - continue checking all records for constant-time behavior
      }
    }
    if (!matchedId) {
      await logAuditEvent(env, {
        userId: user.id,
        eventType: "recovery_code_failed",
        status: "failure",
        details: { reason: "invalid_code", attemptNumber: currentAttempts },
        ip: getRequestIp(request),
        userAgent: request.headers.get("User-Agent"),
      });
      void recordRecoveryConsumeAccountGuessTelemetry(env, kv ?? undefined, user.id, request, "invalid_code");
      await jitterDelay();
      return jsonResponse({ message: "Invalid recovery attempt" }, 400, request);
    }

    // Atomic consume: only update if still unused (prevents race where two requests use same code)
    const usedAt = new Date().toISOString();
    const updateResult = await env.AUTH_DB.prepare(
      "UPDATE recovery_codes SET used_at = ? WHERE id = ? AND used_at IS NULL"
    )
      .bind(usedAt, matchedId)
      .run();

    const rowsAffected = (updateResult?.meta as { changes?: number } | undefined)?.changes ?? -1;
    if (rowsAffected === 0) {
      // Code was already used (e.g. by a parallel request) — treat as invalid
      void recordRecoveryConsumeAccountGuessTelemetry(env, kv ?? undefined, user.id, request, "code_race");
      await jitterDelay();
      return jsonResponse({ message: "Invalid recovery attempt" }, 400, request);
    }

    // Reset per-IP recovery attempt counter and per-account telemetry on successful recovery
    if (kv) {
      try {
        if (clientIp) {
          await kv.delete(`${RECOVERY_CODE_RATE_LIMIT.IP_KEY_PREFIX}${clientIp}`);
        }
        await kv.delete(`${RECOVERY_CONSUME_ACCOUNT_TELEMETRY.KEY_PREFIX}${user.id}`);
      } catch (error) {
        console.error("[RECOVERY_RATE_LIMIT] Error clearing rate limit state:", error);
      }
    }

    await env.AUTH_DB.prepare(
      "UPDATE users SET status = ?, last_login_at = ?, updated_at = ? WHERE id = ?"
    )
      .bind(USER_STATUS_ACTIVE, new Date().toISOString(), new Date().toISOString(), user.id)
      .run();

    const session = await createSession(env, user.id, request, "recovery");

    // Audit log: recovery code used successfully
    await logAuditEvent(env, {
      userId: user.id,
      eventType: "recovery_code_used",
      status: "success",
      details: { recoveryCodeId: matchedId },
      ip: getRequestIp(request),
      userAgent: request.headers.get("User-Agent"),
    });

    // Audit log: login success
    await logAuditEvent(env, {
      userId: user.id,
      eventType: "login_success",
      status: "success",
      details: { authMethod: "recovery_code" },
      ip: getRequestIp(request),
      userAgent: request.headers.get("User-Agent"),
    });

    const headers = new Headers(getCorsHeaders(request));
    headers.set("Content-Type", "application/json");
    if (session?.sessionId) {
      headers.set("Set-Cookie", sessionCookie(session.sessionId, getSessionCookieKindForRequest(request)));
    }
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
  }

  if (pathname === "/api/auth/magic/send" && method === "POST") {
    console.log("[MAGIC_LINK] >>> Handler entered");
    try {
    let body: any;
    try {
      body = await request.json();
    } catch (jsonErr) {
      console.error("[MAGIC_LINK] JSON parse failed:", jsonErr);
      return jsonResponse({ message: "Invalid JSON" }, 400, request);
    }
    console.log("[MAGIC_LINK] Body parsed, email present:", !!body?.email);
    const email = normalizeEmail(typeof body?.email === "string" ? body.email : null);
    const locale = detectAuthEmailLocale(request, body?.locale);
    const isLocal = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    const responsePayload: Record<string, unknown> = {
      ok: true,
      message: "Check your email for a sign-in link.",
    };
    let magicSendPrepareCookie: string | null = null;

    if (!env.AUTH_DB) {
      console.error(
        "[MAGIC_LINK] AUTH_DB not configured, returning silent 200 — alert on this log line or on GET /api/admin/health/auth ≠ 200",
      );
      await jitterDelay();
      return jsonResponse(responsePayload, 200, request);
    }

    const kv = env.RATE_LIMIT_KV || env.AUTH_KV || env.NOTES_KV;
    const clientIp = getRequestIp(request);

    if (kv && !isLocal) {
      const now = Math.floor(Date.now() / 1000);
      const windowStart = now - (now % MAGIC_LINK_RATE_LIMIT.WINDOW_SECONDS);

      if (clientIp) {
        const ipKey = `${MAGIC_LINK_RATE_LIMIT.IP_KEY_PREFIX}${clientIp}:${windowStart}`;
        try {
          const ipCount = await kv.get(ipKey, { type: 'json' }) as { count: number } | null;
          if (ipCount && ipCount.count >= MAGIC_LINK_RATE_LIMIT.MAX_PER_IP) {
            console.error(`[MAGIC_LINK] ⛔ IP rate limited (${ipCount.count}/${MAGIC_LINK_RATE_LIMIT.MAX_PER_IP})`);
            await logAuditEvent(env, {
              userId: null,
              eventType: "rate_limit_exceeded",
              status: "warning",
              details: { endpoint: "magic_link_send", limitType: "ip", ip: clientIp },
              ip: clientIp,
              userAgent: request.headers.get("User-Agent"),
            });
            await jitterDelay();
            return jsonResponse(responsePayload, 200, request);
          }
          await kv.put(ipKey, JSON.stringify({ count: (ipCount?.count || 0) + 1 }), {
            expirationTtl: MAGIC_LINK_RATE_LIMIT.WINDOW_SECONDS + 10,
          });
        } catch (error) {
          console.error('[MAGIC_LINK_RATE_LIMIT] IP rate limit error:', error);
        }
      }

      if (email && isPlausibleEmailFormat(email)) {
        const emailKey = `${MAGIC_LINK_RATE_LIMIT.EMAIL_KEY_PREFIX}${email}:${windowStart}`;
        try {
          const emailCount = await kv.get(emailKey, { type: 'json' }) as { count: number } | null;
          if (emailCount && emailCount.count >= MAGIC_LINK_RATE_LIMIT.MAX_PER_EMAIL) {
            console.error(`[MAGIC_LINK] ⛔ Email rate limited (${emailCount.count}/${MAGIC_LINK_RATE_LIMIT.MAX_PER_EMAIL})`);
            await logAuditEvent(env, {
              userId: null,
              eventType: "rate_limit_exceeded",
              status: "warning",
              details: { endpoint: "magic_link_send", limitType: "email", emailMasked: email.replace(/(.{2})(.*)(@.*)/, "$1***$3") },
              ip: clientIp,
              userAgent: request.headers.get("User-Agent"),
            });
            await jitterDelay();
            return jsonResponse(responsePayload, 200, request);
          }
          await kv.put(emailKey, JSON.stringify({ count: (emailCount?.count || 0) + 1 }), {
            expirationTtl: MAGIC_LINK_RATE_LIMIT.WINDOW_SECONDS + 10,
          });
        } catch (error) {
          console.error('[MAGIC_LINK_RATE_LIMIT] Email rate limit error:', error);
        }
      }
    }

    if (!isLocal && env.TURNSTILE_SECRET_KEY) {
      const token = body?.turnstileToken;
      if (!token) {
        console.error(
          "[MAGIC_LINK] Not sending email: Turnstile is required (TURNSTILE_SECRET_KEY set) but request had no turnstileToken. " +
            "Ensure Pages has VITE_TURNSTILE_SITE_KEY and the sign-in form renders Turnstile (preview deployments need this env var too)."
        );
        await jitterDelay();
        return jsonResponse(responsePayload, 200, request);
      }
      const isHuman = await verifyTurnstile(token, request, env);
      if (!isHuman) {
        console.error(
          "[MAGIC_LINK] Not sending email: Turnstile siteverify failed (expired token, wrong domain, or bot). " +
            "Check Turnstile widget hostnames in Cloudflare dashboard match your Pages URL."
        );
        await jitterDelay();
        return jsonResponse(responsePayload, 200, request);
      }
    }

    if (!email || !isPlausibleEmailFormat(email)) {
      console.error("[MAGIC_LINK] Invalid or missing email, silently returning 200");
      await jitterDelay();
      return jsonResponse(responsePayload, 200, request);
    }

    console.log("[MAGIC_LINK] Email validated, getting/creating user...");
    const userResult = await getOrCreateUser(env, email, USER_STATUS_PENDING);
    const userId = userResult?.id ?? null;
    const intent: "login" | "signup" = userResult?.wasCreated ? "signup" : "login";

    if (!userId) {
      console.error("[MAGIC_LINK] getOrCreateUser returned no userId");
    }

    if (userId) {
      const token = randomId(32);
      const signInCode = generateMagicEmailOtpDigits();
      const otpHash = await sha256Base64Url(signInCode);
      const magicCtx = await magicLinkSoftContext(request);
      const storeResult = await storeMagicLink(env, token, {
        userId,
        email,
        intent,
        createdAt: Date.now(),
        magicIpPrefix: magicCtx.ipPrefix,
        magicUaHash: magicCtx.uaHash,
        otpHash,
      }, request);

      if (!storeResult.ok) {
        if (storeResult.reason === "hmac_required" || storeResult.reason === "kv_unavailable") {
          await logAuditEvent(env, {
            userId,
            eventType: "magic_link_failed",
            status: "failure",
            details: {
              reason:
                storeResult.reason === "hmac_required" ? "auth_secret_key_missing" : "auth_kv_missing",
              intent,
            },
            ip: getRequestIp(request),
            userAgent: request.headers.get("User-Agent"),
          });
        }
        console.error(
          `[MAGIC_LINK] storeMagicLink failed — ${storeResult.reason} ` +
            `(operational: users see generic 200; fix AUTH_SECRET_KEY / AUTH_KV+NOTES_KV bindings or see GET /api/admin/health/auth)`,
        );
      }

      if (storeResult.ok) {
        const magicOrigin = getMagicLinkOrigin(env, request);
        const returnTo = sanitizeAuthReturnTo(body?.returnTo);
        // Query param is non-authenticating: session is only created on explicit POST after the user clicks Continue.
        const magicUrl = appendMagicLinkReturnTo(
          `${magicOrigin}/magic?t=${encodeURIComponent(token)}`,
          returnTo,
        );
        const enableImmediateCodeEntry = async () => {
          const sendNonce = await issueMagicPrepareNonce(
            env,
            request,
            token,
            { risk: "low", otpHash, requireOtp: true },
            userId,
          );
          if (sendNonce) {
            magicSendPrepareCookie = magicPrepareCookieHeader(sendNonce);
            responsePayload.signInToken = token;
          }
        };
        console.log(`[MAGIC_LINK] Prepared link for ${intent}, origin=${magicOrigin}, isLocal=${isLocal}`);

        if (isLocal) {
          responsePayload.debugMagicLink = magicUrl;
          responsePayload.debugSignInCode = signInCode;
          await enableImmediateCodeEntry();
          await logAuditEvent(env, {
            userId,
            eventType: "magic_link_sent",
            status: "success",
            details: { intent, emailMasked: email.replace(/(.{2})(.*)(@.*)/, "$1***$3"), channel: "debug" },
            ip: getRequestIp(request),
            userAgent: request.headers.get("User-Agent"),
          });
        } else {
          console.log("[MAGIC_LINK] Calling sendMagicLinkEmail via Resend...");
          const sendResult = await sendMagicLinkEmail(env, email, magicUrl, {
            signInCode,
            locale,
          });
          if (!sendResult.ok) {
            console.error("[MAGIC_LINK] Resend did not send email:", sendResult.error);
            await logAuditEvent(env, {
              userId,
              eventType: "magic_link_email_failed",
              status: "failure",
              details: {
                intent,
                emailMasked: email.replace(/(.{2})(.*)(@.*)/, "$1***$3"),
                error: sendResult.error?.slice(0, 500) ?? "unknown",
              },
              ip: getRequestIp(request),
              userAgent: request.headers.get("User-Agent"),
            });
          } else {
            console.log("[MAGIC_LINK] ✅ Email sent successfully via Resend");
            await enableImmediateCodeEntry();
            await logAuditEvent(env, {
              userId,
              eventType: "magic_link_sent",
              status: "success",
              details: { intent, emailMasked: email.replace(/(.{2})(.*)(@.*)/, "$1***$3") },
              ip: getRequestIp(request),
              userAgent: request.headers.get("User-Agent"),
            });
          }
        }
      }
    }

    await jitterDelay();
    console.log("[MAGIC_LINK] <<< Handler complete, returning 200");
    const response = jsonResponse(responsePayload, 200, request);
    if (magicSendPrepareCookie) {
      response.headers.append("Set-Cookie", magicSendPrepareCookie);
    }
    return response;
    } catch (handlerErr) {
      console.error("[MAGIC_LINK] !!! Unhandled error in magic/send handler:", handlerErr);
      return jsonResponse({ ok: true, message: "Check your email for a sign-in link." }, 200, request);
    }
  }

  if (pathname === "/api/auth/magic/prepare" && method === "POST") {
    const gate = assertTrustedJsonPost(request);
    if (gate) return gate;
    const body = (await request.json().catch(() => ({}))) as { token?: unknown };
    const token = typeof body.token === "string" ? body.token : "";
    if (!token) {
      return jsonResponse({ message: "Missing token" }, 400, request);
    }
    return respondToMagicLinkPrepare(env, request, token);
  }

  if (pathname === "/api/auth/magic/prepare" && (method === "GET" || method === "HEAD")) {
    if (method === "HEAD") {
      return new Response(null, { status: 405, headers: getCorsHeaders(request) });
    }
    return jsonResponse({ message: "Use POST with { \"token\": \"...\" } from valid application/json same-origin context." }, 405, request);
  }

  if (pathname === "/api/auth/magic/consume" && method === "POST") {
    const gate = assertTrustedJsonPost(request);
    if (gate) return gate;
    const body = (await request.json().catch(() => ({}))) as { token?: unknown; emailCode?: unknown };
    const token = typeof body.token === "string" ? body.token : "";
    if (!token) {
      return jsonResponse({ message: "Missing token" }, 400, request);
    }
    return respondToMagicLinkConsume(env, request, token, body.emailCode);
  }

  if (pathname === "/api/auth/magic/consume" && (method === "GET" || method === "HEAD")) {
    if (method === "HEAD") {
      return new Response(null, { status: 405, headers: getCorsHeaders(request) });
    }
    return jsonResponse(
      {
        message: "Use POST with { \"token\": \"...\" }. Magic link tokens are not accepted in the URL query.",
      },
      405,
      request,
    );
  }

  if (pathname === "/api/auth/logout" && method === "POST") {
    const headers = new Headers(getCorsHeaders(request));
    headers.set("Content-Type", "application/json");
    const cookies = parseCookies(request.headers.get("Cookie"));
    const kind = getSessionCookieKindForRequest(request);
    const sessionId = cookies[sessionCookieNameForKind(kind)];
    if (sessionId && env.AUTH_DB) {
      const sessionHash = await sha256Base64Url(sessionId);
      await env.AUTH_DB.prepare("UPDATE sessions SET revoked_at = ? WHERE session_id_hash = ?")
        .bind(new Date().toISOString(), sessionHash)
        .run();
    }
    headers.set("Set-Cookie", clearSessionCookieHeader(kind));
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
  }

  if (pathname === "/api/auth/session" && method === "GET") {
    const session = await getSessionFromRequest(env, request, { rotate: true, allowPendingTotp: true });
    if (!session) {
      return jsonResponse({ authenticated: false }, 200, request);
    }
    if (!session.authComplete) {
      return jsonResponse({ authenticated: false, totpRequired: true }, 200, request);
    }
    const headers = new Headers(getCorsHeaders(request));
    headers.set("Content-Type", "application/json");
    if (session.newSessionId) {
      headers.set(
        "Set-Cookie",
        sessionCookie(session.newSessionId, getSessionCookieKindForRequest(request)),
      );
    }
    return new Response(
      JSON.stringify({
        authenticated: true,
        user: { id: session.id, email: session.email },
      }),
      { status: 200, headers }
    );
  }

  // ============================================================================
  // EMAIL CHANGE ENDPOINTS
  // ============================================================================

  if (pathname === "/api/auth/email/change/request" && method === "POST") {
    if (!env.AUTH_DB) {
      return jsonResponse({ message: "Auth database not configured" }, 501, request);
    }
    const session = await getSessionFromRequest(env, request, { rotate: false });
    if (!session) {
      return jsonResponse({ message: "Unauthorized" }, 401, request);
    }

    let emailChangeBody: Record<string, unknown>;
    try {
      emailChangeBody = await readJsonBody(request);
    } catch {
      return jsonResponse({ message: "Invalid JSON" }, 400, request);
    }
    const newEmail = emailChangeBody.newEmail;
    const emailChangeTotpCode = emailChangeBody.totpCode;

    const hasPasskeys = (await countUsableWebauthnCredentialsForUser(env, session.id)) > 0;

    const verifiedTotpRow = await env.AUTH_DB.prepare(
      "SELECT encrypted_secret FROM totp_secrets WHERE user_id = ? AND verified = 1 LIMIT 1",
    )
      .bind(session.id)
      .first<{ encrypted_secret: string }>();

    const secondFactorBlock = await gateSecondFactorForAccountTakeover(
      env,
      request,
      session,
      hasPasskeys,
      verifiedTotpRow,
      emailChangeTotpCode,
      SENSITIVE_ACTION_TOTP_RL.KEY_PREFIX_EMAIL_CHANGE,
      "email_change_request",
    );
    if (secondFactorBlock) return secondFactorBlock;

    if (!newEmail || typeof newEmail !== "string") {
      return jsonResponse({ message: "New email is required" }, 400, request);
    }

    const normalizedNewEmail = newEmail.trim().toLowerCase();
    const normalizedCurrentEmail = (session.email ?? "").trim().toLowerCase();

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedNewEmail)) {
      return jsonResponse({ message: "Invalid email format" }, 400, request);
    }

    // Can't change to same email
    if (normalizedNewEmail === normalizedCurrentEmail) {
      return jsonResponse({ message: "New email must be different from current email" }, 400, request);
    }

    // Check if new email is already in use
    const existingUser = await env.AUTH_DB.prepare("SELECT id FROM users WHERE email = ?")
      .bind(normalizedNewEmail)
      .first<{ id: string }>();

    if (existingUser) {
      // If it's the same user's account, we can reveal this (no enumeration risk)
      if (existingUser.id === session.id) {
        await logAuditEvent(env, {
          userId: session.id,
          eventType: "email_change_failed",
          status: "failure",
          details: { reason: "email_already_current", newEmailMasked: normalizedNewEmail.replace(/(.{2})(.*)(@.*)/, "$1***$3") },
          ip: getRequestIp(request),
          userAgent: request.headers.get("User-Agent"),
        });
        return jsonResponse({ message: "This email address is already your current email address" }, 400, request);
      }

      // Another account already uses this address. Caller is authenticated, so a clear error is safe
      // (unlike magic-link email probing) and avoids a fake "sent" when no verification email is delivered.
      await logAuditEvent(env, {
        userId: session.id,
        eventType: "email_change_failed",
        status: "failure",
        details: { reason: "email_in_use", newEmailMasked: normalizedNewEmail.replace(/(.{2})(.*)(@.*)/, "$1***$3") },
        ip: getRequestIp(request),
        userAgent: request.headers.get("User-Agent"),
      });
      return jsonResponse(
        {
          message:
            "That email address is already registered to another account. Use a different address, or sign in with that account.",
          code: "email_change_email_in_use",
        },
        400,
        request,
      );
    }

    // Generate verification token
    const token = randomId(32);
    const tokenHash = await sha256Base64Url(token);

    // Store the email change request in KV
    const kv = getAuthKv(env);
    if (!kv) {
      return jsonResponse({ message: "Auth storage not configured" }, 501, request);
    }

    const payload = {
      userId: session.id,
      currentEmail: normalizedCurrentEmail,
      newEmail: normalizedNewEmail,
      createdAt: new Date().toISOString(),
    };

    await kv.put(`${AUTH_EMAIL_CHANGE.PREFIX}${tokenHash}`, JSON.stringify(payload), {
      expirationTtl: AUTH_EMAIL_CHANGE.TTL_SECONDS,
    });

    // Send verification email to new address (same origin rules as magic links)
    const webOrigin = getMagicLinkOrigin(env, request);
    const verifyUrl = `${webOrigin}/auth/email-change?token=${encodeURIComponent(token)}`;

    console.log(`[AUTH] Email change request: userId=${session.id}, currentEmail=${normalizedCurrentEmail}, newEmail=${normalizedNewEmail}`);

    const emailResult = await sendEmail(env, {
      to: normalizedNewEmail,
      subject: "Verify your new email address - PrivateNote",
      text: `You requested to change your email address for your PrivateNote account.\n\nOpen the link below in your browser, then press Confirm on the page to finish:\n${verifyUrl}\n\nThis link expires in 1 hour.\n\nIf you didn't request this change, please ignore this email and your account will remain unchanged.`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Verify your new email address</h2>
          <p>You requested to change your email address for your PrivateNote account.</p>
          <p>Open the link below, then press <strong>Confirm new email</strong> on the page to apply the change (this prevents automated link scanning from completing the update).</p>
          <p style="margin: 24px 0;">
            <a href="${verifyUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">
              Continue to verification
            </a>
          </p>
          <p style="color: #666; font-size: 14px;">This link expires in 1 hour.</p>
          <p style="color: #666; font-size: 14px;">If you didn't request this change, please ignore this email and your account will remain unchanged.</p>
        </div>
      `,
    });

    if (!emailResult.ok) {
      console.error("[AUTH] Failed to send email change verification:", emailResult.error);
      await logAuditEvent(env, {
        userId: session.id,
        eventType: "email_change_failed",
        status: "failure",
        details: { reason: "email_send_failed", newEmailMasked: normalizedNewEmail.replace(/(.{2})(.*)(@.*)/, "$1***$3") },
        ip: getRequestIp(request),
        userAgent: request.headers.get("User-Agent"),
      });
      return jsonResponse({ message: "Failed to send verification email" }, 500, request);
    }

    console.log(`[AUTH] Email change verification email sent successfully to ${normalizedNewEmail}`);

    await logAuditEvent(env, {
      userId: session.id,
      eventType: "email_change_requested",
      status: "success",
      details: {
        currentEmailMasked: normalizedCurrentEmail.replace(/(.{2})(.*)(@.*)/, "$1***$3"),
        newEmailMasked: normalizedNewEmail.replace(/(.{2})(.*)(@.*)/, "$1***$3"),
      },
      ip: getRequestIp(request),
      userAgent: request.headers.get("User-Agent"),
    });

    return jsonResponse({ ok: true, message: "Verification email sent to new address" }, 200, request);
  }

  if (pathname === "/api/auth/email/change/verify" && method === "GET") {
    return jsonResponse(
      {
        message:
          'Open this link in your browser, then press Confirm on the page. Tokens are not accepted via GET (avoids link prefetch consuming them).',
        code: "email_change_confirm_required",
      },
      405,
      request,
    );
  }

  if (pathname === "/api/auth/email/change/verify" && method === "POST") {
    const gate = assertTrustedJsonPost(request);
    if (gate) return gate;

    if (!env.AUTH_DB) {
      return jsonResponse({ message: "Auth database not configured" }, 501, request);
    }

    const body = (await request.json().catch(() => ({}))) as { token?: unknown };
    const token = typeof body.token === "string" ? body.token : "";

    if (!token) {
      return jsonResponse(
        { message: "Missing verification token", code: "email_change_token_missing" },
        400,
        request,
      );
    }

    const kv = getAuthKv(env);
    if (!kv) {
      return jsonResponse({ message: "Auth storage not configured" }, 501, request);
    }

    const tokenHash = await sha256Base64Url(token);
    const key = `${AUTH_EMAIL_CHANGE.PREFIX}${tokenHash}`;
    const value = await kv.get(key);

    if (!value) {
      return jsonResponse(
        { message: "Invalid or expired verification link", code: "email_change_token_invalid" },
        400,
        request,
      );
    }

    const parsedPayload = parseEmailChangeKvPayload(value);
    if (!parsedPayload.ok) {
      return jsonResponse(
        { message: "Invalid or corrupted verification data", code: "email_change_payload_invalid" },
        400,
        request,
      );
    }
    const payload = parsedPayload.payload;

    // Delete token immediately after payload validates (one-time use)
    await kv.delete(key);

    // Check if user still exists (they might have been deleted after requesting email change)
    const userExists = await env.AUTH_DB.prepare("SELECT id FROM users WHERE id = ?")
      .bind(payload.userId)
      .first<{ id: string }>();

    if (!userExists) {
      // User was deleted - don't log audit (would fail FK constraint)
      console.warn("[AUTH] Email change verification for deleted user:", payload.userId);
      return jsonResponse(
        { message: "Account no longer exists", code: "email_change_account_gone" },
        400,
        request,
      );
    }

    // Double-check new email isn't taken (race condition protection)
    const existingUser = await env.AUTH_DB.prepare("SELECT id FROM users WHERE email = ? AND id != ?")
      .bind(payload.newEmail, payload.userId)
      .first<{ id: string }>();

    if (existingUser) {
      await logAuditEvent(env, {
        userId: payload.userId,
        eventType: "email_change_failed",
        status: "failure",
        details: { reason: "email_taken_race", newEmailMasked: payload.newEmail.replace(/(.{2})(.*)(@.*)/, "$1***$3") },
        ip: getRequestIp(request),
        userAgent: request.headers.get("User-Agent"),
      });
      return jsonResponse(
        { message: "This email is no longer available", code: "email_change_email_unavailable" },
        400,
        request,
      );
    }

    // Update user's email
    await env.AUTH_DB.prepare("UPDATE users SET email = ?, email_verified = 1, updated_at = ? WHERE id = ?")
      .bind(payload.newEmail, new Date().toISOString(), payload.userId)
      .run();

    await logAuditEvent(env, {
      userId: payload.userId,
      eventType: "email_change_completed",
      status: "success",
      details: {
        previousEmailMasked: payload.currentEmail.replace(/(.{2})(.*)(@.*)/, "$1***$3"),
        newEmailMasked: payload.newEmail.replace(/(.{2})(.*)(@.*)/, "$1***$3"),
      },
      ip: getRequestIp(request),
      userAgent: request.headers.get("User-Agent"),
    });

    return jsonResponse(
      {
        ok: true,
        message: "Email address updated successfully",
        newEmail: payload.newEmail,
        code: "email_change_completed",
      },
      200,
      request,
    );
  }

  if (pathname === "/api/auth/account/delete/options" && method === "GET") {
    if (!env.AUTH_DB) {
      return jsonResponse({ message: "Auth database not configured" }, 501, request);
    }
    const session = await getSessionFromRequest(env, request, { rotate: false });
    if (!session) {
      return jsonResponse({ message: "Unauthorized" }, 401, request);
    }

    const state = await loadAccountDeleteVerificationState(env, session);
    const { preferred_method, available_methods } = buildAccountDeleteMethodList(state);

    if (!preferred_method || available_methods.length === 0) {
      await logAuditEvent(env, {
        userId: session.id,
        eventType: "account_delete_blocked",
        status: "failure",
        details: { reason: "no_verified_channel", phase: "delete_options" },
        ip: getRequestIp(request),
        userAgent: request.headers.get("User-Agent"),
      });
      return jsonResponse(
        {
          message:
            "We can't verify it's you: verify your email, add a passkey, or enable 2-step verification, then try again.",
          code: "account_delete_no_verified_channel",
        },
        403,
        request,
      );
    }

    await logAuditEvent(env, {
      userId: session.id,
      eventType: "account_delete_verification_started",
      status: "success",
      details: { preferred_method, available_methods },
      ip: getRequestIp(request),
      userAgent: request.headers.get("User-Agent"),
    });

    return jsonResponse(
      { ok: true, preferred_method, available_methods },
      200,
      request,
    );
  }

  if (pathname === "/api/auth/account/delete/passkey-abandoned" && method === "POST") {
    if (!env.AUTH_DB) {
      return jsonResponse({ message: "Auth database not configured" }, 501, request);
    }
    const session = await getSessionFromRequest(env, request, { rotate: false });
    if (!session) {
      return jsonResponse({ message: "Unauthorized" }, 401, request);
    }

    let abandonedBody: Record<string, unknown> = {};
    try {
      abandonedBody = await readJsonBody(request);
    } catch {
      abandonedBody = {};
    }
    const reasonRaw = abandonedBody.reason;
    const reason = typeof reasonRaw === "string" ? reasonRaw.trim().slice(0, 120) : "unspecified";

    await logAuditEvent(env, {
      userId: session.id,
      eventType: "account_delete_stepup_failed",
      status: "warning",
      details: { reason },
      ip: getRequestIp(request),
      userAgent: request.headers.get("User-Agent"),
    });

    await logAuditEvent(env, {
      userId: session.id,
      eventType: "account_delete_passkey_abandoned",
      status: "warning",
      details: { reason },
      ip: getRequestIp(request),
      userAgent: request.headers.get("User-Agent"),
    });

    const state = await loadAccountDeleteVerificationState(env, session);
    const issueBlock = await issueAccountDeleteFallbackMarker(env, request, session, reason, state);
    if (issueBlock) return issueBlock;

    return jsonResponse({ ok: true }, 200, request);
  }

  if (pathname === "/api/auth/account/delete/email-code" && method === "POST") {
    if (!env.AUTH_DB) {
      return jsonResponse({ message: "Auth database not configured" }, 501, request);
    }
    const session = await getSessionFromRequest(env, request, { rotate: false });
    if (!session) {
      return jsonResponse({ message: "Unauthorized" }, 401, request);
    }

    const kvIssue = getAuthKv(env);
    if (!kvIssue || !magicLinkHmacConfigured(env)) {
      return jsonResponse({ message: "Auth storage not configured" }, 501, request);
    }

    let emailCodeBody: Record<string, unknown> = {};
    try {
      emailCodeBody = await readJsonBody(request);
    } catch {
      emailCodeBody = {};
    }
    const explicitFallback = emailCodeBody.fallback === true;
    const state = await loadAccountDeleteVerificationState(env, session);
    if (state.hasUsablePasskeys && state.verifiedTotpRow) {
      return jsonResponse(
        {
          message: "Email fallback is not allowed when authenticator code verification is available.",
          code: "account_delete_email_fallback_disabled_when_totp",
        },
        400,
        request,
      );
    }
    if (state.hasUsablePasskeys) {
      if (!explicitFallback || !state.emailFallbackEligible) {
        return jsonResponse(
          {
            message:
              "Email fallback is locked. Complete passkey verification or use 'I don't have access to this device' first.",
            code: "account_delete_email_code_fallback_required",
          },
          403,
          request,
        );
      }
    } else if (state.verifiedTotpRow) {
      return jsonResponse(
        {
          message: "Use your 6-digit authenticator code to verify deletion.",
          code: "account_delete_totp_required",
        },
        400,
        request,
      );
    }

    const userIssue = await env.AUTH_DB.prepare(
      "SELECT email_verified, email FROM users WHERE id = ? LIMIT 1",
    )
      .bind(session.id)
      .first<{ email_verified: number; email: string | null }>();

    if ((userIssue?.email_verified ?? 0) !== 1) {
      await logAuditEvent(env, {
        userId: session.id,
        eventType: "account_delete_blocked",
        status: "failure",
        details: { reason: "email_unverified", phase: "issue_email_code" },
        ip: getRequestIp(request),
        userAgent: request.headers.get("User-Agent"),
      });
      return jsonResponse(
        {
          message:
            "Your account email is not verified. Verify your email or add a passkey or 2-step verification before deleting your account.",
          code: "account_delete_no_verified_channel",
        },
        403,
        request,
      );
    }

    const toEmail = (userIssue?.email ?? session.email ?? "").trim().toLowerCase();
    if (!toEmail) {
      return jsonResponse({ message: "No email address on file" }, 400, request);
    }

    const issueRlKey = `${ACCOUNT_DELETE_EMAIL.ISSUE_RL_PREFIX}${session.sessionIdHash}`;
    try {
      const rlData = (await kvIssue.get(issueRlKey, "json")) as { count: number } | null;
      if (rlData && rlData.count >= ACCOUNT_DELETE_EMAIL.ISSUE_MAX) {
        return jsonResponse({ message: "Too many code requests. Please wait and try again." }, 429, request);
      }
      await kvIssue.put(issueRlKey, JSON.stringify({ count: (rlData?.count ?? 0) + 1 }), {
        expirationTtl: ACCOUNT_DELETE_EMAIL.ISSUE_WINDOW_SECONDS,
      });
    } catch {
      // non-fatal
    }

    const otp = randomSixDigitNumericCode();
    const codeHash = await hmacAccountDeleteEmailCode(env, session.id, otp);
    if (!codeHash) {
      return jsonResponse({ message: "Auth storage not configured" }, 501, request);
    }

    await kvIssue.put(
      `${ACCOUNT_DELETE_EMAIL.KV_PREFIX}${session.id}`,
      JSON.stringify({ codeHash, issuedAt: new Date().toISOString() }),
      { expirationTtl: ACCOUNT_DELETE_EMAIL.TTL_SECONDS },
    );

    const emailResult = await sendEmail(env, {
      to: toEmail,
      subject: "Your account deletion confirmation code - PrivateNote",
      text: `You requested to delete your PrivateNote account.\n\nConfirmation code: ${otp}\n\nThis code expires in 15 minutes and can be used only once.\n\nIf you did not request this, secure your account and ignore this email.`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Account deletion confirmation</h2>
          <p>You requested to delete your PrivateNote account. Verify it&apos;s you by entering this code where you started deletion:</p>
          <p style="font-size: 28px; letter-spacing: 4px; font-weight: bold; margin: 24px 0;">${otp}</p>
          <p style="color: #666; font-size: 14px;">This code expires in 15 minutes and can be used only once.</p>
          <p style="color: #666; font-size: 14px;">If you did not request this, secure your account and ignore this email.</p>
        </div>
      `,
    });

    if (!emailResult.ok) {
      try {
        await kvIssue.delete(`${ACCOUNT_DELETE_EMAIL.KV_PREFIX}${session.id}`);
      } catch {
        /* ignore */
      }
      console.error("[AUTH] account delete email code send failed:", emailResult.error);
      return jsonResponse({ message: "Could not send email. Try again later." }, 502, request);
    }

    const issuedAsFallback = explicitFallback && state.hasUsablePasskeys;
    if (issuedAsFallback) {
      await logAuditEvent(env, {
        userId: session.id,
        eventType: "account_delete_fallback_selected",
        status: "success",
        details: { method: "email_code" },
        ip: getRequestIp(request),
        userAgent: request.headers.get("User-Agent"),
      });
    }

    await logAuditEvent(env, {
      userId: session.id,
      eventType: "account_delete_email_code_issued",
      status: "success",
      details: { fallback: issuedAsFallback },
      ip: getRequestIp(request),
      userAgent: request.headers.get("User-Agent"),
    });

    return jsonResponse({ ok: true }, 200, request);
  }

  if (pathname === "/api/auth/account/delete" && method === "POST") {
    if (!env.AUTH_DB) {
      return jsonResponse({ message: "Auth database not configured" }, 501, request);
    }
    const session = await getSessionFromRequest(env, request, { rotate: false });
    if (!session) {
      return jsonResponse({ message: "Unauthorized" }, 401, request);
    }

    let deleteBody: Record<string, unknown>;
    try {
      deleteBody = await readJsonBody(request);
    } catch {
      return jsonResponse({ message: "Invalid JSON" }, 400, request);
    }
    const providedEmail = deleteBody.email;
    const deleteState = await loadAccountDeleteVerificationState(env, session);
    const { preferred_method, available_methods } = buildAccountDeleteMethodList(deleteState);

    await logAuditEvent(env, {
      userId: session.id,
      eventType: "account_delete_stepup_requested",
      status: "success",
      details: { preferred_method, available_methods },
      ip: getRequestIp(request),
      userAgent: request.headers.get("User-Agent"),
    });

    const verifyOutcome = await satisfyAccountDeleteVerification(
      env,
      request,
      session,
      deleteBody,
      deleteState,
    );
    if (verifyOutcome instanceof Response) return verifyOutcome;
    const proof = verifyOutcome;

    if (!providedEmail || typeof providedEmail !== "string") {
      return jsonResponse({ message: "Email is required" }, 400, request);
    }

    // Normalize emails for comparison
    const normalizedProvided = providedEmail.trim().toLowerCase();
    const normalizedStored = (session.email ?? "").trim().toLowerCase();

    if (normalizedProvided !== normalizedStored) {
      return jsonResponse({ message: "Email does not match" }, 400, request);
    }

    const usedFallback = Boolean(preferred_method && preferred_method !== proof);
    if (usedFallback) {
      await logAuditEvent(env, {
        userId: session.id,
        eventType: "account_delete_fallback_success",
        status: "success",
        details: { verificationMethod: proof, preferred_method, available_methods },
        ip: getRequestIp(request),
        userAgent: request.headers.get("User-Agent"),
      });
    }

    const userId = session.id;
    if (proof === "email_code") {
      const scheduleRes = await schedulePendingAccountDeletion(env, request, {
        id: userId,
        email: session.email,
      });
      if (!scheduleRes.ok) return scheduleRes.response;

      const headers = new Headers(getCorsHeaders(request));
      headers.set("Content-Type", "application/json");
      headers.set("Set-Cookie", clearSessionCookieHeader(getSessionCookieKindForRequest(request)));
      return new Response(
        JSON.stringify({ ok: true, scheduled: true, deleteAfterHours: 48 }),
        { status: 200, headers },
      );
    }

    // Delete user row: child tables use ON DELETE CASCADE; audit_log uses ON DELETE SET NULL (see src/auth/schema.sql).
    await env.AUTH_DB.prepare("DELETE FROM users WHERE id = ?").bind(userId).run();

    await logAuditEvent(env, {
      userId: null,
      eventType: "account_delete_finalized",
      status: "success",
      details: {
        deletedUserId: userId,
        emailMasked: normalizedStored.replace(/(.{2})(.*)(@.*)/, "$1***$3"),
        verificationMethod: proof,
      },
      ip: getRequestIp(request),
      userAgent: request.headers.get("User-Agent"),
    });

    // Backward-compat event name retained for existing dashboards.
    await logAuditEvent(env, {
      userId: null,
      eventType: "account_deleted",
      status: "success",
      details: {
        deletedUserId: userId,
        emailMasked: normalizedStored.replace(/(.{2})(.*)(@.*)/, "$1***$3"),
        verificationMethod: proof,
        preferred_method,
        available_methods,
        usedFallback,
      },
      ip: getRequestIp(request),
      userAgent: request.headers.get("User-Agent"),
    });

    const headers = new Headers(getCorsHeaders(request));
    headers.set("Content-Type", "application/json");
    headers.set("Set-Cookie", clearSessionCookieHeader(getSessionCookieKindForRequest(request)));
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
  }

  if (pathname === "/api/auth/account/delete/cancel" && (method === "GET" || method === "POST")) {
    if (!env.AUTH_DB) {
      return jsonResponse({ message: "Auth database not configured" }, 501, request);
    }
    if (method === "GET") {
      const token = new URL(request.url).searchParams.get("token") ?? "";
      const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Cancel Scheduled Deletion</title>
  </head>
  <body style="font-family: sans-serif; max-width: 560px; margin: 48px auto; padding: 0 16px; line-height: 1.5;">
    <h1>Cancel scheduled deletion</h1>
    <p>If your account has a scheduled deletion, you can confirm cancellation below.</p>
    <form method="POST" action="/api/auth/account/delete/cancel">
      <input type="hidden" name="token" value="${escapeHtml(token)}" />
      <button type="submit" style="background: #2563eb; color: white; border: 0; border-radius: 6px; padding: 12px 20px; cursor: pointer;">
        Cancel scheduled deletion
      </button>
    </form>
  </body>
</html>`;
      const headers = new Headers(getCorsHeaders(request));
      headers.set("Content-Type", "text/html; charset=utf-8");
      return new Response(html, { status: 200, headers });
    }

    let body: Record<string, unknown> = {};
    let token: string | null = null;
    if (method === "POST") {
      const ct = request.headers.get("Content-Type") || "";
      if (ct.toLowerCase().includes("application/json")) {
        try {
          body = await readJsonBody(request);
        } catch {
          return jsonResponse({ message: "Invalid JSON" }, 400, request);
        }
        token = typeof body.token === "string" ? body.token : null;
      } else {
        let form: FormData;
        try {
          form = await request.formData();
        } catch {
          return jsonResponse({ message: "Invalid form data" }, 400, request);
        }
        const formToken = form.get("token");
        token = typeof formToken === "string" ? formToken : null;
      }
    }
    const normalizedToken = typeof token === "string" ? token.trim() : "";
    if (!normalizedToken) {
      return jsonResponse({ message: "Cancellation token required" }, 400, request);
    }

    const tokenHash = await sha256Base64Url(normalizedToken);
    const pending = await env.AUTH_DB.prepare(
      `SELECT id, user_id FROM pending_account_deletions
       WHERE cancel_token_hash = ? AND cancelled_at IS NULL AND delete_after_at > ? LIMIT 1`
    )
      .bind(tokenHash, new Date().toISOString())
      .first<{ id: string; user_id: string }>();

    if (!pending) {
      return jsonResponse({ message: "Invalid or expired cancellation token" }, 400, request);
    }

    const kv = getAuthKv(env);
    if (kv) {
      const rlKey = `${ACCOUNT_DELETE_PENDING.TOKEN_RL_PREFIX}${tokenHash}`;
      try {
        const rlData = (await kv.get(rlKey, "json")) as { count: number } | null;
        if (rlData && rlData.count >= ACCOUNT_DELETE_PENDING.TOKEN_VERIFY_MAX) {
          return jsonResponse({ message: "Too many attempts. Please wait and try again." }, 429, request);
        }
        await kv.put(rlKey, JSON.stringify({ count: (rlData?.count ?? 0) + 1 }), {
          expirationTtl: ACCOUNT_DELETE_PENDING.TOKEN_VERIFY_WINDOW_SECONDS,
        });
      } catch {
        // non-fatal
      }
    }

    const cancelRes = await env.AUTH_DB.prepare(
      "UPDATE pending_account_deletions SET cancelled_at = ?, cancelled_reason = ? WHERE id = ? AND cancelled_at IS NULL AND delete_after_at > ?"
    )
      .bind(new Date().toISOString(), "user_cancelled_via_email_link", pending.id, new Date().toISOString())
      .run();
    if ((cancelRes.meta?.changes ?? 0) < 1) {
      return jsonResponse({ message: "Cancellation window has expired" }, 409, request);
    }

    await logAuditEvent(env, {
      userId: pending.user_id,
      eventType: "account_delete_cancelled",
      status: "success",
      details: { via: "token_link" },
      ip: getRequestIp(request),
      userAgent: request.headers.get("User-Agent"),
    });

    return jsonResponse({ ok: true, cancelled: true }, 200, request);
  }

  // ============================================================================
  // TOTP 2-STEP VERIFICATION ENDPOINTS
  // ============================================================================

  if (pathname === "/api/auth/totp/status" && method === "GET") {
    if (!env.AUTH_DB) {
      return jsonResponse({ message: "Auth database not configured" }, 501, request);
    }
    const session = await getSessionFromRequest(env, request, { rotate: true, allowPendingTotp: true });
    if (!session) {
      return jsonResponse({ message: "Unauthorized" }, 401, request);
    }
    const row = await env.AUTH_DB.prepare(
      "SELECT verified FROM totp_secrets WHERE user_id = ? LIMIT 1"
    )
      .bind(session.id)
      .first<{ verified: number }>();
    const headers = new Headers(getCorsHeaders(request));
    headers.set("Content-Type", "application/json");
    applyRotatedSession(request, headers, session);
    return new Response(JSON.stringify({ enabled: row?.verified === 1 }), { status: 200, headers });
  }

  if (pathname === "/api/auth/totp/setup" && method === "POST") {
    if (!env.AUTH_DB) {
      return jsonResponse({ message: "Auth database not configured" }, 501, request);
    }
    if (!env.TOTP_ENCRYPTION_KEY) {
      return jsonResponse({ message: "TOTP not configured" }, 501, request);
    }
    const session = await getSessionFromRequest(env, request, { rotate: false });
    if (!session) {
      return jsonResponse({ message: "Unauthorized" }, 401, request);
    }

    const hasPasskeysTotp = (await countUsableWebauthnCredentialsForUser(env, session.id)) > 0;
    if (hasPasskeysTotp && !isStepUpFresh(session.lastStepUpAt)) {
      return jsonResponse({ message: "Step-up required" }, 403, request);
    }

    const existingTotp = await env.AUTH_DB.prepare(
      "SELECT verified FROM totp_secrets WHERE user_id = ? LIMIT 1"
    )
      .bind(session.id)
      .first<{ verified: number }>();
    if (existingTotp?.verified === 1) {
      return jsonResponse({ message: "TOTP is already enabled. Disable it first to set up a new one." }, 400, request);
    }

    // Delete any unverified setup
    await env.AUTH_DB.prepare("DELETE FROM totp_secrets WHERE user_id = ? AND verified = 0")
      .bind(session.id)
      .run();

    const base32Secret = generateTotpSecret();
    const accountName = session.email || session.id;
    const totp = createTotpInstance(base32Secret, accountName);
    const otpauthUri = totp.toString();

    const encryptedSecret = await encryptTotpSecret(base32Secret, env);
    const setupId = crypto.randomUUID();
    await env.AUTH_DB.prepare(
      "INSERT INTO totp_secrets (id, user_id, encrypted_secret, verified, created_at) VALUES (?, ?, ?, 0, ?)"
    )
      .bind(setupId, session.id, encryptedSecret, new Date().toISOString())
      .run();

    await logAuditEvent(env, {
      userId: session.id,
      eventType: "totp_setup_started",
      status: "success",
      details: {},
      ip: getRequestIp(request),
      userAgent: request.headers.get("User-Agent"),
    });

    return jsonResponse({ setupId, secret: base32Secret, otpauthUri }, 200, request);
  }

  if (pathname === "/api/auth/totp/verify-setup" && method === "POST") {
    if (!env.AUTH_DB) {
      return jsonResponse({ message: "Auth database not configured" }, 501, request);
    }
    if (!env.TOTP_ENCRYPTION_KEY) {
      return jsonResponse({ message: "TOTP not configured" }, 501, request);
    }
    const session = await getSessionFromRequest(env, request, { rotate: false });
    if (!session) {
      return jsonResponse({ message: "Unauthorized" }, 401, request);
    }
    const body = await request.json().catch(() => ({})) as { code?: string; setupId?: string };
    const { code, setupId } = body;
    if (!code || !setupId) {
      return jsonResponse({ message: "Code and setupId are required" }, 400, request);
    }

    const pending = await env.AUTH_DB.prepare(
      "SELECT id, encrypted_secret, created_at FROM totp_secrets WHERE user_id = ? AND id = ? AND verified = 0 LIMIT 1"
    )
      .bind(session.id, setupId)
      .first<{ id: string; encrypted_secret: string; created_at: string }>();
    if (!pending) {
      return jsonResponse({ message: "No pending TOTP setup found" }, 400, request);
    }

    // Setup expires after 10 minutes
    const setupAge = Date.now() - new Date(pending.created_at).getTime();
    if (setupAge > 10 * 60 * 1000) {
      await env.AUTH_DB.prepare("DELETE FROM totp_secrets WHERE id = ?").bind(pending.id).run();
      return jsonResponse({ message: "Setup expired. Please start again." }, 400, request);
    }

    const secret = await decryptTotpSecret(pending.encrypted_secret, env);
    const accountName = session.email || session.id;
    if (!verifyTotpCode(secret, code, accountName)) {
      await logAuditEvent(env, {
        userId: session.id,
        eventType: "totp_failed",
        status: "failure",
        details: { phase: "setup_verify" },
        ip: getRequestIp(request),
        userAgent: request.headers.get("User-Agent"),
      });
      return jsonResponse({ message: "Invalid code. Please try again." }, 400, request);
    }

    await env.AUTH_DB.prepare("UPDATE totp_secrets SET verified = 1 WHERE id = ?")
      .bind(pending.id)
      .run();

    await logAuditEvent(env, {
      userId: session.id,
      eventType: "totp_enabled",
      status: "success",
      details: {},
      ip: getRequestIp(request),
      userAgent: request.headers.get("User-Agent"),
    });

    return jsonResponse({ ok: true }, 200, request);
  }

  if (pathname === "/api/auth/totp/verify" && method === "POST") {
    if (!env.AUTH_DB) {
      return jsonResponse({ message: "Auth database not configured" }, 501, request);
    }
    if (!env.TOTP_ENCRYPTION_KEY) {
      return jsonResponse({ message: "TOTP not configured" }, 501, request);
    }
    const session = await getSessionFromRequest(env, request, { rotate: false, allowPendingTotp: true });
    if (!session) {
      return jsonResponse({ message: "Unauthorized" }, 401, request);
    }

    const body = await request.json().catch(() => ({})) as { code?: string };
    const { code } = body;
    if (!code || typeof code !== "string") {
      return jsonResponse({ message: "Code is required" }, 400, request);
    }

    // Rate limit TOTP verification per session
    if (env.AUTH_KV) {
      const rlKey = `${TOTP_RATE_LIMIT.KEY_PREFIX}${session.sessionIdHash}`;
      try {
        const rlData = await env.AUTH_KV.get(rlKey, "json") as { count: number } | null;
        if (rlData && rlData.count >= TOTP_RATE_LIMIT.MAX_ATTEMPTS) {
          return jsonResponse({ message: "Too many attempts. Please wait and try again." }, 429, request);
        }
        await env.AUTH_KV.put(rlKey, JSON.stringify({ count: (rlData?.count ?? 0) + 1 }), {
          expirationTtl: TOTP_RATE_LIMIT.WINDOW_SECONDS,
        });
      } catch {
        // Rate limit check failure is non-fatal
      }
    }

    const totpRow = await env.AUTH_DB.prepare(
      "SELECT encrypted_secret FROM totp_secrets WHERE user_id = ? AND verified = 1 LIMIT 1"
    )
      .bind(session.id)
      .first<{ encrypted_secret: string }>();
    if (!totpRow) {
      return jsonResponse({ message: "TOTP is not enabled" }, 400, request);
    }

    const secret = await decryptTotpSecret(totpRow.encrypted_secret, env);
    const accountName = session.email || session.id;
    if (!verifyTotpCode(secret, code, accountName)) {
      await logAuditEvent(env, {
        userId: session.id,
        eventType: "totp_failed",
        status: "failure",
        details: { phase: "login_verify" },
        ip: getRequestIp(request),
        userAgent: request.headers.get("User-Agent"),
      });
      return jsonResponse({ message: "Invalid code" }, 400, request);
    }

    // Upgrade session to fully authenticated and restore normal sliding / absolute TTL.
    const nowMs = Date.now();
    const nextExpiresAt = new Date(nowMs + 1000 * SESSION_POLICY.TTL_SECONDS).toISOString();
    const nextAbsolute = new Date(nowMs + 1000 * SESSION_POLICY.ABSOLUTE_TTL_SECONDS).toISOString();
    const seenIso = new Date().toISOString();
    await env.AUTH_DB.prepare(
      "UPDATE sessions SET auth_complete = 1, expires_at = ?, absolute_expires_at = ?, last_seen_at = ? WHERE session_id_hash = ?",
    )
      .bind(nextExpiresAt, nextAbsolute, seenIso, session.sessionIdHash)
      .run();

    // Clear rate limit on success
    if (env.AUTH_KV) {
      const rlKey = `${TOTP_RATE_LIMIT.KEY_PREFIX}${session.sessionIdHash}`;
      try { await env.AUTH_KV.delete(rlKey); } catch {}
    }

    await logAuditEvent(env, {
      userId: session.id,
      eventType: "totp_verified",
      status: "success",
      details: {},
      ip: getRequestIp(request),
      userAgent: request.headers.get("User-Agent"),
    });

    return jsonResponse({ ok: true }, 200, request);
  }

  if (pathname === "/api/auth/totp/disable" && method === "POST") {
    if (!env.AUTH_DB) {
      return jsonResponse({ message: "Auth database not configured" }, 501, request);
    }
    const session = await getSessionFromRequest(env, request, { rotate: false });
    if (!session) {
      return jsonResponse({ message: "Unauthorized" }, 401, request);
    }

    const hasPasskeysDisable = (await countUsableWebauthnCredentialsForUser(env, session.id)) > 0;
    if (hasPasskeysDisable && !isStepUpFresh(session.lastStepUpAt)) {
      return jsonResponse({ message: "Step-up required" }, 403, request);
    }

    const deleted = await env.AUTH_DB.prepare("DELETE FROM totp_secrets WHERE user_id = ? AND verified = 1")
      .bind(session.id)
      .run();

    if (!deleted.meta.changes || deleted.meta.changes === 0) {
      return jsonResponse({ message: "TOTP is not enabled" }, 400, request);
    }

    await logAuditEvent(env, {
      userId: session.id,
      eventType: "totp_disabled",
      status: "success",
      details: {},
      ip: getRequestIp(request),
      userAgent: request.headers.get("User-Agent"),
    });

    return jsonResponse({ ok: true }, 200, request);
  }

  return jsonResponse({ message: "Auth route not found" }, 404, request);
}

async function verifyTurnstile(
  token: string | undefined,
  request: Request,
  env: Env,
): Promise<boolean> {
  if (!token || !env.TURNSTILE_SECRET_KEY) {
    return false;
  }

  const formData = new FormData();
  formData.append("secret", env.TURNSTILE_SECRET_KEY);
  formData.append("response", token);

  const ip = request.headers.get("CF-Connecting-IP");
  if (ip) {
    formData.append("remoteip", ip);
  }

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      return false;
    }
    const data = await response.json<{ success?: boolean }>();
    return !!data.success;
  } catch {
    return false;
  }
}

type RateLimitBucketConfig = {
  MAX_REQUESTS: number;
  WINDOW_SECONDS: number;
  KEY_PREFIX: string;
};

async function checkRateLimit(
  env: Env,
  identifier: string,
  config: RateLimitBucketConfig,
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const kv = env.RATE_LIMIT_KV || env.NOTES_KV;
  const key = `${config.KEY_PREFIX}${identifier}`;
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - (now % config.WINDOW_SECONDS);

  try {
    const stored = await kv.get(key, { type: "json" }) as { count?: number; windowStart?: number } | null;

    if (stored && stored.windowStart === windowStart) {
      if ((stored.count ?? 0) >= config.MAX_REQUESTS) {
        return {
          allowed: false,
          remaining: 0,
          resetAt: windowStart + config.WINDOW_SECONDS,
        };
      }

      const newCount = (stored.count ?? 0) + 1;
      await kv.put(
        key,
        JSON.stringify({
          count: newCount,
          windowStart,
        }),
        {
          expirationTtl: config.WINDOW_SECONDS + 10,
        },
      );

      return {
        allowed: true,
        remaining: config.MAX_REQUESTS - newCount,
        resetAt: windowStart + config.WINDOW_SECONDS,
      };
    }

    await kv.put(
      key,
      JSON.stringify({
        count: 1,
        windowStart,
      }),
      {
        expirationTtl: config.WINDOW_SECONDS + 10,
      },
    );

    return {
      allowed: true,
      remaining: config.MAX_REQUESTS - 1,
      resetAt: windowStart + config.WINDOW_SECONDS,
    };
  } catch (error) {
    console.error("[RATE_LIMIT] Error checking rate limit:", error);
    return {
      allowed: true,
      remaining: config.MAX_REQUESTS,
      resetAt: windowStart + config.WINDOW_SECONDS,
    };
  }
}

function getClientIdentifier(request: Request): string {
  const cookieHeader = request.headers.get("Cookie") || "";
  const cookieMatch = cookieHeader.match(/(?:^|;\s*)pn_client_id=([^;]+)/);
  const cookieId = cookieMatch?.[1]?.trim();

  const cfConnectingIp = request.headers.get("CF-Connecting-IP");
  if (cfConnectingIp && cookieId) {
    return `ip:${cfConnectingIp}|cid:${cookieId}`;
  }
  if (cfConnectingIp) {
    return `ip:${cfConnectingIp}`;
  }
  if (cookieId) {
    return `cookie:${cookieId}`;
  }

  const userAgent = request.headers.get("User-Agent") || "unknown";
  const origin = request.headers.get("Origin") || "unknown";
  return `ua:${`${origin}:${userAgent}`.substring(0, 100)}`;
}

// ============================================================================
// TOTP ENCRYPTION HELPERS
// ============================================================================

const TOTP_ISSUER = "PrivateNote";
const TOTP_DIGITS = 6;
const TOTP_PERIOD = 30;
const TOTP_ALGORITHM = "SHA1";
const TOTP_VERIFY_WINDOW = 1;

const TOTP_RATE_LIMIT = {
  MAX_ATTEMPTS: 5,
  WINDOW_SECONDS: 15 * 60,
  KEY_PREFIX: "totp_rate_limit:",
};

async function getTotpEncryptionKey(env: Env): Promise<CryptoKey | null> {
  const raw = env.TOTP_ENCRYPTION_KEY;
  if (!raw) return null;
  const keyBytes = base64UrlToBytes(raw);
  return crypto.subtle.importKey("raw", keyBytes.buffer as ArrayBuffer, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
}

async function encryptTotpSecret(secret: string, env: Env): Promise<string> {
  const key = await getTotpEncryptionKey(env);
  if (!key) throw new Error("TOTP encryption key not configured");
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(secret);
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv as unknown as ArrayBuffer },
    key,
    encoded as unknown as ArrayBuffer
  );
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.length);
  return bytesToBase64Url(combined);
}

async function decryptTotpSecret(encrypted: string, env: Env): Promise<string> {
  const key = await getTotpEncryptionKey(env);
  if (!key) throw new Error("TOTP encryption key not configured");
  const combined = base64UrlToBytes(encrypted);
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv as unknown as ArrayBuffer },
    key,
    ciphertext as unknown as ArrayBuffer
  );
  return new TextDecoder().decode(decrypted);
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function generateTotpSecret(): string {
  const secret = new OTPAuth.Secret({ size: 20 });
  return secret.base32;
}

function createTotpInstance(base32Secret: string, accountName: string): OTPAuth.TOTP {
  return new OTPAuth.TOTP({
    issuer: TOTP_ISSUER,
    label: accountName,
    algorithm: TOTP_ALGORITHM,
    digits: TOTP_DIGITS,
    period: TOTP_PERIOD,
    secret: OTPAuth.Secret.fromBase32(base32Secret),
  });
}

function verifyTotpCode(base32Secret: string, code: string, accountName: string): boolean {
  const totp = createTotpInstance(base32Secret, accountName);
  const delta = totp.validate({ token: code, window: TOTP_VERIFY_WINDOW });
  return delta !== null;
}



/**
 * Cleanup old audit log entries based on retention policy.
 * Called by scheduled cron trigger for GDPR compliance (data minimization).
 * Deletes entries older than AUDIT_LOG_RETENTION.RETENTION_DAYS in batches.
 */
export async function cleanupAuditLogs(env: Env): Promise<{ deleted: number; error?: string }> {
  if (!env.AUTH_DB) {
    return { deleted: 0, error: "AUTH_DB not configured" };
  }

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - AUDIT_LOG_RETENTION.RETENTION_DAYS);
  const cutoffIso = cutoffDate.toISOString();

  let totalDeleted = 0;
  let batchesProcessed = 0;
  const maxBatches = 10; // Safety limit to prevent runaway deletion

  try {
    // Delete in batches to avoid timeout
    while (batchesProcessed < maxBatches) {
      const result = await env.AUTH_DB.prepare(
        `DELETE FROM audit_log 
         WHERE id IN (
           SELECT id FROM audit_log 
           WHERE created_at < ? 
           LIMIT ?
         )`
      )
        .bind(cutoffIso, AUDIT_LOG_RETENTION.CLEANUP_BATCH_SIZE)
        .run();

      const deletedInBatch = result?.meta?.changes || 0;
      totalDeleted += deletedInBatch;
      batchesProcessed++;

      console.log(`[AUDIT_CLEANUP] Batch ${batchesProcessed}: Deleted ${deletedInBatch} entries`);

      // If we deleted less than batch size, we're done
      if (deletedInBatch < AUDIT_LOG_RETENTION.CLEANUP_BATCH_SIZE) {
        break;
      }
    }

    console.log(`[AUDIT_CLEANUP] Completed: Total deleted ${totalDeleted} entries older than ${cutoffIso}`);

    // Log the cleanup event itself
    await logAuditEvent(env, {
      userId: null,
      eventType: "maintenance_cleanup",
      status: "success",
      details: {
        action: "audit_log_cleanup",
        deletedCount: totalDeleted,
        retentionDays: AUDIT_LOG_RETENTION.RETENTION_DAYS,
        cutoffDate: cutoffIso,
      },
    });

    return { deleted: totalDeleted };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`[AUDIT_CLEANUP] Error: ${errorMessage}`);
    return { deleted: totalDeleted, error: errorMessage };
  }
}

/**
 * Finalize delayed account deletions scheduled through email fallback.
 * Called by scheduled cron trigger.
 */
export async function processPendingAccountDeletions(
  env: Env,
): Promise<{ finalized: number; error?: string }> {
  if (!env.AUTH_DB) {
    return { finalized: 0, error: "AUTH_DB not configured" };
  }

  try {
    const nowIso = new Date().toISOString();
    const rows = await env.AUTH_DB.prepare(
      `SELECT id, user_id
       FROM pending_account_deletions
       WHERE cancelled_at IS NULL AND delete_after_at <= ?
       LIMIT 200`
    )
      .bind(nowIso)
      .all<{ id: string; user_id: string }>();

    let finalized = 0;
    for (const row of rows.results || []) {
      const deleteUserRes = await env.AUTH_DB.prepare(
        `DELETE FROM users
         WHERE id = ?
           AND EXISTS (
             SELECT 1
             FROM pending_account_deletions
             WHERE id = ?
               AND user_id = ?
               AND cancelled_at IS NULL
               AND delete_after_at <= ?
           )`
      )
        .bind(row.user_id, row.id, row.user_id, nowIso)
        .run();
      if ((deleteUserRes.meta?.changes ?? 0) < 1) {
        continue;
      }
      finalized += 1;
      await logAuditEvent(env, {
        userId: null,
        eventType: "account_delete_finalized",
        status: "success",
        details: { deletedUserId: row.user_id, finalizedBy: "cron" },
      });
      // Backward-compat dashboard event name.
      await logAuditEvent(env, {
        userId: null,
        eventType: "account_deleted",
        status: "success",
        details: { deletedUserId: row.user_id, finalizedBy: "cron" },
      });
    }
    return { finalized };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return { finalized: 0, error: errorMessage };
  }
}

/**
 * Cleanup expired sessions from the database.
 * Called by scheduled cron trigger.
 */
export async function cleanupExpiredSessions(env: Env): Promise<{ deleted: number; error?: string }> {
  if (!env.AUTH_DB) {
    return { deleted: 0, error: "AUTH_DB not configured" };
  }

  try {
    // Delete sessions that have been revoked for more than 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const cutoffIso = thirtyDaysAgo.toISOString();

    const result = await env.AUTH_DB.prepare(
      `DELETE FROM sessions 
       WHERE revoked_at IS NOT NULL 
         AND revoked_at < ?`
    )
      .bind(cutoffIso)
      .run();

    const deleted = result?.meta?.changes || 0;
    console.log(`[SESSION_CLEANUP] Deleted ${deleted} revoked sessions older than ${cutoffIso}`);

    return { deleted };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`[SESSION_CLEANUP] Error: ${errorMessage}`);
    return { deleted: 0, error: errorMessage };
  }
}
