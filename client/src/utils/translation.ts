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
