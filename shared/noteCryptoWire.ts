import { MAX_NOTE_CIPHERTEXT_BASE64_CHARS } from "./noteSizeLimits";
import { decodeBase64UrlToBytes } from "./urlFragmentKey";

/** AES-GCM nonce length used for note ciphertext and wrapped key IV (Web Crypto). */
export const NOTE_AES_GCM_IV_BYTE_LENGTH = 12;

/** Minimum KDF salt size (matches client `encryptNoteWithPassword`). */
export const NOTE_KDF_SALT_MIN_BYTES = 16;

export type ValidateCryptoWireResult =
  | { ok: true }
  | { ok: false; message: string; kind?: "too_large" };

/**
 * Validate a wire `iv` / `encryptedKeyIv`: base64 or base64url, decodes to exactly 12 bytes.
 */
export function validateNoteAesGcmIvWire(iv: unknown, fieldLabel: string): ValidateCryptoWireResult {
  if (typeof iv !== "string") {
    return { ok: false, message: `${fieldLabel} must be a string` };
  }
  const trimmed = iv.trim();
  if (!trimmed) {
    return { ok: false, message: `${fieldLabel} is required` };
  }
  const bytes = decodeBase64UrlToBytes(trimmed);
  if (!bytes) {
    return { ok: false, message: `${fieldLabel} must be valid base64 or base64url` };
  }
  if (bytes.length !== NOTE_AES_GCM_IV_BYTE_LENGTH) {
    return {
      ok: false,
      message: `${fieldLabel} must decode to exactly ${NOTE_AES_GCM_IV_BYTE_LENGTH} bytes (AES-GCM nonce)`,
    };
  }
  return { ok: true };
}

/**
 * Note body ciphertext on the wire: base64 or base64url (no line breaks), non-empty after decode,
 * within {@link MAX_NOTE_CIPHERTEXT_BASE64_CHARS} characters.
 * Leading/trailing ASCII whitespace is stripped on purpose: the encoding has no meaningful outer
 * whitespace; clients should send normalized single-line blobs.
 */
export function validateNoteCiphertextWire(
  content: unknown,
  fieldLabel = "content",
): ValidateCryptoWireResult {
  if (typeof content !== "string") {
    return { ok: false, message: `${fieldLabel} must be a string` };
  }
  const trimmed = content.trim();
  if (!trimmed) {
    return { ok: false, message: `${fieldLabel} is required` };
  }
  if (trimmed.length > MAX_NOTE_CIPHERTEXT_BASE64_CHARS) {
    return {
      ok: false,
      kind: "too_large",
      message: `${fieldLabel} exceeds maximum length (${MAX_NOTE_CIPHERTEXT_BASE64_CHARS} base64 characters)`,
    };
  }
  const bytes = decodeBase64UrlToBytes(trimmed);
  if (!bytes || bytes.length < 1) {
    return { ok: false, message: `${fieldLabel} must be valid base64 or base64url` };
  }
  return { ok: true };
}

/** Password note KDF salt: decodable base64/base64url, at least 16 bytes. */
export function validateNoteKdfSaltWire(salt: unknown): ValidateCryptoWireResult {
  if (typeof salt !== "string") {
    return { ok: false, message: "salt must be a string" };
  }
  const trimmed = salt.trim();
  if (!trimmed) {
    return { ok: false, message: "salt is required for password-protected notes" };
  }
  const bytes = decodeBase64UrlToBytes(trimmed);
  if (!bytes) {
    return { ok: false, message: "salt must be valid base64 or base64url" };
  }
  if (bytes.length < NOTE_KDF_SALT_MIN_BYTES) {
    return {
      ok: false,
      message: `salt must decode to at least ${NOTE_KDF_SALT_MIN_BYTES} bytes`,
    };
  }
  return { ok: true };
}

/** Wrapped key blob: decodable base64/base64url, non-empty after decode. */
export function validateNoteEncryptedKeyWire(encryptedKey: unknown): ValidateCryptoWireResult {
  if (typeof encryptedKey !== "string") {
    return { ok: false, message: "encryptedKey must be a string" };
  }
  const trimmed = encryptedKey.trim();
  if (!trimmed) {
    return { ok: false, message: "encryptedKey is required for password-protected notes" };
  }
  const bytes = decodeBase64UrlToBytes(trimmed);
  if (!bytes || bytes.length < 1) {
    return { ok: false, message: "encryptedKey must be valid base64 or base64url" };
  }
  return { ok: true };
}

function nonEmptyTrimmedString(v: unknown): boolean {
  return typeof v === "string" && v.trim().length > 0;
}

/** Reject password-only wire fields when the note is not password-protected. */
export function passwordWireFieldsPresent(body: Record<string, unknown>): boolean {
  const { salt, encryptedKey, encryptedKeyIv } = body;
  return (
    nonEmptyTrimmedString(salt) ||
    nonEmptyTrimmedString(encryptedKey) ||
    nonEmptyTrimmedString(encryptedKeyIv)
  );
}
