/**
 * When static hosting misses a prerender path, try flat `.html` or `path/index.html`,
 * then the SPA shell for known marketing routes, before returning 404.html.
 */
import { resolveLegacyBlogPostRedirect } from "../shared/localizedBlogSlugs";
import { isPublicMarketingPath } from "../shared/publicMarketingPaths";
import { isLocaleHomeSegment, NON_ENGLISH_LANGUAGE_CODES } from "../shared/supportedLanguages";
import { applyHtmlPageSecurity } from "./_shared/applyHtmlPageSecurity";
import { serveSpaShell, type SpaShellEnv } from "./_shared/serveSpaShell";

type MiddlewareEnv = SpaShellEnv;

const LOCALE_HOME_WITH_SLASH = new Set(
  NON_ENGLISH_LANGUAGE_CODES.map((code) => `/${code}/`),
);

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

  // /note without an id is not a route — redirect to home (also in client/public/_redirects).
  if (
    (request.method === "GET" || request.method === "HEAD") &&
    normalizedPath === "/note"
  ) {
    url.pathname = "/";
    return Response.redirect(url.toString(), 301);
  }

  const legacyBlogRedirect = resolveLegacyBlogPostRedirect(normalizedPath);
  if (
    (request.method === "GET" || request.method === "HEAD") &&
    legacyBlogRedirect
  ) {
    url.pathname = legacyBlogRedirect;
    return Response.redirect(url.toString(), 301);
  }

  // Locale homes canonical URL is /de/ (directory index). Redirect slashless /de → /de/.
  if (
    (request.method === "GET" || request.method === "HEAD") &&
    /^\/[^/]+$/.test(normalizedPath)
  ) {
    const segment = normalizedPath.slice(1);
    if (isLocaleHomeSegment(segment)) {
      url.pathname = `${normalizedPath}/`;
      return Response.redirect(url.toString(), 308);
    }
  }

  // Locale home routes are stored as /de/index.html, /fr/index.html, etc.
  // (directory form). Their canonical URLs keep the trailing slash (/fr/, /de/, /es/, etc.).
  // Exempting them here prevents a loop with Cloudflare Pages' own directory redirect
  // (308 /fr → /fr/) which would otherwise bounce back and forth with our 301 /fr/ → /fr.

  // Trailing-slash URLs 404 on static Pages when only `path.html` exists (not `path/index.html`).
  // Marketing pages use slashless paths (/terms); locale homes keep /de/ (exempt above).
  if (
    (request.method === "GET" || request.method === "HEAD") &&
    normalizedPath.length > 1 &&
    normalizedPath.endsWith("/") &&
    !LOCALE_HOME_WITH_SLASH.has(normalizedPath)
  ) {
    url.pathname = normalizedPath.replace(/\/+$/, "") || "/";
    return Response.redirect(url.toString(), 301);
  }

  const response = await context.next();
  if (response.status !== 404) {
    return applyHtmlPageSecurity(response);
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
      return applyHtmlPageSecurity(assetResponse);
    }
  }

  if (isPublicMarketingPath(pathname) || pathname === "/admin") {
    const shell = await serveSpaShell({ request, env, next: context.next });
    if (shell.status === 200) {
      return applyHtmlPageSecurity(shell);
    }
  }

  return response;
}
