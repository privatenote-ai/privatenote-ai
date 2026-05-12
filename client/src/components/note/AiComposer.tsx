import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  ArrowUp,
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
import { getTranslations, type SupportedLanguage } from "@/utils/translation";
import type {
  GuidedWritingAudience,
  GuidedWritingSensitivity,
  GuidedWritingStyle,
  GuidedWritingTone,
} from "@/components/note/localFallbackShared";
import {
  filterGuidedWritingTemplateOptions,
  getLocalFallbackTemplateOptions,
  isLocalFallbackTemplateId,
  listUnresolvedGuidedPlaceholderLabelsInNote,
  noteHasUnresolvedGuidedPlaceholders,
} from "@/components/note/localFallbackTemplates";
import { isLocalAiSupported, getLocalAiSupportHint } from "@/utils/clientLLM";
import { getLocalAiGenerationGlyph } from "@/utils/localAiUxText";
import { MAX_NOTE_AI_PLAINTEXT_UTF8_BYTES } from "@shared/noteSizeLimits";
import { NotePlaintextUtf8Meter } from "./NotePlaintextUtf8Meter";
import { ThinkingBrainIcon } from "./ThinkingBrainIcon";
import { WritingPencilIcon } from "./WritingPencilIcon";

function templateChipClass(active: boolean): string {
  return `h-9 px-3.5 rounded-full text-xs border transition-all duration-150 text-center inline-flex items-center justify-center ${
    active
      ? "font-semibold bg-primary/18 dark:bg-primary/28 text-primary border-2 border-primary shadow-md shadow-primary/15 ring-1 ring-primary/20"
      : "font-medium bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700/80"
  }`;
}

const FALLBACK_TONE_FILTERS: GuidedWritingTone[] = ["warm", "formal", "casual", "professional", "gentle", "romantic"];
const FALLBACK_AUDIENCE_FILTERS: GuidedWritingAudience[] = [
  "general",
  "friend",
  "partner",
  "coworker",
  "team",
  "family",
  "client",
];
const FALLBACK_STYLE_FILTERS: GuidedWritingStyle[] = ["direct", "thoughtful", "balanced", "supportive", "celebratory", "gentle"];
const FALLBACK_SENSITIVITY_FILTERS: GuidedWritingSensitivity[] = ["standard", "sensitive"];

