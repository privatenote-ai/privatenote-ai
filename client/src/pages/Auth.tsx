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
    if (!email.trim()) {
      toast({ title: "Email required", description: "Enter your email before using a passkey." });
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
      await refresh();
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
    <div className="pt-6 pb-16 px-6 sm:px-8">
      <div className="flex items-center justify-start">
        <a href="/" className="inline-flex items-center">
          <span className="font-bold text-2xl text-primary">
            privateNote
            <span className="text-xs text-gray-500 dark:text-gray-400 align-super ml-0.5">.ai</span>
          </span>
        </a>
      </div>
      <div className="mt-10 max-w-3xl mx-auto text-center">
        <h1
          className={`text-gray-900 dark:text-white ${
            mode === "sign-up" ? "text-3xl sm:text-4xl font-semibold" : "text-4xl sm:text-5xl font-semibold"
          }`}
        >
          {mode === "sign-up" ? "Create your PrivateNote account" : "Welcome back"}
        </h1>
        <p className="mt-3 text-base text-gray-600 dark:text-gray-300">
          {mode === "sign-up"
            ? "Create and share private notes that self-destruct after reading."
            : "Sign in with your email or passkey."}
        </p>
      </div>

      <div className="mt-8 space-y-4 max-w-3xl mx-auto">
        {view === "form" ? (
          <>
            <div className="space-y-1 text-left">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Get started</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Enter your email to create a passwordless account.
              </p>
            </div>
            <Input
              type="email"
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={handleSendMagicLink} disabled={isBusy}>
                {mode === "sign-up" ? "Create account" : "Continue with email"}
              </Button>
              {mode === "sign-in" && (
                <Button
                  variant="outline"
                  onClick={handleLoginPasskey}
                  disabled={isBusy || !email.trim()}
                >
                  Use passkey
                </Button>
              )}
            </div>
            {shouldShowTurnstile && (
              <div className="space-y-2">
                <div id="auth-turnstile-container" className="min-h-[65px]" />
                {!turnstileReady && !turnstileError && (
                  <p className="text-xs text-gray-500">Loading verification…</p>
                )}
                {turnstileError && (
                  <p className="text-xs text-red-500">{turnstileError}</p>
                )}
              </div>
            )}
            {mode === "sign-in" && (
              <div>
                <a href="/auth/recovery" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  Use a recovery code
                </a>
              </div>
            )}
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {mode === "sign-up" ? (
                <>
                  Already have an account?{" "}
                  <a href="/auth/sign-in" className="text-blue-600 dark:text-blue-400 hover:underline">
                    Sign in
                  </a>
                </>
              ) : (
                <>
                  Don’t have an account?{" "}
                  <a href="/auth/sign-up" className="text-blue-600 dark:text-blue-400 hover:underline">
                    Sign up
                  </a>
                </>
              )}
            </div>
            {!passkeySupported && (
              <p className="text-xs text-gray-500">This browser does not support passkeys.</p>
            )}
            {mode === "sign-up" && (
              <p className="text-xs text-gray-500">
                By continuing, you acknowledge that you understand and agree to the{" "}
                <a
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Terms &amp; Conditions
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Privacy Policy
                </a>
                .
              </p>
            )}
          </>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              If the address is correct, we’ll send you a secure sign-in link.
              <br />
              Check your inbox (and spam folder).
            </p>
            <button
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              onClick={() => setView("form")}
            >
              Didn’t receive an email? Double-check the address and try again.
            </button>
            {debugMagicLink && (
              <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-3 text-xs text-gray-600 dark:text-gray-300 break-all">
                Dev link: {debugMagicLink}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
