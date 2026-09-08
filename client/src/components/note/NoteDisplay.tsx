import React, { useState, useEffect, useCallback, useMemo, useRef, type ReactNode } from 'react';
import {
  Copy,
  RefreshCw,
  Unlock,
  Eye,
  EyeOff,
  Download,
  Paperclip,
  FileText,
  Image as ImageIcon,
  Mic,
  Video,
  BadgeCheck,
  Tags,
  ChevronDown,
  ChevronUp,
  Lock,
} from 'lucide-react';
import { apiBlobRequest, apiRequest, ApiRequestError } from '@/lib/queryClient';
import { useAccountEntitlements } from '@/context/AccountEntitlementsContext';
import { hasPremiumFeatures } from '@shared/planCatalog';
import {
  mergeNoteLabelsIntoLocal,
  parseNoteLabelsExport,
} from '@/utils/noteLabelsStorage';
import {
  decryptNote,
  deriveNoteRootKeysFromUrlFragment,
  deriveReceiptAckTokenHexFromUrlFragment,
  importAesGcmKeyFromUrlFragment,
  base64ToArrayBuffer,
  deserializeEncryptedPayload,
  NOTE_KEY_DERIVATION_HKDF_ROOT_V2,
  unwrapContentKeyWithPassword,
  unwrapRootKeyWithPassword,
} from '@/utils/encryption';
import { formatNoteFileSize } from '@shared/noteFileLimits';
import { formatAttachmentDisplayName } from '@/utils/formatAttachmentDisplayName';
import {
  canBrowserPlayVoiceAttachment,
} from '@/utils/voiceMessageRecording';
import {
  getAttachmentBlobMimeType,
  getAttachmentPreviewKind,
} from '@/utils/attachmentPreviewKind';
import { parseAttachmentRecipientPermission } from '@shared/attachmentRecipientPermission';
import { SecureAttachmentViewer } from '@/components/note/SecureAttachmentViewer';
import {
  convertVoiceAttachmentForDownload,
  isVoiceDownloadConversionAvailable,
  type VoiceDownloadFormat,
} from '@/utils/voiceMessageDownloadFormat';
import { useToast } from '@/hooks/use-toast';
import {
  brandingCtaStyle,
  brandingCardMarkUrl,
  brandingRevealLogoClassName,
  brandingUsesPortalSurface,
  applyOpenedNoteBranding,
  parseStoredRevealBranding,
  brandingNoteTextBorderColor,
} from '@shared/businessBranding';
import {
  parseRevealBodyFont,
  revealBodyFontClassName,
  type StoredRevealBodyFont,
} from '@shared/revealBodyFont';
import {
  RecipientPortal,
  RevealHandoffStack,
  type RecipientPortalSurface,
} from '@/components/note/RecipientPortal';
import { SecurityRecommendations } from '@/components/features/SecurityRecommendations';
import { useLanguage } from '@/context/LanguageContext';
import {
  getTranslations,
  loadTranslations,
  normalizeLanguageCode,
  type SupportedLanguage,
  type Translations,
} from '@/utils/translation';
import {
  AttachmentProgressDialog,
  type AttachmentProgressState,
} from '@/components/note/AttachmentProgressDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type NoteAccessProblemVariant = 'note_gone' | 'link_incomplete' | 'key_truncated' | 'not_yet_available';

interface NoteDisplayProps {
  id: string;
  encryptionKey: string | null;
  /** True when the URL had no `#fragment` (secret key never arrived). Detected once on page load. */
  linkKeyMissing?: boolean;
  /** True when `#fragment` is present but shorter than a real note key (likely truncated). */
  linkKeyTruncated?: boolean;
  revealBranding?: RevealBranding;
}

interface RevealBranding {
  logoUrl?: string;
  /** Preferred wire field from shared/businessBranding. */
  senderName?: string;
  senderRole?: string;
  trustMessage?: string;
  /** Legacy alias still accepted when reading stored notes. */
  sharerName?: string;
  companyName?: string;
  accentColor?: string;
  noteBorderColor?: string;
  backgroundColor?: string;
  textColor?: string;
  bannerUrl?: string;
  cardBannerUrl?: string;
  cardImage?: "logo" | "banner";
  backgroundStyle?: "neutral" | "gradient" | "vignette" | "glow" | "mesh" | "banner";
  showBrandingAfterReveal?: boolean;
  openedBackground?: "same" | "neutral" | "gradient" | "vignette" | "glow" | "mesh" | "banner";
  openedShowLogo?: boolean;
  openedShowSenderName?: boolean;
  openedShowCompanyName?: boolean;
  openedShowTrustMessage?: boolean;
}

interface NoteData {
  content: string;
  iv: string;
  readCount: number;
  maxReads: number;
  expiresAt: string;
  isPasswordProtected?: boolean;
  salt?: string;
  encryptedKey?: string;
  encryptedKeyIv?: string;
  aad?: string; // Additional Authenticated Data
  kdfParams?: unknown; // Structured KDF policy descriptor (validated by decrypt parser)
  kdfVersion?: number; // Key Derivation Function version
  kdfIterations?: number; // KDF iteration count
  kdfPolicyTag?: string; // KDF policy/profile tag (e.g. argon2id-m65536-p1)
  keyDerivation?: string;
  fileAccessToken?: string;
  fileAccessTokenExpiresIn?: number;
  fileAccessTokenExpiresAtMs?: number;
  attachment?: NoteAttachment;
  readerLanguage?: SupportedLanguage;
  revealBranding?: RevealBranding;
}

interface NoteAttachmentV2 {
  v: 2;
  alg: "libsodium-secretstream-xchacha20poly1305";
  encryptedSize: number;
  chunkSize: number;
  totalChunks: number;
  header: string;
  aad: string;
  encryptedMetadata: {
    alg: "AES-GCM";
    iv: string;
    aad: string;
    ciphertext: string;
  };
  wrappedKey: {
    alg: "AES-GCM";
    iv: string;
    aad: string;
    encryptedKey: string;
  };
  chunks: Array<{ index: number; encryptedSize: number }>;
  encryptedContentSha256: string;
}

type NoteAttachment = NoteAttachmentV2;

type AttachmentDisplayMetadata = {
  name: string;
  type: string;
  size: number;
};

function revokeAttachmentPreviewUrl(url: string | null): void {
  if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
}

function createAttachmentPreviewUrl(blob: Blob): string {
  return URL.createObjectURL(blob);
}

interface RevealHeroProps {
  isRevealing: boolean;
  isRevealButtonReady: boolean;
  onReveal: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  branding?: RevealBranding;
  t: Translations;
  compact: boolean;
}

/** Shared hero subtitle: matches Secure File Transfer / Password Generator rhythm. */
const NOTE_VIEW_HERO_SUBTITLE =
  "m-0 mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-gray-500 dark:text-gray-400 sm:text-xl";

/** Shared outer shell for note-view heroes (password gate, reveal, access problems). */
const NOTE_VIEW_SHELL = "w-full max-w-5xl mx-auto";
const NOTE_VIEW_HERO_SECTION = "relative isolate px-4 pb-2 text-center sm:px-6 sm:pb-4 lg:px-8";

/** Reveal succeeded but client decrypt/import failed — not the same as a missing or consumed note. */
function isDecryptKeyFailureMessage(message: string): boolean {
  const m = message;
  return (
    m.includes("Failed to decrypt") ||
    m.includes("encryption key may be invalid") ||
    m.includes("Invalid decryption key") ||
    m.includes("may have been tampered") ||
    m.includes("Missing encryption key in URL. The note cannot be decrypted.")
  );
}

const getBrandingLine = (branding: RevealBranding | undefined, t: Translations): string | null => {
  if (!branding) return null;
  const baseSharer = branding.senderName?.trim() || branding.sharerName?.trim();
  const sharer = baseSharer && branding.senderRole?.trim()
    ? `${baseSharer}, ${branding.senderRole.trim()}`
    : baseSharer;
  const company = branding.companyName?.trim();
  if (sharer && company) {
    return (t.revealBrandingSharedByFrom ?? "{sender} from {company} shared a private note")
      .replace("{sender}", sharer)
      .replace("{company}", company);
  }
  if (sharer) return (t.revealBrandingSharedBy ?? "Shared by {sender}").replace("{sender}", sharer);
  if (company) return (t.revealBrandingSharedByCompany ?? "Shared by {company}").replace("{company}", company);
  return null;
};

function withFileAccessDeadline<T extends NoteData>(data: T): T {
  if (!data.fileAccessToken || typeof data.fileAccessTokenExpiresIn !== "number") {
    return data;
  }
  return {
    ...data,
    fileAccessTokenExpiresAtMs: Date.now() + data.fileAccessTokenExpiresIn * 1000,
  };
}

function formatFileAccessRemaining(totalSeconds: number): string {
  const seconds = Math.max(0, totalSeconds);
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}:${String(remainingMinutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
  }
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}

