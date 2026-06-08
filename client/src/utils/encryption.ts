import {
  buildNoteAadBytes,
  encodeNoteAadBytesForWire,
  type NoteAadBinding,
} from "@shared/noteAad";
import {
  ARGON2ID_HASH_LEN,
  ARGON2ID_MEMORY_KIB_V2,
  ARGON2ID_PARAM_TAG_V2,
  ARGON2ID_PARALLELISM_V2,
  ARGON2ID_TIME_COST_V2,
  KDF_VERSION_2,
  parseKdfParamsV2,
  type KdfParamsV2,
} from "@shared/kdfParamsV2";
import { argon2idAsync } from "@noble/hashes/argon2.js";

export type { NoteAadBinding };
import { normalizeUrlFragmentKey, tryDecodeRawAesKeyUrlFragment } from "@shared/urlFragmentKey";

export {
  ARGON2ID_HASH_LEN,
  ARGON2ID_MEMORY_KIB_V2,
  ARGON2ID_PARAM_TAG_V2,
  ARGON2ID_PARALLELISM_V2,
  ARGON2ID_TIME_COST_V2,
  KDF_VERSION_2,
  type KdfParamsV2,
} from "@shared/kdfParamsV2";

/** Stored on new password-protected notes. */
export const KDF_VERSION = KDF_VERSION_2;
const PASSWORD_DECRYPTION_FAILURE_MESSAGE =
  "Failed to decrypt note. The password may be incorrect or the data may have been tampered with.";

export interface EncryptedPayloadBytes {
  encryptedData: Uint8Array;
  iv: Uint8Array;
  aadBytes: Uint8Array;
}

export interface EncryptedPayloadBytesInput {
  encryptedData: Uint8Array | ArrayBuffer;
  iv: Uint8Array;
  aadBytes: Uint8Array;
}

export interface EncryptedPayloadWire {
  content: string;
  iv: string;
  aad: string;
}

export const NOTE_KEY_DERIVATION_HKDF_ROOT_V2 = "hkdf-root-v2" as const;

const NOTE_ROOT_HKDF_SALT = new TextEncoder().encode("privatenote/v2/root-key-separation");
const NOTE_TEXT_KEY_INFO = new TextEncoder().encode("privatenote/v2/text");
const NOTE_FILE_WRAP_KEY_INFO = new TextEncoder().encode("privatenote/v2/file-wrap");
const NOTE_METADATA_KEY_INFO = new TextEncoder().encode("privatenote/v2/metadata");

export interface DerivedNoteRootKeys {
  noteTextKey: CryptoKey;
  fileWrapKey: CryptoKey;
  metadataKey: CryptoKey;
}

export interface EncryptWithPasswordResult {
  encryptedData: ArrayBuffer;
  iv: Uint8Array;
  salt: Uint8Array;
  encryptedKey: ArrayBuffer;
  encryptedKeyIv: Uint8Array;
  aadBytes: Uint8Array;
  kdfParams: KdfParamsV2;
}

export function currentKdfParamsV2(): KdfParamsV2 {
  return {
    version: KDF_VERSION_2,
    algorithm: "argon2id",
    timeCost: ARGON2ID_TIME_COST_V2,
    memoryKiB: ARGON2ID_MEMORY_KIB_V2,
    parallelism: ARGON2ID_PARALLELISM_V2,
    hashLength: ARGON2ID_HASH_LEN,
    profile: ARGON2ID_PARAM_TAG_V2,
  };
}

function parseExactInteger(value: unknown): number | undefined {
  if (typeof value !== "number" || !Number.isInteger(value)) {
    return undefined;
  }
  return value;
}

