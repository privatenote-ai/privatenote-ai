/**
 * Attachment upload policy — encrypt.lu share-mode shape.
 *
 * Both Chrome and Safari encrypt the file fully, collect one ciphertext Blob, then
 * upload it in a single HTTP request to the direct upload Worker. Only the transport
 * differs:
 *
 *   Chrome  → fetch PUT  + Authorization: Bearer
 *   Safari  → XHR  PUT  + Authorization: Bearer  (fetch can drop bodies after CORS preflight)
 *
 * Fallbacks (same Blob, same host): PUT + token in query, then POST + token in query.
 * One network retry after ~1.8s. No HTTP chunking.
 */

/** One secretstream frame for the whole file (ABYTES overhead). Bound into attachment AAD. */
export const SINGLE_BLOB_SECRETSTREAM_ABYTES = 17;

/** @deprecated Kept for older call sites; single-Blob mode does not HTTP-chunk. */
export const SAFARI_ATTACHMENT_CHUNK_BYTES = 1024 * 1024;
export const DEFAULT_ATTACHMENT_CHUNK_BYTES = 4 * 1024 * 1024;

export const UPLOAD_TRANSPORT_FAILURE_MESSAGE =
  "Encrypted file upload failed before the server responded.";

/** Primary + one full retry round, matching encrypt.lu's ~1.8s network retry. */
export const BLOB_UPLOAD_MAX_ROUNDS = 2;
export const BLOB_UPLOAD_RETRY_MS = 1800;

export function isSafariBrowser(): boolean {
  if (typeof navigator === "undefined") {
    return false;
  }
  const ua = navigator.userAgent;
  return /Safari/i.test(ua) && !/Chrome|Chromium|CriOS|Edg|OPR|Firefox/i.test(ua);
}

/** Exact ciphertext bytes for a single secretstream frame covering `plaintextBytes`. */
export function singleBlobEncryptedSizeUpperBound(plaintextBytes: number): number {
  return Math.max(0, plaintextBytes) + SINGLE_BLOB_SECRETSTREAM_ABYTES;
}

/**
 * Authenticated frame size recorded in attachment metadata. Single-Blob mode uses the
 * full plaintext length so totalChunks stays 1 (empty files use 1).
 */
export function attachmentChunkSizeBytes(fileSize?: number): number {
  if (typeof fileSize === "number" && Number.isFinite(fileSize) && fileSize > 0) {
    return fileSize;
  }
  return 1;
}

export function uploadMaxRounds(): number {
  return BLOB_UPLOAD_MAX_ROUNDS;
}

/** Delay before the retry round that follows `completedRounds` failures. */
export function uploadRetryDelayMs(_completedRounds: number): number {
  return BLOB_UPLOAD_RETRY_MS;
}

/**
 * WebKit "Load failed" / connection-lost style failures. These never reached a Worker
 * response, so they are the only errors worth retrying as a transport problem.
 */
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

/**
 * encrypt.lu primary shape: PUT the full Blob with a Bearer capability token and no
 * Content-Type (typed Blobs / octet-stream preflight the request). Size metadata is
 * omitted so the Worker uses the reservation recorded at /api/notes/reserve.
 */
export const BLOB_UPLOAD_PUT_BEARER = {
  method: "PUT",
  omitContentType: true,
  omitMetadata: true,
} as const;

/** Fallback when Bearer/CORS fails: capability token + sizes in the query string. */
export const BLOB_UPLOAD_PUT_QUERY = {
  method: "PUT",
  tokenInQuery: true,
  metadataInQuery: true,
  omitContentType: true,
} as const;

/** Final fallback — some edges accept POST bodies more reliably than PUT. */
export const BLOB_UPLOAD_POST_QUERY = {
  method: "POST",
  tokenInQuery: true,
  metadataInQuery: true,
  omitContentType: true,
} as const;

/** @deprecated Use BLOB_UPLOAD_POST_QUERY — name kept for transitional imports. */
export const SAFARI_SIMPLE_CHUNK_UPLOAD_SHAPE = BLOB_UPLOAD_POST_QUERY;
