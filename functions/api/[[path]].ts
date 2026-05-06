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
 */
const ACCESS_COOKIE_NAME_PATTERN = /^CF_(?:Authorization|AppSession)=/;

function stripAccessCookies(value: string | null): string | null {
  if (!value) return null;
  const filtered = value
    .split(";")
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0 && !ACCESS_COOKIE_NAME_PATTERN.test(segment));
  return filtered.length > 0 ? filtered.join("; ") : null;
}

export async function onRequest(context: {
  request: Request;
  env?: { API_PROXY_TARGET?: string };
}) {
  const url = new URL(context.request.url);
  const base = context.env?.API_PROXY_TARGET || "https://privatenote-api.marjan-skrobot.workers.dev";
  const target = new URL(base);
  target.pathname = url.pathname;
  target.search = url.search;

  const proxyRequest = new Request(target.toString(), context.request);
  proxyRequest.headers.set("X-Forwarded-Host", url.host);

  const cleanedCookie = stripAccessCookies(proxyRequest.headers.get("Cookie"));
  if (cleanedCookie) {
    proxyRequest.headers.set("Cookie", cleanedCookie);
  } else {
    proxyRequest.headers.delete("Cookie");
  }

  return fetch(proxyRequest);
}
