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
  /** Account type at reserve time (free / personal_premium / business_premium). */
  fileAccountType?: string | null;
  /** Sum of all item plaintext sizes. */
  attachmentPlaintextSize?: number;
  /** Sum of all item encrypted sizes. */
  attachmentEncryptedSize?: number;
  /** Per-item sizes when the transfer contains one or more files. */
  attachments?: NoteReserveAttachmentBinding[];
  /** chunkIndex or "{attachmentIndex}:{chunkIndex}" → SHA-256 hex of uploaded ciphertext bytes */
  uploadedChunkHashes?: Record<string, string>;
}

export interface NoteReserveAttachmentBinding {
  attachmentPlaintextSize: number;
  attachmentEncryptedSize: number;
}

export interface NoteReserveAttachmentsBinding {
  attachmentPlaintextSize: number;
  attachmentEncryptedSize: number;
  attachments: NoteReserveAttachmentBinding[];
}

const ATTACHMENT_CONTENT_HASH_PATTERN = /^[a-f0-9]{64}$/i;

export function isValidAttachmentContentHash(value: unknown): value is string {
  return typeof value === "string" && ATTACHMENT_CONTENT_HASH_PATTERN.test(value);
}

export function uploadedChunkHashKey(chunkIndex: number, attachmentIndex = 0): string {
  if (!Number.isInteger(attachmentIndex) || attachmentIndex <= 0) {
    return String(chunkIndex);
  }
  return `${attachmentIndex}:${chunkIndex}`;
}

function parseOneReserveAttachmentSize(raw: unknown): NoteReserveAttachmentBinding | null {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return null;
  }
  const record = raw as Record<string, unknown>;
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

export function parseNoteReserveAttachmentBinding(body: unknown): NoteReserveAttachmentsBinding | null {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return null;
  }
  const record = body as Record<string, unknown>;
  if (Array.isArray(record.attachments) && record.attachments.length > 0) {
    const attachments: NoteReserveAttachmentBinding[] = [];
    for (const item of record.attachments) {
      const parsed = parseOneReserveAttachmentSize(item);
      if (!parsed) return null;
      attachments.push(parsed);
    }
    const attachmentPlaintextSize = attachments.reduce((sum, item) => sum + item.attachmentPlaintextSize, 0);
    const attachmentEncryptedSize = attachments.reduce((sum, item) => sum + item.attachmentEncryptedSize, 0);
    if (!Number.isInteger(attachmentPlaintextSize) || !Number.isInteger(attachmentEncryptedSize)) {
      return null;
    }
    return { attachmentPlaintextSize, attachmentEncryptedSize, attachments };
  }
  const singular = parseOneReserveAttachmentSize(record);
  if (!singular) return null;
  return { ...singular, attachments: [singular] };
}

export function reservationAttachmentAt(
  record: Pick<NoteReservationRecord, "attachments" | "attachmentPlaintextSize" | "attachmentEncryptedSize">,
  attachmentIndex: number,
): NoteReserveAttachmentBinding | null {
  if (!Number.isInteger(attachmentIndex) || attachmentIndex < 0) return null;
  const listed = record.attachments;
  if (Array.isArray(listed) && listed.length > 0) {
    return listed[attachmentIndex] ?? null;
  }
  if (
    attachmentIndex === 0 &&
    typeof record.attachmentPlaintextSize === "number" &&
    typeof record.attachmentEncryptedSize === "number"
  ) {
    return {
      attachmentPlaintextSize: record.attachmentPlaintextSize,
      attachmentEncryptedSize: record.attachmentEncryptedSize,
    };
  }
  return null;
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
