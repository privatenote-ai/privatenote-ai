import React, { useCallback, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { ApiRequestError, apiRequest } from "@/lib/queryClient";
import {
  WebAuthnOptions,
  credentialToJson,
  coerceLoginOptions,
  describeWebAuthnEffectiveDomainError,
} from "@/utils/webauthn";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { localizedPath } from "@/utils/localizedPath";
import { isPlausibleEmailFormat } from "@shared/isPlausibleEmailFormat";
import { normalizeMagicLinkEmailPurpose } from "@shared/magicLinkEmail";
import { sanitizeAuthReturnTo } from "@shared/sanitizeAuthReturnTo";
import { getTurnstileSiteKeyForClient } from "@/lib/turnstileClient";
import { ensureTurnstileScript } from "@/lib/turnstileScript";

const PASSKEY_FAIL_GENERIC =
  "Sign-in could not be completed. Try again or use a different sign-in method.";
const PASSKEY_FAIL_CANCELLED = "Sign-in was cancelled.";
const PASSKEY_FAIL_SERVER_BUSY =
  "Sign-in is temporarily unavailable. Please try again in a moment.";
const PASSKEY_FAIL_RATE_LIMIT = "Too many attempts. Please wait a moment and try again.";

const LIKELY_TYPO_EMAIL_DOMAINS = new Set([
  "gmial.com",
  "gamil.com",
  "gnail.com",
  "gmai.com",
  "gmail.con",
  "gmail.co",
  "gmail.comm",
  "gmail.om",
  "yaho.com",
  "yahoo.con",
  "yahoo.co",
  "yahho.com",
  "hotmial.com",
  "hotmal.com",
  "hotmai.com",
  "outlok.com",
  "outllok.com",
  "icloud.con",
  "icoud.com",
  "protonn.me",
  "protonnmail.com",
]);

/** Tear down a widget instance (unmount / replace). Prefer Cloudflare's `remove`; fall back to `reset`. */
function destroyTurnstileWidget(widgetId: string) {
  const t = window.turnstile;
  if (!t) return;
  try {
    if (typeof t.remove === "function") {
      t.remove(widgetId);
      return;
    }
  } catch {
    // fall through
  }
  try {
    t.reset(widgetId);
  } catch {
    /* ignore */
  }
}

function passkeyFailureDescription(error: unknown): string {
  const domainHint = describeWebAuthnEffectiveDomainError(error);
  if (domainHint) return domainHint;

  const errName =
    error instanceof DOMException || error instanceof Error ? error.name : undefined;

  if (errName === "NotAllowedError" || errName === "AbortError") {
    return PASSKEY_FAIL_CANCELLED;
  }
  if (errName === "SecurityError" || errName === "InvalidStateError") {
    return PASSKEY_FAIL_GENERIC;
  }
  if (error instanceof ApiRequestError) {
    if (error.status >= 500) return PASSKEY_FAIL_SERVER_BUSY;
    if (error.status === 429) return PASSKEY_FAIL_RATE_LIMIT;
    return PASSKEY_FAIL_GENERIC;
  }
  return PASSKEY_FAIL_GENERIC;
}

type AuthMode = "sign-in" | "sign-up";

export default function Auth({ mode: _mode = "sign-in" }: { mode?: AuthMode }) {
  const { toast } = useToast();
  const { refreshUntilAuthenticated } = useAuth();
  const { language, t } = useLanguage();
  const tx = (key: string, fallback: string) => t[key] || fallback;
  const [email, setEmail] = useState("");
  const [isSendingMagicLink, setIsSendingMagicLink] = useState(false);
  const [isUsingPasskey, setIsUsingPasskey] = useState(false);
  const [debugMagicLink, setDebugMagicLink] = useState<string | null>(null);
  const [view, setView] = useState<"form" | "sent">("form");
  const [typoDialogOpen, setTypoDialogOpen] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState<string | null>(null);
  const [turnstileMounted, setTurnstileMounted] = useState(false);
  const turnstileWidgetIdRef = React.useRef<string | null>(null);
  const turnstileSiteKey = getTurnstileSiteKeyForClient();
  const shouldShowTurnstile = !!turnstileSiteKey;
  const showDebugMagicLinkUi = import.meta.env.DEV && Boolean(debugMagicLink);
  const signInContext = useMemo(() => {
    if (typeof window === "undefined") {
      return { purpose: "default" as const, returnTo: "/" };
    }
    const params = new URLSearchParams(window.location.search);
    return {
      purpose: normalizeMagicLinkEmailPurpose(params.get("purpose")),
      returnTo: sanitizeAuthReturnTo(params.get("returnTo")) ?? "/",
    };
  }, []);
  const isFileAttachSignIn = signInContext.purpose === "file_attach";

  const resetAuthTurnstile = useCallback(() => {
    setTurnstileToken(null);
    if (turnstileWidgetIdRef.current !== null && window.turnstile) {
      try {
        window.turnstile.reset(turnstileWidgetIdRef.current);
      } catch {
        /* ignore */
      }
    }
  }, []);

  const passkeySupported = useMemo(() => {
    return typeof window !== "undefined" && "PublicKeyCredential" in window;
  }, []);

  const getEmailDomain = (value: string): string | null => {
    const trimmed = value.trim().toLowerCase();
    const atIndex = trimmed.lastIndexOf("@");
    if (atIndex <= 0 || atIndex === trimmed.length - 1) return null;
    return trimmed.slice(atIndex + 1);
  };

  const isLikelyTypoDomain = (value: string): boolean => {
    const domain = getEmailDomain(value);
    if (!domain) return false;
    return LIKELY_TYPO_EMAIL_DOMAINS.has(domain);
  };

  const isAnyAuthBusy = isSendingMagicLink || isUsingPasskey;

  const handleLoginPasskey = async () => {
    if (!passkeySupported) {
      toast({
        title: tx("authPasskeysNotSupportedTitle", "Passkeys not supported"),
        description: tx("authPasskeysNotSupportedDesc", "This browser does not support passkeys."),
      });
      return;
    }
    setIsUsingPasskey(true);
    try {
      // Discoverable (resident) credentials only — server never returns allowCredentials from email
      // (avoids account-enumeration and credential-id leaks). New passkeys use residentKey: "required".
      const data = await apiRequest<{ challengeId: string; options: WebAuthnOptions }>(
        "/api/auth/webauthn/login/options",
        "POST",
        {},
      );
      if (!data?.options) {
        throw new Error("Missing WebAuthn options from server.");
      }
      const publicKey = coerceLoginOptions(data.options);
      const credential = (await navigator.credentials.get({ publicKey })) as PublicKeyCredential | null;
      if (!credential) {
        toast({ title: tx("authLoginCancelledTitle", "Login cancelled"), description: PASSKEY_FAIL_CANCELLED });
        return;
      }
      await apiRequest("/api/auth/webauthn/login/verify", "POST", {
        challengeId: data.challengeId,
        credential: credentialToJson(credential),
      });
      // Retry: D1 read-after-write lag can briefly return authenticated:false
      // even though the verify endpoint just created the session.
      await refreshUntilAuthenticated();
      window.location.href = signInContext.returnTo;
    } catch (error) {
      toast({
        title: tx("authPasskeyLoginFailedTitle", "Passkey login failed"),
        description: passkeyFailureDescription(error),
        variant: "destructive",
      });
    } finally {
      setIsUsingPasskey(false);
    }
  };

  const sendMagicLinkRequest = async (options: { skipTypoCheck?: boolean } = {}) => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      toast({
        title: tx("authEmailRequiredTitle", "Email required"),
        description: tx("authEmailRequiredDesc", "Enter your email to continue."),
      });
      return;
    }
    if (!isPlausibleEmailFormat(trimmedEmail)) {
      toast({
        title: tx("authInvalidEmailTitle", "Invalid email"),
        description: tx("authInvalidEmailDesc", "Enter a valid email address (example: you@domain.com)."),
        variant: "destructive",
      });
      return;
    }
    if (!options.skipTypoCheck && isLikelyTypoDomain(trimmedEmail)) {
      setTypoDialogOpen(true);
      return;
    }
    if (shouldShowTurnstile && !turnstileToken) {
      toast({
        title: tx("authHumanVerificationTitle", "Human verification required"),
        description: tx("authHumanVerificationDesc", "Please complete the verification check."),
      });
      return;
    }
    setEmail(trimmedEmail);
    setIsSendingMagicLink(true);
    setDebugMagicLink(null);
    try {
      const response = await apiRequest<{ debugMagicLink?: string }>(
        "/api/auth/magic/send",
        "POST",
        {
          email: trimmedEmail,
          turnstileToken,
          locale: language,
          emailPurpose: signInContext.purpose,
          returnTo: signInContext.returnTo,
        }
      );
      if (import.meta.env.DEV && response.debugMagicLink) {
        setDebugMagicLink(response.debugMagicLink);
      }
      setView("sent");
      toast({
        title: tx("authCheckEmailTitle", "Check your email"),
        description: tx("authCheckEmailDesc", "We sent a sign-in link if the address is valid."),
      });
    } catch {
      toast({
        title: tx("authMagicLinkFailedTitle", "Magic link failed"),
        description: tx("authMagicLinkFailedDesc", "We couldn't send the link. Please try again."),
        variant: "destructive",
      });
    } finally {
      resetAuthTurnstile();
      setIsSendingMagicLink(false);
    }
  };

  React.useEffect(() => {
    if (!shouldShowTurnstile) {
      setTurnstileMounted(false);
      setTurnstileError(null);
      setTurnstileToken(null);
      return;
    }

    // The widget mounts inside the form card only. "Check your email" unmounts that DOM;
    // without re-running this effect when returning to the form, Turnstile never renders again.
    if (view !== "form") {
      setTurnstileMounted(false);
      setTurnstileToken(null);
      if (turnstileWidgetIdRef.current !== null) {
        const id = turnstileWidgetIdRef.current;
        turnstileWidgetIdRef.current = null;
        destroyTurnstileWidget(id);
      }
      return;
    }

    const siteKey = turnstileSiteKey;
    if (!siteKey) {
      setTurnstileError("Human verification is not configured.");
      setTurnstileMounted(false);
      return;
    }

    setTurnstileMounted(false);

    const initTurnstile = () => {
      if (!window.turnstile) {
        return;
      }
      const container = document.getElementById("auth-turnstile-container");
      if (!container) {
        return;
      }
      if (turnstileWidgetIdRef.current !== null) {
        const prevId = turnstileWidgetIdRef.current;
        turnstileWidgetIdRef.current = null;
        destroyTurnstileWidget(prevId);
      }
      container.innerHTML = "";
      setTurnstileError(null);
      setTurnstileMounted(true);
      const widgetId = window.turnstile.render(container, {
        sitekey: siteKey,
        callback: (token: string) => {
          setTurnstileToken(token);
          setTurnstileError(null);
        },
        "error-callback": () => {
          setTurnstileError("Human verification failed. Please try again.");
          resetAuthTurnstile();
        },
        "expired-callback": () => {
          resetAuthTurnstile();
        },
      });
      turnstileWidgetIdRef.current = widgetId;
    };

    void ensureTurnstileScript()
      .then(() => {
        initTurnstile();
      })
      .catch(() => {
        setTurnstileError("Human verification failed to load. Please try again.");
        setTurnstileMounted(false);
      });

    return () => {
      setTurnstileMounted(false);
      if (turnstileWidgetIdRef.current !== null) {
        const id = turnstileWidgetIdRef.current;
        turnstileWidgetIdRef.current = null;
        destroyTurnstileWidget(id);
      }
      const container = document.getElementById("auth-turnstile-container");
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [view, shouldShowTurnstile, turnstileSiteKey, resetAuthTurnstile]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Fixed Logo in Top-Left */}
      <div className="fixed top-0 left-0 z-40 p-4 sm:p-6">
        <a href="/" className="inline-flex items-center hover:opacity-80 transition-opacity">
          <span className="font-bold text-2xl text-primary">
            privateNote
            <span className="text-xs text-primary align-super ml-0.5">.ai</span>
          </span>
        </a>
      </div>

      {/* Main Content */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-white sm:text-4xl">
              {isFileAttachSignIn
                ? tx("authFileAttachTitle", "Sign in to attach files")
                : tx("authContinueTitle", "Continue to PrivateNote")}
            </h1>
            <p className="mx-auto max-w-md text-base leading-relaxed text-gray-600 dark:text-gray-300">
              {isFileAttachSignIn
                ? tx(
                    "authFileAttachSubtitle",
                    "Enter your email to sign in. You’ll return to your note to attach encrypted files.",
                  )
                : tx("authUnifiedSubtitle", "Enter your email to continue. If you’re new, we’ll create your account.")}
            </p>
          </div>

          {/* Form Card */}
          {view === "form" ? (
            <Card className="border-2">
              <CardHeader className="space-y-2.5 text-center">
                <CardTitle className="text-xl leading-snug">
                  {tx("authGetStarted", "Get started")}
                </CardTitle>
                <CardDescription className="mx-auto max-w-sm leading-relaxed">
                  {tx("authUnifiedCardDesc", "Use a secure email link or a passkey on this device.")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void sendMagicLinkRequest();
                  }}
                >
                  <div className="space-y-2">
                    <label htmlFor="email-input" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {tx("authEmailAddress", "Email address")}
                    </label>
                    <Input
                      id="email-input"
                      type="email"
                      name="email"
                      autoComplete="email"
                      placeholder="you@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      type="submit"
                      disabled={isAnyAuthBusy}
                      className="flex-1 min-h-12 sm:min-h-0"
                      size="lg"
                    >
                      {isSendingMagicLink ? (
                        <>{tx("authSendingLink", "Sending link...")}</>
                      ) : (
                        tx("authContinueWithEmail", "Continue with email")
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => void handleLoginPasskey()}
                      disabled={isAnyAuthBusy || !passkeySupported}
                      className="flex-1 min-h-12 sm:min-h-0"
                      size="lg"
                    >
                      {isUsingPasskey
                        ? tx("authSigningIn", "Signing in...")
                        : tx("authUsePasskey", "Use passkey")}
                    </Button>
                  </div>

                  {shouldShowTurnstile && (
                    <div className="space-y-2">
                      <div id="auth-turnstile-container" className="min-h-[65px] flex justify-center" />
                      {!turnstileMounted && !turnstileError && (
                        <p className="text-xs text-gray-500 text-center">
                          {tx("authLoadingVerification", "Loading verification...")}
                        </p>
                      )}
                      {turnstileError && (
                        <p className="text-xs text-red-500 text-center">{turnstileError}</p>
                      )}
                    </div>
                  )}
                </form>

                <div className="text-center pt-2">
                  <a
                    href="/auth/recovery"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {tx("authUseRecoveryCode", "Use a recovery code")}
                  </a>
                </div>

                {!passkeySupported && (
                  <p className="text-xs text-gray-500 text-center">
                    {tx("authPasskeysNotSupportedDesc", "This browser does not support passkeys.")}
                  </p>
                )}

                <p className="mx-auto max-w-xs text-center text-xs leading-relaxed text-gray-500">
                  {tx(
                    "authByContinuingLine1",
                    "By continuing, you acknowledge that you understand and",
                  )}
                  <br />
                  {tx("authByContinuingLine2Prefix", "agree to the")}
                  {" "}
                  <a
                    href={localizedPath("/terms", language)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {tx("authTermsAndConditions", "Terms & Conditions")}
                  </a>{" "}
                  {tx("authAnd", "and")}{" "}
                  <a
                    href={localizedPath("/privacy", language)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {tx("privacyPolicy", "Privacy Policy")}
                  </a>
                  {tx("authByContinuingLine2Suffix", ".")}
                </p>
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
                <CardTitle className="text-2xl leading-snug">{tx("authCheckEmailTitle", "Check your email")}</CardTitle>
                <CardDescription className="mt-2 text-base leading-relaxed">
                  {tx("authUnifiedSentText", "If this address can receive PrivateNote email, a secure link is on its way to")}{" "}
                  <strong>{email.trim()}</strong>.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                    {tx("authCheckInboxHint", "Check your inbox (and spam folder). It may take a minute to arrive.")}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    resetAuthTurnstile();
                    setView("form");
                  }}
                  className="w-full"
                  size="lg"
                >
                  {tx("authDidntReceive", "Didn't receive an email? Try again")}
                </Button>
                {showDebugMagicLinkUi && (
                  <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-3">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      {tx("authDevelopmentLink", "Development link:")}
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

      <AlertDialog open={typoDialogOpen} onOpenChange={setTypoDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{tx("authUnusualEmailTitle", "Unusual email domain")}</AlertDialogTitle>
            <AlertDialogDescription>
              {tx("authUnusualEmailDesc", "That domain looks unusual and might be a typo. Continue anyway?")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tx("authGoBack", "Go back")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setTypoDialogOpen(false);
                void sendMagicLinkRequest({ skipTypoCheck: true });
              }}
            >
              {tx("authContinue", "Continue")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
