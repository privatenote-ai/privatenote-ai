/**
 * Node-side libsodium secretstream encrypt matching the web single-blob attachment.
 */

import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { NOTE_FILE_SECRETSTREAM_ABYTES } from "@shared/noteFileLimits";
import { arrayBufferToBase64 } from "@shared/noteCrypto";

const require = createRequire(import.meta.url);
const sodium = require("libsodium-wrappers") as {
  ready: Promise<void>;
  crypto_secretstream_xchacha20poly1305_keygen: () => Uint8Array;
  crypto_secretstream_xchacha20poly1305_init_push: (key: Uint8Array) => {
    state: unknown;
    header: Uint8Array;
  };
  crypto_secretstream_xchacha20poly1305_push: (
    state: unknown,
    message: Uint8Array,
    ad: Uint8Array | null,
    tag: number,
  ) => Uint8Array;
  crypto_secretstream_xchacha20poly1305_TAG_MESSAGE: number;
  crypto_secretstream_xchacha20poly1305_TAG_FINAL: number;
};

export const SODIUM_ATTACHMENT_ALG = "libsodium-secretstream-xchacha20poly1305" as const;
const SINGLE_BLOB_PROGRESS_FRAME_BYTES = 4 * 1024 * 1024;

export type SodiumAttachmentMetadata = {
  v: 2;
  alg: typeof SODIUM_ATTACHMENT_ALG;
  encryptedSize: number;
  chunkSize: number;
  totalChunks: number;
  header: string;
  aad: string;
  encryptedMetadata: { alg: "AES-GCM"; iv: string; aad: string; ciphertext: string };
  wrappedKey: { alg: "AES-GCM"; iv: string; aad: string; encryptedKey: string };
  chunks: Array<{ index: number; encryptedSize: number }>;
  encryptedContentSha256: string;
};

function asBuffer(input: Uint8Array): ArrayBuffer {
  return input.buffer.slice(input.byteOffset, input.byteOffset + input.byteLength) as ArrayBuffer;
}

function jsonAadBytes(value: Record<string, unknown>): Uint8Array {
  return new TextEncoder().encode(JSON.stringify(value));
}

function singleBlobProgressFrameBytes(plaintextBytes: number): number {
  const size = Math.max(0, plaintextBytes);
  if (size <= SINGLE_BLOB_PROGRESS_FRAME_BYTES) {
    return Math.max(1, size);
  }
  return SINGLE_BLOB_PROGRESS_FRAME_BYTES;
}

export function singleBlobEncryptedSizeUpperBound(plaintextBytes: number): number {
  const frame = singleBlobProgressFrameBytes(plaintextBytes);
  const frames = Math.max(1, Math.ceil(Math.max(0, plaintextBytes) / frame));
  return Math.max(0, plaintextBytes) + frames * NOTE_FILE_SECRETSTREAM_ABYTES;
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
    streamAad: arrayBufferToBase64(streamAad),
    attachmentIndex: 0,
  });
  const iv = globalThis.crypto.getRandomValues(new Uint8Array(12));
  const encryptedKey = await globalThis.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: asBuffer(iv), additionalData: asBuffer(wrapAad), tagLength: 128 },
    contentKey,
    asBuffer(fileKey),
  );
  return {
    alg: "AES-GCM" as const,
    iv: arrayBufferToBase64(iv),
    aad: arrayBufferToBase64(wrapAad),
    encryptedKey: arrayBufferToBase64(new Uint8Array(encryptedKey)),
  };
}

