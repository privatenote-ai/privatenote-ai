import React from "react";
import {
  Crown,
  Eye,
  Lock,
  Timer,
  Shield,
  User,
  Languages,
  Palette,
} from "lucide-react";
import {
  isNoteExpiryPresetId,
  noteExpiryPresetsForAccount,
  noteExpiryPresetDisplayLabel,
  type NoteExpiryPresetId,
} from "@shared/noteExpiry";
import {
  NOTE_READ_LIMIT_OPTIONS,
  type NoteReadLimit,
} from "@shared/noteReadLimits";
import {
  NOTE_FILE_ACCESS_WINDOW_OPTIONS,
  formatNoteFileAccessWindow,
  type NoteFileAccessWindowSeconds,
} from "@shared/noteFileAccess";
import {
  DEFAULT_STRONG_PASSWORD_LENGTH,
  TRANSPORT_SAFE_STRONG_PASSWORD_CHARSET,
} from "@shared/transportSafePassword";
import {
  SIMPLE_PASSWORD_ADJECTIVES,
  SIMPLE_PASSWORD_NOUNS,
} from "./simplePasswordWordlists";
import type { PasswordStrength, BreachState } from "@/hooks/usePasswordBreachCheck";
import { Link } from "wouter";
import { useLanguage } from "@/context/LanguageContext";
import { localizedPath } from "@/utils/localizedPath";
import { LANGUAGE_OPTIONS, type SupportedLanguage } from "@/utils/translation";
import { NOTE_LABEL_MAX_LENGTH } from "@/utils/noteLabelsStorage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SELECT_CHEVRON_STYLE = {
  backgroundImage:
    "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
  backgroundRepeat: "no-repeat" as const,
  backgroundPosition: "right 0.75rem center",
  backgroundSize: "0.75em",
};

function SettingsFieldHelper({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs leading-snug text-gray-500 dark:text-gray-400">{children}</p>
  );
}

function SettingsInfoTooltip({
  text,
  children,
}: {
  text?: string;
  children: React.ReactElement;
}) {
  if (!text) return children;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="top" className="max-w-[260px] text-xs leading-snug">
        {text}
      </TooltipContent>
    </Tooltip>
  );
}

function SettingsFieldLabel({
  htmlFor,
  icon,
  iconToneClassName,
  label,
  info,
}: {
  htmlFor?: string;
  icon: React.ReactNode;
  iconToneClassName: string;
  label: string;
  info?: string;
}) {
  const content = (
    <>
      <SettingsInfoTooltip text={info}>
        <span
          className={`mr-2 shrink-0 rounded p-1 ${iconToneClassName}${info ? " cursor-help" : ""}`}
          tabIndex={info ? 0 : undefined}
          aria-label={info}
        >
          {icon}
        </span>
      </SettingsInfoTooltip>
      <span className="min-w-0">{label}</span>
    </>
  );
  const className = "flex items-center text-sm font-medium text-gray-700 dark:text-gray-300";
  if (htmlFor) {
    return (
      <label htmlFor={htmlFor} className={className}>
        {content}
      </label>
    );
  }
  return <div className={className}>{content}</div>;
}

function translatedFileAccessWindowLabel(
  seconds: NoteFileAccessWindowSeconds,
  t: Record<string, string>,
): string {
  if (seconds === 15 * 60) {
    return t.fileAccessWindow15Min ?? formatNoteFileAccessWindow(seconds);
  }
  if (seconds === 30 * 60) {
    return t.fileAccessWindow30Min ?? formatNoteFileAccessWindow(seconds);
  }
  if (seconds === 60 * 60) {
    return t.fileAccessWindow1Hour ?? formatNoteFileAccessWindow(seconds);
  }
  return formatNoteFileAccessWindow(seconds);
}

function translatedExpiryLabel(expiryValue: NoteExpiryPresetId, t: Record<string, string>): string {
  if (expiryValue === "5m") return t.expiry5m;
  if (expiryValue === "10m") return t.expiry10m;
  if (expiryValue === "30m") return t.expiry30m;
  if (expiryValue === "1h") return t.expiry1h;
  if (expiryValue === "2h") return t.expiry2h;
  if (expiryValue === "8h") return t.expiry8h;
  if (expiryValue === "1d") return t.expiry1d;
  if (expiryValue === "3d") return t.expiry3d;
  if (expiryValue === "7d") return t.expiry7d;
  if (expiryValue === "14d") return t.expiry14d;
  if (expiryValue === "15d") return t.expiry15d ?? noteExpiryPresetDisplayLabel(expiryValue);
  if (expiryValue === "30d") return t.expiry30d;
  return expiryValue;
}

