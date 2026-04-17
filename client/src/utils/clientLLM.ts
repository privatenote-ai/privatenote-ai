import { type MLCEngineInterface, prebuiltAppConfig } from "@mlc-ai/web-llm";
import {
  loadModelWebLLM,
  unloadModelWebLLM,
  isLoadedWebLLM,
  getLoadedModelIdWebLLM,
  getWebLLMLEngine,
  isModelInCacheWebLLM,
  deleteWebLLMModelFromCache,
} from "./webllm-engine";
import {
  shouldUseTransformersJsLocalPath,
  isTransformersMobileLikelySupported,
  initializeTransformersMobile,
  generateTransformersMobile,
  clearTransformersMobileEngine,
  isTransformersMobileLoaded,
  getTransformersMobileModelInfo,
  resetTransformersMobileCache,
  isIOSWebKit,
  TRANSFORMERS_MOBILE_IOS_DISABLED_REASON,
  getActiveTransformersLoadedModelId,
} from "./transformers-mobile-engine";
import { USE_CUSTOM_WEBLLM_HOST, OUR_WEBLLM_MODEL_RECORDS } from "./webllm-host-config";
import {
  getRecommendedLocalModelIdSync,
  primeLocalModelGpuLimit,
  isLocalLlmPremium,
  getHardwareTierModelIdSync,
  isLocalModelGpuLimitPrimed,
  getCachedMaxStorageBufferBindingSize,
  MODEL_QWEN_0_6,
  MODEL_GEMMA_2_2B,
} from "./recommendedLocalModel";
import {
  extractUserFacingAnswer,
  diagnoseThinkingStrip,
  stripRedactedThinkingTags,
  removeClosedRedactedThinkingBlocks,
} from "@shared/parseThinkingOutput";
import { probeWebGpuForLocalLlm } from "./webgpu-diagnostics";
import {
  estimateModelSizeMB,
  getModelTier,
  type ModelTier,
} from "@shared/modelTier";
import { FEW_SHOT_APPENDIX_COMPACT, FEW_SHOT_APPENDIX_FULL } from "./localLlmFewShots";
import {
  userFacingLocalAiLoadProgress,
  localAiThinkingLabel,
  localAiThinkingDetailHint,
  localAiDraftingLabel,
  localAiFinalizingLabel,
} from "./localAiUxText";
import { prependBaseInstruction } from "./baseInstruction";
import {
  cleanOutput,
  validateLocalLlmOutput,
  buildOutputRepairAddition,
} from "@/components/note/promptTemplates";

const LLM_STRIP_DEBUG =
  import.meta.env.DEV === true || String(import.meta.env.VITE_DEBUG_LLM_STRIP || "").toLowerCase() === "true";

/** Verbose WebLLM chat/stream logs (Thinking… phase). On by default on iOS WebKit for field debugging. */
const WEBLLM_CHAT_DEBUG =
  import.meta.env.DEV === true ||
  String(import.meta.env.VITE_DEBUG_WEBLLM_CHAT || "").toLowerCase() === "true" ||
  (typeof navigator !== "undefined" && isIOSWebKit());

function logWebLlmChat(phase: string, payload: Record<string, unknown>): void {
  if (!WEBLLM_CHAT_DEBUG) return;
  console.warn(`[PrivateNote][LLM][chat] ${phase}`, payload);
}

/** SmolLM2 360M with fp32 scales — ≈580 MB download, fits the ~700 MB Safari tab budget on iPhone 13-class devices. */
export const MODEL_SMOLLM2_360M_Q4F32 = "SmolLM2-360M-Instruct-q4f32_1-MLC";

// Preferred models for pickers (Qwen 0.6B is auto-selected on mobile, not listed here)
const PREFERRED_MODELS = [
  MODEL_SMOLLM2_360M_Q4F32,                // Ultra-compact, iPhone 13 / low-memory Safari
  "gemma-2-2b-it-q4f16_1-MLC",             // Default free + capable baseline
  "Qwen3-1.7B-q4f16_1-MLC",                 // Fallback / alternate small instruct
  "Qwen3-4B-q4f16_1-MLC",                  // Premium + strong desktop + GPU headroom
  "Llama-3.2-1B-Instruct-q4f16_1-MLC",
  "Llama-3.2-3B-Instruct-q4f16_1-MLC",
  "Llama-3.1-8B-Instruct-q4f16_1-MLC",
];

const DEFAULT_MODEL = MODEL_GEMMA_2_2B;

function isHiddenLocalModelId(id: string): boolean {
  return id === MODEL_QWEN_0_6;
}

/** Qwen 0.6B is not offered in UI pickers; legacy saves fall back to the device default. */
export function isLocalModelHiddenFromUi(modelId: string): boolean {
  return isHiddenLocalModelId(modelId);
}

/**
 * Get list of available model IDs (full prebuilt catalog, or CDN mirror list when custom host env is set).
 */
export function getAvailableModels(): string[] {
  if (USE_CUSTOM_WEBLLM_HOST) {
    return OUR_WEBLLM_MODEL_RECORDS.map((r) => r.model_id);
  }
  return prebuiltAppConfig.model_list.map((m) => m.model_id);
}

function isModelAvailable(modelId: string): boolean {
  if (USE_CUSTOM_WEBLLM_HOST) {
    return OUR_WEBLLM_MODEL_RECORDS.some((r) => r.model_id === modelId);
  }
  return prebuiltAppConfig.model_list.some((m) => m.model_id === modelId);
}

/**
 * Get list of preferred models
 */
export function getPreferredModels(): string[] {
  return [...PREFERRED_MODELS];
}

/**
 * Sync snapshot of recommended catalog id (may run before GPU prime — prefer {@link getRecommendedLocalModelId} when priming first).
 */
export function getRecommendedModelForDevice(): string {
  return getRecommendedLocalModelIdSync();
}

/**
 * User-Agent string heuristics for debug / UX copy only. Brittle; never use for model selection or security.
 */
export type DeviceUaSniffHintsForUx = {
  /** Typical phone/tablet UA patterns; iPad desktop mode may read as “desktop”. */
  mobileFormFactorLikely: boolean;
  /** iOS 16.4+ style version in UA — rough correlate of Safari WebGPU era, not a guarantee. */
  newerIphoneOrIpodIosUaMatch: boolean;
  /** Samsung or Pixel + Android 12+ in UA — not a reliable GPU capability signal. */
  newerSamsungOrPixelAndroidUaMatch: boolean;
};

function collectDeviceUaSniffHintsForUx(): DeviceUaSniffHintsForUx {
  return {
    mobileFormFactorLikely: uaMobileFormFactorLikely(),
    newerIphoneOrIpodIosUaMatch: uaNewerIosWebGpuEraLikely(),
    newerSamsungOrPixelAndroidUaMatch: uaNewerSamsungOrPixelAndroidLikely(),
  };
}

