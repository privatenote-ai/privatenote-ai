import { registerRoutes } from "./routes";
import type { Env } from "./types";

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
              ai: "/api/ai/config",
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
          headers: { "Content-Type": "application/json" }
        }
      );
    }
  },
};
