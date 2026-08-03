import { isPagesStagingBranchHost } from "./pagesAppHosts";

/** Production API Worker origin when the SPA uses the Pages /api proxy for JSON calls. */
export const DEFAULT_API_WORKER_ORIGIN = "https://privatenote-api.marjan-skrobot.workers.dev";

/** API Worker used by the long-lived premium/develop Cloudflare Pages branches. */
export const STAGING_API_WORKER_ORIGIN =
  "https://privatenote-api-staging.marjan-skrobot.workers.dev";

/** Dedicated cookie-less attachment upload origins, routed directly to Workers. */
export const PRODUCTION_UPLOAD_WORKER_ORIGIN = "https://upload.privatenote.ai";
// Safari reaches the Worker reliably on its native hostname. The staging custom
// domain currently loses body-bearing XHRs at the edge before Worker invocation.
export const STAGING_UPLOAD_WORKER_ORIGIN = STAGING_API_WORKER_ORIGIN;

export function normalizeApiWorkerOrigin(origin: string): string {
  let base = origin.trim();
  if (!base) return DEFAULT_API_WORKER_ORIGIN;
  if (!base.startsWith("http://") && !base.startsWith("https://")) {
    base = `https://${base}`;
  }
  return base.replace(/\/$/, "");
}

/**
 * Resolve the direct API Worker used by browser uploads.
 *
 * Staging hostnames deliberately win over a compiled VITE_API_URL. Pages staging
 * builds are sometimes produced in Vite's production mode, and must never send a
 * staging reservation/upload token to the production Worker as a result.
 */
export function apiWorkerOriginForAppHostname(
  hostname: string,
  configuredOrigin = "",
): string {
  const normalizedHostname = hostname.trim().toLowerCase();
  if (isPagesStagingBranchHost(normalizedHostname)) {
    return STAGING_API_WORKER_ORIGIN;
  }
  return normalizeApiWorkerOrigin(configuredOrigin || DEFAULT_API_WORKER_ORIGIN);
}

/** Resolve the dedicated upload Worker without routing binary bodies through Pages. */
export function uploadWorkerOriginForAppHostname(hostname: string): string {
  return isPagesStagingBranchHost(hostname.trim().toLowerCase())
    ? STAGING_UPLOAD_WORKER_ORIGIN
    : PRODUCTION_UPLOAD_WORKER_ORIGIN;
}
