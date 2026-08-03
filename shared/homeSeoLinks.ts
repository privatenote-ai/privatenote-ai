/** Production origin for canonical / hreflang (must match sitemap and deploy host). */
import { isLocaleHomeSegment, NON_ENGLISH_LANGUAGE_CODES } from "./supportedLanguages.ts";

export const PUBLIC_SITE_ORIGIN = "https://privatenote.ai";

/** App routes that must not get a trailing slash (SPA / dynamic). */
const NO_TRAILING_SLASH_PREFIXES = [
  "/note/",
  "/auth",
  "/account",
  "/magic",
  "/admin",
] as const;

/**
 * Canonical public URL path shape for links and meta tags:
 * - `/` and locale homes (`/de/`) keep trailing slash (matches sitemap + Cloudflare directory URLs)
 * - all other marketing paths have no trailing slash
 */
export function canonicalPublicPath(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") return "/";
  const trimmed = normalized.replace(/\/+$/, "") || "/";
  const parts = trimmed.split("/").filter(Boolean);
  if (parts.length === 1 && isLocaleHomeSegment(parts[0]!)) {
    return `/${parts[0]}/`;
  }
  if (normalized.includes(".")) return normalized;
  if (NO_TRAILING_SLASH_PREFIXES.some((prefix) => normalized.startsWith(prefix))) {
    return normalized.replace(/\/+$/, "") || "/";
  }
  return normalized.replace(/\/+$/, "") || "/";
}

// Locale homes are served from de/index.html — canonical/hreflang URLs use the
// directory form /de/ so crawlers follow the canonical without a redirect.
export const HOME_HREFLANG_ALTERNATES = [
  { hrefLang: "en", path: "/" },
  ...NON_ENGLISH_LANGUAGE_CODES.map((code) => ({ hrefLang: code, path: `/${code}/` as const })),
  { hrefLang: "x-default", path: "/" },
] as const;

const LOCALE_HOME_CODES = NON_ENGLISH_LANGUAGE_CODES;
type HomeLanguage = "en" | (typeof LOCALE_HOME_CODES)[number];

export function absolutePublicUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${PUBLIC_SITE_ORIGIN}${canonicalPublicPath(normalized)}`;
}

/** Absolute canonical URL for a prerender route. */
export function canonicalAbsoluteUrlForRoute(route: string): string {
  const path = canonicalPublicPath(route.startsWith("/") ? route : `/${route}`);
  return `${PUBLIC_SITE_ORIGIN}${path}`;
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
