import { planFeaturesFor } from "./planCatalog";

export const NOTE_FILE_ACCESS_DEFAULT_SECONDS = 15 * 60;

export const NOTE_FILE_ACCESS_WINDOW_OPTIONS = [
  NOTE_FILE_ACCESS_DEFAULT_SECONDS,
  30 * 60,
  60 * 60,
] as const;

export type NoteFileAccessWindowSeconds = (typeof NOTE_FILE_ACCESS_WINDOW_OPTIONS)[number];

export function isNoteFileAccessWindowSeconds(value: unknown): value is NoteFileAccessWindowSeconds {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    NOTE_FILE_ACCESS_WINDOW_OPTIONS.includes(value as NoteFileAccessWindowSeconds)
  );
}

export function maxNoteFileAccessWindowForAccount(
  accountType: string | null | undefined,
): NoteFileAccessWindowSeconds {
  const max = planFeaturesFor(accountType).maxFileAccessWindowSeconds;
  if (isNoteFileAccessWindowSeconds(max)) return max;
  return NOTE_FILE_ACCESS_DEFAULT_SECONDS;
}

export function clampNoteFileAccessWindowForAccount(
  value: unknown,
  accountTypeOrIsPremium: string | boolean | null | undefined,
): NoteFileAccessWindowSeconds {
  const maxSeconds =
    typeof accountTypeOrIsPremium === "boolean"
      ? accountTypeOrIsPremium
        ? 60 * 60
        : NOTE_FILE_ACCESS_DEFAULT_SECONDS
      : maxNoteFileAccessWindowForAccount(accountTypeOrIsPremium);
  if (!isNoteFileAccessWindowSeconds(value) || value > maxSeconds) {
    return NOTE_FILE_ACCESS_DEFAULT_SECONDS;
  }
  return value;
}

export function parseNoteFileAccessWindowFromBody(
  value: unknown,
  options:
    | { isPremium: boolean; accountType?: never; maxSeconds?: never }
    | { accountType: string | null | undefined; isPremium?: never; maxSeconds?: never }
    | { maxSeconds: number; isPremium?: never; accountType?: never },
):
  | { ok: true; seconds: NoteFileAccessWindowSeconds }
  | { ok: false; message: string } {
  const maxSeconds =
    "maxSeconds" in options && typeof options.maxSeconds === "number"
      ? options.maxSeconds
      : "accountType" in options
        ? maxNoteFileAccessWindowForAccount(options.accountType)
        : options.isPremium
          ? 60 * 60
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

export function formatNoteFileAccessWindow(seconds: NoteFileAccessWindowSeconds): string {
  if (seconds === 60 * 60) return "1 hour";
  return `${Math.round(seconds / 60)} minutes`;
}
