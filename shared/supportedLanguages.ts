/** Canonical UI / marketing language codes (single source of truth). */
export const SUPPORTED_LANGUAGES = ["en", "de", "fr", "es", "it", "nl", "pt", "sr", "hr", "tr", "pl"] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const NON_ENGLISH_LANGUAGE_CODES = SUPPORTED_LANGUAGES.filter(
  (language): language is Exclude<SupportedLanguage, "en"> => language !== "en",
);

export function isSupportedLanguage(code: string): code is SupportedLanguage {
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(code);
}

export function normalizeLanguageCode(language: string | null | undefined): SupportedLanguage {
  const code = language?.trim().toLowerCase().split("-")[0] ?? "";
  if (isSupportedLanguage(code)) return code;
  return "en";
}

/** Account `preferredLanguage` PATCH body: product UI codes, regional tags, or null. */
export function normalizeAccountPreferredLanguageInput(
  raw: unknown,
): { ok: true; value: SupportedLanguage | null } | { ok: false; message: string } {
  if (raw === null || raw === "") return { ok: true, value: null };
  if (typeof raw !== "string") {
    return { ok: false, message: "preferredLanguage must be a string or null" };
  }
  const primary = raw.trim().toLowerCase().split("-")[0];
  if (isSupportedLanguage(primary)) {
    return { ok: true, value: primary };
  }
  return {
    ok: false,
    message: `preferredLanguage must be one of ${SUPPORTED_LANGUAGES.join(", ")} (or a regional tag such as en-US), or null`,
  };
}

/**
 * BCP 47 tag for Intl and `html lang`.
 * Serbian UI copy is Latin-only; bare `sr` formats months in Cyrillic.
 */
export function intlLocaleForLanguage(language: string): string {
  const code = language.trim().toLowerCase();
  if (code === "sr" || code.startsWith("sr-")) return "sr-Latn";
  return language;
}

/** Regex fragment for locale home paths: `de|fr|...` */
export const LOCALE_HOME_PATH_PATTERN = NON_ENGLISH_LANGUAGE_CODES.join("|");

export function isLocaleHomeSegment(segment: string): boolean {
  return (NON_ENGLISH_LANGUAGE_CODES as readonly string[]).includes(segment);
}
