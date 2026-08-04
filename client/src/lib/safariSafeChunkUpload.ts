/**
 * Attachment upload policy — WORKING COPY (premium / staging verified).
 *
 * App: encrypt.lu-style single Blob PUT — XHR, Bearer primary, query fallback,
 * Blob type application/octet-stream, credentials off, one retry ~1.8s.
 * Chunking stays OFF (`SAFARI_CHUNKING_ENABLED = false`).
 *
 * Large ciphertext (≥ NOTE_FILE_DIRECT_R2_MIN_BYTES ≈ 90 MB): browser PUT goes
 * directly to R2 via S3-compatible presign (see client/src/lib/r2DirectUpload.ts).
 * That bypasses the Cloudflare CDN max request body on the upload Worker hop
 * (Free/Pro ~100 MB → 413), which is required for Premium’s 1 GB plan limit.
 *
 * Cloudflare (required for Worker-path Safari PUTs): HTTP/3 / QUIC aborted
 * Safari ~30 MiB PUTs with status 0 before the Worker. Fix: Speed → Protocol
 * Optimization → HTTP/3 Off (or strip Alt-Svc on upload-staging / upload hosts).
 * See `.cursor/rules/attachment-blob-upload.mdc` and docs/STAGING_BRANCHES.md.
 *
 * Relays: upload.privatenote.ai / upload-staging.privatenote.ai
 */

/** One secretstream frame ABYTES overhead. */
export const SINGLE_BLOB_SECRETSTREAM_ABYTES = 17;

/**
 * TEMPORARY. When true, Safari above SAFARI_SINGLE_BLOB_MAX_BYTES uses few
 * ~4 MiB serial PUTs. Keep false until prod same-site single PUT A/B fails
 * after CF/CORS deltas are ruled out.
 */
export const SAFARI_CHUNKING_ENABLED = false;

/** Safari plaintext bytes per frame when SAFARI_CHUNKING_ENABLED. */
export const SAFARI_ATTACHMENT_CHUNK_BYTES = 4 * 1024 * 1024;

/** Only used when SAFARI_CHUNKING_ENABLED. */
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

/** encrypt.lu primary: PUT + Authorization Bearer, no manual Content-Type. */
export const BLOB_UPLOAD_PUT_BEARER = {
  method: "PUT",
  tokenInQuery: false,
  omitMetadata: true,
  omitContentType: true,
} as const;

/** Client fallback only — Worker also accepts query uploadToken. */
export const BLOB_UPLOAD_PUT_QUERY = {
  method: "PUT",
  tokenInQuery: true,
  omitMetadata: true,
  omitContentType: true,
} as const;

export const BLOB_UPLOAD_POST_QUERY = {
  method: "POST",
  tokenInQuery: true,
  omitMetadata: true,
  omitContentType: true,
} as const;

/** Temporary large-file shapes (only if SAFARI_CHUNKING_ENABLED). */
export const SAFARI_LARGE_CHUNK_UPLOAD_SHAPES = [BLOB_UPLOAD_PUT_BEARER, BLOB_UPLOAD_PUT_QUERY] as const;
