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
};

export type TimePeriod = "today" | "yesterday" | "this_week" | "earlier";

export type NotificationGroup = {
  period: TimePeriod;
  items: NotificationItem[];
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

export function statusLabel(
  status: SentNoteNotificationStatus,
  t: Record<string, string>,
): string {
  switch (status) {
    case "created":
      return t.notificationStatusCreated ?? "Created";
    case "viewed":
      return t.notificationStatusViewed ?? "Viewed";
    case "burned":
      return t.notificationStatusBurned ?? "Burned";
    case "expired":
      return t.notificationStatusExpired ?? "Expired";
    case "attachment_downloaded":
      return t.notificationStatusAttachmentDownloaded ?? "Downloaded attachment";
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
    case "burned":
      return "text-amber-700 dark:text-amber-300";
    case "expired":
      return "text-gray-600 dark:text-gray-400";
    default:
      return "text-emerald-700 dark:text-emerald-400";
  }
}
