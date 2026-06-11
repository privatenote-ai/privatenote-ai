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
  });

  it("uses file-attach copy when purpose is file_attach", () => {
    const { subject, html } = buildMagicLinkEmailContent({
      magicUrl: "https://privatenote.ai/magic?t=abc",
      locale: "en",
      purpose: "file_attach",
    });
    assert.equal(subject, "Sign in to attach encrypted files");
    assert.match(html, /Enable file sharing/);
    assert.match(html, /Sign in and attach files/);
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
