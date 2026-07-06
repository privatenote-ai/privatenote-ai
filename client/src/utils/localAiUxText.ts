/**
 * User-facing copy for on-device AI: avoid exposing internal model IDs or vendor names.
 *
 * Generation follows four phases: analyze → think (pre-token) → draft (streaming) → finalize (strip/validate).
 */

import { getActiveTranslations } from "./translation";

function tx() {
  return getActiveTranslations();
}

function interpolate(template: string, vars: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replaceAll(`{${key}}`, value);
  }
  return result;
}

/** Phase 1 — after the model is loaded, before the request is sent (replaces internal “Ready to generate” in the UI). */
export function localAiAnalyzingPromptLabel(): string {
  return tx().localAiAnalyzingPrompt;
}

/** Optional second line during phase 1. */
export function localAiAnalyzingDetailHint(): string {
  return tx().localAiAnalyzingDetail;
}

/**
 * How long to hold phase 1 (“Analyzing your prompt…”) before starting the model request
 * in template-based generate/regenerate flows. Keeps pacing closer to the often-slower “Thinking…” phase.
 */
export const LOCAL_AI_PROMPT_ANALYSIS_DWELL_MS = 5200;

/** Phase 2 — request in flight, no assistant tokens yet (often the slowest part on CPU). */
export function localAiThinkingLabel(): string {
  return tx().localAiThinking;
}

/** Longer reassurance for phase 2 (shown as `detail` under the headline). */
export function localAiThinkingDetailHint(): string {
  return tx().localAiThinkingDetail;
}

/**
 * @deprecated Prefer {@link localAiThinkingDetailHint} for pre-stream copy; kept for call sites that only need a short line.
 */
export function localAiOnDeviceSlownessHint(): string {
  return localAiThinkingDetailHint();
}

/** Phase 3 — assistant tokens streaming in. Task-specific headline where it helps clarity. */
export function localAiDraftingLabel(
  type: "improve" | "summarize" | "secure" | "ask" | "simplify",
): string {
  const strings = tx();
  switch (type) {
    case "summarize":
      return strings.localAiDraftingSummary;
    case "secure":
      return strings.localAiDraftingSecure;
    case "improve":
      return strings.localAiDraftingImprove;
    case "simplify":
      return strings.localAiDraftingSimplify;
    case "ask":
      return strings.localAiDraftingAsk;
  }
}

/** Model load complete — internal progress headline before generation starts. */
export function localAiReadyToGenerateLabel(): string {
  return tx().localAiReadyToGenerate;
}

export function localAiWorkingLabel(): string {
  return tx().localAiWorking;
}

export function localAiLoadingPrivateLabel(): string {
  return tx().localAiLoadingPrivate;
}

export function isLocalAiReadyToGenerateProgress(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  return trimmed === tx().localAiReadyToGenerate || trimmed === "Ready to generate";
}

export function localAiResettingDownloadLabel(modelId: string): string {
  return interpolate(tx().localAiResettingDownload, {
    model: publicModelNameForLoadProgress(modelId),
  });
}

export function localAiRetryingDownloadLabel(modelId: string): string {
  return interpolate(tx().localAiRetryingDownload, {
    model: publicModelNameForLoadProgress(modelId),
  });
}

/**
 * Which animated affordance matches the current headline (brain = cognitive / setup; pencil = streaming text).
 */
export function getLocalAiGenerationGlyph(headline: string): "brain" | "pencil" {
  const strings = tx();
  const h = headline.trim().toLowerCase();
  const brainNeedles = [
    strings.localAiThinking,
    strings.localAiAnalyzingPrompt,
    strings.localAiFinalizing,
    strings.localAiWorking,
    strings.localAiLoadingPrivate,
    strings.localAiReadyToGenerate,
    interpolate(strings.localAiLoadingModel, { model: "" }).replace(/\s+/g, " ").trim(),
    "thinking",
    "analyzing",
    "finalizing",
    "loading",
    "working",
    "ready to generate",
    "učitavanje",
    "razmišl",
    "analiz",
    "završav",
  ]
    .map((s) => s.toLowerCase())
    .filter(Boolean);

  if (brainNeedles.some((needle) => h.includes(needle))) {
    return "brain";
  }
  if (/^(loading|učitavanje) .+\(\d{1,3}%\)$/i.test(h.trim())) {
    return "brain";
  }
  if (h.includes("preparing private ai")) {
    return "brain";
  }
  return "pencil";
}

/** Phase 4 — parse, strip reasoning tags, clean, validate (and optional repair). */
export function localAiFinalizingLabel(): string {
  return tx().localAiFinalizing;
}

/** @deprecated Streaming phases use {@link localAiDraftingLabel} + {@link localAiFinalizingLabel}; kept for older call sites. */
export function localAiGenerationPhaseLabel(
  type: "improve" | "summarize" | "secure" | "ask" | "simplify",
): string {
  return localAiDraftingLabel(type);
}

const TECHNICAL_LOAD_PROGRESS_LINE =
  /Qwen|Llama|Gemma|gemma|DeepSeek|MLC|SmolLM|smollm|\.wasm|https?:\/\/|model_lib|params_|\/models\/|indexeddb|shard/i;

/** Generic MLC / engine status lines — replace with localized headline + percent only. */
const GENERIC_LOAD_PROGRESS_LINE =
  /^(loading\b|fetching\b|initiate\b|download\b|start to fetch)/i;

/**
 * Short label for load progress (catalog id → readable name; avoids raw URLs and internal paths).
 */
export function publicModelNameForLoadProgress(modelId: string): string {
  const id = modelId.trim();
  if (/Qwen3-0\.6B/i.test(id)) return "Qwen3 0.6B";
  if (/gemma-2-2b/i.test(id)) return "Gemma 2 2B";
  if (/gemma-4/i.test(id)) return "Gemma 4";
  const stripped = id.replace(/-MLC.*$/i, "").replace(/_/g, " ");
  return stripped.replace(/-/g, " ").replace(/\s+/g, " ").trim() || id;
}

export function userFacingLocalAiLoadProgress(
  raw: string | undefined,
  progressFraction: number,
  modelId?: string,
): string {
  const percent = Math.round(Math.min(1, Math.max(0, progressFraction)) * 100);
  const rawText = (raw ?? "").trim();
  const strings = tx();
  const headline = modelId
    ? interpolate(strings.localAiLoadingModel, { model: publicModelNameForLoadProgress(modelId) })
    : strings.localAiLoadingPrivate;

  if (!rawText) return `${headline} (${percent}%)`;
  if (TECHNICAL_LOAD_PROGRESS_LINE.test(rawText) || GENERIC_LOAD_PROGRESS_LINE.test(rawText)) {
    return `${headline} (${percent}%)`;
  }
  if (modelId) {
    return `${headline}: ${rawText} (${percent}%)`;
  }
  return rawText;
}
