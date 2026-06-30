import { useState } from "react";
import { Cloud, X } from "lucide-react";

type CloudAssistActiveBannerProps = {
  t: Record<string, string>;
  tx: (key: string, fallback: string) => string;
  onSwitchBackToPrivate?: () => void;
  showSwitchBack: boolean;
};

export function CloudAssistActiveBanner({
  t,
  tx,
  onSwitchBackToPrivate,
  showSwitchBack,
}: CloudAssistActiveBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  return (
    <div className="space-y-2">
    {!dismissed && (
    <div className="relative rounded-xl border border-orange-300/70 bg-orange-50/80 px-4 py-3 dark:border-orange-800/60 dark:bg-orange-950/30">
      {/* X — dismiss */}
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label={tx("aiComposerDismissBanner", "Dismiss")}
        className="absolute right-2 top-2 p-1 text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-200 focus:outline-none"
      >
        <X className="h-3.5 w-3.5" aria-hidden />
      </button>

      {/* Title row */}
      <div className="flex flex-wrap items-center gap-2 pr-6">
        <Cloud className="h-4 w-4 shrink-0 text-orange-700 dark:text-orange-300" aria-hidden />
        <p className="text-sm font-semibold text-orange-950 dark:text-orange-100">
          {tx("aiComposerUsingCloudAssistTitle", "Cloud Assist")}
        </p>
        <span className="rounded-full border border-red-300 bg-red-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-700 dark:border-red-700 dark:bg-red-950/50 dark:text-red-400">
          {t.aiComposerCloudAssistNotFullyPrivate}
        </span>
      </div>

      {/* Body */}
      <div className="mt-2 space-y-1.5 text-xs leading-relaxed text-orange-950/85 dark:text-orange-100/80">
        <p>
          {tx(
            "aiComposerCloudAssistBannerLine1",
            "Generate a draft with",
          )}{" "}
          <strong>Google Gemma 4 26B</strong>{" "}
          {tx("aiComposerCloudAssistBannerLine1b", "running on")}{" "}
          <strong>Cloudflare Workers AI</strong>.
        </p>
        <p>
          {tx(
            "aiComposerCloudAssistBannerLine2a",
            "Your prompt is sent securely to the cloud for processing.",
          )}{" "}
          <strong>PrivateNote</strong>{" "}
          {tx(
            "aiComposerCloudAssistBannerLine2b",
            "cannot encrypt or control your text while it is being generated.",
          )}
        </p>
      </div>
    </div>
    )}

      {showSwitchBack && onSwitchBackToPrivate ? (
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
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
