import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { normalizeVoiceRecordingFormatPreference } from "./voiceRecordingFormatPreference.ts";

describe("voiceRecordingFormatPreference", () => {
  it("normalizes known formats and defaults to auto", () => {
    assert.equal(normalizeVoiceRecordingFormatPreference("auto"), "auto");
    assert.equal(normalizeVoiceRecordingFormatPreference("WAV"), "wav");
    assert.equal(normalizeVoiceRecordingFormatPreference("m4a"), "m4a");
    assert.equal(normalizeVoiceRecordingFormatPreference("webm"), "auto");
    assert.equal(normalizeVoiceRecordingFormatPreference(null), "auto");
  });
});
