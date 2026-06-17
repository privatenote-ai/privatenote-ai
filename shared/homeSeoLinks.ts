/** Production origin for canonical / hreflang (must match sitemap and deploy host). */
export const PUBLIC_SITE_ORIGIN = "https://privatenote.ai";

// Locale homes are served from de/index.html — canonical/hreflang URLs use the
// directory form /de/ so crawlers follow the canonical without a redirect.
export const HOME_HREFLANG_ALTERNATES = [
  { hrefLang: "en", path: "/" },
  { hrefLang: "de", path: "/de/" },
  { hrefLang: "fr", path: "/fr/" },
  { hrefLang: "es", path: "/es/" },
  { hrefLang: "it", path: "/it/" },
  { hrefLang: "nl", path: "/nl/" },
  { hrefLang: "x-default", path: "/" },
] as const;

const LOCALE_HOME_CODES = ["de", "fr", "es", "it", "nl"] as const;
type HomeLanguage = "en" | (typeof LOCALE_HOME_CODES)[number];

export function absolutePublicUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  // Preserve trailing slash: locale home directory URLs (/de/, /fr/, /es/, /)
  // must keep their slash so crawlers receive the canonical form directly.
  if (normalized === "/" || normalized.endsWith("/")) {
    return `${PUBLIC_SITE_ORIGIN}${normalized}`;
  }
  const pathname = normalized.replace(/\/+$/, "") || "/";
  return `${PUBLIC_SITE_ORIGIN}${pathname}`;
}

/** Absolute canonical URL for a prerender route (no trailing slash except site root). */
export function canonicalAbsoluteUrlForRoute(route: string): string {
  const r = route.replace(/\/+$/, "") || "/";
  if (r === "/") return `${PUBLIC_SITE_ORIGIN}/`;
  return `${PUBLIC_SITE_ORIGIN}${r.startsWith("/") ? r : `/${r}`}`;
}

/** True for `/`, `/de`, `/de/`, etc. — locale marketing homes only. */
export function isLocaleHomeRoute(route: string): boolean {
  const r = route.replace(/\/+$/, "") || "/";
  if (r === "/") return true;
  const parts = r.split("/").filter(Boolean);
  return parts.length === 1 && (LOCALE_HOME_CODES as readonly string[]).includes(parts[0]!);
}

export function homeLanguageFromRoute(route: string): HomeLanguage {
  const r = route.replace(/\/+$/, "") || "/";
  if (r === "/") return "en";
  const code = r.split("/").filter(Boolean)[0];
  if ((LOCALE_HOME_CODES as readonly string[]).includes(code!)) return code as HomeLanguage;
  return "en";
}

export function canonicalPathForHomeLanguage(language: HomeLanguage): string {
  return language === "en" ? "/" : `/${language}/`;
}

/** Static `<link>` block for prerendered locale home pages (absolute URLs for crawlers). */
export function buildHomeSeoHeadMarkup(language: HomeLanguage): string {
  const canonicalPath = canonicalPathForHomeLanguage(language);
  const lines = [
    `<link rel="canonical" href="${absolutePublicUrl(canonicalPath)}" data-privatenote-home-locale="true" />`,
    ...HOME_HREFLANG_ALTERNATES.map(
      (alternate) =>
        `<link rel="alternate" hreflang="${alternate.hrefLang}" href="${absolutePublicUrl(alternate.path)}" data-privatenote-home-locale="true" />`,
    ),
  ];
  return lines.join("\n");
}
