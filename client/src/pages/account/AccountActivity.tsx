import { useCallback, useEffect, useState } from "react";
import { Link } from "wouter";
import {
  Activity,
  Ban,
  ChevronRight,
  Clock,
  Eye,
  FilePlus2,
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

function statusPillClass(status: NotificationItem["status"]): string {
  switch (status) {
    case "viewed":
    case "receipt_confirmed":
    case "attachment_downloaded":
      return "bg-sky-500/10 text-sky-700 dark:text-sky-300";
    case "burned":
      return "bg-amber-500/10 text-amber-800 dark:text-amber-300";
    case "revoked":
      return "bg-rose-500/10 text-rose-700 dark:text-rose-300";
    case "expired":
      return "bg-gray-500/10 text-gray-600 dark:text-gray-400";
    default:
      return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
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

function statusMeaning(
  status: NotificationItem["status"],
  t: Record<string, string>,
): string {
  switch (status) {
    case "created":
      return (
        t.notificationStatusCreatedHint ??
        "Waiting for the recipient to open the link."
      );
    case "viewed":
      return (
        t.notificationStatusViewedHint ??
        "The recipient opened the link. The note may still be available if multiple reads were allowed."
      );
    case "burned":
      return (
        t.notificationStatusBurnedHint ??
        "The note was destroyed after the read limit. On one-time notes this usually happens at the same time as open."
      );
    case "expired":
      return (
        t.notificationStatusExpiredHint ??
        "The note reached its expiry time and was destroyed without being opened, or after expiry."
      );
    case "revoked":
      return (
        t.notificationStatusRevokedHint ??
        "You revoked the link before it could be opened."
      );
    case "attachment_downloaded":
      return (
        t.notificationStatusAttachmentDownloadedHint ??
        "An attachment was downloaded from the note."
      );
    case "receipt_confirmed":
      return (
        t.notificationStatusReceiptConfirmedHint ??
        "The recipient confirmed receipt."
      );
    default:
      return "";
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
      <div className="space-y-4">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {t.authActivityDeliveryUpsell ??
            "Delivery status, proof of access, and revoke are available on Starter and Business."}
        </p>
        <Button asChild size="sm">
          <Link href="/premium">{t.comparePlans ?? "Compare plans"}</Link>
        </Button>
      </div>
    );
  }

  const delivery = event.delivery;
  if (!delivery) {
    return (
      <div className="space-y-2 rounded-2xl bg-muted/40 px-4 py-4">
        <p className="text-sm font-medium text-foreground">
          {t.authActivityNoDeliveryTitle ?? "No delivery tracking"}
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {t.authActivityNoDeliveryTracking ??
            "No delivery tracking for this note. Tracking and proof of access start when you send with recipient alerts enabled on a Starter or Business plan."}
        </p>
      </div>
    );
  }

  const recipient =
    delivery.recipientEmail?.trim() ||
    (t.notificationRecipientUnknown ?? "Recipient not recorded");
  const canRevoke = canRevokeUnopened && delivery.status === "created";
  const timeline = buildProofTimeline(delivery);
  const accessed = Boolean(delivery.openedAt);
  const proofEnabled = Boolean(delivery.proofEnabled);
  const unavailable = t.proofUnavailable ?? "Not available";
  const country = delivery.openCountry?.trim() || unavailable;
  const device = formatDeviceClass(delivery.openDeviceClass, t);
  const browser = delivery.openBrowser?.trim() || unavailable;

  return (
    <div className="space-y-7">
      <div className="space-y-3">
        {noteLabel?.trim() ? (
          <p className="text-base font-medium text-foreground">{noteLabel.trim()}</p>
        ) : null}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusPillClass(delivery.status)}`}
          >
            {statusLabel(delivery.status, t)}
          </span>
          <span className="font-mono text-xs text-muted-foreground">{delivery.displayNoteId}</span>
        </div>
        <p className="text-sm text-muted-foreground">{statusMeaning(delivery.status, t)}</p>
        <p className="text-sm text-muted-foreground">{recipient}</p>
      </div>

      <section className="space-y-4">
        <h3 className="text-sm font-medium text-foreground">
          {t.proofReportTitle ?? "Proof of access"}
        </h3>
        <p className="text-xs leading-relaxed text-muted-foreground">
          {t.proofReportSubtitle ??
            "Coarse receipt that the link was accessed — not that the message was read or understood. Message content is never included."}
        </p>

        <div className="space-y-3">
          <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {t.proofTimelineHeading ?? "Timeline"}
          </h4>
          {timeline.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {t.proofNoEventsYet ?? "No delivery events recorded yet."}
            </p>
          ) : (
            <ol className="relative space-y-0 border-l border-border/80 pl-5">
              {timeline.map((entry, index) => (
                <li key={`${entry.key}-${entry.at}`} className="relative pb-5 last:pb-0">
                  <span
                    className={`absolute -left-[1.4rem] top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-background ${
                      index === timeline.length - 1 ? "bg-primary" : "bg-muted-foreground/40"
                    }`}
                    aria-hidden
                  />
                  <p className="text-sm font-medium text-foreground">{timelineLabel(entry, t)}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatProofTimestamp(entry.at)}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
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
                "This note was opened, but approximate country and device were not captured for it. New notes on Starter/Business record that when the link is opened."}
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-muted/50 px-4 py-3">
                <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                  <Globe2 className="h-4 w-4" aria-hidden />
                  <span className="text-xs font-medium">
                    {t.proofCountryLabel ?? "Approximate country"}
                  </span>
                </div>
                <p className="text-sm font-medium text-foreground">{country}</p>
              </div>
              <div className="rounded-2xl bg-muted/50 px-4 py-3">
                <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                  <MonitorSmartphone className="h-4 w-4" aria-hidden />
                  <span className="text-xs font-medium">{t.proofDeviceLabel ?? "Device"}</span>
                </div>
                <p className="text-sm font-medium text-foreground">
                  {device}
                  {browser !== unavailable ? ` · ${browser}` : ""}
                </p>
              </div>
            </div>
          )}
          <p className="text-xs leading-relaxed text-muted-foreground">
            {t.proofDisclaimer ??
              "PrivateNote cannot see decrypted note content. Country is approximate (network edge) and may be missing or inaccurate on some networks."}
          </p>
        </div>
      </section>

      {canRevoke ? (
        <div className="space-y-3 border-t border-border/70 pt-6">
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
                    const desc = eventDescription(ev.type);
                    const delivery = capabilities.sentNotesDashboard ? ev.delivery : null;
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
                              className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${eventAccent(ev.type)}`}
                              aria-hidden
                            >
                              <EventIcon type={ev.type} />
                            </span>
                            <div className="min-w-0 flex-1 space-y-1.5">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-sm font-medium text-foreground">
                                  {eventLabel(ev.type)}
                                </p>
                                {delivery ? (
                                  <span
                                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${statusPillClass(delivery.status)}`}
                                  >
                                    {statusLabel(delivery.status, t)}
                                  </span>
                                ) : null}
                              </div>
                              {desc ? (
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
                <DialogTitle className="pr-6 text-lg tracking-tight">
                  {eventLabel(selectedEvent.type)}
                </DialogTitle>
                <DialogDescription className="text-sm leading-relaxed">
                  {eventDescription(selectedEvent.type) ||
                    (t.authActivityInspectHint ?? "Delivery and access details for this note.")}
                </DialogDescription>
              </DialogHeader>
              <div className="pt-2">
                <DeliveryDetail
                  event={selectedEvent}
                  noteLabel={
                    selectedEvent.noteId ? noteLabels[selectedEvent.noteId] ?? null : null
                  }
                  canTrackDelivery={capabilities.sentNotesDashboard}
                  canRevokeUnopened={capabilities.revokeUnopened}
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
