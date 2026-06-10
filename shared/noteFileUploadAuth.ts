/** Bearer upload token issued with {@link NoteReserveResponse.uploadToken}. */
export const NOTE_UPLOAD_BEARER_PREFIX = "Bearer ";

export interface NoteReserveResponse {
  id: string;
  uploadToken: string;
  expiresIn: number;
}

export interface NoteReservationRecord {
  clientId: string;
  createdAt: string;
  uploadTokenHash: string;
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

export function noteReservationClientMatches(
  record: Pick<NoteReservationRecord, "clientId">,
  requestClientId: string,
): boolean {
  return (
    typeof record.clientId === "string" &&
    record.clientId.length > 0 &&
    record.clientId === requestClientId
  );
}
