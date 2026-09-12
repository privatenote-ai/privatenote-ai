import { CompositeStorage } from "./storage";
import type { Note } from "@shared/schema";
import { insertBlogPostSchema, updateBlogPostSchema, AnalyticsMetricsType } from "@shared/schema";
import { parseNoteExpirySecondsFromBody } from "@shared/noteExpiry";
import { parseMaxReadsFromBody } from "@shared/noteReadLimits";
import { validateNoteCiphertextWire } from "@shared/noteCryptoWire";
import { maxNoteCiphertextBase64CharsForAccount } from "@shared/noteSizeLimits";
import { parseNoteOpensAtFromBody } from "@shared/noteMetaEligibility";
import { isValidReceiptAckTokenHash } from "@shared/noteReceiptAck";
import { sanitizeNoteCreationSource } from "@shared/noteCreationSource";
import { sanitizeNoteCreationEntryPoint } from "@shared/noteCreationEntryPoint";
import { MAX_ENGAGEMENT_RANGE_DAYS, parsePageEngagementFlush } from "@shared/pageEngagement";
import {
  normalizeAccountType,
  planFeaturesFor,
  type AccountType,
} from "@shared/planCatalog";
import { commitHostedAiQuota, readHostedAiQuota } from "./planHostedAi";
import {
  NOTE_FILE_ATTACHMENTS_HARD_MAX,
  NOTE_FILE_MAX_CHUNK_INDEX,
  NOTE_FILE_MAX_CHUNKS,
  NOTE_FILE_SECRETSTREAM_ABYTES,
  noteFileAttachmentsMaxCountForAccount,
  noteFileLimitBytesForAccount,
  noteFileTotalStorageBytesForAccount,
  noteFileTransferLimitBytesForAccount,
  noteFileTransfersPerMonthForAccount,
} from "@shared/noteFileLimits";
import { noteFileChunkObjectKey, noteFileObjectPrefix } from "@shared/noteAttachments";
import { createNoteFilePresignedPutUrl, readR2PresignConfig } from "./r2Presign";
import {
  NOTE_FILE_ACCESS_DEFAULT_SECONDS,
  NOTE_FILE_ACCESS_WINDOW_OPTIONS,
  isNoteFileAccessWindowSeconds,
  parseNoteFileAccessWindowFromBody,
} from "@shared/noteFileAccess";
import { isValidNoteId } from "@shared/noteId";
import { isPlausibleEmailFormat } from "@shared/isPlausibleEmailFormat";
import type { DurableObjectNamespace, DurableObjectStub, KVNamespace } from "@cloudflare/workers-types";
import type { Env } from "./types";
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
  ALLOWED_ORIGINS,
  PAGES_PRODUCTION_WEB_HOSTS,
  STAGING_CUSTOM_APP_HOSTS,
  type SessionCookieKind,
  SESSION_COOKIE_PREVIEW_NAME,
  SESSION_COOKIE_PROD_NAME,
  sessionCookieNameForKind,
} from "./trustedOrigins";
import { buildRecipientNoteLinkEmail, parseDeliverableNoteUrl } from "@shared/noteLinkDelivery";
import { getApiContentSecurityPolicy, resolveAccessControlAllowHeaders, SECURITY_HEADERS, buildUploadRelayCorsHeaders } from "./httpSecurity";
import { canonicalizeMagicLinkOrigin } from "@shared/magicLinkOrigin";
import { isUploadRelayHostname } from "@shared/apiWorkerOrigin";
import {
  type NoteReservationRecord,
  type NoteReserveAttachmentsBinding,
  NOTE_UPLOAD_QUERY_PARAM,
  isValidAttachmentContentHash,
  parseNoteReserveAttachmentBinding,
  parseNoteUploadBearerToken,
  reservationAttachmentAt,
  uploadedChunkHashKey,
} from "@shared/noteFileUploadAuth";
import { readClientIpFromRequestHeaders } from "@shared/clientRequestIdentity";
import { isSupportedLanguage } from "@shared/supportedLanguages";
import { sha256 } from "@noble/hashes/sha2.js";
import { handleAuthRoutes as handleAuthRoutesComplete } from "./routes/auth";
import {
  ADMIN_SESSION_COOKIE_NAME,
  adminSessionCookie,
  adminSessionIsValid,
  clearAdminSessionCookie,
  createAdminSession,
  revokeAdminSession,
} from "./adminSession";
import { withEuStoredDataEnv } from "./euD1Kv";
import {
  getRecipientGateStatus,
  getSentNoteByNoteId,
  getUserAccountType,
  insertSentNote,
  isRecipientVerified,
  noteRequiresRecipientVerification,
  processExpiredSentNotes,
  processDueUnopenedReminders,
  recipientVerifiedCookieHeader,
  recordSentNoteOpened,
  recordSentNoteAttachmentDownloaded,
  acknowledgeSentNoteReceipt,
  clearRecipientGate,
  revokeSentNote,
  sendRecipientVerificationCode,
  verifyRecipientAccess,
} from "./sentNotesService";
import { getAccountEntitlements } from "./accountEntitlements";
import { recordNoteCreatedActivity } from "./noteCreationActivity";
import { parseStoredRevealBranding, parseStoredPortalLayoutJson, openedSettingsFromAccountColumns, publicBrandingAssetPath, toRevealBranding } from "@shared/businessBranding";
import { resolveRevealBrandingForNoteCreate } from "@shared/trustedPrefillPartners";
import { mayStoreRevealBodyFont, parseRevealBodyFont } from "@shared/revealBodyFont";
import { parseAttachmentRecipientPermission } from "@shared/attachmentRecipientPermission";
import { normalizeReceiptAckStatement } from "@shared/receiptAcknowledgment";

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

// Stripe retries and short bursts are expected; this ceiling only absorbs
// unauthenticated floods before signature verification performs HMAC work.
const RATE_LIMIT_STRIPE_WEBHOOK = {
  MAX_REQUESTS: 300,
  WINDOW_SECONDS: 60,
  KEY_PREFIX: "rl:post:stripe-webhook:",
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

const RATE_LIMIT_RECIPIENT_VERIFY = {
  MAX_REQUESTS: 5,
  WINDOW_SECONDS: 15 * 60,
  KEY_PREFIX: "rl:recipient-verify:",
};

const RATE_LIMIT_RECIPIENT_SEND_CODE = {
  MAX_REQUESTS: 5,
  WINDOW_SECONDS: 15 * 60,
  KEY_PREFIX: "rl:recipient-send-code:",
};

const RATE_LIMIT_RECEIPT_ACK = {
  MAX_REQUESTS: 10,
  WINDOW_SECONDS: 15 * 60,
  KEY_PREFIX: "rl:receipt-ack:",
};

const RATE_LIMIT_DELIVER_NOTE_LINK = {
  MAX_REQUESTS: 10,
  WINDOW_SECONDS: 60 * 60,
  KEY_PREFIX: "rl:deliver-note-link:",
};

const RATE_LIMIT_FILE_CHUNK_PUT = {
  MAX_REQUESTS: 120,
  WINDOW_SECONDS: 60,
  KEY_PREFIX: "rl:put:file-chunk:",
};

const AI_VERIFICATION = {
  USES: 5,
  TTL_SECONDS: 10 * 60,
  KEY_PREFIX: "ai_verify:",
};

const HOSTED_AI_DRAFT = {
  MODEL: "@cf/google/gemma-4-26b-a4b-it",
  MODEL_LABEL: "Gemma 4 26B",
  MAX_PROMPT_CHARS: 2500,
  MAX_OUTPUT_TOKENS: 2048,
};

const HOSTED_AI_COST_GUARD = {
  // Monthly per-user abuse guard. At ~$0.00065/request (Gemma 4 26B @ 2048 max tokens)
  // $1.00 allows ~1,500 requests/month before blocking — far above any legitimate use.
  FAIR_USE_LIMIT_USD: 1.0,
  INPUT_USD_PER_MILLION_TOKENS: 0.100,
  OUTPUT_USD_PER_MILLION_TOKENS: 0.300,
};

/** When set (KV), AI paths require a fresh Turnstile token until verification succeeds. */
const TURNSTILE_CHALLENGE = {
  KEY_PREFIX: "turnstile_challenge:",
  TTL_SECONDS: 45 * 60,
  AI_NOTE_WINDOW_SECONDS: 60 * 60,
  AI_NOTE_COUNT_THRESHOLD: 8,
};

const NOTE_RESERVATION = {
  TTL_SECONDS: 30 * 60,
  ATTACHMENT_TTL_SECONDS: 15 * 60,
  KEY_PREFIX: "note_reserve:",
};

const NOTE_FILE_ACCESS = {
  KEY_PREFIX: "note_file_access:",
};

const NOTE_FILE_STORAGE_CLEANUP = {
  BATCH_SIZE: 200,
  ABANDONED_RESERVED_AFTER_SECONDS: 2 * 60 * 60,
  DOWNLOAD_WINDOW_GRACE_SECONDS: 15 * 60,
  ACTIVE_RECHECK_SECONDS: 6 * 60 * 60,
  RELEASED_ROW_RETENTION_DAYS: 30,
};

const SESSION_POLICY = {
  TTL_SECONDS: 60 * 60 * 24 * 7, // 7 days sliding
  ABSOLUTE_TTL_SECONDS: 60 * 60 * 24 * 30, // 30 days absolute
  ROTATE_SECONDS: 60 * 60 * 24, // 24 hours
};

const USER_STATUS_PENDING = "pending";
const USER_STATUS_ACTIVE = "active";
const STEP_UP_WINDOW_SECONDS = 5 * 60;
// First passkey enrollment without an existing passkey: require a recent magic-link / recovery sign-in.
const PASSKEY_FIRST_ENROLL_AUTH_WINDOW_SECONDS = 10 * 60;
// Tighter step-up window for recovery code regeneration (reduces window if session is compromised)
const RECOVERY_CODE_STEP_UP_WINDOW_SECONDS = 2 * 60;

// Recovery code rate limiting with progressive delays and account lockout
const RECOVERY_CODE_RATE_LIMIT = {
  MAX_ATTEMPTS: 5, // attempts per window before lockout
  WINDOW_SECONDS: 15 * 60, // 15 minute window
  KEY_PREFIX: "recovery_rate_limit:",
  LOCKOUT_THRESHOLD: 10, // total failed attempts before account lockout
  LOCKOUT_DURATION_SECONDS: 60 * 60, // 1 hour lockout
  LOCKOUT_KEY_PREFIX: "recovery_lockout:",
  // Progressive delays: delay = BASE_DELAY * 2^(attempts-1), capped at MAX_DELAY
  PROGRESSIVE_BASE_DELAY_MS: 500,
  PROGRESSIVE_MAX_DELAY_MS: 8000,
};

// Magic link send rate limiting (per IP and per email)
const MAGIC_LINK_RATE_LIMIT = {
  MAX_PER_IP: 20, // max magic links per IP per window
  MAX_PER_EMAIL: 20, // max magic links per email per window
  WINDOW_SECONDS: 60 * 60, // 1 hour window
  IP_KEY_PREFIX: "magic_ip_rate:",
  EMAIL_KEY_PREFIX: "magic_email_rate:",
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
  let hostname = "";
  try {
    hostname = new URL(request.url).hostname;
  } catch {
    hostname = "";
  }
  if (isUploadRelayHostname(hostname)) {
    return buildUploadRelayCorsHeaders(request, allowedOrigin);
  }

  const headers: Record<string, string> = {
    ...SECURITY_HEADERS,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": resolveAccessControlAllowHeaders(request),
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

type AuthEmailLocale = "en" | "de" | "fr" | "es" | "nl";
function normalizeAuthEmailLocale(raw: unknown): AuthEmailLocale {
  if (typeof raw !== "string") return "en";
  const v = raw.trim().toLowerCase();
  return v === "de" || v === "fr" || v === "es" || v === "nl" ? v : "en";
}

function detectAuthEmailLocale(request: Request, explicit?: unknown): AuthEmailLocale {
  const normalizedExplicit = normalizeAuthEmailLocale(explicit);
  if (typeof explicit === "string" && normalizedExplicit !== "en") return normalizedExplicit;
  const accept = request.headers.get("Accept-Language") || "";
  const primary = accept.split(",")[0]?.trim().toLowerCase() || "";
  if (primary.startsWith("de")) return "de";
  if (primary.startsWith("fr")) return "fr";
  if (primary.startsWith("es")) return "es";
  if (primary.startsWith("nl")) return "nl";
  return normalizedExplicit;
}

function pickAuthEmailCopy<T>(
  copy: Partial<Record<AuthEmailLocale, T>> & { en: T },
  locale: AuthEmailLocale,
): T {
  return copy[locale] ?? copy.en;
}

async function sendMagicSignInOtpEmail(
  env: Env,
  to: string,
  code: string,
  locale: AuthEmailLocale = "en",
): Promise<{ ok: boolean; error?: string }> {
  const copy = pickAuthEmailCopy({
    en: {
      subject: "Your PrivateNote sign-in code",
      title: "PrivateNote sign-in code",
      lead: "Your confirmation code is:",
      hint: "Enter this code on the page after you press Continue sign in.",
      ignore: "If you did not request this, you can ignore this email.",
    },
    de: {
      subject: "Ihr PrivateNote-Anmeldecode",
      title: "PrivateNote-Anmeldecode",
      lead: "Ihr Bestaetigungscode lautet:",
      hint: "Geben Sie diesen Code auf der Seite ein, nachdem Sie auf Weiter zur Anmeldung geklickt haben.",
      ignore: "Wenn Sie dies nicht angefordert haben, koennen Sie diese E-Mail ignorieren.",
    },
    fr: {
      subject: "Votre code de connexion PrivateNote",
      title: "Code de connexion PrivateNote",
      lead: "Votre code de confirmation est :",
      hint: "Saisissez ce code sur la page apres avoir clique sur Continuer la connexion.",
      ignore: "Si vous n'avez pas demande ceci, vous pouvez ignorer cet e-mail.",
    },
    es: {
      subject: "Tu codigo de inicio de sesion de PrivateNote",
      title: "Codigo de inicio de sesion de PrivateNote",
      lead: "Tu codigo de confirmacion es:",
      hint: "Introduce este codigo en la pagina despues de pulsar Continuar inicio de sesion.",
      ignore: "Si no solicitaste esto, puedes ignorar este correo.",
    },
    nl: {
      subject: "Je PrivateNote-inlogcode",
      title: "PrivateNote-inlogcode",
      lead: "Je bevestigingscode is:",
      hint: "Voer deze code in op de pagina nadat je op Doorgaan met inloggen hebt gedrukt.",
      ignore: "Als je dit niet hebt aangevraagd, kun je deze e-mail negeren.",
    },
  }, locale);
  const subject = copy.subject;
  const text = [copy.title, "", `${copy.lead} ${code}`, "", copy.hint, "", copy.ignore].join("\n");
  const html = [
    "<div style=\"font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #111827;\">",
    `  <p style="margin: 0 0 12px; font-size: 18px; font-weight: 700;">${copy.title}</p>`,
    `  <p style="margin: 0 0 8px; color: #374151;">${copy.lead}</p>`,
    `  <p style="margin: 0 0 20px; font-size: 28px; letter-spacing: 0.2em; font-weight: 700; color: #111827;">${code}</p>`,
    `  <p style="margin: 0 0 10px; color: #6B7280; font-size: 13px;">${copy.hint}</p>`,
    `  <p style="margin: 0; color: #6B7280; font-size: 12px;">${copy.ignore}</p>`,
    "</div>",
  ].join("");
  return sendEmail(env, { to, subject, text, html });
}

function maskEmailForLog(email: string): string {
  const normalized = email.trim().toLowerCase();
  const at = normalized.indexOf("@");
  if (at <= 0 || at === normalized.length - 1) return "[invalid-email]";
  const local = normalized.slice(0, at);
  const domain = normalized.slice(at + 1);
  const [domainName = "", ...domainRest] = domain.split(".");
  const tld = domainRest.length ? `.${domainRest[domainRest.length - 1]}` : "";
  const localHint =
    local.length <= 2
      ? `${local[0] ?? ""}*`
      : `${local.slice(0, 2)}***${local.slice(-1)}`;
  const domainHint =
    domainName.length <= 2
      ? `${domainName[0] ?? ""}*`
      : `${domainName[0]}***${domainName.slice(-1)}`;
  return `${localHint}@${domainHint}${tld}`;
}

async function sendMagicLinkEmail(
  env: Env,
  to: string,
  magicUrl: string,
  locale: AuthEmailLocale = "en",
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

  const copy = pickAuthEmailCopy({
    en: {
      subject: "Continue to PrivateNote",
      title: "Continue to PrivateNote",
      intro: "Click the secure link below to continue:",
      security:
        "For security, complete sign-in in the same browser and device where you opened the link.",
      expiry: "This link expires automatically and can only be used for this sign-in request.",
      cta: "Continue to PrivateNote",
      ignore: "If you did not request this email, you can safely ignore it.",
      footer: "Securely create, share, and destroy private notes — only the recipient can read them.",
    },
    de: {
      subject: "Weiter zu PrivateNote",
      title: "Weiter zu PrivateNote",
      intro: "Klicken Sie auf den sicheren Link unten, um fortzufahren:",
      security:
        "Aus Sicherheitsgruenden schliessen Sie die Anmeldung im selben Browser und auf demselben Geraet ab, auf dem Sie den Link geoeffnet haben.",
      expiry:
        "Dieser Link laeuft automatisch ab und kann nur fuer diese Anmeldeanfrage verwendet werden.",
      cta: "Weiter zu PrivateNote",
      ignore:
        "Wenn Sie diese E-Mail nicht angefordert haben, koennen Sie sie getrost ignorieren.",
      footer:
        "Private Notizen sicher erstellen, teilen und zerstoeren — nur der Empfaenger kann sie lesen.",
    },
    fr: {
      subject: "Continuer avec PrivateNote",
      title: "Continuer avec PrivateNote",
      intro: "Cliquez sur le lien securise ci-dessous pour continuer :",
      security:
        "Pour votre securite, terminez la connexion dans le meme navigateur et sur le meme appareil que lors de l ouverture du lien.",
      expiry:
        "Ce lien expire automatiquement et ne peut etre utilise que pour cette demande de connexion.",
      cta: "Continuer vers PrivateNote",
      ignore:
        "Si vous n'avez pas demande cet e-mail, vous pouvez l'ignorer en toute securite.",
      footer:
        "Creez, partagez et detruisez des notes privees en toute securite — seul le destinataire peut les lire.",
    },
    es: {
      subject: "Continuar a PrivateNote",
      title: "Continuar a PrivateNote",
      intro: "Haz clic en el enlace seguro de abajo para continuar:",
      security:
        "Por seguridad, completa el inicio de sesion en el mismo navegador y dispositivo donde abriste el enlace.",
      expiry:
        "Este enlace caduca automaticamente y solo puede utilizarse para esta solicitud de inicio de sesion.",
      cta: "Continuar a PrivateNote",
      ignore:
        "Si no solicitaste este correo, puedes ignorarlo sin problema.",
      footer:
        "Crea, comparte y destruye notas privadas de forma segura — solo el destinatario puede leerlas.",
    },
    nl: {
      subject: "Doorgaan naar PrivateNote",
      title: "Doorgaan naar PrivateNote",
      intro: "Klik op de beveiligde link hieronder om door te gaan:",
      security:
        "Log voor de veiligheid in op dezelfde browser en hetzelfde apparaat waar je de link hebt geopend.",
      expiry: "Deze link verloopt automatisch en kan alleen voor dit inlogverzoek worden gebruikt.",
      cta: "Doorgaan naar PrivateNote",
      ignore: "Als je deze e-mail niet hebt aangevraagd, kun je hem negeren.",
      footer:
        "Maak, deel en vernietig privénotities veilig — alleen de ontvanger kan ze lezen.",
    },
  }, locale);
  const subject = copy.subject;
  const text = [
    copy.title,
    "",
    copy.intro,
    magicUrl,
    "",
    copy.security,
    "",
    copy.expiry,
    "",
    copy.ignore,
    "",
    "—",
    "PrivateNote",
    copy.footer,
  ].join("\n");
  const securityHtml =
    locale === "en"
      ? "For security, complete sign-in in the <strong>same browser and device</strong> where you opened the link."
      : locale === "de"
        ? "Aus Sicherheitsgruenden schliessen Sie die Anmeldung im <strong>selben Browser und auf demselben Geraet</strong> ab, auf dem Sie den Link geoeffnet haben."
        : locale === "fr"
          ? "Pour votre securite, terminez la connexion dans le <strong>meme navigateur et sur le meme appareil</strong> que lors de l ouverture du lien."
          : locale === "nl"
            ? "Log voor de veiligheid in op de <strong>zelfde browser en hetzelfde apparaat</strong> waar je de link hebt geopend."
            : "Por seguridad, completa el inicio de sesion en el <strong>mismo navegador y dispositivo</strong> donde abriste el enlace.";
  const html = [
    "<div style=\"font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #111827; max-width: 480px; margin: 0; padding: 0 16px 16px; -webkit-text-size-adjust: 100%; box-sizing: border-box;\">",
    `  <div style="font-size: 18px; font-weight: 700; margin: 0 0 6px; line-height: 1.25;">${copy.title}</div>`,
    `  <p style="margin: 0 0 8px; color: #374151; font-size: 15px; line-height: 1.4;">${copy.intro}</p>`,
    "  <a href=\"" +
      magicUrl +
      `" referrerpolicy="no-referrer" style="display: inline-block; max-width: 100%; box-sizing: border-box; background: #0066FF; color: #FFFFFF; text-decoration: none; padding: 10px 18px; border-radius: 10px; font-weight: 600; font-size: 15px; line-height: 1.25; text-align: center; word-wrap: break-word;">${copy.cta}</a>`,
    `  <p style="margin: 12px 0 0; color: #374151; font-size: 13px; line-height: 1.45;">${securityHtml}</p>`,
    `  <p style="margin: 8px 0 0; color: #374151; font-size: 13px; line-height: 1.45;">${copy.expiry}</p>`,
    `  <p style="margin: 10px 0 0; color: #6B7280; font-size: 12px; line-height: 1.45;">${copy.ignore}</p>`,
    `  <hr style="border: 0; border-top: 1px solid #E5E7EB; margin: 18px 0 14px;" />`,
    `  <p style="margin: 0; font-size: 14px; font-weight: 700; line-height: 1.3;">PrivateNote</p>`,
    `  <p style="margin: 6px 0 0; color: #6B7280; font-size: 12px; line-height: 1.42;">${copy.footer}</p>`,
    "</div>",
  ].join("");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      text,
      html,
    }),
  });

  if (!res.ok) {
    await res.text().catch(() => "");
    return { ok: false, error: `Resend error: ${res.status}` };
  }

  return { ok: true };
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

  console.log(
    `[EMAIL] Sending email via Resend: to=${maskEmailForLog(options.to)}, subject=${options.subject}`,
  );

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
  console.log(`[EMAIL] Resend API response: status=${res.status}`);

  if (!res.ok) {
    console.error(`[EMAIL] Resend API error: status=${res.status}`);
    return { ok: false, error: `Resend error: ${res.status}` };
  }

  try {
    const responseJson = JSON.parse(responseText);
    console.log(`[EMAIL] Resend email sent successfully: id=${responseJson.id || "unknown"}`);
  } catch (e) {
    console.log(`[EMAIL] Resend email sent successfully (response not JSON)`);
  }

  return { ok: true };
}

function isPremiumAccountType(accountType: unknown, plan: unknown): boolean {
  return (
    accountType === "personal_premium" ||
    accountType === "business_premium" ||
    plan === "personal_premium" ||
    plan === "business_premium" ||
    plan === "premium"
  );
}

async function noteCreationAccountType(env: Env, request: Request): Promise<AccountType> {
  const session = await getSessionFromRequest(env, request, { rotate: false });
  if (!session?.id || !env.AUTH_DB) return "free";
  try {
    return (await getAccountEntitlements(env, session.id)).accountType;
  } catch {
    return "free";
  }
}

const ACCOUNT_BRANDING_CORE_COLUMNS = [
  "business_display_name",
  "business_logo_key",
  "business_accent_color",
  "business_background_color",
  "business_text_color",
] as const;

const ACCOUNT_BRANDING_OPTIONAL_COLUMNS = [
  "business_sender_name",
  "business_sender_role",
  "business_trust_message",
  "business_banner_key",
  "business_background_style",
  "business_portal_layout",
  "business_opened_branding",
  "business_show_branding_after_reveal",
] as const;

async function selectAccountBrandingRow(
  env: Env,
  userId: string,
): Promise<Record<string, string | null> | null> {
  if (!env.AUTH_DB) return null;
  const columns: string[] = [...ACCOUNT_BRANDING_CORE_COLUMNS];
  try {
    const info = await env.AUTH_DB.prepare("PRAGMA table_info(users)").all<{ name: string }>();
    const names = new Set((info.results || []).map((row) => row.name));
    for (const column of ACCOUNT_BRANDING_OPTIONAL_COLUMNS) {
      if (names.has(column)) columns.push(column);
    }
  } catch {
    // Core columns only — a missing optional column must not drop sender identity.
  }
  return env.AUTH_DB.prepare(`SELECT ${columns.join(", ")} FROM users WHERE id = ? LIMIT 1`)
    .bind(userId)
    .first<Record<string, string | null>>();
}

function fillRevealBrandingIdentityGaps<
  T extends {
    companyName?: string;
    senderName?: string;
    senderRole?: string;
    trustMessage?: string;
  },
>(trusted: T, client: T | undefined): T {
  if (!client) return trusted;
  return {
    ...trusted,
    ...(!trusted.companyName && client.companyName ? { companyName: client.companyName } : {}),
    ...(!trusted.senderName && client.senderName ? { senderName: client.senderName } : {}),
    ...(!trusted.senderRole && client.senderRole ? { senderRole: client.senderRole } : {}),
    ...(!trusted.trustMessage && client.trustMessage ? { trustMessage: client.trustMessage } : {}),
  };
}

async function resolveAccountRevealBranding(env: Env, request: Request) {
  const session = await getSessionFromRequest(env, request, { rotate: false });
  if (!session?.id || !env.AUTH_DB) return undefined;
  const entitlements = await getAccountEntitlements(env, session.id);
  if (!entitlements.capabilities.revealBranding) return undefined;
  try {
    const row = await selectAccountBrandingRow(env, session.id);
    if (!row) return undefined;
    const layout = parseStoredPortalLayoutJson(row.business_portal_layout);
    const opened = openedSettingsFromAccountColumns(
      row.business_opened_branding,
      row.business_show_branding_after_reveal,
    );
    return toRevealBranding({
      companyName: row.business_display_name,
      senderName: row.business_sender_name,
      senderRole: row.business_sender_role,
      trustMessage: row.business_trust_message,
      logoUrl: publicBrandingAssetPath(row.business_logo_key, "logo"),
      bannerUrl: publicBrandingAssetPath(row.business_banner_key, "banner"),
      accentColor: row.business_accent_color,
      backgroundColor: row.business_background_color,
      textColor: row.business_text_color,
      backgroundStyle: (row.business_background_style ?? "neutral") as "neutral" | "gradient" | "vignette" | "glow" | "mesh" | "banner",
      ...layout,
      showBrandingAfterReveal: opened.show,
      openedBackground: opened.background,
      openedShowLogo: opened.showLogo,
      openedShowSenderName: opened.showSenderName,
      openedShowCompanyName: opened.showCompanyName,
      openedShowTrustMessage: opened.showTrustMessage,
      openedBannerUrl: opened.bannerUrl,
      openedAccentColor: opened.accentColor,
      openedTextColor: opened.textColor,
      openedBackgroundColor: opened.backgroundColor,
      openedBackgroundZoom: opened.backgroundZoom,
      noteBorderColor: opened.noteBorderColor,
    });
  } catch (error) {
    console.warn("[BRANDING] Could not resolve account branding:", error);
    return undefined;
  }
}

async function noteCreationAllowsPremiumExpiry(env: Env, request: Request): Promise<boolean> {
  return (await noteCreationAccountType(env, request)) !== "free";
}

