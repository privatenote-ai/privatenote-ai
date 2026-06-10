import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  noteUploadAuthorizationHeader,
  parseNoteUploadBearerToken,
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
});
