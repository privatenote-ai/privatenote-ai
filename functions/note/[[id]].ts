/**
 * Serve the SPA shell for /note/:id (encrypted note viewer).
 *
 * Splat rules in `_redirects` (e.g. `/note/* → /index.html`) are not applied when
 * deploying with `wrangler pages deploy` — see cloudflare/workers-sdk#2671. Without
 * this function, note links hit the static `/* → /404.html` rule and show "Page not found".
 */
type NotePageEnv = {
  ASSETS: { fetch: (request: Request | string) => Promise<Response> };
};

export async function onRequest(context: {
  request: Request;
  env: NotePageEnv;
  next: () => Promise<Response>;
}): Promise<Response> {
  if (context.request.method !== "GET" && context.request.method !== "HEAD") {
    return context.next();
  }

  const indexUrl = new URL("/index.html", context.request.url);
  return context.env.ASSETS.fetch(
    new Request(indexUrl.toString(), {
      method: context.request.method,
      headers: context.request.headers,
    }),
  );
}
