import sodium from "libsodium-wrappers";
import { sha256 } from "@noble/hashes/sha2.js";
import { arrayBufferToBase64, base64ToUint8Array } from "@/utils/encryption";
import { isRetriableUploadTransportError, isSafariBrowser } from "@/lib/binaryUploadTransport";

/**
 * Plaintext bytes per chunk. 4 MiB cuts round trips on Chrome (concurrency 8) and
 * Safari (concurrency 2). Still ≤999 chunks for a 1 GB premium file.
 */
export const SODIUM_ATTACHMENT_CHUNK_SIZE_BYTES = 4 * 1024 * 1024;
export const SODIUM_ATTACHMENT_ALG = "libsodium-secretstream-xchacha20poly1305" as const;

/** Chunk size for the current browser — reserved for future per-browser tuning. */
export function getAttachmentChunkSizeBytes(): number {
  return SODIUM_ATTACHMENT_CHUNK_SIZE_BYTES;
}

/** Read smaller files into memory once — avoids dozens of slow File.slice() calls in Safari. */
const IN_MEMORY_FILE_READ_MAX_BYTES = 128 * 1024 * 1024;
/**
 * Safari/WebKit often aborts many concurrent body-bearing HTTP/2 requests. Start at 2;
 * degrade to 1 if a chunk hits a connection-lost style error. Chrome/Firefox can pipeline.
 */
const UPLOAD_CONCURRENCY_SAFARI = 2;
const UPLOAD_CONCURRENCY_SAFARI_FLOOR = 1;
const UPLOAD_CONCURRENCY_DEFAULT = 8;
const SAFARI_DEGRADE_RETRY_MS = 800;

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

export async function encryptFileToSodiumChunks(
  file: File,
  contentKey: CryptoKey,
  metadataKey: CryptoKey,
  noteId: string,
  onChunk: (chunk: SodiumAttachmentChunk) => Promise<void>,
): Promise<SodiumAttachmentMetadata> {
  await sodium.ready;

  const chunkSize = getAttachmentChunkSizeBytes();
  const totalChunks = Math.max(1, Math.ceil(file.size / chunkSize));
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
  const fileBytes =
    file.size > 0 && file.size <= IN_MEMORY_FILE_READ_MAX_BYTES
      ? new Uint8Array(await file.arrayBuffer())
      : null;
  const safariUpload = isSafariBrowser();
  let uploadConcurrency = safariUpload ? UPLOAD_CONCURRENCY_SAFARI : UPLOAD_CONCURRENCY_DEFAULT;
  let degradedToSerial = false;
  const pipelineStartedAt = typeof performance !== "undefined" ? performance.now() : 0;
  let encryptCpuMs = 0;

  try {
    // Encrypt sequentially (secretstream is stateful), upload with limited concurrency.
    // Do NOT buffer all ciphertext first — that doubled peak memory and made a ~30s
    // Safari upload look like "slow encryption".
    const inFlight = new Set<Promise<void>>();

    const enqueueUpload = async (chunk: SodiumAttachmentChunk): Promise<void> => {
      while (inFlight.size >= uploadConcurrency) {
        // Ignore settle outcome here — failures propagate via Promise.all at the end
        // (or are recovered by the Safari degrade path below).
        await Promise.race(
          [...inFlight].map((pending) => pending.then(() => undefined, () => undefined)),
        );
      }
      let task!: Promise<void>;
      task = (async () => {
        try {
          await onChunk(chunk);
        } catch (error) {
          if (
            safariUpload &&
            uploadConcurrency > UPLOAD_CONCURRENCY_SAFARI_FLOOR &&
            isRetriableUploadTransportError(error)
          ) {
            uploadConcurrency = UPLOAD_CONCURRENCY_SAFARI_FLOOR;
            degradedToSerial = true;
            console.warn(
              "[FILE_UPLOAD] Safari upload degraded to serial after connection loss",
              JSON.stringify({ noteId, chunkIndex: chunk.index }),
            );
            // Wait for sibling PUTs only — not this task (would deadlock).
            const siblings = [...inFlight].filter((pending) => pending !== task);
            if (siblings.length > 0) {
              await Promise.allSettled(siblings);
            }
            await new Promise<void>((resolve) => {
              globalThis.setTimeout(resolve, SAFARI_DEGRADE_RETRY_MS);
            });
            await onChunk(chunk);
            return;
          }
          throw error;
        }
      })().finally(() => {
        inFlight.delete(task);
      });
      inFlight.add(task);
    };

    for (let index = 0; index < totalChunks; index += 1) {
      const start = index * chunkSize;
      const end = Math.min(file.size, start + chunkSize);
      const plaintext = fileBytes
        ? fileBytes.subarray(start, end)
        : new Uint8Array(await file.slice(start, end).arrayBuffer());
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
      // Copy off the WASM heap before the next push reuses it.
      const encryptedCopy = encryptedBytes.slice();
      if (typeof performance !== "undefined") {
        encryptCpuMs += performance.now() - encryptStartedAt;
      }
      encryptedSize += encryptedCopy.byteLength;
      contentHasher.update(encryptedCopy);
      chunks.push({ index, encryptedSize: encryptedCopy.byteLength });
      await enqueueUpload({
        index,
        encryptedSize: encryptedCopy.byteLength,
        encryptedBytes: encryptedCopy,
      });
      // Keep the UI responsive during long attachments.
      if (index % 4 === 3) {
        await new Promise<void>((resolve) => {
          globalThis.setTimeout(resolve, 0);
        });
      }
    }
    await Promise.all([...inFlight]);

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
        degradedToSerial,
        inMemoryRead: Boolean(fileBytes),
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
