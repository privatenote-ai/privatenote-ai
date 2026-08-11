import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Copy,
  RefreshCw,
  Unlock,
  Eye,
  EyeOff,
  ShieldCheck,
  Trash2,
  UserX,
  Download,
  Paperclip,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Mic,
  BadgeCheck,
  Tags,
  ChevronDown,
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
  isVoiceMessageAttachment,
} from '@/utils/voiceMessageRecording';
import {
  convertVoiceAttachmentForDownload,
  isVoiceDownloadConversionAvailable,
  type VoiceDownloadFormat,
} from '@/utils/voiceMessageDownloadFormat';
import { useToast } from '@/hooks/use-toast';
import { SecurityRecommendations } from '@/components/features/SecurityRecommendations';
import { useLanguage } from '@/context/LanguageContext';
import {
  getTranslations,
  LANGUAGE_OPTIONS,
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
  sharerName?: string;
  companyName?: string;
  accentColor?: string;
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

type AttachmentPreviewKind = "image" | "pdf" | "audio";

const IMAGE_FILE_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "bmp",
  "svg",
  "heic",
  "heif",
]);

function getFileExtension(fileName: string | undefined): string | null {
  if (!fileName) return null;
  const dot = fileName.lastIndexOf(".");
  if (dot < 0 || dot === fileName.length - 1) return null;
  return fileName.slice(dot + 1).toLowerCase();
}

function getAttachmentPreviewKind(
  mimeType: string | undefined,
  fileName?: string,
): AttachmentPreviewKind | null {
  const normalizedMime = mimeType?.trim().toLowerCase();
  if (normalizedMime?.startsWith("image/")) return "image";
  if (normalizedMime === "application/pdf" || normalizedMime === "application/x-pdf") return "pdf";
  if (isVoiceMessageAttachment(mimeType, fileName)) return "audio";

  const ext = getFileExtension(fileName);
  if (ext && IMAGE_FILE_EXTENSIONS.has(ext)) return "image";
  if (ext === "pdf") return "pdf";
  return null;
}

function isGenericAttachmentMimeType(mimeType: string | undefined): boolean {
  const normalized = mimeType?.trim().toLowerCase();
  return !normalized || normalized === "application/octet-stream" || normalized === "binary/octet-stream";
}

function getAttachmentBlobMimeType(
  mimeType: string | undefined,
  previewKind: AttachmentPreviewKind,
  fileName?: string,
): string {
  const normalizedMime = mimeType?.trim();
  if (normalizedMime && !isGenericAttachmentMimeType(mimeType)) return normalizedMime;
  if (previewKind === "pdf") return "application/pdf";

  const ext = getFileExtension(fileName);
  if (previewKind === "audio") {
    if (ext === "m4a" || ext === "mp4") return "audio/mp4";
    if (ext === "ogg" || ext === "oga") return "audio/ogg";
    if (ext === "mp3") return "audio/mpeg";
    if (ext === "wav") return "audio/wav";
    if (ext === "aac") return "audio/aac";
    return "audio/webm";
  }
  if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
  if (ext === "png") return "image/png";
  if (ext === "gif") return "image/gif";
  if (ext === "webp") return "image/webp";
  if (ext === "heic") return "image/heic";
  if (ext === "heif") return "image/heif";
  if (ext === "bmp") return "image/bmp";
  if (ext === "svg") return "image/svg+xml";
  return previewKind === "image" ? "image/jpeg" : "application/octet-stream";
}

/** WebKit (Safari, iOS browsers) does not render blob: PDFs inside iframes — use a data URL instead. */
function prefersPdfDataUrlPreview(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const isWebKit = /AppleWebKit/i.test(ua);
  const isChromium = /Chrome|Chromium|Edg|OPR/i.test(ua);
  return isWebKit && !isChromium;
}

function revokeAttachmentPreviewUrl(url: string | null): void {
  if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
}

async function createAttachmentPreviewUrl(blob: Blob, previewKind: AttachmentPreviewKind): Promise<string> {
  if (previewKind === "pdf" && prefersPdfDataUrlPreview()) {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error ?? new Error("Failed to read PDF for preview"));
      reader.readAsDataURL(blob);
    });
  }
  return URL.createObjectURL(blob);
}

