import { tryParseKdfParamsV2Object, type KdfParamsV2 } from "./kdfParamsV2.ts";
import {
  validateAttachmentMetadataCiphertextWire,
  validateNoteAesGcmIvWire,
  validateNoteCiphertextWire,
  validateNoteEncryptedKeyWire,
  validateNoteKdfSaltWire,
} from "./noteCryptoWire.ts";
import { decodeBase64UrlToBytes } from "./urlFragmentKey.ts";
import {
  NOTE_FILE_ACCESS_DEFAULT_SECONDS,
  isNoteFileAccessWindowSeconds,
} from "./noteFileAccess.ts";
import { isSupportedLanguage, type SupportedLanguage } from "./supportedLanguages.ts";
import {
  parseStoredRevealBranding,
  type RevealBranding,
} from "./businessBranding.ts";
import {
  parseRevealBodyFont,
  type StoredRevealBodyFont,
} from "./revealBodyFont.ts";
import {
  parseAttachmentRecipientPermission,
  type StoredAttachmentRecipientPermission,
} from "./attachmentRecipientPermission.ts";

export const STORED_NOTE_PAYLOAD_VERSION = 1 as const;
export const STORED_NOTE_CIPHER_ALG = "AES-GCM" as const;
export const NOTE_KEY_DERIVATION_HKDF_ROOT_V2 = "hkdf-root-v2" as const;

export interface StoredNoteAttachmentV2Chunk {
  index: number;
  encryptedSize: number;
}

export interface StoredNoteAttachmentV2 {
  v: 2;
  alg: "libsodium-secretstream-xchacha20poly1305";
  encryptedSize: number;
  chunkSize: number;
  totalChunks: number;
  header: string;
  aad: string;
  encryptedMetadata: {
    alg: "AES-GCM";
    iv: string;
    aad: string;
    ciphertext: string;
  };
  wrappedKey: {
    alg: "AES-GCM";
    iv: string;
    aad: string;
    encryptedKey: string;
  };
  chunks: StoredNoteAttachmentV2Chunk[];
}

export type StoredNoteAttachment = StoredNoteAttachmentV2;

const ATTACHMENT_ALG = "libsodium-secretstream-xchacha20poly1305" as const;

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
  /** One or more files in a single transfer. Prefer this over `attachment`. */
  attachments?: StoredNoteAttachment[];
  fileAccessWindowSeconds?: number;
  readerLanguage?: SupportedLanguage;
  /** Optional Starter+ body typeface snapshotted at create time. */
  bodyFont?: StoredRevealBodyFont;
  /** Optional Business view-only handling policy for the attachment. */
  attachmentPermission?: StoredAttachmentRecipientPermission;
  /** Optional Business branded reveal chrome snapshotted at create time. */
  revealBranding?: RevealBranding;
}

