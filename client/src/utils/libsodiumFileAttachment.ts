import sodium from "libsodium-wrappers";
import { sha256 } from "@noble/hashes/sha2.js";
import { arrayBufferToBase64, base64ToUint8Array } from "@/utils/encryption";

export const SODIUM_ATTACHMENT_CHUNK_SIZE_BYTES = 2 * 1024 * 1024;
export const SODIUM_ATTACHMENT_ALG = "libsodium-secretstream-xchacha20poly1305" as const;

export interface SodiumAttachmentChunk {
  index: number;
  encryptedSize: number;
  encryptedBytes: Uint8Array;
}

export interface SodiumAttachmentMetadataChunk {
  index: number;
  encryptedSize: number;
}

export interface SodiumAttachmentPlainMetadata {
  name: string;
  type: string;
  size: number;
}

const SODIUM_ATTACHMENT_METADATA_NAME_MAX_CHARS = 255;
const SODIUM_ATTACHMENT_METADATA_TYPE_MAX_CHARS = 255;

export interface SodiumAttachmentEncryptedMetadata {
  alg: "AES-GCM";
  iv: string;
  aad: string;
  ciphertext: string;
}

export interface SodiumAttachmentMetadata {
  v: 2;
  alg: typeof SODIUM_ATTACHMENT_ALG;
  encryptedSize: number;
  chunkSize: number;
  totalChunks: number;
  header: string;
  aad: string;
  encryptedMetadata: SodiumAttachmentEncryptedMetadata;
  wrappedKey: {
    alg: "AES-GCM";
    iv: string;
    aad: string;
    encryptedKey: string;
  };
  chunks: SodiumAttachmentMetadataChunk[];
  encryptedContentSha256: string;
}

function bytesToHex(bytes: Uint8Array): string {
  return [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function bytesToBase64(bytes: Uint8Array): string {
  return arrayBufferToBase64(bytes);
}

function jsonAadBytes(value: Record<string, unknown>): Uint8Array {
  return new TextEncoder().encode(JSON.stringify(value));
}

async function wrapFileKey(
  fileKey: Uint8Array,
  contentKey: CryptoKey,
  noteId: string,
  streamAad: Uint8Array,
) {
  const wrapAad = jsonAadBytes({
    v: 1,
    purpose: "privatenote-attachment-key-wrap",
    alg: SODIUM_ATTACHMENT_ALG,
    noteId,
    streamAad: bytesToBase64(streamAad),
  });
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encryptedKey = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv as unknown as BufferSource,
      additionalData: wrapAad as unknown as BufferSource,
      tagLength: 128,
    },
    contentKey,
    fileKey as unknown as BufferSource,
  );
  return {
    alg: "AES-GCM" as const,
    iv: bytesToBase64(iv),
    aad: bytesToBase64(wrapAad),
    encryptedKey: bytesToBase64(new Uint8Array(encryptedKey)),
  };
}

function metadataAadBytes(noteId: string, totalChunks: number): Uint8Array {
  return jsonAadBytes({
    v: 1,
    purpose: "privatenote-attachment-metadata",
    alg: SODIUM_ATTACHMENT_ALG,
    noteId,
    totalChunks,
  });
}

function assertMetadataAadSemantics(aadBytes: Uint8Array, noteId: string, totalChunks: number): void {
  let parsed: unknown;
  try {
    parsed = JSON.parse(new TextDecoder().decode(aadBytes));
  } catch {
    throw new Error("Attachment metadata authentication data is invalid");
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("Attachment metadata authentication data is invalid");
  }
  const aad = parsed as Record<string, unknown>;
  if (
    aad.v !== 1 ||
    aad.purpose !== "privatenote-attachment-metadata" ||
    aad.alg !== SODIUM_ATTACHMENT_ALG ||
    aad.noteId !== noteId ||
    aad.totalChunks !== totalChunks
  ) {
    throw new Error("Attachment metadata authentication data does not match this note");
  }
}

async function encryptSodiumAttachmentMetadata(
  metadata: SodiumAttachmentPlainMetadata,
  metadataKey: CryptoKey,
  noteId: string,
  totalChunks: number,
): Promise<SodiumAttachmentEncryptedMetadata> {
  const aad = metadataAadBytes(noteId, totalChunks);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv as unknown as BufferSource,
      additionalData: aad as unknown as BufferSource,
      tagLength: 128,
    },
    metadataKey,
    new TextEncoder().encode(JSON.stringify(metadata)) as unknown as BufferSource,
  );
  return {
    alg: "AES-GCM",
    iv: bytesToBase64(iv),
    aad: bytesToBase64(aad),
    ciphertext: bytesToBase64(new Uint8Array(ciphertext)),
  };
}

export async function decryptSodiumAttachmentMetadata(
  attachment: SodiumAttachmentMetadata,
  metadataKey: CryptoKey,
  noteId: string,
): Promise<SodiumAttachmentPlainMetadata> {
  const metadata = attachment.encryptedMetadata;
  const aad = base64ToUint8Array(metadata.aad);
  assertMetadataAadSemantics(aad, noteId, attachment.totalChunks);
  const plaintext = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: base64ToUint8Array(metadata.iv) as unknown as BufferSource,
      additionalData: aad as unknown as BufferSource,
      tagLength: 128,
    },
    metadataKey,
    base64ToUint8Array(metadata.ciphertext) as unknown as BufferSource,
  );
  const parsed = JSON.parse(new TextDecoder().decode(plaintext)) as Record<string, unknown>;
  if (
    typeof parsed.name !== "string" ||
    typeof parsed.type !== "string" ||
    typeof parsed.size !== "number" ||
    !Number.isInteger(parsed.size) ||
    parsed.size < 0 ||
    !parsed.name.trim() ||
    parsed.name.length > SODIUM_ATTACHMENT_METADATA_NAME_MAX_CHARS ||
    parsed.type.length > SODIUM_ATTACHMENT_METADATA_TYPE_MAX_CHARS
  ) {
    throw new Error("Attachment metadata is invalid");
  }
  return {
    name: parsed.name || "privatenote-file",
    type: parsed.type || "application/octet-stream",
    size: parsed.size,
  };
}

