import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest, ApiRequestError } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { CheckCircle2, Loader2, AlertCircle, Mail } from "lucide-react";
import type { Translations } from "@/utils/translations/types";

let emailChangeTokenCache: string | null = null;

function clearEmailChangeTokenCache(): void {
  emailChangeTokenCache = null;
}

function takeEmailChangeTokenOnce(): string | null {
  const url = new URL(window.location.href);
  const fromQuery = url.searchParams.get("token") || url.searchParams.get("t");
  if (fromQuery) {
    emailChangeTokenCache = fromQuery;
    url.searchParams.delete("token");
    url.searchParams.delete("t");
    const next = `${url.pathname}${url.search}${url.hash}`;
    window.history.replaceState(null, "", next);
    return fromQuery;
  }
  return emailChangeTokenCache;
}

function emailChangeErrorCopy(t: Translations, code: string): string | undefined {
  const map: Record<string, string | undefined> = {
    email_change_token_missing: t.authEmailChangeErrTokenMissing,
    email_change_token_invalid: t.authEmailChangeErrTokenInvalid,
    email_change_payload_invalid: t.authEmailChangeErrPayloadInvalid,
    email_change_account_gone: t.authEmailChangeErrAccountGone,
    email_change_email_unavailable: t.authEmailChangeErrEmailUnavailable,
  };
  return map[code];
}

type Phase = "pending" | "confirm" | "loading" | "success" | "error";

export default function AuthEmailChange() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { refresh } = useAuth();
  const { t } = useLanguage();
  const [phase, setPhase] = useState<Phase>("pending");
  const [message, setMessage] = useState<string>("");
  const [newEmail, setNewEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const verifyInFlightRef = useRef(false);
  const [verifyBusy, setVerifyBusy] = useState(false);

  useEffect(() => {
    const tok = takeEmailChangeTokenOnce();
    if (!tok) {
      setPhase("error");
      setMessage(t.authEmailChangeMissingToken);
      return;
    }
    setToken(tok);
    setMessage(t.authEmailChangeConfirmPrompt);
    setPhase("confirm");
  }, [t.authEmailChangeConfirmPrompt, t.authEmailChangeMissingToken]);

  const runVerify = async () => {
    if (!token || phase === "loading" || verifyInFlightRef.current) return;
    verifyInFlightRef.current = true;
    setVerifyBusy(true);
    setPhase("loading");
    setMessage(t.authEmailChangeUpdatingMessage);

    try {
      const response = await apiRequest<{
        ok: boolean;
        message: string;
        newEmail?: string;
        code?: string;
      }>("/api/auth/email/change/verify", "POST", { token });
      setToken(null);
      setPhase("success");
      setMessage(t.authEmailChangeSuccessMessage);
      if (response.newEmail) {
        setNewEmail(response.newEmail);
      }
      await refresh();
      toast({
        title: t.authEmailChangeToastTitle,
        description: t.authEmailChangeToastDesc,
      });
    } catch (error) {
      setPhase("error");
      setToken(null);
      const reqError = error instanceof ApiRequestError ? error : null;

      if (reqError) {
        try {
          const body = JSON.parse(reqError.bodyText) as { message?: string; code?: string };
          const byCode = body.code ? emailChangeErrorCopy(t, body.code) : undefined;
          if (byCode) {
            setMessage(byCode);
            return;
          }
          if (body.message) {
            setMessage(body.message);
            return;
          }
        } catch {
          /* ignore */
        }
      }
      setMessage(t.authEmailChangeVerifyFailed);
    } finally {
      verifyInFlightRef.current = false;
      setVerifyBusy(false);
      clearEmailChangeTokenCache();
    }
  };

  const handleCancel = () => {
    clearEmailChangeTokenCache();
    setLocation("/account");
  };

  const confirmSubmitDisabled = phase === "loading" || !token || verifyBusy;

  return (
    <div className="pt-16 pb-16 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
      <div className="space-y-6">
        {phase === "pending" && (
          <Card className="border-2">
            <CardHeader className="text-center pb-4">
              <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto mb-4" />
              <CardTitle className="text-xl">{t.authEmailChangeLoadingTitle}</CardTitle>
              <CardDescription className="text-base mt-2">{t.authEmailChangeLoadingDesc}</CardDescription>
            </CardHeader>
          </Card>
        )}

        {phase === "confirm" && token && (
          <Card className="border-2">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <Mail className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-2xl">{t.authEmailChangeConfirmTitle}</CardTitle>
              <CardDescription className="text-base mt-2">{message}</CardDescription>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center text-balance max-w-md mt-3">
                {t.authEmailChangeConfirmHint}
              </p>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <Button size="lg" onClick={() => void runVerify()} disabled={confirmSubmitDisabled}>
                {t.authEmailChangeConfirmButton}
              </Button>
              <Button variant="outline" size="sm" onClick={handleCancel}>
                {t.authEmailChangeCancel}
              </Button>
            </CardContent>
          </Card>
        )}

        {phase === "loading" && (
          <Card className="border-2">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
              </div>
              <CardTitle className="text-2xl">{t.authEmailChangeUpdatingTitle}</CardTitle>
              <CardDescription className="text-base mt-2">{message}</CardDescription>
            </CardHeader>
          </Card>
        )}

        {phase === "success" && (
          <Card className="border-2 border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
            <CardHeader className="text-center pb-4">
              <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-500 mx-auto mb-4" />
              <p className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wider">
                {t.authEmailChangeBadge}
              </p>
              <CardTitle className="text-3xl text-gray-900 dark:text-white">{t.authEmailChangeSuccessTitle}</CardTitle>
              <CardDescription className="text-lg text-gray-700 dark:text-gray-300">{message}</CardDescription>
              <div className="text-base text-gray-600 dark:text-gray-400 text-center pt-2 space-y-2">
                <p className="text-balance">{t.authEmailChangeSuccessUseEmail}</p>
                <p className="text-balance">{t.authEmailChangeSuccessOldEmail}</p>
              </div>
              {newEmail && (
                <p className="text-sm font-mono text-gray-600 dark:text-gray-400 mt-2">
                  {t.authEmailChangeNewEmailLabel} {newEmail}
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => setLocation("/account")} size="lg">
                  {t.authEmailChangeGoToSecurity}
                </Button>
                <Button variant="outline" onClick={() => setLocation("/")} size="lg">
                  {t.authEmailChangeGoToHome}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {phase === "error" && (
          <Card className="border-2 border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20">
            <CardHeader className="text-center pb-4">
              <AlertCircle className="h-16 w-16 text-red-600 dark:text-red-500 mx-auto mb-4" />
              <p className="text-xs font-medium text-red-600 dark:text-red-400 uppercase tracking-wider">
                {t.authEmailChangeBadge}
              </p>
              <CardTitle className="text-3xl text-gray-900 dark:text-white">{t.authEmailChangeFailedTitle}</CardTitle>
              <CardDescription className="text-lg text-gray-700 dark:text-gray-300">{message}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => setLocation("/account")} size="lg">
                  {t.authEmailChangeGoToSecurity}
                </Button>
                <Button variant="outline" onClick={() => setLocation("/")} size="lg">
                  {t.authEmailChangeGoToHome}
                </Button>
              </div>
              <div className="rounded-lg bg-red-100/50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
                <p className="text-sm text-red-800 dark:text-red-300 text-center">{t.authEmailChangeExpiryNote}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
