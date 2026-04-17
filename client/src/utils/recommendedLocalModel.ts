/**
 * Local WebLLM model triage: WebGPU `maxStorageBufferBindingSize` (after prime) + coarse CPU/RAM hints.
 * Default on-device model is Gemma 2 2B (q4f16); Qwen 4B is premium when hardware allows.
 * User-Agent sniffing is not used here—browser/GPU capability matters more than device brand.
 */
import { prebuiltAppConfig } from "@mlc-ai/web-llm";
import { USE_CUSTOM_WEBLLM_HOST, OUR_WEBLLM_MODEL_RECORDS } from "./webllm-host-config";
import { requestWebGpuAdapterWithRetries } from "./webgpu-diagnostics";

export const MODEL_QWEN_0_6 = "Qwen3-0.6B-q4f16_1-MLC";
export const MODEL_QWEN_1_7 = "Qwen3-1.7B-q4f16_1-MLC";
export const MODEL_QWEN_4 = "Qwen3-4B-q4f16_1-MLC";
/** Default free-tier baseline (requires WebGPU `shader-f16` in MLC build). */
export const MODEL_GEMMA_2_2B = "gemma-2-2b-it-q4f16_1-MLC";
/** ~376 MB MLC footprint, requires `shader-f16` — preferred on iPhone 13 / iOS 17+ Safari. */
export const MODEL_SMOLLM2_360M_Q4F16 = "SmolLM2-360M-Instruct-q4f16_1-MLC";
/** ~580 MB MLC footprint, no shader-f16 required — fallback for older WebGPU implementations. */
export const MODEL_SMOLLM2_360M_Q4F32 = "SmolLM2-360M-Instruct-q4f32_1-MLC";

/** Below this maxStorageBufferBindingSize, avoid 4B even for premium (many mobile / low-end GPUs). */
export const VRAM_LIMIT_BYTES = 128 * 1024 * 1024;

/**
 * Qwen3-0.6B lists ~1.4GB VRAM in MLC prebuilt config; Safari often reports maxStorageBufferBindingSize ~0.7GB
 * on iPhone — leading Qwen first causes immediate GPU device lost. Prefer SmolLM2 when under this cap
 * (or before the GPU probe has run: conservative for first mobile paint).
 */
export const MOBILE_BINDING_MAX_FOR_QWEN_0_6_FIRST_BYTES = 1024 * 1024 * 1024;

/**
 * Gemma-2-2B needs ~1.9 GB VRAM. Require the adapter to report ≥ 1.5 GB
 * `maxStorageBufferBindingSize` before we surface it as a "boost" option on mobile.
 * iPhone 15 Pro / 16 / 17 (A17 / A18) typically report ≥ 2 GB.
 */
export const MOBILE_BINDING_MIN_FOR_GEMMA_2_2B_BYTES = 1.5 * 1024 * 1024 * 1024;

const MOBILE_BOOST_KEY = "privatenote_mobile_gemma_boost";

/** True when the user has opted into the Gemma-2-2B boost on mobile. */
export function getIsMobileBoostEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(MOBILE_BOOST_KEY) === "1";
  } catch {
    return false;
  }
}

export function setMobileBoostEnabled(on: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (on) {
      localStorage.setItem(MOBILE_BOOST_KEY, "1");
    } else {
      localStorage.removeItem(MOBILE_BOOST_KEY);
    }
  } catch {
    /* private mode — ignore */
  }
}

/**
 * True when the GPU probe has confirmed enough binding headroom for Gemma-2-2B on this device.
 * Returns false until `primeLocalModelGpuLimit` has resolved.
 */
export function isMobileBoostCapable(): boolean {
  if (!gpuPrimed) return false;
  return gpuStorageLimitCached !== null && gpuStorageLimitCached >= MOBILE_BINDING_MIN_FOR_GEMMA_2_2B_BYTES;
}

