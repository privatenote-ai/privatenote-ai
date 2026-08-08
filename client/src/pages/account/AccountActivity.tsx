import { useCallback, useEffect, useState } from "react";
import { Link } from "wouter";
import {
  Activity,
  BadgeCheck,
  Ban,
  Bell,
  ChevronRight,
  Clock,
  Download,
  Eye,
  FilePlus2,
  Globe2,
  Hash,
  KeyRound,
  Lock,
  Mail,
  MonitorSmartphone,
  Paperclip,
  ShieldCheck,
  Sparkles,
  Timer,
  Trash2,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAccountEntitlements } from "@/context/AccountEntitlementsContext";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, ApiRequestError } from "@/lib/queryClient";
import { parseActivityCreatedAt } from "@/lib/parseActivityCreatedAt";
import type { AccountActivityCreateMetadata } from "@shared/accountActivityMetadata";
import { formatDistanceToNow, isToday, isYesterday, isThisWeek } from "date-fns";
import {
  deleteNoteLabel,
  deleteNoteLabels,
  readNoteLabels,
} from "@/utils/noteLabelsStorage";
import { AccountSettingsShell } from "./AccountSettingsShell";
import {
  buildProofTimeline,
  formatDeviceClass,
  formatProofTimestamp,
  statusLabel,
  type NotificationItem,
  type ProofTimelineEntry,
} from "./NotificationCenter.logic";

// ─── Types ────────────────────────────────────────────────────────────────────

type ActivityEvent = {
  id: string;
  type: string;
  noteId: string | null;
  createdAt: string;
  metadata?: AccountActivityCreateMetadata | null;
  delivery?: NotificationItem | null;
};

type ActivityCapabilities = {
  sentNotesDashboard: boolean;
  revokeUnopened: boolean;
};

type TimePeriod = "today" | "yesterday" | "this_week" | "earlier";

type EventGroup = {
  period: TimePeriod;
  events: ActivityEvent[];
};

