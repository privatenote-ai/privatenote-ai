import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildDevPageContentSecurityPolicy,
  buildPageContentSecurityPolicy,
  injectCspNonceIntoHtml,
} from "./pageContentSecurityPolicy.ts";
import {
  apiWorkerOriginForAppHostname,
  DEFAULT_API_WORKER_ORIGIN,
  PRODUCTION_UPLOAD_WORKER_ORIGIN,
  STAGING_API_WORKER_ORIGIN,
  STAGING_UPLOAD_WORKER_ORIGIN,
  uploadWorkerOriginForAppHostname,
} from "./apiWorkerOrigin.ts";

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

  it("allows same-origin page iframes for admin heatmap previews", () => {
    const csp = buildPageContentSecurityPolicy("abc123");
    assert.match(csp, /frame-src 'self'/);
    assert.match(csp, /frame-ancestors 'self'/);
    assert.doesNotMatch(csp, /frame-ancestors 'none'/);
  });

  it("allows direct uploads to both production and staging API Workers", () => {
    const csp = buildPageContentSecurityPolicy("abc123");
    assert.match(csp, /https:\/\/privatenote-api\.marjan-skrobot\.workers\.dev/);
    assert.match(csp, /https:\/\/privatenote-api-staging\.marjan-skrobot\.workers\.dev/);
  });

  it("allows browser PUTs to R2 S3 API for large attachments", () => {
    const csp = buildPageContentSecurityPolicy("abc123");
    assert.match(csp, /https:\/\/\*\.r2\.cloudflarestorage\.com/);
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

describe("API Worker origin resolution", () => {
  it("uses staging for the premium and develop Pages branches", () => {
    assert.equal(
      apiWorkerOriginForAppHostname("premium.privatenote-ai.pages.dev"),
      STAGING_API_WORKER_ORIGIN,
    );
    assert.equal(
      apiWorkerOriginForAppHostname("develop.privatenote-ai.pages.dev"),
      STAGING_API_WORKER_ORIGIN,
    );
  });

  it("uses staging for the same-site premium custom domain", () => {
    assert.equal(
      apiWorkerOriginForAppHostname("premium.privatenote.ai"),
      STAGING_API_WORKER_ORIGIN,
    );
    assert.equal(
      apiWorkerOriginForAppHostname(
        "premium.privatenote.ai",
        DEFAULT_API_WORKER_ORIGIN,
      ),
      STAGING_API_WORKER_ORIGIN,
    );
  });

  it("does not let a compiled production URL override a staging hostname", () => {
    assert.equal(
      apiWorkerOriginForAppHostname(
        "premium.privatenote-ai.pages.dev",
        DEFAULT_API_WORKER_ORIGIN,
      ),
      STAGING_API_WORKER_ORIGIN,
    );
  });

  it("uses production by default for production and immutable preview hosts", () => {
    assert.equal(apiWorkerOriginForAppHostname("privatenote.ai"), DEFAULT_API_WORKER_ORIGIN);
    assert.equal(
      apiWorkerOriginForAppHostname("abc123.privatenote-ai.pages.dev"),
      DEFAULT_API_WORKER_ORIGIN,
    );
  });

  it("normalizes an explicitly configured origin outside staging", () => {
    assert.equal(
      apiWorkerOriginForAppHostname("localhost", "api.example.test/"),
      "https://api.example.test",
    );
  });
});

describe("upload Worker origin resolution", () => {
  it("uses staging for the premium and develop Pages branches", () => {
    assert.equal(
      uploadWorkerOriginForAppHostname("premium.privatenote-ai.pages.dev"),
      STAGING_UPLOAD_WORKER_ORIGIN,
    );
    assert.equal(
      uploadWorkerOriginForAppHostname("develop.privatenote-ai.pages.dev"),
      STAGING_UPLOAD_WORKER_ORIGIN,
    );
  });

  it("uses staging upload relay on the same-site premium custom domain", () => {
    assert.equal(
      uploadWorkerOriginForAppHostname("premium.privatenote.ai"),
      STAGING_UPLOAD_WORKER_ORIGIN,
    );
  });

  it("uses production elsewhere", () => {
    assert.equal(
      uploadWorkerOriginForAppHostname("privatenote.ai"),
      PRODUCTION_UPLOAD_WORKER_ORIGIN,
    );
  });
});
