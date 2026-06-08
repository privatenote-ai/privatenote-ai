import { tryParseKdfParamsV2Object, type KdfParamsV2 } from "./kdfParamsV2.ts";
import {
  validateNoteAesGcmIvWire,
  validateNoteCiphertextWire,
  validateNoteEncryptedKeyWire,
  validateNoteKdfSaltWire,
} from "./noteCryptoWire.ts";

export const STORED_NOTE_PAYLOAD_VERSION = 1 as const;
export const STORED_NOTE_CIPHER_ALG = "AES-GCM" as const;
export const NOTE_KEY_DERIVATION_HKDF_ROOT_V2 = "hkdf-root-v2" as const;

export interface StoredNoteAttachmentV1 {
  v: 1;
  name: string;
  type: string;
  size: number;
  encryptedSize: number;
  iv: string;
  aad: string;
}

export interface StoredNoteAttachmentV2Chunk {
  index: number;
  encryptedSize: number;
}

export interface StoredNoteAttachmentV2 {
  v: 2;
  alg: "libsodium-secretstream-xchacha20poly1305";
  name: string;
  type: string;
  size: number;
  encryptedSize: number;
  chunkSize: number;
  totalChunks: number;
  header: string;
  aad: string;
  wrappedKey: {
    alg: "AES-GCM";
    iv: string;
    aad: string;
    encryptedKey: string;
  };
  chunks: StoredNoteAttachmentV2Chunk[];
}

export type StoredNoteAttachment = StoredNoteAttachmentV1 | StoredNoteAttachmentV2;

export interface ParsedStoredNoteCiphertext {
  v: number;
  content: string;
  iv: string;
  alg: string;
  /** Required on all new notes (AES-GCM AAD binds id, expiry, maxReads). */
  aad: string;
  isPasswordProtected: boolean;
  salt: string | null;
  encryptedKey: string | null;
  encryptedKeyIv: string | null;
  kdfParams?: KdfParamsV2;
  keyDerivation?: typeof NOTE_KEY_DERIVATION_HKDF_ROOT_V2;
  attachment?: StoredNoteAttachment;
}

function parseStoredNoteAttachment(raw: unknown): StoredNoteAttachment | null {
  if (raw == null) return null;
  if (typeof raw !== "object" || Array.isArray(raw)) return null;
  const o = raw as Record<string, unknown>;
  if (o.v !== 1 && o.v !== 2) return null;
  if (typeof o.name !== "string" || !o.name.trim() || o.name.length > 255) return null;
  if (typeof o.type !== "string" || o.type.length > 255) return null;
  if (typeof o.size !== "number" || !Number.isInteger(o.size) || o.size < 0) return null;
  if (
    typeof o.encryptedSize !== "number" ||
    !Number.isInteger(o.encryptedSize) ||
    o.encryptedSize <= 0
  ) {
    return null;
  }
  if (o.v === 2) {
    if (o.alg !== "libsodium-secretstream-xchacha20poly1305") return null;
    if (typeof o.chunkSize !== "number" || !Number.isInteger(o.chunkSize) || o.chunkSize <= 0) {
      return null;
    }
    if (
      typeof o.totalChunks !== "number" ||
      !Number.isInteger(o.totalChunks) ||
      o.totalChunks <= 0 ||
      o.totalChunks > 1000
    ) {
      return null;
    }
    if (typeof o.header !== "string" || !o.header.trim()) return null;
    if (typeof o.aad !== "string" || !o.aad.trim()) return null;
    if (typeof o.wrappedKey !== "object" || o.wrappedKey === null || Array.isArray(o.wrappedKey)) {
      return null;
    }
    const wrappedKey = o.wrappedKey as Record<string, unknown>;
    if (wrappedKey.alg !== "AES-GCM") return null;
    const wrapIvCheck = validateNoteAesGcmIvWire(wrappedKey.iv, "attachment.wrappedKey.iv");
    if (!wrapIvCheck.ok) return null;
    if (typeof wrappedKey.aad !== "string" || !wrappedKey.aad.trim()) return null;
    if (typeof wrappedKey.encryptedKey !== "string" || !wrappedKey.encryptedKey.trim()) return null;
    if (!Array.isArray(o.chunks) || o.chunks.length !== o.totalChunks) return null;
    const chunks: StoredNoteAttachmentV2Chunk[] = [];
    let encryptedSizeTotal = 0;
    for (let index = 0; index < o.chunks.length; index += 1) {
      const chunkRaw = o.chunks[index];
      if (typeof chunkRaw !== "object" || chunkRaw === null || Array.isArray(chunkRaw)) return null;
      const chunk = chunkRaw as Record<string, unknown>;
      if (chunk.index !== index) return null;
      if (
        typeof chunk.encryptedSize !== "number" ||
        !Number.isInteger(chunk.encryptedSize) ||
        chunk.encryptedSize <= 0
      ) {
        return null;
      }
      encryptedSizeTotal += chunk.encryptedSize;
      chunks.push({ index, encryptedSize: chunk.encryptedSize });
    }
    if (encryptedSizeTotal !== o.encryptedSize) return null;
    return {
      v: 2,
      alg: "libsodium-secretstream-xchacha20poly1305",
      name: o.name.trim(),
      type: o.type.trim(),
      size: o.size,
      encryptedSize: o.encryptedSize,
      chunkSize: o.chunkSize,
      totalChunks: o.totalChunks,
      header: o.header.trim(),
      aad: o.aad.trim(),
      wrappedKey: {
        alg: "AES-GCM",
        iv: (wrappedKey.iv as string).trim(),
        aad: wrappedKey.aad.trim(),
        encryptedKey: wrappedKey.encryptedKey.trim(),
      },
      chunks,
    };
  }
  const ivCheck = validateNoteAesGcmIvWire(o.iv, "attachment.iv");
  if (!ivCheck.ok) return null;
  if (typeof o.aad !== "string" || !o.aad.trim()) return null;
  return {
    v: 1,
    name: o.name.trim(),
    type: o.type.trim(),
    size: o.size,
    encryptedSize: o.encryptedSize,
    iv: (o.iv as string).trim(),
    aad: o.aad.trim(),
  };
}

