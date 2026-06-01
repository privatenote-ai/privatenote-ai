import { Copy, Loader2, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import QRCode from "react-qr-code";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";

type TotpStep = "qr" | "verify" | "done";

type Props = {
  open: boolean;
  totpSetupStep: TotpStep;
  totpOtpauthUri: string | null;
  totpSecret: string | null;
  totpCode: string;
  onTotpCodeChange: (value: string) => void;
  totpVerifying: boolean;
  onClose: () => void;
  onBackToQr: () => void;
  onNextToVerify: () => void;
  onVerify: (code: string) => void;
  onCompleteClose: () => void;
};

export function TotpSetupDialog({
  open,
  totpSetupStep,
  totpOtpauthUri,
  totpSecret,
  totpCode,
  onTotpCodeChange,
  totpVerifying,
  onClose,
  onBackToQr,
  onNextToVerify,
  onVerify,
  onCompleteClose,
}: Props) {
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleOpenChange = (next: boolean) => {
    if (totpVerifying) return;
    if (!next) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {totpSetupStep === "done" ? (t.authSecTotpSetupDoneTitle || "2-step verification enabled") : (t.authSecTotpSetupDialogTitle || "Set up 2-step verification")}
          </DialogTitle>
          <DialogDescription>
            {totpSetupStep === "qr" &&
              (t.authSecTotpScanQr || "Scan this QR code with your authenticator app (Google Authenticator, Authy, 1Password, etc).")}
            {totpSetupStep === "verify" && (t.authSecTotpEnterSixDigit || "Enter the 6-digit code from your authenticator app to confirm setup.")}
            {totpSetupStep === "done" && (t.authSecTotpDoneDesc || "Your account is now protected with 2-step verification.")}
          </DialogDescription>
        </DialogHeader>

        {totpSetupStep === "qr" && totpOtpauthUri && (
          <div className="space-y-4 py-4">
            <div className="flex justify-center">
              <div className="p-4 bg-white rounded-lg">
                <QRCode value={totpOtpauthUri} size={200} />
              </div>
            </div>
            {totpSecret && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">{t.authSecTotpOrEnterManually || "Or enter this code manually:"}</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono text-center break-all select-all">
                    {totpSecret}
                  </code>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(totpSecret);
                        toast({ title: t.authSecCopied || "Copied", description: t.authSecSecretCopied || "Secret key copied to clipboard." });
                      } catch {
                        toast({ title: t.authCopyFailedTitle || "Copy failed", variant: "destructive" });
                      }
                    }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                    title={t.authSecTotpCopySecret || "Copy secret"}
                  >
                    <Copy className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {totpSetupStep === "verify" && (
          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center gap-4">
              <InputOTP
                maxLength={6}
                value={totpCode}
                onChange={(val) => {
                  onTotpCodeChange(val);
                  if (val.length === 6) {
                    onVerify(val);
                  }
                }}
                disabled={totpVerifying}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>
        )}

        {totpSetupStep === "done" && (
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-200">{t.authSecAuthenticatorVerified || "Authenticator app verified"}</p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  {t.authSecCodeRequiredAfterSignIn || "A code will be required after magic link sign-in."}
                </p>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          {totpSetupStep === "qr" && (
            <>
              <Button variant="outline" onClick={onClose}>
                {t.authSecCancel || "Cancel"}
              </Button>
              <Button onClick={onNextToVerify}>{t.authSecContinue || "Next"}</Button>
            </>
          )}
          {totpSetupStep === "verify" && (
            <>
              <Button variant="outline" onClick={onBackToQr} disabled={totpVerifying}>
                {t.authSecBack || "Back"}
              </Button>
              <Button onClick={() => onVerify(totpCode)} disabled={totpVerifying || totpCode.length !== 6}>
                {totpVerifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t.authSecVerifying || "Verifying..."}
                  </>
                ) : (
                  t.authSecVerify || "Verify"
                )}
              </Button>
            </>
          )}
          {totpSetupStep === "done" && <Button onClick={onCompleteClose}>{t.authSecDone || "Done"}</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
