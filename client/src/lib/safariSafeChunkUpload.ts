/**
 * Attachment upload policy.
 *
 * Chrome (encrypt.lu share-mode):
 *   Encrypt → one ciphertext Blob → one PUT to the upload relay (fetch + Bearer).
 *   Fallbacks: PUT + query token, POST + query token. One retry after ~1.8s.
 *
 * Safari:
 *   WebKit aborts multi‑MiB body-bearing XHRs (status 0 / "Load failed") even to
 *   same-site upload-staging.privatenote.ai / upload.privatenote.ai. Use ~1 MiB
 *   headerless POSTs with the capability token in the query string.
 *
 * Relays: production upload.privatenote.ai · staging upload-staging.privatenote.ai
 * Prefer same-site SPA hosts (privatenote.ai / premium.privatenote.ai).
 */

/** One secretstream frame ABYTES overhead when Chrome uses a single Blob. */
export const SINGLE_BLOB_SECRETSTREAM_ABYTES = 17;

/** Safari plaintext bytes per authenticated frame / HTTP body. */
export const SAFARI_ATTACHMENT_CHUNK_BYTES = 1024 * 1024;
export const DEFAULT_ATTACHMENT_CHUNK_BYTES = 4 * 1024 * 1024;

export const SAFARI_UPLOAD_CONCURRENCY = 1;
export const DEFAULT_UPLOAD_CONCURRENCY = 8;
export const SAFARI_UPLOAD_SETTLE_MS = 300;

export const SAFARI_UPLOAD_MAX_ROUNDS = 5;
export const SAFARI_UPLOAD_RETRY_DELAYS_MS = [400, 900, 1800, 3000] as const;
export const BLOB_UPLOAD_MAX_ROUNDS = 2;
export const BLOB_UPLOAD_RETRY_MS = 1800;

export const UPLOAD_TRANSPORT_FAILURE_MESSAGE =
  "Encrypted file upload failed before the server responded.";

export function isSafariBrowser(): boolean {
  if (typeof navigator === "undefined") {
    return false;
  }
  const ua = navigator.userAgent;
  return /Safari/i.test(ua) && !/Chrome|Chromium|CriOS|Edg|OPR|Firefox/i.test(ua);
}

/** Chrome/Firefox: one full ciphertext Blob. Safari: HTTP-chunked ~1 MiB frames. */
export function usesSingleBlobAttachmentUpload(): boolean {
  return !isSafariBrowser();
}

export function singleBlobEncryptedSizeUpperBound(plaintextBytes: number): number {
  return Math.max(0, plaintextBytes) + SINGLE_BLOB_SECRETSTREAM_ABYTES;
}

export function attachmentChunkSizeBytes(fileSize?: number): number {
  if (usesSingleBlobAttachmentUpload()) {
    if (typeof fileSize === "number" && Number.isFinite(fileSize) && fileSize > 0) {
      return fileSize;
    }
    return 1;
  }
  return SAFARI_ATTACHMENT_CHUNK_BYTES;
}

export function attachmentEncryptedSizeUpperBound(plaintextBytes: number): number {
  if (usesSingleBlobAttachmentUpload()) {
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

export function uploadMaxRounds(): number {
  return isSafariBrowser() ? SAFARI_UPLOAD_MAX_ROUNDS : BLOB_UPLOAD_MAX_ROUNDS;
}

export function uploadRetryDelayMs(completedRounds: number): number {
  if (isSafariBrowser()) {
    const index = Math.min(
      Math.max(completedRounds - 1, 0),
      SAFARI_UPLOAD_RETRY_DELAYS_MS.length - 1,
    );
    return SAFARI_UPLOAD_RETRY_DELAYS_MS[index]!;
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

/** Chrome primary: PUT + Bearer, no Content-Type (reservation supplies sizes). */
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

/**
 * Safari chunk shape: headerless POST, token + sizes in the query string.
 * Authorization / Content-Type would preflight and WebKit often loses the body.
 */
export const SAFARI_SIMPLE_CHUNK_UPLOAD_SHAPE = {
  method: "POST",
  tokenInQuery: true,
  metadataInQuery: true,
  omitContentType: true,
} as const;