function translatedReadLimitLabel(limit: NoteReadLimit, t: Record<string, string>): string {
  if (limit === 1) return t.viewLimitOnce ?? "Once (read-once)";
  if (limit === 2) return t.viewLimitTwice ?? "2 views";
  if (limit === 3) return t.viewLimitThree ?? "3 views";
  return t.viewLimitFive ?? "5 views";
}

function translatedStrengthLabel(
  strength: PasswordStrength | null,
  t: Record<string, string>,
): string {
  if (!strength) return "";
  if (strength.score <= 0) return t.strengthVeryWeak ?? strength.label;
  if (strength.score === 1) return t.strengthWeak ?? strength.label;
  if (strength.score === 2) return t.strengthFair ?? strength.label;
  if (strength.score === 3) return t.strengthStrong ?? strength.label;
  return t.strengthVeryStrong ?? strength.label;
}

// Uniform integer in [0, max) — rejection sampling avoids modulo bias.
const secureRandomInt = (max: number): number => {
  if (!Number.isInteger(max) || max <= 0) {
    throw new RangeError("secureRandomInt: max must be a positive integer");
  }
  if (max > 0x1_0000_0000) {
    throw new RangeError("secureRandomInt: max exceeds uint32 range");
  }
  const modulus = 0x1_0000_0000;
  const limit = Math.floor(modulus / max) * max;
  const randomBuffer = new Uint32Array(1);
  let x: number;
  do {
    window.crypto.getRandomValues(randomBuffer);
    x = randomBuffer[0];
  } while (x >= limit);
  return x % max;
};

export const generateHumanFriendlyPassword = (): string => {
  const randomAdjective =
    SIMPLE_PASSWORD_ADJECTIVES[secureRandomInt(SIMPLE_PASSWORD_ADJECTIVES.length)];
  const randomNoun = SIMPLE_PASSWORD_NOUNS[secureRandomInt(SIMPLE_PASSWORD_NOUNS.length)];
  let numbers = "";
  for (let i = 0; i < 4; i += 1) {
    numbers += secureRandomInt(10).toString();
  }
  return `${randomAdjective}-${randomNoun}-${numbers}`;
};

export const generateStrongPassword = (): string => {
  const length = DEFAULT_STRONG_PASSWORD_LENGTH;
  const charset = TRANSPORT_SAFE_STRONG_PASSWORD_CHARSET;
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset[secureRandomInt(charset.length)];
  }
  return password;
};

type PremiumFeature = {
  title: string;
  description: string;
};

export type ReaderLanguageSetting = "auto" | SupportedLanguage;

function SectionHeading({
  title,
  id,
  showPremiumBadge,
  premiumLabel,
}: {
  title: string;
  id?: string;
  showPremiumBadge?: boolean;
  premiumLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2 px-1 pt-2">
      <h3 id={id} className="text-sm font-semibold text-gray-800 dark:text-gray-100">
        {title}
      </h3>
      {showPremiumBadge ? (
        <span className="inline-flex shrink-0 items-center rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:border-amber-700/50 dark:bg-amber-900/20 dark:text-amber-300">
          <Crown className="mr-1 h-3 w-3" aria-hidden />
          {premiumLabel}
        </span>
      ) : null}
    </div>
  );
}

function SettingsOptionList({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-md border border-gray-200/80 bg-white/50 divide-y divide-gray-200/80 dark:border-gray-700/80 dark:bg-gray-950/20 dark:divide-gray-700/80">
      {children}
    </div>
  );
}

function SettingsToggleRow({
  id,
  title,
  info,
  checked,
  locked,
  onCheckedChange,
  onLockedClick,
}: {
  id?: string;
  title: string;
  info: string;
  checked?: boolean;
  locked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onLockedClick?: () => void;
}) {
  const titleContent = (
    <SettingsInfoTooltip text={info}>
      <span
        className="flex min-w-0 flex-1 cursor-help items-center text-sm font-medium text-gray-800 dark:text-gray-200"
        tabIndex={0}
        aria-label={info}
      >
        <span className="truncate">{title}</span>
      </span>
    </SettingsInfoTooltip>
  );

  if (locked) {
    const className =
      "flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-white/60 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/30 dark:hover:bg-gray-900/40";
    if (onLockedClick) {
      return (
        <button type="button" onClick={onLockedClick} className={className}>
          <Lock className="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500" aria-hidden />
          {titleContent}
        </button>
      );
    }
    return (
      <div className={className} aria-disabled="true">
        <Lock className="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500" aria-hidden />
        {titleContent}
      </div>
    );
  }

  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center gap-3 px-3 py-2.5 transition-colors hover:bg-white/60 dark:hover:bg-gray-900/40"
    >
      <input
        id={id}
        type="checkbox"
        className="h-4 w-4 shrink-0 rounded border-gray-300 text-primary focus:ring-primary"
        checked={checked}
        onChange={(event) => onCheckedChange?.(event.target.checked)}
      />
      {titleContent}
    </label>
  );
}

