import { useState } from "react";
import { ChevronDown, ChevronUp, Copy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
  /** Shown after passkey step-up fails or is cancelled; user enters TOTP and taps Generate again. */
  recoveryAuthenticatorFallbackOpen: boolean;
  recoveryTotpCode: string;
  onRecoveryTotpChange: (value: string) => void;
  onDismissRecoveryAuthenticatorFallback: () => void;
  onCopyEmail: () => void;
  onOpenChangeEmail: () => void;
  onTotpDisable: () => void;
  onTotpSetup: () => void;
  onAddPasskey: () => void;
  onOpenManagePasskeys: () => void;
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
  recoveryAuthenticatorFallbackOpen,
  recoveryTotpCode,
  onRecoveryTotpChange,
  onDismissRecoveryAuthenticatorFallback,
  onCopyEmail,
  onOpenChangeEmail,
  onTotpDisable,
  onTotpSetup,
  onAddPasskey,
  onOpenManagePasskeys,
  onGenerateRecoveryCodes,
}: Props) {
  const [passkeyHelpOpen, setPasskeyHelpOpen] = useState(false);
  const [totpHelpOpen, setTotpHelpOpen] = useState(false);
  const [recoveryHelpOpen, setRecoveryHelpOpen] = useState(false);
  const hasPasskeys = passkeys.length > 0;
  const hasRecoveryCodes = recoveryRemaining > 0;
  const recoveryGeneratedLabel = recoveryGeneratedAt
    ? dateFormatter.format(new Date(recoveryGeneratedAt))
    : null;

  return (
    <div className="space-y-10">
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Protect your account</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage how you sign in and protect your account.
          </p>
        </div>
        <div className="space-y-5">
          <div>
            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-[220px_minmax(0,1fr)_auto] lg:items-center lg:gap-6">
                <div className="min-w-0 lg:self-center">
                  <div className="flex items-start gap-2">
                    <p className="text-base font-medium text-gray-900 dark:text-white">Passkeys</p>
                    <span className="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-green-700 dark:bg-green-900/30 dark:text-green-300">
                      Recommended
                    </span>
                  </div>
                </div>
                <div className="min-w-0 lg:self-center">
                  <p className={`text-sm font-medium ${hasPasskeys ? "text-green-600 dark:text-green-400" : "text-gray-900 dark:text-white"}`}>
                    {hasPasskeys
                      ? `${passkeys.length} passkey${passkeys.length !== 1 ? "s" : ""} active`
                      : "No passkeys added"}
                  </p>
                </div>
                <div className="flex w-full lg:w-auto lg:justify-end lg:self-center">
                  <Button
                    variant={hasPasskeys ? "outline" : "default"}
                    size="sm"
                    onClick={hasPasskeys ? onOpenManagePasskeys : onAddPasskey}
                    disabled={registeringPasskey}
                    className="w-full sm:w-auto"
                  >
                    {registeringPasskey ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        Adding...
                      </>
                    ) : hasPasskeys ? (
                      "Manage passkeys"
                    ) : (
                      "Add passkey"
                    )}
                  </Button>
                </div>
              </div>
            </div>
            <Collapsible open={passkeyHelpOpen} onOpenChange={setPasskeyHelpOpen}>
              <div className="mt-3">
                <CollapsibleTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-sm text-sm font-medium text-blue-700 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200 dark:focus-visible:ring-blue-900/70 dark:focus-visible:ring-offset-gray-950"
                  >
                    Why use passkeys?
                    {passkeyHelpOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3">
                  <div className="rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900 dark:border-blue-900/60 dark:bg-blue-950/20 dark:text-blue-100">
                    <p>Passkeys help protect your account against phishing and password reuse.</p>
                    <p className="mt-1">They also make sign-in faster because you can use your device’s built-in authentication.</p>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          </div>

          <div>
            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-[220px_minmax(0,1fr)_auto] lg:items-center lg:gap-6">
                <div className="min-w-0 lg:self-center">
                  <p className="text-base font-medium text-gray-900 dark:text-white">2-step verification</p>
                </div>
                <div className="min-w-0 lg:self-center">
                  <p className={`text-sm font-medium ${totpEnabled ? "text-green-600 dark:text-green-400" : "text-gray-900 dark:text-white"}`}>
                    {totpEnabled ? "Enabled" : "Not enabled"}
                  </p>
                </div>
                <div className="flex w-full lg:w-auto lg:justify-end lg:self-center">
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
                        "Enable"
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <Collapsible open={totpHelpOpen} onOpenChange={setTotpHelpOpen}>
              <div className="mt-3">
                <CollapsibleTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-sm text-sm font-medium text-blue-700 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200 dark:focus-visible:ring-blue-900/70 dark:focus-visible:ring-offset-gray-950"
                  >
                    Why use 2-step verification?
                    {totpHelpOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3">
                  <div className="rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900 dark:border-blue-900/60 dark:bg-blue-950/20 dark:text-blue-100">
                    <p>A 6-digit authenticator code adds a second check when someone tries to sign in.</p>
                    <p className="mt-1">It also helps protect sensitive actions even if someone gains access to your email.</p>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Account access</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage which email you use for account access and recovery.
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-[220px_minmax(0,1fr)_auto] lg:items-center lg:gap-6">
            <div className="min-w-0 lg:self-center">
              <p className="text-base font-medium text-gray-900 dark:text-white">Email</p>
            </div>
            <div className="min-w-0 lg:self-center">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{email ?? "No email set"}</p>
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
            <div className="lg:self-center">
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenChangeEmail}
                disabled={!email}
                className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-950/30 lg:w-auto"
              >
                Change email
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recovery</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Keep backup access ready in case you lose your usual sign-in method.
          </p>
        </div>
        <div>
          <div className="rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-[220px_minmax(0,1fr)_auto] lg:items-center lg:gap-6">
              <div className="min-w-0 lg:self-center">
                <p className="text-base font-medium text-gray-900 dark:text-white">Recovery codes</p>
              </div>
              <div className="min-w-0 w-full lg:self-center">
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {hasRecoveryCodes
                    ? `${recoveryRemaining} code${recoveryRemaining !== 1 ? "s" : ""} available`
                    : "No recovery codes available"}
                </p>
                {recoveryGeneratedLabel && (
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Last generated {recoveryGeneratedLabel}</p>
                )}
              </div>
              <div className="lg:self-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onGenerateRecoveryCodes}
                  disabled={generatingRecoveryCodes}
                  className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-950/30 lg:w-auto"
                >
                  {generatingRecoveryCodes ? "Generating..." : hasRecoveryCodes ? "Generate new codes" : "Generate recovery codes"}
                </Button>
              </div>
            </div>
          </div>

          {recoveryAuthenticatorFallbackOpen && totpEnabled && (
            <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50/90 px-4 py-3 dark:border-amber-900/50 dark:bg-amber-950/30">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {hasPasskeys
                  ? "Passkey unavailable or you cancelled?"
                  : "We could not complete verification"}
              </p>
              <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                Enter the 6-digit code from your authenticator app, then tap <strong>Generate new codes</strong> again.
              </p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                <Input
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  placeholder="6-digit code"
                  value={recoveryTotpCode}
                  onChange={(e) => onRecoveryTotpChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  disabled={generatingRecoveryCodes}
                  className="h-9 max-w-xs"
                  aria-label="Authenticator code for recovery code generation"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="self-start text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                  onClick={onDismissRecoveryAuthenticatorFallback}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          )}

          <Collapsible open={recoveryHelpOpen} onOpenChange={setRecoveryHelpOpen}>
            <div className="mt-3">
              <CollapsibleTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-sm text-sm font-medium text-blue-700 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200 dark:focus-visible:ring-blue-900/70 dark:focus-visible:ring-offset-gray-950"
                >
                  Why use recovery codes?
                  {recoveryHelpOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3">
                <div className="rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900 dark:border-blue-900/60 dark:bg-blue-950/20 dark:text-blue-100">
                  <p>Recovery codes give you a backup way to access your account if you lose your device.</p>
                  <p className="mt-1">Store them somewhere safe because they can help you recover access when other methods are unavailable.</p>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
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
