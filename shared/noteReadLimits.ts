/** Allowed view limits (max reads). `0` is reserved for unlimited in storage — not exposed in UI. */
export const NOTE_READ_LIMIT_OPTIONS = [1, 2, 3, 5] as const;

export type NoteReadLimit = (typeof NOTE_READ_LIMIT_OPTIONS)[number];

export const NOTE_READ_LIMIT_DEFAULT: NoteReadLimit = 1;

const READ_LIMIT_SET: ReadonlySet<number> = new Set(NOTE_READ_LIMIT_OPTIONS);

export const NOTE_READ_LIMIT_PREMIUM_ONLY: ReadonlySet<NoteReadLimit> = new Set([2, 3, 5]);

export function isPremiumNoteReadLimit(value: number): boolean {
  return NOTE_READ_LIMIT_PREMIUM_ONLY.has(value as NoteReadLimit);
}

export function isNoteReadLimitAllowedForAccount(maxReads: number, isPremium: boolean): boolean {
  if (!READ_LIMIT_SET.has(maxReads)) return false;
  if (isPremium) return true;
  return maxReads === NOTE_READ_LIMIT_DEFAULT;
}

export function clampNoteReadLimitForAccount(maxReads: number, isPremium: boolean): NoteReadLimit {
  if (!READ_LIMIT_SET.has(maxReads)) return NOTE_READ_LIMIT_DEFAULT;
  if (!isPremium && maxReads > NOTE_READ_LIMIT_DEFAULT) return NOTE_READ_LIMIT_DEFAULT;
  return maxReads as NoteReadLimit;
}

export type NoteReadLimitParseResult =
  | { ok: true; maxReads: NoteReadLimit }
  | { ok: false; message: string };

export type NoteReadLimitParseOptions = {
  isPremium?: boolean;
};

export function parseMaxReadsFromBody(
  maxReads: unknown,
  options?: NoteReadLimitParseOptions,
): NoteReadLimitParseResult {
  const isPremium = options?.isPremium === true;

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
  if (!isNoteReadLimitAllowedForAccount(asInt, isPremium)) {
    return {
      ok: false,
      message: "View limits above once (2, 3, or 5) require a Premium plan",
    };
  }
  return { ok: true, maxReads: asInt as NoteReadLimit };
}
