import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { WebAuthnOptions, coerceRegisterOptions, credentialToJson } from "@/utils/webauthn";
import { useAuth } from "@/context/AuthContext";

export default function AuthMagic() {
  const [location] = useLocation();
  const { toast } = useToast();
  const { refresh } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("Verifying your magic link...");
  const [hasPasskeys, setHasPasskeys] = useState<boolean | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [dismissedNudge, setDismissedNudge] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("Missing magic link token.");
      return;
    }

    apiRequest("/api/auth/magic/consume?token=" + encodeURIComponent(token), "GET")
      .then(() => {
        setStatus("success");
        setMessage("You’re signed in.");
        refresh();
        return apiRequest<{ hasPasskeys: boolean }>("/api/auth/me", "GET");
      })
      .then((me) => {
        if (typeof me?.hasPasskeys === "boolean") {
          setHasPasskeys(me.hasPasskeys);
        }
      })
      .catch((error) => {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Magic link failed.");
      });
  }, [location]);

  const handleRegisterPasskey = async () => {
    if (typeof window === "undefined" || !("PublicKeyCredential" in window)) {
      toast({ title: "Passkeys not supported", description: "This browser does not support passkeys." });
      return;
    }
    setIsRegistering(true);
    try {
      const data = await apiRequest<{ challengeId: string; options: WebAuthnOptions }>(
        "/api/auth/webauthn/register/options",
        "POST",
        {}
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
      setHasPasskeys(true);
      toast({ title: "Passkey created", description: "You can now sign in with your passkey." });
    } catch (error) {
      toast({
        title: "Passkey registration failed",
        description: error instanceof Error ? error.message : "Try again.",
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="pt-10 pb-16 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">Magic Link</p>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {status === "loading" ? "Signing you in..." : status === "success" ? "Success" : "Error"}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">{message}</p>
        </div>

        {status === "success" && hasPasskeys === false && !dismissedNudge && (
          <div className="space-y-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
            <div className="space-y-1">
              <p className="text-base font-semibold text-gray-900 dark:text-white">
                Secure your account with a passkey
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Faster sign-in. No emails. No passwords.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={handleRegisterPasskey} disabled={isRegistering}>
                Add passkey
              </Button>
              <Button variant="outline" onClick={() => setDismissedNudge(true)} disabled={isRegistering}>
                Maybe later
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
