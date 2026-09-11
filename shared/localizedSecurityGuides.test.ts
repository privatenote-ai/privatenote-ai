import assert from "node:assert/strict";
import test from "node:test";
import {
  isLocalizedSecurityGuideTopic,
  localizedSecurityGuidePath,
  LOCALIZED_SECURITY_GUIDE_MARKETING_PATHS,
  LOCALIZED_SECURITY_GUIDE_TOPICS,
} from "./localizedSecurityGuides.ts";
import { NON_ENGLISH_LANGUAGE_CODES } from "./supportedLanguages.ts";

test("localizedSecurityGuidePath mirrors vpn and password under locale prefixes", () => {
  assert.equal(localizedSecurityGuidePath("vpn", "en"), "/security-guides/vpn");
  assert.equal(localizedSecurityGuidePath("vpn", "de"), "/de/security-guides/vpn");
  assert.equal(localizedSecurityGuidePath("password", "fr"), "/fr/security-guides/password");
});

test("LOCALIZED_SECURITY_GUIDE_MARKETING_PATHS includes English plus every locale prefix", () => {
  assert.equal(
    LOCALIZED_SECURITY_GUIDE_MARKETING_PATHS.length,
    LOCALIZED_SECURITY_GUIDE_TOPICS.length * (1 + NON_ENGLISH_LANGUAGE_CODES.length),
  );
  assert.ok(LOCALIZED_SECURITY_GUIDE_MARKETING_PATHS.includes("/de/security-guides/vpn"));
  assert.ok(LOCALIZED_SECURITY_GUIDE_MARKETING_PATHS.includes("/hr/security-guides/password"));
  assert.ok(LOCALIZED_SECURITY_GUIDE_MARKETING_PATHS.includes("/tr/security-guides/vpn"));
});

test("isLocalizedSecurityGuideTopic distinguishes full guides from stubs", () => {
  assert.equal(isLocalizedSecurityGuideTopic("vpn"), true);
  assert.equal(isLocalizedSecurityGuideTopic("password"), true);
  assert.equal(isLocalizedSecurityGuideTopic("messenger"), false);
});
