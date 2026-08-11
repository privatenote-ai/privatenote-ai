/** Allowed view limits (max reads). `0` is reserved for unlimited in storage — not exposed in UI. */
export const NOTE_READ_LIMIT_OPTIONS = [1, 2, 3, 5] as const;

export type NoteReadLimit = (typeof NOTE_READ_LIMIT_OPTIONS)[number];

export const NOTE_READ_LIMIT_DEFAULT: NoteReadLimit = 1;

const READ_LIMIT_SET: ReadonlySet<number> = new Set(NOTE_READ_LIMIT_OPTIONS);

export function isNoteReadLimitAllowedForAccount(
  maxReads: number,
  allowedReadCounts: readonly number[],
): boolean {
  return READ_LIMIT_SET.has(maxReads) && allowedReadCounts.includes(maxReads);
}

export function clampNoteReadLimitForAccount(
  maxReads: number,
  allowedReadCounts: readonly number[],
): NoteReadLimit {
  if (!READ_LIMIT_SET.has(maxReads)) return NOTE_READ_LIMIT_DEFAULT;
  if (!allowedReadCounts.includes(maxReads)) {
    const fallback = NOTE_READ_LIMIT_OPTIONS.find((value) => allowedReadCounts.includes(value));
    return fallback ?? NOTE_READ_LIMIT_DEFAULT;
  }
  return maxReads as NoteReadLimit;
}

export type NoteReadLimitParseResult =
  | { ok: true; maxReads: NoteReadLimit }
  | { ok: false; message: string };

export type NoteReadLimitParseOptions = {
  /** Defaults to one view so omitted entitlement context fails closed. */
  allowedReadCounts?: readonly number[];
  /** @deprecated Pass the resolved plan's allowedReadCounts capability. */
  isPremium?: boolean;
};

export function parseMaxReadsFromBody(
  maxReads: unknown,
  options?: NoteReadLimitParseOptions,
): NoteReadLimitParseResult {
  const allowedReadCounts =
    options?.allowedReadCounts ??
    (options?.isPremium === true ? NOTE_READ_LIMIT_OPTIONS : [NOTE_READ_LIMIT_DEFAULT]);

  if (maxReads === undefined || maxReads === null) {
    return { ok: true, maxReads: NOTE_READ_LIMIT_DEFAULT };
  }

  const n = Number(maxReads);
  if (!Number.isFinite(n)) {
    return { ok: false, message: "maxReads must be a finite number" };
  }
  const asInt = Math.trunc(n);
  if (asInt !== n) {
    return { ok: false, message: "maxReads must be an integer" };
  }
  if (asInt === 0) {
    return { ok: false, message: "Unlimited views are not available" };
  }
  if (!READ_LIMIT_SET.has(asInt)) {
    return { ok: false, message: "maxReads is not an allowed view limit" };
  }
  if (!isNoteReadLimitAllowedForAccount(asInt, allowedReadCounts)) {
    return {
      ok: false,
      message: "That view limit is not available on your plan",
    };
  }
  return { ok: true, maxReads: asInt as NoteReadLimit };
}
