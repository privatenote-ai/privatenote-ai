import { CompositeStorage } from "./storage";
import type { Note } from "@shared/schema";
import { insertBlogPostSchema, updateBlogPostSchema, AnalyticsMetricsType } from "@shared/schema";
import type { KVNamespace } from "@cloudflare/workers-types";
import type { Env } from "./types";
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import type { AuthenticatorTransportFuture } from "@simplewebauthn/types";
import * as OTPAuth from "otpauth";

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'https://privatenote-ai.pages.dev',
  'https://client-llm.privatenote-ai.pages.dev',
  'https://privatenote.ai',
  'http://localhost:5000',
  'http://localhost:5173',
  'http://127.0.0.1:5000',
  'http://127.0.0.1:5173',
];

// Rate limiting configuration
const RATE_LIMIT = {
  MAX_REQUESTS: 10, // requests per window
  WINDOW_SECONDS: 60, // 1 minute window
  KEY_PREFIX: 'rate_limit:',
};

const AI_VERIFICATION = {
  USES: 5,
  TTL_SECONDS: 10 * 60,
  KEY_PREFIX: "ai_verify:",
};

const NOTE_RESERVATION = {
  TTL_SECONDS: 5 * 60,
  KEY_PREFIX: "note_reserve:",
};

const SESSION_POLICY = {
  TTL_SECONDS: 60 * 60 * 24 * 14, // 14 days sliding
  ABSOLUTE_TTL_SECONDS: 60 * 60 * 24 * 90, // 90 days absolute
  ROTATE_SECONDS: 60 * 60 * 24, // 24 hours
};

const USER_STATUS_PENDING = "pending";
const USER_STATUS_ACTIVE = "active";
const STEP_UP_WINDOW_SECONDS = 5 * 60;
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

// Get allowed origin for CORS
function normalizeOrigin(origin: string): string {
  return origin.replace(/\/$/, '');
}

function getAllowedOrigin(request: Request): string | null {
  const origin = request.headers.get('Origin');
  if (!origin) return null;

  const normalized = normalizeOrigin(origin);
  const normalizedAllowed = ALLOWED_ORIGINS.map(normalizeOrigin);

  // Check if origin is in allowed list
  if (normalizedAllowed.includes(normalized)) {
    return origin;
  }

  // For development, allow localhost variations
  if (normalized.includes('localhost') || normalized.includes('127.0.0.1')) {
    return origin;
  }

  // Allow Pages preview and custom subdomains
  if (normalized.endsWith('.pages.dev') || normalized.endsWith('.privatenote.ai')) {
    return origin;
  }

  return null; // Origin not allowed
}

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

// Get Content Security Policy header
function getCSPHeader(): string {
  // Strict CSP to prevent XSS and code injection
  // Note: 'unsafe-inline' for styles is needed for React/Vite, but we avoid it for scripts
  return [
    "default-src 'self'",
    "script-src 'self' https://challenges.cloudflare.com https://static.cloudflareinsights.com 'wasm-unsafe-eval'", // Turnstile + Cloudflare Insights + WebAssembly for WebLLM
    "style-src 'self' 'unsafe-inline'", // React inline styles
    "font-src 'self'",
    "connect-src 'self' https://privatenote-api.marjan-skrobot.workers.dev https://privatenote-ai.pages.dev https://*.pages.dev https://privatenote.ai https://api.openai.com https://challenges.cloudflare.com https://cloudflareinsights.com https://huggingface.co https://*.huggingface.co https://*.hf.co https://raw.githubusercontent.com", // API + Pages previews + Web Analytics beacon + WebLLM
    "img-src 'self' data: https:", // Images (data: for inline images, https: for external)
    "frame-src https://challenges.cloudflare.com", // Turnstile iframe
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'", // Prevent clickjacking
    "object-src 'none'", // Block plugins
    "upgrade-insecure-requests", // Upgrade HTTP to HTTPS
  ].join("; ");
}

// Get CORS headers
function getCorsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("Origin");
  const allowedOrigin = origin ? getAllowedOrigin(request) : null;

  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-admin-token",
    "Access-Control-Allow-Credentials": "true",
    "Content-Security-Policy": getCSPHeader(),
    "Referrer-Policy": "strict-origin-when-cross-origin",
  };

  if (origin) {
    headers["Access-Control-Allow-Origin"] = allowedOrigin ?? "null";
    headers["Vary"] = "Origin";
  }

  return headers;
}

function getMagicLinkOrigin(request: Request): string {
  const origin = request.headers.get("Origin");
  const allowedOrigin = origin ? getAllowedOrigin(request) : null;
  return allowedOrigin ?? new URL(request.url).origin;
}

function normalizeEmail(email: string | null | undefined): string | null {
  const normalized = email?.trim().toLowerCase() || null;
  return normalized && normalized.length ? normalized : null;
}

function isValidEmailLoose(email: string): boolean {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
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

async function sendMagicLinkEmail(
  env: Env,
  to: string,
  magicUrl: string,
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

  const subject = "Login to PrivateNote";
  const text = [
    "Login to PrivateNote",
    "",
    "Sign in with your magic link:",
    magicUrl,
    "",
    "If you did not request this, you can ignore this email.",
  ].join("\n");
  const html = [
    "<div style=\"font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #111827;\">",
    "  <div style=\"font-size: 20px; font-weight: 700; margin-bottom: 12px;\"><strong>Login to PrivateNote</strong></div>",
    "  <p style=\"margin: 0 0 20px; color: #374151;\">Use your magic link to finish signing in.</p>",
    "  <a href=\"" + magicUrl + "\" style=\"display: inline-block; background: #0066FF; color: #FFFFFF; text-decoration: none; padding: 12px 20px; border-radius: 10px; font-weight: 600;\">Sign in with Magic Link to PrivateNote</a>",
    "  <p style=\"margin: 20px 0 0; color: #6B7280; font-size: 12px;\">If you did not request this, you can ignore this email.</p>",
    "  <div style=\"margin-top: 28px; display: flex; align-items: center; gap: 10px;\">",
    "    <img src=\"https://privatenote.ai/favicon.svg\" alt=\"PrivateNote\" width=\"24\" height=\"24\" style=\"display: block;\" />",
    "    <span style=\"font-size: 14px; font-weight: 600;\">privateNote.ai</span>",
    "  </div>",
    "  <p style=\"margin: 6px 0 0; color: #6B7280; font-size: 12px;\">Securely create, share, and destroy private notes — only the recipient can read them.</p>",
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
    const message = (await res.text()) || res.statusText;
    return { ok: false, error: `Resend error: ${res.status} ${message}` };
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
        "Access-Control-Allow-Origin": ALLOWED_ORIGINS[0],
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, x-admin-token",
      }),
  };

  // Issue a stable, non-auth client identifier cookie for rate limiting / abuse protection.
  // This is only used when IP-based identification is unavailable or weak.
  if (request) {
    const cookieHeader = request.headers.get("Cookie") || "";
    const hasClientCookie = /(?:^|;\s*)pn_client_id=([^;]+)/.test(cookieHeader);
    if (!hasClientCookie) {
      const clientId = randomId(16);
      headers["Set-Cookie"] = `pn_client_id=${clientId}; Path=/; Max-Age=31536000; SameSite=Lax; Secure; HttpOnly`;
    }
  }

  return new Response(JSON.stringify(data), {
    status,
    headers,
  });
}

