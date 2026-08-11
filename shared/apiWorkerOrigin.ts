import { isStagingAppHost } from "./pagesAppHosts";

/** Production API Worker origin when the SPA uses the Pages /api proxy for JSON calls. */
export const DEFAULT_API_WORKER_ORIGIN = "https://privatenote-api.marjan-skrobot.workers.dev";

/** API Worker used by the long-lived premium/develop Cloudflare Pages branches. */
export const STAGING_API_WORKER_ORIGIN =
  "https://privatenote-api-staging.marjan-skrobot.workers.dev";

/** Dedicated cookie-less attachment upload origins (encrypt.lu-style relay hosts). */
export const PRODUCTION_UPLOAD_WORKER_ORIGIN = "https://upload.privatenote.ai";
export const STAGING_UPLOAD_WORKER_ORIGIN = "https://upload-staging.privatenote.ai";

const UPLOAD_RELAY_HOSTNAMES = new Set([
  new URL(PRODUCTION_UPLOAD_WORKER_ORIGIN).hostname,
  new URL(STAGING_UPLOAD_WORKER_ORIGIN).hostname,
]);

/** True for cookie-less attachment relays (encrypt.lu-style `relay.encrypt.lu`). */
export function isUploadRelayHostname(hostname: string): boolean {
  return UPLOAD_RELAY_HOSTNAMES.has(hostname.trim().toLowerCase());
}

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
  if (isStagingAppHost(normalizedHostname)) {
    return STAGING_API_WORKER_ORIGIN;
  }
  return normalizeApiWorkerOrigin(configuredOrigin || DEFAULT_API_WORKER_ORIGIN);
}

/** Resolve the dedicated upload Worker without routing binary bodies through Pages. */
export function uploadWorkerOriginForAppHostname(hostname: string): string {
  return isStagingAppHost(hostname.trim().toLowerCase())
    ? STAGING_UPLOAD_WORKER_ORIGIN
    : PRODUCTION_UPLOAD_WORKER_ORIGIN;
}
