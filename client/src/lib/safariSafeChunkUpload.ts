/**
 * Safari-safe encrypted attachment upload policy.
 *
 * WebKit abandons body-bearing cross-origin requests before dispatch once they grow
 * past a few MiB: the XHR fails with status 0 / "Load failed" without the Worker ever
 * being invoked. It also cannot afford a CORS preflight on the upload path. Safari
 * uploads therefore stay inside one narrow envelope:
 *
 *   XHR + ~1 MiB Blob bodies · one request in flight · direct Worker origin ·
 *   capability token in the query string · no custom request headers.
 *
 * The envelope is defined here so the transport, the request-shape selection and the
 * encrypt pipeline cannot drift apart.
 */

/** Plaintext bytes per authenticated frame. Part of authenticated attachment metadata. */
export const SAFARI_ATTACHMENT_CHUNK_BYTES = 1024 * 1024;
export const DEFAULT_ATTACHMENT_CHUNK_BYTES = 4 * 1024 * 1024;

export const SAFARI_UPLOAD_CONCURRENCY = 1;
export const DEFAULT_UPLOAD_CONCURRENCY = 8;

/**
 * Quiet period between Safari chunks. Reusing a connection whose previous response is
 * still settling at the network-process edge resets it mid-upload.
 */
export const SAFARI_UPLOAD_SETTLE_MS = 300;

/**
 * Chunk uploads are hash-idempotent server-side, and Safari can lose only the response
 * of a chunk it already stored, so bounded retries are safe and much cheaper than making
 * the user restart the whole attachment.
 */
export const SAFARI_UPLOAD_MAX_ROUNDS = 5;
export const SAFARI_UPLOAD_RETRY_DELAYS_MS = [400, 900, 1800, 3000] as const;
export const DEFAULT_UPLOAD_MAX_ROUNDS = 2;
export const DEFAULT_UPLOAD_RETRY_MS = 1800;

export const UPLOAD_TRANSPORT_FAILURE_MESSAGE =
  "Encrypted file upload failed before the server responded.";

export function isSafariBrowser(): boolean {
  if (typeof navigator === "undefined") {
    return false;
  }
  const ua = navigator.userAgent;
  return /Safari/i.test(ua) && !/Chrome|Chromium|CriOS|Edg|OPR|Firefox/i.test(ua);
}

export function attachmentChunkSizeBytes(): number {
  return isSafariBrowser() ? SAFARI_ATTACHMENT_CHUNK_BYTES : DEFAULT_ATTACHMENT_CHUNK_BYTES;
}

export function attachmentUploadConcurrency(): number {
  return isSafariBrowser() ? SAFARI_UPLOAD_CONCURRENCY : DEFAULT_UPLOAD_CONCURRENCY;
}

export function attachmentUploadSettleMs(): number {
  return isSafariBrowser() ? SAFARI_UPLOAD_SETTLE_MS : 0;
}

export function uploadMaxRounds(): number {
  return isSafariBrowser() ? SAFARI_UPLOAD_MAX_ROUNDS : DEFAULT_UPLOAD_MAX_ROUNDS;
}

/** Delay before the retry round that follows `completedRounds` failures. */
export function uploadRetryDelayMs(completedRounds: number): number {
  if (isSafariBrowser()) {
    const index = Math.min(
      Math.max(completedRounds - 1, 0),
      SAFARI_UPLOAD_RETRY_DELAYS_MS.length - 1,
    );
    return SAFARI_UPLOAD_RETRY_DELAYS_MS[index]!;
  }
  return DEFAULT_UPLOAD_RETRY_MS * 2 ** Math.max(completedRounds - 1, 0);
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
 * Request shape Safari completes: a plain POST that carries the capability token and the
 * chunk metadata in the query string. An `Authorization` header or an
 * `application/octet-stream` Content-Type is not CORS-safelisted and would preflight
 * every chunk, which WebKit loses along with the body.
 *
 * Cookies are deliberately left to the route: the direct upload Worker is cookie-less,
 * while deployments without one still identify the reservation by `pn_client_id` when the
 * edge provides no client IP.
 */
export const SAFARI_SIMPLE_CHUNK_UPLOAD_SHAPE = {
  method: "POST",
  tokenInQuery: true,
  metadataInQuery: true,
  omitContentType: true,
} as const;
