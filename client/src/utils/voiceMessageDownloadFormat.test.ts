import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isVoiceDownloadConversionAvailable,
  normalizeVoiceDownloadFormat,
} from "./voiceMessageDownloadFormat.ts";

describe("voiceMessageDownloadFormat", () => {
  it("normalizes download format options", () => {
    assert.equal(normalizeVoiceDownloadFormat("wav"), "wav");
    assert.equal(normalizeVoiceDownloadFormat("M4A"), "m4a");
    assert.equal(normalizeVoiceDownloadFormat("original"), "original");
    assert.equal(normalizeVoiceDownloadFormat("nope"), "original");
    assert.equal(normalizeVoiceDownloadFormat(undefined), "original");
  });

  it("treats original as always available", () => {
    assert.equal(isVoiceDownloadConversionAvailable("original"), true);
  });
});
