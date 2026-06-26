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
import { LANGUAGE_OPTIONS, type SupportedLanguage } from "@/utils/translation";
import { isPlausibleEmailFormat } from "@shared/isPlausibleEmailFormat";
import { sanitizeAuthReturnTo } from "@shared/sanitizeAuthReturnTo";
import { getTurnstileSiteKeyForClient } from "@/lib/turnstileClient";
import { ensureTurnstileScript } from "@/lib/turnstileScript";
import { Globe2, Loader2 } from "lucide-react";

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

function normalizeSignInPurpose(raw: unknown): "default" | "cloud_assist" {
  if (typeof raw !== "string") return "default";
  return raw.trim().toLowerCase() === "cloud_assist" ? "cloud_assist" : "default";
}

export default function Auth({ mode: _mode = "sign-in" }: { mode?: AuthMode }) {
  const { toast } = useToast();
  const { refreshUntilAuthenticated } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const tx = (key: string, fallback: string) => t[key] || fallback;
  const [email, setEmail] = useState("");
  const [isSendingMagicLink, setIsSendingMagicLink] = useState(false);
  const [isUsingPasskey, setIsUsingPasskey] = useState(false);
  const [debugMagicLink, setDebugMagicLink] = useState<string | null>(null);
  const [debugSignInCode, setDebugSignInCode] = useState<string | null>(null);
  const [signInToken, setSignInToken] = useState<string | null>(null);
  const [signInCode, setSignInCode] = useState("");
  const [isCompletingMagic, setIsCompletingMagic] = useState(false);
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
      purpose: normalizeSignInPurpose(params.get("purpose")),
      returnTo: sanitizeAuthReturnTo(params.get("returnTo")) ?? "/",
    };
  }, []);
  const isCloudAssistSignIn = signInContext.purpose === "cloud_assist";

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

  const isAnyAuthBusy = isSendingMagicLink || isUsingPasskey || isCompletingMagic;
  const currentLanguageLabel =
    LANGUAGE_OPTIONS.find((option) => option.code === language)?.nativeName ?? "English";

  const completeMagicFromAuthPage = async (emailCode: string) => {
    if (!signInToken) {
      toast({
        title: tx("authCheckEmailTitle", "Check your email"),
        description: tx(
          "authEmailCodeUnavailableDesc",
          "Use the Log in button in the email to finish without typing the code.",
        ),
      });
      return;
    }
    setIsCompletingMagic(true);
    try {
      const digits = emailCode.replace(/\D/g, "");
      if (digits.length !== 6) {
        toast({
          title: tx("authSignInCodeRequiredTitle", "Enter your code"),
          description: tx(
            "authSignInCodeRequiredDesc",
            "Use the 6-digit code from the email we just sent.",
          ),
          variant: "destructive",
        });
        return;
      }
      const result = await apiRequest<{ ok: boolean; totpRequired?: boolean }>(
        "/api/auth/magic/consume",
        "POST",
        { token: signInToken, emailCode: digits },
      );
      if (result?.totpRequired) {
        window.location.href = "/auth/totp";
        return;
      }
      await refreshUntilAuthenticated();
      window.location.href = signInContext.returnTo;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Sign-in could not be completed. Try again.";
      toast({
        title: tx("authMagicLinkFailedTitle", "Sign-in failed"),
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsCompletingMagic(false);
    }
  };

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
    setSignInToken(null);
    setSignInCode("");
    setDebugMagicLink(null);
    setDebugSignInCode(null);
    try {
      const response = await apiRequest<{
        debugMagicLink?: string;
        debugSignInCode?: string;
        signInToken?: string;
      }>(
        "/api/auth/magic/send",
        "POST",
        { email: trimmedEmail, turnstileToken, locale: language, returnTo: signInContext.returnTo },
      );
      if (import.meta.env.DEV && response.debugMagicLink) {
        setDebugMagicLink(response.debugMagicLink);
      }
      if (import.meta.env.DEV && response.debugSignInCode) {
        setDebugSignInCode(response.debugSignInCode);
      }
      if (typeof response.signInToken === "string" && response.signInToken.length > 0) {
        setSignInToken(response.signInToken);
      }
      setView("sent");
      toast({
        title: tx("authCheckEmailTitle", "Check your email"),
        description: tx("authCheckEmailDesc", "We sent a sign-in code and link if the address is valid."),
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
    <div className="min-h-screen bg-white text-gray-950 dark:bg-gray-950 dark:text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-[760px] flex-col px-6 pb-24 pt-20 sm:px-10 sm:pt-28">
        <main className="flex flex-1 flex-col justify-center">
          {view === "form" ? (
            <div className="mx-auto w-full max-w-[520px]">
              <div className="mb-14 text-center">
                <a href={localizedPath("/", language)} className="mb-9 inline-flex items-center justify-center">
                  <img
                    src="/brand/privateNote-logo-mark.png"
                    alt="PrivateNote"
                    className="h-12 w-12"
                    width={48}
                    height={48}
                  />
                </a>
                <h1 className="text-[34px] font-semibold leading-tight tracking-normal text-gray-950 dark:text-white sm:text-[42px]">
                  {isCloudAssistSignIn
                    ? tx("authCloudAssistHeroTitle", "Secure AI for private notes.")
                    : tx("authPrivateNoteHeroTitle", "Private notes, securely shared.")}
                </h1>
                <p className="mt-2 text-[28px] font-semibold leading-tight tracking-normal text-gray-400 dark:text-gray-500 sm:text-[34px]">
                  {tx("authPrivateNoteAccountTitle", "Log in or sign up to your PrivateNote account")}
                </p>
                {isCloudAssistSignIn && (
                  <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    {tx(
                      "authCloudAssistSubtitle",
                      "Enter your email to sign in. You'll return to your note to generate a hosted AI draft.",
                    )}
                  </p>
                )}
              </div>

              <div className="space-y-5">
                <form
                  className="space-y-5"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void sendMagicLinkRequest();
                  }}
                >
                  <div className="space-y-2">
                    <label htmlFor="email-input" className="text-[15px] font-semibold text-gray-700 dark:text-gray-300">
                      {tx("authEmailAddressShort", "Email")}
                    </label>
                    <Input
                      id="email-input"
                      type="email"
                      name="email"
                      autoComplete="email"
                      placeholder={tx("authEmailPlaceholder", "Enter your email address...")}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-16 rounded-xl border-gray-200 px-5 text-[22px] shadow-sm placeholder:text-gray-400 focus-visible:ring-primary/30 dark:border-gray-800 dark:bg-gray-900"
                    />
                    <p className="text-[15px] leading-relaxed text-gray-500 dark:text-gray-400">
                      {tx("authEmailSecureHint", "We’ll send a secure sign-in code and link to this address.")}
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isAnyAuthBusy}
                    className="h-16 w-full rounded-xl text-[20px] font-semibold shadow-sm"
                    size="lg"
                  >
                    {isSendingMagicLink ? tx("authSendingLink", "Sending link...") : tx("authContinue", "Continue")}
                  </Button>

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

                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
                  <button
                    type="button"
                    onClick={() => void handleLoginPasskey()}
                    disabled={isAnyAuthBusy || !passkeySupported}
                    className="font-medium text-gray-700 underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:text-gray-400 dark:text-gray-300 dark:disabled:text-gray-600"
                  >
                    {isUsingPasskey ? tx("authSigningIn", "Signing in...") : tx("authUsePasskey", "Use passkey")}
                  </button>
                  <span className="text-gray-300 dark:text-gray-700">|</span>
                  <a href="/auth/recovery" className="font-medium text-gray-700 underline-offset-4 hover:underline dark:text-gray-300">
                    {tx("authUseRecoveryCode", "Use a recovery code")}
                  </a>
                </div>

                {!passkeySupported && (
                  <p className="text-xs text-gray-500 text-center">
                    {tx("authPasskeysNotSupportedDesc", "This browser does not support passkeys.")}
                  </p>
                )}

                <p className="mx-auto max-w-[640px] text-center text-[15px] leading-relaxed text-gray-500 dark:text-gray-400">
                  {tx("authByContinuing", "By continuing, you acknowledge that you understand and agree to the")}{" "}
                  <a
                    href={localizedPath("/terms", language)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 underline underline-offset-2 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  >
                    {tx("authTermsAndConditions", "Terms & Conditions")}
                  </a>{" "}
                  {tx("authAnd", "and")}{" "}
                  <a
                    href={localizedPath("/privacy", language)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 underline underline-offset-2 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  >
                    {tx("privacyPolicy", "Privacy Policy")}
                  </a>
                  .
                </p>
              </div>
            </div>
          ) : (
            /* Sent State Card */
            <Card className="mx-auto w-full max-w-2xl border-2 border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl"></div>
                    <div className="relative z-10 w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                      <span className="text-3xl">✉️</span>
                    </div>
                  </div>
                </div>
                <CardTitle className="text-2xl">{tx("authCheckEmailTitle", "Check your email")}</CardTitle>
                <CardDescription className="text-base mt-2">
                  {tx("authUnifiedSentText", "If this address can receive PrivateNote email, a secure link is on its way to")}{" "}
                  <strong>{email.trim()}</strong>.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200 text-center">
                  {tx("authCheckInboxHint", "Check your inbox (and spam folder). It may take a minute to arrive.")}
                </p>
                {signInToken ? (
                  <form
                    className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
                    onSubmit={(event) => {
                      event.preventDefault();
                      void completeMagicFromAuthPage(signInCode);
                    }}
                  >
                    <div className="space-y-2">
                      <label htmlFor="auth-sign-in-code" className="block text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                        {tx(
                          "authCheckEmailCodeHint",
                          "Enter the 6-digit code from the email below. Prefer not to type it? Use the Log in button in the email.",
                        )}
                      </label>
                      <Input
                        id="auth-sign-in-code"
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={12}
                        placeholder="000000"
                        value={signInCode}
                        onChange={(e) => setSignInCode(e.target.value)}
                        className="text-center text-lg tracking-widest"
                        autoFocus
                      />
                    </div>
                    <Button
                      type="submit"
                      className="mt-3 w-full"
                      size="lg"
                      disabled={isCompletingMagic}
                    >
                      {isCompletingMagic ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {tx("authSigningIn", "Signing in…")}
                        </>
                      ) : (
                        tx("authContinueWithCode", "Continue with code")
                      )}
                    </Button>
                  </form>
                ) : (
                  <div className="rounded-lg border border-gray-200 bg-white p-4 text-center dark:border-gray-700 dark:bg-gray-900">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {tx(
                        "authEmailCodeUnavailableInline",
                        "Use the Log in button in the email to finish. Direct code entry is unavailable for this request.",
                      )}
                    </p>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    resetAuthTurnstile();
                    setSignInToken(null);
                    setSignInCode("");
                    setView("form");
                  }}
                  className="mx-auto block text-sm font-medium text-blue-600 underline-offset-4 hover:underline dark:text-blue-400"
                >
                  {tx("authDidntReceive", "Didn't receive an email? Try again")}
                </button>
                {showDebugMagicLinkUi && (
                  <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-3 space-y-3">
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                        {tx("authDevelopmentLink", "Development link:")}
                      </p>
                      <Button asChild variant="secondary" size="sm" className="w-full mb-2">
                        <a href={debugMagicLink ?? "#"}>Open sign-in page</a>
                      </Button>
                      <p className="text-xs text-gray-600 dark:text-gray-300 break-all font-mono">
                        {debugMagicLink}
                      </p>
                    </div>
                    {debugSignInCode && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Development code:
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-300 font-mono tracking-widest">
                          {debugSignInCode}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </main>

        <div className="mt-10 flex justify-center">
          <label className="relative inline-flex items-center gap-2 text-[18px] text-gray-500 dark:text-gray-400">
            <Globe2 className="h-5 w-5" aria-hidden="true" />
            <span>{tx("authLanguageLabel", "Language")}:</span>
            <select
              aria-label={tx("authLanguageLabel", "Language")}
              value={language}
              onChange={(event) => setLanguage(event.target.value as SupportedLanguage)}
              className="appearance-none bg-transparent py-1 pr-7 text-[18px] text-gray-500 outline-none hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {LANGUAGE_OPTIONS.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.code === "en" ? `${option.nativeName} (US)` : option.nativeName}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-gray-400">⌄</span>
            <span className="sr-only">{currentLanguageLabel}</span>
          </label>
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