type OptionChip = {
  key: string;
  label: string;
  Icon: LucideIcon;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function groupEvents(events: ActivityEvent[]): EventGroup[] {
  const groups: EventGroup[] = [];
  const buckets: Record<TimePeriod, ActivityEvent[] | undefined> = {
    today: undefined,
    yesterday: undefined,
    this_week: undefined,
    earlier: undefined,
  };

  for (const ev of events) {
    let period: TimePeriod;
    try {
      const d = parseActivityCreatedAt(ev.createdAt);
      if (isToday(d)) period = "today";
      else if (isYesterday(d)) period = "yesterday";
      else if (isThisWeek(d, { weekStartsOn: 1 })) period = "this_week";
      else period = "earlier";
    } catch {
      period = "earlier";
    }
    if (!buckets[period]) {
      buckets[period] = [];
      groups.push({ period, events: buckets[period]! });
    }
    buckets[period]!.push(ev);
  }

  return groups;
}

function eventAccent(type: string, metadata?: AccountActivityCreateMetadata | null): string {
  if (type === "note_created" && metadata?.aiEnhanced) {
    return "bg-violet-500/10 text-violet-600 dark:text-violet-400";
  }
  switch (type) {
    case "note_created":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    case "ai_note_created":
      return "bg-violet-500/10 text-violet-600 dark:text-violet-400";
    case "note_opened":
      return "bg-sky-500/10 text-sky-600 dark:text-sky-400";
    case "note_expired":
      return "bg-gray-500/10 text-gray-500 dark:text-gray-400";
    default:
      return "bg-gray-500/10 text-gray-500 dark:text-gray-400";
  }
}

function formatExpiryLabel(seconds: number, t: Record<string, string>): string {
  if (seconds % 86400 === 0) {
    const days = seconds / 86400;
    if (days === 1) return t.authActivityExpiry1Day ?? "1 day";
    return (t.authActivityExpiryDays ?? "{n} days").replace("{n}", String(days));
  }
  if (seconds % 3600 === 0) {
    const hours = seconds / 3600;
    if (hours === 1) return t.authActivityExpiry1Hour ?? "1 hour";
    return (t.authActivityExpiryHours ?? "{n} hours").replace("{n}", String(hours));
  }
  if (seconds % 60 === 0) {
    const minutes = seconds / 60;
    if (minutes === 1) return t.authActivityExpiry1Minute ?? "1 minute";
    return (t.authActivityExpiryMinutes ?? "{n} minutes").replace("{n}", String(minutes));
  }
  return (t.authActivityExpirySeconds ?? "{n}s").replace("{n}", String(seconds));
}

function createOptionChips(
  metadata: AccountActivityCreateMetadata | null | undefined,
  t: Record<string, string>,
): OptionChip[] {
  if (!metadata) return [];
  const chips: OptionChip[] = [];
  if (metadata.hasAttachment) {
    chips.push({
      key: "attachment",
      label: t.authActivityChipAttachment ?? "Encrypted file",
      Icon: Paperclip,
    });
  }
  if (metadata.passwordProtected) {
    chips.push({
      key: "password",
      label: t.authActivityChipPassword ?? "Password",
      Icon: KeyRound,
    });
  }
  if (typeof metadata.maxReads === "number") {
    chips.push({
      key: "reads",
      label:
        metadata.maxReads === 1
          ? (t.authActivityChipOneRead ?? "1 read")
          : (t.authActivityChipReads ?? "{n} reads").replace("{n}", String(metadata.maxReads)),
      Icon: Eye,
    });
  }
  if (typeof metadata.expirySeconds === "number") {
    chips.push({
      key: "expiry",
      label: (t.authActivityChipExpiry ?? "Expires in {v}").replace(
        "{v}",
        formatExpiryLabel(metadata.expirySeconds, t),
      ),
      Icon: Timer,
    });
  }
  if (metadata.aiEnhanced) {
    chips.push({
      key: "ai",
      label:
        metadata.aiMode === "local"
          ? (t.authActivityChipAiLocal ?? "Private AI")
          : metadata.aiMode === "cloud"
            ? (t.authActivityChipAiCloud ?? "Hosted AI")
            : (t.authActivityChipAi ?? "AI assisted"),
      Icon: Sparkles,
    });
  }
  if (metadata.notifyOnOpen) {
    chips.push({
      key: "alert-open",
      label: t.authActivityChipAlertOpen ?? "Open alerts",
      Icon: Bell,
    });
  }
  if (metadata.notifyOnDestroyed) {
    chips.push({
      key: "alert-destroy",
      label: t.authActivityChipAlertDestroy ?? "Destroy alerts",
      Icon: Bell,
    });
  }
  if (metadata.notifyOnAttachmentDownload) {
    chips.push({
      key: "alert-download",
      label: t.authActivityChipAlertDownload ?? "Download alerts",
      Icon: Download,
    });
  }
  if (metadata.requireRecipientVerification) {
    chips.push({
      key: "verification",
      label: t.authActivityChipVerification ?? "Recipient verification",
      Icon: ShieldCheck,
    });
  }
  if (metadata.requireReceiptAck) {
    chips.push({
      key: "receipt",
      label: t.authActivityChipReceipt ?? "Receipt confirmation",
      Icon: BadgeCheck,
    });
  }
  return chips;
}

function statusPillClass(status: NotificationItem["status"]): string {
  switch (status) {
    case "viewed":
    case "receipt_confirmed":
    case "attachment_downloaded":
      return "bg-teal-500/15 text-teal-800 dark:text-teal-200";
    case "burned":
      return "bg-amber-500/15 text-amber-900 dark:text-amber-200";
    case "revoked":
      return "bg-rose-500/15 text-rose-800 dark:text-rose-200";
    case "expired":
      return "bg-gray-500/15 text-gray-700 dark:text-gray-300";
    default:
      return "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200";
  }
}

function statusHeroClass(status: NotificationItem["status"]): string {
  switch (status) {
    case "viewed":
    case "receipt_confirmed":
    case "attachment_downloaded":
      return "from-teal-500/15 via-teal-500/5 to-transparent text-teal-700 dark:text-teal-300";
    case "burned":
      return "from-amber-500/15 via-amber-500/5 to-transparent text-amber-700 dark:text-amber-300";
    case "revoked":
      return "from-rose-500/15 via-rose-500/5 to-transparent text-rose-700 dark:text-rose-300";
    case "expired":
      return "from-gray-500/15 via-gray-500/5 to-transparent text-gray-600 dark:text-gray-300";
    default:
      return "from-emerald-500/15 via-emerald-500/5 to-transparent text-emerald-700 dark:text-emerald-300";
  }
}

function StatusHeroIcon({
  status,
  className = "h-6 w-6",
}: {
  status: NotificationItem["status"];
  className?: string;
}) {
  switch (status) {
    case "receipt_confirmed":
      return <BadgeCheck className={className} aria-hidden />;
    case "attachment_downloaded":
      return <Download className={className} aria-hidden />;
    case "viewed":
      return <Eye className={className} aria-hidden />;
    case "burned":
      return <Lock className={className} aria-hidden />;
    case "revoked":
      return <Ban className={className} aria-hidden />;
    case "expired":
      return <Clock className={className} aria-hidden />;
    default:
      return <ShieldCheck className={className} aria-hidden />;
  }
}

function EventIcon({
  type,
  metadata,
}: {
  type: string;
  metadata?: AccountActivityCreateMetadata | null;
}) {
  if (type === "note_created" || type === "ai_note_created") {
    if (metadata?.aiEnhanced || type === "ai_note_created") {
      return <Sparkles className="h-4 w-4" />;
    }
    if (metadata?.hasAttachment) {
      return <Paperclip className="h-4 w-4" />;
    }
    return <FilePlus2 className="h-4 w-4" />;
  }
  switch (type) {
    case "note_opened":
      return <Eye className="h-4 w-4" />;
    case "note_expired":
      return <Clock className="h-4 w-4" />;
    default:
      return <Activity className="h-4 w-4" />;
  }
}

function timelineLabel(entry: ProofTimelineEntry, t: Record<string, string>): string {
  switch (entry.key) {
    case "created":
      return t.proofTimelineCreated ?? "Created";
    case "opened":
      return t.proofTimelineOpened ?? "Link opened";
    case "receipt":
      return t.proofTimelineReceipt ?? "Receipt confirmed";
    case "attachment":
      return t.proofTimelineAttachment ?? "Attachment downloaded";
    case "destroyed":
      return t.proofTimelineDestroyed ?? "Destroyed after read limit";
    case "expired":
      return t.proofTimelineExpired ?? "Expired";
    case "revoked":
      return t.proofTimelineRevoked ?? "Revoked by you";
  }
}

function timelineIcon(entry: ProofTimelineEntry): LucideIcon {
  switch (entry.key) {
    case "created":
      return FilePlus2;
    case "opened":
      return Eye;
    case "receipt":
      return BadgeCheck;
    case "attachment":
      return Download;
    case "destroyed":
      return Lock;
    case "expired":
      return Clock;
    case "revoked":
      return Ban;
  }
}

function timelineAccent(entry: ProofTimelineEntry): string {
  switch (entry.key) {
    case "created":
      return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 ring-emerald-500/20";
    case "opened":
      return "bg-sky-500/15 text-sky-700 dark:text-sky-300 ring-sky-500/20";
    case "receipt":
      return "bg-teal-500/15 text-teal-700 dark:text-teal-300 ring-teal-500/25";
    case "attachment":
      return "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 ring-indigo-500/20";
    case "destroyed":
      return "bg-amber-500/15 text-amber-800 dark:text-amber-300 ring-amber-500/20";
    case "expired":
      return "bg-gray-500/15 text-gray-700 dark:text-gray-300 ring-gray-500/20";
    case "revoked":
      return "bg-rose-500/15 text-rose-700 dark:text-rose-300 ring-rose-500/20";
  }
}

function CreateOptionsSection({
  metadata,
  t,
}: {
  metadata?: AccountActivityCreateMetadata | null;
  t: Record<string, string>;
}) {
  const chips = createOptionChips(metadata, t);
  if (chips.length === 0) return null;
  return (
    <section className="space-y-3 rounded-2xl border border-border/70 bg-muted/25 px-4 py-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Lock className="h-4 w-4" aria-hidden />
        </span>
        <div className="min-w-0 space-y-1">
          <h3 className="text-sm font-medium text-foreground">
            {t.authActivityCreateOptionsTitle ?? "Selected options"}
          </h3>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {t.authActivityCreateOptionsSubtitle ??
              "Settings chosen when this note was created. Message content is never stored here."}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {chips.map(({ key, label, Icon }) => (
          <span
            key={key}
            className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background px-2.5 py-1 text-[11px] font-medium text-foreground/85 shadow-sm"
          >
            <Icon className="h-3 w-3 text-primary/80" aria-hidden />
            {label}
          </span>
        ))}
      </div>
    </section>
  );
}

function DeliveryDetail({
  event,
  noteLabel,
  canTrackDelivery,
  canRevokeUnopened,
  revoking,
  onRevoke,
  t,
}: {
  event: ActivityEvent;
  noteLabel: string | null;
  canTrackDelivery: boolean;
  canRevokeUnopened: boolean;
  revoking: boolean;
  onRevoke: (item: NotificationItem) => void;
  t: Record<string, string>;
}) {
  const createOptions = <CreateOptionsSection metadata={event.metadata} t={t} />;

  if (event.type === "note_opened") {
    return (
      <p className="text-sm leading-relaxed text-muted-foreground">
        {t.authActivityOpenedIsYouHint ??
          "This means you opened a note while signed in — not that a recipient opened a note you sent."}
      </p>
    );
  }

  if (!canTrackDelivery) {
    return (
      <div className="space-y-6">
        {createOptions}
        <div className="space-y-4 rounded-2xl border border-dashed border-border px-4 py-5">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="h-4 w-4" aria-hidden />
            </span>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t.authActivityDeliveryUpsell ??
                "Delivery status, proof of access, and revoke are available on Starter and Business."}
            </p>
          </div>
          <Button asChild size="sm">
            <Link href="/premium">{t.comparePlans ?? "Compare plans"}</Link>
          </Button>
        </div>
      </div>
    );
  }

  const delivery = event.delivery;
  if (!delivery) {
    return (
      <div className="space-y-6">
        {createOptions}
        <div className="space-y-2 rounded-2xl border border-border/70 bg-muted/40 px-4 py-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-muted-foreground" aria-hidden />
            <p className="text-sm font-medium text-foreground">
              {t.authActivityNoDeliveryTitle ?? "No delivery tracking"}
            </p>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {t.authActivityNoDeliveryTracking ??
              "No delivery tracking for this note. Tracking and proof of access start when you send with recipient alerts enabled on a Starter or Business plan."}
          </p>
        </div>
      </div>
    );
  }

  const recipient =
    delivery.recipientEmail?.trim() ||
    (t.notificationRecipientUnknown ?? "Recipient not recorded");
  const hasRecipientEmail = Boolean(delivery.recipientEmail?.trim());
  const canRevoke = canRevokeUnopened && delivery.status === "created";
  const timeline = buildProofTimeline(delivery);
  const accessed = Boolean(delivery.openedAt);
  const proofEnabled = Boolean(delivery.proofEnabled);
  const unavailable = t.proofUnavailable ?? "Not available";
  const country = delivery.openCountry?.trim() || unavailable;
  const device = formatDeviceClass(delivery.openDeviceClass, t);
  const browser = delivery.openBrowser?.trim() || unavailable;

  return (
    <div className="space-y-6">
      <div
        className={`relative overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br px-4 py-4 ${statusHeroClass(delivery.status)}`}
      >
        <div className="pointer-events-none absolute -right-6 -top-8 h-28 w-28 rounded-full bg-current opacity-[0.06]" />
        <div className="pointer-events-none absolute -bottom-10 right-8 h-24 w-24 rounded-full bg-current opacity-[0.04]" />
        <div className="relative flex items-start gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-background/80 shadow-sm ring-1 ring-black/5 dark:bg-background/60 dark:ring-white/10">
            <StatusHeroIcon status={delivery.status} className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1 space-y-2.5">
            {noteLabel?.trim() ? (
              <p className="text-base font-semibold tracking-tight text-foreground">
                {noteLabel.trim()}
              </p>
            ) : null}
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusPillClass(delivery.status)}`}
              >
                <StatusHeroIcon status={delivery.status} className="h-3.5 w-3.5" />
                {statusLabel(delivery.status, t)}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-background/70 px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
                <Hash className="h-3 w-3" aria-hidden />
                {delivery.displayNoteId.replace(/^#/, "")}
              </span>
            </div>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              {hasRecipientEmail ? (
                <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden />
              ) : (
                <UserRound className="h-3.5 w-3.5 shrink-0" aria-hidden />
              )}
              <span className="truncate">{recipient}</span>
            </p>
          </div>
        </div>
      </div>

      {createOptions}

      <section className="space-y-4 rounded-2xl border border-border/70 bg-background px-4 py-4 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-700 dark:text-teal-300">
            <ShieldCheck className="h-4 w-4" aria-hidden />
          </span>
          <div className="min-w-0 space-y-1">
            <h3 className="text-sm font-semibold text-foreground">
              {t.proofReportTitle ?? "Proof of access"}
            </h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {t.proofReportSubtitle ??
                "Coarse receipt that the link was accessed — not that the message was read or understood. Message content is never included."}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {t.proofTimelineHeading ?? "Timeline"}
          </h4>
          {timeline.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t.proofNoEventsYet ?? "No delivery events recorded yet."}
            </p>
          ) : (
            <ol className="relative space-y-0 border-l border-border/80 ml-4 pl-5">
              {timeline.map((entry, index) => {
                const Icon = timelineIcon(entry);
                const isLatest = index === timeline.length - 1;
                return (
                  <li key={`${entry.key}-${entry.at}`} className="relative pb-5 last:pb-0">
                    <span
                      className={`absolute -left-[1.95rem] top-0 flex h-8 w-8 items-center justify-center rounded-full ring-4 ring-background ${timelineAccent(entry)} ${
                        isLatest ? "shadow-sm" : ""
                      }`}
                      aria-hidden
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <p className="pt-1 text-sm font-medium text-foreground">
                      {timelineLabel(entry, t)}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatProofTimestamp(entry.at)}
                    </p>
                  </li>
                );
              })}
            </ol>
          )}
        </div>

        <div className="space-y-3 border-t border-border/60 pt-4">
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {t.proofAccessHeading ?? "Access details"}
          </h4>
          {!accessed ? (
            <p className="text-sm text-muted-foreground">
              {t.proofNotOpenedYet ??
                "No open receipt yet. Details appear after the link is accessed."}
            </p>
          ) : !proofEnabled ? (
            <p className="text-sm text-muted-foreground">
              {t.authActivityProofNotRecorded ??
                "This note was opened, but approximate location and device were not recorded for it."}
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/60 bg-muted/35 px-4 py-3">
                <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/10 text-sky-700 dark:text-sky-300">
                    <Globe2 className="h-3.5 w-3.5" aria-hidden />
                  </span>
                  <span className="text-xs font-medium">
                    {t.proofCountryLabel ?? "Approximate country"}
                  </span>
                </div>
                <p className="text-sm font-semibold tracking-wide text-foreground">{country}</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-muted/35 px-4 py-3">
                <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/10 text-violet-700 dark:text-violet-300">
                    <MonitorSmartphone className="h-3.5 w-3.5" aria-hidden />
                  </span>
                  <span className="text-xs font-medium">{t.proofDeviceLabel ?? "Device"}</span>
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {device}
                  {browser !== unavailable ? ` · ${browser}` : ""}
                </p>
              </div>
            </div>
          )}
          <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
            <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/70" aria-hidden />
            <span>
              {t.proofDisclaimer ??
                "PrivateNote cannot see decrypted note content. Country is approximate (network edge) and may be missing or inaccurate on some networks."}
            </span>
          </p>
        </div>
      </section>

      {canRevoke ? (
        <div className="space-y-3 rounded-2xl border border-rose-200/80 bg-rose-50/50 px-4 py-4 dark:border-rose-900/50 dark:bg-rose-950/20">
          <p className="text-sm text-muted-foreground">
            {t.notificationRevokeHint ??
              "Still unopened — you can revoke the link so it can no longer be opened."}
          </p>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={revoking}
            className="border-rose-200 text-rose-700 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950/40"
            onClick={() => onRevoke(delivery)}
          >
            <Ban className="mr-1.5 h-3.5 w-3.5" aria-hidden />
            {revoking
              ? (t.notificationRevoking ?? "Revoking...")
              : (t.notificationRevokeConfirm ?? "Revoke link")}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AccountActivity() {
  const { user, loading: authLoading } = useAuth();
  const { entitlements } = useAccountEntitlements();
  const { t } = useLanguage();
  const { toast } = useToast();
  const tx = (key: string, fallback: string) => t[key] || fallback;

  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [capabilities, setCapabilities] = useState<ActivityCapabilities>({
    sentNotesDashboard: false,
    revokeUnopened: false,
  });
  const [noteLabels, setNoteLabels] = useState<Record<string, string>>(() => readNoteLabels());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState<NotificationItem | null>(null);
  const [revokingNoteId, setRevokingNoteId] = useState<string | null>(null);

  const selectedEvent = events.find((entry) => entry.id === selectedId) ?? null;
  const canTrackDelivery =
    capabilities.sentNotesDashboard || entitlements.capabilities.sentNotesDashboard === true;
  const canRevokeUnopened =
    capabilities.revokeUnopened || entitlements.capabilities.revokeUnopened === true;

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await apiRequest<{
        ok: boolean;
        events: ActivityEvent[];
        capabilities?: ActivityCapabilities;
      }>("/api/auth/account/activity?limit=40", "GET");
      setEvents(data.ok && Array.isArray(data.events) ? data.events : []);
      setCapabilities({
        sentNotesDashboard: Boolean(data.capabilities?.sentNotesDashboard),
        revokeUnopened: Boolean(data.capabilities?.revokeUnopened),
      });
      setNoteLabels(readNoteLabels());
    } catch {
      setEvents([]);
      setError(t.authActivityLoadError || "Could not load activity.");
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    void load();
  }, [authLoading, user, load]);

  const periodLabel = (period: TimePeriod): string => {
    switch (period) {
      case "today":
        return t.authActivityToday || "Today";
      case "yesterday":
        return t.authActivityYesterday || "Yesterday";
      case "this_week":
        return t.authActivityThisWeek || "This week";
      case "earlier":
        return t.authActivityEarlier || "Earlier";
    }
  };

  const eventLabel = (event: ActivityEvent): string => {
    const meta = event.metadata;
    if (event.type === "note_created" || event.type === "ai_note_created") {
      const ai = meta?.aiEnhanced || event.type === "ai_note_created";
      if (ai && meta?.hasAttachment) {
        return t.authActivityAiNoteWithFileCreated || "AI note with file created";
      }
      if (ai) return t.authActivityAiNoteCreated || "AI-assisted note created";
      if (meta?.hasAttachment) {
        return t.authActivitySecureNoteWithFileCreated || "Secure note with file created";
      }
      return t.authActivitySecureNoteCreated || "Secure note created";
    }
    switch (event.type) {
      case "note_opened":
        return t.authActivityNoteOpened || "Note opened";
      case "note_expired":
        return t.authActivityNoteExpired || "Note expired";
      default:
        return event.type.replace(/_/g, " ");
    }
  };

  const eventDescription = (event: ActivityEvent): string => {
    if (event.type === "note_created" || event.type === "ai_note_created") {
      if (event.metadata?.hasAttachment) {
        return (
          t.authActivitySecureNoteWithFileCreatedDesc ||
          "A secure note with an encrypted attachment was sent from your account."
        );
      }
      if (event.metadata?.aiEnhanced || event.type === "ai_note_created") {
        return t.authActivityAiNoteCreatedDesc || "An AI-composed note was sent from your account.";
      }
      return t.authActivitySecureNoteCreatedDesc || "A new secure note was sent from your account.";
    }
    switch (event.type) {
      case "note_opened":
        return t.authActivityNoteOpenedDesc || "A note was opened while you were signed in.";
      case "note_expired":
        return t.authActivityNoteExpiredDesc || "A note reached its expiry and was destroyed.";
      default:
        return "";
    }
  };

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const item = events.find((entry) => entry.id === id);
    setDeletingId(id);
    setError(null);
    try {
      await apiRequest(`/api/auth/account/activity/${encodeURIComponent(id)}`, "DELETE");
      setEvents((prev) => prev.filter((entry) => entry.id !== id));
      if (selectedId === id) setSelectedId(null);
      if (item?.noteId) {
        deleteNoteLabel(item.noteId);
        setNoteLabels(readNoteLabels());
      }
    } catch {
      setError(tx("authActivityDeleteError", "Could not delete that activity item."));
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearHistory = async () => {
    setClearing(true);
    setError(null);
    try {
      await apiRequest("/api/auth/account/activity", "DELETE");
      deleteNoteLabels(events.map((item) => item.noteId).filter(Boolean) as string[]);
      setNoteLabels(readNoteLabels());
      setEvents([]);
      setSelectedId(null);
      setClearDialogOpen(false);
    } catch {
      setError(tx("authActivityClearError", "Could not clear activity history."));
    } finally {
      setClearing(false);
    }
  };

  const handleRevokeConfirm = async () => {
    if (!revokeTarget) return;
    const target = revokeTarget;
    setRevokingNoteId(target.noteId);
    setError(null);
    try {
      await apiRequest(`/api/notes/${encodeURIComponent(target.noteId)}/revoke`, "POST");
      const revokedAt = new Date().toISOString();
      setEvents((prev) =>
        prev.map((entry) =>
          entry.delivery?.id === target.id
            ? {
                ...entry,
                delivery: {
                  ...entry.delivery,
                  status: "revoked",
                  eventAt: revokedAt,
                  revokedAt,
                },
              }
            : entry,
        ),
      );
      setRevokeTarget(null);
      toast({
        title: tx("notificationRevokeSuccessTitle", "Note revoked"),
        description: tx(
          "notificationRevokeSuccessBody",
          "The link can no longer be opened.",
        ),
      });
    } catch (err) {
      if (err instanceof ApiRequestError && err.status === 409) {
        setError(
          tx(
            "notificationRevokeAlreadyOpened",
            "This note was already opened and can no longer be revoked.",
          ),
        );
        void load();
      } else {
        setError(tx("notificationRevokeError", "Could not revoke that note."));
      }
    } finally {
      setRevokingNoteId(null);
    }
  };

  if (authLoading || loading) {
    return (
      <AccountSettingsShell>
        <div className="animate-pulse space-y-4">
          <div className="h-7 w-36 rounded-lg bg-muted" />
          <div className="h-4 w-72 rounded bg-muted/70" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-muted/60" />
          ))}
        </div>
      </AccountSettingsShell>
    );
  }

  if (!user) {
    return (
      <AccountSettingsShell>
        <div className="rounded-2xl border border-dashed border-border px-6 py-12 text-center">
          <p className="mb-4 text-sm text-muted-foreground">
            {t.authActivitySignInPrompt || "Sign in to see recent note activity."}
          </p>
          <Button asChild size="sm">
            <a href="/auth/sign-in">{t.signIn || "Sign in"}</a>
          </Button>
        </div>
      </AccountSettingsShell>
    );
  }

  const groups = groupEvents(events);

  return (
    <AccountSettingsShell>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {t.authActivityPageTitle || "Activity"}
            </h1>
            <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
              {t.authActivityPageSubtitle ||
                "Your note timeline. Open any item for delivery status and access details — contents are never recorded here."}
            </p>
          </div>
          {events.length > 0 ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="shrink-0 text-muted-foreground"
              onClick={() => setClearDialogOpen(true)}
            >
              {tx("authActivityClearHistory", "Clear history")}
            </Button>
          ) : null}
        </div>

        {error ? (
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-amber-200/80 bg-amber-50/80 px-4 py-3 dark:border-amber-900/50 dark:bg-amber-950/30">
            <p className="text-sm text-amber-800 dark:text-amber-200" role="alert">
              {error}
            </p>
            <Button variant="outline" size="sm" onClick={() => void load()}>
              {t.authRetry || "Retry"}
            </Button>
          </div>
        ) : null}

        {events.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border px-6 py-16 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
              <Activity className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">
              {t.authActivityNoActivityTitle || "No activity yet"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {t.authActivityCreateHint || "Create a note while signed in to see it here."}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {groups.map((group) => (
              <section key={group.period} className="space-y-3">
                <p className="px-1 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  {periodLabel(group.period)}
                </p>
                <ul className="space-y-2">
                  {group.events.map((ev) => {
                    let relative = "";
                    let absolute = "";
                    try {
                      const d = parseActivityCreatedAt(ev.createdAt);
                      relative = formatDistanceToNow(d, { addSuffix: true });
                      absolute = new Intl.DateTimeFormat(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(d);
                    } catch {
                      relative = ev.createdAt;
                    }
                    const desc = eventDescription(ev);
                    const delivery = canTrackDelivery ? ev.delivery : null;
                    const chips = createOptionChips(ev.metadata, t).slice(0, 4);
                    const selected = selectedId === ev.id;

                    return (
                      <li key={ev.id}>
                        <div
                          className={`group relative flex items-stretch gap-3 rounded-2xl border bg-background transition-all ${
                            selected
                              ? "border-primary/30 shadow-sm ring-1 ring-primary/15"
                              : "border-border/70 hover:border-border hover:bg-muted/30"
                          }`}
                        >
                          <button
                            type="button"
                            className="flex min-w-0 flex-1 items-start gap-3 px-4 py-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
                            onClick={() => setSelectedId(ev.id)}
                            aria-pressed={selected}
                          >
                            <span
                              className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${eventAccent(ev.type, ev.metadata)}`}
                              aria-hidden
                            >
                              <EventIcon type={ev.type} metadata={ev.metadata} />
                            </span>
                            <div className="min-w-0 flex-1 space-y-1.5">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-sm font-medium text-foreground">
                                  {eventLabel(ev)}
                                </p>
                                {delivery ? (
                                  <span
                                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${statusPillClass(delivery.status)}`}
                                  >
                                    <StatusHeroIcon status={delivery.status} className="h-3 w-3" />
                                    {statusLabel(delivery.status, t)}
                                  </span>
                                ) : null}
                              </div>
                              {chips.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {chips.map(({ key, label, Icon }) => (
                                    <span
                                      key={key}
                                      className="inline-flex items-center gap-1 rounded-full bg-muted/80 px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                                    >
                                      <Icon className="h-3 w-3" aria-hidden />
                                      {label}
                                    </span>
                                  ))}
                                </div>
                              ) : desc ? (
                                <p className="line-clamp-1 text-xs text-muted-foreground">{desc}</p>
                              ) : null}
                              <p className="text-xs text-muted-foreground" title={absolute}>
                                {relative}
                              </p>
                            </div>
                            <ChevronRight
                              className="mt-2 h-4 w-4 shrink-0 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:text-muted-foreground"
                              aria-hidden
                            />
                          </button>
                          <div className="flex items-start border-l border-border/50 py-3 pr-2">
                            <button
                              type="button"
                              onClick={(e) => void handleDelete(ev.id, e)}
                              disabled={deletingId === ev.id || Boolean(revokingNoteId)}
                              className="rounded-xl p-2 text-muted-foreground/50 opacity-0 transition-all hover:bg-rose-50 hover:text-rose-600 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 group-hover:opacity-100 disabled:opacity-40 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                              aria-label={tx("authActivityDeleteAria", "Delete activity item")}
                            >
                              <Trash2 className="h-4 w-4" aria-hidden />
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground">
          {tx(
            "authActivityPrivacyFootnote",
            "This history is for your convenience. Delete items anytime — PrivateNote does not keep a permanent audit log here.",
          )}
        </p>
      </div>

      <Dialog
        open={selectedEvent !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedId(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          {selectedEvent ? (
            <>
              <DialogHeader className="text-left">
                <DialogTitle className="flex items-center gap-2.5 pr-6 text-lg tracking-tight">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${eventAccent(selectedEvent.type, selectedEvent.metadata)}`}
                    aria-hidden
                  >
                    <EventIcon type={selectedEvent.type} metadata={selectedEvent.metadata} />
                  </span>
                  {eventLabel(selectedEvent)}
                </DialogTitle>
                <DialogDescription className="text-sm leading-relaxed">
                  {eventDescription(selectedEvent) ||
                    (t.authActivityInspectHint ?? "Delivery and access details for this note.")}
                </DialogDescription>
              </DialogHeader>
              <div className="pt-2">
                <DeliveryDetail
                  event={selectedEvent}
                  noteLabel={
                    selectedEvent.noteId ? noteLabels[selectedEvent.noteId] ?? null : null
                  }
                  canTrackDelivery={canTrackDelivery}
                  canRevokeUnopened={canRevokeUnopened}
                  revoking={revokingNoteId === selectedEvent.delivery?.noteId}
                  onRevoke={setRevokeTarget}
                  t={t}
                />
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {tx("authActivityClearDialogTitle", "Clear activity history?")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {tx(
                "authActivityClearDialogBody",
                "This permanently removes activity events from your account. Note content and delivery records are not affected by clearing the timeline alone.",
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={clearing}>{tx("cancel", "Cancel")}</AlertDialogCancel>
            <AlertDialogAction
              disabled={clearing}
              onClick={(event) => {
                event.preventDefault();
                void handleClearHistory();
              }}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {clearing
                ? tx("authActivityClearing", "Clearing...")
                : tx("authActivityClearConfirm", "Clear history")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={revokeTarget !== null}
        onOpenChange={(open) => {
          if (!open && !revokingNoteId) setRevokeTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {tx("notificationRevokeDialogTitle", "Revoke this note?")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {tx(
                "notificationRevokeDialogBody",
                "The secret link will stop working immediately. This only works if the note has not been opened yet.",
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={Boolean(revokingNoteId)}>
              {tx("cancel", "Cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={Boolean(revokingNoteId)}
              onClick={(event) => {
                event.preventDefault();
                void handleRevokeConfirm();
              }}
              className="bg-rose-600 hover:bg-rose-700 focus:ring-rose-600"
            >
              {revokingNoteId
                ? tx("notificationRevoking", "Revoking...")
                : tx("notificationRevokeConfirm", "Revoke link")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AccountSettingsShell>
  );
}
