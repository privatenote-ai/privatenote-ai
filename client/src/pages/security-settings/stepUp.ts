import { apiRequest } from "@/lib/queryClient";
import {
  WebAuthnOptions,
  coerceLoginOptions,
  credentialToJson,
  describeWebAuthnEffectiveDomainError,
} from "@/utils/webauthn";
import { isForbiddenApiError } from "./forbidden";

export type StepUpFailure =
  | { ok: false; reason: "not_supported" }
  | { ok: false; reason: "no_credential" }
  | { ok: false; reason: "no_passkey" }
  | { ok: false; reason: "timeout" }
  | { ok: false; reason: "cancelled" }
  | { ok: false; reason: "unknown"; message: string };

export type StepUpResult = { ok: true } | StepUpFailure;

/** WebAuthn step-up verify. No UI — callers own toasts and copy. */
export async function executeStepUp(): Promise<StepUpResult> {
  if (typeof window === "undefined" || !("PublicKeyCredential" in window)) {
    return { ok: false, reason: "not_supported" };
  }

  try {
    const data = await apiRequest<{ challengeId: string; options: WebAuthnOptions }>(
      "/api/auth/webauthn/stepup/options",
      "POST",
    );
    const publicKey = coerceLoginOptions(data.options);

    const abortController = new AbortController();
    const timeout = setTimeout(() => abortController.abort(), 60_000);
    let credential: PublicKeyCredential | null;
    try {
      credential = (await navigator.credentials.get({
        publicKey,
        signal: abortController.signal,
      })) as PublicKeyCredential | null;
    } finally {
      clearTimeout(timeout);
    }

    if (!credential) {
      return { ok: false, reason: "no_credential" };
    }

    await apiRequest("/api/auth/webauthn/stepup/verify", "POST", {
      challengeId: data.challengeId,
      credential: credentialToJson(credential),
    });
    return { ok: true };
  } catch (error) {
    const domainHint = describeWebAuthnEffectiveDomainError(error);
    if (domainHint) {
      return { ok: false, reason: "unknown", message: domainHint };
    }
    const msg = error instanceof Error ? error.message : "";
    if (msg.includes("AbortError") || (error instanceof DOMException && error.name === "AbortError")) {
      return { ok: false, reason: "timeout" };
    }
    if (error instanceof DOMException && error.name === "NotAllowedError") {
      return { ok: false, reason: "cancelled" };
    }
    if (msg.startsWith("400")) {
      return { ok: false, reason: "no_passkey" };
    }
    return { ok: false, reason: "unknown", message: msg || "Please try again." };
  }
}

/**
 * Run `action`; on 403, run `stepUp` once and retry `action`.
 * Re-throws the original error if step-up fails or action is not 403.
 */
export async function withOptionalStepUp<T>(
  action: () => Promise<T>,
  stepUp: () => Promise<boolean>,
): Promise<T> {
  try {
    return await action();
  } catch (error) {
    if (!isForbiddenApiError(error)) throw error;
    const stepped = await stepUp();
    if (!stepped) throw error;
    return await action();
  }
}
