/** Bearer upload token issued with {@link NoteReserveResponse.uploadToken}. */
export const NOTE_UPLOAD_BEARER_PREFIX = "Bearer ";
export const NOTE_UPLOAD_QUERY_PARAM = "uploadToken";

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
