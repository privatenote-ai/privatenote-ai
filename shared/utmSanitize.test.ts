import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readUtmFromSearchParams, sanitizeUtmValue } from "./utmSanitize";

describe("sanitizeUtmValue", () => {
  it("accepts campaign values used on PrivateNote X posts", () => {
    assert.equal(sanitizeUtmValue("x"), "x");
    assert.equal(sanitizeUtmValue("social"), "social");
    assert.equal(sanitizeUtmValue("mcp"), "mcp");
    assert.equal(sanitizeUtmValue("agent-secrets"), "agent-secrets");
  });

  it("rejects values that look like secrets or URLs", () => {
    assert.equal(sanitizeUtmValue("https://evil.example/steal"), null);
    assert.equal(sanitizeUtmValue("user@example.com"), null);
    assert.equal(sanitizeUtmValue("a".repeat(80)), null);
    assert.equal(sanitizeUtmValue("has space"), null);
  });

  it("reads only utm_* keys from a query string", () => {
    const utm = readUtmFromSearchParams(
      "?utm_source=x&utm_medium=social&utm_campaign=mcp&utm_content=agent-secrets&email=a@b.c&note=secret",
    );
    assert.equal(utm.source, "x");
    assert.equal(utm.campaign, "mcp");
    assert.equal(utm.content, "agent-secrets");
  });
});
