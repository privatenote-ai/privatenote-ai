import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";
import {
  NOTE_LABELS_EXPORT_KIND,
  NOTE_LABELS_STORAGE_KEY,
  buildNoteLabelsExport,
  mergeNoteLabelsIntoLocal,
  parseNoteLabelsExport,
  readNoteLabels,
  serializeNoteLabelsExport,
} from "./noteLabelsStorage.ts";

class MemoryStorage implements Storage {
  private data = new Map<string, string>();
  get length() {
    return this.data.size;
  }
  clear() {
    this.data.clear();
  }
  getItem(key: string) {
    return this.data.has(key) ? this.data.get(key)! : null;
  }
  key(index: number) {
    return [...this.data.keys()][index] ?? null;
  }
  removeItem(key: string) {
    this.data.delete(key);
  }
  setItem(key: string, value: string) {
    this.data.set(key, String(value));
  }
}

const memoryStorage = new MemoryStorage();
(globalThis as { localStorage?: Storage }).localStorage = memoryStorage;

describe("noteLabelsStorage portability", () => {
  beforeEach(() => {
    memoryStorage.clear();
  });

  it("round-trips a labels export", () => {
    const labels = {
      "note-a": "Client pack",
      "note-b": "SSH handoff",
    };
    const raw = serializeNoteLabelsExport(labels);
    const parsed = parseNoteLabelsExport(raw);
    assert.ok(parsed);
    assert.equal(parsed.kind, NOTE_LABELS_EXPORT_KIND);
    assert.equal(parsed.v, 1);
    assert.deepEqual(parsed.labels, labels);
  });

  it("rejects unrelated JSON", () => {
    assert.equal(parseNoteLabelsExport('{"hello":"world"}'), null);
    assert.equal(parseNoteLabelsExport("not json"), null);
    assert.equal(parseNoteLabelsExport(JSON.stringify(buildNoteLabelsExport({}))), null);
  });

  it("merges imported labels without wiping local ones", () => {
    memoryStorage.setItem(
      NOTE_LABELS_STORAGE_KEY,
      JSON.stringify({ keep: "Keep me", clash: "Old" }),
    );
    const result = mergeNoteLabelsIntoLocal({
      clash: "New",
      added: "Fresh",
    });
    assert.equal(result.added, 1);
    assert.equal(result.updated, 1);
    assert.equal(result.unchanged, 0);
    assert.deepEqual(readNoteLabels(), {
      keep: "Keep me",
      clash: "New",
      added: "Fresh",
    });
  });
});
