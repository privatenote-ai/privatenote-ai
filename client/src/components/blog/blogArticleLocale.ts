import type { SupportedLanguage } from "@/utils/translation";

/** Locales with full inline article copy in blog post components. */
export const BLOG_ARTICLE_LOCALES: readonly SupportedLanguage[] = [
  "en",
  "de",
  "fr",
  "es",
  "it",
  "nl",
  "pt",
  "hr",
  "sr",
];

export function getBlogArticleCopy<T>(
  copy: Partial<Record<SupportedLanguage, T>> & { en: T },
  language: SupportedLanguage,
): T {
  return copy[language] ?? copy.en;
}

export function blogArticleUsesEnglishFallback<T>(
  copy: Partial<Record<SupportedLanguage, T>> & { en: T },
  language: SupportedLanguage,
): boolean {
  return language !== "en" && copy[language] == null;
}
