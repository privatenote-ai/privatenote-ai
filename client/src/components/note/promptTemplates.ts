/**
 * Write-with-AI templates optimized for Gemma 2 2B / Qwen 4B
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
import { tryExtractMeetingRecipientAndTopic } from "@/utils/meetingRequestStructuredHint";
import { buildSmallTierStructuredFieldsHint } from "@/utils/templateStructuredHint";

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

const DEFAULT_SMALL_INSTRUCTION_SCAFFOLD_IMPROVE_ASK = [
  "How to write it:",
  "- Start naturally.",
  "- State the main point clearly.",
  "- Use only details from the USER REQUEST.",
  "- End with one short natural closing line if it fits.",
].join("\n");

const SMALL_MODEL_INSTRUCTION_SCAFFOLDS: Record<string, string> = {
  "ask-anything": [
    "How to write it:",
    "- Follow the exact user request.",
    "- Output only the final text.",
    "- No intro like “Sure” or “Here is”.",
    "- No explanations unless the user asked for explanation.",
  ].join("\n"),

  "thank-you": [
    "How to write it:",
    "- Address the person exactly as the user described them.",
    "- Thank them for the specific help, gift, or action.",
    "- Add one short sincere line.",
  ].join("\n"),

  "meeting-request": [
    "How to write it:",
    "- Greet the person with the exact name or title from the user request.",
    "- State that you want to schedule a meeting.",
    "- Mention the topic clearly.",
    "- If the user gave times, include them. Otherwise ask for availability.",
  ].join("\n"),

  birthday: [
    "How to write it:",
    "- Start with a birthday wish.",
    "- Use the exact name if the user provided one.",
    "- Mention relationship, memory, joke, age, or hobby only if the user included it.",
  ].join("\n"),

  apology: [
    "How to write it:",
    "- Apologize clearly for the exact issue the user described.",
    "- Do not be defensive.",
    "- Mention a fix only if the user gave one.",
  ].join("\n"),

  love: [
    "How to write it:",
    "- Keep it warm and personal.",
    "- Mention only the feelings or details the user gave.",
    "- Do not invent memories or promises.",
  ].join("\n"),

  congratulations: [
    "How to write it:",
    "- Congratulate the person on the exact achievement named by the user.",
    "- Add one short proud or supportive line.",
  ].join("\n"),

  farewell: [
    "How to write it:",
    "- Thank the person or group for what the user actually mentioned.",
    "- Keep the tone warm and positive.",
    "- Include a memory only if the user gave one.",
  ].join("\n"),

  invitation: [
    "How to write it:",
    "- State the event clearly.",
    "- Include date, time, and place only if the user gave them.",
    "- Mention RSVP or what to bring only if the user asked.",
  ].join("\n"),

  condolence: [
    "How to write it:",
    "- Be gentle and simple.",
    "- Mention only the loss or hard moment named by the user.",
    "- Add one short supportive line.",
  ].join("\n"),

  reminder: [
    "How to write it:",
    "- Say what the reminder is about in plain words.",
    "- Include deadline, time, or link only if the user gave them.",
    "- Keep it polite and not pushy.",
  ].join("\n"),
};

const SMALL_MODEL_SUMMARY_SECURE_SCAFFOLDS: Record<string, string> = {
  "document-summary": [
    "How to summarize:",
    "- Use plain bullets only.",
    "- One main idea per bullet.",
    "- No repeated points.",
    "- Focus on the most important facts, decisions, or takeaways.",
  ].join("\n"),

  "privacy-check": [
    "How to redact:",
    "- Keep the original wording and order.",
    "- Replace only sensitive spans with [REDACTED].",
    "- Do not summarize.",
    "- Do not explain the changes.",
  ].join("\n"),
};

export type AskAnythingIntentRoute =
  | "message"
  | "explain"
  | "list"
  | "rewrite"
  | "default";

export function classifyAskAnythingIntent(userInput: string): AskAnythingIntentRoute {
  const u = userInput.trim();
  if (!u) return "default";

  if (
    /\b(bullet|bullets|bullet-?point|outline|numbered\s+list|list\s+of|key\s+points)\b/i.test(
      u
    ) ||
    /^\s*\d+[\).\]]\s+/m.test(u)
  ) {
    return "list";
  }

  if (
    /\b(why\s|what\s+is\s|what\s+are\s|how\s+does\s|how\s+do\s|explain\s|define\s|meaning\s+of)\b/i.test(
      u
    )
  ) {
    return "explain";
  }

  if (
    /\b(rewrite|rephrase|reword|polish|shorten|make\s+it\s+shorter|make\s+it\s+longer|change\s+the\s+tone|more\s+formal|more\s+casual)\b/i.test(
      u
    )
  ) {
    return "rewrite";
  }

  if (/\b(write|draft|email|e-mail|message|reply|respond|slack|text\s+to)\b/i.test(u)) {
    return "message";
  }

  return "default";
}

function askAnythingIntentSection(route: AskAnythingIntentRoute): string {
  const lines: Record<AskAnythingIntentRoute, string> = {
    message:
      "Intent: write a message or email.\n- Output only the finished message.\n- No meta advice.",
    explain:
      "Intent: answer or explain.\n- Use plain sentences.\n- No greeting unless the user asked for a message.",
    list:
      "Intent: list.\n- Use plain bullets (- or •).\n- No long intro before the list.",
    rewrite:
      "Intent: rewrite.\n- Keep the same facts.\n- Output only the rewritten text.",
    default:
      "Intent: follow the request exactly.\n- Output only what the user asked for.\n- No extra commentary.",
  };
  return lines[route];
}

function getSmallTierInstructionScaffold(template: PromptTemplate, tier: ModelTier): string {
  if (tier !== "small") return "";
  if (template.enhancementType === "summarize" || template.enhancementType === "secure") {
    return SMALL_MODEL_SUMMARY_SECURE_SCAFFOLDS[template.id] ?? "";
  }
  if (template.enhancementType === "improve" || template.enhancementType === "ask") {
    return (
      SMALL_MODEL_INSTRUCTION_SCAFFOLDS[template.id] ??
      DEFAULT_SMALL_INSTRUCTION_SCAFFOLD_IMPROVE_ASK
    );
  }
  return "";
}

export type AiSentenceLengthId = "1-2" | "2-3" | "4-6" | "7-10";

/** Chips for “length in sentences” on the Write with AI flow. */
export const AI_SENTENCE_LENGTH_OPTIONS: readonly { id: AiSentenceLengthId; label: string }[] = [
  { id: "1-2", label: "1 - 2" },
  { id: "2-3", label: "2 - 3" },
  { id: "4-6", label: "4 - 6" },
  { id: "7-10", label: "7 - 10" },
];