function uaMobileFormFactorLikely(): boolean {
  if (typeof window === "undefined") return false;
  const userAgent =
    navigator.userAgent || navigator.vendor || (window as unknown as { opera?: string }).opera || "";
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
}

function uaNewerIosWebGpuEraLikely(): boolean {
  if (typeof window === "undefined") return false;
  const userAgent = navigator.userAgent;
  if (!/iphone|ipad|ipod/i.test(userAgent)) return false;
  const iosMatch = userAgent.match(/OS (\d+)[._](\d+)/);
  if (iosMatch) {
    const major = parseInt(iosMatch[1], 10);
    const minor = parseInt(iosMatch[2], 10);
    if (major > 16 || (major === 16 && minor >= 4)) return true;
  }
  return false;
}

function uaNewerSamsungOrPixelAndroidLikely(): boolean {
  if (typeof window === "undefined") return false;
  const userAgent = navigator.userAgent;
  if (!/android/i.test(userAgent)) return false;
  const isSamsung = /samsung/i.test(userAgent);
  const isGoogle = /pixel|google/i.test(userAgent);
  if (!isSamsung && !isGoogle) return false;
  const androidMatch = userAgent.match(/Android (\d+)/);
  if (androidMatch) {
    const version = parseInt(androidMatch[1], 10);
    if (version >= 12) return true;
  }
  return false;
}

/**
 * Environment snapshot for debugging / test UI. Model selection uses {@link getRecommendedLocalModelId} +
 * {@link primeLocalModelGpuLimit}, not UA fields here.
 */
export function getDeviceInfo(): {
  webGpuApiPresent: boolean;
  hardwareConcurrency: number;
  deviceMemoryGbApprox: number | null;
  localModelGpuLimitPrimed: boolean;
  gpuMaxStorageBufferBindingSizeCached: number | null;
  uaSniffHintsForUx: DeviceUaSniffHintsForUx;
  /** User-facing tier label (not an internal model id). */
  recommendedModel: string;
  /** User-facing capacity label when premium unlock applies. */
  hardwareTierIfPremium: string;
  localLlmPremium: boolean;
  webLlmSupportLevel: WebLLMBrowserSupportLevel;
  webLlmSupportHint: string | null;
} {
  const nav = typeof navigator !== "undefined" ? navigator : undefined;
  return {
    webGpuApiPresent: hasWebGPUSupport(),
    hardwareConcurrency: nav?.hardwareConcurrency ?? 0,
    deviceMemoryGbApprox:
      (nav as Navigator & { deviceMemory?: number })?.deviceMemory ?? null,
    localModelGpuLimitPrimed: isLocalModelGpuLimitPrimed(),
    gpuMaxStorageBufferBindingSizeCached: getCachedMaxStorageBufferBindingSize(),
    uaSniffHintsForUx: collectDeviceUaSniffHintsForUx(),
    recommendedModel: getLocalAiTierLabelForModelId(getRecommendedLocalModelIdSync()),
    hardwareTierIfPremium: getLocalAiTierLabelForModelId(getHardwareTierModelIdSync()),
    localLlmPremium: isLocalLlmPremium(),
    webLlmSupportLevel: getWebLLMBrowserSupportLevel(),
    webLlmSupportHint: getLocalAiSupportHint(),
  };
}

/**
 * Pick a catalog model from saved preference or {@link getRecommendedLocalModelIdSync} (GPU + CPU/RAM; not UA).
 */
function findSuitableModel(): string {
  const deviceSelectedModel = getRecommendedLocalModelIdSync();

  if (isModelAvailable(deviceSelectedModel)) {
    console.log(
      "[AI] Device-selected model:",
      deviceSelectedModel,
      isLocalLlmPremium() ? "(premium tier)" : "(free tier → Gemma 2 2B)"
    );
    return deviceSelectedModel;
  }

  console.log("[AI] Using default model:", DEFAULT_MODEL);
  return DEFAULT_MODEL;
}

// Cache key for IndexedDB
const MODEL_CACHE_KEY = "webllm_model_cache_v1";
const SELECTED_MODEL_KEY = "webllm_selected_model";

/**
 * Get selected model from localStorage or return null for auto-selection
 */
function getSelectedModel(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(SELECTED_MODEL_KEY);
    return saved || null;
  } catch {
    return null;
  }
}

async function listWebLLMDatabaseNames(): Promise<string[]> {
  if (typeof indexedDB === "undefined" || typeof indexedDB.databases !== "function") {
    return [];
  }
  try {
    const databases = await indexedDB.databases();
    return databases
      .filter((db) => db.name && (db.name.includes("webllm") || db.name.includes("mlc")))
      .map((db) => db.name!);
  } catch (error) {
    console.warn("[AI] Failed to inspect IndexedDB model cache:", error);
    return [];
  }
}

function deleteIndexedDbDatabase(name: string): Promise<void> {
  return new Promise((resolve) => {
    try {
      const req = indexedDB.deleteDatabase(name);
      req.onsuccess = () => resolve();
      req.onerror = () => resolve();
      req.onblocked = () => resolve();
    } catch {
      resolve();
    }
  });
}

function collectKnownModelIds(preferredModelId?: string): string[] {
  const ids = new Set<string>();
  if (preferredModelId) ids.add(preferredModelId);
  const loaded = getLoadedModelIdWebLLM();
  if (loaded) ids.add(loaded);
  const saved = getSelectedModel();
  if (saved && isModelAvailable(saved) && !isHiddenLocalModelId(saved)) {
    ids.add(saved);
  }
  ids.add(findSuitableModel());
  return [...ids];
}

async function hasAnyWebLLMCacheState(modelId?: string): Promise<boolean> {
  try {
    if (modelId && (await isModelInCacheWebLLM(modelId))) {
      return true;
    }
  } catch (error) {
    console.warn("[AI] Failed to check model cache state:", error);
  }
  const dbNames = await listWebLLMDatabaseNames();
  return dbNames.length > 0;
}

function isLikelyRecoverableLoadError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("model") ||
    lower.includes("appconfig") ||
    lower.includes("cache") ||
    lower.includes("indexeddb") ||
    lower.includes("database") ||
    lower.includes("fetch") ||
    lower.includes("network") ||
    lower.includes("wasm") ||
    lower.includes("unexpected")
  );
}

export async function resetLocalAiLoadState(preferredModelId?: string): Promise<void> {
  clearEngine();
  await resetTransformersMobileCache();
  const knownModelIds = collectKnownModelIds(preferredModelId);
  await Promise.allSettled(knownModelIds.map((modelId) => deleteWebLLMModelFromCache(modelId)));
  const dbNames = await listWebLLMDatabaseNames();
  await Promise.allSettled(dbNames.map((name) => deleteIndexedDbDatabase(name)));
}

