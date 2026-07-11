/**
 * hreflang alternates for public marketing routes mirrored under /de, /fr, etc.
 * Locale homes use {@link buildHomeSeoHeadMarkup} instead.
 */
import {
  absolutePublicUrl,
  canonicalAbsoluteUrlForRoute,
  canonicalPathForHomeLanguage,
  homeLanguageFromRoute,
  isLocaleHomeRoute,
} from "./homeSeoLinks.ts";
import { localizedBlogPostPath, resolveCanonicalBlogSlug } from "./localizedBlogSlugs.ts";
import { isPublicMarketingPath, normalizeMarketingPathname } from "./publicMarketingPaths.ts";
import { isSupportedLanguage, SUPPORTED_LANGUAGES, type SupportedLanguage } from "./supportedLanguages.ts";

const LOCALIZED_MARKETING_STEMS = new Set([
  "password-generator",
  "secure-file-transfer",
  "privacy-tools",
  "security-resources",
  "how-it-works",
  "developers",
  "about",
  "contact",
  "blog",
  "privacy",
  "terms",
]);

export type LocalizedMarketingHreflangAlternate = {
  hrefLang: string;
  path: string;
};

type ParsedLocalizedMarketingRoute = {
  language: SupportedLanguage;
  stem: string;
  blogSlug: string | null;
};

function parseLocalizedMarketingRoute(route: string): ParsedLocalizedMarketingRoute | null {
  const normalized = route.replace(/\/+$/, "") || "/";
  const parts = normalized.split("/").filter(Boolean);

  let language: SupportedLanguage = "en";
  let rest = parts;

  if (parts[0] && isSupportedLanguage(parts[0]) && parts[0] !== "en") {
    language = parts[0];
    rest = parts.slice(1);
  }

  if (rest.length === 0) return null;

  if (rest[0] === "blog") {
    if (rest.length === 1) {
      return { language, stem: "blog", blogSlug: null };
    }
    if (rest.length === 2) {
      return { language, stem: "blog", blogSlug: rest[1]! };
    }
    return null;
  }

  if (rest.length === 1 && LOCALIZED_MARKETING_STEMS.has(rest[0]!)) {
    return { language, stem: rest[0]!, blogSlug: null };
  }

  return null;
}

function localizedMarketingPathForLanguage(
  stem: string,
  blogSlug: string | null,
  language: SupportedLanguage,
): string {
  if (stem === "blog" && !blogSlug) {
    return language === "en" ? "/blog" : `/${language}/blog`;
  }

  if (stem === "blog" && blogSlug) {
    const canonical = resolveCanonicalBlogSlug(blogSlug);
    if (!canonical) {
      return language === "en" ? `/blog/${blogSlug}` : `/${language}/blog/${blogSlug}`;
    }
    return localizedBlogPostPath(canonical, language);
  }

  const base = `/${stem}`;
  return language === "en" ? base : `/${language}${base}`;
}

export function isLocalizedMarketingHreflangRoute(route: string): boolean {
  const parsed = parseLocalizedMarketingRoute(route);
  if (!parsed) return false;
  if (parsed.stem === "blog" && parsed.blogSlug) {
    return resolveCanonicalBlogSlug(parsed.blogSlug) !== null;
  }
  return LOCALIZED_MARKETING_STEMS.has(parsed.stem);
}

export function localizedMarketingHreflangAlternates(route: string): LocalizedMarketingHreflangAlternate[] | null {
  if (!isLocalizedMarketingHreflangRoute(route)) return null;

  const parsed = parseLocalizedMarketingRoute(route);
  if (!parsed) return null;

  const { stem, blogSlug } = parsed;
  const alternates = SUPPORTED_LANGUAGES.map((language) => ({
    hrefLang: language,
    path: localizedMarketingPathForLanguage(stem, blogSlug, language),
  }));

  alternates.push({
    hrefLang: "x-default",
    path: localizedMarketingPathForLanguage(stem, blogSlug, "en"),
  });

  return alternates;
}

