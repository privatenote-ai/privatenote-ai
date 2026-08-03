/**
 * Same-origin /api/* proxy for the SPA on Cloudflare Pages.
 *
 * Forwards browser requests to the API Worker so the session cookie is first-party
 * to the deployed app host (not workers.dev). Two non-obvious responsibilities:
 *
 * 1. Sets `X-Forwarded-Host` to the original Pages host. The Worker uses it as a
 *    last-resort hint in `getSessionCookieKindForRequest` (`src/trustedOrigins.ts`)
 *    when the browser omits both `Origin` and `Referer` — Safari does this on
 *    same-origin GET fetches, which otherwise causes the Worker to look up the
 *    wrong cookie name (`pn_session` vs `pn_session_preview`) on `*.pages.dev`
 *    branch previews and return `{authenticated:false}` for a valid session.
 *
 * 2. Strips Cloudflare Access cookies (`CF_Authorization`, `CF_AppSession`) from
 *    the `Cookie` header before forwarding. Those are only meaningful at the edge
 *    in front of Pages; passing the JWT through bloats every API request by ~1KB
 *    and pollutes Worker logs.
 *
 * 3. Materializes non-GET bodies with `arrayBuffer()` before forwarding. Passing
 *    `new Request(workerUrl, incomingRequest)` drops PUT/POST binary bodies on
 *    Pages Functions and Safari reports "network connection was lost". File chunk
 *    PUTs from the SPA use this same-origin proxy (not cross-origin workers.dev).
 */
import { PN_CLIENT_IP_HEADER } from "../../shared/clientRequestIdentity";
import { isStagingAppHost } from "../../shared/pagesAppHosts";

const ACCESS_COOKIE_NAME_PATTERN = /^CF_(?:Authorization|AppSession)=/;
const PRODUCTION_API_WORKER_ORIGIN = "https://privatenote-api.marjan-skrobot.workers.dev";
const STAGING_API_WORKER_ORIGIN =
  "https://privatenote-api-staging.marjan-skrobot.workers.dev";

function apiProxyTargetForHostname(hostname: string, configuredTarget?: string): string {
  // Must match client uploadWorkerOriginForAppHostname / isStagingAppHost.
  // premium.privatenote.ai reserves on staging and PUTs to upload-staging; proxying
  // reserve to production KV made staging uploads 403 mid-body (Safari status 0).
  if (isStagingAppHost(hostname)) {
    return STAGING_API_WORKER_ORIGIN;
  }
  return configuredTarget || PRODUCTION_API_WORKER_ORIGIN;
}

function stripAccessCookies(value: string | null): string | null {
  if (!value) return null;
  const filtered = value
    .split(";")
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0 && !ACCESS_COOKIE_NAME_PATTERN.test(segment));
  return filtered.length > 0 ? filtered.join("; ") : null;
}

function proxyBodyAllowed(method: string): boolean {
  return method !== "GET" && method !== "HEAD" && method !== "OPTIONS";
}

export async function onRequest(context: {
  request: Request;
  env?: { API_PROXY_TARGET?: string };
}) {
  const url = new URL(context.request.url);
  const base = apiProxyTargetForHostname(url.hostname, context.env?.API_PROXY_TARGET);
  const target = new URL(base);
  target.pathname = url.pathname;
  target.search = url.search;

  const method = context.request.method;
  const headers = new Headers(context.request.headers);
  headers.set("X-Forwarded-Host", url.host);
  const visitorIp = context.request.headers.get("CF-Connecting-IP")?.trim();
  if (visitorIp) {
    headers.set(PN_CLIENT_IP_HEADER, visitorIp);
  }
  // Target host is the Worker; let fetch set Host/Content-Length from the materialized body.
  headers.delete("Host");
  headers.delete("Content-Length");

  const cleanedCookie = stripAccessCookies(headers.get("Cookie"));
  if (cleanedCookie) {
    headers.set("Cookie", cleanedCookie);
  } else {
    headers.delete("Cookie");
  }

  const body = proxyBodyAllowed(method) ? await context.request.arrayBuffer() : undefined;

  return fetch(target.toString(), {
    method,
    headers,
    body,
    redirect: "manual",
  });
}