/**
 * Parse ciphertext JSON as stored by the Durable Object. Rejects unknown versions/algorithms
 * and malformed wire fields so reveal can purge inconsistent rows safely.
 */
export function parseStoredNoteCiphertextForReveal(raw: string): ParsedStoredNoteCiphertext | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    return null;
  }
  const o = parsed as Record<string, unknown>;
  if (o.v !== STORED_NOTE_PAYLOAD_VERSION || o.alg !== STORED_NOTE_CIPHER_ALG) {
    return null;
  }
  const { content, iv, aad: aadRaw, isPasswordProtected: ippRaw } = o;
  if (typeof content !== "string" || typeof iv !== "string") {
    return null;
  }
  const contentWire = validateNoteCiphertextWire(content, "content");
  if (!contentWire.ok) {
    return null;
  }
  const contentTrim = content.trim();
  const ivCheck = validateNoteAesGcmIvWire(iv, "iv");
  if (!ivCheck.ok) {
    return null;
  }
  if (typeof aadRaw !== "string" || !aadRaw.trim()) {
    return null;
  }
  if (typeof ippRaw !== "boolean") {
    return null;
  }
  const isPasswordProtected = ippRaw;
  let kdfParams: KdfParamsV2 | undefined;
  const keyDerivation =
    o.keyDerivation === NOTE_KEY_DERIVATION_HKDF_ROOT_V2
      ? NOTE_KEY_DERIVATION_HKDF_ROOT_V2
      : undefined;
  if (o.keyDerivation != null && !keyDerivation) {
    return null;
  }

  if (!isPasswordProtected) {
    if (o.salt != null || o.encryptedKey != null || o.encryptedKeyIv != null || o.kdfParams != null) {
      return null;
    }
  } else {
    const kdfParsed = tryParseKdfParamsV2Object(o.kdfParams);
    if (!kdfParsed.ok) {
      return null;
    }
    kdfParams = kdfParsed.params;
    const saltCheck = validateNoteKdfSaltWire(o.salt);
    if (!saltCheck.ok) {
      return null;
    }
    const keyIvCheck = validateNoteAesGcmIvWire(o.encryptedKeyIv, "encryptedKeyIv");
    if (!keyIvCheck.ok) {
      return null;
    }
    if (keyDerivation !== NOTE_KEY_DERIVATION_HKDF_ROOT_V2) {
      const encKeyCheck = validateNoteEncryptedKeyWire(o.encryptedKey);
      if (!encKeyCheck.ok) {
        return null;
      }
    } else if (o.encryptedKey != null) {
      return null;
    }
  }

  const ciphertext: ParsedStoredNoteCiphertext = {
    v: STORED_NOTE_PAYLOAD_VERSION,
    content: contentTrim,
    iv: iv.trim(),
    alg: STORED_NOTE_CIPHER_ALG,
    aad: aadRaw.trim(),
    isPasswordProtected,
    salt: isPasswordProtected ? (o.salt as string) : null,
    encryptedKey:
      isPasswordProtected && typeof o.encryptedKey === "string" ? o.encryptedKey.trim() : null,
    encryptedKeyIv:
      isPasswordProtected && typeof o.encryptedKeyIv === "string" ? o.encryptedKeyIv.trim() : null,
  };
  if (kdfParams) {
    ciphertext.kdfParams = kdfParams;
  }
  if (keyDerivation) {
    ciphertext.keyDerivation = keyDerivation;
  }
  const attachment = parseStoredNoteAttachment(o.attachment);
  if (o.attachment != null && !attachment) return null;
  if (attachment) {
    ciphertext.attachment = attachment;
  }
  return ciphertext;
}
