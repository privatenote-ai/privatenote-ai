import { ModelRegistry, TextStreamer, env, pipeline } from "@huggingface/transformers";
import type { ModelLoadProgress } from "./clientLLM";

type ProgressCallback = (progress: ModelLoadProgress) => void;

/** Mobile / narrow pipeline (Android, etc.). */
const DEFAULT_TRANSFORMERS_MODEL_ID_MOBILE = "onnx-community/SmolLM-135M-Instruct-ONNX";
/**
 * Desktop Mac dev test: ~1B instruct ONNX in the same class as small Gemma for quality checks.
 * Enable with `VITE_TRANSFORMERS_DESKTOP_MAC_DEV=true` (see `getActiveTransformersLocalModelId`).
 */
const DEFAULT_TRANSFORMERS_MODEL_ID_DESKTOP_MAC_DEV = "onnx-community/Llama-3.2-1B-Instruct-ONNX";
const TRANSFORMERS_MOBILE_TASK = "text-generation";
const TRANSFORMERS_MOBILE_Q4_DTYPE = "q4";
const DEFAULT_TRANSFORMERS_REMOTE_HOST = "https://huggingface.co/";
const rawTransformersRemoteHost =
  (import.meta.env.VITE_TRANSFORMERS_REMOTE_HOST as string | undefined)?.trim() ?? "";
const rawTransformersRemotePathTemplate =
  (import.meta.env.VITE_TRANSFORMERS_REMOTE_PATH_TEMPLATE as string | undefined)?.trim() ?? "";
const TRANSFORMERS_MOBILE_RUNTIME_APP_VERSION =
  (import.meta.env.VITE_APP_VERSION as string | undefined)?.trim() || "1.0.0";
const MOBILE_WEBGPU_SKIP_KEY = "transformers_mobile_skip_webgpu_v1";
const MOBILE_WEBGPU_SKIP_REASON_TIMEOUT = "timeout";
const MOBILE_WEBGPU_SKIP_REASON_FAILURE = "failure";
/** Desktop / non-mobile: ONNX WebGPU first init can be slow but failures should surface sooner than on phone. */
const WEBGPU_BACKEND_INIT_TIMEOUT_MS_DESKTOP = 45000;
/** Android and other mobile (non‑iOS): shader compile + session setup often exceeds 15s on first run. */
const WEBGPU_BACKEND_INIT_TIMEOUT_MS_MOBILE = 90000;
const WASM_BACKEND_INIT_TIMEOUT_MS = 60000;

function envFlagTruthy(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  const s = String(value).trim().toLowerCase();
  return s === "1" || s === "true" || s === "on" || s === "yes";
}

const TRANSFORMERS_DESKTOP_MAC_DEV_FLAG = envFlagTruthy(import.meta.env.VITE_TRANSFORMERS_DESKTOP_MAC_DEV);

type NavigatorWithWebGpu = Navigator & {
  gpu?: { requestAdapter(): Promise<unknown> };
};

/** Thrown and surfaced in UI when the mobile Transformers path is blocked on iOS/iPadOS. */
export const TRANSFORMERS_MOBILE_IOS_DISABLED_REASON =
  "Local mobile inference is disabled on iOS due to current WebGPU/WASM runtime limitations.";

export function isIOSWebKit(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const iOS =
    /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  return iOS;
}

/** Non–iPad-desktop-mode Mac (Chrome/Safari/Firefox on macOS). */
export function isDesktopMacAgentLikely(): boolean {
  if (typeof navigator === "undefined") return false;
  if (!/Macintosh/i.test(navigator.userAgent)) return false;
  if (isIOSWebKit()) return false;
  return true;
}

function hasWebGpuRequestAdapterSurface(): boolean {
  if (typeof navigator === "undefined") return false;
  const gpu = (navigator as NavigatorWithWebGpu).gpu;
  return typeof gpu?.requestAdapter === "function";
}

