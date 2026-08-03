/**
 * Attachment upload policy (encrypt.lu Safari single-PUT recipe).
 *
 * Chrome / non-Safari:
 *   Encrypt → one ciphertext Blob → one PUT to the upload relay.
 *
 * Safari (same-site page + upload host, XHR only, never Pages proxy):
 *   Prefer one XHR PUT of the full Blob (Bearer, then query-token fallback).
 *   If plaintext exceeds SAFARI_SINGLE_BLOB_MAX_BYTES (~6 MiB) and single PUT
 *   is unsafe, use a few serial ~4 MiB HTTP chunks — never many 1 MiB POSTs.
 *
 * Relays: upload.privatenote.ai / upload-staging.privatenote.ai
 * Prefer same-site SPA hosts (privatenote.ai / premium.privatenote.ai).
 * *.pages.dev → upload-*.privatenote.ai is cross-site; not this recipe.
 */

/** One secretstream frame ABYTES overhead. */
export const SINGLE_BLOB_SECRETSTREAM_ABYTES = 17;

/**
 * Safari plaintext bytes per authenticated frame / HTTP body when chunking.
 * Recipe hybrid: few 4–8 MiB serial chunks (not many 1 MiB bodies).
 */
export const SAFARI_ATTACHMENT_CHUNK_BYTES = 4 * 1024 * 1024;

/**
 * Above this plaintext size, Safari uses few large HTTP chunks.
 * Recipe: single PUT under ~6–8 MiB; cliff diagnosed around ~20+ MiB.
 */
export const SAFARI_SINGLE_BLOB_MAX_BYTES = 6 * 1024 * 1024;

/** @deprecated Prefer getAttachmentChunkSizeBytes(file.size). Kept for imports. */
export const DEFAULT_ATTACHMENT_CHUNK_BYTES = SAFARI_SINGLE_BLOB_MAX_BYTES;

export const SAFARI_UPLOAD_CONCURRENCY = 1;
export const DEFAULT_UPLOAD_CONCURRENCY = 8;
export const SAFARI_UPLOAD_SETTLE_MS = 300;
/** Extra rounds only when Safari is on the large-file chunk path. */
export const SAFARI_CHUNK_UPLOAD_MAX_ROUNDS = 5;
export const SAFARI_CHUNK_UPLOAD_RETRY_DELAYS_MS = [400, 900, 1800, 3000] as const;

/** encrypt.lu Safari single PUT: two attempts, ~1.8s between. */
export const BLOB_UPLOAD_MAX_ROUNDS = 2;
export const BLOB_UPLOAD_RETRY_MS = 1800;

export const UPLOAD_TRANSPORT_FAILURE_MESSAGE =
  "Encrypted file upload failed before the server responded.";

export function isSafariBrowser(): boolean {
  if (typeof navigator === "undefined") {
    return false;
  }
  const ua = navigator.userAgent || "";
  return /Safari/i.test(ua) && !/Chrome|Chromium|CriOS|Edg|OPR|Firefox/i.test(ua);
}

/** Chrome: always one Blob. Safari: one Blob only while under the size cap. */
export function usesSingleBlobAttachmentUpload(fileSize?: number): boolean {
  if (!isSafariBrowser()) {
    return true;
  }
  if (typeof fileSize !== "number" || !Number.isFinite(fileSize) || fileSize < 0) {
    return true;
  }
  return fileSize <= SAFARI_SINGLE_BLOB_MAX_BYTES;
}

export function singleBlobEncryptedSizeUpperBound(plaintextBytes: number): number {
  return Math.max(0, plaintextBytes) + SINGLE_BLOB_SECRETSTREAM_ABYTES;
}

export function attachmentChunkSizeBytes(fileSize?: number): number {
  if (usesSingleBlobAttachmentUpload(fileSize)) {
    if (typeof fileSize === "number" && Number.isFinite(fileSize) && fileSize > 0) {
      return fileSize;
    }
    return 1;
  }
  return SAFARI_ATTACHMENT_CHUNK_BYTES;
}

export function attachmentEncryptedSizeUpperBound(plaintextBytes: number): number {
  if (usesSingleBlobAttachmentUpload(plaintextBytes)) {
    return singleBlobEncryptedSizeUpperBound(plaintextBytes);
  }
  const frames = Math.max(1, Math.ceil(Math.max(0, plaintextBytes) / SAFARI_ATTACHMENT_CHUNK_BYTES));
  return Math.max(0, plaintextBytes) + frames * SINGLE_BLOB_SECRETSTREAM_ABYTES;
}

export function attachmentUploadConcurrency(): number {
  return isSafariBrowser() ? SAFARI_UPLOAD_CONCURRENCY : DEFAULT_UPLOAD_CONCURRENCY;
}

export function attachmentUploadSettleMs(): number {
  return isSafariBrowser() ? SAFARI_UPLOAD_SETTLE_MS : 0;
}

export function uploadMaxRounds(fileSize?: number): number {
  if (isSafariBrowser() && !usesSingleBlobAttachmentUpload(fileSize)) {
    return SAFARI_CHUNK_UPLOAD_MAX_ROUNDS;
  }
  return BLOB_UPLOAD_MAX_ROUNDS;
}

export function uploadRetryDelayMs(completedRounds: number, fileSize?: number): number {
  if (isSafariBrowser() && !usesSingleBlobAttachmentUpload(fileSize)) {
    const index = Math.min(
      Math.max(completedRounds - 1, 0),
      SAFARI_CHUNK_UPLOAD_RETRY_DELAYS_MS.length - 1,
    );
    return SAFARI_CHUNK_UPLOAD_RETRY_DELAYS_MS[index]!;
  }
  return BLOB_UPLOAD_RETRY_MS;
}

export function isRetriableUploadTransportError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }
  return (
    error.message === "Load failed" ||
    error.message === "XHR network request failed" ||
    error.message === "XHR request timed out" ||
    error.message === UPLOAD_TRANSPORT_FAILURE_MESSAGE ||
    error.name === "TypeError" ||
    /network connection was lost/i.test(error.message)
  );
}

/** encrypt.lu Safari primary: PUT + Bearer, no Content-Type. */
export const BLOB_UPLOAD_PUT_BEARER = {
  method: "PUT",
  omitContentType: true,
  omitMetadata: true,
} as const;

/** encrypt.lu Safari fallback: PUT + uploadToken in query, no Authorization. */
export const BLOB_UPLOAD_PUT_QUERY = {
  method: "PUT",
  tokenInQuery: true,
  metadataInQuery: true,
  omitContentType: true,
} as const;

export const BLOB_UPLOAD_POST_QUERY = {
  method: "POST",
  tokenInQuery: true,
  metadataInQuery: true,
  omitContentType: true,
} as const;

/**
 * Safari large-file fallback: same PUT shapes as single-Blob (few ~4 MiB bodies).
 * Prefer Bearer PUT, then query-token PUT — not many 1 MiB POSTs.
 */
export const SAFARI_LARGE_CHUNK_UPLOAD_SHAPES = [
  BLOB_UPLOAD_PUT_BEARER,
  BLOB_UPLOAD_PUT_QUERY,
] as const;
