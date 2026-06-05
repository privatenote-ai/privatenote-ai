import assert from "node:assert/strict";
import test from "node:test";
import {
  isPublicMarketingPath,
  normalizeMarketingPathname,
} from "./publicMarketingPaths.ts";

test("normalizeMarketingPathname strips trailing slash", () => {
  assert.equal(normalizeMarketingPathname("/terms/"), "/terms");
  assert.equal(normalizeMarketingPathname("/"), "/");
});

test("isPublicMarketingPath matches sitemap marketing URLs", () => {
  assert.equal(isPublicMarketingPath("/developers"), true);
  assert.equal(isPublicMarketingPath("/de/about/"), true);
  assert.equal(isPublicMarketingPath("/note/abc"), false);
});
