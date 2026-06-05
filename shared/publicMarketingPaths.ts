/**
 * Public marketing routes that must return 200 for crawlers (sitemap + nav).
 * Single source for prerender fallback list and Pages middleware SPA shell fallback.
 */
export const PUBLIC_MARKETING_PATHS = [
  "/",
  "/de",
  "/fr",
  "/es",
  "/de/password-generator",
  "/de/privacy-tools",
  "/de/security-resources",
  "/de/how-it-works",
  "/de/developers",
  "/de/premium",
  "/de/about",
  "/de/contact",
  "/de/blog",
  "/de/blog/privacy-tools",
  "/de/blog/myth-good-enough-security",
  "/de/blog/how-we-generate-passwords",
  "/de/blog/workplace-texts-private-note",
  "/de/blog/privatenote-for-developers",
  "/de/blog/privatenote-codex",
  "/de/privacy",
  "/de/terms",
  "/fr/password-generator",
  "/fr/privacy-tools",
  "/fr/security-resources",
  "/fr/how-it-works",
  "/fr/developers",
  "/fr/premium",
  "/fr/about",
  "/fr/contact",
  "/fr/blog",
  "/fr/blog/privacy-tools",
  "/fr/blog/myth-good-enough-security",
  "/fr/blog/how-we-generate-passwords",
  "/fr/blog/workplace-texts-private-note",
  "/fr/blog/privatenote-for-developers",
  "/fr/blog/privatenote-codex",
  "/fr/privacy",
  "/fr/terms",
  "/es/password-generator",
  "/es/privacy-tools",
  "/es/security-resources",
  "/es/how-it-works",
  "/es/developers",
  "/es/premium",
  "/es/about",
  "/es/contact",
  "/es/blog",
  "/es/blog/privacy-tools",
  "/es/blog/myth-good-enough-security",
  "/es/blog/how-we-generate-passwords",
  "/es/blog/workplace-texts-private-note",
  "/es/blog/privatenote-for-developers",
  "/es/blog/privatenote-codex",
  "/es/privacy",
  "/es/terms",
  "/privacy",
  "/terms",
  "/how-it-works",
  "/developers",
  "/premium",
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
