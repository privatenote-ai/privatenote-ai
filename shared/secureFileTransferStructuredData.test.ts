import assert from "node:assert/strict";
import test from "node:test";
import { en } from "../client/src/utils/translations/en.ts";
import {
  buildSecureFileTransferFaqSchema,
  isSecureFileTransferRoute,
  SFT_FAQ_KEYS,
  stripPrerenderCloudflareAnalyticsBeacons,
} from "./secureFileTransferStructuredData.ts";

test("isSecureFileTransferRoute matches English and localized paths", () => {
  assert.equal(isSecureFileTransferRoute("/secure-file-transfer"), true);
  assert.equal(isSecureFileTransferRoute("/de/secure-file-transfer"), true);
  assert.equal(isSecureFileTransferRoute("/password-generator"), false);
});

test("buildSecureFileTransferFaqSchema includes all FAQ entries", () => {
  const schema = buildSecureFileTransferFaqSchema(en);
  assert.equal((schema.mainEntity as unknown[]).length, SFT_FAQ_KEYS.length);
});

test("stripPrerenderCloudflareAnalyticsBeacons removes beacon scripts", () => {
  const html =
    '<html><head></head><body><script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon=\'{"token":"x"}\'></script></body></html>';
  const stripped = stripPrerenderCloudflareAnalyticsBeacons(html);
  assert.equal(stripped.includes("cloudflareinsights.com"), false);
});
