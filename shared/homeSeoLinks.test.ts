import assert from "node:assert/strict";
import test from "node:test";
import {
  absolutePublicUrl,
  buildHomeSeoHeadMarkup,
  isLocaleHomeRoute,
} from "./homeSeoLinks.ts";

test("absolutePublicUrl uses production origin", () => {
  assert.equal(absolutePublicUrl("/fr"), "https://privatenote.ai/fr");
});

test("buildHomeSeoHeadMarkup includes reciprocal hreflang set", () => {
  const html = buildHomeSeoHeadMarkup("fr");
  assert.match(html, /hreflang="en" href="https:\/\/privatenote\.ai\/"/);
  assert.match(html, /hreflang="fr" href="https:\/\/privatenote\.ai\/fr"/);
  assert.match(html, /hreflang="x-default" href="https:\/\/privatenote\.ai\/"/);
  assert.doesNotMatch(html, /href="\/fr\/"/);
});

test("isLocaleHomeRoute", () => {
  assert.equal(isLocaleHomeRoute("/"), true);
  assert.equal(isLocaleHomeRoute("/de/"), true);
  assert.equal(isLocaleHomeRoute("/de/about"), false);
});
