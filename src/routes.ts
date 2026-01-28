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

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'https://privatenote-ai.pages.dev',
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
  TTL_SECONDS: 60 * 60 * 24 * 14, // 14 days
  INACTIVITY_SECONDS: 60 * 60 * 48, // 48 hours
  ROTATE_SECONDS: 60 * 60 * 24, // 24 hours
};

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

// Get Content Security Policy header
function getCSPHeader(): string {
  // Strict CSP to prevent XSS and code injection
  // Note: 'unsafe-inline' for styles is needed for React/Vite, but we avoid it for scripts
  return [
    "default-src 'self'",
    "script-src 'self' https://challenges.cloudflare.com 'wasm-unsafe-eval'", // Turnstile + WebAssembly for WebLLM
    "style-src 'self' 'unsafe-inline'", // React inline styles
    "font-src 'self'",
    "connect-src 'self' https://privatenote-api.marjan-skrobot.workers.dev https://privatenote-ai.pages.dev https://privatenote.ai https://api.openai.com https://challenges.cloudflare.com https://huggingface.co https://*.huggingface.co https://*.hf.co https://raw.githubusercontent.com", // API endpoints + WebLLM model downloads + WASM libraries + HuggingFace CAS
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
    // Credentials are enabled for session cookies; ensure Origin is specific (not *)
  };

  if (origin) {
    headers["Access-Control-Allow-Origin"] = allowedOrigin ?? "null";
    headers["Vary"] = "Origin";
  }

  return headers;
}

// Get content type based on file extension
function getContentType(path: string): string {
  if (path.endsWith('.json')) return 'application/json';
  if (path.endsWith('.bin')) return 'application/octet-stream';
  if (path.endsWith('.wasm')) return 'application/wasm';
  if (path.endsWith('.model')) return 'application/octet-stream';
  return 'application/octet-stream';
}

