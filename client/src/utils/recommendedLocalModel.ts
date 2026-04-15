/**
 * Local WebLLM model triage: WebGPU `maxStorageBufferBindingSize` (after prime) + coarse CPU/RAM hints.
 * Default on-device model is Gemma 2 2B (q4f16); Qwen 4B is premium when hardware allows.
 * User-Agent sniffing is not used here—browser/GPU capability matters more than device brand.
 */
import { prebuiltAppConfig } from "@mlc-ai/web-llm";
import { USE_CUSTOM_WEBLLM_HOST, OUR_WEBLLM_MODEL_RECORDS } from "./webllm-host-config";

export const MODEL_QWEN_0_6 = "Qwen3-0.6B-q4f16_1-MLC";
export const MODEL_QWEN_1_7 = "Qwen3-1.7B-q4f16_1-MLC";
export const MODEL_QWEN_4 = "Qwen3-4B-q4f16_1-MLC";
/** Default free-tier baseline (requires WebGPU `shader-f16` in MLC build). */
export const MODEL_GEMMA_2_2B = "gemma-2-2b-it-q4f16_1-MLC";

/** Below this maxStorageBufferBindingSize, avoid 4B even for premium (many mobile / low-end GPUs). */
export const VRAM_LIMIT_BYTES = 128 * 1024 * 1024;

let gpuPrimed = false;
let gpuStorageLimitCached: number | null = null;
let gpuPrimePromise: Promise<void> | null = null;

/** True after {@link primeLocalModelGpuLimit} has resolved (GPU limit may still be null if probe failed). */
export function isLocalModelGpuLimitPrimed(): boolean {
  return gpuPrimed;
}

/**
 * Cached `adapter.limits.maxStorageBufferBindingSize` from the last successful prime; null if unknown.
 * For diagnostics only; selection logic reads the same cache internally.
 */
export function getCachedMaxStorageBufferBindingSize(): number | null {
  return gpuStorageLimitCached;
}

function getCores(): number {
  return typeof navigator !== "undefined" ? navigator.hardwareConcurrency ?? 0 : 0;
}

function getRamGb(): number {
  if (typeof navigator === "undefined") return 0;
  return (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 0;
}

/** Phone / tablet UA (includes iPad; excludes desktop Mac unless touch “desktop mode”). */
export function isMobileFormFactor(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return (
    /Android|iPhone|iPad|iPod|Mobile|Tablet/i.test(ua) ||
    (navigator.maxTouchPoints > 1 && /Macintosh/i.test(ua))
  );
}

function isModelInCatalog(modelId: string): boolean {
  if (USE_CUSTOM_WEBLLM_HOST) {
    return OUR_WEBLLM_MODEL_RECORDS.some((r) => r.model_id === modelId);
  }
  return prebuiltAppConfig.model_list.some((m) => m.model_id === modelId);
}

/** First ID in the list that exists in the active catalog (prebuilt or self-hosted). */
export function pickFirstAvailableModel(candidates: readonly string[]): string {
  for (const id of candidates) {
    if (isModelInCatalog(id)) return id;
  }
  return MODEL_GEMMA_2_2B;
}

/**
 * Premium unlocks Gemma 2 2B / Qwen 4B when hardware allows.
 * - VITE_LOCAL_LLM_PREMIUM=true
 * - localStorage privatenote_local_llm_premium=1
 * (Wire to billing later.)
 */
export function isLocalLlmPremium(): boolean {
  try {
    if (typeof window !== "undefined" && localStorage.getItem("privatenote_local_llm_premium") === "1") {
      return true;
    }
  } catch {
    /* private mode */
  }
  return String(import.meta.env.VITE_LOCAL_LLM_PREMIUM || "").toLowerCase() === "true";
}

export async function getGpuStorageLimit(): Promise<number | null> {
  if (typeof navigator === "undefined" || !navigator.gpu?.requestAdapter) return null;
  try {
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter?.limits) return null;
    const n = adapter.limits.maxStorageBufferBindingSize;
    return typeof n === "number" && n > 0 ? n : null;
  } catch {
    return null;
  }
}

