import { Copy, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PasskeyInfo } from "./types";

type Props = {
  email: string | null;
  recoveryRemaining: number;
  recoveryGeneratedAt: string | null;
  recoveryCodes: string[] | null;
  dateFormatter: Intl.DateTimeFormat;
  totpEnabled: boolean;
  passkeys: PasskeyInfo[];
  registeringPasskey: boolean;
  totpSettingUp: boolean;
  totpDisabling: boolean;
  generatingRecoveryCodes: boolean;
  resettingPasskeys: boolean;
  /** When passkeys + TOTP, optional code to generate recovery codes without a passkey prompt. */
  recoveryTotpCode: string;
  onRecoveryTotpChange: (value: string) => void;
  onCopyEmail: () => void;
  onOpenChangeEmail: () => void;
  onTotpDisable: () => void;
  onTotpSetup: () => void;
  onAddPasskey: () => void;
  onResetPasskeys: () => void;
  onGenerateRecoveryCodes: () => void;
};

export function AccountSecuritySection({
  email,
  recoveryRemaining,
  recoveryGeneratedAt,
  recoveryCodes,
  dateFormatter,
  totpEnabled,
  passkeys,
  registeringPasskey,
  totpSettingUp,
  totpDisabling,
  generatingRecoveryCodes,
  resettingPasskeys,
  recoveryTotpCode,
  onRecoveryTotpChange,
  onCopyEmail,
  onOpenChangeEmail,
  onTotpDisable,
  onTotpSetup,
  onAddPasskey,
  onResetPasskeys,
  onGenerateRecoveryCodes,
}: Props) {
  return (
    <div className="mb-12">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Account security</h2>

      <div className="space-y-0 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
        <div className="flex flex-col items-start gap-3 p-4 border-b border-gray-200 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Email</p>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">{email ?? "No email set"}</p>
              {email && (
                <button
                  type="button"
                  onClick={onCopyEmail}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                  title="Copy email"
                >
                  <Copy className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </button>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenChangeEmail}
            disabled={!email}
            className="w-full sm:w-auto"
          >
            Change email
          </Button>
        </div>

        <div className="flex flex-col items-start gap-3 p-4 border-b border-gray-200 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">2-step verification</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {totpEnabled
                ? "Use a 6-digit code from your authenticator app to verify sensitive actions and sign-ins."
                : "Add a 6-digit code from an authenticator app for sensitive actions and sign-ins."}
            </p>
            {totpEnabled && (
              <div className="flex items-center gap-1.5 mt-1">
                <ShieldCheck className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
              </div>
            )}
          </div>
          {totpEnabled ? (
            <Button
              variant="outline"
              size="sm"
              onClick={onTotpDisable}
              disabled={totpDisabling}
              className="w-full sm:w-auto"
            >
              {totpDisabling ? "Disabling..." : "Disable"}
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={onTotpSetup}
              disabled={totpSettingUp}
              className="w-full sm:w-auto"
            >
              {totpSettingUp ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Setting up...
                </>
              ) : (
                "Set up 2-step verification"
              )}
            </Button>
          )}
        </div>

        <div className="flex flex-col items-start gap-3 p-4 border-b border-gray-200 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Passkeys</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sign in with Face ID, Touch ID, or your device screen lock.
            </p>
            {passkeys.length > 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                {passkeys.length} passkey{passkeys.length !== 1 ? "s" : ""} saved
              </p>
            )}
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            {passkeys.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onResetPasskeys}
                disabled={resettingPasskeys || passkeys.length === 0}
                className="w-full sm:w-auto"
              >
                Remove all passkeys
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onAddPasskey}
              disabled={registeringPasskey}
              className="w-full sm:w-auto"
            >
              Add passkey
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 w-full">
            <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Recovery codes</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {recoveryRemaining > 0
                ? `${recoveryRemaining} unused code${recoveryRemaining !== 1 ? "s" : ""} left`
                : "No unused codes left"}
              {recoveryGeneratedAt ? ` · Last generated ${dateFormatter.format(new Date(recoveryGeneratedAt))}` : ""}
            </p>
            {passkeys.length > 0 && totpEnabled && (
              <div className="mt-3 max-w-xs">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  6-digit authenticator code (optional — skips passkey prompt)
                </p>
                <Input
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  placeholder="6-digit authenticator code"
                  value={recoveryTotpCode}
                  onChange={(e) => onRecoveryTotpChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  disabled={generatingRecoveryCodes}
                  className="h-9"
                />
              </div>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onGenerateRecoveryCodes}
            disabled={generatingRecoveryCodes}
            className="w-full sm:w-auto"
          >
            Generate new codes
          </Button>
        </div>
      </div>

      {recoveryCodes && (
        <div className="mt-4 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4">
          <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">
            Save these codes now. They will only be shown once.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm font-mono text-gray-800 dark:text-gray-100">
            {recoveryCodes.map((code) => (
              <span key={code}>{code}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
