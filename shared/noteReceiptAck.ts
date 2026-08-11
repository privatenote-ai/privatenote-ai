/**
 * Recipient receipt acknowledgment — token derived via HKDF from the note root key.
 * Info label is fixed so create and reveal always agree.
 */

export const NOTE_RECEIPT_ACK_HKDF_INFO = "pn-ack-v1";

/** Same salt as note root key separation in client encryption (must stay in sync). */
export const NOTE_ROOT_KEY_HKDF_SALT = "privatenote/v2/root-key-separation";

export const NOTE_RECEIPT_ACK_TOKEN_BYTE_LENGTH = 32;

const HEX_64 = /^[0-9a-f]{64}$/;

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function hexToBytes(hex: string): Uint8Array {
  if (!HEX_64.test(hex) && !/^[0-9a-f]+$/i.test(hex)) {
    throw new Error("Invalid hex");
  }
  const normalized = hex.toLowerCase();
  if (normalized.length % 2 !== 0) {
    throw new Error("Invalid hex length");
  }
  const out = new Uint8Array(normalized.length / 2);
  for (let i = 0; i < out.length; i += 1) {
    out[i] = Number.parseInt(normalized.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

export function isValidReceiptAckTokenHash(value: unknown): value is string {
  return typeof value === "string" && HEX_64.test(value);
}

export function isValidReceiptAckTokenHex(value: unknown): value is string {
  return typeof value === "string" && HEX_64.test(value);
}

export async function sha256HexOfBytes(bytes: Uint8Array): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return bytesToHex(new Uint8Array(digest));
}

/** Hash the raw 32-byte ack token (given as lowercase hex) for server storage / verify. */
export async function hashReceiptAckTokenHex(tokenHex: string): Promise<string> {
  if (!isValidReceiptAckTokenHex(tokenHex)) {
    throw new Error("Invalid receipt ack token");
  }
  return sha256HexOfBytes(hexToBytes(tokenHex));
}

export function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}
