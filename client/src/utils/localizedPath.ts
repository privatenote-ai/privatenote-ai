import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/utils/translation";

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
  return pathWithoutLanguage === "/" ? `/${language}` : `/${language}${pathWithoutLanguage}`;
}

export function switchLanguagePath(pathname: string, language: SupportedLanguage): string {
  const { pathWithoutLanguage } = splitLanguagePrefix(pathname);
  return localizedPath(pathWithoutLanguage, language);
}
