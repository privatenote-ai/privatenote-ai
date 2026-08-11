import { QueryClient, QueryFunction } from "@tanstack/react-query";
import {
  apiWorkerOriginForAppHostname,
  uploadWorkerOriginForAppHostname,
} from "@shared/apiWorkerOrigin";
import {
  NOTE_UPLOAD_QUERY_PARAM,
  noteUploadAuthorizationHeader,
} from "@shared/noteFileUploadAuth";
import { hasPagesSameOriginApiProxy } from "@shared/pagesAppHosts";
import {
  bodyInitToUploadArrayBuffer,
  bodyInitToUploadBlob,
  sendBinaryHttpRequest,
  withEstimatedBinaryUploadProgress,
  type BinaryUploadProgress,
} from "@/lib/binaryUploadTransport";
import {
  isRetriableUploadTransportError,
  isSafariBrowser,
  BLOB_UPLOAD_PUT_BEARER,
  BLOB_UPLOAD_PUT_QUERY,
  SAFARI_LARGE_CHUNK_UPLOAD_SHAPES,
  SAFARI_UPLOAD_SETTLE_MS,
  UPLOAD_TRANSPORT_FAILURE_MESSAGE,
  uploadMaxRounds,
  uploadRetryDelayMs,
  usesSingleBlobAttachmentUpload,
} from "@/lib/safariSafeChunkUpload";

type BinaryUploadRoute = "direct-worker" | "same-origin";

type BinaryUploadAttempt = {
  url: string;
  uploadRoute: BinaryUploadRoute;
  credentials: RequestCredentials;
  method?: string;
  tokenInQuery?: boolean;
  metadataInQuery?: boolean;
  omitMetadata?: boolean;
  omitContentType?: boolean;
};

const UPLOAD_METADATA_HEADERS = [
  "x-file-plaintext-size",
  "x-file-encrypted-size",
  "x-file-chunk-encrypted-size",
  "x-file-chunk-sha256",
] as const;

// In local dev, prefer Vite's /api proxy unless VITE_API_URL points to localhost.
const RAW_API_BASE_URL = (import.meta.env.VITE_API_URL || "").trim();
const isLocalHost = (() => {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1";
})();
const hasSameOriginApiProxy = (() => {
  if (typeof window === "undefined") return false;
  // Cloudflare Pages: functions/api/[[path]].ts proxies to the Worker so session cookies stay first-party.
  // Includes premium / develop staging branches (see shared/pagesAppHosts.ts).
  return hasPagesSameOriginApiProxy(window.location.hostname);
})();
const isLocalApiTarget =
  RAW_API_BASE_URL.includes("localhost") || RAW_API_BASE_URL.includes("127.0.0.1");
const API_BASE_URL =
  hasSameOriginApiProxy
    ? ""
    : import.meta.env.DEV && isLocalHost && RAW_API_BASE_URL && !isLocalApiTarget
    ? ""
    : RAW_API_BASE_URL;

function getApiUrl(url: string): string {
  // If URL already starts with http, use it as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // Otherwise, prepend API base URL if configured
  if (API_BASE_URL) {
    // Ensure API_BASE_URL has protocol
    let baseUrl = API_BASE_URL;
    if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      console.warn(`[CLIENT] ⚠️ VITE_API_URL is missing protocol, adding https://`);
      baseUrl = `https://${baseUrl}`;
    }
    // Remove trailing slash from base URL and leading slash from path
    baseUrl = baseUrl.replace(/\/$/, '');
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return `${baseUrl}${cleanPath}`;
  }
  if (import.meta.env.DEV && isLocalHost && RAW_API_BASE_URL && !isLocalApiTarget) {
    console.warn(
      `[CLIENT] ⚠️ Ignoring non-local VITE_API_URL in local dev; using /api proxy instead.`,
    );
  }
  // If no API_BASE_URL, use relative URL
  return url;
}

function normalizeApiPath(url: string): string {
  return url.startsWith("/") ? url : `/${url}`;
}

function getDirectWorkerUploadUrl(url: string): string {
  const hostname = typeof window === "undefined" ? "" : window.location.hostname;
  return `${uploadWorkerOriginForAppHostname(hostname)}${normalizeApiPath(url)}`;
}

