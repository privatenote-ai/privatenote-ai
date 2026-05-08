import type { AiSentenceLengthId } from "./promptTemplates";

export type GuidedWritingTone = "warm" | "formal" | "casual" | "professional" | "gentle" | "romantic";
export type GuidedWritingAudience =
  | "general"
  | "friend"
  | "partner"
  | "coworker"
  | "team"
  | "family"
  | "client";
export type GuidedWritingStyle =
  | "direct"
  | "thoughtful"
  | "balanced"
  | "supportive"
  | "celebratory"
  | "gentle";
export type GuidedWritingSensitivity = "standard" | "sensitive";

export const GUIDED_PLACEHOLDER_KEYS = [
  "recipientName",
  "groupName",
  "topic",
  "mainMessage",
  "reason",
  "relevantDetail",
  "specificDetail",
  "timeframe",
  "extraDetail",
  "nextStep",
  "actionTaken",
  "supportType",
  "result",
  "resultOrSituation",
  "positiveResult",
  "dayOrTime",
  "alternateTime",
  "issue",
  "happened",
  "impact",
  "fixStep",
  "quality",
  "feeling",
  "memory",
  "achievement",
  "eventName",
  "occasion",
  "date",
  "time",
  "place",
  "rsvpDate",
  "eventDetail",
  "loss",
  "personName",
  "tribute",
  "task",
  "deadline",
  "item",
  "joyWish",
  "goalOrWish",
  "hopeOrGoal",
] as const;

export type GuidedWritingPlaceholder = (typeof GUIDED_PLACEHOLDER_KEYS)[number];

export type GuidedWritingTemplateOption = {
  label: string;
  textTemplate: string;
  tone: GuidedWritingTone;
  audience: GuidedWritingAudience;
  style: GuidedWritingStyle;
  sensitivity: GuidedWritingSensitivity;
  placeholders: readonly GuidedWritingPlaceholder[];
};

export type LocalFallbackTemplateOption = GuidedWritingTemplateOption & {
  text: string;
};

export type GuidedWritingTemplateSet = Record<AiSentenceLengthId, readonly GuidedWritingTemplateOption[]>;

export const LOCAL_FALLBACK_TEMPLATE_IDS = [
  "ask-anything",
  "thank-you",
  "meeting-request",
  "birthday",
  "apology",
  "love",
  "congratulations",
  "farewell",
  "invitation",
  "condolence",
  "reminder",
] as const;

export type LocalFallbackTemplateId = (typeof LOCAL_FALLBACK_TEMPLATE_IDS)[number];

export const STANDARD_GUIDED_WRITING_BUCKETS: readonly AiSentenceLengthId[] = [
  "1-2",
  "2-3",
  "4-6",
  "7-10",
] as const;

export function guidedWritingOption(
  label: string,
  textTemplate: string,
  meta: Omit<GuidedWritingTemplateOption, "label" | "textTemplate">,
): GuidedWritingTemplateOption {
  return { label, textTemplate, ...meta };
}

export function isLocalFallbackTemplateId(
  value: string | null | undefined,
): value is LocalFallbackTemplateId {
  return Boolean(value && LOCAL_FALLBACK_TEMPLATE_IDS.includes(value as LocalFallbackTemplateId));
}
