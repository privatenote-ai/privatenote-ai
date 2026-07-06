/** UUID v4 string from `crypto.randomUUID()` — 8-4-4-4-12 with hyphens. */
export const NOTE_ID_STRING_LENGTH = 36;

const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidNoteId(value: unknown): value is string {
  if (typeof value !== "string") {
    return false;
  }
  if (value.length !== NOTE_ID_STRING_LENGTH) {
    return false;
  }
  return UUID_V4_REGEX.test(value);
}
