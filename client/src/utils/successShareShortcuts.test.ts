import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DEFAULT_SUCCESS_SHARE_ORDER,
  moveShareShortcut,
  normalizeShareShortcutOrder,
  shareChannelHref,
  shareChannelKind,
} from "./successShareShortcuts";

describe("successShareShortcuts", () => {
  it("fills missing channels and drops unknowns", () => {
    assert.deepEqual(normalizeShareShortcutOrder(["slack", "nope", "email"]), [
      "slack",
      "email",
      "signal",
      "whatsapp",
      "qr",
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
    assert.equal(shareChannelHref("qr", url), null);
  });
});
