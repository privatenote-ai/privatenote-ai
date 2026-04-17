import {
  enhanceNoteClientSide,
  isLocalAiSupported,
  isEngineLoaded,
  initializeClientLLM,
  getModelInfo,
  getWebLLMBrowserSupportLevel,
  getLocalAiSupportHint,
  clearEngine,
  isWebLlmGpuOrDisposeFailure,
  type ProgressCallback,
  type WebLLMBrowserSupportLevel,
} from "./clientLLM";
import { localAiAnalyzingPromptLabel, localAiAnalyzingDetailHint } from "./localAiUxText";

export interface AiEnhanceResponse {
  content: string;
  source: "client";
}

export class AiEnhanceError extends Error {
  source?: "client";

  constructor(message: string, source?: "client") {
    super(message);
    this.name = "AiEnhanceError";
    this.source = source;
  }
}

/**
 * On-device AI enhancement via WebLLM (no server LLM).
 */
export async function enhanceNoteHybrid(
  noteContent: string,
  enhancementType: "improve" | "summarize" | "secure" | "ask" | "simplify",
  options: {
    preferClientSide?: boolean;
    onProgress?: ProgressCallback;
  } = {},
): Promise<AiEnhanceResponse> {
  const { preferClientSide = true, onProgress } = options;

  if (!preferClientSide || !isLocalAiSupported()) {
    throw new AiEnhanceError(
      getLocalAiSupportHint() ?? "On-device AI is not supported in this browser.",
      "client",
    );
  }

  try {
    if (!isEngineLoaded()) {
      if (onProgress) {
        onProgress({
          progress: 0,
          text: "Preparing private AI…",
        });
      }
      await initializeClientLLM(onProgress);
    }

    if (onProgress) {
      onProgress({
        progress: 12,
        text: localAiAnalyzingPromptLabel(),
        detail: localAiAnalyzingDetailHint(),
      });
    }

    const content = await enhanceNoteClientSide(noteContent, enhancementType, onProgress);

    return {
      content,
      source: "client",
    };
  } catch (error) {
    if (isWebLlmGpuOrDisposeFailure(error)) {
      clearEngine();
    }
    console.error("[AI] Client-side enhancement failed:", error);
    const message = isWebLlmGpuOrDisposeFailure(error)
      ? "On-device GPU reset or ran out of memory (WebGPU device lost). Try a smaller model—for example SmolLM2 360M—then initialize private AI again, and close other Safari tabs if it keeps happening."
      : error instanceof Error
        ? error.message
        : "Failed to enhance note with on-device AI.";
    throw new AiEnhanceError(message, "client");
  }
}

export interface AiCapabilitiesSnapshot {
  clientSideSupported: boolean;
  clientSideLoaded: boolean;
  modelInfo: ReturnType<typeof getModelInfo> | null;
  webLlmSupportLevel: WebLLMBrowserSupportLevel;
  /** Non-null when on-device AI is not fully available at the sync check; see also init-time adapter errors. */
  webLlmSupportHint: string | null;
}

/**
 * Get AI enhancement capabilities
 */
export function getAiCapabilities(): AiCapabilitiesSnapshot {
  return {
    clientSideSupported: isLocalAiSupported(),
    clientSideLoaded: isEngineLoaded(),
    modelInfo: isLocalAiSupported() ? getModelInfo() : null,
    webLlmSupportLevel: getWebLLMBrowserSupportLevel(),
    webLlmSupportHint: getLocalAiSupportHint(),
  };
}
