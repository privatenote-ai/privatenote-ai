export type SentNoteNotificationStatus =
  | "created"
  | "viewed"
  | "burned"
  | "expired"
  | "attachment_downloaded";

export type SentNoteNotificationRowInput = {
  status: "created" | "opened" | "expired" | "destroyed" | "revoked";
  created_at: string;
  opened_at: string | null;
  destroyed_at: string | null;
  revoked_at: string | null;
  attachment_downloaded_at?: string | null;
};

export type SentNoteNotificationEvent = {
  status: SentNoteNotificationStatus;
  eventAt: string;
};

const DISPLAY_ID_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTUVWXYZ";

/** Deterministic short reference derived from the note UUID — not the raw note id. */
export function formatNotificationNoteDisplayId(noteId: string): string {
  const normalized = noteId.replace(/-/g, "").toUpperCase();
  let hash = 2_166_136_261;
  for (let i = 0; i < normalized.length; i += 1) {
    hash ^= normalized.charCodeAt(i);
    hash = Math.imul(hash, 16_777_619);
  }
  let code = "";
  let state = hash >>> 0;
  for (let i = 0; i < 6; i += 1) {
    state = Math.imul(state ^ (state >>> 15), 2_246_822_507) >>> 0;
    code += DISPLAY_ID_ALPHABET[state % DISPLAY_ID_ALPHABET.length]!;
  }
  return `#${code}`;
}

export function resolveSentNoteNotificationEvent(
  row: SentNoteNotificationRowInput,
): SentNoteNotificationEvent {
  const events: SentNoteNotificationEvent[] = [{ status: "created", eventAt: row.created_at }];
  if (row.opened_at) {
    events.push({ status: "viewed", eventAt: row.opened_at });
  }
  if (row.attachment_downloaded_at) {
    events.push({
      status: "attachment_downloaded",
      eventAt: row.attachment_downloaded_at,
    });
  }
  if (row.status === "expired") {
    events.push({
      status: "expired",
      eventAt: row.destroyed_at ?? row.created_at,
    });
  } else if (row.status === "destroyed") {
    events.push({
      status: "burned",
      eventAt: row.destroyed_at ?? row.opened_at ?? row.created_at,
    });
  } else if (row.status === "revoked") {
    events.push({
      status: "burned",
      eventAt: row.revoked_at ?? row.created_at,
    });
  }

  events.sort((a, b) => Date.parse(b.eventAt) - Date.parse(a.eventAt));
  return events[0]!;
}

export const SENT_NOTE_NOTIFICATION_STATUS_LABELS: Record<SentNoteNotificationStatus, string> = {
  created: "Created",
  viewed: "Viewed",
  burned: "Burned",
  expired: "Expired",
  attachment_downloaded: "Downloaded attachment",
};
