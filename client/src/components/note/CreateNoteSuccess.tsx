import React, { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { Link } from "wouter";
import { useLanguage } from "@/context/LanguageContext";
import { localizedPath } from "@/utils/localizedPath";
import { QRCode } from "@/components/ui/qr-code";
import { type NoteExpiryPresetId } from "@shared/noteExpiry";
import {
  Ban,
  Check,
  CirclePlus,
  Copy,
  Eye,
  EyeOff,
  FileText,
  Key,
  Link2,
  Mail,
  MoreHorizontal,
  QrCode,
  Share2,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { ChromeExtensionOnboardingBanner } from "./ChromeExtensionOnboardingBanner";
import { useToast } from "@/hooks/use-toast";
import { NOTE_LABEL_MAX_LENGTH } from "@/utils/noteLabelsStorage";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

export type RecipientLinkDeliveryGate = "ready" | "sign_in" | "upgrade" | "verify_email";

const COPY_SUCCESS_MS = 1800;
const ghostBtn =
  "inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800";

function mailtoShareHref(url: string): string {
  return `mailto:?body=${encodeURIComponent(url)}`;
}

function whatsappShareHref(url: string): string {
  return `https://wa.me/?text=${encodeURIComponent(url)}`;
}

function slackShareHref(url: string): string {
  return `https://slack.com/share?url=${encodeURIComponent(url)}`;
}

function SuccessBurstCheck() {
  return (
    <div
      className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center sm:mb-5"
      aria-hidden
    >
      <svg viewBox="0 0 64 64" className="absolute inset-0 h-16 w-16 text-primary/40">
        <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="32" y1="3" x2="32" y2="10" />
          <line x1="32" y1="54" x2="32" y2="61" />
          <line x1="3" y1="32" x2="10" y2="32" />
          <line x1="54" y1="32" x2="61" y2="32" />
          <line x1="12" y1="12" x2="17" y2="17" />
          <line x1="47" y1="47" x2="52" y2="52" />
          <line x1="12" y1="52" x2="17" y2="47" />
          <line x1="47" y1="17" x2="52" y2="12" />
        </g>
      </svg>
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/[0.09] dark:bg-primary/15">
        <Check className="h-5 w-5 text-primary" strokeWidth={2.75} />
      </div>
    </div>
  );
}

function WhatsAppGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        fill="currentColor"
        d="M12.04 2C6.58 2 2.15 6.4 2.15 11.82c0 1.74.46 3.44 1.33 4.94L2 22l5.4-1.41a10.1 10.1 0 0 0 4.64 1.17h.04c5.46 0 9.89-4.4 9.89-9.82C21.97 6.4 17.5 2 12.04 2zm5.76 14.18c-.24.68-1.4 1.25-1.93 1.33-.49.07-1.1.1-1.78-.11-.41-.13-.94-.3-1.62-.59-2.85-1.23-4.7-4.1-4.84-4.29-.14-.19-1.15-1.53-1.15-2.92 0-1.39.73-2.07.99-2.36.26-.29.57-.36.76-.36h.55c.17 0 .41-.07.64.49.24.58.82 2 .89 2.15.07.15.12.32.02.52-.1.19-.14.32-.29.49-.14.17-.3.38-.43.51-.14.13-.29.28-.12.54.17.26.75 1.23 1.6 2 .99.9 1.83 1.18 2.09 1.31.26.13.41.11.56-.07.15-.17.64-.75.82-1 .17-.26.35-.21.58-.13.24.08 1.5.71 1.76.84.26.13.43.19.49.3.07.11.07.64-.17 1.32z"
      />
    </svg>
  );
}

function SlackGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
      <path fill="#E01E5A" d="M6.3 14.1a2.1 2.1 0 1 1-2.1-2.1h2.1v2.1z" />
      <path fill="#E01E5A" d="M7.4 14.1a2.1 2.1 0 1 1 4.2 0v5.3a2.1 2.1 0 0 1-4.2 0v-5.3z" />
      <path fill="#36C5F0" d="M9.9 6.3a2.1 2.1 0 1 1 2.1-2.1v2.1H9.9z" />
      <path fill="#36C5F0" d="M9.9 7.4a2.1 2.1 0 1 1 0 4.2H4.6a2.1 2.1 0 1 1 0-4.2h5.3z" />
      <path fill="#2EB67D" d="M17.7 9.9a2.1 2.1 0 1 1 2.1 2.1h-2.1V9.9z" />
      <path fill="#2EB67D" d="M16.6 9.9a2.1 2.1 0 1 1-4.2 0V4.6a2.1 2.1 0 1 1 4.2 0v5.3z" />
      <path fill="#ECB22E" d="M14.1 17.7a2.1 2.1 0 1 1-2.1 2.1v-2.1h2.1z" />
      <path fill="#ECB22E" d="M14.1 16.6a2.1 2.1 0 1 1 0-4.2h5.3a2.1 2.1 0 1 1 0 4.2h-5.3z" />
    </svg>
  );
}

export type CreatedNoteMeta = {
  expiryValue: NoteExpiryPresetId;
  readCount: number;
  isPasswordProtected: boolean;
  /** Note id for device-local naming when delivery tracking is on. */
  noteId?: string;
  /** True when open/destroy/download alerts or recipient gates were enabled. */
  tracksDelivery?: boolean;
  recipientVerificationCode?: string;
  recipientLinkDelivery?: {
    status: "sent" | "failed";
    email: string;
  };
};

export type CreatedNoteState = {
  url: string;
  /** Present in normal flow; optional so a defensive UI can recover if state is ever partial. */
  meta?: CreatedNoteMeta;
};

export type CreateNoteSuccessProps = {
  createdNote: CreatedNoteState;
  showSuccessQr: boolean;
  setShowSuccessQr: (v: boolean | ((prev: boolean) => boolean)) => void;
  showSuccessHelp: boolean;
  setShowSuccessHelp: (v: boolean | ((prev: boolean) => boolean)) => void;
  showQrHelp: boolean;
  setShowQrHelp: (v: boolean | ((prev: boolean) => boolean)) => void;
  selectedDoDont: "do" | "dont" | null;
  setSelectedDoDont: (v: "do" | "dont" | null | ((prev: "do" | "dont" | null) => "do" | "dont" | null)) => void;
  successLinkCopied: boolean;
  onCopyLink: () => Promise<void>;
  onDeliverRecipientLink?: (email: string) => Promise<void>;
  recipientLinkDeliveryGate?: RecipientLinkDeliveryGate;
  recipientLinkDeliveryRetrying?: boolean;
  onShareLink: () => Promise<void>;
  onShareQrCode: () => Promise<void>;
  onDownloadQrCode: () => Promise<void>;
  onCreateNewNote: () => void;
  /** Starter/Business: revoke an unopened note from the success screen. */
  canRevoke?: boolean;
  noteRevoked?: boolean;
  revoking?: boolean;
  onRevoke?: () => Promise<void>;
  /** Plaintext note password for OOB share/copy on the success page only. Never sent to the server. */
  createdPassword?: string;
  /** Device-local name for Activity when tracking is enabled. */
  noteLabel?: string;
  onNoteLabelChange?: (value: string) => void;
  successQrSectionRef: RefObject<HTMLDivElement>;
  variant?: "note" | "file-transfer";
};

