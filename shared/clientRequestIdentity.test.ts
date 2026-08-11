import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readClientIpFromRequestHeaders, PN_CLIENT_IP_HEADER } from "./clientRequestIdentity.ts";

describe("client request identity", () => {
  it("prefers proxied visitor IP when X-Forwarded-Host is set", () => {
    const headers = new Headers({
      "x-forwarded-host": "premium.privatenote-ai.pages.dev",
      [PN_CLIENT_IP_HEADER]: "203.0.113.10",
      "CF-Connecting-IP": "10.0.0.1",
    });
    assert.equal(readClientIpFromRequestHeaders(headers), "203.0.113.10");
  });

  it("falls back to CF-Connecting-IP for direct Worker requests", () => {
    const headers = new Headers({
      "CF-Connecting-IP": "203.0.113.10",
    });
    assert.equal(readClientIpFromRequestHeaders(headers), "203.0.113.10");
  });
});
