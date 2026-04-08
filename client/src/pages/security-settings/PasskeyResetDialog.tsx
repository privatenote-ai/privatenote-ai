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
            Removes every passkey. You can still sign in with email until you register a new passkey.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2 text-sm text-gray-600 dark:text-gray-400">
          <p>
            {totpEnabled ? (
              <>
                Use a passkey on <strong>this</strong> device when prompted, or enter your authenticator code below.
                If you see a QR code for another device, cancel and try again on this one.
              </>
            ) : (
              <>
                Use a passkey on <strong>this</strong> device when prompted (Touch ID, Windows Hello, etc.). If you see
                a QR code for another device, cancel and use the button below.
              </>
            )}
          </p>
          {!totpEnabled && (
            <p className="text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md p-3 text-xs">
              Can&apos;t use any passkey? Sign out, then{" "}
              <a href="/auth/recovery" className="underline font-medium">
                sign in with a recovery code
              </a>{" "}
              and return here. Consider turning on 2-step verification afterward.
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
              {resetting ? "Working…" : "Reset with authenticator code"}
            </Button>
          )}
          <Button
            type="button"
            variant={totpEnabled ? "outline" : "default"}
            disabled={resetting}
            onClick={() => void onRemoveWithPasskey()}
            className="w-full"
          >
            {resetting ? "Working…" : "Use passkey on this device"}
          </Button>
          <Button type="button" variant="ghost" disabled={resetting} onClick={onClose} className="w-full">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
