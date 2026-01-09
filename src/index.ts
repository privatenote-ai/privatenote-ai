import { SecureNoteStorage, SecureNoteStorageSql } from "./durable_objects/secure_note_storage";
import { registerRoutes } from "./routes";
import type { Env } from "./types";

export { SecureNoteStorage, SecureNoteStorageSql };

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    console.log(`[WORKER-ENTRY] ========== WORKER ENTRY POINT ==========`);
    console.log(`[WORKER-ENTRY] Request method: ${request.method}`);
    console.log(`[WORKER-ENTRY] Request URL: ${request.url}`);
    console.log(`[WORKER-ENTRY] Request headers:`, JSON.stringify(Object.fromEntries(request.headers.entries())));
    
    try {
      const url = new URL(request.url);
      const pathname = url.pathname;
      console.log(`[WORKER-ENTRY] Pathname: ${pathname}`);

      // Import CORS helpers (defined in routes.ts but we need them here too)
      const ALLOWED_ORIGINS = [
        'https://privatenote-ai.pages.dev',
        'https://privatenote.ai',
        'http://localhost:5000',
        'http://localhost:5173',
        'http://127.0.0.1:5000',
        'http://127.0.0.1:5173',
      ];
      
      function normalizeOrigin(origin: string): string {
        return origin.replace(/\/$/, '');
      }

      function getAllowedOrigin(request: Request): string | null {
        const origin = request.headers.get('Origin');
        if (!origin) return ALLOWED_ORIGINS[0];
        const normalized = normalizeOrigin(origin);
        const normalizedAllowed = ALLOWED_ORIGINS.map(normalizeOrigin);
        if (normalizedAllowed.includes(normalized)) return origin;
        if (normalized.includes('localhost') || normalized.includes('127.0.0.1')) return origin;
        if (normalized.endsWith('.pages.dev')) return origin;
        if (normalized.endsWith('.privatenote.ai')) return origin;
        return null;
      }
      
      function getCSPHeader(): string {
        // Strict CSP to prevent XSS and code injection
        return [
          "default-src 'self'",
          "script-src 'self' https://challenges.cloudflare.com",
          "style-src 'self' 'unsafe-inline'",
          "font-src 'self'",
          "connect-src 'self' https://privatenote-api.marjan-skrobot.workers.dev https://privatenote-ai.pages.dev https://privatenote.ai https://api.openai.com https://challenges.cloudflare.com",
          "img-src 'self' data: https:",
          "base-uri 'self'",
          "form-action 'self'",
          "frame-ancestors 'none'",
          "object-src 'none'",
          "upgrade-insecure-requests",
        ].join("; ");
      }

      function getCorsHeaders(request: Request): Record<string, string> {
        const allowedOrigin = getAllowedOrigin(request);
        return {
          "Access-Control-Allow-Origin": allowedOrigin || ALLOWED_ORIGINS[0],
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, x-admin-token",
          "Content-Security-Policy": getCSPHeader(),
          // Note: We don't include Access-Control-Allow-Credentials because we don't use credentials
        };
      }

      // Handle CORS preflight requests FIRST, before any routing
      if (request.method === "OPTIONS") {
        console.log(`[WORKER-ENTRY] Handling OPTIONS preflight request for: ${pathname}`);
        const origin = request.headers.get('Origin');
        const allowedOrigin = getAllowedOrigin(request);
        
        if (origin && !allowedOrigin) {
          console.log(`[WORKER-ENTRY] ❌ CORS: Origin not allowed: ${origin}`);
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

      // Handle API routes
      if (pathname.startsWith("/api")) {
        console.log(`[WORKER-ENTRY] ✅ Path starts with /api, routing to registerRoutes`);
        return await registerRoutes(request, env);
      }
      
      console.log(`[WORKER-ENTRY] Path does not start with /api`);

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
};
