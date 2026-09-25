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

test("injectPrerenderDocumentMeta injects blog H1 when hidden home snapshot H1 is the only heading", () => {
  const html = [
    '<html lang="en"><head>',
    "<title>PrivateNote.ai - Secure Encrypted Notes</title>",
    '<meta name="description" content="old" />',
    '<meta property="og:title" content="old" />',
    '<meta property="og:description" content="old" />',
    '<meta name="twitter:title" content="old" />',
    '<meta name="twitter:description" content="old" />',
    '<meta property="og:locale" content="en_US" />',
    '</head><body><div id="root">',
    '<div id="pn-home-prerender" hidden><section><div><h1>Your Messages</h1></div></section></div>',
    "<main><article><h2>Secure Your Network</h2><p>Body</p></article></main>",
    "</div></body></html>",
  ].join("");

  const out = injectPrerenderDocumentMeta(html, "/blog/privacy-tools");
  assert.match(
    out,
    /<h1[^>]*data-privatenote-prerender-h1="true"[^>]*>A Practical Privacy Tools Stack for 2026<\/h1>/,
  );
  assert.doesNotMatch(out, /id="pn-home-prerender"/);
});

test("injectPrerenderDocumentMeta strips a nested home overlay on inner pages and keeps it on home", () => {
  const html = [
    "<html><head><title>old</title></head><body>",
    '<div id="pn-home-prerender" class="pn-home-prerender">',
    '<section><h1 class="page-title">Your Messages,</h1></section>',
    '<div class="pn-home-editor-wrap"><div class="pn-editor-col">Type here</div></div>',
    "</div>",
    '<div id="root"><main><h1>About</h1></main></div>',
    "</body></html>",
  ].join("");

  const about = injectPrerenderDocumentMeta(html, "/about");
  assert.doesNotMatch(about, /pn-home-prerender/);
  assert.doesNotMatch(about, /pn-home-editor-wrap/);
  assert.match(about, /<h1>About<\/h1>/);

  const home = injectPrerenderDocumentMeta(html, "/");
  assert.match(home, /id="pn-home-prerender"/);
  assert.match(home, /pn-home-editor-wrap/);
});

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
  assert.match(
    out,
    /<h1[^>]*data-privatenote-prerender-h1="true"[^>]*>A Practical Privacy Tools Stack for 2026<\/h1>/,
  );
  assert.match(out, /Most “best privacy tools” pages are affiliate catalogs/);
  assert.match(out, /Start with a threat model/);
  assert.match(out, /Minimal starter kit/);
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
  assert.match(out, /<h1[^>]*>Ein praktischer Datenschutz-Tools-Stack für 2026<\/h1>/);
  assert.match(out, /Start with a threat model/);
  assert.match(out, /Minimal starter kit/);
  assert.match(out, /privacy tools directory/);
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

test("injectPrerenderDocumentMeta injects Privnote alternative schema and crawler article", () => {
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

  const out = injectPrerenderDocumentMeta(html, "/privnote-alternative");
  assert.match(out, /<title>Privnote Alternative: Secure Notes &amp; Files/);
  assert.match(out, /data-structured-data-id="privnote-alternative-faq"/);
  assert.match(out, /data-structured-data-id="privnote-alternative-page"/);
  assert.match(out, /A Private Privnote Alternative for Notes, Passwords &amp; Files/);
  assert.match(out, /If you already know Privnote/);
  assert.match(out, /If you are looking for a Privnote alternative/);
  assert.match(out, /AES-256-GCM authenticated encryption/);
  assert.match(out, /Built with cryptography in mind/);
  assert.doesNotMatch(out, /Short fragment after/);
  assert.doesNotMatch(out, /aggregateRating/);
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
  assert.match(out, /property="og:title" content="Verschlüsselte Notizen, Fotos &amp; Dateien \(DE\)/);
  assert.match(out, /property="og:description" content="Senden Sie verschlüsselte/);
  assert.match(out, /property="og:image" content="https:\/\/privatenote\.ai\/og-image\.png"/);
  assert.match(out, /property="og:image:width" content="1200"/);
  assert.match(out, /property="og:image:height" content="630"/);
  assert.match(out, /property="og:url" content="https:\/\/privatenote\.ai\/de\/"/);
  assert.match(out, /name="twitter:image" content="https:\/\/privatenote\.ai\/og-image\.png"/);
});