function prettyFilterEnum(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
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
  onUseFallbackTemplate: (text: string) => void;
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
  onUseFallbackTemplate,
}) => {
  const [showAllTemplates, setShowAllTemplates] = useState(false);
  const [heroTypingGlow, setHeroTypingGlow] = useState(false);
  const [fallbackTone, setFallbackTone] = useState("");
  const [fallbackAudience, setFallbackAudience] = useState("");
  const [fallbackStyle, setFallbackStyle] = useState("");
  const [fallbackSensitivity, setFallbackSensitivity] = useState("");
  const skipPromptGlowRef = useRef(true);
  const localAiSupported = isLocalAiSupported();
  const t = useMemo(() => getTranslations(language), [language]);
  const promptTemplates = useMemo(() => getPromptTemplatesForLanguage(language), [language]);
  const activePromptTemplate = getPromptTemplateById(selectedTemplateId, language);
  const hasPromptText = aiPrompt.trim().length > 0;
  const generationHeadline = isGeneratingContent
    ? aiGenerationStatusText?.trim() || t.aiComposerGenerating
    : "";
  const generationGlyph = isGeneratingContent ? getLocalAiGenerationGlyph(generationHeadline) : "brain";
  const displayedTemplates = localAiSupported
    ? promptTemplates
    : promptTemplates.filter((template) => isLocalFallbackTemplateId(template.id));
  const fallbackOptionsAll = useMemo(
    () => getLocalFallbackTemplateOptions(selectedTemplateId, selectedSentenceLength, language),
    [selectedTemplateId, selectedSentenceLength, language],
  );
  const starterFiltersActive = Boolean(
    fallbackTone || fallbackAudience || fallbackStyle || fallbackSensitivity,
  );
  const fallbackOptionsFiltered = useMemo(() => {
    const filters: {
      tone?: GuidedWritingTone;
      audience?: GuidedWritingAudience;
      style?: GuidedWritingStyle;
      sensitivity?: GuidedWritingSensitivity;
    } = {};
    if (fallbackTone) filters.tone = fallbackTone as GuidedWritingTone;
    if (fallbackAudience) filters.audience = fallbackAudience as GuidedWritingAudience;
    if (fallbackStyle) filters.style = fallbackStyle as GuidedWritingStyle;
    if (fallbackSensitivity) filters.sensitivity = fallbackSensitivity as GuidedWritingSensitivity;
    return filterGuidedWritingTemplateOptions(fallbackOptionsAll, filters);
  }, [fallbackOptionsAll, fallbackTone, fallbackAudience, fallbackStyle, fallbackSensitivity]);
  const fallbackFilterNoMatch = starterFiltersActive && fallbackOptionsFiltered.length === 0;
  const fallbackOptions =
    fallbackOptionsFiltered.length > 0 ? fallbackOptionsFiltered : fallbackOptionsAll;

  useEffect(() => {
    setFallbackTone("");
    setFallbackAudience("");
    setFallbackStyle("");
    setFallbackSensitivity("");
  }, [selectedTemplateId, selectedSentenceLength]);

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
        <div className="mb-4 rounded-xl border border-primary/25 bg-primary/5 px-4 py-3">
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            <strong>{t.aiComposerRunsLocallyTitle}</strong> {t.aiComposerRunsLocallyBody}
          </p>
        </div>
        {showPrompt ? (
          <>
            {/* Step 1 — templates (only while composing the prompt) */}
            <StepRow step={1} label={t.aiComposerChooseTemplate} />
            <div className="mb-1">
              <div className="flex flex-wrap gap-2">
                {displayedTemplates.slice(0, 5).map((template) => (
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
                    {displayedTemplates.slice(5).map((template) => (
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
              <StepRow step={2} label={t.aiComposerLengthInSentences} />
              <div className="flex flex-wrap gap-2">
                {AI_SENTENCE_LENGTH_OPTION_ORDER.map((optId) => (
                  <button
                    key={optId}
                    type="button"
                    onClick={() => onSentenceLengthChange(optId)}
                    className={templateChipClass(selectedSentenceLength === optId)}
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
            {localAiSupported ? (
              <div>
                <StepRow step={3} label={t.aiComposerWriteWithAi} />
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3 tracking-tight">
                  {t.aiComposerWhatDoYouWantToSay}
                </h3>

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
                          ? t.aiComposerTapOrShortcut
                          : t.aiComposerStartTypingPrivate}
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <StepRow step={3} label={t.aiComposerCuratedWriting} />
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2 tracking-tight">
                    {t.aiComposerLocalAiUnavailableTitle}
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-200">
                    {t.aiComposerLocalAiUnavailableBody1}
                  </p>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    {t.aiComposerLocalAiUnavailableBody2}
                  </p>
                </div>

                <div className="rounded-xl border border-blue-200 bg-blue-50/80 p-4 dark:border-blue-900/60 dark:bg-blue-950/25">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {t.aiComposerCloudAssistTitle}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
                        {t.aiComposerCloudAssistBody}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full border border-blue-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-blue-700 dark:border-blue-800 dark:bg-gray-950 dark:text-blue-200">
                      {hostedCloudAiRemaining === null
                        ? t.aiComposerCloudAssistIncluded.replace("{count}", String(hostedCloudAiLimit))
                        : t.aiComposerCloudAssistRemaining
                            .replace("{remaining}", String(hostedCloudAiRemaining))
                            .replace("{limit}", String(hostedCloudAiLimit))}
                    </span>
                  </div>
                  <label className="mt-3 block text-xs font-medium text-gray-700 dark:text-gray-300" htmlFor="hosted-ai-prompt">
                    {t.aiComposerCloudAssistPromptLabel}
                  </label>
                  <div className="relative mt-1">
                    <textarea
                      id="hosted-ai-prompt"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      rows={4}
                      className="min-h-[8rem] w-full resize-y rounded-lg border border-blue-200 bg-white px-3 py-2.5 pr-14 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-blue-900 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-500"
                      placeholder={t.aiComposerCloudAssistPlaceholder}
                    />
                    <button
                      type="button"
                      onClick={() => onHostedCloudGenerate()}
                      disabled={isGeneratingContent || !hasPromptText || hostedCloudAiRemaining === 0}
                      title={t.aiComposerCloudAssistButton}
                      aria-label={t.aiComposerCloudAssistButton}
                      className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm ring-2 ring-white/90 hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:ring-gray-950/90 dark:focus-visible:ring-offset-gray-950 disabled:pointer-events-none disabled:opacity-40"
                    >
                      {isGeneratingContent ? (
                        <WritingPencilIcon sizeClassName="h-5 w-5" tone="onPrimary" />
                      ) : (
                        <ArrowUp className="h-5 w-5" aria-hidden strokeWidth={2.25} />
                      )}
                    </button>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <Sparkles className="h-4 w-4 shrink-0 text-blue-500" aria-hidden />
                    <span>
                      {hostedCloudAiRemaining === 0
                        ? t.aiComposerCloudAssistNoFree
                        : t.aiComposerCloudAssistTemplatesAlternative}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {t.aiComposerSignatureStarters}
                  </p>
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                    {t.aiComposerSignatureStartersHint}
                  </p>
                  <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50/80 p-3 dark:border-gray-800 dark:bg-gray-950/50">
                    <p className="text-xs font-medium text-gray-800 dark:text-gray-200">{t.aiComposerStarterFineTune}</p>
                    <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <label className="flex flex-col gap-0.5 text-[11px] text-gray-600 dark:text-gray-400">
                        <span>{t.aiComposerFilterTone}</span>
                        <select
                          value={fallbackTone}
                          onChange={(e) => setFallbackTone(e.target.value)}
                          className="h-9 rounded-md border border-gray-200 bg-white px-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                        >
                          <option value="">{t.aiComposerFilterAny}</option>
                          {FALLBACK_TONE_FILTERS.map((v) => (
                            <option key={v} value={v}>
                              {prettyFilterEnum(v)}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="flex flex-col gap-0.5 text-[11px] text-gray-600 dark:text-gray-400">
                        <span>{t.aiComposerFilterAudience}</span>
                        <select
                          value={fallbackAudience}
                          onChange={(e) => setFallbackAudience(e.target.value)}
                          className="h-9 rounded-md border border-gray-200 bg-white px-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                        >
                          <option value="">{t.aiComposerFilterAny}</option>
                          {FALLBACK_AUDIENCE_FILTERS.map((v) => (
                            <option key={v} value={v}>
                              {prettyFilterEnum(v)}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="flex flex-col gap-0.5 text-[11px] text-gray-600 dark:text-gray-400">
                        <span>{t.aiComposerFilterStyle}</span>
                        <select
                          value={fallbackStyle}
                          onChange={(e) => setFallbackStyle(e.target.value)}
                          className="h-9 rounded-md border border-gray-200 bg-white px-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                        >
                          <option value="">{t.aiComposerFilterAny}</option>
                          {FALLBACK_STYLE_FILTERS.map((v) => (
                            <option key={v} value={v}>
                              {prettyFilterEnum(v)}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="flex flex-col gap-0.5 text-[11px] text-gray-600 dark:text-gray-400">
                        <span>{t.aiComposerFilterSensitivity}</span>
                        <select
                          value={fallbackSensitivity}
                          onChange={(e) => setFallbackSensitivity(e.target.value)}
                          className="h-9 rounded-md border border-gray-200 bg-white px-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                        >
                          <option value="">{t.aiComposerFilterAny}</option>
                          {FALLBACK_SENSITIVITY_FILTERS.map((v) => (
                            <option key={v} value={v}>
                              {prettyFilterEnum(v)}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </div>
                  {fallbackFilterNoMatch ? (
                    <p className="mt-2 text-xs text-amber-800 dark:text-amber-100/90">{t.aiComposerStarterFiltersNoMatch}</p>
                  ) : null}
                  <div className="mt-4 space-y-3">
                    {fallbackOptions.map((option, index) => (
                      <button
                        key={`${option.label}-${index}`}
                        type="button"
                        onClick={() => onUseFallbackTemplate(option.text)}
                        className="block w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-950/40 px-4 py-3 text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-800/80"
                      >
                        <span className="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          {option.label}
                        </span>
                        <span className="mt-1 block text-sm leading-relaxed text-gray-800 dark:text-gray-100">
                          {option.text}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {localAiSupported &&
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

            {!localAiSupported && getLocalAiSupportHint() && (
              <p className="text-xs text-amber-900 dark:text-amber-100/95 rounded-lg border border-amber-200/80 dark:border-amber-800/60 bg-amber-50/90 dark:bg-amber-950/40 px-3 py-2">
                {getLocalAiSupportHint()}
              </p>
            )}

            {localAiSupported && isAiModelLoading && aiModelProgress && (
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
                  {aiModelProgress.detail ? (
                    <p className="text-xs text-blue-800/95 dark:text-blue-200/90 break-words">
                      {aiModelProgress.detail}
                    </p>
                  ) : null}
                </div>
              </div>
            )}

          </div>
        ) : noteContent ? (
          <div>
            {/* Mobile: stack back / title / KB so nothing shares one cramped row */}
            <div className="mb-2 space-y-2 md:hidden">
              <div className="flex justify-start">
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
                  className="text-xs font-medium flex items-center shrink-0 rounded-lg border-2 border-blue-600 bg-white px-2.5 py-1 text-blue-700 shadow-sm hover:bg-blue-50 dark:border-blue-400 dark:bg-gray-900 dark:text-blue-300 dark:hover:bg-blue-950/40"
                >
                  <ArrowLeft
                    className="h-3.5 w-3.5 mr-1 shrink-0 text-blue-600 dark:text-blue-400"
                    aria-hidden
                    strokeWidth={2.5}
                  />
                  {aiDraftAccepted ? t.aiComposerBack : transformHistory.length > 0 ? t.aiComposerUndo : t.aiComposerBack}
                </button>
              </div>
              <h4 className="text-center text-sm font-medium text-gray-700 dark:text-gray-300 px-1 leading-snug">
                {t.aiComposerGeneratedContent}{" "}
                <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                  {t.aiComposerYouCanEditBelow}
                </span>
              </h4>
              <div className="flex justify-end">
                <NotePlaintextUtf8Meter
                  noteContent={noteContent}
                  maxBytes={MAX_NOTE_AI_PLAINTEXT_UTF8_BYTES}
                  className="mb-0 text-right"
                />
              </div>
            </div>

            {/* md+: original single-row toolbar */}
            <div className="mb-2 hidden md:grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-end md:gap-x-2 md:gap-y-2">
              <div className="justify-self-start self-end">
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
                  className="text-xs font-medium flex items-center shrink-0 rounded-lg border-2 border-blue-600 bg-white px-2.5 py-1 text-blue-700 shadow-sm hover:bg-blue-50 dark:border-blue-400 dark:bg-gray-900 dark:text-blue-300 dark:hover:bg-blue-950/40"
                >
                  <ArrowLeft
                    className="h-3.5 w-3.5 mr-1 shrink-0 text-blue-600 dark:text-blue-400"
                    aria-hidden
                    strokeWidth={2.5}
                  />
                  {aiDraftAccepted ? t.aiComposerBack : transformHistory.length > 0 ? t.aiComposerUndo : t.aiComposerBack}
                </button>
              </div>
              <h4 className="justify-self-center self-end text-center text-sm font-medium text-gray-700 dark:text-gray-300 min-w-0 px-1 leading-snug">
                {t.aiComposerGeneratedContent}{" "}
                <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                  {t.aiComposerYouCanEditBelow}
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

            {aiDraftAccepted ? (
              <div className="mt-2 hidden md:flex flex-nowrap items-center gap-x-3 text-[11px] text-gray-500 dark:text-gray-400">
                {privacyBannerItems}
              </div>
            ) : null}

            {!aiDraftAccepted ? (
              <div className="mt-3 flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
                {localAiSupported ? (
                  <div className="flex flex-wrap items-center justify-start gap-2">
                    <button
                      type="button"
                      onClick={onImprove}
                      disabled={isGeneratingContent}
                      className="flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 backdrop-blur-md hover:bg-gray-50/80 dark:hover:bg-gray-600/80 focus:outline-none disabled:opacity-50"
                    >
                      <Zap className="h-4 w-4 mr-1 text-yellow-500 shrink-0" />
                      {t.aiComposerImprove}
                    </button>
                    <button
                      type="button"
                      onClick={onSummarize}
                      disabled={isGeneratingContent}
                      className="flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 backdrop-blur-md hover:bg-gray-50/80 dark:hover:bg-gray-600/80 focus:outline-none disabled:opacity-50"
                    >
                      <ZoomIn className="h-4 w-4 mr-1 text-blue-500 shrink-0" />
                      {t.aiComposerSummarize}
                    </button>
                    <button
                      type="button"
                      onClick={onSimplify}
                      disabled={isGeneratingContent}
                      className="flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 backdrop-blur-md hover:bg-gray-50/80 dark:hover:bg-gray-600/80 focus:outline-none disabled:opacity-50"
                    >
                      <FileText className="h-4 w-4 mr-1 text-purple-500 shrink-0" />
                      {t.aiComposerSimplify}
                    </button>
                    <button
                      type="button"
                      onClick={() => onRegenerate()}
                      disabled={isGeneratingContent}
                      className="flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 backdrop-blur-md hover:bg-gray-50/80 dark:hover:bg-gray-600/80 focus:outline-none disabled:opacity-50"
                    >
                      <RefreshCw className="h-4 w-4 mr-1 text-green-500 shrink-0" />
                      {t.aiComposerRegenerate}
                    </button>
                  </div>
                ) : null}
                <button
                  type="button"
                  onClick={onAcceptDraft}
                  disabled={noteHasPlaceholderBrackets}
                  title={noteHasPlaceholderBrackets ? t.aiComposerReplacePlaceholdersHint : undefined}
                  className="inline-flex w-full shrink-0 items-center justify-center rounded-lg border border-transparent bg-primary px-8 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-45 sm:ml-auto sm:w-auto sm:min-w-[12rem] sm:flex-1 sm:basis-0 sm:max-w-lg md:min-w-[14rem]"
                >
                  {t.aiComposerAcceptNote}
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
};
