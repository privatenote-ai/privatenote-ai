/**
 * Map model IDs to rough on-disk size and "small / medium / large" tiers.
 * Used for temperature, stop sequences, max_tokens headroom, and template length hints.
 */

export type ModelTier = "small" | "medium" | "large";

const DEFAULT_MODEL_SIZE_MB = 200;

export function estimateModelSizeMB(modelId: string): number {
  const id = modelId;
  // SmolLM2 family — explicit before the generic size heuristics so the q4f32_1
  // 360M variant reports its real on-disk footprint (≈580 MB) rather than the
  // generic 200 MB fallback. 135M is the smallest usable SmolLM2 checkpoint.
  if (/SmolLM2-360M/i.test(id)) {
    if (/q4f32/i.test(id)) return 580;
    if (/q0f16/i.test(id)) return 730;
    return 380;
  }
  if (/SmolLM2-135M/i.test(id)) return 170;
  if (/SmolLM2-1\.7B/i.test(id)) {
    return /q4f32/i.test(id) ? 1100 : 900;
  }
  if (
    id.includes("270m") ||
    id.includes("270M") ||
    id.includes("0.5B") ||
    id.includes("0.5b") ||
    id.includes("0.6B") ||
    id.includes("0.6b")
  ) {
    return 200;
  }
  if (id.includes("1.7B") || id.includes("1.7b")) {
    return 700;
  }
  if (
    id.includes("1B") ||
    id.includes("1b") ||
    id.includes("1.5B") ||
    id.includes("1.5b")
  ) {
    return 600;
  }
  if (id.includes("-4B-") || id.includes("-4b-")) {
    return 3000;
  }
  if (
    id.includes("2B") ||
    id.includes("2b") ||
    id.includes("3B") ||
    id.includes("3b")
  ) {
    return 1200;
  }
  if (
    id.includes("7B") ||
    id.includes("7b") ||
    id.includes("8B") ||
    id.includes("8b")
  ) {
    return 4000;
  }
  return DEFAULT_MODEL_SIZE_MB;
}

export function getModelTier(modelId: string): ModelTier {
  // SmolLM2 360M / 135M behave like small models (tight prompts, clamped
  // temperature) even though the fp32-scale variant is ~580 MB on disk.
  if (/SmolLM2-(360M|135M)/i.test(modelId)) return "small";
  const sizeMB = estimateModelSizeMB(modelId);
  if (sizeMB <= 400) return "small";
  if (sizeMB <= 2000) return "medium";
  return "large";
}
