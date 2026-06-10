import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { noteUploadAuthorizationHeader } from "@shared/noteFileUploadAuth";
import { hasPagesSameOriginApiProxy } from "@shared/pagesAppHosts";

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

function isCrossOriginApiUrl(fullUrl: string): boolean {
  if (typeof window === "undefined" || fullUrl.startsWith("/")) {
    return false;
  }
  try {
    return new URL(fullUrl).origin !== window.location.origin;
  } catch {
    return false;
  }
}

/** File chunk PUTs use the same URL routing as JSON API calls (Pages /api proxy when on Pages). */
function getBinaryUploadUrl(url: string): string {
  return getApiUrl(url);
}

export function getFileUploadTargetLabel(): string {
  if (typeof window !== "undefined" && hasPagesSameOriginApiProxy(window.location.hostname)) {
    return `${window.location.origin}/api (Pages proxy)`;
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

export function logFileUpload(level: "info" | "warn" | "error", message: string, details: Record<string, unknown>): void {
  const payload = JSON.stringify(details);
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

function binaryRequestBodyBytes(body: BodyInit): number | null {
  if (body instanceof ArrayBuffer) return body.byteLength;
  if (ArrayBuffer.isView(body)) return body.byteLength;
  if (body instanceof Blob) return body.size;
  return null;
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

export async function apiBinaryRequest<T = any>(
  url: string,
  method: string,
  body: BodyInit,
  headers: Record<string, string> = {},
  options: { uploadToken?: string } = {},
): Promise<T> {
  const fullUrl = getBinaryUploadUrl(url);
  const bodyBytes = binaryRequestBodyBytes(body);
  const requestHeaders = { ...headers };
  const isCrossOrigin = isCrossOriginApiUrl(fullUrl);
  let credentials: RequestCredentials = "include";
  if (options.uploadToken) {
    requestHeaders.Authorization = noteUploadAuthorizationHeader(options.uploadToken);
    if (isCrossOrigin) {
      credentials = "omit";
    }
  }
  const declaredChunkSize = Number(headers["x-file-chunk-encrypted-size"] ?? NaN);
  const uploadRoute = isCrossOrigin
    ? "direct-worker"
    : typeof window !== "undefined" && hasPagesSameOriginApiProxy(window.location.hostname)
      ? "pages-proxy"
      : "same-origin";
  const logBase = {
    url: fullUrl,
    uploadRoute,
    usesUploadToken: Boolean(options.uploadToken),
    method,
    bodyBytes,
    declaredChunkSize: Number.isFinite(declaredChunkSize) ? declaredChunkSize : null,
    chunkSizeMismatch:
      Number.isFinite(declaredChunkSize) && bodyBytes != null
        ? declaredChunkSize !== bodyBytes
        : null,
    plaintextSize: headers["x-file-plaintext-size"] ?? null,
    encryptedTotalSize: headers["x-file-encrypted-size"] ?? null,
  };
  const startedAt = performance.now();

  logFileUpload("info", "request start", logBase);

  try {
    const res = await fetch(fullUrl, {
      method,
      headers: requestHeaders,
      body,
      credentials,
    });
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
    const elapsedMs = Math.round(performance.now() - startedAt);
    const errorDetails = formatBinaryRequestError(error);
    logFileUpload("error", "request failed", {
      ...logBase,
      elapsedMs,
      online: typeof navigator !== "undefined" ? navigator.onLine : null,
      ...errorDetails,
    });
    if (error instanceof ApiRequestError) {
      throw error;
    }
    const message = error instanceof Error && error.message ? error.message : "Upload failed";
    throw new Error(
      message === "Load failed"
        ? "Encrypted file upload failed before the server responded."
        : message,
    );
  }
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
