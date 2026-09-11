import { NON_ENGLISH_LANGUAGE_CODES, type SupportedLanguage } from "./supportedLanguages.ts";

/** Security guides mirrored under every locale (full translated pages). */
export const LOCALIZED_SECURITY_GUIDE_TOPICS = ["vpn", "password"] as const;

export type LocalizedSecurityGuideTopic = (typeof LOCALIZED_SECURITY_GUIDE_TOPICS)[number];

/** English-only stub guides (messenger, email, browser). */
export const ENGLISH_ONLY_SECURITY_GUIDE_TOPICS = ["messenger", "email", "browser"] as const;

export function isLocalizedSecurityGuideTopic(topic: string): topic is LocalizedSecurityGuideTopic {
  return (LOCALIZED_SECURITY_GUIDE_TOPICS as readonly string[]).includes(topic);
}

export function isSecurityGuideMarketingStem(stem: string): boolean {
  return LOCALIZED_SECURITY_GUIDE_TOPICS.some((topic) => stem === `security-guides/${topic}`);
}

export function localizedSecurityGuidePath(
  topic: LocalizedSecurityGuideTopic,
  language: SupportedLanguage,
): string {
  const base = `/security-guides/${topic}`;
  return language === "en" ? base : `/${language}${base}`;
}

export const LOCALIZED_SECURITY_GUIDE_MARKETING_PATHS = LOCALIZED_SECURITY_GUIDE_TOPICS.flatMap((topic) => {
  const en = `/security-guides/${topic}`;
  const localized = NON_ENGLISH_LANGUAGE_CODES.map(
    (language) => `/${language}/security-guides/${topic}`,
  );
  return [en, ...localized];
});
