/**
 * PrivateNote API client for the MCP server.
 *
 * Session auth uses `Authorization: Bearer` (plugin device session), never the
 * website `pn_session` cookie. File ciphertext PUTs use the note upload token.
 */

import { noteUploadAuthorizationHeader } from "@shared/noteFileUploadAuth";
import { NOTE_FILE_DIRECT_R2_MIN_BYTES } from "@shared/noteFileLimits";
import { readStoredSession } from "./sessionStore.ts";

export interface ReserveNoteResult {
  id: string;
  uploadToken?: string;
}

export interface CreateNoteBody {
  id: string;
  content: string;
  iv: string;
  aad: string;
  expirySeconds: number;
  maxReads: number;
  isPasswordProtected: boolean;
  _hp: string;
  aiMode: boolean;
  creationSource: string;
  creationEntryPoint: string;
  keyDerivation?: string;
  attachments?: unknown[];
}

export interface CreateNoteResult {
  id: string;
}

export type DeviceAuthStartResult = {
  deviceCode: string;
  userCode: string;
  verificationUriComplete: string;
  expiresIn: number;
  interval: number;
};

export type DeviceAuthPollResult =
  | { status: "pending" }
  | { status: "authorized"; accessToken: string };

export type AuthMeResult = {
  email: string | null;
  accountType: string | null;
};

async function sessionHeaders(): Promise<Record<string, string>> {
  const session = await readStoredSession();
  if (!session?.accessToken) return {};
  return { Authorization: `Bearer ${session.accessToken}` };
}

async function readErrorMessage(res: Response): Promise<string> {
  try {
    const json = (await res.json()) as Record<string, unknown>;
    if (typeof json.message === "string" && json.message) return json.message;
    if (typeof json.error === "string" && json.error) return json.error;
  } catch {
    /* ignore */
  }
  return res.statusText || `HTTP ${res.status}`;
}

export async function startDeviceAuth(apiBaseUrl: string): Promise<DeviceAuthStartResult> {
  const res = await fetch(`${apiBaseUrl}/api/auth/device/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client: "mcp", clientName: "PrivateNote MCP" }),
  });
  if (!res.ok) {
    throw new Error(`Sign-in failed (${res.status}): ${await readErrorMessage(res)}`);
  }
  const body = (await res.json()) as Record<string, unknown>;
  if (
    typeof body.deviceCode !== "string" ||
    typeof body.verificationUriComplete !== "string"
  ) {
    throw new Error("Sign-in response was incomplete");
  }
  return {
    deviceCode: body.deviceCode,
    userCode: typeof body.userCode === "string" ? body.userCode : "",
    verificationUriComplete: body.verificationUriComplete,
    expiresIn: typeof body.expiresIn === "number" ? body.expiresIn : 600,
    interval: typeof body.interval === "number" ? body.interval : 3,
  };
}

export async function pollDeviceAuth(
  apiBaseUrl: string,
  deviceCode: string,
): Promise<DeviceAuthPollResult> {
  const res = await fetch(`${apiBaseUrl}/api/auth/device/poll`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ deviceCode }),
  });
  const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    const detail =
      (typeof body.message === "string" && body.message) ||
      (typeof body.error === "string" && body.error) ||
      `HTTP ${res.status}`;
    throw new Error(detail);
  }
  if (body.status === "authorized" && typeof body.accessToken === "string") {
    return { status: "authorized", accessToken: body.accessToken };
  }
  return { status: "pending" };
}

export async function fetchAuthMe(apiBaseUrl: string): Promise<AuthMeResult | null> {
  const headers = await sessionHeaders();
  if (!headers.Authorization) return null;
  const res = await fetch(`${apiBaseUrl}/api/auth/me`, { method: "GET", headers });
  if (res.status === 401) return null;
  if (!res.ok) {
    throw new Error(`Could not read account (${res.status})`);
  }
  const body = (await res.json()) as Record<string, unknown>;
  const email =
    typeof body.email === "string"
      ? body.email
      : body.user && typeof body.user === "object" && typeof (body.user as { email?: unknown }).email === "string"
        ? ((body.user as { email: string }).email)
        : null;
  const accountType =
    typeof body.accountType === "string"
      ? body.accountType
      : typeof body.account_type === "string"
        ? body.account_type
        : null;
  return { email, accountType };
}

export async function logoutRemote(apiBaseUrl: string): Promise<void> {
  const headers = await sessionHeaders();
  if (!headers.Authorization) return;
  await fetch(`${apiBaseUrl}/api/auth/logout`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: "{}",
  }).catch(() => undefined);
}

export async function reserveNoteId(
  apiBaseUrl: string,
  attachmentBinding?: {
    attachmentPlaintextSize: number;
    attachmentEncryptedSize: number;
    attachments: Array<{ attachmentPlaintextSize: number; attachmentEncryptedSize: number }>;
  },
): Promise<ReserveNoteResult> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(await sessionHeaders()),
  };
  const res = await fetch(`${apiBaseUrl}/api/notes/reserve`, {
    method: "POST",
    headers,
    body: JSON.stringify(attachmentBinding ?? {}),
  });

  if (!res.ok) {
    throw new Error(`Note reservation failed (${res.status}): ${await readErrorMessage(res)}`);
  }

  const body = (await res.json()) as Record<string, unknown>;
  if (typeof body["id"] !== "string") {
    throw new Error("Note reservation response missing id");
  }

  return {
    id: body["id"] as string,
    uploadToken: typeof body["uploadToken"] === "string" ? body["uploadToken"] : undefined,
  };
}

export async function createNote(
  apiBaseUrl: string,
  body: CreateNoteBody,
): Promise<CreateNoteResult> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(await sessionHeaders()),
  };
  const res = await fetch(`${apiBaseUrl}/api/notes`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Note creation failed (${res.status}): ${await readErrorMessage(res)}`);
  }

  const json = (await res.json()) as Record<string, unknown>;
  if (typeof json["id"] !== "string") {
    throw new Error("Note creation response missing id");
  }

  return { id: json["id"] as string };
}

