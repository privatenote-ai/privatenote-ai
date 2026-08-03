/**
 * Binary PUT/POST transport — encrypt.lu share-mode shape.
 *
 * Chrome uses fetch(Blob) for the primary PUT. Safari uses xhr.send(Blob) because
 * WebKit can drop fetch PUT bodies after a CORS preflight. Progress callbacks also
 * force XHR (fetch has no upload progress API); Safari never attaches upload.*
 * listeners because that plumbing can abort the request before dispatch.
 */

import { isSafariBrowser } from "@/lib/safariSafeChunkUpload";

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
    const startedAt = performance.now();
    const readyStateTransitions: Array<{ state: number; elapsedMs: number }> = [];
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    if (credentials === "include") {
      xhr.withCredentials = true;
    }
    for (const [name, value] of Object.entries(filterBrowserUploadHeaders(headers))) {
      xhr.setRequestHeader(name, value);
    }
    xhr.addEventListener("readystatechange", () => {
      readyStateTransitions.push({
        state: xhr.readyState,
        elapsedMs: Math.round(performance.now() - startedAt),
      });
    });
    // Match encrypt.lu's proven Safari request exactly: WebKit's upload-event
    // plumbing can fail before a body-bearing cross-origin request is dispatched.
    if (onUploadProgress && !isSafariBrowser()) {
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
    const rejectWithDiagnostic = (eventType: "error" | "abort" | "timeout") => {
      let target: { origin: string; pathname: string } | null = null;
      try {
        const parsed = new URL(url, window.location.origin);
        target = { origin: parsed.origin, pathname: parsed.pathname };
      } catch {
        // Keep malformed or sensitive URLs out of diagnostics.
      }
      const resource = performance.getEntriesByName(url).at(-1) as
        | PerformanceResourceTiming
        | undefined;
      console.error(
        "[SAFARI_XHR_DIAGNOSTIC]",
        JSON.stringify({
          eventType,
          target,
          method,
          elapsedMs: Math.round(performance.now() - startedAt),
          readyState: xhr.readyState,
          status: xhr.status,
          responseUrlPresent: Boolean(xhr.responseURL),
          bodyType: body instanceof Blob ? "Blob" : Object.prototype.toString.call(body),
          bodyBytes:
            body instanceof Blob
              ? body.size
              : body instanceof ArrayBuffer
                ? body.byteLength
                : null,
          blobType: body instanceof Blob ? body.type : null,
          requestHeaderNames: Object.keys(filterBrowserUploadHeaders(headers)).map((name) =>
            name.toLowerCase(),
          ),
          withCredentials: xhr.withCredentials,
          online: navigator.onLine,
          readyStateTransitions,
          resourceTiming: resource
            ? {
                duration: Math.round(resource.duration),
                transferSize: resource.transferSize,
                encodedBodySize: resource.encodedBodySize,
                decodedBodySize: resource.decodedBodySize,
                nextHopProtocol: resource.nextHopProtocol,
              }
            : null,
        }),
      );
      reject(new TypeError(eventType === "timeout" ? "XHR request timed out" : "Load failed"));
    };
    xhr.onerror = () => rejectWithDiagnostic("error");
    xhr.onabort = () => rejectWithDiagnostic("abort");
    xhr.ontimeout = () => rejectWithDiagnostic("timeout");
    xhr.send(body);
  });
}

/**
 * Safari's reliable WebKit path is xhr.send(Blob). encrypt.lu uses a Blob typed as
 * `application/octet-stream` (CORS still preflights because of PUT + Authorization).
 */
function toXhrUploadBlob(body: Blob | ArrayBuffer): Blob {
  // encrypt.lu share-mode collects `new Blob(..., { type: "application/octet-stream" })`.
  if (!(body instanceof Blob)) {
    return new Blob([body], { type: "application/octet-stream" });
  }
  if (body.type === "application/octet-stream") {
    return body;
  }
  return new Blob([body], { type: "application/octet-stream" });
}

export async function sendBinaryHttpRequest(
  url: string,
  method: string,
  body: Blob | ArrayBuffer,
  headers: Record<string, string>,
  credentials: RequestCredentials,
  _onUploadProgress?: (progress: BinaryUploadProgress) => void,
): Promise<Response> {
  const safeHeaders = filterBrowserUploadHeaders(headers);
  const isMutatingUpload = method === "PUT" || method === "POST";
  // encrypt.lu: Safari → xhr.send(Blob); Chrome → fetch(Blob). Do not attach
  // Safari upload.* listeners — that plumbing can abort before dispatch.
  if (isMutatingUpload && isSafariBrowser()) {
    return xhrBinaryRequest(
      url,
      method,
      toXhrUploadBlob(body),
      safeHeaders,
      credentials,
      undefined,
    );
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
