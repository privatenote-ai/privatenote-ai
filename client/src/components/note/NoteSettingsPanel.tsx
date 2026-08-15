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
  Tag,
  MailCheck,
  Bell,
  BellOff,
  Download,
  Mic,
  Mail,
  Clock,
  BadgeCheck,
} from "lucide-react";
import {
  isNoteExpiryPresetId,
  noteExpiryPresetDisplayLabel,
  noteExpiryPresetIdToSeconds,
  NOTE_EXPIRY_PRESETS,
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
import type { AccountType } from "@shared/planCatalog";
import {
  BUSINESS_RECEIPT_ACK_PRESETS,
  RECEIPT_ACK_STATEMENT_MAX_LENGTH,
} from "@shared/receiptAcknowledgment";
import {
  DEFAULT_STRONG_PASSWORD_LENGTH,
  TRANSPORT_SAFE_STRONG_PASSWORD_CHARSET,
} from "@shared/transportSafePassword";
import {
  SIMPLE_PASSWORD_ADJECTIVES,
  SIMPLE_PASSWORD_NOUNS,
} from "./simplePasswordWordlists";
import type { PasswordStrength, BreachState } from "@/hooks/usePasswordBreachCheck";
import { Switch } from "@/components/ui/switch";
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
import { PasswordsLuPartnerFooter } from "@/components/PasswordsLuPartnerLinks";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SELECT_CHEVRON_STYLE = {
  backgroundImage:
    "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
  backgroundRepeat: "no-repeat" as const,
  backgroundPosition: "right 0.75rem center",
  backgroundSize: "0.75em",
};

const SETTINGS_SELECT_CLASS =
  "w-full px-2.5 py-1.5 text-sm rounded-md border border-gray-300 bg-white text-gray-800 shadow-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:[color-scheme:dark]";

/** Native <option> styling for locked (premium) choices — light gray, still selectable. */
const LOCKED_OPTION_STYLE: React.CSSProperties = { color: "#9ca3af" };

/** Starter plan caps (Business is above these). */
const STARTER_MAX_EXPIRY_SECONDS = 15 * 24 * 60 * 60;
const FREE_MAX_EXPIRY_SECONDS = 3 * 24 * 60 * 60;
const STARTER_MAX_FILE_ACCESS_WINDOW_SECONDS = 30 * 60;
const FREE_MAX_FILE_ACCESS_WINDOW_SECONDS = 15 * 60;

type PlanUnlockTier = "free" | "starter" | "business";

function planUnlockLabel(plan: PlanUnlockTier, t: Record<string, string>): string {
  if (plan === "business") return t.settingsPlanBusiness ?? "Business";
  return t.premium ?? "Starter";
}

/** e.g. "2 views — Starter"; free options stay unlabeled. */
function withPlanUnlock(
  label: string,
  plan: PlanUnlockTier,
  t: Record<string, string>,
): string {
  if (plan === "free") return label;
  return `${label} — ${planUnlockLabel(plan, t)}`;
}

function expiryPlanUnlock(seconds: number): PlanUnlockTier {
  if (seconds <= FREE_MAX_EXPIRY_SECONDS) return "free";
  if (seconds <= STARTER_MAX_EXPIRY_SECONDS) return "starter";
  return "business";
}

function readLimitPlanUnlock(limit: number): PlanUnlockTier {
  if (limit <= 1) return "free";
  if (limit <= 3) return "starter";
  return "business";
}

function fileAccessPlanUnlock(seconds: number): PlanUnlockTier {
  if (seconds <= FREE_MAX_FILE_ACCESS_WINDOW_SECONDS) return "free";
  if (seconds <= STARTER_MAX_FILE_ACCESS_WINDOW_SECONDS) return "starter";
  return "business";
}

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
      <TooltipContent
        side="bottom"
        align="start"
        sideOffset={6}
        collisionPadding={16}
        className="z-[100] max-w-[260px] text-xs leading-snug"
      >
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
  singleLine = false,
}: {
  htmlFor?: string;
  icon: React.ReactNode;
  iconToneClassName: string;
  label: string;
  info?: string;
  singleLine?: boolean;
}) {
  const content = (
    <>
      <SettingsInfoTooltip text={info}>
        <span
          className={`mr-1.5 shrink-0 rounded p-1 ${iconToneClassName}${info ? " cursor-help" : ""}`}
          aria-label={info}
        >
          {icon}
        </span>
      </SettingsInfoTooltip>
      <span className={`min-w-0 leading-snug${singleLine ? " whitespace-nowrap" : ""}`}>
        {label}
      </span>
    </>
  );
  const className = singleLine
    ? "flex items-center text-sm font-medium text-gray-700 dark:text-gray-300"
    : "flex items-start text-sm font-medium text-gray-700 dark:text-gray-300 sm:pt-1.5";
  if (htmlFor) {
    return (
      <label htmlFor={htmlFor} className={className}>
        {content}
      </label>
    );
  }
  return <div className={className}>{content}</div>;
}

/** Label + control row: compact label column, input takes remaining width (helps long locales). */
const SETTINGS_FIELD_ROW =
  "grid grid-cols-1 items-start gap-x-2 gap-y-1 px-1 py-2 transition-colors sm:grid-cols-[minmax(0,11.5rem)_minmax(0,1fr)]";

/** Label + switch row: match dropdown field vertical rhythm (toggles are shorter without a select). */
const SETTINGS_TOGGLE_ROW = "flex items-center gap-2 px-1 py-2.5 transition-colors";

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
  plan: "starter" | "business";
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

