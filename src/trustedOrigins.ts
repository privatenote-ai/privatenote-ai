/**
 * Strict browser Origin allowlist for credentialed CORS and CSRF checks.
 * Avoid substring / global TLD matching (e.g. any *.pages.dev).
 */

import {
  PAGES_APEX_HOST,
  PAGES_PROJECT_LABEL,
  PAGES_STAGING_BRANCH_HOSTS,
  STAGING_CUSTOM_APP_HOSTS,
} from "@shared/pagesAppHosts";

export { PAGES_STAGING_BRANCH_HOSTS, STAGING_CUSTOM_APP_HOSTS } from "@shared/pagesAppHosts";

export const ALLOWED_ORIGINS = [
  `https://${PAGES_APEX_HOST}`,
  ...PAGES_STAGING_BRANCH_HOSTS.map((host) => `https://${host}`),
  "https://privatenote.ai",
  "http://localhost:5000",
  "http://localhost:5173",
  "http://127.0.0.1:5000",
  "http://127.0.0.1:5173",
  // Vite HTTPS dev (@vitejs/plugin-basic-ssl); host may be https://127.0.0.1 or :5174 depending on port
  "https://localhost:5173",
  "https://localhost:5174",
  "https://127.0.0.1:5173",
  "https://127.0.0.1:5174",
] as const;

/** First-party HTTPS origin used only when building responses without a request Origin header. */
export const DEFAULT_CORS_ORIGIN = ALLOWED_ORIGINS[0];

const ALLOWED_ORIGIN_SET = new Set(
  ALLOWED_ORIGINS.map((o) => o.replace(/\/$/, "")),
);

/**
 * Pages hosts that share the production session cookie with privatenote.ai (not ephemeral PR previews).
 * {@link PAGES_STAGING_BRANCH_HOSTS} are included so `premium` / `develop` deploys behave like prod for auth.
 * Arbitrary `*.privatenote-ai.pages.dev` PR previews still use {@link SESSION_COOKIE_PREVIEW_NAME}.
 */
export const PAGES_PRODUCTION_WEB_HOSTS: ReadonlySet<string> = new Set([
  PAGES_APEX_HOST,
  ...PAGES_STAGING_BRANCH_HOSTS,
]);

/**
 * HTTPS hostnames on privatenote.ai that may host the web app and call the API with credentials.
 * Wildcard subdomains are not trusted — add hosts here (or to ALLOWED_ORIGINS) if you introduce new app origins.
 */
const PRIVATENOTE_AI_WEB_HOSTS = new Set([
  "privatenote.ai",
  "www.privatenote.ai",
  "app.privatenote.ai",
  ...STAGING_CUSTOM_APP_HOSTS,
]);

/** Cookie names for API host-only session storage (SameSite=None). */
export const SESSION_COOKIE_PROD_NAME = "pn_session" as const;
export const SESSION_COOKIE_PREVIEW_NAME = "pn_session_preview" as const;
export type SessionCookieKind = "prod" | "preview";

/**
 * Common local dev ports for loopback only ({@link isLocalLoopbackDevUrl}).
 * http and https (Vite TLS / Turnstile) both allowed.
 */
const LOCAL_DEV_PORTS = new Set(["3000", "4173", "5000", "5173", "5174"]);

export function normalizeOrigin(origin: string): string {
  return origin.replace(/\/$/, "");
}

/** True for Chrome MV3 extension pages and service workers (`chrome-extension://<id>`). */
export function isChromeExtensionOrigin(origin: string): boolean {
  try {
    return new URL(origin).protocol === "chrome-extension:";
  } catch {
    return false;
  }
}

/** True for http(s)://localhost|127.0.0.1|[::1] with an allowed dev port (explicit or default 80/443). */
function isLocalLoopbackDevUrl(url: URL): boolean {
  if (url.protocol !== "http:" && url.protocol !== "https:") return false;
  const host = url.hostname;
  if (host !== "localhost" && host !== "127.0.0.1" && host !== "[::1]") return false;
  const port = url.port || (url.protocol === "https:" ? "443" : "80");
  return LOCAL_DEV_PORTS.has(port);
}

function isLocalDevUrl(url: URL): boolean {
  return isLocalLoopbackDevUrl(url);
}

/**
 * True only for this Cloudflare Pages project. We must not use `endsWith(".privatenote-ai.pages.dev")`:
 * a different project like `evilprivatenote-ai.pages.dev` would match but is only 3 DNS labels.
 * Valid shapes: `privatenote-ai.pages.dev` or `<preview>.privatenote-ai.pages.dev` (4+ labels).
 */
