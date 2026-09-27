/**
 * Write-with-AI templates optimized for Gemma 2 2B / Qwen 4B / mobile Qwen3-0.6B (WebLLM)
 *
 * Goals:
 * - Better user guidance in the UI
 * - Stronger small/medium model grounding
 * - Less placeholder copying / less meta output
 * - More concrete descriptions so the user knows what to provide
 *
 * Architecture:
 * - userTemplate: short scaffold shown in the UI
 * - modelGuidance: hidden instruction sent to the model
 * - smallModelGuidance: tighter low-abstraction version for smaller local models
 * - outputExample: medium/large only; concrete shape example, never placeholder braces
 *
 * Placeholders are NOT resolved by the model. The app provides userInput + optional structured hints.
 */

import { type ModelTier, getModelTier } from "@shared/modelTier";

/** Qwen3-0.6B and similar — extra-tight prompts (mobile WebLLM). */
export function isUltraSmallWebLlmModel(modelId: string): boolean {
  return /0\.6B|0\.6b|270m|270M/i.test(modelId);
}
import { tryExtractMeetingRecipientAndTopic } from "@/utils/meetingRequestStructuredHint";
import { buildSmallTierStructuredFieldsHint } from "@/utils/templateStructuredHint";
import type { SupportedLanguage, Translations } from "@/utils/translation";
import {
  mergePromptTemplatesForLanguage,
  formatSentenceLengthUserSuffix as formatSentenceLengthForLocale,
  applySentenceLengthToUserPrompt as applySentenceLengthForLocale,
  getLocalizedBaseInstruction,
  getLocalizedPlaceholderBraceRule,
  getLocalizedGroundingRulesSmall,
  getLocalizedUserRequestLabel,
  getLocalizedExampleShapePrefix,
  getLocalizedUltraSmallNote,
  getLocalizedExtraSmallLines,
  buildOutputRepairAdditionLocalized,
} from "./promptTemplateLocale";
import {
  classifyAskAnythingIntentForLocale,
  getLocalizedAskAnythingIntentSection,
  getLocalizedMediumStraightforwardLine,
  getLocalizedOutputLengthInstruction,
  getLocalizedResolveOutputLengthLine,
  getLocalizedSmallInstructionScaffold,
  getLocalizedUltraSmallOutputLengthLines,
} from "./promptSmallModelLocale";

export type { AskAnythingIntentRoute } from "./promptSmallModelLocale";
export { classifyAskAnythingIntentForLocale } from "./promptSmallModelLocale";

export interface PromptStarter {
  label: string;
  /** Full text inserted when the user taps the example chip */
  prompt: string;
}

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;

  /** Short user-facing scaffold */
  userTemplate: string;

  /** Hidden guidance sent to the model */
  modelGuidance: string;

  /**
   * Optional compressed rules for small-tier models.
   * When set and tier === "small", this replaces modelGuidance.
   */
  smallModelGuidance?: string;

  enhancementType: "improve" | "summarize" | "secure" | "ask";
  promptPlaceholder: string;
  starterExamples?: readonly PromptStarter[];
  outputExample?: string;
  /** Starter+ template pack entries; omitted/`free` are available to everyone. */
  access?: "free" | "premium";
}

export type PromptBuildModelTier = ModelTier;

export const BASE_INSTRUCTION = `
Write like a real person.
Keep it concise, clear, and natural.
Avoid clichés, filler, and generic phrases.
Be specific when possible.
Do not add explanations before or after the message.
Follow the output-length line below.
`.trim();

export const BASE_INSTRUCTION_SMALL = [
  "Use simple, natural wording.",
  "Keep it short and clear.",
  "Use only facts from the user request.",
  "Do not invent names, dates, links, or details.",
  "Do not add explanations before or after the main text.",
  "Follow the output-length line below.",
].join("\n");

const GROUNDING_RULES_SMALL = [
  "Grounding (must follow):",
  "- Use ONLY names, titles, organizations, dates, topics, and facts from the USER REQUEST below.",
  "- Do NOT invent people or facts.",
  "- If the user gave someone’s name or title, use that exact wording.",
  "- Write only normal finished text.",
  "- Do not leave template syntax, brackets, or placeholder words in the final answer.",
  "- Never output the characters {{ or }}.",
].join("\n");