export interface ModelLoadProgress {
  progress: number;
  text: string;
  /** Optional second line for UI (e.g. streaming length), not shown with load progress. */
  detail?: string;
}

export type ProgressCallback = (progress: ModelLoadProgress) => void;

let engineLoadingPromise: Promise<MLCEngineInterface> | null = null;
/** Catalog id being loaded while `engineLoadingPromise` is non-null; cleared when the load finishes or is reset. */
let engineLoadingTargetModelId: string | null = null;

/** Coalesced in-flight loads can have multiple waiters; each may register a progress listener. */
const MAX_LOAD_PROGRESS_SUBSCRIBERS = 32;
const loadProgressSubscribers = new Set<ProgressCallback>();

function addLoadProgressSubscriber(cb: ProgressCallback | undefined): void {
  if (!cb) return;
  if (loadProgressSubscribers.size >= MAX_LOAD_PROGRESS_SUBSCRIBERS) {
    console.warn(
      "[PrivateNote][AI] Too many concurrent load progress subscribers; ignoring an extra callback."
    );
    return;
  }
  loadProgressSubscribers.add(cb);
}

function notifyLoadProgressSubscribers(progress: ModelLoadProgress): void {
  loadProgressSubscribers.forEach((cb) => {
    try {
      cb(progress);
    } catch (e) {
      console.warn("[PrivateNote][AI] Load progress subscriber threw:", e);
    }
  });
}

function clearLoadProgressSubscribers(): void {
  loadProgressSubscribers.clear();
}

/** User-visible tier label for pickers and status (no internal model IDs). */
export function getLocalAiTierLabelForModelId(modelId: string): string {
  if (/SmolLM2-360M/i.test(modelId)) return "Ultra-compact (iPhone-safe, sub-1GB)";
  if (/SmolLM2-135M/i.test(modelId)) return "Ultra-compact (tiny, demo-only)";
  const mb = estimateModelSizeMB(modelId);
  if (mb <= 400) return "Compact (fast, lower footprint)";
  if (mb >= 2500) return "Large (richer output)";
  return "Standard (balanced)";
}

function getActiveModelId(): string {
  if (shouldUseTransformersJsLocalPath()) {
    return getTransformersMobileModelInfo().name;
  }
  return getLoadedModelIdWebLLM() || findSuitableModel();
}

/**
 * On-device WebLLM in this app uses the WebGPU path (WASM runtime + GPU inference).
 * Sync checks approximate capability; {@link initializeClientLLM} also probes for a real adapter.
 */
export type WebLLMBrowserSupportLevel = "unsupported" | "missing-webgpu" | "supported";

function isLocalhostOrSecureContext(): boolean {
  if (typeof window === "undefined") return false;
  if (window.isSecureContext) return true;
  const h = window.location.hostname;
  return h === "localhost" || h === "127.0.0.1";
}

/**
 * Sync capability tier for UI and routing. Does not guarantee `requestAdapter()` succeeds—see init probe.
 */
export function getWebLLMBrowserSupportLevel(): WebLLMBrowserSupportLevel {
  if (typeof window === "undefined") return "unsupported";
  if (!isLocalhostOrSecureContext()) return "unsupported";
  if (!("crypto" in window) || !("indexedDB" in window)) return "unsupported";
  if (typeof WebAssembly === "undefined") return "unsupported";
  if (typeof navigator === "undefined" || !("gpu" in navigator)) {
    return "missing-webgpu";
  }
  return "supported";
}

/** User-facing explanation when {@link isWebLLMSupported} is false; null when supported. */
export function getWebLLMSupportHint(): string | null {
  const level = getWebLLMBrowserSupportLevel();
  if (level === "supported") return null;
  if (typeof window !== "undefined" && !window.isSecureContext) {
    const h = window.location.hostname;
    if (h !== "localhost" && h !== "127.0.0.1") {
      return "On-device AI needs a secure context. Open this site over HTTPS (localhost is OK).";
    }
  }
  if (level === "missing-webgpu") {
    return "On-device AI needs WebGPU. Use a recent Chrome, Edge, or Safari version, or another device with WebGPU enabled.";
  }
  return "On-device AI needs a modern browser with WebAssembly, IndexedDB, and Web Crypto.";
}

/**
 * User-facing explanation when {@link isLocalAiSupported} is false, including the mobile Transformers path and iOS.
 */
export function getLocalAiSupportHint(): string | null {
  if (typeof window === "undefined") return null;
  if (shouldUseTransformersJsLocalPath() && isIOSWebKit()) {
    return `${TRANSFORMERS_MOBILE_IOS_DISABLED_REASON} Use cloud AI or a desktop browser.`;
  }
  if (shouldUseTransformersJsLocalPath() && !isTransformersMobileLikelySupported()) {
    return "On-device AI is not supported in this browser.";
  }
  return getWebLLMSupportHint();
}

export function isWebLLMSupported(): boolean {
  return getWebLLMBrowserSupportLevel() === "supported";
}

export function isLocalAiSupported(): boolean {
  if (shouldUseTransformersJsLocalPath()) {
    return isTransformersMobileLikelySupported();
  }
  return isWebLLMSupported();
}

/** Narrowing for TS lib sets that omit WebGPU on `Navigator`. */
type NavigatorWithWebGpu = Navigator & {
  gpu?: { requestAdapter(): Promise<unknown> };
};

async function assertWebGpuAdapterAvailable(): Promise<void> {
  const gpu =
    typeof navigator !== "undefined" ? (navigator as NavigatorWithWebGpu).gpu : undefined;
  if (!gpu?.requestAdapter) {
    throw new Error(
      getWebLLMSupportHint() ??
        "WebGPU is not available. On-device AI cannot run in this browser."
    );
  }
  const { adapter, report } = await probeWebGpuForLocalLlm({ logToConsole: true });
  if (adapter == null) {
    const fallbackHint = report.hardwareDeniedButFallbackWorked
      ? " Safari returned a software-only (fallback) adapter in diagnostics, but not a hardware adapter—MLC WebLLM still cannot start."
      : "";
    throw new Error(
      "WebGPU did not return a hardware GPU adapter. On-device AI cannot run in this tab." +
        fallbackHint +
        " Open Safari (not an in-app browser), use HTTPS or localhost, fully quit Safari after toggling Experimental Features, then retry." +
        " Filter the console for [PrivateNote][WebGPU] for a full JSON probe, or use “Run WebGPU diagnostics” on /test-llm."
    );
  }
}

/**
 * Check if browser has WebGPU support (indicator of modern browser)
 */
function hasWebGPUSupport(): boolean {
  if (typeof window === "undefined") return false;
  return typeof navigator !== "undefined" && "gpu" in navigator;
}

