/**
 * Serve the Vite SPA shell for client-side routes.
 *
 * `_redirects` catch-alls are unreliable with `wrangler pages deploy`
 * (cloudflare/workers-sdk#2671). Use route-specific Functions like this for
 * non-prerendered app paths (/magic, /auth/*, /account/*, …).
 *
 * Prefer `/spa-shell.html` (empty `#root` copied from the Vite build). Fall back
 * to `/index.html` with `#root` emptied — production `index.html` is the
 * prerendered homepage, which must not be shown on /auth, /admin, /premium, etc.
 */
import { emptySpaRoot } from "./emptySpaRoot";

export type SpaShellEnv = {
  ASSETS: { fetch: (request: Request | string) => Promise<Response> };
};

async function fetchAsset(
  env: SpaShellEnv,
  request: Request,
  pathname: string,
): Promise<Response> {
  const assetUrl = new URL(pathname, request.url);
  return env.ASSETS.fetch(
    new Request(assetUrl.toString(), {
      method: request.method === "HEAD" ? "GET" : request.method,
      headers: request.headers,
    }),
  );
}

function asShellResponse(request: Request, source: Response, html: string): Response {
  const headers = new Headers(source.headers);
  headers.set("Cache-Control", "no-cache");
  headers.set("Content-Type", "text/html; charset=utf-8");
  if (request.method === "HEAD") {
    return new Response(null, {
      status: 200,
      statusText: source.statusText,
      headers,
    });
  }
  return new Response(html, {
    status: 200,
    statusText: source.statusText,
    headers,
  });
}

export async function serveSpaShell(context: {
  request: Request;
  env: SpaShellEnv;
  next: () => Promise<Response>;
}): Promise<Response> {
  if (context.request.method !== "GET" && context.request.method !== "HEAD") {
    return context.next();
  }

  const dedicated = await fetchAsset(context.env, context.request, "/spa-shell.html");
  if (dedicated.status === 200) {
    const html = emptySpaRoot(await dedicated.text());
    return asShellResponse(context.request, dedicated, html);
  }

  const indexResponse = await fetchAsset(context.env, context.request, "/index.html");
  if (indexResponse.status !== 200) {
    return indexResponse;
  }

  const html = emptySpaRoot(await indexResponse.text());
  return asShellResponse(context.request, indexResponse, html);
}