const NoteAccessProblem: React.FC<{
  variant: NoteAccessProblemVariant;
  /** True when the note was fetched but the URL key could not decrypt (wrong/truncated key, etc.). */
  keyMismatch?: boolean;
  /** ISO UTC open time when variant is `not_yet_available`. */
  opensAt?: string | null;
  /** Recipient still owes a verification code once the note unlocks. */
  verificationPending?: boolean;
  t: Translations;
}> = ({
  variant,
  keyMismatch = false,
  opensAt = null,
  verificationPending = false,
  t,
}) => {
  const isIncomplete = variant === 'link_incomplete';
  const isKeyTruncated = variant === 'key_truncated';
  const isNotYetAvailable = variant === 'not_yet_available';
  const showKeyMismatch = variant === 'note_gone' && keyMismatch;
  const opensAtLabel = opensAt
    ? (() => {
        const date = new Date(opensAt);
        if (Number.isNaN(date.getTime())) return opensAt;
        // Safari throws if dateStyle/timeStyle are mixed with other options (e.g. timeZoneName).
        try {
          return date.toLocaleString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            timeZoneName: "short",
          });
        } catch {
          return date.toLocaleString();
        }
      })()
    : null;

  return (
    <section className={NOTE_VIEW_SHELL}>
      <section className={NOTE_VIEW_HERO_SECTION}>
        <div className="text-center">
          {isIncomplete ? (
            <>
              <h1 className="page-title text-gray-900 dark:text-white">{t.revealIncompleteTitle ?? "This link looks incomplete"}</h1>
              <p className={NOTE_VIEW_HERO_SUBTITLE}>{t.revealIncompleteDescription ?? "The secret key (after #) is missing."}</p>
            </>
          ) : isKeyTruncated ? (
            <>
              <h1 className="page-title text-gray-900 dark:text-white">{t.revealKeyTooShortTitle ?? "This link's key looks too short"}</h1>
              <p className={NOTE_VIEW_HERO_SUBTITLE}>
                {t.revealKeyTooShortDescription ?? "The secret after the # is shorter than a real note key. It may have been cut off when the link was copied or shared."}
              </p>
            </>
          ) : isNotYetAvailable ? (
            <>
              <h1 className="page-title text-gray-900 dark:text-white">
                {t.revealNotYetAvailableTitle ?? "Not available yet"}
              </h1>
              <p className={NOTE_VIEW_HERO_SUBTITLE}>
                {t.revealNotYetAvailableDescription ??
                  "The sender scheduled this note to unlock later. It cannot be opened before then."}
              </p>
              {opensAtLabel ? (
                <div className="mx-auto mt-6 max-w-md rounded-lg border border-gray-200 bg-gray-50 px-4 py-4 dark:border-gray-700 dark:bg-gray-800/60">
                  <p className="m-0 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    {t.revealNotYetAvailableUnlocksLabel ?? "Unlocks at"}
                  </p>
                  <p className="mt-1 m-0 text-lg font-semibold text-gray-900 dark:text-white">
                    {opensAtLabel}
                  </p>
                </div>
              ) : null}
              {verificationPending ? (
                <p className="mx-auto mt-5 max-w-md text-sm text-gray-600 dark:text-gray-400">
                  {t.revealNotYetAvailableVerificationHint ??
                    "This note also requires a verification code. We'll email it to the recipient once the note unlocks."}
                </p>
              ) : null}
            </>
          ) : showKeyMismatch ? (
            <>
              <h1 className="page-title text-gray-900 dark:text-white">{t.revealCouldNotUnlockTitle ?? "Couldn't unlock this note"}</h1>
              <p className={NOTE_VIEW_HERO_SUBTITLE}>
                {t.revealCouldNotUnlockDescription ?? "The key in your link doesn't match this note. It may be wrong, incomplete, or from a different link. Copy the full URL, including everything after the # symbol."}
              </p>
            </>
          ) : (
            <>
              <h1 className="page-title text-gray-900 dark:text-white">{t.revealUnavailableTitle ?? "Note no longer available"}</h1>
              <p className={NOTE_VIEW_HERO_SUBTITLE}>
                {t.revealUnavailableDescription ?? "It may have already been opened, expired, or the link is incomplete."}
              </p>
            </>
          )}
        </div>
      </section>

      {!isNotYetAvailable ? (
      <div className="px-4 sm:px-6 lg:px-8 mt-10 sm:mt-12 md:mt-14">
        <div
          className="max-w-xl mx-auto rounded-2xl border-2 border-blue-200/90 dark:border-blue-800/65 bg-blue-50/60 dark:bg-blue-950/25 px-6 py-7 sm:px-8 sm:py-8 shadow-sm"
          role="group"
          aria-label="What to try next"
        >
          <div className="text-center space-y-5 sm:space-y-6">
            <p className="m-0 text-lg sm:text-xl md:text-2xl text-gray-700 dark:text-gray-300 leading-snug sm:leading-[1.45]">
              {t.revealTryOriginalPrefix ?? "Try opening the"} <span className="font-semibold text-gray-900 dark:text-gray-100">{t.revealOriginalLink ?? "original link"}</span> {t.revealTryOriginalSuffix ?? "again."}
            </p>
            <div className="flex items-center gap-3 justify-center text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              <span className="h-px w-10 sm:w-12 bg-blue-200/95 dark:bg-blue-700/80" aria-hidden />
              OR
              <span className="h-px w-10 sm:w-12 bg-blue-200/95 dark:bg-blue-700/80" aria-hidden />
            </div>
            <p className="m-0 text-lg sm:text-xl md:text-2xl text-gray-700 dark:text-gray-300 leading-snug sm:leading-[1.45]">
              {t.revealAskSenderPrefix ?? "Ask the sender to send a"} <span className="font-semibold text-gray-900 dark:text-gray-100">{t.revealNewOne ?? "new one"}</span>.
            </p>
          </div>
        </div>
      </div>
      ) : null}
    </section>
  );
};

/**
 * Sender identity in the reveal column: logo, who shared the note, and their
 * trust message. Shown above the CTA so it is visible even without a sender name.
 */
