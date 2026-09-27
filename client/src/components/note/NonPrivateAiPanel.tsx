import { AlertTriangle, ArrowUp, Lock } from "lucide-react";
import { WritingPencilIcon } from "@/components/note/WritingPencilIcon";

type NonPrivateAiPanelProps = {
  t: Record<string, string>;
  tx: (key: string, fallback: string) => string;
  aiPrompt: string;
  setAiPrompt: (value: string) => void;
  requiresSessionAck: boolean;
  sessionAcknowledged: boolean;
  onSessionAcknowledgedChange: (ack: boolean) => void;
  isGeneratingContent: boolean;
  hasPromptText: boolean;
  hostedCloudAiRemaining: number | null;
  hostedCloudAiLimit: number;
  onGenerate: () => void;
  submitHint?: string;
};

export function NonPrivateAiPanel({
  t,
  tx,
  aiPrompt,
  setAiPrompt,
  requiresSessionAck,
  sessionAcknowledged,
  onSessionAcknowledgedChange,
  isGeneratingContent,
  hasPromptText,
  hostedCloudAiRemaining,
  hostedCloudAiLimit,
  onGenerate,
  submitHint,
}: NonPrivateAiPanelProps) {
  const quotaExhausted = hostedCloudAiRemaining === 0;
  const canGenerate =
    hasPromptText &&
    !isGeneratingContent &&
    !quotaExhausted &&
    (!requiresSessionAck || sessionAcknowledged);

  return (
    <div className="space-y-3">
      {requiresSessionAck ? (
        <label className="flex items-start gap-2.5 cursor-pointer rounded-lg border border-amber-200/80 bg-amber-50/50 px-3 py-2.5 dark:border-amber-900/50 dark:bg-amber-950/20">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-amber-600 text-amber-700 focus:ring-amber-600"
            checked={sessionAcknowledged}
            onChange={(e) => onSessionAcknowledgedChange(e.target.checked)}
          />
          <span className="text-sm text-gray-800 dark:text-gray-200">
            {tx(
              "aiComposerNonPrivateAckShort",
              "I understand my prompt will be sent to Cloudflare Workers AI.",
            )}
          </span>
        </label>
      ) : null}

      <div className="relative min-w-0">
        <div className="min-w-0 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 transition-shadow duration-300 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-400/40">
          <textarea
            id="non-private-ai-prompt"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (!(e.metaKey || e.ctrlKey) || e.key !== "Enter") return;
              e.preventDefault();
              if (!canGenerate) return;
              onGenerate();
            }}
            rows={6}
            className="min-h-[11rem] w-full resize-y bg-transparent py-4 pl-5 pr-20 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-gray-100 dark:placeholder:text-gray-500"
            placeholder={t.aiComposerCloudAssistPlaceholder}
          />
        </div>
        <button
          type="button"
          onClick={onGenerate}
          disabled={!canGenerate}
          title={tx("aiComposerNonPrivateGenerate", "Generate with Cloud Assist")}
          aria-label={tx("aiComposerNonPrivateGenerate", "Generate with Cloud Assist")}
          className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-amber-600 text-white shadow-md hover:bg-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 disabled:pointer-events-none disabled:opacity-40"
        >
          {isGeneratingContent ? (
            <WritingPencilIcon sizeClassName="h-5 w-5" tone="onPrimary" />
          ) : (
            <ArrowUp className="h-5 w-5" aria-hidden strokeWidth={2.25} />
          )}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
        <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-600" aria-hidden />
        <span>
          {hostedCloudAiRemaining === null
            ? t.aiComposerCloudAssistIncluded.replace("{count}", String(hostedCloudAiLimit))
            : t.aiComposerCloudAssistRemaining
                .replace("{remaining}", String(hostedCloudAiRemaining))
                .replace("{limit}", String(hostedCloudAiLimit))}
        </span>
        <span className="text-gray-300 dark:text-gray-600" aria-hidden>
          ·
        </span>
        <span className="inline-flex items-center gap-1 font-medium text-amber-800 dark:text-amber-300">
          <Lock className="h-3.5 w-3.5 opacity-70" aria-hidden />
          {tx("aiComposerNonPrivateNotPrivateBadge", "Not private")}
        </span>
        {submitHint ? (
          <>
            <span className="text-gray-300 dark:text-gray-600" aria-hidden>·</span>
            <span className="text-gray-500 dark:text-gray-400">{submitHint}</span>
          </>
        ) : null}
      </div>

      {requiresSessionAck && !sessionAcknowledged ? (
        <p className="text-xs text-amber-800 dark:text-amber-300">
          {tx("aiComposerNonPrivateNeedAck", "Confirm the checkbox before generating.")}
        </p>
      ) : null}
      {quotaExhausted ? (
        <p className="text-xs text-amber-800 dark:text-amber-300">{t.aiComposerCloudAssistNoFree}</p>
      ) : null}
    </div>
  );
}
