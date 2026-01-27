import { CreateMLCEngine, type MLCEngineInterface, prebuiltAppConfig, type AppConfig } from "@mlc-ai/web-llm";

// Preferred models for device-based selection (smaller models for mobile)
const PREFERRED_MODELS = [
  "llinguini/gemma-3-270m-it-q4f16_1-MLC",  // Smallest - mobile/old browsers
  "mlc-ai/gemma-3-1b-it-q4f32_1-MLC",       // Small - mobile/new browsers
  "Llama-3.2-1B-Instruct-q4f16_1-MLC",      // Small - good quality
  "Llama-3.2-3B-Instruct-q4f16_1-MLC",      // Medium - desktop
  "Llama-3.1-8B-Instruct-q4f16_1-MLC",      // Large - desktop only
];

const DEFAULT_MODEL = "llinguini/gemma-3-270m-it-q4f16_1-MLC"; // Default to smallest model (safest)
const DEFAULT_MODEL_SIZE_MB = 200; // Approximate size for small models

/**
 * Get the base URL for self-hosted models
 * Uses environment variable or constructs from current origin
 */
function getModelBaseUrl(): string {
  // Check for environment variable first (for custom domains)
  if (import.meta.env.VITE_MODEL_BASE_URL) {
    return import.meta.env.VITE_MODEL_BASE_URL.replace(/\/$/, '');
  }
  
  // Use Worker URL for self-hosted models (if frontend is on different domain)
  // This ensures models are served from the Worker even if frontend is on Pages
  const WORKER_URL = 'https://privatenote-api.marjan-skrobot.workers.dev';
  if (typeof window !== 'undefined') {
    // If frontend is on same domain as Worker, use relative path
    if (window.location.origin === new URL(WORKER_URL).origin) {
      return `${window.location.origin}/models`;
    }
    // Otherwise, use Worker URL
    return `${WORKER_URL}/models`;
  }
  
  // Default fallback (shouldn't happen in browser)
  return '/models';
}

/**
 * Create AppConfig with all WebLLM models + self-hosted Gemma models
 * Uses WebLLM's prebuiltAppConfig for all models, but overrides Gemma models to use self-hosted R2
 */
function createCustomAppConfig(): AppConfig {
  const modelBaseUrl = getModelBaseUrl();
  
  // Start with WebLLM's prebuilt config (all supported models)
  const modelList = [...prebuiltAppConfig.model_list];
  
  // Override Gemma models to use self-hosted R2 if available
  const gemma1BModelId = "mlc-ai/gemma-3-1b-it-q4f32_1-MLC";
  const gemma270MModelId = "llinguini/gemma-3-270m-it-q4f16_1-MLC";
  
  // Find and update Gemma 1B model to use self-hosted version
  const gemma1BIndex = modelList.findIndex(m => m.model_id === gemma1BModelId);
  if (gemma1BIndex >= 0) {
    const prebuilt1B = modelList[gemma1BIndex];
    modelList[gemma1BIndex] = {
      ...prebuilt1B,
      model: `${modelBaseUrl}/gemma-3-1b-it-mlc/`, // Use self-hosted R2
      // Keep model_lib from prebuilt config (WASM runtime)
    };
    console.log("[AI] Using self-hosted Gemma 1B from R2");
  }
  
  // Find and update Gemma 270M model to use self-hosted version
  const gemma270MIndex = modelList.findIndex(m => m.model_id === gemma270MModelId);
  if (gemma270MIndex >= 0) {
    const prebuilt270M = modelList[gemma270MIndex];
    modelList[gemma270MIndex] = {
      ...prebuilt270M,
      model: `${modelBaseUrl}/gemma-3-270m-it-mlc/`, // Use self-hosted R2
      // Keep model_lib from prebuilt config (WASM runtime)
    };
    console.log("[AI] Using self-hosted Gemma 270M from R2");
  }
  
  console.log("[AI] AppConfig created with", modelList.length, "models (all WebLLM models available)");
  console.log("[AI] Gemma models use self-hosted R2, others use HuggingFace");
  
  return {
    model_list: modelList,
  };
}

/**
 * Get list of available model IDs from WebLLM's prebuilt config (all supported models)
 */
export function getAvailableModels(): string[] {
  // Return all models from WebLLM's prebuilt config
  return prebuiltAppConfig.model_list.map(m => m.model_id);
}

/**
 * Check if a model ID is available in WebLLM's prebuilt config
 */
function isModelAvailable(modelId: string): boolean {
  return prebuiltAppConfig.model_list.some(m => m.model_id === modelId);
}

/**
 * Find the best matching model ID from available models
 * Tries exact match first, then fuzzy matching
 */
