import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { deferEntryStylesheet } from "./deferEntryStylesheet.js";

describe("deferEntryStylesheet", () => {
  it("converts the Vite entry stylesheet into a preload plus noscript fallback", () => {
    const html =
      '<head><link rel="stylesheet" crossorigin href="/assets/index-d53jlgIE.css"></head>';
    const out = deferEntryStylesheet(html);
    assert.match(out, /rel="preload"[^>]*as="style"/);
    assert.match(out, /href="\/assets\/index-d53jlgIE\.css"/);
    assert.match(out, /load-stylesheet\.js/);
    assert.match(out, /<noscript><link rel="stylesheet"/);
    assert.doesNotMatch(out, /<link rel="stylesheet" crossorigin href="\/assets\/index-d53jlgIE\.css">/);
  });

  it("is a no-op when the entry CSS is already a preload", () => {
    const html =
      '<link rel="preload" href="/assets/index-d53jlgIE.css" as="style" /><script defer src="/load-stylesheet.js"></script>';
    assert.equal(deferEntryStylesheet(html), html);
  });
});