/**
 * Check available storage space
 */
async function checkStorageQuota(): Promise<number> {
  if ("storage" in navigator && "estimate" in navigator.storage) {
    try {
      const estimate = await navigator.storage.estimate();
      const availableMB =
        ((estimate.quota || 0) - (estimate.usage || 0)) / (1024 * 1024);
      return availableMB;
    } catch (error) {
      console.warn("Failed to check storage quota:", error);
      return Infinity; // Assume enough space if check fails
    }
  }
  return Infinity; // Assume enough space if API not available
}

/**
 * Initialize WebLLM engine with progress tracking
 */
export async function initializeClientLLM(
  onProgress?: ProgressCallback,
  preferredModelId?: string
): Promise<MLCEngineInterface> {
  if (shouldUseTransformersJsLocalPath()) {
    if (isIOSWebKit()) {
      throw new Error(
        getLocalAiSupportHint() ?? TRANSFORMERS_MOBILE_IOS_DISABLED_REASON,
      );
    }
    if (!isTransformersMobileLikelySupported()) {
      throw new Error(
        getLocalAiSupportHint() ?? "On-device AI is not supported in this browser.",
      );
    }
    await initializeTransformersMobile(onProgress);
    return null as unknown as MLCEngineInterface;
  }

  if (isLoadedWebLLM() && !preferredModelId) {
    return getWebLLMLEngine()!;
  }

  if (!isWebLLMSupported()) {
    throw new Error(
      getWebLLMSupportHint() ??
        "On-device AI is not supported in this browser. Use a recent Chrome, Edge, or Safari with WebGPU."
    );
  }

  await assertWebGpuAdapterAvailable();

  await primeLocalModelGpuLimit();

  // Determine which model to use
  let modelId: string;
  if (preferredModelId) {
    // Use explicitly requested model, validate it's available
    if (isModelAvailable(preferredModelId)) {
      modelId = preferredModelId;
      console.log("[AI] Using requested model:", modelId);
    } else {
      const available = getAvailableModels().slice(0, 5).join(", ");
      throw new Error(
        `Model "${preferredModelId}" is not available. ` +
        `Available models include: ${available}... (${getAvailableModels().length} total)`
      );
    }
  } else {
    // Check for saved model preference
    const savedModel = getSelectedModel();
    if (savedModel && isModelAvailable(savedModel) && !isHiddenLocalModelId(savedModel)) {
      modelId = savedModel;
      console.log("[AI] Using saved model preference:", modelId);
    } else {
      // Find a suitable model based on device capabilities
      modelId = findSuitableModel();
      console.log("[AI] Auto-selected model:", modelId);
    }
  }

  // Final validation - ensure the model ID is available
  if (!isModelAvailable(modelId)) {
    const available = getAvailableModels().slice(0, 5).join(", ");
    throw new Error(
      `Selected model "${modelId}" is not available. ` +
      `Available models include: ${available}... (${getAvailableModels().length} total)`
    );
  }

  if (isLoadedWebLLM() && getLoadedModelIdWebLLM() === modelId) {
    onProgress?.({ progress: 100, text: "Ready to generate" });
    return getWebLLMLEngine()!;
  }

  if (engineLoadingPromise && engineLoadingTargetModelId !== null) {
    if (engineLoadingTargetModelId === modelId) {
      addLoadProgressSubscriber(onProgress);
      return engineLoadingPromise;
    }
    throw new Error(
      `Another on-device model is still loading (${engineLoadingTargetModelId}). Wait for it to finish before loading "${modelId}".`
    );
  }

  // Check storage space (use model-specific size estimate)
  const availableSpace = await checkStorageQuota();
  const requiredSpace = estimateModelSizeMB(modelId) * 1.5; // Model + overhead
  if (availableSpace < requiredSpace) {
    throw new Error(
      `Insufficient storage space. Need at least ${Math.ceil(
        requiredSpace
      )} MB free for the on-device assistant download.`
    );
  }

  addLoadProgressSubscriber(onProgress);

  engineLoadingTargetModelId = modelId;
  engineLoadingPromise = (async () => {
    let recoveryAttempted = false;
    try {
      console.log("[AI] Loading model:", modelId, USE_CUSTOM_WEBLLM_HOST ? "(self-hosted)" : "(prebuilt)");

      const runLoad = async (): Promise<void> => {
        await loadModelWebLLM(modelId, (p) => {
          if (p.status === "loading") {
            const progressPercent = Math.round(Math.min(1, Math.max(0, p.progress)) * 100);
            notifyLoadProgressSubscribers({
              progress: progressPercent,
              text: userFacingLocalAiLoadProgress(p.file, p.progress),
            });
          }
        });
      };

      try {
        await runLoad();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const cachedStateExists = await hasAnyWebLLMCacheState(modelId);
        if (!recoveryAttempted && cachedStateExists && isLikelyRecoverableLoadError(errorMessage)) {
          recoveryAttempted = true;
          console.warn("[AI] Clearing broken local model state and retrying once:", modelId, errorMessage);
          notifyLoadProgressSubscribers({
            progress: 8,
            text: "Resetting a broken model download…",
          });
          await resetLocalAiLoadState(modelId);
          notifyLoadProgressSubscribers({
            progress: 12,
            text: "Retrying private AI download…",
          });
          await runLoad();
        } else {
          throw error;
        }
      }

      const engine = getWebLLMLEngine();
      if (!engine) {
        throw new Error("WebLLM engine missing after load");
      }

      notifyLoadProgressSubscribers({ progress: 100, text: "Ready to generate" });
      engineLoadingPromise = null;
      engineLoadingTargetModelId = null;
      clearLoadProgressSubscribers();

      return engine;
    } catch (error: unknown) {
      engineLoadingPromise = null;
      engineLoadingTargetModelId = null;
      clearLoadProgressSubscribers();

      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("[AI] On-device AI load failed:", modelId, errorMessage);

      if (errorMessage.includes("model") || errorMessage.includes("appConfig")) {
        throw new Error(
          "Couldn't load on-device AI. Check free storage and your connection, then try again."
        );
      }

      throw error;
    }
  })();

  return engineLoadingPromise;
}

/**
 * Get the initialized engine (throws if not initialized)
 */
export function getEngine(): MLCEngineInterface {
  const eng = getWebLLMLEngine();
  if (!eng) {
    throw new Error("Engine not initialized. Call initializeClientLLM() first.");
  }
  return eng;
}

/**
 * Check if engine is loaded
 */
export function isEngineLoaded(): boolean {
  return isLoadedWebLLM() || isTransformersMobileLoaded();
}

/**
 * Clear the engine instance (useful for testing or memory management)
 */