// Serve model files from R2 bucket
async function serveModelFile(request: Request, env: Env): Promise<Response> {
  if (!env.WEBLLM_MODELS) {
    console.error("[MODELS] R2 bucket WEBLLM_MODELS not configured");
    const headers = new Headers();
    const allowedOrigin = getAllowedOrigin(request);
    if (allowedOrigin) {
      headers.set('Access-Control-Allow-Origin', allowedOrigin);
    }
    headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    return new Response('Model storage not configured', { status: 503, headers });
  }

  const url = new URL(request.url);
  // Remove /models/ prefix to get the object key
  let objectKey = url.pathname.replace(/^\/models\//, '');
  
  // Handle HuggingFace-style paths: /resolve/main/filename -> filename
  // WebLLM sometimes requests paths like: gemma-3-270m-it-mlc/resolve/main/mlc-chat-config.json
  // But in R2 we store: gemma-3-270m-it-mlc/mlc-chat-config.json
  objectKey = objectKey.replace(/\/resolve\/main\//g, '/');
  
  if (!objectKey || objectKey === '') {
    const headers = new Headers();
    const allowedOrigin = getAllowedOrigin(request);
    if (allowedOrigin) {
      headers.set('Access-Control-Allow-Origin', allowedOrigin);
    }
    headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    return new Response('Invalid model path', { status: 400, headers });
  }

  console.log(`[MODELS] Serving model file: ${objectKey} (original path: ${url.pathname})`);

  try {
    // Get object from R2
    const object = await env.WEBLLM_MODELS.get(objectKey);

    if (!object) {
      console.warn(`[MODELS] File not found: ${objectKey}`);
      // Set CORS headers even on 404
      const headers = new Headers();
      const allowedOrigin = getAllowedOrigin(request);
      if (allowedOrigin) {
        headers.set('Access-Control-Allow-Origin', allowedOrigin);
      }
      headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      headers.set('Content-Type', 'text/plain');
      return new Response('Model file not found', { status: 404, headers });
    }

    // Set appropriate headers for caching and CORS
    const headers = new Headers();
    headers.set('Content-Type', getContentType(objectKey));
    
    // Long cache headers for immutable model files (1 year)
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    
    // CORS headers
    const allowedOrigin = getAllowedOrigin(request);
    if (allowedOrigin) {
      headers.set('Access-Control-Allow-Origin', allowedOrigin);
    }
    headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    
    // Support range requests for large files (required for model shards)
    if (object.range) {
      headers.set('Accept-Ranges', 'bytes');
    }

    // Handle range requests (for partial downloads)
    const rangeHeader = request.headers.get('Range');
    if (rangeHeader && object.range) {
      const rangeMatch = rangeHeader.match(/bytes=(\d+)-(\d*)/);
      if (rangeMatch) {
        const start = parseInt(rangeMatch[1], 10);
        const end = rangeMatch[2] ? parseInt(rangeMatch[2], 10) : undefined;
        
        // Get partial content
        const range = { offset: start, length: end ? end - start + 1 : undefined };
        const partialObject = await env.WEBLLM_MODELS.get(objectKey, { range });
        
        if (partialObject) {
          const contentLength = partialObject.size;
          const totalSize = object.size;
          headers.set('Content-Range', `bytes ${start}-${start + contentLength - 1}/${totalSize}`);
          headers.set('Content-Length', contentLength.toString());
          
          return new Response(partialObject.body, {
            status: 206, // Partial Content
            headers,
          });
        }
      }
    }

    // Set content length for full file
    if (object.size) {
      headers.set('Content-Length', object.size.toString());
    }

    console.log(`[MODELS] ✅ Serving file: ${objectKey} (${object.size} bytes)`);

    return new Response(object.body, {
      headers,
    });
  } catch (error) {
    console.error(`[MODELS] Error serving file ${objectKey}:`, error);
    // Set CORS headers even on error
    const errorHeaders = new Headers();
    const allowedOrigin = getAllowedOrigin(request);
    if (allowedOrigin) {
      errorHeaders.set('Access-Control-Allow-Origin', allowedOrigin);
    }
    errorHeaders.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    errorHeaders.set('Content-Type', 'text/plain');
    return new Response('Internal server error', { status: 500, headers: errorHeaders });
  }
}

// Helper to create JSON response with CORS headers
function jsonResponse(data: any, status: number = 200, request?: Request): Response {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(request ? getCorsHeaders(request) : {
      "Access-Control-Allow-Origin": ALLOWED_ORIGINS[0],
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, x-admin-token",
    }),
  };
  
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

function getExpectedRpId(request: Request): string {
  const origin = request.headers.get("Origin");
  if (origin) {
    try {
      const hostname = new URL(origin).hostname;
      if (hostname.includes("localhost") || hostname.includes("127.0.0.1")) {
        return hostname;
      }
      if (hostname.endsWith(".pages.dev")) {
        return hostname;
      }
      if (hostname === CANONICAL_RPID || hostname.endsWith(`.${CANONICAL_RPID}`)) {
        return CANONICAL_RPID;
      }
      return hostname;
    } catch {
      return new URL(request.url).hostname;
    }
  }
  return new URL(request.url).hostname;
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

async function storeMagicLink(env: Env, token: string, payload: Record<string, unknown>) {
  const kv = getAuthKv(env);
  if (!kv) return false;
  const tokenHash = await sha256Base64Url(token);
  await kv.put(`${AUTH_MAGIC_LINK.PREFIX}${tokenHash}`, JSON.stringify(payload), {
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
    return JSON.parse(value) as Record<string, unknown>;
  } catch {
    return null;
  }
}

async function createSession(env: Env, userId: string): Promise<{ sessionId: string } | null> {
  if (!env.AUTH_DB) return null;
  const sessionId = randomId(32);
  const sessionHash = await sha256Base64Url(sessionId);
  const id = crypto.randomUUID();
  const nowIso = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 1000 * SESSION_POLICY.TTL_SECONDS).toISOString();
  await env.AUTH_DB.prepare(
    "INSERT INTO sessions (id, session_id_hash, user_id, expires_at, created_at, last_seen_at) VALUES (?, ?, ?, ?, ?, ?)"
  )
    .bind(id, sessionHash, userId, expiresAt, nowIso, nowIso)
    .run();
  return { sessionId };
}

function sessionCookie(sessionId: string): string {
  return `pn_session=${sessionId}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${SESSION_POLICY.TTL_SECONDS}`;
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

async function getSessionFromRequest(
  env: Env,
  request: Request,
  options: { rotate?: boolean } = {}
): Promise<{ id: string; email: string | null; newSessionId?: string } | null> {
  if (!env.AUTH_DB) return null;
  const cookies = parseCookies(request.headers.get("Cookie"));
  const sessionId = cookies["pn_session"];
  if (!sessionId) return null;
  const sessionHash = await sha256Base64Url(sessionId);
  const row = await env.AUTH_DB.prepare(
    `SELECT sessions.user_id as user_id, users.email as email, sessions.expires_at as expires_at, sessions.revoked_at as revoked_at
            , sessions.last_seen_at as last_seen_at, sessions.created_at as created_at
     FROM sessions
     LEFT JOIN users ON users.id = sessions.user_id
     WHERE sessions.session_id_hash = ?
     LIMIT 1`
  )
    .bind(sessionHash)
    .first<{ user_id: string; email: string | null; expires_at: string | null; revoked_at: string | null; last_seen_at: string | null; created_at: string | null }>();

  if (!row || row.revoked_at) {
    return null;
  }
  if (row.expires_at && new Date(row.expires_at).getTime() < Date.now()) {
    return null;
  }

  const now = Date.now();
  const lastSeenAt = row.last_seen_at || row.created_at;
  const lastSeenMs = lastSeenAt ? new Date(lastSeenAt).getTime() : now;

  if (now - lastSeenMs > SESSION_POLICY.INACTIVITY_SECONDS * 1000) {
    await env.AUTH_DB.prepare("UPDATE sessions SET revoked_at = ? WHERE session_id_hash = ?")
      .bind(new Date().toISOString(), sessionHash)
      .run();
    return null;
  }

  let newSessionId: string | undefined;
  if (options.rotate && now - lastSeenMs > SESSION_POLICY.ROTATE_SECONDS * 1000) {
    const rotated = await createSession(env, row.user_id);
    if (rotated?.sessionId) {
      newSessionId = rotated.sessionId;
      await env.AUTH_DB.prepare("UPDATE sessions SET revoked_at = ? WHERE session_id_hash = ?")
        .bind(new Date().toISOString(), sessionHash)
        .run();
    }
  } else {
    await env.AUTH_DB.prepare("UPDATE sessions SET last_seen_at = ? WHERE session_id_hash = ?")
      .bind(new Date().toISOString(), sessionHash)
      .run();
  }

  return { id: row.user_id, email: row.email ?? null, newSessionId };
}

async function getOrCreateUser(env: Env, email?: string | null): Promise<{ id: string } | null> {
  if (!env.AUTH_DB) return null;
  const normalizedEmail = email?.trim().toLowerCase() || null;
  if (normalizedEmail) {
    const existing = await env.AUTH_DB.prepare(
      "SELECT id FROM users WHERE email = ? LIMIT 1"
    )
      .bind(normalizedEmail)
      .first<{ id: string }>();
    if (existing?.id) {
      return { id: existing.id };
    }
  }
  const id = crypto.randomUUID();
  await env.AUTH_DB.prepare(
    "INSERT INTO users (id, email, email_verified, created_at) VALUES (?, ?, ?, ?)"
  )
    .bind(id, normalizedEmail, normalizedEmail ? 0 : 0, new Date().toISOString())
    .run();
  return { id };
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
      body = await request.json();
    } catch {
      return jsonResponse({ message: "Invalid JSON" }, 400, request);
    }
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : null;
    if (!env.AUTH_DB) {
      return jsonResponse({ message: "Auth database not configured" }, 501, request);
    }
    const user = await getOrCreateUser(env, email);
    if (!user) {
      return jsonResponse({ message: "User creation failed" }, 500, request);
    }
    const credentials = await env.AUTH_DB.prepare(
      "SELECT credential_id, transports FROM webauthn_credentials WHERE user_id = ?"
    )
      .bind(user.id)
      .all<{ credential_id: string; transports: string | null }>();

    const options = generateRegistrationOptions({
      rpName: "PrivateNote.ai",
      rpID: getExpectedRpId(request),
      userID: user.id,
      userName: email || `privatenote-${user.id.slice(0, 6)}`,
      userDisplayName: email || "PrivateNote User",
      attestationType: "none",
      authenticatorSelection: {
        userVerification: "preferred",
        residentKey: "preferred",
      },
      excludeCredentials: (credentials.results || []).map((cred) => ({
        id: base64UrlToBytes(cred.credential_id),
        type: "public-key",
        transports: cred.transports ? (JSON.parse(cred.transports) as string[]) : undefined,
      })),
    });

    const challengeFallback = randomId(32);
    const normalizedOptions = {
      ...options,
      challenge: coerceWebAuthnIdToBase64Url(options.challenge, "challenge", challengeFallback),
      user: options.user
        ? {
            ...options.user,
            id: coerceWebAuthnIdToBase64Url(options.user.id, "user.id"),
          }
        : undefined,
      excludeCredentials: options.excludeCredentials?.map((cred) => ({
        ...cred,
        id: coerceWebAuthnIdToBase64Url(cred.id, "excludeCredentials.id"),
      })),
    };

    const challengeId = randomId(16);
    const stored = await storeAuthChallenge(env, challengeId, {
      type: "register",
      challenge: normalizedOptions.challenge,
      userId: user.id,
      email,
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

    const expectedChallenge = String(challengeRecord.challenge || "");
    const expectedOrigin = getExpectedOrigin(request);
    if (!expectedOrigin) {
      return jsonResponse({ message: "Origin not allowed" }, 403, request);
    }
    const expectedRPID = getExpectedRpId(request);

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
    const credentialId = base64UrlEncode(credentialID);
    const publicKey = base64UrlEncode(credentialPublicKey);
    const transports = Array.isArray(credential?.transports)
      ? credential.transports
      : Array.isArray(credential?.response?.transports)
        ? credential.response.transports
        : null;

    await env.AUTH_DB.prepare(
      "INSERT INTO webauthn_credentials (id, user_id, credential_id, public_key, counter, transports, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
    )
      .bind(
        crypto.randomUUID(),
        userId,
        credentialId,
        publicKey,
        counter ?? 0,
        transports ? JSON.stringify(transports) : null,
        new Date().toISOString()
      )
      .run();

    const session = await createSession(env, userId);
    const headers = new Headers(getCorsHeaders(request));
    headers.set("Content-Type", "application/json");
    if (session?.sessionId) {
      headers.set("Set-Cookie", sessionCookie(session.sessionId));
    }
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
  }

  if (pathname === "/api/auth/webauthn/login/options" && method === "POST") {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ message: "Invalid JSON" }, 400, request);
    }
    if (!env.AUTH_DB) {
      return jsonResponse({ message: "Auth database not configured" }, 501, request);
    }

    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : null;
    let allowCredentials: Array<{ id: string; type: "public-key"; transports?: string[] }> = [];

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

        allowCredentials = (creds.results || []).map((cred) => ({
          id: cred.credential_id,
          type: "public-key",
          transports: cred.transports ? (JSON.parse(cred.transports) as string[]) : undefined,
        }));
      }
    }

    const options = generateAuthenticationOptions({
      rpID: getExpectedRpId(request),
      allowCredentials: allowCredentials.length
        ? allowCredentials.map((cred) => ({
            ...cred,
            id: base64UrlToBytes(cred.id),
          }))
        : undefined,
      userVerification: "preferred",
    });

    const challengeFallback = randomId(32);
    const normalizedOptions = {
      ...options,
      challenge: coerceWebAuthnIdToBase64Url(options.challenge, "challenge", challengeFallback),
      allowCredentials: options.allowCredentials?.map((cred) => ({
        ...cred,
        id: coerceWebAuthnIdToBase64Url(cred.id, "allowCredentials.id"),
      })),
    };

    const challengeId = randomId(16);
    const stored = await storeAuthChallenge(env, challengeId, {
      type: "login",
      challenge: normalizedOptions.challenge,
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
    const expectedRPID = getExpectedRpId(request);

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
          credentialID: base64UrlToBytes(storedCredential.credential_id),
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
      "UPDATE webauthn_credentials SET counter = ? WHERE id = ?"
    )
      .bind(newCounter, storedCredential.id)
      .run();

    const session = await createSession(env, storedCredential.user_id);
    const headers = new Headers(getCorsHeaders(request));
    headers.set("Content-Type", "application/json");
    if (session?.sessionId) {
      headers.set("Set-Cookie", sessionCookie(session.sessionId));
    }
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
  }

  if (pathname === "/api/auth/magic/send" && method === "POST") {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ message: "Invalid JSON" }, 400, request);
    }
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : null;
    if (!email) {
      return jsonResponse({ message: "Email is required" }, 400, request);
    }
    const isLocal = url.hostname.includes("localhost") || url.hostname.includes("127.0.0.1");
    if (!env.TURNSTILE_SECRET_KEY && !isLocal) {
      return jsonResponse({ message: "Turnstile not configured" }, 501, request);
    }
    if (!isLocal) {
      const isHuman = await verifyTurnstile(body?.turnstileToken, request, env);
      if (!isHuman) {
        return jsonResponse({ message: "Human verification required" }, 403, request);
      }
    }
    const token = randomId(32);
    const stored = await storeMagicLink(env, token, { email, createdAt: Date.now() });
    if (!stored) {
      return jsonResponse({ message: "Magic link storage not configured" }, 501, request);
    }

    const magicUrl = `${url.origin}/auth/magic?token=${encodeURIComponent(token)}`;
    return jsonResponse(
      {
        ok: true,
        message: "Magic link sent (email provider not wired).",
        ...(isLocal ? { debugMagicLink: magicUrl } : {}),
      },
      200,
      request
    );
  }

  if (pathname === "/api/auth/magic/consume" && method === "GET") {
    const token = url.searchParams.get("token");
    if (!token) {
      return jsonResponse({ message: "Missing token" }, 400, request);
    }
    const payload = await consumeMagicLink(env, token);
    if (!payload) {
      return jsonResponse({ message: "Token expired or invalid" }, 400, request);
    }
    if (!env.AUTH_DB) {
      return jsonResponse({ message: "Auth database not configured" }, 501, request);
    }
    const user = await getOrCreateUser(env, payload.email as string | undefined);
    if (!user) {
      return jsonResponse({ message: "User creation failed" }, 500, request);
    }
    const session = await createSession(env, user.id);
    const headers = new Headers(getCorsHeaders(request));
    headers.set("Content-Type", "application/json");
    if (session?.sessionId) {
      headers.set("Set-Cookie", sessionCookie(session.sessionId));
    }
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
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
    headers.set("Set-Cookie", "pn_session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0");
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
  }

  if (pathname === "/api/auth/session" && method === "GET") {
    const session = await getSessionFromRequest(env, request, { rotate: true });
    if (!session) {
      return jsonResponse({ authenticated: false }, 200, request);
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
  // Try to get IP from Cloudflare headers
  const cfConnectingIp = request.headers.get('CF-Connecting-IP');
  if (cfConnectingIp) {
    return cfConnectingIp;
  }
  
  // Fallback to user agent + origin (less reliable)
  const userAgent = request.headers.get('User-Agent') || 'unknown';
  const origin = request.headers.get('Origin') || 'unknown';
  return `${origin}:${userAgent}`.substring(0, 100);
}

// Helper to check admin authentication
function requireAdmin(request: Request): Response | null {
  const adminToken = request.headers.get("x-admin-token");
  
  if (!adminToken || adminToken !== "admin-secret-token") {
    return jsonResponse({ message: "Unauthorized - Admin access required" }, 401, request);
  }
  
  return null;
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

export async function registerRoutes(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const method = request.method;
  const isAiRequest = pathname.startsWith("/api/ai/");

  console.log(`[ROUTES] ========== REGISTER ROUTES ==========`);
  console.log(`[ROUTES] Request method: ${method}`);
  console.log(`[ROUTES] Request URL: ${request.url}`);
  if (!isAiRequest) {
    console.log(`[ROUTES] Request headers:`, JSON.stringify(Object.fromEntries(request.headers.entries())));
  } else {
    console.log(`[ROUTES] Request headers: [redacted for AI request]`);
  }
  
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

  const authResponse = await handleAuthRoutes(request, env);
  if (authResponse) {
    return authResponse;
  }
  
  // Serve WebLLM models from R2
  if (pathname.startsWith("/models/") && method === "GET") {
    return serveModelFile(request, env);
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

  // Blog API routes - Admin
  if (pathname === "/api/admin/blog" && method === "GET") {
    const authError = requireAdmin(request);
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
    const authError = requireAdmin(request);
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
    const authError = requireAdmin(request);
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
    const authError = requireAdmin(request);
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
    const authError = requireAdmin(request);
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
    const authError = requireAdmin(request);
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
    const authError = requireAdmin(request);
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
    const authError = requireAdmin(request);
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
    const authError = requireAdmin(request);
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
    const authError = requireAdmin(request);
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
    const authError = requireAdmin(request);
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
