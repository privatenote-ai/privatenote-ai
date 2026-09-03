/**
 * Public marketing routes that must return 200 for crawlers (sitemap + nav).
 * Single source for prerender fallback list and Pages middleware SPA shell fallback.
 */
import { allBlogCategoryMarketingPaths } from "./blogCategories.ts";
import { allLocalizedBlogMarketingPaths } from "./localizedBlogSlugs.ts";
import { ENGLISH_ONLY_DEVELOPER_MARKETING_PATHS } from "./englishOnlyDeveloperIntegrations.ts";
import {
  ENGLISH_ONLY_SECURITY_GUIDE_TOPICS,
  LOCALIZED_SECURITY_GUIDE_TOPICS,
} from "./localizedSecurityGuides.ts";
import { PREMIUM_PAGE_PUBLIC } from "./premiumPagePublic.ts";
import { isLocaleHomeSegment, NON_ENGLISH_LANGUAGE_CODES } from "./supportedLanguages.ts";

const LOCALIZED_LANGUAGE_CODES = NON_ENGLISH_LANGUAGE_CODES;

const NON_BLOG_LOCALIZED_MARKETING_PATHS = [
  "",
  "/password-generator",
  "/secure-file-transfer",
  "/privacy-tools",
  "/security-resources",
  "/how-it-works",
  ...(PREMIUM_PAGE_PUBLIC ? (["/premium"] as const) : []),
  "/developers",
  "/about",
  "/contact",
  "/blog",
  "/privacy",
  "/terms",
] as const;

const ENGLISH_NON_BLOG_PATHS = NON_BLOG_LOCALIZED_MARKETING_PATHS.map((path) =>
  path === "" ? "/" : path,
);

const ENGLISH_BLOG_PATHS = allLocalizedBlogMarketingPaths().filter((path) => path.startsWith("/blog/"));
const BLOG_CATEGORY_PATHS = allBlogCategoryMarketingPaths();

/** Routes that are public but not mirrored under /de, /fr, etc. */
const EXTRA_MARKETING_PATHS = [
  ...ENGLISH_ONLY_SECURITY_GUIDE_TOPICS.map((topic) => `/security-guides/${topic}`),
  ...ENGLISH_ONLY_DEVELOPER_MARKETING_PATHS,
];

const LOCALIZED_SECURITY_GUIDE_PATHS = LOCALIZED_SECURITY_GUIDE_TOPICS.flatMap((topic) => {
  const english = `/security-guides/${topic}` as const;
  const localized = LOCALIZED_LANGUAGE_CODES.map(
    (language) => `/${language}/security-guides/${topic}` as const,
  );
  return [english, ...localized];
});

const LOCALIZED_NON_BLOG_PATHS = LOCALIZED_LANGUAGE_CODES.flatMap((language) =>
  NON_BLOG_LOCALIZED_MARKETING_PATHS.map((path) => (path === "" ? `/${language}/` : `/${language}${path}`)),
);

const LOCALIZED_BLOG_PATHS = allLocalizedBlogMarketingPaths().filter((path) =>
  LOCALIZED_LANGUAGE_CODES.some((language) => path.startsWith(`/${language}/blog/`)),
);

export const PUBLIC_MARKETING_PATHS = [
  ...ENGLISH_NON_BLOG_PATHS,
  ...ENGLISH_BLOG_PATHS,
  ...BLOG_CATEGORY_PATHS,
  ...LOCALIZED_NON_BLOG_PATHS,
  ...LOCALIZED_BLOG_PATHS,
  ...LOCALIZED_SECURITY_GUIDE_PATHS,
  ...EXTRA_MARKETING_PATHS,
] as const;

const PUBLIC_MARKETING_PATH_SET = new Set<string>(PUBLIC_MARKETING_PATHS);

/** Normalize pathname for lookup: locale homes use `/de/`; other paths have no trailing slash. */
export function normalizeMarketingPathname(pathname: string): string {
  const p = (pathname.split(/[?#]/)[0] ?? "/").replace(/\/{2,}/g, "/");
  if (p === "/") return "/";
  const trimmed = p.endsWith("/") ? p.slice(0, -1) : p;
  const parts = trimmed.split("/").filter(Boolean);
  if (parts.length === 1 && isLocaleHomeSegment(parts[0]!)) {
    return `/${parts[0]}/`;
  }
  return trimmed || "/";
}

export function isPublicMarketingPath(pathname: string): boolean {
  return PUBLIC_MARKETING_PATH_SET.has(normalizeMarketingPathname(pathname));
}
