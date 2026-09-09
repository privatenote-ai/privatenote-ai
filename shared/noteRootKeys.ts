/**
 * HKDF-separated note root keys (text / file-wrap / metadata).
 * Uses `globalThis.crypto` so the same module works in the browser, Workers, and Node.
 */

import { NOTE_ROOT_KEY_HKDF_SALT } from "./noteReceiptAck";
import { arrayBufferToBase64, rawAesKeyBytesToUrlFragmentKey } from "./noteCrypto";

export const NOTE_TEXT_KEY_INFO = "privatenote/v2/text";
export const NOTE_FILE_WRAP_KEY_INFO = "privatenote/v2/file-wrap";
export const NOTE_METADATA_KEY_INFO = "privatenote/v2/metadata";

const SALT = new TextEncoder().encode(NOTE_ROOT_KEY_HKDF_SALT);
const TEXT_INFO = new TextEncoder().encode(NOTE_TEXT_KEY_INFO);
const FILE_WRAP_INFO = new TextEncoder().encode(NOTE_FILE_WRAP_KEY_INFO);
const METADATA_INFO = new TextEncoder().encode(NOTE_METADATA_KEY_INFO);

export interface DerivedNoteRootKeys {
  noteTextKey: CryptoKey;
  fileWrapKey: CryptoKey;
  metadataKey: CryptoKey;
}

function asBuffer(input: Uint8Array | ArrayBuffer): ArrayBuffer {
  if (input instanceof ArrayBuffer) return input;
  return input.buffer.slice(input.byteOffset, input.byteOffset + input.byteLength) as ArrayBuffer;
}

export function generateRootKeyBytes(): { rootKeyBytes: Uint8Array; exportedRootKey: string } {
  const rootKeyBytes = globalThis.crypto.getRandomValues(new Uint8Array(32));
  const exportedRootKey = rawAesKeyBytesToUrlFragmentKey(rootKeyBytes);
  return { rootKeyBytes, exportedRootKey };
}

async function importRootKeyForHkdf(rootKeyBytes: Uint8Array | ArrayBuffer): Promise<CryptoKey> {
  if (rootKeyBytes.byteLength !== 32) {
    throw new Error("Invalid root key length");
  }
  return globalThis.crypto.subtle.importKey("raw", asBuffer(rootKeyBytes), "HKDF", false, ["deriveKey"]);
}

async function deriveAesGcmKeyFromRoot(rootKey: CryptoKey, info: Uint8Array): Promise<CryptoKey> {
  return globalThis.crypto.subtle.deriveKey(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt: asBuffer(SALT),
      info: asBuffer(info),
    },
    rootKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function deriveNoteRootKeys(
  rootKeyBytes: Uint8Array | ArrayBuffer,
): Promise<DerivedNoteRootKeys> {
  const rootKey = await importRootKeyForHkdf(rootKeyBytes);
  const [noteTextKey, fileWrapKey, metadataKey] = await Promise.all([
    deriveAesGcmKeyFromRoot(rootKey, TEXT_INFO),
    deriveAesGcmKeyFromRoot(rootKey, FILE_WRAP_INFO),
    deriveAesGcmKeyFromRoot(rootKey, METADATA_INFO),
  ]);
  return { noteTextKey, fileWrapKey, metadataKey };
}

export { arrayBufferToBase64 };
