import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  NOTE_FILE_FREE_MAX_BYTES,
  NOTE_FILE_PREMIUM_MAX_BYTES,
  NOTE_FILE_PREMIUM_TOTAL_STORAGE_BYTES,
  formatNoteFileSize,
  noteFileLimitBytesForAccount,
} from "./noteFileLimits.ts";

describe("note file limits", () => {
  it("enforces 10 MB free and 1 GB premium per-file limits", () => {
    assert.equal(NOTE_FILE_FREE_MAX_BYTES, 10 * 1024 * 1024);
    assert.equal(NOTE_FILE_PREMIUM_MAX_BYTES, 1024 * 1024 * 1024);
    assert.equal(noteFileLimitBytesForAccount(false), NOTE_FILE_FREE_MAX_BYTES);
    assert.equal(noteFileLimitBytesForAccount(true), NOTE_FILE_PREMIUM_MAX_BYTES);
  });

  it("pins premium total encrypted storage to 20 GB", () => {
    assert.equal(NOTE_FILE_PREMIUM_TOTAL_STORAGE_BYTES, 20 * 1024 * 1024 * 1024);
    assert.equal(formatNoteFileSize(NOTE_FILE_PREMIUM_TOTAL_STORAGE_BYTES), "20480 MB");
  });
});
