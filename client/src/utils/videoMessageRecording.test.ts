import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildVideoMessageFileName,
  createVideoMessageFile,
  extensionForVideoMime,
  isVideoMessageAttachment,
  isVideoMessageFile,
  pickVideoBitsPerSecond,
} from "./videoMessageRecording.ts";

describe("videoMessageRecording", () => {
  it("builds a video-message filename with extension", () => {
    const name = buildVideoMessageFileName("mp4", new Date("2026-09-02T10:11:12"));
    assert.match(name, /^video-message-\d{8}-\d{6}\.mp4$/);
  });

  it("creates a File with video type and video-message name", () => {
    const file = createVideoMessageFile(
      new Blob(["abc"], { type: "video/webm" }),
      "video/webm",
      "webm",
    );
    assert.equal(file instanceof File, true);
    assert.equal(file.type, "video/webm");
    assert.match(file.name, /^video-message-.+\.webm$/);
    assert.equal(isVideoMessageFile(file), true);
  });

  it("does not treat voice files as video messages", () => {
    const file = new File(["x"], "voice-message-1.webm", { type: "audio/webm" });
    assert.equal(isVideoMessageFile(file), false);
  });

  it("detects video attachments by mime, name, or extension", () => {
    assert.equal(isVideoMessageAttachment("video/mp4", "clip.mp4"), true);
    assert.equal(
      isVideoMessageAttachment("application/octet-stream", "video-message-1.webm"),
      true,
    );
    assert.equal(isVideoMessageAttachment("audio/webm", "voice-message.webm"), false);
    assert.equal(isVideoMessageAttachment("application/octet-stream", "voice-message-1.webm"), false);
    assert.equal(isVideoMessageAttachment("application/pdf", "doc.pdf"), false);
  });

  it("maps video mime types to extensions", () => {
    assert.equal(extensionForVideoMime("video/mp4"), "mp4");
    assert.equal(extensionForVideoMime("video/webm;codecs=vp8,opus"), "webm");
  });

  it("keeps bitrate inside the plan file budget", () => {
    const bits = pickVideoBitsPerSecond(25 * 1024 * 1024, 5 * 60);
    assert.ok(bits >= 180_000);
    assert.ok(bits <= 2_500_000);
    assert.ok((bits / 8) * 5 * 60 < 25 * 1024 * 1024);
  });
});
