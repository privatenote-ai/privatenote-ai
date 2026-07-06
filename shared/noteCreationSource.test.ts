import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  NOTE_CREATION_SOURCE_LABELS,
  sanitizeNoteCreationSource,
} from "./noteCreationSource";

describe("sanitizeNoteCreationSource", () => {
  it("accepts known sources case-insensitively", () => {
    assert.equal(sanitizeNoteCreationSource("web"), "web");
    assert.equal(sanitizeNoteCreationSource(" VSCode "), "vscode");
    assert.equal(sanitizeNoteCreationSource("CURSOR"), "cursor");
    assert.equal(sanitizeNoteCreationSource("Chrome"), "chrome");
  });

  it("rejects unknown values", () => {
    assert.equal(sanitizeNoteCreationSource("mcp"), null);
    assert.equal(sanitizeNoteCreationSource(""), null);
    assert.equal(sanitizeNoteCreationSource(null), null);
  });
});

describe("NOTE_CREATION_SOURCE_LABELS", () => {
  it("labels every supported source", () => {
    assert.equal(NOTE_CREATION_SOURCE_LABELS.web, "Web app");
    assert.equal(NOTE_CREATION_SOURCE_LABELS.vscode, "VS Code");
    assert.equal(NOTE_CREATION_SOURCE_LABELS.cursor, "Cursor");
    assert.equal(NOTE_CREATION_SOURCE_LABELS.chrome, "Chrome extension");
  });
});
