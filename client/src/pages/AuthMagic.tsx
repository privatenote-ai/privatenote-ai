import { useEffect, useRef, useState } from "react";
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
import { useLanguage } from "@/context/LanguageContext";
import { sanitizeAuthReturnTo } from "@shared/sanitizeAuthReturnTo";
import { CheckCircle2, Loader2, AlertCircle, KeyRound, Sparkles } from "lucide-react";

/**
 * After we strip ?t= / ?token= / #token= from the address bar, the token stays here until consume
 * finishes so Strict Mode remounts still see it. Cleared after use.
 */
let magicLinkTokenCache: string | null = null;
let magicLinkReturnToCache: string = "/";
let magicLinkReturnToFromUrlCache = false;

function takeMagicLinkContextOnce(): {
  token: string | null;
  returnTo: string;
  returnToFromUrl: boolean;
} {
  const url = new URL(window.location.href);
  const fromQuery = url.searchParams.get("t") || url.searchParams.get("token");
  const hash = url.hash.startsWith("#") ? url.hash.slice(1) : url.hash;
  const fromHash = hash ? new URLSearchParams(hash).get("token") : null;
  const fromUrl = fromQuery || fromHash;
  const returnToFromUrl = sanitizeAuthReturnTo(url.searchParams.get("returnTo"));
  const returnTo = returnToFromUrl ?? "/";

  if (fromUrl) {
    magicLinkTokenCache = fromUrl;
    magicLinkReturnToCache = returnTo;
    magicLinkReturnToFromUrlCache = returnToFromUrl !== null;
    window.history.replaceState(null, "", url.pathname);
    return { token: fromUrl, returnTo, returnToFromUrl: returnToFromUrl !== null };
  }
  return {
    token: magicLinkTokenCache,
    returnTo: magicLinkReturnToCache,
    returnToFromUrl: magicLinkReturnToFromUrlCache,
  };
}

type Phase = "initial" | "confirm" | "loading" | "success" | "error";

