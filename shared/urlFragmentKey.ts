/**
 * Prepare key material for the fragment of a note URL (`.../note/:id#<key>`).
 *
 * Standard Base64 uses `+`, `/`, and padding `=`, which are easy to mishandle in
 * URLs and copy/paste. This applies Base64url-style transforms so the fragment
 * stays stable across transports.
 *
 * Standard (non-password) notes use **unpadded Base64url** of the raw 32-byte
 * AES-256 key — always 43 characters after `normalizeUrlFragmentKey`. Password
 * notes put a longer Base64url-wrapped key blob in the same fragment slot.
 */
export function normalizeUrlFragmentKey(key: string): string {
  return key.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Raw AES-256 key size for standard note URL fragments (deterministic decode). */
export const RAW_AES_URL_FRAGMENT_KEY_BYTE_LENGTH = 32;

/**
 * Minimum plausible length for a **standard** note URL `#fragment` (raw AES key).
 * Unpadded Base64url for 32 bytes is always 43 characters. Password-wrapped keys
 * are longer. Anything shorter is almost always a truncated copy.
 */
export const NOTE_URL_FRAGMENT_KEY_MIN_CHARS = 43;

/**
 * Decode Base64 / Base64url (no line breaks) to bytes. Returns null on invalid input.
 */
export function decodeBase64UrlToBytes(b64url: string): Uint8Array | null {
  try {
    const normalized = b64url.trim().replace(/-/g, "+").replace(/_/g, "/");
    const pad = normalized.length % 4;
    const padded = pad ? normalized + "=".repeat(4 - pad) : normalized;
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  } catch {
    return null;
  }
}

/**
 * Deterministic parse: standard note keys are unpadded Base64url of exactly 32 bytes.
 * Returns null for malformed input or wrong length (including password fragments, which decode to other lengths).
 */
export function tryDecodeRawAesKeyUrlFragment(fragment: string): Uint8Array | null {
  const bytes = decodeBase64UrlToBytes(fragment);
  if (!bytes || bytes.length !== RAW_AES_URL_FRAGMENT_KEY_BYTE_LENGTH) return null;
  return bytes;
}

export function isValidRawAesKeyUrlFragment(fragment: string): boolean {
  return tryDecodeRawAesKeyUrlFragment(fragment) !== null;
}

/**
 * Returns true if `fragmentKey` is non-empty but shorter than real standard note keys.
 */
export function isLikelyTruncatedNoteUrlFragmentKey(fragmentKey: string): boolean {
  const t = fragmentKey.trim();
  return t.length > 0 && t.length < NOTE_URL_FRAGMENT_KEY_MIN_CHARS;
}
