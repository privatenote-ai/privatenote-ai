/** Per-note labels for Notification Center — stored only in this browser. */
export const NOTE_LABELS_STORAGE_KEY = "privatenote_note_labels";

export const NOTE_LABEL_MAX_LENGTH = 120;

/** Portable export marker for Business label packs (file or PrivateNote body). */
export const NOTE_LABELS_EXPORT_KIND = "privatenote.note_labels" as const;

/**
 * Keep in sync with `PREFILL_MAX_CHARS` in `usePrefillFromFragment.ts`.
 * Larger packs should be downloaded as a file instead of sent via prefill.
 */
export const NOTE_LABELS_PREFILL_MAX_CHARS = 10_000;

export type NoteLabelsMap = Record<string, string>;

export type NoteLabelsExport = {
  v: 1;
  kind: typeof NOTE_LABELS_EXPORT_KIND;
  exportedAt: string;
  labels: NoteLabelsMap;
};

export type NoteLabelsMergeResult = {
  merged: NoteLabelsMap;
  added: number;
  updated: number;
  unchanged: number;
};

function normalizeLabel(raw: string): string {
  return raw.trim().slice(0, NOTE_LABEL_MAX_LENGTH);
}

function normalizeLabelsMap(raw: unknown): NoteLabelsMap {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return {};
  const out: NoteLabelsMap = {};
  for (const [noteId, label] of Object.entries(raw)) {
    if (typeof noteId !== "string" || typeof label !== "string") continue;
    const trimmedId = noteId.trim();
    const trimmedLabel = normalizeLabel(label);
    if (!trimmedId || !trimmedLabel) continue;
    out[trimmedId] = trimmedLabel;
  }
  return out;
}

export function readNoteLabels(): NoteLabelsMap {
  try {
    const raw = localStorage.getItem(NOTE_LABELS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    return normalizeLabelsMap(parsed);
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

export function countNoteLabels(labels: NoteLabelsMap = readNoteLabels()): number {
  return Object.keys(labels).length;
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

export function buildNoteLabelsExport(
  labels: NoteLabelsMap = readNoteLabels(),
  exportedAt: string = new Date().toISOString(),
): NoteLabelsExport {
  return {
    v: 1,
    kind: NOTE_LABELS_EXPORT_KIND,
    exportedAt,
    labels: normalizeLabelsMap(labels),
  };
}

export function serializeNoteLabelsExport(
  labels: NoteLabelsMap = readNoteLabels(),
): string {
  return `${JSON.stringify(buildNoteLabelsExport(labels), null, 2)}\n`;
}

export function parseNoteLabelsExport(raw: string): NoteLabelsExport | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  try {
    const parsed = JSON.parse(trimmed) as unknown;
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return null;
    const obj = parsed as Record<string, unknown>;
    if (obj.v !== 1) return null;
    if (obj.kind !== NOTE_LABELS_EXPORT_KIND) return null;
    const labels = normalizeLabelsMap(obj.labels);
    if (Object.keys(labels).length === 0) return null;
    const exportedAt =
      typeof obj.exportedAt === "string" && obj.exportedAt.trim()
        ? obj.exportedAt.trim()
        : new Date(0).toISOString();
    return {
      v: 1,
      kind: NOTE_LABELS_EXPORT_KIND,
      exportedAt,
      labels,
    };
  } catch {
    return null;
  }
}

export function mergeNoteLabelsIntoLocal(
  incoming: NoteLabelsMap,
): NoteLabelsMergeResult {
  const current = readNoteLabels();
  const next: NoteLabelsMap = { ...current };
  let added = 0;
  let updated = 0;
  let unchanged = 0;
  for (const [noteId, label] of Object.entries(normalizeLabelsMap(incoming))) {
    const existing = next[noteId];
    if (existing === undefined) {
      next[noteId] = label;
      added += 1;
    } else if (existing === label) {
      unchanged += 1;
    } else {
      next[noteId] = label;
      updated += 1;
    }
  }
  writeNoteLabels(next);
  return { merged: next, added, updated, unchanged };
}

export function downloadNoteLabelsExport(
  labels: NoteLabelsMap = readNoteLabels(),
  filename?: string,
): void {
  const body = serializeNoteLabelsExport(labels);
  const stamp = new Date().toISOString().slice(0, 10);
  const name = filename ?? `privatenote-labels-${stamp}.json`;
  const blob = new Blob([body], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
