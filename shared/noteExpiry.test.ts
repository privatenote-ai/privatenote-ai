import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  NOTE_EXPIRY_DEFAULT_PRESET_ID,
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

  it("accepts 15m preset seconds", () => {
    const r = parseNoteExpirySecondsFromBody(noteExpiryPresetIdToSeconds("15m"));
    assert.equal(r.ok, true);
    if (r.ok) assert.equal(r.seconds, 15 * 60);
  });

  it("accepts 30d when the resolved plan allows it", () => {
    const r = parseNoteExpirySecondsFromBody(noteExpiryPresetIdToSeconds("30d"), {
      maxExpirySeconds: 30 * 24 * 60 * 60,
    });
    assert.equal(r.ok, true);
  });

  it("accepts 15d for starter", () => {
    const r = parseNoteExpirySecondsFromBody(noteExpiryPresetIdToSeconds("15d"), {
      maxExpirySeconds: 15 * 24 * 60 * 60,
    });
    assert.equal(r.ok, true);
  });

  it("rejects 30d for starter", () => {
    const r = parseNoteExpirySecondsFromBody(noteExpiryPresetIdToSeconds("30d"), {
      maxExpirySeconds: 15 * 24 * 60 * 60,
    });
    assert.equal(r.ok, false);
  });

  it("accepts 3d for free", () => {
    const r = parseNoteExpirySecondsFromBody(noteExpiryPresetIdToSeconds("3d"), {
      maxExpirySeconds: 3 * 24 * 60 * 60,
    });
    assert.equal(r.ok, true);
  });

  it("rejects 7d for free", () => {
    const r = parseNoteExpirySecondsFromBody(noteExpiryPresetIdToSeconds("7d"), {
      maxExpirySeconds: 3 * 24 * 60 * 60,
    });
    assert.equal(r.ok, false);
  });

  it("rejects 30d for free", () => {
    const r = parseNoteExpirySecondsFromBody(noteExpiryPresetIdToSeconds("30d"), {
      maxExpirySeconds: 3 * 24 * 60 * 60,
    });
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
  it("keeps the default at 1d", () => {
    assert.equal(NOTE_EXPIRY_DEFAULT_PRESET_ID, "1d");
  });

  it("clamps presets to the highest exact value allowed by the plan", () => {
    const freeMax = 3 * 24 * 60 * 60;
    const starterMax = 15 * 24 * 60 * 60;
    const businessMax = 30 * 24 * 60 * 60;
    assert.equal(clampNoteExpiryPresetForAccount("7d", freeMax), "3d");
    assert.equal(clampNoteExpiryPresetForAccount("30d", freeMax), "3d");
    assert.equal(clampNoteExpiryPresetForAccount("30d", starterMax), "15d");
    assert.equal(clampNoteExpiryPresetForAccount("15d", starterMax), "15d");
    assert.equal(clampNoteExpiryPresetForAccount("30d", businessMax), "30d");
  });
});
