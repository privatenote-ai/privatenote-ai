import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  formatTextPreview,
  getAttachmentPreviewKind,
} from "./attachmentPreviewKind.ts";

describe("getAttachmentPreviewKind", () => {
  it("classifies pdf, image, audio, video, and text", () => {
    assert.equal(getAttachmentPreviewKind("application/pdf", "contract.pdf"), "pdf");
    assert.equal(getAttachmentPreviewKind("image/jpeg", "photo.jpg"), "image");
    assert.equal(getAttachmentPreviewKind("audio/webm", "clip.webm"), "audio");
    assert.equal(getAttachmentPreviewKind("video/mp4", "clip.mp4"), "video");
    assert.equal(getAttachmentPreviewKind("text/plain", "notes.txt"), "text");
    assert.equal(getAttachmentPreviewKind("application/json", "config.json"), "text");
  });

  it("falls back to the file extension when the mime is generic", () => {
    assert.equal(getAttachmentPreviewKind("application/octet-stream", "report.pdf"), "pdf");
    assert.equal(getAttachmentPreviewKind("application/octet-stream", "clip.mp4"), "video");
    assert.equal(getAttachmentPreviewKind("application/octet-stream", "readme.md"), "text");
    assert.equal(getAttachmentPreviewKind("application/octet-stream", "voice-message-1.m4a"), "audio");
  });

  it("does not preview archives and office files", () => {
    assert.equal(getAttachmentPreviewKind("application/zip", "bundle.zip"), null);
    assert.equal(getAttachmentPreviewKind("application/vnd.openxmlformats-officedocument.wordprocessingml.document", "letter.docx"), null);
  });
});

describe("formatTextPreview", () => {
  it("pretty-prints json and leaves invalid json alone", () => {
    assert.equal(formatTextPreview('{"a":1}', "application/json"), '{\n  "a": 1\n}');
    assert.equal(formatTextPreview("{nope", "application/json"), "{nope");
  });
});
