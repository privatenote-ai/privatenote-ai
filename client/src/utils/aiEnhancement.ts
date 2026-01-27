import { enhanceNoteWithAI, AiEnhanceError as ServerAiEnhanceError } from "./openai";
import {
  enhanceNoteClientSide,
  isWebLLMSupported,
  isEngineLoaded,
  initializeClientLLM,
  getModelInfo,
  type ProgressCallback,
} from "./clientLLM";

export interface AiEnhanceResponse {
  content: string;
  remainingUses?: number;
  source: "client" | "server";
}

export class AiEnhanceError extends Error {
  remainingUses?: number;
  source?: "client" | "server";

  constructor(message: string, remainingUses?: number, source?: "client" | "server") {
    super(message);
    this.name = "AiEnhanceError";
    this.remainingUses = remainingUses;
    this.source = source;
  }
}

/**
 * Hybrid AI enhancement: tries client-side first, falls back to server
 */
export async function enhanceNoteHybrid(
  noteContent: string,
  enhancementType: "improve" | "summarize" | "secure" | "ask",
  options: {
    preferClientSide?: boolean;
    onProgress?: ProgressCallback;
    turnstileToken?: string | null;
  } = {}
): Promise<AiEnhanceResponse> {
  const { preferClientSide = true, onProgress, turnstileToken } = options;

  // Try client-side first if preferred and supported
  if (preferClientSide && isWebLLMSupported()) {
    try {
      // Check if engine is already loaded
      if (!isEngineLoaded()) {
        // Show loading progress
        if (onProgress) {
          onProgress({
            progress: 0,
            text: "Loading AI model...",
          });
        }
        await initializeClientLLM(onProgress);
      }

      // Process with client-side LLM
      if (onProgress) {
        onProgress({
          progress: 100,
          text: "Processing with local AI...",
        });
      }

      const content = await enhanceNoteClientSide(
        noteContent,
        enhancementType,
        onProgress
      );

      return {
        content,
        source: "client",
      };
    } catch (error) {
      console.warn(
        "[AI] Client-side LLM failed, falling back to server:",
        error
      );

      // Fall through to server-side
    }
  }

  // Fallback to server-side
  try {
    if (onProgress) {
      onProgress({
        progress: 50,
        text: "Using server AI...",
      });
    }

    const response = await enhanceNoteWithAI(
      noteContent,
      enhancementType,
      turnstileToken
    );

    return {
      content: response.content,
      remainingUses: response.remainingUses,
      source: "server",
    };
  } catch (error) {
    console.error("[AI] Server-side enhancement failed:", error);

    if (error instanceof ServerAiEnhanceError) {
      throw new AiEnhanceError(
        error.message,
        error.remainingUses,
        "server"
      );
    }

    throw new AiEnhanceError(
      "Failed to enhance note. Please try again later.",
      undefined,
      "server"
    );
  }
}

/**
 * Get AI enhancement capabilities
 */
export function getAiCapabilities() {
  return {
    clientSideSupported: isWebLLMSupported(),
    clientSideLoaded: isEngineLoaded(),
    modelInfo: isWebLLMSupported() ? getModelInfo() : null,
  };
}