function mobileGpuBindingTooTightForQwen06First(): boolean {
  return !gpuPrimed || (gpuStorageLimitCached !== null && gpuStorageLimitCached < MOBILE_BINDING_MAX_FOR_QWEN_0_6_FIRST_BYTES);
}

/** Prefer the f16 SmolLM2 when the GPU reports `shader-f16` — it needs ~35% less VRAM than q4f32. */
function smallestMobileSmolLm2(): string {
  if (shaderF16Cached === true) return MODEL_SMOLLM2_360M_Q4F16;
  return MODEL_SMOLLM2_360M_Q4F32;
}

/** Ordered mobile catalog ids: tight / unprimed GPU → SmolLM2 first; roomy Android → Qwen 0.6 first. */
function mobilePickOrdered(includeQwen4: boolean): readonly string[] {
  const smol = smallestMobileSmolLm2();
  // When shader-f16 is confirmed, keep the f32 SmolLM2 as a secondary fallback for catalogs that
  // don't mirror the f16 shards (custom host case). When unknown, f32 is the initial pick.
  const smolSecondary = smol === MODEL_SMOLLM2_360M_Q4F16 ? [MODEL_SMOLLM2_360M_Q4F32] : [];

  // User-opted boost: promote Gemma-2-2B to first position when the GPU probe confirms headroom.
  if (isMobileBoostCapable() && getIsMobileBoostEnabled()) {
    if (includeQwen4) {
      return [MODEL_GEMMA_2_2B, MODEL_QWEN_0_6, MODEL_QWEN_4, MODEL_QWEN_1_7, smol, ...smolSecondary];
    }
    return [MODEL_GEMMA_2_2B, MODEL_QWEN_0_6, MODEL_QWEN_1_7, smol, ...smolSecondary];
  }

  if (mobileGpuBindingTooTightForQwen06First()) {
    if (includeQwen4) {
      return [smol, ...smolSecondary, MODEL_QWEN_0_6, MODEL_QWEN_4, MODEL_GEMMA_2_2B];
    }
    return [smol, ...smolSecondary, MODEL_QWEN_0_6, MODEL_GEMMA_2_2B];
  }
  if (includeQwen4) {
    return [MODEL_QWEN_0_6, MODEL_QWEN_4, MODEL_GEMMA_2_2B, MODEL_QWEN_1_7];
  }
  return [MODEL_QWEN_0_6, MODEL_GEMMA_2_2B, MODEL_QWEN_1_7];
}

let gpuPrimed = false;
let gpuStorageLimitCached: number | null = null;
let shaderF16Cached: boolean | null = null;
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

/** Single adapter probe → { maxStorageBufferBindingSize, hasShaderF16 }. Null limit / false when unknown. */
async function probeGpuCapabilities(): Promise<{ storageLimit: number | null; shaderF16: boolean | null }> {
  if (typeof navigator === "undefined" || !navigator.gpu?.requestAdapter) {
    return { storageLimit: null, shaderF16: null };
  }
  try {
    const adapter = await requestWebGpuAdapterWithRetries({ logToConsole: false });
    if (!adapter || typeof adapter !== "object") return { storageLimit: null, shaderF16: null };
    const limits = (adapter as { limits?: { maxStorageBufferBindingSize?: number } }).limits;
    const storageRaw = limits?.maxStorageBufferBindingSize;
    const storageLimit = typeof storageRaw === "number" && storageRaw > 0 ? storageRaw : null;

    const features = (adapter as { features?: { has?: (k: string) => boolean } }).features;
    let shaderF16: boolean | null = null;
    if (features && typeof features.has === "function") {
      try {
        shaderF16 = features.has("shader-f16") === true;
      } catch {
        shaderF16 = null;
      }
    }
    return { storageLimit, shaderF16 };
  } catch {
    return { storageLimit: null, shaderF16: null };
  }
}

