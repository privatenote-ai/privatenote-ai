import type { DurableObjectPutOptions } from "@cloudflare/workers-types";

const INTERNAL_HEADER = "X-DO-Internal-Secret";

export class AuthTokenStore {
  private state: DurableObjectState;

  constructor(state: DurableObjectState) {
    this.state = state;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // Only the parent Worker should call this DO. Reject if the internal
    // header is missing — prevents direct external access if the binding
    // is ever accidentally exposed via a public route.
    const secret = request.headers.get(INTERNAL_HEADER);
    if (!secret || secret.length < 16) {
      return new Response("Forbidden", { status: 403 });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return new Response("Invalid JSON", { status: 400 });
    }

    if (url.pathname === "/store") {
      const { key, value, ttlSeconds } = body ?? {};
      if (!key || typeof key !== "string") {
        return new Response("Missing key", { status: 400 });
      }
      const ttl = typeof ttlSeconds === "number" && ttlSeconds > 0 ? Math.min(ttlSeconds, 86400) : 900;
      // TTL for token entries; runtime supports `expirationTtl` even when stripped from some .d.ts surfaces.
      await this.state.storage.put(key, value, {
        expirationTtl: ttl,
      } as DurableObjectPutOptions);
      return new Response(JSON.stringify({ ok: true }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    if (url.pathname === "/consume") {
      const { key } = body ?? {};
      if (!key || typeof key !== "string") {
        return new Response("Missing key", { status: 400 });
      }
      const value = await this.state.storage.get(key);
      if (!value) {
        return new Response(JSON.stringify({ ok: false }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
      await this.state.storage.delete(key);
      return new Response(JSON.stringify({ ok: true, value }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("Not Found", { status: 404 });
  }
}
