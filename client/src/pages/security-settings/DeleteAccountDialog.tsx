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

type Props = {
  open: boolean;
  email: string | null;
  passkeyCount: number;
  totpEnabled: boolean;
  totpCode: string;
  onTotpCodeChange: (value: string) => void;
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
  passkeyCount,
  totpEnabled,
  totpCode,
  onTotpCodeChange,
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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete account</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account and remove all associated data.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">To confirm, please type or paste your email address:</p>
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
            {passkeyCount > 0 && totpEnabled && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Use your passkey on this device when you delete, or enter your authenticator code below instead.
              </p>
            )}
            {passkeyCount > 0 && !totpEnabled && (
              <>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  You&apos;ll confirm with your passkey when you delete unless you just signed in with a recovery code
                  (then no passkey prompt). Use this device if your passkey is here.
                </p>
                <p className="text-xs text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md p-2">
                  Lost your passkey? Sign out and use{" "}
                  <a href="/auth/recovery" className="underline font-medium">
                    Use recovery code
                  </a>
                  , then delete from Security settings.
                </p>
              </>
            )}
            {totpEnabled && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {passkeyCount > 0 ? "Authenticator code (optional if you use passkey)" : "2-step verification code"}
                </p>
                <Input
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  placeholder="6-digit code"
                  value={totpCode}
                  onChange={(e) => onTotpCodeChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  disabled={deletingAccount}
                />
              </div>
            )}
            {passkeyCount === 0 && !totpEnabled && (
              <p className="text-sm text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-md p-3">
                Add a passkey or enable 2-step verification before you can delete your account.
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={deletingAccount}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirmDelete}
            disabled={
              deletingAccount ||
              !deleteEmailInput.trim() ||
              (passkeyCount === 0 && !totpEnabled) ||
              (passkeyCount === 0 && totpEnabled && totpCode.length !== 6)
            }
          >
            {deletingAccount ? "Deleting..." : "Delete account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
