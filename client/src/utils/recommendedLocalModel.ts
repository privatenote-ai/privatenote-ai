/**
 * Local WebLLM / Transformers model policy: WebGPU binding tiers + session failure caps.
 * CPU cores and deviceMemory are not used for tiering — only WebGPU presence, probed binding size, and session signals.
 *
 * Binding bands (negative filters):
 * - &lt; 1.5 GiB → unsupported
 * - [1.5 GiB, 1.9 GiB) → standard (Qwen 0.6 only)
 * - ≥ 1.9 GiB → newest (Gemma 2 2B default; Qwen 0.6 fallback)
 *
 * The 1.9 GiB threshold sits just below the 2 GiB (2,147,483,648 bytes) value reported
 * by Apple Silicon (M1/M2/M3/M4) for `maxStorageBufferBindingSize`, so all M-series Macs
 * land in the `newest` tier with a small safety margin for browsers that report slightly
 * lower numbers under throttling. Most discrete NVIDIA/AMD GPUs are well above this.
 *
 * Supported catalog (intentionally small):
 * - WebLLM (standard default): Qwen 0.6
 * - WebLLM (newest default): Gemma 2 2B
 *
 * Fallback remains Qwen 0.6 when the larger model cannot run.
 */
import { prebuiltAppConfig } from "@mlc-ai/web-llm";
import { USE_CUSTOM_WEBLLM_HOST, OUR_WEBLLM_MODEL_RECORDS } from "./webllm-host-config";
import { requestWebGpuAdapterWithRetries } from "./webgpu-diagnostics";
import {
  sessionGemma22WebLlmFailed,
  sessionQwen06Failed,
} from "./localLlmSessionSignals";

export const MODEL_QWEN_0_6 = "Qwen3-0.6B-q4f16_1-MLC";
export const MODEL_GEMMA_2_2B = "gemma-2-2b-it-q4f16_1-MLC";
/** Transformers.js Hub id — experimental boost on “newest” tier only. */
export const MODEL_GEMMA_4_TRANSFORMER = "onnx-community/gemma-4-E2B-it-ONNX";

/**
 * Minimum `adapter.limits.maxStorageBufferBindingSize` for any local AI (Qwen 0.6).
 * Below this, or unknown/null after probe → unsupported. (Negative filter, not VRAM.)
 */
export const MIN_BINDING_FOR_QWEN06 = 1.5 * 1024 * 1024 * 1024;
/** Desktop Safari fallback floor for experimental validation runs (1.0 GiB). */
export const MIN_BINDING_FOR_QWEN06_DESKTOP_SAFARI = 1.0 * 1024 * 1024 * 1024;
/** Desktop Safari experimental floor for offering Qwen (600 MiB). */
export const MIN_BINDING_FOR_QWEN06_DESKTOP_SAFARI_EXPERIMENTAL = 600 * 1024 * 1024;
/** Desktop Safari experimental floor for offering Gemma (900 MiB). */
export const MIN_BINDING_FOR_CAPABLE_DESKTOP_SAFARI_EXPERIMENTAL = 900 * 1024 * 1024;

/**
 * Lower bound of the "capable" band: Gemma 2 2B default + Qwen 0.6 fallback.
 * In [1.5 GiB, 1.9 GiB) → {@link DeviceTier} `standard` (Qwen 0.6 only); at or above → `newest`.
 *
 * Set to 1.9 GiB so all Apple Silicon Macs (which report exactly 2 GiB) and any GPU that
 * reports slightly under 2 GiB under load both land in the `newest` tier. Discrete NVIDIA/AMD
 * GPUs are well above this threshold.
 */
export const MIN_BINDING_FOR_CAPABLE = 1.9 * 1024 * 1024 * 1024;

/** @deprecated Same as {@link MIN_BINDING_FOR_QWEN06} (1.5 GiB floor). */
export const MIN_BINDING_FOR_GEMMA22B = MIN_BINDING_FOR_QWEN06;

/** @deprecated Use {@link MIN_BINDING_FOR_CAPABLE}. */
export const MIN_BINDING_FOR_GEMMA42B = MIN_BINDING_FOR_CAPABLE;

