export const NOTE_FILE_FREE_MAX_BYTES = 25 * 1024 * 1024;
export const NOTE_FILE_PREMIUM_MAX_BYTES = 1024 * 1024 * 1024;
export const NOTE_FILE_FREE_TOTAL_STORAGE_BYTES = 250 * 1024 * 1024;
export const NOTE_FILE_PREMIUM_TOTAL_STORAGE_BYTES = 20 * 1024 * 1024 * 1024;
export const NOTE_FILE_AES_GCM_TAG_BYTES = 16;
/** Max secretstream HTTP chunks (indices 0..MAX-1). 4 MiB Safari frames × 256 = 1 GiB. */
export const NOTE_FILE_MAX_CHUNKS = 1024;
export const NOTE_FILE_MAX_CHUNK_INDEX = NOTE_FILE_MAX_CHUNKS - 1;
/** libsodium secretstream ABYTES per frame (used for encrypted-size headroom). */
export const NOTE_FILE_SECRETSTREAM_ABYTES = 17;

export function noteFileLimitBytesForAccount(isPremium: boolean): number {
  return isPremium ? NOTE_FILE_PREMIUM_MAX_BYTES : NOTE_FILE_FREE_MAX_BYTES;
}

export function noteFileTotalStorageBytesForAccount(isPremium: boolean): number {
  return isPremium ? NOTE_FILE_PREMIUM_TOTAL_STORAGE_BYTES : NOTE_FILE_FREE_TOTAL_STORAGE_BYTES;
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
