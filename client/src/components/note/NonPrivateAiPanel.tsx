import { Link } from "wouter";
import { AlertTriangle, ArrowUp, Cloud, Lock, ShieldOff } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { WritingPencilIcon } from "@/components/note/WritingPencilIcon";

type NonPrivateAiPanelProps = {
  t: Record<string, string>;
  tx: (key: string, fallback: string) => string;
  aiPrompt: string;
  setAiPrompt: (value: string) => void;
  allowHostedAi: boolean;
  onAllowHostedAiChange: (allowed: boolean) => void;
  sessionAcknowledged: boolean;
  onSessionAcknowledgedChange: (ack: boolean) => void;
  isGeneratingContent: boolean;
  hasPromptText: boolean;
  hostedCloudAiRemaining: number | null;
  hostedCloudAiLimit: number;
  preferencesHref: string;
  onGenerate: () => void;
};

export function NonPrivateAiPanel({
  t,
  tx,
  aiPrompt,
  setAiPrompt,
  allowHostedAi,
  onAllowHostedAiChange,
  sessionAcknowledged,
  onSessionAcknowledgedChange,
  isGeneratingContent,
  hasPromptText,
  hostedCloudAiRemaining,
  hostedCloudAiLimit,
  preferencesHref,
  onGenerate,
}: NonPrivateAiPanelProps) {
  const quotaExhausted = hostedCloudAiRemaining === 0;
  const canGenerate =
    allowHostedAi && sessionAcknowledged && hasPromptText && !isGeneratingContent && !quotaExhausted;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border-2 border-amber-500/80 bg-amber-50 dark:border-amber-600/70 dark:bg-amber-950/30 p-4">
        <div className="flex items-start gap-3">
          <ShieldOff className="h-6 w-6 shrink-0 text-amber-700 dark:text-amber-400" aria-hidden />
          <div className="min-w-0 space-y-2">
            <p className="text-base font-bold text-amber-950 dark:text-amber-100">
              {tx("aiComposerNonPrivateTitle", "Non-private AI (hosted) — not Private AI")}
            </p>
            <p className="text-sm font-medium text-amber-900/90 dark:text-amber-200/90">
              {tx(
                "aiComposerNonPrivateLead",
                "This path does not run on your device. It is not the same as “Write with Private AI”.",
              )}
            </p>
            <ul className="list-disc space-y-1 pl-5 text-sm text-amber-900/85 dark:text-amber-200/85">
              <li>
                {tx(
                  "aiComposerNonPrivateBullet1",
                  "Your prompt is sent to Cloudflare Workers AI (Meta Llama) to generate a draft.",
                )}
              </li>
              <li>
                {tx(
                  "aiComposerNonPrivateBullet2",
                  "PrivateNote cannot encrypt or control that text while it is processed in the cloud.",
                )}
              </li>
              <li>
                {tx(
                  "aiComposerNonPrivateBullet3",
                  "Use Private AI on supported devices when you need writing that never leaves your browser.",
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 max-w-lg">
            <div className="flex items-center gap-2">
              <Cloud className="h-4 w-4 text-gray-500" aria-hidden />
              <Label htmlFor="allow-hosted-ai" className="text-sm font-semibold text-gray-900 dark:text-white">
                {tx("aiComposerAllowHostedAi", "Allow non-private hosted AI")}
              </Label>
            </div>
            <p id="allow-hosted-ai-hint" className="text-xs text-gray-600 dark:text-gray-400">
              {tx("aiComposerAllowHostedAiHint", "Off by default. Manage in")}{" "}
              <Link href={preferencesHref} className="font-medium text-primary underline underline-offset-2">
                {tx("authNavPreferences", "Preferences")}
              </Link>
              .
            </p>
          </div>
          <Switch
            id="allow-hosted-ai"
            checked={allowHostedAi}
            onCheckedChange={onAllowHostedAiChange}
            aria-describedby="allow-hosted-ai-hint"
          />
        </div>
      </div>

      {allowHostedAi ? (
        <div className="rounded-xl border border-amber-300/70 dark:border-amber-800/60 bg-amber-50/50 dark:bg-amber-950/20 p-4 space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-amber-600 text-amber-700 focus:ring-amber-600"
              checked={sessionAcknowledged}
              onChange={(e) => onSessionAcknowledgedChange(e.target.checked)}
            />
            <span className="text-sm text-gray-800 dark:text-gray-200">
              {tx(
                "aiComposerNonPrivateAck",
                "I understand this draft uses non-private hosted AI and my prompt will be sent to Cloudflare Workers AI for processing.",
              )}
            </span>
          </label>

          <div>
            <label htmlFor="non-private-ai-prompt" className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {tx("aiComposerNonPrivatePromptLabel", "Prompt for hosted AI (leaves this device)")}
            </label>
            <div className="relative mt-1">
              <textarea
                id="non-private-ai-prompt"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                rows={4}
                className="min-h-[8rem] w-full resize-y rounded-lg border border-amber-200 bg-white px-3 py-2.5 pr-14 text-sm text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 dark:border-amber-900 dark:bg-gray-950 dark:text-gray-100"
                placeholder={t.aiComposerCloudAssistPlaceholder}
              />
              <button
                type="button"
                onClick={onGenerate}
                disabled={!canGenerate}
                title={tx("aiComposerNonPrivateGenerate", "Generate with non-private hosted AI")}
                aria-label={tx("aiComposerNonPrivateGenerate", "Generate with non-private hosted AI")}
                className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-amber-600 text-white shadow-sm hover:bg-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 disabled:pointer-events-none disabled:opacity-40"
              >
                {isGeneratingContent ? (
                  <WritingPencilIcon sizeClassName="h-5 w-5" tone="onPrimary" />
                ) : (
                  <ArrowUp className="h-5 w-5" aria-hidden strokeWidth={2.25} />
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" aria-hidden />
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
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {tx(
            "aiComposerNonPrivateDisabled",
            "Turn on the switch above (or in Preferences) to use hosted AI. Offline templates remain available below.",
          )}
        </p>
      )}

      {allowHostedAi && !sessionAcknowledged ? (
        <p className="text-xs text-amber-800 dark:text-amber-300">
          {tx("aiComposerNonPrivateNeedAck", "Confirm the checkbox before generating.")}
        </p>
      ) : null}
      {allowHostedAi && sessionAcknowledged && quotaExhausted ? (
        <p className="text-xs text-amber-800 dark:text-amber-300">{t.aiComposerCloudAssistNoFree}</p>
      ) : null}
    </div>
  );
}