function resolveKdfParamsForDecrypt(
  kdfParamsRaw: unknown,
  kdfVersionRaw: unknown,
  kdfIterationsRaw: unknown,
  kdfPolicyTagRaw: unknown,
): { timeCost: typeof ARGON2ID_TIME_COST_V2; paramTag: typeof ARGON2ID_PARAM_TAG_V2 } {
  const kdfParams = parseKdfParamsV2(kdfParamsRaw);
  const kdfVersion = parseExactInteger(kdfVersionRaw);
  const kdfIterations = parseExactInteger(kdfIterationsRaw);
  const kdfPolicyTag = typeof kdfPolicyTagRaw === "string" ? kdfPolicyTagRaw : undefined;

  if (kdfParams) {
    return { timeCost: kdfParams.timeCost, paramTag: kdfParams.profile };
  }

  // Modern v2 notes must carry explicit structured KDF metadata.
  if (kdfVersion === KDF_VERSION_2) {
    throw new Error("Missing required structured KDF parameters for version 2");
  }

  // Legacy fallback (older rows) is only valid when metadata is fully absent.
  const hasAnyLegacyKdfField =
    kdfVersion !== undefined || kdfIterations !== undefined || kdfPolicyTag !== undefined;
  if (!hasAnyLegacyKdfField) {
    return { timeCost: ARGON2ID_TIME_COST_V2, paramTag: ARGON2ID_PARAM_TAG_V2 };
  }

  // For rows that include legacy KDF fields, require all fields explicitly.
  if (kdfVersion === undefined || kdfIterations === undefined || !kdfPolicyTag) {
    throw new Error("Missing required legacy KDF metadata");
  }
  if (
    kdfVersion !== KDF_VERSION_2 ||
    kdfIterations !== ARGON2ID_TIME_COST_V2 ||
    kdfPolicyTag !== ARGON2ID_PARAM_TAG_V2
  ) {
    throw new Error("Invalid legacy KDF metadata");
  }

  return { timeCost: kdfIterations, paramTag: kdfPolicyTag };
}

/** Unpadded Base64url of 32 raw key bytes (pass through `normalizeUrlFragmentKey` for the URL). */
export function rawAesKeyBytesToUrlFragmentKey(bytes: Uint8Array): string {
  if (bytes.byteLength !== 32) {
    throw new Error("Invalid AES-256 raw key length");
  }
  const b64 = arrayBufferToBase64(bytes);
  return normalizeUrlFragmentKey(b64);
}

/**
 * `exportedKey` is unpadded Base64url of the raw key (43 chars) for URL `#fragment`.
 * `keyBytes` is the same 32-byte AES-256 material (use for wrapping without re-encoding).
 * `extractable: true` is required to export raw bytes for URL embedding; content keys stay client-side.
 */
export async function generateContentKey(): Promise<{
  key: CryptoKey;
  /** Raw 32-byte AES-256 key material (same as underlies `exportedKey`). */
  keyBytes: Uint8Array;
  exportedKey: string;
}> {
  const key = await window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"],
  );

  const exportedKeyBuffer = await window.crypto.subtle.exportKey("raw", key);
  const keyBytes = new Uint8Array(exportedKeyBuffer);
  const exportedKey = rawAesKeyBytesToUrlFragmentKey(keyBytes);

  return { key, keyBytes, exportedKey };
}

export function generateRootKeyBytes(): { rootKeyBytes: Uint8Array; exportedRootKey: string } {
  const rootKeyBytes = window.crypto.getRandomValues(new Uint8Array(32));
  const exportedRootKey = rawAesKeyBytesToUrlFragmentKey(rootKeyBytes);
  return { rootKeyBytes, exportedRootKey };
}

async function importRootKeyForHkdf(rootKeyBytes: Uint8Array | ArrayBuffer): Promise<CryptoKey> {
  if (rootKeyBytes.byteLength !== 32) {
    throw new Error("Invalid root key length");
  }
  return await window.crypto.subtle.importKey(
    "raw",
    asBufferSource(rootKeyBytes),
    "HKDF",
    false,
    ["deriveKey"],
  );
}

