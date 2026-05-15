import {
  SUPPORTED_LANGUAGES,
  normalizeLanguageCode,
  type SupportedLanguage,
} from "@/utils/translation";

const STORAGE_KEY = "privatenote.language";

/** Apply account preferred language from `/api/auth/account/summary` when signed in. */
export async function fetchAndApplyAccountPreferredLanguage(
  apply: (language: SupportedLanguage) => void,
): Promise<void> {
  try {
    const response = await fetch("/api/auth/account/summary", {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return;
    const data = (await response.json()) as { ok?: boolean; preferredLanguage?: string | null };
    if (!data.ok || typeof data.preferredLanguage !== "string") return;
    const preferredLanguage = normalizeLanguageCode(data.preferredLanguage);
    if (!SUPPORTED_LANGUAGES.includes(preferredLanguage)) return;
    apply(preferredLanguage);
    window.localStorage.setItem(STORAGE_KEY, preferredLanguage);
  } catch {
    // non-authenticated or network error
  }
}
