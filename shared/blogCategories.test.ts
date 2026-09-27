import assert from "node:assert/strict";
import test from "node:test";
import { BLOG_CANONICAL_SLUGS } from "./localizedBlogSlugs.ts";
import { NON_ENGLISH_LANGUAGE_CODES } from "./supportedLanguages.ts";
import {
  BLOG_CATEGORIES,
  BLOG_POST_CATEGORY,
  allBlogCategoryMarketingPaths,
  blogCategoryPath,
  getBlogCategory,
  parseBlogCategoryFromPath,
  validateBlogPostCategories,
} from "./blogCategories.ts";

test("every canonical blog slug has a primary category", () => {
  const errors = validateBlogPostCategories();
  assert.deepEqual(errors, []);
  assert.equal(Object.keys(BLOG_POST_CATEGORY).length, BLOG_CANONICAL_SLUGS.length);
});

test("getBlogCategory returns mapped categories and null for unknown slugs", () => {
  assert.equal(getBlogCategory("how-to-share-api-key-securely"), "secrets");
  assert.equal(getBlogCategory("what-is-end-to-end-encryption"), "encryption");
  assert.equal(getBlogCategory("privatenote-codex"), "developers");
  assert.equal(getBlogCategory("not-a-real-slug"), null);
});

test("BLOG_CATEGORIES are ordered by business importance", () => {
  assert.deepEqual([...BLOG_CATEGORIES], ["secrets", "encryption", "privacy", "ai", "developers"]);
});

test("blogCategoryPath and parseBlogCategoryFromPath round-trip", () => {
  assert.equal(blogCategoryPath("secrets"), "/blog/category/secrets");
  assert.equal(blogCategoryPath("ai", "de"), "/de/blog/category/ai");
  assert.equal(parseBlogCategoryFromPath("/blog/category/privacy"), "privacy");
  assert.equal(parseBlogCategoryFromPath("/fr/blog/category/developers"), "developers");
  assert.equal(parseBlogCategoryFromPath("/blog/privacy-tools"), null);
  assert.equal(
    allBlogCategoryMarketingPaths().length,
    BLOG_CATEGORIES.length * (1 + NON_ENGLISH_LANGUAGE_CODES.length),
  );
});

test("blog listing excludes dated news and off-pillar posts", async () => {
  const { isBlogListingSlug, BLOG_LISTING_EXCLUDED_SLUGS } = await import("./localizedBlogSlugs.ts");
  const { blogSlugsInCategory } = await import("./blogCategories.ts");
  assert.ok(BLOG_LISTING_EXCLUDED_SLUGS.has("social-media-bans-children-evidence"));
  assert.equal(isBlogListingSlug("social-media-bans-children-evidence"), false);
  assert.equal(isBlogListingSlug("how-to-share-api-key-securely"), true);
  assert.ok(!blogSlugsInCategory("privacy").includes("social-media-bans-children-evidence"));
  assert.ok(!blogSlugsInCategory("privacy").includes("chat-control-1-0-vote-explained"));
});
