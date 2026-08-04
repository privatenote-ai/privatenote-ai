/**
 * Attachment upload policy — Chrome + Safari to the upload relay.
 *
 * Chrome: single Blob PUT works on this hop.
 * Safari: same-site single PUT still aborts (~200–1400ms, status 0) for large
 * bodies (observed ~30–77 MiB); use few serial ~4 MiB PUTs above
 * SAFARI_SINGLE_BLOB_MAX_BYTES. Chunking stays Safari-only.
 *
 * Relays: upload.privatenote.ai / upload-staging.privatenote.ai
 */

/** One secretstream frame ABYTES overhead. */
export const SINGLE_BLOB_SECRETSTREAM_ABYTES = 17;

/**
 * Safari-only. Chrome keeps one Blob. Revisit when Safari same-site single PUT
 * is stable again on upload[-staging].privatenote.ai for multi‑tens‑of‑MiB files.
 */
export const SAFARI_CHUNKING_ENABLED = true;

/** Safari plaintext bytes per frame when chunking. */
export const SAFARI_ATTACHMENT_CHUNK_BYTES = 4 * 1024 * 1024;

/** Safari stays on one Blob at or below this plaintext size. */
export const SAFARI_SINGLE_BLOB_MAX_BYTES = 6 * 1024 * 1024;

/** @deprecated Prefer getAttachmentChunkSizeBytes(file.size). Kept for imports. */
export const DEFAULT_ATTACHMENT_CHUNK_BYTES = SAFARI_SINGLE_BLOB_MAX_BYTES;

export const SAFARI_UPLOAD_CONCURRENCY = 1;
export const DEFAULT_UPLOAD_CONCURRENCY = 8;
export const SAFARI_UPLOAD_SETTLE_MS = 300;
export const SAFARI_CHUNK_UPLOAD_MAX_ROUNDS = 5;
export const SAFARI_CHUNK_UPLOAD_RETRY_DELAYS_MS = [400, 900, 1800, 3000] as const;

/** encrypt.lu Safari single PUT: two attempts, ~1.8s between. */
export const BLOB_UPLOAD_MAX_ROUNDS = 2;
export const BLOB_UPLOAD_RETRY_MS = 1800;

export const UPLOAD_TRANSPORT_FAILURE_MESSAGE =
  "Encrypted file upload failed before the server responded.";

/** Test-only override for multi-chunk crypto coverage. */
let safariChunkingForTests: boolean | null = null;

export function setSafariChunkingEnabledForTests(enabled: boolean | null): void {
  safariChunkingForTests = enabled;
}

function safariChunkingActive(): boolean {
  if (safariChunkingForTests !== null) {
    return safariChunkingForTests;
  }
  return SAFARI_CHUNKING_ENABLED;
}

export function isSafariBrowser(): boolean {
  if (typeof navigator === "undefined") {
    return false;
  }
  const ua = navigator.userAgent || "";
  return /Safari/i.test(ua) && !/Chrome|Chromium|CriOS|Edg|OPR|Firefox/i.test(ua);
}

/**
 * Prefer encrypt.lu single Blob always. Chunk path only when temporary
 * Safari chunking is explicitly enabled and the file exceeds the cap.
 */
export function usesSingleBlobAttachmentUpload(fileSize?: number): boolean {
  if (!isSafariBrowser() || !safariChunkingActive()) {
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

/** Temporary large-file shapes (only if SAFARI_CHUNKING_ENABLED). */
export const SAFARI_LARGE_CHUNK_UPLOAD_SHAPES = [
  // Query-token only — Bearer+CORS preflight has aborted Safari bodies on this hop.
  BLOB_UPLOAD_PUT_QUERY,
] as const;
