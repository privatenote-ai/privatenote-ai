import { apiRequest } from "@/lib/queryClient";

interface AiEnhanceResponse {
  content: string;
  remainingUses?: number;
}

export class AiEnhanceError extends Error {
  remainingUses?: number;

  constructor(message: string, remainingUses?: number) {
    super(message);
    this.name = 'AiEnhanceError';
    this.remainingUses = remainingUses;
  }
}

export async function enhanceNoteWithAI(
  noteContent: string,
  enhancementType: 'improve' | 'summarize' | 'secure' | 'ask',
  turnstileToken?: string | null,
): Promise<AiEnhanceResponse> {
  try {
    const response = await apiRequest<AiEnhanceResponse>("/api/ai/enhance", "POST", {
      content: noteContent,
      enhancementType,
      turnstileToken: turnstileToken || undefined,
    });

    return {
      content: response.content ?? noteContent,
      remainingUses: response.remainingUses,
    };
  } catch (error) {
    console.error("Error enhancing note with AI:", error);

    // Extract remainingUses from error response if available
    let remainingUses: number | undefined;
    if (error instanceof Error) {
      // Error message format from apiRequest: "STATUS: JSON_BODY"
      const colonIndex = error.message.indexOf(':');
      if (colonIndex > 0) {
        const jsonPart = error.message.slice(colonIndex + 1).trim();
        if (jsonPart.startsWith('{')) {
          try {
            const errorData = JSON.parse(jsonPart);
            if (typeof errorData.remainingUses === 'number') {
              remainingUses = errorData.remainingUses;
            }
          } catch {
            // Not valid JSON, ignore
          }
        }
      }

      throw new AiEnhanceError(error.message, remainingUses);
    }

    throw new AiEnhanceError("Failed to enhance note with AI. Please try again later.");
  }
}
