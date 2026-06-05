/**
 * Node-and-browser-safe non-password note encryption.
 *
 * All functions use `globalThis.crypto.subtle` so they work identically in:
 *   - The browser (window.crypto === globalThis.crypto)
 *   - Node 19+ (native crypto available on globalThis)
 *
 * This module handles only the standard (non-password) path.
 * Password-protected notes stay in client/src/utils/encryption.ts because they
 * require argon2-browser which cannot run in Node.
 */

import {
  buildNoteAadBytes,
  encodeNoteAadBytesForWire,
  type NoteAadBinding,
} from "./noteAad";
import { normalizeUrlFragmentKey } from "./urlFragmentKey";

export type { NoteAadBinding };

// ── Base64 helpers (Node + browser) ─────────────────────────────────────────

function uint8ToBase64(bytes: Uint8Array): string {
  // Node 16+ has Buffer; browsers have btoa via globalThis.
  if (typeof Buffer !== "undefined") {
    return Buffer.from(bytes).toString("base64");
  }
  const chunkSize = 0x8000;
  const chunks: string[] = [];
  for (let i = 0; i < bytes.length; i += chunkSize) {
    chunks.push(String.fromCharCode(...bytes.subarray(i, i + chunkSize)));
  }
  return globalThis.btoa(chunks.join(""));
}

export function arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  return uint8ToBase64(buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer));
}

// ── Crypto helpers ────────────────────────────────────────────────────────────

function subtle(): SubtleCrypto {
  return globalThis.crypto.subtle;
}

function asBuffer(input: Uint8Array | ArrayBuffer): ArrayBuffer {
  return input instanceof Uint8Array ? input.buffer.slice(input.byteOffset, input.byteOffset + input.byteLength) : input;
}

/** Unpadded Base64url of 32 raw AES-256 key bytes for the URL fragment. */
export function rawAesKeyBytesToUrlFragmentKey(bytes: Uint8Array): string {
  if (bytes.byteLength !== 32) throw new Error("Invalid AES-256 raw key length");
  return normalizeUrlFragmentKey(arrayBufferToBase64(bytes));
}

/**
 * Generate a fresh AES-256-GCM key.
 * `exportedKey` is the unpadded Base64url fragment key (43 chars).
 * `keyBytes` is the raw 32-byte material (same data, useful for wrapping).
 */
export async function generateContentKey(): Promise<{
  key: CryptoKey;
  keyBytes: Uint8Array;
  exportedKey: string;
}> {
  const key = await subtle().generateKey({ name: "AES-GCM", length: 256 }, true, [
    "encrypt",
    "decrypt",
  ]);
  const exportedKeyBuffer = await subtle().exportKey("raw", key);
  const keyBytes = new Uint8Array(exportedKeyBuffer);
  const exportedKey = rawAesKeyBytesToUrlFragmentKey(keyBytes);
  return { key, keyBytes, exportedKey };
}

/** Encrypt `content` (plaintext string) with AES-GCM using the provided key and AAD binding. */
export async function encryptNote(
  content: string,
  key: CryptoKey,
  binding: NoteAadBinding,
): Promise<{ encryptedData: ArrayBuffer; iv: Uint8Array; aadBytes: Uint8Array }> {
  const iv = globalThis.crypto.getRandomValues(new Uint8Array(12));
  const data = new TextEncoder().encode(content);
  const aadBytes = buildNoteAadBytes(binding);

  const encryptedData = await subtle().encrypt(
    { name: "AES-GCM", iv: asBuffer(iv), additionalData: asBuffer(aadBytes), tagLength: 128 },
    key,
    asBuffer(data),
  );

  return { encryptedData, iv, aadBytes };
}

export interface EncryptedPayloadWire {
  /** Base64-encoded AES-GCM ciphertext. */
  content: string;
  /** Base64-encoded 12-byte IV. */
  iv: string;
  /** Base64-encoded JSON AAD bytes. */
  aad: string;
}

/** Serialize raw bytes into transport-safe base64 wire fields for the API body. */
export function serializeEncryptedPayload(payload: {
  encryptedData: ArrayBuffer | Uint8Array;
  iv: Uint8Array;
  aadBytes: Uint8Array;
}): EncryptedPayloadWire {
  return {
    content: arrayBufferToBase64(payload.encryptedData),
    iv: arrayBufferToBase64(payload.iv),
    aad: encodeNoteAadBytesForWire(payload.aadBytes),
  };
}
