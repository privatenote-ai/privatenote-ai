import sodium from "libsodium-wrappers";
import { sha256 } from "@noble/hashes/sha2.js";
import { arrayBufferToBase64, base64ToUint8Array } from "@/utils/encryption";
import {
  attachmentChunkSizeBytes,
  attachmentUploadConcurrency,
  attachmentUploadSettleMs,
  DEFAULT_ATTACHMENT_CHUNK_BYTES,
  singleBlobEncryptedSizeUpperBound,
  usesSingleBlobAttachmentUpload,
} from "@/lib/safariSafeChunkUpload";

export {
  attachmentEncryptedSizeUpperBound,
  singleBlobEncryptedSizeUpperBound,
  usesSingleBlobAttachmentUpload,
} from "@/lib/safariSafeChunkUpload";

/** @deprecated Single-Blob mode records the full plaintext length as chunkSize. */
export const SODIUM_ATTACHMENT_CHUNK_SIZE_BYTES = DEFAULT_ATTACHMENT_CHUNK_BYTES;
export const SODIUM_ATTACHMENT_ALG = "libsodium-secretstream-xchacha20poly1305" as const;

/**
 * Authenticated plaintext frame size for attachments (full file on Chrome;
 * ~4 MiB frames on Safari when above the single-PUT cap).
 */
export function getAttachmentChunkSizeBytes(fileSize?: number): number {
  return attachmentChunkSizeBytes(fileSize);
}

export interface SodiumAttachmentChunk {
  index: number;
  encryptedSize: number;
  encryptedBytes: Uint8Array;
  sha256: string;
}

export interface SodiumAttachmentMetadataChunk {
  index: number;
  encryptedSize: number;
}

/** Progress while encrypting the attachment into one ciphertext Blob. */
export type AttachmentPipelineProgress = {
  phase: "encrypt" | "upload";
  completedChunks: number;
  totalChunks: number;
};

export type SodiumAttachmentBlobResult = {
  metadata: SodiumAttachmentMetadata;
  /** Untyped Blob for encrypt.lu-style PUT (no Content-Type preflight). */
  blob: Blob;
  sha256: string;
};

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
  let out = "";
  for (let i = 0; i < bytes.length; i += 1) {
    out += bytes[i]!.toString(16).padStart(2, "0");
  }
  return out;
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

/**
 * Encrypt a file into one secretstream frame and return a single ciphertext Blob
 * (encrypt.lu / Chrome share-mode shape). HTTP upload is a separate single PUT/POST.
 */