async function deriveAesGcmKeyFromRoot(
  rootKey: CryptoKey,
  info: Uint8Array,
): Promise<CryptoKey> {
  return await window.crypto.subtle.deriveKey(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt: asBufferSource(NOTE_ROOT_HKDF_SALT),
      info: asBufferSource(info),
    },
    rootKey,
    {
      name: "AES-GCM",
      length: 256,
    },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function deriveNoteRootKeys(
  rootKeyBytes: Uint8Array | ArrayBuffer,
): Promise<DerivedNoteRootKeys> {
  const rootKey = await importRootKeyForHkdf(rootKeyBytes);
  const [noteTextKey, fileWrapKey, metadataKey] = await Promise.all([
    deriveAesGcmKeyFromRoot(rootKey, NOTE_TEXT_KEY_INFO),
    deriveAesGcmKeyFromRoot(rootKey, NOTE_FILE_WRAP_KEY_INFO),
    deriveAesGcmKeyFromRoot(rootKey, NOTE_METADATA_KEY_INFO),
  ]);
  return { noteTextKey, fileWrapKey, metadataKey };
}

export async function deriveNoteRootKeysFromUrlFragment(
  keyString: string,
): Promise<DerivedNoteRootKeys> {
  const decoded = tryDecodeRawAesKeyUrlFragment(keyString);
  if (!decoded) {
    throw new Error("Invalid root key");
  }
  return await deriveNoteRootKeys(new Uint8Array(decoded));
}

export async function importAesGcmKeyFromUrlFragment(
  keyString: string,
  usage: KeyUsage[] = ["encrypt", "decrypt"],
) {
  const decoded = tryDecodeRawAesKeyUrlFragment(keyString);
  if (!decoded) {
    throw new Error("Invalid decryption key");
  }

  return await importAesGcmKeyFromRawBytes(new Uint8Array(decoded), usage);
}

export async function importAesGcmKeyFromRawBytes(
  keyBytes: Uint8Array | ArrayBuffer,
  usage: KeyUsage[] = ["encrypt", "decrypt"],
) {
  if (keyBytes.byteLength !== 32) {
    throw new Error("Invalid AES-256 raw key length");
  }

  try {
    return await window.crypto.subtle.importKey(
      "raw",
      asBufferSource(keyBytes),
      {
        name: "AES-GCM",
        length: 256,
      },
      false,
      usage,
    );
  } catch (error) {
    if (import.meta.env?.DEV) {
      console.error("Error importing key:", error);
    }
    throw new Error("Invalid decryption key");
  }
}

export async function encryptNote(content: string, key: CryptoKey, binding: NoteAadBinding) {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const aadBytes = buildNoteAadBytes(binding);

  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: asBufferSource(iv),
      additionalData: asBufferSource(aadBytes),
      tagLength: 128,
    },
    key,
    asBufferSource(data),
  );

  return { encryptedData, iv, aadBytes };
}

export async function decryptNote(
  encryptedData: Uint8Array,
  key: CryptoKey,
  iv: Uint8Array,
  additionalData: Uint8Array,
) {
  try {
    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: asBufferSource(iv),
        additionalData: asBufferSource(additionalData),
        tagLength: 128,
      },
      key,
      asBufferSource(encryptedData),
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
  } catch (error) {
    if (import.meta.env?.DEV) {
      console.error("Error decrypting note:", error);
    }
    throw new Error(
      "Failed to decrypt note. The key may be incorrect or the data may have been tampered with.",
    );
  }
}

export function arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  const chunkSize = 0x8000;
  const chunks: string[] = [];

  for (let i = 0; i < bytes.length; i += chunkSize) {
    chunks.push(String.fromCharCode(...bytes.subarray(i, i + chunkSize)));
  }

  return btoa(chunks.join(""));
}

function normalizeBase64(input: string) {
  let normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  while (normalized.length % 4 !== 0) {
    normalized += "=";
  }
  return normalized;
}

