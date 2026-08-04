/** Bearer upload token issued with {@link NoteReserveResponse.uploadToken}. */
export const NOTE_UPLOAD_BEARER_PREFIX = "Bearer ";
export const NOTE_UPLOAD_QUERY_PARAM = "uploadToken";

/**
 * After the ciphertext Blob lands, keep the reservation only long enough to
 * finalize the note. Token stays valid for idempotent retries (lost 201), then
 * clearReservation on successful create kills it.
 */
export const NOTE_UPLOAD_POST_UPLOAD_FINALIZE_TTL_SECONDS = 5 * 60;

export type NoteUploadTokenVia = "bearer" | "query";

export interface ResolvedNoteUploadToken {
  token: string;
  via: NoteUploadTokenVia;
}

export interface NoteReserveResponse {
  id: string;
  uploadToken: string;
  expiresIn: number;
}

export interface NoteReservationRecord {
  clientId: string;
  /** CF-Connecting-IP at reserve time; used for direct Worker chunk PUTs (no HttpOnly cookie). */
  clientIp?: string;
  createdAt: string;
  uploadTokenHash: string;
  /** Signed-in account that owns attachment storage quota, free or premium. */
  fileStorageUserId?: string | null;
  premiumUserId?: string | null;
  attachmentPlaintextSize?: number;
  attachmentEncryptedSize?: number;
  /** ISO time when ciphertext was accepted (shortens remaining reservation TTL). */
  uploadCompletedAt?: string;
  /** chunkIndex (string) → SHA-256 hex of uploaded ciphertext bytes */
  uploadedChunkHashes?: Record<string, string>;
}

export interface NoteReserveAttachmentBinding {
  attachmentPlaintextSize: number;
  attachmentEncryptedSize: number;
}

const ATTACHMENT_CONTENT_HASH_PATTERN = /^[a-f0-9]{64}$/i;

export function isValidAttachmentContentHash(value: unknown): value is string {
  return typeof value === "string" && ATTACHMENT_CONTENT_HASH_PATTERN.test(value);
}

export function uploadedChunkHashKey(chunkIndex: number): string {
  return String(chunkIndex);
}

export function parseNoteReserveAttachmentBinding(body: unknown): NoteReserveAttachmentBinding | null {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return null;
  }
  const record = body as Record<string, unknown>;
  const attachmentPlaintextSize = record.attachmentPlaintextSize;
  const attachmentEncryptedSize = record.attachmentEncryptedSize;
  if (
    typeof attachmentPlaintextSize !== "number" ||
    typeof attachmentEncryptedSize !== "number" ||
    !Number.isInteger(attachmentPlaintextSize) ||
    !Number.isInteger(attachmentEncryptedSize) ||
    attachmentPlaintextSize < 0 ||
    attachmentEncryptedSize <= 0 ||
    attachmentEncryptedSize < attachmentPlaintextSize
  ) {
    return null;
  }
  return { attachmentPlaintextSize, attachmentEncryptedSize };
}

export function parseNoteUploadBearerToken(authHeader: string | null | undefined): string | null {
  if (!authHeader) return null;
  const trimmed = authHeader.trim();
  if (!trimmed.startsWith(NOTE_UPLOAD_BEARER_PREFIX)) return null;
  const token = trimmed.slice(NOTE_UPLOAD_BEARER_PREFIX.length).trim();
  return token.length > 0 ? token : null;
}

/**
 * Resolve the upload token without changing the working recipe:
 * Bearer first (preferred; stays out of URLs/logs), then query fallback for
 * Safari/WebKit when Authorization does not survive the hop.
 */
export function resolveNoteUploadToken(input: {
  authorizationHeader?: string | null;
  requestUrl?: string | null;
}): ResolvedNoteUploadToken | null {
  const bearer = parseNoteUploadBearerToken(input.authorizationHeader);
  if (bearer) {
    return { token: bearer, via: "bearer" };
  }
  if (!input.requestUrl) return null;
  try {
    const queryToken = new URL(input.requestUrl).searchParams.get(NOTE_UPLOAD_QUERY_PARAM)?.trim() || null;
    if (queryToken) {
      return { token: queryToken, via: "query" };
    }
  } catch {
    return null;
  }
  return null;
}

/** Strip upload tokens from URLs before logging (Worker or client). */
export function redactNoteUploadTokenInUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.searchParams.has(NOTE_UPLOAD_QUERY_PARAM)) {
      parsed.searchParams.set(NOTE_UPLOAD_QUERY_PARAM, "[redacted]");
    }
    return parsed.toString();
  } catch {
    return url.replace(new RegExp(`([?&]${NOTE_UPLOAD_QUERY_PARAM}=)[^&]+`, "g"), "$1[redacted]");
  }
}

export function noteReservationExpirationTtlSeconds(
  record: Pick<NoteReservationRecord, "fileStorageUserId" | "uploadCompletedAt">,
  defaults: { attachmentTtlSeconds: number; noteTtlSeconds: number; postUploadFinalizeTtlSeconds: number },
): number {
  if (record.uploadCompletedAt) {
    return defaults.postUploadFinalizeTtlSeconds;
  }
  return record.fileStorageUserId ? defaults.attachmentTtlSeconds : defaults.noteTtlSeconds;
}

export function noteUploadAuthorizationHeader(uploadToken: string): string {
  return `${NOTE_UPLOAD_BEARER_PREFIX}${uploadToken}`;
}

export function noteUploadQueryParam(uploadToken: string): string {
  return `${NOTE_UPLOAD_QUERY_PARAM}=${encodeURIComponent(uploadToken)}`;
}

export function parseClientIdentifierParts(clientId: string): { ip?: string; cookieId?: string } {
  const ipMatch = clientId.match(/^ip:([^|]+)(?:\|cid:(.+))?$/);
  if (ipMatch) {
    return { ip: ipMatch[1], cookieId: ipMatch[2] };
  }
  const cookieMatch = clientId.match(/^cookie:(.+)$/);
  if (cookieMatch) {
    return { cookieId: cookieMatch[1] };
  }
  return {};
}

export function noteReservationClientMatches(
  record: Pick<NoteReservationRecord, "clientId">,
  requestClientId: string,
): boolean {
  if (typeof record.clientId !== "string" || record.clientId.length === 0) {
    return false;
  }
  if (record.clientId === requestClientId) {
    return true;
  }
  const reserved = parseClientIdentifierParts(record.clientId);
  const request = parseClientIdentifierParts(requestClientId);
  if (
    reserved.cookieId &&
    request.cookieId &&
    reserved.cookieId === request.cookieId
  ) {
    return true;
  }
  // Direct Worker chunk PUTs use credentials: "omit" (cross-origin), so pn_client_id is not
  // sent and the request bucket is ip-only while reserve often stored ip|cid.
  return Boolean(reserved.ip && request.ip && !request.cookieId && reserved.ip === request.ip);
}

export function noteReservationUploadClientMatches(
  record: Pick<NoteReservationRecord, "clientId" | "clientIp">,
  requestClientId: string,
  requestIp: string | null | undefined,
): boolean {
  const normalizedIp = typeof requestIp === "string" ? requestIp.trim() : "";
  if (normalizedIp && record.clientIp === normalizedIp) {
    return true;
  }
  return noteReservationClientMatches(record, requestClientId);
}