function findBestMatchingModel(preferredModelId: string): string | null {
  const available = getAvailableModels();
  
  // Try exact match first
  if (available.includes(preferredModelId)) {
    return preferredModelId;
  }
  
  // Try case-insensitive match
  const lowerPreferred = preferredModelId.toLowerCase();
  const exactMatch = available.find(id => id.toLowerCase() === lowerPreferred);
  if (exactMatch) {
    return exactMatch;
  }
  
  // Try partial matching (e.g., "gemma-3-270m" matches "linguini/gemma-3-270m-it-q4f16_1-MLC")
  const preferredParts = lowerPreferred.split(/[-_\/]/).filter(p => p.length > 2);
  const partialMatch = available.find(id => {
    const idLower = id.toLowerCase();
    return preferredParts.every(part => idLower.includes(part));
  });
  if (partialMatch) {
    return partialMatch;
  }
  
  return null;
}

/**
 * Get list of preferred models
 */
export function getPreferredModels(): string[] {
  return [...PREFERRED_MODELS];
}

/**
 * Get the recommended model for the current device
 * This is the model that will be auto-selected based on device capabilities
 */
export function getRecommendedModelForDevice(): string {
  return selectModelByDevice();
}

/**
 * Get device detection information (for debugging)
 */
export function getDeviceInfo(): {
  isMobile: boolean;
  hasWebGPU: boolean;
  isNeweriPhone: boolean;
  isNewerAndroid: boolean;
  recommendedModel: string;
} {
  return {
    isMobile: isMobileDevice(),
    hasWebGPU: hasWebGPUSupport(),
    isNeweriPhone: isNeweriPhone(),
    isNewerAndroid: isNewerAndroidPhone(),
    recommendedModel: selectModelByDevice(),
  };
}

/**
 * Find a suitable model from available models
 * Selects based on device capabilities, prefers smaller models for mobile
 */
function findSuitableModel(): string {
  // Select model based on device capabilities
  const deviceSelectedModel = selectModelByDevice();
  
  // Verify the selected model is available
  if (isModelAvailable(deviceSelectedModel)) {
    console.log("[AI] Device-selected model:", deviceSelectedModel);
    return deviceSelectedModel;
  }
  
  // Fallback: use default model
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

interface ModelLoadProgress {
  progress: number;
  text: string;
}

type ProgressCallback = (progress: ModelLoadProgress) => void;

// Singleton engine instance
let engineInstance: MLCEngineInterface | null = null;
let engineLoadingPromise: Promise<MLCEngineInterface> | null = null;
let loadProgressCallback: ProgressCallback | null = null;

/**
 * Check if WebLLM is supported in this browser
 */
export function isWebLLMSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "crypto" in window &&
    "indexedDB" in window &&
    (typeof WebAssembly !== "undefined" || typeof WebGPU !== "undefined")
  );
}

/**
 * Detect if device is mobile
 */
function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  
  // Check user agent for mobile devices
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
  return mobileRegex.test(userAgent);
}

/**
 * Detect if device is a newer iPhone (iPhone 12 or later, iOS 16.4+)
 */
