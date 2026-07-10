import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { Bell, Trash2 } from "lucide-react";
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
import { apiRequest, ApiRequestError } from "@/lib/queryClient";
import { AccountSettingsShell } from "./AccountSettingsShell";
import { hasPremiumFeatures, normalizeAccountType } from "@shared/planCatalog";
import {
  deleteNoteLabel,
  deleteNoteLabels,
  readNoteLabels,
} from "@/utils/noteLabelsStorage";
import {
  formatNotificationTimestamp,
  groupNotifications,
  statusLabel,
  statusTone,
  type NotificationItem,
  type TimePeriod,
} from "./NotificationCenter.logic";

function NotificationCard({
  item,
  noteLabel,
  onDelete,
  deleting,
  t,
}: {
  item: NotificationItem;
  noteLabel: string | null;
  onDelete: (id: string) => void;
  deleting: boolean;
  t: Record<string, string>;
}) {
  const recipient =
    item.recipientEmail?.trim() ||
    (t.notificationRecipientUnknown ?? "Recipient not recorded");
  const headline = noteLabel?.trim() || recipient;

  return (
    <li className="relative rounded-xl border border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-gray-950/30">
      <button
        type="button"
        onClick={() => onDelete(item.id)}
        disabled={deleting}
        className="absolute right-3 top-3 rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-50 dark:hover:bg-gray-900 dark:hover:text-red-400"
        aria-label={t.notificationDeleteAria ?? "Delete notification"}
      >
        <Trash2 className="h-4 w-4" aria-hidden />
      </button>

      <div className="space-y-1 pr-10 text-left">
        <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">{headline}</p>
        {noteLabel?.trim() ? (
          <p className="truncate text-xs text-gray-500 dark:text-gray-400">{recipient}</p>
        ) : null}
        <p className="font-mono text-xs text-gray-400 dark:text-gray-500">{item.displayNoteId}</p>
        <p className={`pt-1 text-sm font-semibold ${statusTone(item.status)}`}>
          {statusLabel(item.status, t)}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {formatNotificationTimestamp(item.eventAt)}
        </p>
      </div>
    </li>
  );
}

