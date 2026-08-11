import React, { useState } from "react";
import type { RefObject } from "react";
import { Link } from "wouter";
import { useLanguage } from "@/context/LanguageContext";
import { localizedPath } from "@/utils/localizedPath";
import { QRCode } from "@/components/ui/qr-code";
import {
  noteExpiryPresetDisplayLabel,
  type NoteExpiryPresetId,
} from "@shared/noteExpiry";
import {
  Share2,
  CircleHelp,
  QrCode,
  Check,
  Copy,
  RefreshCw,
  FileText,
  X,
  Mail,
  Key,
  Eye,
  EyeOff,
  Tag,
  Ban,
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

export type RecipientLinkDeliveryGate = "ready" | "sign_in" | "upgrade" | "verify_email";

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
  if (expiryValue === "14d") return t.expiry14d ?? noteExpiryPresetDisplayLabel(expiryValue);
  if (expiryValue === "15d") return t.expiry15d ?? noteExpiryPresetDisplayLabel(expiryValue);
  if (expiryValue === "30d") return t.expiry30d ?? noteExpiryPresetDisplayLabel(expiryValue);
  return noteExpiryPresetDisplayLabel(expiryValue);
}

function deletedAfterMessage(
  t: Record<string, string>,
  readCount: number,
  expiryLabel: string,
  isFileTransfer: boolean,
): string {
  if (readCount === 1) {
    const key = isFileTransfer
      ? "successTransferDeletedAfterOneRead"
      : "successNoteDeletedAfterOneRead";
    return t[key].replace("{expiry}", expiryLabel);
  }
  const key = isFileTransfer
    ? "successTransferDeletedAfterManyReads"
    : "successNoteDeletedAfterManyReads";
  return t[key].replace("{count}", String(readCount)).replace("{expiry}", expiryLabel);
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
  showSuccessHelp,
  setShowSuccessHelp,
  showQrHelp,
  setShowQrHelp,
  selectedDoDont,
  setSelectedDoDont,
  successLinkCopied,
  onCopyLink,
  onDeliverRecipientLink,
  recipientLinkDeliveryGate = "upgrade",
  recipientLinkDeliveryRetrying = false,
  onShareLink,
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
  const isFileTransfer = variant === "file-transfer";
  const createdNoteMeta = createdNote.meta;

  React.useEffect(() => {
    const emailed = createdNote.meta?.recipientLinkDelivery?.email;
    if (!emailed) return;
    setDeliverEmailInput((current) => (current.trim() ? current : emailed));
  }, [createdNote.meta?.recipientLinkDelivery?.email]);

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
    expiryValue: createdExpiryValue,
    readCount: createdReadCount,
    isPasswordProtected: createdPasswordProtected,
    recipientVerificationCode,
    recipientLinkDelivery,
  } = createdNoteMeta;

  const expiryLabel = translatedExpiryLabel(createdExpiryValue, t);
  const anyoneWithLinkMessage = isFileTransfer
    ? t.anyoneWithLinkCanReadTransfer
    : t.anyoneWithLinkCanReadNote;
  const createAnotherLabel = isFileTransfer ? t.createAnotherTransfer : t.createAnotherNote;
  const linkAriaLabel = isFileTransfer ? t.encryptedTransferLink : t.encryptedNoteLink;
  const headingPrefix = isFileTransfer ? t.yourSecureTransferIs : t.yourSecureNoteIs;
  const subtitleLine = isFileTransfer ? t.transferEncryptedInBrowser : t.noteEncryptedInBrowser;
  const qrViewMessage = isFileTransfer
    ? t.anyoneWithCodeCanViewTransfer
    : t.anyoneWithCodeCanViewNote;
  const premiumUpgradeHref = localizedPath("/premium", language);
  const signInHref = localizedPath("/auth/sign-in", language);
  const deliverySent = recipientLinkDelivery?.status === "sent";
  const deliveryFailed = recipientLinkDelivery?.status === "failed";
  const canSubmitDelivery = recipientLinkDeliveryGate === "ready" && Boolean(onDeliverRecipientLink);

  const submitRecipientLinkDelivery = () => {
    if (!onDeliverRecipientLink || !canSubmitDelivery || recipientLinkDeliveryRetrying) return;
    void onDeliverRecipientLink(deliverEmailInput.trim());
  };

  const notePassword = createdPassword?.trim() ?? "";
  const showPasswordShare = createdPasswordProtected && notePassword.length > 0;
  const showNoteLabel =
    Boolean(createdNoteMeta.tracksDelivery) &&
    Boolean(createdNoteMeta.noteId) &&
    typeof onNoteLabelChange === "function";

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
        // Share password alone — never bundle it with the note link.
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

  return (
    <section className="w-full max-w-4xl mx-auto py-4 sm:py-6">
      <div className="space-y-6 sm:space-y-7">
        <section className="px-4 pb-1 sm:px-6 lg:px-8 pt-2">
          <div className="text-center">
            <h1 className="page-title text-gray-900 dark:text-white">
              {headingPrefix} <span className="text-primary italic">{t.ready}</span>
            </h1>
            <div className="mt-3 max-w-4xl mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-5xl space-y-1 md:space-y-2">
              <p className="m-0">{subtitleLine}</p>
              <p className="m-0">{t.onlySomeoneWithLinkCanRead}</p>
            </div>
          </div>
        </section>

        <div className="mb-12 py-4 sm:py-6 px-4 sm:px-6">
          <div className="w-full max-w-none mx-auto">
            <div className="p-0 sm:p-0 break-words">
              <div className="flex flex-col space-y-5 sm:space-y-6">
                <div className="relative flex min-h-10 items-center justify-center sm:min-h-0 sm:justify-between">
                  <button
                    onClick={() => void onShareLink()}
                    type="button"
                    className="absolute left-0 inline-flex items-center justify-center py-2.5 px-6 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50/80 dark:hover:bg-gray-800/80 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-150 sm:static"
                    title={t.shareLink}
                  >
                    <Share2 className="h-4 w-4 mr-1.5 text-primary shrink-0" />
                    {t.share}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSuccessHelp((open) => !open)}
                    aria-expanded={showSuccessHelp}
                    aria-label={t.showSecurityTips}
                    className="absolute right-0 inline-flex items-center justify-center h-10 w-10 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50/80 dark:hover:bg-gray-800/80 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-150 sm:static"
                  >
                    <CircleHelp className="h-5 w-5 text-primary" />
                  </button>
                </div>

                {recipientVerificationCode ? (
                  <div
                    className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3.5 text-sm text-amber-950 dark:border-amber-800/60 dark:bg-amber-900/20 dark:text-amber-100"
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

                {showSuccessHelp && (
                  <div
                    className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/35 px-4 py-3.5 sm:px-5 sm:py-4 text-sm leading-snug text-blue-900 dark:text-blue-100"
                    role="note"
                  >
                    <div className="space-y-2">
                      <p className="m-0">{anyoneWithLinkMessage}</p>
                      <p className="m-0">{t.linkCannotBeRecovered}</p>
                      <p className="m-0">
                        {deletedAfterMessage(t, createdReadCount, expiryLabel, isFileTransfer)}
                      </p>
                    </div>
                  </div>
                )}

                <div className="overflow-hidden rounded-lg border-2 border-primary">
                  <div className="bg-primary px-3 py-2 text-xs sm:text-sm font-semibold uppercase tracking-wide text-white">
                    {t.secureLink}
                  </div>
                  <div className="flex items-center bg-white dark:bg-gray-900 p-3 transition-transform active:scale-[1.02]">
                    <input
                      type="text"
                      readOnly
                      value={successUrl}
                      className="w-full bg-transparent text-sm text-gray-800 dark:text-gray-200 select-text focus:outline-none focus:ring-2 focus:ring-primary/40 rounded-sm touch-manipulation"
                      aria-label={linkAriaLabel}
                      onFocus={(event) => event.currentTarget.select()}
                    />
                  </div>
                </div>

                <div className="mt-8 sm:mt-10 pt-2 pb-5">
                  <div className="flex flex-col items-stretch gap-3 sm:hidden">
                    <button
                      type="button"
                      onClick={() => void onCopyLink()}
                      className={`inline-flex w-full items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-md shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                        successLinkCopied
                          ? "bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-500"
                          : "bg-primary text-white hover:bg-primary/90 focus-visible:ring-primary"
                      }`}
                      title={t.copyLinkToClipboard}
                      aria-live="polite"
                    >
                      {successLinkCopied ? (
                        <>
                          <Check className="h-4 w-4 mr-1.5 shrink-0" />
                          {t.linkCopied}
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1.5 shrink-0" />
                          {t.copyLink}
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowSuccessQr((open) => !open)}
                      aria-expanded={showSuccessQr}
                      className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-sm py-1"
                    >
                      <QrCode className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                      {t.shareViaQrCode}
                    </button>
                    <button
                      type="button"
                      onClick={onCreateNewNote}
                      className="inline-flex w-full items-center justify-center py-2.5 px-6 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50/80 dark:hover:bg-gray-800/80 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-150 whitespace-nowrap"
                    >
                      <RefreshCw className="h-4 w-4 mr-1.5 text-primary shrink-0" />
                      {createAnotherLabel}
                    </button>
                  </div>

                  <div className="hidden sm:grid sm:grid-cols-[auto,minmax(0,1fr),auto] sm:items-center sm:gap-3">
                    <button
                      type="button"
                      onClick={() => setShowSuccessQr((open) => !open)}
                      aria-expanded={showSuccessQr}
                      aria-label={showSuccessQr ? t.hideQrCode : t.shareViaQrCode}
                      className="inline-flex shrink-0 items-center justify-center whitespace-nowrap py-2.5 px-6 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50/80 dark:hover:bg-gray-800/80 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-150"
                    >
                      <QrCode className="h-4 w-4 mr-1.5 shrink-0 text-primary" aria-hidden />
                      {t.shareViaQrCode}
                    </button>
                    <button
                      type="button"
                      onClick={() => void onCopyLink()}
                      className={`inline-flex w-full items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-md shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                        successLinkCopied
                          ? "bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-500"
                          : "bg-primary text-white hover:bg-primary/90 focus-visible:ring-primary"
                      }`}
                      title={t.copyLinkToClipboard}
                      aria-live="polite"
                    >
                      {successLinkCopied ? (
                        <>
                          <Check className="h-4 w-4 mr-1.5 shrink-0" />
                          {t.linkCopied}
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1.5 shrink-0" />
                          {t.copyLink}
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={onCreateNewNote}
                      className="inline-flex items-center justify-center py-2.5 px-6 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50/80 dark:hover:bg-gray-800/80 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-150 whitespace-nowrap"
                    >
                      <RefreshCw className="h-4 w-4 mr-1.5 text-primary shrink-0" />
                      {createAnotherLabel}
                    </button>
                  </div>
                </div>

                {showPasswordShare ? (
                  <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
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
                          className="inline-flex flex-1 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
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

                {showNoteLabel ? (
                  <div className="rounded-lg border border-gray-200 bg-gray-50/80 px-4 py-3.5 dark:border-gray-700 dark:bg-gray-900/40">
                    <label
                      htmlFor="success-note-label"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-800 dark:text-gray-200"
                    >
                      <Tag className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />
                      {t.successNoteLabelTitle ?? t.settingsNoteLabel ?? "Name this note"}
                    </label>
                    <input
                      id="success-note-label"
                      type="text"
                      maxLength={NOTE_LABEL_MAX_LENGTH}
                      value={noteLabel}
                      onChange={(event) => onNoteLabelChange?.(event.target.value)}
                      placeholder={
                        t.successNoteLabelPlaceholder ??
                        t.settingsNoteLabelPlaceholder ??
                        "e.g. Client onboarding pack"
                      }
                      className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200"
                    />
                    <p className="m-0 mt-1.5 text-xs leading-snug text-gray-500 dark:text-gray-400">
                      {t.successNoteLabelHint ??
                        "Shown in Activity on this device so you can recognize tracked notes. Never sent with the link."}
                    </p>
                  </div>
                ) : null}

                <div className="rounded-lg border border-gray-200 bg-gray-50/80 px-4 py-3.5 dark:border-gray-700 dark:bg-gray-900/40">
                  {deliverySent && recipientLinkDelivery ? (
                    <div
                      className="text-sm text-emerald-900 dark:text-emerald-100"
                      role="status"
                    >
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

                {canRevoke || noteRevoked ? (
                  <div className="rounded-lg border border-gray-200 bg-white px-4 py-3.5 dark:border-gray-700 dark:bg-gray-950/40">
                    {noteRevoked ? (
                      <div className="text-sm text-rose-900 dark:text-rose-100" role="status">
                        <p className="m-0 inline-flex items-center gap-1.5 font-medium">
                          <Ban className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" aria-hidden />
                          {t.notificationRevokeSuccessTitle ?? "Note revoked"}
                        </p>
                        <p className="mt-1.5 m-0 text-xs leading-snug opacity-90">
                          {t.notificationRevokeSuccessBody ?? "The link can no longer be opened."}
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <p className="m-0 inline-flex items-center gap-1.5 text-sm font-medium text-gray-800 dark:text-gray-200">
                            <Ban className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" aria-hidden />
                            {t.successRevokeTitle ?? "Revoke before it is opened"}
                          </p>
                          <p className="mt-1 m-0 text-xs leading-snug text-gray-500 dark:text-gray-400">
                            {t.successRevokeHint ??
                              "Changed your mind? Destroy this link now. You can also revoke later from Activity."}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setRevokeDialogOpen(true)}
                          disabled={revoking || !onRevoke}
                          className="inline-flex shrink-0 items-center justify-center rounded-md border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-700 shadow-sm transition-colors hover:bg-rose-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/40 disabled:cursor-not-allowed disabled:opacity-60 dark:border-rose-900 dark:bg-gray-950 dark:text-rose-300 dark:hover:bg-rose-950/40"
                        >
                          {revoking
                            ? t.notificationRevoking ?? "Revoking..."
                            : t.notificationRevokeConfirm ?? "Revoke link"}
                        </button>
                      </div>
                    )}
                  </div>
                ) : null}

                <div className="pt-5 sm:pt-6 w-full flex flex-col items-center">
                  {showSuccessQr && (
                    <div
                      ref={successQrSectionRef}
                      className="mt-6 sm:mt-10 mx-auto flex w-full max-w-xs flex-col items-center gap-4"
                    >
                      <div className="w-full flex items-center justify-between">
                        <button
                          onClick={() => void onShareQrCode()}
                          type="button"
                          className="inline-flex items-center justify-center py-2.5 px-6 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50/80 dark:hover:bg-gray-800/80 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-150"
                          title={t.shareQrImage}
                        >
                          <Share2 className="h-4 w-4 mr-1.5 shrink-0 text-primary" />
                          {t.share}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowQrHelp((open) => !open)}
                          aria-expanded={showQrHelp}
                          aria-label={t.showQrCodeTips}
                          className="inline-flex items-center justify-center h-10 w-10 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50/80 dark:hover:bg-gray-800/80 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-150"
                        >
                          <CircleHelp className="h-5 w-5 text-primary" />
                        </button>
                      </div>
                      {showQrHelp && (
                        <div className="w-full rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/35 px-3 py-3 text-sm leading-snug text-blue-900 dark:text-blue-100">
                          <ul className="list-disc pl-4 space-y-1.5">
                            <li>{t.scanToOpenMobile}</li>
                            <li>{qrViewMessage}</li>
                            <li>{t.codeCannotBeRecovered}</li>
                          </ul>
                        </div>
                      )}
                      <div className="w-full overflow-hidden rounded-lg border-2 border-primary/70 dark:border-primary/70">
                        <div className="bg-primary/70 px-3 py-1.5">
                          <div className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-white text-center leading-tight">
                            {t.qrCode}
                          </div>
                        </div>
                        <div
                          className="flex justify-center bg-white dark:bg-gray-950 p-3 sm:p-4"
                          id="note-qr-code"
                        >
                          <QRCode value={successUrl} size={200} />
                        </div>
                      </div>
                      <div className="flex w-full items-center justify-center">
                        <button
                          onClick={() => void onDownloadQrCode()}
                          type="button"
                          className="inline-flex items-center justify-center px-3 py-2.5 text-sm font-semibold bg-primary/70 text-white rounded-md transition-colors hover:bg-primary/80 shadow-sm"
                          title={t.downloadQrCodeAsSvg}
                        >
                          <FileText className="h-4 w-4 mr-1.5 shrink-0" />
                          {t.downloadQrCode}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <ChromeExtensionOnboardingBanner />
              </div>
            </div>
          </div>
        </div>

        {createdPasswordProtected && !showPasswordShare ? (
          <div className="my-8 sm:my-10 mx-4 sm:mx-0 rounded-lg p-4 text-sm border bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200">
            <p>
              <strong>{t.passwordProtectionEnabledTitle}</strong> {t.passwordProtectionEnabledBody}
            </p>
            <p className="mt-1">{t.passwordProtectionSendSeparately}</p>
          </div>
        ) : null}

        <section className="relative mt-24 sm:mt-28 mb-6 sm:mb-8 w-full px-4 sm:px-6 lg:px-8">
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
                : t.notificationRevokeConfirm ?? "Revoke link"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};
