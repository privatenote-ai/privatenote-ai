import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/utils/translation";

const NON_ENGLISH_LANGUAGES = SUPPORTED_LANGUAGES.filter((l): l is Exclude<SupportedLanguage, "en"> => l !== "en");

const LOCALIZED_PUBLIC_PATHS = new Set([
  "/",
  "/password-generator",
  "/privacy-tools",
  "/security-resources",
  "/how-it-works",
  "/about",
  "/contact",
  "/blog",
  "/blog/privacy-tools",
  "/blog/myth-good-enough-security",
  "/blog/how-we-generate-passwords",
  "/blog/workplace-texts-private-note",
  "/privacy",
  "/terms",
]);

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
  if (!LOCALIZED_PUBLIC_PATHS.has(pathWithoutLanguage)) return pathWithoutLanguage;
  if (language === "en") return pathWithoutLanguage;
  // Locale site home is a directory on the CDN (…/de/ returns 200; …/de redirects).
  return pathWithoutLanguage === "/" ? `/${language}/` : `/${language}${pathWithoutLanguage}`;
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