const AUTH_CHALLENGE = {
  PREFIX: "auth_challenge:",
  TTL_SECONDS: 10 * 60,
};

const AUTH_MAGIC_LINK = {
  PREFIX: "auth_magic:",
  TTL_SECONDS: 15 * 60,
};

const AUTH_EMAIL_CHANGE = {
  PREFIX: "auth_email_change:",
  TTL_SECONDS: 60 * 60, // 1 hour for email change verification
};

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
          bytes[key] = val;
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
 * For *.pages.dev, use the request site's hostname — branch previews (e.g. abc123.privatenote-ai.pages.dev)
 * are siblings of client-llm.*; a single hardcoded rpID would break WebAuthn on preview URLs.
 */
function getExpectedRpIdFromOrigin(allowedOrigin: string | string[] | null): string | null {
  const originStr = allowedOrigin == null ? null : Array.isArray(allowedOrigin) ? allowedOrigin[0] : allowedOrigin;
  if (!originStr) return null;
  try {
    const hostname = new URL(originStr).hostname;
    if (hostname.includes("localhost") || hostname.includes("127.0.0.1")) {
      return hostname;
    }
    if (hostname.endsWith(".pages.dev")) {
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
  | "passkey_reset"
  | "recovery_code_generated"
  | "recovery_code_used"
  | "recovery_code_failed"
  | "account_deleted"
  | "magic_link_sent"
  | "magic_link_email_failed"
  | "magic_link_used"
  | "magic_link_failed"
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

/**
 * Generate HMAC signature for magic link token (optional integrity verification)
 * Uses HMAC-SHA256 with a secret key from environment
 */
async function signMagicLinkToken(env: Env, token: string, payload: Record<string, unknown>): Promise<string | null> {
  // Use AUTH_SECRET_KEY if available, otherwise fall back to token hash (backward compatible)
  if (!env.AUTH_SECRET_KEY) {
    return null; // No secret key configured, skip HMAC
  }
  const message = `${token}:${JSON.stringify(payload)}`;
  const keyData = new TextEncoder().encode(env.AUTH_SECRET_KEY);
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

/**
 * Verify HMAC signature for magic link token
 */
async function verifyMagicLinkToken(
  env: Env,
  token: string,
  payload: Record<string, unknown>,
  signature: string
): Promise<boolean> {
  if (!env.AUTH_SECRET_KEY) {
    return true; // No secret key configured, skip verification (backward compatible)
  }
  const expectedSignature = await signMagicLinkToken(env, token, payload);
  if (!expectedSignature) return true; // Backward compatible
  return constantTimeEquals(expectedSignature, signature);
}

async function storeMagicLink(env: Env, token: string, payload: Record<string, unknown>) {
  const kv = getAuthKv(env);
  if (!kv) return false;
  const tokenHash = await sha256Base64Url(token);

  // Add HMAC signature if secret key is available
  const signature = await signMagicLinkToken(env, token, payload);
  const storedPayload = signature ? { ...payload, _hmac: signature } : payload;

  await kv.put(`${AUTH_MAGIC_LINK.PREFIX}${tokenHash}`, JSON.stringify(storedPayload), {
    expirationTtl: AUTH_MAGIC_LINK.TTL_SECONDS,
  });
  return true;
}

async function consumeMagicLink(env: Env, token: string): Promise<Record<string, unknown> | null> {
  const kv = getAuthKv(env);
  if (!kv) return null;
  const tokenHash = await sha256Base64Url(token);
  const key = `${AUTH_MAGIC_LINK.PREFIX}${tokenHash}`;
  const value = await kv.get(key);
  if (!value) return null;
  await kv.delete(key);
  try {
    const payload = JSON.parse(value) as Record<string, unknown>;

    // Verify HMAC signature if present
    if (payload._hmac && typeof payload._hmac === "string") {
      const signature = payload._hmac as string;
      const { _hmac, ...payloadWithoutHmac } = payload;
      const isValid = await verifyMagicLinkToken(env, token, payloadWithoutHmac, signature);
      if (!isValid) {
        console.warn("[Auth] Magic link token HMAC verification failed");
        return null; // Invalid signature
      }
      return payloadWithoutHmac;
    }

    return payload;
  } catch {
    return null;
  }
}

type AuthMethod = "magic" | "passkey" | "recovery";

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
  await env.AUTH_DB.prepare(
    "UPDATE sessions SET revoked_at = ?, revoked_reason = ? WHERE user_id = ? AND revoked_at IS NULL AND user_agent = ?"
  )
    .bind(nowIso, "superseded", userId, userAgent)
    .run();
  const sessionId = randomId(32);
  const sessionHash = await sha256Base64Url(sessionId);
  const id = crypto.randomUUID();
  const expiresAt = new Date(now + 1000 * SESSION_POLICY.TTL_SECONDS).toISOString();
  const absoluteExpiresAt = new Date(now + 1000 * SESSION_POLICY.ABSOLUTE_TTL_SECONDS).toISOString();
  const ip = getRequestIp(request);
  const { city, country } = getRequestGeo(request);
  const lastStepUpAt = authMethod === "passkey" ? nowIso : null;
  await env.AUTH_DB.prepare(
    "INSERT INTO sessions (id, session_id_hash, user_id, expires_at, absolute_expires_at, created_at, last_seen_at, last_auth_at, last_stepup_at, user_agent, ip, city, country, device_label) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
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

function sessionCookie(sessionId: string): string {
  // SameSite=None required for cross-origin requests (frontend on Pages, API on Workers)
  return `pn_session=${sessionId}; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=${SESSION_POLICY.TTL_SECONDS}`;
}

function applyRotatedSession(headers: Headers, session: { newSessionId?: string } | null) {
  if (session?.newSessionId) {
    // Use append so we don't overwrite any existing Set-Cookie header(s)
    headers.append("Set-Cookie", sessionCookie(session.newSessionId));
  }
}

function isStepUpFresh(lastStepUpAt: string | null, windowSeconds: number = STEP_UP_WINDOW_SECONDS): boolean {
  if (!lastStepUpAt) return false;
  const last = new Date(lastStepUpAt).getTime();
  return Date.now() - last <= windowSeconds * 1000;
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
  const sessionId = cookies["pn_session"];
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
    lastStepUpAt: row.last_stepup_at ?? null,
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

async function createUser(
  env: Env,
  email: string | null,
  status: string
): Promise<{ id: string } | null> {
  if (!env.AUTH_DB) return null;
  const id = crypto.randomUUID();
  const nowIso = new Date().toISOString();
  try {
    await env.AUTH_DB.prepare(
      "INSERT INTO users (id, email, email_verified, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
    )
      .bind(id, email, email ? 0 : 0, status, nowIso, nowIso)
      .run();
    return { id };
  } catch (error: any) {
    // Handle UNIQUE constraint violation (race condition: user was created between check and insert)
    // SQLite error code 2067 is UNIQUE constraint violation
    if (error?.cause?.code === 2067 || error?.message?.includes("UNIQUE constraint") || error?.message?.includes("UNIQUE")) {
      return null; // User already exists, return null to indicate creation failed
    }
    throw error; // Re-throw other errors
  }
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

async function getAiVerificationRemaining(
  kv: KVNamespace,
  clientId: string,
): Promise<number | null> {
  const key = `${AI_VERIFICATION.KEY_PREFIX}${clientId}`;
  try {
    const raw = await kv.get(key);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as { remaining?: number };
    if (typeof parsed.remaining === "number" && parsed.remaining > 0) {
      return parsed.remaining;
    }
    return null;
  } catch (error) {
    console.warn("[AI] Failed to read verification cache:", error);
    return null;
  }
}

async function handleAuthRoutes(request: Request, env: Env): Promise<Response | null> {
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
          userVerification: "preferred",
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

    const challengeRecord = await consumeAuthChallenge(env, challengeId);
    if (!challengeRecord) {
      return jsonResponse({ message: "Challenge expired" }, 400, request);
    }

    if (!env.AUTH_DB) {
      return jsonResponse({ message: "Auth database not configured" }, 501, request);
    }

    const session = await getSessionFromRequest(env, request, { rotate: false });
    if (!session || session.id !== challengeRecord.userId) {
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

    await env.AUTH_DB.prepare(
      "INSERT INTO webauthn_credentials (id, user_id, credential_id, public_key, counter, transports, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
    )
      .bind(
        crypto.randomUUID(),
        userId,
        credentialId,
        publicKey,
        counter ?? 0,
        JSON.stringify(credentialMetadata), // Store metadata in transports field as JSON
        new Date().toISOString()
      )
      .run();

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
      },
      ip: getRequestIp(request),
      userAgent: request.headers.get("User-Agent"),
    });

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
        userVerification: "preferred",
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
      return jsonResponse({ message: "Unknown credential" }, 400, request);
    }

    let verification;
    try {
      verification = await verifyAuthenticationResponse({
        response: credential,
        expectedChallenge,
        expectedOrigin,
        expectedRPID,
        authenticator: {
          credentialID: storedCredential.credential_id,
          credentialPublicKey: base64UrlToBytes(storedCredential.public_key),
          counter: storedCredential.counter || 0,
        },
      });
    } catch (error) {
      return jsonResponse(
        { message: error instanceof Error ? error.message : "Authentication verification failed" },
        400,
        request
      );
    }

    if (!verification.verified || !verification.authenticationInfo) {
      return jsonResponse({ message: "Authentication not verified" }, 400, request);
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
      headers.set("Set-Cookie", sessionCookie(session.sessionId));
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
      "SELECT id, email, status FROM users WHERE id = ? LIMIT 1"
    )
      .bind(session.id)
      .first<{ id: string; email: string | null; status: string | null }>();

    const passkeyCount = await env.AUTH_DB.prepare(
      "SELECT COUNT(*) as count FROM webauthn_credentials WHERE user_id = ?"
    )
      .bind(session.id)
      .first<{ count: number }>();

    const headers = new Headers(getCorsHeaders(request));
    headers.set("Content-Type", "application/json");
    applyRotatedSession(headers, session);
    return new Response(
      JSON.stringify({
        ok: true,
        id: user?.id ?? session.id,
        email: user?.email ?? null,
        status: user?.status ?? USER_STATUS_ACTIVE,
        hasPasskeys: (passkeyCount?.count ?? 0) > 0,
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
        userVerification: "preferred",
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
      return jsonResponse({ message: "Unknown credential" }, 400, request);
    }

    let verification;
    try {
      verification = await verifyAuthenticationResponse({
        response: credential,
        expectedChallenge,
        expectedOrigin,
        expectedRPID,
        authenticator: {
          credentialID: storedCredential.credential_id,
          credentialPublicKey: base64UrlToBytes(storedCredential.public_key),
          counter: storedCredential.counter || 0,
        },
      });
    } catch (error) {
      return jsonResponse(
        { message: error instanceof Error ? error.message : "Authentication verification failed" },
        400,
        request
      );
    }

    if (!verification.verified || !verification.authenticationInfo) {
      return jsonResponse({ message: "Authentication not verified" }, 400, request);
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
    const rows = await env.AUTH_DB.prepare(
      "SELECT id, credential_id, transports, created_at, last_used_at FROM webauthn_credentials WHERE user_id = ? ORDER BY created_at DESC"
    )
      .bind(session.id)
      .all<{ id: string; credential_id: string; transports: string | null; created_at: string; last_used_at: string | null }>();

    const passkeys = (rows.results || []).map((row) => {
      const transports = parseTransports(row.transports) || null;
      return {
        id: row.id,
        createdAt: row.created_at,
        lastUsedAt: row.last_used_at,
        transports,
        label: getPasskeyLabel(transports),
      };
    });

    const headers = new Headers(getCorsHeaders(request));
    headers.set("Content-Type", "application/json");
    applyRotatedSession(headers, session);
    return new Response(JSON.stringify({ ok: true, passkeys }), { status: 200, headers });
  }

  if (pathname === "/api/auth/passkeys/reset" && method === "POST") {
    if (!env.AUTH_DB) {
      return jsonResponse({ message: "Auth database not configured" }, 501, request);
    }
    const session = await getSessionFromRequest(env, request, { rotate: false });
    if (!session) {
      return jsonResponse({ message: "Unauthorized" }, 401, request);
    }
    if (!isStepUpFresh(session.lastStepUpAt)) {
      return jsonResponse({ message: "Step-up required" }, 403, request);
    }

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
    applyRotatedSession(headers, session);
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
      headers.set("Set-Cookie", "pn_session=; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=0");
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
    applyRotatedSession(headers, session);
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

    const passkeyCountForRecovery = await env.AUTH_DB.prepare(
      "SELECT COUNT(*) as count FROM webauthn_credentials WHERE user_id = ?"
    )
      .bind(session.id)
      .first<{ count: number }>();
    const hasPasskeysForRecovery = (passkeyCountForRecovery?.count ?? 0) > 0;

    if (hasPasskeysForRecovery && !isStepUpFresh(session.lastStepUpAt, RECOVERY_CODE_STEP_UP_WINDOW_SECONDS)) {
      return jsonResponse({ message: "Step-up required" }, 403, request);
    }

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
      const emailResult = await sendEmail(env, {
        to: userEmail,
        subject: "Recovery codes regenerated - PrivateNote",
        text: `Your PrivateNote recovery codes were regenerated. Your previous unused recovery codes no longer work.\n\nIf you did not do this, please secure your account (change password if applicable, revoke other sessions, and add or verify your passkey) from Security Settings.\n\nThis is an automated security notification.`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
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
      headers.set("Set-Cookie", sessionCookie(session.sessionId));
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
    const isLocal = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    const responsePayload: Record<string, unknown> = {
      ok: true,
      message: "Check your email for a sign-in link.",
    };

    if (!env.AUTH_DB) {
      console.error("[MAGIC_LINK] AUTH_DB not configured, returning silent 200");
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

      if (email && isValidEmailLoose(email)) {
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

    if (!email || !isValidEmailLoose(email)) {
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
      const stored = await storeMagicLink(env, token, {
        userId,
        email,
        intent,
        createdAt: Date.now(),
      });

      if (!stored) {
        console.error("[MAGIC_LINK] storeMagicLink returned false — KV write failed?");
      }

      if (stored) {
        const magicOrigin = getMagicLinkOrigin(request);
        const magicUrl = `${magicOrigin}/auth/magic?token=${encodeURIComponent(token)}`;
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
          const sendResult = await sendMagicLinkEmail(env, email, magicUrl);
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

  if (pathname === "/api/auth/magic/consume" && method === "GET") {
    const token = url.searchParams.get("token");
    if (!token) {
      return jsonResponse({ message: "Missing token" }, 400, request);
    }
    const payload = await consumeMagicLink(env, token);
    if (!payload) {
      // Audit log: magic link failed (invalid/expired token)
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

    // If no userId from payload, get or create user (race-safe: create-first, fallback to fetch on UNIQUE violation)
    if (!userId && payloadEmail) {
      const userResult = await getOrCreateUser(env, payloadEmail, USER_STATUS_PENDING);
      userId = userResult?.id ?? null;
    }
    if (!userId) {
      return jsonResponse({ message: "User creation failed" }, 500, request);
    }
    const nowIso = new Date().toISOString();
    await env.AUTH_DB.prepare(
      "UPDATE users SET status = ?, email_verified = 1, updated_at = ?, last_login_at = ? WHERE id = ?"
    )
      .bind(USER_STATUS_ACTIVE, nowIso, nowIso, userId)
      .run();

    const session = await createSession(env, userId, request, "magic");

    // Check if user has verified TOTP; if so, mark session as pending
    let totpRequired = false;
    const totpCheck = await env.AUTH_DB.prepare(
      "SELECT verified FROM totp_secrets WHERE user_id = ? AND verified = 1 LIMIT 1"
    )
      .bind(userId)
      .first<{ verified: number }>();
    if (totpCheck?.verified === 1 && session?.sessionId) {
      const pendingHash = await sha256Base64Url(session.sessionId);
      await env.AUTH_DB.prepare(
        "UPDATE sessions SET auth_complete = 0 WHERE session_id_hash = ?"
      )
        .bind(pendingHash)
        .run();
      totpRequired = true;
    }

    // Audit log: magic link used successfully
    await logAuditEvent(env, {
      userId,
      eventType: "magic_link_used",
      status: "success",
      details: { intent: payload.intent },
      ip: getRequestIp(request),
      userAgent: request.headers.get("User-Agent"),
    });

    // Audit log: login success
    await logAuditEvent(env, {
      userId,
      eventType: "login_success",
      status: "success",
      details: { authMethod: "magic_link", intent: payload.intent, totpRequired },
      ip: getRequestIp(request),
      userAgent: request.headers.get("User-Agent"),
    });

    const headers = new Headers(getCorsHeaders(request));
    headers.set("Content-Type", "application/json");
    headers.set("Referrer-Policy", "no-referrer");
    if (session?.sessionId) {
      headers.set("Set-Cookie", sessionCookie(session.sessionId));
    }
    return new Response(JSON.stringify({ ok: true, totpRequired }), { status: 200, headers });
  }

  if (pathname === "/api/auth/logout" && method === "POST") {
    const headers = new Headers(getCorsHeaders(request));
    headers.set("Content-Type", "application/json");
    const cookies = parseCookies(request.headers.get("Cookie"));
    const sessionId = cookies["pn_session"];
    if (sessionId && env.AUTH_DB) {
      const sessionHash = await sha256Base64Url(sessionId);
      await env.AUTH_DB.prepare("UPDATE sessions SET revoked_at = ? WHERE session_id_hash = ?")
        .bind(new Date().toISOString(), sessionHash)
        .run();
    }
    headers.set("Set-Cookie", "pn_session=; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=0");
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
      headers.set("Set-Cookie", sessionCookie(session.newSessionId));
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

    // Check if user has passkeys - only require step-up if they do
    const passkeyCount = await env.AUTH_DB.prepare(
      "SELECT COUNT(*) as count FROM webauthn_credentials WHERE user_id = ?"
    )
      .bind(session.id)
      .first<{ count: number }>();

    const hasPasskeys = (passkeyCount?.count ?? 0) > 0;

    // Only require step-up for users with passkeys
    // Magic-link-only users verified email ownership when signing in
    if (hasPasskeys && !isStepUpFresh(session.lastStepUpAt)) {
      return jsonResponse({ message: "Step-up required" }, 403, request);
    }

    const body = await request.json().catch(() => ({})) as { newEmail?: string };
    const { newEmail } = body;

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

      // Different user owns this email - don't reveal that email exists (prevent enumeration)
      // But still log the attempt
      await logAuditEvent(env, {
        userId: session.id,
        eventType: "email_change_failed",
        status: "failure",
        details: { reason: "email_in_use", newEmailMasked: normalizedNewEmail.replace(/(.{2})(.*)(@.*)/, "$1***$3") },
        ip: getRequestIp(request),
        userAgent: request.headers.get("User-Agent"),
      });
      // Return success to prevent email enumeration (send email anyway, or fake success)
      return jsonResponse({ ok: true, message: "Verification email sent to new address" }, 200, request);
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

    // Send verification email to new address
    const origin = request.headers.get("Origin") || "https://privatenote.ai";
    const verifyUrl = `${origin}/auth/email-change?token=${encodeURIComponent(token)}`;

    console.log(`[AUTH] Email change request: userId=${session.id}, currentEmail=${normalizedCurrentEmail}, newEmail=${normalizedNewEmail}`);

    const emailResult = await sendEmail(env, {
      to: normalizedNewEmail,
      subject: "Verify your new email address - PrivateNote",
      text: `You requested to change your email address for your PrivateNote account.\n\nClick the link below to verify your new email address:\n${verifyUrl}\n\nThis link expires in 1 hour.\n\nIf you didn't request this change, please ignore this email and your account will remain unchanged.`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Verify your new email address</h2>
          <p>You requested to change your email address for your PrivateNote account.</p>
          <p>Click the button below to verify your new email address:</p>
          <p style="margin: 24px 0;">
            <a href="${verifyUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">
              Verify email address
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
    if (!env.AUTH_DB) {
      return jsonResponse({ message: "Auth database not configured" }, 501, request);
    }

    const url = new URL(request.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return jsonResponse({ message: "Missing verification token" }, 400, request);
    }

    const kv = getAuthKv(env);
    if (!kv) {
      return jsonResponse({ message: "Auth storage not configured" }, 501, request);
    }

    const tokenHash = await sha256Base64Url(token);
    const key = `${AUTH_EMAIL_CHANGE.PREFIX}${tokenHash}`;
    const value = await kv.get(key);

    if (!value) {
      return jsonResponse({ message: "Invalid or expired verification link" }, 400, request);
    }

    // Delete token immediately (one-time use)
    await kv.delete(key);

    const payload = JSON.parse(value) as {
      userId: string;
      currentEmail: string;
      newEmail: string;
      createdAt: string;
    };

    // Check if user still exists (they might have been deleted after requesting email change)
    const userExists = await env.AUTH_DB.prepare("SELECT id FROM users WHERE id = ?")
      .bind(payload.userId)
      .first<{ id: string }>();

    if (!userExists) {
      // User was deleted - don't log audit (would fail FK constraint)
      console.warn("[AUTH] Email change verification for deleted user:", payload.userId);
      return jsonResponse({ message: "Account no longer exists" }, 400, request);
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
      return jsonResponse({ message: "This email is no longer available" }, 400, request);
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

    return jsonResponse({ ok: true, message: "Email address updated successfully", newEmail: payload.newEmail }, 200, request);
  }

  if (pathname === "/api/auth/account/delete" && method === "POST") {
    if (!env.AUTH_DB) {
      return jsonResponse({ message: "Auth database not configured" }, 501, request);
    }
    const session = await getSessionFromRequest(env, request, { rotate: false });
    if (!session) {
      return jsonResponse({ message: "Unauthorized" }, 401, request);
    }

    // Check if user has passkeys - only require step-up if they do
    const passkeyCount = await env.AUTH_DB.prepare(
      "SELECT COUNT(*) as count FROM webauthn_credentials WHERE user_id = ?"
    )
      .bind(session.id)
      .first<{ count: number }>();

    const hasPasskeys = (passkeyCount?.count ?? 0) > 0;

    // Only require step-up for users with passkeys
    // Magic-link-only users can delete without step-up (they proved email ownership to sign in)
    if (hasPasskeys && !isStepUpFresh(session.lastStepUpAt)) {
      return jsonResponse({ message: "Step-up required" }, 403, request);
    }

    const body = await request.json().catch(() => ({})) as { email?: string };
    const { email: providedEmail } = body;

    if (!providedEmail || typeof providedEmail !== "string") {
      return jsonResponse({ message: "Email is required" }, 400, request);
    }

    // Normalize emails for comparison
    const normalizedProvided = providedEmail.trim().toLowerCase();
    const normalizedStored = (session.email ?? "").trim().toLowerCase();

    if (normalizedProvided !== normalizedStored) {
      return jsonResponse({ message: "Email does not match" }, 400, request);
    }

    // Delete all user data
    const userId = session.id;

    // Delete in order to respect foreign key constraints:
    // 1. First handle all child table records that reference user_id

    // Anonymize audit log entries (set user_id to NULL) - preserves audit trail for security
    await env.AUTH_DB.prepare("UPDATE audit_log SET user_id = NULL WHERE user_id = ?")
      .bind(userId)
      .run();

    // Delete TOTP secrets
    await env.AUTH_DB.prepare("DELETE FROM totp_secrets WHERE user_id = ?")
      .bind(userId)
      .run();

    // Delete recovery codes
    await env.AUTH_DB.prepare("DELETE FROM recovery_codes WHERE user_id = ?")
      .bind(userId)
      .run();

    // Delete passkeys
    await env.AUTH_DB.prepare("DELETE FROM webauthn_credentials WHERE user_id = ?")
      .bind(userId)
      .run();

    // Delete all sessions (not just revoke - must delete for FK constraint)
    await env.AUTH_DB.prepare("DELETE FROM sessions WHERE user_id = ?")
      .bind(userId)
      .run();

    // 2. Now we can safely delete the user record
    await env.AUTH_DB.prepare("DELETE FROM users WHERE id = ?")
      .bind(userId)
      .run();

    // Log account deletion after user is deleted (use null user_id since user no longer exists)
    await logAuditEvent(env, {
      userId: null,
      eventType: "account_deleted",
      status: "success",
      details: {
        deletedUserId: userId,
        emailMasked: normalizedStored.replace(/(.{2})(.*)(@.*)/, "$1***$3")
      },
      ip: getRequestIp(request),
      userAgent: request.headers.get("User-Agent"),
    });

    const headers = new Headers(getCorsHeaders(request));
    headers.set("Content-Type", "application/json");
    headers.set("Set-Cookie", "pn_session=; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=0");
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
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
    applyRotatedSession(headers, session);
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

    const passkeyCountTotp = await env.AUTH_DB.prepare(
      "SELECT COUNT(*) as count FROM webauthn_credentials WHERE user_id = ?"
    )
      .bind(session.id)
      .first<{ count: number }>();
    const hasPasskeysTotp = (passkeyCountTotp?.count ?? 0) > 0;
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

    const passkeyCountDisable = await env.AUTH_DB.prepare(
      "SELECT COUNT(*) as count FROM webauthn_credentials WHERE user_id = ?"
    )
      .bind(session.id)
      .first<{ count: number }>();
    const hasPasskeysDisable = (passkeyCountDisable?.count ?? 0) > 0;
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

// Rate limiting helper
async function checkRateLimit(
  request: Request,
  env: Env,
  identifier: string
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const kv = env.RATE_LIMIT_KV || env.NOTES_KV;
  const key = `${RATE_LIMIT.KEY_PREFIX}${identifier}`;
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - (now % RATE_LIMIT.WINDOW_SECONDS);

  try {
    const stored = await kv.get(key, { type: 'json' });

    if (stored && stored.windowStart === windowStart) {
      // Same window, check count
      if (stored.count >= RATE_LIMIT.MAX_REQUESTS) {
        return {
          allowed: false,
          remaining: 0,
          resetAt: windowStart + RATE_LIMIT.WINDOW_SECONDS,
        };
      }

      // Increment count
      const newCount = stored.count + 1;
      await kv.put(key, JSON.stringify({
        count: newCount,
        windowStart,
      }), {
        expirationTtl: RATE_LIMIT.WINDOW_SECONDS + 10, // Add buffer
      });

      return {
        allowed: true,
        remaining: RATE_LIMIT.MAX_REQUESTS - newCount,
        resetAt: windowStart + RATE_LIMIT.WINDOW_SECONDS,
      };
    } else {
      // New window, reset count
      await kv.put(key, JSON.stringify({
        count: 1,
        windowStart,
      }), {
        expirationTtl: RATE_LIMIT.WINDOW_SECONDS + 10,
      });

      return {
        allowed: true,
        remaining: RATE_LIMIT.MAX_REQUESTS - 1,
        resetAt: windowStart + RATE_LIMIT.WINDOW_SECONDS,
      };
    }
  } catch (error) {
    console.error('[RATE_LIMIT] Error checking rate limit:', error);
    // On error, allow the request (fail open)
    return {
      allowed: true,
      remaining: RATE_LIMIT.MAX_REQUESTS,
      resetAt: windowStart + RATE_LIMIT.WINDOW_SECONDS,
    };
  }
}

function isValidNoteId(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function getReservationKey(id: string): string {
  return `${NOTE_RESERVATION.KEY_PREFIX}${id}`;
}

async function reserveNoteId(env: Env, clientId: string): Promise<string> {
  const id = crypto.randomUUID();
  const kv = env.NOTES_KV;
  await kv.put(
    getReservationKey(id),
    JSON.stringify({ clientId, createdAt: new Date().toISOString() }),
    { expirationTtl: NOTE_RESERVATION.TTL_SECONDS },
  );
  return id;
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

// Get client identifier for rate limiting
function getClientIdentifier(request: Request): string {
  // 1) Prefer real client IP from Cloudflare (strongest signal)
  const cfConnectingIp = request.headers.get("CF-Connecting-IP");
  if (cfConnectingIp) {
    return `ip:${cfConnectingIp}`;
  }

  // 2) Fallback to a stable, first-party client cookie if available
  const cookieHeader = request.headers.get("Cookie") || "";
  const cookieMatch = cookieHeader.match(/(?:^|;\s*)pn_client_id=([^;]+)/);
  if (cookieMatch && cookieMatch[1]) {
    return `cookie:${cookieMatch[1]}`;
  }

  // 3) Final, weaker fallback: origin + user agent (mostly for dev / unusual proxies)
  const userAgent = request.headers.get("User-Agent") || "unknown";
  const origin = request.headers.get("Origin") || "unknown";
  return `ua:${`${origin}:${userAgent}`.substring(0, 100)}`;
}

/**
 * CSRF protection: reject state-changing requests from unexpected origins.
 * Only enforced when a pn_session cookie is present (authenticated user context),
 * so unauthenticated API calls (note creation, etc.) are unaffected.
 */
function verifyCsrfOrigin(request: Request): Response | null {
  if (request.method === "GET" || request.method === "HEAD" || request.method === "OPTIONS") {
    return null;
  }
  const cookies = request.headers.get("Cookie") || "";
  if (!cookies.includes("pn_session")) {
    return null;
  }

  const origin = request.headers.get("Origin");
  if (origin) {
    if (getAllowedOrigin(request) !== null) {
      return null;
    }
    console.warn(`[CSRF] blocked method=${request.method} path=${new URL(request.url).pathname} Origin=${origin}`);
    return jsonResponse({ error: "CSRF validation failed" }, 403, request);
  }

  const referer = request.headers.get("Referer");
  if (referer) {
    try {
      const refOrigin = new URL(referer).origin;
      const normalized = normalizeOrigin(refOrigin);
      const allowed =
        ALLOWED_ORIGINS.map(normalizeOrigin).includes(normalized) ||
        normalized.includes("localhost") ||
        normalized.includes("127.0.0.1") ||
        normalized.endsWith(".pages.dev") ||
        normalized.endsWith(".privatenote.ai");
      if (allowed) return null;
    } catch { /* invalid URL */ }
    console.warn(`[CSRF] blocked method=${request.method} path=${new URL(request.url).pathname} Referer=${referer}`);
    return jsonResponse({ error: "CSRF validation failed" }, 403, request);
  }

  console.warn(
    `[CSRF] blocked method=${request.method} path=${new URL(request.url).pathname} (no Origin; no valid Referer)`
  );
  return jsonResponse({ error: "CSRF validation failed: missing Origin header" }, 403, request);
}

const ADMIN_SESSION_TTL = 4 * 60 * 60; // 4 hours

function adminSessionCookie(token: string): string {
  return `pn_admin=${token}; HttpOnly; Secure; SameSite=Strict; Path=/api/admin; Max-Age=${ADMIN_SESSION_TTL}`;
}

function clearAdminSessionCookie(): string {
  return "pn_admin=; HttpOnly; Secure; SameSite=Strict; Path=/api/admin; Max-Age=0";
}

// Accept either the X-Admin-Token header (legacy) or the pn_admin HttpOnly cookie.
function requireAdmin(request: Request, env: Env): Response | null {
  const expected = env.ADMIN_TOKEN;
  if (!expected || typeof expected !== "string") {
    return jsonResponse({ message: "Unauthorized - Admin not configured" }, 401, request);
  }

  const headerToken = request.headers.get("x-admin-token");
  if (headerToken && constantTimeEquals(headerToken, expected)) {
    return null;
  }

  const cookies = parseCookies(request.headers.get("Cookie"));
  const cookieToken = cookies["pn_admin"];
  if (cookieToken && constantTimeEquals(cookieToken, expected)) {
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

export async function registerRoutes(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const method = request.method;
  const isAiRequest = pathname.startsWith("/api/ai/");

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

  // Apply rate limiting to POST requests (note creation)
  if (request.method === "POST") {
    const clientId = getClientIdentifier(request);
    console.log(`[ROUTES] Checking rate limit for: ${clientId}`);

    const rateLimit = await checkRateLimit(request, env, clientId);

    if (!rateLimit.allowed) {
      console.log(`[ROUTES] ❌ Rate limit exceeded for: ${clientId}`);
      return jsonResponse({
        error: 'Rate limit exceeded',
        message: `Too many requests. Please try again in ${rateLimit.resetAt - Math.floor(Date.now() / 1000)} seconds.`,
        resetAt: rateLimit.resetAt,
      }, 429, request);
    }

    console.log(`[ROUTES] ✅ Rate limit OK. Remaining: ${rateLimit.remaining}`);
  }

  console.log(`[ROUTES] Pathname: ${pathname}, Method: ${method}`);

  console.log(`[ROUTES] Calling handleAuthRoutes...`);
  const authResponse = await handleAuthRoutes(request, env);
  console.log(`[ROUTES] handleAuthRoutes returned: ${authResponse ? authResponse.status : 'null'}`);
  if (authResponse) {
    return authResponse;
  }

  const analyticsKv = env.ANALYTICS_KV || env.NOTES_KV;
  const storage = new CompositeStorage(env.NOTES_KV, analyticsKv);
  console.log(`[ROUTES] Storage initialized`);

  // AI API routes
  if (pathname === "/api/ai/config" && method === "GET") {
    return jsonResponse({
      hasApiKey: Boolean(env.OPENAI_API_KEY),
    }, 200, request);
  }

  if (pathname === "/api/ai/enhance" && method === "POST") {
    console.log("[AI] Enhance request received");
    if (!env.OPENAI_API_KEY) {
      console.warn("[AI] Missing OpenAI API key");
      return jsonResponse({ message: "OpenAI API key not configured on server" }, 500, request);
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ message: "Invalid JSON payload" }, 400, request);
    }

    const content = typeof body?.content === "string" ? body.content.trim() : "";
    const enhancementType = body?.enhancementType;
    const turnstileToken = body?.turnstileToken;
    console.log("[AI] Enhancement type:", enhancementType, "Token present:", !!turnstileToken);

    if (!content) {
      console.warn("[AI] Missing content");
      return jsonResponse({ message: "Content is required" }, 400, request);
    }

    const MAX_INPUT_CHARS = 4000;
    if (content.length > MAX_INPUT_CHARS) {
      return jsonResponse({ message: `Content is too long (max ${MAX_INPUT_CHARS} characters)` }, 413, request);
    }

    if (!["improve", "summarize", "secure"].includes(enhancementType)) {
      console.warn("[AI] Invalid enhancement type:", enhancementType);
      return jsonResponse({ message: "Invalid enhancement type" }, 400, request);
    }

    const clientId = getClientIdentifier(request);
    const verificationKv = env.ANALYTICS_KV || env.NOTES_KV;
    let remainingUses = 0;
    console.log("[AI] Client ID:", clientId);

    if (turnstileToken) {
      const isHuman = await verifyTurnstile(turnstileToken, request, env);
      if (!isHuman) {
        console.warn("[AI] Turnstile verification failed");
        return jsonResponse({ error: "Human verification failed" }, 403, request);
      }
      remainingUses = AI_VERIFICATION.USES;
      console.log("[AI] Turnstile verified; granting uses:", remainingUses);
    } else {
      const cachedRemaining = await getAiVerificationRemaining(verificationKv, clientId);
      if (!cachedRemaining) {
        console.warn("[AI] No cached verification; rejecting");
        return jsonResponse({ error: "Human verification required" }, 403, request);
      }
      remainingUses = cachedRemaining;
      console.log("[AI] Cached verification remaining:", remainingUses);
    }

    // Store original remaining uses before API call
    const originalRemainingUses = remainingUses;

    const systemPrompts: Record<string, string> = {
      improve: "You are an expert editor. Improve the text by fixing grammar, enhancing clarity, and making it more professional while maintaining the original meaning. Return only the improved text with no additional explanations.",
      summarize: "You are a skilled summarizer. Create a concise summary of the text while preserving all key points. Return only the summary with no additional explanations.",
      secure: "You are a security expert. Analyze the text and remove any potentially sensitive information (like personal data, passwords, credit card numbers, etc.) while maintaining the main message. Return only the sanitized text with no additional explanations.",
    };

    try {
      console.log("[AI] Calling OpenAI responses API");
      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          input: [
            {
              role: "system",
              content: [{ type: "input_text", text: systemPrompts[enhancementType] }],
            },
            {
              role: "user",
              content: [{ type: "input_text", text: content }],
            },
          ],
          max_output_tokens: 800,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let upstreamMessage = errorText || response.statusText;
        try {
          const parsed = JSON.parse(errorText);
          upstreamMessage = parsed?.error?.message || upstreamMessage;
        } catch {
          // Use raw error text if it's not JSON.
        }
        console.error("[AI] OpenAI error:", response.status, errorText);
        // Return original remaining uses since the API call failed
        return jsonResponse({
          message: "AI request failed",
          upstreamStatus: response.status,
          details: typeof upstreamMessage === "string" ? upstreamMessage.slice(0, 500) : "Unknown error",
          remainingUses: originalRemainingUses,
        }, 502, request);
      }

      const data = await response.json<{
        output?: Array<{
          content?: Array<{ type?: string; text?: string }>;
        }>;
      }>();
      const output = data.output
        ?.flatMap((item) => item.content ?? [])
        .find((item) => item.type === "output_text" && item.text)
        ?.text?.trim();
      if (!output) {
        console.warn("[AI] OpenAI response missing output text");
        // Return original remaining uses since the API call didn't produce valid output
        return jsonResponse({
          message: "AI response was empty",
          remainingUses: originalRemainingUses,
        }, 502, request);
      }

      // Only decrement remaining uses AFTER successful API call
      remainingUses = Math.max(remainingUses - 1, 0);
      await setAiVerificationRemaining(verificationKv, clientId, remainingUses);
      console.log("[AI] OpenAI success; remaining uses:", remainingUses);

      return jsonResponse({ content: output, remainingUses }, 200, request);
    } catch (error) {
      console.error("[AI] Error calling OpenAI:", error);
      // Return original remaining uses since the API call failed
      return jsonResponse({
        message: "AI request failed",
        remainingUses: originalRemainingUses,
      }, 502, request);
    }
  }

  // Reserve note ID (client encrypts with noteId-bound AAD)
  if (pathname === "/api/notes/reserve" && method === "POST") {
    try {
      const clientId = getClientIdentifier(request);
      const id = await reserveNoteId(env, clientId);
      return jsonResponse({ id, expiresIn: NOTE_RESERVATION.TTL_SECONDS }, 200, request);
    } catch (error) {
      console.error("[ROUTES] Failed to reserve note ID:", error);
      return jsonResponse({ error: "Failed to reserve note ID" }, 500, request);
    }
  }

  // Notes API routes (Durable Object authority)
  if (pathname === "/api/notes" && method === "POST") {
    let requestBody: any | null = null;
    let noteForAnalytics: Note | null = null;
    try {
      requestBody = await request.clone().json();
      const expirySecondsRaw = Number(requestBody?.expirySeconds ?? NaN);
      const expiryDaysRaw = Number(requestBody?.expiryDays ?? 1);
      const expirySeconds = Number.isFinite(expirySecondsRaw)
        ? expirySecondsRaw
        : expiryDaysRaw * 24 * 60 * 60;
      const maxReads = Number(requestBody?.maxReads ?? 1);
      if (requestBody?.content && requestBody?.iv) {
        noteForAnalytics = {
          id: "pending",
          content: requestBody.content,
          iv: requestBody.iv,
          aad: requestBody?.aad ?? null,
          expiresAt: new Date(Date.now() + expirySeconds * 1000),
          maxReads,
          currentReads: 0,
          createdAt: new Date(),
          isPasswordProtected: !!requestBody?.isPasswordProtected,
          salt: requestBody?.salt ?? null,
          encryptedKey: null,
          encryptedKeyIv: requestBody?.encryptedKeyIv ?? null,
          kdfVersion: requestBody?.kdfVersion ?? null,
          kdfIterations: requestBody?.kdfIterations ?? null,
          kdfHash: requestBody?.kdfHash ?? null,
        };
      }
    } catch (error) {
      console.warn("[ROUTES] Skipping analytics for note creation:", error);
    }

    const aiMode = !!requestBody?.aiMode;
    if (aiMode) {
      console.log("[AI] Note creation with AI mode");
      const verificationKv = env.ANALYTICS_KV || env.NOTES_KV;
      const clientId = getClientIdentifier(request);

      if (requestBody?.turnstileToken) {
        const isHuman = await verifyTurnstile(requestBody?.turnstileToken, request, env);
        if (!isHuman) {
          console.warn("[AI] Turnstile verification failed for note creation");
          return jsonResponse({ error: "Human verification failed" }, 403, request);
        }
        await setAiVerificationRemaining(verificationKv, clientId, AI_VERIFICATION.USES);
        console.log("[AI] Turnstile verified for note creation; uses granted");
      } else {
        const cachedRemaining = await getAiVerificationRemaining(verificationKv, clientId);
        if (!cachedRemaining) {
          console.warn("[AI] No cached verification for note creation");
          return jsonResponse({ error: "Human verification required" }, 403, request);
        }
        console.log("[AI] Cached verification for note creation; remaining:", cachedRemaining);
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

    const id = requestedId || crypto.randomUUID();
    const doId = env.SECURE_NOTES.idFromName(id);
    const stub = env.SECURE_NOTES.get(doId);
    const doUrl = new URL(request.url);
    doUrl.pathname = `/api/notes/${id}`;

    const doResponse = await stub.fetch(
      new Request(doUrl.toString(), {
        method: "POST",
        headers: request.headers,
        body: request.body,
      }),
    );

    if (doResponse.ok && noteForAnalytics) {
      noteForAnalytics.id = id;
      await storage.trackNoteCreation(noteForAnalytics, { aiEnhanced: aiMode });
    }

    if (doResponse.ok && requestedId) {
      await clearReservation(env, requestedId);
    }

    return applyCorsHeaders(doResponse, request);
  }

  const noteRevealParams = parsePathParams(pathname, "/api/notes/:id/reveal");
  if (noteRevealParams && method === "POST") {
    const { id } = noteRevealParams;
    const clientId = getClientIdentifier(request);
    const revealKey = `${clientId}:reveal:${id}`;
    const revealLimit = await checkRateLimit(request, env, revealKey);

    if (!revealLimit.allowed) {
      return jsonResponse({
        error: 'Rate limit exceeded',
        message: `Too many reveal attempts. Please try again in ${revealLimit.resetAt - Math.floor(Date.now() / 1000)} seconds.`,
        resetAt: revealLimit.resetAt,
      }, 429, request);
    }

    const doId = env.SECURE_NOTES.idFromName(id);
    const stub = env.SECURE_NOTES.get(doId);
    const doResponse = await stub.fetch(request);

    if (doResponse.ok) {
      try {
        const data = await doResponse.clone().json();
        const noteForAnalytics: Note = {
          id,
          content: data.content,
          iv: data.iv,
          aad: data.aad ?? null,
          expiresAt: new Date(data.expiresAt),
          maxReads: data.maxReads ?? 0,
          currentReads: data.readCount ?? 0,
          createdAt: new Date(),
          isPasswordProtected: !!data.isPasswordProtected,
          salt: data.salt ?? null,
          encryptedKey: null,
          encryptedKeyIv: data.encryptedKeyIv ?? null,
          kdfVersion: data.kdfVersion ?? null,
          kdfIterations: data.kdfIterations ?? null,
          kdfHash: data.kdfHash ?? null,
        };
        await storage.trackNoteView(noteForAnalytics);
      } catch (error) {
        console.warn("[ROUTES] Skipping analytics for note reveal:", error);
      }
    }

    return applyCorsHeaders(doResponse, request);
  }

  const noteParams = parsePathParams(pathname, "/api/notes/:id");
  if (noteParams && (method === "GET" || method === "DELETE")) {
    const { id } = noteParams;
    const doId = env.SECURE_NOTES.idFromName(id);
    const stub = env.SECURE_NOTES.get(doId);
    const doResponse = await stub.fetch(request);
    return applyCorsHeaders(doResponse, request);
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
    const headers = new Headers(getCorsHeaders(request));
    headers.set("Content-Type", "application/json");
    headers.set("Set-Cookie", adminSessionCookie(expected));
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
  }

  if (pathname === "/api/admin/logout" && method === "POST") {
    const headers = new Headers(getCorsHeaders(request));
    headers.set("Content-Type", "application/json");
    headers.set("Set-Cookie", clearAdminSessionCookie());
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
  }

  // ============================================================================
  // ADMIN: AUDIT LOG ENDPOINTS
  // ============================================================================

  // GET /api/admin/audit-logs - Query audit logs with filtering
  if (pathname === "/api/admin/audit-logs" && method === "GET") {
    const authError = requireAdmin(request, env);
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
    const authError = requireAdmin(request, env);
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
    const authError = requireAdmin(request, env);
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
    const authError = requireAdmin(request, env);
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
    const authError = requireAdmin(request, env);
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
    const authError = requireAdmin(request, env);
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
    const authError = requireAdmin(request, env);
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
    const authError = requireAdmin(request, env);
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
    const authError = requireAdmin(request, env);
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
    const authError = requireAdmin(request, env);
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
    const authError = requireAdmin(request, env);
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
    const authError = requireAdmin(request, env);
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

  if (pathname === "/api/admin/analytics/range" && method === "GET") {
    const authError = requireAdmin(request, env);
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
 * Cleanup expired sessions from the database.
 * Called by scheduled cron trigger.
 */
export async function cleanupExpiredSessions(env: Env): Promise<{ deleted: number; error?: string }> {
  if (!env.AUTH_DB) {
    return { deleted: 0, error: "AUTH_DB not configured" };
  }

  const now = new Date().toISOString();

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
