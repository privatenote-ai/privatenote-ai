import sodium from "libsodium-wrappers";
import { sha256 } from "@noble/hashes/sha2.js";
import { arrayBufferToBase64, base64ToUint8Array } from "@/utils/encryption";
import {
  attachmentChunkSizeBytes,
  attachmentUploadConcurrency,
  attachmentUploadSettleMs,
  DEFAULT_ATTACHMENT_CHUNK_BYTES,
  isSafariBrowser,
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

/** Progress while encrypting / uploading an attachment. */
export type AttachmentPipelineProgress = {
  phase: "encrypt" | "upload";
  completedChunks: number;
  totalChunks: number;
  /**
   * 0–1 within the current phase when byte-accurate progress is available
   * (preferred over completedChunks/totalChunks for single-blob encrypt).
   */
  ratio?: number;
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
  attachmentIndex = 0,
) {
  const wrapAad = jsonAadBytes({
    v: 1,
    purpose: "privatenote-attachment-key-wrap",
    alg: SODIUM_ATTACHMENT_ALG,
    noteId,
    streamAad: bytesToBase64(streamAad),
    attachmentIndex,
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

function metadataAadBytes(noteId: string, totalChunks: number, attachmentIndex = 0): Uint8Array {
  return jsonAadBytes({
    v: 1,
    purpose: "privatenote-attachment-metadata",
    alg: SODIUM_ATTACHMENT_ALG,
    noteId,
    totalChunks,
    attachmentIndex,
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
  attachmentIndex = 0,
): Promise<SodiumAttachmentEncryptedMetadata> {
  const aad = metadataAadBytes(noteId, totalChunks, attachmentIndex);
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
 * Encrypt a file into one HTTP Blob (possibly multiple secretstream frames) for a
 * single PUT. Frames are ~4 MiB so progress can advance linearly between yields —
 * one giant sync push freezes Safari's UI for large files.
 */
export async function encryptFileToSodiumBlob(
  file: File,
  contentKey: CryptoKey,
  metadataKey: CryptoKey,
  noteId: string,
  onProgress?: (progress: AttachmentPipelineProgress) => void,
  attachmentIndex = 0,
): Promise<SodiumAttachmentBlobResult> {
  await sodium.ready;

  const chunkSize = getAttachmentChunkSizeBytes(file.size);
  const totalChunks = 1;
  const frameCount = Math.max(1, Math.ceil(Math.max(1, file.size) / chunkSize));
  const reportEncryptRatio = async (ratio: number) => {
    onProgress?.({
      phase: "encrypt",
      completedChunks: ratio >= 1 ? 1 : 0,
      totalChunks,
      ratio: Math.min(1, Math.max(0, ratio)),
    });
    await new Promise<void>((resolve) => {
      if (typeof requestAnimationFrame === "function") {
        requestAnimationFrame(() => resolve());
      } else {
        globalThis.setTimeout(resolve, 0);
      }
    });
  };
  await reportEncryptRatio(0.01);

  const streamAad = jsonAadBytes({
    v: 1,
    purpose: "privatenote-attachment-stream",
    alg: SODIUM_ATTACHMENT_ALG,
    noteId,
    chunkSize,
    totalChunks,
    attachmentIndex,
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
    attachmentIndex,
  );
  await reportEncryptRatio(0.03);
  const fileKey = sodium.crypto_secretstream_xchacha20poly1305_keygen();
  const { state, header } = sodium.crypto_secretstream_xchacha20poly1305_init_push(fileKey);
  const wrappedKey = await wrapFileKey(fileKey, contentKey, noteId, streamAad, attachmentIndex);
  await reportEncryptRatio(0.05);
  const pipelineStartedAt = typeof performance !== "undefined" ? performance.now() : 0;
  let encryptCpuMs = 0;

  try {
    const encryptedParts: Uint8Array[] = [];
    let encryptedByteLength = 0;
    const contentHasher = sha256.create();

    for (let frameIndex = 0; frameIndex < frameCount; frameIndex += 1) {
      const start = frameIndex * chunkSize;
      const end = Math.min(file.size, start + chunkSize);
      const plaintext = new Uint8Array(await file.slice(start, end).arrayBuffer());
      const tag =
        frameIndex === frameCount - 1
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
      plaintext.fill(0);
      encryptedParts.push(encryptedCopy);
      encryptedByteLength += encryptedCopy.byteLength;
      contentHasher.update(encryptedCopy);

      // 5% → 97% tracks frames (read + encrypt) linearly.
      const frameRatio = (frameIndex + 1) / frameCount;
      await reportEncryptRatio(0.05 + frameRatio * 0.92);
    }

    const expectedSize = singleBlobEncryptedSizeUpperBound(file.size);
    if (encryptedByteLength !== expectedSize) {
      throw new Error(
        `Encrypted attachment size mismatch (got ${encryptedByteLength}, expected ${expectedSize}).`,
      );
    }

    const digestHex = bytesToHex(contentHasher.digest());
    await reportEncryptRatio(1);

    const metadata: SodiumAttachmentMetadata = {
      v: 2,
      alg: SODIUM_ATTACHMENT_ALG,
      encryptedSize: encryptedByteLength,
      chunkSize,
      totalChunks,
      header: bytesToBase64(header),
      aad: bytesToBase64(streamAad),
      encryptedMetadata,
      wrappedKey,
      chunks: [{ index: 0, encryptedSize: encryptedByteLength }],
      encryptedContentSha256: digestHex,
    };

    const concatenated = new Uint8Array(encryptedByteLength);
    let offset = 0;
    for (const part of encryptedParts) {
      concatenated.set(part, offset);
      offset += part.byteLength;
    }

    // encrypt.lu share mode: typed octet-stream Blob (browser may set Content-Type;
    // we still omit a manual Content-Type request header on the XHR).
    const blob = new Blob([uint8ArrayToExactArrayBuffer(concatenated)], {
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
        frameCount,
        fileBytes: file.size,
        encryptedBytes: encryptedByteLength,
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
  attachmentIndex = 0,
): Promise<SodiumAttachmentMetadata> {
  if (usesSingleBlobAttachmentUpload(file.size)) {
    const { metadata, blob, sha256: digestHex } = await encryptFileToSodiumBlob(
      file,
      contentKey,
      metadataKey,
      noteId,
      onProgress,
      attachmentIndex,
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
  const reportProgress = (
    phase: AttachmentPipelineProgress["phase"],
    completedChunks: number,
  ) => {
    onProgress?.({
      phase,
      completedChunks,
      totalChunks,
      ratio: totalChunks > 0 ? completedChunks / totalChunks : 1,
    });
  };
  reportProgress("encrypt", 0);
  const streamAad = jsonAadBytes({
    v: 1,
    purpose: "privatenote-attachment-stream",
    alg: SODIUM_ATTACHMENT_ALG,
    noteId,
    chunkSize,
    totalChunks,
    attachmentIndex,
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
    attachmentIndex,
  );
  const fileKey = sodium.crypto_secretstream_xchacha20poly1305_keygen();
  const { state, header } = sodium.crypto_secretstream_xchacha20poly1305_init_push(fileKey);
  const wrappedKey = await wrapFileKey(fileKey, contentKey, noteId, streamAad, attachmentIndex);
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
  /**
   * 0–1 overall across download + decrypt (preferred for a single linear bar).
   * Download is weighted ahead of decrypt so the bar does not sit at 0% while
   * fetching, then slam through decrypt (especially noticeable on Safari).
   */
  ratio?: number;
};

/** Fraction of the overall bar reserved for network fetch + ArrayBuffer copy. */
const DECRYPT_DOWNLOAD_PROGRESS_SHARE = 0.58;

async function yieldForDecryptProgressPaint(): Promise<void> {
  // Double-rAF so React can commit + the browser can paint before the next
  // crypto frame. Single rAF is often insufficient on Safari under load.
  await new Promise<void>((resolve) => {
    if (typeof requestAnimationFrame === "function") {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => resolve());
      });
    } else {
      globalThis.setTimeout(resolve, 0);
    }
  });
}

/**
 * Advance a 0–1 ratio linearly over an ETA while `work` runs (Safari-friendly
 * when the browser gives no download/decrypt byte events). Caps at 0.95 until
 * completion so a slow fetch does not look "done" early.
 */
async function withEstimatedRatioProgress<T>(
  expectedBytes: number,
  onRatio: (ratio: number) => void,
  work: () => Promise<T>,
  options?: { bytesPerSec?: number },
): Promise<T> {
  const bytes = Math.max(0, expectedBytes);
  if (!Number.isFinite(bytes) || bytes <= 0) {
    onRatio(0);
    const result = await work();
    onRatio(1);
    return result;
  }

  const startedAt = typeof performance !== "undefined" ? performance.now() : Date.now();
  const assumedBytesPerSec =
    typeof options?.bytesPerSec === "number" && options.bytesPerSec > 0
      ? options.bytesPerSec
      : isSafariBrowser()
        ? 4 * 1024 * 1024
        : 10 * 1024 * 1024;
  const etaSec = Math.max(0.6, bytes / assumedBytesPerSec);
  let lastRatio = 0;
  const tick = () => {
    const now = typeof performance !== "undefined" ? performance.now() : Date.now();
    const elapsedSec = Math.max(0, (now - startedAt) / 1000);
    const next = Math.min(0.95, elapsedSec / etaSec);
    if (next <= lastRatio) return;
    lastRatio = next;
    onRatio(next);
  };
  tick();
  const timer = globalThis.setInterval(tick, 100);
  try {
    const result = await work();
    onRatio(1);
    return result;
  } finally {
    globalThis.clearInterval(timer);
  }
}

function clampUnit(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function mapDownloadRatio(chunkIndex: number, totalChunks: number, withinChunk: number): number {
  const total = Math.max(1, totalChunks);
  const chunkShare = 1 / total;
  const base = chunkIndex / total;
  return clampUnit((base + chunkShare * clampUnit(withinChunk)) * DECRYPT_DOWNLOAD_PROGRESS_SHARE);
}

function mapDecryptRatio(chunkIndex: number, totalChunks: number, withinChunk: number): number {
  const total = Math.max(1, totalChunks);
  const chunkShare = 1 / total;
  const base = chunkIndex / total;
  const decryptShare = 1 - DECRYPT_DOWNLOAD_PROGRESS_SHARE;
  return clampUnit(
    DECRYPT_DOWNLOAD_PROGRESS_SHARE + (base + chunkShare * clampUnit(withinChunk)) * decryptShare,
  );
}

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
  const maxFrameEncrypted = Math.max(1, attachment.chunkSize) + 17;

  const reportProgress = async (
    phase: AttachmentDecryptProgress["phase"],
    completedChunks: number,
    ratio: number,
    yieldPaint: boolean,
  ) => {
    onProgress?.({
      phase,
      completedChunks,
      totalChunks,
      ratio: clampUnit(ratio),
    });
    if (yieldPaint) {
      await yieldForDecryptProgressPaint();
    }
  };

  try {
    for (let index = 0; index < totalChunks; index += 1) {
      const expectedEncryptedBytes =
        attachment.chunks?.[index]?.encryptedSize ??
        (totalChunks === 1 && typeof attachment.encryptedSize === "number"
          ? attachment.encryptedSize
          : Math.max(1, attachment.chunkSize) + 17);

      let downloadFloor = mapDownloadRatio(index, totalChunks, 0);
      const encryptedChunk = await withEstimatedRatioProgress(
        expectedEncryptedBytes,
        (within) => {
          const next = Math.max(downloadFloor, mapDownloadRatio(index, totalChunks, within));
          downloadFloor = next;
          onProgress?.({
            phase: "download",
            completedChunks: index,
            totalChunks,
            ratio: next,
          });
        },
        () => getChunk(index),
      );

      await reportProgress(
        "download",
        index,
        Math.max(downloadFloor, mapDownloadRatio(index, totalChunks, 1)),
        true,
      );

      // Single HTTP blob may contain multiple secretstream frames (progress-sized
      // encrypt). Older notes used one frame for the whole file (chunkSize ≈ plaintext).
      if (totalChunks === 1 && encryptedChunk.byteLength > maxFrameEncrypted) {
        let offset = 0;
        while (offset < encryptedChunk.byteLength) {
          const remaining = encryptedChunk.byteLength - offset;
          const frameLen = remaining > maxFrameEncrypted ? maxFrameEncrypted : remaining;
          const frame = encryptedChunk.subarray(offset, offset + frameLen);
          const result = sodium.crypto_secretstream_xchacha20poly1305_pull(state, frame, aad);
          if (!result) {
            throw new Error("Attachment chunk authentication failed");
          }
          const isLastFrame = offset + frameLen >= encryptedChunk.byteLength;
          const expectedTag = isLastFrame
            ? sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL
            : sodium.crypto_secretstream_xchacha20poly1305_TAG_MESSAGE;
          if (result.tag !== expectedTag) {
            throw new Error("Attachment chunk sequence is invalid");
          }
          plaintextChunks.push(result.message);
          offset += frameLen;
          const within = offset / encryptedChunk.byteLength;
          await reportProgress(
            "decrypt",
            within >= 1 ? 1 : 0,
            mapDecryptRatio(0, 1, within),
            true,
          );
        }
      } else {
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
        const completed = index + 1;
        await reportProgress(
          "decrypt",
          completed,
          mapDecryptRatio(index, totalChunks, 1),
          true,
        );
      }
    }

    await reportProgress("decrypt", totalChunks, 1, false);
  } finally {
    fileKey.fill(0);
  }

  return plaintextChunks;
}
