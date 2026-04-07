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
      return "Drafting your summary…";
    case "secure":
      return "Drafting redacted text…";
    case "improve":
      return "Drafting clearer wording…";
    case "simplify":
      return "Drafting simpler wording…";
    case "ask":
      return "Drafting…";
  }
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

export function userFacingLocalAiLoadProgress(raw: string | undefined, progressFraction: number): string {
  const percent = Math.round(Math.min(1, Math.max(0, progressFraction)) * 100);
  const t = (raw ?? "").trim();
  if (!t) return `Loading private AI (${percent}%)`;
  if (
    /Qwen|Llama|Gemma|gemma|DeepSeek|MLC|\.wasm|https?:\/\/|model_lib|params_|\/models\/|indexeddb|shard/i.test(t)
  ) {
    return `Loading private AI (${percent}%)`;
  }
  return t;
}
