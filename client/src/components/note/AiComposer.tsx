import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  ArrowUp,
  Cloud,
  Zap,
  ZoomIn,
  FileText,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import {
  getPromptTemplatesForLanguage,
  getPromptTemplateById,
  AI_SENTENCE_LENGTH_OPTION_ORDER,
  getAiSentenceLengthChipLabel,
  type PromptTemplate,
  type AiSentenceLengthId,
} from "@/components/note/promptTemplates";
import { useLanguage } from "@/context/LanguageContext";
import type { SupportedLanguage } from "@/utils/translation";
import {
  listUnresolvedGuidedPlaceholderLabelsInNote,
  noteHasUnresolvedGuidedPlaceholders,
} from "@/components/note/localFallbackTemplates";
import { isLocalAiSupported, getLocalAiSupportHint } from "@/utils/localAiCapability";
import { NonPrivateAiPanel } from "@/components/note/NonPrivateAiPanel";
import { PrivateAiStatusPanel } from "@/components/note/PrivateAiStatusPanel";
import { CloudAssistUpgradePanel } from "@/components/note/CloudAssistUpgradePanel";
import { CloudAssistActiveBanner } from "@/components/note/CloudAssistActiveBanner";
import { getLocalAiGenerationGlyph, publicModelNameForLoadProgress } from "@/utils/localAiUxText";
import { MAX_NOTE_AI_PLAINTEXT_UTF8_BYTES } from "@shared/noteSizeLimits";
import { NotePlaintextUtf8Meter } from "./NotePlaintextUtf8Meter";
import { ThinkingBrainIcon } from "./ThinkingBrainIcon";
import { WritingPencilIcon } from "./WritingPencilIcon";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function templateChipClass(active: boolean, variant: "primary" | "amber" = "primary"): string {
  const activeClass =
    variant === "amber"
      ? "font-semibold bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200 border-2 border-orange-500 dark:border-orange-600 shadow-md shadow-orange-200/30 ring-1 ring-orange-300/40"
      : "font-semibold bg-primary/18 dark:bg-primary/28 text-primary border-2 border-primary shadow-md shadow-primary/15 ring-1 ring-primary/20";
  return `h-9 px-3.5 rounded-full text-xs border transition-all duration-150 text-center inline-flex items-center justify-center ${active
      ? activeClass
      : "font-medium bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700/80"
    }`;
}

