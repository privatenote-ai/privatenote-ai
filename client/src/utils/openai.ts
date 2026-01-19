import { apiRequest } from "@/lib/queryClient";

interface AiEnhanceResponse {
  content: string;
  remainingUses?: number;
}

export async function enhanceNoteWithAI(
  noteContent: string,
  enhancementType: 'improve' | 'summarize' | 'secure',
  turnstileToken?: string | null,
): Promise<AiEnhanceResponse> {
  try {
    const response = await apiRequest<AiEnhanceResponse>("/api/ai/enhance", "POST", {
      content: noteContent,
      enhancementType,
      turnstileToken: turnstileToken || undefined,
    });

    return {
      content: response.content || noteContent,
      remainingUses: response.remainingUses,
    };
  } catch (error) {
    console.error("Error enhancing note with AI:", error);
    if (error instanceof Error) {
      throw error;  // Rethrow the original error to preserve the message
    }
    throw new Error("Failed to enhance note with AI. Please try again later.");
  }
}