export function clearEngine(): void {
  unloadModelWebLLM();
  clearTransformersMobileEngine();
  engineLoadingPromise = null;
  engineLoadingTargetModelId = null;
  clearLoadProgressSubscribers();
}

/**
 * WebLLM/MLC throws when the Metal/WebGPU device is lost (memory pressure, tab backgrounding)
 * or when the WASM engine was disposed but JS still holds a stale reference.
 */
export function isWebLlmGpuOrDisposeFailure(error: unknown): boolean {
  const msg = (error instanceof Error ? error.message : String(error)).toLowerCase();
  const name = (error instanceof Error ? error.name : "").toLowerCase();
  return (
    msg.includes("disposed") ||
    msg.includes("device was lost") ||
    msg.includes("gpudevicelost") ||
    msg.includes("gpu device lost") ||
    (msg.includes("webgpu") && msg.includes("lost")) ||
    name.includes("binding") ||
    msg.includes("tokenizer") ||
    msg.includes("cannot pass deleted object") ||
    msg.includes("deleted object")
  );
}

/**
 * Generate prompt for enhancement type
 */
function getEnhancementPrompt(
  content: string,
  type: "improve" | "summarize" | "secure" | "ask" | "simplify"
): string {
  const prompts = {
    improve: `Improve this text for clarity and style while preserving meaning:\n\n${content}`,
    simplify: `Rewrite the following text so it is easier to understand. Use plain, everyday language and shorter sentences where helpful. Preserve the original meaning and important details; do not omit critical facts. Do not add commentary before or after the rewritten text:\n\n${content}`,
    summarize: `Summarize this text into key points:\n\n${content}`,
    secure: `Surgically redact PII from the following text.
REPLACEMENTS:
- Names -> [NAME]
- Emails -> [EMAIL]
- Phones -> [PHONE]
- Addresses -> [ADDRESS]
- Locations -> [LOCATION]
- Numbers (Credit Cards/SSN) -> [ID_NUMBER]

RULES:
1. Do NOT invent new names or data.
2. Do NOT change non-private words.
3. Keep the original structure and punctuation exactly.

TEXT to redact:
${content}`,
    ask: content, // For "ask", the content IS the prompt/question
  };
  return prompts[type];
}

function buildSecureSystemPrompt(): string {
  return `You are a surgical redaction tool.

[CONSTRAINT]:
- Output ONLY the redacted text.
- Never invent new personas or fake data.
- If no PII is found, output the text exactly as provided.

[FORMAT EXAMPLE]:
Input: "Call Bob at 555-0199 about the house in Paris."
Output: "Call [NAME] at [PHONE] about the house in [LOCATION]."

[ACTION]:
Scan the user input and replace private identifiers with their bracketed category tags. Do not explain your changes.

FINAL RULE: Output only the note. Do not speak.`;
}

/**
 * Build a strict system prompt for the PrivateNote local writer.
 *
 * A [Identity]: Specialized PrivateNote Generator
 * B [Constraint]: Output ONLY the note content (no reasoning, no wrappers)
 * C [Action]: Rewrite user intent into a styled note, informed by template pills
 * D [Format]: Direct note text only, with a concrete inline example
 */
function buildSystemPrompt(options?: {
  pillType?: string;            // e.g. "Professional", "Warm", "Celebratory"
  templateName?: string;        // e.g. "Thank You Note", "Birthday Greeting"
  templateDescription?: string; // e.g. "For help, gifts, professional follow-ups"
  modelTier?: ModelTier;
  enhancementType?: "improve" | "summarize" | "secure" | "ask" | "simplify";
}): string {
  const { pillType, templateName, templateDescription, modelTier, enhancementType } = options ?? {};

  const tone = pillType ? `${pillType} in tone` : "natural and clear";
  const context = templateName ? `a ${templateName}` : "a private note";
  const useCase = templateDescription ? ` Context: ${templateDescription}.` : "";

  const isSmallModel = modelTier === "small";

  const noThinkingXml =
    "Never print reasoning tags such as <redacted_thinking>...</redacted_thinking> or <think>...</think>. Do not include explanations, analysis, or step-by-step planning. Output only the final note text. Never use bracket placeholders like [specific context]—write a concrete, finished sentence.";

  const fewShotBlock =
    enhancementType === "improve" || enhancementType === "ask" || enhancementType === "simplify"
      ? "\n\n" +
        (modelTier === "large" ? FEW_SHOT_APPENDIX_FULL : FEW_SHOT_APPENDIX_COMPACT)
      : "";

  if (isSmallModel) {
    const identityAndConstraint =
      "You are a PrivateNote Generator. OUTPUT ONLY THE FINAL NOTE CONTENT. " +
      "No intros, no 'Here is your note', no thinking, and no markdown/HTML tags.";

    const action = `Task: Transform the user's intent into ${tone} ${context}.${useCase}`;

    const format =
      "Output must start with the first word of the note and end with the final punctuation. No trailing text. " +
      "Do not use a letter header like 'To: Name,' unless the user explicitly asked for a formal letter.";

    return `${identityAndConstraint}\n\n${noThinkingXml}\n\n${action}\n\n${format}${fewShotBlock}`;
  }

  // Larger models can follow a slightly richer prompt
  const identity =
    "You are a specialized PrivateNote Generator. Your sole purpose is to transform user inputs into polished, private messages.";

  const constraint =
    'OUTPUT ONLY THE NOTE CONTENT. Do not include phrases like "Here is your note", do not use conversational fillers, and do not provide internal reasoning or "thinking" steps. Avoid markdown/HTML tags.';

  const baseAction = `Take the following user intent and rewrite it as a ${tone} ${context}.${useCase}`;

  const format =
    "Output format example: Dear Alex Rivera, thank you for the gift! — use the real addressee from the user message, not a placeholder name. Never output {{ or }}. (No quotes, no intros, no explanations.)\n" +
    "Start the output immediately with the first word of the note. End the output immediately after the final punctuation of the note.\n" +
    "Do not use vague bracket placeholders; do not default to 'To: Name,' letter formatting unless the user asked for it.";

  return `${identity}\n\n${constraint}\n\n${noThinkingXml}\n\n${baseAction}\n\n${format}${fewShotBlock}`;
}

/**
 * Enhance note content using client-side LLM
 */
