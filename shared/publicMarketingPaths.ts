/**
 * Public marketing routes that must return 200 for crawlers (sitemap + nav).
 * Single source for prerender fallback list and Pages middleware SPA shell fallback.
 */
const LOCALIZED_LANGUAGE_CODES = ["de", "fr", "es", "it", "nl"] as const;

const LOCALIZED_MARKETING_PATHS = [
  "",
  "/password-generator",
  "/privacy-tools",
  "/security-resources",
  "/how-it-works",
  "/developers",
  "/about",
  "/contact",
  "/blog",
  "/blog/one-time-secret-links",
  "/blog/securing-ai-agents-like-employees",
  "/blog/privacy-tools",
  "/blog/myth-good-enough-security",
  "/blog/how-we-generate-passwords",
  "/blog/workplace-texts-private-note",
  "/blog/privatenote-for-developers",
  "/blog/privatenote-codex",
  "/privacy",
  "/terms",
] as const;

export const PUBLIC_MARKETING_PATHS = [
  "/",
  ...LOCALIZED_LANGUAGE_CODES.flatMap((language) =>
    LOCALIZED_MARKETING_PATHS.map((path) => `/${language}${path}`),
  ),
  "/privacy",
  "/terms",
  "/how-it-works",
  "/developers",
  "/about",
  "/contact",
  "/password-generator",
  "/privacy-tools",
  "/security-resources",
  "/security-guides/vpn",
  "/security-guides/password",
  "/security-guides/messenger",
  "/security-guides/email",
  "/security-guides/browser",
  "/blog",
  "/blog/one-time-secret-links",
  "/blog/securing-ai-agents-like-employees",
  "/blog/privacy-tools",
  "/blog/myth-good-enough-security",
  "/blog/how-we-generate-passwords",
  "/blog/workplace-texts-private-note",
  "/blog/privatenote-for-developers",
  "/blog/privatenote-codex",
] as const;

const PUBLIC_MARKETING_PATH_SET = new Set<string>(PUBLIC_MARKETING_PATHS);

/** Normalize pathname for lookup: no trailing slash except `/`. */
export function normalizeMarketingPathname(pathname: string): string {
  const p = (pathname.split(/[?#]/)[0] ?? "/").replace(/\/{2,}/g, "/");
  if (p.length > 1 && p.endsWith("/")) return p.slice(0, -1);
  return p || "/";
}

export function isPublicMarketingPath(pathname: string): boolean {
  return PUBLIC_MARKETING_PATH_SET.has(normalizeMarketingPathname(pathname));
}
