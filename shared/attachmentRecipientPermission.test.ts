import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isAttachmentRecipientPermission,
  parseAttachmentRecipientPermission,
} from "./attachmentRecipientPermission.ts";

describe("attachmentRecipientPermission", () => {
  it("accepts the allowlisted tokens", () => {
    assert.equal(isAttachmentRecipientPermission("download"), true);
    assert.equal(isAttachmentRecipientPermission("view-only"), true);
    assert.equal(isAttachmentRecipientPermission("print"), false);
    assert.equal(isAttachmentRecipientPermission(""), false);
  });

  it("only persists view-only", () => {
    assert.equal(parseAttachmentRecipientPermission("view-only"), "view-only");
    assert.equal(parseAttachmentRecipientPermission("download"), undefined);
    assert.equal(parseAttachmentRecipientPermission("system"), undefined);
    assert.equal(parseAttachmentRecipientPermission(null), undefined);
    assert.equal(parseAttachmentRecipientPermission({ id: "view-only" }), undefined);
  });
});
