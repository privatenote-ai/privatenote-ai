import React, { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  ArrowUp,
  Loader2,
  Zap,
  ZoomIn,
  FileText,
  Sparkles,
  RefreshCw,
  Lock,
} from "lucide-react";
import {
  promptTemplates,
  getPromptTemplateById,
  type PromptTemplate,
} from "@/components/note/promptTemplates";
import { isWebLLMSupported, getWebLLMSupportHint } from "@/utils/clientLLM";
import { MAX_NOTE_AI_PLAINTEXT_UTF8_BYTES } from "@shared/noteSizeLimits";
import { NotePlaintextUtf8Meter } from "./NotePlaintextUtf8Meter";

function templateChipClass(active: boolean): string {
  return `h-9 px-3.5 rounded-full text-xs border transition-all duration-150 text-center inline-flex items-center justify-center ${
    active
      ? "font-semibold bg-primary/18 dark:bg-primary/28 text-primary border-2 border-primary shadow-md shadow-primary/15 ring-1 ring-primary/20"
      : "font-medium bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700/80"
  }`;
}

function StepRow({ step, label }: { step: number; label: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-2.5">
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/12 text-[11px] font-bold text-primary border border-primary/35 dark:bg-primary/20 dark:border-primary/40"
        aria-hidden
      >
        {step}
      </span>
      <span className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {label}
      </span>
    </div>
  );
}

/** Post-generation AI edits; undo restores `contentBefore` without polluting the prompt field. */
export type AiPostGenTransform = {
  kind: "improve" | "summarize" | "simplify" | "regenerate";
  contentBefore: string;
};

export type AiComposerProps = {
  noteContent: string;
  applyNoteContentInput: (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    maxBytes: number,
    trimDescription: string,
  ) => void;
  aiPrompt: string;
  setAiPrompt: (s: string) => void;
  selectedTemplateId: string;
  setSelectedTemplateId: (id: string) => void;
  aiEnhancementType: "improve" | "summarize" | "secure" | "ask";
  setAiEnhancementType: (t: "improve" | "summarize" | "secure" | "ask") => void;
  showPrompt: boolean;
  isGeneratingContent: boolean;
  /** Shown under the prompt while the model runs (load + generate use separate states). */
  aiGenerationStatusText?: string | null;
  isAiModelLoading: boolean;
  aiModelProgress: { progress: number; text: string } | null;
  transformHistory: AiPostGenTransform[];
  onGenerate: (override?: {
    prompt?: string;
    enhancementType?: "improve" | "summarize" | "secure" | "ask";
  }) => void;
  onImprove: () => void;
  onSummarize: () => void;
  onSimplify: () => void;
  onRegenerate: (override?: {
    prompt?: string;
    enhancementType?: "improve" | "summarize" | "secure" | "ask";
  }) => void;
  onBack: () => void;
  privacyBannerItems: React.ReactNode;
  /** Called when a template chip is selected (so parent can sync enhancementType). */
  onSelectTemplate: (template: PromptTemplate) => void;
  /** After generation, user must accept before Share / Customize appear. */
  aiDraftAccepted: boolean;
  onAcceptDraft: () => void;
};

