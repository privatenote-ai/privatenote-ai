import { tryParseKdfParamsV2Object, type KdfParamsV2 } from "./kdfParamsV2.ts";
import {
  validateNoteAesGcmIvWire,
  validateNoteCiphertextWire,
  validateNoteEncryptedKeyWire,
  validateNoteKdfSaltWire,
} from "./noteCryptoWire.ts";

export const STORED_NOTE_PAYLOAD_VERSION = 1 as const;
export const STORED_NOTE_CIPHER_ALG = "AES-GCM" as const;

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
    const encKeyCheck = validateNoteEncryptedKeyWire(o.encryptedKey);
    if (!encKeyCheck.ok) {
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
  return ciphertext;
}