/** Locked switch for plan-gated rows; the section badge and CTA explain the upgrade. */
function LockedPremiumToggle({
  label,
  plan,
  onClick,
}: {
  label: string;
  plan: "Starter" | "Business";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      aria-label={`${label} — locked, available with ${plan}`}
      title={`Available with ${plan}`}
    >
      <Switch checked={false} disabled aria-hidden className="pointer-events-none opacity-50" />
    </button>
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
  notifyOnAttachmentDownload: boolean;
  setNotifyOnAttachmentDownload: (v: boolean) => void;
  /** Show the attachment-download alert when the note includes a file. */
  hasAttachment: boolean;
  /** True when the attachment is a voice recording. */
  hasVoiceMessage?: boolean;
  canNotifyOnOpen: boolean;
  emailLinkToRecipient: boolean;
  setEmailLinkToRecipient: (v: boolean) => void;
  linkDeliveryEmail: string;
  setLinkDeliveryEmail: (v: string) => void;
  /** Starter+ with verified account email — can send the note link on create. */
  canEmailLinkToRecipient: boolean;
  delayedReveal: boolean;
  setDelayedReveal: (v: boolean) => void;
  /** Local `datetime-local` value (no timezone); empty when delayed reveal is off. */
  opensAtLocal: string;
  setOpensAtLocal: (v: string) => void;
  /** Starter+: recipient confirms receipt after successful decrypt. */
  requireReceiptAck: boolean;
  setRequireReceiptAck: (v: boolean) => void;
  receiptAckStatement: string;
  setReceiptAckStatement: (v: string) => void;
  unopenedReminderHours: number | null;
  setUnopenedReminderHours: (v: number | null) => void;
  noteLabel: string;
  setNoteLabel: (v: string) => void;
  isPremiumUser: boolean;
  accountEmail: string | null;
  alertNotifyAccountEmail: boolean;
  setAlertNotifyAccountEmail: (v: boolean) => void;
  alertCustomEmail: string;
  setAlertCustomEmail: (v: string) => void;
  maxExpirySeconds: number;
  allowedReadCounts: readonly number[];
  maxFileAccessWindowSeconds: number;
  isSignedIn: boolean;
  premiumStatusLoading: boolean;
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
  canBrandRevealPage?: boolean;
  configuredAccountType?: AccountType;
  /** False when the plan allows branding but the account has not set any up. */
  hasRevealBranding?: boolean;
  applyBranding?: boolean;
  setApplyBranding?: (v: boolean) => void;
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
  notifyOnAttachmentDownload,
  setNotifyOnAttachmentDownload,
  hasAttachment,
  hasVoiceMessage = false,
  canNotifyOnOpen,
  emailLinkToRecipient,
  setEmailLinkToRecipient,
  linkDeliveryEmail,
  setLinkDeliveryEmail,
  canEmailLinkToRecipient,
  delayedReveal,
  setDelayedReveal,
  opensAtLocal,
  setOpensAtLocal,
  requireReceiptAck,
  setRequireReceiptAck,
  receiptAckStatement,
  setReceiptAckStatement,
  unopenedReminderHours,
  setUnopenedReminderHours,
  noteLabel,
  setNoteLabel,
  isPremiumUser,
  accountEmail,
  alertNotifyAccountEmail,
  setAlertNotifyAccountEmail,
  alertCustomEmail,
  setAlertCustomEmail,
  maxExpirySeconds,
  allowedReadCounts,
  maxFileAccessWindowSeconds,
  premiumStatusLoading,
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
  canBrandRevealPage = false,
  configuredAccountType = "free",
  hasRevealBranding = false,
  applyBranding = false,
  setApplyBranding,
  onSaveDefaults,
}) => {
  const { t, language } = useLanguage();
  const isFileTransfer = variant === "file-transfer";
  const premiumUpgradeHref = localizedPath("/premium", language);
  const preferencesHref = localizedPath("/account/preferences", language);
  const brandingHref = `${preferencesHref}#reveal-branding`;
  const isConfiguredBusiness = configuredAccountType === "business_premium";
  const brandingAllowed = canBrandRevealPage || isConfiguredBusiness;
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
      plan: "business",
    }),
    [t],
  );
  const recipientCodeTitle =
    t.settingsDeliveryVerifyEmail ?? "Require one-time code via email";
  const recipientCodeInfo = isFileTransfer
    ? "Enter the recipient's email. When they open the link, we email them a one-time code before the file can be revealed."
    : t.settingsDeliveryVerifyEmailInfo ??
      "Enter the recipient's email. When they open the link, we email them a one-time code before the note can be revealed.";
  const recipientCodeUpgradeCopy = isFileTransfer
    ? "Add a second step before reveal. The recipient receives a one-time email code, so the link alone is not enough to open the file."
    : "Add a second step before reveal. The recipient receives a one-time email code, so the link alone is not enough to open the note.";
  const emailLinkTitle = t.settingsDeliverRecipientEmail ?? "Email link to recipient";
  const emailLinkInfo =
    t.settingsDeliverRecipientEmailInfo ??
    "PrivateNote emails the secret link to this address. Email is not end-to-end encrypted — prefer sharing the link yourself for highest sensitivity.";
  const emailLinkUpgradeCopy =
    "Let PrivateNote deliver the link for you and keep the handoff connected to your Activity history.";
  const delayedRevealTitle = t.settingsDelayedReveal ?? "Delayed reveal";
  const delayedRevealInfo =
    t.settingsDelayedRevealInfo ??
    "Do not allow opening before a scheduled time. Useful for credential handovers, HR packs, and embargoed documents.";
  const delayedRevealUpgradeCopy =
    "Share ahead of time while keeping the note sealed until the moment you choose.";
  const receiptAckTitle = t.settingsRequireReceiptAck ?? "Require receipt confirmation";
  const receiptAckInfo =
    t.settingsRequireReceiptAckInfo ??
    "After the recipient successfully decrypts the note, they can confirm receipt. Confirmation is stored even if the note burns on open.";
  const receiptAckUpgradeCopy =
    "Close the loop with a recipient acknowledgment after successful decryption—without storing the message itself.";
  const selectedReceiptAckPreset =
    BUSINESS_RECEIPT_ACK_PRESETS.find((preset) => preset.label === receiptAckStatement) ?? null;
  const isCustomReceiptAckStatement = selectedReceiptAckPreset === null;
  const receiptAckOptionBase =
    "w-full rounded-lg border px-3 py-2.5 text-left text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40";
  const receiptAckOptionIdle =
    "border-gray-200 bg-white text-gray-700 hover:border-teal-300 hover:bg-teal-50/60 dark:border-gray-700 dark:bg-gray-950 dark:text-blue-300 dark:hover:border-teal-700 dark:hover:bg-teal-950/40";
  const receiptAckOptionActive =
    "border-teal-500 bg-white text-gray-900 shadow-sm ring-1 ring-teal-500/30 dark:border-teal-400 dark:bg-gray-950 dark:text-white dark:ring-teal-400/30";

  const defaultOpensAtLocal = (): string => {
    const d = new Date(Date.now() + 24 * 60 * 60 * 1000);
    d.setSeconds(0, 0);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const settingsBody = (
    <TooltipProvider delayDuration={200}>
    <div className="mx-auto w-full min-w-0 max-w-2xl space-y-4">
            <section
              className="space-y-2 rounded-lg border border-gray-200 bg-gray-50/70 px-3 pb-3 pt-2 dark:border-gray-800 dark:bg-gray-900/35"
              aria-labelledby="note-access-controls-heading"
            >
              <SectionHeading id="note-access-controls-heading" title={t.settingsAccessControls} />

              <div className="flex flex-col space-y-2">
                <div className={SETTINGS_FIELD_ROW}>
                  <div>
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
                  <div className="min-w-0 space-y-1">
              <select
                id="expiry-value"
                value={expiryValue}
                onChange={(e) => {
                  const v = e.target.value;
                  if (!isNoteExpiryPresetId(v)) return;
                  if (noteExpiryPresetIdToSeconds(v) > maxExpirySeconds) {
                    const requiredPlan = expiryPlanUnlock(noteExpiryPresetIdToSeconds(v));
                    setSelectedPremiumFeature({
                      title: t.settingsNoteLifetime ?? t.expiration,
                      description:
                        t.settingsNoteLifetimeInfo ??
                        "Longer note lifetimes are available on Starter and Business.",
                      plan: requiredPlan === "business" ? "business" : "starter",
                    });
                    return;
                  }
                  setExpiryValue(v);
                }}
                className={SETTINGS_SELECT_CLASS}
                style={SELECT_CHEVRON_STYLE}
              >
                {NOTE_EXPIRY_PRESETS.map((p) => {
                  const plan = expiryPlanUnlock(p.seconds);
                  const locked = p.seconds > maxExpirySeconds;
                  return (
                    <option
                      key={p.id}
                      value={p.id}
                      style={locked ? LOCKED_OPTION_STYLE : undefined}
                    >
                      {withPlanUnlock(translatedExpiryLabel(p.id, t), plan, t)}
                    </option>
                  );
                })}
              </select>
              <SettingsFieldHelper>
                {t.settingsNoteLifetimeHint ?? "When the link stops working if never opened."}
              </SettingsFieldHelper>
                  </div>
                </div>

                <div className={SETTINGS_FIELD_ROW}>
                  <div>
                    <SettingsFieldLabel
                      htmlFor="note-read-limit"
                      icon={<Eye className="h-4 w-4 text-teal-600 dark:text-teal-400" />}
                      iconToneClassName="bg-teal-50 dark:bg-teal-900/30"
                      label={t.settingsOpenLimit ?? t.viewLimit}
                      info={t.settingsOpenLimitInfo}
                    />
            </div>
            <div className="min-w-0 space-y-1">
              <select
                id="note-read-limit"
                value={readCount}
                onChange={(e) => {
                  const next = Number(e.target.value);
                  if (!NOTE_READ_LIMIT_OPTIONS.includes(next as NoteReadLimit)) return;
                  if (!allowedReadCounts.includes(next)) {
                    const requiredPlan = readLimitPlanUnlock(next);
                    setSelectedPremiumFeature({
                      title: t.settingsOpenLimit ?? t.viewLimit,
                      description:
                        t.settingsOpenLimitInfo ??
                        t.viewLimitPremiumHint ??
                        "Starter and Business let you allow multiple opens before the note is destroyed.",
                      plan: requiredPlan === "business" ? "business" : "starter",
                    });
                    return;
                  }
                  setReadCount(next as NoteReadLimit);
                }}
                className={SETTINGS_SELECT_CLASS}
                style={SELECT_CHEVRON_STYLE}
              >
                {NOTE_READ_LIMIT_OPTIONS.map((limit) => {
                  const plan = readLimitPlanUnlock(limit);
                  const locked = !allowedReadCounts.includes(limit);
                  return (
                    <option
                      key={limit}
                      value={limit}
                      style={locked ? LOCKED_OPTION_STYLE : undefined}
                    >
                      {withPlanUnlock(translatedReadLimitLabel(limit, t), plan, t)}
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

          <div className={SETTINGS_FIELD_ROW}>
            <div>
              <SettingsFieldLabel
                htmlFor="note-file-access-window"
                icon={<Timer className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />}
                iconToneClassName="bg-indigo-50 dark:bg-indigo-900/30"
                label={t.settingsFileDownloads ?? "File downloads"}
                info={t.settingsFileDownloadsInfo}
              />
            </div>
            <div className="min-w-0 space-y-1">
              <select
                id="note-file-access-window"
                value={fileAccessWindowSeconds}
                onChange={(e) => {
                  const next = Number(e.target.value);
                  if (!NOTE_FILE_ACCESS_WINDOW_OPTIONS.includes(next as NoteFileAccessWindowSeconds)) {
                    return;
                  }
                  if (next > maxFileAccessWindowSeconds) {
                    const requiredPlan = fileAccessPlanUnlock(next);
                    setSelectedPremiumFeature({
                      title: t.settingsFileDownloads ?? "File downloads",
                      description:
                        t.settingsFileDownloadsInfo ??
                        "Longer download windows after open are available on Starter and Business.",
                      plan: requiredPlan === "business" ? "business" : "starter",
                    });
                    return;
                  }
                  setFileAccessWindowSeconds(next as NoteFileAccessWindowSeconds);
                }}
                className={SETTINGS_SELECT_CLASS}
                style={SELECT_CHEVRON_STYLE}
              >
                {NOTE_FILE_ACCESS_WINDOW_OPTIONS.map((seconds) => {
                  const plan = fileAccessPlanUnlock(seconds);
                  const locked = seconds > maxFileAccessWindowSeconds;
                  return (
                    <option
                      key={seconds}
                      value={seconds}
                      style={locked ? LOCKED_OPTION_STYLE : undefined}
                    >
                      {withPlanUnlock(translatedFileAccessWindowLabel(seconds, t), plan, t)}
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

<div className={SETTINGS_FIELD_ROW}>
                <div>
            <SettingsFieldLabel
              htmlFor="note-password"
              icon={<Lock className="h-4 w-4 text-green-500 dark:text-green-400" />}
              iconToneClassName="bg-green-50 dark:bg-green-900/30"
              label={t.password}
              info={t.settingsPasswordInfo}
            />
          </div>
          <div className="min-w-0">
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
              <div className="mt-1">
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
              {(passwordSource === "simple" || passwordSource === "strong") && (
                <PasswordsLuPartnerFooter t={t} align="left" className="mt-1 !text-xs" />
              )}
            </div>
          </div>
        </div>

        </div>
            </section>

            <section
              className="space-y-2 rounded-lg border border-gray-200 bg-gray-50/70 px-3 pb-3 pt-2 dark:border-gray-800 dark:bg-gray-900/35"
              aria-labelledby="note-notification-center-heading"
            >
              <SectionHeading
                id="note-notification-center-heading"
                title={t.settingsNotificationCenter ?? t.notificationCenterTitle ?? "Notification Center"}
                showPremiumBadge={false}
              />
              <div className="flex flex-col space-y-2">
                {readCount === 1 ? (
                  <div className={SETTINGS_TOGGLE_ROW}>
                    <div className="min-w-0 flex-1">
                      <SettingsFieldLabel
                        htmlFor="notify-on-opened-destroyed"
                        icon={<Bell className="h-4 w-4 text-amber-600 dark:text-amber-400" />}
                        iconToneClassName="bg-amber-50 dark:bg-amber-900/30"
                        label={
                          t.settingsEmailAlertOnOpenedDestroyed ??
                          "Email alert when this note is opened and destroyed"
                        }
                        info={
                          t.settingsEmailAlertOnOpenedDestroyedInfo ??
                          "One email when the one-time link is accessed and the note is destroyed. Message content is never included."
                        }
                        singleLine
                      />
                    </div>
                    <div className="flex shrink-0 items-center">
                      <Switch
                        id="notify-on-opened-destroyed"
                        checked={notifyOnOpen || notifyOnDestroyed}
                        disabled={!canNotifyOnOpen}
                        onCheckedChange={(enabled) => {
                          setNotifyOnOpen(enabled);
                          setNotifyOnDestroyed(enabled);
                        }}
                        className={!canNotifyOnOpen ? "opacity-50" : undefined}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={SETTINGS_TOGGLE_ROW}>
                      <div className="min-w-0 flex-1">
                        <SettingsFieldLabel
                          htmlFor="notify-on-open"
                          icon={<Bell className="h-4 w-4 text-amber-600 dark:text-amber-400" />}
                          iconToneClassName="bg-amber-50 dark:bg-amber-900/30"
                          label={
                            t.settingsEmailAlertOnOpen ?? "Email alert when this note is opened"
                          }
                          info={
                            t.settingsEmailAlertOnOpenInfo ??
                            "One email when the link is accessed. Message content is never included."
                          }
                          singleLine
                        />
                      </div>
                      <div className="flex shrink-0 items-center">
                        <Switch
                          id="notify-on-open"
                          checked={notifyOnOpen}
                          disabled={!canNotifyOnOpen}
                          onCheckedChange={setNotifyOnOpen}
                          className={!canNotifyOnOpen ? "opacity-50" : undefined}
                        />
                      </div>
                    </div>
                    <div className={SETTINGS_TOGGLE_ROW}>
                      <div className="min-w-0 flex-1">
                        <SettingsFieldLabel
                          htmlFor="notify-on-destroyed"
                          icon={<BellOff className="h-4 w-4 text-rose-600 dark:text-rose-400" />}
                          iconToneClassName="bg-rose-50 dark:bg-rose-900/30"
                          label={
                            t.settingsEmailAlertOnDestroyed ??
                            "Email alert when this note is destroyed"
                          }
                          info={
                            t.settingsEmailAlertOnDestroyedInfo ??
                            "One email when the note can no longer be opened."
                          }
                          singleLine
                        />
                      </div>
                      <div className="flex shrink-0 items-center">
                        <Switch
                          id="notify-on-destroyed"
                          checked={notifyOnDestroyed}
                          disabled={!canNotifyOnOpen}
                          onCheckedChange={setNotifyOnDestroyed}
                          className={!canNotifyOnOpen ? "opacity-50" : undefined}
                        />
                      </div>
                    </div>
                  </>
                )}
                {hasAttachment ? (
                  <div className={SETTINGS_TOGGLE_ROW}>
                    <div className="min-w-0 flex-1">
                      <SettingsFieldLabel
                        htmlFor="notify-on-attachment-download"
                        icon={
                          hasVoiceMessage ? (
                            <Mic className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                          ) : (
                            <Download className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                          )
                        }
                        iconToneClassName="bg-indigo-50 dark:bg-indigo-900/30"
                        label={
                          hasVoiceMessage
                            ? (t.settingsEmailAlertOnRecordingDownload ??
                              "Email alert when a recording is downloaded")
                            : (t.settingsEmailAlertOnAttachmentDownload ??
                              "Email alert when an attachment is downloaded")
                        }
                        info={
                          hasVoiceMessage
                            ? (t.settingsEmailAlertOnRecordingDownloadInfo ??
                              "One email when the encrypted voice recording is requested for download. Audio contents are never included.")
                            : (t.settingsEmailAlertOnAttachmentDownloadInfo ??
                              "One email when the encrypted attachment is requested for download. File contents are never included.")
                        }
                        singleLine
                      />
                    </div>
                    <div className="flex shrink-0 items-center">
                      <Switch
                        id="notify-on-attachment-download"
                        checked={notifyOnAttachmentDownload}
                        disabled={!canNotifyOnOpen}
                        onCheckedChange={setNotifyOnAttachmentDownload}
                        className={!canNotifyOnOpen ? "opacity-50" : undefined}
                      />
                    </div>
                  </div>
                ) : null}
              </div>
              {isPremiumUser &&
              (notifyOnOpen || notifyOnDestroyed || notifyOnAttachmentDownload) ? (
                <div className="space-y-2 rounded-md border border-gray-200/80 bg-white/50 px-3 py-2.5 dark:border-gray-700/80 dark:bg-gray-950/20">
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {t.settingsEmailAlertDestinations ?? "Where to send alerts"}
                  </p>
                  <label className="flex cursor-pointer items-center gap-2.5 text-sm text-gray-800 dark:text-gray-200">
                    <input
                      type="checkbox"
                      className="h-4 w-4 shrink-0 rounded border-gray-300 text-primary focus:ring-primary"
                      checked={alertNotifyAccountEmail}
                      onChange={(event) => setAlertNotifyAccountEmail(event.target.checked)}
                    />
                    <span className="flex min-w-0 flex-1 items-center justify-between gap-2 leading-snug">
                      <span className="shrink-0">
                        {t.settingsEmailAlertAccountEmail ?? "My account email"}
                      </span>
                      {accountEmail ? (
                        <span className="truncate text-xs text-gray-500 dark:text-gray-400">
                          {accountEmail}
                        </span>
                      ) : null}
                    </span>
                  </label>
                  <div className="space-y-1 pt-1">
                    <label
                      htmlFor="alert-custom-email"
                      className="block text-xs font-medium text-gray-700 dark:text-gray-300"
                    >
                      {t.settingsEmailAlertCustomEmail ?? "Also send to another email"}
                    </label>
                    <input
                      id="alert-custom-email"
                      type="email"
                      autoComplete="email"
                      value={alertCustomEmail}
                      onChange={(event) => setAlertCustomEmail(event.target.value)}
                      placeholder={
                        t.settingsEmailAlertCustomEmailPlaceholder ?? "alerts@example.com"
                      }
                      className="w-full rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-gray-800 shadow-sm focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200"
                    />
                    <p className="text-xs leading-snug text-gray-500 dark:text-gray-400">
                      {t.settingsEmailAlertCustomEmailHint ??
                        "Optional. Your account email stays selected unless you uncheck it. Uncheck it only to send alerts here alone."}
                    </p>
                  </div>
                </div>
              ) : null}
              {isPremiumUser ? (
                <div className={SETTINGS_FIELD_ROW}>
                  <div>
                    <SettingsFieldLabel
                      htmlFor="note-label"
                      icon={<Tag className="h-4 w-4 text-amber-600 dark:text-amber-400" />}
                      iconToneClassName="bg-amber-50 dark:bg-amber-900/30"
                      label={t.settingsNoteLabel ?? "Note label"}
                      info={
                        t.settingsNoteLabelInfo ??
                        "A private name for this note on this device only. Never uploaded or shared."
                      }
                    />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <input
                      id="note-label"
                      type="text"
                      maxLength={NOTE_LABEL_MAX_LENGTH}
                      value={noteLabel}
                      onChange={(event) => setNoteLabel(event.target.value)}
                      placeholder={t.settingsNoteLabelPlaceholder ?? "e.g. Client onboarding pack"}
                      className="w-full px-2.5 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 shadow-sm"
                    />
                    <SettingsFieldHelper>
                      {t.settingsNoteLabelHint ??
                        "Device-only labeling. Never sent with the note."}
                    </SettingsFieldHelper>
                  </div>
                </div>
              ) : null}
              {!canNotifyOnOpen && !premiumStatusLoading ? (
                <p className="px-1 text-xs leading-snug text-gray-500 dark:text-gray-400">
                  {t.settingsEmailAlertsSignInHint ??
                    "Sign in with a verified email to get open and destroy alerts."}
                </p>
              ) : null}
            </section>

            <section
              className="space-y-2 rounded-lg border border-gray-200 bg-gray-50/70 px-3 pb-3 pt-2 dark:border-gray-800 dark:bg-gray-900/35"
              aria-labelledby="note-delivery-verification-heading"
            >
              <SectionHeading
                id="note-delivery-verification-heading"
                title={t.settingsDeliveryVerification ?? "Delivery & verification"}
                showPremiumBadge={!isPremiumUser}
                premiumLabel={t.premium ?? "Starter"}
              />
              <div className={SETTINGS_TOGGLE_ROW}>
                <div className="min-w-0 flex-1">
                  <SettingsFieldLabel
                    htmlFor="require-recipient-verification"
                    icon={<MailCheck className="h-4 w-4 text-violet-600 dark:text-violet-400" />}
                    iconToneClassName="bg-violet-50 dark:bg-violet-900/30"
                    label={recipientCodeTitle}
                    info={recipientCodeInfo}
                    singleLine
                  />
                </div>
                <div className="flex shrink-0 items-center">
                  {!isPremiumUser ? (
                    <LockedPremiumToggle
                      label={recipientCodeTitle}
                      plan="Starter"
                      onClick={() =>
                        setSelectedPremiumFeature({
                          title: recipientCodeTitle,
                          description: recipientCodeUpgradeCopy,
                          plan: "starter",
                        })
                      }
                    />
                  ) : (
                    <Switch
                      id="require-recipient-verification"
                      checked={requireRecipientVerification}
                      onCheckedChange={(checked) => {
                        setRequireRecipientVerification(checked);
                        if (!checked) setRecipientEmail("");
                      }}
                    />
                  )}
                </div>
              </div>
              {isPremiumUser && requireRecipientVerification ? (
                <div className="px-1 pb-1">
                  <label
                    htmlFor="recipient-email"
                    className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
                  >
                    {t.settingsRecipientVerificationEmail ?? "Recipient email"}
                  </label>
                  <input
                    id="recipient-email"
                    type="email"
                    autoComplete="email"
                    value={recipientEmail}
                    onChange={(event) => setRecipientEmail(event.target.value)}
                    placeholder={
                      t.settingsRecipientVerificationEmailPlaceholder ?? "recipient@example.com"
                    }
                    className="w-full rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-gray-900 shadow-sm focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                  />
                  <p className="mt-1 text-xs leading-snug text-gray-500 dark:text-gray-400">
                    {isFileTransfer
                      ? "A one-time code will be emailed to the recipient when they open the link."
                      : (t.settingsRecipientVerificationEmailHint ??
                        "When they open the link, we email a one-time code to this address.")}
                  </p>
                </div>
              ) : null}
              <div className={SETTINGS_TOGGLE_ROW}>
                <div className="min-w-0 flex-1">
                  <SettingsFieldLabel
                    htmlFor="email-link-to-recipient"
                    icon={<Mail className="h-4 w-4 text-violet-600 dark:text-violet-400" />}
                    iconToneClassName="bg-violet-50 dark:bg-violet-900/30"
                    label={emailLinkTitle}
                    info={emailLinkInfo}
                    singleLine
                  />
                </div>
                <div className="flex shrink-0 items-center">
                  {!isPremiumUser ? (
                    <LockedPremiumToggle
                      label={emailLinkTitle}
                      plan="Starter"
                      onClick={() =>
                        setSelectedPremiumFeature({
                          title: emailLinkTitle,
                          description: emailLinkUpgradeCopy,
                          plan: "starter",
                        })
                      }
                    />
                  ) : (
                    <Switch
                      id="email-link-to-recipient"
                      checked={emailLinkToRecipient}
                      disabled={!canEmailLinkToRecipient}
                      onCheckedChange={(checked) => {
                        setEmailLinkToRecipient(checked);
                        if (!checked) setLinkDeliveryEmail("");
                        else if (!linkDeliveryEmail.trim() && recipientEmail.trim()) {
                          setLinkDeliveryEmail(recipientEmail);
                        }
                      }}
                      className={!canEmailLinkToRecipient ? "opacity-50" : undefined}
                    />
                  )}
                </div>
              </div>
              {isPremiumUser && emailLinkToRecipient ? (
                <div className="px-1 pb-1">
                  <label
                    htmlFor="link-delivery-email"
                    className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
                  >
                    {t.settingsRecipientVerificationEmail ?? "Recipient email"}
                  </label>
                  <input
                    id="link-delivery-email"
                    type="email"
                    autoComplete="email"
                    value={linkDeliveryEmail}
                    onChange={(event) => setLinkDeliveryEmail(event.target.value)}
                    placeholder={
                      t.settingsDeliverRecipientEmailPlaceholder ?? "recipient@example.com"
                    }
                    className="w-full rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-gray-900 shadow-sm focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                  />
                  <p className="mt-1 text-xs leading-snug text-gray-500 dark:text-gray-400">
                    {t.settingsEmailLinkToRecipientHint ??
                      "We'll email the secret link when the note is created. Email is not end-to-end encrypted."}
                  </p>
                </div>
              ) : null}
              {isPremiumUser && !canEmailLinkToRecipient ? (
                <p className="px-1 pb-1 text-xs leading-snug text-gray-500 dark:text-gray-400">
                  {t.recipientLinkDeliveryVerifyEmailHint ??
                    "Verify your account email before we can send the link for you."}
                </p>
              ) : null}
              <div className={SETTINGS_TOGGLE_ROW}>
                <div className="min-w-0 flex-1">
                  <SettingsFieldLabel
                    htmlFor="delayed-reveal"
                    icon={<Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
                    iconToneClassName="bg-emerald-50 dark:bg-emerald-900/30"
                    label={delayedRevealTitle}
                    info={delayedRevealInfo}
                    singleLine
                  />
                </div>
                <div className="flex shrink-0 items-center">
                  {!isPremiumUser ? (
                    <LockedPremiumToggle
                      label={delayedRevealTitle}
                      plan="Starter"
                      onClick={() =>
                        setSelectedPremiumFeature({
                          title: delayedRevealTitle,
                          description: delayedRevealUpgradeCopy,
                          plan: "starter",
                        })
                      }
                    />
                  ) : (
                    <Switch
                      id="delayed-reveal"
                      checked={delayedReveal}
                      onCheckedChange={(checked) => {
                        setDelayedReveal(checked);
                        if (!checked) setOpensAtLocal("");
                        else if (!opensAtLocal.trim()) setOpensAtLocal(defaultOpensAtLocal());
                      }}
                    />
                  )}
                </div>
              </div>
              {isPremiumUser && delayedReveal ? (
                <div className="px-1 pb-2">
                  <label
                    htmlFor="opens-at-local"
                    className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
                  >
                    {t.settingsDelayedRevealBefore ?? "Do not allow opening before"}
                  </label>
                  <input
                    id="opens-at-local"
                    type="datetime-local"
                    value={opensAtLocal}
                    onChange={(event) => setOpensAtLocal(event.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-gray-900 shadow-sm focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                  />
                  <p className="mt-1 text-xs leading-snug text-gray-500 dark:text-gray-400">
                    {t.settingsDelayedRevealHint ??
                      "Recipients can open the link only after this time. Must be before the note lifetime ends."}
                    {opensAtLocal
                      ? ` (${t.settingsDelayedRevealUtcLabel ?? "UTC"}: ${new Date(opensAtLocal).toISOString().replace(/\.\d{3}Z$/, " UTC")})`
                      : ""}
                  </p>
                </div>
              ) : null}
              <div className={SETTINGS_TOGGLE_ROW}>
                <div className="min-w-0 flex-1">
                  <SettingsFieldLabel
                    htmlFor="require-receipt-ack"
                    icon={<BadgeCheck className="h-4 w-4 text-teal-600 dark:text-teal-400" />}
                    iconToneClassName="bg-teal-50 dark:bg-teal-900/30"
                    label={receiptAckTitle}
                    info={receiptAckInfo}
                    singleLine
                  />
                </div>
                <div className="flex shrink-0 items-center">
                  {!isPremiumUser ? (
                    <LockedPremiumToggle
                      label={receiptAckTitle}
                      plan="Starter"
                      onClick={() =>
                        setSelectedPremiumFeature({
                          title: receiptAckTitle,
                          description: receiptAckUpgradeCopy,
                          plan: "starter",
                        })
                      }
                    />
                  ) : (
                    <Switch
                      id="require-receipt-ack"
                      checked={requireReceiptAck}
                      onCheckedChange={setRequireReceiptAck}
                    />
                  )}
                </div>
              </div>
              {isConfiguredBusiness && requireReceiptAck ? (
                <div className="space-y-3 rounded-md border border-teal-200/70 bg-teal-50/50 p-3 dark:border-teal-900/50 dark:bg-teal-950/20">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {t.settingsReceiptStatementPreset ?? "What they confirm"}
                    </p>
                    <p className="text-xs leading-snug text-gray-500 dark:text-gray-400">
                      {t.settingsReceiptStatementHint ??
                        "Shown on the reveal page after decryption. It’s a delivery receipt for you—not legal proof of identity."}
                    </p>
                  </div>
                  <div
                    className="space-y-2"
                    role="radiogroup"
                    aria-label={t.settingsReceiptStatementPreset ?? "What they confirm"}
                  >
                    {BUSINESS_RECEIPT_ACK_PRESETS.map((preset) => {
                      const selected = selectedReceiptAckPreset?.id === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          onClick={() => setReceiptAckStatement(preset.label)}
                          className={`${receiptAckOptionBase} ${selected ? receiptAckOptionActive : receiptAckOptionIdle}`}
                        >
                          <span className="flex items-start gap-2.5">
                            <span
                              className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                                selected
                                  ? "border-teal-600 bg-teal-600 text-white dark:border-teal-400 dark:bg-teal-400 dark:text-gray-950"
                                  : "border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-900"
                              }`}
                              aria-hidden
                            >
                              {selected ? (
                                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                              ) : null}
                            </span>
                            <span className="min-w-0">
                              <span className="block font-medium leading-snug text-gray-900 dark:text-inherit">
                                {preset.title}
                              </span>
                              <span className="mt-0.5 block text-xs leading-snug text-gray-500 dark:text-gray-400">
                                “{preset.label}”
                              </span>
                            </span>
                          </span>
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      role="radio"
                      aria-checked={isCustomReceiptAckStatement}
                      onClick={() => {
                        if (!isCustomReceiptAckStatement) setReceiptAckStatement("");
                      }}
                      className={`${receiptAckOptionBase} ${isCustomReceiptAckStatement ? receiptAckOptionActive : receiptAckOptionIdle}`}
                    >
                      <span className="flex items-start gap-2.5">
                        <span
                          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                            isCustomReceiptAckStatement
                              ? "border-teal-600 bg-teal-600 text-white dark:border-teal-400 dark:bg-teal-400 dark:text-gray-950"
                              : "border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-900"
                          }`}
                          aria-hidden
                        >
                          {isCustomReceiptAckStatement ? (
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          ) : null}
                        </span>
                        <span className="min-w-0">
                          <span className="block font-medium leading-snug text-gray-900 dark:text-inherit">
                            {t.settingsReceiptStatementCustom ?? "Write your own"}
                          </span>
                          <span className="mt-0.5 block text-xs leading-snug text-gray-500 dark:text-gray-400">
                            {t.settingsReceiptStatementCustomHint ??
                              "Use wording that fits this handoff."}
                          </span>
                        </span>
                      </span>
                    </button>
                  </div>
                  {isCustomReceiptAckStatement ? (
                    <div className="space-y-1.5">
                      <label
                        htmlFor="receipt-confirmation-custom"
                        className="text-xs font-medium text-gray-700 dark:text-gray-300"
                      >
                        {t.settingsReceiptStatementCustomLabel ?? "Confirmation text"}
                      </label>
                      <textarea
                        id="receipt-confirmation-custom"
                        value={receiptAckStatement}
                        onChange={(event) => setReceiptAckStatement(event.target.value)}
                        maxLength={RECEIPT_ACK_STATEMENT_MAX_LENGTH}
                        rows={3}
                        autoFocus
                        placeholder={
                          t.settingsReceiptStatementCustomPlaceholder ??
                          "I confirm that I received this secure message."
                        }
                        className="w-full resize-none rounded-md border border-gray-300 bg-white px-2.5 py-2 text-sm text-gray-900 shadow-sm focus:border-teal-500/60 focus:outline-none focus:ring-2 focus:ring-teal-500/30 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {(
                          t.settingsReceiptStatementCharsLeft ?? "{n} characters left"
                        ).replace(
                          "{n}",
                          String(
                            Math.max(
                              0,
                              RECEIPT_ACK_STATEMENT_MAX_LENGTH - receiptAckStatement.length,
                            ),
                          ),
                        )}
                      </p>
                    </div>
                  ) : null}
                </div>
              ) : null}
              {isConfiguredBusiness ? (
                <div className={SETTINGS_FIELD_ROW}>
                  <div>
                    <SettingsFieldLabel
                      htmlFor="unopened-reminder"
                      icon={<Bell className="h-4 w-4 text-amber-600 dark:text-amber-400" />}
                      iconToneClassName="bg-amber-50 dark:bg-amber-900/30"
                      label={t.settingsUnopenedReminder ?? "Unopened reminder"}
                      info={
                        t.settingsUnopenedReminderInfo ??
                        "Email me if this note is still unopened."
                      }
                    />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <select
                      id="unopened-reminder"
                      value={unopenedReminderHours ?? ""}
                      onChange={(event) =>
                        setUnopenedReminderHours(
                          event.target.value ? Number(event.target.value) : null,
                        )
                      }
                      className={`${SETTINGS_SELECT_CLASS} min-w-0`}
                      style={SELECT_CHEVRON_STYLE}
                    >
                      <option value="">{t.settingsUnopenedReminderOff ?? "Off"}</option>
                      <option value="24">
                        {t.settingsUnopenedReminder24 ?? "After 24 hours"}
                      </option>
                      <option value="48">
                        {t.settingsUnopenedReminder48 ?? "After 48 hours"}
                      </option>
                      <option value="72">
                        {t.settingsUnopenedReminder72 ?? "After 72 hours"}
                      </option>
                    </select>
                    <SettingsFieldHelper>
                      {t.settingsUnopenedReminderHint ??
                        "Only sent if the note is still unopened after the delay."}
                    </SettingsFieldHelper>
                  </div>
                </div>
              ) : null}
              <div className={SETTINGS_FIELD_ROW}>
                <div>
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
                </div>
                <div className="min-w-0 space-y-1">
                  <select
                    id="reader-language"
                    value={readerLanguage}
                    disabled={premiumStatusLoading}
                    onChange={(event) => {
                      const next = event.target.value as ReaderLanguageSetting;
                      if (!isPremiumUser && next !== "auto") {
                        setSelectedPremiumFeature({
                          title: t.settingsReaderLanguage ?? "Reader Language",
                          description:
                            t.settingsReaderLanguageDescription ??
                            "Choose the language used for the note reveal page. Auto uses the recipient's browser language.",
                          plan: "starter",
                        });
                        return;
                      }
                      setReaderLanguage(next);
                    }}
                    className={`${SETTINGS_SELECT_CLASS} min-w-0 disabled:cursor-wait disabled:opacity-60`}
                    style={SELECT_CHEVRON_STYLE}
                  >
                    <option value="auto">
                      {withPlanUnlock(t.settingsReaderLanguageAuto ?? "Auto", "free", t)}
                    </option>
                    {LANGUAGE_OPTIONS.map((option) => (
                      <option
                        key={option.code}
                        value={option.code}
                        style={!isPremiumUser ? LOCKED_OPTION_STYLE : undefined}
                      >
                        {withPlanUnlock(option.nativeName, "starter", t)}
                      </option>
                    ))}
                  </select>
                  <SettingsFieldHelper>
                    {t.settingsReaderLanguageHint ??
                      "Auto uses the recipient's browser language."}
                  </SettingsFieldHelper>
                </div>
              </div>
              {!isPremiumUser ? (
                <a
                  href={premiumUpgradeHref}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-primary/30 bg-transparent px-3 py-2 text-xs font-medium text-primary transition-colors hover:border-primary/45 hover:bg-primary/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 dark:text-blue-300 dark:hover:text-white"
                >
                  <Lock className="h-3.5 w-3.5 opacity-75" aria-hidden />
                  Unlock delivery controls with Starter or Business
                </a>
              ) : null}
            </section>

            <section
              className="space-y-2 rounded-lg border border-violet-200/80 bg-violet-50/35 px-3 pb-3 pt-2 dark:border-violet-900/60 dark:bg-violet-950/15"
              aria-labelledby="note-reveal-branding-heading"
            >
              <SectionHeading
                id="note-reveal-branding-heading"
                title={t.settingsRevealBrandingSection ?? "Reveal branding"}
                showPremiumBadge={!isConfiguredBusiness}
                premiumLabel={t.settingsPlanBusiness ?? "Business"}
              />
              <div className={SETTINGS_TOGGLE_ROW}>
                <div className="min-w-0 flex-1">
                  {premiumStatusLoading ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t.authLoading ?? "Loading account…"}
                    </p>
                  ) : brandingAllowed && !hasRevealBranding ? (
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <span className="mr-0.5 shrink-0 rounded bg-violet-100 p-1 dark:bg-violet-900/30">
                        <Palette className="h-4 w-4 text-violet-600 dark:text-violet-400" aria-hidden />
                      </span>
                      <span className="min-w-0 leading-snug">
                        <a href={brandingHref} className="font-medium text-primary underline underline-offset-2 dark:text-blue-300">
                          {t.settingsDeliveryBrandedRevealSetUp ?? "Add your company branding"}
                        </a>{" "}
                        {t.settingsDeliveryBrandedRevealSetUpHint ?? "to show it on the reveal page."}
                      </span>
                    </div>
                  ) : (
                    <SettingsFieldLabel
                      htmlFor="apply-branding"
                      icon={<Palette className="h-4 w-4 text-violet-600 dark:text-violet-400" />}
                      iconToneClassName="bg-violet-100 dark:bg-violet-900/30"
                      label={brandedRevealFeature.title}
                      info={brandedRevealFeature.description}
                      singleLine
                    />
                  )}
                </div>
                <div className="flex shrink-0 items-center">
                  {premiumStatusLoading ? null : brandingAllowed && hasRevealBranding ? (
                    <Switch
                      id="apply-branding"
                      checked={applyBranding}
                      onCheckedChange={(checked) => setApplyBranding?.(checked)}
                    />
                  ) : brandingAllowed ? null : (
                    <LockedPremiumToggle
                      label={brandedRevealFeature.title}
                      plan="Business"
                      onClick={() => setSelectedPremiumFeature(brandedRevealFeature)}
                    />
                  )}
                </div>
              </div>
              {!isConfiguredBusiness ? (
                <div className="space-y-2">
                  <p className="px-1 text-xs leading-snug text-violet-700 dark:text-violet-300">
                    Business adds your company identity to the recipient reveal page.
                  </p>
                  <a
                    href={premiumUpgradeHref}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-violet-300/70 bg-transparent px-3 py-2 text-xs font-medium text-violet-700 transition-colors hover:border-violet-400 hover:bg-violet-100/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/30 dark:border-violet-800 dark:text-violet-300 dark:hover:bg-violet-950/40"
                  >
                    <Lock className="h-3.5 w-3.5 opacity-75" aria-hidden />
                    Unlock reveal branding with Business
                  </a>
                </div>
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
                  className="rounded-md border border-primary/40 px-3 py-2 text-xs font-medium text-primary hover:bg-primary/5 disabled:opacity-60 dark:text-blue-300"
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
              {selectedPremiumFeature?.plan === "business"
                ? "Unlock more with Business"
                : "Add more control with Starter"}
            </DialogTitle>
            <DialogDescription>
              <span className="block font-medium text-foreground">
                {selectedPremiumFeature?.title}
              </span>
              <span className="mt-1 block">
                {selectedPremiumFeature?.description ??
                  t.settingsPremiumFeatureDialogFallback ??
                  "Choose Starter or Business to unlock delivery and verification controls."}
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-800/60 dark:bg-amber-900/20 dark:text-amber-100">
            {selectedPremiumFeature?.plan === "business"
              ? "Included with Business. Your encryption and privacy protections stay the same."
              : "Included with Starter and Business. Your encryption and privacy protections stay the same."}
          </div>
          <a
            href={
              selectedPremiumFeature?.plan === "business" && isConfiguredBusiness
                ? brandingHref
                : premiumUpgradeHref
            }
            className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            {selectedPremiumFeature?.plan === "business" && isConfiguredBusiness
              ? (t.settingsDeliveryBrandedRevealSetUp ?? "Add your company branding")
              : selectedPremiumFeature?.plan === "business"
                ? "Upgrade to Business"
                : "Upgrade to Starter"}
          </a>
        </DialogContent>
      </Dialog>
    </>
  );
};
