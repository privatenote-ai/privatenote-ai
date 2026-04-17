/**
 * User-facing copy for on-device AI: avoid exposing internal model IDs or vendor names.
 *
 * Generation follows four phases: analyze → think (pre-token) → draft (streaming) → finalize (strip/validate).
 */

/** Phase 1 — after the model is loaded, before the request is sent (replaces internal “Ready to generate” in the UI). */
export function localAiAnalyzingPromptLabel(): string {
  return "Analyzing your prompt…";
}

/** Optional second line during phase 1. */
export function localAiAnalyzingDetailHint(): string {
  return "Understanding your template and instructions.";
}

/**
 * How long to hold phase 1 (“Analyzing your prompt…”) before starting the model request
 * in template-based generate/regenerate flows. Keeps pacing closer to the often-slower “Thinking…” phase.
 */
export const LOCAL_AI_PROMPT_ANALYSIS_DWELL_MS = 5200;

/** Phase 2 — request in flight, no assistant tokens yet (often the slowest part on CPU). */
export function localAiThinkingLabel(): string {
  return "Thinking…";
}

/** Longer reassurance for phase 2 (shown as `detail` under the headline). */
export function localAiThinkingDetailHint(): string {
  return "This step often takes the longest—especially on slower devices. The model may be working through your request before any text appears.";
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
  switch (type) {
    case "summarize":
      return "Writing your summary…";
    case "secure":
      return "Writing redacted text…";
    case "improve":
      return "Writing clearer wording…";
    case "simplify":
      return "Writing simpler wording…";
    case "ask":
      return "Writing…";
  }
}

/**
 * Which animated affordance matches the current headline (brain = cognitive / setup; pencil = streaming text).
 */
export function getLocalAiGenerationGlyph(headline: string): "brain" | "pencil" {
  const t = headline.trim().toLowerCase();
  if (
    t.includes("thinking") ||
    t.includes("analyzing") ||
    t.includes("finalizing") ||
    (t.includes("loading") &&
      (t.includes("private ai") || /^loading .+\(\d{1,3}%\)$/i.test(t.trim()))) ||
    t.includes("preparing private ai") ||
    t === "working…" ||
    t === "working"
  ) {
    return "brain";
  }
  return "pencil";
}

/** Phase 4 — parse, strip reasoning tags, clean, validate (and optional repair). */
export function localAiFinalizingLabel(): string {
  return "Finalizing answer…";
}

/** @deprecated Streaming phases use {@link localAiDraftingLabel} + {@link localAiFinalizingLabel}; kept for older call sites. */
export function localAiGenerationPhaseLabel(
  type: "improve" | "summarize" | "secure" | "ask" | "simplify",
): string {
  return localAiDraftingLabel(type);
}

const TECHNICAL_LOAD_PROGRESS_LINE =
  /Qwen|Llama|Gemma|gemma|DeepSeek|MLC|SmolLM|smollm|\.wasm|https?:\/\/|model_lib|params_|\/models\/|indexeddb|shard/i;

/**
 * Short label for load progress (catalog id → readable name; avoids raw URLs and internal paths).
 */
export function publicModelNameForLoadProgress(modelId: string): string {
  const id = modelId.trim();
  if (/SmolLM2-360M/i.test(id)) return "SmolLM2 360M";
  if (/SmolLM2-135M/i.test(id)) return "SmolLM2 135M";
  if (/SmolLM2-1\.7B/i.test(id)) return "SmolLM2 1.7B";
  if (/Qwen3-0\.6B/i.test(id)) return "Qwen3 0.6B";
  if (/Qwen3-1\.7B/i.test(id)) return "Qwen3 1.7B";
  if (/Qwen3-4B/i.test(id)) return "Qwen3 4B";
  if (/gemma-3/i.test(id)) return "Gemma 3 1B";
  if (/gemma-2-2b/i.test(id)) return "Gemma 2 2B";
  if (/Llama-3\.2-1B/i.test(id)) return "Llama 3.2 1B";
  if (/Llama-3\.2-3B/i.test(id)) return "Llama 3.2 3B";
  if (/Llama-3[._]1-8B|Llama-3\.1-8B/i.test(id)) return "Llama 3.1 8B";
  const stripped = id.replace(/-MLC.*$/i, "").replace(/_/g, " ");
  return stripped.replace(/-/g, " ").replace(/\s+/g, " ").trim() || id;
}

export function userFacingLocalAiLoadProgress(
  raw: string | undefined,
  progressFraction: number,
  modelId?: string,
): string {
  const percent = Math.round(Math.min(1, Math.max(0, progressFraction)) * 100);
  const t = (raw ?? "").trim();
  const headline = modelId
    ? `Loading ${publicModelNameForLoadProgress(modelId)}`
    : "Loading private AI";

  if (!t) return `${headline} (${percent}%)`;
  if (TECHNICAL_LOAD_PROGRESS_LINE.test(t)) {
    return `${headline} (${percent}%)`;
  }
  if (modelId) {
    return `${headline}: ${t} (${percent}%)`;
  }
  return t;
}