function StepRow({ step, label, variant = "primary" }: { step: number; label: string; variant?: "primary" | "amber" }) {
  const badgeClass =
    variant === "amber"
      ? "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-100 text-[11px] font-bold text-orange-700 border border-orange-300 dark:bg-orange-900/40 dark:border-orange-600 dark:text-orange-300"
      : "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/12 text-[11px] font-bold text-primary border border-primary/35 dark:bg-primary/20 dark:border-primary/40";
  return (
    <div className="flex items-center gap-2.5 mb-2.5">
      <span className={badgeClass} aria-hidden>
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
  language: SupportedLanguage;
  noteContent: string;
  applyNoteContentInput: (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    maxBytes: number,
    trimDescription: string,
  ) => void;
  aiPrompt: string;
  setAiPrompt: (s: string) => void;
  selectedTemplateId: string | null;
  setSelectedTemplateId: (id: string | null) => void;
  aiEnhancementType: "improve" | "summarize" | "secure" | "ask";
  setAiEnhancementType: (t: "improve" | "summarize" | "secure" | "ask") => void;
  showPrompt: boolean;
  isGeneratingContent: boolean;
  /** Shown under the prompt while the model runs (load + generate use separate states). */
  aiGenerationStatusText?: string | null;
  isAiModelLoading: boolean;
  aiModelProgress: { progress: number; text: string; detail?: string } | null;
  transformHistory: AiPostGenTransform[];
  onGenerate: (override?: {
    prompt?: string;
    enhancementType?: "improve" | "summarize" | "secure" | "ask";
  }) => void;
  onHostedCloudGenerate: (override?: {
    prompt?: string;
    enhancementType?: "improve" | "summarize" | "secure" | "ask";
  }) => void;
  hostedCloudAiRemaining: number | null;
  hostedCloudAiLimit: number;
  cloudAssistConsentGiven?: boolean;
  onCloudAssistConsentChange: (consent: boolean) => void;
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
  selectedSentenceLength: AiSentenceLengthId;
  onSentenceLengthChange: (id: AiSentenceLengthId) => void;
  /** After generation, user must accept before Share / Customize appear. */
  aiDraftAccepted: boolean;
  onAcceptDraft: () => void;
  /** After a failed on-device load/generate, show hosted cloud UI even when WebGPU is present. */
  preferHostedCloudAfterLocalFailure?: boolean;
  onPreferHostedCloudChange?: (prefer: boolean) => void;
  /** Exit AI mode entirely and return to plain note writing. */
  onWriteWithoutAi: () => void;
};

export const AiComposer: React.FC<AiComposerProps> = ({
  language,
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
  onHostedCloudGenerate,
  hostedCloudAiRemaining,
  hostedCloudAiLimit,
  cloudAssistConsentGiven = false,
  onCloudAssistConsentChange,
  onImprove,
  onSummarize,
  onSimplify,
  onRegenerate,
  onBack,
  privacyBannerItems,
  onSelectTemplate,
  selectedSentenceLength,
  onSentenceLengthChange,
  aiDraftAccepted,
  onAcceptDraft,
  preferHostedCloudAfterLocalFailure = false,
  onPreferHostedCloudChange,
  onWriteWithoutAi,
}) => {
  const [showAllTemplates, setShowAllTemplates] = useState(false);
  const [heroTypingGlow, setHeroTypingGlow] = useState(false);
  const [cloudAssistSwitchConfirmOpen, setCloudAssistSwitchConfirmOpen] = useState(false);
  const [recommendedModelLabel, setRecommendedModelLabel] = useState<string | null>(null);
  const [localPrivateAiReady, setLocalPrivateAiReady] = useState(false);

  const skipPromptGlowRef = useRef(true);
  const { t } = useLanguage();
  const tx = (key: string, fallback: string) => t[key] || fallback;
  const localAiSupported = isLocalAiSupported();
  const isMobile = useIsMobile();
  const promptSubmitHint = isMobile
    ? tx("aiComposerTapButton", "Tap the button")
    : t.aiComposerTapOrShortcut;
  const showLocalOnDeviceUi = localAiSupported && !preferHostedCloudAfterLocalFailure;
  const showHostedCloudUi = !localAiSupported || preferHostedCloudAfterLocalFailure;
  const requiresCloudAssistAck = showHostedCloudUi && !cloudAssistConsentGiven;

  useEffect(() => {
    if (!localAiSupported) return;
    let cancelled = false;
    void (async () => {
      const { loadClientLLM } = await import("@/utils/loadClientLLM");
      const llm = await loadClientLLM();
      if (cancelled) return;
      const modelId = await llm.getRecommendedLocalModelId();
      if (modelId) {
        setRecommendedModelLabel(publicModelNameForLoadProgress(modelId));
      }
      setLocalPrivateAiReady(llm.isEngineLoaded());
    })();
    return () => {
      cancelled = true;
    };
  }, [localAiSupported]);

  useEffect(() => {
    if (!localAiSupported || isAiModelLoading) return;
    let cancelled = false;
    void (async () => {
      const { loadClientLLM } = await import("@/utils/loadClientLLM");
      const llm = await loadClientLLM();
      if (!cancelled) {
        setLocalPrivateAiReady(llm.isEngineLoaded());
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [localAiSupported, isAiModelLoading]);

  const privateAiBadgeLabel = recommendedModelLabel
    ? `${tx("aiComposerPrivateAiHeading", "Private AI — {model}").replace("{model}", recommendedModelLabel)} (${tx("aiComposerModelRecommended", "Recommended")})`
    : tx("aiComposerPrivateAiBadge", "Private AI — runs on this device");

  const confirmCloudAssistSwitch = () => {
    setCloudAssistSwitchConfirmOpen(false);
    onPreferHostedCloudChange?.(true);
  };
  const promptTemplates = useMemo(() => getPromptTemplatesForLanguage(language), [language]);
  const activePromptTemplate = getPromptTemplateById(selectedTemplateId, language);
  const hasPromptText = aiPrompt.trim().length > 0;
  const generationHeadline = isGeneratingContent
    ? aiGenerationStatusText?.trim() || t.aiComposerGenerating
    : "";
  const generationGlyph = isGeneratingContent ? getLocalAiGenerationGlyph(generationHeadline) : "brain";
  const displayedTemplates = promptTemplates;
  const noteHasPlaceholderBrackets = useMemo(
    () => noteHasUnresolvedGuidedPlaceholders(noteContent, language),
    [noteContent, language],
  );
  const unresolvedPlaceholderLabels = useMemo(
    () => listUnresolvedGuidedPlaceholderLabelsInNote(noteContent, language),
    [noteContent, language],
  );

  useEffect(() => {
    if (skipPromptGlowRef.current) {
      skipPromptGlowRef.current = false;
      return;
    }
    setHeroTypingGlow(true);
    const id = window.setTimeout(() => setHeroTypingGlow(false), 1100);
    return () => window.clearTimeout(id);
  }, [aiPrompt]);

  useEffect(() => {
    if (!showPrompt) setShowAllTemplates(false);
  }, [showPrompt]);

  return (
    <div className="space-y-8 mb-4">
      <div>
        {localAiSupported ? (
          <div className="mb-8 space-y-3">
            {showLocalOnDeviceUi ? (
              <PrivateAiStatusPanel
                tx={tx}
                recommendedModelLabel={recommendedModelLabel}
                localPrivateAiReady={localPrivateAiReady}
                isAiModelLoading={isAiModelLoading}
                aiModelProgress={aiModelProgress}
              />
            ) : null}
            {showLocalOnDeviceUi && onPreferHostedCloudChange ? (
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold">{tx("aiComposerWantCloudAssistPrefix", "Need better writing quality?")}</span>{" "}
                <button
                  type="button"
                  onClick={() => setCloudAssistSwitchConfirmOpen(true)}
                  className="font-semibold text-red-600 underline underline-offset-2 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  {tx("aiComposerEnableCloudAssistLink", "Enable Cloud Assist ›")}
                </button>
              </p>
            ) : null}
            {showHostedCloudUi && preferHostedCloudAfterLocalFailure ? (
              <CloudAssistActiveBanner
                t={t}
                tx={tx}
                showSwitchBack={localAiSupported && Boolean(onPreferHostedCloudChange)}
                onSwitchBackToPrivate={() => onPreferHostedCloudChange?.(false)}
              />
            ) : null}
          </div>
        ) : showHostedCloudUi ? (
          <div className="mb-4">
            <CloudAssistActiveBanner t={t} tx={tx} showSwitchBack={false} />
          </div>
        ) : null}
        {showPrompt ? (
          <>
            {/* Step 1 — templates */}
            <StepRow step={1} label={t.aiComposerChooseTemplate} variant={showHostedCloudUi ? "amber" : "primary"} />
            <div className="mb-1">
              <div className="flex flex-wrap gap-2">
                {displayedTemplates.slice(0, 5).map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => onSelectTemplate(template)}
                    className={templateChipClass(selectedTemplateId === template.id, showHostedCloudUi ? "amber" : "primary")}
                  >
                    {template.name}
                  </button>
                ))}
              </div>

              <div className="mt-3">
                {showAllTemplates && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {displayedTemplates.slice(5).map((template) => (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() => onSelectTemplate(template)}
                        className={templateChipClass(selectedTemplateId === template.id, showHostedCloudUi ? "amber" : "primary")}
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
                        {t.aiComposerShowFewerTemplates}
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3 w-3 mr-1" />
                        {t.aiComposerShowMoreTemplates}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2 — length */}
            <div className="mb-2 mt-5">
              <StepRow step={2} label={t.aiComposerLengthInSentences} variant={showHostedCloudUi ? "amber" : "primary"} />
              <div className="flex flex-wrap gap-2">
                {AI_SENTENCE_LENGTH_OPTION_ORDER.map((optId) => (
                  <button
                    key={optId}
                    type="button"
                    onClick={() => onSentenceLengthChange(optId)}
                    className={templateChipClass(selectedSentenceLength === optId, showHostedCloudUi ? "amber" : "primary")}
                    aria-pressed={selectedSentenceLength === optId}
                  >
                    {getAiSentenceLengthChipLabel(optId, t)}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : null}

        {showPrompt ? (
          <div className="space-y-4 pt-2">
            {showLocalOnDeviceUi ? (
              <div>
                <StepRow step={3} label={t.aiComposerWriteWithAi} />
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2 tracking-tight">
                  {t.aiComposerWhatDoYouWantToSay}
                </h3>
                <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                  {privateAiBadgeLabel}
                </p>

                <div className="relative min-w-0">
                  <div
                    className={[
                      "min-w-0 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 transition-shadow duration-300 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/50",
                      heroTypingGlow ? "ai-prompt-hero--typing" : "",
                      hasPromptText
                        ? "ring-2 ring-primary/25 dark:ring-primary/35 shadow-lg shadow-primary/10"
                        : "",
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
                      className="min-h-[11rem] w-full resize-y bg-transparent py-4 pl-5 pr-20 text-base text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none"
                      placeholder={
                        activePromptTemplate?.promptPlaceholder ??
                        (aiEnhancementType === "summarize"
                          ? t.aiComposerPlaceholderSummarize
                          : aiEnhancementType === "secure"
                            ? t.aiComposerPlaceholderSecure
                            : t.aiComposerPlaceholderDefault)
                      }
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => onGenerate()}
                    disabled={isGeneratingContent || isAiModelLoading || !hasPromptText}
                    title={t.aiComposerGenerateWithShortcut}
                    aria-label={t.aiComposerGenerateWithPrivateAi}
                    className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/25 ring-2 ring-white/90 dark:ring-gray-900/90 hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 disabled:pointer-events-none disabled:opacity-40 transition-colors"
                  >
                    {isGeneratingContent ? (
                      generationGlyph === "brain" ? (
                        <ThinkingBrainIcon sizeClassName="h-5 w-5" tone="onPrimary" />
                      ) : (
                        <WritingPencilIcon sizeClassName="h-5 w-5" tone="onPrimary" />
                      )
                    ) : (
                      <ArrowUp className="h-5 w-5" aria-hidden strokeWidth={2.25} />
                    )}
                  </button>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 min-h-[1.25rem]">
                  {isGeneratingContent ? (
                    generationGlyph === "brain" ? (
                      <ThinkingBrainIcon sizeClassName="h-9 w-9" className="text-primary" />
                    ) : (
                      <WritingPencilIcon sizeClassName="h-9 w-9" className="text-primary" />
                    )
                  ) : (
                    <Sparkles
                      className={[
                        "h-4 w-4 shrink-0 text-primary",
                        hasPromptText && !isAiModelLoading ? "animate-pulse" : "opacity-40",
                      ].join(" ")}
                      aria-hidden
                    />
                  )}
                  <span
                    className={
                      isGeneratingContent
                        ? "text-[13px] font-medium leading-snug text-foreground/90 dark:text-gray-100 sm:text-sm"
                        : [
                          "text-xs font-medium",
                          hasPromptText && !isAiModelLoading
                            ? "text-primary dark:text-blue-300"
                            : "text-gray-500 dark:text-gray-400",
                        ].join(" ")
                    }
                  >
                    {isGeneratingContent
                      ? generationHeadline
                      : isAiModelLoading
                        ? t.aiComposerGettingReady
                        : hasPromptText
                          ? promptSubmitHint
                          : t.aiComposerStartTypingPrivate}
                  </span>
                </div>
              </div>
            ) : (
              <div>
                <StepRow step={3} label={t.aiComposerWriteWithAi} variant="amber" />
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3 tracking-tight">
                  {t.aiComposerWhatDoYouWantToSay}
                </h3>

                <NonPrivateAiPanel
                  t={t}
                  tx={tx}
                  aiPrompt={aiPrompt}
                  setAiPrompt={setAiPrompt}
                  requiresSessionAck={requiresCloudAssistAck}
                  sessionAcknowledged={cloudAssistConsentGiven}
                  onSessionAcknowledgedChange={onCloudAssistConsentChange}
                  isGeneratingContent={isGeneratingContent}
                  hasPromptText={hasPromptText}
                  hostedCloudAiRemaining={hostedCloudAiRemaining}
                  hostedCloudAiLimit={hostedCloudAiLimit}
                  onGenerate={() => onHostedCloudGenerate()}
                  submitHint={
                    isGeneratingContent
                      ? (aiGenerationStatusText?.trim() || t.aiComposerCloudAssistButton)
                      : hostedCloudAiRemaining === 0
                        ? undefined
                        : hasPromptText
                          ? promptSubmitHint
                          : undefined
                  }
                />

              </div>
            )}

            {(showLocalOnDeviceUi || showHostedCloudUi) &&
              activePromptTemplate?.starterExamples &&
              activePromptTemplate.starterExamples.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                    {t.aiComposerTryExample}
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

            {showHostedCloudUi && !preferHostedCloudAfterLocalFailure && getLocalAiSupportHint() && (
              <p className="text-xs text-amber-900 dark:text-amber-100/95 rounded-lg border border-amber-200/80 dark:border-amber-800/60 bg-amber-50/90 dark:bg-amber-950/40 px-3 py-2">
                {getLocalAiSupportHint()}
              </p>
            )}

          </div>
        ) : noteContent ? (
          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <h4 className="text-sm font-medium leading-snug text-gray-700 dark:text-gray-300">
                {t.aiComposerGeneratedContent}{" "}
                <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                  {t.aiComposerYouCanEditBelow}
                </span>
              </h4>
              <NotePlaintextUtf8Meter
                noteContent={noteContent}
                maxBytes={MAX_NOTE_AI_PLAINTEXT_UTF8_BYTES}
                className="mb-0 shrink-0 text-right"
              />
            </div>
            {aiDraftAccepted ? (
              <div className="mb-2 hidden md:flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-500 dark:text-gray-400">
                {privacyBannerItems}
              </div>
            ) : null}
            <textarea
              value={noteContent}
              onChange={(e) =>
                applyNoteContentInput(
                  e,
                  MAX_NOTE_AI_PLAINTEXT_UTF8_BYTES,
                  t.aiComposerNotesLimitTrimmedAiMode.replace("{maxKb}", String(MAX_NOTE_AI_PLAINTEXT_UTF8_BYTES / 1024)),
                )
              }
              rows={6}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
            />

            {noteHasPlaceholderBrackets ? (
              <div
                className="mt-2 rounded-lg border border-amber-200 bg-amber-50/90 px-3 py-2 text-xs text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/35 dark:text-amber-50"
                role="status"
              >
                <p className="font-medium">{t.aiComposerReplacePlaceholdersHint}</p>
                {unresolvedPlaceholderLabels.length > 0 ? (
                  <p className="mt-1 text-[11px] opacity-90">
                    {t.aiComposerUnresolvedPlaceholdersList}{" "}
                    {unresolvedPlaceholderLabels.map((label) => `[${label}]`).join(", ")}
                  </p>
                ) : null}
              </div>
            ) : null}

            {!aiDraftAccepted ? (
              <div className="mt-3 flex w-full flex-col gap-2 md:flex-row md:flex-wrap md:items-center">
                {/* Accept — full-width CTA on mobile, pushed right on desktop */}
                <button
                  type="button"
                  onClick={onAcceptDraft}
                  disabled={noteHasPlaceholderBrackets}
                  title={noteHasPlaceholderBrackets ? t.aiComposerReplacePlaceholdersHint : undefined}
                  className="flex w-full shrink-0 items-center justify-center rounded-lg border border-transparent bg-primary px-8 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-45 md:ml-auto md:w-auto md:py-2 md:min-w-[10rem]"
                >
                  {t.aiComposerAcceptNote}
                </button>

                {/* Secondary row: Back + refine actions */}
                <div className="flex items-center gap-2 overflow-x-auto md:contents">
                  {/* Back / Undo */}
                  <button
                    type="button"
                    onClick={onBack}
                    aria-label={
                      aiDraftAccepted
                        ? t.aiComposerAriaReturnToEditing
                        : transformHistory.length > 0
                          ? t.aiComposerAriaUndoLastChange
                          : t.aiComposerAriaBackToPrompt
                    }
                    className="flex shrink-0 items-center px-3 py-2 rounded-md border-2 border-blue-500 bg-white text-xs font-medium text-blue-700 hover:bg-blue-50 dark:border-blue-400 dark:bg-gray-900 dark:text-blue-300 dark:hover:bg-blue-950/40 focus:outline-none"
                  >
                    <ArrowLeft className="h-3.5 w-3.5 mr-1 shrink-0" aria-hidden strokeWidth={2.5} />
                    {transformHistory.length > 0 ? t.aiComposerUndo : t.aiComposerBack}
                  </button>

                  {/* Divider */}
                  <span className="h-5 w-px shrink-0 bg-gray-200 dark:bg-gray-600" aria-hidden />

                  {/* Refine actions */}
                  {(showLocalOnDeviceUi || showHostedCloudUi) ? (
                    <>
                      <button
                        type="button"
                        onClick={onImprove}
                        disabled={isGeneratingContent}
                        className="flex shrink-0 items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50/80 dark:hover:bg-gray-600/80 focus:outline-none disabled:opacity-50"
                      >
                        <Zap className="h-3.5 w-3.5 mr-1 text-yellow-500 shrink-0" />
                        {t.aiComposerImprove}
                      </button>
                      <button
                        type="button"
                        onClick={onSummarize}
                        disabled={isGeneratingContent}
                        className="flex shrink-0 items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50/80 dark:hover:bg-gray-600/80 focus:outline-none disabled:opacity-50"
                      >
                        <ZoomIn className="h-3.5 w-3.5 mr-1 text-blue-500 shrink-0" />
                        {t.aiComposerSummarize}
                      </button>
                      <button
                        type="button"
                        onClick={onSimplify}
                        disabled={isGeneratingContent}
                        className="flex shrink-0 items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50/80 dark:hover:bg-gray-600/80 focus:outline-none disabled:opacity-50"
                      >
                        <FileText className="h-3.5 w-3.5 mr-1 text-purple-500 shrink-0" />
                        {t.aiComposerSimplify}
                      </button>
                      <button
                        type="button"
                        onClick={() => onRegenerate()}
                        disabled={isGeneratingContent}
                        className="flex shrink-0 items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50/80 dark:hover:bg-gray-600/80 focus:outline-none disabled:opacity-50"
                      >
                        <RefreshCw className="h-3.5 w-3.5 mr-1 text-green-500 shrink-0" />
                        {t.aiComposerRegenerate}
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            ) : null}

            {!aiDraftAccepted && showLocalOnDeviceUi && onPreferHostedCloudChange ? (
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => setCloudAssistSwitchConfirmOpen(true)}
                  className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-amber-800 dark:text-gray-400 dark:hover:text-amber-300 transition-colors"
                >
                  <Cloud className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  {tx("aiComposerNotSatisfied", "Not satisfied? Try Cloud Assist")}
                  <span aria-hidden>›</span>
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <AlertDialog open={cloudAssistSwitchConfirmOpen} onOpenChange={setCloudAssistSwitchConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {tx("aiComposerSwitchToCloudAssistWarningTitle", "Switch to Cloud Assist?")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {tx(
                "aiComposerSwitchToCloudAssistWarningBody",
                "Cloud Assist sends your prompt to Cloudflare Workers AI (Google Gemma 4 26B). It is not fully private — your text is processed in the cloud before you encrypt the note.",
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-row sm:justify-end">
            <AlertDialogCancel>{tx("aiComposerSwitchToCloudAssistCancel", "Keep Private AI")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
              onClick={confirmCloudAssistSwitch}
            >
              {tx("aiComposerSwitchToCloudAssistConfirm", "Use Cloud Assist (not fully private)")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
