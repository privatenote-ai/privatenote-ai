import { useEffect, useState } from "react";
import { Puzzle, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import {
  CHROME_EXTENSION_STORE_URL,
  dismissChromeExtensionPrompt,
  meetsChromeExtensionOnboardingPrerequisites,
  watchPrivateNoteChromeExtensionInstalled,
} from "@/utils/chromeExtensionOnboarding";

export function ChromeExtensionOnboardingBanner() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!meetsChromeExtensionOnboardingPrerequisites()) return;

    return watchPrivateNoteChromeExtensionInstalled((installed) => {
      setVisible(!installed);
    });
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    dismissChromeExtensionPrompt();
    setVisible(false);
  };

  return (
    <div className="rounded-xl border border-primary/25 bg-primary/[0.06] px-4 py-4 sm:px-5 sm:py-4 dark:border-primary/30 dark:bg-primary/10">
      <div className="flex gap-3 sm:items-start">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20">
          <Puzzle className="h-4 w-4" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <p className="m-0 text-sm font-semibold text-gray-900 dark:text-white sm:text-base">
              {t.chromeExtensionOnboardingTitle || "Create notes from Chrome"}
            </p>
            <button
              type="button"
              onClick={dismiss}
              aria-label={t.chromeExtensionOnboardingDismiss || "Not now"}
              className="shrink-0 rounded-md p-1 text-gray-500 hover:bg-black/5 hover:text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-gray-200"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
          <p className="mt-1.5 m-0 text-sm leading-snug text-gray-600 dark:text-gray-300">
            {t.chromeExtensionOnboardingBody ||
              "Install the PrivateNote Chrome extension to encrypt and share secrets without leaving your browser."}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2.5">
            <a
              href={CHROME_EXTENSION_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950"
            >
              {t.chromeExtensionOnboardingInstall || "Add to Chrome"}
            </a>
            <button
              type="button"
              onClick={dismiss}
              className="text-sm font-medium text-gray-600 underline-offset-4 hover:text-gray-900 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-sm dark:text-gray-400 dark:hover:text-gray-200"
            >
              {t.chromeExtensionOnboardingDismiss || "Not now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