function decodeJsonAad(value: string): Record<string, unknown> | null {
  const bytes = decodeBase64UrlToBytes(value);
  if (!bytes) return null;
  try {
    const parsed = JSON.parse(new TextDecoder().decode(bytes));
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return null;
    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}

function attachmentAadMatches(
  attachment: {
    aad: string;
    chunkSize: number;
    totalChunks: number;
    encryptedMetadata: { aad: string };
    wrappedKey: { aad: string };
  },
  noteId?: string,
  attachmentIndex?: number,
): boolean {
  if (!noteId) return true;
  const streamAad = decodeJsonAad(attachment.aad);
  const metadataAad = decodeJsonAad(attachment.encryptedMetadata.aad);
  const wrappedKeyAad = decodeJsonAad(attachment.wrappedKey.aad);
  if (!streamAad || !metadataAad || !wrappedKeyAad) return false;
  const expectedIndex = attachmentIndex ?? 0;
  const streamIndex =
    typeof streamAad.attachmentIndex === "number" && Number.isInteger(streamAad.attachmentIndex)
      ? streamAad.attachmentIndex
      : 0;
  const metadataIndex =
    typeof metadataAad.attachmentIndex === "number" && Number.isInteger(metadataAad.attachmentIndex)
      ? metadataAad.attachmentIndex
      : 0;
  const wrapIndex =
    typeof wrappedKeyAad.attachmentIndex === "number" && Number.isInteger(wrappedKeyAad.attachmentIndex)
      ? wrappedKeyAad.attachmentIndex
      : 0;
  if (
    streamAad.v !== 1 ||
    streamAad.purpose !== "privatenote-attachment-stream" ||
    streamAad.alg !== ATTACHMENT_ALG ||
    streamAad.noteId !== noteId ||
    streamAad.chunkSize !== attachment.chunkSize ||
    streamAad.totalChunks !== attachment.totalChunks ||
    streamIndex !== expectedIndex
  ) {
    return false;
  }
  if (
    metadataAad.v !== 1 ||
    metadataAad.purpose !== "privatenote-attachment-metadata" ||
    metadataAad.alg !== ATTACHMENT_ALG ||
    metadataAad.noteId !== noteId ||
    metadataAad.totalChunks !== attachment.totalChunks ||
    metadataIndex !== expectedIndex
  ) {
    return false;
  }
  return (
    wrappedKeyAad.v === 1 &&
    wrappedKeyAad.purpose === "privatenote-attachment-key-wrap" &&
    wrappedKeyAad.alg === ATTACHMENT_ALG &&
    wrappedKeyAad.noteId === noteId &&
    wrappedKeyAad.streamAad === attachment.aad &&
    wrapIndex === expectedIndex
  );
}

export function parseStoredNoteAttachmentForNote(
  raw: unknown,
  noteId?: string,
  attachmentIndex?: number,
): StoredNoteAttachment | null {
  if (raw == null) return null;
  if (typeof raw !== "object" || Array.isArray(raw)) return null;
  const o = raw as Record<string, unknown>;
  if (o.v !== 2) return null;
  if (
    typeof o.encryptedSize !== "number" ||
    !Number.isInteger(o.encryptedSize) ||
    o.encryptedSize <= 0
  ) {
    return null;
  }
  if (o.alg !== ATTACHMENT_ALG) return null;
  if (o.name != null || o.type != null || o.size != null) return null;
  let encryptedMetadata: StoredNoteAttachmentV2["encryptedMetadata"];
  if (
    typeof o.encryptedMetadata !== "object" ||
    o.encryptedMetadata === null ||
    Array.isArray(o.encryptedMetadata)
  ) {
    return null;
  }
  const metadata = o.encryptedMetadata as Record<string, unknown>;
  if (metadata.alg !== "AES-GCM") return null;
  const metadataIvCheck = validateNoteAesGcmIvWire(metadata.iv, "attachment.encryptedMetadata.iv");
  if (!metadataIvCheck.ok) return null;
  if (typeof metadata.aad !== "string" || !metadata.aad.trim()) return null;
  const metadataCiphertextCheck = validateAttachmentMetadataCiphertextWire(metadata.ciphertext);
  if (!metadataCiphertextCheck.ok) return null;
  encryptedMetadata = {
    alg: "AES-GCM",
    iv: (metadata.iv as string).trim(),
    aad: metadata.aad.trim(),
    ciphertext: (metadata.ciphertext as string).trim(),
  };
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
  const parsedAttachment = {
    v: 2,
    alg: ATTACHMENT_ALG,
    encryptedSize: o.encryptedSize,
    chunkSize: o.chunkSize,
    totalChunks: o.totalChunks,
    header: o.header.trim(),
    aad: o.aad.trim(),
    encryptedMetadata,
    wrappedKey: {
      alg: "AES-GCM",
      iv: (wrappedKey.iv as string).trim(),
      aad: wrappedKey.aad.trim(),
      encryptedKey: wrappedKey.encryptedKey.trim(),
    },
    chunks,
  } satisfies StoredNoteAttachment;
  return attachmentAadMatches(parsedAttachment, noteId, attachmentIndex) ? parsedAttachment : null;
}

const MAX_STORED_NOTE_ATTACHMENTS = 20;

export function parseStoredNoteAttachmentsForNote(
  raw: unknown,
  noteId?: string,
): StoredNoteAttachment[] | null {
  if (raw == null) return [];
  if (!Array.isArray(raw)) return null;
  if (raw.length > MAX_STORED_NOTE_ATTACHMENTS) return null;
  const attachments: StoredNoteAttachment[] = [];
  for (let index = 0; index < raw.length; index += 1) {
    const parsed = parseStoredNoteAttachmentForNote(raw[index], noteId, index);
    if (!parsed) return null;
    attachments.push(parsed);
  }
  return attachments;
}

/**
 * Parse ciphertext JSON as stored by the Durable Object. Rejects unknown versions/algorithms
 * and malformed wire fields so reveal can purge inconsistent rows safely.
 */
export function parseStoredNoteCiphertextForReveal(
  raw: string,
  noteId?: string,
): ParsedStoredNoteCiphertext | null {
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
  if (typeof o.readerLanguage === "string") {
    if (!isSupportedLanguage(o.readerLanguage)) return null;
    ciphertext.readerLanguage = o.readerLanguage;
  } else if (o.readerLanguage != null) {
    return null;
  }
  // Unknown font ids are dropped rather than failing reveal — decoration only.
  const bodyFont = parseRevealBodyFont(o.bodyFont);
  if (bodyFont) {
    ciphertext.bodyFont = bodyFont;
  } else if (o.bodyFont != null && typeof o.bodyFont !== "string") {
    return null;
  }
  const attachmentPermission = parseAttachmentRecipientPermission(o.attachmentPermission);
  if (attachmentPermission) {
    ciphertext.attachmentPermission = attachmentPermission;
  } else if (o.attachmentPermission != null && typeof o.attachmentPermission !== "string") {
    return null;
  }
  const attachmentsList = parseStoredNoteAttachmentsForNote(o.attachments, noteId);
  if (o.attachments != null && !attachmentsList) return null;
  const singularAttachment = parseStoredNoteAttachmentForNote(o.attachment, noteId, 0);
  if (o.attachment != null && !singularAttachment) return null;
  if (attachmentsList && attachmentsList.length > 0 && singularAttachment) {
    if (JSON.stringify(attachmentsList[0]) !== JSON.stringify(singularAttachment)) return null;
  }
  const attachment =
    attachmentsList && attachmentsList.length > 0 ? attachmentsList[0] : singularAttachment;
  if (attachment) {
    ciphertext.attachment = attachment;
  }
  if (attachmentsList && attachmentsList.length > 0) {
    ciphertext.attachments = attachmentsList;
  } else if (singularAttachment) {
    ciphertext.attachments = [singularAttachment];
  }
  if (o.fileAccessWindowSeconds != null) {
    if (!isNoteFileAccessWindowSeconds(o.fileAccessWindowSeconds)) return null;
    ciphertext.fileAccessWindowSeconds = o.fileAccessWindowSeconds;
  } else if (attachment) {
    ciphertext.fileAccessWindowSeconds = NOTE_FILE_ACCESS_DEFAULT_SECONDS;
  }
  // Malformed branding is dropped rather than failing the parse: it is decoration.
  const revealBranding = parseStoredRevealBranding(o.revealBranding);
  if (revealBranding) {
    ciphertext.revealBranding = revealBranding;
  }
  return ciphertext;
}
