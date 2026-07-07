import assert from "node:assert/strict";
import test from "node:test";
import { buildBlogArticleStructuredData } from "./blogStructuredData.ts";

test("buildBlogArticleStructuredData emits BlogPosting and BreadcrumbList", () => {
  const schema = buildBlogArticleStructuredData({
    slug: "how-to-share-api-key-securely",
    language: "en",
    title: "How to Share an API Key Securely",
    description: "A practical guide to sharing API keys without exposing secrets.",
    author: "PrivateNote.ai",
    publishedAt: "2026-07-06T12:00:00.000Z",
    updatedAt: "2026-07-06T12:00:00.000Z",
    image: "/images/blog-api-key-sharing-hero.jpg",
    tags: ["Developers", "Security"],
  });

  const graph = schema["@graph"] as Array<Record<string, unknown>>;
  const article = graph.find((entry) => entry["@type"] === "BlogPosting");
  const breadcrumb = graph.find((entry) => entry["@type"] === "BreadcrumbList");

  assert.equal(article?.headline, "How to Share an API Key Securely");
  assert.equal(article?.url, "https://privatenote.ai/blog/how-to-share-api-key-securely");
  assert.equal(article?.image, "https://privatenote.ai/images/blog-api-key-sharing-hero.jpg");
  assert.deepEqual(article?.keywords, ["Developers", "Security"]);
  assert.ok(breadcrumb);
});

test("buildBlogArticleStructuredData uses localized canonical blog URLs", () => {
  const schema = buildBlogArticleStructuredData({
    slug: "how-to-share-api-key-securely",
    language: "de",
    title: "API-Schluessel sicher teilen",
  });

  const graph = schema["@graph"] as Array<Record<string, unknown>>;
  const article = graph.find((entry) => entry["@type"] === "BlogPosting");

  assert.equal(article?.url, "https://privatenote.ai/de/blog/api-schluessel-sicher-teilen");
});