export async function getGpuStorageLimit(): Promise<number | null> {
  const { storageLimit } = await probeGpuCapabilities();
  return storageLimit;
}

/** True when probed adapter advertised `shader-f16`. Null when adapter could not be reached. */
export function isShaderF16Supported(): boolean | null {
  return shaderF16Cached;
}

/** Populate GPU limit cache; safe to call multiple times (deduped). */
export async function primeLocalModelGpuLimit(): Promise<void> {
  if (gpuPrimed) return;
  if (!gpuPrimePromise) {
    gpuPrimePromise = (async () => {
      const caps = await probeGpuCapabilities();
      gpuStorageLimitCached = caps.storageLimit;
      shaderF16Cached = caps.shaderF16;
      gpuPrimed = true;
    })();
  }
  await gpuPrimePromise;
}

/** Raw hardware tier ignoring premium (for diagnostics / UX labels). Not authoritative until GPU is primed. */
export function getHardwareTierModelIdSync(): string {
  if (!gpuPrimed) {
    return isMobileFormFactor()
      ? pickFirstAvailableModel(mobilePickOrdered(false))
      : MODEL_GEMMA_2_2B;
  }
  const limit = gpuStorageLimitCached;
  if (limit !== null && limit < VRAM_LIMIT_BYTES) {
    return isMobileFormFactor()
      ? pickFirstAvailableModel(mobilePickOrdered(false))
      : MODEL_GEMMA_2_2B;
  }
  const strong = getCores() >= 8 && getRamGb() >= 8;
  if (isMobileFormFactor()) {
    return strong
      ? pickFirstAvailableModel(mobilePickOrdered(true))
      : pickFirstAvailableModel(mobilePickOrdered(false));
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
  const desktopFreePick = [MODEL_GEMMA_2_2B, MODEL_QWEN_1_7] as const;

  if (!isLocalLlmPremium()) {
    return mobile
      ? pickFirstAvailableModel(mobilePickOrdered(false))
      : pickFirstAvailableModel([...desktopFreePick]);
  }

  const strong = getCores() >= 8 && getRamGb() >= 8;

  if (!gpuPrimed) {
    return mobile
      ? pickFirstAvailableModel(mobilePickOrdered(strong))
      : pickFirstAvailableModel([MODEL_GEMMA_2_2B, MODEL_QWEN_1_7]);
  }

  const limit = gpuStorageLimitCached;
  if (limit !== null && limit < VRAM_LIMIT_BYTES) {
    return mobile
      ? pickFirstAvailableModel(mobilePickOrdered(strong))
      : pickFirstAvailableModel([MODEL_GEMMA_2_2B, MODEL_QWEN_1_7]);
  }

  if (strong) {
    return mobile
      ? pickFirstAvailableModel(mobilePickOrdered(true))
      : pickFirstAvailableModel([MODEL_QWEN_4, MODEL_GEMMA_2_2B, MODEL_QWEN_1_7]);
  }
  return mobile
    ? pickFirstAvailableModel(mobilePickOrdered(false))
    : pickFirstAvailableModel([...desktopFreePick]);
}

export async function getRecommendedLocalModelId(): Promise<string> {
  await primeLocalModelGpuLimit();
  return getRecommendedLocalModelIdSync();
}

/**
 * When true, a saved catalog id (e.g. Qwen3-0.6B) should not be honored on this phone:
 * MLC lists ~1.4GB for Qwen3-0.6B while Safari often exposes maxStorageBufferBindingSize ~0.7GB.
 */
export function savedMobileModelOverGpuBindingCap(modelId: string): boolean {
  if (modelId !== MODEL_QWEN_0_6) return false;
  if (!isMobileFormFactor()) return false;
  if (!gpuPrimed) return false;
  if (gpuStorageLimitCached === null) return false;
  return gpuStorageLimitCached < MOBILE_BINDING_MAX_FOR_QWEN_0_6_FIRST_BYTES;
}
