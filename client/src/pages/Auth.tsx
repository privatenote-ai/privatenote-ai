import React, { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { WebAuthnOptions, credentialToJson, coerceLoginOptions } from "@/utils/webauthn";
import { useAuth } from "@/context/AuthContext";

type AuthMode = "sign-in" | "sign-up";

export default function Auth({ mode = "sign-in" }: { mode?: AuthMode }) {
  const { toast } = useToast();
  const { refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [debugMagicLink, setDebugMagicLink] = useState<string | null>(null);
  const [view, setView] = useState<"form" | "sent">("form");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState<string | null>(null);
  const [turnstileReady, setTurnstileReady] = useState(false);
  const turnstileWidgetIdRef = React.useRef<string | null>(null);
  const shouldShowTurnstile = !!import.meta.env.VITE_TURNSTILE_SITE_KEY;

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
      // Email is optional - if provided, use it to filter credentials; if not, use discoverable credentials
      const data = await apiRequest<{ challengeId: string; options: WebAuthnOptions }>(
        "/api/auth/webauthn/login/options",
        "POST",
        email.trim() ? { email: email.trim() } : {}
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
      await refresh();
      // Redirect to home on successful login
      window.location.href = "/";
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
      toast({ title: "Email required", description: "Enter your email to continue." });
      return;
    }
    if (shouldShowTurnstile && !turnstileToken) {
      toast({ title: "Human verification required", description: "Please complete the verification check." });
      return;
    }
    setIsBusy(true);
    setDebugMagicLink(null);
    try {
      const response = await apiRequest<{ debugMagicLink?: string }>(
        "/api/auth/magic/send",
        "POST",
        { email, turnstileToken }
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

  React.useEffect(() => {
    if (!shouldShowTurnstile) {
      setTurnstileReady(false);
      return;
    }

    const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
    if (!siteKey) {
      setTurnstileError("Human verification is not configured.");
      return;
    }

    let intervalId: number | null = null;

    const initTurnstile = () => {
      if (!window.turnstile) {
        return;
      }
      const container = document.getElementById("auth-turnstile-container");
      if (!container) {
        return;
      }
      if (turnstileWidgetIdRef.current !== null) {
        try {
          window.turnstile.reset(turnstileWidgetIdRef.current);
        } catch {
          // ignore
        }
        turnstileWidgetIdRef.current = null;
      }
      container.innerHTML = "";
      setTurnstileReady(true);
      const widgetId = window.turnstile.render(container, {
        sitekey: siteKey,
        callback: (token: string) => {
          setTurnstileToken(token);
          setTurnstileError(null);
        },
        "error-callback": () => {
          setTurnstileToken(null);
          setTurnstileError("Human verification failed. Please try again.");
          turnstileWidgetIdRef.current = null;
        },
        "expired-callback": () => {
          setTurnstileToken(null);
        },
      });
      turnstileWidgetIdRef.current = widgetId;
    };

    if (!window.turnstile) {
      intervalId = window.setInterval(() => {
        if (window.turnstile) {
          if (intervalId !== null) {
            window.clearInterval(intervalId);
          }
          initTurnstile();
        }
      }, 200);
    } else {
      initTurnstile();
    }

    return () => {
      if (intervalId !== null) {
        window.clearInterval(intervalId);
      }
      if (turnstileWidgetIdRef.current !== null && window.turnstile) {
        window.turnstile.reset(turnstileWidgetIdRef.current);
        turnstileWidgetIdRef.current = null;
      }
    };
  }, [shouldShowTurnstile]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Fixed Logo in Top-Left */}
      <div className="fixed top-0 left-0 z-40 p-4 sm:p-6">
        <a href="/" className="inline-flex items-center hover:opacity-80 transition-opacity">
          <span className="font-bold text-2xl text-primary">
            privateNote
            <span className="text-xs text-gray-500 dark:text-gray-400 align-super ml-0.5">.ai</span>
          </span>
        </a>
      </div>

      {/* Main Content */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              {mode === "sign-up" ? "Create your account" : "Welcome back"}
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-300">
              {mode === "sign-up"
                ? "Create and share private notes that self-destruct after reading."
                : "Sign in securely with your email or a passkey."}
            </p>
          </div>

          {/* Form Card */}
          {view === "form" ? (
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-xl">
                  {mode === "sign-up" ? "Get started" : "Sign in"}
                </CardTitle>
                <CardDescription>
                  {mode === "sign-up"
                    ? "Enter your email to create a passwordless account."
                    : "Enter your email to receive a secure sign-in link or use passkey."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email-input" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email address
                  </label>
                  <Input
                    id="email-input"
                    type="email"
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleSendMagicLink}
                    disabled={isBusy}
                    className="flex-1"
                    size="lg"
                  >
                    {isBusy ? (
                      <>
                        <span className="mr-2">⏳</span>
                        Sending...
                      </>
                    ) : (
                      mode === "sign-up" ? "Create account" : "Continue with email"
                    )}
                  </Button>
                  {mode === "sign-in" && (
                    <Button
                      variant="outline"
                      onClick={handleLoginPasskey}
                      disabled={isBusy || !passkeySupported}
                      className="flex-1"
                      size="lg"
                    >
                      Use passkey
                    </Button>
                  )}
                </div>

                {shouldShowTurnstile && (
                  <div className="space-y-2">
                    <div id="auth-turnstile-container" className="min-h-[65px] flex justify-center" />
                    {!turnstileReady && !turnstileError && (
                      <p className="text-xs text-gray-500 text-center">Loading verification…</p>
                    )}
                    {turnstileError && (
                      <p className="text-xs text-red-500 text-center">{turnstileError}</p>
                    )}
                  </div>
                )}

                {mode === "sign-in" && (
                  <div className="text-center pt-2">
                    <a
                      href="/auth/recovery"
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Use a recovery code
                    </a>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="text-sm text-center text-gray-600 dark:text-gray-300">
                    {mode === "sign-up" ? (
                      <>
                        Already have an account?{" "}
                        <a
                          href="/auth/sign-in"
                          className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                        >
                          Sign in
                        </a>
                      </>
                    ) : (
                      <>
                        Don't have an account?{" "}
                        <a
                          href="/auth/sign-up"
                          className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                        >
                          Sign up
                        </a>
                      </>
                    )}
                  </div>
                </div>

                {!passkeySupported && mode === "sign-in" && (
                  <p className="text-xs text-gray-500 text-center">
                    This browser does not support passkeys.
                  </p>
                )}

                {mode === "sign-up" && (
                  <p className="text-xs text-gray-500 text-center leading-relaxed">
                    By continuing, you acknowledge that you understand and agree to the{" "}
                    <a
                      href="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Terms &amp; Conditions
                    </a>{" "}
                    and{" "}
                    <a
                      href="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Privacy Policy
                    </a>
                    .
                  </p>
                )}
              </CardContent>
            </Card>
          ) : (
            /* Sent State Card */
            <Card className="border-2 border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl"></div>
                    <div className="relative z-10 w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                      <span className="text-3xl">✉️</span>
                    </div>
                  </div>
                </div>
                <CardTitle className="text-2xl">Check your email</CardTitle>
                <CardDescription className="text-base mt-2">
                  We sent a secure sign-in link to <strong>{email}</strong>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                    If the address is correct, we'll send you a secure sign-in link.
                    <br />
                    Check your inbox (and spam folder).
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setView("form")}
                  className="w-full"
                  size="lg"
                >
                  Didn't receive an email? Try again
                </Button>
                {debugMagicLink && (
                  <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-3">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Development link:
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300 break-all font-mono">
                      {debugMagicLink}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