export async function enhanceNoteClientSide(
  content: string,
  type: "improve" | "summarize" | "secure" | "ask" | "simplify",
  onProgress?: ProgressCallback,
  options?: {
    pillType?: string;
    templateName?: string;
    templateDescription?: string;
    /** When set, used as the full user message (skips getEnhancementPrompt + prependBaseInstruction). */
    finalUserMessage?: string;
    /** Write-with-AI template id — enables output checks (e.g. meeting recipient). */
    templateId?: string;
    /** When true, skip the small-model second pass after failed validation. */
    disableOutputRepairPass?: boolean;
  }
): Promise<string> {
  if (shouldUseTransformersJsLocalPath()) {
    await initializeClientLLM(onProgress);

    const modelId = getActiveModelId();
    const modelTier = "small";
    const prompt =
      options?.finalUserMessage?.trim() ??
      prependBaseInstruction(getEnhancementPrompt(content, type));

    let system =
      type === "secure"
        ? buildSecureSystemPrompt()
        : buildSystemPrompt({ ...options, modelTier, enhancementType: type });

    if (type === "ask" || type === "improve" || type === "simplify") {
      system +=
        "\n\nNever output <redacted_thinking>, <think>, or any XML-style reasoning tags. " +
        "Do not show planning steps or analysis. Reply with only the final message text the user asked for.";
    }

    if (onProgress) {
      onProgress({
        progress: 18,
        text: localAiThinkingLabel(),
        detail: localAiThinkingDetailHint(),
      });
    }

    let streamedLen = 0;
    const raw = await generateTransformersMobile(
      [
        { role: "system", content: system },
        { role: "user", content: prompt },
      ],
      onProgress
        ? (piece) => {
            streamedLen += piece.length;
            onProgress({
              progress: Math.min(92, 28 + Math.min(streamedLen / 3, 64)),
              text: localAiDraftingLabel(type),
              detail: `${streamedLen.toLocaleString()} characters so far`,
            });
          }
        : undefined,
    );

    if (onProgress) {
      onProgress({
        progress: 94,
        text: localAiFinalizingLabel(),
        detail: undefined,
      });
    }

    let answer = extractUserFacingAnswer(raw.trim());
    answer = removeClosedRedactedThinkingBlocks(answer);
    answer = stripRedactedThinkingTags(answer);

    if (!answer) {
      throw new Error("On-device AI returned no usable note after processing.");
    }

    let out = cleanOutput(answer);
    const validation = validateLocalLlmOutput(out, {
      enhancementType: type,
      modelTier,
      userRequest: content,
      templateId: options?.templateId,
    });

    if (!validation.ok && validation.repairable && !options?.disableOutputRepairPass) {
      const repairPrompt = `${prompt}\n\n${buildOutputRepairAddition(validation.issues)}`;
      const repaired = await generateTransformersMobile(
        [
          { role: "system", content: system },
          { role: "user", content: repairPrompt },
        ],
        undefined,
      );
      out = cleanOutput(
        stripRedactedThinkingTags(
          removeClosedRedactedThinkingBlocks(extractUserFacingAnswer(repaired.trim())),
        ),
      );
    }

    if (LLM_STRIP_DEBUG) {
      console.warn("[PrivateNote][LLM] mobile transformers completion", {
        modelId,
        type,
        modelTier,
      });
    }

    return out;
  }

  // Initialize engine if needed
  const engine = await initializeClientLLM(onProgress);

  const modelId = getActiveModelId();
  const modelTier = getModelTier(modelId);

  const prompt =
    options?.finalUserMessage?.trim() ??
    prependBaseInstruction(getEnhancementPrompt(content, type));

  const contentLengthForTokens =
    options?.finalUserMessage?.length ?? content.length;

  // Build strict system prompt for local note-writing
  let system =
    type === "secure"
      ? buildSecureSystemPrompt()
      : buildSystemPrompt({ ...options, modelTier, enhancementType: type });

  if (type === "ask" || type === "improve" || type === "simplify") {
    system +=
      "\n\nNever output <redacted_thinking>, <think>, or any XML-style reasoning tags. " +
      "Do not show planning steps or analysis. Reply with only the final message text the user asked for.";
  }

  // Set temperature based on task, but clamp for more deterministic, direct output
  let temperature = type === "secure" ? 0.1 : type === "ask" ? 0.8 : 0.7;
  // Lower temperature = more adherence to direct-output rules (tighter for small models)
  const maxTemp = modelTier === "small" ? 0.25 : 0.4;
  temperature = Math.min(temperature, maxTemp);

  // Models that emit <redacted_thinking> burn tokens before the note; keep headroom so we don't cut mid-reasoning.
  let maxTokens: number;
  if (type === "summarize") {
    maxTokens = Math.min(Math.max(420, Math.ceil(contentLengthForTokens / 4) + 200), 900);
  } else if (type === "ask") {
    maxTokens = 1200;
  } else {
    const scaled = Math.min(contentLengthForTokens + 320, 1600);
    maxTokens = Math.max(scaled, 896);
  }

  const stopSequences =
    modelTier === "small"
      ? (["\n\n\n", "---", "Note:", "Human:", "AI:"] as string[])
      : (["---", "Note:", "Human:", "AI:"] as string[]);

  async function streamOneUserTurn(
    userPrompt: string,
    temp: number,
    /** Overrides drafting-phase headline (e.g. repair pass). */
    draftingLabelOverride?: string,
  ): Promise<{ cleaned: string; finishReason: string | null; rawLen: number; diagnosis: ReturnType<typeof diagnoseThinkingStrip> }> {
    const draftingLabel = draftingLabelOverride ?? localAiDraftingLabel(type);

    const chatMessages = [
      { role: "system" as const, content: system },
      { role: "user" as const, content: userPrompt },
    ];
    const baseChatOpts = {
      messages: chatMessages,
      max_tokens: maxTokens,
      temperature: temp,
      stop: stopSequences,
    };

    if (onProgress) {
      onProgress({
        progress: 18,
        text: localAiThinkingLabel(),
        detail: localAiThinkingDetailHint(),
      });
    }

    logWebLlmChat("thinking_phase_start", {
      modelId,
      modelTier,
      type,
      maxTokens,
      temperature: temp,
      stopCount: stopSequences.length,
      isIOSWebKit: isIOSWebKit(),
      userAgentSnippet:
        typeof navigator !== "undefined" ? String(navigator.userAgent).slice(0, 200) : "",
      userPromptChars: userPrompt.length,
      systemChars: system.length,
    });

    async function consumeCompletionStream(stream: AsyncIterable<unknown>): Promise<{
      acc: string;
      finishReason: string | null;
      usage: unknown;
    }> {
      let acc = "";
      let finishReason: string | null = null;
      let usage: unknown;
      let lastProgressAt = 0;
      let draftingStarted = false;
      const progressThrottleMs = 160;
      let chunkCount = 0;
      const streamStartedAt = Date.now();
      try {
        for await (const chunk of stream) {
          chunkCount += 1;
          if (chunkCount === 1) {
            logWebLlmChat("first_stream_chunk", {
              elapsedMs: Date.now() - streamStartedAt,
              topKeys:
                chunk && typeof chunk === "object"
                  ? Object.keys(chunk as object).slice(0, 16)
                  : [],
            });
          }
          const ch = (chunk as { choices?: Array<{ finish_reason?: string; delta?: { content?: unknown } }> })
            .choices?.[0];
          if (ch?.finish_reason) {
            finishReason = String(ch.finish_reason);
          }
          const delta = ch?.delta?.content;
          const piece = messageContentToString(delta);
          if (piece) {
            if (!draftingStarted && onProgress) {
              draftingStarted = true;
              onProgress({
                progress: 28,
                text: draftingLabel,
                detail: undefined,
              });
              lastProgressAt = Date.now();
              logWebLlmChat("first_token_text", {
                elapsedMs: Date.now() - streamStartedAt,
                pieceLen: piece.length,
              });
            }
            acc += piece;
            if (onProgress) {
              const now = Date.now();
              if (now - lastProgressAt >= progressThrottleMs) {
                lastProgressAt = now;
                onProgress({
                  progress: Math.min(92, 28 + Math.min(acc.length / 3, 64)),
                  text: draftingLabel,
                  detail: `${acc.length.toLocaleString()} characters so far`,
                });
              }
            }
          }
          if (chunk && typeof chunk === "object" && "usage" in chunk && (chunk as { usage?: unknown }).usage) {
            usage = (chunk as { usage: unknown }).usage;
          }
        }
      } catch (loopErr) {
        logWebLlmChat("stream_iterator_failed", {
          chunkCount,
          accLen: acc.length,
          message: loopErr instanceof Error ? loopErr.message : String(loopErr),
          name: loopErr instanceof Error ? loopErr.name : typeof loopErr,
          stack: loopErr instanceof Error ? loopErr.stack : undefined,
        });
        throw loopErr;
      }

      logWebLlmChat("stream_iterator_done", {
        chunkCount,
        accLen: acc.length,
        finishReason,
        totalMs: Date.now() - streamStartedAt,
      });

      return { acc, finishReason, usage };
    }

    let acc = "";
    let finishReason: string | null = null;
    let usage: unknown;
    let streamPath: "stream_with_usage" | "stream_plain" | "non_stream" = "stream_with_usage";

    const applyNonStreamReply = (reply: unknown): void => {
      streamPath = "non_stream";
      const r = reply as {
        choices?: Array<{ finish_reason?: string; message?: { content?: unknown } }>;
        usage?: unknown;
      };
      const content = r.choices?.[0]?.message?.content;
      acc = messageContentToString(content);
      const fr = r.choices?.[0]?.finish_reason;
      finishReason = fr != null ? String(fr) : null;
      if (reply && typeof reply === "object" && "usage" in reply) {
        usage = (reply as { usage?: unknown }).usage;
      }
      if (onProgress && acc.length > 0) {
        onProgress({
          progress: 56,
          text: draftingLabel,
          detail: `${acc.length.toLocaleString()} characters (non-streaming)`,
        });
      }
    };

    /** iOS Safari: streaming with `stream_options.include_usage` can corrupt the WASM tokenizer mid-run; use plain streaming first. */
    const iosChat = isIOSWebKit();

    if (iosChat) {
      streamPath = "stream_plain";
      try {
        logWebLlmChat("ios_completions_create_stream_plain_first", {});
        const stream = (await engine.chat.completions.create({
          ...baseChatOpts,
          stream: true,
        })) as AsyncIterable<unknown>;
        const consumed = await consumeCompletionStream(stream);
        acc = consumed.acc;
        finishReason = consumed.finishReason;
        usage = consumed.usage;
      } catch (e1) {
        logWebLlmChat("ios_stream_plain_failed", {
          message: e1 instanceof Error ? e1.message : String(e1),
          name: e1 instanceof Error ? e1.name : typeof e1,
          stack: e1 instanceof Error ? e1.stack : undefined,
        });
        if (isWebLlmGpuOrDisposeFailure(e1)) {
          clearEngine();
          throw e1 instanceof Error ? e1 : new Error(String(e1));
        }
        logWebLlmChat("fallback_completions_non_stream_after_ios_stream", {});
        try {
          const reply = await engine.chat.completions.create(baseChatOpts);
          applyNonStreamReply(reply);
        } catch (e2) {
          if (isWebLlmGpuOrDisposeFailure(e2)) {
            clearEngine();
          }
          throw e2 instanceof Error ? e2 : new Error(String(e2));
        }
      }
    } else {
      try {
        logWebLlmChat("completions_create_stream_with_usage", {});
        const stream = (await engine.chat.completions.create({
          ...baseChatOpts,
          stream: true,
          stream_options: { include_usage: true },
        })) as AsyncIterable<unknown>;
        const consumed = await consumeCompletionStream(stream);
        acc = consumed.acc;
        finishReason = consumed.finishReason;
        usage = consumed.usage;
      } catch (e1) {
        logWebLlmChat("stream_with_usage_failed", {
          message: e1 instanceof Error ? e1.message : String(e1),
          name: e1 instanceof Error ? e1.name : typeof e1,
          stack: e1 instanceof Error ? e1.stack : undefined,
        });
        if (isWebLlmGpuOrDisposeFailure(e1)) {
          clearEngine();
          throw e1 instanceof Error ? e1 : new Error(String(e1));
        }
        try {
          logWebLlmChat("retry_completions_create_stream_plain", {});
          const stream = (await engine.chat.completions.create({
            ...baseChatOpts,
            stream: true,
          })) as AsyncIterable<unknown>;
          const consumed = await consumeCompletionStream(stream);
          acc = consumed.acc;
          finishReason = consumed.finishReason;
          usage = consumed.usage;
          streamPath = "stream_plain";
        } catch (e2) {
          logWebLlmChat("stream_plain_failed", {
            message: e2 instanceof Error ? e2.message : String(e2),
            name: e2 instanceof Error ? e2.name : typeof e2,
            stack: e2 instanceof Error ? e2.stack : undefined,
          });
          if (isWebLlmGpuOrDisposeFailure(e2)) {
            clearEngine();
            throw e2 instanceof Error ? e2 : new Error(String(e2));
          }
          logWebLlmChat("fallback_completions_non_stream", {});
          const reply = await engine.chat.completions.create(baseChatOpts);
          applyNonStreamReply(reply);
        }
      }
    }

    logWebLlmChat("thinking_phase_end", {
      streamPath,
      accLen: acc.length,
      finishReason,
    });

    if (onProgress) {
      onProgress({
        progress: 94,
        text: localAiFinalizingLabel(),
        detail: undefined,
      });
    }
    const raw = acc.trim();
    let answer = extractUserFacingAnswer(raw);
    answer = removeClosedRedactedThinkingBlocks(answer);
    answer = stripRedactedThinkingTags(answer);
    const diagnosis = diagnoseThinkingStrip(raw, answer);

    if (LLM_STRIP_DEBUG) {
      console.warn("[PrivateNote][LLM] completion", {
        modelId,
        type,
        modelTier,
        maxTokensRequested: maxTokens,
        finishReason,
        usage,
        diagnosis,
      });
    }

    if (!answer) {
      console.error("[PrivateNote][LLM] strip failed — empty user-facing text", {
        modelId,
        type,
        streamPath,
        maxTokensRequested: maxTokens,
        finishReason,
        usage,
        diagnosis,
        hint:
          finishReason === "length"
            ? "Stopped at max_tokens (often still inside <redacted_thinking> or before 'Possible improvements')."
            : diagnosis.hasLooseOpenTag && !diagnosis.hasCloseTag
              ? "Opened <redacted_thinking> but no </redacted_thinking> and no extractable quoted draft."
              : "Check rawHead200 / outcome in diagnosis.",
      });
      throw new Error(
        `[PrivateNote][LLM] On-device AI returned no usable note after processing (finish_reason=${String(
          finishReason
        )}, raw_len=${raw.length}). Open the browser console and filter for [PrivateNote][LLM].`
      );
    }

    if (diagnosis.hasLooseOpenTag && LLM_STRIP_DEBUG) {
      console.warn("[PrivateNote][LLM] stripped reasoning → final output", {
        outcome: diagnosis.outcome,
        rawLen: diagnosis.rawCharLength,
        outLen: answer.length,
        finishReason,
      });
    }

    if (finishReason === "length") {
      console.warn("[PrivateNote][LLM] finish_reason=length (hit max_tokens ceiling)", {
        maxTokensRequested: maxTokens,
        type,
        rawLen: raw.length,
        outLen: answer.length,
        hadRedactedOpen: diagnosis.hasLooseOpenTag,
      });
    }

    return {
      cleaned: cleanOutput(answer),
      finishReason,
      rawLen: raw.length,
      diagnosis,
    };
  }

  let { cleaned: out } = await streamOneUserTurn(prompt, temperature);

  const validation = validateLocalLlmOutput(out, {
    enhancementType: type,
    modelTier,
    userRequest: content,
    templateId: options?.templateId,
  });

  if (
    !validation.ok &&
    modelTier === "small" &&
    validation.repairable &&
    !options?.disableOutputRepairPass
  ) {
    if (LLM_STRIP_DEBUG) {
      console.warn("[PrivateNote][LLM] output validation failed — repair pass", {
        issues: validation.issues,
      });
    }
    const repairTemp = Math.min(temperature, 0.18);
    const repairPrompt = `${prompt}\n\n${buildOutputRepairAddition(validation.issues)}`;
    out = (await streamOneUserTurn(repairPrompt, repairTemp, "Refining your note…")).cleaned;
  }

  return out;
}

