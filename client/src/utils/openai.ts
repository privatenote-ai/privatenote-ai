import OpenAI from "openai";
import { apiRequest } from "@/lib/queryClient";

interface ApiKeyResponse {
  apiKey: string;
}

// Cache for API key to avoid multiple requests
let cachedApiKey: string | null = null;

// Using gpt-4o-mini model as requested to keep costs lower
const getOpenAIInstance = async (): Promise<OpenAI> => {
  // If we have a cached API key, use it
  if (cachedApiKey) {
    return new OpenAI({ 
      apiKey: cachedApiKey,
      dangerouslyAllowBrowser: true // Allow client-side usage
    });
  }
  
  try {
    // Fetch API key from server
    const response = await apiRequest<ApiKeyResponse>('/api/ai/config');
    
    if (!response.apiKey) {
      throw new Error("OpenAI API key not configured on server");
    }
    
    // Cache the API key for future requests
    cachedApiKey = response.apiKey;
    
    return new OpenAI({ 
      apiKey: response.apiKey,
      dangerouslyAllowBrowser: true // Allow client-side usage
    });
  } catch (error) {
    console.error("Failed to fetch OpenAI API key:", error);
    throw new Error("Failed to fetch OpenAI API key");
  }
};

export async function enhanceNoteWithAI(noteContent: string, enhancementType: 'improve' | 'summarize' | 'secure'): Promise<string> {
  try {
    // Get OpenAI instance with API key from server
    const openai = await getOpenAIInstance();
    
    let systemPrompt = "";
    let userPrompt = "";
    
    switch (enhancementType) {
      case 'improve':
        systemPrompt = "You are an expert editor. Improve the text by fixing grammar, enhancing clarity, and making it more professional while maintaining the original meaning. Return only the improved text with no additional explanations.";
        userPrompt = noteContent;
        break;
      case 'summarize':
        systemPrompt = "You are a skilled summarizer. Create a concise summary of the text while preserving all key points. Return only the summary with no additional explanations.";
        userPrompt = noteContent;
        break;
      case 'secure':
        systemPrompt = "You are a security expert. Analyze the text and remove any potentially sensitive information (like personal data, passwords, credit card numbers, etc.) while maintaining the main message. Return only the sanitized text with no additional explanations.";
        userPrompt = noteContent;
        break;
      default:
        systemPrompt = "You are an expert editor. Improve the text while maintaining its original meaning. Return only the improved text with no additional explanations.";
        userPrompt = noteContent;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using gpt-4o-mini for cost efficiency
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "text" },
      max_tokens: 1500,
    });

    return response.choices[0].message.content || noteContent;
  } catch (error) {
    console.error("Error enhancing note with AI:", error);
    if (error instanceof Error) {
      throw error;  // Rethrow the original error to preserve the message
    } else {
      throw new Error("Failed to enhance note with AI. Please check your API key or try again later.");
    }
  }
}