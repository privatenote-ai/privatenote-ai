import { useEffect, useState } from "react";
import { Check, Minus, Sparkles, X } from "lucide-react";

type PrivateAiStatusPanelProps = {
  tx: (key: string, fallback: string) => string;
  recommendedModelLabel: string | null;
  localPrivateAiReady: boolean;
  isAiModelLoading: boolean;
  aiModelProgress: { progress: number; text: string; detail?: string } | null;
  compact?: boolean;
};

const PRO_ITEM_CLASS =
  "flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-400 sm:text-base";
const CON_ITEM_CLASS =
  "flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-400 sm:text-base";

export function PrivateAiStatusPanel({
  tx,
  recommendedModelLabel,
  localPrivateAiReady,
  isAiModelLoading,
  aiModelProgress,
  compact = false,
}: PrivateAiStatusPanelProps) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (isAiModelLoading) setDismissed(false);
  }, [isAiModelLoading]);

  const modelName = recommendedModelLabel ?? tx("aiComposerPrivateAiModelFallback", "on-device model");
  const brand = tx("aiComposerPrivateAiBlockBrand", "Truly Private AI");
  const recommendedLabel = tx("aiComposerModelRecommended", "Recommended");
  const showLoadBar = isAiModelLoading && aiModelProgress;
  const showReadyChip = localPrivateAiReady && !isAiModelLoading;

  const pros = [
    tx("aiComposerPrivateAiBullet1", "Runs entirely in your browser"),
    tx("aiComposerPrivateAiBullet2", "Your text never leaves your device"),
    tx("aiComposerPrivateAiBullet3", "No servers or tracking"),
  ];
  const cons = [
    tx("aiComposerPrivateAiCon1", "Slower than Cloud Assist"),
    tx("aiComposerPrivateAiCon2", "Weaker model ({model})").replace("{model}", modelName),
    tx("aiComposerPrivateAiCon3", "Needs capable device + download"),
  ];

  if (dismissed) return null;

  return (
    <div
      className={[
        "relative rounded-xl border border-primary/25 bg-primary/5 px-5 pb-6 pt-3 space-y-3 sm:px-6 sm:pb-7 sm:pt-3.5 sm:space-y-3.5",
        compact ? "py-3 sm:py-3.5" : showReadyChip ? "sm:pb-9" : "",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label={tx("aiComposerDismissPrivateAiPanel", "Dismiss")}
        className="absolute right-2.5 top-2.5 p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
      >
        <X className="h-4 w-4" aria-hidden />
      </button>

      {showReadyChip ? (
        <span className="absolute bottom-3 right-4 text-xs font-medium text-emerald-700 dark:text-emerald-400 sm:text-sm">
          ✓ {tx("aiComposerPrivateAiReadyShort", "Ready")}
        </span>
      ) : null}

      <div className="flex flex-col items-center gap-2 px-10 pt-0.5">
        <div className="flex items-center justify-center gap-2">
          <Sparkles
            className="h-5 w-5 shrink-0 text-primary dark:text-primary/90 sm:h-[1.125rem] sm:w-[1.125rem]"
            aria-hidden
          />
          <p className="text-center text-xl font-semibold leading-tight sm:text-2xl">
            <span className="text-primary dark:text-primary/90">{brand}</span>
            <span className="text-gray-900 dark:text-gray-100"> — {modelName}</span>
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary dark:border-primary/40 dark:bg-primary/15 dark:text-primary/90 sm:text-xs">
          {recommendedLabel}
        </span>
      </div>

      {showLoadBar ? (
        <div className="flex flex-col gap-2.5 rounded-lg border border-primary/20 bg-white/70 p-3.5 dark:border-primary/30 dark:bg-gray-900/50 sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-100 sm:text-base">
              {aiModelProgress.text}
            </span>
            <span className="text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
              {Math.round(aiModelProgress.progress)}%
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-primary/15 dark:bg-primary/25">
            <div
              className="h-2 rounded-full bg-primary transition-all duration-300"
              style={{ width: `${aiModelProgress.progress}%` }}
            />
          </div>
          {aiModelProgress.detail ? (
            <p className="break-words text-xs text-gray-600 dark:text-gray-400 sm:text-sm">{aiModelProgress.detail}</p>
          ) : null}
        </div>
      ) : null}

      {!compact ? (
        <div className="mx-auto grid w-full max-w-2xl gap-4 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-2.5">
          <ul className="mx-auto w-full max-w-xs space-y-2 sm:space-y-2.5 sm:mx-0">
            {pros.map((item) => (
              <li key={item} className={PRO_ITEM_CLASS}>
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400 sm:h-[1.125rem] sm:w-[1.125rem]" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
          <ul className="mx-auto w-full max-w-xs space-y-2 sm:space-y-2.5 sm:mx-0">
            {cons.map((item) => (
              <li key={item} className={CON_ITEM_CLASS}>
                <Minus className="mt-0.5 h-4 w-4 shrink-0 text-red-500 dark:text-red-400 sm:h-[1.125rem] sm:w-[1.125rem]" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
