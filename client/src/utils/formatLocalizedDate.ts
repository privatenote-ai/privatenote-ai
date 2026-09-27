import { intlLocaleForLanguage } from "@shared/supportedLanguages";

export function formatLocalizedLongDate(
  language: string,
  value: Date | string | null | undefined,
): string {
  if (!value) return "";
  return new Intl.DateTimeFormat(intlLocaleForLanguage(language), { dateStyle: "long" }).format(
    value instanceof Date ? value : new Date(value),
  );
}
