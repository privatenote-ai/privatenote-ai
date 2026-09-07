import { normalizeAccountType, planFeaturesFor, type AccountType } from "./planCatalog";

export const NOTE_FILE_FREE_MAX_BYTES = 25 * 1024 * 1024;
export const NOTE_FILE_STARTER_MAX_BYTES = 250 * 1024 * 1024;
export const NOTE_FILE_BUSINESS_MAX_BYTES = 1024 * 1024 * 1024;
/** @deprecated Use NOTE_FILE_BUSINESS_MAX_BYTES — kept for older call sites/tests. */
export const NOTE_FILE_PREMIUM_MAX_BYTES = NOTE_FILE_BUSINESS_MAX_BYTES;

export const NOTE_FILE_FREE_TOTAL_STORAGE_BYTES = 250 * 1024 * 1024;
export const NOTE_FILE_STARTER_TOTAL_STORAGE_BYTES = 5 * 1024 * 1024 * 1024;
export const NOTE_FILE_BUSINESS_TOTAL_STORAGE_BYTES = 50 * 1024 * 1024 * 1024;
/** @deprecated Use NOTE_FILE_BUSINESS_TOTAL_STORAGE_BYTES. */
export const NOTE_FILE_PREMIUM_TOTAL_STORAGE_BYTES = NOTE_FILE_BUSINESS_TOTAL_STORAGE_BYTES;

/**
 * Ciphertext size at/above which the client uses R2 presigned PUT instead of the
 * upload Worker (Cloudflare Free/Pro reject bodies above ~100 MB with 413).
 */
export const NOTE_FILE_DIRECT_R2_MIN_BYTES = 90 * 1024 * 1024;
export const NOTE_FILE_AES_GCM_TAG_BYTES = 16;
/** Max secretstream HTTP chunks (indices 0..MAX-1). 4 MiB Safari frames × 256 = 1 GiB. */
export const NOTE_FILE_MAX_CHUNKS = 1024;
export const NOTE_FILE_MAX_CHUNK_INDEX = NOTE_FILE_MAX_CHUNKS - 1;
/** libsodium secretstream ABYTES per frame (used for encrypted-size headroom). */
export const NOTE_FILE_SECRETSTREAM_ABYTES = 17;

/**
 * Per-attachment plaintext limit for an account type.
 * Boolean overload kept for transitional call sites (true = Business max).
 */
export function noteFileLimitBytesForAccount(
  accountTypeOrIsPremium: string | boolean | null | undefined,
): number {
  if (typeof accountTypeOrIsPremium === "boolean") {
    return accountTypeOrIsPremium
      ? NOTE_FILE_BUSINESS_MAX_BYTES
      : NOTE_FILE_FREE_MAX_BYTES;
  }
  return planFeaturesFor(accountTypeOrIsPremium).attachmentMaxBytes;
}

/**
 * Active payload buffer (encrypted live attachments) for an account type.
 * Boolean overload kept for transitional call sites (true = Business buffer).
 */
export function noteFileTotalStorageBytesForAccount(
  accountTypeOrIsPremium: string | boolean | null | undefined,
): number {
  if (typeof accountTypeOrIsPremium === "boolean") {
    return accountTypeOrIsPremium
      ? NOTE_FILE_BUSINESS_TOTAL_STORAGE_BYTES
      : NOTE_FILE_FREE_TOTAL_STORAGE_BYTES;
  }
  return planFeaturesFor(accountTypeOrIsPremium).activePayloadBufferBytes;
}

/**
 * Daily file/photo/audio/recording transfer cap for an account type.
 * `null` means unlimited.
 */
export function noteFileTransfersPerDayForAccount(
  accountTypeOrIsPremium: string | boolean | null | undefined,
): number | null {
  if (typeof accountTypeOrIsPremium === "boolean") {
    return accountTypeOrIsPremium ? null : 10;
  }
  return planFeaturesFor(accountTypeOrIsPremium).maxAttachmentTransfersPerDay;
}

export function formatNoteFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024 * 1024) {
    const gb = bytes / (1024 * 1024 * 1024);
    return `${Number.isInteger(gb) ? gb.toFixed(0) : gb.toFixed(1)} GB`;
  }
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

/**
 * Next paid plan that would accept this plaintext file size, or null when the
 * file already fits the current plan or exceeds every plan.
 */
export function resolveFileSizeUpgradePlan(
  accountTypeOrIsPremium: string | boolean | null | undefined,
  fileSizeBytes: number,
): Exclude<AccountType, "free"> | null {
  if (!Number.isFinite(fileSizeBytes) || fileSizeBytes <= 0) return null;

  const accountType: AccountType =
    typeof accountTypeOrIsPremium === "boolean"
      ? accountTypeOrIsPremium
        ? "business_premium"
        : "free"
      : normalizeAccountType(accountTypeOrIsPremium);

  const currentLimit = noteFileLimitBytesForAccount(accountType);
  if (fileSizeBytes <= currentLimit) return null;
  if (fileSizeBytes > NOTE_FILE_BUSINESS_MAX_BYTES) return null;

  if (accountType === "free") {
    return fileSizeBytes <= NOTE_FILE_STARTER_MAX_BYTES
      ? "personal_premium"
      : "business_premium";
  }
  if (accountType === "personal_premium") {
    return "business_premium";
  }
  return null;
}