function noteReadNotificationDeviceLabel(request: Request): string {
  const userAgent = request.headers.get("User-Agent") || "";
  if (/iPhone|iPad|iPod/i.test(userAgent)) return "iOS device";
  if (/Android/i.test(userAgent)) return "Android device";
  if (/Macintosh|Mac OS X/i.test(userAgent)) return "Mac";
  if (/Windows/i.test(userAgent)) return "Windows device";
  if (/Linux/i.test(userAgent)) return "Linux device";
  return "unknown device";
}

/**
 * Whether the recipient-verification gate for a note actually exists.
 *
 * Alerts and receipt acknowledgment degrade quietly when registration fails —
 * the sender loses a notification. Recipient verification is access control, so
 * a note whose gate was requested but never written is readable by anyone with
 * the link, which is the opposite of what the sender was shown. The caller has
 * to be able to tell those two cases apart.
 */
type SentNoteRegistration = {
  recipientGateRequired: boolean;
  recipientGateApplied: boolean;
  failureReason: string | null;
};

async function registerPremiumSentNote(
  env: Env,
  request: Request,
  noteId: string,
  input: {
    notifyOnOpen?: boolean;
    notifyOnDestroyed?: boolean;
    notifyOnAttachmentDownload?: boolean;
    requireRecipientVerification?: boolean;
    requireReceiptAck?: boolean;
    receiptAckTokenHash?: string | null;
    receiptAckStatement?: string | null;
    unopenedReminderHours?: number | null;
    recipientEmail?: string | null;
    alertNotifyAccountEmail?: boolean;
    alertCustomEmail?: string | null;
    label?: string | null;
    expiresAt?: string | null;
  },
): Promise<SentNoteRegistration> {
  const notifyOnOpen = input.notifyOnOpen === true;
  const notifyOnDestroyed = input.notifyOnDestroyed === true;
  const notifyOnAttachmentDownload = input.notifyOnAttachmentDownload === true;
  const requireRecipientVerification = input.requireRecipientVerification === true;
  const requireReceiptAck = input.requireReceiptAck === true;
  const wantsExplicitTracking =
    notifyOnOpen ||
    notifyOnDestroyed ||
    notifyOnAttachmentDownload ||
    requireRecipientVerification ||
    requireReceiptAck;
  const notRegistered = (failureReason: string | null): SentNoteRegistration => ({
    recipientGateRequired: requireRecipientVerification,
    recipientGateApplied: false,
    failureReason,
  });
  if (!env.AUTH_DB) return notRegistered("auth_db_unavailable");

  try {
    const session = await getSessionFromRequest(env, request, { rotate: false });
    if (!session?.id) return notRegistered("unauthenticated");
    // Starter/Business can revoke unopened notes; register tracking even when no
    // alert/gate options were selected so revoke is available from success + Activity.
    const canRevokeUnopened = planFeaturesFor(
      (await getAccountEntitlements(env, session.id)).accountType,
    ).revokeUnopened;
    if (!wantsExplicitTracking && !canRevokeUnopened) {
      return notRegistered(null);
    }
    await insertSentNote(env, {
      userId: session.id,
      noteId,
      label: input.label,
      recipientEmail: input.recipientEmail,
      notifyOnOpen,
      notifyOnDestroyed,
      notifyOnAttachmentDownload,
      alertNotifyAccountEmail: input.alertNotifyAccountEmail,
      alertCustomEmail: input.alertCustomEmail,
      requireRecipientVerification,
      requireReceiptAck,
      receiptAckTokenHash: input.receiptAckTokenHash,
      receiptAckStatement: input.receiptAckStatement,
      unopenedReminderHours: input.unopenedReminderHours,
      expiresAt: input.expiresAt,
      proofEnabled: true,
    });
    return {
      recipientGateRequired: requireRecipientVerification,
      // insertSentNote writes the KV gate in the same call and throws rather
      // than returning when it cannot, so reaching here means the gate is live.
      recipientGateApplied: requireRecipientVerification,
      failureReason: null,
    };
  } catch (error) {
    console.warn("[SENT_NOTES] Failed to register sent-note notification:", error);
    return notRegistered(error instanceof Error ? error.message : "unknown_error");
  }
}

/**
 * Destroy a note that was stored without the recipient gate it was asked for.
 *
 * The note reaches the Durable Object before sent-note registration runs, so a
 * gate failure otherwise hands back a link that opens for anyone holding it.
 * Sending nothing is the only safe outcome: the sender can retry, while an
 * ungated link cannot be un-shared once it has been passed on.
 */
async function discardUngatedNote(
  env: Env,
  request: Request,
  noteId: string,
  options: {
    hasAttachment: boolean;
    reservationId: string | null;
    failureReason: string | null;
  },
): Promise<Response> {
  const reason = `recipient verification gate missing (${options.failureReason ?? "unknown"})`;
  console.error(`[SENT_NOTES] Discarding note ${noteId}: ${reason}`);
  try {
    const stub = getSecureNoteStub(env, noteId);
    const deleteUrl = new URL(`/api/notes/${noteId}`, request.url);
    await stub.fetch(new Request(deleteUrl.toString(), { method: "DELETE" }) as any);
  } catch (error) {
    console.error(`[SENT_NOTES] Could not delete ungated note ${noteId}:`, error);
  }
  if (options.hasAttachment) {
    await cleanupNoteFileChunks(env, noteId, reason);
  }
  await releaseAccountFileStorageReservation(env, noteId, reason);
  if (options.reservationId) {
    await clearReservation(env, options.reservationId);
  }

  switch (options.failureReason) {
    case "sender_email_unverified":
      return jsonResponse(
        {
          error: "sender_email_unverified",
          message:
            "Verify your email address before sending a note that requires recipient verification.",
        },
        403,
        request,
      );
    case "premium_required":
      return jsonResponse(
        {
          error: "premium_required",
          message: "Recipient verification requires Starter or Business.",
        },
        403,
        request,
      );
    case "recipient_email_required":
      return jsonResponse(
        {
          error: "recipient_email_required",
          message: "Recipient verification needs the recipient's email address.",
        },
        400,
        request,
      );
    default:
      return jsonResponse(
        {
          error: "recipient_verification_unavailable",
          message:
            "Recipient verification could not be applied, so nothing was sent. Please try again.",
        },
        503,
        request,
      );
  }
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
        "Access-Control-Allow-Headers": "Content-Type, x-admin-token, x-file-access-token",
        "Content-Security-Policy": getApiContentSecurityPolicy(),
      }),
  };
  if (request) {
    headers["Referrer-Policy"] = "no-referrer";
  }

  // First-party rate-limit cookie: combined with IP for abuse buckets (shared NAT). HttpOnly, not used for analytics.
  // Upload relays are cookie-less (encrypt.lu); never Set-Cookie on that host.
  if (request) {
    let uploadRelay = false;
    try {
      uploadRelay = isUploadRelayHostname(new URL(request.url).hostname);
    } catch {
      uploadRelay = false;
    }
    if (!uploadRelay) {
      const cookieHeader = request.headers.get("Cookie") || "";
      const hasClientCookie = /(?:^|;\s*)pn_client_id=([^;]+)/.test(cookieHeader);
      if (!hasClientCookie) {
        const clientId = randomId(16);
        const maxAge = 30 * 24 * 60 * 60;
        headers["Set-Cookie"] = `pn_client_id=${clientId}; Path=/; Max-Age=${maxAge}; SameSite=Lax; Secure; HttpOnly`;
      }
    }
  }

  return new Response(JSON.stringify(data), {
    status,
    headers,
  });
}

const getEuSecureNotesNamespace = (env: Env): DurableObjectNamespace => {
  // jurisdiction() is not supported in local workerd/Miniflare — fall back to plain namespace
  try {
    return env.SECURE_NOTES.jurisdiction("eu");
  } catch {
    return env.SECURE_NOTES;
  }
};

