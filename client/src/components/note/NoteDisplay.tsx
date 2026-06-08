import React, { useState, useEffect } from 'react';
import {
  Copy,
  RefreshCw,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  ShieldCheck,
  Trash2,
  UserX,
  Download,
  Paperclip,
} from 'lucide-react';
import { apiBlobRequest, apiRequest } from '@/lib/queryClient';
import { reportNoteOpenedIfSignedIn } from '@/lib/accountActivityClient';
import {
  decryptNote,
  deriveNoteRootKeysFromUrlFragment,
  importAesGcmKeyFromUrlFragment,
  decryptFileBytes,
  base64ToArrayBuffer,
  base64ToUint8Array,
  deserializeEncryptedPayload,
  NOTE_KEY_DERIVATION_HKDF_ROOT_V2,
  unwrapContentKeyWithPassword,
  unwrapRootKeyWithPassword,
} from '@/utils/encryption';
import { formatNoteFileSize } from '@shared/noteFileLimits';
import { useToast } from '@/hooks/use-toast';
import { SecurityRecommendations } from '@/components/features/SecurityRecommendations';
import { useLanguage } from '@/context/LanguageContext';

type NoteAccessProblemVariant = 'note_gone' | 'link_incomplete' | 'key_truncated';

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
  attachment?: NoteAttachment;
}

interface NoteAttachmentV1 {
  v: 1;
  name: string;
  type: string;
  size: number;
  encryptedSize: number;
  iv: string;
  aad: string;
}

interface NoteAttachmentV2 {
  v: 2;
  alg: "libsodium-secretstream-xchacha20poly1305";
  name: string;
  type: string;
  size: number;
  encryptedSize: number;
  chunkSize: number;
  totalChunks: number;
  header: string;
  aad: string;
  wrappedKey: {
    alg: "AES-GCM";
    iv: string;
    aad: string;
    encryptedKey: string;
  };
  chunks: Array<{ index: number; encryptedSize: number }>;
}

type NoteAttachment = NoteAttachmentV1 | NoteAttachmentV2;

interface RevealHeroProps {
  isRevealing: boolean;
  isRevealButtonReady: boolean;
  onReveal: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  branding?: RevealBranding;
}

/** Shared hero subtitle: matches Reveal / Create success rhythm. */
const NOTE_VIEW_HERO_SUBTITLE =
  'm-0 mt-6 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-7 md:text-xl md:max-w-3xl leading-relaxed';

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

const TrustSignals: React.FC = () => (
  <ul className="mt-40 sm:mt-44 flex flex-col items-center gap-2.5 lg:flex-row lg:justify-center lg:gap-6 text-xs sm:text-sm text-gray-600/75 dark:text-gray-300/72">
    <li className="inline-flex items-center gap-1.5">
      <ShieldCheck className="h-4 w-4 text-primary/70" aria-hidden />
      <span>End-to-end encrypted</span>
    </li>
    <li className="inline-flex items-center gap-1.5">
      <Trash2 className="h-4 w-4 text-primary/70" aria-hidden />
      <span>Self-destructs after opening</span>
    </li>
    <li className="inline-flex items-center gap-1.5">
      <UserX className="h-4 w-4 text-primary/70" aria-hidden />
      <span>No account required</span>
    </li>
  </ul>
);

const getBrandingLine = (branding?: RevealBranding): string | null => {
  if (!branding) return null;
  const sharer = branding.sharerName?.trim();
  const company = branding.companyName?.trim();
  if (sharer && company) return `${sharer} from ${company} shared a private note`;
  if (sharer) return `Shared by ${sharer}`;
  if (company) return `Shared by ${company}`;
  return null;
};

