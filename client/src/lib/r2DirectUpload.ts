/**
 * Large encrypted attachments: Worker issues an S3-compatible R2 presigned PUT,
 * the browser uploads the Blob directly to R2 (bypasses CF CDN body limits),
 * then /file/complete records the ciphertext SHA-256 for finalize.
 */

import { uploadWorkerOriginForAppHostname } from "@shared/apiWorkerOrigin";
import { NOTE_FILE_DIRECT_R2_MIN_BYTES } from "@shared/noteFileLimits";
import { noteUploadAuthorizationHeader } from "@shared/noteFileUploadAuth";
import {
  sendBinaryHttpRequest,
  withEstimatedBinaryUploadProgress,
} from "@/lib/binaryUploadTransport";
import { ApiRequestError, logFileUpload } from "@/lib/queryClient";
import { isSafariBrowser, UPLOAD_TRANSPORT_FAILURE_MESSAGE } from "@/lib/safariSafeChunkUpload";

export function shouldUseDirectR2Upload(encryptedBytes: number): boolean {
  return (
    Number.isFinite(encryptedBytes) &&
    encryptedBytes >= NOTE_FILE_DIRECT_R2_MIN_BYTES
  );
}

function uploadRelayOrigin(): string {
  const hostname = typeof window === "undefined" ? "" : window.location.hostname;
  return uploadWorkerOriginForAppHostname(hostname);
}

function uploadRelayUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${uploadRelayOrigin()}${normalized}`;
}

async function postUploadJson<T>(
  path: string,
  uploadToken: string,
  body: Record<string, unknown>,
): Promise<T> {
  const res = await fetch(uploadRelayUrl(path), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: noteUploadAuthorizationHeader(uploadToken),
    },
    body: JSON.stringify(body),
    credentials: "omit",
    mode: "cors",
  });
  const text = await res.text();
  if (!res.ok) {
    throw new ApiRequestError(res.status, text || res.statusText);
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new ApiRequestError(res.status, text || "Invalid JSON response");
  }
}

/**
 * Presign → XHR PUT Blob to R2 → complete.
 * Safari: no xhr.upload listeners (abort risk); use elapsed-time byte estimate instead.
 */
export async function uploadEncryptedAttachmentViaPresignedR2(options: {
  noteId: string;
  blob: Blob;
  chunkSha256: string;
  uploadToken: string;
  onUploadProgress?: (progress: { loaded: number; total: number }) => void;
}): Promise<void> {
  const { noteId, blob, chunkSha256, uploadToken, onUploadProgress } = options;
  logFileUpload("info", "presigning R2 direct upload", {
    noteId,
    bodyBytes: blob.size,
    thresholdBytes: NOTE_FILE_DIRECT_R2_MIN_BYTES,
  });

  if (onUploadProgress) {
    onUploadProgress({ loaded: Math.min(blob.size * 0.02, blob.size), total: blob.size });
  }

  const { uploadUrl } = await postUploadJson<{
    uploadUrl: string;
    expiresIn: number;
    encryptedSize: number;
  }>(`/api/notes/${noteId}/file/presign`, uploadToken, {});

  const uploadBody =
    blob.type === "application/octet-stream"
      ? blob
      : new Blob([blob], { type: "application/octet-stream" });

  logFileUpload("info", "uploading attachment blob to R2", {
    noteId,
    bodyBytes: uploadBody.size,
  });

  // Blob type application/octet-stream matches the signed Content-Type on the
  // presign. Do not also setRequestHeader("Content-Type") — WebKit may double-send.
  const putResponse = await withEstimatedBinaryUploadProgress(
    uploadBody.size,
    onUploadProgress,
    () =>
      sendBinaryHttpRequest(
        uploadUrl,
        "PUT",
        uploadBody,
        {},
        "omit",
        isSafariBrowser() ? undefined : onUploadProgress,
      ),
    {
      enabled: isSafariBrowser(),
      // Keep ETA conservative so Safari's bar stays linear for multi‑hundred‑MB PUTs.
      bytesPerSec: 2.5 * 1024 * 1024,
    },
  );
  if (!putResponse.ok) {
    const text = await putResponse.text().catch(() => "");
    logFileUpload("error", "R2 direct PUT failed", {
      noteId,
      status: putResponse.status,
      bodyPreview: text.slice(0, 300),
    });
    throw new ApiRequestError(
      putResponse.status,
      text || UPLOAD_TRANSPORT_FAILURE_MESSAGE,
    );
  }

  if (onUploadProgress) {
    onUploadProgress({ loaded: Math.min(uploadBody.size * 0.96, uploadBody.size), total: uploadBody.size });
  }

  await postUploadJson(`/api/notes/${noteId}/file/complete`, uploadToken, {
    chunkSha256,
    encryptedSize: blob.size,
  });

  if (onUploadProgress) {
    onUploadProgress({ loaded: uploadBody.size, total: uploadBody.size });
  }

  logFileUpload("info", "R2 direct upload complete", {
    noteId,
    bodyBytes: blob.size,
  });
}
