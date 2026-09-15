import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { deriveSuccessHeadlineKind } from "./successHeadline";
import {
  DEFAULT_SUCCESS_SHARE_ORDER,
  PINNED_SUCCESS_SHARE_COUNT,
  moveShareShortcut,
  normalizeShareShortcutOrder,
  shareChannelHref,
  shareChannelKind,
} from "./successShareShortcuts";

describe("successShareShortcuts", () => {
  it("pins Email, Signal, QR, WhatsApp, Slack, and Share by default", () => {
    assert.deepEqual(DEFAULT_SUCCESS_SHARE_ORDER.slice(0, PINNED_SUCCESS_SHARE_COUNT), [
      "email",
      "signal",
      "qr",
      "whatsapp",
      "slack",
      "device",
    ]);
    assert.equal(PINNED_SUCCESS_SHARE_COUNT, 6);
  });

  it("fills missing channels and drops unknowns", () => {
    assert.deepEqual(normalizeShareShortcutOrder(["slack", "nope", "email"]), [
      "slack",
      "email",
      "signal",
      "qr",
      "whatsapp",
      "device",
      "telegram",
      "discord",
      "teams",
      "sms",
    ]);
  });

  it("moves a shortcut without dropping others", () => {
    const next = moveShareShortcut(DEFAULT_SUCCESS_SHARE_ORDER, "telegram", 0);
    assert.equal(next[0], "telegram");
    assert.equal(next[1], "email");
    assert.equal(next.length, DEFAULT_SUCCESS_SHARE_ORDER.length);
  });

  it("builds share hrefs for messaging apps that have them", () => {
    const url = "https://premium.privatenote.ai/note/abc#key";
    assert.match(shareChannelHref("telegram", url) ?? "", /t\.me\/share/);
    assert.match(shareChannelHref("teams", url) ?? "", /teams\.microsoft\.com\/share/);
    assert.equal(shareChannelKind("signal"), "link");
    assert.equal(shareChannelKind("discord"), "copy-app");
    assert.equal(shareChannelKind("device"), "native");
    assert.equal(shareChannelHref("qr", url), null);
    assert.equal(shareChannelHref("device", url), null);
  });
});

describe("deriveSuccessHeadlineKind", () => {
  it("uses file, password, photo, then note", () => {
    assert.equal(
      deriveSuccessHeadlineKind({
        isFileTransfer: true,
        files: [{ type: "image/jpeg" }],
        noteBody: "",
      }),
      "file",
    );
    assert.equal(
      deriveSuccessHeadlineKind({
        isFileTransfer: false,
        creationEntryPoint: "password-share",
        files: [],
        noteBody: "hunter2",
      }),
      "password",
    );
    assert.equal(
      deriveSuccessHeadlineKind({
        isFileTransfer: false,
        files: [{ type: "image/jpeg" }],
        noteBody: "  ",
      }),
      "photo",
    );
    assert.equal(
      deriveSuccessHeadlineKind({
        isFileTransfer: false,
        files: [{ type: "image/jpeg" }],
        noteBody: "See attached",
      }),
      "note",
    );
    assert.equal(
      deriveSuccessHeadlineKind({
        isFileTransfer: false,
        files: [],
        noteBody: "",
      }),
      "note",
    );
  });
});
