import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  attachmentChunkDownloadApiPath,
  attachmentUploadApiPath,
  noteFileChunkObjectKey,
  noteFileObjectPrefix,
  storedNoteAttachmentsFromPayload,
} from "./noteAttachments.ts";

describe("noteAttachments", () => {
  it("keeps index 0 on the legacy object and API paths", () => {
    assert.equal(noteFileChunkObjectKey("abc", 2), "note-files/abc/chunks/2");
    assert.equal(noteFileChunkObjectKey("abc", 2, 0), "note-files/abc/chunks/2");
    assert.equal(attachmentUploadApiPath("abc", 0), "/api/notes/abc/file");
    assert.equal(attachmentChunkDownloadApiPath("abc", 0, 3), "/api/notes/abc/file/chunks/3");
  });

  it("namespaces later attachments", () => {
    assert.equal(noteFileChunkObjectKey("abc", 2, 1), "note-files/abc/a/1/chunks/2");
    assert.equal(attachmentUploadApiPath("abc", 4), "/api/notes/abc/attachments/4/file");
    assert.equal(
      attachmentChunkDownloadApiPath("abc", 4, 3),
      "/api/notes/abc/attachments/4/file/chunks/3",
    );
    assert.equal(noteFileObjectPrefix("abc"), "note-files/abc/");
  });

  it("prefers the attachments list and falls back to the singular field", () => {
    assert.deepEqual(
      storedNoteAttachmentsFromPayload({ attachments: ["a", "b"], attachment: "legacy" }),
      ["a", "b"],
    );
    assert.deepEqual(storedNoteAttachmentsFromPayload({ attachment: "legacy" }), ["legacy"]);
    assert.deepEqual(storedNoteAttachmentsFromPayload({}), []);
  });
});
