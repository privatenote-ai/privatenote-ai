/**
 * Canonical note lifetime presets. Client AAD, UI, and server must agree on these
 * exact second values — do not silently coerce unknown values.
 */
export const NOTE_EXPIRY_PRESETS = [
  { id: "5m", seconds: 5 * 60, label: "5 minutes" },
  { id: "10m", seconds: 10 * 60, label: "10 minutes" },
  { id: "30m", seconds: 30 * 60, label: "30 minutes" },
  { id: "1h", seconds: 60 * 60, label: "1 hour" },
  { id: "2h", seconds: 2 * 60 * 60, label: "2 hours" },
  { id: "8h", seconds: 8 * 60 * 60, label: "8 hours" },
  { id: "1d", seconds: 24 * 60 * 60, label: "1 day" },
  { id: "3d", seconds: 3 * 24 * 60 * 60, label: "3 days" },
  { id: "7d", seconds: 7 * 24 * 60 * 60, label: "7 days" },
] as const;

export type NoteExpiryPresetId = (typeof NOTE_EXPIRY_PRESETS)[number]["id"];

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

export type NoteExpiryParseResult =
  | { ok: true; seconds: number }
  | { ok: false; message: string };

/**
 * Validates `expirySeconds` from the create-note API body.
 * Only exact preset values are accepted (matches browser AAD).
 */
export function parseNoteExpirySecondsFromBody(
  expirySeconds: unknown,
): NoteExpiryParseResult {
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
  return { ok: true, seconds: asInt };
}
