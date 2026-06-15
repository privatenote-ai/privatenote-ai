/** Per-note labels for Notification Center — stored only in this browser. */
export const NOTE_LABELS_STORAGE_KEY = "privatenote_note_labels";

export const NOTE_LABEL_MAX_LENGTH = 120;

export type NoteLabelsMap = Record<string, string>;

function normalizeLabel(raw: string): string {
  return raw.trim().slice(0, NOTE_LABEL_MAX_LENGTH);
}

export function readNoteLabels(): NoteLabelsMap {
  try {
    const raw = localStorage.getItem(NOTE_LABELS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return {};
    const out: NoteLabelsMap = {};
    for (const [noteId, label] of Object.entries(parsed)) {
      if (typeof noteId !== "string" || typeof label !== "string") continue;
      const trimmed = normalizeLabel(label);
      if (trimmed) out[noteId] = trimmed;
    }
    return out;
  } catch {
    return {};
  }
}

function writeNoteLabels(labels: NoteLabelsMap): void {
  try {
    const keys = Object.keys(labels);
    if (keys.length === 0) {
      localStorage.removeItem(NOTE_LABELS_STORAGE_KEY);
      return;
    }
    localStorage.setItem(NOTE_LABELS_STORAGE_KEY, JSON.stringify(labels));
  } catch {
    /* private mode */
  }
}

export function getNoteLabel(noteId: string): string | null {
  const label = readNoteLabels()[noteId];
  return label?.trim() || null;
}

export function saveNoteLabel(noteId: string, label: string): void {
  const trimmed = normalizeLabel(label);
  if (!trimmed) {
    deleteNoteLabel(noteId);
    return;
  }
  const labels = readNoteLabels();
  labels[noteId] = trimmed;
  writeNoteLabels(labels);
}

export function deleteNoteLabel(noteId: string): void {
  const labels = readNoteLabels();
  if (!(noteId in labels)) return;
  delete labels[noteId];
  writeNoteLabels(labels);
}

export function deleteNoteLabels(noteIds: string[]): void {
  if (noteIds.length === 0) return;
  const labels = readNoteLabels();
  let changed = false;
  for (const noteId of noteIds) {
    if (noteId in labels) {
      delete labels[noteId];
      changed = true;
    }
  }
  if (changed) writeNoteLabels(labels);
}

export function clearAllNoteLabels(): void {
  try {
    localStorage.removeItem(NOTE_LABELS_STORAGE_KEY);
  } catch {
    /* private mode */
  }
}