function PremiumSectionFooter({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-1 text-xs leading-snug text-gray-500 dark:text-gray-400">{children}</p>
  );
}

export type NoteSettingsPanelProps = {
  /** inline = accordion on create page; overlay = inside sheet/modal experiment */
  presentation?: "inline" | "overlay";
  variant?: "note" | "file-transfer";
  showAdvancedOptions: boolean;
  password: string;
  setPassword: (p: string) => void;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  passwordSource: "simple" | "strong" | "manual" | null;
  setPasswordSource: (s: "simple" | "strong" | "manual" | null) => void;
  passwordStrength: PasswordStrength | null;
  breachState: BreachState;
  breachCount: number | null;
  expiryValue: NoteExpiryPresetId;
  setExpiryValue: (v: NoteExpiryPresetId) => void;
  notifyOnOpen: boolean;
  setNotifyOnOpen: (v: boolean) => void;
  notifyOnDestroyed: boolean;
  setNotifyOnDestroyed: (v: boolean) => void;
  canNotifyOnOpen: boolean;
  noteLabel: string;
  setNoteLabel: (v: string) => void;
  isPremiumUser: boolean;
  maxExpirySeconds: number;
  allowedReadCounts: readonly number[];
  maxFileAccessWindowSeconds: number;
  isSignedIn: boolean;
  premiumStatusLoading: boolean;
  restrictRecipientEmail: boolean;
  setRestrictRecipientEmail: (v: boolean) => void;
  requireRecipientVerification: boolean;
  setRequireRecipientVerification: (v: boolean) => void;
  recipientEmail: string;
  setRecipientEmail: (v: string) => void;
  readCount: NoteReadLimit;
  setReadCount: (value: NoteReadLimit) => void;
  fileAccessWindowSeconds: NoteFileAccessWindowSeconds;
  setFileAccessWindowSeconds: (value: NoteFileAccessWindowSeconds) => void;
  readerLanguage: ReaderLanguageSetting;
  setReaderLanguage: (value: ReaderLanguageSetting) => void;
  /** Business — show the account's saved branding on the reveal page. */
  canBrandRevealPage: boolean;
  /** False when the plan allows branding but the account has not set any up. */
  hasRevealBranding: boolean;
  applyBranding: boolean;
  setApplyBranding: (v: boolean) => void;
  /** Starter+ — persist current settings as synced account defaults. */
  onSaveDefaults?: () => Promise<void>;
};

