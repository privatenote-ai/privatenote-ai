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
  { id: "15d", seconds: 15 * 24 * 60 * 60, label: "15 days" },
  { id: "30d", seconds: 30 * 24 * 60 * 60, label: "30 days" },
] as const;

export type NoteExpiryPresetId = (typeof NOTE_EXPIRY_PRESETS)[number]["id"];

/** Default API limit when no resolved plan capability is provided. */
export const NOTE_EXPIRY_FREE_MAX_SECONDS = 3 * 24 * 60 * 60;

/** Absolute storage limit, independent of the caller's plan. */
export const NOTE_EXPIRY_MAX_SECONDS = 30 * 24 * 60 * 60;

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

export function noteExpirySecondsToPresetId(seconds: number): NoteExpiryPresetId | null {
  return NOTE_EXPIRY_PRESETS.find((preset) => preset.seconds === seconds)?.id ?? null;
}

export function noteExpiryPresetDisplayLabel(presetId: string): string {
  const row = ID_TO_PRESET.get(presetId);
  if (!row) {
    throw new Error(`Invalid note expiry preset ID: ${presetId}`);
  }
  return row.label;
}

export function isNoteExpirySecondsAllowedForAccount(
  seconds: number,
  maxExpirySeconds: number,
): boolean {
  return SECONDS_SET.has(seconds) && seconds <= maxExpirySeconds;
}

/** Presets shown in the expiry dropdown for the current account tier. */
export function noteExpiryPresetsForAccount(maxExpirySeconds: number) {
  return NOTE_EXPIRY_PRESETS.filter((preset) => preset.seconds <= maxExpirySeconds);
}

export function clampNoteExpiryPresetForAccount(
  presetId: NoteExpiryPresetId,
  maxExpirySeconds: number,
): NoteExpiryPresetId {
  if (noteExpiryPresetIdToSeconds(presetId) <= maxExpirySeconds) return presetId;
  const fallback = [...NOTE_EXPIRY_PRESETS]
    .reverse()
    .find((preset) => preset.seconds <= maxExpirySeconds);
  return fallback?.id ?? NOTE_EXPIRY_PRESETS[0].id;
}

export type NoteExpiryParseResult =
  | { ok: true; seconds: number }
  | { ok: false; message: string };

export type NoteExpiryParseOptions = {
  /** Defaults to the Free plan limit so omitted entitlement context fails closed. */
  maxExpirySeconds?: number;
  /** @deprecated Pass the resolved plan's maxExpirySeconds capability. */
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
  const maxExpirySeconds =
    options?.maxExpirySeconds ??
    (options?.isPremium === true ? NOTE_EXPIRY_MAX_SECONDS : NOTE_EXPIRY_FREE_MAX_SECONDS);

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
  if (!isNoteExpirySecondsAllowedForAccount(asInt, maxExpirySeconds)) {
    return {
      ok: false,
      message: "Longer note lifetimes require a higher plan",
    };
  }
  return { ok: true, seconds: asInt };
}