const getSecureNoteStub = (env: Env, id: string): DurableObjectStub => {
  const namespace = getEuSecureNotesNamespace(env);
  return namespace.get(namespace.idFromName(id));
};

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
  | "recipient_verification_failed"
  | "recipient_verification_rate_limited"
  | "recipient_verification_success"
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
function getMagicLinkIssuanceDiagnostics(env: Env, request: Request): {
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
  record: Pick<MagicPrepareKvRecord, "risk" | "otpHash">,
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
    if (rec.risk === "medium" && typeof rec.otpHash !== "string") {
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

  let otpHash: string | undefined;
  if (policy.risk === "medium") {
    await logAuditEvent(env, {
      userId: userIdForAudit,
      eventType: "magic_context_medium_risk",
      status: "warning",
      details: {
        ipSoftMismatch: policy.ipDrift,
        uaSoftMismatch: policy.uaDrift,
        emailOtpRequired: true,
      },
      ip: getRequestIp(request),
      userAgent: request.headers.get("User-Agent"),
    });
    const email = normalizeEmail(typeof payload.email === "string" ? payload.email : null);
    if (!email) {
      return jsonResponse({ message: "Invalid link data" }, 400, request);
    }
    const otp = generateMagicEmailOtpDigits();
    otpHash = await sha256Base64Url(otp);
    const locale = normalizeAuthEmailLocale(payload.locale);
    const sendResult = await sendMagicSignInOtpEmail(env, email, otp, locale);
    if (!sendResult.ok) {
      await logAuditEvent(env, {
        userId: userIdForAudit,
        eventType: "magic_link_failed",
        status: "failure",
        details: { reason: "sign_in_otp_email_failed", error: sendResult.error?.slice(0, 500) },
        ip: getRequestIp(request),
        userAgent: request.headers.get("User-Agent"),
      });
      return jsonResponse({ message: "Could not send confirmation email" }, 500, request);
    }
  }

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

  if (record.risk === "medium" && record.otpHash) {
    const normalized = normalizeMagicEmailCode(emailCode);
    if (!normalized) {
      return jsonResponse(
        {
          message: "Enter the 6-digit code we emailed you.",
          code: "magic_email_code_required",
        },
        400,
        request,
      );
    }
    const gotHash = await sha256Base64Url(normalized);
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
    await env.AUTH_DB.prepare("UPDATE sessions SET auth_complete = 0 WHERE session_id_hash = ?")
      .bind(pendingHash)
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
    headers.append(
      "Set-Cookie",
      sessionCookie(session.sessionId, getSessionCookieKindForRequest(request)),
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
  await env.AUTH_DB.prepare(
    "INSERT INTO sessions (id, session_id_hash, user_id, expires_at, absolute_expires_at, created_at, last_seen_at, last_auth_at, last_stepup_at, user_agent, ip, city, country, device_label, client_bucket) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  )
    .bind(
      id,
      sessionHash,
      userId,
      expiresAt,
      absoluteExpiresAt,
      nowIso,
      nowIso,
      nowIso,
      lastStepUpAt,
      userAgent,
      ip,
      city,
      country,
      deviceLabel,
      clientBucket,
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

function sessionCookie(sessionId: string, kind: SessionCookieKind): string {
  // SameSite=None required for cross-origin requests (frontend on Pages, API on Workers)
  const name = sessionCookieNameForKind(kind);
  return `${name}=${sessionId}; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=${SESSION_POLICY.TTL_SECONDS}`;
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
  const locale = detectAuthEmailLocale(request);
  const pendingDeletionCopy = pickAuthEmailCopy({
    en: {
      subject: "Account deletion scheduled (48 hours) - PrivateNote",
      title: "Account deletion scheduled",
      body1: "Your PrivateNote account deletion was requested using a backup email verification method.",
      body2: "Your account is scheduled for permanent deletion in 48 hours.",
      body3: "If this was not you, cancel deletion immediately:",
      cta: "Review cancellation",
      body4: "If you do nothing, deletion will complete automatically after the waiting period.",
    },
    de: {
      subject: "Kontoloeschung geplant (48 Stunden) - PrivateNote",
      title: "Kontoloeschung geplant",
      body1: "Die Loeschung Ihres PrivateNote-Kontos wurde ueber eine Backup-E-Mail-Verifizierung angefordert.",
      body2: "Ihr Konto ist zur endgueltigen Loeschung in 48 Stunden eingeplant.",
      body3: "Wenn Sie das nicht waren, stornieren Sie die Loeschung sofort:",
      cta: "Stornierung pruefen",
      body4: "Wenn Sie nichts unternehmen, wird die Loeschung nach der Wartezeit automatisch abgeschlossen.",
    },
    fr: {
      subject: "Suppression de compte planifiee (48 heures) - PrivateNote",
      title: "Suppression de compte planifiee",
      body1: "La suppression de votre compte PrivateNote a ete demandee via une methode de verification e-mail de secours.",
      body2: "Votre compte est programme pour une suppression definitive dans 48 heures.",
      body3: "Si vous n'etes pas a l'origine de cette demande, annulez immediatement :",
      cta: "Verifier l'annulation",
      body4: "Si vous ne faites rien, la suppression sera finalisee automatiquement apres le delai d'attente.",
    },
    es: {
      subject: "Eliminacion de cuenta programada (48 horas) - PrivateNote",
      title: "Eliminacion de cuenta programada",
      body1: "La eliminacion de tu cuenta de PrivateNote se solicito mediante verificacion por correo de respaldo.",
      body2: "Tu cuenta quedara eliminada de forma permanente en 48 horas.",
      body3: "Si no fuiste tu, cancela la eliminacion de inmediato:",
      cta: "Revisar cancelacion",
      body4: "Si no haces nada, la eliminacion se completara automaticamente despues del periodo de espera.",
    },
    nl: {
      subject: "Accountverwijdering gepland (48 uur) - PrivateNote",
      title: "Accountverwijdering gepland",
      body1: "De verwijdering van je PrivateNote-account is aangevraagd via een back-up e-mailverificatie.",
      body2: "Je account staat gepland voor permanente verwijdering over 48 uur.",
      body3: "Als jij dit niet was, annuleer de verwijdering meteen:",
      cta: "Annulering bekijken",
      body4: "Als je niets doet, wordt de verwijdering na de wachttijd automatisch voltooid.",
    },
  }, locale);

  const emailResult = await sendEmail(env, {
    to: userEmail,
    subject: pendingDeletionCopy.subject,
    text:
      `${pendingDeletionCopy.body1}\n\n` +
      `${pendingDeletionCopy.body2}\n\n` +
      `${pendingDeletionCopy.body3}\n${cancelUrl}\n\n` +
      `${pendingDeletionCopy.body4}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>${pendingDeletionCopy.title}</h2>
        <p>${pendingDeletionCopy.body1}</p>
        <p>${pendingDeletionCopy.body2}</p>
        <p>${pendingDeletionCopy.body3}</p>
        <p style="margin: 24px 0;">
          <a href="${cancelUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">
            ${pendingDeletionCopy.cta}
          </a>
        </p>
        <p>${pendingDeletionCopy.body4}</p>
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

async function getSessionFromRequest(
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
  if (options.rotate && now - lastSeenMs > SESSION_POLICY.ROTATE_SECONDS * 1000) {
    const rotated = await createSession(env, row.user_id, request, "magic");
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
    const nextExpiresAt = new Date(now + 1000 * SESSION_POLICY.TTL_SECONDS).toISOString();
    await env.AUTH_DB.prepare("UPDATE sessions SET last_seen_at = ?, expires_at = ? WHERE session_id_hash = ?")
      .bind(new Date().toISOString(), nextExpiresAt, sessionHash)
      .run();
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

async function getTurnstileChallengeRequired(kv: KVNamespace, clientId: string): Promise<boolean> {
  try {
    const v = await kv.get(`${TURNSTILE_CHALLENGE.KEY_PREFIX}${clientId}`);
    return Boolean(v);
  } catch (error) {
    console.warn("[TURNSTILE_CHALLENGE] read failed:", error);
    return false;
  }
}

async function setTurnstileChallengeRequired(kv: KVNamespace, clientId: string): Promise<void> {
  try {
    await kv.put(`${TURNSTILE_CHALLENGE.KEY_PREFIX}${clientId}`, "1", {
      expirationTtl: TURNSTILE_CHALLENGE.TTL_SECONDS,
    });
  } catch (error) {
    console.warn("[TURNSTILE_CHALLENGE] set failed:", error);
  }
}

async function clearTurnstileChallengeRequired(kv: KVNamespace, clientId: string): Promise<void> {
  try {
    await kv.delete(`${TURNSTILE_CHALLENGE.KEY_PREFIX}${clientId}`);
  } catch (error) {
    console.warn("[TURNSTILE_CHALLENGE] clear failed:", error);
  }
}

async function bumpAiNoteCountAndMaybeChallenge(env: Env, clientId: string): Promise<void> {
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

async function handleAuthRoutes(request: Request, env: Env): Promise<Response | null> {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const method = request.method;

  if (!pathname.startsWith("/api/auth/")) {
    return null;
  }

  if (pathname === "/api/auth/account/summary" && method === "GET") {
    if (!env.AUTH_DB) {
      return jsonResponse({ message: "Auth database not configured" }, 501, request);
    }
    const session = await getSessionFromRequest(env, request, { rotate: true });
    if (!session) {
      return jsonResponse({ message: "Unauthorized" }, 401, request);
    }

    const user = await env.AUTH_DB.prepare(
      `SELECT id, email, account_type, plan, email_notifications, preferred_language
       FROM users
       WHERE id = ?
       LIMIT 1`,
    )
      .bind(session.id)
      .first<{
        id: string;
        email: string | null;
        account_type: string | null;
        plan: string | null;
        email_notifications: number | null;
        preferred_language: string | null;
      }>();

    if (!user) {
      return jsonResponse({ message: "Unauthorized" }, 401, request);
    }

    let allowHostedAi = false;
    try {
      const info = await env.AUTH_DB.prepare("PRAGMA table_info(users)").all<{ name: string }>();
      const hasAllowHostedAiColumn = (info.results ?? []).some((row) => row.name === "allow_hosted_ai");
      if (hasAllowHostedAiColumn) {
        const hostedAiPref = await env.AUTH_DB.prepare(
          "SELECT allow_hosted_ai FROM users WHERE id = ? LIMIT 1",
        )
          .bind(session.id)
          .first<{ allow_hosted_ai: number | null }>();
        allowHostedAi = hostedAiPref?.allow_hosted_ai === 1;
      }
    } catch (error) {
      console.warn("[AUTH] Failed to load hosted AI preference:", error);
    }

    const headers = new Headers(getCorsHeaders(request));
    headers.set("Content-Type", "application/json");
    applyRotatedSession(request, headers, session);
    return new Response(
      JSON.stringify({
        ok: true,
        email: user.email,
        accountType: user.account_type ?? "free",
        plan: user.plan ?? "free",
        emailNotifications: user.email_notifications !== 0,
        preferredLanguage: user.preferred_language ?? null,
        allowHostedAi,
      }),
      { status: 200, headers },
    );
  }

  if (pathname === "/api/auth/account/preferences" && method === "PATCH") {
    if (!env.AUTH_DB) {
      return jsonResponse({ message: "Auth database not configured" }, 501, request);
    }
    const session = await getSessionFromRequest(env, request, { rotate: false });
    if (!session) {
      return jsonResponse({ message: "Unauthorized" }, 401, request);
    }

    let body: {
      emailNotifications?: unknown;
      preferredLanguage?: unknown;
      allowHostedAi?: unknown;
    };
    try {
      body = await readJsonBody(request) as typeof body;
    } catch {
      return jsonResponse({ message: "Invalid JSON" }, 400, request);
    }

    const updates: string[] = [];
    const bindings: unknown[] = [];
    if (typeof body.emailNotifications === "boolean") {
      updates.push("email_notifications = ?");
      bindings.push(body.emailNotifications ? 1 : 0);
    }
    if (typeof body.preferredLanguage === "string") {
      const preferredLanguage = body.preferredLanguage.trim().toLowerCase().split("-")[0];
      if (!isSupportedLanguage(preferredLanguage)) {
        return jsonResponse({ message: "Unsupported language" }, 400, request);
      }
      updates.push("preferred_language = ?");
      bindings.push(preferredLanguage);
    }
    if (typeof body.allowHostedAi === "boolean") {
      const info = await env.AUTH_DB.prepare("PRAGMA table_info(users)").all<{ name: string }>();
      const hasAllowHostedAiColumn = (info.results ?? []).some((row) => row.name === "allow_hosted_ai");
      if (!hasAllowHostedAiColumn) {
        return jsonResponse({ message: "Hosted AI preference migration is required" }, 503, request);
      }
      updates.push("allow_hosted_ai = ?");
      bindings.push(body.allowHostedAi ? 1 : 0);
    }
    if (updates.length === 0) {
      return jsonResponse({ message: "At least one preference is required" }, 400, request);
    }

    updates.push("updated_at = ?");
    bindings.push(new Date().toISOString(), session.id);
    await env.AUTH_DB.prepare(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`)
      .bind(...bindings)
      .run();

    return jsonResponse({ ok: true }, 200, request);
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
          residentKey: "preferred",
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
      const locale = detectAuthEmailLocale(request);
      const passkeyDevice = credentialMetadata.deviceInfo || "this device";
      const passkeyType = getPasskeyLabel(transports || null);
      const securityUrl = `${getMagicLinkOrigin(env, request)}/account/security`;
      const passkeyAddedCopy = pickAuthEmailCopy({
        en: {
          subject: "Passkey added to your PrivateNote account",
          title: "Passkey added",
          line1: "A new passkey was added to your PrivateNote account.",
          typeLabel: "Passkey type:",
          deviceLabel: "Device:",
          line2: "If this was you, no further action is needed.",
          line3: "If this was not you, review your passkeys in Security settings and remove any you do not recognize.",
          cta: "Open Security settings",
          line4: "If anything looks wrong, secure your account immediately and contact",
        },
        de: {
          subject: "Passkey zu Ihrem PrivateNote-Konto hinzugefuegt",
          title: "Passkey hinzugefuegt",
          line1: "Ein neuer Passkey wurde zu Ihrem PrivateNote-Konto hinzugefuegt.",
          typeLabel: "Passkey-Typ:",
          deviceLabel: "Geraet:",
          line2: "Wenn Sie das waren, ist keine weitere Aktion erforderlich.",
          line3: "Wenn Sie das nicht waren, pruefen Sie Ihre Passkeys in den Sicherheitseinstellungen und entfernen Sie unbekannte Eintraege.",
          cta: "Sicherheitseinstellungen oeffnen",
          line4: "Wenn etwas verdaechtig ist, sichern Sie Ihr Konto sofort und kontaktieren Sie",
        },
        fr: {
          subject: "Cle d'acces ajoutee a votre compte PrivateNote",
          title: "Cle d'acces ajoutee",
          line1: "Une nouvelle cle d'acces a ete ajoutee a votre compte PrivateNote.",
          typeLabel: "Type de cle d'acces :",
          deviceLabel: "Appareil :",
          line2: "Si c'etait vous, aucune autre action n'est necessaire.",
          line3: "Si ce n'etait pas vous, verifiez vos cles d'acces dans les parametres de securite et supprimez celles que vous ne reconnaissez pas.",
          cta: "Ouvrir les parametres de securite",
          line4: "Si quelque chose semble incorrect, securisez votre compte immediatement et contactez",
        },
        es: {
          subject: "Passkey agregada a tu cuenta de PrivateNote",
          title: "Passkey agregada",
          line1: "Se agrego una nueva passkey a tu cuenta de PrivateNote.",
          typeLabel: "Tipo de passkey:",
          deviceLabel: "Dispositivo:",
          line2: "Si fuiste tu, no necesitas hacer nada mas.",
          line3: "Si no fuiste tu, revisa tus passkeys en Configuracion de seguridad y elimina las que no reconozcas.",
          cta: "Abrir configuracion de seguridad",
          line4: "Si algo parece incorrecto, protege tu cuenta de inmediato y contacta a",
        },
        nl: {
          subject: "Passkey toegevoegd aan je PrivateNote-account",
          title: "Passkey toegevoegd",
          line1: "Er is een nieuwe passkey toegevoegd aan je PrivateNote-account.",
          typeLabel: "Passkey-type:",
          deviceLabel: "Apparaat:",
          line2: "Als jij dit was, hoef je niets te doen.",
          line3: "Als jij dit niet was, controleer je passkeys in Beveiligingsinstellingen en verwijder wat je niet herkent.",
          cta: "Beveiligingsinstellingen openen",
          line4: "Als iets niet klopt, beveilig je account meteen en neem contact op met",
        },
      }, locale);
      const emailResult = await sendEmail(env, {
        to: accountEmail,
        subject: passkeyAddedCopy.subject,
        text:
          `${passkeyAddedCopy.line1}\n\n` +
          `${passkeyAddedCopy.typeLabel} ${passkeyType}\n` +
          `${passkeyAddedCopy.deviceLabel} ${passkeyDevice}\n\n` +
          `${passkeyAddedCopy.line2}\n\n` +
          `${passkeyAddedCopy.line3}\n${securityUrl}\n\n` +
          `${passkeyAddedCopy.line4} contact@privatenote.ai.`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>${passkeyAddedCopy.title}</h2>
            <p>${passkeyAddedCopy.line1}</p>
            <p>
              <strong>${passkeyAddedCopy.typeLabel}</strong> ${passkeyType}<br />
              <strong>${passkeyAddedCopy.deviceLabel}</strong> ${passkeyDevice}
            </p>
            <p>${passkeyAddedCopy.line2}</p>
            <p>${passkeyAddedCopy.line3}</p>
            <p style="margin: 24px 0;">
              <a href="${securityUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">
                ${passkeyAddedCopy.cta}
              </a>
            </p>
            <p style="color: #4b5563;">${passkeyAddedCopy.line4} <a href="mailto:contact@privatenote.ai">contact@privatenote.ai</a>.</p>
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

    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : null;
    let allowCredentials: Array<{ id: string; type: "public-key"; transports?: AuthenticatorTransportFuture[] }> = [];

    if (email) {
      const user = await env.AUTH_DB.prepare(
        "SELECT id FROM users WHERE email = ? LIMIT 1"
      )
        .bind(email)
        .first<{ id: string }>();

      if (user?.id) {
        const creds = await env.AUTH_DB.prepare(
          "SELECT credential_id, transports FROM webauthn_credentials WHERE user_id = ?"
        )
          .bind(user.id)
          .all<{ credential_id: string; transports: string | null }>();

        allowCredentials = (creds.results || [])
          .filter((cred) => typeof cred.credential_id === "string" && cred.credential_id.length > 0)
          .map((cred) => ({
            id: cred.credential_id,
            type: "public-key" as const,
            transports: parseTransports(cred.transports),
          }));
      }
    }

    let options;
    try {
      options = await generateAuthenticationOptions({
        rpID,
        allowCredentials: allowCredentials.length
          ? allowCredentials.map((cred) => ({
            id: cred.id,
            transports: cred.transports,
          }))
          : undefined,
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
    const user = await env.AUTH_DB.prepare(
      "SELECT id, email, status, email_verified FROM users WHERE id = ? LIMIT 1"
    )
      .bind(session.id)
      .first<{
        id: string;
        email: string | null;
        status: string | null;
        email_verified: number | null;
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
      const locale = detectAuthEmailLocale(request);
      const recoveryCodesCopy = pickAuthEmailCopy({
        en: {
          subject: "Recovery codes regenerated - PrivateNote",
          title: "Recovery codes regenerated",
          body1: "Your PrivateNote recovery codes were regenerated. Your previous unused recovery codes no longer work.",
          body2: "If you did not do this, please secure your account:",
          li1: "Revoke other sessions from Security Settings",
          li2: "Add or verify your passkey",
          footer: "This is an automated security notification.",
        },
        de: {
          subject: "Wiederherstellungscodes neu erstellt - PrivateNote",
          title: "Wiederherstellungscodes neu erstellt",
          body1: "Ihre PrivateNote-Wiederherstellungscodes wurden neu erstellt. Ihre zuvor ungenutzten Codes sind nicht mehr gueltig.",
          body2: "Wenn Sie das nicht waren, sichern Sie bitte Ihr Konto:",
          li1: "Widerrufen Sie andere Sitzungen in den Sicherheitseinstellungen",
          li2: "Fuegen Sie einen Passkey hinzu oder bestaetigen Sie ihn",
          footer: "Dies ist eine automatische Sicherheitsbenachrichtigung.",
        },
        fr: {
          subject: "Codes de recuperation regenerees - PrivateNote",
          title: "Codes de recuperation regenerees",
          body1: "Vos codes de recuperation PrivateNote ont ete regeneres. Vos anciens codes non utilises ne fonctionnent plus.",
          body2: "Si vous n'etes pas a l'origine de cette action, securisez votre compte :",
          li1: "Revoquez les autres sessions dans les parametres de securite",
          li2: "Ajoutez ou verifiez votre cle d'acces",
          footer: "Ceci est une notification de securite automatique.",
        },
        es: {
          subject: "Codigos de recuperacion regenerados - PrivateNote",
          title: "Codigos de recuperacion regenerados",
          body1: "Tus codigos de recuperacion de PrivateNote se regeneraron. Tus codigos anteriores no usados ya no funcionan.",
          body2: "Si no fuiste tu, protege tu cuenta:",
          li1: "Revoca otras sesiones desde Configuracion de seguridad",
          li2: "Agrega o verifica tu passkey",
          footer: "Esta es una notificacion de seguridad automatica.",
        },
        nl: {
          subject: "Herstelcodes opnieuw gegenereerd - PrivateNote",
          title: "Herstelcodes opnieuw gegenereerd",
          body1: "Je PrivateNote-herstelcodes zijn opnieuw gegenereerd. Je vorige ongebruikte codes werken niet meer.",
          body2: "Als jij dit niet was, beveilig je account:",
          li1: "Herroep andere sessies in Beveiligingsinstellingen",
          li2: "Voeg een passkey toe of controleer je passkey",
          footer: "Dit is een automatische beveiligingsmelding.",
        },
      }, locale);
      const emailResult = await sendEmail(env, {
        to: userEmail,
        subject: recoveryCodesCopy.subject,
        text:
          `${recoveryCodesCopy.body1}\n\n` +
          `${recoveryCodesCopy.body2}\n` +
          `- ${recoveryCodesCopy.li1}\n` +
          `- ${recoveryCodesCopy.li2}\n\n` +
          `${recoveryCodesCopy.footer}`,
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
            <h2>${recoveryCodesCopy.title}</h2>
            <p>${recoveryCodesCopy.body1}</p>
            <p>${recoveryCodesCopy.body2}</p>
            <ul>
              <li>${recoveryCodesCopy.li1}</li>
              <li>${recoveryCodesCopy.li2}</li>
            </ul>
            <p style="color: #666; font-size: 14px;">${recoveryCodesCopy.footer}</p>
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

    // Enhanced rate limiting with progressive delays and account lockout
    const rateLimitKey = `${RECOVERY_CODE_RATE_LIMIT.KEY_PREFIX}${email}`;
    const lockoutKey = `${RECOVERY_CODE_RATE_LIMIT.LOCKOUT_KEY_PREFIX}${email}`;
    const kv = env.RATE_LIMIT_KV || env.NOTES_KV;
    let currentAttempts = 0;

    if (kv) {
      const now = Math.floor(Date.now() / 1000);
      const windowStart = now - (now % RECOVERY_CODE_RATE_LIMIT.WINDOW_SECONDS);

      try {
        // Check for account lockout first
        const lockoutData = await kv.get(lockoutKey, { type: 'json' }) as {
          totalFailures: number;
          lockedUntil?: number;
          notifiedAt?: number;
        } | null;

        if (lockoutData?.lockedUntil && lockoutData.lockedUntil > now) {
          const remainingMinutes = Math.ceil((lockoutData.lockedUntil - now) / 60);
          // Audit log: account locked
          await logAuditEvent(env, {
            userId: null,
            eventType: "rate_limit_exceeded",
            status: "warning",
            details: {
              endpoint: "recovery_code",
              reason: "account_locked",
              emailMasked: email.replace(/(.{2})(.*)(@.*)/, "$1***$3"),
              remainingMinutes,
            },
            ip: getRequestIp(request),
            userAgent: request.headers.get("User-Agent"),
          });
          await jitterDelay();
          return jsonResponse(
            { message: `Account temporarily locked. Please try again in ${remainingMinutes} minutes.` },
            429,
            request
          );
        }

        // Check window rate limit
        const stored = await kv.get(rateLimitKey, { type: 'json' }) as { count?: number; windowStart?: number } | null;

        if (stored && stored.windowStart === windowStart) {
          currentAttempts = stored.count || 0;
          if (currentAttempts >= RECOVERY_CODE_RATE_LIMIT.MAX_ATTEMPTS) {
            // Audit log: rate limit exceeded
            await logAuditEvent(env, {
              userId: null,
              eventType: "rate_limit_exceeded",
              status: "warning",
              details: { endpoint: "recovery_code", emailMasked: email.replace(/(.{2})(.*)(@.*)/, "$1***$3") },
              ip: getRequestIp(request),
              userAgent: request.headers.get("User-Agent"),
            });
            await jitterDelay();
            return jsonResponse(
              { message: "Too many recovery attempts. Please try again later." },
              429,
              request
            );
          }
          await kv.put(rateLimitKey, JSON.stringify({
            count: currentAttempts + 1,
            windowStart,
          }), {
            expirationTtl: RECOVERY_CODE_RATE_LIMIT.WINDOW_SECONDS + 10,
          });
          currentAttempts += 1;
        } else {
          await kv.put(rateLimitKey, JSON.stringify({
            count: 1,
            windowStart,
          }), {
            expirationTtl: RECOVERY_CODE_RATE_LIMIT.WINDOW_SECONDS + 10,
          });
          currentAttempts = 1;
        }

        // Apply progressive delay based on attempt count
        if (currentAttempts > 1) {
          const progressiveDelay = Math.min(
            RECOVERY_CODE_RATE_LIMIT.PROGRESSIVE_BASE_DELAY_MS * Math.pow(2, currentAttempts - 1),
            RECOVERY_CODE_RATE_LIMIT.PROGRESSIVE_MAX_DELAY_MS
          );
          await new Promise(resolve => setTimeout(resolve, progressiveDelay));
        }
      } catch (error) {
        console.error('[RECOVERY_RATE_LIMIT] Error checking rate limit:', error);
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
      // Track total failures for account lockout
      if (kv) {
        try {
          const now = Math.floor(Date.now() / 1000);
          const lockoutData = await kv.get(lockoutKey, { type: 'json' }) as {
            totalFailures: number;
            lockedUntil?: number;
            notifiedAt?: number;
          } | null;

          const totalFailures = (lockoutData?.totalFailures || 0) + 1;

          // Check if we should lock the account
          if (totalFailures >= RECOVERY_CODE_RATE_LIMIT.LOCKOUT_THRESHOLD) {
            const lockedUntil = now + RECOVERY_CODE_RATE_LIMIT.LOCKOUT_DURATION_SECONDS;
            await kv.put(lockoutKey, JSON.stringify({
              totalFailures,
              lockedUntil,
              notifiedAt: now,
            }), {
              expirationTtl: RECOVERY_CODE_RATE_LIMIT.LOCKOUT_DURATION_SECONDS + 60,
            });

            // Audit log: account locked due to too many failures
            await logAuditEvent(env, {
              userId: user.id,
              eventType: "recovery_code_failed",
              status: "failure",
              details: {
                reason: "account_locked_excessive_failures",
                totalFailures,
                lockoutDurationMinutes: Math.ceil(RECOVERY_CODE_RATE_LIMIT.LOCKOUT_DURATION_SECONDS / 60),
              },
              ip: getRequestIp(request),
              userAgent: request.headers.get("User-Agent"),
            });
          } else {
            await kv.put(lockoutKey, JSON.stringify({
              totalFailures,
              lockedUntil: lockoutData?.lockedUntil,
            }), {
              expirationTtl: RECOVERY_CODE_RATE_LIMIT.LOCKOUT_DURATION_SECONDS + 60,
            });
          }
        } catch (error) {
          console.error('[RECOVERY_LOCKOUT] Error updating lockout state:', error);
        }
      }

      // Audit log: recovery code failed
      await logAuditEvent(env, {
        userId: user.id,
        eventType: "recovery_code_failed",
        status: "failure",
        details: { reason: "invalid_code", attemptNumber: currentAttempts },
        ip: getRequestIp(request),
        userAgent: request.headers.get("User-Agent"),
      });
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
      await jitterDelay();
      return jsonResponse({ message: "Invalid recovery attempt" }, 400, request);
    }

    // Clear lockout state on successful recovery
    if (kv) {
      try {
        await kv.delete(lockoutKey);
        await kv.delete(rateLimitKey);
      } catch (error) {
        console.error('[RECOVERY_LOCKOUT] Error clearing lockout state:', error);
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
    const locale = normalizeAuthEmailLocale(body?.locale);
    const isLocal = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    const responsePayload: Record<string, unknown> = {
      ok: true,
      message: "Check your email for a sign-in link.",
    };

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
      const magicCtx = await magicLinkSoftContext(request);
      const storeResult = await storeMagicLink(env, token, {
        userId,
        email,
        intent,
        locale,
        createdAt: Date.now(),
        magicIpPrefix: magicCtx.ipPrefix,
        magicUaHash: magicCtx.uaHash,
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
        // Query param is non-authenticating: session is only created on explicit POST after the user clicks Continue.
        const magicUrl = `${magicOrigin}/magic?t=${encodeURIComponent(token)}`;
        console.log(`[MAGIC_LINK] Prepared link for ${intent}, origin=${magicOrigin}, isLocal=${isLocal}`);

        if (isLocal) {
          responsePayload.debugMagicLink = magicUrl;
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
          const sendResult = await sendMagicLinkEmail(env, email, magicUrl, locale);
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
    return jsonResponse(responsePayload, 200, request);
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
    const locale = detectAuthEmailLocale(request);
    const verifyEmailCopy = pickAuthEmailCopy({
      en: {
        subject: "Verify your new email address - PrivateNote",
        title: "Verify your new email address",
        body1: "You requested to change your email address for your PrivateNote account.",
        body2:
          "Open the link below, then press Confirm new email on the page to apply the change (this prevents automated link scanning from completing the update).",
        cta: "Continue to verification",
        expiry: "This link expires in 1 hour.",
        ignore: "If you didn't request this change, please ignore this email and your account will remain unchanged.",
      },
      de: {
        subject: "Neue E-Mail-Adresse bestaetigen - PrivateNote",
        title: "Neue E-Mail-Adresse bestaetigen",
        body1: "Sie haben angefordert, die E-Mail-Adresse Ihres PrivateNote-Kontos zu aendern.",
        body2:
          "Oeffnen Sie den folgenden Link und klicken Sie dann auf der Seite auf Neue E-Mail bestaetigen, um die Aenderung zu uebernehmen (dadurch wird verhindert, dass automatisches Link-Scanning die Aenderung abschliesst).",
        cta: "Zur Verifizierung",
        expiry: "Dieser Link laeuft in 1 Stunde ab.",
        ignore: "Wenn Sie diese Aenderung nicht angefordert haben, ignorieren Sie diese E-Mail. Ihr Konto bleibt unveraendert.",
      },
      fr: {
        subject: "Verifiez votre nouvelle adresse e-mail - PrivateNote",
        title: "Verifiez votre nouvelle adresse e-mail",
        body1: "Vous avez demande la modification de l'adresse e-mail de votre compte PrivateNote.",
        body2:
          "Ouvrez le lien ci-dessous, puis appuyez sur Confirmer le nouvel e-mail sur la page pour appliquer la modification (cela evite qu'un scan automatique de lien finalise la mise a jour).",
        cta: "Continuer la verification",
        expiry: "Ce lien expire dans 1 heure.",
        ignore: "Si vous n'avez pas demande ce changement, ignorez cet e-mail et votre compte restera inchange.",
      },
      es: {
        subject: "Verifica tu nuevo correo electronico - PrivateNote",
        title: "Verifica tu nuevo correo electronico",
        body1: "Solicitaste cambiar el correo electronico de tu cuenta de PrivateNote.",
        body2:
          "Abre el enlace de abajo y luego pulsa Confirmar nuevo correo en la pagina para aplicar el cambio (esto evita que el escaneo automatico de enlaces complete la actualizacion).",
        cta: "Continuar con la verificacion",
        expiry: "Este enlace vence en 1 hora.",
        ignore: "Si no solicitaste este cambio, ignora este correo y tu cuenta seguira sin cambios.",
      },
      nl: {
        subject: "Bevestig je nieuwe e-mailadres - PrivateNote",
        title: "Bevestig je nieuwe e-mailadres",
        body1: "Je hebt gevraagd het e-mailadres van je PrivateNote-account te wijzigen.",
        body2:
          "Open de link hieronder en druk daarna op Bevestig nieuw e-mailadres om de wijziging door te voeren (zo voorkom je dat geautomatiseerd linkscannen de update voltooit).",
        cta: "Doorgaan naar verificatie",
        expiry: "Deze link verloopt over 1 uur.",
        ignore: "Als je deze wijziging niet hebt aangevraagd, negeer deze e-mail. Je account blijft ongewijzigd.",
      },
    }, locale);

    console.log(
      `[AUTH] Email change request: userId=${session.id}, currentEmail=${maskEmailForLog(normalizedCurrentEmail)}, newEmail=${maskEmailForLog(normalizedNewEmail)}`,
    );

    const emailResult = await sendEmail(env, {
      to: normalizedNewEmail,
      subject: verifyEmailCopy.subject,
      text:
        `${verifyEmailCopy.body1}\n\n` +
        `${verifyEmailCopy.body2}\n${verifyUrl}\n\n` +
        `${verifyEmailCopy.expiry}\n\n` +
        `${verifyEmailCopy.ignore}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>${verifyEmailCopy.title}</h2>
          <p>${verifyEmailCopy.body1}</p>
          <p>${verifyEmailCopy.body2}</p>
          <p style="margin: 24px 0;">
            <a href="${verifyUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">
              ${verifyEmailCopy.cta}
            </a>
          </p>
          <p style="color: #666; font-size: 14px;">${verifyEmailCopy.expiry}</p>
          <p style="color: #666; font-size: 14px;">${verifyEmailCopy.ignore}</p>
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

    console.log(
      `[AUTH] Email change verification email sent successfully to ${maskEmailForLog(normalizedNewEmail)}`,
    );

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

    const locale = detectAuthEmailLocale(request);
    const deleteCodeCopy = pickAuthEmailCopy({
      en: {
        subject: "Your account deletion confirmation code - PrivateNote",
        title: "Account deletion confirmation",
        body1: "You requested to delete your PrivateNote account. Verify it's you by entering this code where you started deletion:",
        codeLabel: "Confirmation code",
        expiry: "This code expires in 15 minutes and can be used only once.",
        ignore: "If you did not request this, secure your account and ignore this email.",
      },
      de: {
        subject: "Ihr Bestaetigungscode zur Kontoloeschung - PrivateNote",
        title: "Kontoloeschung bestaetigen",
        body1: "Sie haben die Loeschung Ihres PrivateNote-Kontos angefordert. Bestaetigen Sie Ihre Identitaet mit diesem Code an der Stelle, an der Sie die Loeschung gestartet haben:",
        codeLabel: "Bestaetigungscode",
        expiry: "Dieser Code laeuft in 15 Minuten ab und kann nur einmal verwendet werden.",
        ignore: "Wenn Sie das nicht angefordert haben, sichern Sie Ihr Konto und ignorieren Sie diese E-Mail.",
      },
      fr: {
        subject: "Votre code de confirmation de suppression de compte - PrivateNote",
        title: "Confirmation de suppression de compte",
        body1: "Vous avez demande la suppression de votre compte PrivateNote. Verifiez qu'il s'agit bien de vous en saisissant ce code la ou vous avez lance la suppression :",
        codeLabel: "Code de confirmation",
        expiry: "Ce code expire dans 15 minutes et ne peut etre utilise qu'une seule fois.",
        ignore: "Si vous n'etes pas a l'origine de cette demande, securisez votre compte et ignorez cet e-mail.",
      },
      es: {
        subject: "Tu codigo de confirmacion para eliminar la cuenta - PrivateNote",
        title: "Confirmacion de eliminacion de cuenta",
        body1: "Solicitaste eliminar tu cuenta de PrivateNote. Verifica que eres tu introduciendo este codigo donde iniciaste la eliminacion:",
        codeLabel: "Codigo de confirmacion",
        expiry: "Este codigo vence en 15 minutos y solo puede usarse una vez.",
        ignore: "Si no solicitaste esto, protege tu cuenta e ignora este correo.",
      },
      nl: {
        subject: "Je bevestigingscode voor accountverwijdering - PrivateNote",
        title: "Accountverwijdering bevestigen",
        body1: "Je hebt gevraagd je PrivateNote-account te verwijderen. Bevestig dat jij het bent door deze code in te voeren waar je de verwijdering bent gestart:",
        codeLabel: "Bevestigingscode",
        expiry: "Deze code verloopt over 15 minuten en kan maar een keer worden gebruikt.",
        ignore: "Als je dit niet hebt aangevraagd, beveilig je account en negeer deze e-mail.",
      },
    }, locale);

    const emailResult = await sendEmail(env, {
      to: toEmail,
      subject: deleteCodeCopy.subject,
      text:
        `${deleteCodeCopy.body1}\n\n` +
        `${deleteCodeCopy.codeLabel}: ${otp}\n\n` +
        `${deleteCodeCopy.expiry}\n\n` +
        `${deleteCodeCopy.ignore}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>${deleteCodeCopy.title}</h2>
          <p>${deleteCodeCopy.body1}</p>
          <p style="font-size: 28px; letter-spacing: 4px; font-weight: bold; margin: 24px 0;">${otp}</p>
          <p style="color: #666; font-size: 14px;">${deleteCodeCopy.expiry}</p>
          <p style="color: #666; font-size: 14px;">${deleteCodeCopy.ignore}</p>
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

    // Upgrade session to fully authenticated
    await env.AUTH_DB.prepare(
      "UPDATE sessions SET auth_complete = 1 WHERE session_id_hash = ?"
    )
      .bind(session.sessionIdHash)
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

async function setAiVerificationRemaining(
  kv: KVNamespace,
  clientId: string,
  remaining: number,
): Promise<void> {
  const key = `${AI_VERIFICATION.KEY_PREFIX}${clientId}`;
  try {
    await kv.put(key, JSON.stringify({ remaining }), {
      expirationTtl: AI_VERIFICATION.TTL_SECONDS,
    });
  } catch (error) {
    console.warn("[AI] Failed to write verification cache:", error);
  }
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

function applyCorsHeaders(response: Response, request: Request): Response {
  const headers = new Headers(response.headers);
  const corsHeaders = getCorsHeaders(request);
  for (const [key, value] of Object.entries(corsHeaders)) {
    headers.set(key, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
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

async function recipientVerificationFailureDelay(usedAttempts: number): Promise<void> {
  const boundedAttempts = Math.max(1, Math.min(usedAttempts, RATE_LIMIT_RECIPIENT_VERIFY.MAX_REQUESTS));
  const delayMs = Math.min(4000, 500 * 2 ** (boundedAttempts - 1));
  await new Promise((resolve) => setTimeout(resolve, delayMs));
}

function hostedAiLanguageLabel(raw: unknown): string {
  const language = typeof raw === "string" ? raw.toLowerCase() : "en";
  if (language.startsWith("de")) return "German";
  if (language.startsWith("fr")) return "French";
  if (language.startsWith("es")) return "Spanish";
  return "English";
}

function hostedAiTaskInstruction(raw: unknown): string {
  if (raw === "summarize") {
    return "Summarize the user's text into a concise message that is ready to send.";
  }
  if (raw === "secure") {
    return "Rewrite the user's text as a ready-to-send private note and remove unnecessary sensitive details.";
  }
  if (raw === "improve") {
    return "Improve the user's draft into a natural, clear message that is ready to send.";
  }
  if (raw === "simplify") {
    return "Simplify the user's text into plain, easy-to-read language that is ready to send.";
  }
  return "Write a natural message from the user's request that is ready to send.";
}

function hostedAiLengthInstruction(raw: unknown): string {
  if (raw === "1-2") return "Keep it to 1 or 2 sentences.";
  if (raw === "2-3") return "Keep it to 2 or 3 sentences.";
  if (raw === "4-6") return "Keep it to 4 to 6 sentences.";
  if (raw === "7-10") return "Keep it to 7 to 10 sentences.";
  return "Use the natural length needed for the message.";
}

function extractHostedAiText(result: unknown): string {
  const candidates: unknown[] = [result];
  if (result && typeof result === "object") {
    const record = result as Record<string, unknown>;
    candidates.push(record.response, record.result, record.text, record.output_text);
      if (Array.isArray(record.choices)) {
      for (const choice of record.choices) {
        if (choice && typeof choice === "object") {
          const c = choice as Record<string, unknown>;
          candidates.push(c.text);
          if (c.message && typeof c.message === "object") {
            const msg = c.message as Record<string, unknown>;
            candidates.push(msg.content);
            // Gemma 4 and other thinking models surface chain-of-thought in `reasoning`
            // when content is null (e.g. token budget exhausted before output phase)
            candidates.push(msg.reasoning);
          }
        }
      }
    }
  }
  const text = candidates.find((candidate) => typeof candidate === "string" && candidate.trim().length > 0);
  return typeof text === "string"
    ? text.trim().replace(/^(final message|message|note):\s*/i, "").trim()
    : "";
}

type HostedAiTokenUsage = {
  promptTokens: number;
  completionTokens: number;
};

function getHostedAiBillingMonth(date = new Date()): string {
  return date.toISOString().slice(0, 7);
}

function getNumericRecordValue(record: Record<string, unknown>, keys: string[]): number {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
      return Math.floor(value);
    }
  }
  return 0;
}

function extractHostedAiUsage(result: unknown): HostedAiTokenUsage {
  const candidates: unknown[] = [];
  if (result && typeof result === "object") {
    const record = result as Record<string, unknown>;
    candidates.push(record.usage, record.result);
    if (record.result && typeof record.result === "object") {
      candidates.push((record.result as Record<string, unknown>).usage);
    }
  }

  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== "object") continue;
    const record = candidate as Record<string, unknown>;
    const promptTokens = getNumericRecordValue(record, ["prompt_tokens", "input_tokens"]);
    const completionTokens = getNumericRecordValue(record, [
      "completion_tokens",
      "output_tokens",
      "response_tokens",
    ]);
    if (promptTokens > 0 || completionTokens > 0) {
      return { promptTokens, completionTokens };
    }
  }

  return { promptTokens: 0, completionTokens: 0 };
}

function calculateHostedAiCostUsd(usage: HostedAiTokenUsage): number {
  const inputCost =
    (usage.promptTokens / 1_000_000) * HOSTED_AI_COST_GUARD.INPUT_USD_PER_MILLION_TOKENS;
  const outputCost =
    (usage.completionTokens / 1_000_000) * HOSTED_AI_COST_GUARD.OUTPUT_USD_PER_MILLION_TOKENS;
  return Number((inputCost + outputCost).toFixed(8));
}

function estimateTokenCountFromText(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return Math.max(1, Math.ceil(trimmed.length / 4));
}

function withHostedAiUsageFallback(
  usage: HostedAiTokenUsage,
  prompt: string,
  completion: string,
): HostedAiTokenUsage {
  return {
    promptTokens: usage.promptTokens || estimateTokenCountFromText(prompt),
    completionTokens: usage.completionTokens || estimateTokenCountFromText(completion),
  };
}

async function getHostedAiMonthlyCostUsd(
  env: Env,
  userId: string,
  billingMonth = getHostedAiBillingMonth(),
): Promise<number> {
  if (!env.AUTH_DB) {
    throw new Error("Auth database is not configured");
  }

  try {
    const row = await env.AUTH_DB.prepare(
      "SELECT COALESCE(SUM(cost_usd), 0) AS total_cost_usd FROM token_usage_logs WHERE user_id = ? AND billing_month = ?",
    )
      .bind(userId, billingMonth)
      .first<{ total_cost_usd: number | null }>();
    return Number(row?.total_cost_usd ?? 0);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (/no such table: token_usage_logs/i.test(message)) {
      console.warn("[HOSTED_AI] token_usage_logs missing; skipping fair-use cost guard");
      return 0;
    }
    throw error;
  }
}

async function assertHostedAiFairUseBudget(
  env: Env,
  request: Request,
  userId: string,
): Promise<Response | null> {
  try {
    const monthlyCostUsd = await getHostedAiMonthlyCostUsd(env, userId);
    if (monthlyCostUsd >= HOSTED_AI_COST_GUARD.FAIR_USE_LIMIT_USD) {
      return jsonResponse(
        {
          error: "hosted_ai_fair_use_limit_reached",
          message: "Monthly fair-use text processing limit reached.",
          limitUsd: HOSTED_AI_COST_GUARD.FAIR_USE_LIMIT_USD,
        },
        429,
        request,
      );
    }
  } catch (error) {
    console.error("[HOSTED_AI] Cost guard failed:", error);
    return jsonResponse(
      {
        error: "hosted_ai_cost_guard_unavailable",
        message: "Hosted AI cost guard is unavailable.",
      },
      503,
      request,
    );
  }
  return null;
}

async function logHostedAiTokenUsage(
  env: Env,
  args: {
    userId: string;
    model: string;
    promptTokens: number;
    completionTokens: number;
    costUsd: number;
  },
): Promise<void> {
  if (!env.AUTH_DB) return;
  try {
    await env.AUTH_DB.prepare(
      `INSERT INTO token_usage_logs (
        id,
        user_id,
        model,
        prompt_tokens,
        completion_tokens,
        cost_usd,
        billing_month,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        crypto.randomUUID(),
        args.userId,
        args.model,
        args.promptTokens,
        args.completionTokens,
        args.costUsd,
        getHostedAiBillingMonth(),
        new Date().toISOString(),
      )
      .run();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (/no such table: token_usage_logs/i.test(message)) {
      console.warn("[HOSTED_AI] token_usage_logs missing; skipping usage log");
      return;
    }
    throw error;
  }
}

async function handleHostedAiDraft(request: Request, env: Env): Promise<Response> {
  if (!env.AI) {
    return jsonResponse(
      {
        error: "hosted_ai_unavailable",
        message: "Hosted AI is not configured for this deployment.",
      },
      503,
      request,
    );
  }

  let body: any;
  try {
    body = await readJsonBody(request);
  } catch {
    return jsonResponse({ error: "invalid_json", message: "Invalid JSON" }, 400, request);
  }

  if (body?.consentToHostedAi !== true || body?.acknowledgeNonPrivateAi !== true) {
    return jsonResponse(
      {
        error: "hosted_ai_consent_required",
        message:
          "Non-private hosted AI requires explicit acknowledgment that your prompt is sent to Cloudflare Workers AI.",
      },
      400,
      request,
    );
  }

  if (!env.AUTH_DB) {
    return jsonResponse(
      {
        error: "hosted_ai_auth_unavailable",
        message: "Hosted AI account checks are unavailable.",
      },
      503,
      request,
    );
  }

  const session = await getSessionFromRequest(env, request, { rotate: false });
  if (!session?.id) {
    return jsonResponse(
      {
        error: "hosted_ai_auth_required",
        message: "Sign in to use hosted AI.",
      },
      401,
      request,
    );
  }

  try {
    const info = await env.AUTH_DB.prepare("PRAGMA table_info(users)").all<{ name: string }>();
    const hasAllowColumn = (info.results ?? []).some((row) => row.name === "allow_hosted_ai");
    if (hasAllowColumn) {
      const userRow = await env.AUTH_DB.prepare(
        "SELECT allow_hosted_ai FROM users WHERE id = ? LIMIT 1",
      )
        .bind(session.id)
        .first<{ allow_hosted_ai?: number | null }>();
      if ((userRow?.allow_hosted_ai ?? 0) !== 1) {
        return jsonResponse(
          {
            error: "hosted_ai_not_enabled",
            message:
              "Non-private hosted AI is disabled for your account. Enable it in Account → Preferences.",
          },
          403,
          request,
        );
      }
    }
  } catch (e) {
    console.warn("[HOSTED_AI] allow_hosted_ai check failed:", e);
  }

  const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";
  if (!prompt) {
    return jsonResponse({ error: "prompt_required", message: "Prompt is required" }, 400, request);
  }
  if (prompt.length > HOSTED_AI_DRAFT.MAX_PROMPT_CHARS) {
    return jsonResponse(
      {
        error: "prompt_too_long",
        message: `Prompt must be ${HOSTED_AI_DRAFT.MAX_PROMPT_CHARS} characters or fewer.`,
      },
      400,
      request,
    );
  }

  const accountType = await getUserAccountType(env, session.id);
  const quota = await readHostedAiQuota(env, session.id, accountType);
  const hostedAiLimit = quota.limit;
  if (!quota.allowed) {
    return jsonResponse(
      {
        error: "hosted_ai_quota_exhausted",
        message: "Your hosted AI drafts for this billing month are used up.",
        limit: hostedAiLimit,
        remaining: 0,
        resetAt: quota.resetAt,
      },
      429,
      request,
    );
  }

  const language = hostedAiLanguageLabel(body?.language);
  const messages = [
    {
      role: "system",
      content: [
        "You are a hosted (non-private) writing assistant for PrivateNote.",
        "Output only the final note/message the user can send.",
        "Do not explain your choices, do not add placeholders, and do not mention AI, Cloudflare, or PrivateNote.",
        `Write in ${language}.`,
        hostedAiTaskInstruction(body?.enhancementType),
        hostedAiLengthInstruction(body?.sentenceLength),
      ].join(" "),
    },
    { role: "user", content: prompt },
  ];

  const fairUseResponse = await assertHostedAiFairUseBudget(env, request, session.id);
  if (fairUseResponse) {
    return fairUseResponse;
  }

  try {
    const result = await env.AI.run(HOSTED_AI_DRAFT.MODEL, {
      messages,
      max_tokens: HOSTED_AI_DRAFT.MAX_OUTPUT_TOKENS,
      temperature: 0.45,
    });
    const text = extractHostedAiText(result);
    if (!text) {
      throw new Error("Workers AI returned an empty draft");
    }
    const usage = withHostedAiUsageFallback(extractHostedAiUsage(result), prompt, text);
    const costUsd = calculateHostedAiCostUsd(usage);
    await logHostedAiTokenUsage(env, {
      userId: session.id,
      model: HOSTED_AI_DRAFT.MODEL,
      promptTokens: usage.promptTokens,
      completionTokens: usage.completionTokens,
      costUsd,
    });
    await commitHostedAiQuota(env, session.id, accountType, quota.nextCount, quota.resetAt);
    return jsonResponse(
      {
        ok: true,
        text,
        model: HOSTED_AI_DRAFT.MODEL_LABEL,
        limit: hostedAiLimit,
        remaining: Math.max(0, hostedAiLimit - quota.nextCount),
        resetAt: quota.resetAt,
      },
      200,
      request,
    );
  } catch (error) {
    console.error("[HOSTED_AI] Draft generation failed:", error);
    return jsonResponse(
      {
        error: "hosted_ai_generation_failed",
        message: "Hosted AI could not create a draft right now.",
      },
      502,
      request,
    );
  }
}

function getReservationKey(id: string): string {
  return `${NOTE_RESERVATION.KEY_PREFIX}${id}`;
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function sha256HexBytes(bytes: Uint8Array): string {
  return [...sha256(bytes)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function bytesToHex(bytes: Uint8Array): string {
  return [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

/** Best-effort discard so Safari does not mask early 4xx as status 0 while still uploading. */
async function discardRequestBody(request: Request): Promise<void> {
  try {
    if (request.body) {
      await request.body.cancel();
    }
  } catch {
    try {
      await request.arrayBuffer();
    } catch {
      /* ignore */
    }
  }
}

async function sha256HexOfStream(
  stream: ReadableStream<Uint8Array>,
): Promise<{ hex: string; byteLength: number }> {
  const hasher = sha256.create();
  let byteLength = 0;
  const reader = stream.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    hasher.update(value);
    byteLength += value.byteLength;
  }
  return { hex: bytesToHex(hasher.digest()), byteLength };
}

async function persistNoteReservation(env: Env, noteId: string, record: NoteReservationRecord): Promise<void> {
  const expiresIn = record.fileStorageUserId
    ? NOTE_RESERVATION.ATTACHMENT_TTL_SECONDS
    : NOTE_RESERVATION.TTL_SECONDS;
  await env.NOTES_KV.put(getReservationKey(noteId), JSON.stringify(record), {
    expirationTtl: expiresIn,
  });
}

async function computeUploadedAttachmentContentHash(
  env: Env,
  noteId: string,
  totalChunks: number,
  attachmentIndex = 0,
): Promise<string | null> {
  if (!env.NOTE_FILES_R2) return null;
  const hasher = sha256.create();
  for (let index = 0; index < totalChunks; index += 1) {
    const object = await env.NOTE_FILES_R2.get(noteFileChunkObjectKey(noteId, index, attachmentIndex));
    if (!object?.body) return null;
    // Stream — never arrayBuffer() full objects (premium up to 1 GB).
    const reader = object.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      hasher.update(value);
    }
  }
  return bytesToHex(hasher.digest());
}

async function authorizeNoteFileChunkUpload(
  env: Env,
  request: Request,
  noteId: string,
): Promise<
  | { ok: true; premiumUserId: string | null; record: NoteReservationRecord }
  | { ok: false; response: Response }
> {
  const raw = await env.NOTES_KV.get(getReservationKey(noteId));
  if (!raw) {
    return {
      ok: false,
      response: jsonResponse({ error: "Note ID reservation expired or missing" }, 403, request),
    };
  }

  let record: NoteReservationRecord;
  try {
    record = JSON.parse(raw) as NoteReservationRecord;
  } catch {
    return { ok: false, response: jsonResponse({ error: "Invalid note reservation" }, 403, request) };
  }

  const bearer = parseNoteUploadBearerToken(request.headers.get("Authorization"));
  const queryToken = new URL(request.url).searchParams.get(NOTE_UPLOAD_QUERY_PARAM)?.trim() || null;
  const uploadToken = bearer || queryToken;
  if (!uploadToken) {
    return { ok: false, response: jsonResponse({ error: "Upload token required" }, 403, request) };
  }
  if (!record.uploadTokenHash) {
    return {
      ok: false,
      response: jsonResponse({ error: "Reservation invalid or expired" }, 403, request),
    };
  }

  const tokenHash = await sha256Hex(uploadToken);
  if (tokenHash !== record.uploadTokenHash) {
    return { ok: false, response: jsonResponse({ error: "Invalid upload token" }, 403, request) };
  }

  // Capability = uploadToken only. Do not also bind reserve client IP/cookie:
  // reserve hits Pages /api (one CF edge) while the Blob PUT hits
  // upload[.privatenote.ai]|upload-staging (another). IPv4/IPv6 disagreement
  // returned 403 while Safari was still streaming — WebKit surfaces that as
  // status 0 / "network connection was lost". Token hash is the capability.

  return { ok: true, premiumUserId: record.premiumUserId ?? null, record };
}

let accountFileStorageSchemaReady = false;

async function ensureAccountFileStorageSchema(env: Env): Promise<boolean> {
  if (!env.AUTH_DB) return false;
  if (accountFileStorageSchemaReady) return true;
  await env.AUTH_DB.prepare(
    `CREATE TABLE IF NOT EXISTS account_file_storage_usage (
      user_id TEXT PRIMARY KEY,
      used_bytes INTEGER NOT NULL DEFAULT 0 CHECK (used_bytes >= 0),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
  ).run();
  await env.AUTH_DB.prepare(
    `CREATE TABLE IF NOT EXISTS account_file_storage_reservations (
      note_id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      encrypted_size INTEGER NOT NULL CHECK (encrypted_size >= 0),
      total_chunks INTEGER,
      max_reads INTEGER,
      file_access_window_seconds INTEGER NOT NULL DEFAULT ${NOTE_FILE_ACCESS_DEFAULT_SECONDS},
      expires_at TEXT,
      last_checked_at TEXT,
      status TEXT NOT NULL DEFAULT 'reserved'
        CHECK (status IN ('reserved', 'active', 'released')),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      activated_at TEXT,
      released_at TEXT,
      release_reason TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
  ).run();
  await env.AUTH_DB.prepare(
    "CREATE INDEX IF NOT EXISTS idx_account_file_storage_reservations_user_status ON account_file_storage_reservations(user_id, status)",
  ).run();
  const columns = await env.AUTH_DB.prepare("PRAGMA table_info(account_file_storage_reservations)").all<{
    name: string;
  }>();
  const hasFileAccessWindowColumn = (columns.results ?? []).some(
    (column) => column.name === "file_access_window_seconds",
  );
  const hasExpiresAtColumn = (columns.results ?? []).some((column) => column.name === "expires_at");
  const hasLastCheckedAtColumn = (columns.results ?? []).some((column) => column.name === "last_checked_at");
  if (!hasFileAccessWindowColumn) {
    await env.AUTH_DB.prepare(
      `ALTER TABLE account_file_storage_reservations
         ADD COLUMN file_access_window_seconds INTEGER NOT NULL DEFAULT ${NOTE_FILE_ACCESS_DEFAULT_SECONDS}`,
    ).run();
  }
  if (!hasExpiresAtColumn) {
    await env.AUTH_DB.prepare("ALTER TABLE account_file_storage_reservations ADD COLUMN expires_at TEXT").run();
  }
  if (!hasLastCheckedAtColumn) {
    await env.AUTH_DB.prepare("ALTER TABLE account_file_storage_reservations ADD COLUMN last_checked_at TEXT").run();
  }
  accountFileStorageSchemaReady = true;
  return true;
}

async function getAuthenticatedAccountForNoteFiles(
  env: Env,
  request: Request,
): Promise<{ userId: string; accountType: AccountType; isPremium: boolean } | null> {
  if (!env.AUTH_DB) return null;
  const session = await getSessionFromRequest(env, request, { rotate: false });
  if (!session?.id) return null;
  const entitlements = await getAccountEntitlements(env, session.id);
  return {
    userId: session.id,
    accountType: entitlements.accountType,
    isPremium: entitlements.accountType !== "free",
  };
}

async function resolveUploadFileAccountType(
  env: Env,
  reservation: NoteReservationRecord,
  fileStorageUserId: string,
): Promise<AccountType> {
  if (reservation.fileAccountType) {
    return normalizeAccountType(reservation.fileAccountType);
  }
  if (env.AUTH_DB) {
    try {
      return (await getAccountEntitlements(env, fileStorageUserId)).accountType;
    } catch {
      /* fall through */
    }
  }
  // Legacy reservations: premiumUserId meant paid, but not which tier — prefer Starter caps.
  return reservation.premiumUserId ? "personal_premium" : "free";
}

export async function reserveAccountFileStorageBytes(
  env: Env,
  userId: string,
  noteId: string,
  encryptedSize: number,
  storageLimitBytes: number,
  options?: { maxTransfersPerMonth?: number | null },
): Promise<{ ok: true } | { ok: false; status: number; body: Record<string, unknown> }> {
  if (!(await ensureAccountFileStorageSchema(env)) || !env.AUTH_DB) {
    return {
      ok: false,
      status: 503,
      body: {
        error: "file_storage_quota_unavailable",
        message: "File storage quota is not configured.",
      },
    };
  }

  const abandoned = await env.AUTH_DB.prepare(
    `SELECT note_id
       FROM account_file_storage_reservations
      WHERE user_id = ?
        AND status = 'reserved'
        AND created_at < datetime('now', '-2 hours')
      LIMIT 20`,
  )
    .bind(userId)
    .all<{ note_id: string }>();
  for (const row of abandoned.results ?? []) {
    await cleanupNoteFileChunks(env, row.note_id, "abandoned attachment reservation");
  }

  const existing = await env.AUTH_DB.prepare(
    "SELECT user_id, encrypted_size, status FROM account_file_storage_reservations WHERE note_id = ? LIMIT 1",
  )
    .bind(noteId)
    .first<{ user_id: string; encrypted_size: number; status: string }>();
  if (existing) {
    if (existing.user_id !== userId || existing.status === "released" || existing.encrypted_size !== encryptedSize) {
      return {
        ok: false,
        status: 409,
        body: { error: "Attachment storage reservation conflict" },
      };
    }
    return { ok: true };
  }

  const maxTransfersPerMonth = options?.maxTransfersPerMonth;
  if (
    typeof maxTransfersPerMonth === "number" &&
    Number.isFinite(maxTransfersPerMonth) &&
    maxTransfersPerMonth > 0
  ) {
    const monthly = await env.AUTH_DB.prepare(
      `SELECT COUNT(*) AS transfer_count
         FROM account_file_storage_reservations
        WHERE user_id = ?
          AND strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')`,
    )
      .bind(userId)
      .first<{ transfer_count: number | string | null }>();
    const transferCount = Math.max(0, Number(monthly?.transfer_count ?? 0));
    if (transferCount >= maxTransfersPerMonth) {
      return {
        ok: false,
        status: 429,
        body: {
          error: "attachment_transfer_monthly_limit",
          message: `This plan can start ${maxTransfersPerMonth} file, photo, audio, or recording transfers per month. Upgrade for higher limits.`,
          limit: maxTransfersPerMonth,
          used: transferCount,
        },
      };
    }
  }

  await env.AUTH_DB.prepare(
    "INSERT OR IGNORE INTO account_file_storage_usage (user_id, used_bytes, updated_at) VALUES (?, 0, datetime('now'))",
  )
    .bind(userId)
    .run();
  const usageUpdate = await env.AUTH_DB.prepare(
    `UPDATE account_file_storage_usage
       SET used_bytes = used_bytes + ?, updated_at = datetime('now')
     WHERE user_id = ? AND used_bytes + ? <= ?`,
  )
    .bind(encryptedSize, userId, encryptedSize, storageLimitBytes)
    .run();
  const changed = Number((usageUpdate as any).meta?.changes ?? 0);
  if (changed !== 1) {
    const usage = await env.AUTH_DB.prepare(
      "SELECT used_bytes FROM account_file_storage_usage WHERE user_id = ? LIMIT 1",
    )
      .bind(userId)
      .first<{ used_bytes: number }>();
    return {
      ok: false,
      status: 413,
      body: {
        error: "account_file_storage_quota_exceeded",
        message: "Encrypted file storage limit reached.",
        limitBytes: storageLimitBytes,
        usedBytes: Math.max(0, Number(usage?.used_bytes ?? 0)),
      },
    };
  }

  try {
    await env.AUTH_DB.prepare(
      `INSERT INTO account_file_storage_reservations
        (note_id, user_id, encrypted_size, status, created_at)
       VALUES (?, ?, ?, 'reserved', datetime('now'))`,
    )
      .bind(noteId, userId, encryptedSize)
      .run();
  } catch (error) {
    // Concurrent chunk PUTs often race past the SELECT above; the loser hits the
    // note_id PRIMARY KEY. Treat a matching reservation as success instead of 500.
    const raced = await env.AUTH_DB.prepare(
      "SELECT user_id, encrypted_size, status FROM account_file_storage_reservations WHERE note_id = ? LIMIT 1",
    )
      .bind(noteId)
      .first<{ user_id: string; encrypted_size: number; status: string }>();
    if (
      raced &&
      raced.user_id === userId &&
      raced.status === "reserved" &&
      raced.encrypted_size === encryptedSize
    ) {
      // Roll back the duplicate usage increment from this losing request.
      await env.AUTH_DB.prepare(
        `UPDATE account_file_storage_usage
           SET used_bytes = max(0, used_bytes - ?), updated_at = datetime('now')
         WHERE user_id = ?`,
      )
        .bind(encryptedSize, userId)
        .run();
      return { ok: true };
    }

    await env.AUTH_DB.prepare(
      `UPDATE account_file_storage_usage
         SET used_bytes = max(0, used_bytes - ?), updated_at = datetime('now')
       WHERE user_id = ?`,
    )
      .bind(encryptedSize, userId)
      .run();
    throw error;
  }

  return { ok: true };
}

export async function activateAccountFileStorageReservation(
  env: Env,
  noteId: string,
  encryptedSize: number,
  totalChunks: number,
  maxReads: number,
  fileAccessWindowSeconds: number,
  expiresAt: string | null,
): Promise<void> {
  if (!(await ensureAccountFileStorageSchema(env)) || !env.AUTH_DB) return;
  const reservation = await env.AUTH_DB.prepare(
    "SELECT user_id, encrypted_size, status FROM account_file_storage_reservations WHERE note_id = ? LIMIT 1",
  )
    .bind(noteId)
    .first<{ user_id: string; encrypted_size: number; status: string }>();
  if (!reservation || reservation.status === "released") return;

  const previousSize = Math.max(0, Number(reservation.encrypted_size ?? 0));
  const nextSize = Math.max(0, encryptedSize);
  const delta = nextSize - previousSize;
  if (delta !== 0) {
    await env.AUTH_DB.prepare(
      `UPDATE account_file_storage_usage
         SET used_bytes = max(0, used_bytes + ?), updated_at = datetime('now')
       WHERE user_id = ?`,
    )
      .bind(delta, reservation.user_id)
      .run();
  }
  await env.AUTH_DB.prepare(
    `UPDATE account_file_storage_reservations
       SET encrypted_size = ?,
           total_chunks = ?,
           max_reads = ?,
           file_access_window_seconds = ?,
           expires_at = ?,
           last_checked_at = NULL,
           status = 'active',
           activated_at = datetime('now')
     WHERE note_id = ? AND status != 'released'`,
  )
    .bind(
      nextSize,
      totalChunks,
      maxReads,
      isNoteFileAccessWindowSeconds(fileAccessWindowSeconds)
        ? fileAccessWindowSeconds
        : NOTE_FILE_ACCESS_DEFAULT_SECONDS,
      expiresAt,
      noteId,
    )
    .run();
}

async function releaseAccountFileStorageReservation(
  env: Env,
  noteId: string,
  reason: string,
): Promise<void> {
  if (!(await ensureAccountFileStorageSchema(env)) || !env.AUTH_DB) return;
  const reservation = await env.AUTH_DB.prepare(
    "SELECT user_id, encrypted_size, status FROM account_file_storage_reservations WHERE note_id = ? LIMIT 1",
  )
    .bind(noteId)
    .first<{ user_id: string; encrypted_size: number; status: string }>();
  if (!reservation || reservation.status === "released") return;
  const bytes = Math.max(0, Number(reservation.encrypted_size ?? 0));
  await env.AUTH_DB.batch([
    env.AUTH_DB.prepare(
      `UPDATE account_file_storage_usage
         SET used_bytes = max(0, used_bytes - ?), updated_at = datetime('now')
       WHERE user_id = ?`,
    ).bind(bytes, reservation.user_id),
    env.AUTH_DB.prepare(
      `UPDATE account_file_storage_reservations
         SET status = 'released', released_at = datetime('now'), release_reason = ?
       WHERE note_id = ? AND status != 'released'`,
    ).bind(reason, noteId),
  ]);
}

async function cleanupNoteFileChunks(env: Env, noteId: string, reason: string): Promise<void> {
  if (env.NOTE_FILES_R2) {
    try {
      const prefix = noteFileObjectPrefix(noteId);
      let cursor: string | undefined;
      do {
        const listed = await env.NOTE_FILES_R2.list({ prefix, cursor });
        const keys = listed.objects.map((object) => object.key);
        if (keys.length > 0) {
          await Promise.all(keys.map((key) => env.NOTE_FILES_R2!.delete(key)));
        }
        cursor = listed.truncated ? listed.cursor : undefined;
      } while (cursor);
    } catch (error) {
      console.warn(`[NOTE_FILES] Failed to clean attachment chunks for ${noteId} after ${reason}:`, error);
    }
  }
  try {
    await releaseAccountFileStorageReservation(env, noteId, reason);
  } catch (error) {
    console.warn(`[NOTE_FILES] Failed to release attachment quota for ${noteId} after ${reason}:`, error);
  }
}

function maxNoteFileAccessWindowSeconds(): number {
  return NOTE_FILE_ACCESS_WINDOW_OPTIONS.reduce((max, seconds) => Math.max(max, seconds), 0);
}

async function markAccountFileStorageReservationChecked(env: Env, noteId: string): Promise<void> {
  if (!env.AUTH_DB) return;
  await env.AUTH_DB.prepare(
    `UPDATE account_file_storage_reservations
        SET last_checked_at = datetime('now')
      WHERE note_id = ? AND status = 'active'`,
  )
    .bind(noteId)
    .run();
}

export async function cleanupExpiredNoteFileStorage(
  env: Env,
): Promise<{ checked: number; released: number; abandoned: number; pruned: number; error?: string }> {
  if (!(await ensureAccountFileStorageSchema(env)) || !env.AUTH_DB) {
    return { checked: 0, released: 0, abandoned: 0, pruned: 0, error: "AUTH_DB not configured" };
  }

  let checked = 0;
  let released = 0;
  let abandoned = 0;
  let pruned = 0;

  try {
    const abandonedRows = await env.AUTH_DB.prepare(
      `SELECT note_id
         FROM account_file_storage_reservations
        WHERE status = 'reserved'
          AND created_at < datetime('now', ?)
        ORDER BY created_at ASC
        LIMIT ?`,
    )
      .bind(
        `-${NOTE_FILE_STORAGE_CLEANUP.ABANDONED_RESERVED_AFTER_SECONDS} seconds`,
        NOTE_FILE_STORAGE_CLEANUP.BATCH_SIZE,
      )
      .all<{ note_id: string }>();

    for (const row of abandonedRows.results ?? []) {
      await cleanupNoteFileChunks(env, row.note_id, "scheduled abandoned attachment cleanup");
      abandoned += 1;
    }

    const maxWindowSeconds =
      maxNoteFileAccessWindowSeconds() + NOTE_FILE_STORAGE_CLEANUP.DOWNLOAD_WINDOW_GRACE_SECONDS;
    const activeRows = await env.AUTH_DB.prepare(
      `SELECT note_id, file_access_window_seconds
         FROM account_file_storage_reservations
        WHERE status = 'active'
          AND datetime(COALESCE(activated_at, created_at), ?) <= datetime('now')
          AND (
            last_checked_at IS NULL
            OR last_checked_at < datetime('now', ?)
            OR (expires_at IS NOT NULL AND datetime(expires_at) <= datetime('now'))
          )
        ORDER BY
          CASE WHEN expires_at IS NOT NULL AND datetime(expires_at) <= datetime('now') THEN 0 ELSE 1 END,
          COALESCE(last_checked_at, '1970-01-01T00:00:00Z') ASC,
          COALESCE(activated_at, created_at) ASC
        LIMIT ?`,
    )
      .bind(
        `+${maxWindowSeconds} seconds`,
        `-${NOTE_FILE_STORAGE_CLEANUP.ACTIVE_RECHECK_SECONDS} seconds`,
        NOTE_FILE_STORAGE_CLEANUP.BATCH_SIZE,
      )
      .all<{ note_id: string; file_access_window_seconds: number | null }>();

    for (const row of activeRows.results ?? []) {
      const noteId = row.note_id;
      checked += 1;
      const doUrl = new URL(`https://internal.privatenote.invalid/api/notes/${noteId}`);
      const request = new Request(doUrl.toString(), { method: "GET" });
      const stub = getSecureNoteStub(env, noteId);
      const response = await stub.fetch(request as any);

      if (response.status === 404) {
        await cleanupNoteFileChunks(env, noteId, "scheduled expired or destroyed attachment cleanup");
        released += 1;
      } else {
        if (!response.ok) {
          console.warn(`[NOTE_FILES] Scheduled cleanup meta check returned ${response.status} for ${noteId}`);
        }
        await markAccountFileStorageReservationChecked(env, noteId);
      }
    }

    const prunedResult = await env.AUTH_DB.prepare(
      `DELETE FROM account_file_storage_reservations
        WHERE status = 'released'
          AND released_at IS NOT NULL
          AND released_at < datetime('now', ?)`,
    )
      .bind(`-${NOTE_FILE_STORAGE_CLEANUP.RELEASED_ROW_RETENTION_DAYS} days`)
      .run();
    pruned = Number((prunedResult as any).meta?.changes ?? 0);

    return { checked, released, abandoned, pruned };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[NOTE_FILES] Scheduled storage cleanup failed:", error);
    return { checked, released, abandoned, pruned, error: message };
  }
}

function noteFileAccessKey(noteId: string, token: string): string {
  return `${NOTE_FILE_ACCESS.KEY_PREFIX}${noteId}:${token}`;
}

function randomUrlToken(bytes = 32): string {
  const value = new Uint8Array(bytes);
  crypto.getRandomValues(value);
  let binary = "";
  for (const byte of value) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function issueNoteFileAccessToken(
  env: Env,
  noteId: string,
  ttlSeconds = NOTE_FILE_ACCESS_DEFAULT_SECONDS,
): Promise<string> {
  const token = randomUrlToken();
  await env.NOTES_KV.put(
    noteFileAccessKey(noteId, token),
    JSON.stringify({ noteId, issuedAt: new Date().toISOString() }),
    { expirationTtl: ttlSeconds },
  );
  return token;
}

function getNoteFileAccessTokenFromRequest(request: Request): string | null {
  const header = request.headers.get("x-file-access-token");
  if (header?.trim()) return header.trim();
  return null;
}

function readUploadInteger(request: Request, headerName: string, queryName: string): number {
  const url = new URL(request.url);
  return Number(request.headers.get(headerName) ?? url.searchParams.get(queryName) ?? NaN);
}

async function requireNoteFileAccess(env: Env, request: Request, noteId: string): Promise<Response | null> {
  const token = getNoteFileAccessTokenFromRequest(request);
  if (!token || token.length > 256) {
    return jsonResponse({ error: "file_access_required", message: "Reveal the note before downloading its attachment." }, 403, request);
  }
  const marker = await env.NOTES_KV.get(noteFileAccessKey(noteId, token));
  if (!marker) {
    return jsonResponse({ error: "file_access_expired", message: "Attachment access expired. Reveal the note again if it is still available." }, 403, request);
  }
  return null;
}

async function reserveNoteId(
  env: Env,
  clientId: string,
  fileAccount: { userId: string; accountType: AccountType; isPremium: boolean } | null,
  attachmentBinding: NoteReserveAttachmentsBinding | null,
  clientIp?: string,
): Promise<{ id: string; uploadToken: string; expiresIn: number }> {
  const id = crypto.randomUUID();
  const uploadToken = randomUrlToken(32);
  const uploadTokenHash = await sha256Hex(uploadToken);
  const normalizedClientIp = clientIp?.trim() || undefined;
  const expiresIn = attachmentBinding
    ? NOTE_RESERVATION.ATTACHMENT_TTL_SECONDS
    : NOTE_RESERVATION.TTL_SECONDS;
  if (attachmentBinding && fileAccount) {
    const perFileLimit = noteFileLimitBytesForAccount(fileAccount.accountType);
    const transferLimit = noteFileTransferLimitBytesForAccount(fileAccount.accountType);
    const maxCount = Math.min(
      noteFileAttachmentsMaxCountForAccount(fileAccount.accountType),
      NOTE_FILE_ATTACHMENTS_HARD_MAX,
    );
    if (attachmentBinding.attachments.length > maxCount) {
      throw Object.assign(
        new Error(`This plan allows up to ${maxCount} files per transfer.`),
        { status: 413, code: "too_many_attachments" },
      );
    }
    for (const item of attachmentBinding.attachments) {
      if (item.attachmentPlaintextSize > perFileLimit) {
        throw Object.assign(
          new Error(
            `File exceeds the ${perFileLimit / (1024 * 1024)} MB limit for this account.`,
          ),
          { status: 413, code: "file_too_large" },
        );
      }
    }
    if (attachmentBinding.attachmentPlaintextSize > transferLimit) {
      throw Object.assign(
        new Error(
          `This transfer exceeds the ${transferLimit / (1024 * 1024)} MB limit for this account.`,
        ),
        { status: 413, code: "transfer_too_large" },
      );
    }
  }
  const kv = env.NOTES_KV;
  await kv.put(
    getReservationKey(id),
    JSON.stringify({
      clientId,
      ...(normalizedClientIp ? { clientIp: normalizedClientIp } : {}),
      createdAt: new Date().toISOString(),
      uploadTokenHash,
      fileStorageUserId: attachmentBinding ? fileAccount?.userId ?? null : null,
      premiumUserId: attachmentBinding && fileAccount?.isPremium ? fileAccount.userId : null,
      fileAccountType: attachmentBinding ? fileAccount?.accountType ?? "free" : null,
      ...(attachmentBinding ?? {}),
    } satisfies NoteReservationRecord),
    { expirationTtl: expiresIn },
  );
  return { id, uploadToken, expiresIn };
}

async function getNoteReservationRecord(
  env: Env,
  noteId: string,
): Promise<NoteReservationRecord | null> {
  const raw = await env.NOTES_KV.get(getReservationKey(noteId));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as NoteReservationRecord;
  } catch {
    return null;
  }
}

async function hasReservation(env: Env, id: string): Promise<boolean> {
  const kv = env.NOTES_KV;
  const raw = await kv.get(getReservationKey(id));
  return !!raw;
}

async function clearReservation(env: Env, id: string): Promise<void> {
  const kv = env.NOTES_KV;
  await kv.delete(getReservationKey(id));
}

/**
 * Abuse/rate-limit bucket: IP + first-party `pn_client_id` when both exist (reduces shared-NAT collisions).
 * No fingerprinting; cookie is HttpOnly and used only for this purpose.
 */
function getClientIdentifier(request: Request): string {
  const cookieHeader = request.headers.get("Cookie") || "";
  const cookieMatch = cookieHeader.match(/(?:^|;\s*)pn_client_id=([^;]+)/);
  const cookieId = cookieMatch?.[1]?.trim();

  const clientIp = readClientIpFromRequestHeaders(request.headers);
  if (clientIp && cookieId) {
    return `ip:${clientIp}|cid:${cookieId}`;
  }
  if (clientIp) {
    return `ip:${clientIp}`;
  }
  if (cookieId) {
    return `cookie:${cookieId}`;
  }

  const userAgent = request.headers.get("User-Agent") || "unknown";
  const origin = request.headers.get("Origin") || "unknown";
  return `ua:${`${origin}:${userAgent}`.substring(0, 100)}`;
}

/**
 * CSRF protection: reject state-changing requests from unexpected origins.
 * Only enforced when a session cookie is present (authenticated user context),
 * so unauthenticated API calls (note creation, etc.) are unaffected.
 *
 * Aligns with {@link assertTrustedJsonPost}: if `Origin` is sent it must be trusted (no Referer bypass);
 * when `Referer` is present it must match the allowed origin exactly.
 */
function verifyCsrfOrigin(request: Request): Response | null {
  if (request.method === "GET" || request.method === "HEAD" || request.method === "OPTIONS") {
    return null;
  }
  const path = new URL(request.url).pathname;
  // Allow-listed, unauthenticated counters only — sendBeacon cannot omit cookies.
  if (path === "/api/analytics/event") {
    return null;
  }
  const cookies = request.headers.get("Cookie") || "";
  const hasSessionCookie =
    cookies.includes(SESSION_COOKIE_PROD_NAME + "=") || cookies.includes(SESSION_COOKIE_PREVIEW_NAME + "=");
  if (!hasSessionCookie) {
    return null;
  }

  const originHeader = request.headers.get("Origin");
  let allowedOrigin: string | null = null;

  if (originHeader) {
    if (!isTrustedBrowserOrigin(originHeader)) {
      console.warn(`[CSRF] blocked method=${request.method} path=${path} untrusted Origin=${originHeader}`);
      return jsonResponse({ error: "CSRF validation failed" }, 403, request);
    }
    allowedOrigin = originHeader;
  } else {
    const refererOnly = request.headers.get("Referer");
    if (refererOnly) {
      try {
        const refOrigin = new URL(refererOnly).origin;
        if (!isTrustedBrowserOrigin(refOrigin)) {
          console.warn(`[CSRF] blocked method=${request.method} path=${path} untrusted Referer=${refererOnly}`);
          return jsonResponse({ error: "CSRF validation failed" }, 403, request);
        }
        allowedOrigin = refOrigin;
      } catch {
        console.warn(`[CSRF] blocked method=${request.method} path=${path} invalid Referer`);
        return jsonResponse({ error: "CSRF validation failed" }, 403, request);
      }
    }
  }

  if (!allowedOrigin) {
    console.warn(`[CSRF] blocked method=${request.method} path=${path} (no trusted Origin; no valid Referer)`);
    return jsonResponse({ error: "CSRF validation failed: missing Origin header" }, 403, request);
  }

  const referer = request.headers.get("Referer");
  if (referer) {
    try {
      const refOrigin = new URL(referer).origin;
      if (!isTrustedBrowserOrigin(refOrigin)) {
        console.warn(`[CSRF] blocked method=${request.method} path=${path} Referer=${referer}`);
        return jsonResponse({ error: "CSRF validation failed" }, 403, request);
      }
      if (normalizeOrigin(refOrigin) !== normalizeOrigin(allowedOrigin)) {
        console.warn(
          `[CSRF] blocked method=${request.method} path=${path} origin_referer_mismatch Origin=${allowedOrigin} Referer=${referer}`,
        );
        return jsonResponse(
          { error: "CSRF validation failed", code: "origin_referer_mismatch" },
          403,
          request,
        );
      }
    } catch {
      console.warn(`[CSRF] blocked method=${request.method} path=${path} invalid Referer`);
      return jsonResponse({ error: "CSRF validation failed" }, 403, request);
    }
  }

  return null;
}

// Accept either the X-Admin-Token header (legacy raw ADMIN_TOKEN) or a hashed opaque pn_admin session.
async function requireAdmin(request: Request, env: Env): Promise<Response | null> {
  const expected = env.ADMIN_TOKEN;
  if (!expected || typeof expected !== "string") {
    return jsonResponse({ message: "Unauthorized - Admin not configured" }, 401, request);
  }

  const headerToken = request.headers.get("x-admin-token");
  if (headerToken && constantTimeEquals(headerToken, expected)) {
    return null;
  }

  const cookies = parseCookies(request.headers.get("Cookie"));
  const sessionId = cookies[ADMIN_SESSION_COOKIE_NAME];
  const kv = getAuthKv(env);
  if (sessionId && kv && (await adminSessionIsValid(kv, sessionId, expected))) {
    return null;
  }

  return jsonResponse({ message: "Unauthorized - Admin access required" }, 401, request);
}

// Helper to parse URL parameters
function parsePathParams(pathname: string, pattern: string): Record<string, string> | null {
  const patternParts = pattern.split("/");
  const pathParts = pathname.split("/");

  if (patternParts.length !== pathParts.length) {
    return null;
  }

  const params: Record<string, string> = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(":")) {
      const paramName = patternParts[i].slice(1);
      params[paramName] = pathParts[i];
    } else if (patternParts[i] !== pathParts[i]) {
      return null;
    }
  }

  return params;
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

/** `YYYY-MM-DD` interpreted as UTC midnight for analytics KV day keys. */
function parseAnalyticsUtcDayParam(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }
  const d = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Persist analytics after the response so ingest cannot stall /api. */
function scheduleAnalyticsWork(ctx: ExecutionContext | undefined, work: Promise<unknown>): void {
  const task = work.catch((error) => {
    console.error("Error persisting analytics:", error);
  });
  if (ctx && typeof ctx.waitUntil === "function") {
    ctx.waitUntil(task);
    return;
  }
  void task;
}

export async function registerRoutes(
  request: Request,
  env: Env,
  ctx?: ExecutionContext,
): Promise<Response> {
  env = withEuStoredDataEnv(env);
  const url = new URL(request.url);
  const pathname = url.pathname;
  const method = request.method;

  console.log(`[ROUTES] ${method} ${pathname} origin=${request.headers.get("Origin") ?? "-"}`);

  // Check CORS origin
  const allowedOrigin = getAllowedOrigin(request);
  if (!allowedOrigin && request.headers.get('Origin')) {
    console.log(`[ROUTES] ❌ CORS: Origin not allowed: ${request.headers.get('Origin')}`);
    return new Response(JSON.stringify({
      error: 'CORS policy: Origin not allowed'
    }), {
      status: 403,
      headers: {
        "Content-Type": "application/json",
        ...getCorsHeaders(request),
      },
    });
  }

  // Handle CORS preflight requests
  if (request.method === "OPTIONS") {
    console.log(`[ROUTES] Handling OPTIONS preflight request`);
    return new Response(null, {
      status: 204,
      headers: {
        ...getCorsHeaders(request),
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  // CSRF: require valid Origin (or Referer) on authenticated state-changing requests
  const csrfError = verifyCsrfOrigin(request);
  if (csrfError) return csrfError;

  // Rate limits: calm global POST cap + discrete per-route budgets (no fingerprinting).
  const isProviderWebhook =
    pathname === "/api/auth/billing/stripe/webhook" && request.method === "POST";
  if (isProviderWebhook) {
    const clientId = getClientIdentifier(request);
    const webhookLimit = await checkRateLimit(
      env,
      clientId,
      RATE_LIMIT_STRIPE_WEBHOOK,
    );
    if (!webhookLimit.allowed) {
      return jsonResponse(
        {
          error: "webhook_rate_limit_exceeded",
          message: "Too many webhook requests. Retry later.",
          resetAt: webhookLimit.resetAt,
        },
        429,
        request,
      );
    }
  } else if (request.method === "POST" && pathname !== "/api/analytics/event") {
    const clientId = getClientIdentifier(request);
    console.log(`[ROUTES] Rate-limit client bucket: ${clientId}`);

    const globalLimit = await checkRateLimit(env, clientId, RATE_LIMIT_GLOBAL_POST);
    if (!globalLimit.allowed) {
      console.log(`[ROUTES] ⛔ Global POST rate limit exceeded for: ${clientId}`);
      const challengeKv = env.ANALYTICS_KV || env.NOTES_KV;
      await setTurnstileChallengeRequired(challengeKv, clientId);
      return jsonResponse(
        {
          error: "Rate limit exceeded",
          message: `Too many requests. Please try again in ${globalLimit.resetAt - Math.floor(Date.now() / 1000)} seconds.`,
          resetAt: globalLimit.resetAt,
        },
        429,
        request,
      );
    }

    if (pathname === "/api/notes/reserve") {
      const r = await checkRateLimit(env, clientId, RATE_LIMIT_RESERVE);
      if (!r.allowed) {
        const challengeKv = env.ANALYTICS_KV || env.NOTES_KV;
        await setTurnstileChallengeRequired(challengeKv, clientId);
        return jsonResponse(
          {
            error: "Rate limit exceeded",
            message: `Too many note reservations. Please try again in ${r.resetAt - Math.floor(Date.now() / 1000)} seconds.`,
            resetAt: r.resetAt,
          },
          429,
          request,
        );
      }
    }

    if (pathname === "/api/notes") {
      const r = await checkRateLimit(env, clientId, RATE_LIMIT_NOTE_CREATE);
      if (!r.allowed) {
        const challengeKv = env.ANALYTICS_KV || env.NOTES_KV;
        await setTurnstileChallengeRequired(challengeKv, clientId);
        return jsonResponse(
          {
            error: "Rate limit exceeded",
            message: `Too many notes created. Please try again in ${r.resetAt - Math.floor(Date.now() / 1000)} seconds.`,
            resetAt: r.resetAt,
          },
          429,
          request,
        );
      }
    }

    console.log(`[ROUTES] ✅ Rate limits OK. Global remaining: ${globalLimit.remaining}`);
  }

  console.log(`[ROUTES] Pathname: ${pathname}, Method: ${method}`);

  console.log(`[ROUTES] Calling handleAuthRoutes...`);
  const authResponse = await handleAuthRoutesComplete(request, env);
  console.log(`[ROUTES] handleAuthRoutes returned: ${authResponse ? authResponse.status : 'null'}`);
  if (authResponse) {
    // Fire-and-forget analytics for successful auth events (no await — never block the response).
    if (authResponse.status === 200) {
      const _analyticsKv = env.ANALYTICS_KV || env.NOTES_KV;
      const _authStorage = new CompositeStorage(env.NOTES_KV, _analyticsKv);
      if (
        (pathname === "/api/auth/magic/consume" && method === "POST") ||
        (pathname === "/api/auth/webauthn/login/verify" && method === "POST") ||
        (pathname === "/api/auth/recovery/consume" && method === "POST")
      ) {
        _authStorage.trackAccountLogin().catch(() => {});
      } else if (pathname === "/api/auth/webauthn/register/verify" && method === "POST") {
        // Passkey registration is the closest server-side proxy for a new account signup
        _authStorage.trackAccountSignup().catch(() => {});
      }
    }
    return authResponse;
  }

  const analyticsKv = env.ANALYTICS_KV || env.NOTES_KV;
  const storage = new CompositeStorage(env.NOTES_KV, analyticsKv);
  console.log(`[ROUTES] Storage initialized`);

  if (pathname === "/api/ai/cloud-draft" && method === "POST") {
    return handleHostedAiDraft(request, env);
  }

  if (pathname === "/api/notes/turnstile-challenge" && method === "GET") {
    const clientId = getClientIdentifier(request);
    const required =
      Boolean(env.TURNSTILE_SECRET_KEY) && (await getTurnstileChallengeRequired(analyticsKv, clientId));
    return jsonResponse({ required }, 200, request);
  }

  // Reserve note ID (client encrypts with noteId-bound AAD)
  if (pathname === "/api/notes/reserve" && method === "POST") {
    try {
      const clientId = getClientIdentifier(request);
      let reserveBody: unknown = null;
      try {
        reserveBody = await request.json();
      } catch {
        reserveBody = null;
      }
      const attachmentBinding = parseNoteReserveAttachmentBinding(reserveBody);
      const fileAccount = attachmentBinding
        ? await getAuthenticatedAccountForNoteFiles(env, request)
        : null;
      if (attachmentBinding && !fileAccount) {
        return jsonResponse(
          {
            error: "file_upload_auth_required",
            message: "Sign in to attach encrypted files.",
          },
          401,
          request,
        );
      }
      const { id, uploadToken, expiresIn } = await reserveNoteId(
        env,
        clientId,
        fileAccount,
        attachmentBinding,
        readClientIpFromRequestHeaders(request.headers) ?? undefined,
      );
      return jsonResponse(
        { id, uploadToken, expiresIn },
        200,
        request,
      );
    } catch (error) {
      const status = (error as { status?: number })?.status;
      const code = (error as { code?: string })?.code;
      if (
        status === 413 &&
        (code === "file_too_large" || code === "transfer_too_large" || code === "too_many_attachments")
      ) {
        return jsonResponse(
          {
            error: code,
            message: error instanceof Error ? error.message : "File exceeds the account limit.",
          },
          413,
          request,
        );
      }
      console.error("[ROUTES] Failed to reserve note ID:", error);
      return jsonResponse({ error: "Failed to reserve note ID" }, 500, request);
    }
  }

  // Large attachments (≥ ~90 MB ciphertext): browser PUT → R2 via S3 presign
  // (bypasses Cloudflare CDN max request body on the upload Worker hop).
  const filePresignParams = parsePathParams(pathname, "/api/notes/:id/file/presign");
  if (filePresignParams && method === "POST") {
    const { id } = filePresignParams;
    if (!isValidNoteId(id)) {
      return jsonResponse({ error: "Invalid file chunk" }, 400, request);
    }
    if (!env.NOTE_FILES_R2) {
      return jsonResponse(
        { error: "file_storage_unavailable", message: "Encrypted file storage is not configured." },
        503,
        request,
      );
    }
    const presignConfig = readR2PresignConfig(env);
    if (!presignConfig) {
      return jsonResponse(
        {
          error: "r2_presign_unavailable",
          message:
            "Direct R2 upload is not configured. Set R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ACCOUNT_ID, and R2_BUCKET_NAME.",
        },
        503,
        request,
      );
    }
    const uploadAuth = await authorizeNoteFileChunkUpload(env, request, id);
    if (!uploadAuth.ok) {
      return uploadAuth.response;
    }
    const clientId = getClientIdentifier(request);
    const chunkRateLimit = await checkRateLimit(
      env,
      `${clientId}:file-presign:${id}`,
      RATE_LIMIT_FILE_CHUNK_PUT,
    );
    if (!chunkRateLimit.allowed) {
      return jsonResponse(
        {
          error: "rate_limited",
          message: `Too many upload requests. Please try again in ${chunkRateLimit.resetAt - Math.floor(Date.now() / 1000)} seconds.`,
          resetAt: chunkRateLimit.resetAt,
        },
        429,
        request,
      );
    }
    const reservation = uploadAuth.record;
    if (
      reservation.attachmentPlaintextSize == null ||
      reservation.attachmentEncryptedSize == null ||
      !(uploadAuth.record.fileStorageUserId ?? uploadAuth.premiumUserId)
    ) {
      return jsonResponse(
        { error: "file_upload_auth_required", message: "Sign in to attach encrypted files." },
        401,
        request,
      );
    }
    let presignAttachmentIndex = 0;
    try {
      const presignBody = (await request.json()) as { attachmentIndex?: unknown };
      const parsedIndex = Number(presignBody?.attachmentIndex ?? 0);
      if (Number.isInteger(parsedIndex) && parsedIndex >= 0) {
        presignAttachmentIndex = parsedIndex;
      }
    } catch {
      presignAttachmentIndex = 0;
    }
    const presignItem = reservationAttachmentAt(reservation, presignAttachmentIndex);
    if (!presignItem) {
      return jsonResponse({ error: "Unknown attachment index" }, 400, request);
    }
    try {
      const objectKey = noteFileChunkObjectKey(id, 0, presignAttachmentIndex);
      const { uploadUrl, expiresIn } = await createNoteFilePresignedPutUrl(presignConfig, objectKey);
      return jsonResponse(
        {
          uploadUrl,
          expiresIn,
          objectKey,
          encryptedSize: presignItem.attachmentEncryptedSize,
          attachmentIndex: presignAttachmentIndex,
        },
        200,
        request,
      );
    } catch (error) {
      console.error("[ROUTES] Failed to presign R2 upload:", error);
      return jsonResponse({ error: "Failed to prepare direct upload" }, 500, request);
    }
  }

  const fileCompleteParams = parsePathParams(pathname, "/api/notes/:id/file/complete");
  if (fileCompleteParams && method === "POST") {
    const { id } = fileCompleteParams;
    if (!isValidNoteId(id)) {
      return jsonResponse({ error: "Invalid file chunk" }, 400, request);
    }
    if (!env.NOTE_FILES_R2) {
      return jsonResponse(
        { error: "file_storage_unavailable", message: "Encrypted file storage is not configured." },
        503,
        request,
      );
    }
    const uploadAuth = await authorizeNoteFileChunkUpload(env, request, id);
    if (!uploadAuth.ok) {
      return uploadAuth.response;
    }

    let completeBody: { chunkSha256?: unknown; encryptedSize?: unknown; attachmentIndex?: unknown } = {};
    try {
      completeBody = (await request.json()) as typeof completeBody;
    } catch {
      return jsonResponse({ error: "Invalid JSON body" }, 400, request);
    }
    const claimedHash =
      typeof completeBody.chunkSha256 === "string" ? completeBody.chunkSha256.trim().toLowerCase() : "";
    if (!isValidAttachmentContentHash(claimedHash)) {
      return jsonResponse({ error: "chunkSha256 is required" }, 400, request);
    }
    const completeAttachmentIndex = Number(completeBody.attachmentIndex ?? 0);
    if (!Number.isInteger(completeAttachmentIndex) || completeAttachmentIndex < 0) {
      return jsonResponse({ error: "Unknown attachment index" }, 400, request);
    }

    const premiumUserId = uploadAuth.premiumUserId;
    const fileStorageUserId = uploadAuth.record.fileStorageUserId ?? premiumUserId;
    const reservation = uploadAuth.record;
    if (
      !fileStorageUserId ||
      reservation.attachmentPlaintextSize == null ||
      reservation.attachmentEncryptedSize == null
    ) {
      return jsonResponse(
        { error: "file_upload_auth_required", message: "Sign in to attach encrypted files." },
        401,
        request,
      );
    }

    const fileAccountType = await resolveUploadFileAccountType(env, reservation, fileStorageUserId);
    const completeItem = reservationAttachmentAt(reservation, completeAttachmentIndex);
    if (!completeItem) {
      return jsonResponse({ error: "Unknown attachment index" }, 400, request);
    }
    const plaintextLimit = noteFileLimitBytesForAccount(fileAccountType);
    const transferLimit = noteFileTransferLimitBytesForAccount(fileAccountType);
    const plaintextSize = completeItem.attachmentPlaintextSize;
    const encryptedItemSize = completeItem.attachmentEncryptedSize;
    const encryptedTotalSize = reservation.attachmentEncryptedSize;
    if (plaintextSize > plaintextLimit || reservation.attachmentPlaintextSize > transferLimit) {
      return jsonResponse(
        {
          error: "file_too_large",
          message: `File exceeds the ${plaintextLimit / (1024 * 1024)} MB limit for this account.`,
        },
        413,
        request,
      );
    }
    const claimedSize =
      typeof completeBody.encryptedSize === "number" && Number.isInteger(completeBody.encryptedSize)
        ? completeBody.encryptedSize
        : encryptedItemSize;
    if (claimedSize !== encryptedItemSize) {
      return jsonResponse({ error: "File chunk size mismatch" }, 400, request);
    }

    if (fileStorageUserId) {
      const quotaReservation = await reserveAccountFileStorageBytes(
        env,
        fileStorageUserId,
        id,
        encryptedTotalSize,
        noteFileTotalStorageBytesForAccount(fileAccountType),
        { maxTransfersPerMonth: noteFileTransfersPerMonthForAccount(fileAccountType) },
      );
      if (!quotaReservation.ok) {
        return jsonResponse(quotaReservation.body, quotaReservation.status, request);
      }
    }

    const chunkKey = uploadedChunkHashKey(0, completeAttachmentIndex);
    const objectKey = noteFileChunkObjectKey(id, 0, completeAttachmentIndex);
    try {
      const freshRaw = await env.NOTES_KV.get(getReservationKey(id));
      const freshReservation = freshRaw
        ? (JSON.parse(freshRaw) as NoteReservationRecord)
        : reservation;
      const existingHash = freshReservation.uploadedChunkHashes?.[chunkKey];
      const existingObject = await env.NOTE_FILES_R2.head(objectKey);
      if (!existingObject || existingObject.size !== encryptedItemSize) {
        return jsonResponse({ error: "Attachment upload missing" }, 400, request);
      }
      if (existingHash === claimedHash) {
        return jsonResponse(
          { ok: true, encryptedSize: encryptedItemSize, idempotent: true },
          200,
          request,
        );
      }

      // Trust client ciphertext hash after size check. Re-streaming ~1 GB from R2 to
      // recompute SHA-256 hits Worker timeouts (Safari sees 503/CORS). A lying client
      // only breaks their own note; finalize binds attachmentContentHash to this value.
      await persistNoteReservation(env, id, {
        ...freshReservation,
        uploadedChunkHashes: {
          ...(freshReservation.uploadedChunkHashes ?? {}),
          [chunkKey]: claimedHash,
        },
      });
      return jsonResponse({ ok: true, encryptedSize: encryptedItemSize }, 200, request);
    } catch (error) {
      console.error("[ROUTES] Failed to complete R2 direct upload:", error);
      return jsonResponse({ error: "Failed to complete upload" }, 500, request);
    }
  }

  // encrypt.lu-style single Blob PUT lands on /file (not /file/chunks/0).
  // Map it onto chunk index 0 so storage + finalize stay one code path.
  const namespacedSingleFileParams = parsePathParams(
    pathname,
    "/api/notes/:id/attachments/:attachmentIndex/file",
  );
  const legacySingleFileParams = parsePathParams(pathname, "/api/notes/:id/file");
  const singleFileUploadParams = namespacedSingleFileParams ?? legacySingleFileParams;
  const isSingleFileUpload = Boolean(singleFileUploadParams && (method === "PUT" || method === "POST"));
  const namespacedChunkParams = parsePathParams(
    pathname,
    "/api/notes/:id/attachments/:attachmentIndex/file/chunks/:chunkIndex",
  );
  const legacyChunkParams = parsePathParams(pathname, "/api/notes/:id/file/chunks/:chunkIndex");
  const noteFileChunkParams = isSingleFileUpload
    ? {
        id: singleFileUploadParams!.id,
        chunkIndex: "0",
        attachmentIndex: namespacedSingleFileParams?.attachmentIndex ?? "0",
      }
    : namespacedChunkParams ?? legacyChunkParams;
  if (noteFileChunkParams && (method === "PUT" || method === "POST")) {
    const { id, chunkIndex: chunkIndexRaw } = noteFileChunkParams;
    const chunkIndex = Number(chunkIndexRaw);
    const attachmentIndex = Number(
      "attachmentIndex" in noteFileChunkParams
        ? noteFileChunkParams.attachmentIndex
        : 0,
    );

    // ── Single Blob PUT: stream to R2 (no full-body arrayBuffer) ────────────
    // Buffering ~30 MiB+ in the Worker has aborted Safari mid-PUT (status 0 after
    // ~15 s). Auth uses the query uploadToken; sizes come from the reservation.
    if (isSingleFileUpload) {
      if (!isValidNoteId(id)) {
        await discardRequestBody(request);
        return jsonResponse({ error: "Invalid file chunk" }, 400, request);
      }
      if (!env.NOTE_FILES_R2) {
        await discardRequestBody(request);
        return jsonResponse(
          { error: "file_storage_unavailable", message: "Encrypted file storage is not configured." },
          503,
          request,
        );
      }

      const uploadAuth = await authorizeNoteFileChunkUpload(env, request, id);
      if (!uploadAuth.ok) {
        await discardRequestBody(request);
        return uploadAuth.response;
      }

      const clientId = getClientIdentifier(request);
      const chunkRateLimit = await checkRateLimit(
        env,
        `${clientId}:file-chunk:${id}`,
        RATE_LIMIT_FILE_CHUNK_PUT,
      );
      if (!chunkRateLimit.allowed) {
        await discardRequestBody(request);
        return jsonResponse(
          {
            error: "Rate limit exceeded",
            message: `Too many attachment chunk uploads. Please try again in ${chunkRateLimit.resetAt - Math.floor(Date.now() / 1000)} seconds.`,
            resetAt: chunkRateLimit.resetAt,
          },
          429,
          request,
        );
      }

      const contentLengthHeader = request.headers.get("Content-Length");
      const contentLength =
        contentLengthHeader != null && contentLengthHeader !== ""
          ? Number(contentLengthHeader)
          : NaN;
      if (contentLength === 0) {
        return applyCorsHeaders(new Response(null, { status: 204 }), request);
      }

      const premiumUserId = uploadAuth.premiumUserId;
      const fileStorageUserId = uploadAuth.record.fileStorageUserId ?? premiumUserId;
      const reservation = uploadAuth.record;
      if (
        !fileStorageUserId ||
        reservation.attachmentPlaintextSize == null ||
        reservation.attachmentEncryptedSize == null
      ) {
        await discardRequestBody(request);
        return jsonResponse(
          { error: "file_upload_auth_required", message: "Sign in to attach encrypted files." },
          401,
          request,
        );
      }

      const fileAccountType = await resolveUploadFileAccountType(env, reservation, fileStorageUserId);
      const plaintextLimit = noteFileLimitBytesForAccount(fileAccountType);
      const transferLimit = noteFileTransferLimitBytesForAccount(fileAccountType);
      const uploadItem = reservationAttachmentAt(reservation, attachmentIndex);
      if (!uploadItem) {
        await discardRequestBody(request);
        return jsonResponse({ error: "Unknown attachment index" }, 400, request);
      }
      const plaintextSize = uploadItem.attachmentPlaintextSize;
      const encryptedItemSize = uploadItem.attachmentEncryptedSize;
      const encryptedTotalSize = reservation.attachmentEncryptedSize;
      if (plaintextSize > plaintextLimit) {
        await discardRequestBody(request);
        return jsonResponse(
          {
            error: "file_too_large",
            message: `File exceeds the ${plaintextLimit / (1024 * 1024)} MB limit for this account.`,
          },
          413,
          request,
        );
      }
      if (reservation.attachmentPlaintextSize > transferLimit) {
        await discardRequestBody(request);
        return jsonResponse(
          {
            error: "transfer_too_large",
            message: `This transfer exceeds the ${transferLimit / (1024 * 1024)} MB limit for this account.`,
          },
          413,
          request,
        );
      }
      const encryptedItemLimit =
        plaintextLimit + NOTE_FILE_SECRETSTREAM_ABYTES * NOTE_FILE_MAX_CHUNKS + 24;
      if (encryptedItemSize > encryptedItemLimit) {
        await discardRequestBody(request);
        return jsonResponse({ error: "Encrypted file exceeds the account limit" }, 413, request);
      }
      if (Number.isInteger(contentLength) && contentLength !== encryptedItemSize) {
        await discardRequestBody(request);
        return jsonResponse({ error: "File chunk size mismatch" }, 400, request);
      }

      if (fileStorageUserId) {
        const quotaReservation = await reserveAccountFileStorageBytes(
          env,
          fileStorageUserId,
          id,
          encryptedTotalSize,
          noteFileTotalStorageBytesForAccount(fileAccountType),
          { maxTransfersPerMonth: noteFileTransfersPerMonthForAccount(fileAccountType) },
        );
        if (!quotaReservation.ok) {
          await discardRequestBody(request);
          return jsonResponse(quotaReservation.body, quotaReservation.status, request);
        }
      }

      if (!request.body) {
        return jsonResponse({ error: "Missing upload body" }, 400, request);
      }

      const chunkKey = uploadedChunkHashKey(0, attachmentIndex);
      const objectKey = noteFileChunkObjectKey(id, 0, attachmentIndex);

      try {
        const freshRaw = await env.NOTES_KV.get(getReservationKey(id));
        const freshReservation = freshRaw
          ? (JSON.parse(freshRaw) as NoteReservationRecord)
          : reservation;
        const existingHash = freshReservation.uploadedChunkHashes?.[chunkKey];
        if (existingHash) {
          const existingObject = await env.NOTE_FILES_R2.head(objectKey);
          if (existingObject && existingObject.size === encryptedItemSize) {
            await discardRequestBody(request);
            return jsonResponse(
              { ok: true, encryptedSize: encryptedItemSize, idempotent: true },
              200,
              request,
            );
          }
        }

        // Tee: one branch → R2, one → SHA-256. Avoids buffering the full ~30 MiB+
        // body in Worker memory (arrayBuffer was aborting Safari mid-PUT).
        const [toR2, toHash] = request.body.tee();
        const hashPromise = sha256HexOfStream(toHash);
        // DOM vs workers-types ReadableStream diverge; R2 accepts the stream at runtime.
        const putPromise = env.NOTE_FILES_R2.put(objectKey, toR2 as any, {
          httpMetadata: { contentType: "application/octet-stream" },
          customMetadata: {
            encryptedSize: String(encryptedItemSize),
            chunkIndex: "0",
            attachmentIndex: String(attachmentIndex),
            chunkEncryptedSize: String(encryptedItemSize),
            createdAt: new Date().toISOString(),
          },
        });
        const [{ hex: chunkSha256Hex, byteLength }] = await Promise.all([
          hashPromise,
          putPromise,
        ]);
        if (byteLength !== encryptedItemSize) {
          try {
            await env.NOTE_FILES_R2.delete(objectKey);
          } catch {
            /* best effort */
          }
          return jsonResponse({ error: "File chunk size mismatch" }, 400, request);
        }

        // Hash lives in KV (R2 has no metadata-only patch). Finalize falls back to
        // reservation.uploadedChunkHashes when customMetadata.chunkSha256 is absent.
        await persistNoteReservation(env, id, {
          ...freshReservation,
          uploadedChunkHashes: {
            ...(freshReservation.uploadedChunkHashes ?? {}),
            [chunkKey]: chunkSha256Hex,
          },
        });

        return jsonResponse({ ok: true, encryptedSize: byteLength }, 201, request);
      } catch (error) {
        console.error(`[NOTE_FILES] Single-blob upload failed for ${id}:`, error);
        return jsonResponse(
          {
            error: "file_chunk_upload_failed",
            message: "Encrypted file upload failed. Please retry.",
          },
          500,
          request,
        );
      }
    }

    // Drain BEFORE any 4xx/5xx. Safari still streaming a multi‑MiB body treats an
    // early close as status 0 / "network connection was lost" with no responseURL.
    const encryptedBytes = await request.arrayBuffer();

    if (!isValidNoteId(id) || !Number.isInteger(chunkIndex) || chunkIndex < 0 || chunkIndex > NOTE_FILE_MAX_CHUNK_INDEX) {
      return jsonResponse({ error: "Invalid file chunk" }, 400, request);
    }
    if (!env.NOTE_FILES_R2) {
      return jsonResponse(
        { error: "file_storage_unavailable", message: "Encrypted file storage is not configured." },
        503,
        request,
      );
    }

    const uploadAuth = await authorizeNoteFileChunkUpload(env, request, id);
    if (!uploadAuth.ok) {
      return uploadAuth.response;
    }

    const clientId = getClientIdentifier(request);
    const chunkRateLimit = await checkRateLimit(
      env,
      `${clientId}:file-chunk:${id}`,
      RATE_LIMIT_FILE_CHUNK_PUT,
    );
    if (!chunkRateLimit.allowed) {
      return jsonResponse(
        {
          error: "Rate limit exceeded",
          message: `Too many attachment chunk uploads. Please try again in ${chunkRateLimit.resetAt - Math.floor(Date.now() / 1000)} seconds.`,
          resetAt: chunkRateLimit.resetAt,
        },
        429,
        request,
      );
    }

    // Safari fires one empty-body probe to warm the HTTP/2 connection before real
    // chunks. Answer 204 so DevTools doesn't look like a failed upload.
    const probeChunkSize = readUploadInteger(request, "x-file-chunk-encrypted-size", "chunkEncryptedSize");
    if (encryptedBytes.byteLength === 0 && probeChunkSize === 0) {
      return applyCorsHeaders(new Response(null, { status: 204 }), request);
    }

    const premiumUserId = uploadAuth.premiumUserId;
    const fileStorageUserId = uploadAuth.record.fileStorageUserId ?? premiumUserId;
    const reservation = uploadAuth.record;
    if (
      !fileStorageUserId ||
      reservation.attachmentPlaintextSize == null ||
      reservation.attachmentEncryptedSize == null
    ) {
      return jsonResponse(
        { error: "file_upload_auth_required", message: "Sign in to attach encrypted files." },
        401,
        request,
      );
    }
    const fileAccountType = await resolveUploadFileAccountType(env, reservation, fileStorageUserId);
    const plaintextLimit = noteFileLimitBytesForAccount(fileAccountType);
    const chunkUploadItem = reservationAttachmentAt(reservation, attachmentIndex);
    if (!chunkUploadItem) {
      return jsonResponse({ error: "Unknown attachment index" }, 400, request);
    }
    // Bearer + omitMetadata (encrypt.lu primary): sizes come from the reservation.
    const requestedPlaintextSize = readUploadInteger(request, "x-file-plaintext-size", "plaintextSize");
    const plaintextSize =
      isSingleFileUpload && !Number.isInteger(requestedPlaintextSize)
        ? chunkUploadItem.attachmentPlaintextSize
        : requestedPlaintextSize;
    if (!Number.isInteger(plaintextSize) || plaintextSize < 0) {
      return jsonResponse({ error: "Missing or invalid x-file-plaintext-size" }, 400, request);
    }
    if (plaintextSize > plaintextLimit) {
      return jsonResponse(
        {
          error: "file_too_large",
          message: `File exceeds the ${plaintextLimit / (1024 * 1024)} MB limit for this account.`,
        },
        413,
        request,
      );
    }
    if (plaintextSize !== chunkUploadItem.attachmentPlaintextSize) {
      return jsonResponse({ error: "Attachment plaintext size mismatch" }, 400, request);
    }

    const requestedEncryptedTotalSize = readUploadInteger(
      request,
      "x-file-encrypted-size",
      "encryptedSize",
    );
    const encryptedTotalSize =
      isSingleFileUpload && !Number.isInteger(requestedEncryptedTotalSize)
        ? chunkUploadItem.attachmentEncryptedSize
        : requestedEncryptedTotalSize;
    if (!Number.isInteger(encryptedTotalSize) || encryptedTotalSize <= 0) {
      return jsonResponse({ error: "Missing or invalid x-file-encrypted-size" }, 400, request);
    }
    if (encryptedTotalSize !== chunkUploadItem.attachmentEncryptedSize) {
      return jsonResponse({ error: "Attachment encrypted size mismatch" }, 400, request);
    }
    const encryptedTotalLimit =
      plaintextLimit + NOTE_FILE_SECRETSTREAM_ABYTES * NOTE_FILE_MAX_CHUNKS + 24;
    if (encryptedTotalSize > encryptedTotalLimit) {
      return jsonResponse({ error: "Encrypted file exceeds the account limit" }, 413, request);
    }
    if (fileStorageUserId) {
      const quotaReservation = await reserveAccountFileStorageBytes(
        env,
        fileStorageUserId,
        id,
        reservation.attachmentEncryptedSize,
        noteFileTotalStorageBytesForAccount(fileAccountType),
        { maxTransfersPerMonth: noteFileTransfersPerMonthForAccount(fileAccountType) },
      );
      if (!quotaReservation.ok) {
        return jsonResponse(quotaReservation.body, quotaReservation.status, request);
      }
    }

    const requestedEncryptedChunkSize = readUploadInteger(
      request,
      "x-file-chunk-encrypted-size",
      "chunkEncryptedSize",
    );
    const encryptedChunkSize =
      isSingleFileUpload && !Number.isInteger(requestedEncryptedChunkSize)
        ? encryptedTotalSize
        : requestedEncryptedChunkSize;
    if (!Number.isInteger(encryptedChunkSize) || encryptedChunkSize <= 0) {
      return jsonResponse({ error: "Missing or invalid x-file-chunk-encrypted-size" }, 400, request);
    }
    if (encryptedBytes.byteLength !== encryptedChunkSize) {
      return jsonResponse({ error: "File chunk size mismatch" }, 400, request);
    }

    const chunkSha256Hex = sha256HexBytes(new Uint8Array(encryptedBytes));
    const chunkKey = uploadedChunkHashKey(chunkIndex, attachmentIndex);

    try {
      // Re-read reservation so concurrent chunk PUTs merge hashes instead of
      // last-write-wins wiping sibling chunk hashes.
      const freshRaw = await env.NOTES_KV.get(getReservationKey(id));
      const freshReservation = freshRaw
        ? (JSON.parse(freshRaw) as NoteReservationRecord)
        : reservation;
      const existingHash = freshReservation.uploadedChunkHashes?.[chunkKey];
      if (existingHash) {
        if (existingHash !== chunkSha256Hex) {
          return jsonResponse({ error: "Attachment chunk already uploaded" }, 409, request);
        }
        const existingObject = await env.NOTE_FILES_R2.head(
          noteFileChunkObjectKey(id, chunkIndex, attachmentIndex),
        );
        if (
          existingObject &&
          existingObject.customMetadata?.chunkSha256 === chunkSha256Hex &&
          Number(existingObject.customMetadata?.chunkEncryptedSize ?? NaN) === encryptedBytes.byteLength
        ) {
          return jsonResponse(
            { ok: true, encryptedSize: encryptedBytes.byteLength, idempotent: true },
            200,
            request,
          );
        }
      }

      await env.NOTE_FILES_R2.put(
        noteFileChunkObjectKey(id, chunkIndex, attachmentIndex),
        encryptedBytes,
        {
        httpMetadata: { contentType: "application/octet-stream" },
        customMetadata: {
          encryptedSize: String(encryptedTotalSize),
          chunkIndex: String(chunkIndex),
          attachmentIndex: String(attachmentIndex),
          chunkEncryptedSize: String(encryptedBytes.byteLength),
          chunkSha256: chunkSha256Hex,
          createdAt: new Date().toISOString(),
        },
      },
      );

      await persistNoteReservation(env, id, {
        ...freshReservation,
        uploadedChunkHashes: {
          ...(freshReservation.uploadedChunkHashes ?? {}),
          [chunkKey]: chunkSha256Hex,
        },
      });

      return jsonResponse({ ok: true, encryptedSize: encryptedBytes.byteLength }, 201, request);
    } catch (error) {
      console.error(`[NOTE_FILES] Chunk upload failed for ${id}#${chunkIndex}:`, error);
      return jsonResponse(
        {
          error: "file_chunk_upload_failed",
          message: "Encrypted file chunk upload failed. Please retry.",
        },
        500,
        request,
      );
    }
  }

  if (noteFileChunkParams && method === "GET") {
    const { id, chunkIndex: chunkIndexRaw } = noteFileChunkParams;
    const chunkIndex = Number(chunkIndexRaw);
    const downloadAttachmentIndex = Number(
      "attachmentIndex" in noteFileChunkParams ? noteFileChunkParams.attachmentIndex : 0,
    );
    if (!isValidNoteId(id) || !Number.isInteger(chunkIndex) || chunkIndex < 0 || chunkIndex > NOTE_FILE_MAX_CHUNK_INDEX) {
      return jsonResponse({ error: "Invalid file chunk" }, 400, request);
    }
    if (!Number.isInteger(downloadAttachmentIndex) || downloadAttachmentIndex < 0) {
      return jsonResponse({ error: "Invalid file chunk" }, 400, request);
    }
    if (!env.NOTE_FILES_R2) {
      return jsonResponse(
        { error: "file_storage_unavailable", message: "Encrypted file storage is not configured." },
        503,
        request,
      );
    }
    const accessError = await requireNoteFileAccess(env, request, id);
    if (accessError) return accessError;
    if (chunkIndex === 0) {
      try {
        await recordSentNoteAttachmentDownloaded(
          env,
          id,
          request,
          async (to, subject, text, html) => {
            const result = await sendEmail(env, { to, subject, text, html });
            if (!result.ok) throw new Error(result.error ?? "Email send failed");
            return result;
          },
        );
      } catch (error) {
        console.warn("[SENT_NOTES] Failed to record attachment download:", error);
      }
    }
    const object = await env.NOTE_FILES_R2.get(
      noteFileChunkObjectKey(id, chunkIndex, downloadAttachmentIndex),
    );
    if (!object) {
      return jsonResponse({ error: "File chunk not found" }, 404, request);
    }
    const headers = new Headers({
      "Content-Type": "application/octet-stream",
      "Cache-Control": "no-store",
    });
    return applyCorsHeaders(new Response(object.body as unknown as BodyInit, { status: 200, headers }), request);
  }

  // Notes API routes (Durable Object authority)
  if (pathname === "/api/notes" && method === "POST") {
    let requestBody: any | null = null;
    let noteForAnalytics: Note | null = null;
    const noteCreationAccount = await noteCreationAccountType(env, request);
    const noteCreationFeatures = planFeaturesFor(noteCreationAccount);
    const noteCreationMaxExpirySeconds = noteCreationFeatures.maxExpirySeconds;
    try {
      requestBody = await request.clone().json();

      // Honeypot: legitimate browsers always send _hp as an empty string.
      // A non-empty value means a bot filled the hidden field.
      if (typeof requestBody?._hp === "string" && requestBody._hp !== "") {
        console.warn("[ROUTES] Honeypot triggered — rejecting bot request");
        // Silently return a fake 200 so bots don't know they were blocked
        return jsonResponse({ id: crypto.randomUUID() }, 200, request);
      }
      const expiryParsed = parseNoteExpirySecondsFromBody(requestBody?.expirySeconds, {
        maxExpirySeconds: noteCreationMaxExpirySeconds,
      });
      const maxReadsParsed = parseMaxReadsFromBody(requestBody?.maxReads, {
        allowedReadCounts: noteCreationFeatures.allowedReadCounts,
      });
      if (requestBody?.content && requestBody?.iv && expiryParsed.ok && maxReadsParsed.ok) {
        noteForAnalytics = {
          id: "pending",
          content: requestBody.content,
          iv: requestBody.iv,
          aad: requestBody?.aad ?? null,
          expiresAt: new Date(Date.now() + expiryParsed.seconds * 1000),
          maxReads: maxReadsParsed.maxReads,
          currentReads: 0,
          createdAt: new Date(),
          isPasswordProtected: !!requestBody?.isPasswordProtected,
          salt: requestBody?.salt ?? null,
          encryptedKey: null,
          encryptedKeyIv: requestBody?.encryptedKeyIv ?? null,
          kdfVersion: null,
          kdfIterations: null,
          kdfPolicyTag: null,
        };
      }
    } catch (error) {
      console.warn("[ROUTES] Skipping analytics for note creation:", error);
    }

    if (typeof requestBody?.content === "string" && requestBody.content.trim()) {
      const contentWire = validateNoteCiphertextWire(
        requestBody.content,
        "content",
        maxNoteCiphertextBase64CharsForAccount(noteCreationAccount),
      );
      if (!contentWire.ok) {
        return jsonResponse(
          {
            error: contentWire.kind === "too_large" ? "note_too_large" : "invalid_content",
            message: contentWire.message,
          },
          contentWire.kind === "too_large" ? 413 : 400,
          request,
        );
      }
    }

    const aiMode = !!requestBody?.aiMode;
    if (aiMode) {
      console.log("[AI] Note creation with AI mode");
      const verificationKv = env.ANALYTICS_KV || env.NOTES_KV;
      const clientId = getClientIdentifier(request);

      if (!env.TURNSTILE_SECRET_KEY) {
        // Turnstile not configured (local dev or no-Turnstile deploy) — skip verification
        console.log("[AI] No TURNSTILE_SECRET_KEY configured; skipping AI note verification");
      } else {
        const challengeRequired = await getTurnstileChallengeRequired(verificationKv, clientId);
        if (!challengeRequired) {
          console.log("[AI] No adaptive Turnstile challenge; skipping verification for AI note");
        } else if (requestBody?.turnstileToken) {
          const isHuman = await verifyTurnstile(requestBody?.turnstileToken, request, env);
          if (!isHuman) {
            console.warn("[AI] Turnstile verification failed for note creation");
            return jsonResponse(
              { error: "Human verification failed", challengeRequired: true },
              403,
              request,
            );
          }
          await setAiVerificationRemaining(verificationKv, clientId, AI_VERIFICATION.USES);
          await clearTurnstileChallengeRequired(verificationKv, clientId);
          console.log("[AI] Turnstile verified for note creation; challenge cleared");
        } else {
          console.warn("[AI] Adaptive challenge active; verification required for note creation");
          return jsonResponse({ error: "Human verification required", challengeRequired: true }, 403, request);
        }
      }
    }

    const requestedId = typeof requestBody?.id === "string" ? requestBody.id : null;
    if (requestedId && !isValidNoteId(requestedId)) {
      return jsonResponse({ error: "Invalid note ID" }, 400, request);
    }

    if (requestedId) {
      const reserved = await hasReservation(env, requestedId);
      if (!reserved) {
        return jsonResponse({ error: "Note ID reservation expired or missing" }, 403, request);
      }
    }

    let attachmentPlaintextBytes: number | null = null;
    const createAttachments: any[] =
      Array.isArray(requestBody?.attachments) && requestBody.attachments.length > 0
        ? requestBody.attachments
        : requestBody?.attachment != null
          ? [requestBody.attachment]
          : [];
    const hasCreateAttachments = createAttachments.length > 0;

    if (requestedId && hasCreateAttachments) {
      const reservation = await getNoteReservationRecord(env, requestedId);
      if (!reservation?.attachmentEncryptedSize || reservation.attachmentPlaintextSize == null) {
        return jsonResponse({ error: "Attachment upload was not initialized" }, 400, request);
      }
      attachmentPlaintextBytes = reservation.attachmentPlaintextSize;
      if (!reservation.fileStorageUserId && !reservation.premiumUserId) {
        return jsonResponse(
          { error: "file_upload_auth_required", message: "Sign in to attach encrypted files." },
          401,
          request,
        );
      }
      const listedEncrypted = createAttachments.reduce(
        (sum, item) => sum + Number(item?.encryptedSize),
        0,
      );
      if (
        !Number.isInteger(listedEncrypted) ||
        listedEncrypted <= 0 ||
        listedEncrypted > reservation.attachmentEncryptedSize
      ) {
        return jsonResponse({ error: "Attachment encrypted size is invalid" }, 400, request);
      }
    }

    const expiryForCreate = parseNoteExpirySecondsFromBody(requestBody?.expirySeconds, {
      maxExpirySeconds: noteCreationMaxExpirySeconds,
    });
    if (!expiryForCreate.ok) {
      return jsonResponse({ error: expiryForCreate.message }, 400, request);
    }

    const maxReadsForCreate = parseMaxReadsFromBody(requestBody?.maxReads, {
      allowedReadCounts: noteCreationFeatures.allowedReadCounts,
    });
    if (!maxReadsForCreate.ok) {
      return jsonResponse({ error: maxReadsForCreate.message }, 400, request);
    }

    const fileAccessWindowForCreate = parseNoteFileAccessWindowFromBody(
      requestBody?.fileAccessWindowSeconds,
      { accountType: noteCreationAccount },
    );
    if (!fileAccessWindowForCreate.ok) {
      return jsonResponse({ error: fileAccessWindowForCreate.message }, 400, request);
    }

    const hasOpensAt =
      requestBody?.opensAt != null &&
      !(typeof requestBody.opensAt === "string" && requestBody.opensAt.trim() === "");
    if (hasOpensAt) {
      if (!noteCreationFeatures.delayedReveal) {
        return jsonResponse(
          {
            error: "premium_required",
            message: "Delayed reveal requires Starter or Business.",
          },
          403,
          request,
        );
      }
      const opensAtParsed = parseNoteOpensAtFromBody(requestBody.opensAt, {
        expiresAt: new Date(Date.now() + expiryForCreate.seconds * 1000),
      });
      if (!opensAtParsed.ok) {
        return jsonResponse({ error: opensAtParsed.message }, 400, request);
      }
    }

    const requireReceiptAck = requestBody?.requireReceiptAck === true;
    const receiptAckTokenHashRaw =
      typeof requestBody?.receiptAckTokenHash === "string"
        ? requestBody.receiptAckTokenHash.trim().toLowerCase()
        : "";
    if (requireReceiptAck) {
      if (!noteCreationFeatures.receiptAcknowledgment) {
        return jsonResponse(
          {
            error: "premium_required",
            message: "Receipt confirmation requires Starter or Business.",
          },
          403,
          request,
        );
      }
      if (!isValidReceiptAckTokenHash(receiptAckTokenHashRaw)) {
        return jsonResponse(
          { error: "receipt_ack_token_hash_required", message: "Invalid receipt acknowledgment token hash." },
          400,
          request,
        );
      }
    }

    // Rejected up front like delayed reveal and receipt confirmation above.
    // Registration happens after the note is stored, so without this check an
    // ineligible or malformed request produced a live link with no gate on it.
    const requireRecipientVerification =
      requestBody?.requireRecipientVerification === true;
    if (requireRecipientVerification) {
      if (!noteCreationFeatures.recipientVerification) {
        return jsonResponse(
          {
            error: "premium_required",
            message: "Recipient verification requires Starter or Business.",
          },
          403,
          request,
        );
      }
      const gateRecipientEmail =
        typeof requestBody?.recipientEmail === "string"
          ? requestBody.recipientEmail.trim().toLowerCase()
          : "";
      if (!isPlausibleEmailFormat(gateRecipientEmail)) {
        return jsonResponse(
          {
            error: "recipient_email_required",
            message: "Recipient verification needs the recipient's email address.",
          },
          400,
          request,
        );
      }
    }
    const customReceiptStatement = normalizeReceiptAckStatement(requestBody?.receiptAckStatement);
    if (requestBody?.receiptAckStatement != null) {
      const creationAccountType = await noteCreationAccountType(env, request);
      if (creationAccountType !== "business_premium" || !requireReceiptAck || !customReceiptStatement) {
        return jsonResponse(
          { error: "business_custom_receipt_required", message: "Custom confirmation statements require Business and receipt confirmation." },
          403,
          request,
        );
      }
      requestBody.receiptAckStatement = customReceiptStatement;
    }
    if (requestBody?.unopenedReminderHours != null) {
      const creationAccountType = await noteCreationAccountType(env, request);
      const reminderHours = Number(requestBody.unopenedReminderHours);
      if (creationAccountType !== "business_premium" || ![24, 48, 72].includes(reminderHours)) {
        return jsonResponse({ error: "invalid_unopened_reminder" }, 403, request);
      }
      requestBody.unopenedReminderHours = reminderHours;
    }

    const id = requestedId || crypto.randomUUID();

    // The browser may only request that branding be applied. The actual public
    // snapshot is always rebuilt from the authenticated Business account.
    if (requestBody?.revealBranding != null) {
      const trustedBranding = await resolveAccountRevealBranding(env, request);
      const createReferrer =
        typeof requestBody?.referrer === "string" ? requestBody.referrer : null;
      if (trustedBranding) {
        requestBody.revealBranding = resolveRevealBrandingForNoteCreate(
          fillRevealBrandingIdentityGaps(
            trustedBranding,
            parseStoredRevealBranding(requestBody.revealBranding),
          ),
          createReferrer,
        );
      } else {
        const session = await getSessionFromRequest(env, request, { rotate: false });
        const parsedClientBranding = parseStoredRevealBranding(requestBody.revealBranding);
        const allowed = session?.id
          ? (await getAccountEntitlements(env, session.id)).capabilities.revealBranding
          : false;
        if (parsedClientBranding && allowed) {
          requestBody.revealBranding = resolveRevealBrandingForNoteCreate(
            parsedClientBranding,
            createReferrer,
          );
        } else delete requestBody.revealBranding;
      }
    }

    if (requestBody?.bodyFont != null) {
      const parsedBodyFont = parseRevealBodyFont(requestBody.bodyFont);
      if (
        parsedBodyFont &&
        mayStoreRevealBodyFont(parsedBodyFont, {
          starter: noteCreationFeatures.revealBodyFont,
          business: noteCreationAccount === "business_premium",
        })
      ) {
        requestBody.bodyFont = parsedBodyFont;
      } else {
        delete requestBody.bodyFont;
      }
    }

    if (requestBody?.attachmentPermission != null) {
      const parsedPermission = parseAttachmentRecipientPermission(requestBody.attachmentPermission);
      if (parsedPermission && noteCreationFeatures.attachmentViewOnly) {
        requestBody.attachmentPermission = parsedPermission;
      } else {
        delete requestBody.attachmentPermission;
      }
    }

    if (hasCreateAttachments) {
      if (!env.NOTE_FILES_R2) {
        return jsonResponse(
          { error: "file_storage_unavailable", message: "Encrypted file storage is not configured." },
          503,
          request,
        );
      }
      const reservation = requestedId ? await getNoteReservationRecord(env, requestedId) : null;
      const contentHashes: unknown[] = Array.isArray(requestBody.attachmentContentHashes)
        ? requestBody.attachmentContentHashes
        : requestBody.attachmentContentHash != null
          ? [requestBody.attachmentContentHash]
          : [];
      if (contentHashes.length !== createAttachments.length) {
        await cleanupNoteFileChunks(env, id, "attachment content hash count mismatch");
        return jsonResponse({ error: "Attachment content hash is required" }, 400, request);
      }
      for (let attachmentIndex = 0; attachmentIndex < createAttachments.length; attachmentIndex += 1) {
        const attachmentMeta = createAttachments[attachmentIndex];
        if (attachmentMeta?.v !== 2) {
          await cleanupNoteFileChunks(env, id, "unsupported attachment version");
          return jsonResponse({ error: "Attachment version is unsupported" }, 400, request);
        }
        const chunks = Array.isArray(attachmentMeta.chunks) ? attachmentMeta.chunks : [];
        const totalChunks = Number(attachmentMeta.totalChunks);
        if (!Number.isInteger(totalChunks) || totalChunks <= 0 || chunks.length !== totalChunks) {
          await cleanupNoteFileChunks(env, id, "invalid attachment chunks");
          return jsonResponse({ error: "Attachment chunks are invalid" }, 400, request);
        }
        let uploadedEncryptedSize = 0;
        for (let index = 0; index < chunks.length; index += 1) {
          const chunk = chunks[index];
          if (
            !chunk ||
            chunk.index !== index ||
            !Number.isInteger(chunk.encryptedSize) ||
            chunk.encryptedSize <= 0
          ) {
            await cleanupNoteFileChunks(env, id, "invalid attachment chunk metadata");
            return jsonResponse({ error: "Attachment chunks are invalid" }, 400, request);
          }
          const uploadedChunk = await env.NOTE_FILES_R2.head(
            noteFileChunkObjectKey(id, index, attachmentIndex),
          );
          if (!uploadedChunk) {
            await cleanupNoteFileChunks(env, id, "missing attachment upload");
            return jsonResponse({ error: "Attachment upload missing" }, 400, request);
          }
          const uploadedChunkSize = Number(
            uploadedChunk.customMetadata?.chunkEncryptedSize ?? uploadedChunk.size ?? NaN,
          );
          if (uploadedChunkSize !== chunk.encryptedSize) {
            await cleanupNoteFileChunks(env, id, "incomplete attachment upload");
            return jsonResponse({ error: "Attachment upload incomplete" }, 400, request);
          }
          const hashKey = uploadedChunkHashKey(index, attachmentIndex);
          const r2ChunkHash =
            uploadedChunk.customMetadata?.chunkSha256 ??
            reservation?.uploadedChunkHashes?.[hashKey];
          if (!r2ChunkHash) {
            await cleanupNoteFileChunks(env, id, "attachment chunk hash missing from R2");
            return jsonResponse({ error: "Attachment upload incomplete" }, 400, request);
          }
          const expectedChunkHash = reservation?.uploadedChunkHashes?.[hashKey] ?? r2ChunkHash;
          if (r2ChunkHash !== expectedChunkHash) {
            await cleanupNoteFileChunks(env, id, "attachment chunk hash mismatch");
            return jsonResponse({ error: "Attachment upload incomplete" }, 400, request);
          }
          uploadedEncryptedSize += chunk.encryptedSize;
        }
        if (uploadedEncryptedSize !== attachmentMeta.encryptedSize) {
          await cleanupNoteFileChunks(env, id, "incomplete attachment upload");
          return jsonResponse({ error: "Attachment upload incomplete" }, 400, request);
        }
        const attachmentContentHash = contentHashes[attachmentIndex];
        if (!isValidAttachmentContentHash(attachmentContentHash)) {
          await cleanupNoteFileChunks(env, id, "missing attachment content hash");
          return jsonResponse({ error: "Attachment content hash is required" }, 400, request);
        }
        const singleChunkReservationHash =
          totalChunks === 1
            ? reservation?.uploadedChunkHashes?.[uploadedChunkHashKey(0, attachmentIndex)]?.toLowerCase()
            : null;
        const expectedContentHash = attachmentContentHash.toLowerCase();
        if (singleChunkReservationHash && singleChunkReservationHash === expectedContentHash) {
          // size-checked on complete; content hash bound here
        } else {
          const computedContentHash = await computeUploadedAttachmentContentHash(
            env,
            id,
            totalChunks,
            attachmentIndex,
          );
          if (!computedContentHash || computedContentHash !== expectedContentHash) {
            await cleanupNoteFileChunks(env, id, "attachment content hash mismatch");
            return jsonResponse({ error: "Attachment content hash mismatch" }, 400, request);
          }
        }
      }
      requestBody.attachments = createAttachments;
      requestBody.attachment = createAttachments[0];
    }

    const stub = getSecureNoteStub(env, id);
    const doUrl = new URL(request.url);
    doUrl.pathname = `/api/notes/${id}`;

    const doResponse = await stub.fetch(
      new Request(doUrl.toString(), {
        method: "POST",
        headers: request.headers,
        body: JSON.stringify(requestBody),
      }) as any,
    );

	    if (doResponse.ok && noteForAnalytics) {
	      noteForAnalytics.id = id;
      const rawReferrer = typeof requestBody?.referrer === "string" ? requestBody.referrer : null;
      const sanitizedReferrer = rawReferrer
        ? rawReferrer.replace(/[^a-zA-Z0-9.\-_ ]/g, "").slice(0, 60).trim() || null
        : null;
      const { country } = getRequestGeo(request);
      const rawLang = typeof requestBody?.uiLanguage === "string" ? requestBody.uiLanguage : null;
      const sanitizedLang = rawLang ? rawLang.replace(/[^a-z-]/g, "").slice(0, 10) || null : null;
      // Accept 'local'/'cloud' strings (new) or boolean true (legacy → defaults to 'cloud')
      const rawAiMode = requestBody?.aiMode;
      const sanitizedAiMode: 'local' | 'cloud' | null = rawAiMode === "local"
        ? "local"
        : rawAiMode === "cloud" || (aiMode && rawAiMode !== "local")
        ? "cloud"
        : null;
      const sanitizedCreationSource = sanitizeNoteCreationSource(requestBody?.creationSource);
      const sanitizedCreationEntryPoint = sanitizeNoteCreationEntryPoint(requestBody?.creationEntryPoint);
      await storage.trackNoteCreation(noteForAnalytics, {
        aiEnhanced: aiMode,
        aiMode: sanitizedAiMode,
        referrer: sanitizedReferrer,
        creationSource: sanitizedCreationSource,
        creationEntryPoint: sanitizedCreationEntryPoint,
        country: country ?? null,
        language: sanitizedLang,
        attachmentPlaintextBytes,
	      });
	    }

	    if (doResponse.ok && requestBody?.attachment != null) {
	      await activateAccountFileStorageReservation(
	        env,
	        id,
	        Number(requestBody.attachment.encryptedSize),
	        Number(requestBody.attachment.totalChunks),
	        maxReadsForCreate.maxReads,
	        fileAccessWindowForCreate.seconds,
	        new Date(Date.now() + expiryForCreate.seconds * 1000).toISOString(),
	      );
	    }

	    if (doResponse.ok && aiMode) {
	      await bumpAiNoteCountAndMaybeChallenge(env, getClientIdentifier(request));
    }

    if (doResponse.ok) {
      const registration = await registerPremiumSentNote(env, request, id, {
        notifyOnOpen: requestBody?.notifyOnOpen === true,
        notifyOnDestroyed: requestBody?.notifyOnDestroyed === true,
        notifyOnAttachmentDownload: requestBody?.notifyOnAttachmentDownload === true,
        requireRecipientVerification,
        requireReceiptAck: requestBody?.requireReceiptAck === true,
        receiptAckTokenHash:
          typeof requestBody?.receiptAckTokenHash === "string"
            ? requestBody.receiptAckTokenHash.trim().toLowerCase()
            : null,
        receiptAckStatement:
          typeof requestBody?.receiptAckStatement === "string"
            ? requestBody.receiptAckStatement
            : null,
        unopenedReminderHours:
          typeof requestBody?.unopenedReminderHours === "number"
            ? requestBody.unopenedReminderHours
            : null,
        recipientEmail:
          typeof requestBody?.recipientEmail === "string" ? requestBody.recipientEmail : null,
        alertNotifyAccountEmail: requestBody?.alertNotifyAccountEmail !== false,
        alertCustomEmail:
          typeof requestBody?.alertCustomEmail === "string" ? requestBody.alertCustomEmail : null,
        label: typeof requestBody?.label === "string" ? requestBody.label : null,
        expiresAt: noteForAnalytics?.expiresAt.toISOString() ?? null,
      });

      if (registration.recipientGateRequired && !registration.recipientGateApplied) {
        return discardUngatedNote(env, request, id, {
          hasAttachment: requestBody?.attachment != null,
          reservationId: requestedId,
          failureReason: registration.failureReason,
        });
      }

      const activitySession = await getSessionFromRequest(env, request, { rotate: false });
      if (activitySession?.id) {
        const rawAiMode = requestBody?.aiMode;
        const activityAiMode: "local" | "cloud" | null =
          rawAiMode === "local"
            ? "local"
            : rawAiMode === "cloud" || (aiMode && rawAiMode !== "local")
              ? "cloud"
              : null;
        await recordNoteCreatedActivity(env, activitySession.id, id, {
          aiEnhanced: aiMode,
          aiMode: activityAiMode,
          hasAttachment: requestBody?.attachment != null,
          hasVoiceMessage: requestBody?.hasVoiceMessage === true && requestBody?.attachment != null,
          passwordProtected: requestBody?.isPasswordProtected === true,
          maxReads: maxReadsForCreate.maxReads,
          expirySeconds: expiryForCreate.seconds,
          notifyOnOpen: requestBody?.notifyOnOpen === true,
          notifyOnDestroyed: requestBody?.notifyOnDestroyed === true,
          notifyOnAttachmentDownload: requestBody?.notifyOnAttachmentDownload === true,
          requireRecipientVerification,
          requireReceiptAck: requireReceiptAck,
        });
      }
    }

	    if (doResponse.ok && requestedId) {
	      await clearReservation(env, requestedId);
	    }

	    if (!doResponse.ok && requestBody?.attachment != null) {
	      await cleanupNoteFileChunks(env, id, `note create failed with ${doResponse.status}`);
	    }

	    return applyCorsHeaders(doResponse as unknown as Response, request);
	  }

  const deliverLinkParams = parsePathParams(pathname, "/api/notes/:id/deliver-link");
  if (deliverLinkParams && method === "POST") {
    const { id } = deliverLinkParams;
    if (!isValidNoteId(id)) {
      return jsonResponse({ error: "Invalid note ID" }, 400, request);
    }
    if (!env.AUTH_DB) {
      return jsonResponse({ error: "Auth database not configured" }, 501, request);
    }
    const session = await getSessionFromRequest(env, request, { rotate: false });
    if (!session?.id) {
      return jsonResponse({ error: "Unauthorized" }, 401, request);
    }

    const user = await env.AUTH_DB.prepare(
      "SELECT email, email_verified, account_type, plan FROM users WHERE id = ? LIMIT 1",
    )
      .bind(session.id)
      .first<{
        email: string | null;
        email_verified: number | null;
        account_type: string | null;
        plan: string | null;
      }>();
    if (!user) {
      return jsonResponse({ error: "Unauthorized" }, 401, request);
    }
    const capabilities = planFeaturesFor(user.account_type ?? user.plan);
    if (!capabilities.recipientLinkDelivery) {
      return jsonResponse({ error: "premium_required" }, 403, request);
    }
    if (user.email_verified !== 1) {
      return jsonResponse({ error: "sender_email_unverified" }, 403, request);
    }

    const deliverLimit = await checkRateLimit(
      env,
      session.id,
      RATE_LIMIT_DELIVER_NOTE_LINK,
    );
    if (!deliverLimit.allowed) {
      return jsonResponse({ error: "rate_limited" }, 429, request);
    }

    let body: { recipientEmail?: unknown; noteUrl?: unknown } = {};
    try {
      body = (await request.json()) as { recipientEmail?: unknown; noteUrl?: unknown };
    } catch {
      return jsonResponse({ error: "Invalid JSON" }, 400, request);
    }

    const recipientEmail =
      typeof body.recipientEmail === "string" ? body.recipientEmail.trim().toLowerCase() : "";
    if (!isPlausibleEmailFormat(recipientEmail)) {
      return jsonResponse({ error: "invalid_recipient_email" }, 400, request);
    }

    const allowedHosts = new Set<string>([
      ...PAGES_PRODUCTION_WEB_HOSTS,
      ...STAGING_CUSTOM_APP_HOSTS,
      "privatenote.ai",
      "www.privatenote.ai",
      "app.privatenote.ai",
      "localhost",
      "127.0.0.1",
    ]);
    for (const origin of ALLOWED_ORIGINS) {
      try {
        allowedHosts.add(new URL(origin).hostname.toLowerCase());
      } catch {
        /* ignore */
      }
    }

    const noteUrl = typeof body.noteUrl === "string" ? body.noteUrl : "";
    const parsedUrl = parseDeliverableNoteUrl(noteUrl, id, { allowedHosts });
    if (!parsedUrl.ok) {
      return jsonResponse({ error: parsedUrl.error }, 400, request);
    }

    const mail = buildRecipientNoteLinkEmail({
      noteUrl: parsedUrl.href,
      senderEmail: user.email,
    });
    const emailResult = await sendEmail(env, {
      to: recipientEmail,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
    });
    if (!emailResult.ok) {
      console.warn(
        `[DELIVER_LINK] Failed to email recipient=${maskEmailForLog(recipientEmail)} noteId=${id}: ${emailResult.error}`,
      );
      return jsonResponse({ error: "email_send_failed" }, 502, request);
    }

    console.log(
      `[DELIVER_LINK] Sent note link email recipient=${maskEmailForLog(recipientEmail)} noteId=${id}`,
    );

    // Ensure the note is tracked so Premium can revoke it from Notification Center.
    try {
      const existing = await getSentNoteByNoteId(env, id);
      if (!existing) {
        await insertSentNote(env, {
          userId: session.id,
          noteId: id,
          notifyOnOpen: false,
          notifyOnDestroyed: false,
          requireRecipientVerification: false,
          proofEnabled: true,
        });
      }
    } catch (error) {
      console.warn(`[DELIVER_LINK] Failed to register sent-note tracking for ${id}:`, error);
    }

    return jsonResponse({ ok: true }, 200, request);
  }

  const recipientGateParams = parsePathParams(pathname, "/api/notes/:id/recipient-gate");
  if (recipientGateParams && method === "GET") {
    const { id } = recipientGateParams;
    if (!isValidNoteId(id)) {
      return jsonResponse({ error: "Invalid note ID" }, 400, request);
    }
    const status = await getRecipientGateStatus(env, id);
    const verified = status.required ? await isRecipientVerified(env, id, request) : true;
    return jsonResponse({ ...status, verified }, 200, request);
  }

  const recipientSendCodeParams = parsePathParams(pathname, "/api/notes/:id/recipient-send-code");
  if (recipientSendCodeParams && method === "POST") {
    const { id } = recipientSendCodeParams;
    if (!isValidNoteId(id)) {
      return jsonResponse({ error: "Invalid note ID" }, 400, request);
    }
    const clientId = getClientIdentifier(request);
    const sendLimit = await checkRateLimit(
      env,
      `${id}:${clientId}`,
      RATE_LIMIT_RECIPIENT_SEND_CODE,
    );
    if (!sendLimit.allowed) {
      return jsonResponse(
        {
          error: "recipient_send_code_rate_limited",
          message: `Too many code requests. Please try again in ${sendLimit.resetAt - Math.floor(Date.now() / 1000)} seconds.`,
          resetAt: sendLimit.resetAt,
        },
        429,
        request,
      );
    }

    const result = await sendRecipientVerificationCode(
      env,
      id,
      async (to, subject, text, html) => {
        const emailResult = await sendEmail(env, { to, subject, text, html });
        if (!emailResult.ok) {
          throw new Error(emailResult.error || "send_failed");
        }
      },
      { webOrigin: getMagicLinkOrigin(env, request) },
    );
    if (!result.ok) {
      if (result.error === "cooldown") {
        return jsonResponse(
          {
            error: "cooldown",
            message: `Please wait ${result.retryAfterSeconds ?? 60} seconds before requesting another code.`,
            retryAfterSeconds: result.retryAfterSeconds ?? 60,
          },
          429,
          request,
        );
      }
      if (result.error === "send_failed") {
        return jsonResponse(
          {
            error: "send_failed",
            message: "Could not send the verification code. Please try again.",
          },
          502,
          request,
        );
      }
      return jsonResponse(
        {
          error: result.error,
          message: "Recipient verification is not available for this note.",
        },
        400,
        request,
      );
    }
    return jsonResponse({ ok: true, emailHint: result.emailHint }, 200, request);
  }

  const recipientVerifyParams = parsePathParams(pathname, "/api/notes/:id/recipient-verify");
  if (recipientVerifyParams && method === "POST") {
    const { id } = recipientVerifyParams;
    if (!isValidNoteId(id)) {
      return jsonResponse({ error: "Invalid note ID" }, 400, request);
    }
    let body: { code?: unknown } = {};
    try {
      body = (await request.json()) as { code?: unknown };
    } catch {
      return jsonResponse({ error: "Invalid JSON" }, 400, request);
    }
    const clientId = getClientIdentifier(request);
    const verifyLimit = await checkRateLimit(
      env,
      `${id}:${clientId}`,
      RATE_LIMIT_RECIPIENT_VERIFY,
    );
    if (!verifyLimit.allowed) {
      await logAuditEvent(env, {
        userId: null,
        eventType: "recipient_verification_rate_limited",
        status: "warning",
        details: {
          noteId: id,
          resetAt: verifyLimit.resetAt,
        },
        ip: getRequestIp(request),
        userAgent: request.headers.get("User-Agent"),
      });
      return jsonResponse(
        {
          error: "recipient_verification_rate_limited",
          message: `Too many verification attempts. Please try again in ${verifyLimit.resetAt - Math.floor(Date.now() / 1000)} seconds.`,
          resetAt: verifyLimit.resetAt,
        },
        429,
        request,
      );
    }

    const result = await verifyRecipientAccess(env, id, {
      code: typeof body.code === "string" ? body.code : undefined,
    });
    if (!result.ok) {
      const usedAttempts = RATE_LIMIT_RECIPIENT_VERIFY.MAX_REQUESTS - verifyLimit.remaining;
      await logAuditEvent(env, {
        userId: null,
        eventType: "recipient_verification_failed",
        status: "failure",
        details: {
          noteId: id,
          reason: result.error,
          attemptsRemaining: verifyLimit.remaining,
        },
        ip: getRequestIp(request),
        userAgent: request.headers.get("User-Agent"),
      });
      await recipientVerificationFailureDelay(usedAttempts);
      const message =
        result.error === "invalid_code"
          ? "Invalid verification code."
          : result.error === "code_required"
            ? "Verification code is required."
            : result.error === "code_not_sent"
              ? "Request a verification code first."
              : "Recipient verification is not available for this note.";
      return jsonResponse({ error: result.error, message }, 400, request);
    }
    await logAuditEvent(env, {
      userId: null,
      eventType: "recipient_verification_success",
      status: "success",
      details: { noteId: id },
      ip: getRequestIp(request),
      userAgent: request.headers.get("User-Agent"),
    });
    const response = jsonResponse({ ok: true }, 200, request);
    response.headers.append(
      "Set-Cookie",
      recipientVerifiedCookieHeader(id, result.setCookie, request),
    );
    return response;
  }

  const receiptAckParams = parsePathParams(pathname, "/api/notes/:id/acknowledge-receipt");
  if (receiptAckParams && method === "POST") {
    const { id } = receiptAckParams;
    if (!isValidNoteId(id)) {
      return jsonResponse({ error: "Invalid note ID" }, 400, request);
    }
    const clientId = getClientIdentifier(request);
    const ackLimit = await checkRateLimit(env, `${clientId}:receipt-ack:${id}`, RATE_LIMIT_RECEIPT_ACK);
    if (!ackLimit.allowed) {
      return jsonResponse(
        {
          error: "Rate limit exceeded",
          message: `Too many receipt confirmation attempts. Please try again in ${ackLimit.resetAt - Math.floor(Date.now() / 1000)} seconds.`,
          resetAt: ackLimit.resetAt,
        },
        429,
        request,
      );
    }

    let body: { ackToken?: unknown } = {};
    try {
      body = (await request.json()) as { ackToken?: unknown };
    } catch {
      return jsonResponse({ error: "invalid_json" }, 400, request);
    }
    const ackToken = typeof body.ackToken === "string" ? body.ackToken.trim().toLowerCase() : "";
    const result = await acknowledgeSentNoteReceipt(
      env,
      id,
      ackToken,
      request,
      async (to, subject, text, html) => {
        const emailResult = await sendEmail(env, { to, subject, text, html });
        if (!emailResult.ok) throw new Error(emailResult.error ?? "Email send failed");
        return emailResult;
      },
    );
    if (!result.ok) {
      const status =
        result.error === "not_found"
          ? 404
          : result.error === "not_configured"
            ? 501
            : result.error === "not_required"
              ? 400
              : 403;
      return jsonResponse({ error: result.error }, status, request);
    }
    return jsonResponse(
      {
        ok: true,
        alreadyConfirmed: result.alreadyConfirmed,
        acknowledgedAt: result.acknowledgedAt,
      },
      200,
      request,
    );
  }

  const noteRevealParams = parsePathParams(pathname, "/api/notes/:id/reveal");
  if (noteRevealParams && method === "POST") {
    const { id } = noteRevealParams;
    const clientId = getClientIdentifier(request);
    const revealKey = `${clientId}:reveal:${id}`;
    const revealLimit = await checkRateLimit(env, revealKey, RATE_LIMIT_REVEAL);

    if (!revealLimit.allowed) {
      const challengeKv = env.ANALYTICS_KV || env.NOTES_KV;
      await setTurnstileChallengeRequired(challengeKv, clientId);
      return jsonResponse({
        error: 'Rate limit exceeded',
        message: `Too many reveal attempts. Please try again in ${revealLimit.resetAt - Math.floor(Date.now() / 1000)} seconds.`,
        resetAt: revealLimit.resetAt,
      }, 429, request);
    }

    if (await noteRequiresRecipientVerification(env, id)) {
      const verified = await isRecipientVerified(env, id, request);
      if (!verified) {
        return jsonResponse(
          {
            error: "recipient_verification_required",
            message: "Recipient verification is required before this note can be revealed.",
          },
          403,
          request,
        );
      }
    }

    const stub = getSecureNoteStub(env, id);
    let doResponse = await stub.fetch(request as any);

    if (!doResponse.ok) {
      let errorBodyPreview = "";
      try {
        errorBodyPreview = (await doResponse.clone().text()).slice(0, 500);
      } catch {
        // ignore
      }
      console.warn(
        JSON.stringify({
          event: "note_reveal_failed",
          noteId: id,
          httpStatus: doResponse.status,
          errorBodyPreview,
        }),
      );
    }

    if (doResponse.ok) {
      let noteDestroyed = false;
      try {
        type RevealJson = {
          content?: string;
          iv?: string;
          aad?: string | null;
          attachment?: unknown;
          expiresAt?: string;
          maxReads?: number;
          readCount?: number;
          isPasswordProtected?: boolean;
          salt?: string | null;
          encryptedKeyIv?: string | null;
        };
        const data = (await doResponse.clone().json()) as RevealJson;
        // Note is "destroyed" when it has been read the maximum number of times
        const maxReads = data.maxReads ?? 0;
        const readCount = data.readCount ?? 0;
        const destroyed = maxReads > 0 && readCount >= maxReads;
        noteDestroyed = destroyed;
        const noteForAnalytics: Note = {
          id,
          content: data.content ?? "",
          iv: data.iv ?? "",
          aad: data.aad ?? null,
          expiresAt: new Date(data.expiresAt ?? Date.now()),
          maxReads,
          currentReads: readCount,
          createdAt: new Date(),
          isPasswordProtected: !!data.isPasswordProtected,
          salt: data.salt ?? null,
          encryptedKey: null,
          encryptedKeyIv: data.encryptedKeyIv ?? null,
          kdfVersion: null,
          kdfIterations: null,
          kdfPolicyTag: null,
        };
        await storage.trackNoteView(noteForAnalytics, destroyed);
      } catch (error) {
        console.warn("[ROUTES] Skipping analytics for note reveal:", error);
      }
      try {
        await recordSentNoteOpened(
          env,
          id,
          request,
          async (to, subject, text, html) => {
            const result = await sendEmail(env, { to, subject, text, html });
            if (!result.ok) throw new Error(result.error ?? "Email send failed");
            return result;
          },
          noteDestroyed,
        );
      } catch (error) {
        console.warn("[SENT_NOTES] Failed to process sent-note lifecycle:", error);
      }
      try {
        const data = (await doResponse.clone().json()) as {
          attachment?: unknown;
          fileAccessWindowSeconds?: unknown;
        };
        if (data.attachment != null) {
          const fileAccessTokenExpiresIn = isNoteFileAccessWindowSeconds(data.fileAccessWindowSeconds)
            ? data.fileAccessWindowSeconds
            : NOTE_FILE_ACCESS_DEFAULT_SECONDS;
          const fileAccessToken = await issueNoteFileAccessToken(env, id, fileAccessTokenExpiresIn);
          doResponse = jsonResponse(
            {
              ...data,
              fileAccessToken,
              fileAccessTokenExpiresIn,
            },
            doResponse.status,
            request,
          ) as unknown as typeof doResponse;
        }
      } catch (error) {
        console.warn("[ROUTES] Failed to issue file access token:", error);
      }
      try {
        const sent = await getSentNoteByNoteId(env, id);
        if (sent?.require_receipt_ack === 1) {
          const data = (await doResponse.clone().json()) as Record<string, unknown>;
          doResponse = jsonResponse(
            {
              ...data,
              receiptAck: {
                required: true,
                acknowledged: Boolean(sent.receipt_acknowledged_at),
                acknowledgedAt: sent.receipt_acknowledged_at,
                statement: sent.receipt_ack_statement,
                statementId: sent.receipt_ack_statement_id,
              },
            },
            doResponse.status,
            request,
          ) as unknown as typeof doResponse;
        }
      } catch (error) {
        console.warn("[ROUTES] Failed to attach receipt-ack metadata:", error);
      }
    } else if (doResponse.status === 404) {
      // Note not found — expired, exhausted, or never existed
      await cleanupNoteFileChunks(env, id, "reveal returned 404");
      storage.trackNoteRevealFailed().catch(() => {});
    }

    return applyCorsHeaders(doResponse as unknown as Response, request);
  }

  const revokeNoteParams = parsePathParams(pathname, "/api/notes/:id/revoke");
  if (revokeNoteParams && method === "POST") {
    const { id } = revokeNoteParams;
    if (!isValidNoteId(id)) {
      return jsonResponse({ error: "Invalid note ID" }, 400, request);
    }
    if (!env.AUTH_DB) {
      return jsonResponse({ error: "Auth database not configured" }, 501, request);
    }
    const session = await getSessionFromRequest(env, request, { rotate: false });
    if (!session?.id) {
      return jsonResponse({ error: "Unauthorized" }, 401, request);
    }

    const accountType = await noteCreationAccountType(env, request);
    if (!planFeaturesFor(accountType).revokeUnopened) {
      return jsonResponse({ error: "premium_required" }, 403, request);
    }

    const revoked = await revokeSentNote(env, session.id, id);
    if (!revoked.ok) {
      if (revoked.error === "already_opened") {
        return jsonResponse({ error: "already_opened" }, 409, request);
      }
      if (revoked.error === "not_configured") {
        return jsonResponse({ error: "Auth database not configured" }, 501, request);
      }
      return jsonResponse({ error: "not_found" }, 404, request);
    }

    try {
      const stub = getSecureNoteStub(env, id);
      const deleteRequest = new Request(new URL(`/api/notes/${id}`, request.url).toString(), {
        method: "DELETE",
      });
      const doResponse = await stub.fetch(deleteRequest as any);
      if (doResponse.ok || doResponse.status === 404) {
        await cleanupNoteFileChunks(env, id, `note revoked (${doResponse.status})`);
        await clearRecipientGate(env, id);
      } else {
        console.warn(`[REVOKE] DO delete returned ${doResponse.status} for note ${id}`);
      }
    } catch (error) {
      console.warn(`[REVOKE] Failed to purge note ciphertext for ${id}:`, error);
    }

    return jsonResponse({ ok: true }, 200, request);
  }

  const noteSenderStatusParams = parsePathParams(pathname, "/api/notes/:id/sender-status");
  if (noteSenderStatusParams && method === "GET") {
    const { id } = noteSenderStatusParams;
    if (!isValidNoteId(id)) {
      return jsonResponse({ error: "Invalid note id" }, 400, request);
    }
    if (!env.AUTH_DB) {
      return jsonResponse({ error: "sent_note_status_unavailable" }, 503, request);
    }
    const session = await getSessionFromRequest(env, request, { rotate: false });
    if (!session?.id) {
      return jsonResponse({ error: "Authentication required" }, 401, request);
    }
    const row = await getSentNoteByNoteId(env, id);
    if (!row || row.user_id !== session.id) {
      return jsonResponse({ error: "Not found" }, 404, request);
    }
    return jsonResponse(
      {
        ok: true,
        status: {
          noteId: row.note_id,
          status: row.status,
          createdAt: row.created_at,
          openedAt: row.opened_at,
          attachmentDownloadedAt: row.attachment_downloaded_at,
          receiptAcknowledgedAt: row.receipt_acknowledged_at,
          requireReceiptAck: row.require_receipt_ack === 1,
          expiresAt: row.expires_at,
          destroyedAt: row.destroyed_at,
          revokedAt: row.revoked_at,
        },
      },
      200,
      request,
    );
  }

  const noteParams = parsePathParams(pathname, "/api/notes/:id");
  if (noteParams && (method === "GET" || method === "DELETE")) {
    const { id } = noteParams;
    const stub = getSecureNoteStub(env, id);
    const doResponse = await stub.fetch(request as any);
    if (method === "DELETE" && (doResponse.ok || doResponse.status === 404)) {
      await cleanupNoteFileChunks(env, id, `note delete returned ${doResponse.status}`);
      try {
        const session = await getSessionFromRequest(env, request, { rotate: false });
        if (session?.id) {
          await revokeSentNote(env, session.id, id);
        }
      } catch (error) {
        console.warn("[SENT_NOTES] Failed to revoke sent-note record after delete:", error);
      }
    }
    return applyCorsHeaders(doResponse as unknown as Response, request);
  }

  // Blog API routes - Public
  if (pathname === "/api/blog" && method === "GET") {
    try {
      // Only get published posts for public endpoint
      const posts = await storage.getBlogPosts(false);
      return jsonResponse(posts, 200, request);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      return jsonResponse({ message: "Failed to fetch blog posts" }, 500, request);
    }
  }

  // GET /api/blog/:slug
  const blogSlugParams = parsePathParams(pathname, "/api/blog/:slug");
  if (blogSlugParams && method === "GET") {
    try {
      const { slug } = blogSlugParams;
      const post = await storage.getBlogPostBySlug(slug);

      if (!post) {
        return jsonResponse({ message: "Blog post not found" }, 404, request);
      }

      // Only return published posts to the public
      if (!post.published) {
        return jsonResponse({ message: "Blog post not found" }, 404, request);
      }

      // Track blog post view in analytics
      await storage.trackBlogView(post.slug);

      return jsonResponse(post, 200, request);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      return jsonResponse({ message: "Failed to fetch blog post" }, 500, request);
    }
  }

  // ============================================================================
  // ADMIN: AUTH (HttpOnly cookie exchange)
  // ============================================================================

  // Lightweight endpoint for client-side analytics events that can't be tracked server-side.
  // No auth required — only accepts a fixed allow-list of event types.
  if (pathname === "/api/analytics/event" && method === "POST") {
    try {
      // text/plain sendBeacon and application/json fetch both land here as JSON text.
      const body = (await readJsonBody(request)) as Record<string, unknown>;
      const engagement = parsePageEngagementFlush(body);
      if (engagement) {
        scheduleAnalyticsWork(ctx, storage.trackPageEngagement(engagement));
        return jsonResponse({ ok: true }, 200, request);
      }
      const allowed = ["wrong_password", "qr_share"] as const;
      type AllowedEvent = typeof allowed[number];
      const event = typeof body?.event === "string" && (allowed as readonly string[]).includes(body.event)
        ? (body.event as AllowedEvent)
        : null;
      if (event) {
        scheduleAnalyticsWork(ctx, storage.trackClientEvent(event));
        return jsonResponse({ ok: true }, 200, request);
      }
      const pageAllowed = ["file-share", "password-share"] as const;
      type AllowedPage = typeof pageAllowed[number];
      const page = typeof body?.page === "string" && (pageAllowed as readonly string[]).includes(body.page)
        ? (body.page as AllowedPage)
        : null;
      if (page) {
        scheduleAnalyticsWork(ctx, storage.trackPageView(page));
        return jsonResponse({ ok: true }, 200, request);
      }
      return jsonResponse({ message: "Invalid event type" }, 400, request);
    } catch {
      return jsonResponse({ message: "Bad request" }, 400, request);
    }
  }

  // Returns whether TOTP is required, so the login form can show the extra field.
  if (pathname === "/api/admin/auth/config" && method === "GET") {
    return jsonResponse({
      totpRequired: Boolean(env.ADMIN_TOTP_SECRET),
    }, 200, request);
  }

  // Returns an otpauth:// URI for initial authenticator app setup.
  // Requires the raw ADMIN_TOKEN via X-Admin-Token header (no cookie yet).
  if (pathname === "/api/admin/auth/totp-setup" && method === "GET") {
    const expected = env.ADMIN_TOKEN;
    const headerToken = request.headers.get("x-admin-token");
    if (!expected || !headerToken || !constantTimeEquals(headerToken, expected)) {
      return jsonResponse({ message: "Unauthorized" }, 401, request);
    }
    const secret = env.ADMIN_TOTP_SECRET;
    if (!secret) {
      return jsonResponse({ message: "ADMIN_TOTP_SECRET is not configured" }, 404, request);
    }
    const totp = createTotpInstance(secret, "admin");
    return jsonResponse({ uri: totp.toString() }, 200, request);
  }

  if (pathname === "/api/admin/auth" && method === "POST") {
    let body: any;
    try { body = await request.json(); } catch { body = {}; }
    const expected = env.ADMIN_TOKEN;
    if (!expected || typeof expected !== "string") {
      return jsonResponse({ message: "Admin not configured" }, 501, request);
    }
    const provided = typeof body?.token === "string" ? body.token : "";
    if (!provided || !constantTimeEquals(provided, expected)) {
      return jsonResponse({ message: "Invalid admin token" }, 401, request);
    }

    // Second factor: verify TOTP code when ADMIN_TOTP_SECRET is configured.
    if (env.ADMIN_TOTP_SECRET) {
      const totpCode = typeof body?.totpCode === "string" ? body.totpCode.replace(/\s/g, "") : "";
      if (!totpCode) {
        return jsonResponse({ message: "TOTP code required", totpRequired: true }, 401, request);
      }
      const valid = verifyTotpCode(env.ADMIN_TOTP_SECRET, totpCode, "admin");
      if (!valid) {
        return jsonResponse({ message: "Invalid TOTP code", totpRequired: true }, 401, request);
      }
    }

    const kv = getAuthKv(env);
    if (!kv) {
      return jsonResponse({ message: "Admin session storage is unavailable" }, 503, request);
    }
    const sessionId = await createAdminSession(kv, expected);
    const headers = new Headers(getCorsHeaders(request));
    headers.set("Content-Type", "application/json");
    headers.set("Set-Cookie", adminSessionCookie(sessionId));
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
  }

  if (pathname === "/api/admin/logout" && method === "POST") {
    const cookies = parseCookies(request.headers.get("Cookie"));
    const sessionId = cookies[ADMIN_SESSION_COOKIE_NAME];
    const kv = getAuthKv(env);
    if (sessionId && kv) {
      await revokeAdminSession(kv, sessionId);
    }
    const headers = new Headers(getCorsHeaders(request));
    headers.set("Content-Type", "application/json");
    headers.set("Set-Cookie", clearAdminSessionCookie());
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
  }

  if (pathname === "/api/admin/health/auth" && method === "GET") {
    const authError = await requireAdmin(request, env);
    if (authError) return authError;

    const magic = getMagicLinkIssuanceDiagnostics(env, request);
    const payload = {
      ok: magic.endToEndReady,
      magicLink: magic,
      monitoring: {
        summary:
          "magic/send returns generic 200 on storage/email failures for anti-enumeration; rely on health checks, audit_log, and worker logs.",
        suggestedProbes: [
          "GET /api/admin/health/auth — alert when HTTP status ≠ 200 or magicLink.endToEndReady is false.",
        ],
        auditLogSignals: [
          "magic_link_failed with auth_secret_key_missing or auth_kv_missing",
          "magic_link_email_failed (spike or sustained failures)",
        ],
        logPatterns: [
          "[MAGIC_LINK] storeMagicLink failed",
          "[MAGIC_LINK] Resend did not send email",
          "[MAGIC_LINK] Not sending email: Turnstile is required",
          "[MAGIC_LINK] Not sending email: Turnstile siteverify failed",
        ],
        turnstileNote: magic.turnstileSecretConfigured
          ? "TURNSTILE_SECRET_KEY is set: magic/send requires a valid body.turnstileToken or the worker skips Resend (still HTTP 200). Set VITE_TURNSTILE_SITE_KEY on the Pages production build, redeploy, and allow your production hostname in the Turnstile widget."
          : "TURNSTILE_SECRET_KEY unset: magic/send does not require Turnstile.",
      },
    };
    const status = magic.endToEndReady ? 200 : 503;
    return jsonResponse(payload, status, request);
  }

  // ============================================================================
  // ADMIN: AUDIT LOG ENDPOINTS
  // ============================================================================

  // GET /api/admin/audit-logs - Query audit logs with filtering
  if (pathname === "/api/admin/audit-logs" && method === "GET") {
    const authError = await requireAdmin(request, env);
    if (authError) return authError;

    if (!env.AUTH_DB) {
      return jsonResponse({ message: "AUTH_DB not configured" }, 501, request);
    }

    try {
      // Query parameters for filtering
      const limit = Math.min(parseInt(url.searchParams.get("limit") || "100", 10), 500);
      const offset = parseInt(url.searchParams.get("offset") || "0", 10);
      const eventType = url.searchParams.get("eventType"); // e.g., "login_failed"
      const status = url.searchParams.get("status"); // success, failure, warning
      const userId = url.searchParams.get("userId");
      const startDate = url.searchParams.get("startDate"); // ISO date
      const endDate = url.searchParams.get("endDate"); // ISO date
      const ip = url.searchParams.get("ip");

      // Build dynamic query
      let query = "SELECT * FROM audit_log WHERE 1=1";
      const params: (string | number)[] = [];

      if (eventType) {
        query += " AND event_type = ?";
        params.push(eventType);
      }
      if (status) {
        query += " AND event_status = ?";
        params.push(status);
      }
      if (userId) {
        query += " AND user_id = ?";
        params.push(userId);
      }
      if (startDate) {
        query += " AND created_at >= ?";
        params.push(startDate);
      }
      if (endDate) {
        query += " AND created_at <= ?";
        params.push(endDate);
      }
      if (ip) {
        query += " AND ip = ?";
        params.push(ip);
      }

      query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
      params.push(limit, offset);

      const stmt = env.AUTH_DB.prepare(query);
      const results = await stmt.bind(...params).all<{
        id: string;
        user_id: string | null;
        event_type: string;
        event_status: string;
        details: string | null;
        ip: string | null;
        user_agent: string | null;
        created_at: string;
      }>();

      // Get total count for pagination
      let countQuery = "SELECT COUNT(*) as total FROM audit_log WHERE 1=1";
      const countParams: (string | number)[] = [];

      if (eventType) {
        countQuery += " AND event_type = ?";
        countParams.push(eventType);
      }
      if (status) {
        countQuery += " AND event_status = ?";
        countParams.push(status);
      }
      if (userId) {
        countQuery += " AND user_id = ?";
        countParams.push(userId);
      }
      if (startDate) {
        countQuery += " AND created_at >= ?";
        countParams.push(startDate);
      }
      if (endDate) {
        countQuery += " AND created_at <= ?";
        countParams.push(endDate);
      }
      if (ip) {
        countQuery += " AND ip = ?";
        countParams.push(ip);
      }

      const countStmt = env.AUTH_DB.prepare(countQuery);
      const countResult = await countStmt.bind(...countParams).first<{ total: number }>();

      // Parse details JSON for each result
      const logs = (results.results || []).map((row) => ({
        ...row,
        details: row.details ? JSON.parse(row.details) : null,
      }));

      return jsonResponse({
        ok: true,
        logs,
        pagination: {
          total: countResult?.total || 0,
          limit,
          offset,
          hasMore: offset + logs.length < (countResult?.total || 0),
        },
      }, 200, request);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      return jsonResponse({ message: "Failed to fetch audit logs" }, 500, request);
    }
  }

  // GET /api/admin/audit-logs/stats - Get audit log statistics
  if (pathname === "/api/admin/audit-logs/stats" && method === "GET") {
    const authError = await requireAdmin(request, env);
    if (authError) return authError;

    if (!env.AUTH_DB) {
      return jsonResponse({ message: "AUTH_DB not configured" }, 501, request);
    }

    try {
      const days = parseInt(url.searchParams.get("days") || "7", 10);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      const cutoffIso = cutoffDate.toISOString();

      // Get event type counts
      const eventTypeCounts = await env.AUTH_DB.prepare(
        `SELECT event_type, event_status, COUNT(*) as count 
         FROM audit_log 
         WHERE created_at >= ? 
         GROUP BY event_type, event_status 
         ORDER BY count DESC`
      )
        .bind(cutoffIso)
        .all<{ event_type: string; event_status: string; count: number }>();

      // Get daily counts
      const dailyCounts = await env.AUTH_DB.prepare(
        `SELECT DATE(created_at) as date, COUNT(*) as count 
         FROM audit_log 
         WHERE created_at >= ? 
         GROUP BY DATE(created_at) 
         ORDER BY date DESC`
      )
        .bind(cutoffIso)
        .all<{ date: string; count: number }>();

      // Get top IPs with failures
      const topFailureIps = await env.AUTH_DB.prepare(
        `SELECT ip, COUNT(*) as count 
         FROM audit_log 
         WHERE created_at >= ? AND event_status = 'failure' AND ip IS NOT NULL
         GROUP BY ip 
         ORDER BY count DESC 
         LIMIT 10`
      )
        .bind(cutoffIso)
        .all<{ ip: string; count: number }>();

      // Get total counts
      const totalStats = await env.AUTH_DB.prepare(
        `SELECT 
           COUNT(*) as total,
           SUM(CASE WHEN event_status = 'success' THEN 1 ELSE 0 END) as successes,
           SUM(CASE WHEN event_status = 'failure' THEN 1 ELSE 0 END) as failures,
           SUM(CASE WHEN event_status = 'warning' THEN 1 ELSE 0 END) as warnings
         FROM audit_log 
         WHERE created_at >= ?`
      )
        .bind(cutoffIso)
        .first<{ total: number; successes: number; failures: number; warnings: number }>();

      return jsonResponse({
        ok: true,
        period: { days, since: cutoffIso },
        summary: totalStats || { total: 0, successes: 0, failures: 0, warnings: 0 },
        byEventType: eventTypeCounts.results || [],
        byDay: dailyCounts.results || [],
        topFailureIps: topFailureIps.results || [],
      }, 200, request);
    } catch (error) {
      console.error("Error fetching audit log stats:", error);
      return jsonResponse({ message: "Failed to fetch audit log stats" }, 500, request);
    }
  }

  // Blog API routes - Admin
  if (pathname === "/api/admin/blog" && method === "GET") {
    const authError = await requireAdmin(request, env);
    if (authError) return authError;

    try {
      // Admin can see all posts including unpublished
      const posts = await storage.getBlogPosts(true);
      return jsonResponse(posts, 200, request);
    } catch (error) {
      console.error("Error fetching admin blog posts:", error);
      return jsonResponse({ message: "Failed to fetch blog posts" }, 500, request);
    }
  }

  if (pathname === "/api/admin/blog" && method === "POST") {
    const authError = await requireAdmin(request, env);
    if (authError) return authError;

    try {
      const body = await request.json();
      // Validate the request body
      const result = insertBlogPostSchema.safeParse(body);

      if (!result.success) {
        return jsonResponse({
          message: "Invalid blog post data",
          errors: result.error.errors
        }, 400, request);
      }

      // Create slug from title if not provided
      if (!result.data.slug) {
        result.data.slug = result.data.title
          .toLowerCase()
          .replace(/[^\w\s]/gi, "")
          .replace(/\s+/g, "-");
      }

      // Check if slug already exists
      const existing = await storage.getBlogPostBySlug(result.data.slug);
      if (existing) {
        return jsonResponse({
          message: "A blog post with this slug already exists"
        }, 400, request);
      }

      // Create new blog post (default to unpublished)
      const post = await storage.createBlogPost({
        ...result.data,
        published: false
      });

      return jsonResponse(post, 201, request);
    } catch (error) {
      console.error("Error creating blog post:", error);
      return jsonResponse({ message: "Failed to create blog post" }, 500, request);
    }
  }

  // GET /api/admin/blog/:id
  const adminBlogIdParams = parsePathParams(pathname, "/api/admin/blog/:id");
  if (adminBlogIdParams && method === "GET") {
    const authError = await requireAdmin(request, env);
    if (authError) return authError;

    try {
      const id = parseInt(adminBlogIdParams.id, 10);

      if (isNaN(id)) {
        return jsonResponse({ message: "Invalid ID format" }, 400, request);
      }

      const post = await storage.getBlogPostById(id);

      if (!post) {
        return jsonResponse({ message: "Blog post not found" }, 404, request);
      }

      return jsonResponse(post, 200, request);
    } catch (error) {
      console.error("Error fetching admin blog post:", error);
      return jsonResponse({ message: "Failed to fetch blog post" }, 500, request);
    }
  }

  // PUT /api/admin/blog/:id
  if (adminBlogIdParams && method === "PUT") {
    const authError = await requireAdmin(request, env);
    if (authError) return authError;

    try {
      const id = parseInt(adminBlogIdParams.id, 10);

      if (isNaN(id)) {
        return jsonResponse({ message: "Invalid ID format" }, 400, request);
      }

      const body = await request.json();
      // Validate the request body
      const result = updateBlogPostSchema.safeParse(body);

      if (!result.success) {
        return jsonResponse({
          message: "Invalid blog post data",
          errors: result.error.errors
        }, 400, request);
      }

      // Check if the post exists
      const existing = await storage.getBlogPostById(id);
      if (!existing) {
        return jsonResponse({ message: "Blog post not found" }, 404, request);
      }

      // If slug is being changed, check it doesn't conflict
      if (result.data.slug && result.data.slug !== existing.slug) {
        const slugExists = await storage.getBlogPostBySlug(result.data.slug);
        if (slugExists && slugExists.id !== id) {
          return jsonResponse({
            message: "A blog post with this slug already exists"
          }, 400, request);
        }
      }

      // Update the blog post
      const updated = await storage.updateBlogPost(id, result.data);

      if (!updated) {
        return jsonResponse({ message: "Failed to update blog post" }, 404, request);
      }

      return jsonResponse(updated, 200, request);
    } catch (error) {
      console.error("Error updating blog post:", error);
      return jsonResponse({ message: "Failed to update blog post" }, 500, request);
    }
  }

  // POST /api/admin/blog/:id/publish
  const publishParams = parsePathParams(pathname, "/api/admin/blog/:id/publish");
  if (publishParams && method === "POST") {
    const authError = await requireAdmin(request, env);
    if (authError) return authError;

    try {
      const id = parseInt(publishParams.id, 10);

      if (isNaN(id)) {
        return jsonResponse({ message: "Invalid ID format" }, 400, request);
      }

      // Publish the blog post
      const post = await storage.publishBlogPost(id);

      if (!post) {
        return jsonResponse({ message: "Blog post not found" }, 404, request);
      }

      return jsonResponse(post, 200, request);
    } catch (error) {
      console.error("Error publishing blog post:", error);
      return jsonResponse({ message: "Failed to publish blog post" }, 500, request);
    }
  }

  // POST /api/admin/blog/:id/unpublish
  const unpublishParams = parsePathParams(pathname, "/api/admin/blog/:id/unpublish");
  if (unpublishParams && method === "POST") {
    const authError = await requireAdmin(request, env);
    if (authError) return authError;

    try {
      const id = parseInt(unpublishParams.id, 10);

      if (isNaN(id)) {
        return jsonResponse({ message: "Invalid ID format" }, 400, request);
      }

      // Unpublish the blog post
      const post = await storage.unpublishBlogPost(id);

      if (!post) {
        return jsonResponse({ message: "Blog post not found" }, 404, request);
      }

      return jsonResponse(post, 200, request);
    } catch (error) {
      console.error("Error unpublishing blog post:", error);
      return jsonResponse({ message: "Failed to unpublish blog post" }, 500, request);
    }
  }

  // DELETE /api/admin/blog/:id
  if (adminBlogIdParams && method === "DELETE") {
    const authError = await requireAdmin(request, env);
    if (authError) return authError;

    try {
      const id = parseInt(adminBlogIdParams.id, 10);

      if (isNaN(id)) {
        return jsonResponse({ message: "Invalid ID format" }, 400, request);
      }

      // Delete the blog post
      await storage.deleteBlogPost(id);

      return new Response(null, {
        status: 204,
        headers: getCorsHeaders(request),
      });
    } catch (error) {
      console.error("Error deleting blog post:", error);
      return jsonResponse({ message: "Failed to delete blog post" }, 500, request);
    }
  }

  // Analytics API routes - Admin
  if (pathname === "/api/admin/analytics/daily" && method === "GET") {
    const authError = await requireAdmin(request, env);
    if (authError) return authError;

    try {
      const dateParam = url.searchParams.get("date");
      const date = dateParam ? new Date(dateParam) : new Date();

      if (isNaN(date.getTime())) {
        return jsonResponse({ message: "Invalid date format" }, 400, request);
      }

      const metrics = await storage.getDailyMetrics(date);
      return jsonResponse(metrics || { message: "No metrics available for this date" }, 200, request);
    } catch (error) {
      console.error("Error fetching daily metrics:", error);
      return jsonResponse({ message: "Failed to fetch metrics" }, 500, request);
    }
  }

  if (pathname === "/api/admin/analytics/weekly" && method === "GET") {
    const authError = await requireAdmin(request, env);
    if (authError) return authError;

    try {
      const dateParam = url.searchParams.get("date");
      const date = dateParam ? new Date(dateParam) : new Date();

      if (isNaN(date.getTime())) {
        return jsonResponse({ message: "Invalid date format" }, 400, request);
      }

      const metrics = await storage.getWeeklyMetrics(date);
      return jsonResponse(metrics || { message: "No metrics available for this week" }, 200, request);
    } catch (error) {
      console.error("Error fetching weekly metrics:", error);
      return jsonResponse({ message: "Failed to fetch metrics" }, 500, request);
    }
  }

  if (pathname === "/api/admin/analytics/monthly" && method === "GET") {
    const authError = await requireAdmin(request, env);
    if (authError) return authError;

    try {
      const dateParam = url.searchParams.get("date");
      const date = dateParam ? new Date(dateParam) : new Date();

      if (isNaN(date.getTime())) {
        return jsonResponse({ message: "Invalid date format" }, 400, request);
      }

      const metrics = await storage.getMonthlyMetrics(date);
      return jsonResponse(metrics || { message: "No metrics available for this month" }, 200, request);
    } catch (error) {
      console.error("Error fetching monthly metrics:", error);
      return jsonResponse({ message: "Failed to fetch metrics" }, 500, request);
    }
  }

  if (pathname === "/api/admin/analytics/aggregate" && method === "GET") {
    const authError = await requireAdmin(request, env);
    if (authError) return authError;

    try {
      const startParam = url.searchParams.get("startDate");
      const endParam = url.searchParams.get("endDate");
      if (!startParam || !endParam) {
        return jsonResponse(
          { message: "startDate and endDate are required (YYYY-MM-DD, UTC day boundaries)" },
          400,
          request,
        );
      }
      const start = parseAnalyticsUtcDayParam(startParam);
      const end = parseAnalyticsUtcDayParam(endParam);
      if (!start || !end) {
        return jsonResponse({ message: "startDate and endDate must be YYYY-MM-DD" }, 400, request);
      }
      const result = await storage.getAggregatedDailyMetrics(start, end);
      return jsonResponse(result, 200, request);
    } catch (error) {
      console.error("Error fetching aggregate analytics:", error);
      return jsonResponse({ message: "Failed to fetch aggregate metrics" }, 500, request);
    }
  }

  if (pathname === "/api/admin/analytics/engagement" && method === "GET") {
    const authError = await requireAdmin(request, env);
    if (authError) return authError;

    try {
      const startParam = url.searchParams.get("startDate");
      const endParam = url.searchParams.get("endDate");
      if (!startParam || !endParam) {
        return jsonResponse(
          { message: "startDate and endDate are required (YYYY-MM-DD, UTC day boundaries)" },
          400,
          request,
        );
      }
      const start = parseAnalyticsUtcDayParam(startParam);
      const end = parseAnalyticsUtcDayParam(endParam);
      if (!start || !end) {
        return jsonResponse({ message: "startDate and endDate must be YYYY-MM-DD" }, 400, request);
      }
      const maxDays = MAX_ENGAGEMENT_RANGE_DAYS;
      const spanDays = Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1;
      if (spanDays < 1 || spanDays > maxDays) {
        return jsonResponse({ message: `Date range must be 1–${maxDays} UTC days` }, 400, request);
      }
      const result = await storage.getAggregatedPageEngagement(start, end);
      return jsonResponse(result, 200, request);
    } catch (error) {
      console.error("Error fetching engagement analytics:", error);
      return jsonResponse({ message: "Failed to fetch engagement analytics" }, 500, request);
    }
  }

  if (pathname === "/api/admin/analytics/range" && method === "GET") {
    const authError = await requireAdmin(request, env);
    if (authError) return authError;

    try {
      const startDate = url.searchParams.get("startDate");
      const endDate = url.searchParams.get("endDate");
      const type = url.searchParams.get("type");

      if (!startDate || !endDate || !type) {
        return jsonResponse({
          message: "Start date, end date, and metrics type are required"
        }, 400, request);
      }

      const start = new Date(startDate);
      const end = new Date(endDate);
      const metricsType = type as AnalyticsMetricsType;

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return jsonResponse({ message: "Invalid date format" }, 400, request);
      }

      if (!Object.values(AnalyticsMetricsType).includes(metricsType)) {
        return jsonResponse({
          message: "Invalid metrics type. Must be daily, weekly, or monthly"
        }, 400, request);
      }

      const metrics = await storage.getAnalyticsData(start, end, metricsType);
      return jsonResponse(metrics, 200, request);
    } catch (error) {
      console.error("Error fetching analytics range:", error);
      return jsonResponse({ message: "Failed to fetch analytics" }, 500, request);
    }
  }

  // 404 for unmatched routes
  console.log(`[ROUTES] ❌ No route handler matched. Returning 404`);
  console.log(`[ROUTES] Pathname: ${pathname}, Method: ${method}`);
  return jsonResponse({ message: "Not Found", pathname, method }, 404, request);
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

export async function processExpiredSentNoteNotifications(
  env: Env,
): Promise<{ processed: number; notified: number; error?: string }> {
  return processExpiredSentNotes(env, async (to, subject, text, html) => {
    const result = await sendEmail(env, { to, subject, text, html });
    if (!result.ok) throw new Error(result.error ?? "Email send failed");
    return result;
  });
}

export async function processUnopenedNoteReminders(
  env: Env,
): Promise<{ processed: number; notified: number; error?: string }> {
  return processDueUnopenedReminders(env, async (to, subject, text, html) => {
    const result = await sendEmail(env, { to, subject, text, html });
    if (!result.ok) throw new Error(result.error ?? "Email send failed");
    return result;
  });
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
