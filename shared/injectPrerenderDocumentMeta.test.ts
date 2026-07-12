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

test("injectPrerenderDocumentMeta injects blog H1 when snapshot has empty root", () => {
  const html = [
    '<html lang="en"><head>',
    "<title>PrivateNote.ai - Secure Encrypted Notes</title>",
    '<meta name="description" content="old" />',
    '<meta property="og:title" content="old" />',
    '<meta property="og:description" content="old" />',
    '<meta name="twitter:title" content="old" />',
    '<meta name="twitter:description" content="old" />',
    '<meta property="og:locale" content="en_US" />',
    '</head><body><div id="root"></div></body></html>',
  ].join("");

  const out = injectPrerenderDocumentMeta(html, "/blog/privacy-tools");
  assert.match(out, /<h1[^>]*data-privatenote-prerender-h1="true"[^>]*>Why Privacy Matters<\/h1>/);
  assert.match(out, /I approach privacy the way I approach cryptography/);
  assert.match(out, /Secure Your Network/);
  assert.match(out, /Security Recommendations/);
  assert.match(out, /data-privatenote-prerender-article="privacy-tools"/);
});

test("injectPrerenderDocumentMeta injects localized privacy-tools article for empty root", () => {
  const html = [
    '<html lang="de"><head>',
    "<title>PrivateNote.ai - Secure Encrypted Notes</title>",
    '<meta name="description" content="old" />',
    '<meta property="og:title" content="old" />',
    '<meta property="og:description" content="old" />',
    '<meta name="twitter:title" content="old" />',
    '<meta name="twitter:description" content="old" />',
    '<meta property="og:locale" content="de_DE" />',
    '</head><body><div id="root"></div></body></html>',
  ].join("");

  const out = injectPrerenderDocumentMeta(html, "/de/blog/datenschutz-tools");
  assert.match(out, /<h1[^>]*>Warum Privatsphäre wichtig ist<\/h1>/);
  assert.match(out, /Ich betrachte Privatsphäre/);
  assert.match(out, /Sicherheitsempfehlungen|Security Recommendations/);
});

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

test("injectPrerenderDocumentMeta injects password generator FAQ schema", () => {
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

  const out = injectPrerenderDocumentMeta(html, "/password-generator");
  const match = out.match(
    /<script type="application\/ld\+json" data-structured-data-id="password-generator-faq">([\s\S]*?)<\/script>/,
  );
  assert.ok(match, "password generator FAQ schema script should be present");
  assert.equal(JSON.parse(match[1])["@type"], "FAQPage");
});

test("injectPrerenderDocumentMeta injects complete Open Graph tags for locale homes", () => {
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

  const out = injectPrerenderDocumentMeta(html, "/de/");
  assert.match(out, /property="og:title" content="Ihre Nachrichten/);
  assert.match(out, /property="og:description" content="Ende-zu-Ende/);
  assert.match(out, /property="og:image" content="https:\/\/privatenote\.ai\/og-image\.png"/);
  assert.match(out, /property="og:image:width" content="1200"/);
  assert.match(out, /property="og:image:height" content="630"/);
  assert.match(out, /property="og:url" content="https:\/\/privatenote\.ai\/de\/"/);
  assert.match(out, /name="twitter:image" content="https:\/\/privatenote\.ai\/og-image\.png"/);
});
