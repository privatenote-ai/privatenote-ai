import assert from "node:assert/strict";
import test from "node:test";
import { oneTimeLinkEn } from "../client/src/pages/oneTimeLink/copy.en.ts";
import { getOneTimeLinkCopy } from "../client/src/pages/oneTimeLink/copy.ts";
import { SUPPORTED_LANGUAGES } from "./supportedLanguages.ts";
import {
  buildOneTimeLinkFaqSchema,
  isOneTimeLinkRoute,
} from "./oneTimeLinkStructuredData.ts";

test("isOneTimeLinkRoute matches English and localized paths", () => {
  assert.equal(isOneTimeLinkRoute("/one-time-link"), true);
  for (const language of SUPPORTED_LANGUAGES.filter((code) => code !== "en")) {
    assert.equal(isOneTimeLinkRoute(`/${language}/one-time-link`), true);
  }
  assert.equal(isOneTimeLinkRoute("/secure-file-transfer"), false);
});

test("buildOneTimeLinkFaqSchema includes visible FAQ entries", () => {
  const schema = buildOneTimeLinkFaqSchema(oneTimeLinkEn.faqs);
  assert.equal((schema.mainEntity as unknown[]).length, oneTimeLinkEn.faqs.length);
  assert.equal(schema["@type"], "FAQPage");
});

test("getOneTimeLinkCopy returns native copy for every supported language", () => {
  assert.equal(getOneTimeLinkCopy("en").heroTitle, oneTimeLinkEn.heroTitle);
  assert.match(getOneTimeLinkCopy("de").heroTitle, /Einmal-Link/);
  assert.match(getOneTimeLinkCopy("es").heroTitle, /un solo uso/);
  assert.match(getOneTimeLinkCopy("nl").heroTitle, /eenmalige/);
  assert.match(getOneTimeLinkCopy("fr").heroTitle, /usage unique/);
  assert.match(getOneTimeLinkCopy("it").heroTitle, /monouso/);
  assert.match(getOneTimeLinkCopy("pt").heroTitle, /uso único/);
  assert.match(getOneTimeLinkCopy("hr").heroTitle, /jednokratn/);
  assert.match(getOneTimeLinkCopy("sr").heroTitle, /jednokratn/);
  assert.match(getOneTimeLinkCopy("tr").heroTitle, /tek kullanımlık/i);

  for (const language of SUPPORTED_LANGUAGES) {
    const copy = getOneTimeLinkCopy(language);
    assert.equal(copy.faqs.length, oneTimeLinkEn.faqs.length);
    if (language !== "en") {
      assert.notEqual(copy.heroTitle, oneTimeLinkEn.heroTitle);
    }
  }
});
