import { Copy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type AccountDeleteMethod = "passkey" | "totp" | "email_code";

type Props = {
  open: boolean;
  email: string | null;
  availableMethods: AccountDeleteMethod[];
  preferredMethod: AccountDeleteMethod | null;
  optionsLoading: boolean;
  totpCode: string;
  onTotpCodeChange: (value: string) => void;
  deleteEmailVerificationCode: string;
  onDeleteEmailVerificationCodeChange: (value: string) => void;
  deleteEmailCodeSent: boolean;
  sendingDeleteEmailCode: boolean;
  onSendDeleteEmailCode: () => void;
  unlockingFallback: boolean;
  onUnlockFallback: () => void;
  deleteEmailInput: string;
  onDeleteEmailInputChange: (value: string) => void;
  deletingAccount: boolean;
  onCopyEmail: () => void;
  onClose: () => void;
  onConfirmDelete: () => void;
};

export function DeleteAccountDialog({
  open,
  email,
  availableMethods,
  preferredMethod,
  optionsLoading,
  totpCode,
  onTotpCodeChange,
  deleteEmailVerificationCode,
  onDeleteEmailVerificationCodeChange,
  deleteEmailCodeSent,
  sendingDeleteEmailCode,
  onSendDeleteEmailCode,
  unlockingFallback,
  onUnlockFallback,
  deleteEmailInput,
  onDeleteEmailInputChange,
  deletingAccount,
  onCopyEmail,
  onClose,
  onConfirmDelete,
}: Props) {
  const handleOpenChange = (next: boolean) => {
    if (deletingAccount) return;
    if (!next) onClose();
  };

  const hasPasskey = availableMethods.includes("passkey");
  const hasTotp = availableMethods.includes("totp");
  const hasEmailCode = availableMethods.includes("email_code");
  const noVerifiedChannel = !optionsLoading && open && availableMethods.length === 0;

  const onlyEmail = availableMethods.length === 1 && availableMethods[0] === "email_code";
  const onlyTotp = availableMethods.length === 1 && availableMethods[0] === "totp";

  const confirmDisabled =
    deletingAccount ||
    optionsLoading ||
    availableMethods.length === 0 ||
    !deleteEmailInput.trim() ||
    noVerifiedChannel ||
    (onlyTotp && totpCode.length !== 6) ||
    (onlyEmail && deleteEmailVerificationCode.length !== 6);

  const emailIsFallback = hasEmailCode && preferredMethod !== "email_code";
  const hasFallbackUnlockAction = hasPasskey && !hasTotp && !hasEmailCode;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete account</DialogTitle>
          <DialogDescription>
            Verify it&apos;s you to continue. Type your email address as a final confirmation.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {optionsLoading && (
            <p className="text-sm text-gray-600 dark:text-gray-400">Loading verification options…</p>
          )}
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Your email</p>
            <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <p className="text-sm font-mono text-gray-700 dark:text-gray-300">{email}</p>
                <button
                  type="button"
                  onClick={onCopyEmail}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded transition-colors"
                  title="Copy email"
                >
                  <Copy className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>
            <Input
              type="email"
              placeholder="Enter your email"
              value={deleteEmailInput}
              onChange={(e) => onDeleteEmailInputChange(e.target.value)}
              disabled={deletingAccount}
            />
            {hasPasskey && hasTotp && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Preferred: passkey on this device. You can enter your 6-digit authenticator code instead.
              </p>
            )}
            {hasPasskey && !hasTotp && (
              <>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Preferred: verify with a passkey on this device. Passkey verification deletes your account
                  immediately.
                </p>
                <p className="text-xs text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md p-2 mt-2">
                  If you can&apos;t use a passkey on this device, try{" "}
                  <a href="/auth/recovery" className="underline font-medium">
                    Recovery sign-in
                  </a>{" "}
                  and then come back here.
                </p>
                {hasFallbackUnlockAction && (
                  <Button
                    type="button"
                    variant="secondary"
                    className="mt-3 w-full sm:w-auto"
                    onClick={onUnlockFallback}
                    disabled={deletingAccount || unlockingFallback || optionsLoading}
                  >
                    {unlockingFallback ? "Checking…" : "I don't have access to this device"}
                  </Button>
                )}
              </>
            )}
            {hasTotp && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {hasPasskey
                    ? "6-digit authenticator code (optional if you use a passkey)"
                    : "6-digit authenticator code"}
                </p>
                <Input
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  placeholder="6-digit authenticator code"
                  value={totpCode}
                  onChange={(e) => onTotpCodeChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  disabled={deletingAccount}
                />
              </div>
            )}
            {hasEmailCode && (
              <div className="mt-3 space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {emailIsFallback
                    ? "If you can't complete passkey verification, use email as a backup method. This will schedule deletion after 48 hours (not immediate)."
                    : "We'll send a single-use confirmation code to your account email. Enter it below to prove you can read that inbox."}
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full sm:w-auto"
                  onClick={onSendDeleteEmailCode}
                  disabled={deletingAccount || sendingDeleteEmailCode || optionsLoading}
                >
                  {sendingDeleteEmailCode ? "Sending…" : "Send confirmation code to my email"}
                </Button>
                {deleteEmailCodeSent && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">Check your inbox for the code.</p>
                )}
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">6-digit email code</p>
                  <Input
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    placeholder="Code from email"
                    value={deleteEmailVerificationCode}
                    onChange={(e) =>
                      onDeleteEmailVerificationCodeChange(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    disabled={deletingAccount}
                  />
                </div>
              </div>
            )}
            {noVerifiedChannel && (
              <p className="text-sm text-amber-800 dark:text-amber-200 bg-amber-50 dark:text-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-md p-3 mt-3">
                Account deletion isn&apos;t available until you verify your email, add a passkey, or enable
                2-step verification in Security settings.
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={deletingAccount}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirmDelete} disabled={confirmDisabled}>
            {deletingAccount ? "Deleting…" : "Delete account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
