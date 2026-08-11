import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildVoiceMessageFileName,
  concatFloat32,
  createVoiceMessageFile,
  downsampleToRate,
  encodeWavMonoFloat32,
  formatRecordingDuration,
  isVoiceMessageAttachment,
  isVoiceMessageFile,
  pickVoiceRecordingStrategy,
  voicePlaybackMimeCandidates,
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
      new Blob(["abc"], { type: "audio/wav" }),
      "audio/wav",
      "wav",
    );
    assert.equal(file instanceof File, true);
    assert.equal(file.type, "audio/wav");
    assert.match(file.name, /^voice-message-.+\.wav$/);
    assert.equal(isVoiceMessageFile(file), true);
  });

  it("detects voice attachments by audio mime or voice-message name", () => {
    assert.equal(isVoiceMessageAttachment("audio/webm", "clip.webm"), true);
    assert.equal(
      isVoiceMessageAttachment("application/octet-stream", "voice-message-1.m4a"),
      true,
    );
    assert.equal(isVoiceMessageAttachment("audio/wav", "voice-message.wav"), true);
    assert.equal(isVoiceMessageAttachment("video/webm", "clip.webm"), false);
    assert.equal(isVoiceMessageAttachment("application/pdf", "doc.pdf"), false);
  });

  it("falls back to WAV strategy when MediaRecorder mp4 is unavailable", () => {
    const strategy = pickVoiceRecordingStrategy();
    assert.ok(strategy.kind === "wav" || strategy.kind === "media-recorder");
    if (strategy.kind === "wav") {
      assert.equal(strategy.extension, "wav");
      assert.equal(strategy.mimeType, "audio/wav");
    }
  });

  it("downsamples and encodes a mono WAV blob", async () => {
    const input = new Float32Array([0, 0.5, -0.5, 1, -1, 0]);
    const down = downsampleToRate(concatFloat32([input]), 48_000, 16_000);
    assert.ok(down.length < input.length);
    const wav = encodeWavMonoFloat32(down, 16_000);
    assert.equal(wav.type, "audio/wav");
    assert.ok(wav.size >= 44);
    const bytes = new Uint8Array(await wav.arrayBuffer());
    assert.equal(String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]), "RIFF");
    assert.equal(String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]), "WAVE");
  });

  it("lists playback mime candidates for common voice formats", () => {
    assert.ok(voicePlaybackMimeCandidates("audio/mp4", "voice.m4a").includes("audio/mp4"));
    assert.ok(voicePlaybackMimeCandidates(undefined, "voice.wav").includes("audio/wav"));
    assert.ok(voicePlaybackMimeCandidates("audio/webm", "voice.webm").includes("audio/webm"));
  });
});