export default function NotificationCenter() {
  const { user, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const tx = (key: string, fallback: string) => t[key] || fallback;
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [noteLabels, setNoteLabels] = useState<Record<string, string>>(() => readNoteLabels());
  const [isPremium, setIsPremium] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [clearing, setClearing] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try {
      const summary = await apiRequest<{ ok: boolean; accountType?: string; plan?: string }>(
        "/api/auth/account/summary",
        "GET",
      );
      const accountType = normalizeAccountType(summary.accountType ?? summary.plan);
      const premium = hasPremiumFeatures(accountType);
      setIsPremium(premium);
      if (!premium) {
        setNotifications([]);
        return;
      }
      const data = await apiRequest<{ ok: boolean; notifications: NotificationItem[] }>(
        "/api/auth/account/notifications?limit=50",
        "GET",
      );
      setNotifications(data.ok && Array.isArray(data.notifications) ? data.notifications : []);
      setNoteLabels(readNoteLabels());
    } catch (err) {
      if (err instanceof ApiRequestError && err.status === 403) {
        setIsPremium(false);
        setNotifications([]);
        return;
      }
      setError(tx("notificationLoadError", "Could not load notifications."));
    } finally {
      setLoading(false);
    }
  }, [tx]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    void load();
  }, [authLoading, user, load]);

  const groups = useMemo(() => groupNotifications(notifications), [notifications]);

  const periodLabel = (period: TimePeriod): string => {
    switch (period) {
      case "today":
        return tx("authActivityToday", "Today");
      case "yesterday":
        return tx("authActivityYesterday", "Yesterday");
      case "this_week":
        return tx("authActivityThisWeek", "This week");
      case "earlier":
        return tx("authActivityEarlier", "Earlier");
    }
  };

  const handleDelete = async (id: string) => {
    const item = notifications.find((entry) => entry.id === id);
    setDeletingId(id);
    setError(null);
    try {
      await apiRequest(`/api/auth/account/notifications/${encodeURIComponent(id)}`, "DELETE");
      setNotifications((prev) => prev.filter((entry) => entry.id !== id));
      if (item?.noteId) {
        deleteNoteLabel(item.noteId);
        setNoteLabels(readNoteLabels());
      }
    } catch {
      setError(tx("notificationDeleteError", "Could not delete that notification."));
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearHistory = async () => {
    setClearing(true);
    setError(null);
    try {
      await apiRequest("/api/auth/account/notifications", "DELETE");
      deleteNoteLabels(notifications.map((item) => item.noteId).filter(Boolean));
      setNoteLabels(readNoteLabels());
      setNotifications([]);
      setClearDialogOpen(false);
    } catch {
      setError(tx("notificationClearError", "Could not clear notification history."));
    } finally {
      setClearing(false);
    }
  };

  if (authLoading || loading) {
    return (
      <AccountSettingsShell>
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 rounded bg-gray-200 dark:bg-gray-800" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-gray-100 dark:bg-gray-800/60" />
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
            {tx("notificationSignInPrompt", "Sign in to view delivery notifications.")}
          </p>
          <Button asChild size="sm">
            <a href="/auth/sign-in">{tx("signIn", "Sign in")}</a>
          </Button>
        </div>
      </AccountSettingsShell>
    );
  }

  if (isPremium === false) {
    return (
      <AccountSettingsShell>
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {tx("notificationCenterTitle", "Notification Center")}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {tx(
                "notificationCenterSubtitle",
                "Delivery status only — never note content, titles, or previews.",
              )}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 px-6 py-10 text-center dark:border-gray-800">
            <Bell className="mx-auto mb-3 h-8 w-8 text-gray-300 dark:text-gray-600" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {tx("notificationPremiumRequired", "Premium delivery tracking")}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {tx(
                "notificationPremiumHint",
                "Upgrade to track when notes are viewed, burned, or downloaded — without storing message content.",
              )}
            </p>
            <Button asChild className="mt-4" size="sm">
              <Link href="/premium">{tx("upgradeToPremium", "Upgrade to Premium")}</Link>
            </Button>
          </div>
        </div>
      </AccountSettingsShell>
    );
  }

  return (
    <AccountSettingsShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {tx("notificationCenterTitle", "Notification Center")}
            </h1>
            <p className="mt-1 max-w-xl text-sm text-gray-500 dark:text-gray-400">
              {tx(
                "notificationCenterSubtitle",
                "Delivery status only — never note content, titles, or previews.",
              )}
            </p>
          </div>
          {notifications.length > 0 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0"
              onClick={() => setClearDialogOpen(true)}
            >
              {tx("notificationClearHistory", "Clear history")}
            </Button>
          ) : null}
        </div>

        {error ? (
          <div className="flex items-center justify-between gap-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800 dark:bg-amber-950/30">
            <p className="text-sm text-amber-700 dark:text-amber-300" role="alert">
              {error}
            </p>
            <Button variant="outline" size="sm" onClick={() => void load()}>
              {tx("authRetry", "Retry")}
            </Button>
          </div>
        ) : null}

        {notifications.length === 0 ? (
          <div className="rounded-xl border border-gray-200 px-6 py-12 text-center dark:border-gray-800">
            <Bell className="mx-auto mb-3 h-8 w-8 text-gray-300 dark:text-gray-600" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {tx("notificationEmptyTitle", "No notifications yet")}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {tx(
                "notificationEmptyHint",
                "Enable email alerts on a note to start tracking delivery status here.",
              )}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {groups.map((group) => (
              <section key={group.period}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                  {periodLabel(group.period)}
                </p>
                <ul className="space-y-3">
                  {group.items.map((item) => (
                    <NotificationCard
                      key={item.id}
                      item={item}
                      noteLabel={noteLabels[item.noteId] ?? null}
                      onDelete={(id) => void handleDelete(id)}
                      deleting={deletingId === item.id}
                      t={t}
                    />
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}

        <p className="text-center text-xs text-gray-400 dark:text-gray-500">
          {tx(
            "notificationPrivacyFootnote",
            "This history is for your convenience. Delete items anytime — PrivateNote does not keep a permanent audit log here.",
          )}
        </p>
      </div>

      <AlertDialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {tx("notificationClearDialogTitle", "Clear notification history?")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {tx(
                "notificationClearDialogBody",
                "This permanently removes all delivery notifications from your account. Note content is not affected.",
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={clearing}>
              {tx("cancel", "Cancel")}
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
                ? tx("notificationClearing", "Clearing...")
                : tx("notificationClearConfirm", "Clear history")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AccountSettingsShell>
  );
}
