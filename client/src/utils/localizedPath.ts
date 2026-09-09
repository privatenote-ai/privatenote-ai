import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/utils/translation";
import { canonicalPublicPath } from "@shared/homeSeoLinks";
import {
  isBlogCategory,
  blogCategoryPath as sharedBlogCategoryPath,
} from "@shared/blogCategories";
import {
  isBlogCanonicalSlug,
  localizedBlogPostPath,
  localizedBlogSlug,
  resolveCanonicalBlogSlug,
} from "@shared/localizedBlogSlugs";
import {
  isLocalizedSecurityGuideTopic,
  localizedSecurityGuidePath,
} from "@shared/localizedSecurityGuides";

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
  const categoryMatch = pathWithoutLanguage.match(/^\/blog\/category\/([^/]+)$/);
  if (categoryMatch && isBlogCategory(categoryMatch[1]!)) {
    return `/blog/category/${categoryMatch[1]}`;
  }

  const blogMatch = pathWithoutLanguage.match(/^\/blog\/([^/]+)$/);
  if (!blogMatch) return pathWithoutLanguage;

  const canonical = resolveCanonicalBlogSlug(blogMatch[1]!);
  if (!canonical) return pathWithoutLanguage;

  const slug = localizedBlogSlug(canonical, language);
  return `/blog/${slug}`;
}

function translateSecurityGuidePath(pathWithoutLanguage: string): string {
  const match = pathWithoutLanguage.match(/^\/security-guides\/([^/]+)$/);
  if (!match) return pathWithoutLanguage;
  const topic = match[1]!;
  if (!isLocalizedSecurityGuideTopic(topic)) return pathWithoutLanguage;
  return pathWithoutLanguage;
}

function stripLanguagePrefix(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] && (NON_ENGLISH_LANGUAGES as readonly string[]).includes(parts[0])) {
    return parts.length > 1 ? `/${parts.slice(1).join("/")}` : "/";
  }
  return pathname;
}

function isLocalizedPublicPath(pathWithoutLanguage: string): boolean {
  const path = stripLanguagePrefix(pathWithoutLanguage);
  if (LOCALIZED_PUBLIC_PATHS.has(path)) return true;
  const guideMatch = path.match(/^\/security-guides\/([^/]+)$/);
  if (guideMatch && isLocalizedSecurityGuideTopic(guideMatch[1]!)) return true;
  const categoryMatch = path.match(/^\/blog\/category\/([^/]+)$/);
  if (categoryMatch && isBlogCategory(categoryMatch[1]!)) return true;
  if (!path.startsWith("/blog/")) return false;
  const slug = path.slice("/blog/".length);
  if (slug.includes("/")) return false;
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

/** Localized href for a blog category landing page. */
export function blogCategoryPath(category: string, language: SupportedLanguage): string {
  if (!isBlogCategory(category)) {
    return localizedPath("/blog", language);
  }
  return publicSitePath(sharedBlogCategoryPath(category, language));
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
  const translatedPath = translateSecurityGuidePath(translateBlogPath(pathWithoutLanguage, language));

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
  // Reveal URLs are not locale-prefixed. Navigating to /de/note/:id remounts the
  // page and a second reveal call looks like the one-time note was consumed.
  if (/^\/note\/[^/]+$/.test(pathWithoutLanguage)) {
    return pathWithoutLanguage;
  }
  const guideMatch = pathWithoutLanguage.match(/^\/security-guides\/([^/]+)$/);
  if (guideMatch && isLocalizedSecurityGuideTopic(guideMatch[1]!)) {
    return localizedSecurityGuidePath(guideMatch[1]!, language);
  }
  const categoryMatch = pathWithoutLanguage.match(/^\/blog\/category\/([^/]+)$/);
  if (categoryMatch && isBlogCategory(categoryMatch[1]!)) {
    return blogCategoryPath(categoryMatch[1]!, language);
  }
  const blogMatch = pathWithoutLanguage.match(/^\/blog\/([^/]+)$/);
  if (blogMatch) {
    const canonical = resolveCanonicalBlogSlug(blogMatch[1]!);
    if (canonical) {
      return localizedPath(`/blog/${canonical}`, language);
    }
  }
  return localizedPath(pathWithoutLanguage, language);
}
