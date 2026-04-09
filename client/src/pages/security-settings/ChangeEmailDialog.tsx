import { Mail, Loader2 } from "lucide-react";
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
import { isPlausibleEmailFormat } from "@shared/isPlausibleEmailFormat";

type Props = {
  open: boolean;
  email: string | null;
  passkeyCount: number;
  totpEnabled: boolean;
  totpCode: string;
  onTotpCodeChange: (value: string) => void;
  newEmailInput: string;
  onNewEmailChange: (value: string) => void;
  emailChangeSent: boolean;
  changingEmail: boolean;
  onClose: () => void;
  onSubmit: () => void;
};

export function ChangeEmailDialog({
  open,
  email,
  passkeyCount,
  totpEnabled,
  totpCode,
  onTotpCodeChange,
  newEmailInput,
  onNewEmailChange,
  emailChangeSent,
  changingEmail,
  onClose,
  onSubmit,
}: Props) {
  const handleOpenChange = (next: boolean) => {
    if (changingEmail) return;
    if (!next) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change email address</DialogTitle>
          <DialogDescription>
            {emailChangeSent
              ? "We sent a confirmation link to your new email. Your current email stays unchanged until you confirm."
              : "Enter your new email address. We'll send a confirmation link there."}
          </DialogDescription>
        </DialogHeader>
        {emailChangeSent ? (
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <Mail className="h-5 w-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-200">Check your inbox</p>
                <p className="text-sm text-green-600 dark:text-green-400 font-mono">{newEmailInput}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your account email does not change until you open the link. It expires in 1 hour.
            </p>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current</p>
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800">
                <p className="text-sm font-mono text-gray-700 dark:text-gray-300">{email}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">New</p>
              <Input
                type="email"
                placeholder="New email"
                value={newEmailInput}
                onChange={(e) => onNewEmailChange(e.target.value)}
                disabled={changingEmail}
              />
            </div>
            {passkeyCount > 0 && totpEnabled && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                After you continue, use a passkey on this device or enter your 6-digit authenticator code below.
              </p>
            )}
            {passkeyCount > 0 && !totpEnabled && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                After you continue, you will verify with a passkey on this device.
              </p>
            )}
            {totpEnabled && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {passkeyCount > 0
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
                  disabled={changingEmail}
                />
              </div>
            )}
            {passkeyCount === 0 && !totpEnabled && (
              <p className="text-sm text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-md p-3">
                Add a passkey or 2-step verification first.
              </p>
            )}
          </div>
        )}
        <DialogFooter>
          {emailChangeSent ? (
            <Button onClick={onClose}>Done</Button>
          ) : (
            <>
              <Button variant="outline" onClick={onClose} disabled={changingEmail}>
                Cancel
              </Button>
              <Button
                onClick={onSubmit}
                disabled={
                  changingEmail ||
                  !isPlausibleEmailFormat(newEmailInput) ||
                  (passkeyCount === 0 && !totpEnabled) ||
                  (passkeyCount === 0 && totpEnabled && totpCode.length !== 6)
                }
              >
                {changingEmail ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
