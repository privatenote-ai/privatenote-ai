/**
 * Binary PUT transport — Safari fetch() can drop upload bodies after CORS preflight;
 * XHR uses a reliable WebKit path (same approach as encrypt.lu relay uploads).
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

export function isSafariBrowser(): boolean {
  if (typeof navigator === "undefined") {
    return false;
  }
  const ua = navigator.userAgent;
  return /Safari/i.test(ua) && !/Chrome|Chromium|CriOS|Edg|OPR|Firefox/i.test(ua);
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

function xhrBinaryRequest(
  url: string,
  method: string,
  body: Blob,
  headers: Record<string, string>,
  credentials: RequestCredentials,
): Promise<Response> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.withCredentials = credentials === "include";
    xhr.responseType = "text";
    for (const [name, value] of Object.entries(filterBrowserUploadHeaders(headers))) {
      xhr.setRequestHeader(name, value);
    }
    xhr.onload = () => {
      resolve(
        new Response(xhr.responseText ?? "", {
          status: xhr.status,
          statusText: xhr.statusText,
        }),
      );
    };
    xhr.onerror = () => reject(new TypeError("Load failed"));
    xhr.onabort = () => reject(new TypeError("Load failed"));
    xhr.send(body);
  });
}

function isCrossOriginRequestUrl(url: string): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    return new URL(url, window.location.href).origin !== window.location.origin;
  } catch {
    return false;
  }
}

export async function sendBinaryHttpRequest(
  url: string,
  method: string,
  body: Blob,
  headers: Record<string, string>,
  credentials: RequestCredentials,
): Promise<Response> {
  const safeHeaders = filterBrowserUploadHeaders(headers);
  // Safari XHR is only needed for cross-origin PUT; same-origin fetch handles large bodies reliably.
  if (isSafariBrowser() && method === "PUT" && isCrossOriginRequestUrl(url)) {
    return xhrBinaryRequest(url, method, body, safeHeaders, credentials);
  }
  return fetch(url, {
    method,
    headers: safeHeaders,
    body,
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
    const copy = new Uint8Array(body.byteLength);
    copy.set(body);
    return new Blob([copy.buffer], { type: "application/octet-stream" });
  }
  return null;
}
