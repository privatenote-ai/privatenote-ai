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
          <DialogTitle>Remove all passkeys</DialogTitle>
          <DialogDescription>
            Remove all saved passkeys from your account. You can still sign in with email until you add a new passkey.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2 text-sm text-gray-600 dark:text-gray-400">
          {totpEnabled ? (
            <div className="space-y-2">
              <p>To continue, use a passkey on this device or enter your 6-digit authenticator code below.</p>
              <p>
                If the passkey prompt shows a QR code for another device, cancel and try again here.
              </p>
            </div>
          ) : (
            <p>To continue, verify with a passkey on this device.</p>
          )}
          {!totpEnabled && (
            <p className="text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md p-2.5 text-xs">
              If you can&apos;t use a passkey right now, try{" "}
              <a href="/auth/recovery" className="underline font-medium">
                Recovery sign-in
              </a>
              , then set up 2-step verification.
            </p>
          )}
          {totpEnabled && (
            <div className="space-y-2">
              <Input
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="6-digit authenticator code"
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
              {resetting ? "Working…" : "Continue with authenticator code"}
            </Button>
          )}
          <Button
            type="button"
            variant={totpEnabled ? "outline" : "default"}
            disabled={resetting}
            onClick={() => void onRemoveWithPasskey()}
            className="w-full"
          >
            {resetting ? "Working…" : "Continue with passkey"}
          </Button>
          <Button type="button" variant="ghost" disabled={resetting} onClick={onClose} className="w-full">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
