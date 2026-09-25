import { useCallback, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useAccountEntitlements } from "@/context/AccountEntitlementsContext";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, ApiRequestError } from "@/lib/queryClient";
import {
  DeleteAccountDialog,
  type AccountDeleteMethod,
} from "@/pages/security-settings/DeleteAccountDialog";
import { isForbiddenApiError } from "@/pages/security-settings/forbidden";
import { isServerStepUpFresh } from "@/pages/security-settings/isServerStepUpFresh";
import { executeStepUp } from "@/pages/security-settings/stepUp";

/** States that imply a Stripe subscription which account deletion has to cancel. */
const LIVE_SUBSCRIPTION_STATES = new Set(["active", "trialing", "grace"]);

export function AccountDangerZone() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const { entitlements } = useAccountEntitlements();
  const email = user?.email ?? null;
  const hasLiveSubscription = LIVE_SUBSCRIPTION_STATES.has(
    entitlements.subscriptionState,
  );

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteEmailInput, setDeleteEmailInput] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);
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

  const closeDeleteAccountDialog = useCallback(() => {
    setDeleteDialogOpen(false);
    setDeleteEmailInput("");
    setDeleteTotpCode("");
    setDeleteEmailVerificationCode("");
    setDeleteEmailCodeSent(false);
    setSendingDeleteEmailCode(false);
    setUnlockingDeleteFallback(false);
  }, []);

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
  }, [t, toast]);

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
  }, [email, t, toast]);

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
  }, [deleteVerificationOptions, t, toast]);

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
  }, [refreshDeleteVerificationOptions, t, toast]);

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

    setDeletingAccount(true);
    try {
      let lastStepUpAt: string | null = null;
      try {
        const me = await apiRequest<{ lastStepUpAt?: string | null }>("/api/auth/me", "GET");
        lastStepUpAt = me.lastStepUpAt ?? null;
      } catch {
        lastStepUpAt = null;
      }
      const stepUpAlreadyFresh = isServerStepUpFresh(lastStepUpAt);

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

      closeDeleteAccountDialog();
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
    closeDeleteAccountDialog,
    deleteEmailInput,
    deleteEmailVerificationCode,
    deleteTotpCode,
    deleteVerificationOptions,
    email,
    refreshDeleteVerificationOptions,
    setLocation,
    signOut,
    t,
    toast,
  ]);

  if (!email) return null;

  return (
    <>
      <div className="pt-2">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {t.authSecDangerZone || "Danger zone"}
        </h2>
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
              <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-0.5">
                {t.authSecScheduleDeleteTitle || "Schedule account deletion"}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t.authSecScheduleDeleteDesc || "You'll have 48 hours to cancel before it becomes permanent."}
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </button>
        </div>
      </div>

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
        hasLiveSubscription={hasLiveSubscription}
        onCopyEmail={() => void copyEmail()}
        onClose={closeDeleteAccountDialog}
        onConfirmDelete={() => void handleDeleteAccount()}
      />
    </>
  );
}