const PLACEHOLDER_BRACE_RULE =
  "Hard rule: Never output {{ or }} in your answer. Use only real names and facts from the USER REQUEST and parsed cues when present.";

export function classifyAskAnythingIntent(
  userInput: string,
): ReturnType<typeof classifyAskAnythingIntentForLocale> {
  return classifyAskAnythingIntentForLocale(userInput, "en");
}

export type AiSentenceLengthId = "auto" | "1-2" | "2-3" | "4-6" | "7-10";

/** Default: no fixed sentence count in the visible prompt; model follows general length guidance. */
export const DEFAULT_AI_SENTENCE_LENGTH: AiSentenceLengthId = "auto";

/** Display order for “length in sentences” chips in Write with AI. */
export const AI_SENTENCE_LENGTH_OPTION_ORDER: readonly AiSentenceLengthId[] = [
  "auto",
  "1-2",
  "2-3",
  "4-6",
  "7-10",
];

const AI_SENTENCE_LENGTH_LABEL_KEYS: Record<AiSentenceLengthId, string> = {
  auto: "aiComposerSentenceLengthAuto",
  "1-2": "aiComposerSentenceLength12",
  "2-3": "aiComposerSentenceLength23",
  "4-6": "aiComposerSentenceLength46",
  "7-10": "aiComposerSentenceLength710",
};

const AI_SENTENCE_LENGTH_LABEL_FALLBACK_EN: Record<AiSentenceLengthId, string> = {
  auto: "Natural length",
  "1-2": "1 - 2",
  "2-3": "2 - 3",
  "4-6": "4 - 6",
  "7-10": "7 - 10",
};

/** Localized chip label for the sentence-length control (keys `aiComposerSentenceLength*`). */
export function getAiSentenceLengthChipLabel(id: AiSentenceLengthId, t: Translations): string {
  const key = AI_SENTENCE_LENGTH_LABEL_KEYS[id];
  const fromT = t[key];
  if (typeof fromT === "string" && fromT.trim() !== "") return fromT;
  return AI_SENTENCE_LENGTH_LABEL_FALLBACK_EN[id];
}

const LEGACY_SENTENCE_USER_SUFFIX_RE = /\s*Use the sentence length I selected\.$/;

/** End of the visible draft prompt, e.g. `Write (1 - 2) of sentences.` (locale-aware). */
export function formatSentenceLengthUserSuffix(
  preset: AiSentenceLengthId,
  language: SupportedLanguage = "en",
): string {
  return formatSentenceLengthForLocale(preset, language);
}

/** Replace an existing length clause when the user picks a different chip (or migrate legacy wording). */
export function applySentenceLengthToUserPrompt(
  prompt: string,
  preset: AiSentenceLengthId,
  language: SupportedLanguage = "en",
): string {
  return applySentenceLengthForLocale(prompt, preset, language);
}

export function getOutputLengthInstruction(
  tier: ModelTier,
  enhancementType: PromptTemplate["enhancementType"],
): string {
  return getLocalizedOutputLengthInstruction(tier, enhancementType, "en");
}

