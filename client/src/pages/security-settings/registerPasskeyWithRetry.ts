import { ApiRequestError, apiRequest } from "@/lib/queryClient";
import {
  WebAuthnOptions,
  coerceRegisterOptions,
  credentialToJson,
  describeWebAuthnEffectiveDomainError,
} from "@/utils/webauthn";

export function passkeyRegistrationErrorMessage(error: unknown): string {
  const domainHint = describeWebAuthnEffectiveDomainError(error);
  if (domainHint) return domainHint;
  if (error instanceof DOMException && error.name === "InvalidStateError") {
    return "This passkey may already exist on this device. Try another authenticator or remove the old passkey and retry.";
  }
  if (error instanceof DOMException && error.name === "NotAllowedError") {
    return "Passkey creation was cancelled or timed out. Please try again.";
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
  return error instanceof Error ? error.message : "Try again.";
}

/**
 * Register a passkey; on stale platform authenticator state, retries once with a fresh challenge.
 */
export async function registerPasskeyWithRetry(): Promise<void> {
  const registerWithFreshChallenge = async () => {
    const data = await apiRequest<{ challengeId: string; options: WebAuthnOptions }>(
      "/api/auth/webauthn/register/options",
      "POST",
      {},
    );

    if (!data?.options) {
      throw new Error("Missing WebAuthn options from server.");
    }

    const publicKey = coerceRegisterOptions(data.options);
    const credential = (await navigator.credentials.create({ publicKey })) as PublicKeyCredential | null;

    if (!credential) {
      throw new Error("No credential returned.");
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
