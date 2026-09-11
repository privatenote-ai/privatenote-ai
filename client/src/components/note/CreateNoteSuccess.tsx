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
  ChevronDown,
  ChevronUp,
  CircleHelp,
  CirclePlus,
  Copy,
  Eye,
  EyeOff,
  FileText,
  GripVertical,
  Key,
  Link2,
  Mail,
  MessageSquare,
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
  DEFAULT_SUCCESS_SHARE_ORDER,
  PINNED_SUCCESS_SHARE_COUNT,
  moveShareShortcut,
  readShareShortcutOrder,
  shareChannelHref,
  shareChannelKind,
  writeShareShortcutOrder,
  type SuccessShareChannelId,
} from "@/utils/successShareShortcuts";
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

function TelegramGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        fill="currentColor"
        d="M21.5 3.6 2.8 10.8c-1.3.5-1.3 1.2-.2 1.5l4.8 1.5 11.1-7c.5-.3 1-.1.6.2l-9 8.2-.3 4.8c.5 0 .7-.2 1-.5l2.4-2.3 5 3.7c.9.5 1.6.2 1.8-.9l3.3-15.4c.3-1.3-.5-1.9-1.4-1.5z"
      />
    </svg>
  );
}

function SignalGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        fill="currentColor"
        d="M12 2.1c-5.4 0-9.8 4.3-9.8 9.6 0 1.7.4 3.3 1.2 4.7L2 21.8l5.6-1.5c1.4.7 2.9 1.1 4.4 1.1 5.4 0 9.8-4.3 9.8-9.7S17.4 2.1 12 2.1zm0 17.4c-1.4 0-2.7-.3-3.9-.9l-.3-.1-3.3.9.9-3.2-.2-.3c-.7-1.2-1.1-2.5-1.1-3.9 0-4.3 3.6-7.8 7.9-7.8s7.9 3.5 7.9 7.8-3.6 7.8-7.9 7.8z"
      />
    </svg>
  );
}

function DiscordGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        fill="currentColor"
        d="M19.3 5.3A17.4 17.4 0 0 0 15 4c-.2.4-.5.9-.6 1.3a15.4 15.4 0 0 0-4.8 0C9.4 4.9 9.1 4.4 8.9 4 7.4 4.3 6 4.8 4.7 5.4 2 9.5 1.3 13.4 1.6 17.3c1.8 1.3 3.5 2.1 5.2 2.7.4-.6.8-1.2 1.1-1.8-.6-.2-1.2-.5-1.7-.8.1-.1.3-.2.4-.3 3.4 1.6 7.1 1.6 10.5 0 .1.1.3.2.4.3-.5.3-1.1.6-1.7.8.3.6.7 1.2 1.1 1.8 1.7-.5 3.5-1.3 5.3-2.7.4-3.9-.7-7.8-3.1-12zm-11 9.6c-1 0-1.9-1-1.9-2.1s.8-2.2 1.9-2.2 1.9 1 1.9 2.2-.8 2.1-1.9 2.1zm6.9 0c-1 0-1.9-1-1.9-2.1s.8-2.2 1.9-2.2 1.9 1 1.9 2.2-.8 2.1-1.9 2.1z"
      />
    </svg>
  );
}

function TeamsGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        fill="currentColor"
        d="M16.6 8.2a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4zM8.4 9.1H3.9c-.6 0-1.1.5-1.1 1.1v8.2c0 .6.5 1.1 1.1 1.1h4.5c.6 0 1.1-.5 1.1-1.1v-8.2c0-.6-.5-1.1-1.1-1.1zm11.2.3h-5.1c-.5 0-.9.4-.9.9v7.6c0 1.7 1.4 3.1 3.2 3.1 1.9 0 3.7-1.5 3.7-3.4v-7.3c0-.5-.4-.9-.9-.9zM8.2 7.6A2.6 2.6 0 1 0 8.2 2a2.6 2.6 0 0 0 0 5.6z"
      />
    </svg>
  );
}