export const promptTemplates: PromptTemplate[] = [
  {
    id: "ask-anything",
    name: "Ask AI Anything",
    description:
      "Write almost any message or reply. Best when you include who it’s for, what it should say, and tone. Length comes from your sentence setting.",
    userTemplate:
      "Help me write a [message/email/reply] to [who] about [topic] in a [tone] tone.",
    modelGuidance:
      "Write a clear, practical message based on the user's request. Match the tone. Keep it natural and concise. Output only the final text.",
    smallModelGuidance: [
      "Write only the final text.",
      "Use simple natural language.",
      "Match the tone if given.",
      "Do not explain anything.",
      "No headings.",
    ].join("\n"),
    enhancementType: "ask",
    promptPlaceholder:
      "Include: who it’s for, what you want to say, and tone (friendly, professional, direct).",
  },

  {
    id: "thank-you",
    name: "Thank You Note",
    description:
      "For help, gifts, or support. Include what they did and why it mattered.",
    userTemplate:
      "Thank [name] for [what they did], mention why it mattered, in a [warm/professional] tone.",
    modelGuidance:
      "Write a thank-you message that is warm, natural, and specific.",
    smallModelGuidance: [
      "Write a thank-you message.",
      "Use only details from the user.",
      "Sound sincere.",
      "No invented details.",
    ].join("\n"),
    enhancementType: "ask",
    promptPlaceholder:
      "Who helped you, what they did, why it mattered, and tone (warm, professional).",
  },

  {
    id: "meeting-request",
    name: "Meeting Request",
    description:
      "Schedule a call or meeting. Include topic, timing, and format.",
    userTemplate:
      "Request a [call/meeting] with [name] about [topic], suggest [time/day], in a [professional/casual] tone.",
    modelGuidance:
      "Write a meeting request. State purpose clearly. Be direct. Include times only if provided.",
    smallModelGuidance: [
      "Write a meeting request.",
      "Use the exact name.",
      "State topic clearly.",
      "Include times only if given.",
    ].join("\n"),
    enhancementType: "ask",
    promptPlaceholder:
      "Who, topic, preferred time, and tone.",
  },

  {
    id: "birthday",
    name: "Birthday Greeting",
    description:
      "For friends, coworkers, or family. Include relationship and tone.",
    userTemplate:
      "Write a birthday message for [name], [relationship], in a [funny/warm] tone.",
    modelGuidance:
      "Write a warm, natural birthday message. Include personal detail only if provided.",
    smallModelGuidance: [
      "Write a birthday message.",
      "Use the name.",
      "Do not invent details.",
    ].join("\n"),
    enhancementType: "ask",
    promptPlaceholder:
      "Name, relationship, tone, and optional detail like hobby or memory.",
  },

  {
    id: "apology",
    name: "Apology Message",
    description:
      "For personal or professional apologies. Be clear and sincere.",
    userTemplate:
      "Apologize to [name] for [what happened], in a [sincere/professional] tone, mention [how to fix it].",
    modelGuidance:
      "Write a sincere apology. Acknowledge the issue clearly. No excuses.",
    smallModelGuidance: [
      "Say sorry clearly.",
      "Use only the user's details.",
      "No excuses.",
    ].join("\n"),
    enhancementType: "ask",
    promptPlaceholder:
      "What happened, who it affected, tone, and optional fix.",
  },

  {
    id: "love",
    name: "Love Message",
    description:
      "Romantic or emotional message. Include something specific you appreciate.",
    userTemplate:
      "Write a romantic message to [name] for [occasion], mention [what I appreciate].",
    modelGuidance:
      "Write a genuine romantic message. Avoid clichés unless requested.",
    smallModelGuidance: [
      "Write a warm message.",
      "Use only given details.",
      "No invented memories.",
    ].join("\n"),
    enhancementType: "ask",
    promptPlaceholder:
      "Who, occasion, tone, and one thing you appreciate.",
  },

  {
    id: "congratulations",
    name: "Congratulations",
    description:
      "Celebrate achievements like jobs, promotions, or milestones.",
    userTemplate:
      "Congratulate [name] on [achievement], in a [warm/professional/proud] tone.",
    modelGuidance:
      "Write a congratulatory message that feels specific and upbeat.",
    smallModelGuidance: [
      "Congratulate clearly.",
      "Mention achievement.",
      "Match the requested length.",
    ].join("\n"),
    enhancementType: "ask",
    promptPlaceholder:
      "Who, what they achieved, tone.",
  },

  {
    id: "farewell",
    name: "Farewell / Goodbye",
    description:
      "Leaving a job, team, or place. Focus on gratitude.",
    userTemplate:
      "Write a farewell message to [person/group], mention [what I’m thankful for], in a [warm/professional] tone.",
    modelGuidance:
      "Write a positive farewell message focused on appreciation.",
    smallModelGuidance: [
      "Write a farewell message.",
      "Thank them.",
      "Keep it positive.",
    ].join("\n"),
    enhancementType: "ask",
    promptPlaceholder:
      "Who, why leaving, tone, and gratitude.",
  },

  {
    id: "invitation",
    name: "Invitation",
    description:
      "Invite people to an event. Include key details.",
    userTemplate:
      "Invite [people] to [event] on [date/time] at [place], in a [casual/warm] tone.",
    modelGuidance:
      "Write a friendly invitation. Include key details clearly.",
    smallModelGuidance: [
      "Write invitation.",
      "Include date/time/place only if given.",
      "Keep tone friendly.",
    ].join("\n"),
    enhancementType: "ask",
    promptPlaceholder:
      "Event, date, place, tone, RSVP if needed.",
  },

  {
    id: "condolence",
    name: "Condolence Message",
    description:
      "For loss or difficult situations. Keep it simple and sincere.",
    userTemplate:
      "Write a condolence message to [name] about [loss], in a [gentle/simple] tone.",
    modelGuidance:
      "Write a gentle condolence message. Avoid clichés.",
    smallModelGuidance: [
      "Be simple and kind.",
      "Do not give advice.",
    ].join("\n"),
    enhancementType: "ask",
    promptPlaceholder:
      "Who, what happened, tone.",
  },

  {
    id: "reminder",
    name: "Reminder Message",
    description:
      "Send a polite reminder about a task or deadline.",
    userTemplate:
      "Remind [name/group] about [task] by [deadline], in a [casual/professional] tone.",
    modelGuidance:
      "Write a polite reminder. Keep it clear and not pushy.",
    smallModelGuidance: [
      "Write reminder.",
      "Include deadline only if given.",
      "Stay polite.",
    ].join("\n"),
    enhancementType: "ask",
    promptPlaceholder:
      "Who, task, deadline, tone.",
  },

  {
    id: "document-summary",
    access: "premium",
    name: "Document Summary",
    description:
      "Summarize long text into key points. Length follows your sentence setting.",
    userTemplate:
      "Summarize this text focusing on [main points/decisions/risks].",
    modelGuidance:
      "Summarize into clear key points. Focus on important ideas only.",
    smallModelGuidance: [
      "Use bullets.",
      "Main ideas only.",
      "No repetition.",
    ].join("\n"),
    enhancementType: "summarize",
    promptPlaceholder:
      "Paste text and optionally say what to focus on.",
  },

  {
    id: "privacy-check",
    access: "premium",
    name: "Privacy Check",
    description:
      "Remove private or identifying information.",
    userTemplate:
      "Remove names, emails, phone numbers, addresses, and sensitive details from this text",
    modelGuidance:
      "Redact sensitive information with [REDACTED]. Keep structure.",
    smallModelGuidance: [
      "Replace sensitive info with [REDACTED].",
      "Do not summarize.",
    ].join("\n"),
    enhancementType: "secure",
    promptPlaceholder:
      "Paste text containing private information.",
  },
];

