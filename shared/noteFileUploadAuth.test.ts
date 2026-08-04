import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isValidAttachmentContentHash,
  noteReservationExpirationTtlSeconds,
  noteUploadAuthorizationHeader,
  noteUploadQueryParam,
  noteReservationClientMatches,
  noteReservationUploadClientMatches,
  parseNoteReserveAttachmentBinding,
  parseNoteUploadBearerToken,
  redactNoteUploadTokenInUrl,
  resolveNoteUploadToken,
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

  it("prefers Bearer over query and reports via", () => {
    assert.deepEqual(
      resolveNoteUploadToken({
        authorizationHeader: "Bearer bearer-tok",
        requestUrl: "https://upload.example/api/notes/x/file?uploadToken=query-tok",
      }),
      { token: "bearer-tok", via: "bearer" },
    );
    assert.deepEqual(
      resolveNoteUploadToken({
        authorizationHeader: null,
        requestUrl: "https://upload.example/api/notes/x/file?uploadToken=query-tok",
      }),
      { token: "query-tok", via: "query" },
    );
    assert.equal(
      resolveNoteUploadToken({ authorizationHeader: null, requestUrl: "https://upload.example/file" }),
      null,
    );
  });

  it("redacts upload tokens in URLs", () => {
    assert.equal(
      redactNoteUploadTokenInUrl("https://upload.example/file?uploadToken=secret&x=1"),
      "https://upload.example/file?uploadToken=%5Bredacted%5D&x=1",
    );
  });

  it("shortens reservation TTL after upload completes", () => {
    assert.equal(
      noteReservationExpirationTtlSeconds(
        { fileStorageUserId: "u1", uploadCompletedAt: "2026-01-01T00:00:00.000Z" },
        { attachmentTtlSeconds: 900, noteTtlSeconds: 1800, postUploadFinalizeTtlSeconds: 300 },
      ),
      300,
    );
    assert.equal(
      noteReservationExpirationTtlSeconds(
        { fileStorageUserId: "u1" },
        { attachmentTtlSeconds: 900, noteTtlSeconds: 1800, postUploadFinalizeTtlSeconds: 300 },
      ),
      900,
    );
  });

  it("builds Authorization headers", () => {
    assert.equal(noteUploadAuthorizationHeader("tok"), "Bearer tok");
  });

  it("builds upload token query params", () => {
    assert.equal(noteUploadQueryParam("tok:/?"), "uploadToken=tok%3A%2F%3F");
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
      noteReservationClientMatches({ clientId: "ip:1.2.3.4|cid:abc" }, "ip:9.9.9.9|cid:abc"),
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
