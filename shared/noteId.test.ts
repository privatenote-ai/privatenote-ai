import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { NOTE_ID_STRING_LENGTH, isValidNoteId } from "./noteId";

describe("isValidNoteId", () => {
  it("accepts lowercase uuid v4", () => {
    const id = "550e8400-e29b-41d4-a716-446655440000";
    assert.equal(id.length, NOTE_ID_STRING_LENGTH);
    assert.equal(isValidNoteId(id), true);
  });

  it("accepts uppercase", () => {
    assert.equal(isValidNoteId("550E8400-E29B-41D4-A716-446655440000"), true);
  });

  it("rejects wrong version nibble", () => {
    assert.equal(isValidNoteId("550e8400-e29b-31d4-a716-446655440000"), false);
  });

  it("rejects wrong length", () => {
    assert.equal(isValidNoteId("short"), false);
  });
});
