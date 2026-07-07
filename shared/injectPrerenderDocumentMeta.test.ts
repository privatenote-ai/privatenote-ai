import assert from "node:assert/strict";
import test from "node:test";
import { injectPrerenderDocumentMeta } from "./injectPrerenderDocumentMeta.ts";

function extractPasswordGeneratorFaqSchema(html: string): Record<string, unknown> {
  const match = html.match(
    /<script type="application\/ld\+json" data-structured-data-id="password-generator-faq">([\s\S]*?)<\/script>/,
  );
  assert.ok(match, "password generator FAQ schema script should be present");
  return JSON.parse(match[1]);
}

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
  const schema = extractPasswordGeneratorFaqSchema(out);

  assert.equal(schema["@type"], "FAQPage");
  assert.match(out, /<title>.*Password Generator/i);
});
