import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import { AccountSettingsShell } from "./AccountSettingsShell";
import { formatDistanceToNow, isToday, isYesterday, isThisWeek } from "date-fns";
import { FilePlus2, Eye, Clock, Sparkles, Activity } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ActivityEvent = {
  id: string;
  type: string;
  noteId: string | null;
  createdAt: string;
};

type EventGroup = {
  label: string;
  events: ActivityEvent[];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function eventLabel(type: string): string {
  switch (type) {
    case "note_created": return "Secure note created";
    case "ai_note_created": return "AI-assisted note created";
    case "note_opened": return "Note opened";
    case "note_expired": return "Note expired";
    default: return type.replace(/_/g, " ");
  }
}

function eventDescription(type: string): string {
  switch (type) {
    case "note_created": return "A new secure note was sent from your account.";
    case "ai_note_created": return "An AI-composed note was sent from your account.";
    case "note_opened": return "A note was opened while you were signed in.";
    case "note_expired": return "A note reached its expiry and was destroyed.";
    default: return "";
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

function eventAccent(type: string): string {
  switch (type) {
    case "note_created": return "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "ai_note_created": return "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400";
    case "note_opened": return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
    case "note_expired": return "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400";
    default: return "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400";
  }
}

function groupEvents(events: ActivityEvent[]): EventGroup[] {
  const groups: EventGroup[] = [];
  const buckets: Record<string, ActivityEvent[]> = {};

  for (const ev of events) {
    let label: string;
    try {
      const d = new Date(ev.createdAt);
      if (isToday(d)) label = "Today";
      else if (isYesterday(d)) label = "Yesterday";
      else if (isThisWeek(d, { weekStartsOn: 1 })) label = "This week";
      else label = "Earlier";
    } catch {
      label = "Earlier";
    }
    if (!buckets[label]) {
      buckets[label] = [];
      groups.push({ label, events: buckets[label] });
    }
    buckets[label].push(ev);
  }

  return groups;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AccountActivity() {
  const { user, loading: authLoading } = useAuth();
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
      setError("Could not load activity.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setLoading(false); return; }
    void load();
  }, [authLoading, user, load]);

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
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Sign in to see recent note activity.</p>
          <Button asChild size="sm">
            <a href="/auth/sign-in">Sign in</a>
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
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Activity</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Timestamps and event types only — note contents are never recorded here.
          </p>
        </div>

        {error && (
          <p className="text-sm text-amber-700 dark:text-amber-300" role="alert">{error}</p>
        )}

        {/* ── Event timeline ─────────────────────────────────────────────── */}
        {events.length === 0 ? (
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 px-6 py-12 text-center">
            <Activity className="mx-auto mb-3 h-8 w-8 text-gray-300 dark:text-gray-600" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">No activity yet</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Create a note while signed in to see it here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {groups.map((group) => (
              <div key={group.label}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                  {group.label}
                </p>
                <ul className="rounded-xl border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800/80 overflow-hidden">
                  {group.events.map((ev) => {
                    let relative = "";
                    let absolute = "";
                    try {
                      const d = new Date(ev.createdAt);
                      relative = formatDistanceToNow(d, { addSuffix: true });
                      absolute = new Intl.DateTimeFormat(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(d);
                    } catch {
                      relative = ev.createdAt;
                    }
                    const desc = eventDescription(ev.type);
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
                        </div>

                        {/* Time */}
                        <div className="shrink-0 text-right">
                          <p className="text-xs text-gray-400 dark:text-gray-500" title={absolute}>
                            {relative}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Premium upsell nudge */}
        {events.length > 0 && (
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
            Extended history is planned for premium accounts.
          </p>
        )}
      </div>
    </AccountSettingsShell>
  );
}