/** True for coarse mobile/tablet form factors (used for WebGPU init timeout only). */
function isMobileFormFactorForTimeout(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type TransformersDtype = "q4";
type BackendAttempt = {
  device: "webgpu" | "wasm";
  dtype: TransformersDtype;
  label: string;
};

type TextGenerationPipelineLike = {
  tokenizer: unknown;
  dispose?: () => Promise<void> | void;
  (
    texts: ChatMessage[],
    options?: Record<string, unknown>,
  ): Promise<Array<{ generated_text: string | Array<{ role?: string; content?: string }> }>>;
};

type StoredWebGpuSkipState = {
  appVersion: string;
  reason: string;
  updatedAt: string;
};

let generatorPromise: Promise<TextGenerationPipelineLike> | null = null;
let generatorInstance: TextGenerationPipelineLike | null = null;
let activeBackendLabel: string | null = null;

function getTransformersRemoteHost(): string {
  const configured = rawTransformersRemoteHost || DEFAULT_TRANSFORMERS_REMOTE_HOST;
  const withProtocol =
    configured.startsWith("http://") || configured.startsWith("https://")
      ? configured
      : `https://${configured}`;
  return withProtocol.endsWith("/") ? withProtocol : `${withProtocol}/`;
}

function getTransformersRemotePathTemplate(): string {
  return rawTransformersRemotePathTemplate || "{model}/resolve/{revision}/";
}

function configureTransformersEnv(): void {
  env.allowRemoteModels = true;
  env.allowLocalModels = false;
  env.useBrowserCache = true;
  env.remoteHost = getTransformersRemoteHost();
  env.remotePathTemplate = getTransformersRemotePathTemplate();
}

function mapTransformersProgress(status: Record<string, unknown>): ModelLoadProgress | null {
  if (status.status === "ready") {
    return { progress: 100, text: "Ready to generate" };
  }

  if (typeof status.progress === "number") {
    return {
      progress: Math.round(Math.min(1, Math.max(0, status.progress)) * 100),
      text: "Loading private AI…",
    };
  }

  if (status.status === "download" || status.status === "initiate" || status.status === "progress") {
    return {
      progress:
        typeof status.progress === "number"
          ? Math.round(Math.min(1, Math.max(0, status.progress)) * 100)
          : 0,
      text: "Loading private AI…",
    };
  }

  return null;
}

export function isTransformersMobileLikelySupported(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;
  if (isIOSWebKit()) return false;
  return typeof indexedDB !== "undefined" && typeof WebAssembly !== "undefined";
}

export function shouldPreferTransformersMobileExperiment(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const isMobileDevice =
    /Android|iPhone|iPad|iPod|Mobile|Tablet/i.test(ua) ||
    (navigator.maxTouchPoints > 1 && /Macintosh/i.test(ua));
  return isMobileDevice;
}

/**
 * Use Transformers.js for on-device text generation (mobile path, or Mac desktop when
 * `VITE_TRANSFORMERS_DESKTOP_MAC_DEV` is enabled). iOS is still blocked in `initializeTransformersMobile`.
 */
export function shouldUseTransformersJsLocalPath(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;
  if (TRANSFORMERS_DESKTOP_MAC_DEV_FLAG && isDesktopMacAgentLikely()) {
    return true;
  }
  return shouldPreferTransformersMobileExperiment();
}

export function getActiveTransformersLocalModelId(): string {
  const mobileOverride = (import.meta.env.VITE_TRANSFORMERS_MOBILE_MODEL_ID as string | undefined)?.trim();
  const desktopOverride = (import.meta.env.VITE_TRANSFORMERS_DESKTOP_MODEL_ID as string | undefined)?.trim();
  if (shouldPreferTransformersMobileExperiment()) {
    return mobileOverride || DEFAULT_TRANSFORMERS_MODEL_ID_MOBILE;
  }
  if (TRANSFORMERS_DESKTOP_MAC_DEV_FLAG && isDesktopMacAgentLikely()) {
    return desktopOverride || DEFAULT_TRANSFORMERS_MODEL_ID_DESKTOP_MAC_DEV;
  }
  return mobileOverride || DEFAULT_TRANSFORMERS_MODEL_ID_MOBILE;
}

function approximateTransformersModelSizeMB(modelId: string): number {
  if (/SmolLM-135M/i.test(modelId)) return 140;
  if (/Llama-3\.2-1B/i.test(modelId)) return 750;
  if (/[12]\s*B|1\.7B|2B/i.test(modelId)) return 750;
  return 500;
}

export function isTransformersMobileLoaded(): boolean {
  return generatorInstance !== null;
}

function readStoredWebGpuSkipState(): StoredWebGpuSkipState | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(MOBILE_WEBGPU_SKIP_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredWebGpuSkipState>;
    if (
      typeof parsed.appVersion !== "string" ||
      typeof parsed.reason !== "string" ||
      typeof parsed.updatedAt !== "string"
    ) {
      localStorage.removeItem(MOBILE_WEBGPU_SKIP_KEY);
      return null;
    }
    if (parsed.appVersion !== TRANSFORMERS_MOBILE_RUNTIME_APP_VERSION) {
      localStorage.removeItem(MOBILE_WEBGPU_SKIP_KEY);
      return null;
    }
    return parsed as StoredWebGpuSkipState;
  } catch {
    try {
      localStorage.removeItem(MOBILE_WEBGPU_SKIP_KEY);
    } catch {
      // ignore storage failure
    }
    return null;
  }
}

