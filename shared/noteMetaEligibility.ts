/** Row shape from `notes_meta` (Durable Object SQLite). */
export interface NoteMetaRow {
  note_id: string;
  expires_at: string;
  max_reads: number;
  current_reads: number;
  /** Legacy tombstone; eligibility treats any non-zero value as consumed. */
  consumed: number;
  /**
   * Optional delayed-reveal gate (ISO UTC). Null/undefined = openable immediately
   * (subject to expiry / reads).
   */
  opens_at?: string | null;
}

export type NoteMetaEligibility =
  | { ok: true }
  | {
      ok: false;
      kind: "missing" | "consumed" | "expired" | "exhausted" | "not_yet_available";
      /** Present when kind is `not_yet_available`. */
      opensAt?: string;
    };

/**
 * Single gate for meta visibility: used by meta GET and reveal transactions.
 * `max_reads === 0` means unlimited reads (only expiry / consumed / opens_at apply).
 */
export function noteMetaEligibility(meta: NoteMetaRow | null, now: Date): NoteMetaEligibility {
  if (!meta) {
    return { ok: false, kind: "missing" };
  }
  if (meta.consumed) {
    return { ok: false, kind: "consumed" };
  }
  const expiresAt = new Date(meta.expires_at);
  if (expiresAt < now) {
    return { ok: false, kind: "expired" };
  }
  if (meta.max_reads > 0 && meta.current_reads >= meta.max_reads) {
    return { ok: false, kind: "exhausted" };
  }
  if (meta.opens_at) {
    const opensAt = new Date(meta.opens_at);
    if (Number.isFinite(opensAt.getTime()) && opensAt > now) {
      return { ok: false, kind: "not_yet_available", opensAt: meta.opens_at };
    }
  }
  return { ok: true };
}

/** Parse and validate an optional create-time `opensAt` ISO string. */
export function parseNoteOpensAtFromBody(
  raw: unknown,
  options: { now?: Date; expiresAt: Date },
):
  | { ok: true; opensAt: string | null }
  | { ok: false; message: string } {
  if (raw == null || raw === "") {
    return { ok: true, opensAt: null };
  }
  if (typeof raw !== "string") {
    return { ok: false, message: "opensAt must be an ISO-8601 datetime string" };
  }
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: true, opensAt: null };
  }
  const opensAt = new Date(trimmed);
  if (!Number.isFinite(opensAt.getTime())) {
    return { ok: false, message: "opensAt must be a valid datetime" };
  }
  const now = options.now ?? new Date();
  // Allow a small clock-skew window so create is not rejected for "now".
  if (opensAt.getTime() <= now.getTime() + 30_000) {
    return { ok: false, message: "opensAt must be in the future" };
  }
  if (opensAt.getTime() >= options.expiresAt.getTime()) {
    return { ok: false, message: "opensAt must be before the note expires" };
  }
  return { ok: true, opensAt: opensAt.toISOString() };
}
