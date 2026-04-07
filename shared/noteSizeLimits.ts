/**
 * Single source of truth for note plaintext size limits (UTF-8 byte length).
 * Enforce with {@link utf8ByteLength} / {@link truncateUtf8StringToMaxBytes}, not string `.length`.
 */

const textEncoder = new TextEncoder();

/** Web Crypto AES-GCM with tagLength 128 → 16-byte authentication tag appended to ciphertext. */
export const AES_GCM_TAG_BYTES = 16;

/** Maximum stored note body size (UTF-8 bytes). Shown as “50 KB” in the UI. */
export const MAX_NOTE_PLAINTEXT_UTF8_BYTES = 50 * 1024;

/**
 * Stricter cap while composing in AI mode (local model / UX). Explicitly lower than
 * {@link MAX_NOTE_PLAINTEXT_UTF8_BYTES}. After accept, users could theoretically expand in manual
 * mode up to the full limit before submit.
 */
export const MAX_NOTE_AI_PLAINTEXT_UTF8_BYTES = 20 * 1024;

export function utf8ByteLength(text: string): number {
  return textEncoder.encode(text).length;
}

/** Standard base64 character length for a binary blob of `byteLength` bytes. */
export function base64CharLengthForBinaryBytes(byteLength: number): number {
  return 4 * Math.ceil(byteLength / 3);
}

/**
 * Max length of the API `content` field (base64 ciphertext) that still fits the largest allowed
 * plaintext ({@link MAX_NOTE_PLAINTEXT_UTF8_BYTES} UTF-8 bytes + AES-GCM tag).
 */
export const MAX_NOTE_CIPHERTEXT_BASE64_CHARS = base64CharLengthForBinaryBytes(
  MAX_NOTE_PLAINTEXT_UTF8_BYTES + AES_GCM_TAG_BYTES,
);

/**
 * If `text` exceeds `maxBytes` UTF-8 encoding, returns the longest prefix (by Unicode code units)
 * whose UTF-8 length is ≤ maxBytes.
 */
export function truncateUtf8StringToMaxBytes(
  text: string,
  maxBytes: number,
): { text: string; truncated: boolean } {
  if (utf8ByteLength(text) <= maxBytes) {
    return { text, truncated: false };
  }
  let low = 0;
  let high = text.length;
  while (low < high) {
    const mid = Math.floor((low + high + 1) / 2);
    const slice = text.slice(0, mid);
    if (utf8ByteLength(slice) <= maxBytes) {
      low = mid;
    } else {
      high = mid - 1;
    }
  }
  return { text: text.slice(0, low), truncated: true };
}
