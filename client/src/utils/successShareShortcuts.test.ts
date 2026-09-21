import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { deriveSuccessHeadlineKind } from "./successHeadline";
import {
  DEFAULT_SUCCESS_SHARE_ORDER,
  PINNED_SUCCESS_SHARE_COUNT,
  moveShareShortcut,
  normalizeShareShortcutOrder,
  shareChannelCopiesLink,
  shareChannelHref,
  shareChannelKind,
  shareChannelOpensInSameWindow,
} from "./successShareShortcuts";

describe("successShareShortcuts", () => {
  it("pins Email, Signal, QR, WhatsApp, Teams, and Share by default", () => {
    assert.deepEqual(DEFAULT_SUCCESS_SHARE_ORDER.slice(0, PINNED_SUCCESS_SHARE_COUNT), [
      "email",
      "signal",
      "qr",
      "whatsapp",
      "teams",
      "device",
    ]);
    assert.equal(PINNED_SUCCESS_SHARE_COUNT, 6);
    assert.equal(DEFAULT_SUCCESS_SHARE_ORDER.includes("slack" as never), false);
    assert.equal(DEFAULT_SUCCESS_SHARE_ORDER.includes("discord" as never), false);
    assert.ok(
      DEFAULT_SUCCESS_SHARE_ORDER.indexOf("teams") <
        DEFAULT_SUCCESS_SHARE_ORDER.indexOf("telegram"),
    );
  });

  it("fills missing channels, drops unknowns, and ignores retired Slack/Discord ids", () => {
    assert.deepEqual(normalizeShareShortcutOrder(["teams", "nope", "email", "slack", "discord"]), [
      "teams",
      "email",
      "signal",
      "qr",
      "whatsapp",
      "device",
      "telegram",
      "sms",
    ]);
  });

  it("moves a shortcut without dropping others", () => {
    const next = moveShareShortcut(DEFAULT_SUCCESS_SHARE_ORDER, "sms", 0);
    assert.equal(next[0], "sms");
    assert.equal(next[1], "email");
    assert.equal(next.length, DEFAULT_SUCCESS_SHARE_ORDER.length);
  });

  it("opens installed apps via protocols instead of marketing websites", () => {
    const url = "https://premium.privatenote.ai/note/abc#key";
    const encoded = encodeURIComponent(url);

    assert.equal(shareChannelHref("whatsapp", url), `whatsapp://send?text=${encoded}`);
    assert.equal(shareChannelHref("telegram", url), `tg://msg_url?url=${encoded}`);
    assert.equal(
      shareChannelHref("teams", url),
      `msteams://teams.microsoft.com/l/chat/0/0?message=${encoded}`,
    );
    assert.equal(shareChannelHref("signal", url), `sgnl://send?text=${encoded}`);
    assert.match(shareChannelHref("email", url) ?? "", /^mailto:/);
    assert.match(shareChannelHref("sms", url) ?? "", /^sms:/);

    for (const id of ["whatsapp", "telegram", "teams", "signal"] as const) {
      assert.equal(shareChannelOpensInSameWindow(id), true);
      assert.doesNotMatch(shareChannelHref(id, url) ?? "", /https:\/\//);
    }

    assert.equal(shareChannelCopiesLink("teams"), true);
    assert.equal(shareChannelCopiesLink("signal"), true);
    assert.equal(shareChannelCopiesLink("whatsapp"), false);
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
