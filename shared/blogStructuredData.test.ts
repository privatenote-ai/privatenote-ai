import assert from "node:assert/strict";
import test from "node:test";
import { buildBlogArticleStructuredData, buildBlogCategoryStructuredData } from "./blogStructuredData.ts";

test("buildBlogArticleStructuredData emits BlogPosting and BreadcrumbList", () => {
  const schema = buildBlogArticleStructuredData({
    slug: "how-to-share-api-key-securely",
    language: "en",
    title: "How to Share an API Key Securely",
    description: "A practical guide to sharing API keys without exposing secrets.",
    author: "PrivateNote.ai",
    publishedAt: "2026-07-06T12:00:00.000Z",
    updatedAt: "2026-07-06T12:00:00.000Z",
    image: "/images/blog-api-key-sharing-hero.png",
    tags: ["Developers", "Security"],
  });

  const graph = schema["@graph"] as Array<Record<string, unknown>>;
  const article = graph.find((entry) => entry["@type"] === "BlogPosting");
  const breadcrumb = graph.find((entry) => entry["@type"] === "BreadcrumbList");

  assert.equal(article?.headline, "How to Share an API Key Securely");
  assert.equal(article?.url, "https://privatenote.ai/blog/how-to-share-api-key-securely");
  assert.equal(article?.image, "https://privatenote.ai/images/blog-api-key-sharing-hero.png");
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

test("buildBlogArticleStructuredData emits FAQPage when faqs are provided", () => {
  const schema = buildBlogArticleStructuredData({
    slug: "how-to-share-api-key-securely",
    language: "en",
    title: "How to Share an API Key Securely",
    faqs: [
      {
        question: "Why not just use an environment variable?",
        answer: "Environment variables do not solve the transport problem.",
      },
    ],
  });

  const graph = schema["@graph"] as Array<Record<string, unknown>>;
  const faqPage = graph.find((entry) => entry["@type"] === "FAQPage");
  const mainEntity = faqPage?.mainEntity as Array<Record<string, unknown>>;

  assert.ok(faqPage);
  assert.equal(faqPage?.["@id"], "https://privatenote.ai/blog/how-to-share-api-key-securely#faq");
  assert.equal(mainEntity?.[0]?.["@type"], "Question");
  assert.equal(mainEntity?.[0]?.name, "Why not just use an environment variable?");
});

test("buildBlogCategoryStructuredData emits CollectionPage with ItemList", () => {
  const schema = buildBlogCategoryStructuredData({
    category: "secrets",
    language: "en",
    name: "Secrets",
    description: "Guides on sharing secrets.",
    posts: [{ slug: "how-to-share-api-key-securely", title: "How to Share an API Key Securely" }],
  });

  const graph = schema["@graph"] as Array<Record<string, unknown>>;
  const collection = graph.find((entry) => entry["@type"] === "CollectionPage");
  const mainEntity = collection?.mainEntity as Record<string, unknown>;
  const items = mainEntity?.itemListElement as Array<Record<string, unknown>>;

  assert.equal(collection?.url, "https://privatenote.ai/blog/category/secrets");
  assert.equal(mainEntity?.["@type"], "ItemList");
  assert.equal(items?.[0]?.url, "https://privatenote.ai/blog/how-to-share-api-key-securely");
});