interface RevealHeroProps {
  noteId: string;
  isRevealing: boolean;
  isRevealButtonReady: boolean;
  onReveal: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  branding?: RevealBranding;
  readerLanguageLabel: string;
  t: Translations;
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

const TrustSignals: React.FC<{ t: Translations }> = ({ t }) => (
  <ul className="mt-40 sm:mt-44 flex flex-col items-center gap-2.5 lg:flex-row lg:justify-center lg:gap-6 text-xs sm:text-sm text-gray-600/75 dark:text-gray-300/72">
    <li className="inline-flex items-center gap-1.5">
      <ShieldCheck className="h-4 w-4 text-primary/70" aria-hidden />
      <span>{t.revealTrustEncrypted ?? "End-to-end encrypted"}</span>
    </li>
    <li className="inline-flex items-center gap-1.5">
      <Trash2 className="h-4 w-4 text-primary/70" aria-hidden />
      <span>{t.revealTrustSelfDestructs ?? "Self-destructs after opening"}</span>
    </li>
    <li className="inline-flex items-center gap-1.5">
      <UserX className="h-4 w-4 text-primary/70" aria-hidden />
      <span>{t.revealTrustNoAccount ?? "No account required"}</span>
    </li>
  </ul>
);

const getBrandingLine = (branding: RevealBranding | undefined, t: Translations): string | null => {
  if (!branding) return null;
  const sharer = branding.sharerName?.trim();
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

const RevealHero: React.FC<RevealHeroProps> = ({
  noteId,
  isRevealing,
  isRevealButtonReady,
  onReveal,
  branding,
  readerLanguageLabel,
  t,
}) => {
  const brandingLine = getBrandingLine(branding, t);
  const hasBranding = Boolean(brandingLine || branding?.logoUrl);
  const buttonStyle = branding?.accentColor ? { backgroundColor: branding.accentColor } : undefined;

  return (
    <section className={NOTE_VIEW_SHELL}>
      <section className={NOTE_VIEW_HERO_SECTION}>
        <div className="text-center">
          {hasBranding && (
            <div className="mb-5 flex flex-col items-center gap-2">
              {branding?.logoUrl && (
                <img
                  src={branding.logoUrl}
                  alt=""
                  className="max-h-12 w-auto object-contain"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              )}
              {brandingLine && (
                <p className="text-sm text-gray-500 dark:text-gray-400 m-0">{brandingLine}</p>
              )}
            </div>
          )}

          <h1 className="page-title text-gray-900 dark:text-white">
            {t.revealTitlePrefix ?? "Reveal"} <span className="text-primary">{t.privateNote ?? "Private Note"}</span>
          </h1>
          <div className="mt-3 text-xs leading-relaxed text-gray-500/85 dark:text-gray-400/85">
            <p className="m-0 font-medium">{(t.revealPrivateNoteId ?? "Private note #{id}").replace("{id}", noteId)}</p>
            <p className="m-0">{(t.revealLanguageLine ?? "Language: {language}").replace("{language}", readerLanguageLabel)}</p>
          </div>
          <p className={NOTE_VIEW_HERO_SUBTITLE}>
            {t.revealPrivacyDescription ?? "For your privacy, this note is deleted after it's opened."}
          </p>

          <div className="mt-24 sm:mt-28 w-full flex justify-center">
            <button
              type="button"
              onClick={(ev) => void onReveal(ev)}
              disabled={isRevealing || !isRevealButtonReady}
              style={buttonStyle}
              className="w-full max-w-sm inline-flex items-center justify-center px-5 py-3 text-base font-semibold bg-primary text-white rounded-md transition-all duration-200 hover:bg-primary/90 hover:scale-[1.015] hover:shadow-[0_0_18px_rgba(59,130,246,0.22)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRevealing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2" />
                  {t.revealing ?? "Revealing..."}
                </>
              ) : (
                <>
                  <Unlock className="h-4 w-4 mr-2" />
                  {t.revealNote ?? "Reveal Note"}
                </>
              )}
            </button>
          </div>

          <p className="mt-4 sm:mt-5 text-sm text-gray-600/62 dark:text-gray-300/58">
            {t.revealReadyWarning ?? "Open only when you're ready — this cannot be undone."}
          </p>

          <TrustSignals t={t} />
        </div>
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
  const { language } = useLanguage();
  const [senderSelectedLanguage, setSenderSelectedLanguage] = useState<SupportedLanguage | null>(null);
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
  const [previewMimeType, setPreviewMimeType] = useState<string | null>(null);
  const [showInlinePreview, setShowInlinePreview] = useState(false);
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
  const readerLanguageLabel =
    LANGUAGE_OPTIONS.find((option) => option.code === readerLanguage)?.nativeName ?? "English";

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
      setDelayedRevealOpensAt(null);
      setDelayedRevealChecked(true);
      return;
    }
    let cancelled = false;
    setDelayedRevealChecked(false);
    void apiRequest<{ readerLanguage?: string }>(`/api/notes/${id}`, "GET")
      .then((meta) => {
        if (cancelled) return;
        setDelayedRevealOpensAt(null);
        setSenderSelectedLanguage(
          typeof meta.readerLanguage === "string"
            ? normalizeLanguageCode(meta.readerLanguage)
            : null,
        );
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
  }, [id]);

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
      const next = Math.max(1, Math.min(100, Math.round(resolvedRatio * 100)));
      const fullName = attachmentMetadata?.name || "file";
      const name = formatAttachmentDisplayName(fullName);
      setAttachmentDecryptProgress((prev) => ({
        phase: "decrypt",
        mode: "download",
        // Never jump backwards while decrypt frames paint.
        progress: Math.max(prev?.phase === "decrypt" ? prev.progress : 0, next),
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
  }): Promise<{ url: string; mimeType: string } | null> => {
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
    const url = await createAttachmentPreviewUrl(blob, attachmentPreviewKind);
    return { url, mimeType };
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
    setPreviewMimeType(null);
    setShowInlinePreview(false);
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
        if (attachmentPreviewKind === "audio") {
          setShowInlinePreview(true);
          setAudioPlaybackUnsupported(
            !canBrowserPlayVoiceAttachment(result.mimeType, attachmentMetadata?.name),
          );
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
      const receiptAck = data.receiptAck as
        | { required?: boolean; acknowledged?: boolean; acknowledgedAt?: string | null }
        | undefined;
      const ackRequired = receiptAck?.required === true;
      const ackAlready = receiptAck?.acknowledged === true;
      setReceiptAckRequired(ackRequired);
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
      return;
    }
    if (previewObjectUrl) {
      setShowInlinePreview(true);
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
      setShowInlinePreview(true);
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

  const handleCreateNew = () => {
    window.location.href = '/';
  };

  if (isLoading || recipientGateLoading || !delayedRevealChecked) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const verificationPending = recipientGateRequired && !recipientGateVerified;

  if (delayedRevealOpensAt && !hasRevealed) {
    return (
      <NoteAccessProblem
        variant="not_yet_available"
        opensAt={delayedRevealOpensAt}
        verificationPending={verificationPending}
        t={t}
      />
    );
  }

  if (error) {
    const isNotYetAvailable = error === "note_not_yet_available";
    return (
      <NoteAccessProblem
        variant={isNotYetAvailable ? "not_yet_available" : "note_gone"}
        keyMismatch={keyMismatchError}
        opensAt={delayedRevealOpensAt}
        verificationPending={isNotYetAvailable && verificationPending}
        t={t}
      />
    );
  }

  if (linkKeyMissing && !hasRevealed) {
    return <NoteAccessProblem variant="link_incomplete" t={t} />;
  }

  if (linkKeyTruncated && !hasRevealed) {
    return <NoteAccessProblem variant="key_truncated" t={t} />;
  }

  if (!hasRevealed) {
    if (recipientGateRequired && !recipientGateVerified) {
      return (
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
        </section>
      );
    }

    return (
      <RevealHero
        noteId={id}
        isRevealing={isRevealing}
        isRevealButtonReady={isRevealButtonReady}
        onReveal={handleReveal}
        branding={revealBranding}
        readerLanguageLabel={readerLanguageLabel}
        t={t}
      />
    );
  }

  // If password protected and not yet decrypted, show password input
  if (isPasswordProtected && !noteContent) {
    return (
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
      </section>
    );
  }

  const brandingLine = getBrandingLine(revealBranding, t);
  const hasBranding = Boolean(brandingLine || revealBranding?.logoUrl);
  const accentStyle = revealBranding?.accentColor ? { backgroundColor: revealBranding.accentColor } : undefined;

  // Regular note content view (either after password decryption or for non-password notes)
  return (
    <section className={`${NOTE_VIEW_SHELL} max-w-3xl`}>
      <section className={NOTE_VIEW_HERO_SECTION}>
        {hasBranding && (
          <div className="mb-5 flex flex-col items-center gap-2 text-center">
            {revealBranding?.logoUrl && (
              <img
                src={revealBranding.logoUrl}
                alt=""
                className="max-h-10 w-auto object-contain"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            )}
            {brandingLine && (
              <p className="text-sm text-gray-500 dark:text-gray-400 m-0">{brandingLine}</p>
            )}
          </div>
        )}

        <div className="mb-8 text-center sm:mb-10">
          <h1 className="page-title text-primary">{t.privateNote}</h1>
          <p className="m-0 mt-4 inline-flex max-w-lg items-center gap-1.5 rounded-full border border-amber-200/80 bg-amber-50/90 px-3 py-1 text-xs font-medium leading-snug text-amber-900 dark:border-amber-800/50 dark:bg-amber-950/35 dark:text-amber-100">
            <span aria-hidden>⚠️</span>
            {t.noteDeletedWarning}
          </p>
        </div>

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

        <article
          className="overflow-hidden rounded-xl border border-gray-200/90 bg-white shadow-md dark:border-gray-700 dark:bg-gray-900"
          aria-label="Note content"
        >
          <div className="px-5 py-6 sm:px-7 sm:py-7">
            <span className="note-read-content whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-[1.05rem] sm:text-lg leading-relaxed text-gray-900 dark:text-gray-100 font-sans select-text">
              {noteContent.trimEnd()}
            </span>
          </div>

          {noteData?.attachment ? (
            <div className="border-t border-gray-100 px-4 py-4 sm:px-5 dark:border-gray-800">
              <div className="rounded-lg border border-gray-200/80 bg-gray-50/80 px-3 py-3 dark:border-gray-700 dark:bg-gray-800/50">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    {attachmentPreviewKind === "image" && previewObjectUrl ? (
                      <button
                        type="button"
                        onClick={() => setShowInlinePreview((open) => !open)}
                        className="flex h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-primary/20 bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:border-primary/30 dark:bg-gray-900 dark:focus-visible:ring-offset-gray-900"
                        title={showInlinePreview ? "Hide preview" : "Show preview"}
                      >
                        <img
                          src={previewObjectUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-primary/15 bg-primary/8 text-primary dark:border-primary/25 dark:bg-primary/15">
                        {isLoadingThumbnail &&
                        (attachmentPreviewKind === "image" || attachmentPreviewKind === "audio") ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary/20 border-t-primary" aria-hidden />
                        ) : attachmentPreviewKind === "pdf" ? (
                          <FileText className="h-5 w-5" aria-hidden />
                        ) : attachmentPreviewKind === "audio" ? (
                          <Mic className="h-5 w-5" aria-hidden />
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
                          ? ` · Access expires in ${formatFileAccessRemaining(fileAccessRemainingSeconds)}`
                          : null}
                        {fileAccessExpired ? " · Access expired" : null}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:shrink-0">
                    {attachmentPreviewKind && attachmentPreviewKind !== "audio" && (
                      <button
                        type="button"
                        onClick={() => void handlePreviewAttachment()}
                        disabled={
                          isViewingFile
                          || isDownloadingFile
                          || (isLoadingThumbnail && !previewObjectUrl)
                          || !contentKey
                          || fileAccessExpired
                        }
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-primary/30 bg-white px-3 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50 dark:border-primary/35 dark:bg-gray-900 dark:hover:bg-primary/10 sm:flex-none"
                      >
                        <Eye className="h-3.5 w-3.5" aria-hidden />
                        {isViewingFile || (isLoadingThumbnail && !previewObjectUrl)
                          ? "Decrypting…"
                          : showInlinePreview
                            ? "Hide"
                            : attachmentPreviewKind === "pdf"
                              ? "View PDF"
                              : "View"}
                      </button>
                    )}
                    {attachmentPreviewKind === "audio" && canChooseVoiceDownloadFormat ? (
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
                  <p className="mt-2 text-xs font-medium text-red-600 dark:text-red-400" role="alert">
                    Attachment access expired. Reveal again if the note is still available.
                  </p>
                ) : null}

                {isViewingFile ? (
                  <div
                    className="mt-3 flex min-h-[12rem] flex-col items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-8 dark:border-gray-600 dark:bg-gray-900/60 sm:min-h-[16rem]"
                    aria-live="polite"
                  >
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary" aria-hidden />
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                      {attachmentPreviewKind === "pdf"
                        ? "Decrypting PDF… larger files may take a moment."
                        : attachmentPreviewKind === "audio"
                          ? (t.voiceMessageDecrypting ?? "Decrypting voice message…")
                          : "Decrypting file…"}
                    </p>
                  </div>
                ) : null}

                {attachmentPreviewKind === "audio" &&
                (isLoadingThumbnail || showInlinePreview) &&
                !isViewingFile ? (
                  <div className="mt-3 rounded-lg border border-gray-200 bg-white px-3 py-3 dark:border-gray-600 dark:bg-gray-900/60">
                    {previewObjectUrl && !audioPlaybackUnsupported ? (
                      <audio
                        controls
                        controlsList="nodownload"
                        src={previewObjectUrl}
                        className="w-full"
                        preload="metadata"
                        onError={() => setAudioPlaybackUnsupported(true)}
                      >
                        {t.recordMessagePreviewUnsupported ??
                          "Your browser cannot play this voice message."}
                      </audio>
                    ) : previewObjectUrl && audioPlaybackUnsupported ? (
                      <div className="space-y-3">
                        <p className="text-sm text-gray-700 dark:text-gray-300" role="status">
                          {t.voiceMessagePlaybackUnsupported ??
                            "This browser can’t play this voice message inline. Download it to listen."}
                        </p>
                        <button
                          type="button"
                          onClick={() => void handleDownloadAttachment("original")}
                          disabled={isDownloadingFile || !contentKey || fileAccessExpired}
                          className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                        >
                          <Download className="h-3.5 w-3.5" aria-hidden />
                          {isDownloadingFile
                            ? "Decrypting…"
                            : (t.voiceMessageDownloadToPlay ?? "Download to play")}
                        </button>
                        {canChooseVoiceDownloadFormat && isVoiceDownloadConversionAvailable("wav") ? (
                          <button
                            type="button"
                            onClick={() => void handleDownloadAttachment("wav")}
                            disabled={isDownloadingFile || !contentKey || fileAccessExpired}
                            className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-primary/30 bg-white px-3 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50 dark:border-primary/35 dark:bg-gray-900 dark:hover:bg-primary/10 sm:w-auto"
                          >
                            {t.voiceMessageDownloadWav ?? "Download as WAV (decoded)"}
                          </button>
                        ) : null}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary/20 border-t-primary" aria-hidden />
                        {t.voiceMessageDecrypting ?? "Decrypting voice message…"}
                      </div>
                    )}
                  </div>
                ) : null}

                {showInlinePreview &&
                previewObjectUrl &&
                !isViewingFile &&
                attachmentPreviewKind !== "audio" ? (
                  <div className="mt-3 overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-900/60">
                    <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-3 py-2 dark:border-gray-600">
                      <p className="min-w-0 truncate text-xs font-medium text-gray-600 dark:text-gray-300">
                        Preview
                      </p>
                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          type="button"
                          onClick={() => window.open(previewObjectUrl, "_blank", "noopener,noreferrer")}
                          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 focus:outline-none"
                        >
                          <ExternalLink className="h-3 w-3" aria-hidden />
                          New tab
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowInlinePreview(false)}
                          className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-center p-3 sm:p-4">
                      {getAttachmentPreviewKind(previewMimeType ?? attachmentMetadata?.type, attachmentMetadata?.name) === "image" ? (
                        <img
                          src={previewObjectUrl}
                          alt={attachmentMetadata?.name || "Attachment preview"}
                          className="mx-auto block max-h-[min(60vh,640px)] max-w-full object-contain"
                        />
                      ) : (
                        <iframe
                          src={previewObjectUrl}
                          title={attachmentMetadata?.name || "PDF preview"}
                          className="h-[min(60vh,640px)] w-full bg-white dark:bg-gray-950"
                        />
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </article>

        <div className="mt-6 sm:mt-7 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => void handleCopy()}
            style={accentStyle}
            className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold bg-primary text-white rounded-md transition-colors hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 min-w-[170px]"
          >
            <Copy className="h-4 w-4 mr-2" />
            {t.copyNote}
          </button>
          <button
            type="button"
            onClick={handleCreateNew}
            className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium border border-primary/25 text-primary/80 rounded-md transition-colors hover:bg-primary/6 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 min-w-[170px]"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {t.createNewNote}
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-emerald-600 dark:text-emerald-400 min-h-[1.25rem]">
            {copied ? `✔ ${t.copiedToClipboard}` : ""}
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {t.saveNoteSecurely}
          </p>
        </div>

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
                {!receiptAckAcknowledged ? (
                  <button
                    type="button"
                    onClick={(ev) => void handleConfirmReceipt(ev)}
                    disabled={receiptAckSubmitting || !receiptAckTokenHex}
                    className="mt-3 inline-flex items-center justify-center rounded-md bg-teal-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-teal-600 dark:hover:bg-teal-500"
                  >
                    {receiptAckSubmitting
                      ? (t.revealReceiptConfirming ?? "Confirming…")
                      : (t.revealReceiptConfirmButton ?? "Confirm receipt")}
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </section>
      <AttachmentProgressDialog progress={attachmentDecryptProgress} />
    </section>
  );
};
