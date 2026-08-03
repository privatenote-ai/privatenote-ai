import assert from "node:assert/strict";
import test from "node:test";
import {
  isLocalizedSecurityGuideTopic,
  localizedSecurityGuidePath,
  LOCALIZED_SECURITY_GUIDE_MARKETING_PATHS,
} from "./localizedSecurityGuides.ts";

test("localizedSecurityGuidePath mirrors vpn and password under locale prefixes", () => {
  assert.equal(localizedSecurityGuidePath("vpn", "en"), "/security-guides/vpn");
  assert.equal(localizedSecurityGuidePath("vpn", "de"), "/de/security-guides/vpn");
  assert.equal(localizedSecurityGuidePath("password", "fr"), "/fr/security-guides/password");
});

test("LOCALIZED_SECURITY_GUIDE_MARKETING_PATHS includes 18 mirrored routes", () => {
  assert.equal(LOCALIZED_SECURITY_GUIDE_MARKETING_PATHS.length, 18);
  assert.ok(LOCALIZED_SECURITY_GUIDE_MARKETING_PATHS.includes("/de/security-guides/vpn"));
  assert.ok(LOCALIZED_SECURITY_GUIDE_MARKETING_PATHS.includes("/hr/security-guides/password"));
});

test("isLocalizedSecurityGuideTopic distinguishes full guides from stubs", () => {
  assert.equal(isLocalizedSecurityGuideTopic("vpn"), true);
  assert.equal(isLocalizedSecurityGuideTopic("password"), true);
  assert.equal(isLocalizedSecurityGuideTopic("messenger"), false);
});
