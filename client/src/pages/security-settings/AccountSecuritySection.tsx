import { Copy, Loader2 } from "lucide-react";
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
  const hasPasskeys = passkeys.length > 0;
  const hasRecoveryCodes = recoveryRemaining > 0;
  const recoveryGeneratedLabel = recoveryGeneratedAt
    ? dateFormatter.format(new Date(recoveryGeneratedAt))
    : null;

  return (
    <div className="space-y-10">
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Protect your account</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage how you sign in and protect your account.
          </p>
        </div>
        <div className="space-y-0 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="flex flex-col items-start gap-4 border-b border-gray-200 p-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Passkeys (Recommended)</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sign in securely using biometrics or device authentication.
              </p>
              <p className="mt-2 text-sm text-gray-900 dark:text-white">
                {hasPasskeys
                  ? `${passkeys.length} passkey${passkeys.length !== 1 ? "s" : ""} active`
                  : "No passkeys added"}
              </p>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
              {hasPasskeys && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onResetPasskeys}
                  disabled={resettingPasskeys}
                  className="w-full sm:w-auto"
                >
                  Remove all passkeys
                </Button>
              )}
              <Button size="sm" onClick={onAddPasskey} disabled={registeringPasskey} className="w-full sm:w-auto">
                {registeringPasskey ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add passkey"
                )}
              </Button>
            </div>
          </div>

          <div className="flex flex-col items-start gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">2-step verification</p>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {totpEnabled ? "Enabled" : "Not enabled"}
              </p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {totpEnabled
                  ? "You’ll be asked for a code during sign-in and sensitive actions."
                  : "Protect your account with a 6-digit code from your authenticator app."}
              </p>
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
              <Button size="sm" onClick={onTotpSetup} disabled={totpSettingUp} className="w-full sm:w-auto">
                {totpSettingUp ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    Enabling...
                  </>
                ) : (
                  "Enable 2-step verification"
                )}
              </Button>
            )}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Account access</h2>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="flex flex-col items-start gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Email (used for account access and recovery)
              </p>
              <div className="mt-2 flex items-center gap-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">{email ?? "No email set"}</p>
                {email && (
                  <button
                    type="button"
                    onClick={onCopyEmail}
                    className="rounded p-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
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
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recovery</h2>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="flex flex-col items-start gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1 w-full">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Recovery codes</p>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {hasRecoveryCodes
                  ? `${recoveryRemaining} code${recoveryRemaining !== 1 ? "s" : ""} available`
                  : "No recovery codes available"}
              </p>
              {recoveryGeneratedLabel && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Last generated {recoveryGeneratedLabel}</p>
              )}
              {hasPasskeys && totpEnabled && (
                <div className="mt-3 max-w-xs">
                  <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">
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
              {generatingRecoveryCodes ? "Generating..." : hasRecoveryCodes ? "Generate new codes" : "Generate recovery codes"}
            </Button>
          </div>
        </div>
      </section>

      {recoveryCodes && (
        <div className="mt-4 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4">
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