function persistWebGpuSkipState(reason: string): void {
  if (typeof localStorage === "undefined") return;
  const payload: StoredWebGpuSkipState = {
    appVersion: TRANSFORMERS_MOBILE_RUNTIME_APP_VERSION,
    reason,
    updatedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(MOBILE_WEBGPU_SKIP_KEY, JSON.stringify(payload));
  } catch {
    // ignore storage failure
  }
}

function clearStoredWebGpuSkipState(): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.removeItem(MOBILE_WEBGPU_SKIP_KEY);
  } catch {
    // ignore storage failure
  }
}

function getPreferredBackendAttempts(): BackendAttempt[] {
  if (isIOSWebKit()) {
    return [];
  }
  // `navigator.gpu` existing is not a guarantee ONNX Runtime Web + this model will run; still stricter than `"gpu" in navigator`.
  const hasWebGpuSurface = hasWebGpuRequestAdapterSurface();
  const shouldSkipWebGpu = readStoredWebGpuSkipState() !== null;
  if (hasWebGpuSurface && !shouldSkipWebGpu) {
    return [
      { device: "webgpu", dtype: TRANSFORMERS_MOBILE_Q4_DTYPE, label: "webgpu/q4" },
      { device: "wasm", dtype: TRANSFORMERS_MOBILE_Q4_DTYPE, label: "wasm/q4" },
    ];
  }
  return [{ device: "wasm", dtype: TRANSFORMERS_MOBILE_Q4_DTYPE, label: "wasm/q4" }];
}

function describeNextAttempt(attempt: BackendAttempt | undefined): string {
  return attempt ? `Falling back to ${attempt.label}.` : "No further backend attempts remain.";
}

function getWebGpuBackendInitTimeoutMs(): number {
  if (isMobileFormFactorForTimeout() && !isIOSWebKit()) {
    return WEBGPU_BACKEND_INIT_TIMEOUT_MS_MOBILE;
  }
  return WEBGPU_BACKEND_INIT_TIMEOUT_MS_DESKTOP;
}

function getBackendInitTimeoutMs(attempt: BackendAttempt): number {
  if (attempt.device === "wasm") return WASM_BACKEND_INIT_TIMEOUT_MS;
  return getWebGpuBackendInitTimeoutMs();
}

function formatInitErrorDetail(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function createBackendTimeoutError(label: string, timeoutMs: number): Error {
  return new Error(`Timed out after ${timeoutMs}ms while initializing ${label}.`);
}

async function withBackendInitTimeout<T>(
  promise: Promise<T>,
  attempt: BackendAttempt,
): Promise<T> {
  const timeoutMs = getBackendInitTimeoutMs(attempt);
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timeoutId = setTimeout(() => reject(createBackendTimeoutError(attempt.label, timeoutMs)), timeoutMs);
      }),
    ]);
  } finally {
    if (timeoutId !== null) clearTimeout(timeoutId);
  }
}

