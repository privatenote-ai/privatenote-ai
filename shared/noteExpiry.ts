/**
 * Canonical note lifetime presets. Client AAD, UI, and server must agree on these
 * exact second values — do not silently coerce unknown values.
 */
export const NOTE_EXPIRY_PRESETS = [
  { id: "5m", seconds: 5 * 60, label: "5 minutes" },
  { id: "10m", seconds: 10 * 60, label: "10 minutes" },
  { id: "15m", seconds: 15 * 60, label: "15 minutes" },
  { id: "30m", seconds: 30 * 60, label: "30 minutes" },
  { id: "1h", seconds: 60 * 60, label: "1 hour" },
  { id: "2h", seconds: 2 * 60 * 60, label: "2 hours" },
  { id: "8h", seconds: 8 * 60 * 60, label: "8 hours" },
  { id: "1d", seconds: 24 * 60 * 60, label: "1 day" },
  { id: "3d", seconds: 3 * 24 * 60 * 60, label: "3 days" },
  { id: "7d", seconds: 7 * 24 * 60 * 60, label: "7 days" },
  { id: "14d", seconds: 14 * 24 * 60 * 60, label: "14 days" },
  { id: "30d", seconds: 30 * 24 * 60 * 60, label: "30 days" },
] as const;

export type NoteExpiryPresetId = (typeof NOTE_EXPIRY_PRESETS)[number]["id"];

/** Free accounts may not exceed this lifetime (3 days). */
export const NOTE_EXPIRY_FREE_MAX_SECONDS = 3 * 24 * 60 * 60;

/** Premium-only preset ids (7d, 14d, 30d). */
export const NOTE_EXPIRY_PREMIUM_PRESET_IDS: ReadonlySet<NoteExpiryPresetId> = new Set([
  "7d",
  "14d",
  "30d",
]);

const SECONDS_SET: ReadonlySet<number> = new Set(
  NOTE_EXPIRY_PRESETS.map((p) => p.seconds),
);

const ID_TO_PRESET = new Map<string, (typeof NOTE_EXPIRY_PRESETS)[number]>(
  NOTE_EXPIRY_PRESETS.map((p) => [p.id, p]),
);

export const NOTE_EXPIRY_DEFAULT_PRESET_ID: NoteExpiryPresetId = "1d";

export function isNoteExpiryPresetId(value: string): value is NoteExpiryPresetId {
  return ID_TO_PRESET.has(value);
}

export function noteExpiryPresetIdToSeconds(presetId: string): number {
  const row = ID_TO_PRESET.get(presetId);
  if (!row) {
    throw new Error(`Invalid note expiry preset ID: ${presetId}`);
  }
  return row.seconds;
}

export function noteExpiryPresetDisplayLabel(presetId: string): string {
  const row = ID_TO_PRESET.get(presetId);
  if (!row) {
    throw new Error(`Invalid note expiry preset ID: ${presetId}`);
  }
  return row.label;
}

export function isPremiumNoteExpiryPresetId(presetId: string): boolean {
  return NOTE_EXPIRY_PREMIUM_PRESET_IDS.has(presetId as NoteExpiryPresetId);
}

export function isNoteExpirySecondsAllowedForAccount(
  seconds: number,
  isPremium: boolean,
): boolean {
  if (!SECONDS_SET.has(seconds)) return false;
  if (isPremium) return true;
  return seconds <= NOTE_EXPIRY_FREE_MAX_SECONDS;
}

/** Presets shown in the expiry dropdown for the current account tier. */
export function noteExpiryPresetsForAccount(isPremium: boolean) {
  if (isPremium) return NOTE_EXPIRY_PRESETS;
  return NOTE_EXPIRY_PRESETS.filter((p) => !NOTE_EXPIRY_PREMIUM_PRESET_IDS.has(p.id));
}

export function clampNoteExpiryPresetForAccount(
  presetId: NoteExpiryPresetId,
  isPremium: boolean,
): NoteExpiryPresetId {
  if (isPremium || !isPremiumNoteExpiryPresetId(presetId)) return presetId;
  return "3d";
}

export type NoteExpiryParseResult =
  | { ok: true; seconds: number }
  | { ok: false; message: string };

export type NoteExpiryParseOptions = {
  /** When false (default), 14d and 30d presets are rejected. */
  isPremium?: boolean;
};

/**
 * Validates `expirySeconds` from the create-note API body.
 * Only exact preset values are accepted (matches browser AAD).
 */
export function parseNoteExpirySecondsFromBody(
  expirySeconds: unknown,
  options?: NoteExpiryParseOptions,
): NoteExpiryParseResult {
  const isPremium = options?.isPremium === true;

  if (expirySeconds === undefined || expirySeconds === null) {
    return { ok: false, message: "expirySeconds is required" };
  }
  const n = Number(expirySeconds);
  if (!Number.isFinite(n)) {
    return { ok: false, message: "expirySeconds must be a finite number" };
  }
  const asInt = Math.trunc(n);
  if (asInt !== n) {
    return { ok: false, message: "expirySeconds must be an integer" };
  }
  if (!SECONDS_SET.has(asInt)) {
    return { ok: false, message: "expirySeconds is not an allowed note expiry value" };
  }
  if (!isNoteExpirySecondsAllowedForAccount(asInt, isPremium)) {
    return {
      ok: false,
      message: "Longer expirations (7, 14, or 30 days) require a Premium plan",
    };
  }
  return { ok: true, seconds: asInt };
}
