import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  clampNoteExpiryPresetForAccount,
  noteExpiryPresetIdToSeconds,
  parseNoteExpirySecondsFromBody,
} from "./noteExpiry";

describe("parseNoteExpirySecondsFromBody", () => {
  it("accepts preset second values", () => {
    const r = parseNoteExpirySecondsFromBody(86400);
    assert.equal(r.ok, true);
    if (r.ok) assert.equal(r.seconds, 86400);
  });

  it("accepts 30d for premium", () => {
    const r = parseNoteExpirySecondsFromBody(noteExpiryPresetIdToSeconds("30d"), { isPremium: true });
    assert.equal(r.ok, true);
  });

  it("rejects 30d for free", () => {
    const r = parseNoteExpirySecondsFromBody(noteExpiryPresetIdToSeconds("30d"), { isPremium: false });
    assert.equal(r.ok, false);
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

describe("clampNoteExpiryPresetForAccount", () => {
  it("clamps premium presets to 7d for free users", () => {
    assert.equal(clampNoteExpiryPresetForAccount("30d", false), "7d");
    assert.equal(clampNoteExpiryPresetForAccount("30d", true), "30d");
  });
});
