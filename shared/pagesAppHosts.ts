/**
 * Cloudflare Pages hostnames for this project. Shared by the Worker (trustedOrigins)
 * and the browser bundle (same-origin /api proxy).
 */

export const PAGES_PROJECT_LABEL = "privatenote-ai";

export const PAGES_APEX_HOST = `${PAGES_PROJECT_LABEL}.pages.dev` as const;

/**
 * Long-lived git branches used for pre-main QA (`premium`, `develop`).
 * Each maps to https://{branch}.privatenote-ai.pages.dev when Pages builds that branch.
 */
export const PAGES_STAGING_BRANCH_HOSTS = [
  "premium.privatenote-ai.pages.dev",
  "develop.privatenote-ai.pages.dev",
] as const;

export type PagesStagingBranchHost = (typeof PAGES_STAGING_BRANCH_HOSTS)[number];

export function isPagesStagingBranchHost(hostname: string): hostname is PagesStagingBranchHost {
  return (PAGES_STAGING_BRANCH_HOSTS as readonly string[]).includes(hostname);
}

/** Custom domains that host the SPA and use the Pages Functions /api proxy. */
const PRIVATENOTE_AI_APP_HOSTS = new Set([
  "privatenote.ai",
  "www.privatenote.ai",
  "app.privatenote.ai",
  "premium.privatenote.ai",
]);

function isCloudflarePagesProjectHost(hostname: string): boolean {
  const parts = hostname.split(".");
  const n = parts.length;
  if (n < 3) return false;
  if (parts[n - 1] !== "dev" || parts[n - 2] !== "pages") return false;
  if (parts[n - 3] !== PAGES_PROJECT_LABEL) return false;
  if (n === 3) return true;
  return parts.slice(0, n - 3).every((label) => label.length > 0);
}

/**
 * Use same-origin `/api/*` (Pages Function proxy) instead of cross-origin workers.dev.
 */
export function hasPagesSameOriginApiProxy(hostname: string): boolean {
  if (PRIVATENOTE_AI_APP_HOSTS.has(hostname)) return true;
  if (hostname === PAGES_APEX_HOST) return true;
  if (isPagesStagingBranchHost(hostname)) return true;
  return isCloudflarePagesProjectHost(hostname);
}