export async function encryptFileToSodiumBlob(
  file: File,
  contentKey: CryptoKey,
  metadataKey: CryptoKey,
  noteId: string,
  onProgress?: (progress: AttachmentPipelineProgress) => void,
): Promise<SodiumAttachmentBlobResult> {
  await sodium.ready;

  const chunkSize = getAttachmentChunkSizeBytes(file.size);
  const totalChunks = 1;
  onProgress?.({ phase: "encrypt", completedChunks: 0, totalChunks });

  const streamAad = jsonAadBytes({
    v: 1,
    purpose: "privatenote-attachment-stream",
    alg: SODIUM_ATTACHMENT_ALG,
    noteId,
    chunkSize,
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
  const pipelineStartedAt = typeof performance !== "undefined" ? performance.now() : 0;
  let encryptCpuMs = 0;

  try {
    await new Promise<void>((resolve) => {
      globalThis.setTimeout(resolve, 0);
    });
    const plaintext = new Uint8Array(await file.arrayBuffer());
    const encryptStartedAt = typeof performance !== "undefined" ? performance.now() : 0;
    const encryptedBytes = sodium.crypto_secretstream_xchacha20poly1305_push(
      state,
      plaintext,
      streamAad,
      sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL,
    );
    const encryptedCopy = encryptedBytes.slice();
    if (typeof performance !== "undefined") {
      encryptCpuMs = performance.now() - encryptStartedAt;
    }
    plaintext.fill(0);

    const expectedSize = singleBlobEncryptedSizeUpperBound(file.size);
    if (encryptedCopy.byteLength !== expectedSize) {
      throw new Error(
        `Encrypted attachment size mismatch (got ${encryptedCopy.byteLength}, expected ${expectedSize}).`,
      );
    }

    const digestHex = bytesToHex(sha256(encryptedCopy));
    onProgress?.({ phase: "encrypt", completedChunks: 1, totalChunks });

    const metadata: SodiumAttachmentMetadata = {
      v: 2,
      alg: SODIUM_ATTACHMENT_ALG,
      encryptedSize: encryptedCopy.byteLength,
      chunkSize,
      totalChunks,
      header: bytesToBase64(header),
      aad: bytesToBase64(streamAad),
      encryptedMetadata,
      wrappedKey,
      chunks: [{ index: 0, encryptedSize: encryptedCopy.byteLength }],
      encryptedContentSha256: digestHex,
    };

    // encrypt.lu share mode: typed octet-stream Blob (browser may set Content-Type;
    // we still omit a manual Content-Type request header on the XHR).
    const blob = new Blob([uint8ArrayToExactArrayBuffer(encryptedCopy)], {
      type: "application/octet-stream",
    });

    const totalMs =
      typeof performance !== "undefined" ? Math.round(performance.now() - pipelineStartedAt) : null;
    console.warn(
      "[FILE_UPLOAD] attachment encrypt complete",
      JSON.stringify({
        noteId,
        totalChunks,
        chunkSize,
        fileBytes: file.size,
        encryptedBytes: encryptedCopy.byteLength,
        encryptCpuMs: Math.round(encryptCpuMs),
        totalMs,
        mode: "single-blob",
      }),
    );

    return { metadata, blob, sha256: digestHex };
  } finally {
    fileKey.fill(0);
  }
}

function uint8ArrayToExactArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  if (bytes.byteOffset === 0 && bytes.byteLength === bytes.buffer.byteLength) {
    return bytes.buffer as ArrayBuffer;
  }
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return copy.buffer;
}

/**
 * Safari path: encrypt into ~4 MiB secretstream frames and upload each via onChunk.
 * Used only above SAFARI_SINGLE_BLOB_MAX_BYTES (encrypt.lu single PUT preferred below).
 */
export async function encryptFileToSodiumChunks(
  file: File,
  contentKey: CryptoKey,
  metadataKey: CryptoKey,
  noteId: string,
  onChunk: (chunk: SodiumAttachmentChunk) => Promise<void>,
  onProgress?: (progress: AttachmentPipelineProgress) => void,
): Promise<SodiumAttachmentMetadata> {
  if (usesSingleBlobAttachmentUpload(file.size)) {
    const { metadata, blob, sha256: digestHex } = await encryptFileToSodiumBlob(
      file,
      contentKey,
      metadataKey,
      noteId,
      onProgress,
    );
    const encryptedBytes = new Uint8Array(await blob.arrayBuffer());
    await onChunk({
      index: 0,
      encryptedSize: encryptedBytes.byteLength,
      encryptedBytes,
      sha256: digestHex,
    });
    onProgress?.({ phase: "upload", completedChunks: 1, totalChunks: 1 });
    return metadata;
  }

  await sodium.ready;

  const chunkSize = getAttachmentChunkSizeBytes(file.size);
  const totalChunks = Math.max(1, Math.ceil(file.size / chunkSize));
  const reportProgress = (phase: AttachmentPipelineProgress["phase"], completedChunks: number) => {
    onProgress?.({ phase, completedChunks, totalChunks });
  };
  reportProgress("encrypt", 0);
  const streamAad = jsonAadBytes({
    v: 1,
    purpose: "privatenote-attachment-stream",
    alg: SODIUM_ATTACHMENT_ALG,
    noteId,
    chunkSize,
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
  const uploadConcurrency = attachmentUploadConcurrency();
  const uploadSettleMs = attachmentUploadSettleMs();
  const pipelineStartedAt = typeof performance !== "undefined" ? performance.now() : 0;
  let encryptCpuMs = 0;

  try {
    const inFlight = new Set<Promise<void>>();
    let uploadedChunks = 0;
    let uploadError: unknown = null;

    const enqueueUpload = async (chunk: SodiumAttachmentChunk): Promise<void> => {
      if (uploadError) throw uploadError;
      while (inFlight.size >= uploadConcurrency) {
        await Promise.race(
          [...inFlight].map((pending) => pending.then(() => undefined, () => undefined)),
        );
        if (uploadError) throw uploadError;
      }
      let task!: Promise<void>;
      task = (async () => {
        await onChunk(chunk);
        uploadedChunks += 1;
        reportProgress("upload", uploadedChunks);
        if (uploadSettleMs > 0) {
          await new Promise((resolve) => setTimeout(resolve, uploadSettleMs));
        }
      })()
        .catch((error) => {
          uploadError ??= error;
          throw error;
        })
        .finally(() => {
          inFlight.delete(task);
        });
      inFlight.add(task);
    };

    for (let index = 0; index < totalChunks; index += 1) {
      const start = index * chunkSize;
      const end = Math.min(file.size, start + chunkSize);
      const plaintext = new Uint8Array(await file.slice(start, end).arrayBuffer());
      const tag =
        index === totalChunks - 1
          ? sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL
          : sodium.crypto_secretstream_xchacha20poly1305_TAG_MESSAGE;
      const encryptStartedAt = typeof performance !== "undefined" ? performance.now() : 0;
      const encryptedBytes = sodium.crypto_secretstream_xchacha20poly1305_push(
        state,
        plaintext,
        streamAad,
        tag,
      );
      const encryptedCopy = encryptedBytes.slice();
      if (typeof performance !== "undefined") {
        encryptCpuMs += performance.now() - encryptStartedAt;
      }
      encryptedSize += encryptedCopy.byteLength;
      contentHasher.update(encryptedCopy);
      chunks.push({ index, encryptedSize: encryptedCopy.byteLength });
      reportProgress("encrypt", index + 1);
      await enqueueUpload({
        index,
        encryptedSize: encryptedCopy.byteLength,
        encryptedBytes: encryptedCopy,
        sha256: bytesToHex(sha256(encryptedCopy)),
      });
      if (index % 4 === 3) {
        await new Promise<void>((resolve) => {
          globalThis.setTimeout(resolve, 0);
        });
      }
    }
    if (uploadError) throw uploadError;
    await Promise.all([...inFlight]);
    reportProgress("upload", totalChunks);

    const totalMs =
      typeof performance !== "undefined" ? Math.round(performance.now() - pipelineStartedAt) : null;
    console.warn(
      "[FILE_UPLOAD] attachment pipeline complete",
      JSON.stringify({
        noteId,
        totalChunks,
        chunkSize,
        fileBytes: file.size,
        encryptCpuMs: Math.round(encryptCpuMs),
        totalMs,
        uploadConcurrency,
        mode: "safari-chunks",
      }),
    );
  } finally {
    fileKey.fill(0);
  }

  return {
    v: 2,
    alg: SODIUM_ATTACHMENT_ALG,
    encryptedSize,
    chunkSize,
    totalChunks,
    header: bytesToBase64(header),
    aad: bytesToBase64(streamAad),
    encryptedMetadata,
    wrappedKey,
    chunks,
    encryptedContentSha256: bytesToHex(contentHasher.digest()),
  };
}

/** Progress while downloading + decrypting attachment chunks. */
export type AttachmentDecryptProgress = {
  phase: "download" | "decrypt";
  completedChunks: number;
  totalChunks: number;
};

export async function decryptSodiumAttachmentChunks(
  attachment: SodiumAttachmentMetadata,
  contentKey: CryptoKey,
  getChunk: (index: number) => Promise<Uint8Array>,
  onProgress?: (progress: AttachmentDecryptProgress) => void,
): Promise<Uint8Array[]> {
  await sodium.ready;

  const fileKey = await unwrapSodiumAttachmentKey(attachment.wrappedKey, contentKey);
  const state = sodium.crypto_secretstream_xchacha20poly1305_init_pull(
    base64ToUint8Array(attachment.header),
    fileKey,
  );
  const aad = base64ToUint8Array(attachment.aad);
  const plaintextChunks: Uint8Array[] = [];
  const totalChunks = attachment.totalChunks;

  try {
    for (let index = 0; index < totalChunks; index += 1) {
      const encryptedChunk = await getChunk(index);
      const result = sodium.crypto_secretstream_xchacha20poly1305_pull(state, encryptedChunk, aad);
      if (!result) {
        throw new Error("Attachment chunk authentication failed");
      }
      const expectedTag =
        index === totalChunks - 1
          ? sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL
          : sodium.crypto_secretstream_xchacha20poly1305_TAG_MESSAGE;
      if (result.tag !== expectedTag) {
        throw new Error("Attachment chunk sequence is invalid");
      }
      plaintextChunks.push(result.message);
      // One tick per finished chunk (download + decrypt) so the bar stays linear.
      onProgress?.({ phase: "decrypt", completedChunks: index + 1, totalChunks });
    }
  } finally {
    fileKey.fill(0);
  }

  return plaintextChunks;
}
