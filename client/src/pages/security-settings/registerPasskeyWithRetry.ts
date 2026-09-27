import { ApiRequestError, apiRequest } from "@/lib/queryClient";
import type { Translations } from "@/utils/translations/types";
import {
  WebAuthnOptions,
  coerceRegisterOptions,
  credentialToJson,
  describeWebAuthnEffectiveDomainError,
} from "@/utils/webauthn";

export function passkeyRegistrationErrorMessage(error: unknown, t: Translations): string {
  const domainHint = describeWebAuthnEffectiveDomainError(error);
  if (domainHint) return domainHint;
  if (error instanceof DOMException && error.name === "InvalidStateError") {
    return t.authPasskeyExistsError;
  }
  if (error instanceof DOMException && error.name === "NotAllowedError") {
    return t.authPasskeyCreationCancelled;
  }
  if (error instanceof ApiRequestError && error.bodyText) {
    try {
      const parsed = JSON.parse(error.bodyText) as { message?: string };
      if (typeof parsed.message === "string" && parsed.message.trim().length > 0) {
        return parsed.message;
      }
    } catch {
      /* use raw message */
    }
  }
  return error instanceof Error ? error.message : t.authSecToastTryAgain;
}

/**
 * Register a passkey; on stale platform authenticator state, retries once with a fresh challenge.
 */
export async function registerPasskeyWithRetry(t: Translations): Promise<void> {
  const registerWithFreshChallenge = async () => {
    const data = await apiRequest<{ challengeId: string; options: WebAuthnOptions }>(
      "/api/auth/webauthn/register/options",
      "POST",
      {},
    );

    if (!data?.options) {
      throw new Error(t.authPasskeyMissingOptions);
    }

    const publicKey = coerceRegisterOptions(data.options);
    const credential = (await navigator.credentials.create({ publicKey })) as PublicKeyCredential | null;

    if (!credential) {
      throw new Error(t.authPasskeyNoCredential);
    }

    await apiRequest("/api/auth/webauthn/register/verify", "POST", {
      challengeId: data.challengeId,
      credential: credentialToJson(credential),
    });
  };

  try {
    await registerWithFreshChallenge();
  } catch (error) {
    if (error instanceof DOMException && error.name === "InvalidStateError") {
      await registerWithFreshChallenge();
    } else {
      throw error;
    }
  }
}