/** @deprecated Use {@link MIN_BINDING_FOR_QWEN06}. */
export const MOBILE_MIN_BINDING_BYTES_FOR_QWEN06_LEAD = MIN_BINDING_FOR_QWEN06;
/** @deprecated Use {@link MIN_BINDING_FOR_QWEN06}. */
export const MOBILE_BINDING_MAX_FOR_QWEN_0_6_FIRST_BYTES = MIN_BINDING_FOR_QWEN06;
/** @deprecated Use {@link MIN_BINDING_FOR_QWEN06}. */
export const MOBILE_MIN_BINDING_BYTES_FOR_GEMMA22B_BOOST = MIN_BINDING_FOR_GEMMA22B;
/** @deprecated Use {@link MIN_BINDING_FOR_QWEN06}. */
export const MOBILE_BINDING_MIN_FOR_GEMMA_2_2B_BYTES = MIN_BINDING_FOR_GEMMA22B;
/** @deprecated Legacy name — not VRAM. */
export const ABSOLUTE_LOW_GPU_BINDING_CUTOFF_BYTES = 128 * 1024 * 1024;
export const BINDING_STORAGE_BUFFER_TOO_LOW_FOR_DESKTOP_QWEN4_PREMIUM_BYTES = ABSOLUTE_LOW_GPU_BINDING_CUTOFF_BYTES;
export const VRAM_LIMIT_BYTES = ABSOLUTE_LOW_GPU_BINDING_CUTOFF_BYTES;

/** `newest` = binding ≥ {@link MIN_BINDING_FOR_CAPABLE} (1.9 GiB). Defaults to Gemma 2 2B with Qwen 0.6 fallback. */
export type DeviceTier = "unsupported" | "standard" | "newest";

export type LocalAiOffer = {
  enabled: boolean;
  defaultModel: string | null;
  boostModels: string[];
};

export {
  getIsGemma22BoostEnabled,
  setGemma22BoostEnabled,
  getIsGemma4BoostEnabled,
  setGemma4BoostEnabled,
  getIsMobileBoostEnabled,
  setMobileBoostEnabled,
} from "./localLlmBoostPreference";

let gpuPrimed = false;
let gpuStorageLimitCached: number | null = null;
let shaderF16Cached: boolean | null = null;
let gpuPrimePromise: Promise<void> | null = null;

function hasWebGpuApi(): boolean {
  if (typeof navigator === "undefined") return false;
  const gpu = (navigator as Navigator & { gpu?: { requestAdapter?: unknown } }).gpu;
  return typeof gpu?.requestAdapter === "function";
}

/**
 * Layer 1 — cached GPU facts (call {@link primeLocalModelGpuLimit} before relying on binding).
 */
export function getGpuCapabilities(): { webgpu: boolean; bindingSize: number | null } {
  return {
    webgpu: hasWebGpuApi(),
    bindingSize: gpuPrimed ? gpuStorageLimitCached : null,
  };
}

const TIER_ORDER: DeviceTier[] = ["unsupported", "standard", "newest"];

function tierRank(t: DeviceTier): number {
  return TIER_ORDER.indexOf(t);
}

function tierMin(a: DeviceTier, b: DeviceTier): DeviceTier {
  return tierRank(a) < tierRank(b) ? a : b;
}

function bindingTier(webgpu: boolean, binding: number | null): DeviceTier {
  if (!webgpu || binding === null) return "unsupported";
  if (isDesktopSafariLikely()) {
    // Safari-specific experimental tiering for local AI rollout:
    // - >= 900 MiB: "newest" (Gemma default)
    // - [600 MiB, 900 MiB): "standard" (Qwen)
    // - < 600 MiB: unsupported (graceful cloud/template fallback)
    if (binding < MIN_BINDING_FOR_QWEN06_DESKTOP_SAFARI_EXPERIMENTAL) return "unsupported";
    if (binding < MIN_BINDING_FOR_CAPABLE_DESKTOP_SAFARI_EXPERIMENTAL) return "standard";
    return "newest";
  }
  const minForQwen = getMinBindingForQwen06CurrentBrowser();
  if (binding < minForQwen) return "unsupported";
  if (binding < MIN_BINDING_FOR_CAPABLE) return "standard";
  return "newest";
}

/**
 * Layer 2 — device tier from binding + session failure caps (no CPU/RAM).
 */
export function getDeviceTier(): DeviceTier {
  const { webgpu, bindingSize } = getGpuCapabilities();
  if (!gpuPrimed) return "unsupported";
  let t = bindingTier(webgpu, bindingSize);
  if (sessionQwen06Failed()) return "unsupported";
  if (sessionGemma22WebLlmFailed()) t = tierMin(t, "standard");
  return t;
}

