import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  deferEntryStylesheet,
  stripStaleModulePreloads,
} from "./deferEntryStylesheet.js";

describe("deferEntryStylesheet", () => {
  it("converts the Vite entry stylesheet into a preload plus non-blocking media", () => {
    const html =
      '<head><link rel="stylesheet" crossorigin href="/assets/index-d53jlgIE.css"></head>';
    const out = deferEntryStylesheet(html);
    assert.match(out, /rel="preload"[^>]*as="style"/);
    assert.match(out, /href="\/assets\/index-d53jlgIE\.css"/);
    assert.match(out, /media="not all"/);
    assert.match(out, /data-pn-defer-css/);
    assert.match(out, /load-stylesheet\.js/);
    assert.doesNotMatch(
      out,
      /<link rel="stylesheet" crossorigin href="\/assets\/index-d53jlgIE\.css">/,
    );
    assert.doesNotMatch(out, /<noscript>/);
  });

  it("rewrites a blocking stylesheet even when a preload already exists", () => {
    const html =
      '<head><link rel="preload" href="/assets/index-d53jlgIE.css" as="style" crossorigin /><link rel="stylesheet" href="/assets/index-d53jlgIE.css" crossorigin /><script defer src="/load-stylesheet.js"></script></head>';
    const out = deferEntryStylesheet(html);
    assert.equal((out.match(/index-d53jlgIE\.css/g) || []).length, 2);
    assert.match(out, /media="not all"/);
    assert.doesNotMatch(
      out,
      /<link rel="stylesheet" href="\/assets\/index-d53jlgIE\.css" crossorigin \/>/,
    );
  });

  it("is stable when the entry CSS is already deferred", () => {
    const html =
      '<head><link rel="preload" href="/assets/index-d53jlgIE.css" as="style" /><link rel="stylesheet" href="/assets/index-d53jlgIE.css" media="not all" data-pn-defer-css /><script defer src="/load-stylesheet.js"></script></head>';
    const out = deferEntryStylesheet(html);
    assert.match(out, /media="not all"/);
    assert.match(out, /load-stylesheet\.js/);
    assert.equal((out.match(/load-stylesheet\.js/g) || []).length, 1);
  });
});

describe("stripStaleModulePreloads", () => {
  it("keeps vendor-react, vendor-query, and the entry chunk", () => {
    const html = [
      '<link rel="modulepreload" crossorigin href="/assets/vendor-react-8FN8Sefe.js">',
      '<link rel="modulepreload" crossorigin href="/assets/vendor-query-Ba5tkr7U.js">',
      '<link rel="modulepreload" crossorigin href="/assets/vendor-radix-B1t1cdMP.js">',
      '<link rel="modulepreload" crossorigin href="/assets/index-DaA843FU.js">',
    ].join("");
    const out = stripStaleModulePreloads(html);
    assert.match(out, /vendor-react-8FN8Sefe/);
    assert.match(out, /vendor-query-Ba5tkr7U/);
    assert.match(out, /index-DaA843FU/);
    assert.doesNotMatch(out, /vendor-radix/);
  });
});
