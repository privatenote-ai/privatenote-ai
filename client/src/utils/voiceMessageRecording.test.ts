import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildVoiceMessageFileName,
  createVoiceMessageFile,
  formatRecordingDuration,
  isVoiceMessageAttachment,
  isVoiceMessageFile,
} from "./voiceMessageRecording.ts";

describe("voiceMessageRecording", () => {
  it("formats recording duration as m:ss", () => {
    assert.equal(formatRecordingDuration(0), "0:00");
    assert.equal(formatRecordingDuration(9), "0:09");
    assert.equal(formatRecordingDuration(75), "1:15");
    assert.equal(formatRecordingDuration(5 * 60), "5:00");
  });

  it("builds a voice-message filename with extension", () => {
    const name = buildVoiceMessageFileName("webm", new Date("2026-08-08T10:11:12"));
    assert.match(name, /^voice-message-\d{8}-\d{6}\.webm$/);
  });

  it("creates a File with audio type and voice-message name", () => {
    const file = createVoiceMessageFile(
      new Blob(["abc"], { type: "audio/webm" }),
      "audio/webm",
      "webm",
    );
    assert.equal(file instanceof File, true);
    assert.equal(file.type, "audio/webm");
    assert.match(file.name, /^voice-message-.+\.webm$/);
    assert.equal(isVoiceMessageFile(file), true);
  });

  it("detects voice attachments by audio mime or voice-message name", () => {
    assert.equal(isVoiceMessageAttachment("audio/webm", "clip.webm"), true);
    assert.equal(
      isVoiceMessageAttachment("application/octet-stream", "voice-message-1.m4a"),
      true,
    );
    assert.equal(isVoiceMessageAttachment("video/webm", "clip.webm"), false);
    assert.equal(isVoiceMessageAttachment("application/pdf", "doc.pdf"), false);
  });
});
