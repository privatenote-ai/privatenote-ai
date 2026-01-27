export class AuthTokenStore {
  private state: DurableObjectState;

  constructor(state: DurableObjectState) {
    this.state = state;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

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
      if (!key) {
        return new Response("Missing key", { status: 400 });
      }
      await this.state.storage.put(key, value, {
        expirationTtl: typeof ttlSeconds === "number" ? ttlSeconds : 900,
      });
      return new Response(JSON.stringify({ ok: true }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    if (url.pathname === "/consume") {
      const { key } = body ?? {};
      if (!key) {
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
