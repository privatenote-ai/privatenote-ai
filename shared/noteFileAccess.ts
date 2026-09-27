import { planFeaturesFor } from "./planCatalog";

/** Default viewing window after first reveal. */
export const NOTE_FILE_ACCESS_DEFAULT_SECONDS = 60 * 60;

export const NOTE_FILE_ACCESS_WINDOW_OPTIONS = [
  15 * 60,
  60 * 60,
  4 * 60 * 60,
  24 * 60 * 60,
] as const;

/** Notes created before the 15m / 1h / 4h / 24h picker. Still honored on reveal. */
export const NOTE_FILE_ACCESS_LEGACY_WINDOW_SECONDS = 30 * 60;

export type NoteFileAccessWindowSeconds = (typeof NOTE_FILE_ACCESS_WINDOW_OPTIONS)[number];

export function isNoteFileAccessWindowOption(value: unknown): value is NoteFileAccessWindowSeconds {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    NOTE_FILE_ACCESS_WINDOW_OPTIONS.includes(value as NoteFileAccessWindowSeconds)
  );
}

export function isNoteFileAccessWindowSeconds(value: unknown): value is number {
  return isNoteFileAccessWindowOption(value) || value === NOTE_FILE_ACCESS_LEGACY_WINDOW_SECONDS;
}

export function maxNoteFileAccessWindowForAccount(
  accountType: string | null | undefined,
): number {
  const max = planFeaturesFor(accountType).maxFileAccessWindowSeconds;
  if (typeof max === "number" && Number.isInteger(max) && max > 0) return max;
  return NOTE_FILE_ACCESS_DEFAULT_SECONDS;
}

export function normalizeNoteFileAccessWindowForPicker(
  value: unknown,
): NoteFileAccessWindowSeconds {
  if (isNoteFileAccessWindowOption(value)) return value;
  if (value === NOTE_FILE_ACCESS_LEGACY_WINDOW_SECONDS) return 60 * 60;
  return NOTE_FILE_ACCESS_DEFAULT_SECONDS;
}

export function clampNoteFileAccessWindowForAccount(
  value: unknown,
  accountTypeOrIsPremium: string | boolean | null | undefined,
): NoteFileAccessWindowSeconds {
  const maxSeconds =
    typeof accountTypeOrIsPremium === "boolean"
      ? accountTypeOrIsPremium
        ? 4 * 60 * 60
        : NOTE_FILE_ACCESS_DEFAULT_SECONDS
      : maxNoteFileAccessWindowForAccount(accountTypeOrIsPremium);

  const candidate = normalizeNoteFileAccessWindowForPicker(value);
  if (candidate <= maxSeconds) return candidate;

  const allowed = NOTE_FILE_ACCESS_WINDOW_OPTIONS.filter((seconds) => seconds <= maxSeconds);
  return allowed[allowed.length - 1] ?? NOTE_FILE_ACCESS_WINDOW_OPTIONS[0];
}

export function parseNoteFileAccessWindowFromBody(
  value: unknown,
  options:
    | { isPremium: boolean; accountType?: never; maxSeconds?: never }
    | { accountType: string | null | undefined; isPremium?: never; maxSeconds?: never }
    | { maxSeconds: number; isPremium?: never; accountType?: never },
):
  | { ok: true; seconds: number }
  | { ok: false; message: string } {
  const maxSeconds =
    "maxSeconds" in options && typeof options.maxSeconds === "number"
      ? options.maxSeconds
      : "accountType" in options
        ? maxNoteFileAccessWindowForAccount(options.accountType)
        : options.isPremium
          ? 4 * 60 * 60
          : NOTE_FILE_ACCESS_DEFAULT_SECONDS;

  if (value == null) {
    return { ok: true, seconds: NOTE_FILE_ACCESS_DEFAULT_SECONDS };
  }
  if (!isNoteFileAccessWindowSeconds(value)) {
    return { ok: false, message: "Invalid attachment access window" };
  }
  if (value > maxSeconds) {
    return {
      ok: false,
      message:
        maxSeconds <= NOTE_FILE_ACCESS_DEFAULT_SECONDS
          ? "Longer attachment access windows require Starter or Business"
          : "That attachment access window requires a higher plan",
    };
  }
  return { ok: true, seconds: value };
}

export function formatNoteFileAccessWindow(seconds: number): string {
  if (seconds === 24 * 60 * 60) return "24 hours";
  if (seconds === 4 * 60 * 60) return "4 hours";
  if (seconds === 60 * 60) return "1 hour";
  return `${Math.round(seconds / 60)} minutes`;
}
