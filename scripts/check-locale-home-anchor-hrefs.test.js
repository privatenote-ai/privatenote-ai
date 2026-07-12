import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { BAD_SLASHLESS_LOCALE_HOME_ANCHOR_RE } from "./check-locale-home-anchor-hrefs.js";

function badAnchors(html) {
  BAD_SLASHLESS_LOCALE_HOME_ANCHOR_RE.lastIndex = 0;
  return [...html.matchAll(BAD_SLASHLESS_LOCALE_HOME_ANCHOR_RE)].map((m) => m[0]);
}

describe("BAD_SLASHLESS_LOCALE_HOME_ANCHOR_RE", () => {
  it("flags slashless locale home anchors", () => {
    assert.deepEqual(badAnchors('<a href="/de" class="logo">'), ['<a href="/de"']);
    assert.deepEqual(badAnchors('<a class="x" href=\'/hr\'>'), ["<a class=\"x\" href='/hr'"]);
    assert.deepEqual(badAnchors('<a href="https://privatenote.ai/fr">'), [
      '<a href="https://privatenote.ai/fr"',
    ]);
  });

  it("allows canonical locale home and subpaths", () => {
    assert.equal(badAnchors('<a href="/de/">').length, 0);
    assert.equal(badAnchors('<a href="/de/about">').length, 0);
    assert.equal(badAnchors('<a href="https://privatenote.ai/es/blog">').length, 0);
    assert.equal(badAnchors('href="/de"').length, 0);
    assert.equal(badAnchors('<link rel="alternate" hreflang="de" href="/de">').length, 0);
  });
});
