import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildNoteAadBytes,
  buildNoteAadPlaintext,
  decodeNoteAadBase64,
  encodeNoteAadBytesForWire,
  parseNoteAadPlaintext,
} from "./noteAad";

describe("noteAad", () => {
  it("round-trips canonical JSON", () => {
    const id = "550e8400-e29b-41d4-a716-446655440000";
    const plaintext = buildNoteAadPlaintext(id, 3600, 1);
    assert.ok(plaintext.startsWith("{") && plaintext.includes('"exp":3600'));
    const parsed = parseNoteAadPlaintext(plaintext);
    assert.deepEqual(parsed, { noteId: id, expirySeconds: 3600, maxReads: 1 });
  });

  it("buildNoteAadBytes matches plaintext UTF-8", () => {
    const id = "550e8400-e29b-41d4-a716-446655440000";
    const binding = { noteId: id, expirySeconds: 3600, maxReads: 1 };
    const bytes = buildNoteAadBytes(binding);
    assert.equal(new TextDecoder().decode(bytes), buildNoteAadPlaintext(id, 3600, 1));
  });

  it("wire base64 round-trips through decodeNoteAadBase64", () => {
    const bytes = buildNoteAadBytes({
      noteId: "a",
      expirySeconds: 42,
      maxReads: 3,
    });
    const wire = encodeNoteAadBytesForWire(bytes);
    const decoded = decodeNoteAadBase64(wire);
    assert.equal(decoded, buildNoteAadPlaintext("a", 42, 3));
  });

  it("rejects pipe legacy shape", () => {
    assert.equal(parseNoteAadPlaintext("id:x|exp:1|reads:1"), null);
  });

  it("rejects extra JSON keys", () => {
    assert.equal(parseNoteAadPlaintext(JSON.stringify({ exp: 1, id: "a", reads: 1, x: 1 })), null);
  });

  it("rejects wrong key set", () => {
    assert.equal(parseNoteAadPlaintext(JSON.stringify({ a: 1, b: 2, c: 3 })), null);
  });
});
