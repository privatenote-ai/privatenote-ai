import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildMagicLinkEmailContent,
  buildRecipientVerificationEmailContent,
  detectAuthEmailLocale,
  normalizeMagicLinkEmailPurpose,
} from "./magicLinkEmail.ts";
import { appendMagicLinkReturnTo, sanitizeAuthReturnTo } from "./sanitizeAuthReturnTo.ts";

const SAMPLE_CODE = "238242";
const SAMPLE_URL = "https://premium.privatenote-ai.pages.dev/magic?t=abc";

describe("magicLinkEmail", () => {
  it("uses Cloudflare-style code + one-tap link for default sign-in", () => {
    const { subject, html, text } = buildMagicLinkEmailContent({
      magicUrl: SAMPLE_URL,
      signInCode: SAMPLE_CODE,
      locale: "en",
      purpose: "default",
    });
    assert.equal(subject, "Your PrivateNote sign-in code");
    assert.match(html, /Your PrivateNote sign-in code/);
    assert.match(html, />238242</);
    assert.match(html, /Or sign in with one tap/);
    assert.match(html, /Finish signing in to premium\.privatenote-ai\.pages\.dev below/);
    assert.match(html, /brand\/privateNote-logo-mark\.png/);
    assert.match(html, />privateNote</);
    assert.match(html, />Log in</);
    assert.match(html, /10 minutes or if you request a new code/);
    assert.match(text, /238242/);
    assert.match(text, /Or sign in with one tap/);
    assert.match(text, /premium\.privatenote-ai\.pages\.dev/);
  });

  it("uses file-attach copy with the same code layout", () => {
    const magicUrl = "https://privatenote.ai/magic?t=abc&returnTo=%2F";
    const { subject, html, text } = buildMagicLinkEmailContent({
      magicUrl,
      signInCode: SAMPLE_CODE,
      locale: "en",
      purpose: "file_attach",
    });
    assert.equal(subject, "Your PrivateNote sign-in code");
    assert.match(html, /Return to attach encrypted files on privatenote\.ai below/);
    assert.match(html, />238242</);
    assert.match(html, /Or sign in with one tap/);
    assert.match(html, /End-to-end encrypted notes and file sharing/);
    assert.ok(text.includes(magicUrl));
    assert.match(text, /238242/);
  });

  it("uses Dutch copy for nl locale", () => {
    const { subject, html } = buildMagicLinkEmailContent({
      magicUrl: SAMPLE_URL,
      signInCode: SAMPLE_CODE,
      locale: "nl",
      purpose: "default",
    });
    assert.equal(subject, "Je PrivateNote-inlogcode");
    assert.match(html, /Of log in met één tik/);
    assert.match(html, />Inloggen</);
  });

  it("builds branded recipient verification emails like signup", () => {
    const { subject, html, text } = buildRecipientVerificationEmailContent({
      verificationCode: SAMPLE_CODE,
      webOrigin: "https://premium.privatenote.ai",
    });
    assert.equal(subject, "Your PrivateNote verification code");
    assert.match(html, /Your PrivateNote verification code/);
    assert.match(html, />238242</);
    assert.match(html, /premium\.privatenote\.ai\/brand\/privateNote-logo-mark\.png/);
    assert.match(html, />privateNote</);
    assert.match(html, /#0000ff/);
    assert.match(html, /font-family:-apple-system/);
    assert.match(html, /Copyright &copy; PrivateNote\.ai/);
    assert.match(text, /238242/);
    assert.match(text, /Enter this code on the note page/);
  });

  it("detects Dutch from Accept-Language", () => {
    const request = new Request("https://privatenote.ai/", {
      headers: { "Accept-Language": "nl-NL,nl;q=0.9" },
    });
    assert.equal(detectAuthEmailLocale(request), "nl");
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