async function encryptSodiumAttachmentMetadata(
  metadata: { name: string; type: string; size: number },
  metadataKey: CryptoKey,
  noteId: string,
  totalChunks: number,
) {
  const aad = jsonAadBytes({
    v: 1,
    purpose: "privatenote-attachment-metadata",
    alg: SODIUM_ATTACHMENT_ALG,
    noteId,
    totalChunks,
    attachmentIndex: 0,
  });
  const iv = globalThis.crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await globalThis.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: asBuffer(iv), additionalData: asBuffer(aad), tagLength: 128 },
    metadataKey,
    asBuffer(new TextEncoder().encode(JSON.stringify(metadata))),
  );
  return {
    alg: "AES-GCM" as const,
    iv: arrayBufferToBase64(iv),
    aad: arrayBufferToBase64(aad),
    ciphertext: arrayBufferToBase64(new Uint8Array(ciphertext)),
  };
}

export async function encryptFileToSodiumBlob(input: {
  bytes: Uint8Array;
  name: string;
  type: string;
  contentKey: CryptoKey;
  metadataKey: CryptoKey;
  noteId: string;
}): Promise<{ metadata: SodiumAttachmentMetadata; ciphertext: Uint8Array }> {
  await sodium.ready;
  const fileSize = input.bytes.byteLength;
  const chunkSize = singleBlobProgressFrameBytes(fileSize);
  const totalChunks = 1;
  const frameCount = Math.max(1, Math.ceil(Math.max(1, fileSize) / chunkSize));
  const streamAad = jsonAadBytes({
    v: 1,
    purpose: "privatenote-attachment-stream",
    alg: SODIUM_ATTACHMENT_ALG,
    noteId: input.noteId,
    chunkSize,
    totalChunks,
    attachmentIndex: 0,
  });
  const encryptedMetadata = await encryptSodiumAttachmentMetadata(
    {
      name: input.name.slice(0, 255) || "privatenote-file",
      type: (input.type || "application/octet-stream").slice(0, 255),
      size: fileSize,
    },
    input.metadataKey,
    input.noteId,
    totalChunks,
  );
  const fileKey = sodium.crypto_secretstream_xchacha20poly1305_keygen();
  const { state, header } = sodium.crypto_secretstream_xchacha20poly1305_init_push(fileKey);
  const wrappedKey = await wrapFileKey(fileKey, input.contentKey, input.noteId, streamAad);
  try {
    const encryptedParts: Uint8Array[] = [];
    let encryptedByteLength = 0;
    const hasher = createHash("sha256");
    for (let frameIndex = 0; frameIndex < frameCount; frameIndex += 1) {
      const start = frameIndex * chunkSize;
      const end = Math.min(fileSize, start + chunkSize);
      const plaintext = input.bytes.subarray(start, end);
      const tag =
        frameIndex === frameCount - 1
          ? sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL
          : sodium.crypto_secretstream_xchacha20poly1305_TAG_MESSAGE;
      const encryptedBytes = sodium.crypto_secretstream_xchacha20poly1305_push(
        state,
        plaintext,
        streamAad,
        tag,
      );
      const encryptedCopy = encryptedBytes.slice();
      encryptedParts.push(encryptedCopy);
      encryptedByteLength += encryptedCopy.byteLength;
      hasher.update(encryptedCopy);
    }
    const expectedSize = singleBlobEncryptedSizeUpperBound(fileSize);
    if (encryptedByteLength !== expectedSize) {
      throw new Error("Encrypted attachment size mismatch");
    }
    const concatenated = new Uint8Array(encryptedByteLength);
    let offset = 0;
    for (const part of encryptedParts) {
      concatenated.set(part, offset);
      offset += part.byteLength;
    }
    return {
      ciphertext: concatenated,
      metadata: {
        v: 2,
        alg: SODIUM_ATTACHMENT_ALG,
        encryptedSize: encryptedByteLength,
        chunkSize,
        totalChunks,
        header: arrayBufferToBase64(header),
        aad: arrayBufferToBase64(streamAad),
        encryptedMetadata,
        wrappedKey,
        chunks: [{ index: 0, encryptedSize: encryptedByteLength }],
        encryptedContentSha256: hasher.digest("hex"),
      },
    };
  } finally {
    fileKey.fill(0);
  }
}
