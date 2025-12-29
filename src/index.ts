import { registerRoutes } from "./routes";
import type { Env } from "./types";

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      const url = new URL(request.url);
      const pathname = url.pathname;

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
