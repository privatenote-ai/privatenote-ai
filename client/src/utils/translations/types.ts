export const SUPPORTED_LANGUAGES = ["en", "de", "fr", "es", "it", "nl"] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

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
];

export function normalizeLanguageCode(language: string | null | undefined): SupportedLanguage {
  const code = language?.trim().toLowerCase().split("-")[0];
  return SUPPORTED_LANGUAGES.includes(code as SupportedLanguage) ? (code as SupportedLanguage) : "en";
}

export function getUserLanguage(): SupportedLanguage {
  if (typeof navigator === "undefined") return "en";
  return normalizeLanguageCode(navigator.language);
}