function isIOSWebKitLocal(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return (
    /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function isDesktopSafariLikely(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const isSafari = /Safari\//i.test(ua) && !/Chrome\/|Chromium\/|Edg\/|OPR\//i.test(ua);
  return isSafari && !isIOSWebKitLocal();
}

/**
 * Safari (desktop) occasionally reports lower WebGPU binding limits than Chromium
 * on the same Apple GPU. Allow an experimental 1.0 GiB Qwen floor there.
 */
function getMinBindingForQwen06CurrentBrowser(): number {
  if (isDesktopSafariLikely()) {
    return MIN_BINDING_FOR_QWEN06_DESKTOP_SAFARI_EXPERIMENTAL;
  }
  return MIN_BINDING_FOR_QWEN06;
}

/**
 * Layer 3 — what we may load and offer in UI.
 *
 * All accounts use Qwen 0.6 on standard-tier devices. Newest-tier devices use
 * Gemma 2 2B when shader-f16 is available, with Qwen 0.6 as fallback if the
 * larger model is not allowed or fails in the session.
 */
export function getLocalAiOffer(): LocalAiOffer {
  const tier = getDeviceTier();
  if (tier === "unsupported") {
    return { enabled: false, defaultModel: null, boostModels: [] };
  }

  if (tier === "standard") {
    return {
      enabled: true,
      defaultModel: MODEL_QWEN_0_6,
      boostModels: [],
    };
  }

  // newest: binding ≥ 1.9 GiB (covers all Apple Silicon M-series Macs and most discrete GPUs)
  const gemma22Allowed = !sessionGemma22WebLlmFailed() && shaderF16Cached === true;
  if (gemma22Allowed) {
    // Gemma 2 2B default. Qwen 0.6 remains the safe fallback.
    return {
      enabled: true,
      defaultModel: MODEL_GEMMA_2_2B,
      boostModels: [MODEL_QWEN_0_6],
    };
  }

  // Gemma 2 2B not allowed (no shader-f16, or session-failed): fall back to Qwen 0.6.
  // Without f16, fall back to Qwen 0.6.
  return {
    enabled: true,
    defaultModel: MODEL_QWEN_0_6,
    boostModels: [],
  };
}

/**
 * Legacy boost UI is disabled. Model selection is automatic from account type and device capability.
 */
export function isGemma22BoostCapable(): boolean {
  return false;
}

/** Legacy Gemma 4 public boost is disabled for the MVP policy. */
export function isGemma4BoostCapable(): boolean {
  return false;
}

/** @deprecated Use {@link isGemma22BoostCapable}. */
export function isMobileBoostCapable(): boolean {
  return isGemma22BoostCapable();
}

/** True after {@link primeLocalModelGpuLimit} has resolved. */
export function isLocalModelGpuLimitPrimed(): boolean {
  return gpuPrimed;
}

export function getCachedMaxStorageBufferBindingSize(): number | null {
  return gpuStorageLimitCached;
}

/** Phone / tablet UA — UX only; not used for tiering. */
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

export function pickFirstAvailableModel(candidates: readonly string[]): string {
  for (const id of candidates) {
    if (id === MODEL_GEMMA_4_TRANSFORMER) continue;
    if (isModelInCatalog(id)) return id;
  }
  return MODEL_QWEN_0_6;
}

/** @deprecated No longer used for policy; kept for compat. */
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

export function isShaderF16Supported(): boolean | null {
  return shaderF16Cached;
}

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

function resolveRecommendedModelIdFromOffer(): string | null {
  const offer = getLocalAiOffer();
  if (!offer.enabled || !offer.defaultModel) {
    return null;
  }

  return offer.defaultModel;
}

/** Hardware label helper — maps the premium-capable recommendation where applicable. */
export function getHardwareTierModelIdSync(): string | null {
  return resolveRecommendedModelIdFromOffer();
}

export function getRecommendedLocalModelIdSync(): string | null {
  return resolveRecommendedModelIdFromOffer();
}

export async function getRecommendedLocalModelId(): Promise<string | null> {
  await primeLocalModelGpuLimit();
  return getRecommendedLocalModelIdSync();
}

/**
 * Saved WebLLM id is invalid when tier says Qwen on disk is unsafe (binding too low).
 * @deprecated Prefer validating against {@link getLocalAiOffer}.
 */
export function savedMobileModelOverGpuBindingCap(modelId: string): boolean {
  if (modelId !== MODEL_QWEN_0_6) return false;
  if (!gpuPrimed) return false;
  if (gpuStorageLimitCached !== null && gpuStorageLimitCached >= MIN_BINDING_FOR_QWEN06) {
    return false;
  }
  return true;
}

/** @deprecated SmolLM2 removed — always false. */
export function savedMobileSmol360ShouldDeferOnTightMobile(_modelId: string): boolean {
  return false;
}