export const CreateNoteSuccess: React.FC<CreateNoteSuccessProps> = ({
  createdNote,
  showSuccessQr,
  setShowSuccessQr,
  selectedDoDont,
  setSelectedDoDont,
  onDeliverRecipientLink,
  recipientLinkDeliveryGate = "upgrade",
  recipientLinkDeliveryRetrying = false,
  onShareQrCode,
  onDownloadQrCode,
  onCreateNewNote,
  canRevoke = false,
  noteRevoked = false,
  revoking = false,
  onRevoke,
  createdPassword,
  noteLabel = "",
  onNoteLabelChange,
  successQrSectionRef,
  variant = "note",
}) => {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [deliverEmailInput, setDeliverEmailInput] = useState("");
  const [showCreatedPassword, setShowCreatedPassword] = useState(false);
  const [passwordCopied, setPasswordCopied] = useState(false);
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [localLabel, setLocalLabel] = useState(noteLabel);
  const copyResetRef = useRef<number | null>(null);
  const copyInFlightRef = useRef(false);
  const isFileTransfer = variant === "file-transfer";
  const createdNoteMeta = createdNote.meta;

  useEffect(() => {
    const emailed = createdNote.meta?.recipientLinkDelivery?.email;
    if (!emailed) return;
    setDeliverEmailInput((current) => (current.trim() ? current : emailed));
  }, [createdNote.meta?.recipientLinkDelivery?.email]);

  useEffect(() => {
    return () => {
      if (copyResetRef.current != null) window.clearTimeout(copyResetRef.current);
    };
  }, []);

  if (!createdNoteMeta) {
    return (
      <section
        className="max-w-4xl mx-auto py-6 text-center text-gray-600 dark:text-gray-400"
        aria-live="polite"
      >
        {isFileTransfer ? t.preparingSecureTransfer : t.preparingSecureNote}
      </section>
    );
  }

  const successUrl = createdNote.url;
  const {
    isPasswordProtected: createdPasswordProtected,
    recipientVerificationCode,
    recipientLinkDelivery,
  } = createdNoteMeta;

  const createAnotherLabel = isFileTransfer
    ? t.successCreateAnotherTransfer ?? t.createAnotherTransfer
    : t.successCreateAnotherNote ?? t.createAnotherNote;
  const linkAriaLabel = isFileTransfer ? t.encryptedTransferLink : t.encryptedNoteLink;
  const headingPrefix = isFileTransfer ? t.yourSecureTransferIs : t.yourSecureNoteIs;
  const subtitleLine = isFileTransfer ? t.transferEncryptedInBrowser : t.noteEncryptedInBrowser;
  const premiumUpgradeHref = localizedPath("/premium", language);
  const signInHref = localizedPath("/auth/sign-in", language);
  const deliverySent = recipientLinkDelivery?.status === "sent";
  const deliveryFailed = recipientLinkDelivery?.status === "failed";
  const canSubmitDelivery = recipientLinkDeliveryGate === "ready" && Boolean(onDeliverRecipientLink);
  const copyLabel = t.successCopy ?? "Copy";
  const copiedLabel = t.successCopied ?? t.copied ?? "Copied!";
  const namePlaceholder = t.successNameNoteOptional ?? "Name this note (optional)";
  const burnLabel = t.successBurnThisOne ?? "Burn this one";
  const shareYourWay = t.successShareItYourWay ?? "Share it your way";
  const qrScanLabel = t.successQrScanToOpen ?? "Scan to open this secure note";
  const labelValue = onNoteLabelChange ? noteLabel : localLabel;
  const showBurn = canRevoke || noteRevoked;

  const submitRecipientLinkDelivery = () => {
    if (!onDeliverRecipientLink || !canSubmitDelivery || recipientLinkDeliveryRetrying) return;
    void onDeliverRecipientLink(deliverEmailInput.trim());
  };

  const notePassword = createdPassword?.trim() ?? "";
  const showPasswordShare = createdPasswordProtected && notePassword.length > 0;

  const handleLabelChange = (value: string) => {
    if (onNoteLabelChange) onNoteLabelChange(value);
    else setLocalLabel(value);
  };

  const copySecureUrl = async () => {
    if (linkCopied || copyInFlightRef.current || noteRevoked) return;
    copyInFlightRef.current = true;
    try {
      await navigator.clipboard.writeText(successUrl);
      setLinkCopied(true);
      if (copyResetRef.current != null) window.clearTimeout(copyResetRef.current);
      copyResetRef.current = window.setTimeout(() => {
        setLinkCopied(false);
        copyResetRef.current = null;
      }, COPY_SUCCESS_MS);
    } catch {
      toast({
        title: t.toastCouldNotCopyLinkTitle ?? "Could not copy",
        description: t.toastCouldNotCopyLinkDesc ?? "Copy the link manually.",
        variant: "destructive",
      });
    } finally {
      copyInFlightRef.current = false;
    }
  };

  const copyCreatedPassword = async () => {
    try {
      await navigator.clipboard.writeText(notePassword);
      setPasswordCopied(true);
      toast({ title: t.copied, description: t.passwordCopied });
      window.setTimeout(() => setPasswordCopied(false), 2000);
    } catch {
      toast({
        title: t.toastCouldNotCopyLinkTitle ?? "Could not copy",
        description: t.toastCouldNotCopyLinkDesc ?? "Copy the password manually.",
        variant: "destructive",
      });
    }
  };

  const shareCreatedPassword = async () => {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          text: notePassword,
          title: t.successSharePasswordTitle ?? t.password ?? "Note password",
        });
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
      }
    }
    await copyCreatedPassword();
  };

  const shareMore = async () => {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ url: successUrl });
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
      }
    }
    await copySecureUrl();
  };

  const shareActionClass =
    "group flex min-h-11 min-w-[4.5rem] flex-col items-center justify-center gap-2 rounded-lg px-1 py-2 text-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40";

  return (
    <section className="w-full max-w-4xl mx-auto py-3 sm:py-5">
      <div className="space-y-5 sm:space-y-6">
        <section className="px-4 pb-1 sm:px-6 lg:px-8 pt-1 sm:pt-2">
          <div className="text-center">
            <SuccessBurstCheck />
            <h1 className="page-title text-gray-900 dark:text-white">
              {headingPrefix} <span className="text-primary italic">{t.ready}</span>
            </h1>
            <div className="mt-3 max-w-3xl mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-4 md:text-xl space-y-1">
              <p className="m-0">{subtitleLine}</p>
              <p className="m-0">{t.onlySomeoneWithLinkCanRead}</p>
            </div>
          </div>
        </section>

        {recipientVerificationCode ? (
          <div
            className="mx-4 sm:mx-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-sm text-amber-950 dark:border-amber-800/60 dark:bg-amber-900/20 dark:text-amber-100"
            role="note"
          >
            <p className="m-0 font-medium">
              {t.recipientVerificationCodeLabel ?? "Recipient verification code"}
            </p>
            <p className="mt-2 font-mono text-lg tracking-widest">{recipientVerificationCode}</p>
            <p className="mt-2 m-0 text-xs leading-snug opacity-90">
              {t.recipientVerificationCodeHint ??
                "Share this code with the recipient separately. They must enter it before the note can be revealed."}
            </p>
          </div>
        ) : null}

        <div className="relative px-4 pb-2 sm:px-6 lg:mb-16 lg:pb-4">
          <div className="mx-auto w-full max-w-3xl rounded-[20px] border border-gray-200/90 bg-white px-4 py-5 shadow-[0_10px_28px_-18px_rgba(15,23,42,0.28)] sm:px-6 sm:py-6 dark:border-gray-800 dark:bg-gray-950 dark:shadow-[0_10px_28px_-18px_rgba(0,0,0,0.65)]">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="flex min-w-0 flex-1 items-center gap-2.5 rounded-xl border border-gray-200 bg-slate-50 px-3 py-2.5 dark:border-gray-700 dark:bg-gray-900">
                <Link2
                  className="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500"
                  aria-hidden
                />
                <input
                  type="text"
                  readOnly
                  value={successUrl}
                  title={successUrl}
                  className="min-w-0 flex-1 truncate bg-transparent text-sm text-gray-800 select-text focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-sm dark:text-gray-100"
                  aria-label={linkAriaLabel}
                  onFocus={(event) => event.currentTarget.select()}
                />
              </div>
              <button
                type="button"
                onClick={() => void copySecureUrl()}
                disabled={noteRevoked}
                className={`inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-lg px-4 text-sm font-semibold text-white shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                  linkCopied
                    ? "bg-emerald-600 hover:bg-emerald-600 focus-visible:ring-emerald-500"
                    : "bg-primary hover:bg-primary/90 focus-visible:ring-primary"
                }`}
                title={t.copyLinkToClipboard}
                aria-live="polite"
              >
                {linkCopied ? (
                  <>
                    <Check className="h-4 w-4 shrink-0" aria-hidden />
                    {copiedLabel}
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 shrink-0" aria-hidden />
                    {copyLabel}
                  </>
                )}
              </button>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:flex-wrap sm:items-center lg:flex-nowrap">
              <label className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg px-1 py-1">
                <Tag className="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500" aria-hidden />
                <span className="sr-only">{t.successNoteLabelTitle ?? "Name this note"}</span>
                <input
                  id="success-note-label"
                  type="text"
                  maxLength={NOTE_LABEL_MAX_LENGTH}
                  value={labelValue}
                  onChange={(event) => handleLabelChange(event.target.value)}
                  placeholder={namePlaceholder}
                  className="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm text-gray-900 placeholder:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-sm dark:text-gray-100 dark:placeholder:text-gray-400"
                />
              </label>

              <div
                className="hidden h-7 w-px shrink-0 bg-gray-200 sm:block lg:mx-1 dark:bg-gray-700"
                aria-hidden
              />

              <button
                type="button"
                onClick={onCreateNewNote}
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/[0.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <CirclePlus className="h-4 w-4 shrink-0" aria-hidden />
                {createAnotherLabel}
              </button>

              {showBurn ? (
                <>
                  <div
                    className="hidden h-7 w-px shrink-0 bg-gray-200 sm:block lg:mx-1 dark:bg-gray-700"
                    aria-hidden
                  />
                  {noteRevoked ? (
                    <p
                      className="inline-flex min-h-11 items-center gap-1.5 px-2 text-sm font-medium text-rose-700 dark:text-rose-300"
                      role="status"
                    >
                      <Ban className="h-4 w-4 shrink-0" aria-hidden />
                      {t.notificationRevokeSuccessTitle ?? "Note revoked"}
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setRevokeDialogOpen(true)}
                      disabled={revoking || !onRevoke}
                      className="inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium text-rose-500/90 transition-colors hover:bg-rose-50 hover:text-rose-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/50 disabled:cursor-not-allowed disabled:opacity-60 dark:text-rose-400 dark:hover:bg-rose-950/40 dark:hover:text-rose-300"
                    >
                      <Trash2 className="h-4 w-4 shrink-0" aria-hidden />
                      {revoking ? t.notificationRevoking ?? "Revoking..." : burnLabel}
                    </button>
                  )}
                </>
              ) : null}
            </div>

            <div className="mt-5 border-t border-gray-200 pt-5 sm:mt-6 sm:pt-6 dark:border-gray-800">
              <div className="grid grid-cols-3 gap-1 sm:grid-cols-5 sm:gap-2">
                <a
                  href={mailtoShareHref(successUrl)}
                  className={shareActionClass}
                  aria-label={t.successShareViaEmail ?? "Share via email"}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
                    <Mail className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {t.successShareEmail ?? "Email"}
                  </span>
                </a>
                <a
                  href={whatsappShareHref(successUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={shareActionClass}
                  aria-label={t.successShareViaWhatsApp ?? "Share via WhatsApp"}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white">
                    <WhatsAppGlyph />
                  </span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {t.successShareWhatsApp ?? "WhatsApp"}
                  </span>
                </a>
                <a
                  href={slackShareHref(successUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={shareActionClass}
                  aria-label={t.successShareViaSlack ?? "Share via Slack"}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 ring-1 ring-gray-200/80 dark:bg-gray-900 dark:ring-gray-700">
                    <SlackGlyph />
                  </span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {t.successShareSlack ?? "Slack"}
                  </span>
                </a>
                <button
                  type="button"
                  onClick={() => setShowSuccessQr(true)}
                  className={shareActionClass}
                  aria-label={t.successShowQrCode ?? t.shareViaQrCode}
                  aria-expanded={showSuccessQr}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/15">
                    <QrCode className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {t.qrCode}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => void shareMore()}
                  className={shareActionClass}
                  aria-label={t.successMoreSharingOptions ?? "More sharing options"}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                    <MoreHorizontal className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {t.successShareMore ?? "More"}
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute -bottom-14 left-6 hidden lg:flex xl:left-10">
            <svg
              viewBox="0 0 72 56"
              className="mt-1 h-12 w-16 text-primary/80"
              fill="none"
              aria-hidden
            >
              <path
                d="M58 10C38 8 18 22 16 38"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
              <path
                d="M10 32l6 8 10-4"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="success-hand-accent mt-8 -ml-1 rotate-[-8deg] text-[1.15rem] leading-none text-primary">
              {shareYourWay}
            </p>
          </div>
        </div>

        {showPasswordShare ? (
          <div className="mx-4 mt-4 overflow-hidden rounded-xl border border-gray-200 sm:mx-6 dark:border-gray-700">
            <div className="flex items-center justify-between gap-2 bg-gray-100 px-3 py-2 text-xs sm:text-sm font-semibold uppercase tracking-wide text-gray-800 dark:bg-gray-800 dark:text-gray-100">
              <span className="inline-flex items-center gap-1.5">
                <Key className="h-3.5 w-3.5 shrink-0 text-gray-500 dark:text-gray-400" aria-hidden />
                {t.successNotePassword ?? "Note password"}
              </span>
              <button
                type="button"
                onClick={() => setShowCreatedPassword((open) => !open)}
                className="inline-flex items-center gap-1 rounded-md bg-gray-200/80 px-2 py-1 text-[11px] font-medium normal-case tracking-normal text-gray-700 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                aria-pressed={showCreatedPassword}
                aria-label={showCreatedPassword ? t.hidePassword : t.showPassword}
              >
                {showCreatedPassword ? (
                  <EyeOff className="h-3.5 w-3.5" aria-hidden />
                ) : (
                  <Eye className="h-3.5 w-3.5" aria-hidden />
                )}
                {showCreatedPassword ? t.hidePassword : t.showPassword}
              </button>
            </div>
            <div className="space-y-3 bg-white p-3 dark:bg-gray-900">
              <input
                type={showCreatedPassword ? "text" : "password"}
                readOnly
                value={notePassword}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 font-mono text-sm text-gray-900 select-text focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-gray-600 dark:bg-gray-950 dark:text-gray-100"
                aria-label={t.successNotePassword ?? "Note password"}
                onFocus={(event) => event.currentTarget.select()}
              />
              <p className="m-0 text-xs leading-snug text-gray-500 dark:text-gray-400">
                {t.passwordProtectionSendSeparately}
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => void shareCreatedPassword()}
                  className={ghostBtn}
                  title={t.successSharePassword ?? "Share password"}
                >
                  <Share2 className="mr-1.5 h-4 w-4 shrink-0 text-primary" />
                  {t.successSharePassword ?? "Share password"}
                </button>
                <button
                  type="button"
                  onClick={() => void copyCreatedPassword()}
                  className={`inline-flex flex-1 items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                    passwordCopied
                      ? "bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-500"
                      : "bg-primary text-white hover:bg-primary/90 focus-visible:ring-primary"
                  }`}
                  title={t.copyPassword}
                >
                  {passwordCopied ? (
                    <>
                      <Check className="mr-1.5 h-4 w-4 shrink-0" />
                      {t.copied}
                    </>
                  ) : (
                    <>
                      <Copy className="mr-1.5 h-4 w-4 shrink-0" />
                      {t.copyPassword}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {createdPasswordProtected && !showPasswordShare ? (
          <div className="mx-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 sm:mx-6 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
            <p>
              <strong>{t.passwordProtectionEnabledTitle}</strong> {t.passwordProtectionEnabledBody}
            </p>
            <p className="mt-1">{t.passwordProtectionSendSeparately}</p>
          </div>
        ) : null}

        <div className="mx-4 rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-3.5 sm:mx-6 dark:border-gray-700 dark:bg-gray-900/40">
          {deliverySent && recipientLinkDelivery ? (
            <div className="text-sm text-emerald-900 dark:text-emerald-100" role="status">
              <p className="m-0 inline-flex items-center gap-1.5 font-medium">
                <Mail className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
                {t.recipientLinkDeliverySentTitle ?? "Link emailed"}
              </p>
              <p className="mt-1.5 m-0 text-xs leading-snug opacity-90">
                {(t.recipientLinkDeliverySentBody ?? "Sent to {email}.").replace(
                  "{email}",
                  recipientLinkDelivery.email,
                )}
              </p>
            </div>
          ) : (
            <form
              className="space-y-2"
              onSubmit={(event) => {
                event.preventDefault();
                submitRecipientLinkDelivery();
              }}
            >
              <label
                htmlFor="success-deliver-recipient-email"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-800 dark:text-gray-200"
              >
                <Mail className="h-4 w-4 shrink-0 text-violet-600 dark:text-violet-400" aria-hidden />
                {t.settingsDeliverRecipientEmail ?? "Email link to recipient"}
              </label>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
                <input
                  id="success-deliver-recipient-email"
                  type="email"
                  autoComplete="off"
                  inputMode="email"
                  value={deliverEmailInput}
                  onChange={(event) => setDeliverEmailInput(event.target.value)}
                  disabled={recipientLinkDeliveryRetrying || !canSubmitDelivery}
                  placeholder={
                    t.settingsDeliverRecipientEmailPlaceholder ?? "recipient@example.com"
                  }
                  className="min-w-0 flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200"
                />
                <button
                  type="submit"
                  disabled={recipientLinkDeliveryRetrying || !canSubmitDelivery}
                  className="inline-flex shrink-0 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {recipientLinkDeliveryRetrying
                    ? t.recipientLinkDeliveryRetrying ?? "Sending…"
                    : deliveryFailed
                      ? t.recipientLinkDeliveryRetry ?? "Try again"
                      : t.recipientLinkDeliverySend ?? "Send"}
                </button>
              </div>
              <p className="m-0 text-xs leading-snug text-gray-500 dark:text-gray-400">
                {t.settingsDeliverRecipientEmailHint ??
                  "Optional. Email is not end-to-end encrypted — prefer sharing the link yourself for highest sensitivity."}
              </p>
              {deliveryFailed && recipientLinkDelivery ? (
                <p className="m-0 text-xs leading-snug text-red-700 dark:text-red-300" role="alert">
                  {(
                    t.recipientLinkDeliveryFailedBody ??
                    "We could not send the link to {email}. You can still copy it above."
                  ).replace("{email}", recipientLinkDelivery.email)}
                </p>
              ) : null}
              {recipientLinkDeliveryGate === "sign_in" ? (
                <p className="m-0 text-xs leading-snug text-gray-500 dark:text-gray-400">
                  {t.recipientLinkDeliverySignInHint ??
                    "Sign in with Starter or Business to email the link —"}{" "}
                  <Link href={signInHref} className="font-medium text-primary hover:underline">
                    {t.settingsEmailAlertsSignInLink ?? "Sign in"}
                  </Link>
                </p>
              ) : null}
              {recipientLinkDeliveryGate === "upgrade" ? (
                <p className="m-0 text-xs leading-snug text-gray-500 dark:text-gray-400">
                  {t.recipientLinkDeliveryUpgradeHint ??
                    "Starter and Business can email the link —"}{" "}
                  <Link
                    href={premiumUpgradeHref}
                    className="font-medium text-primary hover:underline"
                  >
                    {t.settingsDeliveryUpgradeLink ?? "Upgrade to unlock delivery controls"}
                  </Link>
                </p>
              ) : null}
              {recipientLinkDeliveryGate === "verify_email" ? (
                <p className="m-0 text-xs leading-snug text-amber-800 dark:text-amber-200">
                  {t.recipientLinkDeliveryVerifyEmailHint ??
                    "Verify your account email before we can send the link for you."}
                </p>
              ) : null}
            </form>
          )}
        </div>

        <div className="px-4 sm:px-6">
          <ChromeExtensionOnboardingBanner />
        </div>

        <section className="relative mt-14 sm:mt-16 mb-6 sm:mb-8 w-full px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-2 md:gap-5 xl:gap-6">
            <div
              role="button"
              tabIndex={0}
              aria-pressed={selectedDoDont === "do"}
              onClick={() => setSelectedDoDont((s) => (s === "do" ? null : "do"))}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedDoDont((s) => (s === "do" ? null : "do"));
                }
              }}
              className={`rounded-xl border bg-white dark:bg-gray-900 p-5 sm:p-6 cursor-pointer select-none transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950 border-emerald-200/80 dark:border-emerald-800/35 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99] ${
                selectedDoDont === "do"
                  ? "-translate-y-0.5 scale-[1.02] shadow-md ring-1 ring-emerald-300/50 dark:ring-emerald-700/40"
                  : ""
              }`}
            >
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2.5">
                <Check
                  className="h-5 w-5 shrink-0 text-emerald-600/75 dark:text-emerald-500/65"
                  strokeWidth={2.4}
                  aria-hidden
                />
                {t.successDosTitle}
              </h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 list-disc list-inside marker:text-emerald-600/45 dark:marker:text-emerald-500/40">
                <li>{t.successDoStoreLink}</li>
                <li>{t.successDoUsePassword}</li>
                <li>
                  {t.successDoUsePrefix}{" "}
                  <Link
                    href={localizedPath("/password-generator", language)}
                    className="text-primary hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {t.successOurPasswordGenerator}
                  </Link>{" "}
                  {t.successDoStrongPasswordsSuffix}
                </li>
              </ul>
            </div>
            <div
              role="button"
              tabIndex={0}
              aria-pressed={selectedDoDont === "dont"}
              onClick={() => setSelectedDoDont((s) => (s === "dont" ? null : "dont"))}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedDoDont((s) => (s === "dont" ? null : "dont"));
                }
              }}
              className={`rounded-xl border bg-white dark:bg-gray-900 p-5 sm:p-6 cursor-pointer select-none transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950 border-rose-200/80 dark:border-rose-800/35 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99] ${
                selectedDoDont === "dont"
                  ? "-translate-y-0.5 scale-[1.02] shadow-md ring-1 ring-rose-300/50 dark:ring-rose-700/40"
                  : ""
              }`}
            >
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2.5">
                <X
                  className="h-5 w-5 shrink-0 text-rose-600/75 dark:text-rose-500/65"
                  strokeWidth={2.4}
                  aria-hidden
                />
                {t.successDontsTitle}
              </h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 list-disc list-inside marker:text-rose-600/45 dark:marker:text-rose-500/40">
                <li>{t.successDontShareUnsecured}</li>
                <li>{t.successDontAssumeRecoverable}</li>
                <li>{t.successDontDelaySharing}</li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      <Dialog open={showSuccessQr} onOpenChange={setShowSuccessQr}>
        <DialogContent className="max-w-xs gap-4 p-5 sm:rounded-2xl">
          <DialogTitle className="text-center text-base">{qrScanLabel}</DialogTitle>
          <DialogDescription className="sr-only">{qrScanLabel}</DialogDescription>
          <div ref={successQrSectionRef} className="flex flex-col items-center gap-3">
            <div
              className="flex justify-center rounded-xl bg-white p-3 dark:bg-gray-950"
              id="note-qr-code"
            >
              <QRCode value={successUrl} size={200} />
            </div>
            <div className="flex w-full flex-col gap-2">
              <button
                type="button"
                onClick={() => void onShareQrCode()}
                className={ghostBtn}
                title={t.shareQrImage}
              >
                <Share2 className="mr-1.5 h-4 w-4 shrink-0 text-primary" />
                {t.share}
              </button>
              <button
                type="button"
                onClick={() => void onDownloadQrCode()}
                className="inline-flex items-center justify-center rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                title={t.downloadQrCodeAsSvg}
              >
                <FileText className="mr-1.5 h-4 w-4 shrink-0" />
                {t.downloadQrCode}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={revokeDialogOpen}
        onOpenChange={(open) => {
          if (!open && !revoking) setRevokeDialogOpen(false);
          else setRevokeDialogOpen(open);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t.notificationRevokeDialogTitle ?? "Revoke this note?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t.notificationRevokeDialogBody ??
                "The secret link will stop working immediately. This only works if the note has not been opened yet."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={revoking}>{t.cancel ?? "Cancel"}</AlertDialogCancel>
            <AlertDialogAction
              disabled={revoking || !onRevoke}
              onClick={(event) => {
                event.preventDefault();
                if (!onRevoke) return;
                void (async () => {
                  try {
                    await onRevoke();
                    setRevokeDialogOpen(false);
                  } catch {
                    // Keep dialog open on failure; parent shows a toast.
                  }
                })();
              }}
              className="bg-rose-600 hover:bg-rose-700 focus:ring-rose-600"
            >
              {revoking
                ? t.notificationRevoking ?? "Revoking..."
                : t.notificationRevokeConfirm ?? burnLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};