const SENTENCE_LENGTH_USER_SUFFIX_RE = /\s*Write \([^)]+\) of sentences\.$/;
const LEGACY_SENTENCE_USER_SUFFIX_RE = /\s*Use the sentence length I selected\.$/;

/** End of the visible draft prompt, e.g. `Write (1 - 2) of sentences.` */
export function formatSentenceLengthUserSuffix(preset: AiSentenceLengthId): string {
  const opt = AI_SENTENCE_LENGTH_OPTIONS.find((o) => o.id === preset);
  const label = opt?.label ?? "2 - 3";
  return ` Write (${label}) of sentences.`;
}

/** Replace an existing length clause when the user picks a different chip (or migrate legacy wording). */
export function applySentenceLengthToUserPrompt(prompt: string, preset: AiSentenceLengthId): string {
  const base = prompt.replace(SENTENCE_LENGTH_USER_SUFFIX_RE, "").replace(LEGACY_SENTENCE_USER_SUFFIX_RE, "");
  return base + formatSentenceLengthUserSuffix(preset);
}

export function getOutputLengthInstruction(
  tier: ModelTier,
  enhancementType: PromptTemplate["enhancementType"]
): string {
  if (enhancementType === "summarize") {
    if (tier === "small") {
      return "Output length: at most 4 bullet points. One short sentence per bullet. Use plain bullets only.";
    }
    if (tier === "medium") {
      return "Output length: about 4–7 bullets. One clear sentence per bullet.";
    }
    return "Output length: about 5–10 bullets. Keep bullets scannable and non-redundant.";
  }

  if (enhancementType === "secure") {
    if (tier === "small") {
      return "Output length: keep the same structure as the input. Replace only sensitive spans with [REDACTED]. No explanation.";
    }
    return "Output length: match the input layout and redact in place only.";
  }

  if (enhancementType === "ask") {
    if (tier === "small") {
      return "Output length: 2–4 short sentences, unless the user clearly asked for bullets or steps.";
    }
    if (tier === "medium") {
      return "Output length: about 3–6 sentences, or a compact bullet list if clearer.";
    }
    return "Output length: about 4–10 sentences unless a shorter answer fits better.";
  }

  if (tier === "small") {
    return "Output length: 2–3 short sentences unless the user clearly needs more.";
  }
  if (tier === "medium") {
    return "Output length: about 3–5 sentences unless the user asks for longer or shorter.";
  }
  return "Output length: about 4–8 sentences unless the user specifies a different length.";
}

