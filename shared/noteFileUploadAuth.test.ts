import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isValidAttachmentContentHash,
  noteUploadAuthorizationHeader,
  noteReservationClientMatches,
  noteReservationUploadClientMatches,
  parseNoteReserveAttachmentBinding,
  parseNoteUploadBearerToken,
  uploadedChunkHashKey,
} from "./noteFileUploadAuth.ts";

describe("note file upload auth", () => {
  it("parses Bearer upload tokens", () => {
    assert.equal(parseNoteUploadBearerToken("Bearer abc.def-ghi"), "abc.def-ghi");
    assert.equal(parseNoteUploadBearerToken("  Bearer   tok  "), "tok");
    assert.equal(parseNoteUploadBearerToken(null), null);
    assert.equal(parseNoteUploadBearerToken("Basic abc"), null);
    assert.equal(parseNoteUploadBearerToken("Bearer "), null);
  });

  it("builds Authorization headers", () => {
    assert.equal(noteUploadAuthorizationHeader("tok"), "Bearer tok");
  });

  it("parses reserve attachment size bindings", () => {
    assert.deepEqual(parseNoteReserveAttachmentBinding({
      attachmentPlaintextSize: 100,
      attachmentEncryptedSize: 117,
    }), {
      attachmentPlaintextSize: 100,
      attachmentEncryptedSize: 117,
    });
    assert.equal(parseNoteReserveAttachmentBinding({ attachmentPlaintextSize: 100 }), null);
    assert.equal(parseNoteReserveAttachmentBinding({ attachmentEncryptedSize: 50, attachmentPlaintextSize: 100 }), null);
    assert.equal(parseNoteReserveAttachmentBinding(null), null);
  });

  it("validates attachment content hashes", () => {
    assert.equal(isValidAttachmentContentHash("a".repeat(64)), true);
    assert.equal(isValidAttachmentContentHash("A".repeat(64)), true);
    assert.equal(isValidAttachmentContentHash("short"), false);
    assert.equal(isValidAttachmentContentHash(null), false);
  });

  it("uses string keys for uploaded chunk hashes", () => {
    assert.equal(uploadedChunkHashKey(0), "0");
    assert.equal(uploadedChunkHashKey(12), "12");
  });

  it("matches reservation client identifiers", () => {
    assert.equal(noteReservationClientMatches({ clientId: "abc" }, "abc"), true);
    assert.equal(noteReservationClientMatches({ clientId: "abc" }, "def"), false);
    assert.equal(noteReservationClientMatches({ clientId: "" }, "abc"), false);
    assert.equal(noteReservationClientMatches({}, "abc"), false);
    assert.equal(
      noteReservationClientMatches({ clientId: "ip:1.2.3.4|cid:abc" }, "ip:1.2.3.4"),
      true,
    );
    assert.equal(
      noteReservationClientMatches({ clientId: "ip:1.2.3.4|cid:abc" }, "ip:9.9.9.9"),
      false,
    );
  });

  it("matches upload clients by stored IP or client bucket", () => {
    assert.equal(
      noteReservationUploadClientMatches(
        { clientId: "ip:1.2.3.4|cid:abc", clientIp: "1.2.3.4" },
        "ip:9.9.9.9",
        "1.2.3.4",
      ),
      true,
    );
    assert.equal(
      noteReservationUploadClientMatches(
        { clientId: "ip:1.2.3.4|cid:abc", clientIp: "1.2.3.4" },
        "ip:9.9.9.9",
        "9.9.9.9",
      ),
      false,
    );
  });
});
