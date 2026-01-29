import React, { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { WebAuthnOptions, credentialToJson, coerceLoginOptions } from "@/utils/webauthn";

export default function Auth() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [debugMagicLink, setDebugMagicLink] = useState<string | null>(null);
  const [view, setView] = useState<"form" | "sent">("form");

  const passkeySupported = useMemo(() => {
    return typeof window !== "undefined" && "PublicKeyCredential" in window;
  }, []);

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
      setView("sent");
      toast({ title: "Check your email", description: "We sent a sign-in link if the address is valid." });
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
          Passkeys first. Email link when you need it.
        </p>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Sign in or create account</CardTitle>
          <CardDescription>Continue with email or use a passkey.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {view === "form" ? (
            <>
              <Input
                type="email"
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={handleSendMagicLink} disabled={isBusy}>
                  Continue with email
                </Button>
                <Button variant="outline" onClick={handleLoginPasskey} disabled={isBusy}>
                  Use passkey
                </Button>
              </div>
              <div>
                <a href="/auth/recovery" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  Use a recovery code
                </a>
              </div>
              {!passkeySupported && (
                <p className="text-xs text-gray-500">This browser does not support passkeys.</p>
              )}
            </>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                If the address is correct, a sign-in link is on its way. Check your inbox and spam folder.
              </p>
              <button
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                onClick={() => setView("form")}
              >
                Didn’t receive an email? Check for typos.
              </button>
              {debugMagicLink && (
                <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-3 text-xs text-gray-600 dark:text-gray-300 break-all">
                  Dev link: {debugMagicLink}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
