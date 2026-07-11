import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/utils/translation";
import { canonicalPublicPath } from "@shared/homeSeoLinks";
import {
  isBlogCanonicalSlug,
  localizedBlogPostPath,
  localizedBlogSlug,
  resolveCanonicalBlogSlug,
} from "@shared/localizedBlogSlugs";

const NON_ENGLISH_LANGUAGES = SUPPORTED_LANGUAGES.filter((l): l is Exclude<SupportedLanguage, "en"> => l !== "en");

const LOCALIZED_PUBLIC_PATHS = new Set([
  "/",
  "/password-generator",
  "/secure-file-transfer",
  "/privacy-tools",
  "/security-resources",
  "/how-it-works",
  "/developers",
  "/premium",
  "/about",
  "/contact",
  "/blog",
  "/privacy",
  "/terms",
]);

function translateBlogPath(pathWithoutLanguage: string, language: SupportedLanguage): string {
  const blogMatch = pathWithoutLanguage.match(/^\/blog\/([^/]+)$/);
  if (!blogMatch) return pathWithoutLanguage;

  const canonical = resolveCanonicalBlogSlug(blogMatch[1]!);
  if (!canonical) return pathWithoutLanguage;

  const slug = localizedBlogSlug(canonical, language);
  return `/blog/${slug}`;
}

function isLocalizedPublicPath(pathWithoutLanguage: string): boolean {
  if (LOCALIZED_PUBLIC_PATHS.has(pathWithoutLanguage)) return true;
  if (!pathWithoutLanguage.startsWith("/blog/")) return false;
  const slug = pathWithoutLanguage.slice("/blog/".length);
  return resolveCanonicalBlogSlug(slug) !== null;
}

/**
 * Canonical public URL shape for in-app links:
 * - `/` and locale homes (`/de/`) keep trailing slash (matches sitemap + Cloudflare directory URLs)
 * - all other marketing paths have no trailing slash
 */
export function publicSitePath(path: string): string {
  return canonicalPublicPath(path);
}

/** Join path segments and apply {@link publicSitePath} (e.g. blog + slug → `/blog/foo/`). */
export function joinPublicPath(...segments: string[]): string {
  const parts = segments
    .map((s) => s.replace(/^\/+|\/+$/g, ""))
    .filter(Boolean);
  return publicSitePath(parts.length ? `/${parts.join("/")}` : "/");
}

/** Localized href for a static blog post from its canonical English slug. */
export function blogPostPath(canonicalSlug: string, language: SupportedLanguage): string {
  if (!isBlogCanonicalSlug(canonicalSlug)) {
    return joinPublicPath(...localizedPath("/blog", language).split("/").filter(Boolean), canonicalSlug);
  }
  return publicSitePath(localizedBlogPostPath(canonicalSlug, language));
}

function splitLanguagePrefix(pathname: string): {
  language: SupportedLanguage | null;
  pathWithoutLanguage: string;
} {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const [firstSegment = "", ...rest] = normalizedPath.split("/").filter(Boolean);
  const maybeLanguage = firstSegment as SupportedLanguage;

  if (SUPPORTED_LANGUAGES.includes(maybeLanguage) && maybeLanguage !== "en") {
    return {
      language: maybeLanguage,
      pathWithoutLanguage: rest.length ? `/${rest.join("/")}` : "/",
    };
  }

  return { language: null, pathWithoutLanguage: normalizedPath };
}

export function localizedPath(path: string, language: SupportedLanguage): string {
  const { pathWithoutLanguage } = splitLanguagePrefix(path);
  const translatedPath = translateBlogPath(pathWithoutLanguage, language);

  if (!isLocalizedPublicPath(translatedPath)) {
    return publicSitePath(pathWithoutLanguage);
  }
  if (language === "en") {
    return publicSitePath(translatedPath);
  }
  if (translatedPath === "/") {
    return `/${language}/`;
  }
  return publicSitePath(`/${language}${translatedPath}`);
}

/** True for paths that are the localized site home (/, /de/, /de, etc.). Used for nav full-reload behavior. */
export function isLocaleSiteHomeHref(href: string): boolean {
  if (href === "/") return true;
  const trimmed = href.replace(/\/+$/, "");
  const parts = trimmed.split("/").filter(Boolean);
  return parts.length === 1 && (NON_ENGLISH_LANGUAGES as readonly string[]).includes(parts[0]!);
}

export function switchLanguagePath(pathname: string, language: SupportedLanguage): string {
  const { pathWithoutLanguage } = splitLanguagePrefix(pathname);
  const blogMatch = pathWithoutLanguage.match(/^\/blog\/([^/]+)$/);
  if (blogMatch) {
    const canonical = resolveCanonicalBlogSlug(blogMatch[1]!);
    if (canonical) {
      return localizedPath(`/blog/${canonical}`, language);
    }
  }
  return localizedPath(pathWithoutLanguage, language);
}
