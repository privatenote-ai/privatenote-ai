import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  NOTE_CREATION_ENTRY_POINT_LABELS,
  sanitizeNoteCreationEntryPoint,
} from "./noteCreationEntryPoint";

describe("sanitizeNoteCreationEntryPoint", () => {
  it("accepts known entry points case-insensitively", () => {
    assert.equal(sanitizeNoteCreationEntryPoint("home"), "home");
    assert.equal(sanitizeNoteCreationEntryPoint(" Password-Share "), "password-share");
    assert.equal(sanitizeNoteCreationEntryPoint("FILE-SHARE"), "file-share");
    assert.equal(sanitizeNoteCreationEntryPoint("extension"), "extension");
    assert.equal(sanitizeNoteCreationEntryPoint("CLI"), "cli");
    assert.equal(sanitizeNoteCreationEntryPoint("MCP"), "mcp");
  });

  it("rejects unknown values", () => {
    assert.equal(sanitizeNoteCreationEntryPoint("mobile"), null);
    assert.equal(sanitizeNoteCreationEntryPoint(""), null);
    assert.equal(sanitizeNoteCreationEntryPoint(null), null);
  });
});

describe("NOTE_CREATION_ENTRY_POINT_LABELS", () => {
  it("labels every supported entry point", () => {
    assert.equal(NOTE_CREATION_ENTRY_POINT_LABELS.home, "Home");
    assert.equal(NOTE_CREATION_ENTRY_POINT_LABELS["password-share"], "Share a password");
    assert.equal(NOTE_CREATION_ENTRY_POINT_LABELS["file-share"], "Share a file");
    assert.equal(NOTE_CREATION_ENTRY_POINT_LABELS.cli, "Command line");
    assert.equal(NOTE_CREATION_ENTRY_POINT_LABELS.mcp, "MCP server");
  });
});