export default function AuthMagic() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { refreshUntilAuthenticated } = useAuth();
  const { t } = useLanguage();
  const tx = (key: string, fallback: string) => t[key] || fallback;
  const [phase, setPhase] = useState<Phase>("initial");
  const [token, setToken] = useState<string | null>(null);
  const [friendlyMessage, setFriendlyMessage] = useState<string>("");
  const [hasPasskeys, setHasPasskeys] = useState<boolean | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [dismissedNudge, setDismissedNudge] = useState(false);
  const [emailCodeRequired, setEmailCodeRequired] = useState(false);
  const [oneTapAllowed, setOneTapAllowed] = useState(false);
  const [emailCode, setEmailCode] = useState("");
  const [returnTo, setReturnTo] = useState("/");
  const [returnToFromUrl, setReturnToFromUrl] = useState(false);
  const autoConsumeTokenRef = useRef<string | null>(null);

  const runConsume = async (
    options: {
      token?: string;
      emailCodeRequired?: boolean;
      emailCode?: string;
      returnTo?: string;
      returnToFromUrl?: boolean;
    } = {},
  ) => {
    const activeToken = options.token ?? token;
    const requiresCode = options.emailCodeRequired ?? emailCodeRequired;
    const activeEmailCode = options.emailCode ?? emailCode;
    const nextReturnTo = options.returnTo ?? returnTo;
    const nextReturnToFromUrl = options.returnToFromUrl ?? returnToFromUrl;
    if (!activeToken) return;
    if (requiresCode) {
      const digits = activeEmailCode.replace(/\D/g, "");
      if (digits.length !== 6) {
        toast({
          title: tx("authMagicEnterCodeTitle", "Enter the code"),
          description: tx("authMagicEnterCodeDesc", "Use the 6-digit code from the email we just sent."),
          variant: "destructive",
        });
        return;
      }
    }
    setPhase("loading");
    setFriendlyMessage(tx("authMagicCompletingDesc", "Completing sign-in…"));

    try {
      const payload: { token: string; emailCode?: string } = { token: activeToken };
      if (requiresCode) {
        payload.emailCode = activeEmailCode.replace(/\D/g, "").slice(0, 6);
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
      setFriendlyMessage(tx("authMagicSignedInDesc", "You're signed in."));
      // Retry: D1 read-after-write lag can briefly return authenticated:false.
      await refreshUntilAuthenticated();
      if (nextReturnToFromUrl) {
        window.location.href = nextReturnTo;
        return;
      }
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
                ? tx(
                    "authMagicOtpExhaustedDesc",
                    "Too many incorrect codes. Open the sign-in link from your email again to start over with a new code.",
                  )
                : tx(
                    "authMagicBindExpiredDesc",
                    "This confirmation step expired. Open the link from your email again so we can verify your browser, then press Continue.",
                  ),
            );
            return;
          }
          if (body.code === "magic_email_code_required" || body.code === "magic_email_code_invalid") {
            setEmailCodeRequired(true);
            setPhase("confirm");
            setFriendlyMessage(
              body.code === "magic_email_code_invalid"
                ? tx("authMagicCodeInvalidDesc", "That code doesn’t match. Check the latest email and try again.")
                : tx("authMagicCodeRequiredDesc", "Enter the 6-digit code from your email, then press Continue sign in."),
            );
            return;
          }
          if (body.code === "origin_required") {
            setFriendlyMessage(
              tx(
                "authMagicOriginRequiredDesc",
                "Sign-in must continue from the site in your browser. Open the link in this tab again or request a new link.",
              ),
            );
            return;
          }
        } catch {
          /* ignore */
        }
      }
      const raw = error instanceof Error ? error.message : "Magic link failed.";
      if (typeof raw === "string" && raw.toLowerCase().includes("expired")) {
        setFriendlyMessage(tx("authMagicExpiredDesc", "This link has expired. Please request a new sign-in link."));
      } else if (typeof raw === "string" && raw.toLowerCase().includes("invalid")) {
        setFriendlyMessage(tx("authMagicInvalidDesc", "This sign-in link is no longer valid. Please request a new one."));
      } else {
        setFriendlyMessage(tx("authMagicVerifyGenericDesc", "We couldn’t verify that link. Please request a new sign-in link."));
      }
    } finally {
      magicLinkTokenCache = null;
    }
  };

  useEffect(() => {
    const { token: t, returnTo: nextReturnTo, returnToFromUrl: nextReturnToFromUrl } =
      takeMagicLinkContextOnce();
    setReturnTo(nextReturnTo);
    setReturnToFromUrl(nextReturnToFromUrl);
    if (!t) {
      setPhase("error");
      setFriendlyMessage(tx("authMagicMissingLinkDesc", "Open the sign-in link from your email on this device, or request a new link."));
      return;
    }
    setToken(t);

    void (async () => {
      try {
        const prep = await apiRequest<{
          ok?: boolean;
          emailCodeRequired?: boolean;
          oneTapAllowed?: boolean;
          riskLevel?: string;
        }>("/api/auth/magic/prepare", "POST", { token: t });

        const needCode = prep?.emailCodeRequired === true;
        const canOneTap = prep?.oneTapAllowed === true;
        setEmailCodeRequired(needCode);
        setOneTapAllowed(canOneTap);
        if (needCode) {
          setFriendlyMessage(
            tx(
              "authMagicMediumRiskDesc",
              "Your network or browser looks different from when the link was sent. Enter the 6-digit code from the same email, then continue.",
            ),
          );
          setPhase("confirm");
          return;
        }
        if (canOneTap && autoConsumeTokenRef.current !== t) {
          autoConsumeTokenRef.current = t;
          await runConsume({
            token: t,
            emailCodeRequired: false,
            returnTo: nextReturnTo,
            returnToFromUrl: nextReturnToFromUrl,
          });
          return;
        }
        setFriendlyMessage(
          tx("authMagicLowRiskDesc", "You opened the sign-in link from your email. Press Log in below to finish in this browser."),
        );
        setPhase("confirm");
      } catch (err) {
        if (err instanceof ApiRequestError && err.status === 403) {
          try {
            const body = JSON.parse(err.bodyText) as { code?: string };
            if (body.code === "context_high_risk") {
              setPhase("error");
              setFriendlyMessage(
                tx(
                  "authMagicHighRiskDesc",
                  "This link doesn’t match this device or network closely enough. Request a new sign-in link and open it here.",
                ),
              );
              return;
            }
            if (body.code === "origin_required") {
              setPhase("error");
              setFriendlyMessage(
                tx(
                  "authMagicOriginRequiredDesc",
                  "Sign-in must continue from the site in your browser. Open the link in this tab again or request a new link.",
                ),
              );
              return;
            }
          } catch {
            /* ignore */
          }
        }
        setPhase("error");
        setFriendlyMessage(
          tx("authMagicVerifyFailedDesc", "We couldn’t verify that sign-in link. Open it from your email again, or request a new link."),
        );
      }
    })();
  }, []);

  const handleRegisterPasskey = async () => {
    if (typeof window === "undefined" || !("PublicKeyCredential" in window)) {
      toast({
        title: tx("authPasskeysNotSupportedTitle", "Passkeys not supported"),
        description: tx("authPasskeysNotSupportedDesc", "This browser does not support passkeys."),
      });
      return;
    }
    setIsRegistering(true);
    try {
      await registerPasskeyWithRetry();
      setHasPasskeys(true);
      toast({
        title: tx("authMagicPasskeyAddedTitle", "Passkey added"),
        description: tx("authMagicPasskeyAddedDesc", "You can sign in with this passkey on this device."),
      });
    } catch (error) {
      toast({
        title: tx("authMagicPasskeyFailedTitle", "Passkey registration failed"),
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
              <CardTitle className="text-2xl">{tx("authMagicContinueTitle", "Continue sign in")}</CardTitle>
              <CardDescription className="text-base mt-2">{friendlyMessage}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              {emailCodeRequired && (
                <div className="w-full max-w-xs space-y-2">
                  <label htmlFor="magic-email-code" className="text-sm font-medium text-center block">
                    {tx("authMagicEmailCodeLabel", "6-digit code from email")}
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
                    autoFocus
                  />
                </div>
              )}
              <Button type="button" size="lg" className="min-w-[200px]" onClick={() => void runConsume()}>
                {oneTapAllowed && !emailCodeRequired
                  ? tx("authMagicLoginButton", "Log in")
                  : tx("authMagicContinueButton", "Continue sign in")}
              </Button>
              {oneTapAllowed && !emailCodeRequired ? (
                <p className="text-xs text-muted-foreground text-center max-w-md">
                  {tx("authMagicSessionStartsAfterConfirm", "Your session starts after you confirm here, not from the link alone.")}
                </p>
              ) : null}
            </CardContent>
          </Card>
        )}

        {phase === "initial" && (
          <Card className="border-2">
            <CardHeader className="text-center pb-4">
              <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto mb-2" />
              <CardTitle className="text-2xl">{tx("authMagicCheckingTitle", "Checking your sign-in link…")}</CardTitle>
              <CardDescription className="text-base mt-2">
                {tx(
                  "authMagicCheckingDesc",
                  "Validating the link and binding this browser. No session is created until you continue.",
                )}
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
              <CardTitle className="text-2xl">{tx("authMagicSigningInTitle", "Signing you in…")}</CardTitle>
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
                    {tx("authMagicLabel", "Magic Link")}
                  </p>
                  <CardTitle className="text-3xl text-gray-900 dark:text-white">
                    {tx("authMagicSuccessTitle", "Success")}
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-700 dark:text-gray-300">
                    {tx("authMagicSignedInDesc", "You're signed in.")}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setLocation(returnTo)}
                    size="lg"
                    className="min-w-[140px]"
                  >
                    {returnTo === "/"
                      ? tx("authMagicContinueHome", "Continue to Home")
                      : tx("authContinue", "Continue")}
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
                        {tx("authMagicPasskeyNudgeTitle", "Secure your account with a passkey")}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {tx("authMagicPasskeyNudgeDesc", "Faster sign-in. No emails. No passwords.")}
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
                          {tx("authMagicPasskeySettingUp", "Setting up...")}
                        </>
                      ) : (
                        <>
                          <KeyRound className="mr-2 h-4 w-4" />
                          {tx("authMagicPasskeyAdd", "Add passkey")}
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
                      {tx("authMagicMaybeLater", "Maybe later")}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    {tx(
                      "authMagicPasskeyNudgeFootnote",
                      "Passkeys use biometric authentication for secure, passwordless sign-in.",
                    )}
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
                  {tx("authMagicLabel", "Magic Link")}
                </p>
                <CardTitle className="text-3xl text-gray-900 dark:text-white">
                  {tx("authMagicProblemTitle", "Link Problem")}
                </CardTitle>
                <CardDescription className="text-lg text-gray-700 dark:text-gray-300">
                  {friendlyMessage}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild className="flex-1" size="lg">
                  <a href="/auth/sign-in">{tx("authMagicGetNewLink", "Get a new link")}</a>
                </Button>
                <Button variant="outline" asChild className="flex-1" size="lg">
                  <a href="/auth/sign-in">{tx("authRetry", "Retry")}</a>
                </Button>
              </div>
              <div className="rounded-lg bg-red-100/50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
                <p className="text-sm text-red-800 dark:text-red-300 text-center">
                  <strong>{tx("authMagicSecurityNoteTitle", "Security note:")}</strong>{" "}
                  {tx(
                    "authMagicSecurityNoteDesc",
                    "Magic links expire after a short time (about ten minutes) and can only be used once.",
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
