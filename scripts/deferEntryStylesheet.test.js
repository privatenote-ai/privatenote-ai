import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ensureBlockingEntryStylesheet,
  stripStaleModulePreloads,
} from "./deferEntryStylesheet.js";

describe("ensureBlockingEntryStylesheet", () => {
  it("normalizes a blocking entry stylesheet and does not defer it", () => {
    const html =
      '<head><link rel="stylesheet" crossorigin href="/assets/index-d53jlgIE.css"></head>';
    const out = ensureBlockingEntryStylesheet(html);
    assert.match(
      out,
      /<link rel="stylesheet" href="\/assets\/index-d53jlgIE\.css" crossorigin>/,
    );
    assert.doesNotMatch(out, /load-stylesheet/);
    assert.doesNotMatch(out, /as="style"/);
    assert.doesNotMatch(out, /media="not all"/);
  });

  it("restores a preload plus noscript deferral to a blocking stylesheet", () => {
    const html =
      '<head><link rel="preload" href="/assets/index-d53jlgIE.css" as="style" crossorigin />\n' +
      '<script defer src="/load-stylesheet.js"></script>\n' +
      '<noscript><link rel="stylesheet" href="/assets/index-d53jlgIE.css" crossorigin /></noscript></head>';
    const out = ensureBlockingEntryStylesheet(html);
    assert.match(
      out,
      /<link rel="stylesheet" href="\/assets\/index-d53jlgIE\.css" crossorigin>/,
    );
    assert.equal((out.match(/index-d53jlgIE\.css/g) || []).length, 1);
    assert.doesNotMatch(out, /load-stylesheet/);
    assert.doesNotMatch(out, /rel="preload"/);
    assert.doesNotMatch(out, /<noscript>/);
  });

  it("restores media=not all deferred CSS to a blocking stylesheet", () => {
    const html =
      '<head><link rel="preload" href="/assets/index-B8HdQf3u.css" as="style" crossorigin />\n' +
      '<link rel="stylesheet" href="/assets/index-B8HdQf3u.css" media="not all" data-pn-defer-css crossorigin />\n' +
      '<script defer src="/load-stylesheet.js"></script></head>';
    const out = ensureBlockingEntryStylesheet(html);
    assert.match(
      out,
      /<link rel="stylesheet" href="\/assets\/index-B8HdQf3u.css" crossorigin>/,
    );
    assert.equal((out.match(/index-B8HdQf3u\.css/g) || []).length, 1);
    assert.doesNotMatch(out, /media="not all"/);
    assert.doesNotMatch(out, /load-stylesheet/);
    assert.doesNotMatch(out, /rel="preload"/);
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
