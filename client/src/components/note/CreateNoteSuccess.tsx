import React from "react";
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
} from "lucide-react";
import { ChromeExtensionOnboardingBanner } from "./ChromeExtensionOnboardingBanner";

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
  recipientVerificationCode?: string;
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
  onShareLink: () => Promise<void>;
  onShareQrCode: () => Promise<void>;
  onDownloadQrCode: () => Promise<void>;
  onCreateNewNote: () => void;
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
  onShareLink,
  onShareQrCode,
  onDownloadQrCode,
  onCreateNewNote,
  successQrSectionRef,
  variant = "note",
}) => {
  const { language, t } = useLanguage();
  const isFileTransfer = variant === "file-transfer";
  const createdNoteMeta = createdNote.meta;
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

        {createdPasswordProtected && (
          <div className="my-8 sm:my-10 mx-4 sm:mx-0 rounded-lg p-4 text-sm border bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200">
            <p>
              <strong>{t.passwordProtectionEnabledTitle}</strong> {t.passwordProtectionEnabledBody}
            </p>
            <p className="mt-1">{t.passwordProtectionSendSeparately}</p>
          </div>
        )}

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
    </section>
  );
};
