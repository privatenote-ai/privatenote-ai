export type WebAuthnOptions = {
  challenge: string | ArrayBuffer | Uint8Array;
  rp?: { name: string; id?: string };
  user?: { id: string | ArrayBuffer | Uint8Array; name: string; displayName: string };
  pubKeyCredParams?: Array<{ type: string; alg: number }>;
  timeout?: number;
  attestation?: string;
  authenticatorSelection?: {
    userVerification?: string;
    residentKey?: string;
  };
  allowCredentials?: Array<{ id: string; type: string; transports?: string[] }>;
  excludeCredentials?: Array<{ id: string; type: string; transports?: string[] }>;
  userVerification?: string;
  rpId?: string;
};

const bufferToBase64Url = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

const base64UrlToBuffer = (value: string): ArrayBuffer => {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((value.length + 3) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};

const coerceToBuffer = (value: unknown, label: string): ArrayBuffer => {
  if (typeof value === "string" && value.length > 0) {
    return base64UrlToBuffer(value);
  }
  if (value instanceof ArrayBuffer) {
    return value;
  }
  if (ArrayBuffer.isView(value)) {
    return value.buffer;
  }
  if (Array.isArray(value) && value.every((item) => typeof item === "number")) {
    return new Uint8Array(value).buffer;
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length) {
      const numericEntries = entries
        .map(([key, val]) => [Number(key), val] as const)
        .filter(([key, val]) => Number.isInteger(key) && typeof val === "number");
      if (numericEntries.length === entries.length) {
        const maxIndex = numericEntries.reduce((max, [key]) => Math.max(max, key), -1);
        const bytes = new Uint8Array(maxIndex + 1);
        for (const [key, val] of numericEntries) {
          bytes[key] = val as number;
        }
        return bytes.buffer;
      }
    }
  }
  throw new Error(`Invalid WebAuthn ${label} from server.`);
};

export const credentialToJson = (credential: PublicKeyCredential): Record<string, any> => {
  const response = credential.response as AuthenticatorAttestationResponse | AuthenticatorAssertionResponse;
  const clientDataJSON = bufferToBase64Url(response.clientDataJSON);
  const transports =
    "getTransports" in response && typeof (response as AuthenticatorAttestationResponse).getTransports === "function"
      ? (response as AuthenticatorAttestationResponse).getTransports()
      : undefined;

  if ("attestationObject" in response) {
    return {
      id: credential.id,
      rawId: bufferToBase64Url(credential.rawId),
      type: credential.type,
      transports,
      response: {
        clientDataJSON,
        attestationObject: bufferToBase64Url(response.attestationObject),
        transports,
      },
    };
  }

  return {
    id: credential.id,
    rawId: bufferToBase64Url(credential.rawId),
    type: credential.type,
    response: {
      clientDataJSON,
      authenticatorData: bufferToBase64Url((response as AuthenticatorAssertionResponse).authenticatorData),
      signature: bufferToBase64Url((response as AuthenticatorAssertionResponse).signature),
      userHandle: (response as AuthenticatorAssertionResponse).userHandle
        ? bufferToBase64Url((response as AuthenticatorAssertionResponse).userHandle as ArrayBuffer)
        : null,
    },
  };
};

export const coerceRegisterOptions = (options: WebAuthnOptions): PublicKeyCredentialCreationOptions => {
  const rp =
    options.rp && typeof options.rp === "object"
      ? {
          name: options.rp.name || "PrivateNote.ai",
          id: options.rp.id || options.rpId,
        }
      : {
          name: "PrivateNote.ai",
          id: options.rpId,
        };

  return {
    ...options,
    challenge: coerceToBuffer(options.challenge, "challenge"),
    rp,
    user: options.user
      ? {
          ...options.user,
          id: coerceToBuffer(options.user.id, "user.id"),
        }
      : undefined,
    excludeCredentials: options.excludeCredentials?.map((cred) => ({
      ...cred,
      id: coerceToBuffer(cred.id, "excludeCredentials.id"),
    })),
    pubKeyCredParams: options.pubKeyCredParams || [
      { type: "public-key", alg: -7 },
      { type: "public-key", alg: -257 },
    ],
  } as PublicKeyCredentialCreationOptions;
};

export const coerceLoginOptions = (options: WebAuthnOptions): PublicKeyCredentialRequestOptions => {
  return {
    ...options,
    challenge: coerceToBuffer(options.challenge, "challenge"),
    allowCredentials: options.allowCredentials?.map((cred) => ({
      ...cred,
      id: coerceToBuffer(cred.id, "allowCredentials.id"),
    })),
  } as PublicKeyCredentialRequestOptions;
};

/**
 * Chromium (and some other engines) reject passkeys when the document host is a bare IP
 * (127.0.0.1, ::1, LAN IPs): "The effective domain of the document is not a valid domain."
 * Use https://localhost:&lt;port&gt; in dev instead.
 */
export function describeWebAuthnEffectiveDomainError(error: unknown): string | null {
  if (!(error instanceof DOMException) && !(error instanceof Error)) return null;
  const msg = String(error.message || "");
  if (!/effective domain/i.test(msg) && !/not a valid domain/i.test(msg)) return null;
  if (typeof window === "undefined") {
    return "This browser does not support passkeys when the site URL uses a bare IP address. Use https://localhost with the same port instead.";
  }
  const { hostname, port, protocol } = window.location;
  const portSuffix = port ? `:${port}` : "";
  const suggested = `https://localhost${portSuffix}`;
  return `Passkeys need a domain-style host in this browser. Open ${suggested} instead of ${protocol}//${hostname}${portSuffix}.`;
}
