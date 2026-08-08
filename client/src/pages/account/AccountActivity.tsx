import { useCallback, useEffect, useState } from "react";
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
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { ApiRequestError, apiRequest } from "@/lib/queryClient";
import { AccountSettingsShell } from "./AccountSettingsShell";
import { parseActivityCreatedAt } from "@/lib/parseActivityCreatedAt";
import { formatDistanceToNow, isToday, isYesterday, isThisWeek } from "date-fns";
import { FilePlus2, Eye, Clock, Sparkles, Activity, Trash2, Ban } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ActivityEvent = {
  id: string;
  type: string;
  noteId: string | null;
  createdAt: string;
  canRevoke?: boolean;
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
    case "note_created": return "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "ai_note_created": return "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400";
    case "note_opened": return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
    case "note_expired": return "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400";
    default: return "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400";
  }
}

function EventIcon({ type }: { type: string }) {
  switch (type) {
    case "note_created": return <FilePlus2 className="h-4 w-4" />;
    case "ai_note_created": return <Sparkles className="h-4 w-4" />;
    case "note_opened": return <Eye className="h-4 w-4" />;
    case "note_expired": return <Clock className="h-4 w-4" />;
    default: return <Activity className="h-4 w-4" />;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AccountActivity() {
  const { user, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<ActivityEvent | null>(null);
  const [revokingNoteId, setRevokingNoteId] = useState<string | null>(null);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [clearing, setClearing] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await apiRequest<{ ok: boolean; events: ActivityEvent[] }>(
        "/api/auth/account/activity?limit=40",
        "GET",
      );
      setEvents(data.ok && Array.isArray(data.events) ? data.events : []);
    } catch {
      setEvents([]);
      setError(t.authActivityLoadError || "Could not load activity.");
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setLoading(false); return; }
    void load();
  }, [authLoading, user, load]);

  const periodLabel = (period: TimePeriod): string => {
    switch (period) {
      case "today": return t.authActivityToday || "Today";
      case "yesterday": return t.authActivityYesterday || "Yesterday";
      case "this_week": return t.authActivityThisWeek || "This week";
      case "earlier": return t.authActivityEarlier || "Earlier";
    }
  };

  const eventLabel = (type: string): string => {
    switch (type) {
      case "note_created": return t.authActivitySecureNoteCreated || "Secure note created";
      case "ai_note_created": return t.authActivityAiNoteCreated || "AI-assisted note created";
      case "note_opened": return t.authActivityNoteOpened || "Note opened";
      case "note_expired": return t.authActivityNoteExpired || "Note expired";
      default: return type.replace(/_/g, " ");
    }
  };

  const eventDescription = (type: string): string => {
    switch (type) {
      case "note_created": return t.authActivitySecureNoteCreatedDesc || "A new secure note was sent from your account.";
      case "ai_note_created": return t.authActivityAiNoteCreatedDesc || "An AI-composed note was sent from your account.";
      case "note_opened": return t.authActivityNoteOpenedDesc || "A note was opened while you were signed in.";
      case "note_expired": return t.authActivityNoteExpiredDesc || "A note reached its expiry and was destroyed.";
      default: return "";
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setError(null);
    try {
      await apiRequest(`/api/auth/account/activity/${encodeURIComponent(id)}`, "DELETE");
      setEvents((prev) => prev.filter((entry) => entry.id !== id));
    } catch {
      setError(t.authActivityDeleteError || "Could not delete that activity event.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleRevokeConfirm = async () => {
    if (!revokeTarget?.noteId) return;
    const target = revokeTarget;
    const noteId = target.noteId!;
    setRevokingNoteId(noteId);
    setError(null);
    try {
      await apiRequest(`/api/notes/${encodeURIComponent(noteId)}/revoke`, "POST");
      setEvents((prev) =>
        prev.map((entry) =>
          entry.noteId === noteId ? { ...entry, canRevoke: false } : entry,
        ),
      );
      setRevokeTarget(null);
      toast({
        title: t.notificationRevokeSuccessTitle || "Note revoked",
        description: t.notificationRevokeSuccessBody || "The link can no longer be opened.",
      });
    } catch (err) {
      if (err instanceof ApiRequestError && err.status === 409) {
        setEvents((prev) =>
          prev.map((entry) =>
            entry.noteId === noteId ? { ...entry, canRevoke: false } : entry,
          ),
        );
        setRevokeTarget(null);
        toast({
          title: t.notificationRevokeAlreadyOpened || "Already opened",
          description:
            t.notificationRevokeAlreadyOpened ||
            "This note was already opened and can no longer be revoked.",
          variant: "destructive",
        });
      } else {
        setError(t.notificationRevokeError || "Could not revoke that note.");
      }
    } finally {
      setRevokingNoteId(null);
    }
  };

  const handleClearHistory = async () => {
    setClearing(true);
    setError(null);
    try {
      await apiRequest("/api/auth/account/activity", "DELETE");
      setEvents([]);
      setClearDialogOpen(false);
    } catch {
      setError(t.authActivityClearError || "Could not clear activity history.");
    } finally {
      setClearing(false);
    }
  };

  // ── Loading ────────────────────────────────────────────────────────────────
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

  // ── Not signed in ──────────────────────────────────────────────────────────
  if (!user) {
    return (
      <AccountSettingsShell>
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t.authActivitySignInPrompt || "Sign in to see recent note activity."}</p>
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
        {/* Page header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{t.authActivityPageTitle || "Activity"}</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t.authActivityPageSubtitle || "Timestamps and event types only — note contents are never recorded here."}
            </p>
          </div>
          {events.length > 0 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0 gap-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/40 dark:hover:text-red-300"
              onClick={() => setClearDialogOpen(true)}
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden />
              {t.authActivityClearHistory || "Delete all"}
            </Button>
          ) : null}
        </div>

        {error && (
          <div className="flex items-center justify-between gap-4 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 px-4 py-3">
            <p className="text-sm text-amber-700 dark:text-amber-300" role="alert">{error}</p>
            <Button variant="outline" size="sm" onClick={() => void load()}>
              {t.authRetry || "Retry"}
            </Button>
          </div>
        )}

        {/* ── Event timeline ─────────────────────────────────────────────── */}
        {events.length === 0 ? (
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 px-6 py-12 text-center">
            <Activity className="mx-auto mb-3 h-8 w-8 text-gray-300 dark:text-gray-600" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.authActivityNoActivityTitle || "No activity yet"}</p>
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
                <ul className="rounded-xl border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800/80 overflow-hidden">
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
                    const deleting = deletingId === ev.id;
                    const revoking = Boolean(ev.noteId && revokingNoteId === ev.noteId);
                    const canRevoke = ev.canRevoke === true && Boolean(ev.noteId);
                    return (
                      <li key={ev.id} className="flex items-start gap-4 px-4 py-3.5 bg-white dark:bg-gray-950/20 hover:bg-gray-50/60 dark:hover:bg-gray-900/30 transition-colors">
                        {/* Icon */}
                        <span
                          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${eventAccent(ev.type)}`}
                          aria-hidden
                        >
                          <EventIcon type={ev.type} />
                        </span>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white leading-snug">
                            {eventLabel(ev.type)}
                          </p>
                          {desc && (
                            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{desc}</p>
                          )}
                          {canRevoke ? (
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                              {t.notificationRevokeHint ||
                                "Still unopened — you can revoke the link so it can no longer be opened."}
                            </p>
                          ) : null}
                        </div>

                        {/* Time + actions */}
                        <div className="flex shrink-0 flex-col items-end gap-1.5 sm:flex-row sm:items-start sm:gap-2">
                          <p className="pt-0.5 text-xs text-gray-400 dark:text-gray-500" title={absolute}>
                            {relative}
                          </p>
                          {canRevoke ? (
                            <button
                              type="button"
                              onClick={() => setRevokeTarget(ev)}
                              disabled={revoking || deleting || clearing || Boolean(revokingNoteId)}
                              className="inline-flex items-center gap-1 rounded-md border border-rose-200 bg-white px-2 py-1 text-xs font-medium text-rose-700 transition-colors hover:border-rose-300 hover:bg-rose-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/40 disabled:opacity-50 dark:border-rose-900 dark:bg-gray-950 dark:text-rose-300 dark:hover:border-rose-800 dark:hover:bg-rose-950/40"
                              aria-label={t.notificationRevokeAria || "Revoke unopened note"}
                              title={t.notificationRevokeAria || "Revoke unopened note"}
                            >
                              <Ban className="h-3.5 w-3.5" aria-hidden />
                              <span>{t.notificationRevokeConfirm || "Revoke link"}</span>
                            </button>
                          ) : null}
                          <button
                            type="button"
                            onClick={() => void handleDelete(ev.id)}
                            disabled={deleting || clearing || revoking}
                            className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300 dark:hover:border-red-900 dark:hover:bg-red-950/40 dark:hover:text-red-300"
                            aria-label={t.authActivityDeleteAria || "Delete activity event"}
                          >
                            <Trash2 className="h-3.5 w-3.5" aria-hidden />
                            <span>{t.authActivityDelete || "Delete"}</span>
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}

        {events.length > 0 ? (
          <p className="text-center text-xs text-gray-400 dark:text-gray-500">
            {t.authActivityPrivacyFootnote ||
              "This history is for your convenience. Delete items anytime — PrivateNote does not keep a permanent audit log here."}
          </p>
        ) : null}
      </div>

      <AlertDialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t.authActivityClearDialogTitle || "Delete all activity?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t.authActivityClearDialogBody ||
                "This permanently removes all activity events from your account. Notes themselves are not affected."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={clearing}>
              {t.cancel || "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={clearing}
              onClick={(event) => {
                event.preventDefault();
                void handleClearHistory();
              }}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {clearing
                ? t.authActivityClearing || "Deleting..."
                : t.authActivityClearConfirm || "Delete all"}
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
              {t.notificationRevokeDialogTitle || "Revoke this note?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t.notificationRevokeDialogBody ||
                "The secret link will stop working immediately. This only works if the note has not been opened yet."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={Boolean(revokingNoteId)}>
              {t.cancel || "Cancel"}
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
                ? t.notificationRevoking || "Revoking..."
                : t.notificationRevokeConfirm || "Revoke link"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AccountSettingsShell>
  );
}
