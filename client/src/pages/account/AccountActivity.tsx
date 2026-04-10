import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import { AccountSettingsShell } from "./AccountSettingsShell";
import { formatDistanceToNow } from "date-fns";

type ActivityEvent = {
  id: string;
  type: string;
  noteId: string | null;
  createdAt: string;
};

function describeEvent(ev: ActivityEvent): string {
  switch (ev.type) {
    case "note_created":
      return "Secure note created";
    case "ai_note_created":
      return "AI-assisted note created";
    case "note_opened":
      return "Note opened";
    case "note_expired":
      return "Note expired";
    default:
      return ev.type.replace(/_/g, " ");
  }
}

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
    if (!user) {
      setLoading(false);
      return;
    }
    void load();
  }, [authLoading, user, load]);

  if (authLoading || loading) {
    return (
      <AccountSettingsShell>
        <Card>
          <CardContent className="py-8">
            <p className="text-sm text-gray-600 dark:text-gray-300">Loading activity…</p>
          </CardContent>
        </Card>
      </AccountSettingsShell>
    );
  }

  if (!user) {
    return (
      <AccountSettingsShell>
        <Card>
          <CardHeader>
            <CardTitle>Activity</CardTitle>
            <CardDescription>Sign in to see recent note-related activity (metadata only).</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <a href="/auth/sign-in">Sign in</a>
            </Button>
          </CardContent>
        </Card>
      </AccountSettingsShell>
    );
  }

  return (
    <AccountSettingsShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Activity</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 max-w-2xl">
            Timestamps and event types only — never note contents. Opened events are recorded when you view a
            note while signed in.
          </p>
        </div>

        {error && (
          <p className="text-sm text-amber-700 dark:text-amber-300" role="alert">
            {error}
          </p>
        )}

        <Card className="border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-lg">Recent activity</CardTitle>
            <CardDescription>Newest first.</CardDescription>
          </CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                No activity yet. Create a note while signed in to see it here.
              </p>
            ) : (
              <ul className="space-y-0 divide-y divide-gray-200 dark:divide-gray-800 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                {events.map((ev) => {
                  let relative = "";
                  try {
                    relative = formatDistanceToNow(new Date(ev.createdAt), { addSuffix: true });
                  } catch {
                    relative = ev.createdAt;
                  }
                  return (
                    <li key={ev.id} className="px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 bg-white dark:bg-gray-950/30">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {describeEvent(ev)}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">{relative}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
          Want activity history longer than 24 hours?{" "}
          <span className="font-medium text-gray-900 dark:text-white">Upgrade to Pro</span> when billing is
          available.
        </div>
      </div>
    </AccountSettingsShell>
  );
}
