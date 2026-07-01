import { useState } from "react";
import { Check, Cloud, Minus, X } from "lucide-react";

type CloudAssistActiveBannerProps = {
  t: Record<string, string>;
  tx: (key: string, fallback: string) => string;
  onSwitchBackToPrivate?: () => void;
  showSwitchBack: boolean;
};

const PRO_ITEM_CLASS =
  "flex items-start gap-2.5 text-sm text-orange-950/90 dark:text-orange-100/90 sm:text-base";
const CON_ITEM_CLASS =
  "flex items-start gap-2.5 text-sm text-orange-950/85 dark:text-orange-100/85 sm:text-base";

export function CloudAssistActiveBanner({
  t,
  tx,
  onSwitchBackToPrivate,
  showSwitchBack,
}: CloudAssistActiveBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  const title = tx("aiComposerCloudAssistBlockHeading", "Cloud Assist — Gemma 4 26B");
  const pros = [
    tx("aiComposerCloudAssistPro1", "Better drafts — Gemma 4 26B"),
    tx("aiComposerCloudAssistPro2", "Faster — no download"),
    tx("aiComposerCloudAssistPro3", "Works on any device"),
  ];
  const cons = [
    tx("aiComposerCloudAssistCon1", "Prompt leaves this device"),
    tx("aiComposerCloudAssistCon2", "Cloud processing before encryption"),
    tx("aiComposerCloudAssistCon3", "Unprotected during generation"),
  ];

  return (
    <div className="space-y-2">
      {!dismissed && (
        <div className="relative rounded-xl border border-orange-300/70 bg-orange-50/80 px-5 pb-6 pt-3 space-y-3 dark:border-orange-800/60 dark:bg-orange-950/30 sm:px-6 sm:pb-7 sm:pt-3.5 sm:space-y-3.5">
          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label={tx("aiComposerDismissBanner", "Dismiss")}
            className="absolute right-2.5 top-2.5 p-1 text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-200 focus:outline-none"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>

          <div className="flex flex-col items-center gap-2 px-10 pt-0.5">
            <div className="flex items-center justify-center gap-2">
              <Cloud
                className="h-5 w-5 shrink-0 text-orange-700 dark:text-orange-300 sm:h-[1.125rem] sm:w-[1.125rem]"
                aria-hidden
              />
              <p className="text-center text-xl font-semibold leading-tight text-orange-950 dark:text-orange-100 sm:text-2xl">
                {title}
              </p>
            </div>
            <span className="shrink-0 rounded-full border border-red-300 bg-red-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-red-700 dark:border-red-700 dark:bg-red-950/50 dark:text-red-400 sm:text-xs">
              {t.aiComposerCloudAssistNotFullyPrivate}
            </span>
          </div>

          <div className="mx-auto grid w-full max-w-2xl gap-4 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-2.5">
            <ul className="mx-auto w-full max-w-xs space-y-2 sm:space-y-2.5 sm:mx-0">
              {pros.map((item) => (
                <li key={item} className={PRO_ITEM_CLASS}>
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400 sm:h-[1.125rem] sm:w-[1.125rem]"
                    aria-hidden
                  />
                  {item}
                </li>
              ))}
            </ul>
            <ul className="mx-auto w-full max-w-xs space-y-2 sm:space-y-2.5 sm:mx-0">
              {cons.map((item) => (
                <li key={item} className={CON_ITEM_CLASS}>
                  <Minus
                    className="mt-0.5 h-4 w-4 shrink-0 text-red-500 dark:text-red-400 sm:h-[1.125rem] sm:w-[1.125rem]"
                    aria-hidden
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {showSwitchBack && onSwitchBackToPrivate ? (
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 sm:text-base">
          <span className="font-semibold">{tx("aiComposerCloudAssistBannerLine3a", "Need complete privacy?")}</span>{" "}
          <button
            type="button"
            onClick={onSwitchBackToPrivate}
            className="font-semibold text-primary underline underline-offset-2 hover:text-primary/80 dark:text-primary/90 dark:hover:text-primary/70"
          >
            {tx("aiComposerSwitchBackToPrivateAi", "Use Private AI instead")}
          </button>{" "}
          ›
        </p>
      ) : null}
    </div>
  );
}
