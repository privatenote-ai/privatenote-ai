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
              ? "We've sent a verification link to your new email address."
              : "Enter your new email address. You'll need to verify it before the change takes effect."}
          </DialogDescription>
        </DialogHeader>
        {emailChangeSent ? (
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <Mail className="h-5 w-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-200">Verification email sent</p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Check <span className="font-mono">{newEmailInput}</span> for the verification link.
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              The link expires in 1 hour. Your email won&apos;t change until you click the verification link.
            </p>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current email:</p>
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800">
                <p className="text-sm font-mono text-gray-700 dark:text-gray-300">{email}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">New email address:</p>
              <Input
                type="email"
                placeholder="Enter new email address"
                value={newEmailInput}
                onChange={(e) => onNewEmailChange(e.target.value)}
                disabled={changingEmail}
              />
            </div>
            {passkeyCount > 0 && totpEnabled && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                After you continue: use your passkey on <strong>this device</strong>, or enter your authenticator code
                below instead (avoids cross-device QR prompts).
              </p>
            )}
            {passkeyCount > 0 && !totpEnabled && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                You&apos;ll verify with your passkey on this device after you continue (avoid scanning a QR unless your
                passkey is on another device).
              </p>
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
                  disabled={changingEmail}
                />
              </div>
            )}
            {passkeyCount === 0 && !totpEnabled && (
              <p className="text-sm text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-md p-3">
                Add a passkey or enable 2-step verification before you can change your email.
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
