/**
 * Serve the Vite SPA shell (index.html) for client-side routes.
 *
 * `_redirects` catch-alls are unreliable with `wrangler pages deploy`
 * (cloudflare/workers-sdk#2671). Use route-specific Functions like this for
 * non-prerendered app paths (/magic, /auth/*, /account/*, …).
 */
export type SpaShellEnv = {
  ASSETS: { fetch: (request: Request | string) => Promise<Response> };
};

export async function serveSpaShell(context: {
  request: Request;
  env: SpaShellEnv;
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
