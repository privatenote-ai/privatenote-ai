import assert from "node:assert/strict";
import test from "node:test";
import { privnoteAlternativeEn } from "../client/src/pages/privnoteAlternative/copy.en.ts";
import { getPrivnoteAlternativeCopy } from "../client/src/pages/privnoteAlternative/copy.ts";
import { SUPPORTED_LANGUAGES } from "./supportedLanguages.ts";
import {
  buildPrivnoteAlternativeFaqSchema,
  buildPrivnoteAlternativePageSchema,
  isPrivnoteAlternativeRoute,
} from "./privnoteAlternativeStructuredData.ts";

test("isPrivnoteAlternativeRoute matches English and localized paths", () => {
  assert.equal(isPrivnoteAlternativeRoute("/privnote-alternative"), true);
  for (const language of SUPPORTED_LANGUAGES.filter((code) => code !== "en")) {
    assert.equal(isPrivnoteAlternativeRoute(`/${language}/privnote-alternative`), true);
  }
  assert.equal(isPrivnoteAlternativeRoute("/one-time-link"), false);
});

test("buildPrivnoteAlternativeFaqSchema includes visible FAQ entries", () => {
  const schema = buildPrivnoteAlternativeFaqSchema(privnoteAlternativeEn.faqs);
  assert.equal((schema.mainEntity as unknown[]).length, privnoteAlternativeEn.faqs.length);
  assert.equal(schema["@type"], "FAQPage");
});

test("buildPrivnoteAlternativePageSchema describes the page without ratings", () => {
  const schema = buildPrivnoteAlternativePageSchema(privnoteAlternativeEn);
  const serialized = JSON.stringify(schema);
  assert.doesNotMatch(serialized, /aggregateRating/);
  assert.doesNotMatch(serialized, /reviewCount/);
  const graph = schema["@graph"] as Array<Record<string, unknown>>;
  assert.ok(graph.some((entry) => entry["@type"] === "WebPage"));
  assert.ok(graph.some((entry) => entry["@type"] === "BreadcrumbList"));
});

test("page describes PrivateNote architecture without judging Privnote cryptography", () => {
  assert.equal(
    privnoteAlternativeEn.compareRows.some((row) => row.feature === "Key in the share link"),
    false,
  );
  assert.equal(privnoteAlternativeEn.compareRows.length, 11);
  assert.ok(privnoteAlternativeEn.compareRows.some((row) => row.feature === "Scheduled reveal"));
  assert.equal(privnoteAlternativeEn.faqs.length, 7);
  assert.equal(privnoteAlternativeEn.decidePrivnoteItems.length, 3);
  assert.equal(privnoteAlternativeEn.decidePrivateNoteItems.length, 5);
  assert.match(privnoteAlternativeEn.compareIntro, /files, media, recipient controls/);
  assert.match(privnoteAlternativeEn.securityArchitecture, /256-bit encryption key/);
  assert.match(privnoteAlternativeEn.securityLimitation, /Anyone who later has the full link/);
  assert.match(privnoteAlternativeEn.whyBody2, /deliver confidential documents/);
  assert.match(privnoteAlternativeEn.businessScenarios[2], /sends identity or financial documents/);
  assert.match(privnoteAlternativeEn.faqs[0].question, /some alternatives to Privnote/i);
  assert.doesNotMatch(JSON.stringify(privnoteAlternativeEn), /short fragment/i);
  assert.doesNotMatch(JSON.stringify(privnoteAlternativeEn), /collect identity/i);
  assert.doesNotMatch(privnoteAlternativeEn.faqs[0].question, /best alternative/i);
  assert.doesNotMatch(JSON.stringify(privnoteAlternativeEn), /safer than Privnote/i);
  assert.doesNotMatch(JSON.stringify(privnoteAlternativeEn), /Stronger encryption/i);
});

test("getPrivnoteAlternativeCopy returns native copy for every supported language", () => {
  assert.equal(getPrivnoteAlternativeCopy("en").heroTitleLine1, privnoteAlternativeEn.heroTitleLine1);
  assert.match(getPrivnoteAlternativeCopy("de").heroTitleLine1, /Alternative zu Privnote/);
  assert.match(getPrivnoteAlternativeCopy("es").heroTitleLine1, /alternativa privada/i);
  assert.match(getPrivnoteAlternativeCopy("nl").heroTitleLine1, /alternatief/i);
  assert.match(getPrivnoteAlternativeCopy("fr").heroTitleLine1, /alternative privée/i);
  assert.match(getPrivnoteAlternativeCopy("it").heroTitleLine1, /alternativa privata/i);
  assert.match(getPrivnoteAlternativeCopy("pt").heroTitleLine1, /alternativa privada/i);
  assert.match(getPrivnoteAlternativeCopy("hr").heroTitleLine1, /alternativa/i);
  assert.match(getPrivnoteAlternativeCopy("sr").heroTitleLine1, /alternativa/i);
  assert.match(getPrivnoteAlternativeCopy("tr").heroTitleLine1, /alternatif/i);
  assert.match(getPrivnoteAlternativeCopy("pl").heroTitleLine1, /alternatywa/i);

  for (const language of SUPPORTED_LANGUAGES) {
    const copy = getPrivnoteAlternativeCopy(language);
    assert.equal(copy.faqs.length, privnoteAlternativeEn.faqs.length);
    assert.equal(copy.compareRows.length, privnoteAlternativeEn.compareRows.length);
    assert.equal(copy.decidePrivnoteItems.length, 3);
    assert.equal(copy.decidePrivateNoteItems.length, 5);
    if (language !== "en") {
      assert.notEqual(copy.heroTitleLine1, privnoteAlternativeEn.heroTitleLine1);
      assert.notEqual(copy.faqs[0].question, privnoteAlternativeEn.faqs[0].question);
    }
  }
});
