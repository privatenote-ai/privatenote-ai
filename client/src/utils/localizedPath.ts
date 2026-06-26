import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/utils/translation";

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
]);

/** App routes that must not get a trailing slash (SPA / dynamic). */
const NO_TRAILING_SLASH_PREFIXES = [
  "/note/",
  "/auth",
  "/account",
  "/magic",
  "/admin",
] as const;

/**
 * Canonical public URL shape (matches `documentMeta`, sitemap, and Pages static routes):
 * no trailing slash except the site root (`/`).
 */
export function publicSitePath(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") return "/";
  if (normalized.includes(".")) return normalized;
  if (NO_TRAILING_SLASH_PREFIXES.some((prefix) => normalized.startsWith(prefix))) {
    return normalized.replace(/\/+$/, "") || "/";
  }
  return normalized.replace(/\/+$/, "") || "/";
}

/** Join path segments and apply {@link publicSitePath} (e.g. blog + slug → `/blog/foo/`). */
export function joinPublicPath(...segments: string[]): string {
  const parts = segments
    .map((s) => s.replace(/^\/+|\/+$/g, ""))
    .filter(Boolean);
  return publicSitePath(parts.length ? `/${parts.join("/")}` : "/");
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
  if (!LOCALIZED_PUBLIC_PATHS.has(pathWithoutLanguage)) {
    return publicSitePath(pathWithoutLanguage);
  }
  if (language === "en") {
    return publicSitePath(pathWithoutLanguage);
  }
  if (pathWithoutLanguage === "/") {
    return `/${language}`;
  }
  return publicSitePath(`/${language}${pathWithoutLanguage}`);
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
  return localizedPath(pathWithoutLanguage, language);
}
