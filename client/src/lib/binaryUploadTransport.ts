/**
 * Binary PUT transport — Safari fetch() can drop upload bodies and Blob-backed
 * XHR uploads can fail on WebKit. XHR with a Uint8Array body uses the most
 * reliable WebKit path for encrypted attachment chunks.
 */

const BROWSER_FORBIDDEN_REQUEST_HEADERS = new Set([
  "accept-charset",
  "access-control-request-headers",
  "access-control-request-method",
  "connection",
  "content-length",
  "cookie",
  "cookie2",
  "date",
  "dnt",
  "expect",
  "host",
  "keep-alive",
  "origin",
  "referer",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "via",
]);

/** Status codes that must not carry a Response body (Fetch spec). */
function responseBodyForStatus(status: number, text: string): string | null {
  if (status === 204 || status === 205 || status === 304) {
    return null;
  }
  return text;
}

export function isSafariBrowser(): boolean {
  if (typeof navigator === "undefined") {
    return false;
  }
  const ua = navigator.userAgent;
  return /Safari/i.test(ua) && !/Chrome|Chromium|CriOS|Edg|OPR|Firefox/i.test(ua);
}

/** WebKit "Load failed" / connection-lost style errors that warrant degrade + retry. */
export function isRetriableUploadTransportError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }
  return (
    error.message === "Load failed" ||
    error.message === "XHR network request failed" ||
    error.message === "Encrypted file upload failed before the server responded." ||
    error.name === "TypeError" ||
    /network connection was lost/i.test(error.message)
  );
}

function filterBrowserUploadHeaders(headers: Record<string, string>): Record<string, string> {
  const filtered: Record<string, string> = {};
  for (const [name, value] of Object.entries(headers)) {
    if (BROWSER_FORBIDDEN_REQUEST_HEADERS.has(name.toLowerCase())) {
      continue;
    }
    filtered[name] = value;
  }
  return filtered;
}

export type BinaryUploadProgress = {
  loaded: number;
  total: number;
};

function xhrBinaryRequest(
  url: string,
  method: string,
  body: XMLHttpRequestBodyInit,
  headers: Record<string, string>,
  credentials: RequestCredentials,
  onUploadProgress?: (progress: BinaryUploadProgress) => void,
): Promise<Response> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.withCredentials = credentials === "include";
    xhr.responseType = "text";
    for (const [name, value] of Object.entries(filterBrowserUploadHeaders(headers))) {
      xhr.setRequestHeader(name, value);
    }
    if (onUploadProgress) {
      xhr.upload.onprogress = (event) => {
        if (!event.lengthComputable || event.total <= 0) return;
        onUploadProgress({ loaded: event.loaded, total: event.total });
      };
    }
    xhr.onload = () => {
      try {
        resolve(
          new Response(responseBodyForStatus(xhr.status, xhr.responseText ?? ""), {
            status: xhr.status,
            statusText: xhr.statusText,
          }),
        );
      } catch (error) {
        reject(error);
      }
    };
    xhr.onerror = () => reject(new TypeError("Load failed"));
    xhr.onabort = () => reject(new TypeError("Load failed"));
    xhr.send(body);
  });
}

export async function sendBinaryHttpRequest(
  url: string,
  method: string,
  body: Blob | ArrayBuffer,
  headers: Record<string, string>,
  credentials: RequestCredentials,
  onUploadProgress?: (progress: BinaryUploadProgress) => void,
): Promise<Response> {
  const safeHeaders = filterBrowserUploadHeaders(headers);
  const isMutatingUpload = method === "PUT" || method === "POST";
  // Safari always uses XHR for reliability; also use XHR when byte progress is needed
  // (fetch has no upload progress API).
  if (isMutatingUpload && (isSafariBrowser() || onUploadProgress)) {
    // Prefer ArrayBufferView — browsers deprecate bare ArrayBuffer in XHR.send().
    const bytes =
      body instanceof ArrayBuffer ? new Uint8Array(body) : new Uint8Array(await body.arrayBuffer());
    return xhrBinaryRequest(url, method, bytes, safeHeaders, credentials, onUploadProgress);
  }
  const fetchBody = body instanceof ArrayBuffer ? body : body;
  return fetch(url, {
    method,
    headers: safeHeaders,
    body: fetchBody,
    credentials,
  });
}

export function bodyInitToUploadBlob(body: BodyInit): Blob | null {
  if (body instanceof Blob) {
    return body;
  }
  if (body instanceof ArrayBuffer) {
    return new Blob([body], { type: "application/octet-stream" });
  }
  if (ArrayBuffer.isView(body)) {
    const view = body as ArrayBufferView;
    const copy = new Uint8Array(view.byteLength);
    copy.set(new Uint8Array(view.buffer, view.byteOffset, view.byteLength));
    return new Blob([copy.buffer], { type: "application/octet-stream" });
  }
  return null;
}

/** Exact ArrayBuffer for XHR upload — avoids an extra Blob round-trip on Safari/WebKit. */
export function uint8ArrayToUploadArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  if (bytes.byteOffset === 0 && bytes.byteLength === bytes.buffer.byteLength) {
    return bytes.buffer as ArrayBuffer;
  }
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return copy.buffer;
}

export function bodyInitToUploadArrayBuffer(body: BodyInit): ArrayBuffer | null {
  if (body instanceof ArrayBuffer) {
    return body;
  }
  if (ArrayBuffer.isView(body)) {
    return uint8ArrayToUploadArrayBuffer(new Uint8Array(body.buffer, body.byteOffset, body.byteLength));
  }
  return null;
}