export const AiComposer: React.FC<AiComposerProps> = ({
  noteContent,
  applyNoteContentInput,
  aiPrompt,
  setAiPrompt,
  selectedTemplateId,
  aiEnhancementType,
  showPrompt,
  isGeneratingContent,
  aiGenerationStatusText = null,
  isAiModelLoading,
  aiModelProgress,
  transformHistory,
  onGenerate,
  onImprove,
  onSummarize,
  onSimplify,
  onRegenerate,
  onBack,
  privacyBannerItems,
  onSelectTemplate,
  aiDraftAccepted,
  onAcceptDraft,
}) => {
  const [showAllTemplates, setShowAllTemplates] = useState(false);
  const [heroTypingGlow, setHeroTypingGlow] = useState(false);
  const skipPromptGlowRef = useRef(true);
  const activePromptTemplate = getPromptTemplateById(selectedTemplateId);
  const hasPromptText = aiPrompt.trim().length > 0;

  useEffect(() => {
    if (skipPromptGlowRef.current) {
      skipPromptGlowRef.current = false;
      return;
    }
    setHeroTypingGlow(true);
    const id = window.setTimeout(() => setHeroTypingGlow(false), 1100);
    return () => window.clearTimeout(id);
  }, [aiPrompt]);

  return (
    <div className="space-y-8 mb-4">
      <div>
        {/* Step 1 — templates */}
        <StepRow step={1} label="Choose a template (optional)" />
        <div className="mb-1">
          <div className="flex flex-wrap gap-2">
            {promptTemplates.slice(0, 5).map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => onSelectTemplate(template)}
                className={templateChipClass(selectedTemplateId === template.id)}
              >
                {template.name}
              </button>
            ))}
          </div>

          <div className="mt-3">
            {showAllTemplates && (
              <div className="flex flex-wrap gap-2 mb-3">
                {promptTemplates.slice(5).map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => onSelectTemplate(template)}
                    className={templateChipClass(selectedTemplateId === template.id)}
                  >
                    {template.name}
                  </button>
                ))}
              </div>
            )}

            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setShowAllTemplates(!showAllTemplates)}
                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center px-2 py-1 rounded-md"
              >
                {showAllTemplates ? (
                  <>
                    <ChevronUp className="h-3 w-3 mr-1" />
                    Show fewer templates
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3 mr-1" />
                    Show more templates
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {showPrompt ? (
          <div className="space-y-4 pt-2 border-t border-gray-200/80 dark:border-gray-700/80">
            {/* Step 2 — message */}
            <div>
              <StepRow step={2} label="Write your message" />
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3 tracking-tight">
                What do you want to say?
              </h3>

              <div
                className={[
                  "rounded-xl transition-shadow duration-300 relative",
                  heroTypingGlow ? "ai-prompt-hero--typing" : "",
                  hasPromptText
                    ? "ring-2 ring-primary/25 dark:ring-primary/35 shadow-lg shadow-primary/10"
                    : "ring-1 ring-gray-200/90 dark:ring-gray-600/80 shadow-md",
                ].join(" ")}
              >
                <textarea
                  id="ai-prompt"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (!(e.metaKey || e.ctrlKey) || e.key !== "Enter") return;
                    e.preventDefault();
                    if (isGeneratingContent || isAiModelLoading || !aiPrompt.trim()) return;
                    onGenerate();
                  }}
                  rows={6}
                  className="w-full min-h-[11rem] pl-5 pr-[3.25rem] pb-14 pt-4 text-base rounded-xl border-2 border-gray-200/90 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-y"
                  placeholder={
                    activePromptTemplate?.promptPlaceholder ??
                    (aiEnhancementType === "summarize"
                      ? "Paste a long text that you want to summarize..."
                      : aiEnhancementType === "secure"
                        ? "Paste text that might contain sensitive information to redact..."
                        : "Describe what you want the AI to write for you...")
                  }
                />
                <button
                  type="button"
                  onClick={() => onGenerate()}
                  disabled={isGeneratingContent || isAiModelLoading || !hasPromptText}
                  title="Generate with private AI (⌘/Ctrl+Enter)"
                  aria-label="Generate with private AI"
                  className="absolute bottom-3 right-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/25 ring-2 ring-white/90 dark:ring-gray-900/90 hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 disabled:pointer-events-none disabled:opacity-40 transition-colors"
                >
                  {isGeneratingContent ? (
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                  ) : (
                    <ArrowUp className="h-5 w-5" aria-hidden strokeWidth={2.25} />
                  )}
                </button>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 min-h-[1.25rem]">
                <Sparkles
                  className={[
                    "h-4 w-4 shrink-0 text-primary",
                    hasPromptText && !isGeneratingContent && !isAiModelLoading
                      ? "animate-pulse"
                      : "opacity-40",
                  ].join(" ")}
                  aria-hidden
                />
                <span
                  className={[
                    "text-xs font-medium",
                    hasPromptText && !isGeneratingContent && !isAiModelLoading
                      ? "text-primary dark:text-blue-300"
                      : "text-gray-500 dark:text-gray-400",
                  ].join(" ")}
                >
                  {isGeneratingContent
                    ? aiGenerationStatusText?.trim() || "Generating…"
                    : isAiModelLoading
                      ? "Getting your private AI ready…"
                      : hasPromptText
                        ? "Tap the button or press ⌘/Ctrl+Enter"
                        : "Start typing — your note stays on this device"}
                </span>
              </div>
            </div>

            {activePromptTemplate?.starterExamples &&
              activePromptTemplate.starterExamples.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                    Try an example
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {activePromptTemplate.starterExamples.map((starter, i) => (
                      <button
                        key={`${starter.label}-${i}`}
                        type="button"
                        title={starter.prompt}
                        onClick={() => setAiPrompt(starter.prompt)}
                        className="text-xs px-2.5 py-1 rounded-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left max-w-full"
                      >
                        {starter.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            {/* Trust — replaces “Free AI” card */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-600 dark:text-gray-400">
              <span className="inline-flex items-center gap-1 rounded-full border border-gray-200/90 dark:border-gray-600 bg-gray-50/80 dark:bg-gray-800/60 px-2.5 py-1 font-medium text-gray-700 dark:text-gray-200">
                <Lock className="h-3 w-3 text-primary shrink-0" aria-hidden />
                Private
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-gray-200/90 dark:border-gray-600 bg-gray-50/80 dark:bg-gray-800/60 px-2.5 py-1 font-medium text-gray-700 dark:text-gray-200">
                <Zap className="h-3 w-3 text-amber-500 shrink-0" aria-hidden />
                Instant
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-gray-200/90 dark:border-gray-600 bg-gray-50/80 dark:bg-gray-800/60 px-2.5 py-1 font-medium text-gray-700 dark:text-gray-200">
                <Sparkles className="h-3 w-3 text-indigo-500 shrink-0" aria-hidden />
                AI-powered
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-gray-500 dark:text-gray-400 max-w-2xl">
              Runs privately in your browser. Your messages and prompts never leave your device. No
              account required.
            </p>
            {!isWebLLMSupported() && getWebLLMSupportHint() && (
              <p className="text-xs text-amber-900 dark:text-amber-100/95 rounded-lg border border-amber-200/80 dark:border-amber-800/60 bg-amber-50/90 dark:bg-amber-950/40 px-3 py-2">
                {getWebLLMSupportHint()}
              </p>
            )}

            {isAiModelLoading && aiModelProgress && (
              <div className="space-y-3">
                <div className="flex flex-col gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      {aiModelProgress.text}
                    </span>
                    <span className="text-xs text-blue-700 dark:text-blue-300">
                      {Math.round(aiModelProgress.progress)}%
                    </span>
                  </div>
                  <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                    <div
                      className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${aiModelProgress.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : noteContent ? (
          <div>
            <div className="mb-2 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-end gap-x-2 gap-y-2">
              <div className="justify-self-start self-end">
                <button
                  type="button"
                  onClick={onBack}
                  aria-label={
                    aiDraftAccepted
                      ? "Return to AI editing tools and accept note step"
                      : transformHistory.length > 0
                        ? "Undo last AI change to note content"
                        : "Back to prompt"
                  }
                  className="text-xs font-medium flex items-center shrink-0 rounded-lg border-2 border-blue-600 bg-white px-2.5 py-1 text-blue-700 shadow-sm hover:bg-blue-50 dark:border-blue-400 dark:bg-gray-900 dark:text-blue-300 dark:hover:bg-blue-950/40"
                >
                  <ArrowLeft
                    className="h-3.5 w-3.5 mr-1 shrink-0 text-blue-600 dark:text-blue-400"
                    aria-hidden
                    strokeWidth={2.5}
                  />
                  {aiDraftAccepted ? "Back" : transformHistory.length > 0 ? "Undo" : "Back"}
                </button>
              </div>
              <h4 className="justify-self-center self-end text-center text-sm font-medium text-gray-700 dark:text-gray-300 min-w-0 px-1 leading-snug">
                AI-Generated Content{" "}
                <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                  (you can edit below)
                </span>
              </h4>
              <div className="justify-self-end self-end min-w-0">
                <NotePlaintextUtf8Meter
                  noteContent={noteContent}
                  maxBytes={MAX_NOTE_AI_PLAINTEXT_UTF8_BYTES}
                  className="mb-0"
                />
              </div>
            </div>
            <textarea
              value={noteContent}
              onChange={(e) =>
                applyNoteContentInput(
                  e,
                  MAX_NOTE_AI_PLAINTEXT_UTF8_BYTES,
                  `In AI mode, notes are limited to ${String(MAX_NOTE_AI_PLAINTEXT_UTF8_BYTES / 1024)} KB of UTF-8 text. Extra pasted text was removed.`,
                )
              }
              rows={6}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
            />

            {aiDraftAccepted ? (
              <div className="mt-2 hidden md:flex flex-nowrap items-center gap-x-3 text-[11px] text-gray-500 dark:text-gray-400">
                {privacyBannerItems}
              </div>
            ) : null}

            {!aiDraftAccepted ? (
              <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                <button
                  type="button"
                  onClick={onAcceptDraft}
                  className="inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
                >
                  Accept note
                </button>
                <div className="flex flex-wrap items-center justify-end gap-2 min-w-0">
                  <button
                    type="button"
                    onClick={onImprove}
                    disabled={isGeneratingContent}
                    className="flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 backdrop-blur-md hover:bg-gray-50/80 dark:hover:bg-gray-600/80 focus:outline-none disabled:opacity-50"
                  >
                    <Zap className="h-4 w-4 mr-1 text-yellow-500 shrink-0" />
                    Improve
                  </button>
                  <button
                    type="button"
                    onClick={onSummarize}
                    disabled={isGeneratingContent}
                    className="flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 backdrop-blur-md hover:bg-gray-50/80 dark:hover:bg-gray-600/80 focus:outline-none disabled:opacity-50"
                  >
                    <ZoomIn className="h-4 w-4 mr-1 text-blue-500 shrink-0" />
                    Summarize
                  </button>
                  <button
                    type="button"
                    onClick={onSimplify}
                    disabled={isGeneratingContent}
                    className="flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 backdrop-blur-md hover:bg-gray-50/80 dark:hover:bg-gray-600/80 focus:outline-none disabled:opacity-50"
                  >
                    <FileText className="h-4 w-4 mr-1 text-purple-500 shrink-0" />
                    Simplify
                  </button>
                  <button
                    type="button"
                    onClick={() => onRegenerate()}
                    disabled={isGeneratingContent}
                    className="flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 backdrop-blur-md hover:bg-gray-50/80 dark:hover:bg-gray-600/80 focus:outline-none disabled:opacity-50"
                  >
                    <RefreshCw className="h-4 w-4 mr-1 text-green-500 shrink-0" />
                    Regenerate
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
};