const BrandingIdentity: React.FC<{
  branding?: RevealBranding;
  brandingLine: string | null;
  lightText?: boolean;
  /** Compact identity block for the opened note card header. */
  inCard?: boolean;
}> = ({ branding, brandingLine, lightText = false, inCard = false }) => {
  const markUrl = brandingCardMarkUrl(branding);
  const hasLogo = Boolean(markUrl);
  const sender = branding?.senderName?.trim() || branding?.sharerName?.trim();
  const role = branding?.senderRole?.trim();
  const company = branding?.companyName?.trim();
  const meta = [role, company].filter(Boolean).join(" · ");
  const hasTrustMessage = Boolean(branding?.trustMessage?.trim());
  if (!brandingLine && !hasLogo && !hasTrustMessage && !sender && !company) return null;

  const logo = markUrl ? (
    <img
      src={markUrl}
      alt={branding?.companyName ? `${branding.companyName} logo` : "Sender logo"}
      className={
        inCard
          ? brandingRevealLogoClassName(branding)
          : "max-h-14 w-auto object-contain sm:max-h-16"
      }
      loading="lazy"
      referrerPolicy="no-referrer"
    />
  ) : null;

  if (inCard) {
    return (
      <div className="flex w-full flex-col items-center gap-2 text-center">
        {logo}
        {sender ? (
          <p className="m-0 text-base font-semibold text-gray-900 dark:text-gray-50">{sender}</p>
        ) : brandingLine ? (
          <p className="m-0 text-sm font-medium text-gray-800 dark:text-gray-100">{brandingLine}</p>
        ) : null}
        {meta ? <p className="m-0 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">{meta}</p> : null}
        {!sender && !meta && company ? (
          <p className="m-0 text-sm font-medium text-gray-700 dark:text-gray-200">{company}</p>
        ) : null}
        {branding?.trustMessage ? (
          <p className="m-0 max-w-sm text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            {branding.trustMessage}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-2.5">
      {logo ? (
        lightText ? (
          <div className="rounded-lg bg-white px-3 py-2 shadow-sm">{logo}</div>
        ) : (
          logo
        )
      ) : null}
      {brandingLine ? (
        <p
          className={`m-0 text-sm font-medium ${
            lightText ? "text-white/90" : "text-gray-700 dark:text-gray-200"
          }`}
        >
          {brandingLine}
        </p>
      ) : null}
      {branding?.trustMessage ? (
        <p
          className={`m-0 max-w-md text-sm leading-relaxed ${
            lightText ? "text-white/80" : "text-gray-600 dark:text-gray-300"
          }`}
        >
          {branding.trustMessage}
        </p>
      ) : null}
    </div>
  );
};

const RevealHero: React.FC<RevealHeroProps> = ({
  isRevealing,
  isRevealButtonReady,
  onReveal,
  branding,
  t,
  compact,
}) => {
  const brandingLine = getBrandingLine(branding, t);
  const buttonStyle = brandingCtaStyle(branding);
  const markUrl = brandingCardMarkUrl(branding);
  const logo = markUrl ? (
    <img
      src={markUrl}
      alt={branding?.companyName ? `${branding.companyName} logo` : "Sender logo"}
      className={brandingRevealLogoClassName(branding)}
      loading="lazy"
      referrerPolicy="no-referrer"
    />
  ) : null;

  const action = (
    <div className="flex w-full justify-center">
      <button
        type="button"
        onClick={(ev) => void onReveal(ev)}
        disabled={isRevealing || !isRevealButtonReady}
        style={buttonStyle}
        className={`inline-flex w-full max-w-[15rem] items-center justify-center rounded-md px-4 py-2.5 text-sm font-semibold transition-all duration-200 hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
          buttonStyle
            ? "hover:shadow-[0_0_12px_rgba(15,23,42,0.12)] focus-visible:ring-gray-400"
            : "bg-primary text-white hover:bg-primary/90 hover:shadow-[0_0_12px_rgba(59,130,246,0.16)] focus-visible:ring-primary"
        }`}
      >
        {isRevealing ? (
          <>
            <div className="mr-2 h-3.5 w-3.5 animate-spin rounded-full border-t-2 border-b-2 border-current" />
            {t.revealing ?? "Revealing..."}
          </>
        ) : (
          <>
            <Unlock className="mr-1.5 h-3.5 w-3.5" />
            {t.revealNote ?? "Reveal Note"}
          </>
        )}
      </button>
    </div>
  );

  if (compact) {
    return (
      <RevealHandoffStack
        compact
        branding={branding}
        brandingLine={brandingLine}
        logo={logo}
        action={action}
        footnote={
          <>
            <span className="sm:hidden">
              {t.revealDeletedAfterOpening ?? "Deleted after opening"}
            </span>
            <span className="hidden sm:inline">
              {t.revealDeletedAfterOpeningDesktop ??
                "This note will be deleted after opening"}
            </span>
          </>
        }
      />
    );
  }

  return (
    <section className={NOTE_VIEW_SHELL}>
      <section className={NOTE_VIEW_HERO_SECTION}>
        <RevealHandoffStack
          branding={branding}
          brandingLine={brandingLine}
          logo={logo}
          title={
            <>
              {t.revealTitlePrefix ?? "Reveal"}{" "}
              <span className="text-primary">{t.privateNote ?? "Private Note"}</span>
            </>
          }
          subtitle={t.revealPrivacyDescription ?? "For your privacy, this note is deleted after it's opened."}
          action={action}
          footnote={t.revealReadyWarning ?? "Open only when you're ready — this cannot be undone."}
        />
      </section>
    </section>
  );
};

export const NoteDisplay: React.FC<NoteDisplayProps> = ({
  id,
  encryptionKey,
  revealBranding,
  linkKeyMissing = false,
  linkKeyTruncated = false,
}) => {
  const { language, setLanguage } = useLanguage();
  const [senderSelectedLanguage, setSenderSelectedLanguage] = useState<SupportedLanguage | null>(null);
  // Branding is returned as public note metadata before reveal. Keep it in local
  // state because ViewNote cannot know a note's snapshotted branding up front.
  const [resolvedRevealBranding, setResolvedRevealBranding] =
    useState<RevealBranding | undefined>(revealBranding);
  const [bodyFont, setBodyFont] = useState<StoredRevealBodyFont | undefined>(undefined);
  const [attachmentViewOnly, setAttachmentViewOnly] = useState(false);
  const activeRevealBranding = resolvedRevealBranding ?? revealBranding;
  const readerLanguage = senderSelectedLanguage ?? language ?? "en";
  const [readerTranslations, setReaderTranslations] = useState<Translations>(() =>
    getTranslations(readerLanguage),
  );
  const t = readerTranslations;
  const [noteContent, setNoteContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [keyMismatchError, setKeyMismatchError] = useState(false);
  const [delayedRevealOpensAt, setDelayedRevealOpensAt] = useState<string | null>(null);
  /** False until the note meta request settles, so the delayed-reveal check runs before any gate. */
  const [delayedRevealChecked, setDelayedRevealChecked] = useState(false);
  const [receiptAckRequired, setReceiptAckRequired] = useState(false);
  const [receiptAckAcknowledged, setReceiptAckAcknowledged] = useState(false);
  const [receiptAckTokenHex, setReceiptAckTokenHex] = useState<string | null>(null);
  const [receiptAckSubmitting, setReceiptAckSubmitting] = useState(false);
  const [receiptAckMessage, setReceiptAckMessage] = useState<string | null>(null);
  const [receiptAckStatement, setReceiptAckStatement] = useState<string | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordDecryptError, setPasswordDecryptError] = useState<string | null>(null);
  const [noteData, setNoteData] = useState<NoteData | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);
  const [isRevealButtonReady, setIsRevealButtonReady] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contentKey, setContentKey] = useState<CryptoKey | null>(null);
  const [attachmentMetadata, setAttachmentMetadata] = useState<AttachmentDisplayMetadata | null>(null);
  const [isDownloadingFile, setIsDownloadingFile] = useState(false);
  const [isViewingFile, setIsViewingFile] = useState(false);
  const [attachmentDecryptProgress, setAttachmentDecryptProgress] =
    useState<AttachmentProgressState | null>(null);
  const [previewObjectUrl, setPreviewObjectUrl] = useState<string | null>(null);
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);
  const [previewMimeType, setPreviewMimeType] = useState<string | null>(null);
  const [showInlinePreview, setShowInlinePreview] = useState(false);
  const [messageSheetOpen, setMessageSheetOpen] = useState(true);
  const [isLoadingThumbnail, setIsLoadingThumbnail] = useState(false);
  const [audioPlaybackUnsupported, setAudioPlaybackUnsupported] = useState(false);
  const thumbnailLoadAttemptedRef = useRef(false);
  const [fileAccessNowMs, setFileAccessNowMs] = useState(() => Date.now());
  const [recipientGateLoading, setRecipientGateLoading] = useState(true);
  const [recipientGateRequired, setRecipientGateRequired] = useState(false);
  const [recipientGateCodeRequired, setRecipientGateCodeRequired] = useState(false);
  const [recipientGateVerified, setRecipientGateVerified] = useState(false);
  const [recipientCodeInput, setRecipientCodeInput] = useState("");
  const [recipientGateError, setRecipientGateError] = useState<string | null>(null);
  const [recipientGateSubmitting, setRecipientGateSubmitting] = useState(false);
  const [recipientGateEmailHint, setRecipientGateEmailHint] = useState<string | null>(null);
  const [recipientCodeSending, setRecipientCodeSending] = useState(false);
  const [recipientCodeSent, setRecipientCodeSent] = useState(false);
  const recipientCodeAutoSendRef = useRef(false);
  const { toast } = useToast();
  const { entitlements } = useAccountEntitlements();
  const canChooseVoiceDownloadFormat = hasPremiumFeatures(entitlements.accountType);
  const canImportNoteLabels = entitlements.capabilities.noteLabelPortability === true;
  const importedLabelsPack = useMemo(
    () => (noteContent ? parseNoteLabelsExport(noteContent) : null),
    [noteContent],
  );
  const [labelsImported, setLabelsImported] = useState(false);

  useEffect(() => {
    setLabelsImported(false);
  }, [noteContent]);
  useEffect(() => {
    let cancelled = false;
    setReaderTranslations(getTranslations(readerLanguage));
    void loadTranslations(readerLanguage).then((loaded) => {
      if (!cancelled) setReaderTranslations(loaded);
    });
    return () => {
      cancelled = true;
    };
  }, [readerLanguage]);

  useEffect(() => {
    if (!id) {
      setSenderSelectedLanguage(null);
      setResolvedRevealBranding(revealBranding);
      setDelayedRevealOpensAt(null);
      setDelayedRevealChecked(true);
      return;
    }
    let cancelled = false;
    setResolvedRevealBranding(revealBranding);
    setDelayedRevealChecked(false);
    void apiRequest<{ readerLanguage?: string; revealBranding?: RevealBranding; bodyFont?: string }>(
      `/api/notes/${id}`,
      "GET",
    )
      .then((meta) => {
        if (cancelled) return;
        setDelayedRevealOpensAt(null);
        setSenderSelectedLanguage(
          typeof meta.readerLanguage === "string"
            ? normalizeLanguageCode(meta.readerLanguage)
            : null,
        );
        setResolvedRevealBranding(
          parseStoredRevealBranding(meta.revealBranding) ?? revealBranding,
        );
        setBodyFont(parseRevealBodyFont(meta.bodyFont));
        setAttachmentViewOnly(parseAttachmentRecipientPermission((meta as { attachmentPermission?: string }).attachmentPermission) === "view-only");
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiRequestError && err.status === 403) {
          try {
            const body = JSON.parse(err.bodyText) as { error?: string; opensAt?: string };
            if (body.error === "note_not_yet_available" && typeof body.opensAt === "string") {
              setDelayedRevealOpensAt(body.opensAt);
              return;
            }
          } catch {
            // ignore
          }
        }
        setDelayedRevealOpensAt(null);
        setSenderSelectedLanguage(null);
      })
      .finally(() => {
        if (!cancelled) setDelayedRevealChecked(true);
      });
    return () => {
      cancelled = true;
    };
  }, [id, revealBranding]);

  // Drop the wait screen the moment the scheduled time passes, so the recipient
  // moves straight on to verification (or reveal) without reloading the page.
  useEffect(() => {
    if (!delayedRevealOpensAt) return;
    const opensAtMs = new Date(delayedRevealOpensAt).getTime();
    if (!Number.isFinite(opensAtMs)) return;
    const msUntilOpen = opensAtMs - Date.now();
    if (msUntilOpen <= 0) {
      setDelayedRevealOpensAt(null);
      return;
    }
    // setTimeout delays overflow past the 32-bit limit and would fire immediately.
    if (msUntilOpen > 2_147_000_000) return;
    const timer = window.setTimeout(() => setDelayedRevealOpensAt(null), msUntilOpen + 250);
    return () => window.clearTimeout(timer);
  }, [delayedRevealOpensAt]);

  const attachmentPreviewKind = useMemo(
    () => getAttachmentPreviewKind(attachmentMetadata?.type, attachmentMetadata?.name),
    [attachmentMetadata?.type, attachmentMetadata?.name],
  );

  const reportAttachmentDecryptProgress = useCallback(
    (completedChunks: number, totalChunks: number, ratio?: number) => {
      const resolvedRatio =
        typeof ratio === "number" && Number.isFinite(ratio)
          ? Math.min(1, Math.max(0, ratio))
          : totalChunks > 0
            ? completedChunks / totalChunks
            : 1;
      // Overall ratio already includes download + decrypt weighting.
      const next = Math.max(1, Math.min(100, Math.round(resolvedRatio * 100)));
      const fullName = attachmentMetadata?.name || "file";
      const name = formatAttachmentDisplayName(fullName);
      setAttachmentDecryptProgress((prev) => ({
        phase: "decrypt",
        mode: "download",
        // Never jump backwards across download ETA ticks or decrypt frames.
        progress: Math.max(prev?.mode === "download" ? prev.progress : 0, next),
        title: t.attachmentDecryptProgressTitle,
        detail:
          totalChunks <= 1
            ? name
            : t.attachmentProgressChunkDetail
                .replace("{done}", String(completedChunks))
                .replace("{total}", String(totalChunks))
                .replace("{name}", name),
        detailTitle: fullName,
        footnote: t.attachmentDecryptProgressFootnote,
      }));
    },
    [attachmentMetadata?.name, t],
  );

  const decryptAttachmentPreview = useCallback(async (options?: {
    onProgress?: boolean;
  }): Promise<{ url: string; mimeType: string; blob: Blob } | null> => {
    if (!noteData?.attachment || !contentKey || !attachmentPreviewKind) return null;
    if (noteData.fileAccessTokenExpiresAtMs && noteData.fileAccessTokenExpiresAtMs <= Date.now()) {
      return null;
    }

    const fileAccessHeaders: Record<string, string> = noteData.fileAccessToken
      ? { "x-file-access-token": noteData.fileAccessToken }
      : {};
    const { decryptSodiumAttachmentChunks } = await import("@/utils/libsodiumFileAttachment");
    const decryptedParts = await decryptSodiumAttachmentChunks(
      noteData.attachment,
      contentKey,
      async (index) => {
        const encryptedChunkBlob = await apiBlobRequest(
          `/api/notes/${id}/file/chunks/${index}`,
          "GET",
          fileAccessHeaders,
        );
        return new Uint8Array(await encryptedChunkBlob.arrayBuffer());
      },
      options?.onProgress
        ? (pipeline) => {
            reportAttachmentDecryptProgress(
              pipeline.completedChunks,
              pipeline.totalChunks,
              pipeline.ratio,
            );
          }
        : undefined,
    );
    const mimeType = getAttachmentBlobMimeType(
      attachmentMetadata?.type,
      attachmentPreviewKind,
      attachmentMetadata?.name,
    );
    const blob = new Blob(decryptedParts as BlobPart[], { type: mimeType });
    const url = createAttachmentPreviewUrl(blob);
    return { url, mimeType, blob };
  }, [
    attachmentMetadata?.name,
    attachmentMetadata?.type,
    attachmentPreviewKind,
    contentKey,
    id,
    noteData,
    reportAttachmentDecryptProgress,
  ]);

  useEffect(() => {
    thumbnailLoadAttemptedRef.current = false;
    setPreviewObjectUrl((prev) => {
      revokeAttachmentPreviewUrl(prev);
      return null;
    });
    setPreviewBlob(null);
    setPreviewMimeType(null);
    setShowInlinePreview(false);
    setMessageSheetOpen(true);
    setIsLoadingThumbnail(false);
    setAudioPlaybackUnsupported(false);
  }, [id]);

  useEffect(() => {
    if (attachmentPreviewKind !== "image" && attachmentPreviewKind !== "audio") return;
    if (!contentKey || !noteData?.attachment) return;
    if (previewObjectUrl || thumbnailLoadAttemptedRef.current) return;
    if (noteData.fileAccessTokenExpiresAtMs && noteData.fileAccessTokenExpiresAtMs <= Date.now()) return;

    thumbnailLoadAttemptedRef.current = true;
    let cancelled = false;
    setIsLoadingThumbnail(true);
    void decryptAttachmentPreview()
      .then((result) => {
        if (cancelled || !result) return;
        setPreviewObjectUrl(result.url);
        setPreviewMimeType(result.mimeType);
        setPreviewBlob(result.blob);
        if (attachmentPreviewKind === "audio" || attachmentPreviewKind === "image") {
          setShowInlinePreview(true);
          setMessageSheetOpen(false);
          if (attachmentPreviewKind === "audio") {
            setAudioPlaybackUnsupported(
              !canBrowserPlayVoiceAttachment(result.mimeType, attachmentMetadata?.name),
            );
          }
        }
      })
      .catch((error) => {
        if (import.meta.env.DEV) {
          console.error("Attachment thumbnail decrypt failed:", error);
        }
        thumbnailLoadAttemptedRef.current = false;
      })
      .finally(() => {
        if (!cancelled) setIsLoadingThumbnail(false);
      });

    return () => {
      cancelled = true;
    };
  }, [attachmentPreviewKind, contentKey, decryptAttachmentPreview, noteData, previewObjectUrl]);

  const requireTrustedUserEvent = (e: React.SyntheticEvent): boolean => {
    if (e.nativeEvent.isTrusted) return true;
    toast({
      title: t.toastInteractionRequired,
            description: t.toastInteractionRequiredDesc,
    });
    return false;
  };

  const getUserFriendlyError = (message: string) => {
    if (message.startsWith("404:") || message.includes("Note not found")) {
      return t.revealUnavailableToast ?? "This note is unavailable or has already been read.";
    }
    if (message.includes("Note has expired")) {
      return t.revealExpiredToast ?? "This note has expired.";
    }
    if (isDecryptKeyFailureMessage(message)) {
      return t.revealKeyMismatchToast ?? "This link's key doesn't match this note. Copy the full URL, including everything after #, or ask the sender for a new link.";
    }
    if (message.includes("recipient_verification_required")) {
      return "Recipient verification is required before this note can be revealed.";
    }
    if (message.includes("note_not_yet_available")) {
      return t.revealNotYetAvailableDescription ?? "This note is scheduled to open later.";
    }
    return message;
  };

  useEffect(() => {
    if (!id) {
      setError('Invalid note ID');
      setKeyMismatchError(false);
      setIsLoading(false);
      setRecipientGateLoading(false);
      return;
    }

    let cancelled = false;
    setRecipientGateLoading(true);
    void (async () => {
      try {
        const status = await apiRequest<{
          required?: boolean;
          codeRequired?: boolean;
          emailHint?: string | null;
          codeSent?: boolean;
          verified?: boolean;
        }>(`/api/notes/${id}/recipient-gate`, "GET");
        if (cancelled) return;
        setRecipientGateRequired(status.required === true);
        setRecipientGateCodeRequired(status.codeRequired === true);
        setRecipientGateEmailHint(
          typeof status.emailHint === "string" && status.emailHint.trim()
            ? status.emailHint.trim()
            : null,
        );
        setRecipientCodeSent(status.codeSent === true);
        setRecipientGateVerified(status.required !== true || status.verified === true);
      } catch {
        if (!cancelled) {
          setRecipientGateRequired(false);
          setRecipientGateVerified(true);
        }
      } finally {
        if (!cancelled) setRecipientGateLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const sendRecipientVerificationCode = useCallback(
    async (options?: { silent?: boolean }) => {
      if (!id) return;
      setRecipientCodeSending(true);
      if (!options?.silent) setRecipientGateError(null);
      try {
        const result = await apiRequest<{ ok?: boolean; emailHint?: string | null }>(
          `/api/notes/${id}/recipient-send-code`,
          "POST",
          {},
        );
        setRecipientCodeSent(true);
        if (typeof result.emailHint === "string" && result.emailHint.trim()) {
          setRecipientGateEmailHint(result.emailHint.trim());
        }
      } catch (error) {
        let message =
          t.recipientGateSendCodeFailed ??
          "Could not send the verification code. Please try again.";
        if (error instanceof ApiRequestError) {
          try {
            const body = JSON.parse(error.bodyText) as {
              message?: string;
              error?: string;
              retryAfterSeconds?: number;
            };
            if (body.error === "cooldown" && body.retryAfterSeconds) {
              message = (
                t.recipientGateSendCodeCooldown ??
                "Please wait {seconds}s before requesting another code."
              ).replace("{seconds}", String(body.retryAfterSeconds));
            } else if (body.message) {
              message = body.message;
            }
          } catch {
            /* ignore */
          }
        }
        setRecipientGateError(message);
      } finally {
        setRecipientCodeSending(false);
      }
    },
    [id, t],
  );

  useEffect(() => {
    // Delayed reveal is checked first: emailing a code while the note is still
    // time-locked would burn the code's usefulness before it can be entered.
    if (
      !id ||
      !delayedRevealChecked ||
      delayedRevealOpensAt ||
      recipientGateLoading ||
      !recipientGateRequired ||
      recipientGateVerified ||
      recipientCodeAutoSendRef.current
    ) {
      return;
    }
    recipientCodeAutoSendRef.current = true;
    void sendRecipientVerificationCode({ silent: true });
  }, [
    id,
    delayedRevealChecked,
    delayedRevealOpensAt,
    recipientGateLoading,
    recipientGateRequired,
    recipientGateVerified,
    sendRecipientVerificationCode,
  ]);

  const handleRecipientGateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setRecipientGateSubmitting(true);
    setRecipientGateError(null);
    try {
      await apiRequest(`/api/notes/${id}/recipient-verify`, "POST", {
        ...(recipientGateCodeRequired ? { code: recipientCodeInput.trim() } : {}),
      });
      setRecipientGateVerified(true);
      toast({
        title: t.recipientGateVerifiedTitle,
        description: t.recipientGateVerifiedDescription,
      });
    } catch (error) {
      let message =
        t.recipientGateVerifyFailed ?? "Verification failed. Check the details and try again.";
      if (error instanceof ApiRequestError) {
        try {
          const body = JSON.parse(error.bodyText) as { message?: string };
          if (body.message) message = body.message;
        } catch {
          /* ignore */
        }
      }
      setRecipientGateError(message);
    } finally {
      setRecipientGateSubmitting(false);
    }
  };

  useEffect(() => {
    setIsRevealButtonReady(false);
    const timer = window.setTimeout(() => {
      setIsRevealButtonReady(true);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [id]);

  useEffect(() => {
    if (!noteData?.fileAccessTokenExpiresAtMs) return;
    setFileAccessNowMs(Date.now());
    const interval = window.setInterval(() => setFileAccessNowMs(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [noteData?.fileAccessTokenExpiresAtMs]);

  // Revoke blob preview URLs when replaced or on unmount (data URLs need no revoke).
  useEffect(() => {
    return () => {
      revokeAttachmentPreviewUrl(previewObjectUrl);
    };
  }, [previewObjectUrl]);

  const decryptWithKey = async (
    data: NoteData,
    key: string,
    options?: { deriveReceiptAck?: boolean },
  ) => {
    try {
      if (!data.aad) {
        throw new Error("Missing note authentication data");
      }
      const payloadBytes = deserializeEncryptedPayload({
        content: data.content,
        iv: data.iv,
        aad: data.aad,
      });

      const { noteTextKey, fileWrapKey, metadataKey } =
        data.keyDerivation === NOTE_KEY_DERIVATION_HKDF_ROOT_V2
          ? await deriveNoteRootKeysFromUrlFragment(key)
          : {
              noteTextKey: await importAesGcmKeyFromUrlFragment(key),
              fileWrapKey: await importAesGcmKeyFromUrlFragment(key),
              metadataKey: await importAesGcmKeyFromUrlFragment(key),
            };
      setContentKey(fileWrapKey);
      if (data.attachment?.v === 2) {
        const { decryptSodiumAttachmentMetadata } = await import("@/utils/libsodiumFileAttachment");
        setAttachmentMetadata(await decryptSodiumAttachmentMetadata(data.attachment, metadataKey, id));
      } else {
        setAttachmentMetadata(null);
      }

      // Decrypt the note with AAD for context validation
      // Fixed: Added AAD support
      const decryptedContent = await decryptNote(
        payloadBytes.encryptedData,
        noteTextKey,
        payloadBytes.iv,
        payloadBytes.aadBytes,
      );
      setNoteContent(decryptedContent);
      if (
        options?.deriveReceiptAck &&
        data.keyDerivation === NOTE_KEY_DERIVATION_HKDF_ROOT_V2
      ) {
        try {
          setReceiptAckTokenHex(await deriveReceiptAckTokenHexFromUrlFragment(key));
        } catch {
          setReceiptAckTokenHex(null);
        }
      }
    } catch (cryptoError) {
      if (import.meta.env.DEV) {
        console.error("Crypto error:", cryptoError);
      }
      throw new Error("Failed to decrypt the note. The encryption key may be invalid or the data may have been tampered with.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReveal = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!requireTrustedUserEvent(e)) return;

    if (!id) {
      setError('Invalid note ID');
      setKeyMismatchError(false);
      return;
    }

    setIsRevealing(true);
    setIsLoading(true);
    setError(null);
    setKeyMismatchError(false);

    try {
      const data = await apiRequest(`/api/notes/${id}/reveal`, "POST");

      setIsPasswordProtected(data.isPasswordProtected || false);
      if (typeof data.readerLanguage === "string") {
        setSenderSelectedLanguage(normalizeLanguageCode(data.readerLanguage));
      }
      if (data.revealBranding) {
        setResolvedRevealBranding(
          parseStoredRevealBranding(data.revealBranding) ?? data.revealBranding,
        );
      }
      setBodyFont(parseRevealBodyFont((data as { bodyFont?: string }).bodyFont));
      setAttachmentViewOnly(
        parseAttachmentRecipientPermission((data as { attachmentPermission?: string }).attachmentPermission) ===
          "view-only",
      );
      const receiptAck = data.receiptAck as
        | { required?: boolean; acknowledged?: boolean; acknowledgedAt?: string | null; statement?: string | null }
        | undefined;
      const ackRequired = receiptAck?.required === true;
      const ackAlready = receiptAck?.acknowledged === true;
      setReceiptAckRequired(ackRequired);
      setReceiptAckStatement(
        typeof receiptAck?.statement === "string" ? receiptAck.statement.trim() || null : null,
      );
      setReceiptAckAcknowledged(ackAlready);
      setReceiptAckMessage(
        ackAlready
          ? (t.revealReceiptAlreadyConfirmed ?? "Already confirmed")
          : null,
      );
      setReceiptAckTokenHex(null);
      setNoteData(withFileAccessDeadline(data));
      setHasRevealed(true);

      if (data.isPasswordProtected) {
        setIsLoading(false);
        return;
      }

      if (!encryptionKey) {
        throw new Error("Missing encryption key in URL. The note cannot be decrypted.");
      }

      await decryptWithKey(data, encryptionKey, {
        deriveReceiptAck: ackRequired && !ackAlready,
      });
    } catch (error) {
      console.error('Error revealing note:', error);
      if (error instanceof ApiRequestError && error.status === 403) {
        try {
          const body = JSON.parse(error.bodyText) as { error?: string; opensAt?: string };
          if (body.error === "note_not_yet_available") {
            if (typeof body.opensAt === "string") setDelayedRevealOpensAt(body.opensAt);
            setError("note_not_yet_available");
            setIsLoading(false);
            setHasRevealed(false);
            return;
          }
        } catch {
          // fall through
        }
      }
      if (error instanceof Error) {
        const friendlyMessage = getUserFriendlyError(error.message);
        setKeyMismatchError(isDecryptKeyFailureMessage(error.message));
        setError(friendlyMessage);
      } else {
        setKeyMismatchError(false);
        setError('The note could not be retrieved or has already been read');
      }
      setIsLoading(false);
      setHasRevealed(false);
    } finally {
      setIsRevealing(false);
    }
  };

  const handlePasswordDecrypt = async (
    e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (!requireTrustedUserEvent(e)) return;

    if (!password.trim()) {
      setPasswordDecryptError(null);
      toast({
        title: t.error,
        description: t.toastEnterPassword,
        variant: "destructive",
      });
      return;
    }

    if (!noteData) {
      toast({
        title: t.error,
        description: t.toastMissingNoteData,
        variant: "destructive",
      });
      return;
    }

    const wrappedKey = encryptionKey || null;

    // Check if we have all the required fields for password decryption
    if (!wrappedKey || !noteData.encryptedKeyIv || !noteData.salt) {
      toast({
        title: t.error,
        description: t.toastMissingPasswordFields,
        variant: "destructive",
      });
      return;
    }

    setPasswordDecryptError(null);
    setIsDecrypting(true);

    try {
      // At this point we're guaranteed that noteData and all required fields exist due to our previous checks
      const encryptedKey = base64ToArrayBuffer(wrappedKey);
      if (!noteData.aad) {
        throw new Error("Missing note authentication data");
      }
      const payloadBytes = deserializeEncryptedPayload({
        content: noteData.content,
        iv: noteData.iv,
        aad: noteData.aad,
      });
      const encryptedKeyIv = base64ToArrayBuffer(noteData.encryptedKeyIv!);
      const salt = base64ToArrayBuffer(noteData.salt!);

      const { noteTextKey, fileWrapKey, metadataKey, receiptAckTokenHex: unwrappedAckToken } =
        noteData.keyDerivation === NOTE_KEY_DERIVATION_HKDF_ROOT_V2
          ? await unwrapRootKeyWithPassword(
              encryptedKey,
              new Uint8Array(encryptedKeyIv),
              new Uint8Array(salt),
              password,
              payloadBytes.aadBytes,
              noteData.kdfParams,
              noteData.kdfVersion,
              noteData.kdfIterations,
              noteData.kdfPolicyTag,
            )
          : {
              noteTextKey: await unwrapContentKeyWithPassword(
                encryptedKey,
                new Uint8Array(encryptedKeyIv),
                new Uint8Array(salt),
                password,
                payloadBytes.aadBytes,
                noteData.kdfParams,
                noteData.kdfVersion,
                noteData.kdfIterations,
                noteData.kdfPolicyTag,
              ),
              fileWrapKey: await unwrapContentKeyWithPassword(
                encryptedKey,
                new Uint8Array(encryptedKeyIv),
                new Uint8Array(salt),
                password,
                payloadBytes.aadBytes,
                noteData.kdfParams,
                noteData.kdfVersion,
                noteData.kdfIterations,
                noteData.kdfPolicyTag,
              ),
              metadataKey: await unwrapContentKeyWithPassword(
                encryptedKey,
                new Uint8Array(encryptedKeyIv),
                new Uint8Array(salt),
                password,
                payloadBytes.aadBytes,
                noteData.kdfParams,
                noteData.kdfVersion,
                noteData.kdfIterations,
                noteData.kdfPolicyTag,
              ),
              receiptAckTokenHex: undefined as string | undefined,
            };

      const decryptedContent = await decryptNote(
        payloadBytes.encryptedData,
        noteTextKey,
        payloadBytes.iv,
        payloadBytes.aadBytes,
      );

      setNoteContent(decryptedContent);
      setContentKey(fileWrapKey);
      if (noteData.attachment?.v === 2) {
        const { decryptSodiumAttachmentMetadata } = await import("@/utils/libsodiumFileAttachment");
        setAttachmentMetadata(await decryptSodiumAttachmentMetadata(noteData.attachment, metadataKey, id));
      } else {
        setAttachmentMetadata(null);
      }
      if (
        receiptAckRequired &&
        !receiptAckAcknowledged &&
        typeof unwrappedAckToken === "string"
      ) {
        setReceiptAckTokenHex(unwrappedAckToken);
      }

      // Hide password input after successful decryption
      setIsPasswordProtected(false);

      toast({
        title: t.toastSuccess,
        description: t.toastNoteDecryptedSuccess,
      });
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Password decryption error:", error);
      }
      setPasswordDecryptError(
        t.revealWrongPassword ??
          "That password didn't unlock this note. Check for typos or ask the sender.",
      );
      import("@/utils/analyticsEvent").then(({ fireAnalyticsEvent }) => fireAnalyticsEvent("wrong_password")).catch(() => {});
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(noteContent);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
    toast({
      title: t.copied,
      description: t.toastNoteContentCopied,
    });
  };

  const handleConfirmReceipt = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    if (!requireTrustedUserEvent(e)) return;
    if (!receiptAckTokenHex || receiptAckSubmitting) return;
    setReceiptAckSubmitting(true);
    try {
      const result = await apiRequest<{
        ok?: boolean;
        alreadyConfirmed?: boolean;
        acknowledgedAt?: string;
      }>(`/api/notes/${id}/acknowledge-receipt`, "POST", {
        ackToken: receiptAckTokenHex,
      });
      setReceiptAckAcknowledged(true);
      setReceiptAckMessage(
        result.alreadyConfirmed
          ? (t.revealReceiptAlreadyConfirmed ?? "Already confirmed")
          : (t.revealReceiptConfirmed ?? "Receipt confirmed"),
      );
      toast({
        title: result.alreadyConfirmed
          ? (t.revealReceiptAlreadyConfirmed ?? "Already confirmed")
          : (t.revealReceiptConfirmed ?? "Receipt confirmed"),
        description:
          t.revealReceiptConfirmedHint ??
          "The sender can see that you successfully decrypted this note.",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not confirm receipt.";
      toast({
        title: t.error,
        description: message,
        variant: "destructive",
      });
    } finally {
      setReceiptAckSubmitting(false);
    }
  };

  const handleDownloadAttachment = async (downloadFormat: VoiceDownloadFormat = "original") => {
    if (attachmentViewOnly) return;
    if (!noteData?.attachment || !contentKey) return;
    if (noteData.fileAccessTokenExpiresAtMs && noteData.fileAccessTokenExpiresAtMs <= Date.now()) {
      toast({
        title: t.toastFileAccessExpired,
        description: t.toastFileAccessExpiredDesc,
        variant: "destructive",
      });
      return;
    }
    const fileAccessHeaders: Record<string, string> = noteData.fileAccessToken
      ? { "x-file-access-token": noteData.fileAccessToken }
      : {};
    const wantsConversion =
      attachmentPreviewKind === "audio" &&
      downloadFormat !== "original" &&
      canChooseVoiceDownloadFormat;
    setIsDownloadingFile(true);
    setAttachmentDecryptProgress({
      phase: "decrypt",
      mode: "download",
      progress: 0,
      title: t.attachmentDecryptProgressTitle,
      detail: attachmentMetadata?.name
        ? `${formatAttachmentDisplayName(attachmentMetadata.name)} · ${formatNoteFileSize(attachmentMetadata.size ?? 0)}`
        : undefined,
      detailTitle: attachmentMetadata?.name,
      footnote: t.attachmentDecryptProgressFootnote,
    });
    try {
      let decryptedParts: BlobPart[];
      const { decryptSodiumAttachmentChunks } = await import("@/utils/libsodiumFileAttachment");
      decryptedParts = (await decryptSodiumAttachmentChunks(
        noteData.attachment,
        contentKey,
        async (index) => {
          const encryptedChunkBlob = await apiBlobRequest(
            `/api/notes/${id}/file/chunks/${index}`,
            "GET",
            fileAccessHeaders,
          );
          return new Uint8Array(await encryptedChunkBlob.arrayBuffer());
        },
        (pipeline) => {
          reportAttachmentDecryptProgress(
            pipeline.completedChunks,
            pipeline.totalChunks,
            pipeline.ratio,
          );
        },
      )) as BlobPart[];
      let blob = new Blob(decryptedParts, {
        type: attachmentMetadata?.type || "application/octet-stream",
      });
      let downloadName = attachmentMetadata?.name || "privatenote-file";
      if (wantsConversion) {
        setAttachmentDecryptProgress((prev) =>
          prev
            ? {
                ...prev,
                progress: Math.max(prev.progress, 92),
                detail:
                  downloadFormat === "wav"
                    ? (t.voiceMessageDecodingToWav ?? "Decoding to WAV…")
                    : (t.voiceMessageDecodingToM4a ?? "Decoding to M4A…"),
                detailTitle: attachmentMetadata?.name,
              }
            : prev,
        );
        const converted = await convertVoiceAttachmentForDownload({
          blob,
          format: downloadFormat,
          sourceFileName: attachmentMetadata?.name,
          sourceMimeType: attachmentMetadata?.type,
        });
        blob = converted.blob;
        downloadName = converted.fileName;
      }
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = downloadName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Attachment download/decrypt failed:", error);
      }
      toast({
        title: t.toastFileDownloadFailed,
        description:
          wantsConversion
            ? (t.voiceMessageDecodeFailedDesc ??
              "The voice message could not be decoded into that format. Try Original or WAV.")
            : t.toastFileDownloadFailedDesc,
        variant: "destructive",
      });
    } finally {
      setIsDownloadingFile(false);
      setAttachmentDecryptProgress(null);
    }
  };

  const handlePreviewAttachment = async () => {
    if (!noteData?.attachment || !contentKey || !attachmentPreviewKind) return;
    if (noteData.fileAccessTokenExpiresAtMs && noteData.fileAccessTokenExpiresAtMs <= Date.now()) {
      toast({
        title: t.toastFileAccessExpired,
        description: t.toastFileAccessExpiredDesc,
        variant: "destructive",
      });
      return;
    }

    if (showInlinePreview && previewObjectUrl) {
      setShowInlinePreview(false);
      setMessageSheetOpen(true);
      return;
    }
    if (previewObjectUrl) {
      setShowInlinePreview(true);
      setMessageSheetOpen(false);
      return;
    }

    setIsViewingFile(true);
    setAttachmentDecryptProgress({
      phase: "decrypt",
      mode: "download",
      progress: 0,
      title: t.attachmentDecryptProgressTitle,
      detail: attachmentMetadata?.name
        ? `${formatAttachmentDisplayName(attachmentMetadata.name)} · ${formatNoteFileSize(attachmentMetadata.size ?? 0)}`
        : undefined,
      detailTitle: attachmentMetadata?.name,
      footnote: t.attachmentDecryptProgressFootnote,
    });
    try {
      const result = await decryptAttachmentPreview({ onProgress: true });
      if (!result) return;
      revokeAttachmentPreviewUrl(previewObjectUrl);
      setPreviewObjectUrl(result.url);
      setPreviewMimeType(result.mimeType);
      setPreviewBlob(result.blob);
      setShowInlinePreview(true);
      setMessageSheetOpen(false);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Attachment preview/decrypt failed:", error);
      }
      toast({
        title: t.toastPreviewFailed,
        description: t.toastPreviewFailedDesc,
        variant: "destructive",
      });
    } finally {
      setIsViewingFile(false);
      setAttachmentDecryptProgress(null);
    }
  };

  const fileAccessRemainingSeconds =
    noteData?.fileAccessTokenExpiresAtMs != null
      ? Math.max(0, Math.ceil((noteData.fileAccessTokenExpiresAtMs - fileAccessNowMs) / 1000))
      : null;
  const fileAccessExpired = fileAccessRemainingSeconds === 0;
  const viewerOpen = Boolean(
    showInlinePreview && attachmentPreviewKind && !isViewingFile && (previewObjectUrl || previewBlob),
  );

  const handleCreateNew = () => {
    window.location.href = '/';
  };

  const portalSurface = brandingUsesPortalSurface(activeRevealBranding);
  const wrapRecipient = (
    node: ReactNode,
    surface?: RecipientPortalSurface,
    branding = activeRevealBranding,
  ) => (
    <RecipientPortal
      branding={branding}
      t={t}
      language={readerLanguage}
      onLanguageChange={(next) => {
        setSenderSelectedLanguage(next);
        setLanguage(next);
      }}
      surface={surface ?? (brandingUsesPortalSurface(branding) ? "card" : "plain")}
    >
      {node}
    </RecipientPortal>
  );

  if (isLoading || recipientGateLoading || !delayedRevealChecked) {
    return wrapRecipient(
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary" />
      </div>,
      "plain",
    );
  }

  const verificationPending = recipientGateRequired && !recipientGateVerified;

  if (delayedRevealOpensAt && !hasRevealed) {
    return wrapRecipient(
      <NoteAccessProblem
        variant="not_yet_available"
        opensAt={delayedRevealOpensAt}
        verificationPending={verificationPending}
        t={t}
      />,
    );
  }

  if (error) {
    const isNotYetAvailable = error === "note_not_yet_available";
    return wrapRecipient(
      <NoteAccessProblem
        variant={isNotYetAvailable ? "not_yet_available" : "note_gone"}
        keyMismatch={keyMismatchError}
        opensAt={delayedRevealOpensAt}
        verificationPending={isNotYetAvailable && verificationPending}
        t={t}
      />,
    );
  }

  if (linkKeyMissing && !hasRevealed) {
    return wrapRecipient(<NoteAccessProblem variant="link_incomplete" t={t} />);
  }

  if (linkKeyTruncated && !hasRevealed) {
    return wrapRecipient(<NoteAccessProblem variant="key_truncated" t={t} />);
  }

  if (!hasRevealed) {
    if (recipientGateRequired && !recipientGateVerified) {
      return wrapRecipient(
        <section className={NOTE_VIEW_SHELL}>
          <section className={NOTE_VIEW_HERO_SECTION}>
              <h1 className="page-title text-gray-900 dark:text-white">
                {t.recipientGateTitle ?? "Verify before opening"}
              </h1>
              <p className={NOTE_VIEW_HERO_SUBTITLE}>
                {recipientCodeSending && !recipientCodeSent
                  ? (t.recipientGateSendingCode ?? "Sending a verification code…")
                  : recipientGateEmailHint
                    ? (t.recipientGateDescriptionEmail ??
                        "We emailed a one-time code to {email}. Enter it below to continue.")
                        .replace("{email}", recipientGateEmailHint)
                    : (t.recipientGateDescription ??
                        "Enter the verification code emailed to the recipient address to continue.")}
              </p>
              <form onSubmit={(event) => void handleRecipientGateSubmit(event)} className="mx-auto mt-8 max-w-md space-y-4 text-left sm:mt-10">
                {recipientGateCodeRequired ? (
                  <div>
                    <label htmlFor="recipient-gate-code" className="mb-1 block text-sm font-medium text-gray-800 dark:text-gray-200">
                      {t.recipientGateCode ?? "Verification code"}
                    </label>
                    <input
                      id="recipient-gate-code"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      value={recipientCodeInput}
                      onChange={(event) => setRecipientCodeInput(event.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                      required
                    />
                  </div>
                ) : null}
                {recipientGateError ? (
                  <p className="text-sm text-red-600 dark:text-red-400" role="alert">
                    {recipientGateError}
                  </p>
                ) : null}
                <button
                  type="submit"
                  disabled={recipientGateSubmitting || recipientCodeSending}
                  className="flex w-full items-center justify-center rounded-md bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {recipientGateSubmitting
                    ? (t.recipientGateSubmitting ?? "Verifying…")
                    : (t.recipientGateSubmit ?? "Continue")}
                </button>
                <button
                  type="button"
                  disabled={recipientCodeSending || recipientGateSubmitting}
                  onClick={() => void sendRecipientVerificationCode()}
                  className="flex w-full items-center justify-center rounded-md border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  {recipientCodeSending
                    ? (t.recipientGateSendingCode ?? "Sending a verification code…")
                    : recipientCodeSent
                      ? (t.recipientGateResendCode ?? "Resend code")
                      : (t.recipientGateSendCode ?? "Send code")}
                </button>
              </form>
          </section>
        </section>,
      );
    }

    return wrapRecipient(
      <RevealHero
        isRevealing={isRevealing}
        isRevealButtonReady={isRevealButtonReady}
        onReveal={handleReveal}
        branding={activeRevealBranding}
        t={t}
        compact={portalSurface}
      />,
    );
  }

  // If password protected and not yet decrypted, show password input
  if (isPasswordProtected && !noteContent) {
    return wrapRecipient(
      <section className={NOTE_VIEW_SHELL}>
        <section className={NOTE_VIEW_HERO_SECTION}>
          <div className="text-center">
            <h1 className="page-title text-gray-900 dark:text-white">{t.passwordProtectedNote}</h1>
            <p className={NOTE_VIEW_HERO_SUBTITLE}>
              {t.passwordProtectedDescription}
            </p>

            <div className="mx-auto mt-8 max-w-sm text-left sm:mt-10">
              <div className="mb-4 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordDecryptError) setPasswordDecryptError(null);
                  }}
                  placeholder={t.enterPassword}
                  aria-invalid={passwordDecryptError ? true : undefined}
                  className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-primary pr-10 ${
                    passwordDecryptError
                      ? "border-red-500 dark:border-red-500/70"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  onKeyDown={(ev) => {
                    if (ev.key === "Enter") {
                      void handlePasswordDecrypt(ev);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordDecryptError ? (
                <p className="mb-3 text-sm text-red-600 dark:text-red-400" role="alert">
                  {passwordDecryptError}
                </p>
              ) : null}
              <button
                type="button"
                onClick={(ev) => void handlePasswordDecrypt(ev)}
                disabled={isDecrypting || !password.trim()}
                className="w-full flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDecrypting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    {t.decrypting}
                  </>
                ) : (
                  <>
                    <Unlock className="h-4 w-4 mr-2" />
                    {t.decryptNote}
                  </>
                )}
              </button>
            </div>

            <p className="mt-6 text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              {t.noPasswordCannotDecrypt}
            </p>

            <div className="mt-8 sm:mt-10 max-w-2xl mx-auto text-left">
              <SecurityRecommendations type="compact" context="general" />
            </div>
          </div>
        </section>
      </section>,
    );
  }

  const openedBranding = applyOpenedNoteBranding(activeRevealBranding);
  const brandingLine = getBrandingLine(openedBranding, t);
  const accentStyle = brandingCtaStyle(openedBranding);
  const openedPortalSurface = brandingUsesPortalSurface(openedBranding);
  const noteTextBorderColor =
    brandingNoteTextBorderColor(openedBranding) ||
    brandingNoteTextBorderColor(activeRevealBranding);

  // Regular note content view (either after password decryption or for non-password notes)
  return wrapRecipient(
    <section className={`w-full mx-auto ${viewerOpen ? "max-w-6xl" : "max-w-3xl"}`}>
      <section className={openedPortalSurface ? "relative isolate pb-2 text-center" : NOTE_VIEW_HERO_SECTION}>
        {viewerOpen || openedPortalSurface || openedBranding ? null : (
          <div className="mb-8 text-center sm:mb-10">
            <h1 className="page-title text-primary">{t.privateNote}</h1>
          </div>
        )}

        {canImportNoteLabels && importedLabelsPack && noteContent ? (
          <div className="mb-5 rounded-lg border border-amber-200/80 bg-amber-50/70 px-4 py-3 text-left dark:border-amber-800/50 dark:bg-amber-950/30">
            <div className="flex items-start gap-3">
              <Tags className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-300" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="m-0 text-sm font-medium text-amber-950 dark:text-amber-50">
                  {t.noteLabelsRevealImportTitle ?? "Note labels pack"}
                </p>
                <p className="m-0 mt-1 text-xs leading-snug text-amber-900/80 dark:text-amber-100/80">
                  {labelsImported
                    ? (t.noteLabelsRevealImportDone ??
                      "Labels were saved on this device for Notification Center.")
                    : (t.noteLabelsRevealImportHint ??
                      "Load these labels onto this device so Notification Center can name your tracked notes.")}
                </p>
                {!labelsImported ? (
                  <button
                    type="button"
                    onClick={() => {
                      const result = mergeNoteLabelsIntoLocal(importedLabelsPack.labels);
                      setLabelsImported(true);
                      toast({
                        title: t.noteLabelsImportSuccessTitle ?? "Labels loaded",
                        description: (
                          t.noteLabelsImportSuccessBody ??
                          "Added {added}, updated {updated}. Existing labels were kept."
                        )
                          .replace("{added}", String(result.added))
                          .replace("{updated}", String(result.updated)),
                      });
                    }}
                    className="mt-3 inline-flex items-center justify-center rounded-md bg-amber-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 dark:bg-amber-600 dark:hover:bg-amber-500"
                  >
                    {t.noteLabelsRevealImportButton ?? "Load labels on this device"}
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        {viewerOpen && !messageSheetOpen ? (
          <>
            {openedBranding ? (
              <div
                className={`mb-4 overflow-hidden rounded-2xl border bg-[rgb(252,251,248)] px-5 py-5 dark:bg-gray-900 sm:px-7 ${
                  openedPortalSurface
                    ? "border-gray-200/70 dark:border-gray-700/80"
                    : "border-gray-200/90 dark:border-gray-700"
                }`}
                style={
                  openedBranding.accentColor
                    ? { borderTopColor: openedBranding.accentColor, borderTopWidth: 3 }
                    : undefined
                }
              >
                <BrandingIdentity
                  branding={openedBranding}
                  brandingLine={brandingLine}
                  inCard
                />
              </div>
            ) : null}
            <button
              type="button"
              onClick={() => setMessageSheetOpen(true)}
              className={`flex w-full items-center gap-3 rounded-2xl border bg-[rgb(252,251,248)] px-5 py-3 text-left dark:bg-gray-900 ${
                openedPortalSurface
                  ? "border-gray-200/70 dark:border-gray-700/80"
                  : "border-gray-200/90 dark:border-gray-700"
              }`}
              aria-expanded={false}
            >
              <Lock className="h-3.5 w-3.5 shrink-0 text-gray-400" aria-hidden />
              <span className="min-w-0 flex-1 truncate text-sm text-gray-600 dark:text-gray-300">
                {noteContent.trim().split(/\n/)[0] || (t.revealNoteSheetLabel ?? "Note content")}
              </span>
              <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium uppercase tracking-[0.14em] text-gray-400">
                {t.secureViewerShowMessage ?? "Message"}
                <ChevronDown className="h-3.5 w-3.5" aria-hidden />
              </span>
            </button>
          </>
        ) : (
        <article
          className={`overflow-hidden rounded-2xl border bg-[rgb(252,251,248)] dark:bg-gray-900 ${
            openedPortalSurface
              ? "border-gray-200/70 shadow-none dark:border-gray-700/80"
              : "border-gray-200/90 shadow-[0_20px_50px_-28px_rgba(15,23,42,0.45)] dark:border-gray-700 dark:shadow-black/40"
          }`}
          style={
            (openedBranding?.accentColor || activeRevealBranding?.accentColor)
              ? {
                  borderTopColor: openedBranding?.accentColor || activeRevealBranding?.accentColor,
                  borderTopWidth: 3,
                }
              : undefined
          }
          aria-label={t.revealNoteSheetLabel ?? "Note content"}
        >
          {openedBranding ? (
            <header className="border-b border-black/[0.06] px-5 py-5 sm:px-7 dark:border-white/10">
              <BrandingIdentity
                branding={openedBranding}
                brandingLine={brandingLine}
                inCard
              />
              {viewerOpen ? (
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setMessageSheetOpen(false)}
                    className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.14em] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    aria-expanded={true}
                  >
                    {t.secureViewerHideMessage ?? "Hide"}
                    <ChevronUp className="h-3.5 w-3.5" aria-hidden />
                  </button>
                </div>
              ) : null}
            </header>
          ) : (
            <header className="flex items-center justify-between gap-3 border-b border-black/[0.06] px-5 py-3 sm:px-7 dark:border-white/10">
              <p className="m-0 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
                <Lock className="h-3.5 w-3.5" aria-hidden />
                {t.privateNote}
              </p>
              {viewerOpen ? (
                <button
                  type="button"
                  onClick={() => setMessageSheetOpen(false)}
                  className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.14em] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  aria-expanded={true}
                >
                  {t.secureViewerHideMessage ?? "Hide"}
                  <ChevronUp className="h-3.5 w-3.5" aria-hidden />
                </button>
              ) : (
                <p className="m-0 text-[11px] leading-snug text-gray-400 dark:text-gray-500">
                  {t.revealTrustSelfDestructs ?? "Self-destructs after opening"}
                </p>
              )}
            </header>
          )}
          <div className="px-4 py-4 sm:px-6 sm:py-5">
            <div
              className="overflow-hidden rounded-xl bg-white text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] dark:bg-[#0f141c]"
              style={{
                borderWidth: 2,
                borderStyle: "solid",
                borderColor: noteTextBorderColor || "rgba(15, 23, 42, 0.08)",
              }}
            >
              <div className="min-h-[7.5rem] px-6 py-6 sm:min-h-[8.5rem] sm:px-8 sm:py-7">
                <span
                  className={`note-read-content block whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-[1.08rem] sm:text-[1.2rem] leading-[1.7] text-gray-900 dark:text-gray-100 select-text ${revealBodyFontClassName(bodyFont)}`}
                >
                  {noteContent.trimEnd()}
                </span>
              </div>
            </div>
          </div>

          {noteData?.attachment && !viewerOpen ? (
            <div className="flex flex-col gap-3 border-t border-black/[0.06] px-5 py-4 sm:px-7 dark:border-white/10">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                    {attachmentPreviewKind === "image" && previewObjectUrl ? (
                      <button
                        type="button"
                        onClick={() => {
                          setShowInlinePreview(true);
                          setMessageSheetOpen(false);
                        }}
                        className="flex h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-primary/20 bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:border-primary/30 dark:bg-gray-900 dark:focus-visible:ring-offset-gray-900"
                        title={t.secureViewerOpen ?? "Open viewer"}
                      >
                        <img
                          src={previewObjectUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary dark:bg-primary/15">
                        {isLoadingThumbnail &&
                        (attachmentPreviewKind === "image" || attachmentPreviewKind === "audio") ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary/20 border-t-primary" aria-hidden />
                        ) : attachmentPreviewKind === "pdf" ? (
                          <FileText className="h-5 w-5" aria-hidden />
                        ) : attachmentPreviewKind === "audio" ? (
                          <Mic className="h-5 w-5" aria-hidden />
                        ) : attachmentPreviewKind === "video" ? (
                          <Video className="h-5 w-5" aria-hidden />
                        ) : attachmentPreviewKind === "image" ? (
                          <ImageIcon className="h-5 w-5" aria-hidden />
                        ) : (
                          <Paperclip className="h-5 w-5" aria-hidden />
                        )}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {attachmentMetadata?.name ||
                          (attachmentPreviewKind === "audio"
                            ? (t.voiceMessageAttachment ?? "Voice message")
                            : "Encrypted attachment")}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {attachmentMetadata?.size != null
                          ? formatNoteFileSize(attachmentMetadata.size)
                          : "Encrypted file"}
                        {fileAccessRemainingSeconds != null && !fileAccessExpired
                          ? ` · ${t.secureViewerAccessExpires ?? "Access expires in {time}"}`.replace(
                              "{time}",
                              formatFileAccessRemaining(fileAccessRemainingSeconds),
                            )
                          : null}
                        {fileAccessExpired ? ` · ${t.secureViewerAccessExpired ?? "Access expired"}` : null}
                      </p>
                      {attachmentViewOnly ? (
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {t.secureViewerViewOnlyPolicy ?? "Downloading has been disabled by the sender."}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:shrink-0">
                    {attachmentPreviewKind ? (
                      <button
                        type="button"
                        onClick={() => void handlePreviewAttachment()}
                        disabled={
                          isViewingFile
                          || isDownloadingFile
                          || (isLoadingThumbnail && !previewObjectUrl && !previewBlob)
                          || !contentKey
                          || fileAccessExpired
                        }
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-primary/30 bg-white px-3 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50 dark:border-primary/35 dark:bg-gray-900 dark:hover:bg-primary/10 sm:flex-none"
                      >
                        <Eye className="h-3.5 w-3.5" aria-hidden />
                        {isViewingFile || (isLoadingThumbnail && !previewObjectUrl && !previewBlob)
                          ? "Decrypting…"
                          : attachmentPreviewKind === "pdf"
                            ? (t.secureViewerViewPdf ?? "View PDF")
                            : (t.secureViewerOpen ?? "View")}
                      </button>
                    ) : null}
                    {attachmentViewOnly ? null : attachmentPreviewKind === "audio" && canChooseVoiceDownloadFormat ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            disabled={isDownloadingFile || isViewingFile || !contentKey || fileAccessExpired}
                            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
                          >
                            <Download className="h-3.5 w-3.5" aria-hidden />
                            {isDownloadingFile
                              ? (t.voiceMessageDecoding ?? "Decoding…")
                              : (t.voiceMessageDownloadFormat ?? "Download")}
                            <ChevronDown className="h-3.5 w-3.5 opacity-90" aria-hidden />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="min-w-[12rem]">
                          <DropdownMenuItem
                            onSelect={() => void handleDownloadAttachment("original")}
                          >
                            {t.voiceMessageDownloadOriginal ?? "Original file"}
                          </DropdownMenuItem>
                          {isVoiceDownloadConversionAvailable("wav") ? (
                            <DropdownMenuItem
                              onSelect={() => void handleDownloadAttachment("wav")}
                            >
                              {t.voiceMessageDownloadWav ?? "WAV (decoded)"}
                            </DropdownMenuItem>
                          ) : null}
                          {isVoiceDownloadConversionAvailable("m4a") ? (
                            <DropdownMenuItem
                              onSelect={() => void handleDownloadAttachment("m4a")}
                            >
                              {t.voiceMessageDownloadM4a ?? "M4A (decoded)"}
                            </DropdownMenuItem>
                          ) : null}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <button
                        type="button"
                        onClick={() => void handleDownloadAttachment("original")}
                        disabled={isDownloadingFile || isViewingFile || !contentKey || fileAccessExpired}
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
                      >
                        <Download className="h-3.5 w-3.5" aria-hidden />
                        {isDownloadingFile ? "Decrypting…" : "Download"}
                      </button>
                    )}
                  </div>
              </div>
                {fileAccessExpired ? (
                  <p className="w-full text-xs font-medium text-red-600 dark:text-red-400" role="alert">
                    Attachment access expired. Reveal again if the note is still available.
                  </p>
                ) : null}
                {isViewingFile ? (
                  <p className="flex w-full items-center gap-2 text-sm text-gray-600 dark:text-gray-400" aria-live="polite">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary/20 border-t-primary" aria-hidden />
                    {attachmentPreviewKind === "pdf"
                      ? (t.secureViewerDecryptingPdf ?? "Decrypting PDF… larger files may take a moment.")
                      : attachmentPreviewKind === "audio"
                        ? (t.voiceMessageDecrypting ?? "Decrypting voice message…")
                        : (t.secureViewerDecrypting ?? "Decrypting file…")}
                  </p>
                ) : null}
            </div>
          ) : null}

          <div className="border-t border-black/[0.06] px-5 py-5 sm:px-7 dark:border-white/10">
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <button
                type="button"
                onClick={() => void handleCopy()}
                style={accentStyle}
                className={`inline-flex min-w-[170px] items-center justify-center rounded-md px-5 py-2.5 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                  accentStyle
                    ? "focus-visible:ring-gray-400"
                    : "bg-primary text-white hover:bg-primary/90 focus-visible:ring-primary"
                }`}
              >
                <Copy className="mr-2 h-4 w-4" />
                {t.copyNote}
              </button>
              <button
                type="button"
                onClick={handleCreateNew}
                className="inline-flex min-w-[170px] items-center justify-center rounded-md border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                {t.createNewNote}
              </button>
            </div>
            <div className="mt-4 flex flex-col items-center gap-2 text-center">
              <p className="m-0 inline-flex max-w-lg items-center gap-1.5 rounded-full border border-amber-200/80 bg-amber-50/90 px-3 py-1 text-xs font-medium leading-snug text-amber-900 dark:border-amber-800/50 dark:bg-amber-950/35 dark:text-amber-100">
                <span aria-hidden>⚠️</span>
                {t.noteDeletedWarning}
              </p>
              <p className="m-0 min-h-[1.25rem] text-sm text-emerald-600 dark:text-emerald-400">
                {copied ? `✔ ${t.copiedToClipboard}` : ""}
              </p>
              <p className="m-0 text-xs text-gray-500 dark:text-gray-400">
                {t.saveNoteSecurely}
              </p>
            </div>
          </div>
        </article>
        )}

          {viewerOpen && attachmentPreviewKind ? (
            <div className="mt-4">
                <SecureAttachmentViewer
                  kind={attachmentPreviewKind}
                  fileName={
                    attachmentMetadata?.name ||
                    (attachmentPreviewKind === "audio"
                      ? (t.voiceMessageAttachment ?? "Voice message")
                      : "Encrypted attachment")
                  }
                  objectUrl={previewObjectUrl}
                  blob={previewBlob}
                  mimeType={previewMimeType ?? attachmentMetadata?.type ?? null}
                  allowDownload={!attachmentViewOnly}
                  accessRemainingLabel={
                    fileAccessRemainingSeconds != null && !fileAccessExpired
                      ? formatFileAccessRemaining(fileAccessRemainingSeconds)
                      : null
                  }
                  accessExpired={fileAccessExpired}
                  isDownloading={isDownloadingFile}
                  audioPlaybackUnsupported={audioPlaybackUnsupported}
                  onDownload={() => void handleDownloadAttachment("original")}
                  onClose={() => {
                    setShowInlinePreview(false);
                    setMessageSheetOpen(true);
                  }}
                  t={t}
                />
            </div>
          ) : null}

        {viewerOpen && !messageSheetOpen ? (
          <div
            className={`mt-4 overflow-hidden rounded-2xl border bg-[rgb(252,251,248)] px-5 py-5 dark:bg-gray-900 sm:px-7 ${
              openedPortalSurface
                ? "border-gray-200/70 dark:border-gray-700/80"
                : "border-gray-200/90 dark:border-gray-700"
            }`}
          >
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <button
                type="button"
                onClick={() => void handleCopy()}
                style={accentStyle}
                className={`inline-flex min-w-[170px] items-center justify-center rounded-md px-5 py-2.5 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                  accentStyle
                    ? "focus-visible:ring-gray-400"
                    : "bg-primary text-white hover:bg-primary/90 focus-visible:ring-primary"
                }`}
              >
                <Copy className="mr-2 h-4 w-4" />
                {t.copyNote}
              </button>
              <button
                type="button"
                onClick={handleCreateNew}
                className="inline-flex min-w-[170px] items-center justify-center rounded-md border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                {t.createNewNote}
              </button>
            </div>
            <div className="mt-4 flex flex-col items-center gap-2 text-center">
              <p className="m-0 inline-flex max-w-lg items-center gap-1.5 rounded-full border border-amber-200/80 bg-amber-50/90 px-3 py-1 text-xs font-medium leading-snug text-amber-900 dark:border-amber-800/50 dark:bg-amber-950/35 dark:text-amber-100">
                <span aria-hidden>⚠️</span>
                {t.noteDeletedWarning}
              </p>
              <p className="m-0 text-xs text-gray-500 dark:text-gray-400">
                {t.saveNoteSecurely}
              </p>
            </div>
          </div>
        ) : null}

        {receiptAckRequired && noteContent ? (
          <div className="mt-6 rounded-lg border border-teal-200/80 bg-teal-50/70 px-4 py-3 text-left dark:border-teal-800/50 dark:bg-teal-950/30 sm:mt-7">
            <div className="flex items-start gap-3">
              <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-teal-700 dark:text-teal-300" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="m-0 text-sm font-medium text-teal-950 dark:text-teal-50">
                  {t.revealReceiptRequestedTitle ?? "Receipt confirmation requested"}
                </p>
                <p className="m-0 mt-1 text-xs leading-snug text-teal-900/80 dark:text-teal-100/80">
                  {receiptAckAcknowledged
                    ? (receiptAckMessage ??
                      t.revealReceiptAlreadyConfirmed ??
                      "Already confirmed")
                    : (t.revealReceiptRequestedHint ??
                      "Optional — confirm only after you’ve decrypted the note. You can leave without confirming.")}
                </p>
                {receiptAckStatement && !receiptAckAcknowledged ? (
                  <blockquote className="m-0 mt-3 rounded-md border-l-2 border-teal-500 bg-white/60 px-3 py-2 text-sm font-medium text-teal-950 dark:bg-black/15 dark:text-teal-50">
                    “{receiptAckStatement}”
                  </blockquote>
                ) : null}
                {!receiptAckAcknowledged ? (
                  <button
                    type="button"
                    onClick={(ev) => void handleConfirmReceipt(ev)}
                    disabled={receiptAckSubmitting || !receiptAckTokenHex}
                    className="mt-3 inline-flex items-center justify-center rounded-md bg-teal-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-teal-600 dark:hover:bg-teal-500"
                  >
                    {receiptAckSubmitting
                      ? (t.revealReceiptConfirming ?? "Confirming…")
                      : receiptAckStatement
                        ? (t.revealReceiptConfirmStatementButton ?? "I confirm")
                        : (t.revealReceiptConfirmButton ?? "Confirm receipt")}
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </section>
      <AttachmentProgressDialog progress={attachmentDecryptProgress} />
    </section>,
    openedPortalSurface && !viewerOpen ? "wide" : "plain",
    openedBranding,
  );
};
