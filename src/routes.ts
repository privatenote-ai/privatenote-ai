import { CompositeStorage } from "./storage";
import type { Note } from "@shared/schema";
import { insertBlogPostSchema, updateBlogPostSchema, AnalyticsMetricsType } from "@shared/schema";
import { parseNoteExpirySecondsFromBody } from "@shared/noteExpiry";
import { isValidNoteId } from "@shared/noteId";
import type { KVNamespace } from "@cloudflare/workers-types";
import type { Env } from "./types";
import {
  DEFAULT_CORS_ORIGIN,
  getAllowedOriginFromRequest,
  isTrustedBrowserOrigin,
  normalizeOrigin,
  SESSION_COOKIE_PREVIEW_NAME,
  SESSION_COOKIE_PROD_NAME,
} from "./trustedOrigins";
import { getApiContentSecurityPolicy, SECURITY_HEADERS } from "./httpSecurity";
import {
  cleanupAuditLogs,
  cleanupExpiredSessions,
  clearTurnstileChallengeRequired,
  getMagicLinkIssuanceDiagnostics,
  getSessionFromRequest,
  getTurnstileChallengeRequired,
  handleAuthRoutes,
  processPendingAccountDeletions,
  recordAccountActivity,
  setTurnstileChallengeRequired,
  bumpAiNoteCountAndMaybeChallenge,
} from "./routes/auth";

export { cleanupAuditLogs, cleanupExpiredSessions, processPendingAccountDeletions };

const getAllowedOrigin = getAllowedOriginFromRequest;

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

function jsonResponse(data: any, status: number = 200, request?: Request): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...(request ? getCorsHeaders(request) : { "Access-Control-Allow-Origin": DEFAULT_CORS_ORIGIN }),
    },
  });
}

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

function parseCookies(header: string | null): Record<string, string> {
  if (!header) return {};
  return header.split(";").reduce((acc, part) => {
    const [key, ...rest] = part.trim().split("=");
    if (!key) return acc;
    acc[key] = decodeURIComponent(rest.join("="));
    return acc;
  }, {} as Record<string, string>);
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

/**
 * Abuse/rate-limit bucket: IP + first-party `pn_client_id` when both exist (reduces shared-NAT collisions).
 * No fingerprinting; cookie is HttpOnly and used only for this purpose.
 */
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
  const cookies = request.headers.get("Cookie") || "";
  const hasSessionCookie =
    cookies.includes(SESSION_COOKIE_PROD_NAME + "=") || cookies.includes(SESSION_COOKIE_PREVIEW_NAME + "=");
  if (!hasSessionCookie) {
    return null;
  }

  const path = new URL(request.url).pathname;
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

/** `YYYY-MM-DD` interpreted as UTC midnight for analytics KV day keys. */
function parseAnalyticsUtcDayParam(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }
  const d = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export async function registerRoutes(request: Request, env: Env): Promise<Response> {
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

  // Rate limits: calm global POST cap + tighter per-route budgets (no fingerprinting).
  if (request.method === "POST") {
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
  const authResponse = await handleAuthRoutes(request, env);
  console.log(`[ROUTES] handleAuthRoutes returned: ${authResponse ? authResponse.status : 'null'}`);
  if (authResponse) {
    return authResponse;
  }

  const analyticsKv = env.ANALYTICS_KV || env.NOTES_KV;
  const storage = new CompositeStorage(env.NOTES_KV, analyticsKv);
  console.log(`[ROUTES] Storage initialized`);

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

      // Honeypot: legitimate browsers always send _hp as an empty string.
      // A non-empty value means a bot filled the hidden field.
      if (typeof requestBody?._hp === "string" && requestBody._hp !== "") {
        console.warn("[ROUTES] Honeypot triggered — rejecting bot request");
        // Silently return a fake 200 so bots don't know they were blocked
        return jsonResponse({ id: crypto.randomUUID() }, 200, request);
      }
      const expiryParsed = parseNoteExpirySecondsFromBody(requestBody?.expirySeconds);
      const maxReads = Number(requestBody?.maxReads ?? 1);
      if (requestBody?.content && requestBody?.iv && expiryParsed.ok) {
        noteForAnalytics = {
          id: "pending",
          content: requestBody.content,
          iv: requestBody.iv,
          aad: requestBody?.aad ?? null,
          expiresAt: new Date(Date.now() + expiryParsed.seconds * 1000),
          maxReads,
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
      }) as any,
    );

    if (doResponse.ok && noteForAnalytics) {
      noteForAnalytics.id = id;
      const rawReferrer = typeof requestBody?.referrer === "string" ? requestBody.referrer : null;
      const sanitizedReferrer = rawReferrer
        ? rawReferrer.replace(/[^a-zA-Z0-9.\-_ ]/g, "").slice(0, 60).trim() || null
        : null;
      await storage.trackNoteCreation(noteForAnalytics, {
        aiEnhanced: aiMode,
        referrer: sanitizedReferrer,
      });
    }

    if (doResponse.ok && env.AUTH_DB) {
      const sessionForUsage = await getSessionFromRequest(env, request, { rotate: false });
      if (sessionForUsage) {
        await recordAccountActivity(
          env,
          sessionForUsage.id,
          aiMode ? "ai_note_created" : "note_created",
          id,
        );
      }
    }

    if (doResponse.ok && aiMode) {
      await bumpAiNoteCountAndMaybeChallenge(env, getClientIdentifier(request));
    }

    if (doResponse.ok && requestedId) {
      await clearReservation(env, requestedId);
    }

    return applyCorsHeaders(doResponse as unknown as Response, request);
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

    const doId = env.SECURE_NOTES.idFromName(id);
    const stub = env.SECURE_NOTES.get(doId);
    const doResponse = await stub.fetch(request as any);

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
      try {
        type RevealJson = {
          content?: string;
          iv?: string;
          aad?: string | null;
          expiresAt?: string;
          maxReads?: number;
          readCount?: number;
          isPasswordProtected?: boolean;
          salt?: string | null;
          encryptedKeyIv?: string | null;
        };
        const data = (await doResponse.clone().json()) as RevealJson;
        const noteForAnalytics: Note = {
          id,
          content: data.content ?? "",
          iv: data.iv ?? "",
          aad: data.aad ?? null,
          expiresAt: new Date(data.expiresAt ?? Date.now()),
          maxReads: data.maxReads ?? 0,
          currentReads: data.readCount ?? 0,
          createdAt: new Date(),
          isPasswordProtected: !!data.isPasswordProtected,
          salt: data.salt ?? null,
          encryptedKey: null,
          encryptedKeyIv: data.encryptedKeyIv ?? null,
          kdfVersion: null,
          kdfIterations: null,
          kdfPolicyTag: null,
        };
        await storage.trackNoteView(noteForAnalytics);
      } catch (error) {
        console.warn("[ROUTES] Skipping analytics for note reveal:", error);
      }
    }

    return applyCorsHeaders(doResponse as unknown as Response, request);
  }

  const noteParams = parsePathParams(pathname, "/api/notes/:id");
  if (noteParams && (method === "GET" || method === "DELETE")) {
    const { id } = noteParams;
    const doId = env.SECURE_NOTES.idFromName(id);
    const stub = env.SECURE_NOTES.get(doId);
    const doResponse = await stub.fetch(request as any);
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

  if (pathname === "/api/admin/health/auth" && method === "GET") {
    const authError = requireAdmin(request, env);
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

  if (pathname === "/api/admin/analytics/aggregate" && method === "GET") {
    const authError = requireAdmin(request, env);
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
