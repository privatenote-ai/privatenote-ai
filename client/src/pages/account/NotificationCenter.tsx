import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { Link } from "wouter";
import {
  Ban,
  Bell,
  Download,
  FileSearch,
  Globe2,
  MonitorSmartphone,
  Share2,
  Trash2,
  Upload,
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
import { AccountSettingsShell } from "./AccountSettingsShell";
import { normalizeAccountType, planFeaturesFor } from "@shared/planCatalog";
import {
  NOTE_LABELS_PREFILL_MAX_CHARS,
  countNoteLabels,
  deleteNoteLabel,
  deleteNoteLabels,
  downloadNoteLabelsExport,
  mergeNoteLabelsIntoLocal,
  parseNoteLabelsExport,
  readNoteLabels,
  serializeNoteLabelsExport,
} from "@/utils/noteLabelsStorage";
import { localizedPath } from "@/utils/localizedPath";
import {
  buildProofTimeline,
  formatDeviceClass,
  formatNotificationTimestamp,
  formatOpenCountLabel,
  formatProofTimestamp,
  groupNotifications,
  hasProofReport,
  statusLabel,
  statusTone,
  type NotificationItem,
  type ProofTimelineEntry,
  type TimePeriod,
} from "./NotificationCenter.logic";

/** Must match `PREFILL_SS_KEY` in `usePrefillFromFragment.ts`. */
const PREFILL_SS_KEY = "__pn_prefill_v1";

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
      return t.proofTimelineRevoked ?? "Burned by you";
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
    item.noteId;
  const timeline = buildProofTimeline(item);
  const country = item.openCountry?.trim() || (t.proofUnavailable ?? "Not available");
  const device = formatDeviceClass(item.openDeviceClass, t);
  const browser = item.openBrowser?.trim() || (t.proofUnavailable ?? "Not available");
  const accessed = Boolean(item.openedAt);
  const opensLabel = formatOpenCountLabel(item.openCount ?? 0, item.maxReads, t);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto overflow-x-clip touch-manipulation sm:max-w-lg">
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
            <p className="mt-1 break-all font-mono text-xs text-gray-500 dark:text-gray-400">
              {item.noteId}
            </p>
            <p className={`mt-2 text-sm font-semibold ${statusTone(item.status)}`}>
              {statusLabel(item.status, t)}
            </p>
            {opensLabel ? (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{opensLabel}</p>
            ) : null}
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

function NotificationCard({
  item,
  noteLabel,
  onDelete,
  onRevoke,
  onViewProof,
  deleting,
  revoking,
  canRevokeUnopened,
  t,
}: {
  item: NotificationItem;
  noteLabel: string | null;
  onDelete: (id: string) => void;
  onRevoke: (item: NotificationItem) => void;
  onViewProof: (item: NotificationItem) => void;
  deleting: boolean;
  revoking: boolean;
  canRevokeUnopened: boolean;
  t: Record<string, string>;
}) {
  const recipient =
    item.recipientEmail?.trim() ||
    (t.notificationRecipientUnknown ?? "Recipient not recorded");
  const headline = noteLabel?.trim() || item.label?.trim() || recipient;
  const canRevoke = canRevokeUnopened && item.status === "created";
  const canViewProof = Boolean(item.proofEnabled) && hasProofReport(item);
  const opensLabel = formatOpenCountLabel(item.openCount ?? 0, item.maxReads, t);
  const proofSummaryParts: string[] = [];
  if (item.openCountry?.trim()) proofSummaryParts.push(item.openCountry.trim());
  if (item.openDeviceClass?.trim()) {
    proofSummaryParts.push(formatDeviceClass(item.openDeviceClass, t));
  }

  return (
    <li className="relative rounded-xl border border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-gray-950/30">
      <div className="absolute right-3 top-3 flex items-center gap-1">
        {canViewProof ? (
          <button
            type="button"
            onClick={() => onViewProof(item)}
            disabled={deleting || revoking}
            className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-sky-50 hover:text-sky-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-50 dark:hover:bg-sky-950/40 dark:hover:text-sky-300"
            aria-label={t.proofViewAria ?? "View proof of access"}
            title={t.proofViewAria ?? "View proof of access"}
          >
            <FileSearch className="h-4 w-4" aria-hidden />
          </button>
        ) : null}
        {canRevoke ? (
          <button
            type="button"
            onClick={() => onRevoke(item)}
            disabled={revoking || deleting}
            className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-50 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
            aria-label={t.notificationRevokeAria ?? "Burn unopened note"}
            title={t.notificationRevokeAria ?? "Burn unopened note"}
          >
            <Ban className="h-4 w-4" aria-hidden />
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => onDelete(item.id)}
          disabled={deleting || revoking}
          className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-50 dark:hover:bg-gray-900 dark:hover:text-red-400"
          aria-label={t.notificationDeleteAria ?? "Delete notification"}
        >
          <Trash2 className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <div className="space-y-1 pr-20 text-left">
        <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">{headline}</p>
        {noteLabel?.trim() || item.label?.trim() ? (
          <p className="truncate text-xs text-gray-500 dark:text-gray-400">{recipient}</p>
        ) : null}
        <p className="break-all font-mono text-xs text-gray-400 dark:text-gray-500">{item.noteId}</p>
        {opensLabel ? (
          <p className="text-xs text-gray-500 dark:text-gray-400">{opensLabel}</p>
        ) : null}
        <p className={`pt-1 text-sm font-semibold ${statusTone(item.status)}`}>
          {statusLabel(item.status, t)}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {formatNotificationTimestamp(item.eventAt)}
        </p>
        {proofSummaryParts.length > 0 ? (
          <p className="pt-1 text-xs text-gray-500 dark:text-gray-400">
            {(t.proofCardSummary ?? "Access: {details}").replace(
              "{details}",
              proofSummaryParts.join(" · "),
            )}
          </p>
        ) : null}
        {canViewProof ? (
          <button
            type="button"
            onClick={() => onViewProof(item)}
            className="pt-1 text-xs font-medium text-primary hover:underline"
          >
            {t.proofViewLink ?? "View proof of access"}
          </button>
        ) : null}
        {canRevoke ? (
          <p className="pt-1 text-xs text-gray-500 dark:text-gray-400">
            {t.notificationRevokeHint ??
              "Still unopened — you can burn the link so it can no longer be opened."}
          </p>
        ) : null}
      </div>
    </li>
  );
}

export default function NotificationCenter() {
  const { user, loading: authLoading } = useAuth();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const tx = (key: string, fallback: string) => t[key] || fallback;
  const labelsFileInputRef = useRef<HTMLInputElement>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [noteLabels, setNoteLabels] = useState<Record<string, string>>(() => readNoteLabels());
  const [canUseNotificationCenter, setCanUseNotificationCenter] = useState<boolean | null>(null);
  const [canRevokeUnopened, setCanRevokeUnopened] = useState(false);
  const [canPortNoteLabels, setCanPortNoteLabels] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [revokingNoteId, setRevokingNoteId] = useState<string | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<NotificationItem | null>(null);
  const [proofTarget, setProofTarget] = useState<NotificationItem | null>(null);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [clearing, setClearing] = useState(false);
  const labelCount = countNoteLabels(noteLabels);

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const [summaryResult, notificationsResult] = await Promise.allSettled([
        apiRequest<{ ok: boolean; accountType?: string; plan?: string }>(
          "/api/auth/account/summary",
          "GET",
        ),
        apiRequest<{ ok: boolean; notifications: NotificationItem[] }>(
          "/api/auth/account/notifications?limit=50",
          "GET",
        ),
      ]);

      if (summaryResult.status === "fulfilled") {
        const accountType = normalizeAccountType(
          summaryResult.value.accountType ?? summaryResult.value.plan,
        );
        const capabilities = planFeaturesFor(accountType);
        setCanUseNotificationCenter(capabilities.sentNotesDashboard);
        setCanRevokeUnopened(capabilities.revokeUnopened);
        setCanPortNoteLabels(capabilities.noteLabelPortability);
        if (!capabilities.sentNotesDashboard) {
          setNotifications([]);
          return;
        }
      }

      if (notificationsResult.status === "fulfilled") {
        const data = notificationsResult.value;
        setNotifications(data.ok && Array.isArray(data.notifications) ? data.notifications : []);
        setNoteLabels(readNoteLabels());
        if (summaryResult.status !== "fulfilled") {
          setCanUseNotificationCenter(true);
        }
        return;
      }

      const notifError = notificationsResult.reason;
      if (notifError instanceof ApiRequestError && notifError.status === 403) {
        setCanUseNotificationCenter(false);
        setCanRevokeUnopened(false);
        setCanPortNoteLabels(false);
        setNotifications([]);
        return;
      }

      if (summaryResult.status === "rejected") {
        throw summaryResult.reason;
      }
      throw notifError;
    } catch (err) {
      if (err instanceof ApiRequestError && err.status === 403) {
        setCanUseNotificationCenter(false);
        setNotifications([]);
        return;
      }
      setError(tx("notificationLoadError", "Could not load notifications."));
    } finally {
      setLoading(false);
    }
    // tx reads from t; avoid depending on a fresh tx identity each render (re-fetch loop).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleRevokeConfirm = async () => {
    if (!revokeTarget) return;
    const target = revokeTarget;
    setRevokingNoteId(target.noteId);
    setError(null);
    try {
      await apiRequest(`/api/notes/${encodeURIComponent(target.noteId)}/revoke`, "POST");
      setNotifications((prev) =>
        prev.map((entry) =>
          entry.id === target.id
            ? {
                ...entry,
                status: "revoked",
                eventAt: new Date().toISOString(),
                revokedAt: new Date().toISOString(),
              }
            : entry,
        ),
      );
      setRevokeTarget(null);
      toast({
        title: tx("notificationRevokeSuccessTitle", "Note burned"),
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
            "This note was already opened and can no longer be burned from Activity.",
          ),
        );
        void load();
      } else {
        setError(tx("notificationRevokeError", "Could not burn that note."));
      }
    } finally {
      setRevokingNoteId(null);
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

  const handleDownloadLabels = () => {
    if (!canPortNoteLabels) return;
    if (labelCount === 0) {
      toast({
        title: tx("noteLabelsExportEmptyTitle", "No labels to download"),
        description: tx(
          "noteLabelsExportEmptyBody",
          "Add a note label in Customize when you create a tracked note.",
        ),
      });
      return;
    }
    downloadNoteLabelsExport(noteLabels);
    toast({
      title: tx("noteLabelsExportDownloadedTitle", "Labels downloaded"),
      description: tx(
        "noteLabelsExportDownloadedBody",
        "Load this file on another device, or send it as a PrivateNote.",
      ),
    });
  };

  const handleLoadLabelsFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    event.target.value = "";
    if (!file || !canPortNoteLabels) return;
    try {
      const text = await file.text();
      const parsed = parseNoteLabelsExport(text);
      if (!parsed) {
        toast({
          title: tx("noteLabelsImportInvalidTitle", "Invalid labels file"),
          description: tx(
            "noteLabelsImportInvalidBody",
            "Use a PrivateNote labels export (.json).",
          ),
          variant: "destructive",
        });
        return;
      }
      const result = mergeNoteLabelsIntoLocal(parsed.labels);
      setNoteLabels(result.merged);
      toast({
        title: tx("noteLabelsImportSuccessTitle", "Labels loaded"),
        description: (
          tx(
            "noteLabelsImportSuccessBody",
            "Added {added}, updated {updated}. Existing labels were kept.",
          )
            .replace("{added}", String(result.added))
            .replace("{updated}", String(result.updated))
        ),
      });
    } catch {
      toast({
        title: tx("noteLabelsImportFailedTitle", "Could not load labels"),
        description: tx(
          "noteLabelsImportFailedBody",
          "Check the file and try again.",
        ),
        variant: "destructive",
      });
    }
  };

  const handleSendLabelsAsPrivateNote = () => {
    if (!canPortNoteLabels) return;
    if (labelCount === 0) {
      toast({
        title: tx("noteLabelsExportEmptyTitle", "No labels to download"),
        description: tx(
          "noteLabelsExportEmptyBody",
          "Add a note label in Customize when you create a tracked note.",
        ),
      });
      return;
    }
    const body = serializeNoteLabelsExport(noteLabels).trimEnd();
    if (body.length > NOTE_LABELS_PREFILL_MAX_CHARS) {
      downloadNoteLabelsExport(noteLabels);
      toast({
        title: tx("noteLabelsExportTooLargeTitle", "Labels pack is large"),
        description: tx(
          "noteLabelsExportTooLargeBody",
          "Downloaded as a file instead — attach or open it on your other device.",
        ),
      });
      return;
    }
    try {
      sessionStorage.setItem(
        PREFILL_SS_KEY,
        `#text=${encodeURIComponent(body)}&from=note-labels`,
      );
    } catch {
      downloadNoteLabelsExport(noteLabels);
      toast({
        title: tx("noteLabelsExportPrefillFailedTitle", "Could not open composer"),
        description: tx(
          "noteLabelsExportPrefillFailedBody",
          "Downloaded the labels file instead.",
        ),
        variant: "destructive",
      });
      return;
    }
    window.location.assign(localizedPath("/", language));
  };

  if (authLoading || loading || canUseNotificationCenter === null) {
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

  if (!canUseNotificationCenter) {
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
              Delivery tracking is available with Starter and Business
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Choose a paid plan to track when notes are viewed, burned, or downloaded — and burn unopened links.
            </p>
            <Button asChild className="mt-4" size="sm">
              <Link href="/premium">Compare plans</Link>
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
                "Delivery status and proof of access — never note content, titles, or previews.",
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

        {canPortNoteLabels ? (
          <div className="rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-4 dark:border-gray-800 dark:bg-gray-950/30">
            <input
              ref={labelsFileInputRef}
              type="file"
              accept="application/json,.json"
              className="sr-only"
              tabIndex={-1}
              onChange={(event) => void handleLoadLabelsFile(event)}
            />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {tx("noteLabelsPortabilityTitle", "Move note labels between devices")}
                </p>
                <p className="mt-1 text-xs leading-snug text-gray-500 dark:text-gray-400">
                  {tx(
                    "noteLabelsPortabilityBody",
                    "Labels stay on your devices. Download a pack, load it elsewhere, or send it as a one-time PrivateNote. Note content is never included.",
                  )}
                </p>
                <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                  {tx("noteLabelsPortabilityCount", "{count} labels on this device").replace(
                    "{count}",
                    String(labelCount),
                  )}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadLabels}
                  disabled={labelCount === 0}
                >
                  <Download className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                  {tx("noteLabelsDownload", "Download")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => labelsFileInputRef.current?.click()}
                >
                  <Upload className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                  {tx("noteLabelsLoad", "Load")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSendLabelsAsPrivateNote}
                  disabled={labelCount === 0}
                >
                  <Share2 className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                  {tx("noteLabelsSendAsNote", "Send as PrivateNote")}
                </Button>
              </div>
            </div>
          </div>
        ) : null}

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
                      onRevoke={setRevokeTarget}
                      onViewProof={setProofTarget}
                      deleting={deletingId === item.id}
                      revoking={revokingNoteId === item.noteId}
                      canRevokeUnopened={canRevokeUnopened}
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
              {tx("notificationRevokeDialogTitle", "Burn this note?")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {tx(
                "notificationRevokeDialogBody",
                "The secret link will stop working immediately.",
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
                ? tx("notificationRevoking", "Burning...")
                : tx("notificationRevokeConfirm", "Burn this note")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AccountSettingsShell>
  );
}
