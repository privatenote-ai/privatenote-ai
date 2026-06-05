export const NOTE_FILE_FREE_MAX_BYTES = 10 * 1024 * 1024;
export const NOTE_FILE_PREMIUM_MAX_BYTES = 100 * 1024 * 1024;
export const NOTE_FILE_AES_GCM_TAG_BYTES = 16;

export function noteFileLimitBytesForAccount(isPremium: boolean): number {
  return isPremium ? NOTE_FILE_PREMIUM_MAX_BYTES : NOTE_FILE_FREE_MAX_BYTES;
}

export function formatNoteFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    const mb = bytes / (1024 * 1024);
    return `${Number.isInteger(mb) ? mb.toFixed(0) : mb.toFixed(1)} MB`;
  }
  if (bytes >= 1024) {
    const kb = bytes / 1024;
    return `${Number.isInteger(kb) ? kb.toFixed(0) : kb.toFixed(1)} KB`;
  }
  return `${bytes} B`;
}
