import React from "react";
import { Info } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function EnglishOnlyDocBanner() {
  const { language, t } = useLanguage();
  if (language === "en") return null;

  return (
    <div
      role="status"
      className="mb-8 flex gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3.5 text-sm leading-relaxed text-blue-900 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-200 sm:px-5"
    >
      <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <p>{t.devEnglishOnlyBanner}</p>
    </div>
  );
}
