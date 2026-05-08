import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  SUPPORTED_LANGUAGES,
  getTranslations,
  getUserLanguage,
  normalizeLanguageCode,
  type SupportedLanguage,
  type Translations,
} from "@/utils/translation";

type LanguageContextValue = {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: Translations;
};

const STORAGE_KEY = "privatenote.language";

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getPathLanguage(): SupportedLanguage | null {
  if (typeof window === "undefined") return null;
  const firstSegment = window.location.pathname.split("/").filter(Boolean)[0];
  if (!firstSegment) return null;
  const normalized = normalizeLanguageCode(firstSegment);
  return SUPPORTED_LANGUAGES.includes(normalized) && normalized !== "en" ? normalized : null;
}

function getInitialLanguage(): SupportedLanguage {
  if (typeof window === "undefined") return "en";
  return getPathLanguage() ?? normalizeLanguageCode(window.localStorage.getItem(STORAGE_KEY) ?? getUserLanguage());
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => getInitialLanguage());

  const setLanguage = (nextLanguage: SupportedLanguage) => {
    setLanguageState(nextLanguage);
    window.localStorage.setItem(STORAGE_KEY, nextLanguage);
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const pathLanguage = getPathLanguage();
    if (pathLanguage) return;

    const syncPreferredLanguage = async () => {
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
        setLanguageState(preferredLanguage);
        window.localStorage.setItem(STORAGE_KEY, preferredLanguage);
      } catch {
        // no-op: non-authenticated users won't have account summary
      }
    };

    void syncPreferredLanguage();
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      t: getTranslations(language),
    }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
}
