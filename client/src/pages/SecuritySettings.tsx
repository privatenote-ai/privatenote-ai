import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, ApiRequestError } from "@/lib/queryClient";
import { useAuth } from "@/context/AuthContext";
import { AccountSecuritySection } from "@/pages/security-settings/AccountSecuritySection";
import { ChangeEmailDialog } from "@/pages/security-settings/ChangeEmailDialog";
import { PasskeyResetDialog } from "@/pages/security-settings/PasskeyResetDialog";
import { ManagePasskeysDialog } from "@/pages/security-settings/ManagePasskeysDialog";
import { DevicesSection } from "@/pages/security-settings/DevicesSection";
import { isForbiddenApiError } from "@/pages/security-settings/forbidden";
import { TotpSetupDialog } from "@/pages/security-settings/TotpSetupDialog";
import { executeStepUp, withOptionalStepUp } from "@/pages/security-settings/stepUp";
import { toastStepUpFailure } from "@/pages/security-settings/stepUpNotifications";
import { useSecuritySettingsData } from "@/pages/security-settings/useSecuritySettingsData";
import { useStepUpAuth } from "@/pages/security-settings/useStepUpAuth";
import {
  passkeyRegistrationErrorMessage,
  registerPasskeyWithRetry,
} from "@/pages/security-settings/registerPasskeyWithRetry";
import { isPlausibleEmailFormat } from "@shared/isPlausibleEmailFormat";
import { AccountSettingsShell } from "@/pages/account/AccountSettingsShell";
import { useLanguage } from "@/context/LanguageContext";

type TotpSetupResponse = { setupId: string; secret: string; otpauthUri: string };