export async function unwrapSodiumAttachmentKey(
  wrappedKey: SodiumAttachmentMetadata["wrappedKey"],
  contentKey: CryptoKey,
): Promise<Uint8Array> {
  const keyBytes = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: base64ToUint8Array(wrappedKey.iv) as unknown as BufferSource,
      additionalData: base64ToUint8Array(wrappedKey.aad) as unknown as BufferSource,
      tagLength: 128,
    },
    contentKey,
    base64ToUint8Array(wrappedKey.encryptedKey) as unknown as BufferSource,
  );
  return new Uint8Array(keyBytes);
}

export async function encryptFileToSodiumChunks(
  file: File,
  contentKey: CryptoKey,
  metadataKey: CryptoKey,
  noteId: string,
  onChunk: (chunk: SodiumAttachmentChunk) => Promise<void>,
): Promise<SodiumAttachmentMetadata> {
  await sodium.ready;

  const totalChunks = Math.max(1, Math.ceil(file.size / SODIUM_ATTACHMENT_CHUNK_SIZE_BYTES));
  const streamAad = jsonAadBytes({
    v: 1,
    purpose: "privatenote-attachment-stream",
    alg: SODIUM_ATTACHMENT_ALG,
    noteId,
    chunkSize: SODIUM_ATTACHMENT_CHUNK_SIZE_BYTES,
    totalChunks,
  });
  const encryptedMetadata = await encryptSodiumAttachmentMetadata(
    {
      name: file.name,
      type: file.type || "application/octet-stream",
      size: file.size,
    },
    metadataKey,
    noteId,
    totalChunks,
  );
  const fileKey = sodium.crypto_secretstream_xchacha20poly1305_keygen();
  const { state, header } = sodium.crypto_secretstream_xchacha20poly1305_init_push(fileKey);
  const wrappedKey = await wrapFileKey(fileKey, contentKey, noteId, streamAad);
  const chunks: SodiumAttachmentMetadataChunk[] = [];
  let encryptedSize = 0;
  const contentHasher = sha256.create();

  try {
    for (let index = 0; index < totalChunks; index += 1) {
      const start = index * SODIUM_ATTACHMENT_CHUNK_SIZE_BYTES;
      const end = Math.min(file.size, start + SODIUM_ATTACHMENT_CHUNK_SIZE_BYTES);
      const plaintext = new Uint8Array(await file.slice(start, end).arrayBuffer());
      const tag =
        index === totalChunks - 1
          ? sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL
          : sodium.crypto_secretstream_xchacha20poly1305_TAG_MESSAGE;
      const encryptedBytes = sodium.crypto_secretstream_xchacha20poly1305_push(
        state,
        plaintext,
        streamAad,
        tag,
      );
      encryptedSize += encryptedBytes.byteLength;
      contentHasher.update(encryptedBytes);
      chunks.push({ index, encryptedSize: encryptedBytes.byteLength });
      console.info(
        "[FILE_UPLOAD] chunk encrypted locally",
        JSON.stringify({
          noteId,
          chunkIndex: index,
          totalChunks,
          plaintextBytes: plaintext.byteLength,
          encryptedBytes: encryptedBytes.byteLength,
          bufferBytes: encryptedBytes.buffer.byteLength,
          byteOffset: encryptedBytes.byteOffset,
        }),
      );
      await onChunk({ index, encryptedSize: encryptedBytes.byteLength, encryptedBytes });
    }
  } finally {
    fileKey.fill(0);
  }

  return {
    v: 2,
    alg: SODIUM_ATTACHMENT_ALG,
    encryptedSize,
    chunkSize: SODIUM_ATTACHMENT_CHUNK_SIZE_BYTES,
    totalChunks,
    header: bytesToBase64(header),
    aad: bytesToBase64(streamAad),
    encryptedMetadata,
    wrappedKey,
    chunks,
    encryptedContentSha256: bytesToHex(contentHasher.digest()),
  };
}

export async function decryptSodiumAttachmentChunks(
  attachment: SodiumAttachmentMetadata,
  contentKey: CryptoKey,
  getChunk: (index: number) => Promise<Uint8Array>,
): Promise<Uint8Array[]> {
  await sodium.ready;

  const fileKey = await unwrapSodiumAttachmentKey(attachment.wrappedKey, contentKey);
  const state = sodium.crypto_secretstream_xchacha20poly1305_init_pull(
    base64ToUint8Array(attachment.header),
    fileKey,
  );
  const aad = base64ToUint8Array(attachment.aad);
  const plaintextChunks: Uint8Array[] = [];

  try {
    for (let index = 0; index < attachment.totalChunks; index += 1) {
      const encryptedChunk = await getChunk(index);
      const result = sodium.crypto_secretstream_xchacha20poly1305_pull(state, encryptedChunk, aad);
      if (!result) {
        throw new Error("Attachment chunk authentication failed");
      }
      const expectedTag =
        index === attachment.totalChunks - 1
          ? sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL
          : sodium.crypto_secretstream_xchacha20poly1305_TAG_MESSAGE;
      if (result.tag !== expectedTag) {
        throw new Error("Attachment chunk sequence is invalid");
      }
      plaintextChunks.push(result.message);
    }
  } finally {
    fileKey.fill(0);
  }

  return plaintextChunks;
}