function messageContentToString(content: unknown): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((part) =>
        part && typeof part === "object" && "text" in part ? String((part as { text: string }).text) : ""
      )
      .join("");
  }
  return "";
}

/**
 * Check if the resolved model is cached in IndexedDB (uses WebLLM cache helpers + same appConfig as load).
 */
export async function isModelCached(): Promise<boolean> {
  try {
    if (shouldUseTransformersJsLocalPath()) {
      return false;
    }
    const saved = getSelectedModel();
    const id =
      saved && isModelAvailable(saved) ? saved : findSuitableModel();
    return await isModelInCacheWebLLM(id);
  } catch (error) {
    console.warn("[AI] Failed to check cache:", error);
    return false;
  }
}

/**
 * List all cached models (IndexedDB databases)
 */
export async function listCachedModels(): Promise<string[]> {
  try {
    const databases = await indexedDB.databases();
    const base = databases
      .filter(db => db.name && (db.name.includes('webllm') || db.name.includes('mlc')))
      .map(db => db.name!);
    return shouldUseTransformersJsLocalPath()
      ? [...base, "transformers.js browser cache (model registry)"]
      : base;
  } catch (error) {
    console.warn("[AI] Failed to list cached models:", error);
    return [];
  }
}

/**
 * Get storage information
 */
