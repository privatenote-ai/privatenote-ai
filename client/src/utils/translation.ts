import { en } from "./translations/en";
import {
  getUserLanguage,
  normalizeLanguageCode,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
  type Translations,
} from "./translations/types";

export {
  getUserLanguage,
  LANGUAGE_OPTIONS,
  intlLocaleForLanguage,
  normalizeLanguageCode,
  SUPPORTED_LANGUAGES,
  type LanguageOption,
  type SupportedLanguage,
  type Translations,
} from "./translations/types";

export { en };

const localeLoaders: Record<Exclude<SupportedLanguage, "en">, () => Promise<Translations>> = {
  de: () => import("./translations/de").then((m) => ({ ...en, ...m.de })),
  fr: () => import("./translations/fr").then((m) => ({ ...en, ...m.fr })),
  es: () => import("./translations/es").then((m) => ({ ...en, ...m.es })),
  it: () => import("./translations/it").then((m) => ({ ...en, ...m.it })),
  nl: () => import("./translations/nl").then((m) => ({ ...en, ...m.nl })),
  pt: () => import("./translations/pt").then((m) => ({ ...en, ...m.pt })),
  sr: () => import("./translations/sr").then((m) => ({ ...en, ...m.sr })),
  hr: () => import("./translations/hr").then((m) => ({ ...en, ...m.hr })),
  tr: () => import("./translations/tr").then((m) => ({ ...en, ...m.tr })),
  pl: () => import("./translations/pl").then((m) => ({ ...en, ...m.pl })),
};

const cache: Partial<Record<SupportedLanguage, Translations>> = { en };

function pathLanguageFromWindow(): SupportedLanguage | null {
  if (typeof window === "undefined") return null;
  const firstSegment = window.location.pathname.split("/").filter(Boolean)[0];
  if (!firstSegment) return null;
  const normalized = normalizeLanguageCode(firstSegment);
  return SUPPORTED_LANGUAGES.includes(normalized) && normalized !== "en" ? normalized : null;
}

/** Start fetching a non-English locale as early as possible (path-based homes). */
function preloadPathLocale(): void {
  const pathLang = pathLanguageFromWindow();
  if (pathLang) void loadTranslations(pathLang);
}

preloadPathLocale();

export async function loadTranslations(lang: SupportedLanguage): Promise<Translations> {
  const normalized = normalizeLanguageCode(lang);
  const cached = cache[normalized];
  if (cached) return cached;

  if (normalized === "en") {
    cache.en = en;
    return en;
  }

  const loaded = await localeLoaders[normalized]();
  cache[normalized] = loaded;
  return loaded;
}

/** Synchronous strings for the active locale (English until async locales finish loading). */
export function getTranslations(lang: string = "en"): Translations {
  const normalized = normalizeLanguageCode(lang);
  return cache[normalized] ?? en;
}

const LANGUAGE_STORAGE_KEY = "privatenote.language";

/** Best-effort active UI language (path prefix, then saved preference). */
export function getActiveLanguage(): SupportedLanguage {
  if (typeof window === "undefined") return "en";
  const pathLang = pathLanguageFromWindow();
  if (pathLang) return pathLang;
  return normalizeLanguageCode(window.localStorage.getItem(LANGUAGE_STORAGE_KEY) ?? getUserLanguage());
}

/** Translations for the active UI language (sync; uses cache when loaded). */
export function getActiveTranslations(): Translations {
  return getTranslations(getActiveLanguage());
}
