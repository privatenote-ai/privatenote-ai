/** Legacy single-attachment layout: note-files/{id}/chunks/{chunkIndex} */
export function noteFileChunkObjectKey(
  noteId: string,
  chunkIndex: number,
  attachmentIndex = 0,
): string {
  if (!Number.isInteger(attachmentIndex) || attachmentIndex <= 0) {
    return `note-files/${noteId}/chunks/${chunkIndex}`;
  }
  return `note-files/${noteId}/a/${attachmentIndex}/chunks/${chunkIndex}`;
}

/** Prefix covering both legacy chunks/ and namespaced a/{i}/ objects. */
export function noteFileObjectPrefix(noteId: string): string {
  return `note-files/${noteId}/`;
}

export function attachmentUploadApiPath(noteId: string, attachmentIndex: number): string {
  if (!Number.isInteger(attachmentIndex) || attachmentIndex <= 0) {
    return `/api/notes/${noteId}/file`;
  }
  return `/api/notes/${noteId}/attachments/${attachmentIndex}/file`;
}

export function attachmentChunkDownloadApiPath(
  noteId: string,
  attachmentIndex: number,
  chunkIndex: number,
): string {
  if (!Number.isInteger(attachmentIndex) || attachmentIndex <= 0) {
    return `/api/notes/${noteId}/file/chunks/${chunkIndex}`;
  }
  return `/api/notes/${noteId}/attachments/${attachmentIndex}/file/chunks/${chunkIndex}`;
}

/**
 * Canonical attachment list from stored/reveal payloads.
 * Legacy notes only have `attachment`; new notes send `attachments` (and may dual-write the first).
 */
export function storedNoteAttachmentsFromPayload<T>(payload: {
  attachment?: T | null;
  attachments?: T[] | null;
}): T[] {
  if (Array.isArray(payload.attachments) && payload.attachments.length > 0) {
    return payload.attachments;
  }
  return payload.attachment ? [payload.attachment] : [];
}
