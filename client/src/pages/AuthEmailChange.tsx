import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest, ApiRequestError } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { CheckCircle2, Loader2, AlertCircle, Mail } from "lucide-react";

/**
 * After we strip ?token= / ?t= from the address bar, the token stays in module memory until
 * verify finishes so Strict Mode remounts still see it. Not persisted to storage (unlike
 * sessionStorage), so other same-origin scripts cannot read it via the Storage API.
 * Cleared after cancel, when verify finishes (success or error, matching AuthMagic consume), or when leaving the flow.
 */
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

const EMAIL_CHANGE_ERROR_COPY: Record<string, string> = {
  email_change_token_missing: "This page needs a verification token from your email. Open the link from your verification message.",
  email_change_token_invalid:
    "This verification link has expired or was already used. Please request a new email change from Security settings.",
  email_change_payload_invalid:
    "We couldn’t read this verification link (data error). Please request a new email change.",
  email_change_account_gone: "This account no longer exists, so the email change can’t be completed.",
  email_change_email_unavailable:
    "That email address is no longer available on this service. Please start a new change and pick a different address.",
};

type Phase = "pending" | "confirm" | "loading" | "success" | "error";

export default function AuthEmailChange() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { refresh } = useAuth();
  const [phase, setPhase] = useState<Phase>("pending");
  const [message, setMessage] = useState<string>("");
  const [newEmail, setNewEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const verifyInFlightRef = useRef(false);
  /** Drives disabled on Confirm while a request is starting (before phase switches to loading). */
  const [verifyBusy, setVerifyBusy] = useState(false);

  useEffect(() => {
    const t = takeEmailChangeTokenOnce();
    if (!t) {
      setPhase("error");
      setMessage("Missing verification token. Open the link from your verification email.");
      return;
    }
    setToken(t);
    setMessage("You requested an email change. Confirm it here to update your account email.");
    setPhase("confirm");
  }, []);

  const runVerify = async () => {
    if (!token || phase === "loading" || verifyInFlightRef.current) return;
    verifyInFlightRef.current = true;
    setVerifyBusy(true);
    setPhase("loading");
    setMessage("Updating your email address…");

    try {
      const response = await apiRequest<{
        ok: boolean;
        message: string;
        newEmail?: string;
        code?: string;
      }>("/api/auth/email/change/verify", "POST", { token });
      setToken(null);
      setPhase("success");
      setMessage("Your email address has been updated.");
      if (response.newEmail) {
        setNewEmail(response.newEmail);
      }
      await refresh();
      toast({
        title: "Email updated",
        description: "Your email address has been changed successfully.",
      });
    } catch (error) {
      setPhase("error");
      setToken(null);
      const reqError = error instanceof ApiRequestError ? error : null;

      if (reqError) {
        try {
          const body = JSON.parse(reqError.bodyText) as { message?: string; code?: string };
          const byCode = body.code && EMAIL_CHANGE_ERROR_COPY[body.code];
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
      setMessage("We couldn't verify your new email address. Please try again.");
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
              <CardTitle className="text-xl">Loading…</CardTitle>
              <CardDescription className="text-base mt-2">
                Checking your verification link and preparing this page.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {phase === "confirm" && token && (
          <Card className="border-2">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <Mail className="h-12 w-12 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl">Confirm email change</CardTitle>
              <CardDescription className="text-base mt-2">{message}</CardDescription>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center text-balance max-w-md mt-3">
                This confirmation step helps prevent automated email scanners from changing your address without you.
              </p>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <Button size="lg" onClick={() => void runVerify()} disabled={confirmSubmitDisabled}>
                Confirm new email
              </Button>
              <Button variant="outline" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
            </CardContent>
          </Card>
        )}

        {phase === "loading" && (
          <Card className="border-2">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <Loader2 className="h-12 w-12 text-primary animate-spin" />
                  <Mail className="h-6 w-6 text-primary absolute -top-1 -right-1 animate-pulse" />
                </div>
              </div>
              <CardTitle className="text-2xl">Updating your email…</CardTitle>
              <CardDescription className="text-base mt-2">{message}</CardDescription>
            </CardHeader>
          </Card>
        )}

        {phase === "success" && (
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
                  Email Change
                </p>
                <CardTitle className="text-3xl text-gray-900 dark:text-white">
                  Email Updated
                </CardTitle>
                <CardDescription className="text-lg text-gray-700 dark:text-gray-300">
                  {message}
                </CardDescription>
                <div className="text-base text-gray-600 dark:text-gray-400 text-center pt-2 space-y-2">
                  <p className="text-balance">Use this email the next time you sign in.</p>
                  <p className="text-balance">Your previous email is no longer linked to this account.</p>
                </div>
                {newEmail && (
                  <p className="text-sm font-mono text-gray-600 dark:text-gray-400 mt-2">
                    New email: {newEmail}
                  </p>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => setLocation("/account")} size="lg">
                  Go to Security Settings
                </Button>
                <Button variant="outline" onClick={() => setLocation("/")} size="lg">
                  Go to Home
                </Button>
              </div>
            </CardContent>
          </Card>
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
                  Email Change
                </p>
                <CardTitle className="text-3xl text-gray-900 dark:text-white">
                  Verification Failed
                </CardTitle>
                <CardDescription className="text-lg text-gray-700 dark:text-gray-300">
                  {message}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => setLocation("/account")} size="lg">
                  Go to Security Settings
                </Button>
                <Button variant="outline" onClick={() => setLocation("/")} size="lg">
                  Go to Home
                </Button>
              </div>
              <div className="rounded-lg bg-red-100/50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
                <p className="text-sm text-red-800 dark:text-red-300 text-center">
                  <strong>Note:</strong> Verification links expire after 1 hour and can only be used once.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
