import assert from "node:assert/strict";
import test from "node:test";
import { BLOG_CANONICAL_SLUGS } from "./localizedBlogSlugs.ts";
import { BLOG_POST_CROSS_LINKS, validateBlogPostCrossLinks } from "./blogPostCrossLinks.ts";

test("every canonical blog slug has cross-links configured", () => {
  for (const slug of BLOG_CANONICAL_SLUGS) {
    assert.ok(BLOG_POST_CROSS_LINKS[slug], `missing cross-links for ${slug}`);
  }
  assert.equal(Object.keys(BLOG_POST_CROSS_LINKS).length, BLOG_CANONICAL_SLUGS.length);
});

test("validateBlogPostCrossLinks passes for the full registry", () => {
  const errors = validateBlogPostCrossLinks();
  assert.deepEqual(errors, []);
});

test("each post links to at least three related articles", () => {
  for (const slug of BLOG_CANONICAL_SLUGS) {
    assert.ok(
      BLOG_POST_CROSS_LINKS[slug].related.length >= 3,
      `${slug} should have at least 3 related posts`,
    );
  }
});
