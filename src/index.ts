import { SecureNoteStorage, SecureNoteStorageSql } from "./durable_objects/secure_note_storage";
import { AuthTokenStore } from "./durable_objects/auth_token_store";
import { registerRoutes, cleanupAuditLogs, cleanupExpiredSessions } from "./routes";
import type { Env } from "./types";

// Export both for migration compatibility
// SecureNoteStorage is deleted in v3 migration but needed for migration history
export { SecureNoteStorage, SecureNoteStorageSql, AuthTokenStore };

const ALLOWED_ORIGINS = [
  'https://privatenote-ai.pages.dev',
  'https://privatenote.ai',
  'http://localhost:5000',
  'http://localhost:5173',
  'http://127.0.0.1:5000',
  'http://127.0.0.1:5173',
];

const normalizeOrigin = (origin: string): string => origin.replace(/\/$/, '');

const getAllowedOrigin = (request: Request): string | null => {
  const origin = request.headers.get('Origin');
  if (!origin) return ALLOWED_ORIGINS[0];
  const normalized = normalizeOrigin(origin);
  const normalizedAllowed = ALLOWED_ORIGINS.map(normalizeOrigin);
  if (normalizedAllowed.includes(normalized)) return origin;
  if (normalized.includes('localhost') || normalized.includes('127.0.0.1')) return origin;
  if (normalized.endsWith('.pages.dev')) return origin;
  if (normalized.endsWith('.privatenote.ai')) return origin;
  return null;
};

const getCSPHeader = (): string =>
  [
    "default-src 'self'",
    "script-src 'self' https://challenges.cloudflare.com 'wasm-unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self'",
    "connect-src 'self' https://privatenote-api.marjan-skrobot.workers.dev https://privatenote-ai.pages.dev https://privatenote.ai https://api.openai.com https://challenges.cloudflare.com https://huggingface.co https://*.huggingface.co https://*.hf.co https://raw.githubusercontent.com",
    "img-src 'self' data: https:",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ].join("; ");

const getCorsHeaders = (request: Request): Record<string, string> => {
  const allowedOrigin = getAllowedOrigin(request);
  return {
    "Access-Control-Allow-Origin": allowedOrigin || ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-admin-token",
    "Access-Control-Allow-Credentials": "true",
    "Content-Security-Policy": getCSPHeader(),
    // Credentials enabled for session cookies; Origin must be explicit (not *)
  };
};

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    console.log(`[WORKER-ENTRY] ${request.method} ${request.url}`);

    try {
      const url = new URL(request.url);
      const pathname = url.pathname;

      // Handle CORS preflight requests FIRST, before any routing
      if (request.method === "OPTIONS") {
        const origin = request.headers.get('Origin');
        const allowedOrigin = getAllowedOrigin(request);

        if (origin && !allowedOrigin) {
          return new Response(JSON.stringify({ error: 'CORS policy: Origin not allowed' }), {
            status: 403,
            headers: {
              "Content-Type": "application/json",
              ...getCorsHeaders(request),
            },
          });
        }

        return new Response(null, {
          status: 204,
          headers: {
            ...getCorsHeaders(request),
            "Access-Control-Max-Age": "86400",
          },
        });
      }

      // Handle model serving routes (before API routes)
      if (pathname.startsWith("/models/")) {
        return await registerRoutes(request, env);
      }

      // Handle API routes
      if (pathname.startsWith("/api")) {
        return await registerRoutes(request, env);
      }

      // For non-API routes, return helpful message (frontend should be served by Cloudflare Pages)
      if (pathname === "/") {
        return new Response(
          JSON.stringify({
            message: "PrivateNote API Worker",
            description: "This Worker handles API requests only. Use /api/* endpoints.",
            endpoints: {
              notes: "/api/notes",
              blog: "/api/blog",
              ai: "/api/ai/enhance",
              admin: "/api/admin/*"
            }
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" }
          }
        );
      }

      return new Response("Not Found", { status: 404 });
    } catch (error) {
      console.error("Error handling request:", error);
      return new Response(
        JSON.stringify({
          message: error instanceof Error ? error.message : "Internal Server Error"
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...getCorsHeaders(request),
          }
        }
      );
    }
  },

  /**
   * Scheduled handler for cron triggers.
   * Runs daily cleanup tasks for GDPR compliance and database maintenance.
   */
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    console.log(`[CRON] Scheduled event triggered at ${new Date().toISOString()}`);
    console.log(`[CRON] Cron trigger: ${event.cron}`);

    try {
      // Cleanup audit logs (GDPR compliance - data minimization)
      const auditResult = await cleanupAuditLogs(env);
      console.log(`[CRON] Audit log cleanup: deleted ${auditResult.deleted} entries${auditResult.error ? `, error: ${auditResult.error}` : ''}`);

      // Cleanup expired/revoked sessions
      const sessionResult = await cleanupExpiredSessions(env);
      console.log(`[CRON] Session cleanup: deleted ${sessionResult.deleted} entries${sessionResult.error ? `, error: ${sessionResult.error}` : ''}`);

      console.log(`[CRON] Scheduled tasks completed successfully`);
    } catch (error) {
      console.error(`[CRON] Error in scheduled handler:`, error);
    }
  },
};