export function base64ToArrayBuffer(base64: string) {
  const binaryString = atob(normalizeBase64(base64));
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export function base64ToUint8Array(base64: string): Uint8Array {
  return new Uint8Array(base64ToArrayBuffer(base64));
}

/** App boundary: convert byte-oriented encrypted payload into transport-safe wire fields. */
export function serializeEncryptedPayload(payload: EncryptedPayloadBytesInput): EncryptedPayloadWire {
  return {
    content: arrayBufferToBase64(payload.encryptedData),
    iv: arrayBufferToBase64(payload.iv),
    aad: encodeNoteAadBytesForWire(payload.aadBytes),
  };
}

/** App boundary: parse wire fields into byte-oriented encrypted payload for crypto operations. */
export function deserializeEncryptedPayload(payload: EncryptedPayloadWire): EncryptedPayloadBytes {
  return {
    encryptedData: base64ToUint8Array(payload.content),
    iv: base64ToUint8Array(payload.iv),
    aadBytes: base64ToUint8Array(payload.aad),
  };
}

/**
 * Zero-copy adapter for TS WebCrypto typing mismatches.
 * Runtime values are valid BufferSource, but some DOM lib combinations reject
 * Uint8Array<ArrayBufferLike> without an explicit cast.
 */
function asBufferSource(input: Uint8Array | ArrayBuffer): BufferSource {
  return input as unknown as BufferSource;
}

export async function deriveAesKeyFromPassword(
  password: string,
  salt: Uint8Array,
  timeCost: number,
  paramTag: string = ARGON2ID_PARAM_TAG_V2,
) {
  if (!password) {
    throw new Error("Password is required");
  }
  if (salt.byteLength < 16) {
    throw new Error("Invalid KDF parameters: salt too short");
  }
  if (timeCost < 1) {
    throw new Error("Invalid KDF parameters: Argon2 time cost too low");
  }
  if (paramTag !== ARGON2ID_PARAM_TAG_V2) {
    throw new Error("Invalid KDF parameters: unsupported Argon2 profile");
  }

  const hashBytes = await argon2idAsync(password, salt, {
    t: timeCost,
    m: ARGON2ID_MEMORY_KIB_V2,
    p: ARGON2ID_PARALLELISM_V2,
    dkLen: ARGON2ID_HASH_LEN,
  });
  if (hashBytes.byteLength !== ARGON2ID_HASH_LEN) {
    throw new Error("Invalid Argon2 output length");
  }

  try {
    return await window.crypto.subtle.importKey(
      "raw",
      asBufferSource(hashBytes),
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"],
    );
  } finally {
    // Best-effort cleanup for transient derived key material.
    hashBytes.fill(0);
  }
}

export function generateSalt() {
  return window.crypto.getRandomValues(new Uint8Array(16));
}

export async function encryptWithPassword(
  content: string,
  password: string,
  binding: NoteAadBinding,
): Promise<EncryptWithPasswordResult> {
  const salt = generateSalt();

  const passwordKey = await deriveAesKeyFromPassword(
    password,
    salt,
    ARGON2ID_TIME_COST_V2,
    ARGON2ID_PARAM_TAG_V2,
  );

  const { key, keyBytes } = await generateContentKey();
  try {
    const { encryptedData, iv, aadBytes } = await encryptNote(content, key, binding);

    const encryptedKeyIv = window.crypto.getRandomValues(new Uint8Array(12));

    const encryptedKeyData = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: asBufferSource(encryptedKeyIv),
        additionalData: asBufferSource(aadBytes),
        tagLength: 128,
      },
      passwordKey,
      asBufferSource(keyBytes),
    );

    return {
      encryptedData,
      iv,
      salt,
      encryptedKey: encryptedKeyData,
      encryptedKeyIv,
      aadBytes,
      kdfParams: currentKdfParamsV2(),
    };
  } finally {
    // Best-effort cleanup for transient raw content-key bytes.
    keyBytes.fill(0);
  }
}