function isNeweriPhone(): boolean {
  if (typeof window === "undefined") return false;
  
  const userAgent = navigator.userAgent;
  if (!/iphone|ipad|ipod/i.test(userAgent)) return false;
  
  // Check for iOS version (iOS 16.4+ has WebGPU support)
  const iosMatch = userAgent.match(/OS (\d+)[._](\d+)/);
  if (iosMatch) {
    const major = parseInt(iosMatch[1], 10);
    const minor = parseInt(iosMatch[2], 10);
    // iOS 16.4+ or iOS 17+
    if (major > 16 || (major === 16 && minor >= 4)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Detect if device is a newer Samsung or Google phone
 */
function isNewerAndroidPhone(): boolean {
  if (typeof window === "undefined") return false;
  
  const userAgent = navigator.userAgent;
  if (!/android/i.test(userAgent)) return false;
  
  // Check for Samsung or Google Pixel devices
  const isSamsung = /samsung/i.test(userAgent);
  const isGoogle = /pixel|google/i.test(userAgent);
  
  if (!isSamsung && !isGoogle) return false;
  
  // Check Android version (Android 12+ generally has better WebGPU support)
  const androidMatch = userAgent.match(/Android (\d+)/);
  if (androidMatch) {
    const version = parseInt(androidMatch[1], 10);
    // Android 12+ (API level 31+)
    if (version >= 12) {
      return true;
    }
  }
  
  return false;
}

/**
 * Check if browser has WebGPU support (indicator of modern browser)
 */
function hasWebGPUSupport(): boolean {
  if (typeof window === "undefined") return false;
  return typeof WebGPU !== "undefined" && WebGPU !== null;
}

/**
 * Determine which model to use based on device capabilities
 * Returns a larger model for desktop and newer mobile devices,
 * and a smaller model for mobile and older browsers
 */
function selectModelByDevice(): string {
  // Desktop devices can use larger models
  if (!isMobileDevice()) {
    // Try to use a medium-sized model for desktop (3B or 1B)
    const desktopModels = ["Llama-3.2-3B-Instruct-q4f16_1-MLC", "Llama-3.2-1B-Instruct-q4f16_1-MLC", "mlc-ai/gemma-3-1b-it-q4f32_1-MLC"];
    for (const model of desktopModels) {
      if (isModelAvailable(model)) {
        console.log("[AI] Desktop device detected, using:", model);
        return model;
      }
    }
  }
  
  // Check for newer mobile devices with good capabilities
  const hasWebGPU = hasWebGPUSupport();
  const isNeweriPhoneDevice = isNeweriPhone();
  const isNewerAndroidDevice = isNewerAndroidPhone();
  
  // Use medium model for newer mobile devices
  if (hasWebGPU && (isNeweriPhoneDevice || isNewerAndroidDevice)) {
    const mobileModels = ["mlc-ai/gemma-3-1b-it-q4f32_1-MLC", "Llama-3.2-1B-Instruct-q4f16_1-MLC"];
    for (const model of mobileModels) {
      if (isModelAvailable(model)) {
        console.log("[AI] Newer mobile device with WebGPU detected, using:", model);
        return model;
      }
    }
  }
  
  // Default to smallest model for mobile/older browsers
  const smallModels = ["llinguini/gemma-3-270m-it-q4f16_1-MLC", "Llama-3.2-1B-Instruct-q4f16_1-MLC"];
  for (const model of smallModels) {
    if (isModelAvailable(model)) {
      console.log("[AI] Mobile/older browser detected, using:", model);
      return model;
    }
  }
  
  // Ultimate fallback
  return DEFAULT_MODEL;
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
  // Return existing engine if already loaded (unless model changed)
  if (engineInstance && !preferredModelId) {
    return engineInstance;
  }

  // Return existing loading promise if already loading (unless model changed)
  if (engineLoadingPromise && !preferredModelId) {
    if (onProgress) {
      loadProgressCallback = onProgress;
    }
    return engineLoadingPromise;
  }

  // Check browser support
  if (!isWebLLMSupported()) {
    throw new Error(
      "WebLLM is not supported in this browser. Please use a modern browser with WebGPU or WebAssembly support."
    );
  }

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
    if (savedModel && isModelAvailable(savedModel)) {
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

  // Check storage space (use model-specific size estimate)
  const availableSpace = await checkStorageQuota();
  const getModelSize = (model: string): number => {
    // Estimate model sizes based on name patterns
    if (model.includes('270m') || model.includes('270M') || model.includes('0.5B') || model.includes('0.5b')) return 200;
    if (model.includes('1B') || model.includes('1b') || model.includes('1.5B') || model.includes('1.5b')) return 600;
    if (model.includes('2B') || model.includes('2b') || model.includes('3B') || model.includes('3b')) return 1200;
    if (model.includes('7B') || model.includes('7b') || model.includes('8B') || model.includes('8b')) return 4000;
    return DEFAULT_MODEL_SIZE_MB;
  };
  const requiredSpace = getModelSize(modelId) * 1.5; // Model + overhead
  if (availableSpace < requiredSpace) {
    throw new Error(
      `Insufficient storage space. Need at least ${Math.ceil(
        requiredSpace
      )}MB free space for model download.`
    );
  }

  // Set progress callback
  if (onProgress) {
    loadProgressCallback = onProgress;
  }

  // Create loading promise
  engineLoadingPromise = (async () => {
    try {
      console.log("[AI] Loading model:", modelId);
      
      // Create custom AppConfig with only our two allowed models
      const customAppConfig = createCustomAppConfig();
      
      // Always use our custom AppConfig (only contains our two models)
      const engine = await CreateMLCEngine(modelId, {
        appConfig: customAppConfig,
        initProgressCallback: (report: { progress: number; timeElapsed: number; text: string }) => {
          if (loadProgressCallback) {
            // WebLLM progress is 0-1, convert to 0-100 for display
            const progressPercent = Math.round(report.progress * 100);
            
            loadProgressCallback({
              progress: progressPercent,
              text: report.text || `Loading model: ${progressPercent}%`,
            });
          }
        },
      });

      engineInstance = engine;
      engineLoadingPromise = null;
      loadProgressCallback = null;

      return engine;
    } catch (error: any) {
      engineLoadingPromise = null;
      loadProgressCallback = null;
      
      // Provide helpful error message
      const errorMessage = error?.message || String(error);
      
      // Suggest alternative models
      const available = getAvailableModels();
      const alternativeModels = available
        .filter(m => m !== modelId)
        .slice(0, 3)
        .join(", ");
      
      if (errorMessage.includes('model') || errorMessage.includes('appConfig')) {
        let errorMsg = `Failed to load model "${modelId}". `;
        if (alternativeModels) {
          errorMsg += `Try one of these instead: ${alternativeModels}. `;
        }
        errorMsg += `Original error: ${errorMessage}`;
        throw new Error(errorMsg);
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
  if (!engineInstance) {
    throw new Error(
      "Engine not initialized. Call initializeClientLLM() first."
    );
  }
  return engineInstance;
}

/**
 * Check if engine is loaded
 */
export function isEngineLoaded(): boolean {
  return engineInstance !== null;
}

/**
 * Clear the engine instance (useful for testing or memory management)
 */
export function clearEngine(): void {
  if (engineInstance) {
    // Note: WebLLM doesn't expose a cleanup method, but we can clear our reference
    engineInstance = null;
    engineLoadingPromise = null;
    loadProgressCallback = null;
  }
}

/**
 * Generate prompt for enhancement type
 */
function getEnhancementPrompt(
  content: string,
  type: "improve" | "summarize" | "secure" | "ask"
): string {
  const prompts = {
    improve: `Improve this text for clarity and style while preserving meaning:\n\n${content}`,
    summarize: `Summarize this text into key points:\n\n${content}`,
    secure: `Remove all personally identifiable information (names, emails, phone numbers, addresses, credit card numbers) from this text while maintaining readability:\n\n${content}`,
    ask: content, // For "ask", the content IS the prompt/question
  };
  return prompts[type];
}

/**
 * Enhance note content using client-side LLM
 */
export async function enhanceNoteClientSide(
  content: string,
  type: "improve" | "summarize" | "secure" | "ask",
  onProgress?: ProgressCallback
): Promise<string> {
  // Initialize engine if needed
  const engine = await initializeClientLLM(onProgress);

  // Generate prompt
  const prompt = getEnhancementPrompt(content, type);

  // Set temperature based on task
  const temperature = type === "secure" ? 0.1 : type === "ask" ? 0.8 : 0.7;

  // Set max tokens based on task
  let maxTokens: number;
  if (type === "summarize") {
    maxTokens = 200;
  } else if (type === "ask") {
    maxTokens = 1000; // Allow longer responses for Q&A
  } else {
    maxTokens = Math.min(content.length + 100, 800);
  }

  // Generate response
  const response = await engine.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a helpful writing assistant. Provide only the final answer. Do not output chain-of-thought or internal reasoning. If you must think, do so silently.",
      },
      { role: "user", content: prompt },
    ],
    max_tokens: maxTokens,
    temperature,
  });

  const result = response.choices[0]?.message?.content?.trim();

  if (!result) {
    throw new Error("Empty response from AI model");
  }

  return result;
}

/**
 * Check if model is cached in IndexedDB
 */
export async function isModelCached(): Promise<boolean> {
  try {
    const databases = await indexedDB.databases();
    return databases.some(db => db.name && db.name.includes('webllm'));
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
    return databases
      .filter(db => db.name && (db.name.includes('webllm') || db.name.includes('mlc')))
      .map(db => db.name!);
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
 * Get model information
 */
export function getModelInfo() {
  // Get the actual model being used
  const available = getAvailableModels();
  const modelId = findSuitableModel();
  
  // Estimate size based on model (actual download sizes for quantized weights)
  const getModelSize = (model: string): number => {
    // Estimate model sizes based on name patterns
    if (model.includes('270m') || model.includes('270M') || model.includes('0.5B') || model.includes('0.5b')) return 200;
    if (model.includes('1B') || model.includes('1b') || model.includes('1.5B') || model.includes('1.5b')) return 600;
    if (model.includes('2B') || model.includes('2b') || model.includes('3B') || model.includes('3b')) return 1200;
    if (model.includes('7B') || model.includes('7b') || model.includes('8B') || model.includes('8b')) return 4000;
    return DEFAULT_MODEL_SIZE_MB;
  };
  
  return {
    name: modelId,
    sizeMB: getModelSize(modelId),
    cacheKey: MODEL_CACHE_KEY,
    availableModels: available.length,
    preferredModels: PREFERRED_MODELS,
  };
}
