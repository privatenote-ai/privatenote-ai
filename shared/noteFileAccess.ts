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

export function clampNoteFileAccessWindowForAccount(
  value: unknown,
  isPremium: boolean,
): NoteFileAccessWindowSeconds {
  if (!isPremium) return NOTE_FILE_ACCESS_DEFAULT_SECONDS;
  return isNoteFileAccessWindowSeconds(value) ? value : NOTE_FILE_ACCESS_DEFAULT_SECONDS;
}

export function parseNoteFileAccessWindowFromBody(
  value: unknown,
  { isPremium }: { isPremium: boolean },
):
  | { ok: true; seconds: NoteFileAccessWindowSeconds }
  | { ok: false; message: string } {
  if (value == null) {
    return { ok: true, seconds: NOTE_FILE_ACCESS_DEFAULT_SECONDS };
  }
  if (!isNoteFileAccessWindowSeconds(value)) {
    return { ok: false, message: "Invalid attachment access window" };
  }
  if (value !== NOTE_FILE_ACCESS_DEFAULT_SECONDS && !isPremium) {
    return { ok: false, message: "Longer attachment access windows require Premium" };
  }
  return { ok: true, seconds: value };
}

export function formatNoteFileAccessWindow(seconds: NoteFileAccessWindowSeconds): string {
  if (seconds === 60 * 60) return "1 hour";
  return `${Math.round(seconds / 60)} minutes`;
}
