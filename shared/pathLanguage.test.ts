import assert from "node:assert/strict";
import test from "node:test";
import { uiLanguageFromPathname } from "./pathLanguage.ts";

test("uiLanguageFromPathname uses locale prefix", () => {
  assert.equal(uiLanguageFromPathname("/pl/privacy-tools"), "pl");
  assert.equal(uiLanguageFromPathname("/pl/blog/privacy-tools"), "pl");
  assert.equal(uiLanguageFromPathname("/de/"), "de");
  assert.equal(uiLanguageFromPathname("/fr/about"), "fr");
});

test("uiLanguageFromPathname treats unprefixed marketing URLs as English", () => {
  assert.equal(uiLanguageFromPathname("/"), "en");
  assert.equal(uiLanguageFromPathname("/privacy-tools"), "en");
  assert.equal(uiLanguageFromPathname("/blog/privacy-tools"), "en");
  assert.equal(uiLanguageFromPathname("/about"), "en");
  assert.equal(uiLanguageFromPathname("/how-it-works?ref=nav"), "en");
});

test("uiLanguageFromPathname leaves app routes to saved preference", () => {
  assert.equal(uiLanguageFromPathname("/note/abc123"), null);
  assert.equal(uiLanguageFromPathname("/auth/sign-in"), null);
  assert.equal(uiLanguageFromPathname("/account"), null);
  assert.equal(uiLanguageFromPathname("/account/preferences"), null);
});
