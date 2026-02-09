import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { WebAuthnOptions, coerceRegisterOptions, credentialToJson } from "@/utils/webauthn";
import { useAuth } from "@/context/AuthContext";
import { CheckCircle2, Loader2, AlertCircle, KeyRound, Sparkles } from "lucide-react";

export default function AuthMagic() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const { refresh } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("Verifying your magic link...");
  const [friendlyMessage, setFriendlyMessage] = useState<string>(
    "We’re verifying your sign-in link."
  );
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
        setFriendlyMessage("You’re signed in.");
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
        const raw = error instanceof Error ? error.message : "Magic link failed.";
        setMessage(raw);
        if (typeof raw === "string" && raw.toLowerCase().includes("expired")) {
          setFriendlyMessage("This link has expired. Please request a new sign‑in link.");
        } else if (typeof raw === "string" && raw.toLowerCase().includes("invalid")) {
          setFriendlyMessage("This sign‑in link is no longer valid. Please request a new one.");
        } else {
          setFriendlyMessage("We couldn’t verify that link. Please request a new sign‑in link.");
        }
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
    <div className="pt-16 pb-16 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
      <div className="space-y-6">
        {/* Loading State */}
        {status === "loading" && (
          <Card className="border-2">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <Loader2 className="h-12 w-12 text-primary animate-spin" />
                  <Sparkles className="h-6 w-6 text-primary absolute -top-1 -right-1 animate-pulse" />
                </div>
              </div>
              <CardTitle className="text-2xl">Signing you in...</CardTitle>
              <CardDescription className="text-base mt-2">
                {friendlyMessage}
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {/* Success State */}
        {status === "success" && (
          <>
            <Card className="border-2 border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl"></div>
                    <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-500 relative z-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wider">
                    Magic Link
                  </p>
                  <CardTitle className="text-3xl text-gray-900 dark:text-white">
                    Success
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-700 dark:text-gray-300">
                    You're signed in.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setLocation("/")}
                    size="lg"
                    className="min-w-[140px]"
                  >
                    Continue to Home
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Passkey Nudge */}
            {hasPasskeys === false && !dismissedNudge && (
              <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                      <KeyRound className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <CardTitle className="text-xl text-gray-900 dark:text-white">
                        Secure your account with a passkey
                      </CardTitle>
                      <CardDescription className="text-base">
                        Faster sign-in. No emails. No passwords.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={handleRegisterPasskey}
                      disabled={isRegistering}
                      className="flex-1"
                      size="lg"
                    >
                      {isRegistering ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Setting up...
                        </>
                      ) : (
                        <>
                          <KeyRound className="mr-2 h-4 w-4" />
                          Add passkey
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setDismissedNudge(true)}
                      disabled={isRegistering}
                      className="flex-1"
                      size="lg"
                    >
                      Maybe later
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    Passkeys use biometric authentication for secure, passwordless sign-in
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Error State */}
        {status === "error" && (
          <Card className="border-2 border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl"></div>
                  <AlertCircle className="h-16 w-16 text-red-600 dark:text-red-500 relative z-10" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-red-600 dark:text-red-400 uppercase tracking-wider">
                  Magic Link
                </p>
                <CardTitle className="text-3xl text-gray-900 dark:text-white">
                  Link Problem
                </CardTitle>
                <CardDescription className="text-lg text-gray-700 dark:text-gray-300">
                  {friendlyMessage}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild className="flex-1" size="lg">
                  <a href="/auth/sign-in">Get a new link</a>
                </Button>
                <Button variant="outline" asChild className="flex-1" size="lg">
                  <a href="/auth">Try again</a>
                </Button>
              </div>
              <div className="rounded-lg bg-red-100/50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
                <p className="text-sm text-red-800 dark:text-red-300 text-center">
                  <strong>Security note:</strong> For your security, magic links expire after a short time and can only be used once.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
