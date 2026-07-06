/** Row shape from `notes_meta` (Durable Object SQLite). */
export interface NoteMetaRow {
  note_id: string;
  expires_at: string;
  max_reads: number;
  current_reads: number;
  /** Legacy tombstone; eligibility treats any non-zero value as consumed. */
  consumed: number;
}

export type NoteMetaEligibility =
  | { ok: true }
  | { ok: false; kind: "missing" | "consumed" | "expired" | "exhausted" };

/**
 * Single gate for meta visibility: used by meta GET and reveal transactions.
 * `max_reads === 0` means unlimited reads (only expiry / consumed apply).
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
  return { ok: true };
}