function appendQuery(url: string, params: Record<string, string | undefined>): string {
  const [base, hash = ""] = url.split("#", 2);
  const [path, existingQuery = ""] = base!.split("?", 2);
  const query = new URLSearchParams(existingQuery);
  for (const [name, value] of Object.entries(params)) {
    if (value != null && value.length > 0) {
      query.set(name, value);
    }
  }
  const serialized = query.toString();
  return `${path}${serialized ? `?${serialized}` : ""}${hash ? `#${hash}` : ""}`;
}

function redactUploadUrlForLog(url: string): string {
  try {
    const parsed = new URL(url, window.location.origin);
    if (parsed.searchParams.has(NOTE_UPLOAD_QUERY_PARAM)) {
      parsed.searchParams.set(NOTE_UPLOAD_QUERY_PARAM, "[redacted]");
    }
    if (!/^https?:\/\//i.test(url)) {
      return `${parsed.pathname}${parsed.search}${parsed.hash}`;
    }
    return parsed.toString();
  } catch {
    return url.replace(new RegExp(`([?&]${NOTE_UPLOAD_QUERY_PARAM}=)[^&]+`, "g"), "$1[redacted]");
  }
}

function isAttachmentChunkUploadUrl(url: string): boolean {
  return /\/file\/chunks\/\d+(?:\?|$)/.test(url);
}

function getBinaryUploadAttempts(
  url: string,
  options: { uploadToken?: string; fileSize?: number } = {},
): BinaryUploadAttempt[] {
  // Binary bodies go to the dedicated upload relay (upload.privatenote.ai /
  // upload-staging.privatenote.ai) — same role as relay.encrypt.lu.
  const directUpload: BinaryUploadAttempt = hasSameOriginApiProxy
    ? { url: getDirectWorkerUploadUrl(url), uploadRoute: "direct-worker", credentials: "omit" }
    : { url: getApiUrl(url), uploadRoute: "same-origin", credentials: "include" };

  if (options.uploadToken) {
    // Chunk shapes only when SAFARI_CHUNKING_ENABLED (off — temporary escape hatch).
    if (isAttachmentChunkUploadUrl(url) || !usesSingleBlobAttachmentUpload(options.fileSize)) {
      return SAFARI_LARGE_CHUNK_UPLOAD_SHAPES.map((shape) => ({ ...directUpload, ...shape }));
    }
    // Match encrypt.lu: Bearer primary, query-token PUT as client fallback.
    return [
      { ...directUpload, ...BLOB_UPLOAD_PUT_BEARER },
      { ...directUpload, ...BLOB_UPLOAD_PUT_QUERY },
    ];
  }

  if (!hasSameOriginApiProxy) {
    return [directUpload];
  }

  const sameOrigin: BinaryUploadAttempt = {
    url: getApiUrl(url),
    uploadRoute: "same-origin",
    credentials: "include",
  };

  return [directUpload, sameOrigin];
}

export function getFileUploadTargetLabel(): string {
  if (typeof window !== "undefined" && hasPagesSameOriginApiProxy(window.location.hostname)) {
    return `${uploadWorkerOriginForAppHostname(window.location.hostname)} (upload Worker)`;
  }
  return RAW_API_BASE_URL || "(same-origin /api proxy)";
}

/** Thrown for non-2xx API responses; `bodyText` is always the raw response body (for structured client handling). */
export class ApiRequestError extends Error {
  readonly status: number;
  readonly bodyText: string;

  constructor(status: number, bodyText: string) {
    const safeMessage =
      import.meta.env.DEV ? `${status}: ${bodyText}` : `${status}: Request failed`;
    super(safeMessage);
    this.name = "ApiRequestError";
    this.status = status;
    this.bodyText = bodyText;
  }
}

/** Safari sometimes truncates the first body on a cold connection → server 400 size mismatch. */
function isRetriableSafariChunkUploadError(error: unknown): boolean {
  return (
    error instanceof ApiRequestError &&
    isSafariBrowser() &&
    error.status === 400 &&
    /File chunk size mismatch/i.test(error.bodyText)
  );
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new ApiRequestError(res.status, text);
  }
}

