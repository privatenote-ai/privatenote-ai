import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildRecipientNoteLinkEmail, parseDeliverableNoteUrl } from "./noteLinkDelivery.ts";

describe("parseDeliverableNoteUrl", () => {
  const noteId = "550e8400-e29b-41d4-a716-446655440000";
  const key = "abcdefghijklmnopqrstuvwxyz012345";

  it("accepts a trusted https note url with fragment", () => {
    const result = parseDeliverableNoteUrl(
      `https://privatenote.ai/note/${noteId}#${key}`,
      noteId,
      { allowedHosts: ["privatenote.ai"] },
    );
    assert.equal(result.ok, true);
  });

  it("rejects host not in allow-list", () => {
    const result = parseDeliverableNoteUrl(
      `https://evil.example/note/${noteId}#${key}`,
      noteId,
      { allowedHosts: ["privatenote.ai"] },
    );
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.error, "untrusted_host");
  });

  it("rejects missing fragment key", () => {
    const result = parseDeliverableNoteUrl(
      `https://privatenote.ai/note/${noteId}`,
      noteId,
      { allowedHosts: ["privatenote.ai"] },
    );
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.error, "missing_key_fragment");
  });

  it("rejects note id mismatch", () => {
    const result = parseDeliverableNoteUrl(
      `https://privatenote.ai/note/${noteId}#${key}`,
      "00000000-0000-4000-8000-000000000000",
      { allowedHosts: ["privatenote.ai"] },
    );
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.error, "note_id_mismatch");
  });
});

describe("buildRecipientNoteLinkEmail", () => {
  it("includes sender when provided", () => {
    const mail = buildRecipientNoteLinkEmail({
      noteUrl: "https://privatenote.ai/note/x#keymaterial123456",
      senderEmail: "alex@example.com",
    });
    assert.match(mail.subject, /^PrivateNote: alex@example.com/);
    assert.match(mail.text, /^PrivateNote\.ai/m);
    assert.match(mail.text, /alex@example.com/);
    assert.match(mail.html, /Open private note/);
    assert.match(mail.html, /You received a private note/);
  });

  it("uses brand logo, wordmark, and product footer", () => {
    const mail = buildRecipientNoteLinkEmail({
      noteUrl: "https://premium.privatenote.ai/note/550e8400-e29b-41d4-a716-446655440000#abcdefghijklmnopqrstuvwxyz012345",
      senderEmail: "alex@example.com",
    });
    assert.match(mail.html, /premium\.privatenote\.ai\/brand\/privateNote-logo-mark\.png/);
    assert.match(mail.html, /alt="PrivateNote"/);
    assert.match(mail.html, /privateNote/);
    assert.match(mail.html, /PrivateNote link/);
    assert.match(mail.html, /border-radius:12px/);
    assert.match(mail.html, /Copyright &copy; PrivateNote\.ai/);
    assert.match(
      mail.html,
      /End-to-end encrypted private notes — only you and your recipients can read them\./,
    );
    assert.match(mail.html, /www\.privatenote\.ai/);
    assert.match(mail.text, /End-to-end encrypted private notes/);
    assert.match(mail.text, /end-to-end encrypted PrivateNote/);
  });
});