function isCloudflarePagesProjectHost(hostname: string): boolean {
  const parts = hostname.split(".");
  const n = parts.length;
  if (n < 3) return false;
  if (parts[n - 1] !== "dev" || parts[n - 2] !== "pages") return false;
  if (parts[n - 3] !== PAGES_PROJECT_LABEL) return false;
  // Production: privatenote-ai.pages.dev
  if (n === 3) return true;
  // Previews / custom subdomains: <segment...>.privatenote-ai.pages.dev
  return parts.slice(0, n - 3).every((label) => label.length > 0);
}

/**
 * True for branch / PR Pages deployments of this project (https://*.privatenote-ai.pages.dev),
 * excluding production web surfaces (apex Pages URL and allowlisted prod hosts).
 */
export function isPagesPreviewBrowserOrigin(origin: string): boolean {
  let url: URL;
  try {
    url = new URL(origin);
  } catch {
    return false;
  }
  if (url.protocol !== "https:") return false;
  const host = url.hostname;
  if (!isCloudflarePagesProjectHost(host)) return false;
  if (PAGES_PRODUCTION_WEB_HOSTS.has(host)) return false;
  return true;
}

/**
 * Which session cookie this request should send/use for auth, based on trusted Origin or Referer.
 * Untrusted or missing Origin defaults to prod so curl and same-site tooling keep working.
 *
 * Falls back to the `X-Forwarded-Host` header set by the Pages Function proxy
 * (`functions/api/[[path]].ts`) as a last resort: Safari same-origin GET `fetch()`
 * calls omit both `Origin` and `Referer`, and without the host hint the worker
 * would look up `pn_session` instead of `pn_session_preview` on `*.pages.dev`
 * branch previews and return `{authenticated:false}` for a valid session.
 *
 * IMPORTANT: only used here to pick a cookie name (which is already harmless if
 * wrong). Do NOT consult `X-Forwarded-Host` for CSRF / origin trust decisions —
 * those must keep relying on browser-set `Origin` / `Referer`.
 */
export function getSessionCookieKindForRequest(request: Request): SessionCookieKind {
  const originHeader = request.headers.get("Origin");
  let originStr: string | null = originHeader;
  if (!originStr) {
    const ref = request.headers.get("Referer");
    if (ref) {
      try {
        originStr = new URL(ref).origin;
      } catch {
        originStr = null;
      }
    }
  }
  if (!originStr) {
    const xfh = request.headers.get("X-Forwarded-Host");
    if (xfh) originStr = `https://${xfh}`;
  }
  if (originStr != null && isTrustedBrowserOrigin(originStr) && isPagesPreviewBrowserOrigin(originStr)) {
    return "preview";
  }
  return "prod";
}

export function sessionCookieNameForKind(kind: SessionCookieKind): string {
  return kind === "preview" ? SESSION_COOKIE_PREVIEW_NAME : SESSION_COOKIE_PROD_NAME;
}

export function isTrustedBrowserOrigin(origin: string): boolean {
  const normalized = normalizeOrigin(origin);
  if (ALLOWED_ORIGIN_SET.has(normalized)) return true;
  if (isChromeExtensionOrigin(origin)) return true;

  let url: URL;
  try {
    url = new URL(origin);
  } catch {
    return false;
  }

  if (url.protocol === "https:") {
    if (isLocalLoopbackDevUrl(url)) return true;
    const host = url.hostname;
    if (isCloudflarePagesProjectHost(host)) return true;
    if (PRIVATENOTE_AI_WEB_HOSTS.has(host)) return true;
    return false;
  }

  return isLocalDevUrl(url);
}

/**
 * Origins that may participate in WebAuthn (register/authenticate/step-up). Stricter than
 * {@link isTrustedBrowserOrigin}: branch/PR Pages previews are trusted for credentialed API use
 * with an isolated cookie, but do not receive a server-derived rpID (avoids passkey flows on
 * arbitrary *.privatenote-ai.pages.dev deployments).
 */
export function isWebAuthnRpAllowedOrigin(origin: string): boolean {
  const normalized = normalizeOrigin(origin);
  if (ALLOWED_ORIGIN_SET.has(normalized)) return true;

  let url: URL;
  try {
    url = new URL(origin);
  } catch {
    return false;
  }

  if (url.protocol === "https:") {
    if (isLocalLoopbackDevUrl(url)) return true;
    const host = url.hostname;
    if (PAGES_PRODUCTION_WEB_HOSTS.has(host)) return true;
    if (PRIVATENOTE_AI_WEB_HOSTS.has(host)) return true;
    return false;
  }

  return isLocalDevUrl(url);
}

/** Returns the request's Origin header value when trusted; otherwise null. */
export function getAllowedOriginFromRequest(request: Request): string | null {
  const origin = request.headers.get("Origin");
  if (!origin) return null;
  return isTrustedBrowserOrigin(origin) ? origin : null;
}