export async function apiRequest<T = any>(
  url: string,
  method: string = "GET",
  data?: unknown | undefined,
): Promise<T> {
  const fullUrl = getApiUrl(url);

  if (import.meta.env.DEV) {
    console.log(`[CLIENT] ========== API REQUEST ==========`);
    console.log(`[CLIENT] Original URL: ${url}`);
    console.log(`[CLIENT] API_BASE_URL: "${import.meta.env.VITE_API_URL || '(empty)'}"`);
    console.log(`[CLIENT] Full URL: ${fullUrl}`);
    console.log(`[CLIENT] Method: ${method}`);
  }

  // Warn if API URL might be incorrect in production
  if (import.meta.env.PROD && !import.meta.env.VITE_API_URL) {
    const currentHost = window.location.hostname;
    const isPagesDev = currentHost.includes('.pages.dev');
    
    if (isPagesDev && fullUrl.startsWith('http')) {
      console.warn(`[CLIENT] ⚠️ WARNING: VITE_API_URL is not set in production!`);
      console.warn(`[CLIENT] Requests are going to: ${fullUrl}`);
      console.warn(`[CLIENT] If this is a Pages deployment, set VITE_API_URL to your Worker URL`);
      console.warn(`[CLIENT] See FIX_405_ERROR.md for instructions`);
    }
  }
  if (import.meta.env.DEV) {
    console.log(`[CLIENT] Has data: ${!!data}`);
    if (data) {
      console.log(`[CLIENT] Data keys:`, Object.keys(data as Record<string, any>));
      console.log(`[CLIENT] Data preview:`, JSON.stringify(data).substring(0, 200));
    }
  }

  const headers: Record<string, string> = data ? { "Content-Type": "application/json" } : {};
  if (import.meta.env.DEV) {
    console.log(`[CLIENT] Request headers:`, headers);
  }

  try {
    const res = await fetch(fullUrl, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });

    const responseText = await res.text();
    if (import.meta.env.DEV) {
      console.log(`[CLIENT] Response status: ${res.status} ${res.statusText}`);
      console.log(
        `[CLIENT] Response headers:`,
        JSON.stringify(Object.fromEntries(res.headers.entries())),
      );
      console.log(`[CLIENT] Response body: ${responseText.substring(0, 500)}`);
    }
    
    // Recreate response for throwIfResNotOk
    const responseClone = new Response(responseText, {
      status: res.status,
      statusText: res.statusText,
      headers: res.headers
    });

    await throwIfResNotOk(responseClone);
    
    // Parse JSON from the text we already read
    return JSON.parse(responseText) as T;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error(`[CLIENT] ❌❌❌ API REQUEST ERROR ❌❌❌`);
      console.error(`[CLIENT] Error type: ${error?.constructor?.name || "Unknown"}`);
      console.error(
        `[CLIENT] Error message:`,
        error instanceof Error ? error.message : String(error),
      );
      console.error(`[CLIENT] Error stack:`, error instanceof Error ? error.stack : "No stack");
    }
    throw error;
  }
}

