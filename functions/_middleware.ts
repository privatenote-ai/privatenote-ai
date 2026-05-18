/**
 * When static hosting misses a prerender path, try flat `.html` or `path/index.html`
 * before returning 404.html (fixes crawler 404s if only directory indexes were deployed).
 */
type MiddlewareEnv = {
  ASSETS: { fetch: (request: Request | string) => Promise<Response> };
};

export async function onRequest(context: {
  request: Request;
  env: MiddlewareEnv;
  next: () => Promise<Response>;
}): Promise<Response> {
  const response = await context.next();
  if (response.status !== 404) {
    return response;
  }

  const { request, env } = context;
  if (request.method !== "GET" && request.method !== "HEAD") {
    return response;
  }

  const url = new URL(request.url);
  const pathname = url.pathname;

  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/assets/") ||
    pathname.startsWith("/note/") ||
    /\.[a-z0-9]+$/i.test(pathname)
  ) {
    return response;
  }

  const bare = pathname.replace(/\/$/, "");
  if (!bare || bare === "/") {
    return response;
  }

  const candidates = [`${bare}.html`, `${bare}/index.html`];
  for (const candidate of candidates) {
    const assetUrl = new URL(candidate, url.origin);
    const assetResponse = await env.ASSETS.fetch(
      new Request(assetUrl.toString(), {
        method: request.method,
        headers: request.headers,
      }),
    );
    if (assetResponse.status === 200) {
      return assetResponse;
    }
  }

  return response;
}