export function getPromptTemplatesForLanguage(language: SupportedLanguage): PromptTemplate[] {
  return mergePromptTemplatesForLanguage(promptTemplates, language);
}

export function getPromptTemplateById(
  id: string | null | undefined,
  language: SupportedLanguage = "en",
): PromptTemplate | undefined {
  return getPromptTemplatesForLanguage(language).find((t) => t.id === id);
}

export function isPremiumPromptTemplateId(id: string | null | undefined): boolean {
  return promptTemplates.some((template) => template.id === id && template.access === "premium");
}

/** @deprecated Use getModelTier from @shared/modelTier */
export const getPromptBuildModelTier = getModelTier;

export function buildPromptFromTemplate(
  template: PromptTemplate,
  userInput: string,
  modelId: string,
  sentenceLengthPreset?: AiSentenceLengthId,
  language: SupportedLanguage = "en",
): string {
  const tier = getModelTier(modelId);
  const lengthLine =
    tier === "small" && isUltraSmallWebLlmModel(modelId)
      ? getLocalizedUltraSmallOutputLengthLines(
          template.enhancementType,
          sentenceLengthPreset,
          language,
        )
      : getLocalizedResolveOutputLengthLine(
          tier,
          template.enhancementType,
          sentenceLengthPreset,
          language,
        );

  const [ex1, ex2] = getLocalizedExtraSmallLines(language);
  const extraSmall: string[] =
    tier === "small"
      ? [ex1, ex2]
      : tier === "medium"
        ? [getLocalizedMediumStraightforwardLine(language)]
        : [];

  const useGrounding =
    tier === "small" &&
    (template.enhancementType === "improve" || template.enhancementType === "ask");

  const structuredHint = useGrounding
    ? buildSmallTierStructuredFieldsHint(
        template.id,
        userInput,
        template.enhancementType,
        language,
      )
    : "";

  const smallInstructionScaffold = getLocalizedSmallInstructionScaffold(template, tier, language);

  const skipExampleForSmallTier =
    tier === "small" &&
    (template.enhancementType === "improve" ||
      template.enhancementType === "ask" ||
      template.enhancementType === "summarize" ||
      template.enhancementType === "secure");

  const exampleSection =
    template.outputExample && !skipExampleForSmallTier
      ? `\n${getLocalizedExampleShapePrefix(language)}\n${template.outputExample}`
      : "";

  const instructionScaffoldSection = smallInstructionScaffold
    ? `\n${smallInstructionScaffold}`
    : "";

  const ultraSmallBlock =
    tier === "small" && isUltraSmallWebLlmModel(modelId)
      ? ["", getLocalizedUltraSmallNote(language)].join("\n")
      : "";

  const guidance =
    tier === "small" && template.smallModelGuidance
      ? template.smallModelGuidance
      : template.modelGuidance;

  const askIntentSection =
    tier === "small" && template.id === "ask-anything"
      ? `\n${getLocalizedAskAnythingIntentSection(
          classifyAskAnythingIntentForLocale(userInput, language),
          language,
        )}\n`
      : "";

  return [
    getLocalizedBaseInstruction(tier, language),
    "",
    getLocalizedPlaceholderBraceRule(language),
    useGrounding ? `\n${getLocalizedGroundingRulesSmall(language)}\n` : "",
    "",
    guidance,
    askIntentSection,
    "",
    lengthLine,
    ...extraSmall,
    "",
    structuredHint,
    `${getLocalizedUserRequestLabel(language)}`,
    userInput,
    instructionScaffoldSection,
    exampleSection,
    ultraSmallBlock,
  ]
    .join("\n")
    .trim();
}

