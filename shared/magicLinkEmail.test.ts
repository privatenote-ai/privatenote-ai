import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildMagicLinkEmailContent,
  normalizeMagicLinkEmailPurpose,
} from "./magicLinkEmail.ts";
import { appendMagicLinkReturnTo, sanitizeAuthReturnTo } from "./sanitizeAuthReturnTo.ts";

describe("magicLinkEmail", () => {
  it("uses distinct title and CTA for default sign-in", () => {
    const { subject, html, text } = buildMagicLinkEmailContent({
      magicUrl: "https://privatenote.ai/magic?t=abc",
      locale: "en",
      purpose: "default",
    });
    assert.equal(subject, "Finish signing in to PrivateNote");
    assert.match(html, /Finish signing in/);
    assert.match(html, /Sign in securely/);
    assert.doesNotMatch(html, /Continue to PrivateNote/);
    assert.match(text, /10 minutes/);
    assert.match(html, /paste this link into your browser/i);
    assert.match(html, /privatenote\.ai\/magic\?t=abc/);
  });

  it("uses compact file-attach copy with linked fallback only in HTML", () => {
    const magicUrl = "https://privatenote.ai/magic?t=abc&returnTo=%2F";
    const { subject, html, text } = buildMagicLinkEmailContent({
      magicUrl,
      locale: "en",
      purpose: "file_attach",
    });
    assert.equal(subject, "Attach encrypted files");
    assert.match(html, /Attach encrypted files/);
    assert.match(html, /bring you back automatically/i);
    assert.match(html, /Sign in and attach files/);
    assert.match(html, /Button not working\?/);
    assert.match(html, /Use this sign-in link/);
    assert.match(html, /This link expires in 10 minutes/);
    assert.match(html, /End-to-end encrypted notes and file sharing/);
    assert.doesNotMatch(html, /word-break: break-all/);
    assert.ok(text.includes(magicUrl));
  });

  it("normalizes email purpose", () => {
    assert.equal(normalizeMagicLinkEmailPurpose("file_attach"), "file_attach");
    assert.equal(normalizeMagicLinkEmailPurpose("other"), "default");
  });
});

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
