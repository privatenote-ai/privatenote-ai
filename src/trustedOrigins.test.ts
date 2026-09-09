import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getSessionCookieKindForRequest,
  isChromeExtensionOrigin,
  isPagesPreviewBrowserOrigin,
  isTrustedBrowserOrigin,
  isWebAuthnRpAllowedOrigin,
} from "./trustedOrigins.ts";

describe("isTrustedBrowserOrigin", () => {
  it("allows explicit allowlist entries", () => {
    assert.equal(isTrustedBrowserOrigin("https://privatenote-ai.pages.dev"), true);
    assert.equal(isTrustedBrowserOrigin("https://premium.privatenote-ai.pages.dev"), true);
    assert.equal(isTrustedBrowserOrigin("https://develop.privatenote-ai.pages.dev"), true);
    assert.equal(isTrustedBrowserOrigin("https://privatenote.ai"), true);
    assert.equal(isTrustedBrowserOrigin("http://localhost:5180"), true);
    assert.equal(isTrustedBrowserOrigin("http://localhost:5181"), true);
    assert.equal(isTrustedBrowserOrigin("https://localhost:5180"), true);
  });

  it("allows https loopback dev (Vite TLS / Turnstile)", () => {
    assert.equal(isTrustedBrowserOrigin("https://localhost:5173"), true);
    assert.equal(isTrustedBrowserOrigin("https://localhost:5174"), true);
    assert.equal(isTrustedBrowserOrigin("https://127.0.0.1:5173"), true);
    assert.equal(isTrustedBrowserOrigin("https://127.0.0.1:5174"), true);
  });

  it("allows branch preview hostnames for this Pages project only", () => {
    assert.equal(isTrustedBrowserOrigin("https://main.privatenote-ai.pages.dev"), true);
  });

  it("rejects other Cloudflare Pages projects", () => {
    assert.equal(isTrustedBrowserOrigin("https://evil.pages.dev"), false);
    assert.equal(isTrustedBrowserOrigin("https://evilprivatenote-ai.pages.dev"), false);
  });

  it("rejects substring-localhost tricks", () => {
    assert.equal(isTrustedBrowserOrigin("https://localhost.evil.example"), false);
    assert.equal(isTrustedBrowserOrigin("https://notlocalhost:5173"), false);
  });

  it("rejects wrong local ports", () => {
    assert.equal(isTrustedBrowserOrigin("http://localhost:9999"), false);
    assert.equal(isTrustedBrowserOrigin("https://localhost:9999"), false);
  });

  it("allows explicit privatenote.ai web hosts", () => {
    assert.equal(isTrustedBrowserOrigin("https://app.privatenote.ai"), true);
    assert.equal(isTrustedBrowserOrigin("https://premium.privatenote.ai"), true);
    assert.equal(isTrustedBrowserOrigin("https://www.privatenote.ai"), true);
  });

  it("rejects privatenote.ai hosts that are not in the web allowlist", () => {
    assert.equal(isTrustedBrowserOrigin("https://untrusted.privatenote.ai"), false);
  });

  it("rejects lookalike registrable-style hosts", () => {
    assert.equal(isTrustedBrowserOrigin("https://evilprivatenote.ai"), false);
  });

  it("allows Chrome extension origins", () => {
    assert.equal(isChromeExtensionOrigin("chrome-extension://abcdefghijklmnop"), true);
    assert.equal(isTrustedBrowserOrigin("chrome-extension://abcdefghijklmnop"), true);
    assert.equal(isChromeExtensionOrigin("https://privatenote.ai"), false);
  });

  it("does not allow Chrome extension origins for WebAuthn rpID selection", () => {
    assert.equal(isWebAuthnRpAllowedOrigin("chrome-extension://abcdefghijklmnop"), false);
  });
});

describe("isWebAuthnRpAllowedOrigin", () => {
  it("allows production Pages hosts and canonical app origins", () => {
    assert.equal(isWebAuthnRpAllowedOrigin("https://privatenote-ai.pages.dev"), true);
    assert.equal(isWebAuthnRpAllowedOrigin("https://premium.privatenote-ai.pages.dev"), true);
    assert.equal(isWebAuthnRpAllowedOrigin("https://develop.privatenote-ai.pages.dev"), true);
    assert.equal(isWebAuthnRpAllowedOrigin("https://privatenote.ai"), true);
    assert.equal(isWebAuthnRpAllowedOrigin("https://app.privatenote.ai"), true);
    assert.equal(isWebAuthnRpAllowedOrigin("https://premium.privatenote.ai"), true);
    assert.equal(isWebAuthnRpAllowedOrigin("http://localhost:5173"), true);
    assert.equal(isWebAuthnRpAllowedOrigin("https://localhost:5174"), true);
  });

  it("rejects branch/PR Pages previews even though they are API-trusted origins", () => {
    assert.equal(isTrustedBrowserOrigin("https://main.privatenote-ai.pages.dev"), true);
    assert.equal(isWebAuthnRpAllowedOrigin("https://main.privatenote-ai.pages.dev"), false);
    assert.equal(isWebAuthnRpAllowedOrigin("https://feat--x.privatenote-ai.pages.dev"), false);
  });
});