export type PromptStyle =
  | "default"
  | "concise"
  | "warm"
  | "professional"
  | "direct";

export function applyStyleInstruction(
  prompt: string,
  style: PromptStyle = "default"
): string {
  if (style === "default") return prompt;

  const styleInstructionMap: Record<Exclude<PromptStyle, "default">, string> = {
    concise: "Use fewer words.",
    warm: "Make the tone slightly warmer.",
    professional: "Use a professional tone.",
    direct: "Be more direct.",
  };

  return `${prompt}\n${styleInstructionMap[style]}`.trim();
}

const ASSISTANT_PRELUDE_STANDALONE =
  /^(?:sure|of\s+course|certainly|absolutely|okay|ok|yes)[!.,]?\s*$/i;

const ASSISTANT_PRELUDE_META = /^(?:output|final\s+answer|final\s+note)\s*:?\s*$/i;

const ASSISTANT_PRELUDE_HERE =
  /^(?:here'?s|here\s+is|below\s+is|this\s+is|the\s+following\s+is)\b[^:]{0,120}:?\s*$/i;

function stripMarkdownFences(text: string): string {
  let s = text.trim();
  if (!s.startsWith("```")) return text;
  const closed = s.match(/^```(?:[^\n`]*)\n([\s\S]*?)\n```\s*$/);
  if (closed) return closed[1].trim();
  if (s.endsWith("```") && s.length > 6) {
    s = s.slice(3, -3).trim();
    s = s.replace(/^[A-Za-z0-9_-]+\n/, "");
    return s.trim();
  }
  return text;
}

function stripOuterBalancedQuotes(text: string): string {
  const s = text.trim();
  if (s.length < 8) return text;
  const dq = s.startsWith('"') && s.endsWith('"') && s.length > 2;
  const sq = s.startsWith("'") && s.endsWith("'") && s.length > 2;
  if ((dq || sq) && !s.slice(1, -1).includes("\n")) {
    return s.slice(1, -1).trim();
  }
  return text;
}

