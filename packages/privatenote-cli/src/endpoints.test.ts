import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveEndpoints, parseAllowedHosts } from "./endpoints.ts";

const DEFAULT = "https://privatenote.ai";

describe("resolveEndpoints", () => {
  it("defaults both origins to production HTTPS", () => {
    const out = resolveEndpoints({ defaultApiBaseUrl: DEFAULT });
    assert.equal(out.apiBaseUrl, "https://privatenote.ai");
    assert.equal(out.webOrigin, "https://privatenote.ai");
  });

  it("defaults web origin to api base when web is omitted", () => {
    const out = resolveEndpoints({
      defaultApiBaseUrl: DEFAULT,
      apiBaseUrlRaw: "https://notes.example.com",
    });
    assert.equal(out.apiBaseUrl, "https://notes.example.com");
    assert.equal(out.webOrigin, "https://notes.example.com");
  });

  it("rejects http api without --insecure", () => {
    assert.throws(
      () =>
        resolveEndpoints({
          defaultApiBaseUrl: DEFAULT,
          apiBaseUrlRaw: "http://localhost:8787",
        }),
      /must use HTTPS/,
    );
  });

  it("allows http with --insecure", () => {
    const out = resolveEndpoints({
      defaultApiBaseUrl: DEFAULT,
      apiBaseUrlRaw: "http://localhost:8787",
      allowInsecure: true,
    });
    assert.equal(out.apiBaseUrl, "http://localhost:8787");
    assert.equal(out.webOrigin, "http://localhost:8787");
  });

  it("rejects mismatched origins", () => {
    assert.throws(
      () =>
        resolveEndpoints({
          defaultApiBaseUrl: DEFAULT,
          apiBaseUrlRaw: "https://privatenote.ai",
          webOriginRaw: "https://evil.example",
        }),
      /must match/,
    );
  });

  it("allows mismatched origins with explicit opt-in", () => {
    const out = resolveEndpoints({
      defaultApiBaseUrl: DEFAULT,
      apiBaseUrlRaw: "https://privatenote.ai",
      webOriginRaw: "https://evil.example",
      allowOriginMismatch: true,
    });
    assert.equal(out.webOrigin, "https://evil.example");
  });

  it("rejects origins with paths", () => {
    assert.throws(
      () =>
        resolveEndpoints({
          defaultApiBaseUrl: DEFAULT,
          apiBaseUrlRaw: "https://privatenote.ai/api",
        }),
      /origin only/,
    );
  });

  it("allows hosts on the enterprise allowlist", () => {
    const out = resolveEndpoints({
      defaultApiBaseUrl: DEFAULT,
      allowedHostsRaw: "privatenote.ai",
    });
    assert.equal(out.apiBaseUrl, "https://privatenote.ai");
  });

  it("rejects hosts outside the enterprise allowlist", () => {
    assert.throws(
      () =>
        resolveEndpoints({
          defaultApiBaseUrl: DEFAULT,
          apiBaseUrlRaw: "https://evil.example",
          allowedHostsRaw: "privatenote.ai",
        }),
      /not allowed/,
    );
  });

  it("allows subdomains of an allowlisted host", () => {
    const out = resolveEndpoints({
      defaultApiBaseUrl: DEFAULT,
      apiBaseUrlRaw: "https://notes.privatenote.ai",
      allowedHostsRaw: "privatenote.ai",
    });
    assert.equal(out.apiBaseUrl, "https://notes.privatenote.ai");
  });
});

describe("parseAllowedHosts", () => {
  it("returns null for empty input", () => {
    assert.equal(parseAllowedHosts(undefined), null);
    assert.equal(parseAllowedHosts("  "), null);
  });

  it("parses comma-separated hostnames", () => {
    assert.deepEqual(parseAllowedHosts("privatenote.ai, notes.example.com"), [
      "privatenote.ai",
      "notes.example.com",
    ]);
  });
});
