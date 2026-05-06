/** Persisted optional “boost” models (localStorage). */

export const GEMMA22_BOOST_STORAGE_KEY = "privatenote_mobile_gemma_boost";
export const GEMMA4_BOOST_STORAGE_KEY = "privatenote_local_llm_gemma4_boost";

export function getIsGemma22BoostEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(GEMMA22_BOOST_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function setGemma22BoostEnabled(on: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (on) {
      localStorage.setItem(GEMMA22_BOOST_STORAGE_KEY, "1");
    } else {
      localStorage.removeItem(GEMMA22_BOOST_STORAGE_KEY);
    }
  } catch {
    /* private mode — ignore */
  }
}

export function getIsGemma4BoostEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(GEMMA4_BOOST_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function setGemma4BoostEnabled(on: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (on) {
      localStorage.setItem(GEMMA4_BOOST_STORAGE_KEY, "1");
    } else {
      localStorage.removeItem(GEMMA4_BOOST_STORAGE_KEY);
    }
  } catch {
    /* private mode — ignore */
  }
}

/** @deprecated Use {@link getIsGemma22BoostEnabled}. */
export const getIsMobileBoostEnabled = getIsGemma22BoostEnabled;

/** @deprecated Use {@link setGemma22BoostEnabled}. */
export const setMobileBoostEnabled = setGemma22BoostEnabled;
