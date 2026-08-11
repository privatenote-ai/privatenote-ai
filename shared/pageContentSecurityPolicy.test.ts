import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildDevPageContentSecurityPolicy,
  buildPageContentSecurityPolicy,
  injectCspNonceIntoHtml,
} from "./pageContentSecurityPolicy.ts";

describe("page content security policy", () => {
  it("builds production CSP with nonce and strict-dynamic", () => {
    const csp = buildPageContentSecurityPolicy("abc123");
    assert.match(csp, /script-src 'self' 'nonce-abc123' 'strict-dynamic'/);
    assert.doesNotMatch(csp, /script-src[^;]*unsafe-inline/);
    assert.doesNotMatch(csp, /script-src[^;]*cdn\.jsdelivr\.net/);
  });

  it("allows blob URLs for decrypted attachment previews", () => {
    const csp = buildPageContentSecurityPolicy("abc123");
    assert.match(csp, /img-src[^;]*blob:/);
    assert.match(csp, /media-src[^;]*blob:/);
    assert.match(csp, /frame-src[^;]*blob:/);
    assert.match(csp, /frame-src[^;]*data:/);
  });

  it("builds dev CSP with unsafe-inline for Vite HMR", () => {
    const csp = buildDevPageContentSecurityPolicy();
    assert.match(csp, /script-src 'self' 'unsafe-inline'/);
  });

  it("injects nonce meta and script nonces", () => {
    const html = `<!DOCTYPE html><html><head><title>x</title></head><body><script defer src="/a.js"></script><script type="module" src="/b.js"></script></body></html>`;
    const out = injectCspNonceIntoHtml(html, "nonce-value");
    assert.match(out, /<meta name="csp-nonce" content="nonce-value"/);
    assert.match(out, /<script nonce="nonce-value" defer src="\/a.js">/);
    assert.match(out, /<script nonce="nonce-value" type="module" src="\/b.js">/);
  });

  it("updates an existing csp-nonce meta tag", () => {
    const html =
      '<html><head><meta name="csp-nonce" content="old" /><script src="/a.js"></script></head></html>';
    const out = injectCspNonceIntoHtml(html, "new-nonce");
    assert.match(out, /<meta name="csp-nonce" content="new-nonce"/);
    assert.doesNotMatch(out, /content="old"/);
  });
});
