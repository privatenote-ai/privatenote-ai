import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  NOTE_FILE_BUSINESS_MAX_BYTES,
  NOTE_FILE_BUSINESS_TOTAL_STORAGE_BYTES,
  NOTE_FILE_FREE_MAX_BYTES,
  NOTE_FILE_FREE_TOTAL_STORAGE_BYTES,
  NOTE_FILE_STARTER_MAX_BYTES,
  NOTE_FILE_STARTER_TOTAL_STORAGE_BYTES,
  formatNoteFileSize,
  noteFileLimitBytesForAccount,
  noteFileTotalStorageBytesForAccount,
} from "./noteFileLimits.ts";

describe("noteFileLimits", () => {
  it("enforces Free / Starter / Business per-file limits", () => {
    assert.equal(NOTE_FILE_FREE_MAX_BYTES, 25 * 1024 * 1024);
    assert.equal(NOTE_FILE_STARTER_MAX_BYTES, 250 * 1024 * 1024);
    assert.equal(NOTE_FILE_BUSINESS_MAX_BYTES, 1024 * 1024 * 1024);
    assert.equal(noteFileLimitBytesForAccount("free"), NOTE_FILE_FREE_MAX_BYTES);
    assert.equal(noteFileLimitBytesForAccount("personal_premium"), NOTE_FILE_STARTER_MAX_BYTES);
    assert.equal(noteFileLimitBytesForAccount("business_premium"), NOTE_FILE_BUSINESS_MAX_BYTES);
    assert.equal(noteFileLimitBytesForAccount(false), NOTE_FILE_FREE_MAX_BYTES);
    assert.equal(noteFileLimitBytesForAccount(true), NOTE_FILE_BUSINESS_MAX_BYTES);
  });

  it("pins Free / Starter / Business active payload buffers", () => {
    assert.equal(NOTE_FILE_FREE_TOTAL_STORAGE_BYTES, 250 * 1024 * 1024);
    assert.equal(NOTE_FILE_STARTER_TOTAL_STORAGE_BYTES, 5 * 1024 * 1024 * 1024);
    assert.equal(NOTE_FILE_BUSINESS_TOTAL_STORAGE_BYTES, 50 * 1024 * 1024 * 1024);
    assert.equal(
      noteFileTotalStorageBytesForAccount("free"),
      NOTE_FILE_FREE_TOTAL_STORAGE_BYTES,
    );
    assert.equal(
      noteFileTotalStorageBytesForAccount("personal_premium"),
      NOTE_FILE_STARTER_TOTAL_STORAGE_BYTES,
    );
    assert.equal(
      noteFileTotalStorageBytesForAccount("business_premium"),
      NOTE_FILE_BUSINESS_TOTAL_STORAGE_BYTES,
    );
    assert.equal(formatNoteFileSize(NOTE_FILE_BUSINESS_TOTAL_STORAGE_BYTES), "50 GB");
  });
});
