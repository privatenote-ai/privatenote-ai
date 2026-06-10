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
