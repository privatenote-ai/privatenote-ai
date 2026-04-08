import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, ApiRequestError } from "@/lib/queryClient";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";
import { Copy, ChevronRight } from "lucide-react";
import { AccountSecuritySection } from "@/pages/security-settings/AccountSecuritySection";
import { ChangeEmailDialog } from "@/pages/security-settings/ChangeEmailDialog";
import { DeleteAccountDialog } from "@/pages/security-settings/DeleteAccountDialog";
import { PasskeyResetDialog } from "@/pages/security-settings/PasskeyResetDialog";
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

type TotpSetupResponse = { setupId: string; secret: string; otpauthUri: string };

export default function SecuritySettings() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { user, loading: authLoading, signOut } = useAuth();
  const stepUpForRetry = useStepUpAuth();

  const {
    loading,
    signedIn,
    userId,
    email,
    passkeys,
    setPasskeys,
    sessions,
    recoveryRemaining,
    recoveryGeneratedAt,
    totpEnabled,
    setTotpEnabled,
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
  }, []);

  const closePasskeyResetDialog = useCallback(() => {
    setPasskeyResetDialogOpen(false);
    setPasskeyResetTotpCode("");
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
      toast({ title: "Email copied", description: "Email address copied to clipboard." });
    } catch {
      toast({
        title: "Copy failed",
        description: "Failed to copy email to clipboard.",
        variant: "destructive",
      });
    }
  }, [email, toast]);

  const copyUserId = useCallback(async () => {
    if (!userId) return;
    try {
      await navigator.clipboard.writeText(userId);
      toast({ title: "User ID copied", description: "User ID copied to clipboard." });
    } catch {
      toast({
        title: "Copy failed",
        description: "Failed to copy User ID to clipboard.",
        variant: "destructive",
      });
    }
  }, [userId, toast]);

  const handleAddPasskey = useCallback(async () => {
    if (typeof window === "undefined" || !("PublicKeyCredential" in window)) {
      toast({
        title: "Passkeys not supported",
        description: "This browser does not support passkeys.",
      });
      return;
    }

    setRegisteringPasskey(true);
    try {
      if (passkeys.length > 0) {
        const stepUp = await executeStepUp();
        if (!stepUp.ok) {
          toastStepUpFailure(toast, stepUp);
          return;
        }
      }
      await registerPasskeyWithRetry();
      toast({
        title: "Passkey added",
        description:
          "You can sign in with this passkey on this device. The enrollment is recorded in your audit log (Audit logs).",
      });
      await refreshAll();
    } catch (error) {
      toast({
        title: "Passkey registration failed",
        description: passkeyRegistrationErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setRegisteringPasskey(false);
    }
  }, [passkeys.length, toast, refreshAll]);

  const handleRevokeAllSessions = useCallback(async () => {
    const confirmed = window.confirm(
      "Log out of all other active sessions on other devices besides this one?",
    );
    if (!confirmed) return;
    setRevokingAllSessions(true);
    try {
      await apiRequest("/api/auth/sessions/revoke-all", "POST");
      toast({ title: "All devices logged out", description: "All other sessions have been revoked." });
      await refreshAll();
    } catch (error) {
      toast({
        title: "Logout failed",
        description: error instanceof Error ? error.message : "Try again.",
        variant: "destructive",
      });
    } finally {
      setRevokingAllSessions(false);
    }
  }, [toast, refreshAll]);

  const handleGenerateRecoveryCodes = useCallback(async () => {
    setGeneratingRecoveryCodes(true);
    try {
      const useTotp =
        passkeys.length > 0 && totpEnabled && recoveryTotpCode.trim().length === 6;
      const response = useTotp
        ? await apiRequest<{ codes: string[] }>("/api/auth/recovery-codes/generate", "POST", {
            totpCode: recoveryTotpCode.trim(),
          })
        : await withOptionalStepUp(
            () => apiRequest<{ codes: string[] }>("/api/auth/recovery-codes/generate", "POST"),
            stepUpForRetry,
          );
      setRecoveryCodes(response.codes);
      setRecoveryTotpCode("");
      toast({ title: "Recovery codes generated", description: "Store them in a safe place." });
    } catch (error) {
      toast({
        title: "Recovery codes failed",
        description: error instanceof Error ? error.message : "Try again.",
        variant: "destructive",
      });
    } finally {
      setGeneratingRecoveryCodes(false);
      await refreshAll();
    }
  }, [passkeys.length, recoveryTotpCode, stepUpForRetry, toast, totpEnabled, refreshAll]);

  const handleRevokeSession = useCallback(
    async (sessionId: string) => {
      setRevokingSessionId(sessionId);
      try {
        await apiRequest("/api/auth/sessions/revoke", "POST", { sessionId });
        toast({ title: "Session revoked", description: "That session has been signed out." });
        await refreshAll();
      } catch (error) {
        toast({
          title: "Revoke failed",
          description: error instanceof Error ? error.message : "Try again.",
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
      toast({ title: "No passkeys", description: "There are no passkeys to reset." });
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
      toast({ title: "Passkeys reset", description: "All passkeys have been removed." });
      setPasskeys([]);
      closePasskeyResetDialog();
      await refreshAll();
    } catch (error) {
      toast({
        title: "Reset failed",
        description: error instanceof Error ? error.message : "Try again.",
        variant: "destructive",
      });
    } finally {
      setResettingPasskeys(false);
    }
  }, [closePasskeyResetDialog, passkeyResetTotpCode, refreshAll, setPasskeys, toast]);

  const handlePasskeyResetWithPasskey = useCallback(async () => {
    setResettingPasskeys(true);
    try {
      const stepped = await stepUpForRetry();
      if (!stepped) return;
      await apiRequest("/api/auth/passkeys/reset", "POST");
      toast({ title: "Passkeys reset", description: "All passkeys have been removed." });
      setPasskeys([]);
      closePasskeyResetDialog();
      await refreshAll();
    } catch (error) {
      toast({
        title: "Reset failed",
        description: error instanceof Error ? error.message : "Try again.",
        variant: "destructive",
      });
    } finally {
      setResettingPasskeys(false);
    }
  }, [closePasskeyResetDialog, refreshAll, setPasskeys, stepUpForRetry, toast]);

  const handleDeleteAccount = useCallback(async () => {
    if (!email) return;

    const normalizedInput = deleteEmailInput.trim().toLowerCase();
    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedInput !== normalizedEmail) {
      toast({
        title: "Email mismatch",
        description: "The email you entered does not match your account email.",
        variant: "destructive",
      });
      return;
    }

    setDeletingAccount(true);
    try {
      /** Server treats a valid 6-digit code like a step-up for passkey holders; skip passkey UI when provided. */
      const totpDeleteCode = totpEnabled && deleteTotpCode.trim().length === 6 ? deleteTotpCode.trim() : null;
      const stepUpAlreadyFresh = isServerStepUpFresh(lastStepUpAt);
      if (passkeys.length > 0 && !totpDeleteCode && !stepUpAlreadyFresh) {
        const r = await executeStepUp();
        if (!r.ok) {
          toast({
            title: "Verification incomplete",
            description:
              totpEnabled
                ? "Enter your 6-digit authenticator code in the field below, or complete passkey verification on this device."
                : "Please complete passkey verification to delete your account.",
            variant: "destructive",
          });
          return;
        }
      }

      await apiRequest("/api/auth/account/delete", "POST", {
        email: normalizedEmail,
        ...(totpDeleteCode ? { totpCode: totpDeleteCode } : {}),
      });

      toast({
        title: "Account deleted",
        description: "Your account has been permanently deleted.",
      });

      await signOut();
      setLocation("/");
    } catch (error) {
      let desc = "Failed to delete account. Please try again.";
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
          title: "Verification required",
          description: desc,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Delete failed",
          description: desc,
          variant: "destructive",
        });
      }
    } finally {
      setDeletingAccount(false);
      setDeleteDialogOpen(false);
      setDeleteEmailInput("");
      setDeleteTotpCode("");
    }
  }, [
    deleteEmailInput,
    deleteTotpCode,
    email,
    lastStepUpAt,
    passkeys.length,
    setLocation,
    signOut,
    toast,
    totpEnabled,
  ]);

  const handleChangeEmail = useCallback(async () => {
    if (!newEmailInput.trim()) {
      toast({
        title: "Email required",
        description: "Please enter a new email address.",
        variant: "destructive",
      });
      return;
    }

    if (!isPlausibleEmailFormat(newEmailInput)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    const normalizedNew = newEmailInput.trim().toLowerCase();
    const normalizedCurrent = (email ?? "").trim().toLowerCase();

    if (normalizedNew === normalizedCurrent) {
      toast({
        title: "Same email",
        description: "New email must be different from your current email.",
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
            title: "Authentication required",
            description:
              totpEnabled && emailChangeTotpCode.trim().length === 0
                ? "Use your passkey on this device, or enter your 6-digit authenticator code in the form."
                : "Please complete authentication to change your email.",
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
        title: "Verification email sent",
        description: "Check your new email address for a verification link.",
      });
    } catch (error) {
      let desc = "Failed to request email change. Please try again.";
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
          title: "Authentication required",
          description: desc,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Change email failed",
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
        title: "Setup failed",
        description: error instanceof Error ? error.message : "Could not start TOTP setup.",
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
        toast({ title: "2-step verification enabled", description: "Your account is now more secure." });
        await refreshAll();
      } catch (error) {
        toast({
          title: "Invalid code",
          description: error instanceof Error ? error.message : "Please try again.",
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
    const confirmed = window.confirm("Disable 2-step verification? This will make your account less secure.");
    if (!confirmed) return;
    setTotpDisabling(true);
    try {
      await withOptionalStepUp(() => apiRequest("/api/auth/totp/disable", "POST"), stepUpForRetry);
      setTotpEnabled(false);
      toast({ title: "2-step verification disabled" });
      await refreshAll();
    } catch (error) {
      toast({
        title: "Disable failed",
        description: error instanceof Error ? error.message : "Try again.",
        variant: "destructive",
      });
    } finally {
      setTotpDisabling(false);
    }
  }, [setTotpEnabled, stepUpForRetry, toast, refreshAll]);

  if (authLoading || loading) {
    return (
      <div className="pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <Card>
          <CardContent className="py-8">
            <p className="text-sm text-gray-600 dark:text-gray-300">Loading security settings…</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!signedIn || !user) {
    return (
      <div className="pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Sign in to manage your security settings.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <a href="/auth">Sign in</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
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
        resettingPasskeys={resettingPasskeys}
        recoveryTotpCode={recoveryTotpCode}
        onRecoveryTotpChange={setRecoveryTotpCode}
        onCopyEmail={() => void copyEmail()}
        onOpenChangeEmail={() => setEmailChangeDialogOpen(true)}
        onTotpDisable={() => void handleTotpDisable()}
        onTotpSetup={() => void handleTotpSetup()}
        onAddPasskey={() => void handleAddPasskey()}
        onResetPasskeys={() => void handleResetPasskeys()}
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

      <div className="mb-12">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">User ID</h2>
        <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">User ID</p>
              <p className="text-sm font-mono text-gray-700 dark:text-gray-300">{userId ?? "Loading..."}</p>
            </div>
            {userId && (
              <button
                type="button"
                onClick={() => void copyUserId()}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                title="Copy User ID"
              >
                <Copy className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Support</h2>

        <div className="space-y-0 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setDeleteDialogOpen(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-left"
          >
            <div className="flex-1">
              <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">Delete my account</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Permanently delete the account and remove access from all sessions.
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
        passkeyCount={passkeys.length}
        totpEnabled={totpEnabled}
        totpCode={deleteTotpCode}
        onTotpCodeChange={setDeleteTotpCode}
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
    </div>
  );
}