export async function getStorageInfo(): Promise<{
  quota: number;
  usage: number;
  available: number;
  databases: string[];
  webllmDatabases: string[];
}> {
  let quota = 0;
  let usage = 0;
  let available = 0;
  const databases: string[] = [];
  const webllmDatabases: string[] = [];

  try {
    // Get storage estimate
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      quota = estimate.quota || 0;
      usage = estimate.usage || 0;
      available = quota - usage;
    }

    // List all databases
    const dbList = await indexedDB.databases();
    databases.push(...dbList.map(db => db.name || 'unnamed'));
    webllmDatabases.push(
      ...dbList
        .filter(db => db.name && (db.name.includes('webllm') || db.name.includes('mlc')))
        .map(db => db.name!)
    );
  } catch (error) {
    console.warn("[AI] Failed to get storage info:", error);
  }

  return {
    quota,
    usage,
    available,
    databases,
    webllmDatabases,
  };
}

/**
 * Hugging Face / MLC model id currently in memory for generation, or null before the first successful load.
 * On WebLLM, this is the id passed to `CreateMLCEngine`; `getModelInfo().name` is the device pick / next-load candidate and may differ until init finishes.
 */
export function getLoadedLocalModelId(): string | null {
  if (shouldUseTransformersJsLocalPath()) {
    return getActiveTransformersLoadedModelId();
  }
  return getLoadedModelIdWebLLM();
}

/**
 * Get model information
 */
export function getModelInfo() {
  if (shouldUseTransformersJsLocalPath()) {
    return getTransformersMobileModelInfo();
  }
  const available = getAvailableModels();
  const modelId = findSuitableModel();
  const loadedModelId = getLoadedModelIdWebLLM();

  return {
    name: modelId,
    loadedModelId,
    variantLabel: getLocalAiTierLabelForModelId(modelId),
    sizeMB: estimateModelSizeMB(modelId),
    cacheKey: MODEL_CACHE_KEY,
    availableModels: available.length,
    preferredModels: PREFERRED_MODELS,
    localLlmPremium: isLocalLlmPremium(),
    hardwareTierIfPremium: getLocalAiTierLabelForModelId(getHardwareTierModelIdSync()),
  };
}

export { collectWebGpuDiagnosticsJson, probeWebGpuForLocalLlm } from "./webgpu-diagnostics";

export {
  getRecommendedLocalModelId,
  getRecommendedLocalModelIdSync,
  getHardwareTierModelIdSync,
  primeLocalModelGpuLimit,
  isLocalLlmPremium,
  getGpuStorageLimit,
  isLocalModelGpuLimitPrimed,
  getCachedMaxStorageBufferBindingSize,
  MODEL_QWEN_0_6,
  MODEL_QWEN_1_7,
  MODEL_QWEN_4,
  MODEL_GEMMA_2_2B,
} from "./recommendedLocalModel";
