import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { categorizeReferrer, isSearchReferrer } from "./referrerCategory";

describe("categorizeReferrer", () => {
  it("maps known hosts to a closed list", () => {
    assert.equal(categorizeReferrer(""), "direct");
    assert.equal(categorizeReferrer("https://www.google.com/search?q=privatenote"), "google");
    assert.equal(categorizeReferrer("https://www.bing.com/"), "bing");
    assert.equal(categorizeReferrer("https://x.com/privatenote"), "x");
    assert.equal(categorizeReferrer("https://t.co/abc"), "x");
    assert.equal(categorizeReferrer("https://www.reddit.com/r/privacy"), "reddit");
    assert.equal(categorizeReferrer("https://www.linkedin.com/"), "linkedin");
    assert.equal(categorizeReferrer("https://github.com/privatenote-ai/privatenote"), "github");
    assert.equal(categorizeReferrer("https://www.npmjs.com/package/privatenote-mcp"), "npm");
    assert.equal(categorizeReferrer("https://chatgpt.com/"), "chatgpt");
    assert.equal(categorizeReferrer("https://claude.ai/chat/xyz"), "claude");
    assert.equal(categorizeReferrer("https://example.com/"), "other");
  });

  it("treats same-site referrers as direct", () => {
    assert.equal(categorizeReferrer("https://privatenote.ai/note/abc", "https://privatenote.ai"), "direct");
  });

  it("does not keep the original URL", () => {
    const type = categorizeReferrer("https://google.com/search?q=secret-note-title");
    assert.equal(type, "google");
    assert.equal(isSearchReferrer(type), true);
  });
});
