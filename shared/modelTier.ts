/**
 * Map model IDs to rough on-disk size and "small / medium / large" tiers.
 * Used for temperature, stop sequences, max_tokens headroom, and template length hints.
 */

export type ModelTier = "small" | "medium" | "large";

const DEFAULT_MODEL_SIZE_MB = 200;

export function estimateModelSizeMB(modelId: string): number {
  const id = modelId;
  if (/gemma-4-E2B/i.test(id)) return 1800;
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
  if (/gemma-4/i.test(modelId) && !/MLC$/i.test(modelId)) return "large";
  const sizeMB = estimateModelSizeMB(modelId);
  if (sizeMB <= 400) return "small";
  if (sizeMB <= 2000) return "medium";
  return "large";
}