export function getTransformersMobileModelInfo() {
  const name = getActiveTransformersLocalModelId();
  const isMobile = shouldPreferTransformersMobileExperiment();
  const variantLabel = isMobile
    ? "Compact mobile fallback (experimental)"
    : "Desktop Transformers.js test (Llama 3.2 1B–class)";
  return {
    name,
    variantLabel,
    sizeMB: approximateTransformersModelSizeMB(name),
    cacheKey: `transformers_local_pipeline_v3_${name.replace(/[^a-zA-Z0-9]+/g, "_")}`,
    availableModels: 1,
    preferredModels: [name],
    localLlmPremium: false,
    hardwareTierIfPremium: variantLabel,
  };
}

export async function initializeTransformersMobile(onProgress?: ProgressCallback): Promise<void> {
  if (isIOSWebKit()) {
    onProgress?.({
      progress: 0,
      text: "On-device AI unavailable on this device",
      detail: TRANSFORMERS_MOBILE_IOS_DISABLED_REASON,
    });
    throw new Error(TRANSFORMERS_MOBILE_IOS_DISABLED_REASON);
  }

  if (generatorInstance) {
    onProgress?.({ progress: 100, text: "Ready to generate" });
    return;
  }

  if (generatorPromise) {
    await generatorPromise;
    onProgress?.({ progress: 100, text: "Ready to generate" });
    return;
  }

  configureTransformersEnv();
  onProgress?.({ progress: 0, text: "Preparing private AI…" });

  try {
    const attempts = getPreferredBackendAttempts();
    if (attempts.length === 0) {
      const msg = "No on-device backend is available for this platform.";
      onProgress?.({ progress: 0, text: "Could not start on-device AI", detail: msg });
      throw new Error(msg);
    }
    const storedSkip = readStoredWebGpuSkipState();
    const modelId = getActiveTransformersLocalModelId();
    console.log("[AI] Initializing mobile Transformers runtime", {
      model: modelId,
      remoteHost: getTransformersRemoteHost(),
      attempts: attempts.map((attempt) => attempt.label),
      webgpuSkip: storedSkip,
    });
    if (storedSkip) {
      console.warn("[AI] Skipping mobile Transformers WebGPU attempt due to stored failure state", {
        reason: storedSkip.reason,
        updatedAt: storedSkip.updatedAt,
        appVersion: storedSkip.appVersion,
      });
    }

    let lastError: unknown = null;
    for (const [index, attempt] of attempts.entries()) {
      console.log("[AI] Trying mobile Transformers backend:", attempt.label);
      onProgress?.({
        progress: 2,
        text: `Preparing private AI (${attempt.label})…`,
        detail:
          attempt.device === "wasm"
            ? shouldPreferTransformersMobileExperiment()
              ? "Mobile CPU startup can take up to about a minute on first load."
              : "CPU backend startup can take several minutes on first load for larger models."
            : undefined,
      });

      try {
        generatorPromise = pipeline(TRANSFORMERS_MOBILE_TASK, modelId, {
          device: attempt.device,
          dtype: attempt.dtype,
          progress_callback: (status) => {
            const mapped = mapTransformersProgress(status as Record<string, unknown>);
            if (mapped) onProgress?.(mapped);
          },
        }) as Promise<TextGenerationPipelineLike>;

        generatorInstance = await withBackendInitTimeout(generatorPromise, attempt);
        activeBackendLabel = attempt.label;
        if (attempt.device === "webgpu") {
          clearStoredWebGpuSkipState();
        }
        console.log("[AI] Mobile Transformers backend ready:", attempt.label);
        onProgress?.({ progress: 100, text: "Ready to generate" });
        return;
      } catch (error) {
        lastError = error;
        if (attempt.device === "webgpu") {
          const message = error instanceof Error ? error.message : String(error);
          const reason = message.includes("Timed out")
            ? MOBILE_WEBGPU_SKIP_REASON_TIMEOUT
            : MOBILE_WEBGPU_SKIP_REASON_FAILURE;
          persistWebGpuSkipState(reason);
          console.warn("[AI] Persisted mobile Transformers WebGPU skip state", {
            reason,
            appVersion: TRANSFORMERS_MOBILE_RUNTIME_APP_VERSION,
            nextAttempt: attempts[index + 1]?.label ?? null,
          });
        }
        if (attempt.device === "wasm") {
          const message = error instanceof Error ? error.message : String(error);
          if (message.includes("Load failed")) {
            console.warn(
              "[AI] Mobile Transformers WASM load failed after successful network checks; this usually indicates a browser/runtime limitation rather than a bucket CORS problem.",
            );
          }
        }
        console.error("[AI] Mobile Transformers backend failed:", attempt.label, error);
        console.warn("[AI] Mobile Transformers backend fallback:", describeNextAttempt(attempts[index + 1]));
        onProgress?.({
          progress: 2,
          text: `Backend ${attempt.label} failed`,
          detail: formatInitErrorDetail(error),
        });
        generatorInstance = null;
        generatorPromise = null;
      }
    }

    const lastDetail = lastError != null ? formatInitErrorDetail(lastError) : "Unknown error";
    onProgress?.({
      progress: 0,
      text: "Could not start on-device AI",
      detail: lastDetail,
    });

    throw lastError instanceof Error
      ? new Error(`All mobile Transformers backends failed. Last error: ${lastError.message}`)
      : new Error("All mobile Transformers backends failed.");
  } finally {
    generatorPromise = null;
  }
}

