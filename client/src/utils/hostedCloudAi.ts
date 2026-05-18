import { apiRequest, ApiRequestError } from "@/lib/queryClient";
import type { AiSentenceLengthId } from "@/components/note/promptTemplates";
import type { SupportedLanguage } from "@/utils/translation";

export type HostedCloudAiDraftParams = {
  prompt: string;
  enhancementType: "improve" | "summarize" | "secure" | "ask";
  language: SupportedLanguage;
  sentenceLength: AiSentenceLengthId;
};

export type HostedCloudAiDraftResponse = {
  ok: true;
  text: string;
  model: string;
  limit: number;
  remaining: number;
  resetAt: number;
};

export type HostedCloudAiErrorCode =
  | "hosted_ai_quota_exhausted"
  | "hosted_ai_unavailable"
  | "hosted_ai_generation_failed"
  | "hosted_ai_not_enabled"
  | "hosted_ai_consent_required"
  | "prompt_required"
  | "prompt_too_long"
  | "unknown";

export async function generateHostedCloudDraft(
  params: HostedCloudAiDraftParams,
): Promise<HostedCloudAiDraftResponse> {
  return apiRequest<HostedCloudAiDraftResponse>("/api/ai/cloud-draft", "POST", {
    ...params,
    consentToHostedAi: true,
    acknowledgeNonPrivateAi: true,
  });
}

export function parseHostedCloudAiError(error: unknown): {
  status: number | null;
  code: HostedCloudAiErrorCode;
  message: string | null;
  resetAt?: number;
} {
  if (!(error instanceof ApiRequestError)) {
    return { status: null, code: "unknown", message: null };
  }

  try {
    const body = JSON.parse(error.bodyText) as {
      error?: HostedCloudAiErrorCode;
      message?: string;
      resetAt?: number;
    };
    return {
      status: error.status,
      code: body.error ?? "unknown",
      message: body.message ?? null,
      resetAt: typeof body.resetAt === "number" ? body.resetAt : undefined,
    };
  } catch {
    return { status: error.status, code: "unknown", message: null };
  }
}
