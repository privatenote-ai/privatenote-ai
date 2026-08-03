import assert from "node:assert/strict";
import test from "node:test";
import { BLOG_CANONICAL_SLUGS } from "./localizedBlogSlugs.ts";

// Import via relative path from shared test runner context — takeaways live in client.
import { BLOG_TAKEAWAYS_EN, getBlogTakeaways } from "../client/src/components/blog/blogTakeaways.ts";

test("every canonical blog slug except API-key pilot has shared takeaways", () => {
  const missing = BLOG_CANONICAL_SLUGS.filter(
    (slug) => slug !== "how-to-share-api-key-securely" && !BLOG_TAKEAWAYS_EN[slug]?.length,
  );
  assert.deepEqual(missing, []);
});

test("getBlogTakeaways returns localized overlays and falls back for missing slugs", () => {
  const en = getBlogTakeaways("privacy-tools", "en");
  const de = getBlogTakeaways("privacy-tools", "de");
  assert.ok(en.length >= 3);
  assert.notDeepEqual(de, en);
  assert.match(de[0] ?? "", /Werkzeuge|Passwörter|Secrets/);
  assert.deepEqual(getBlogTakeaways("how-to-share-api-key-securely", "en"), []);
  assert.deepEqual(getBlogTakeaways("how-to-share-api-key-securely", "de"), []);
});

test("every takeaways overlay locale covers the English slug set", async () => {
  const { BLOG_TAKEAWAYS_I18N } = await import("../client/src/components/blog/blogTakeaways.ts");
  const enSlugs = Object.keys(BLOG_TAKEAWAYS_EN).sort();
  for (const lang of ["de", "fr", "es", "it", "nl", "pt", "sr", "hr"] as const) {
    const localized = BLOG_TAKEAWAYS_I18N[lang] ?? {};
    assert.deepEqual(Object.keys(localized).sort(), enSlugs, `locale ${lang}`);
    for (const slug of enSlugs) {
      assert.equal(localized[slug]?.length, BLOG_TAKEAWAYS_EN[slug]?.length, `${lang}/${slug}`);
    }
  }
});