export async function apiUploadRequest<T = any>(
  url: string,
  body: Blob,
  method = "PUT",
): Promise<T> {
  const response = await fetch(getApiUrl(url), {
    method,
    body,
    headers: body.type ? { "Content-Type": body.type } : undefined,
    credentials: "include",
  });
  const responseText = await response.text();
  const responseClone = new Response(responseText, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
  await throwIfResNotOk(responseClone);
  return JSON.parse(responseText) as T;
}

function redactFileUploadDetailsForProduction(details: Record<string, unknown>): Record<string, unknown> {
  const allowedKeys = [
    "kind",
    "status",
    "message",
    "cause",
    "online",
    "elapsedMs",
    "uploadRoute",
    "method",
    "attempt",
    "attemptCount",
    "retryRound",
    "delayMs",
    "willRetry",
  ] as const;
  const redacted: Record<string, unknown> = {};
  for (const key of allowedKeys) {
    if (details[key] !== undefined) {
      redacted[key] = details[key];
    }
  }
  return redacted;
}

export function logFileUpload(level: "info" | "warn" | "error", message: string, details: Record<string, unknown>): void {
  const isDev = Boolean(import.meta.env?.DEV);
  if (level === "info" && !isDev) {
    return;
  }
  const payload = JSON.stringify(isDev ? details : redactFileUploadDetailsForProduction(details));
  if (level === "error") {
    console.error(`[FILE_UPLOAD] ${message}`, payload);
    return;
  }
  if (level === "warn") {
    console.warn(`[FILE_UPLOAD] ${message}`, payload);
    return;
  }
  console.info(`[FILE_UPLOAD] ${message}`, payload);
}


function formatBinaryRequestError(error: unknown): Record<string, unknown> {
  if (error instanceof ApiRequestError) {
    return {
      kind: "ApiRequestError",
      status: error.status,
      bodyPreview: error.bodyText.slice(0, 500),
    };
  }
  if (error instanceof Error) {
    const cause = (error as Error & { cause?: unknown }).cause;
    return {
      kind: error.name || "Error",
      message: error.message,
      ...(cause instanceof Error
        ? { cause: { name: cause.name, message: cause.message } }
        : cause != null
          ? { cause: String(cause) }
          : {}),
    };
  }
  return { kind: "unknown", value: String(error) };
}

function isBinaryUploadNetworkError(error: unknown): boolean {
  if (error instanceof ApiRequestError) {
    return false;
  }
  return isRetriableUploadTransportError(error);
}

function withoutHeaders(
  headers: Record<string, string>,
  names: readonly string[],
): Record<string, string> {
  const dropped = new Set(names.map((name) => name.toLowerCase()));
  return Object.fromEntries(
    Object.entries(headers).filter(([name]) => !dropped.has(name.toLowerCase())),
  );
}

/** Mirrors the retry control flow below so a recoverable attempt is not logged as an error. */
function binaryUploadWillRetry(
  error: unknown,
  round: number,
  attemptIndex: number,
  attemptCount: number,
  maxRounds: number,
): boolean {
  const hasNextRoute = attemptIndex < attemptCount - 1;
  const hasNextRound = round < maxRounds - 1;
  const retriable =
    isBinaryUploadNetworkError(error) ||
    isRetriableSafariChunkUploadError(error) ||
    (error instanceof ApiRequestError && (error.status >= 500 || error.status === 429));
  if (error instanceof ApiRequestError) {
    return retriable && (hasNextRoute || hasNextRound);
  }
  // Transport failures always fall through to the remaining route in this round.
  return hasNextRoute || (hasNextRound && retriable);
}

async function executeBinaryUploadAttempt(
  attempt: BinaryUploadAttempt,
  method: string,
  body: Blob | ArrayBuffer,
  requestHeaders: Record<string, string>,
  onUploadProgress?: (progress: BinaryUploadProgress) => void,
): Promise<Response> {
  return sendBinaryHttpRequest(
    attempt.url,
    method,
    body,
    requestHeaders,
    attempt.credentials,
    onUploadProgress,
  );
}

function resolveBinaryUploadBody(body: BodyInit): Blob | ArrayBuffer {
  // Prefer an untyped Blob — encrypt.lu share-mode and Safari XHR both send Blob bodies.
  if (body instanceof Blob) {
    return body.type ? new Blob([body]) : body;
  }
  const uploadBlob = bodyInitToUploadBlob(body);
  if (uploadBlob) {
    // encrypt.lu: Blob type application/octet-stream; do not set Content-Type via headers.
    if (uploadBlob.type === "application/octet-stream") {
      return uploadBlob;
    }
    return new Blob([uploadBlob], { type: "application/octet-stream" });
  }
  const arrayBuffer = bodyInitToUploadArrayBuffer(body);
  if (arrayBuffer) {
    return arrayBuffer;
  }
  throw new Error("Unsupported upload body type.");
}

export async function apiBinaryRequest<T = any>(
  url: string,
  method: string,
  body: BodyInit,
  headers: Record<string, string> = {},
  options: {
    uploadToken?: string;
    fileSize?: number;
    onUploadProgress?: (progress: BinaryUploadProgress) => void;
  } = {},
): Promise<T> {
  const uploadBody = resolveBinaryUploadBody(body);
  const bodyBytes = uploadBody instanceof ArrayBuffer ? uploadBody.byteLength : uploadBody.size;
  const declaredChunkSize = Number(headers["x-file-chunk-encrypted-size"] ?? NaN);
  const plaintextFromHeader = Number(headers["x-file-plaintext-size"] ?? NaN);
  const fileSize =
    typeof options.fileSize === "number" && Number.isFinite(options.fileSize)
      ? options.fileSize
      : Number.isFinite(plaintextFromHeader)
        ? plaintextFromHeader
        : undefined;
  const sharedLogBase = {
    usesUploadToken: Boolean(options.uploadToken),
    method,
    bodyBytes,
    declaredChunkSize: Number.isFinite(declaredChunkSize) ? declaredChunkSize : null,
    chunkSizeMismatch:
      Number.isFinite(declaredChunkSize) ? declaredChunkSize !== bodyBytes : null,
    plaintextSize: headers["x-file-plaintext-size"] ?? null,
    encryptedTotalSize: headers["x-file-encrypted-size"] ?? null,
    safariTransport: isSafariBrowser(),
    singleBlob: usesSingleBlobAttachmentUpload(fileSize),
  };
  const attempts = getBinaryUploadAttempts(url, { ...options, fileSize });
  const maxRounds = uploadMaxRounds(fileSize);
  let lastError: unknown = null;

  // encrypt.lu warms the relay before the Blob PUT. Await it so Safari does not
  // multiplex a large PUT on a brand-new connection alongside the warm-up GET.
  if (options.uploadToken && typeof window !== "undefined" && hasSameOriginApiProxy) {
    const relayOrigin = uploadWorkerOriginForAppHostname(window.location.hostname);
    try {
      await fetch(`${relayOrigin}/api/health`, {
        method: "GET",
        mode: "cors",
        credentials: "omit",
      });
    } catch {
      // Warm-up is best-effort; upload attempts still run.
    }
  }

  for (let round = 0; round < maxRounds; round += 1) {
    if (round > 0) {
      const status = lastError instanceof ApiRequestError ? lastError.status : 0;
      const retriable =
        isBinaryUploadNetworkError(lastError) ||
        isRetriableSafariChunkUploadError(lastError) ||
        status >= 500 ||
        status === 429;
      if (!retriable) {
        break;
      }
      // WebKit needs the connection to reset between tries. Keep Safari's
      // recovery bounded so a lost success response does not stall the file.
      const delayMs = uploadRetryDelayMs(round, fileSize);
      logFileUpload("warn", "network retry after delay", {
        ...sharedLogBase,
        delayMs,
        round: round + 1,
        safariChunkMismatchRetry: isRetriableSafariChunkUploadError(lastError),
        status: lastError instanceof ApiRequestError ? lastError.status : null,
      });
      await new Promise((resolve) => window.setTimeout(resolve, delayMs));
    }

    for (let attemptIndex = 0; attemptIndex < attempts.length; attemptIndex += 1) {
      const attempt = attempts[attemptIndex]!;
      let requestHeaders: Record<string, string> = { ...headers };
      if (attempt.metadataInQuery || attempt.omitMetadata) {
        requestHeaders = withoutHeaders(requestHeaders, UPLOAD_METADATA_HEADERS);
      }
      if (attempt.omitContentType) {
        requestHeaders = withoutHeaders(requestHeaders, ["content-type"]);
      }
      // encrypt.lu primary: Authorization Bearer. Query token is fallback only.
      if (options.uploadToken && !attempt.tokenInQuery) {
        requestHeaders.Authorization = noteUploadAuthorizationHeader(options.uploadToken);
      }
      const requestMethod = attempt.method ?? method;
      const requestUrl =
        options.uploadToken && attempt.tokenInQuery
          ? appendQuery(
              attempt.url,
              attempt.omitMetadata || !attempt.metadataInQuery
                ? { [NOTE_UPLOAD_QUERY_PARAM]: options.uploadToken }
                : {
                    [NOTE_UPLOAD_QUERY_PARAM]: options.uploadToken,
                    plaintextSize: headers["x-file-plaintext-size"],
                    encryptedSize: headers["x-file-encrypted-size"],
                    chunkEncryptedSize: headers["x-file-chunk-encrypted-size"],
                    chunkSha256: headers["x-file-chunk-sha256"],
                  },
            )
          : attempt.url;
      const logBase = {
        ...sharedLogBase,
        method: requestMethod,
        url: redactUploadUrlForLog(requestUrl),
        uploadRoute: attempt.uploadRoute,
        attempt: attemptIndex + 1,
        attemptCount: attempts.length,
        retryRound: round + 1,
      };
      const startedAt = performance.now();

      logFileUpload("info", "request start", logBase);

      try {
        const res = await withEstimatedBinaryUploadProgress(
          bodyBytes,
          options.onUploadProgress,
          () =>
            executeBinaryUploadAttempt(
              { ...attempt, url: requestUrl },
              requestMethod,
              uploadBody,
              requestHeaders,
              options.onUploadProgress,
            ),
          { enabled: isSafariBrowser() },
        );
        const responseText = await res.text();
        const elapsedMs = Math.round(performance.now() - startedAt);
        logFileUpload("info", "response received", {
          ...logBase,
          status: res.status,
          statusText: res.statusText,
          elapsedMs,
          responsePreview: responseText.slice(0, 300),
        });
        const responseClone = new Response(responseText, {
          status: res.status,
          statusText: res.statusText,
          headers: res.headers,
        });
        await throwIfResNotOk(responseClone);
        return JSON.parse(responseText) as T;
      } catch (error) {
        lastError = error;
        const elapsedMs = Math.round(performance.now() - startedAt);
        const errorDetails = formatBinaryRequestError(error);
        const willRetry = binaryUploadWillRetry(
          error,
          round,
          attemptIndex,
          attempts.length,
          maxRounds,
        );
        // A probe another route recovers is not a user-visible failure. Keep it out
        // of the production console so genuine upload errors stay readable.
        logFileUpload(
          willRetry ? "info" : "error",
          willRetry ? "request failed, falling back" : "request failed",
          {
            ...logBase,
            elapsedMs,
            online: typeof navigator !== "undefined" ? navigator.onLine : null,
            willRetry,
            ...errorDetails,
          },
        );
        if (willRetry && isSafariBrowser() && SAFARI_UPLOAD_SETTLE_MS > 0) {
          await new Promise((resolve) => window.setTimeout(resolve, SAFARI_UPLOAD_SETTLE_MS));
        }
        if (error instanceof ApiRequestError) {
          // Fall through to the next upload route on transient server failures
          // (e.g. concurrent quota race on direct-worker) and Safari size mismatches.
          const canTryNextRoute =
            attemptIndex < attempts.length - 1 &&
            (isRetriableSafariChunkUploadError(error) || error.status >= 500 || error.status === 429);
          if (canTryNextRoute) {
            continue;
          }
          if (isRetriableSafariChunkUploadError(error) || error.status >= 500 || error.status === 429) {
            break;
          }
          throw error;
        }
      }
    }
  }

  if (lastError instanceof ApiRequestError) {
    throw lastError;
  }
  const message = lastError instanceof Error && lastError.message ? lastError.message : "Upload failed";
  throw new Error(message === "Load failed" ? UPLOAD_TRANSPORT_FAILURE_MESSAGE : message);
}

export async function apiBlobRequest(
  url: string,
  method: string = "GET",
  headers: Record<string, string> = {},
): Promise<Blob> {
  const res = await fetch(getApiUrl(url), {
    method,
    headers,
    credentials: "include",
  });
  await throwIfResNotOk(res);
  return await res.blob();
}

type UnauthorizedBehavior = "returnNull" | "throw";

export function getQueryFn<T>(options: {
  on401: UnauthorizedBehavior;
}): QueryFunction<T> {
  const { on401: unauthorizedBehavior } = options;
  return async ({ queryKey }) => {
    const url = queryKey[0] as string;
    const fullUrl = getApiUrl(url);
    const res = await fetch(fullUrl, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null as T;
    }

    await throwIfResNotOk(res);
    return (await res.json()) as T;
  };
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
