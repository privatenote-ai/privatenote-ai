import React, { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

type WebAuthnOptions = {
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
  throw new Error(`Invalid WebAuthn ${label} from server.`);
};

const credentialToJson = (credential: PublicKeyCredential): Record<string, any> => {
  const response = credential.response as AuthenticatorAttestationResponse | AuthenticatorAssertionResponse;
  const clientDataJSON = bufferToBase64Url(response.clientDataJSON);

  if ("attestationObject" in response) {
    return {
      id: credential.id,
      rawId: bufferToBase64Url(credential.rawId),
      type: credential.type,
      response: {
        clientDataJSON,
        attestationObject: bufferToBase64Url(response.attestationObject),
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

const coerceRegisterOptions = (options: WebAuthnOptions): PublicKeyCredentialCreationOptions => {
  return {
    ...options,
    challenge: coerceToBuffer(options.challenge, "challenge"),
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

const coerceLoginOptions = (options: WebAuthnOptions): PublicKeyCredentialRequestOptions => {
  return {
    ...options,
    challenge: coerceToBuffer(options.challenge, "challenge"),
    allowCredentials: options.allowCredentials?.map((cred) => ({
      ...cred,
      id: coerceToBuffer(cred.id, "allowCredentials.id"),
    })),
  } as PublicKeyCredentialRequestOptions;
};

export default function Auth() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [debugMagicLink, setDebugMagicLink] = useState<string | null>(null);

  const passkeySupported = useMemo(() => {
    return typeof window !== "undefined" && "PublicKeyCredential" in window;
  }, []);

  const handleRegisterPasskey = async () => {
    if (!passkeySupported) {
      toast({ title: "Passkeys not supported", description: "This browser does not support passkeys." });
      return;
    }
    setIsBusy(true);
    try {
      const data = await apiRequest<{ challengeId: string; options: WebAuthnOptions }>(
        "/api/auth/webauthn/register/options",
        "POST",
        { email }
      );
      if (!data?.options) {
        throw new Error("Missing WebAuthn options from server.");
      }
      const publicKey = coerceRegisterOptions(data.options);
      const credential = (await navigator.credentials.create({ publicKey })) as PublicKeyCredential | null;
      if (!credential) {
        toast({ title: "Registration cancelled", description: "No credential returned." });
        return;
      }
      await apiRequest("/api/auth/webauthn/register/verify", "POST", {
        challengeId: data.challengeId,
        credential: credentialToJson(credential),
      });
      toast({ title: "Passkey created", description: "You can now sign in with your passkey." });
    } catch (error) {
      toast({
        title: "Passkey registration failed",
        description: error instanceof Error ? error.message : "Try again.",
        variant: "destructive",
      });
    } finally {
      setIsBusy(false);
    }
  };

  const handleLoginPasskey = async () => {
    if (!passkeySupported) {
      toast({ title: "Passkeys not supported", description: "This browser does not support passkeys." });
      return;
    }
    setIsBusy(true);
    try {
      const data = await apiRequest<{ challengeId: string; options: WebAuthnOptions }>(
        "/api/auth/webauthn/login/options",
        "POST",
        { email }
      );
      if (!data?.options) {
        throw new Error("Missing WebAuthn options from server.");
      }
      const publicKey = coerceLoginOptions(data.options);
      const credential = (await navigator.credentials.get({ publicKey })) as PublicKeyCredential | null;
      if (!credential) {
        toast({ title: "Login cancelled", description: "No credential returned." });
        return;
      }
      await apiRequest("/api/auth/webauthn/login/verify", "POST", {
        challengeId: data.challengeId,
        credential: credentialToJson(credential),
      });
      toast({ title: "Signed in", description: "Passkey login successful." });
    } catch (error) {
      toast({
        title: "Passkey login failed",
        description: error instanceof Error ? error.message : "Try again.",
        variant: "destructive",
      });
    } finally {
      setIsBusy(false);
    }
  };

  const handleSendMagicLink = async () => {
    if (!email.trim()) {
      toast({ title: "Email required", description: "Enter your email to receive a magic link." });
      return;
    }
    setIsBusy(true);
    setDebugMagicLink(null);
    try {
      const response = await apiRequest<{ debugMagicLink?: string }>(
        "/api/auth/magic/send",
        "POST",
        { email }
      );
      if (response.debugMagicLink) {
        setDebugMagicLink(response.debugMagicLink);
      }
      toast({ title: "Magic link sent", description: "Check your inbox for the sign-in link." });
    } catch (error) {
      toast({
        title: "Magic link failed",
        description: error instanceof Error ? error.message : "Try again.",
        variant: "destructive",
      });
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <div className="text-center">
        <h1 className="page-title text-gray-900 dark:text-white">Sign in to PrivateNote</h1>
        <p className="mt-3 text-base text-gray-600 dark:text-gray-300">
          Passkeys first, magic link fallback. No passwords.
        </p>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Passkeys (Recommended)</CardTitle>
          <CardDescription>Fast, phishing‑resistant, and tied to your device.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="email"
            placeholder="Email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={handleRegisterPasskey} disabled={isBusy}>
              Create passkey
            </Button>
            <Button variant="outline" onClick={handleLoginPasskey} disabled={isBusy}>
              Continue with passkey
            </Button>
          </div>
          {!passkeySupported && (
            <p className="text-xs text-gray-500">This browser does not support passkeys.</p>
          )}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Magic Link</CardTitle>
          <CardDescription>Email sign‑in if passkeys aren’t available.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="email"
            placeholder="you@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={handleSendMagicLink} disabled={isBusy}>
            Send magic link
          </Button>
          {debugMagicLink && (
            <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-3 text-xs text-gray-600 dark:text-gray-300 break-all">
              Dev link: {debugMagicLink}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