function selfReferenceOnlyAlternates(route: string): LocalizedMarketingHreflangAlternate[] {
  const normalized = normalizeMarketingPathname(route);
  const parts = normalized.split("/").filter(Boolean);
  let language: SupportedLanguage = "en";
  let englishPath = normalized;

  if (parts[0] && isSupportedLanguage(parts[0]) && parts[0] !== "en") {
    language = parts[0];
    englishPath = `/${parts.slice(1).join("/")}` || "/";
  }

  const localizedPath =
    language === "en" ? englishPath : `/${language}${englishPath === "/" ? "" : englishPath}`;

  return [
    { hrefLang: language, path: localizedPath },
    { hrefLang: "x-default", path: englishPath },
  ];
}

/**
 * Full hreflang set for mirrored marketing pages, or self-reference + x-default for
 * English-only public routes (security guides). Locale homes use {@link buildHomeSeoHeadMarkup}.
 */
export function marketingHreflangAlternatesForRoute(route: string): LocalizedMarketingHreflangAlternate[] | null {
  const normalized = normalizeMarketingPathname(route);
  if (isLocaleHomeRoute(normalized)) return null;

  const full = localizedMarketingHreflangAlternates(normalized);
  if (full) return full;
  if (!isPublicMarketingPath(normalized)) return null;

  return selfReferenceOnlyAlternates(normalized);
}

/** Required self-referencing hreflang for Ahrefs / Bing (must match the page's canonical URL). */
export function selfReferenceHreflangForRoute(route: string): { hrefLang: string; href: string } | null {
  const normalized = normalizeMarketingPathname(route);

  if (isLocaleHomeRoute(normalized)) {
    const language = homeLanguageFromRoute(normalized);
    return {
      hrefLang: language,
      href: absolutePublicUrl(canonicalPathForHomeLanguage(language)),
    };
  }

  if (!isPublicMarketingPath(normalized)) return null;

  const alternates = marketingHreflangAlternatesForRoute(normalized);
  if (!alternates) return null;

  const pageUrl = canonicalAbsoluteUrlForRoute(normalized);
  const parts = normalized.split("/").filter(Boolean);
  const language =
    parts[0] && isSupportedLanguage(parts[0]) && parts[0] !== "en" ? parts[0]! : "en";

  const selfAlternate = alternates.find((alternate) => alternate.hrefLang === language);
  if (!selfAlternate) return null;

  return {
    hrefLang: language,
    href: absolutePublicUrl(selfAlternate.path),
  };
}

function hreflangLinksMarkup(
  alternates: LocalizedMarketingHreflangAlternate[],
  dataAttribute:
    | "data-privatenote-localized-marketing"
    | "data-privatenote-home-locale" = "data-privatenote-localized-marketing",
): string {
  return alternates
    .map(
      (alternate) =>
        `<link rel="alternate" hreflang="${alternate.hrefLang}" href="${absolutePublicUrl(alternate.path)}" ${dataAttribute}="true" />`,
    )
    .join("\n");
}

/** Static `<link>` block for prerendered localized marketing pages. */
export function buildLocalizedMarketingHreflangMarkup(route: string): string | null {
  const alternates = localizedMarketingHreflangAlternates(route);
  if (!alternates) return null;
  return hreflangLinksMarkup(alternates);
}

/** Hreflang markup for any public marketing page except locale homes. */
export function buildMarketingHreflangMarkup(route: string): string | null {
  const alternates = marketingHreflangAlternatesForRoute(route);
  if (!alternates) return null;
  return hreflangLinksMarkup(alternates);
}

/** @deprecated Use {@link buildMarketingHreflangMarkup} */
export function buildSelfReferenceHreflangMarkup(route: string): string {
  const alternates = marketingHreflangAlternatesForRoute(route) ?? selfReferenceOnlyAlternates(route);
  return hreflangLinksMarkup(alternates);
}
