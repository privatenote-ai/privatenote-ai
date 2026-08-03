/**
 * Attachment upload policy — encrypt.lu share-mode (single Blob, no HTTP chunks).
 *
 * Both Chrome and Safari encrypt the file fully, collect one ciphertext Blob, then
 * upload it once to the dedicated upload relay (not the Pages /api proxy):
 *
 *   Production → https://upload.privatenote.ai  (from privatenote.ai — same-site)
 *   Staging    → https://upload-staging.privatenote.ai
 *                Prefer https://premium.privatenote.ai (same-site).
 *                premium.privatenote-ai.pages.dev is cross-site and Safari may drop large bodies.
 *
 * Transport differs only:
 *   Chrome  → fetch PUT  + Authorization: Bearer
 *   Safari  → XHR  PUT  + Authorization: Bearer
 *
 * Fallbacks: PUT + query token, then POST + query token. One retry after ~1.8s.
 */

/** One secretstream frame ABYTES overhead. */
export const SINGLE_BLOB_SECRETSTREAM_ABYTES = 17;

export const UPLOAD_TRANSPORT_FAILURE_MESSAGE =
  "Encrypted file upload failed before the server responded.";

export const BLOB_UPLOAD_MAX_ROUNDS = 2;
export const BLOB_UPLOAD_RETRY_MS = 1800;

export function isSafariBrowser(): boolean {
  if (typeof navigator === "undefined") {
    return false;
  }
  const ua = navigator.userAgent;
  return /Safari/i.test(ua) && !/Chrome|Chromium|CriOS|Edg|OPR|Firefox/i.test(ua);
}

/** Always one full ciphertext Blob (no HTTP chunking). */
export function usesSingleBlobAttachmentUpload(): boolean {
  return true;
}

export function singleBlobEncryptedSizeUpperBound(plaintextBytes: number): number {
  return Math.max(0, plaintextBytes) + SINGLE_BLOB_SECRETSTREAM_ABYTES;
}

export function attachmentEncryptedSizeUpperBound(plaintextBytes: number): number {
  return singleBlobEncryptedSizeUpperBound(plaintextBytes);
}

/** Authenticated frame size in metadata = full plaintext (totalChunks stays 1). */
export function attachmentChunkSizeBytes(fileSize?: number): number {
  if (typeof fileSize === "number" && Number.isFinite(fileSize) && fileSize > 0) {
    return fileSize;
  }
  return 1;
}

export function uploadMaxRounds(): number {
  return BLOB_UPLOAD_MAX_ROUNDS;
}

export function uploadRetryDelayMs(_completedRounds: number): number {
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

export const BLOB_UPLOAD_PUT_BEARER = {
  method: "PUT",
  omitContentType: true,
  omitMetadata: true,
} as const;

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