function stripLeadingPreludeOnce(text: string): string | null {
  const normalized = text.replace(/\r\n/g, "\n");
  const lines = normalized.split("\n");
  if (lines.length < 2) return null;
  const first = lines[0].trim();
  const rest = lines.slice(1).join("\n").trim();
  if (rest.length < 10) return null;
  if (ASSISTANT_PRELUDE_STANDALONE.test(first)) return rest;
  if (ASSISTANT_PRELUDE_META.test(first)) return rest;
  if (ASSISTANT_PRELUDE_HERE.test(first) && first.length <= 130) return rest;
  if (
    /^(?:certainly|absolutely|sure|of\s+course)[!,.\s]+/i.test(first) &&
    /\bhere'?s\b/i.test(first) &&
    first.length <= 160
  ) {
    return rest;
  }
  return null;
}

export function cleanOutput(text: string, depth = 0): string {
  if (depth > 5) return text.trim();
  let t = text.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  t = stripMarkdownFences(t);
  t = stripOuterBalancedQuotes(t);
  const preludeStripped = stripLeadingPreludeOnce(t);
  if (preludeStripped) {
    return cleanOutput(preludeStripped, depth + 1);
  }
  if (/^output:\s*/i.test(t) && t.length > 12) {
    t = t.replace(/^output:\s*/i, "").trim();
  }
  return t;
}

export type LocalLlmValidationIssue =
  | "placeholder_braces"
  | "thinking_tag"
  | "final_note_label"
  | "meta_opener"
  | "meeting_recipient_missing"
  | "too_many_bullets_summarize";

export type LocalLlmOutputValidationContext = {
  enhancementType: "improve" | "summarize" | "secure" | "ask" | "simplify";
  modelTier: ModelTier;
  userRequest: string;
  templateId?: string;
};

export type LocalLlmOutputValidationResult = {
  ok: boolean;
  issues: LocalLlmValidationIssue[];
  repairable: boolean;
};

function countSummaryBullets(text: string): number {
  let n = 0;
  for (const line of text.split("\n")) {
    const t = line.trim();
    if (!t) continue;
    if (/^(?:[-*•]|\d+[\).])\s+\S/.test(t)) n += 1;
  }
  return n;
}

function outputContainsRecipientHint(output: string, recipient: string): boolean {
  const o = output.toLowerCase();
  const words = recipient
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.replace(/[^a-z0-9'-]/g, ""))
    .filter((w) => w.length > 2);
  if (words.length === 0) return true;
  return words.some((w) => o.includes(w));
}

const META_OPENER_LINE =
  /^(?:here'?s|here\s+is|below\s+is|this\s+is|sure,|certainly,|absolutely,)\s+(?:your|a|the|my)\s+(?:polished\s+|draft\s+|short\s+|quick\s+)?(?:message|reply|response|answer|email|version|text)\b/i;

export function validateLocalLlmOutput(
  text: string,
  ctx: LocalLlmOutputValidationContext
): LocalLlmOutputValidationResult {
  const issues: LocalLlmValidationIssue[] = [];

  if (/\{\{|\}\}/.test(text)) {
    issues.push("placeholder_braces");
  }
  if (
    /<\s*redacted_thinking/i.test(text) ||
    /<\s*think\b/i.test(text) ||
    /<\/\s*redacted_thinking/i.test(text) ||
    /<\/\s*think\b/i.test(text)
  ) {
    issues.push("thinking_tag");
  }
  if (/\bfinal\s+note\s*:/i.test(text)) {
    issues.push("final_note_label");
  }

  const firstLine = text.split("\n")[0]?.trim() ?? "";
  if (firstLine && META_OPENER_LINE.test(firstLine)) {
    issues.push("meta_opener");
  }

  if (
    ctx.templateId === "meeting-request" &&
    (ctx.enhancementType === "improve" || ctx.enhancementType === "ask")
  ) {
    const pair = tryExtractMeetingRecipientAndTopic(ctx.userRequest);
    if (pair && !outputContainsRecipientHint(text, pair.recipient)) {
      issues.push("meeting_recipient_missing");
    }
  }

  if (ctx.enhancementType === "summarize" && ctx.modelTier === "small") {
    const bullets = countSummaryBullets(text);
    if (bullets > 5) {
      issues.push("too_many_bullets_summarize");
    }
  }

  return {
    ok: issues.length === 0,
    issues,
    repairable: issues.length > 0,
  };
}

export function buildOutputRepairAddition(
  issues: LocalLlmValidationIssue[],
  language: SupportedLanguage = "en",
): string {
  return buildOutputRepairAdditionLocalized(issues, language);
}
