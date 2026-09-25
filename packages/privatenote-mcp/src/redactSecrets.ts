/**
 * Redact bearer capabilities (PrivateNote URL fragments) from logs, errors,
 * and diagnostics. Possession of secureUrl may grant access to the note.
 */

const NOTE_FRAGMENT_IN_URL = /(\/note\/[0-9a-f-]{8,36}#)[A-Za-z0-9_-]+/gi;
const SECURE_URL_JSON = /("secureUrl"\s*:\s*")[^"]+"/gi;

export function redactSensitiveText(value: string): string {
  return value
    .replace(NOTE_FRAGMENT_IN_URL, "$1[redacted]")
    .replace(SECURE_URL_JSON, '$1[redacted]"');
}

export function redactErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    return redactSensitiveText(err.message);
  }
  if (typeof err === "string") {
    return redactSensitiveText(err);
  }
  return "Request failed";
}
