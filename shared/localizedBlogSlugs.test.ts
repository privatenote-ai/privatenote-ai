import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  BLOG_CANONICAL_SLUGS,
  localizedBlogPostPath,
  localizedBlogSlug,
  resolveCanonicalBlogSlug,
} from "./localizedBlogSlugs.ts";

describe("localizedBlogSlugs", () => {
  it("maps localized slugs back to canonical", () => {
    assert.equal(resolveCanonicalBlogSlug("secrets-never-send-in-chat"), "secrets-never-send-in-chat");
    assert.equal(
      resolveCanonicalBlogSlug("10-geheimen-die-nooit-in-chat-horen"),
      "secrets-never-send-in-chat",
    );
    assert.equal(
      resolveCanonicalBlogSlug("10-secretos-que-nunca-enviar-por-chat"),
      "secrets-never-send-in-chat",
    );
    assert.equal(resolveCanonicalBlogSlug("unknown-slug"), null);
  });

  it("uses different slugs per locale", () => {
    assert.notEqual(
      localizedBlogSlug("secrets-never-send-in-chat", "en"),
      localizedBlogSlug("secrets-never-send-in-chat", "nl"),
    );
    assert.equal(
      localizedBlogSlug("secrets-never-send-in-chat", "nl"),
      "10-geheimen-die-nooit-in-chat-horen",
    );
  });

  it("builds localized blog post paths", () => {
    assert.equal(
      localizedBlogPostPath("send-secret-message-without-account", "en"),
      "/blog/send-secret-message-without-account",
    );
    assert.equal(
      localizedBlogPostPath("send-secret-message-without-account", "de"),
      "/de/blog/geheime-nachricht-ohne-konto-senden",
    );
  });

  it("covers every canonical slug in every language", () => {
    for (const canonical of BLOG_CANONICAL_SLUGS) {
      for (const language of ["en", "de", "fr", "es", "it", "nl"] as const) {
        const slug = localizedBlogSlug(canonical, language);
        assert.ok(slug.length > 0);
        assert.equal(resolveCanonicalBlogSlug(slug), canonical);
      }
    }
  });
});
