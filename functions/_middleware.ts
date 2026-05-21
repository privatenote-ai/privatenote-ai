/**
 * When static hosting misses a prerender path, try flat `.html` or `path/index.html`,
 * then the SPA shell for known marketing routes, before returning 404.html.
 */
import { isPublicMarketingPath } from "../shared/publicMarketingPaths";
import { serveSpaShell, type SpaShellEnv } from "./_shared/serveSpaShell";

type MiddlewareEnv = SpaShellEnv;

export async function onRequest(context: {
  request: Request;
  env: MiddlewareEnv;
  next: () => Promise<Response>;
}): Promise<Response> {
  const { request } = context;
  const url = new URL(request.url);
  let normalizedPath = url.pathname.replace(/\/{2,}/g, "/");
  if (normalizedPath !== url.pathname) {
    url.pathname = normalizedPath;
    return Response.redirect(url.toString(), 301);
  }

  // Trailing-slash URLs 404 on static Pages when only `path.html` exists (not `path/index.html`).
  // Canonicals and sitemap use slashless paths; redirect legacy/crawler URLs to the 200 shape.
  if (
    (request.method === "GET" || request.method === "HEAD") &&
    normalizedPath.length > 1 &&
    normalizedPath.endsWith("/")
  ) {
    url.pathname = normalizedPath.replace(/\/+$/, "") || "/";
    return Response.redirect(url.toString(), 301);
  }

  const response = await context.next();
  if (response.status !== 404) {
    return response;
  }

  const { env } = context;
  if (request.method !== "GET" && request.method !== "HEAD") {
    return response;
  }

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

  if (isPublicMarketingPath(pathname)) {
    const shell = await serveSpaShell({ request, env, next: context.next });
    if (shell.status === 200) {
      return shell;
    }
  }

  return response;
}
