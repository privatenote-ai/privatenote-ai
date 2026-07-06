import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { appendMagicLinkReturnTo, sanitizeAuthReturnTo } from "./sanitizeAuthReturnTo.ts";

describe("sanitizeAuthReturnTo", () => {
  it("allows safe relative paths only", () => {
    assert.equal(sanitizeAuthReturnTo("/"), "/");
    assert.equal(sanitizeAuthReturnTo("/notes"), "/notes");
    assert.equal(sanitizeAuthReturnTo("//evil.com"), null);
    assert.equal(sanitizeAuthReturnTo("https://evil.com"), null);
    assert.equal(sanitizeAuthReturnTo("../admin"), null);
  });

  it("appends returnTo to magic links", () => {
    const url = appendMagicLinkReturnTo("https://privatenote.ai/magic?t=abc", "/");
    assert.equal(url, "https://privatenote.ai/magic?t=abc&returnTo=%2F");
  });
});
