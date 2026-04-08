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
  totpEnabled: boolean;
  totpCode: string;
  onTotpCodeChange: (value: string) => void;
  resetting: boolean;
  onClose: () => void;
  onRemoveWithPasskey: () => void;
  onRemoveWithTotp: () => void;
};

export function PasskeyResetDialog({
  open,
  totpEnabled,
  totpCode,
  onTotpCodeChange,
  resetting,
  onClose,
  onRemoveWithPasskey,
  onRemoveWithTotp,
}: Props) {
  const handleOpenChange = (next: boolean) => {
    if (resetting) return;
    if (!next) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reset all passkeys</DialogTitle>
          <DialogDescription>
            This removes every passkey from your account. You can sign in with email until you add a new passkey.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2 text-sm text-gray-600 dark:text-gray-400">
          <p>
            If the browser shows a <strong>QR code</strong>, it is trying to use a passkey on another device. Cancel
            that prompt and use <strong>Continue with passkey on this device</strong> if your passkey lives here (e.g.
            Touch ID, Windows Hello, or this phone&apos;s screen lock).
          </p>
          {!totpEnabled && (
            <p className="text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md p-3 text-xs">
              Lost the device with your passkey? If you have a <strong>recovery code</strong>, sign out, open{" "}
              <a href="/auth/recovery" className="underline font-medium">
                Use recovery code
              </a>
              , then return here — that sign-in lets you reset passkeys without the old passkey. Enable 2-step
              verification afterward so you have a backup next time.
            </p>
          )}
          {totpEnabled && (
            <div className="space-y-2">
              <p className="text-gray-700 dark:text-gray-300">
                Or enter your <strong>6-digit authenticator app</strong> code — no passkey needed.
              </p>
              <Input
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="6-digit code"
                value={totpCode}
                onChange={(e) => onTotpCodeChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
                disabled={resetting}
              />
            </div>
          )}
        </div>
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          {totpEnabled && (
            <Button
              type="button"
              variant="default"
              disabled={resetting || totpCode.length !== 6}
              onClick={() => void onRemoveWithTotp()}
              className="w-full"
            >
              {resetting ? "Working…" : "Remove passkeys using authenticator code"}
            </Button>
          )}
          <Button
            type="button"
            variant={totpEnabled ? "outline" : "default"}
            disabled={resetting}
            onClick={() => void onRemoveWithPasskey()}
            className="w-full"
          >
            {resetting ? "Working…" : "Continue with passkey on this device"}
          </Button>
          <Button type="button" variant="ghost" disabled={resetting} onClick={onClose} className="w-full">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