export function getActiveTransformersMobileBackendLabel(): string | null {
  return activeBackendLabel;
}

export async function generateTransformersMobile(
  messages: ChatMessage[],
  onToken?: (text: string) => void,
): Promise<string> {
  if (!generatorInstance) {
    throw new Error("Transformers mobile runtime not initialized");
  }

  console.log("[AI] Generating with mobile Transformers backend:", activeBackendLabel);

  let streamed = "";
  const safeStreamer =
    onToken && "tokenizer" in generatorInstance
      ? new TextStreamer(generatorInstance.tokenizer as never, {
          skip_prompt: true,
          skip_special_tokens: true,
          callback_function: (text: string) => {
            streamed += text;
            onToken(text);
          },
        })
      : undefined;

  const output = await generatorInstance(messages, {
    max_new_tokens: 512,
    do_sample: false,
    temperature: 0.2,
    return_full_text: false,
    ...(safeStreamer ? { streamer: safeStreamer } : {}),
  });

  const first = Array.isArray(output) ? output[0] : output;
  const generated = first?.generated_text;
  if (Array.isArray(generated)) {
    const lastMessage = generated[generated.length - 1];
    return typeof lastMessage?.content === "string" ? lastMessage.content : streamed;
  }
  if (typeof generated === "string") {
    return generated;
  }
  return streamed;
}

export function clearTransformersMobileEngine(): void {
  if (generatorInstance && "dispose" in generatorInstance && typeof generatorInstance.dispose === "function") {
    void generatorInstance.dispose();
  }
  generatorInstance = null;
  generatorPromise = null;
  activeBackendLabel = null;
}

export async function resetTransformersMobileCache(): Promise<void> {
  clearTransformersMobileEngine();
  clearStoredWebGpuSkipState();
  const mid = getActiveTransformersLocalModelId();
  const clearTasks = [
    ModelRegistry.clear_pipeline_cache(TRANSFORMERS_MOBILE_TASK, mid, {
      device: "webgpu",
      dtype: TRANSFORMERS_MOBILE_Q4_DTYPE,
    }),
    ModelRegistry.clear_pipeline_cache(TRANSFORMERS_MOBILE_TASK, mid, {
      device: "wasm",
      dtype: TRANSFORMERS_MOBILE_Q4_DTYPE,
    }),
  ];
  const results = await Promise.allSettled(clearTasks);
  results.forEach((result) => {
    if (result.status === "rejected") {
      console.warn("[AI] Failed to clear Transformers mobile cache:", result.reason);
    }
  });
}
