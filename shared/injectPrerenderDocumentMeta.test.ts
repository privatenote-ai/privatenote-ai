import assert from "node:assert/strict";
import test from "node:test";
import { injectPrerenderDocumentMeta } from "./injectPrerenderDocumentMeta.ts";

function extractBlogSchema(html: string): Record<string, unknown> {
  const match = html.match(
    /<script type="application\/ld\+json" data-structured-data-id="blog-article">([\s\S]*?)<\/script>/,
  );
  assert.ok(match, "blog article schema script should be present");
  return JSON.parse(match[1]);
}

test("injectPrerenderDocumentMeta injects Article and Breadcrumb schema for blog posts", () => {
  const html = [
    '<html lang="en"><head>',
    "<title>PrivateNote.ai - Secure Encrypted Notes</title>",
    '<meta name="description" content="old" />',
    '<meta property="og:title" content="old" />',
    '<meta property="og:description" content="old" />',
    '<meta name="twitter:title" content="old" />',
    '<meta name="twitter:description" content="old" />',
    '<meta property="og:locale" content="en_US" />',
    "</head><body></body></html>",
  ].join("");

  const out = injectPrerenderDocumentMeta(html, "/blog/how-to-share-api-key-securely");
  const schema = extractBlogSchema(out);
  const graph = schema["@graph"] as Array<Record<string, unknown>>;

  assert.ok(graph.some((entry) => entry["@type"] === "BlogPosting"));
  assert.ok(graph.some((entry) => entry["@type"] === "BreadcrumbList"));
  assert.match(out, /<title>How to share an API key securely/);
});