describe("isPagesPreviewBrowserOrigin", () => {
  it("treats branch Pages URLs as preview", () => {
    assert.equal(isPagesPreviewBrowserOrigin("https://feat--x.privatenote-ai.pages.dev"), true);
    assert.equal(isPagesPreviewBrowserOrigin("https://main.privatenote-ai.pages.dev"), true);
  });

  it("treats production Pages web hosts as non-preview", () => {
    assert.equal(isPagesPreviewBrowserOrigin("https://privatenote-ai.pages.dev"), false);
    assert.equal(isPagesPreviewBrowserOrigin("https://premium.privatenote-ai.pages.dev"), false);
    assert.equal(isPagesPreviewBrowserOrigin("https://develop.privatenote-ai.pages.dev"), false);
  });

  it("rejects non-Pages and non-project hosts", () => {
    assert.equal(isPagesPreviewBrowserOrigin("https://privatenote.ai"), false);
    assert.equal(isPagesPreviewBrowserOrigin("https://evil.pages.dev"), false);
  });
});

describe("getSessionCookieKindForRequest", () => {
  it("uses preview cookie kind for preview Pages Origin", () => {
    const req = new Request("https://api.example.test/api/x", {
      headers: { Origin: "https://abc123.privatenote-ai.pages.dev" },
    });
    assert.equal(getSessionCookieKindForRequest(req), "preview");
  });

  it("uses prod cookie kind for production Pages Origin", () => {
    const req = new Request("https://api.example.test/api/x", {
      headers: { Origin: "https://privatenote-ai.pages.dev" },
    });
    assert.equal(getSessionCookieKindForRequest(req), "prod");
  });

  it("uses prod cookie kind for premium and develop staging branch hosts", () => {
    for (const host of [
      "https://premium.privatenote-ai.pages.dev",
      "https://develop.privatenote-ai.pages.dev",
    ]) {
      const req = new Request("https://api.example.test/api/x", {
        headers: { Origin: host },
      });
      assert.equal(getSessionCookieKindForRequest(req), "prod");
    }
  });

  it("uses prod cookie kind for privatenote.ai", () => {
    const req = new Request("https://api.example.test/api/x", {
      headers: { Origin: "https://app.privatenote.ai" },
    });
    assert.equal(getSessionCookieKindForRequest(req), "prod");
  });

  it("falls back to Referer when Origin is missing", () => {
    const req = new Request("https://api.example.test/api/x", {
      headers: { Referer: "https://branch.privatenote-ai.pages.dev/dashboard" },
    });
    assert.equal(getSessionCookieKindForRequest(req), "preview");
  });

  it("falls back to X-Forwarded-Host when Origin and Referer are missing (Safari same-origin GET via Pages proxy)", () => {
    const req = new Request("https://api.example.test/api/x", {
      headers: { "X-Forwarded-Host": "branch.privatenote-ai.pages.dev" },
    });
    assert.equal(getSessionCookieKindForRequest(req), "preview");
  });

  it("X-Forwarded-Host pointing at a production Pages host stays prod", () => {
    const req = new Request("https://api.example.test/api/x", {
      headers: { "X-Forwarded-Host": "privatenote-ai.pages.dev" },
    });
    assert.equal(getSessionCookieKindForRequest(req), "prod");
  });

  it("X-Forwarded-Host pointing at an untrusted host stays prod (does not grant trust)", () => {
    const req = new Request("https://api.example.test/api/x", {
      headers: { "X-Forwarded-Host": "evil.pages.dev" },
    });
    assert.equal(getSessionCookieKindForRequest(req), "prod");
  });

  it("defaults to prod when Origin / Referer / X-Forwarded-Host are all missing", () => {
    const req = new Request("https://api.example.test/api/x");
    assert.equal(getSessionCookieKindForRequest(req), "prod");
  });

  it("Origin still wins over X-Forwarded-Host (X-Forwarded-Host is only a last-resort fallback)", () => {
    const req = new Request("https://api.example.test/api/x", {
      headers: {
        Origin: "https://privatenote-ai.pages.dev",
        "X-Forwarded-Host": "branch.privatenote-ai.pages.dev",
      },
    });
    assert.equal(getSessionCookieKindForRequest(req), "prod");
  });
});
