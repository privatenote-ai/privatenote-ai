import { isPublicMarketingPath } from "./publicMarketingPaths.ts";
import { isSupportedLanguage, type SupportedLanguage } from "./supportedLanguages.ts";

/**
 * UI language implied by a public URL, or null for app routes that keep the
 * saved preference (`/note/:id`, `/auth`, `/account`, …).
 *
 * Locale prefixes win (`/pl/privacy-tools` → pl). Unprefixed marketing URLs
 * including `/privacy-tools` and `/blog/privacy-tools` are English — they must
 * not inherit a leftover Polish (or other) preference from localStorage.
 */
export function uiLanguageFromPathname(pathname: string): SupportedLanguage | null {
  const path = pathname.split(/[?#]/)[0] || "/";
  const first = path.split("/").filter(Boolean)[0];
  if (first && isSupportedLanguage(first) && first !== "en") {
    return first;
  }
  if (isPublicMarketingPath(path)) {
    return "en";
  }
  return null;
}