export const NoteSettingsPanel: React.FC<NoteSettingsPanelProps> = ({
  presentation = "inline",
  variant = "note",
  showAdvancedOptions,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  passwordSource,
  setPasswordSource,
  passwordStrength,
  breachState,
  breachCount,
  expiryValue,
  setExpiryValue,
  notifyOnOpen,
  setNotifyOnOpen,
  notifyOnDestroyed,
  setNotifyOnDestroyed,
  canNotifyOnOpen,
  noteLabel,
  setNoteLabel,
  isPremiumUser,
  maxExpirySeconds,
  allowedReadCounts,
  maxFileAccessWindowSeconds,
  isSignedIn,
  premiumStatusLoading,
  restrictRecipientEmail,
  setRestrictRecipientEmail,
  requireRecipientVerification,
  setRequireRecipientVerification,
  recipientEmail,
  setRecipientEmail,
  readCount,
  setReadCount,
  fileAccessWindowSeconds,
  setFileAccessWindowSeconds,
  readerLanguage,
  setReaderLanguage,
  canBrandRevealPage,
  hasRevealBranding,
  applyBranding,
  setApplyBranding,
  onSaveDefaults,
}) => {
  const { t, language } = useLanguage();
  const isFileTransfer = variant === "file-transfer";
  const premiumUpgradeHref = localizedPath("/premium", language);
  const preferencesHref = localizedPath("/account/preferences", language);
  const brandingHref = localizedPath("/account/branding", language);
  const [selectedPremiumFeature, setSelectedPremiumFeature] =
    React.useState<PremiumFeature | null>(null);
  const [savingDefaults, setSavingDefaults] = React.useState(false);
  const [defaultsSaved, setDefaultsSaved] = React.useState(false);

  const brandedRevealFeature = React.useMemo<PremiumFeature>(
    () => ({
      title: t.settingsDeliveryBrandedReveal ?? "Branded reveal page",
      description:
        t.settingsDeliveryBrandedRevealInfo ??
        "Show your brand on the page where the recipient opens the note.",
    }),
    [t],
  );
  const recipientLockTitle = isFileTransfer
    ? "Only this email can open"
    : t.settingsDeliveryRestrictEmail ?? "Restrict to recipient email";
  const recipientLockInfo = isFileTransfer
    ? "Lock this transfer to one recipient email before the encrypted file can be opened."
    : t.settingsDeliveryRestrictEmailInfo ?? "Only the intended recipient can reveal the note.";
  const recipientCodeTitle = isFileTransfer
    ? "Require recipient code"
    : t.settingsDeliveryVerifyEmail ?? "Require email verification";
  const recipientCodeInfo = isFileTransfer
    ? "Generate a one-time code for the sender to share separately. The recipient must enter it before the file opens."
    : t.settingsDeliveryVerifyEmailInfo ?? "Verify the recipient before the note is shown.";

  const settingsBody = (
    <TooltipProvider delayDuration={200}>
    <div className="mx-auto w-full min-w-0 max-w-2xl space-y-6">
            <section
              className="space-y-3 rounded-lg border border-gray-200 bg-gray-50/70 px-3 pb-3 pt-2 dark:border-gray-800 dark:bg-gray-900/35"
              aria-labelledby="note-access-controls-heading"
            >
              <SectionHeading id="note-access-controls-heading" title={t.settingsAccessControls} />

              <div className="grid grid-cols-1 gap-2 items-start px-1 pb-2 pt-4 transition-colors sm:grid-cols-3">
                <div className="sm:col-span-1">
            <SettingsFieldLabel
              htmlFor="note-password"
              icon={<Lock className="h-4 w-4 text-green-500 dark:text-green-400" />}
              iconToneClassName="bg-green-50 dark:bg-green-900/30"
              label={t.password}
              info={t.settingsPasswordInfo}
            />
          </div>
          <div className="min-w-0 sm:col-span-2">
            <div className="relative min-w-0">
              <div className="flex min-w-0 flex-col gap-2 min-[520px]:flex-row min-[520px]:gap-0">
                <div className="flex min-w-0 flex-1">
                <input
                  id="note-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordSource("manual");
                  }}
                  placeholder={t.passwordPlaceholder}
                  className="w-full min-w-0 rounded-l-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-gray-800 shadow-sm placeholder:text-xs focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="px-2 py-1.5 bg-gray-100 dark:bg-gray-600 border-t border-b border-gray-300 dark:border-gray-600 text-xs text-gray-700 dark:text-gray-300"
                  title={showPassword ? t.hidePassword : t.showPassword}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
                </div>
                <div className="grid grid-cols-2 min-[520px]:flex">
                  <button
                    type="button"
                    onClick={() => {
                      setPassword(generateHumanFriendlyPassword());
                      setPasswordSource("simple");
                    }}
                    className="flex min-w-0 items-center justify-center border border-gray-300 bg-green-50 px-2 py-1.5 text-xs text-green-700 hover:bg-green-100 dark:border-gray-600 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50"
                    title={t.passwordGeneratorSimpleHint}
                  >
                    <User className="h-4 w-4 mr-1" />
                    <span>{t.simple}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPassword(generateStrongPassword());
                      setPasswordSource("strong");
                    }}
                    className="flex min-w-0 items-center justify-center rounded-r-md border-b border-r border-t border-gray-300 bg-blue-50 px-2 py-1.5 text-xs text-blue-700 hover:bg-blue-100 dark:border-gray-600 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                    title={t.passwordGeneratorStrongHint}
                  >
                    <Shield className="h-4 w-4 mr-1" />
                    <span>{t.strong}</span>
                  </button>
                </div>
              </div>
              <div className="mt-2">
                <SettingsFieldHelper>{t.passwordRecipientsNeedToDecrypt}</SettingsFieldHelper>
              </div>
              {password.trim() && (
                <div className="mt-1 flex flex-col gap-0.5 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    {passwordStrength && (
                      <span className="whitespace-nowrap">
                        {t.passwordStrengthLabel}{" "}
                        <span className={`font-medium ${passwordStrength.color}`}>
                          {translatedStrengthLabel(passwordStrength, t)}
                        </span>
                      </span>
                    )}
                    <span className="h-1 w-1 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
                    <span className="whitespace-nowrap">
                      {breachState === "checking" && t.passwordBreachChecking}
                      {breachState === "safe" && t.passwordBreachNotFound}
                      {breachState === "pwned" &&
                        `${t.passwordBreachFound}${breachCount ? ` (${breachCount.toLocaleString()})` : ""}`}
                      {breachState === "error" && t.passwordBreachUnavailable}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

              <div className="flex flex-col space-y-2">
                <div className="grid grid-cols-1 gap-2 items-start px-1 py-2 transition-colors sm:grid-cols-3">
                  <div className="sm:col-span-1">
              <SettingsFieldLabel
                htmlFor="expiry-value"
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-blue-500 dark:text-blue-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                }
                iconToneClassName="bg-blue-50 dark:bg-blue-900/30"
                label={t.settingsNoteLifetime ?? t.expiration}
                info={t.settingsNoteLifetimeInfo}
              />
            </div>
                  <div className="min-w-0 space-y-1.5 sm:col-span-2">
              <select
                id="expiry-value"
                value={expiryValue}
                onChange={(e) => {
                  const v = e.target.value;
                  if (isNoteExpiryPresetId(v)) setExpiryValue(v);
                }}
                className="w-full px-2.5 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600 backdrop-blur-md text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 shadow-sm appearance-none cursor-pointer"
                style={SELECT_CHEVRON_STYLE}
              >
                {noteExpiryPresetsForAccount(maxExpirySeconds).map((p) => (
                  <option key={p.id} value={p.id}>
                    {translatedExpiryLabel(p.id, t)}
                  </option>
                ))}
              </select>
              <SettingsFieldHelper>
                {t.settingsNoteLifetimeHint ?? "When the link stops working if never opened."}
              </SettingsFieldHelper>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 items-start px-1 py-2 transition-colors sm:grid-cols-3">
                  <div className="sm:col-span-1">
                    <SettingsFieldLabel
                      htmlFor="note-read-limit"
                      icon={<Eye className="h-4 w-4 text-teal-600 dark:text-teal-400" />}
                      iconToneClassName="bg-teal-50 dark:bg-teal-900/30"
                      label={t.settingsOpenLimit ?? t.viewLimit}
                      info={t.settingsOpenLimitInfo}
                    />
            </div>
            <div className="min-w-0 space-y-1.5 sm:col-span-2">
              <select
                id="note-read-limit"
                value={readCount}
                disabled={premiumStatusLoading}
                onChange={(e) => {
                  const next = Number(e.target.value);
                  if (!NOTE_READ_LIMIT_OPTIONS.includes(next as NoteReadLimit)) return;
                  if (!allowedReadCounts.includes(next)) return;
                  setReadCount(next as NoteReadLimit);
                }}
                className="w-full px-2.5 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600 backdrop-blur-md text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 shadow-sm appearance-none cursor-pointer disabled:cursor-wait disabled:opacity-60"
                style={SELECT_CHEVRON_STYLE}
              >
                {NOTE_READ_LIMIT_OPTIONS.map((limit) => {
                  const locked = !allowedReadCounts.includes(limit);
                  return (
                    <option key={limit} value={limit} disabled={locked}>
                      {translatedReadLimitLabel(limit, t)}
                      {locked
                        ? limit === 5
                          ? " (Business)"
                          : ` (${t.premium ?? "Starter"})`
                        : ""}
                    </option>
                  );
                })}
              </select>
              <SettingsFieldHelper>
                {allowedReadCounts.length > 1
                  ? (t.settingsOpenLimitHint ?? t.viewLimitPremiumHint)
                  : (t.viewLimitFreeDescription ?? "Free accounts use read-once.")}
              </SettingsFieldHelper>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 items-start px-1 py-2 transition-colors sm:grid-cols-3">
            <div className="sm:col-span-1">
              <SettingsFieldLabel
                htmlFor="note-file-access-window"
                icon={<Timer className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />}
                iconToneClassName="bg-indigo-50 dark:bg-indigo-900/30"
                label={t.settingsFileDownloads ?? "File downloads"}
                info={t.settingsFileDownloadsInfo}
              />
            </div>
            <div className="min-w-0 space-y-1.5 sm:col-span-2">
              <select
                id="note-file-access-window"
                value={fileAccessWindowSeconds}
                disabled={premiumStatusLoading}
                onChange={(e) => {
                  const next = Number(e.target.value);
                  if (!NOTE_FILE_ACCESS_WINDOW_OPTIONS.includes(next as NoteFileAccessWindowSeconds)) {
                    return;
                  }
                  if (next > maxFileAccessWindowSeconds) return;
                  setFileAccessWindowSeconds(next as NoteFileAccessWindowSeconds);
                }}
                className="w-full px-2.5 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600 backdrop-blur-md text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 shadow-sm appearance-none cursor-pointer disabled:cursor-wait disabled:opacity-60"
                style={SELECT_CHEVRON_STYLE}
              >
                {NOTE_FILE_ACCESS_WINDOW_OPTIONS.map((seconds) => {
                  const locked = seconds > maxFileAccessWindowSeconds;
                  return (
                    <option key={seconds} value={seconds} disabled={locked}>
                      {translatedFileAccessWindowLabel(seconds, t)}
                      {locked
                        ? seconds === 60 * 60
                          ? " (Business)"
                          : ` (${t.premium ?? "Starter"})`
                        : ""}
                    </option>
                  );
                })}
              </select>
              <SettingsFieldHelper>
                {t.settingsFileDownloadsHint ??
                  "How long attachments stay downloadable after the note is opened."}
              </SettingsFieldHelper>
            </div>
          </div>

        </div>
            </section>

            <section
              className="space-y-2 rounded-lg border border-gray-200 bg-gray-50/70 px-3 pb-3 pt-2 dark:border-gray-800 dark:bg-gray-900/35"
              aria-labelledby="note-email-alerts-heading"
            >
              <SectionHeading
                id="note-email-alerts-heading"
                title={t.settingsEmailAlerts ?? "Email alerts"}
                showPremiumBadge={false}
              />
              <SettingsOptionList>
                {readCount === 1 ? (
                  <SettingsToggleRow
                    id="notify-on-opened-destroyed"
                    locked={!canNotifyOnOpen}
                    checked={notifyOnOpen || notifyOnDestroyed}
                    onCheckedChange={(enabled) => {
                      setNotifyOnOpen(enabled);
                      setNotifyOnDestroyed(enabled);
                    }}
                    title={
                      t.settingsEmailAlertOnOpenedDestroyed ??
                      "When this note is opened and destroyed"
                    }
                    info={
                      t.settingsEmailAlertOnOpenedDestroyedInfo ??
                      "One email when the one-time link is accessed and the note is destroyed. Message content is never included."
                    }
                  />
                ) : (
                  <>
                    <SettingsToggleRow
                      id="notify-on-open"
                      locked={!canNotifyOnOpen}
                      checked={notifyOnOpen}
                      onCheckedChange={setNotifyOnOpen}
                      title={t.settingsEmailAlertOnOpen ?? "When this note is opened"}
                      info={
                        t.settingsEmailAlertOnOpenInfo ??
                        "One email when the link is accessed. Message content is never included."
                      }
                    />
                    <SettingsToggleRow
                      id="notify-on-destroyed"
                      locked={!canNotifyOnOpen}
                      checked={notifyOnDestroyed}
                      onCheckedChange={setNotifyOnDestroyed}
                      title={t.settingsEmailAlertOnDestroyed ?? "When this note is destroyed"}
                      info={
                        t.settingsEmailAlertOnDestroyedInfo ??
                        "One email when the note can no longer be opened."
                      }
                    />
                  </>
                )}
              </SettingsOptionList>
              {isPremiumUser ? (
                <div className="px-1 pt-2">
                  <label
                    htmlFor="note-label"
                    className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
                  >
                    {t.settingsNoteLabel ?? "Note label"}
                  </label>
                  <input
                    id="note-label"
                    type="text"
                    maxLength={NOTE_LABEL_MAX_LENGTH}
                    value={noteLabel}
                    onChange={(event) => setNoteLabel(event.target.value)}
                    placeholder={t.settingsNoteLabelPlaceholder ?? "e.g. Client onboarding pack"}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {t.settingsNoteLabelHint ??
                      "Optional. Shown only in your Notification Center on this device — never sent with the note."}
                  </p>
                </div>
              ) : null}
              {!canNotifyOnOpen && !premiumStatusLoading ? (
                <PremiumSectionFooter>
                  {isSignedIn ? (
                    <>
                      {t.settingsEmailAlertsPrefsHintPrefix ??
                        "Verify your email and turn on email notifications in"}{" "}
                      <Link
                        href={preferencesHref}
                        className="font-medium text-primary hover:underline"
                      >
                        {t.settingsEmailAlertsPrefsLink ?? "Account → Preferences"}
                      </Link>
                      .
                    </>
                  ) : (
                    <>
                      {t.settingsEmailAlertsSignInHint ??
                        "Sign in with a verified email to get open and destroy alerts."}
                    </>
                  )}
                </PremiumSectionFooter>
              ) : null}
            </section>

            <section
              className="space-y-2 rounded-lg border border-gray-200 bg-gray-50/70 px-3 pb-3 pt-2 dark:border-gray-800 dark:bg-gray-900/35"
              aria-labelledby="note-delivery-verification-heading"
            >
              <SectionHeading
                id="note-delivery-verification-heading"
                title={isFileTransfer ? "Recipient verification" : t.settingsDeliveryVerification ?? "Delivery & verification"}
                showPremiumBadge={!isPremiumUser}
                premiumLabel={t.premium ?? "Starter"}
              />
              {isFileTransfer ? (
                <p className="px-1 text-xs leading-snug text-gray-500 dark:text-gray-400">
                  Make the transfer link less generic: bind it to a recipient email, add a sender-held code, or use both.
                </p>
              ) : null}
              <SettingsOptionList>
                <div className="grid grid-cols-1 gap-2 px-3 py-2.5 sm:grid-cols-[minmax(0,1fr)_minmax(11rem,14rem)] sm:items-start">
                  <div className="min-w-0">
                    <SettingsFieldLabel
                      htmlFor="reader-language"
                      icon={<Languages className="h-4 w-4 text-sky-600 dark:text-sky-400" />}
                      iconToneClassName="bg-sky-50 dark:bg-sky-900/30"
                      label={t.settingsReaderLanguage ?? "Reader Language"}
                      info={
                        t.settingsReaderLanguageInfo ??
                        "Choose the language used for the note reveal page. Auto uses the recipient's browser language."
                      }
                    />
                    <p className="mt-1 text-xs leading-snug text-gray-500 dark:text-gray-400">
                      {t.settingsReaderLanguageDescription ??
                        "Choose the language used for the note reveal page. Auto uses the recipient's browser language."}
                    </p>
                  </div>
                  <select
                    id="reader-language"
                    value={readerLanguage}
                    disabled={!isPremiumUser || premiumStatusLoading}
                    onChange={(event) => setReaderLanguage(event.target.value as ReaderLanguageSetting)}
                    onClick={() => {
                      if (!isPremiumUser) {
                        setSelectedPremiumFeature({
                          title: t.settingsReaderLanguage ?? "Reader Language",
                          description:
                            t.settingsReaderLanguageDescription ??
                            "Choose the language used for the note reveal page. Auto uses the recipient's browser language.",
                        });
                      }
                    }}
                    className="w-full rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-gray-800 shadow-sm appearance-none cursor-pointer focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200"
                    style={SELECT_CHEVRON_STYLE}
                  >
                    <option value="auto">{t.settingsReaderLanguageAuto ?? "Auto"}</option>
                    {LANGUAGE_OPTIONS.map((option) => (
                      <option key={option.code} value={option.code}>
                        {option.nativeName}
                      </option>
                    ))}
                  </select>
                </div>
                <SettingsToggleRow
                  id="restrict-recipient-email"
                  locked={!isPremiumUser}
                  checked={restrictRecipientEmail}
                  onCheckedChange={(checked) => {
                    setRestrictRecipientEmail(checked);
                    if (!checked) setRecipientEmail("");
                  }}
                  title={recipientLockTitle}
                  info={recipientLockInfo}
                  onLockedClick={
                    isPremiumUser ? undefined : () =>
                      setSelectedPremiumFeature({
                        title: recipientLockTitle,
                        description: recipientLockInfo,
                      })
                  }
                />
                <SettingsToggleRow
                  id="require-recipient-verification"
                  locked={!isPremiumUser}
                  checked={requireRecipientVerification}
                  onCheckedChange={setRequireRecipientVerification}
                  title={recipientCodeTitle}
                  info={recipientCodeInfo}
                  onLockedClick={
                    isPremiumUser ? undefined : () =>
                      setSelectedPremiumFeature({
                        title: recipientCodeTitle,
                        description: recipientCodeInfo,
                      })
                  }
                />
                {isFileTransfer ? (
                  <div className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300">
                    <Shield
                      className={`h-4 w-4 shrink-0 ${requireRecipientVerification ? "text-primary" : "text-gray-400 dark:text-gray-500"}`}
                      aria-hidden
                    />
                    <span className="min-w-0">
                      {requireRecipientVerification
                        ? "Verification code will be shown to sender after upload"
                        : "Enable recipient code to show the sender a verification code after upload"}
                    </span>
                  </div>
                ) : null}
                {canBrandRevealPage ? (
                  hasRevealBranding ? (
                    <SettingsToggleRow
                      id="apply-branding"
                      locked={false}
                      checked={applyBranding}
                      onCheckedChange={setApplyBranding}
                      title={brandedRevealFeature.title}
                      info={brandedRevealFeature.description}
                    />
                  ) : (
                    <div className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300">
                      <Palette className="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500" aria-hidden />
                      <span className="min-w-0">
                        <a
                          href={brandingHref}
                          className="underline underline-offset-2 hover:text-primary"
                        >
                          {t.settingsDeliveryBrandedRevealSetUp ?? "Add your company branding"}
                        </a>{" "}
                        {t.settingsDeliveryBrandedRevealSetUpHint ??
                          "to show it on the reveal page."}
                      </span>
                    </div>
                  )
                ) : (
                  <SettingsToggleRow
                    locked
                    title={brandedRevealFeature.title}
                    info={brandedRevealFeature.description}
                    onLockedClick={() => setSelectedPremiumFeature(brandedRevealFeature)}
                  />
                )}
              </SettingsOptionList>
              {isPremiumUser && restrictRecipientEmail ? (
                <div className="px-1 pt-1">
                  <label
                    htmlFor="recipient-email"
                    className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
                  >
                    {t.settingsRecipientEmail ?? "Recipient email"}
                  </label>
                  <input
                    id="recipient-email"
                    type="email"
                    autoComplete="email"
                    value={recipientEmail}
                    onChange={(event) => setRecipientEmail(event.target.value)}
                    placeholder={t.settingsRecipientEmailPlaceholder ?? "recipient@example.com"}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {isFileTransfer
                      ? "The recipient must enter this exact email before the encrypted file can be opened."
                      : t.settingsRecipientEmailHint ??
                        "The recipient must enter this email before the note can be revealed."}
                  </p>
                </div>
              ) : null}
              {!isPremiumUser ? (
                <PremiumSectionFooter>
                  {t.settingsPremiumFeatureLabel ?? "Starter and Business feature —"}{" "}
                  <a href={premiumUpgradeHref} className="font-medium text-primary hover:underline">
                    {t.settingsDeliveryUpgradeLink ?? "Upgrade to unlock delivery controls"}
                  </a>
                </PremiumSectionFooter>
              ) : null}
            </section>
            {isPremiumUser && onSaveDefaults ? (
              <div className="flex items-center justify-end gap-3 px-1">
                {defaultsSaved ? (
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    {t.authPrefsSaved ?? "Saved"}
                  </span>
                ) : null}
                <button
                  type="button"
                  disabled={savingDefaults}
                  onClick={() => {
                    setSavingDefaults(true);
                    setDefaultsSaved(false);
                    void onSaveDefaults()
                      .then(() => setDefaultsSaved(true))
                      .catch(() => setDefaultsSaved(false))
                      .finally(() => setSavingDefaults(false));
                  }}
                  className="rounded-md border border-primary/40 px-3 py-2 text-xs font-medium text-primary hover:bg-primary/5 disabled:opacity-60"
                >
                  {savingDefaults ? "Saving…" : "Save these as my defaults"}
                </button>
              </div>
            ) : null}
          </div>
    </TooltipProvider>
  );

  const settingsShell =
    presentation === "overlay" ? (
      settingsBody
    ) : (
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
          showAdvancedOptions ? "mb-3 grid-rows-[1fr] opacity-100" : "mb-0 grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">{settingsBody}</div>
      </div>
    );

  return (
    <>
      {settingsShell}
      <Dialog
        open={selectedPremiumFeature !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedPremiumFeature(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {t.settingsPremiumFeatureDialogTitle ?? "Available with Starter and Business"}
            </DialogTitle>
            <DialogDescription>
              {selectedPremiumFeature?.description ??
                t.settingsPremiumFeatureDialogFallback ??
                "Choose Starter or Business to unlock delivery and verification controls."}
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-800/60 dark:bg-amber-900/20 dark:text-amber-100">
            {(
              t.settingsPremiumFeaturePartOfPremium ??
              "{feature} is included with Starter and Business."
            ).replace(
              "{feature}",
              selectedPremiumFeature?.title ?? "Delivery & Verification",
            )}
          </div>
          <a
            href={premiumUpgradeHref}
            className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            {t.settingsUpgradeToPremium ?? "Compare plans"}
          </a>
        </DialogContent>
      </Dialog>
    </>
  );
};
