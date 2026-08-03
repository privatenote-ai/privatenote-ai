import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, ApiRequestError } from "@/lib/queryClient";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";
import { ChevronRight } from "lucide-react";
import { AccountSecuritySection } from "@/pages/security-settings/AccountSecuritySection";
import { ChangeEmailDialog } from "@/pages/security-settings/ChangeEmailDialog";
import {
  DeleteAccountDialog,
  type AccountDeleteMethod,
} from "@/pages/security-settings/DeleteAccountDialog";
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
import { isServerStepUpFresh } from "@/pages/security-settings/isServerStepUpFresh";
import { AccountSettingsShell } from "@/pages/account/AccountSettingsShell";
import { useLanguage } from "@/context/LanguageContext";

type TotpSetupResponse = { setupId: string; secret: string; otpauthUri: string };

export default function SecuritySettings() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { user, loading: authLoading, signOut } = useAuth();
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
    emailVerified,
    lastStepUpAt,
    refreshAll,
  } = useSecuritySettingsData(user?.email);

  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteEmailInput, setDeleteEmailInput] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [registeringPasskey, setRegisteringPasskey] = useState(false);
  const [emailChangeDialogOpen, setEmailChangeDialogOpen] = useState(false);
  const [newEmailInput, setNewEmailInput] = useState("");
  const [changingEmail, setChangingEmail] = useState(false);
  const [emailChangeSent, setEmailChangeSent] = useState(false);
  const [emailChangeTotpCode, setEmailChangeTotpCode] = useState("");
  const [deleteTotpCode, setDeleteTotpCode] = useState("");
  const [deleteEmailVerificationCode, setDeleteEmailVerificationCode] = useState("");
  const [deleteEmailCodeSent, setDeleteEmailCodeSent] = useState(false);
  const [sendingDeleteEmailCode, setSendingDeleteEmailCode] = useState(false);
  const [deleteVerificationOptions, setDeleteVerificationOptions] = useState<{
    preferred_method: AccountDeleteMethod;
    available_methods: AccountDeleteMethod[];
  } | null>(null);
  const [deleteOptionsLoading, setDeleteOptionsLoading] = useState(false);
  const [unlockingDeleteFallback, setUnlockingDeleteFallback] = useState(false);
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

  const closeDeleteAccountDialog = useCallback(() => {
    setDeleteDialogOpen(false);
    setDeleteEmailInput("");
    setDeleteTotpCode("");
    setDeleteEmailVerificationCode("");
    setDeleteEmailCodeSent(false);
    setSendingDeleteEmailCode(false);
    setUnlockingDeleteFallback(false);
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

  const refreshDeleteVerificationOptions = useCallback(async () => {
    setDeleteOptionsLoading(true);
    try {
      const data = await apiRequest<{
        ok: boolean;
        preferred_method: AccountDeleteMethod;
        available_methods: AccountDeleteMethod[];
      }>("/api/auth/account/delete/options", "GET");
      if (data.ok && data.preferred_method && Array.isArray(data.available_methods)) {
        setDeleteVerificationOptions({
          preferred_method: data.preferred_method,
          available_methods: data.available_methods,
        });
      } else {
        setDeleteVerificationOptions(null);
      }
    } catch {
      setDeleteVerificationOptions(null);
      toast({
        title: t.authSecCouldNotLoadSettings || "Couldn't load delete verification",
        description: t.authSecToastCouldNotLoadDeleteDesc,
        variant: "destructive",
      });
    } finally {
      setDeleteOptionsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!deleteDialogOpen) {
      setDeleteVerificationOptions(null);
      return;
    }
    void refreshDeleteVerificationOptions();
  }, [deleteDialogOpen, refreshDeleteVerificationOptions]);

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

  const handleSendDeleteEmailCode = useCallback(async () => {
    setSendingDeleteEmailCode(true);
    try {
      const am = deleteVerificationOptions?.available_methods ?? [];
      const needsFallback = am.includes("passkey");
      await apiRequest("/api/auth/account/delete/email-code", "POST", needsFallback ? { fallback: true } : {});
      setDeleteEmailCodeSent(true);
      toast({
        title: t.authSecToastDeleteCodeSentTitle,
        description: t.authSecToastDeleteCodeSentDesc,
      });
    } catch (error) {
      let desc = t.authSecToastCouldNotSendCodeDefault;
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
      toast({ title: t.authSecToastCouldNotSendCodeTitle, description: desc, variant: "destructive" });
    } finally {
      setSendingDeleteEmailCode(false);
    }
  }, [deleteVerificationOptions, toast]);

  const handleUnlockDeleteFallback = useCallback(async () => {
    setUnlockingDeleteFallback(true);
    try {
      await apiRequest("/api/auth/account/delete/passkey-abandoned", "POST", {
        reason: "no_device_access",
      });
      await refreshDeleteVerificationOptions();
      toast({
        title: t.authSecToastEmailFallbackEnabledTitle,
        description: t.authSecToastEmailFallbackEnabledDesc,
      });
    } catch (error) {
      let desc = t.authSecToastFallbackUnavailableDefault;
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
      toast({ title: t.authSecToastFallbackUnavailableTitle, description: desc, variant: "destructive" });
    } finally {
      setUnlockingDeleteFallback(false);
    }
  }, [refreshDeleteVerificationOptions, toast]);

  const handleDeleteAccount = useCallback(async () => {
    if (!email) return;

    const normalizedInput = deleteEmailInput.trim().toLowerCase();
    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedInput !== normalizedEmail) {
      toast({
        title: t.authSecToastEmailMismatchTitle,
        description: t.authSecToastEmailMismatchDesc,
        variant: "destructive",
      });
      return;
    }

    if (!deleteVerificationOptions?.available_methods.length) {
      toast({
        title: t.authSecToastVerificationUnavailableTitle,
        description: t.authSecToastVerificationUnavailableDesc,
        variant: "destructive",
      });
      return;
    }

    const am = deleteVerificationOptions.available_methods;
    const totpDeleteCode =
      am.includes("totp") && deleteTotpCode.trim().length === 6 ? deleteTotpCode.trim() : null;
    const hasEmailCode =
      am.includes("email_code") && deleteEmailVerificationCode.trim().length === 6;
    const stepUpAlreadyFresh = isServerStepUpFresh(lastStepUpAt);

    setDeletingAccount(true);
    try {
      if (am.includes("passkey") && !totpDeleteCode && !hasEmailCode && !stepUpAlreadyFresh) {
        const r = await executeStepUp();
        if (!r.ok) {
          const abandonedReason =
            r.reason === "cancelled"
              ? "cancelled"
              : r.reason === "timeout"
                ? "timeout"
                : r.reason === "not_supported"
                  ? "not_supported"
                  : r.reason === "no_passkey"
                    ? "no_passkey"
                    : "step_up_failed";
          await apiRequest("/api/auth/account/delete/passkey-abandoned", "POST", {
            reason: abandonedReason,
          }).catch(() => {});
          await refreshDeleteVerificationOptions();
          toast({
            title: t.authSecToastVerifyItsYouTitle,
            description:
              am.includes("totp") && am.includes("email_code")
                ? t.authSecToastVerifyItsYouPasskeyTotpEmail
                : am.includes("totp")
                  ? t.authSecToastVerifyItsYouTotp
                  : am.includes("email_code")
                    ? t.authSecToastVerifyItsYouEmail
                    : t.authSecToastVerifyItsYouRetry,
            variant: "destructive",
          });
          return;
        }
      }

      const deleteResult = await apiRequest<{ ok: boolean; scheduled?: boolean }>("/api/auth/account/delete", "POST", {
        email: normalizedEmail,
        ...(totpDeleteCode ? { totpCode: totpDeleteCode } : {}),
        ...(hasEmailCode ? { deleteEmailVerificationCode: deleteEmailVerificationCode.trim() } : {}),
      });

      if (deleteResult.scheduled) {
        toast({
          title: t.authSecToastDeletionScheduledTitle,
          description: t.authSecToastDeletionScheduledDesc,
        });
      } else {
        toast({
          title: t.authSecToastAccountDeletedTitle,
          description: t.authSecToastAccountDeletedDesc,
        });
      }

      setDeleteDialogOpen(false);
      setDeleteEmailInput("");
      setDeleteTotpCode("");
      setDeleteEmailVerificationCode("");
      setDeleteEmailCodeSent(false);

      await signOut();
      setLocation("/");
    } catch (error) {
      let desc = t.authSecToastDeleteAccountFailedDefault;
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
          title: t.authSecToastDeleteFailedTitle,
          description: desc,
          variant: "destructive",
        });
      }
    } finally {
      setDeletingAccount(false);
    }
  }, [
    deleteEmailInput,
    deleteEmailVerificationCode,
    deleteTotpCode,
    deleteVerificationOptions,
    email,
    lastStepUpAt,
    setLocation,
    signOut,
    toast,
    refreshDeleteVerificationOptions,
  ]);

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

      <div className="mt-10 pt-2">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t.authSecDangerZone || "Danger zone"}</h2>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          {t.authSecDangerZoneDesc || "These actions are permanent or harder to reverse, so review them carefully."}
        </p>

        <div className="space-y-0 rounded-lg border border-red-200 dark:border-red-900/60 overflow-hidden">
          <button
            type="button"
            onClick={() => setDeleteDialogOpen(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-left"
          >
            <div className="flex-1">
              <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-0.5">{t.authSecScheduleDeleteTitle || "Schedule account deletion"}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t.authSecScheduleDeleteDesc || "You'll have 48 hours to cancel before it becomes permanent."}
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </button>
        </div>
      </div>

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

      <DeleteAccountDialog
        open={deleteDialogOpen}
        email={email}
        availableMethods={deleteVerificationOptions?.available_methods ?? []}
        preferredMethod={deleteVerificationOptions?.preferred_method ?? null}
        optionsLoading={deleteOptionsLoading}
        totpCode={deleteTotpCode}
        onTotpCodeChange={setDeleteTotpCode}
        deleteEmailVerificationCode={deleteEmailVerificationCode}
        onDeleteEmailVerificationCodeChange={setDeleteEmailVerificationCode}
        deleteEmailCodeSent={deleteEmailCodeSent}
        sendingDeleteEmailCode={sendingDeleteEmailCode}
        onSendDeleteEmailCode={() => void handleSendDeleteEmailCode()}
        unlockingFallback={unlockingDeleteFallback}
        onUnlockFallback={() => void handleUnlockDeleteFallback()}
        deleteEmailInput={deleteEmailInput}
        onDeleteEmailInputChange={setDeleteEmailInput}
        deletingAccount={deletingAccount}
        onCopyEmail={() => void copyEmail()}
        onClose={closeDeleteAccountDialog}
        onConfirmDelete={() => void handleDeleteAccount()}
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