export async function uploadEncryptedAttachment(options: {
  apiBaseUrl: string;
  noteId: string;
  ciphertext: Uint8Array;
  plaintextSize: number;
  encryptedSize: number;
  chunkSha256: string;
  uploadToken: string;
}): Promise<void> {
  const { apiBaseUrl, noteId, ciphertext, plaintextSize, encryptedSize, chunkSha256, uploadToken } =
    options;
  const blob = new Blob([ciphertext], { type: "application/octet-stream" });

  if (blob.size >= NOTE_FILE_DIRECT_R2_MIN_BYTES) {
    const presignRes = await fetch(`${apiBaseUrl}/api/notes/${noteId}/file/presign`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: noteUploadAuthorizationHeader(uploadToken),
      },
      body: "{}",
    });
    if (!presignRes.ok) {
      throw new Error(`File upload failed (${presignRes.status}): ${await readErrorMessage(presignRes)}`);
    }
    const presign = (await presignRes.json()) as { uploadUrl?: string };
    if (typeof presign.uploadUrl !== "string") {
      throw new Error("File upload failed: missing upload URL");
    }
    const putRes = await fetch(presign.uploadUrl, { method: "PUT", body: blob });
    if (!putRes.ok) {
      throw new Error(`File upload failed (${putRes.status})`);
    }
    const completeRes = await fetch(`${apiBaseUrl}/api/notes/${noteId}/file/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: noteUploadAuthorizationHeader(uploadToken),
      },
      body: JSON.stringify({ chunkSha256, encryptedSize: blob.size }),
    });
    if (!completeRes.ok) {
      throw new Error(`File upload failed (${completeRes.status}): ${await readErrorMessage(completeRes)}`);
    }
    return;
  }

  const res = await fetch(`${apiBaseUrl}/api/notes/${noteId}/file`, {
    method: "PUT",
    headers: {
      Authorization: noteUploadAuthorizationHeader(uploadToken),
      "x-file-plaintext-size": String(plaintextSize),
      "x-file-encrypted-size": String(encryptedSize),
      "x-file-chunk-encrypted-size": String(encryptedSize),
      "x-file-chunk-sha256": chunkSha256,
    },
    body: blob,
  });
  if (!res.ok) {
    throw new Error(`File upload failed (${res.status}): ${await readErrorMessage(res)}`);
  }
}
