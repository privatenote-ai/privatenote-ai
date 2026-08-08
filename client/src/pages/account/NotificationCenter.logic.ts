import { format, isToday, isYesterday } from "date-fns";
import { parseActivityCreatedAt } from "@/lib/parseActivityCreatedAt";
import type { SentNoteNotificationStatus } from "@shared/sentNoteNotification";

export type NotificationItem = {
  id: string;
  noteId: string;
  recipientEmail: string | null;
  displayNoteId: string;
  status: SentNoteNotificationStatus;
  eventAt: string;
  label?: string | null;
  createdAt?: string | null;
  openedAt?: string | null;
  destroyedAt?: string | null;
  revokedAt?: string | null;
  expiresAt?: string | null;
  proofEnabled?: boolean;
  openCountry?: string | null;
  openDeviceClass?: string | null;
  openBrowser?: string | null;
  attachmentDownloadedAt?: string | null;
  receiptAcknowledgedAt?: string | null;
  requireReceiptAck?: boolean;
};

export type TimePeriod = "today" | "yesterday" | "this_week" | "earlier";

export type NotificationGroup = {
  period: TimePeriod;
  items: NotificationItem[];
};

export type ProofTimelineEntry = {
  key: "created" | "opened" | "receipt" | "attachment" | "destroyed" | "expired" | "revoked";
  at: string;
};

export function groupNotifications(items: NotificationItem[]): NotificationGroup[] {
  const groups: NotificationGroup[] = [];
  const buckets: Record<TimePeriod, NotificationItem[] | undefined> = {
    today: undefined,
    yesterday: undefined,
    this_week: undefined,
    earlier: undefined,
  };

  for (const item of items) {
    let period: TimePeriod;
    try {
      const d = parseActivityCreatedAt(item.eventAt);
      if (isToday(d)) period = "today";
      else if (isYesterday(d)) period = "yesterday";
      else if (d.getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000) period = "this_week";
      else period = "earlier";
    } catch {
      period = "earlier";
    }
    if (!buckets[period]) {
      buckets[period] = [];
      groups.push({ period, items: buckets[period]! });
    }
    buckets[period]!.push(item);
  }

  return groups;
}

export function formatNotificationTimestamp(raw: string): string {
  const d = parseActivityCreatedAt(raw);
  const time = format(d, "HH:mm");
  if (isToday(d)) return `Today ${time}`;
  if (isYesterday(d)) return `Yesterday ${time}`;
  return format(d, "MMM d, HH:mm");
}

export function formatProofTimestamp(raw: string): string {
  try {
    return format(parseActivityCreatedAt(raw), "MMM d, yyyy · HH:mm");
  } catch {
    return raw;
  }
}

/** True when there is meaningful access / terminal proof to show beyond "created". */
export function hasProofReport(item: NotificationItem): boolean {
  if (item.openedAt) return true;
  if (item.attachmentDownloadedAt) return true;
  if (item.receiptAcknowledgedAt) return true;
  return (
    item.status === "viewed" ||
    item.status === "burned" ||
    item.status === "expired" ||
    item.status === "attachment_downloaded" ||
    item.status === "receipt_confirmed" ||
    item.status === "revoked"
  );
}

export function buildProofTimeline(item: NotificationItem): ProofTimelineEntry[] {
  const entries: ProofTimelineEntry[] = [];
  if (item.createdAt) entries.push({ key: "created", at: item.createdAt });
  if (item.openedAt) entries.push({ key: "opened", at: item.openedAt });
  if (item.receiptAcknowledgedAt) {
    entries.push({ key: "receipt", at: item.receiptAcknowledgedAt });
  }
  if (item.attachmentDownloadedAt) {
    entries.push({ key: "attachment", at: item.attachmentDownloadedAt });
  }
  if (item.status === "expired" && item.destroyedAt) {
    entries.push({ key: "expired", at: item.destroyedAt });
  } else if (item.status === "burned" && item.destroyedAt) {
    entries.push({ key: "destroyed", at: item.destroyedAt });
  }
  if (item.status === "revoked" && item.revokedAt) {
    entries.push({ key: "revoked", at: item.revokedAt });
  }
  entries.sort((a, b) => Date.parse(a.at) - Date.parse(b.at));
  return entries;
}

export function formatDeviceClass(raw: string | null | undefined, t: Record<string, string>): string {
  const value = (raw || "").toLowerCase();
  if (value === "mobile") return t.proofDeviceMobile ?? "Mobile";
  if (value === "desktop") return t.proofDeviceDesktop ?? "Desktop";
  if (!value) return t.proofUnavailable ?? "Not available";
  return raw!;
}

export function statusLabel(
  status: SentNoteNotificationStatus,
  t: Record<string, string>,
  options?: { hasVoiceMessage?: boolean },
): string {
  switch (status) {
    case "created":
      return t.notificationStatusCreated ?? "Created";
    case "viewed":
      return t.notificationStatusViewed ?? "Viewed";
    case "burned":
      return t.notificationStatusBurned ?? "Burned";
    case "revoked":
      return t.notificationStatusRevoked ?? "Revoked";
    case "expired":
      return t.notificationStatusExpired ?? "Expired";
    case "attachment_downloaded":
      return options?.hasVoiceMessage
        ? (t.notificationStatusRecordingDownloaded ?? "Downloaded recording")
        : (t.notificationStatusAttachmentDownloaded ?? "Downloaded attachment");
    case "receipt_confirmed":
      return t.notificationStatusReceiptConfirmed ?? "Receipt confirmed";
    default:
      return status;
  }
}

export function statusTone(status: SentNoteNotificationStatus): string {
  switch (status) {
    case "viewed":
      return "text-primary";
    case "attachment_downloaded":
      return "text-indigo-600 dark:text-indigo-400";
    case "receipt_confirmed":
      return "text-teal-700 dark:text-teal-300";
    case "burned":
      return "text-amber-700 dark:text-amber-300";
    case "revoked":
      return "text-rose-700 dark:text-rose-300";
    case "expired":
      return "text-gray-600 dark:text-gray-400";
    default:
      return "text-emerald-700 dark:text-emerald-400";
  }
}