export async function decryptWithPassword(
  encryptedData: Uint8Array,
  iv: Uint8Array,
  encryptedKey: Uint8Array | ArrayBuffer,
  encryptedKeyIv: Uint8Array,
  salt: Uint8Array,
  password: string,
  aad: Uint8Array,
  kdfParams?: unknown,
  kdfVersion?: unknown,
  kdfIterations?: unknown,
  kdfPolicyTag?: unknown,
) {
  try {
    const key = await unwrapContentKeyWithPassword(
      encryptedKey,
      encryptedKeyIv,
      salt,
      password,
      aad,
      kdfParams,
      kdfVersion,
      kdfIterations,
      kdfPolicyTag,
    );

    return await decryptNote(encryptedData, key, iv, aad);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    const malformedOrUnsupportedRecord =
      message.includes("KDF") ||
      message.includes("Invalid AES-256 raw key length") ||
      message.includes("Invalid decryption key");

    if (import.meta.env?.DEV) {
      if (malformedOrUnsupportedRecord) {
        console.error(
          "Password decryption failed due to malformed/unsupported encrypted record format.",
          error,
        );
      } else {
        console.error(
          "Password decryption failed due to authentication/decryption mismatch (wrong password or tampering).",
          error,
        );
      }
    }

    throw new Error(PASSWORD_DECRYPTION_FAILURE_MESSAGE);
  }
}

export async function wrapRootKeyWithPassword(
  rootKeyBytes: Uint8Array,
  passwordKey: CryptoKey,
  aad: Uint8Array,
): Promise<{ encryptedRootKey: ArrayBuffer; encryptedRootKeyIv: Uint8Array }> {
  const encryptedRootKeyIv = window.crypto.getRandomValues(new Uint8Array(12));
  const encryptedRootKey = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: asBufferSource(encryptedRootKeyIv),
      additionalData: asBufferSource(aad),
      tagLength: 128,
    },
    passwordKey,
    asBufferSource(rootKeyBytes),
  );
  return { encryptedRootKey, encryptedRootKeyIv };
}

export async function unwrapRootKeyWithPassword(
  encryptedRootKey: Uint8Array | ArrayBuffer,
  encryptedRootKeyIv: Uint8Array,
  salt: Uint8Array,
  password: string,
  aad: Uint8Array,
  kdfParams?: unknown,
  kdfVersion?: unknown,
  kdfIterations?: unknown,
  kdfPolicyTag?: unknown,
): Promise<DerivedNoteRootKeys> {
  const { timeCost, paramTag } = resolveKdfParamsForDecrypt(
    kdfParams,
    kdfVersion,
    kdfIterations,
    kdfPolicyTag,
  );
  const passwordKey = await deriveAesKeyFromPassword(password, salt, timeCost, paramTag);
  const rootKeyBuffer = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: asBufferSource(encryptedRootKeyIv),
      additionalData: asBufferSource(aad),
      tagLength: 128,
    },
    passwordKey,
    asBufferSource(encryptedRootKey),
  );
  const rootKeyBytes = new Uint8Array(rootKeyBuffer);
  try {
    return await deriveNoteRootKeys(rootKeyBytes);
  } finally {
    rootKeyBytes.fill(0);
  }
}

export async function unwrapContentKeyWithPassword(
  encryptedKey: Uint8Array | ArrayBuffer,
  encryptedKeyIv: Uint8Array,
  salt: Uint8Array,
  password: string,
  aad: Uint8Array,
  kdfParams?: unknown,
  kdfVersion?: unknown,
  kdfIterations?: unknown,
  kdfPolicyTag?: unknown,
) {
  const { timeCost, paramTag } = resolveKdfParamsForDecrypt(
    kdfParams,
    kdfVersion,
    kdfIterations,
    kdfPolicyTag,
  );
  const passwordKey = await deriveAesKeyFromPassword(password, salt, timeCost, paramTag);

  const decryptedKeyBuffer = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: asBufferSource(encryptedKeyIv),
      additionalData: asBufferSource(aad),
      tagLength: 128,
    },
    passwordKey,
    asBufferSource(encryptedKey),
  );

  const decryptedKeyBytes = new Uint8Array(decryptedKeyBuffer);
  try {
    return await importAesGcmKeyFromRawBytes(decryptedKeyBytes);
  } finally {
    // Best-effort cleanup for unwrapped raw content-key bytes.
    decryptedKeyBytes.fill(0);
  }
}
