import {
  NON_ENGLISH_LANGUAGE_CODES,
  normalizeLanguageCode,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from "@shared/supportedLanguages";

export {
  NON_ENGLISH_LANGUAGE_CODES,
  normalizeLanguageCode,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from "@shared/supportedLanguages";

export type Translations = Record<string, string>;

export type LanguageOption = {
  code: SupportedLanguage;
  nativeName: string;
  englishName: string;
};

export const LANGUAGE_OPTIONS: readonly LanguageOption[] = [
  { code: "en", nativeName: "English", englishName: "English" },
  { code: "de", nativeName: "Deutsch", englishName: "German" },
  { code: "fr", nativeName: "Français", englishName: "French" },
  { code: "es", nativeName: "Español", englishName: "Spanish" },
  { code: "it", nativeName: "Italiano", englishName: "Italian" },
  { code: "nl", nativeName: "Nederlands", englishName: "Dutch" },
  { code: "pt", nativeName: "Português", englishName: "Portuguese" },
  { code: "sr", nativeName: "Srpski", englishName: "Serbian" },
  { code: "hr", nativeName: "Hrvatski", englishName: "Croatian" },
];

export function getUserLanguage(): SupportedLanguage {
  if (typeof navigator === "undefined") return "en";
  return normalizeLanguageCode(navigator.language);
}