/**
 * Applies the user’s sentence-length chip when building the model prompt.
 * Summary uses a prose/bullet-equivalent reading; secure/redact keeps tier-based length rules.
 */
function resolveOutputLengthLine(
  tier: ModelTier,
  enhancementType: PromptTemplate["enhancementType"],
  preset: AiSentenceLengthId | undefined,
): string {
  const base = getOutputLengthInstruction(tier, enhancementType);
  if (!preset || enhancementType === "secure") return base;
  const range = (
    {
      "1-2": "1–2",
      "2-3": "2–3",
      "4-6": "4–6",
      "7-10": "7–10",
    } as const
  )[preset];
  if (enhancementType === "summarize") {
    return `Output length: about ${range} short summary sentences (or the same coverage as concise bullets).`;
  }
  return `Output length: about ${range} complete sentences unless the user asked for bullets, a list, or a different format.`;
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

export function getPromptTemplateById(
  id: string | null | undefined
): PromptTemplate | undefined {
  return promptTemplates.find((t) => t.id === id);
}

/** @deprecated Use getModelTier from @shared/modelTier */
export const getPromptBuildModelTier = getModelTier;

export function buildPromptFromTemplate(
  template: PromptTemplate,
  userInput: string,
  modelId: string,
  sentenceLengthPreset?: AiSentenceLengthId,
): string {
  const tier = getModelTier(modelId);
  const lengthLine = resolveOutputLengthLine(tier, template.enhancementType, sentenceLengthPreset);

  const extraSmall: string[] =
    tier === "small"
      ? ["Use simple words.", "Do not add a title."]
      : tier === "medium"
        ? ["Keep sentences straightforward."]
        : [];

  const useGrounding =
    tier === "small" &&
    (template.enhancementType === "improve" || template.enhancementType === "ask");

  const structuredHint = useGrounding
    ? buildSmallTierStructuredFieldsHint(template.id, userInput, template.enhancementType)
    : "";

  const smallInstructionScaffold = getSmallTierInstructionScaffold(template, tier);

  const skipExampleForSmallTier =
    tier === "small" &&
    (template.enhancementType === "improve" ||
      template.enhancementType === "ask" ||
      template.enhancementType === "summarize" ||
      template.enhancementType === "secure");

  const exampleSection =
    template.outputExample && !skipExampleForSmallTier
      ? `\nExample output shape only. Sample names and details are fictional. Use facts from the USER REQUEST only; do not copy sample names or wording:\n${template.outputExample}`
      : "";

  const instructionScaffoldSection = smallInstructionScaffold
    ? `\n${smallInstructionScaffold}`
    : "";

  const guidance =
    tier === "small" && template.smallModelGuidance
      ? template.smallModelGuidance
      : template.modelGuidance;

  const askIntentSection =
    tier === "small" && template.id === "ask-anything"
      ? `\n${askAnythingIntentSection(classifyAskAnythingIntent(userInput))}\n`
      : "";

  return [
    tier === "small" ? BASE_INSTRUCTION_SMALL : BASE_INSTRUCTION,
    "",
    PLACEHOLDER_BRACE_RULE,
    useGrounding ? `\n${GROUNDING_RULES_SMALL}\n` : "",
    "",
    guidance,
    askIntentSection,
    "",
    lengthLine,
    ...extraSmall,
    "",
    structuredHint,
    "User request:",
    userInput,
    instructionScaffoldSection,
    exampleSection,
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

export function buildOutputRepairAddition(issues: LocalLlmValidationIssue[]): string {
  const lines: string[] = [
    "---",
    "REGENERATE (your last answer failed checks). Use the same USER REQUEST above.",
    "Rules for this attempt:",
    "- Output only the final text. No preamble like “Here is” or “Sure”.",
    "- No {{ or }} and no placeholder tokens.",
    "- No “Final note:” and no thinking tags.",
  ];

  if (issues.includes("meeting_recipient_missing")) {
    lines.push("- Greet or address the person using the exact name or title from the USER REQUEST.");
  }

  if (issues.includes("too_many_bullets_summarize")) {
    lines.push("- Use at most 4 bullet points. One idea per bullet.");
  }

  if (issues.includes("thinking_tag")) {
    lines.push("- Do not output <redacted_thinking>, <think>, or any XML-style reasoning tags.");
  }

  lines.push("Throw away the bad patterns above and write the correct version now.");
  return lines.join("\n");
}