/** Populate GPU limit cache; safe to call multiple times (deduped). */
export async function primeLocalModelGpuLimit(): Promise<void> {
  if (gpuPrimed) return;
  if (!gpuPrimePromise) {
    gpuPrimePromise = (async () => {
      gpuStorageLimitCached = await getGpuStorageLimit();
      gpuPrimed = true;
    })();
  }
  await gpuPrimePromise;
}

/** Raw hardware tier ignoring premium (for diagnostics / UX labels). Not authoritative until GPU is primed. */
export function getHardwareTierModelIdSync(): string {
  if (!gpuPrimed) {
    return isMobileFormFactor()
      ? pickFirstAvailableModel([MODEL_QWEN_0_6, MODEL_GEMMA_2_2B])
      : MODEL_GEMMA_2_2B;
  }
  const limit = gpuStorageLimitCached;
  if (limit !== null && limit < VRAM_LIMIT_BYTES) {
    return isMobileFormFactor()
      ? pickFirstAvailableModel([MODEL_QWEN_0_6, MODEL_GEMMA_2_2B])
      : MODEL_GEMMA_2_2B;
  }
  const strong = getCores() >= 8 && getRamGb() >= 8;
  if (isMobileFormFactor()) {
    return strong
      ? pickFirstAvailableModel([MODEL_QWEN_0_6, MODEL_QWEN_4, MODEL_GEMMA_2_2B])
      : pickFirstAvailableModel([MODEL_QWEN_0_6, MODEL_GEMMA_2_2B]);
  }
  return strong ? MODEL_QWEN_4 : MODEL_GEMMA_2_2B;
}

/**
 * Recommended model after premium gate + catalog filter.
 * Prefer {@link getRecommendedLocalModelId} (async) so {@link primeLocalModelGpuLimit} runs first; this sync
 * function uses GPU cache when primed, otherwise a conservative cap (no 4B) from cores/RAM only.
 */
export function getRecommendedLocalModelIdSync(): string {
  const mobile = isMobileFormFactor();
  const mobilePick = [MODEL_QWEN_0_6, MODEL_GEMMA_2_2B, MODEL_QWEN_1_7] as const;
  const desktopFreePick = [MODEL_GEMMA_2_2B, MODEL_QWEN_1_7] as const;

  if (!isLocalLlmPremium()) {
    return mobile ? pickFirstAvailableModel([...mobilePick]) : pickFirstAvailableModel([...desktopFreePick]);
  }

  const strong = getCores() >= 8 && getRamGb() >= 8;

  if (!gpuPrimed) {
    return mobile
      ? pickFirstAvailableModel([...mobilePick])
      : pickFirstAvailableModel([MODEL_GEMMA_2_2B, MODEL_QWEN_1_7]);
  }

  const limit = gpuStorageLimitCached;
  if (limit !== null && limit < VRAM_LIMIT_BYTES) {
    return mobile
      ? pickFirstAvailableModel([...mobilePick])
      : pickFirstAvailableModel([MODEL_GEMMA_2_2B, MODEL_QWEN_1_7]);
  }

  if (strong) {
    return mobile
      ? pickFirstAvailableModel([MODEL_QWEN_0_6, MODEL_QWEN_4, MODEL_GEMMA_2_2B, MODEL_QWEN_1_7])
      : pickFirstAvailableModel([MODEL_QWEN_4, MODEL_GEMMA_2_2B, MODEL_QWEN_1_7]);
  }
  return mobile ? pickFirstAvailableModel([...mobilePick]) : pickFirstAvailableModel([...desktopFreePick]);
}

export async function getRecommendedLocalModelId(): Promise<string> {
  await primeLocalModelGpuLimit();
  return getRecommendedLocalModelIdSync();
}