const NoteAccessProblem: React.FC<{
  variant: NoteAccessProblemVariant;
  /** True when the note was fetched but the URL key could not decrypt (wrong/truncated key, etc.). */
  keyMismatch?: boolean;
}> = ({ variant, keyMismatch = false }) => {
  const isIncomplete = variant === 'link_incomplete';
  const isKeyTruncated = variant === 'key_truncated';
  const showKeyMismatch = variant === 'note_gone' && keyMismatch;

  return (
    <section className="w-full max-w-5xl mx-auto py-4 sm:py-6">
      <section className="px-4 pb-1 sm:px-6 lg:px-8 pt-2">
        <div className="text-center">
          {isIncomplete ? (
            <>
              <h1 className="page-title text-gray-900 dark:text-white">This link looks incomplete</h1>
              <p className={NOTE_VIEW_HERO_SUBTITLE}>The secret key (after #) is missing.</p>
            </>
          ) : isKeyTruncated ? (
            <>
              <h1 className="page-title text-gray-900 dark:text-white">This link&apos;s key looks too short</h1>
              <p className={NOTE_VIEW_HERO_SUBTITLE}>
                The secret after the # is shorter than a real note key. It may have been cut off when the link was
                copied or shared.
              </p>
            </>
          ) : showKeyMismatch ? (
            <>
              <h1 className="page-title text-gray-900 dark:text-white">Couldn&apos;t unlock this note</h1>
              <p className={NOTE_VIEW_HERO_SUBTITLE}>
                The key in your link doesn&apos;t match this note. It may be wrong, incomplete, or from a different
                link. Copy the full URL, including everything after the # symbol.
              </p>
            </>
          ) : (
            <>
              <h1 className="page-title text-gray-900 dark:text-white">Note no longer available</h1>
              <p className={NOTE_VIEW_HERO_SUBTITLE}>
                It may have already been opened, expired, or the link is incomplete.
              </p>
            </>
          )}
        </div>
      </section>

      <div className="px-4 sm:px-6 lg:px-8 mt-10 sm:mt-12 md:mt-14">
        <div
          className="max-w-xl mx-auto rounded-2xl border-2 border-blue-200/90 dark:border-blue-800/65 bg-blue-50/60 dark:bg-blue-950/25 px-6 py-7 sm:px-8 sm:py-8 shadow-sm"
          role="group"
          aria-label="What to try next"
        >
          <div className="text-center space-y-5 sm:space-y-6">
            <p className="m-0 text-lg sm:text-xl md:text-2xl text-gray-700 dark:text-gray-300 leading-snug sm:leading-[1.45]">
              Try opening the <span className="font-semibold text-gray-900 dark:text-gray-100">original link</span> again.
            </p>
            <div className="flex items-center gap-3 justify-center text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
              <span className="h-px w-10 sm:w-12 bg-blue-200/95 dark:bg-blue-700/80" aria-hidden />
              OR
              <span className="h-px w-10 sm:w-12 bg-blue-200/95 dark:bg-blue-700/80" aria-hidden />
            </div>
            <p className="m-0 text-lg sm:text-xl md:text-2xl text-gray-700 dark:text-gray-300 leading-snug sm:leading-[1.45]">
              Ask the sender to send a <span className="font-semibold text-gray-900 dark:text-gray-100">new one</span>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const RevealHero: React.FC<RevealHeroProps> = ({ isRevealing, isRevealButtonReady, onReveal, branding }) => {
  const brandingLine = getBrandingLine(branding);
  const hasBranding = Boolean(brandingLine || branding?.logoUrl);
  const buttonStyle = branding?.accentColor ? { backgroundColor: branding.accentColor } : undefined;

  return (
    <section className="w-full max-w-5xl mx-auto py-4 sm:py-6">
      <section className="px-4 pb-1 sm:px-6 lg:px-8 pt-2">
        <div className="text-center">
          {hasBranding && (
            <div className="mb-4 flex flex-col items-center gap-2">
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
            Reveal <span className="text-primary">Private Note</span>
          </h1>
          <p className={NOTE_VIEW_HERO_SUBTITLE}>
            For your privacy, this note is deleted after it&apos;s opened.
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
                  Revealing...
                </>
              ) : (
                <>
                  <Unlock className="h-4 w-4 mr-2" />
                  Reveal Note
                </>
              )}
            </button>
          </div>

          <p className="mt-4 sm:mt-5 text-sm text-gray-600/62 dark:text-gray-300/58">
            ⚠️ Open only when you&apos;re ready — this cannot be undone.
          </p>

          <TrustSignals />
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
  const { t } = useLanguage();
  const [noteContent, setNoteContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [keyMismatchError, setKeyMismatchError] = useState(false);
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
  const [isDownloadingFile, setIsDownloadingFile] = useState(false);
  const { toast } = useToast();

  const requireTrustedUserEvent = (e: React.SyntheticEvent): boolean => {
    if (e.nativeEvent.isTrusted) return true;
    toast({
      title: "Interaction required",
      description: "Please use a direct click or key press in your browser to continue.",
    });
    return false;
  };

  const getUserFriendlyError = (message: string) => {
    if (message.startsWith("404:") || message.includes("Note not found")) {
      return "This note is unavailable or has already been read.";
    }
    if (message.includes("Note has expired")) {
      return "This note has expired.";
    }
    if (isDecryptKeyFailureMessage(message)) {
      return "This link's key doesn't match this note. Copy the full URL—including everything after #—or ask the sender for a new link.";
    }
    return message;
  };

  useEffect(() => {
    if (!id) {
      setError('Invalid note ID');
      setKeyMismatchError(false);
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    setIsRevealButtonReady(false);
    const timer = window.setTimeout(() => {
      setIsRevealButtonReady(true);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [id]);

  const decryptWithKey = async (data: NoteData, key: string) => {
    try {
      if (!data.aad) {
        throw new Error("Missing note authentication data");
      }
      const payloadBytes = deserializeEncryptedPayload({
        content: data.content,
        iv: data.iv,
        aad: data.aad,
      });

      const { noteTextKey, fileWrapKey } =
        data.keyDerivation === NOTE_KEY_DERIVATION_HKDF_ROOT_V2
          ? await deriveNoteRootKeysFromUrlFragment(key)
          : {
              noteTextKey: await importAesGcmKeyFromUrlFragment(key),
              fileWrapKey: await importAesGcmKeyFromUrlFragment(key),
            };
      setContentKey(fileWrapKey);

      // Decrypt the note with AAD for context validation
      // Fixed: Added AAD support
      const decryptedContent = await decryptNote(
        payloadBytes.encryptedData,
        noteTextKey,
        payloadBytes.iv,
        payloadBytes.aadBytes,
      );
      setNoteContent(decryptedContent);
      reportNoteOpenedIfSignedIn(id);
    } catch (cryptoError) {
      console.error("Crypto error:", cryptoError);
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
      setNoteData(data);
      setHasRevealed(true);

      if (data.isPasswordProtected) {
        setIsLoading(false);
        return;
      }

      if (!encryptionKey) {
        throw new Error("Missing encryption key in URL. The note cannot be decrypted.");
      }

      await decryptWithKey(data, encryptionKey);
    } catch (error) {
      console.error('Error revealing note:', error);
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
        title: "Error",
        description: "Please enter the password",
        variant: "destructive",
      });
      return;
    }

    if (!noteData) {
      toast({
        title: "Error",
        description: "Missing note data",
        variant: "destructive",
      });
      return;
    }

    const wrappedKey = encryptionKey || null;

    // Check if we have all the required fields for password decryption
    if (!wrappedKey || !noteData.encryptedKeyIv || !noteData.salt) {
      toast({
        title: "Error",
        description: "This note is missing required password protection fields",
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

      const { noteTextKey, fileWrapKey } =
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
            };

      const decryptedContent = await decryptNote(
        payloadBytes.encryptedData,
        noteTextKey,
        payloadBytes.iv,
        payloadBytes.aadBytes,
      );

      setNoteContent(decryptedContent);
      setContentKey(fileWrapKey);
      reportNoteOpenedIfSignedIn(id);

      // Hide password input after successful decryption
      setIsPasswordProtected(false);

      toast({
        title: "Success",
        description: "Note decrypted successfully",
      });
    } catch (error) {
      console.error("Password decryption error:", error);
      setPasswordDecryptError(
        "That password didn\u2019t unlock this note. Check for typos or ask the sender.",
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
      title: "Copied!",
      description: "Note content copied to clipboard",
    });
  };

  const handleDownloadAttachment = async () => {
    if (!noteData?.attachment || !contentKey) return;
    const fileAccessHeaders: Record<string, string> = noteData.fileAccessToken
      ? { "x-file-access-token": noteData.fileAccessToken }
      : {};
    setIsDownloadingFile(true);
    try {
      let decryptedParts: BlobPart[];
      if (noteData.attachment.v === 2) {
        const { decryptSodiumAttachmentChunks } = await import("@/utils/libsodiumFileAttachment");
        decryptedParts = await decryptSodiumAttachmentChunks(
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
        );
      } else {
        const encryptedBlob = await apiBlobRequest(`/api/notes/${id}/file`, "GET", fileAccessHeaders);
        const encryptedBytes = new Uint8Array(await encryptedBlob.arrayBuffer());
        const decryptedBytes = await decryptFileBytes(
          encryptedBytes,
          contentKey,
          base64ToUint8Array(noteData.attachment.iv),
          base64ToUint8Array(noteData.attachment.aad),
        );
        decryptedParts = [decryptedBytes];
      }
      const blob = new Blob(decryptedParts, {
        type: noteData.attachment.type || "application/octet-stream",
      });
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = noteData.attachment.name || "privatenote-file";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } catch (error) {
      console.error("Attachment download/decrypt failed:", error);
      toast({
        title: "File download failed",
        description: "The encrypted file could not be downloaded or decrypted.",
        variant: "destructive",
      });
    } finally {
      setIsDownloadingFile(false);
    }
  };

  const handleCreateNew = () => {
    window.location.href = '/';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return <NoteAccessProblem variant="note_gone" keyMismatch={keyMismatchError} />;
  }

  if (linkKeyMissing && !hasRevealed) {
    return <NoteAccessProblem variant="link_incomplete" />;
  }

  if (linkKeyTruncated && !hasRevealed) {
    return <NoteAccessProblem variant="key_truncated" />;
  }

  if (!hasRevealed) {
    return (
      <RevealHero
        isRevealing={isRevealing}
        isRevealButtonReady={isRevealButtonReady}
        onReveal={handleReveal}
        branding={revealBranding}
      />
    );
  }

  // If password protected and not yet decrypted, show password input
  if (isPasswordProtected && !noteContent) {
    return (
      <section className="w-full max-w-5xl mx-auto py-4 sm:py-6">
        <section className="px-4 pb-1 sm:px-6 lg:px-8 pt-2">
          <div className="text-center">
            <div className="text-primary mb-4 flex justify-center">
              <Lock className="h-10 w-10 sm:h-11 sm:w-11" aria-hidden />
            </div>
            <h1 className="page-title text-gray-900 dark:text-white">{t.passwordProtectedNote}</h1>
            <p className={NOTE_VIEW_HERO_SUBTITLE}>
              {t.passwordProtectedDescription}
            </p>

            <div className="max-w-sm mx-auto mt-8 sm:mt-10 text-left">
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

  const brandingLine = getBrandingLine(revealBranding);
  const hasBranding = Boolean(brandingLine || revealBranding?.logoUrl);
  const accentStyle = revealBranding?.accentColor ? { backgroundColor: revealBranding.accentColor } : undefined;

  // Regular note content view (either after password decryption or for non-password notes)
  return (
    <section className="w-full max-w-5xl mx-auto py-4 sm:py-6">
      <section className="px-4 pb-1 sm:px-6 lg:px-8 pt-2">
        <div className="text-center">
          {hasBranding && (
            <div className="mb-4 flex flex-col items-center gap-2">
              {revealBranding?.logoUrl && (
                <img
                  src={revealBranding.logoUrl}
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
            <span className="text-primary">{t.privateNote}</span>
          </h1>
          <p className="m-0 mt-6 max-w-md mx-auto text-sm sm:text-base md:mt-7 md:max-w-3xl text-amber-800 dark:text-amber-200 font-medium leading-relaxed">
            ⚠️ {t.noteDeletedWarning}
          </p>
        </div>

        <div
          className="note-read-panel mt-8 sm:mt-10 text-left"
          aria-label="Note content"
        >
          <div className="note-read-content whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-[0.97rem] sm:text-base md:text-[1.03rem] leading-relaxed text-gray-900 dark:text-gray-100 font-sans select-text">
            {noteContent.trimEnd()}
          </div>
        </div>

        {noteData?.attachment ? (
          <div className="mx-auto mt-4 max-w-2xl rounded-lg border border-gray-200 bg-white p-4 text-left dark:border-gray-800 dark:bg-gray-950">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <Paperclip className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {noteData.attachment.name}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Encrypted attachment · {formatNoteFileSize(noteData.attachment.size)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => void handleDownloadAttachment()}
                disabled={isDownloadingFile || !contentKey}
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download className="mr-2 h-4 w-4" aria-hidden />
                {isDownloadingFile ? "Decrypting..." : "Download file"}
              </button>
            </div>
          </div>
        ) : null}

        <div className="mt-8 sm:mt-9 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
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
      </section>
    </section>
  );
};