export default function SecuritySettings() {
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const stepUpForRetry = useStepUpAuth();

  const {
    loading,
    signedIn,
    email,
    passkeys,
    setPasskeys,
    sessions,
    recoveryRemaining,
    recoveryGeneratedAt,
    totpEnabled,
    setTotpEnabled,
    refreshAll,
  } = useSecuritySettingsData(user?.email);

  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);
  const [registeringPasskey, setRegisteringPasskey] = useState(false);
  const [emailChangeDialogOpen, setEmailChangeDialogOpen] = useState(false);
  const [newEmailInput, setNewEmailInput] = useState("");
  const [changingEmail, setChangingEmail] = useState(false);
  const [emailChangeSent, setEmailChangeSent] = useState(false);
  const [emailChangeTotpCode, setEmailChangeTotpCode] = useState("");
  const [totpDialogOpen, setTotpDialogOpen] = useState(false);
  const [totpSetupStep, setTotpSetupStep] = useState<"qr" | "verify" | "done">("qr");
  const [totpSecret, setTotpSecret] = useState<string | null>(null);
  const [totpOtpauthUri, setTotpOtpauthUri] = useState<string | null>(null);
  const [totpSetupId, setTotpSetupId] = useState<string | null>(null);
  const [totpCode, setTotpCode] = useState("");
  const [totpVerifying, setTotpVerifying] = useState(false);
  const [totpSettingUp, setTotpSettingUp] = useState(false);
  const [totpDisabling, setTotpDisabling] = useState(false);
  const [revokingAllSessions, setRevokingAllSessions] = useState(false);
  const [revokingSessionId, setRevokingSessionId] = useState<string | null>(null);
  const [generatingRecoveryCodes, setGeneratingRecoveryCodes] = useState(false);
  const [resettingPasskeys, setResettingPasskeys] = useState(false);
  const [passkeyResetDialogOpen, setPasskeyResetDialogOpen] = useState(false);
  const [passkeyResetTotpCode, setPasskeyResetTotpCode] = useState("");
  const [recoveryTotpCode, setRecoveryTotpCode] = useState("");
  const [recoveryAuthenticatorFallbackOpen, setRecoveryAuthenticatorFallbackOpen] = useState(false);
  const [managePasskeysOpen, setManagePasskeysOpen] = useState(false);
  const [renamingPasskeyId, setRenamingPasskeyId] = useState<string | null>(null);
  const [deletingPasskeyId, setDeletingPasskeyId] = useState<string | null>(null);

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    [],
  );

  const applyTotpSetupPayload = useCallback((data: TotpSetupResponse) => {
    setTotpSetupId(data.setupId);
    setTotpSecret(data.secret);
    setTotpOtpauthUri(data.otpauthUri);
    setTotpSetupStep("qr");
    setTotpCode("");
    setTotpDialogOpen(true);
  }, []);

  const closeEmailChangeDialog = useCallback(() => {
    setEmailChangeDialogOpen(false);
    setNewEmailInput("");
    setEmailChangeSent(false);
    setEmailChangeTotpCode("");
  }, []);

  const closePasskeyResetDialog = useCallback(() => {
    setPasskeyResetDialogOpen(false);
    setPasskeyResetTotpCode("");
  }, []);

  const closeManagePasskeysDialog = useCallback(() => {
    setManagePasskeysOpen(false);
    setRenamingPasskeyId(null);
    setDeletingPasskeyId(null);
  }, []);

  const closeTotpDialog = useCallback(() => {
    setTotpDialogOpen(false);
    setTotpSecret(null);
    setTotpOtpauthUri(null);
    setTotpSetupId(null);
    setTotpCode("");
    setTotpSetupStep("qr");
  }, []);

  useEffect(() => {
    if (authLoading) return;
    void refreshAll();
  }, [user, authLoading, refreshAll]);

  const copyEmail = useCallback(async () => {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      toast({ title: t.authSecCopyEmail || "Email copied", description: t.authSecToastEmailCopiedDesc });
    } catch {
      toast({
        title: t.authCopyFailedTitle || "Copy failed",
        description: t.authSecToastCopyEmailFailedDesc,
        variant: "destructive",
      });
    }
  }, [email, toast]);

  const handleAddPasskey = useCallback(async () => {
    if (typeof window === "undefined" || !("PublicKeyCredential" in window)) {
      toast({
        title: t.authPasskeysNotSupportedTitle || "Passkeys not supported",
        description: t.authPasskeysNotSupportedDesc || "This browser does not support passkeys.",
      });
      return;
    }

    setRegisteringPasskey(true);
    try {
      if (passkeys.length > 0) {
        const stepUp = await executeStepUp();
        if (!stepUp.ok) {
          toastStepUpFailure(toast, stepUp, t);
          return;
        }
      }
      await registerPasskeyWithRetry(t);
      toast({
        title: t.authSecAddPasskey || "Passkey added",
        description: t.authSecToastPasskeyAddedDesc,
      });
      await refreshAll();
    } catch (error) {
      toast({
        title: t.authSecToastPasskeyRegFailedTitle,
        description: passkeyRegistrationErrorMessage(error, t),
        variant: "destructive",
      });
    } finally {
      setRegisteringPasskey(false);
    }
  }, [passkeys.length, toast, refreshAll]);

  const handleRenamePasskey = useCallback(
    async (passkeyId: string, displayName: string) => {
      setRenamingPasskeyId(passkeyId);
      try {
        await apiRequest(`/api/auth/passkeys/${passkeyId}`, "PATCH", { displayName });
        toast({
          title: t.authSecSave || "Passkey updated",
          description: displayName.trim() ? t.authSecToastPasskeyNameSaved : t.authSecToastPasskeyNameCleared,
        });
        await refreshAll();
      } catch (error) {
        toast({
          title: t.authSecToastRenameFailedTitle,
          description: error instanceof Error ? error.message : t.authSecToastTryAgain,
          variant: "destructive",
        });
        throw error;
      } finally {
        setRenamingPasskeyId(null);
      }
    },
    [refreshAll, t, toast],
  );

  const handleDeletePasskey = useCallback(
    async (passkeyId: string, label: string) => {
      const confirmed = window.confirm(`${t.authSecDeletePasskey || "Delete"} ${label}? ${t.authSecDeletePasskeyConfirmSuffix}`);
      if (!confirmed) return;
      setDeletingPasskeyId(passkeyId);
      try {
        await withOptionalStepUp(() => apiRequest(`/api/auth/passkeys/${passkeyId}`, "DELETE"), stepUpForRetry);
        toast({ title: t.authSecDeletePasskey || "Passkey deleted", description: t.authSecToastPasskeyDeletedDesc });
        await refreshAll();
      } catch (error) {
        toast({
          title: t.authSecToastDeleteFailedTitle,
          description: error instanceof Error ? error.message : t.authSecToastTryAgain,
          variant: "destructive",
        });
      } finally {
        setDeletingPasskeyId(null);
      }
    },
    [refreshAll, stepUpForRetry, t, toast],
  );

  const handleRevokeAllSessions = useCallback(async () => {
    const confirmed = window.confirm(t.authSecLogOutAllDevices || "Sign out every session except this one?");
    if (!confirmed) return;
    setRevokingAllSessions(true);
    try {
      await apiRequest("/api/auth/sessions/revoke-all", "POST");
      toast({ title: t.authSecLogOutAllDevices || "All devices logged out", description: t.authSecToastAllSessionsRevokedDesc });
      await refreshAll();
    } catch (error) {
      toast({
        title: t.authSecToastLogoutFailedTitle,
        description: error instanceof Error ? error.message : t.authSecToastTryAgain,
        variant: "destructive",
      });
    } finally {
      setRevokingAllSessions(false);
    }
  }, [toast, refreshAll]);

  const dismissRecoveryAuthenticatorFallback = useCallback(() => {
    setRecoveryAuthenticatorFallbackOpen(false);
    setRecoveryTotpCode("");
  }, []);

  const handleGenerateRecoveryCodes = useCallback(async () => {
    setGeneratingRecoveryCodes(true);
    try {
      const useTotp = totpEnabled && recoveryTotpCode.trim().length === 6;
      if (useTotp) {
        const response = await apiRequest<{ codes: string[] }>("/api/auth/recovery-codes/generate", "POST", {
          totpCode: recoveryTotpCode.trim(),
        });
        setRecoveryCodes(response.codes);
        setRecoveryTotpCode("");
        setRecoveryAuthenticatorFallbackOpen(false);
        toast({ title: t.authSecGenerateRecoveryCodes || "Recovery codes generated", description: t.authSecToastRecoveryCodesStore });
        return;
      }

      try {
        const response = await apiRequest<{ codes: string[] }>(
          "/api/auth/recovery-codes/generate",
          "POST",
        );
        setRecoveryCodes(response.codes);
        setRecoveryTotpCode("");
        setRecoveryAuthenticatorFallbackOpen(false);
        toast({ title: t.authSecGenerateRecoveryCodes || "Recovery codes generated", description: t.authSecToastRecoveryCodesStore });
        return;
      } catch (firstError) {
        if (!isForbiddenApiError(firstError)) throw firstError;
        const stepped = await stepUpForRetry();
        if (stepped) {
          const response = await apiRequest<{ codes: string[] }>(
            "/api/auth/recovery-codes/generate",
            "POST",
          );
          setRecoveryCodes(response.codes);
          setRecoveryTotpCode("");
          setRecoveryAuthenticatorFallbackOpen(false);
          toast({ title: t.authSecGenerateRecoveryCodes || "Recovery codes generated", description: t.authSecToastRecoveryCodesStore });
          return;
        }
        if (totpEnabled) {
          setRecoveryAuthenticatorFallbackOpen(true);
          toast({
            title: t.authSecToastUseAuthenticatorTitle,
            description: t.authSecToastUseAuthenticatorDesc,
          });
        }
        return;
      }
    } catch (error) {
      toast({
        title: t.authSecToastRecoveryCodesFailedTitle,
        description: error instanceof Error ? error.message : t.authSecToastTryAgain,
        variant: "destructive",
      });
    } finally {
      setGeneratingRecoveryCodes(false);
      await refreshAll();
    }
  }, [recoveryTotpCode, stepUpForRetry, toast, totpEnabled, refreshAll]);

  const handleRevokeSession = useCallback(
    async (sessionId: string) => {
      setRevokingSessionId(sessionId);
      try {
        await apiRequest("/api/auth/sessions/revoke", "POST", { sessionId });
      toast({ title: t.authSecLogOut || "Session revoked", description: t.authSecToastSessionRevokedDesc });
      await refreshAll();
    } catch (error) {
      toast({
        title: t.authSecToastRevokeFailedTitle,
        description: error instanceof Error ? error.message : t.authSecToastTryAgain,
        variant: "destructive",
      });
      } finally {
        setRevokingSessionId(null);
      }
    },
    [toast, refreshAll],
  );

  const handleResetPasskeys = useCallback(() => {
    if (passkeys.length === 0) {
      toast({ title: t.authSecNoPasskeys || "No passkeys", description: t.authSecToastNoPasskeysDesc });
      return;
    }
    setPasskeyResetTotpCode("");
    setPasskeyResetDialogOpen(true);
  }, [passkeys.length, toast]);

  const handlePasskeyResetWithTotp = useCallback(async () => {
    if (passkeyResetTotpCode.trim().length !== 6) return;
    setResettingPasskeys(true);
    try {
      await apiRequest("/api/auth/passkeys/reset", "POST", { totpCode: passkeyResetTotpCode.trim() });
      toast({ title: t.authSecRemoveAllPasskeys || "Passkeys removed", description: t.authSecToastPasskeysRemovedDesc });
      setPasskeys([]);
      closePasskeyResetDialog();
      await refreshAll();
    } catch (error) {
      toast({
        title: t.authSecToastCouldNotRemovePasskeysTitle,
        description: error instanceof Error ? error.message : t.authSecToastTryAgain,
        variant: "destructive",
      });
    } finally {
      setResettingPasskeys(false);
    }
  }, [closePasskeyResetDialog, passkeyResetTotpCode, refreshAll, setPasskeys, t, toast]);

  const handlePasskeyResetWithPasskey = useCallback(async () => {
    setResettingPasskeys(true);
    try {
      const stepped = await stepUpForRetry();
      if (!stepped) return;
      await apiRequest("/api/auth/passkeys/reset", "POST");
      toast({ title: t.authSecRemoveAllPasskeys || "Passkeys removed", description: t.authSecToastPasskeysRemovedDesc });
      setPasskeys([]);
      closePasskeyResetDialog();
      await refreshAll();
    } catch (error) {
      toast({
        title: t.authSecToastCouldNotRemovePasskeysTitle,
        description: error instanceof Error ? error.message : t.authSecToastTryAgain,
        variant: "destructive",
      });
    } finally {
      setResettingPasskeys(false);
    }
  }, [closePasskeyResetDialog, refreshAll, setPasskeys, stepUpForRetry, t, toast]);

  const handleChangeEmail = useCallback(async () => {
    if (!newEmailInput.trim()) {
      toast({
        title: t.authSecToastEmailRequiredTitle,
        description: t.authSecToastEmailRequiredDesc,
        variant: "destructive",
      });
      return;
    }

    if (!isPlausibleEmailFormat(newEmailInput)) {
      toast({
        title: t.authSecToastInvalidEmailTitle,
        description: t.authSecToastInvalidEmailDesc,
        variant: "destructive",
      });
      return;
    }

    const normalizedNew = newEmailInput.trim().toLowerCase();
    const normalizedCurrent = (email ?? "").trim().toLowerCase();

    if (normalizedNew === normalizedCurrent) {
      toast({
        title: t.authSecToastSameEmailTitle,
        description: t.authSecToastSameEmailDesc,
        variant: "destructive",
      });
      return;
    }

    setChangingEmail(true);
    try {
      const useTotpForEmail =
        passkeys.length > 0 && totpEnabled && emailChangeTotpCode.trim().length === 6;
      if (passkeys.length > 0 && !useTotpForEmail) {
        const r = await executeStepUp();
        if (!r.ok) {
          toast({
            title: t.authSecToastVerifyItsYouTitle,
            description:
              totpEnabled && emailChangeTotpCode.trim().length === 0
                ? t.authSecToastVerifyPasskeyOrTotp
                : t.authSecToastVerifyPasskeyForEmail,
            variant: "destructive",
          });
          return;
        }
      }

      await apiRequest("/api/auth/email/change/request", "POST", {
        newEmail: normalizedNew,
        ...(totpEnabled && emailChangeTotpCode.trim().length === 6
          ? { totpCode: emailChangeTotpCode.trim() }
          : {}),
      });

      setEmailChangeSent(true);
      setEmailChangeTotpCode("");
      toast({
        title: t.authSecChangeEmailTitle || "Confirmation link sent",
        description: t.authSecToastChangeEmailSentDesc,
      });
    } catch (error) {
      let desc = t.authSecToastChangeEmailFailedDefault;
      if (error instanceof ApiRequestError) {
        try {
          const j = JSON.parse(error.bodyText) as { message?: string };
          if (j.message) desc = j.message;
        } catch {
          /* keep default */
        }
      } else if (error instanceof Error) {
        desc = error.message;
      }
      if (isForbiddenApiError(error)) {
        toast({
          title: t.authSecToastVerifyItsYouTitle,
          description: desc,
          variant: "destructive",
        });
      } else {
        toast({
          title: t.authSecToastChangeEmailFailedTitle,
          description: desc,
          variant: "destructive",
        });
      }
    } finally {
      setChangingEmail(false);
    }
  }, [email, emailChangeTotpCode, newEmailInput, passkeys.length, toast, totpEnabled]);

  const handleTotpSetup = useCallback(async () => {
    setTotpSettingUp(true);
    try {
      const data = await withOptionalStepUp(
        () => apiRequest<TotpSetupResponse>("/api/auth/totp/setup", "POST"),
        stepUpForRetry,
      );
      applyTotpSetupPayload(data);
    } catch (error) {
      toast({
        title: t.authSecToastTotpSetupFailedTitle,
        description: error instanceof Error ? error.message : t.authSecToastTotpSetupFailedDefault,
        variant: "destructive",
      });
    } finally {
      setTotpSettingUp(false);
    }
  }, [applyTotpSetupPayload, stepUpForRetry, toast]);

  const handleTotpVerifySetup = useCallback(
    async (code: string) => {
      if (code.length !== 6 || !totpSetupId) return;
      setTotpVerifying(true);
      try {
        await apiRequest("/api/auth/totp/verify-setup", "POST", {
          code,
          setupId: totpSetupId,
        });
        setTotpSetupStep("done");
        setTotpEnabled(true);
        toast({ title: t.authSecTotpSetupDoneTitle || "2-step verification enabled", description: t.authSecTotpDoneDesc || "Your account is now more secure." });
        await refreshAll();
      } catch (error) {
        toast({
          title: t.authSecToastInvalidTotpTitle,
          description: error instanceof Error ? error.message : t.authSecToastTryAgain,
          variant: "destructive",
        });
        setTotpCode("");
      } finally {
        setTotpVerifying(false);
      }
    },
    [refreshAll, setTotpEnabled, toast, totpSetupId],
  );

  const handleTotpDisable = useCallback(async () => {
    const confirmed = window.confirm(`${t.authSecTotpDisable || "Disable"} 2-step verification? This will make your account less secure.`);
    if (!confirmed) return;
    setTotpDisabling(true);
    try {
      await withOptionalStepUp(() => apiRequest("/api/auth/totp/disable", "POST"), stepUpForRetry);
      setTotpEnabled(false);
      toast({ title: t.authSecTotpDisable || "2-step verification disabled" });
      await refreshAll();
    } catch (error) {
      toast({
        title: t.authSecToastDisableFailedTitle,
        description: error instanceof Error ? error.message : t.authSecToastTryAgain,
        variant: "destructive",
      });
    } finally {
      setTotpDisabling(false);
    }
  }, [setTotpEnabled, stepUpForRetry, toast, refreshAll]);

  if (authLoading || loading) {
    return (
      <AccountSettingsShell>
        <Card>
          <CardContent className="py-8">
            <p className="text-sm text-gray-600 dark:text-gray-300">{t.authSecLoadingSettings || "Loading security settings…"}</p>
          </CardContent>
        </Card>
      </AccountSettingsShell>
    );
  }

  // Not signed in at all — AuthContext is the source of truth.
  if (!user) {
    return (
      <AccountSettingsShell>
        <Card>
          <CardHeader>
            <CardTitle>{t.security || "Security Settings"}</CardTitle>
            <CardDescription>{t.authSecSettingsSignIn || "Sign in to manage your security settings."}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <a href="/auth/sign-in">{t.signIn || "Sign in"}</a>
            </Button>
          </CardContent>
        </Card>
      </AccountSettingsShell>
    );
  }

  // User is authenticated but the security data fetch failed (e.g. transient error).
  // Show a retry option rather than a misleading "sign in" prompt.
  if (!signedIn) {
    return (
      <AccountSettingsShell>
        <Card>
          <CardHeader>
            <CardTitle>{t.authSecCouldNotLoadSettings || "Could not load security settings"}</CardTitle>
            <CardDescription>{t.authSecCouldNotLoadSettingsDesc || "There was a problem fetching your security data."}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => void refreshAll()} variant="outline">
              {t.authSecTryAgain || "Try again"}
            </Button>
          </CardContent>
        </Card>
      </AccountSettingsShell>
    );
  }

  return (
    <AccountSettingsShell>
      <>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">{t.authSecPageTitle || "Security"}</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
          {t.authSecPageSubtitle || "Passkeys, 2-step verification, devices, and account recovery."}
        </p>
      <AccountSecuritySection
        email={email}
        recoveryRemaining={recoveryRemaining}
        recoveryGeneratedAt={recoveryGeneratedAt}
        recoveryCodes={recoveryCodes}
        dateFormatter={dateFormatter}
        totpEnabled={totpEnabled}
        passkeys={passkeys}
        registeringPasskey={registeringPasskey}
        totpSettingUp={totpSettingUp}
        totpDisabling={totpDisabling}
        generatingRecoveryCodes={generatingRecoveryCodes}
        recoveryAuthenticatorFallbackOpen={recoveryAuthenticatorFallbackOpen}
        recoveryTotpCode={recoveryTotpCode}
        onRecoveryTotpChange={setRecoveryTotpCode}
        onDismissRecoveryAuthenticatorFallback={dismissRecoveryAuthenticatorFallback}
        onCopyEmail={() => void copyEmail()}
        onOpenChangeEmail={() => setEmailChangeDialogOpen(true)}
        onTotpDisable={() => void handleTotpDisable()}
        onTotpSetup={() => void handleTotpSetup()}
        onAddPasskey={() => void handleAddPasskey()}
        onOpenManagePasskeys={() => setManagePasskeysOpen(true)}
        onGenerateRecoveryCodes={() => void handleGenerateRecoveryCodes()}
      />

      <DevicesSection
        sessions={sessions}
        dateFormatter={dateFormatter}
        revokingAllSessions={revokingAllSessions}
        revokingSessionId={revokingSessionId}
        onRevokeAll={() => void handleRevokeAllSessions()}
        onRevokeSession={(id) => void handleRevokeSession(id)}
      />

      <ChangeEmailDialog
        open={emailChangeDialogOpen}
        email={email}
        passkeyCount={passkeys.length}
        totpEnabled={totpEnabled}
        totpCode={emailChangeTotpCode}
        onTotpCodeChange={setEmailChangeTotpCode}
        newEmailInput={newEmailInput}
        onNewEmailChange={setNewEmailInput}
        emailChangeSent={emailChangeSent}
        changingEmail={changingEmail}
        onClose={closeEmailChangeDialog}
        onSubmit={() => void handleChangeEmail()}
      />

      <PasskeyResetDialog
        open={passkeyResetDialogOpen}
        totpEnabled={totpEnabled}
        totpCode={passkeyResetTotpCode}
        onTotpCodeChange={setPasskeyResetTotpCode}
        resetting={resettingPasskeys}
        onClose={closePasskeyResetDialog}
        onRemoveWithPasskey={() => void handlePasskeyResetWithPasskey()}
        onRemoveWithTotp={() => void handlePasskeyResetWithTotp()}
      />

      <ManagePasskeysDialog
        open={managePasskeysOpen}
        passkeys={passkeys}
        registeringPasskey={registeringPasskey}
        renamingPasskeyId={renamingPasskeyId}
        deletingPasskeyId={deletingPasskeyId}
        dateFormatter={dateFormatter}
        onClose={closeManagePasskeysDialog}
        onAddPasskey={() => void handleAddPasskey()}
        onRenamePasskey={handleRenamePasskey}
        onDeletePasskey={handleDeletePasskey}
      />

      <TotpSetupDialog
        open={totpDialogOpen}
        totpSetupStep={totpSetupStep}
        totpOtpauthUri={totpOtpauthUri}
        totpSecret={totpSecret}
        totpCode={totpCode}
        onTotpCodeChange={setTotpCode}
        totpVerifying={totpVerifying}
        onClose={closeTotpDialog}
        onBackToQr={() => setTotpSetupStep("qr")}
        onNextToVerify={() => setTotpSetupStep("verify")}
        onVerify={(code) => void handleTotpVerifySetup(code)}
        onCompleteClose={closeTotpDialog}
      />
      </>
    </AccountSettingsShell>
  );
}