function ShareChannelGlyph({ id }: { id: SuccessShareChannelId }) {
  switch (id) {
    case "email":
      return <Mail className="h-5 w-5" aria-hidden />;
    case "whatsapp":
      return <WhatsAppGlyph />;
    case "slack":
      return <SlackGlyph />;
    case "qr":
      return <QrCode className="h-5 w-5" aria-hidden />;
    case "telegram":
      return <TelegramGlyph />;
    case "signal":
      return <SignalGlyph />;
    case "discord":
      return <DiscordGlyph />;
    case "teams":
      return <TeamsGlyph />;
    case "sms":
      return <MessageSquare className="h-5 w-5" aria-hidden />;
  }
}

function shareChannelIconClass(id: SuccessShareChannelId): string {
  switch (id) {
    case "whatsapp":
      return "text-[#25D366]";
    case "telegram":
      return "text-[#229ED9]";
    case "signal":
      return "text-[#3A76F0]";
    case "discord":
      return "text-[#5865F2]";
    case "teams":
      return "text-[#6264A7]";
    case "sms":
      return "text-emerald-600 dark:text-emerald-400";
    default:
      return "text-primary";
  }
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
  const [nameEditing, setNameEditing] = useState(false);
  const [linkInspecting, setLinkInspecting] = useState(false);
  const [shareOrder, setShareOrder] = useState<SuccessShareChannelId[]>(() => [
    ...DEFAULT_SUCCESS_SHARE_ORDER,
  ]);
  const [showShareMore, setShowShareMore] = useState(false);
  const [draggingShareId, setDraggingShareId] = useState<SuccessShareChannelId | null>(null);
  const copyResetRef = useRef<number | null>(null);
  const copyInFlightRef = useRef(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
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

  useEffect(() => {
    if (!nameEditing) return;
    nameInputRef.current?.focus();
    nameInputRef.current?.select();
  }, [nameEditing]);

  useEffect(() => {
    setShareOrder(readShareShortcutOrder());
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
  const copiedLabel = t.successCopied ?? t.copied ?? "Copied";
  const nameActionLabel = t.successNameThisNote ?? "Name this note";
  const nameEditLabel = t.successNameEdit ?? "Edit";
  const burnLabel = t.successBurnThisOne ?? "Burn this one";
  const shareYourWay = t.successShareItYourWay ?? "Share it your way";
  const qrScanLabel = t.successQrScanToOpen ?? "Scan to open this secure note";
  const labelValue = onNoteLabelChange ? noteLabel : localLabel;
  const trimmedLabel = labelValue.trim();
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

  const shareMore = () => setShowShareMore(true);

  const commitShareOrder = (next: SuccessShareChannelId[]) => {
    setShareOrder(next);
    writeShareShortcutOrder(next);
  };

  const shareChannelLabel = (id: SuccessShareChannelId): string => {
    switch (id) {
      case "email":
        return t.successShareEmail ?? "Email";
      case "whatsapp":
        return t.successShareWhatsApp ?? "WhatsApp";
      case "slack":
        return t.successShareSlack ?? "Slack";
      case "qr":
        return t.qrCode ?? "QR Code";
      case "telegram":
        return t.successShareTelegram ?? "Telegram";
      case "signal":
        return t.successShareSignal ?? "Signal";
      case "discord":
        return t.successShareDiscord ?? "Discord";
      case "teams":
        return t.successShareTeams ?? "Teams";
      case "sms":
        return t.successShareSms ?? "SMS";
    }
  };

  const copyLinkForApp = async (appName: string) => {
    try {
      await navigator.clipboard.writeText(successUrl);
      toast({
        title: t.copied ?? "Copied",
        description: (t.successShareCopiedForApp ?? "Copied — paste this link in {app}.").replace(
          "{app}",
          appName,
        ),
      });
    } catch {
      toast({
        title: t.toastCouldNotCopyLinkTitle ?? "Could not copy",
        description: t.toastCouldNotCopyLinkDesc ?? "Copy the link manually.",
        variant: "destructive",
      });
    }
  };

  const activateShareChannel = (id: SuccessShareChannelId) => {
    if (id === "qr") {
      setShowShareMore(false);
      setShowSuccessQr(true);
      return;
    }
    if (shareChannelKind(id) === "copy-app") {
      void copyLinkForApp(shareChannelLabel(id));
    }
  };

  const nativeShare = async () => {
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

  const pinnedShareIds = shareOrder.slice(0, PINNED_SUCCESS_SHARE_COUNT);

  const shareActionClass =
    "success-share-action group flex min-h-11 min-w-[4.5rem] flex-col items-center justify-center gap-1.5 rounded-lg px-1 py-1.5 text-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40";
  const shareIconClass =
    "flex h-11 w-11 items-center justify-center rounded-full transition-colors group-hover:bg-gray-100 group-focus-visible:bg-gray-100 dark:group-hover:bg-gray-800 dark:group-focus-visible:bg-gray-800";

  return (
    <section className="mx-auto w-full max-w-[980px] py-2 sm:py-4">
      <div>
        <section className="px-4 sm:px-6 lg:px-8 pt-1">
          <div className="text-center">
            <h1 className="page-title text-gray-900 dark:text-white">
              {headingPrefix} <span className="text-primary italic">{t.ready}</span>
            </h1>
            <div className="mt-2 max-w-3xl mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-3 md:text-xl space-y-1">
              <p className="m-0">{subtitleLine}</p>
              <p className="m-0">{t.onlySomeoneWithLinkCanRead}</p>
            </div>
          </div>
        </section>

        {recipientVerificationCode ? (
          <div
            className="mx-4 mt-8 sm:mx-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-sm text-amber-950 dark:border-amber-800/60 dark:bg-amber-900/20 dark:text-amber-100"
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

        <div className="relative mt-11 px-4 sm:mt-12 sm:px-6">
          <div className="mx-auto w-full max-w-[960px] rounded-[20px] border border-gray-200/90 bg-white px-5 py-6 shadow-[0_10px_28px_-18px_rgba(15,23,42,0.28)] sm:px-7 sm:py-7 dark:border-gray-800 dark:bg-gray-950 dark:shadow-[0_10px_28px_-18px_rgba(0,0,0,0.65)]">
            <div className={`flex gap-2.5 sm:gap-3 ${linkInspecting ? "items-start" : "items-center"}`}>
              <div className="success-plain-field flex min-w-0 flex-1 items-start gap-2.5 rounded-[13px] border border-gray-200 bg-[#f7faff] px-3 py-2 dark:border-gray-700 dark:bg-gray-950">
                <Link2
                  className="mt-0.5 h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400"
                  aria-hidden
                />
                <textarea
                  readOnly
                  rows={linkInspecting ? 3 : 1}
                  value={successUrl}
                  title={successUrl}
                  className={`min-w-0 flex-1 resize-none bg-transparent text-sm font-medium text-gray-950 select-text shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-sm dark:text-white ${
                    linkInspecting
                      ? "min-h-[4.25rem] leading-snug break-all"
                      : "h-6 overflow-hidden whitespace-nowrap [text-overflow:ellipsis]"
                  }`}
                  aria-label={linkAriaLabel}
                  onFocus={(event) => {
                    setLinkInspecting(true);
                    event.currentTarget.select();
                  }}
                  onBlur={() => setLinkInspecting(false)}
                />
              </div>
              <button
                type="button"
                onClick={() => void copySecureUrl()}
                disabled={noteRevoked}
                className={`success-primary-btn inline-flex h-11 min-w-[7.5rem] shrink-0 items-center justify-center gap-1.5 rounded-md px-5 text-sm font-semibold text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                  linkCopied
                    ? "bg-emerald-600 hover:bg-emerald-600 focus-visible:ring-emerald-500"
                    : "bg-primary hover:bg-primary/90 focus-visible:ring-primary"
                }`}
                title={t.copyLinkToClipboard}
                aria-live="polite"
              >
                {linkCopied ? (
                  <>
                    <Check className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    {copiedLabel}
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    {copyLabel}
                  </>
                )}
              </button>
            </div>

            <div className="mt-4 flex flex-col items-center gap-1 sm:mt-5 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-1">
              {nameEditing ? (
                <label className="flex min-w-0 w-full max-w-md items-center gap-2 rounded-lg px-2 py-1.5 sm:w-auto sm:min-w-[16rem]">
                  <Tag className="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500" aria-hidden />
                  <span className="sr-only">{nameActionLabel}</span>
                  <input
                    id="success-note-label"
                    ref={nameInputRef}
                    type="text"
                    maxLength={NOTE_LABEL_MAX_LENGTH}
                    value={labelValue}
                    onChange={(event) => handleLabelChange(event.target.value)}
                    onBlur={() => setNameEditing(false)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === "Escape") {
                        event.preventDefault();
                        setNameEditing(false);
                      }
                    }}
                    placeholder={nameActionLabel}
                    className="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm text-gray-950 placeholder:text-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-sm dark:text-gray-100 dark:placeholder:text-gray-400"
                  />
                </label>
              ) : (
                <button
                  type="button"
                  onClick={() => setNameEditing(true)}
                  className="success-quiet-btn inline-flex min-h-11 min-w-0 max-w-full items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                >
                  <Tag className="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500" aria-hidden />
                  {trimmedLabel ? (
                    <>
                      <span className="truncate">{trimmedLabel}</span>
                      <span className="shrink-0 text-gray-400" aria-hidden>
                        ·
                      </span>
                      <span className="shrink-0 text-primary">{nameEditLabel}</span>
                    </>
                  ) : (
                    nameActionLabel
                  )}
                </button>
              )}

              <div
                className="hidden h-7 w-px shrink-0 bg-gray-200 sm:block lg:mx-1 dark:bg-gray-700"
                aria-hidden
              />

              <button
                type="button"
                onClick={onCreateNewNote}
                className="success-quiet-btn inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/[0.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
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
                      className="success-quiet-btn inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 hover:text-rose-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/50 disabled:cursor-not-allowed disabled:opacity-60 dark:text-rose-400 dark:hover:bg-rose-950/40 dark:hover:text-rose-300"
                    >
                      <Trash2 className="h-4 w-4 shrink-0" aria-hidden />
                      {revoking ? t.notificationRevoking ?? "Revoking..." : burnLabel}
                    </button>
                  )}
                </>
              ) : null}
            </div>

            <div className="mt-4 border-t border-gray-200 pt-4 sm:mt-5 sm:pt-5 dark:border-gray-800">
              <div className="grid grid-cols-3 gap-x-1 gap-y-2 sm:grid-cols-5 sm:gap-2">
                {pinnedShareIds.map((id) => {
                  const kind = shareChannelKind(id);
                  const href = shareChannelHref(id, successUrl);
                  const label = shareChannelLabel(id);
                  const inner = (
                    <>
                      <span className={`${shareIconClass} ${shareChannelIconClass(id)}`}>
                        <ShareChannelGlyph id={id} />
                      </span>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {label}
                      </span>
                    </>
                  );
                  if (kind === "link" && href) {
                    const external = id !== "email" && id !== "sms" && id !== "signal";
                    return (
                      <a
                        key={id}
                        href={href}
                        className={shareActionClass}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                        onClick={
                          id === "signal"
                            ? () => void copyLinkForApp(label)
                            : undefined
                        }
                        aria-label={
                          (t.successShareViaApp ?? "Share via {app}").replace("{app}", label)
                        }
                      >
                        {inner}
                      </a>
                    );
                  }
                  return (
                    <button
                      key={id}
                      type="button"
                      className={shareActionClass}
                      onClick={() => activateShareChannel(id)}
                      aria-label={
                        id === "qr"
                          ? t.successShowQrCode ?? t.shareViaQrCode
                          : (t.successShareViaApp ?? "Share via {app}").replace("{app}", label)
                      }
                      aria-expanded={id === "qr" ? showSuccessQr : undefined}
                    >
                      {inner}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={shareMore}
                  className={shareActionClass}
                  aria-label={t.successMoreSharingOptions ?? "More sharing options"}
                  aria-haspopup="dialog"
                  aria-expanded={showShareMore}
                >
                  <span className={`${shareIconClass} text-gray-500 dark:text-gray-400`}>
                    <MoreHorizontal className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {t.successShareMore ?? "More"}
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div
            className="mx-auto mt-2 hidden w-full max-w-[960px] items-start gap-1 pl-2 lg:flex"
            aria-hidden
          >
            <svg
              viewBox="0 0 72 56"
              className="mt-1 h-12 w-[3.75rem] shrink-0 text-primary"
              fill="none"
            >
              <path
                d="M58 44C36 42 20 28 22 10"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
              <path
                d="M14 16l8-8 10 5"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="success-hand-accent mt-7 -ml-1 rotate-[-7deg] text-primary">
              {shareYourWay}
            </p>
          </div>
        </div>

        <div className="mx-auto mt-10 w-full max-w-[960px] px-4 sm:mt-12 sm:px-6">
          {deliverySent && recipientLinkDelivery ? (
            <div className="text-center text-sm text-emerald-800 dark:text-emerald-200" role="status">
              <p className="m-0 inline-flex items-center justify-center gap-1.5 font-medium">
                <Mail className="h-4 w-4 shrink-0" aria-hidden />
                {t.recipientLinkDeliverySentTitle ?? "Link emailed"}
              </p>
              <p className="mt-1 m-0 text-xs leading-snug opacity-90">
                {(t.recipientLinkDeliverySentBody ?? "Sent to {email}.").replace(
                  "{email}",
                  recipientLinkDelivery.email,
                )}
              </p>
            </div>
          ) : (
            <form
              id="success-private-note-delivery"
              className="mx-auto max-w-xl space-y-2.5"
              onSubmit={(event) => {
                event.preventDefault();
                submitRecipientLinkDelivery();
              }}
            >
              <p className="m-0 text-center text-sm font-medium text-gray-600 dark:text-gray-300">
                {t.successLetPrivateNoteSend ?? "Let PrivateNote send it"}
              </p>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
                <label htmlFor="success-deliver-recipient-email" className="sr-only">
                  {t.settingsDeliverRecipientEmail ?? "Email link to recipient"}
                </label>
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
                  className="success-plain-field h-11 min-w-0 flex-1 rounded-[13px] border border-gray-200 bg-white px-3 text-sm text-gray-950 placeholder:text-gray-500 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  disabled={recipientLinkDeliveryRetrying || !canSubmitDelivery}
                  className="success-primary-btn inline-flex h-11 shrink-0 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {recipientLinkDeliveryRetrying
                    ? t.recipientLinkDeliveryRetrying ?? "Sending…"
                    : deliveryFailed
                      ? t.recipientLinkDeliveryRetry ?? "Try again"
                      : t.successSendLink ?? "Send link"}
                </button>
              </div>
              <p className="m-0 flex items-start gap-1.5 text-xs leading-snug text-gray-500 dark:text-gray-400">
                <span className="min-w-0 flex-1">
                  {t.successDeliveryLinkOnly ??
                    "PrivateNote sends only the secure link — never your note contents."}
                </span>
                <button
                  type="button"
                  className="success-quiet-btn inline-flex shrink-0 rounded-full p-0.5 text-gray-400 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:hover:text-gray-300"
                  title={
                    t.successDeliveryLinkOnlyHint ??
                    "The note stays encrypted. Email only carries the link, so prefer sharing it yourself for the most sensitive secrets."
                  }
                  aria-label={
                    t.successDeliveryLinkOnlyHint ??
                    "The note stays encrypted. Email only carries the link, so prefer sharing it yourself for the most sensitive secrets."
                  }
                >
                  <CircleHelp className="h-3.5 w-3.5" aria-hidden />
                </button>
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

        {showPasswordShare ? (
          <div className="mx-4 mt-6 overflow-hidden rounded-xl border border-gray-200 sm:mx-6 dark:border-gray-700">
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
          <div className="mx-4 mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 sm:mx-6 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
            <p>
              <strong>{t.passwordProtectionEnabledTitle}</strong> {t.passwordProtectionEnabledBody}
            </p>
            <p className="mt-1">{t.passwordProtectionSendSeparately}</p>
          </div>
        ) : null}

        <div className="mt-6 px-4 sm:px-6">
          <ChromeExtensionOnboardingBanner />
        </div>

        <section className="relative mt-10 sm:mt-12 mb-6 sm:mb-8 w-full px-4 sm:px-6 lg:px-8">
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

      <Dialog open={showShareMore} onOpenChange={setShowShareMore}>
        <DialogContent className="max-w-md gap-4 p-5 sm:rounded-2xl">
          <DialogTitle className="text-base">
            {t.successOrganizeShortcuts ?? "Organize shortcuts"}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
            {t.successOrganizeShortcutsHint ??
              "Drag to choose which four appear on the card. Tap a shortcut to share now."}
          </DialogDescription>
          <ol className="m-0 flex list-none flex-col gap-1 p-0">
            {shareOrder.map((id, index) => {
              const kind = shareChannelKind(id);
              const href = shareChannelHref(id, successUrl);
              const label = shareChannelLabel(id);
              const pinned = index < PINNED_SUCCESS_SHARE_COUNT;
              const shareInner = (
                <>
                  <span className={`${shareIconClass} h-9 w-9 ${shareChannelIconClass(id)}`}>
                    <ShareChannelGlyph id={id} />
                  </span>
                  <span className="min-w-0 flex-1 text-left text-sm font-medium text-gray-900 dark:text-gray-100">
                    {label}
                    {pinned ? (
                      <span className="ml-2 text-xs font-normal text-gray-400">
                        {t.successShortcutOnCard ?? "On card"}
                      </span>
                    ) : null}
                  </span>
                </>
              );
              return (
                <li
                  key={id}
                  draggable
                  onDragStart={(event) => {
                    setDraggingShareId(id);
                    event.dataTransfer.effectAllowed = "move";
                    event.dataTransfer.setData("text/plain", id);
                  }}
                  onDragOver={(event) => {
                    event.preventDefault();
                    event.dataTransfer.dropEffect = "move";
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    const fromId = (event.dataTransfer.getData("text/plain") ||
                      draggingShareId) as SuccessShareChannelId | null;
                    if (!fromId || fromId === id) return;
                    commitShareOrder(moveShareShortcut(shareOrder, fromId, index));
                    setDraggingShareId(null);
                  }}
                  onDragEnd={() => setDraggingShareId(null)}
                  className={`flex items-center gap-1 rounded-xl border px-1.5 py-1 ${
                    draggingShareId === id
                      ? "border-primary/40 bg-primary/[0.06]"
                      : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950"
                  }`}
                >
                  <span
                    className="inline-flex h-9 w-7 shrink-0 cursor-grab items-center justify-center text-gray-400 active:cursor-grabbing"
                    aria-hidden
                  >
                    <GripVertical className="h-4 w-4" />
                  </span>
                  {kind === "link" && href ? (
                    <a
                      href={href}
                      target={id !== "email" && id !== "sms" && id !== "signal" ? "_blank" : undefined}
                      rel={
                        id !== "email" && id !== "sms" && id !== "signal"
                          ? "noopener noreferrer"
                          : undefined
                      }
                      onClick={id === "signal" ? () => void copyLinkForApp(label) : undefined}
                      className="success-share-action flex min-w-0 flex-1 items-center gap-2 rounded-lg px-1 py-1 text-inherit no-underline"
                    >
                      {shareInner}
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => activateShareChannel(id)}
                      className="success-quiet-btn flex min-w-0 flex-1 items-center gap-2 rounded-lg px-1 py-1"
                    >
                      {shareInner}
                    </button>
                  )}
                  <button
                    type="button"
                    className="success-quiet-btn inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-500 disabled:opacity-30"
                    disabled={index === 0}
                    aria-label={t.successMoveShortcutUp ?? "Move up"}
                    onClick={() =>
                      commitShareOrder(moveShareShortcut(shareOrder, id, index - 1))
                    }
                  >
                    <ChevronUp className="h-4 w-4" aria-hidden />
                  </button>
                  <button
                    type="button"
                    className="success-quiet-btn inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-500 disabled:opacity-30"
                    disabled={index === shareOrder.length - 1}
                    aria-label={t.successMoveShortcutDown ?? "Move down"}
                    onClick={() =>
                      commitShareOrder(moveShareShortcut(shareOrder, id, index + 1))
                    }
                  >
                    <ChevronDown className="h-4 w-4" aria-hidden />
                  </button>
                </li>
              );
            })}
          </ol>
          <button
            type="button"
            onClick={() => void nativeShare()}
            className={`${ghostBtn} w-full`}
          >
            <Share2 className="mr-1.5 h-4 w-4 shrink-0 text-primary" />
            {t.successSystemShare ?? "Share from this device"}
          </button>
        </DialogContent>
      </Dialog>

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
