import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";

type PrivateAiStatusPanelProps = {
  tx: (key: string, fallback: string) => string;
  recommendedModelLabel: string | null;
  localPrivateAiReady: boolean;
  isAiModelLoading: boolean;
  aiModelProgress: { progress: number; text: string; detail?: string } | null;
  compact?: boolean;
};

export function PrivateAiStatusPanel({
  tx,
  recommendedModelLabel,
  localPrivateAiReady,
  isAiModelLoading,
  aiModelProgress,
  compact = false,
}: PrivateAiStatusPanelProps) {
  const [dismissed, setDismissed] = useState(false);

  // Always show when model is loading so the progress bar is never hidden
  useEffect(() => {
    if (isAiModelLoading) setDismissed(false);
  }, [isAiModelLoading]);

  const modelName = recommendedModelLabel ?? tx("aiComposerPrivateAiModelFallback", "on-device model");
  const heading = tx("aiComposerPrivateAiHeading", "Private AI — {model}").replace("{model}", modelName);
  const showLoadBar = isAiModelLoading && aiModelProgress;
  const showReadyChip = localPrivateAiReady && !isAiModelLoading;

  if (dismissed) return null;

  return (
    <div
      className={[
        "relative rounded-xl border border-primary/25 bg-primary/5 px-4 py-3 space-y-2.5",
        compact ? "py-2.5" : "pb-7",
      ].join(" ")}
    >
      {/* X — top right, no border */}
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label={tx("aiComposerDismissPrivateAiPanel", "Dismiss")}
        className="absolute right-2 top-2 p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
      >
        <X className="h-3.5 w-3.5" aria-hidden />
      </button>

      {/* ✓ Ready — bottom right, aligned under X */}
      {showReadyChip ? (
        <span className="absolute bottom-2 right-3 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
          ✓ {tx("aiComposerPrivateAiReadyShort", "Ready")}
        </span>
      ) : null}

      {/* Title + Recommended pill inline */}
      <div className="flex items-center gap-2 pr-6">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{heading}</p>
        <span className="shrink-0 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary dark:border-primary/40 dark:bg-primary/20">
          {tx("aiComposerModelRecommended", "Recommended")}
        </span>
      </div>

      {showLoadBar ? (
        <div className="flex flex-col gap-2 rounded-lg border border-primary/20 bg-white/70 p-3 dark:border-primary/30 dark:bg-gray-900/50">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
              {aiModelProgress.text}
            </span>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {Math.round(aiModelProgress.progress)}%
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-primary/15 dark:bg-primary/25">
            <div
              className="h-1.5 rounded-full bg-primary transition-all duration-300"
              style={{ width: `${aiModelProgress.progress}%` }}
            />
          </div>
          {aiModelProgress.detail ? (
            <p className="break-words text-xs text-gray-600 dark:text-gray-400">{aiModelProgress.detail}</p>
          ) : null}
        </div>
      ) : null}

      {!compact ? (
        <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
          <li className="flex items-center gap-2">
            <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
            {tx("aiComposerPrivateAiBullet1", "Runs entirely in your browser")}
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
            {tx("aiComposerPrivateAiBullet2", "Your text never leaves your device")}
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
            {tx("aiComposerPrivateAiBullet3", "No servers, no tracking, no external storage")}
          </li>
        </ul>
      ) : null}
    </div>
  );
}
