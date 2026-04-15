import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiRequest, ApiRequestError } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  passkeyRegistrationErrorMessage,
  registerPasskeyWithRetry,
} from "@/pages/security-settings/registerPasskeyWithRetry";
import { useAuth } from "@/context/AuthContext";
import { CheckCircle2, Loader2, AlertCircle, KeyRound, Sparkles } from "lucide-react";

/**
 * After we strip ?t= / ?token= / #token= from the address bar, the token stays here until consume
 * finishes so Strict Mode remounts still see it. Cleared after use.
 */
let magicLinkTokenCache: string | null = null;

function takeMagicLinkTokenOnce(): string | null {
  const url = new URL(window.location.href);
  const fromQuery = url.searchParams.get("t") || url.searchParams.get("token");
  const hash = url.hash.startsWith("#") ? url.hash.slice(1) : url.hash;
  const fromHash = hash ? new URLSearchParams(hash).get("token") : null;
  const fromUrl = fromQuery || fromHash;

  if (fromUrl) {
    magicLinkTokenCache = fromUrl;
    window.history.replaceState(null, "", url.pathname);
    return fromUrl;
  }
  return magicLinkTokenCache;
}

type Phase = "initial" | "confirm" | "loading" | "success" | "error";

export default function AuthMagic() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { refresh } = useAuth();
  const [phase, setPhase] = useState<Phase>("initial");
  const [token, setToken] = useState<string | null>(null);
  const [friendlyMessage, setFriendlyMessage] = useState<string>("");
  const [hasPasskeys, setHasPasskeys] = useState<boolean | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [dismissedNudge, setDismissedNudge] = useState(false);
  const [emailCodeRequired, setEmailCodeRequired] = useState(false);
  const [emailCode, setEmailCode] = useState("");

  useEffect(() => {
    const t = takeMagicLinkTokenOnce();
    if (!t) {
      setPhase("error");
      setFriendlyMessage("Open the sign-in link from your email on this device, or request a new link.");
      return;
    }
    setToken(t);

    void (async () => {
      try {
        const prep = await apiRequest<{
          ok?: boolean;
          emailCodeRequired?: boolean;
          riskLevel?: string;
        }>("/api/auth/magic/prepare", "POST", { token: t });

        const needCode = prep?.emailCodeRequired === true;
        setEmailCodeRequired(needCode);
        if (needCode) {
          setFriendlyMessage(
            "Your network or browser looks different from when the link was sent. We emailed a 6-digit code — enter it below, then continue. For security, finish in the same browser where you opened the link.",
          );
        } else {
          setFriendlyMessage(
            "This page only prepares sign-in in your browser. Your session starts after you confirm. For security, finish sign-in in the same browser where you opened the link.",
          );
        }
        setPhase("confirm");
      } catch (err) {
        if (err instanceof ApiRequestError && err.status === 403) {
          try {
            const body = JSON.parse(err.bodyText) as { code?: string };
            if (body.code === "context_high_risk") {
              setPhase("error");
              setFriendlyMessage(
                "This link doesn’t match this device or network closely enough. Request a new sign-in link and open it here.",
              );
              return;
            }
            if (body.code === "origin_required") {
              setPhase("error");
              setFriendlyMessage(
                "Sign-in must continue from the site in your browser. Open the link in this tab again or request a new link.",
              );
              return;
            }
          } catch {
            /* ignore */
          }
        }
        setPhase("error");
        setFriendlyMessage(
          "We couldn’t verify that sign-in link. Open it from your email again, or request a new link.",
        );
      }
    })();
  }, []);

  const runConsume = async () => {
    if (!token) return;
    if (emailCodeRequired) {
      const digits = emailCode.replace(/\D/g, "");
      if (digits.length !== 6) {
        toast({
          title: "Enter the code",
          description: "Use the 6-digit code from the email we just sent.",
          variant: "destructive",
        });
        return;
      }
    }
    setPhase("loading");
    setFriendlyMessage("Completing sign-in…");

    try {
      const payload: { token: string; emailCode?: string } = { token };
      if (emailCodeRequired) {
        payload.emailCode = emailCode.replace(/\D/g, "").slice(0, 6);
      }
      const result = await apiRequest<{ ok: boolean; totpRequired?: boolean }>(
        "/api/auth/magic/consume",
        "POST",
        payload,
      );

      if (result?.totpRequired) {
        magicLinkTokenCache = null;
        setLocation("/auth/totp");
        return;
      }

      setPhase("success");
      setFriendlyMessage("You're signed in.");
      refresh();
      const me = await apiRequest<{ hasPasskeys: boolean }>("/api/auth/me", "GET").catch(() => undefined);
      if (me && typeof me.hasPasskeys === "boolean") {
        setHasPasskeys(me.hasPasskeys);
      }
    } catch (error) {
      setPhase("error");
      if (error instanceof ApiRequestError) {
        try {
          const body = JSON.parse(error.bodyText) as { code?: string };
          if (body.code === "magic_bind_required" || body.code === "magic_email_otp_exhausted") {
            setFriendlyMessage(
              body.code === "magic_email_otp_exhausted"
                ? "Too many incorrect codes. Open the sign-in link from your email again to start over with a new code."
                : "This confirmation step expired. Open the link from your email again so we can verify your browser, then press Continue.",
            );
            return;
          }
          if (body.code === "magic_email_code_required" || body.code === "magic_email_code_invalid") {
            setPhase("confirm");
            setFriendlyMessage(
              body.code === "magic_email_code_invalid"
                ? "That code doesn’t match. Check the latest email and try again."
                : "Enter the 6-digit code from your email, then press Continue sign in.",
            );
            return;
          }
          if (body.code === "origin_required") {
            setFriendlyMessage(
              "Sign-in must continue from the site in your browser. Open the link in this tab again or request a new link.",
            );
            return;
          }
        } catch {
          /* ignore */
        }
      }
      const raw = error instanceof Error ? error.message : "Magic link failed.";
      if (typeof raw === "string" && raw.toLowerCase().includes("expired")) {
        setFriendlyMessage("This link has expired. Please request a new sign‑in link.");
      } else if (typeof raw === "string" && raw.toLowerCase().includes("invalid")) {
        setFriendlyMessage("This sign‑in link is no longer valid. Please request a new one.");
      } else {
        setFriendlyMessage("We couldn’t verify that link. Please request a new sign‑in link.");
      }
    } finally {
      magicLinkTokenCache = null;
    }
  };

  const handleRegisterPasskey = async () => {
    if (typeof window === "undefined" || !("PublicKeyCredential" in window)) {
      toast({ title: "Passkeys not supported", description: "This browser does not support passkeys." });
      return;
    }
    setIsRegistering(true);
    try {
      await registerPasskeyWithRetry();
      setHasPasskeys(true);
      toast({
        title: "Passkey added",
        description: "You can sign in with this passkey on this device.",
      });
    } catch (error) {
      toast({
        title: "Passkey registration failed",
        description: passkeyRegistrationErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="pt-16 pb-16 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
      <div className="space-y-6">
        {/* Confirm (no session until user clicks) */}
        {phase === "confirm" && (
          <Card className="border-2">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl">Continue sign in</CardTitle>
              <CardDescription className="text-base mt-2">{friendlyMessage}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              {emailCodeRequired && (
                <div className="w-full max-w-xs space-y-2">
                  <label htmlFor="magic-email-code" className="text-sm font-medium text-center block">
                    6-digit code from email
                  </label>
                  <Input
                    id="magic-email-code"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={12}
                    placeholder="000000"
                    value={emailCode}
                    onChange={(e) => setEmailCode(e.target.value)}
                    className="text-center text-lg tracking-widest"
                  />
                </div>
              )}
              <Button type="button" size="lg" className="min-w-[200px]" onClick={() => void runConsume()}>
                Continue sign in
              </Button>
              <p className="text-xs text-muted-foreground text-center max-w-md">
                Opening the link only loads this page. Your session starts after you confirm here — not from the link
                alone.
              </p>
            </CardContent>
          </Card>
        )}

        {phase === "initial" && (
          <Card className="border-2">
            <CardHeader className="text-center pb-4">
              <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto mb-2" />
              <CardTitle className="text-2xl">Checking your sign-in link…</CardTitle>
              <CardDescription className="text-base mt-2">
                Validating the link and binding this browser. No session is created until you continue.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {phase === "loading" && (
          <Card className="border-2">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <Loader2 className="h-12 w-12 text-primary animate-spin" />
                  <Sparkles className="h-6 w-6 text-primary absolute -top-1 -right-1 animate-pulse" />
                </div>
              </div>
              <CardTitle className="text-2xl">Signing you in…</CardTitle>
              <CardDescription className="text-base mt-2">{friendlyMessage}</CardDescription>
            </CardHeader>
          </Card>
        )}

        {phase === "success" && (
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

        {phase === "error" && (
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
                  <strong>Security note:</strong> Magic links expire after a short time (about ten minutes) and can only be used once.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
