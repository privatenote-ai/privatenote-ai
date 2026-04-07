import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseNoteExpirySecondsFromBody } from "./noteExpiry";

describe("parseNoteExpirySecondsFromBody", () => {
  it("accepts preset second values", () => {
    const r = parseNoteExpirySecondsFromBody(86400);
    assert.equal(r.ok, true);
    if (r.ok) assert.equal(r.seconds, 86400);
  });

  it("rejects unknown seconds", () => {
    const r = parseNoteExpirySecondsFromBody(12345);
    assert.equal(r.ok, false);
  });

  it("rejects non-integer", () => {
    const r = parseNoteExpirySecondsFromBody(1.5);
    assert.equal(r.ok, false);
  });

  it("rejects missing", () => {
    const r = parseNoteExpirySecondsFromBody(undefined);
    assert.equal(r.ok, false);
  });
});
