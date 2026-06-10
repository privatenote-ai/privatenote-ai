/**
 * Binary PUT transport — Safari fetch() can drop upload bodies after CORS preflight;
 * XHR uses a reliable WebKit path (same approach as encrypt.lu relay uploads).
 */

export function isSafariBrowser(): boolean {
  if (typeof navigator === "undefined") {
    return false;
  }
  const ua = navigator.userAgent;
  return /Safari/i.test(ua) && !/Chrome|Chromium|CriOS|Edg|OPR|Firefox/i.test(ua);
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
    for (const [name, value] of Object.entries(headers)) {
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

export async function sendBinaryHttpRequest(
  url: string,
  method: string,
  body: Blob,
  headers: Record<string, string>,
  credentials: RequestCredentials,
): Promise<Response> {
  if (isSafariBrowser() && method === "PUT") {
    return xhrBinaryRequest(url, method, body, headers, credentials);
  }
  return fetch(url, {
    method,
    headers,
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
