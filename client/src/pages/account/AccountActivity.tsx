import { useCallback, useEffect, useState } from "react";
import { Link } from "wouter";
import {
  Activity,
  Ban,
  ChevronDown,
  Clock,
  Eye,
  FilePlus2,
  FileSearch,
  Globe2,
  MonitorSmartphone,
  Sparkles,
  Trash2,
} from "lucide-react";
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
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, ApiRequestError } from "@/lib/queryClient";
import { parseActivityCreatedAt } from "@/lib/parseActivityCreatedAt";
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
  formatNotificationTimestamp,
  formatProofTimestamp,
  hasProofReport,
  statusLabel,
  statusTone,
  type NotificationItem,
  type ProofTimelineEntry,
} from "./NotificationCenter.logic";

// ─── Types ────────────────────────────────────────────────────────────────────

type ActivityEvent = {
  id: string;
  type: string;
  noteId: string | null;
  createdAt: string;
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

function eventAccent(type: string): string {
  switch (type) {
    case "note_created":
      return "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "ai_note_created":
      return "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400";
    case "note_opened":
      return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
    case "note_expired":
      return "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400";
    default:
      return "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400";
  }
}

function EventIcon({ type }: { type: string }) {
  switch (type) {
    case "note_created":
      return <FilePlus2 className="h-4 w-4" />;
    case "ai_note_created":
      return <Sparkles className="h-4 w-4" />;
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

function ProofReportDialog({
  item,
  noteLabel,
  open,
  onOpenChange,
  t,
}: {
  item: NotificationItem | null;
  noteLabel: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  t: Record<string, string>;
}) {
  if (!item) return null;

  const headline =
    noteLabel?.trim() ||
    item.label?.trim() ||
    item.recipientEmail?.trim() ||
    item.displayNoteId;
  const timeline = buildProofTimeline(item);
  const country = item.openCountry?.trim() || (t.proofUnavailable ?? "Not available");
  const device = formatDeviceClass(item.openDeviceClass, t);
  const browser = item.openBrowser?.trim() || (t.proofUnavailable ?? "Not available");
  const accessed = Boolean(item.openedAt);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t.proofReportTitle ?? "Proof of access"}</DialogTitle>
          <DialogDescription>
            {t.proofReportSubtitle ??
              "Coarse receipt that the link was accessed — not that the message was read or understood. Message content is never included."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 text-sm">
          <div className="rounded-lg border border-gray-200 bg-gray-50/80 px-4 py-3 dark:border-gray-800 dark:bg-gray-900/40">
            <p className="font-semibold text-gray-900 dark:text-white">{headline}</p>
            <p className="mt-1 font-mono text-xs text-gray-500 dark:text-gray-400">
              {item.displayNoteId}
            </p>
            <p className={`mt-2 text-sm font-semibold ${statusTone(item.status)}`}>
              {statusLabel(item.status, t)}
            </p>
          </div>

          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {t.proofTimelineHeading ?? "Timeline"}
            </h3>
            {timeline.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                {t.proofNoEventsYet ?? "No delivery events recorded yet."}
              </p>
            ) : (
              <ol className="space-y-2">
                {timeline.map((entry) => (
                  <li
                    key={`${entry.key}-${entry.at}`}
                    className="flex items-start justify-between gap-3 rounded-md border border-gray-200/80 px-3 py-2 dark:border-gray-800"
                  >
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {timelineLabel(entry, t)}
                    </span>
                    <span className="shrink-0 text-xs text-gray-500 dark:text-gray-400">
                      {formatProofTimestamp(entry.at)}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </section>

          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {t.proofAccessHeading ?? "Access details"}
            </h3>
            {!accessed ? (
              <p className="text-gray-500 dark:text-gray-400">
                {t.proofNotOpenedYet ??
                  "No open receipt yet. Details appear after the link is accessed."}
              </p>
            ) : (
              <ul className="space-y-2">
                <li className="flex items-center gap-3 rounded-md border border-gray-200/80 px-3 py-2 dark:border-gray-800">
                  <Globe2 className="h-4 w-4 shrink-0 text-sky-600 dark:text-sky-400" aria-hidden />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t.proofCountryLabel ?? "Approximate country"}
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">{country}</p>
                  </div>
                </li>
                <li className="flex items-center gap-3 rounded-md border border-gray-200/80 px-3 py-2 dark:border-gray-800">
                  <MonitorSmartphone
                    className="h-4 w-4 shrink-0 text-violet-600 dark:text-violet-400"
                    aria-hidden
                  />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t.proofDeviceLabel ?? "Device"}
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {device}
                      {browser !== (t.proofUnavailable ?? "Not available")
                        ? ` · ${browser}`
                        : ""}
                    </p>
                  </div>
                </li>
              </ul>
            )}
          </section>

          <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
            {t.proofDisclaimer ??
              "PrivateNote cannot see decrypted note content. Country is approximate (network edge) and may be missing or inaccurate on some networks."}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DeliveryPanel({
  event,
  noteLabel,
  canTrackDelivery,
  canRevokeUnopened,
  revoking,
  onRevoke,
  onViewProof,
  t,
}: {
  event: ActivityEvent;
  noteLabel: string | null;
  canTrackDelivery: boolean;
  canRevokeUnopened: boolean;
  revoking: boolean;
  onRevoke: (item: NotificationItem) => void;
  onViewProof: (item: NotificationItem) => void;
  t: Record<string, string>;
}) {
  if (event.type === "note_opened") {
    return (
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {t.authActivityOpenedIsYouHint ??
          "This means you opened a note while signed in — not that a recipient opened a note you sent."}
      </p>
    );
  }

  if (!canTrackDelivery) {
    return (
      <div className="space-y-2">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {t.authActivityDeliveryUpsell ??
            "Delivery status, proof of access, and revoke are available on Starter and Business."}
        </p>
        <Button asChild size="sm" variant="outline">
          <Link href="/premium">{t.comparePlans ?? "Compare plans"}</Link>
        </Button>
      </div>
    );
  }

  const delivery = event.delivery;
  if (!delivery) {
    return (
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {t.authActivityNoDeliveryTracking ??
          "No delivery tracking for this note. Tracking starts when you send with recipient alerts enabled."}
      </p>
    );
  }

  const recipient =
    delivery.recipientEmail?.trim() ||
    (t.notificationRecipientUnknown ?? "Recipient not recorded");
  const canRevoke = canRevokeUnopened && delivery.status === "created";
  const canViewProof = Boolean(delivery.proofEnabled) && hasProofReport(delivery);
  const proofSummaryParts: string[] = [];
  if (delivery.openCountry?.trim()) proofSummaryParts.push(delivery.openCountry.trim());
  if (delivery.openDeviceClass?.trim()) {
    proofSummaryParts.push(formatDeviceClass(delivery.openDeviceClass, t));
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="min-w-0">
          {noteLabel?.trim() ? (
            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
              {noteLabel.trim()}
            </p>
          ) : null}
          <p className="truncate text-xs text-gray-500 dark:text-gray-400">{recipient}</p>
          <p className="font-mono text-xs text-gray-400 dark:text-gray-500">
            {delivery.displayNoteId}
          </p>
        </div>
        <p className={`text-sm font-semibold ${statusTone(delivery.status)}`}>
          {statusLabel(delivery.status, t)}
        </p>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {formatNotificationTimestamp(delivery.eventAt)}
      </p>
      {proofSummaryParts.length > 0 ? (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {(t.proofCardSummary ?? "Access: {details}").replace(
            "{details}",
            proofSummaryParts.join(" · "),
          )}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2 pt-1">
        {canViewProof ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={revoking}
            onClick={() => onViewProof(delivery)}
          >
            <FileSearch className="mr-1.5 h-3.5 w-3.5" aria-hidden />
            {t.proofViewLink ?? "View proof of access"}
          </Button>
        ) : null}
        {canRevoke ? (
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
        ) : null}
      </div>
      {canRevoke ? (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {t.notificationRevokeHint ??
            "Still unopened — you can revoke the link so it can no longer be opened."}
        </p>
      ) : null}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AccountActivity() {
  const { user, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const tx = (key: string, fallback: string) => t[key] || fallback;

  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [capabilities, setCapabilities] = useState<ActivityCapabilities>({
    sentNotesDashboard: false,
    revokeUnopened: false,
  });
  const [noteLabels, setNoteLabels] = useState<Record<string, string>>(() => readNoteLabels());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState<NotificationItem | null>(null);
  const [revokingNoteId, setRevokingNoteId] = useState<string | null>(null);
  const [proofTarget, setProofTarget] = useState<NotificationItem | null>(null);

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

  const eventLabel = (type: string): string => {
    switch (type) {
      case "note_created":
        return t.authActivitySecureNoteCreated || "Secure note created";
      case "ai_note_created":
        return t.authActivityAiNoteCreated || "AI-assisted note created";
      case "note_opened":
        return t.authActivityNoteOpened || "Note opened";
      case "note_expired":
        return t.authActivityNoteExpired || "Note expired";
      default:
        return type.replace(/_/g, " ");
    }
  };

  const eventDescription = (type: string): string => {
    switch (type) {
      case "note_created":
        return t.authActivitySecureNoteCreatedDesc || "A new secure note was sent from your account.";
      case "ai_note_created":
        return t.authActivityAiNoteCreatedDesc || "An AI-composed note was sent from your account.";
      case "note_opened":
        return t.authActivityNoteOpenedDesc || "A note was opened while you were signed in.";
      case "note_expired":
        return t.authActivityNoteExpiredDesc || "A note reached its expiry and was destroyed.";
      default:
        return "";
    }
  };

  const handleDelete = async (id: string) => {
    const item = events.find((entry) => entry.id === id);
    setDeletingId(id);
    setError(null);
    try {
      await apiRequest(`/api/auth/account/activity/${encodeURIComponent(id)}`, "DELETE");
      setEvents((prev) => prev.filter((entry) => entry.id !== id));
      if (expandedId === id) setExpandedId(null);
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
      setExpandedId(null);
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
          <div className="h-6 w-32 rounded bg-gray-200 dark:bg-gray-800" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 rounded-xl bg-gray-100 dark:bg-gray-800/60" />
          ))}
        </div>
      </AccountSettingsShell>
    );
  }

  if (!user) {
    return (
      <AccountSettingsShell>
        <div className="rounded-xl border border-gray-200 p-8 text-center dark:border-gray-800">
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
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
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {t.authActivityPageTitle || "Activity"}
            </h1>
            <p className="mt-1 max-w-xl text-sm text-gray-500 dark:text-gray-400">
              {t.authActivityPageSubtitle ||
                "Your note timeline — expand a created note for delivery status. Contents are never recorded here."}
            </p>
          </div>
          {events.length > 0 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0"
              onClick={() => setClearDialogOpen(true)}
            >
              {tx("authActivityClearHistory", "Clear history")}
            </Button>
          ) : null}
        </div>

        {error && (
          <div className="flex items-center justify-between gap-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800 dark:bg-amber-950/30">
            <p className="text-sm text-amber-700 dark:text-amber-300" role="alert">
              {error}
            </p>
            <Button variant="outline" size="sm" onClick={() => void load()}>
              {t.authRetry || "Retry"}
            </Button>
          </div>
        )}

        {events.length === 0 ? (
          <div className="rounded-xl border border-gray-200 px-6 py-12 text-center dark:border-gray-800">
            <Activity className="mx-auto mb-3 h-8 w-8 text-gray-300 dark:text-gray-600" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t.authActivityNoActivityTitle || "No activity yet"}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t.authActivityCreateHint || "Create a note while signed in to see it here."}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {groups.map((group) => (
              <div key={group.period}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                  {periodLabel(group.period)}
                </p>
                <ul className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 dark:divide-gray-800/80 dark:border-gray-800">
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
                    const desc = eventDescription(ev.type);
                    const expanded = expandedId === ev.id;
                    const deliveryStatus =
                      capabilities.sentNotesDashboard && ev.delivery
                        ? statusLabel(ev.delivery.status, t)
                        : null;
                    const noteLabel = ev.noteId ? noteLabels[ev.noteId] ?? null : null;

                    return (
                      <li
                        key={ev.id}
                        className="bg-white transition-colors dark:bg-gray-950/20"
                      >
                        <div className="flex items-start gap-3 px-4 py-3.5">
                          <span
                            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${eventAccent(ev.type)}`}
                            aria-hidden
                          >
                            <EventIcon type={ev.type} />
                          </span>

                          <button
                            type="button"
                            className="min-w-0 flex-1 text-left"
                            aria-expanded={expanded}
                            onClick={() =>
                              setExpandedId((current) => (current === ev.id ? null : ev.id))
                            }
                          >
                            <div className="flex items-start gap-2">
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium leading-snug text-gray-900 dark:text-white">
                                  {eventLabel(ev.type)}
                                </p>
                                {desc ? (
                                  <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                                    {desc}
                                  </p>
                                ) : null}
                                {deliveryStatus ? (
                                  <p
                                    className={`mt-1 text-xs font-semibold ${statusTone(ev.delivery!.status)}`}
                                  >
                                    {deliveryStatus}
                                  </p>
                                ) : null}
                              </div>
                              <ChevronDown
                                className={`mt-0.5 h-4 w-4 shrink-0 text-gray-400 transition-transform ${expanded ? "rotate-180" : ""}`}
                                aria-hidden
                              />
                            </div>
                          </button>

                          <div className="flex shrink-0 flex-col items-end gap-1">
                            <p
                              className="text-xs text-gray-400 dark:text-gray-500"
                              title={absolute}
                            >
                              {relative}
                            </p>
                            <button
                              type="button"
                              onClick={() => void handleDelete(ev.id)}
                              disabled={deletingId === ev.id || Boolean(revokingNoteId)}
                              className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-50 dark:hover:bg-gray-900 dark:hover:text-red-400"
                              aria-label={tx("authActivityDeleteAria", "Delete activity item")}
                            >
                              <Trash2 className="h-4 w-4" aria-hidden />
                            </button>
                          </div>
                        </div>

                        {expanded ? (
                          <div className="border-t border-gray-100 bg-gray-50/70 px-4 py-3 pl-[3.75rem] dark:border-gray-800/80 dark:bg-gray-900/30">
                            <DeliveryPanel
                              event={ev}
                              noteLabel={noteLabel}
                              canTrackDelivery={capabilities.sentNotesDashboard}
                              canRevokeUnopened={capabilities.revokeUnopened}
                              revoking={revokingNoteId === ev.delivery?.noteId}
                              onRevoke={setRevokeTarget}
                              onViewProof={setProofTarget}
                              t={t}
                            />
                          </div>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}

        <p className="text-center text-xs text-gray-400 dark:text-gray-500">
          {tx(
            "authActivityPrivacyFootnote",
            "This history is for your convenience. Delete items anytime — PrivateNote does not keep a permanent audit log here.",
          )}
        </p>
      </div>

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

      <ProofReportDialog
        item={proofTarget}
        noteLabel={proofTarget ? noteLabels[proofTarget.noteId] ?? null : null}
        open={proofTarget !== null}
        onOpenChange={(open) => {
          if (!open) setProofTarget(null);
        }}
        t={t}
      />

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
