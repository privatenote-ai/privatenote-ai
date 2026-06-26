import assert from "node:assert/strict";
import test from "node:test";
import {
  absolutePublicUrl,
  buildHomeSeoHeadMarkup,
  canonicalAbsoluteUrlForRoute,
  isLocaleHomeRoute,
} from "./homeSeoLinks.ts";

test("absolutePublicUrl uses production origin", () => {
  assert.equal(absolutePublicUrl("/fr"), "https://privatenote.ai/fr");
  assert.equal(absolutePublicUrl("/fr/"), "https://privatenote.ai/fr/");
});

test("canonicalAbsoluteUrlForRoute has no trailing slash except root", () => {
  assert.equal(canonicalAbsoluteUrlForRoute("/"), "https://privatenote.ai/");
  assert.equal(canonicalAbsoluteUrlForRoute("/terms"), "https://privatenote.ai/terms");
  assert.equal(canonicalAbsoluteUrlForRoute("/terms/"), "https://privatenote.ai/terms");
});

test("buildHomeSeoHeadMarkup includes reciprocal hreflang set", () => {
  const html = buildHomeSeoHeadMarkup("fr");
  assert.match(html, /hreflang="en" href="https:\/\/privatenote\.ai\/"/);
  assert.match(html, /hreflang="fr" href="https:\/\/privatenote\.ai\/fr\/"/);
  assert.match(html, /hreflang="it" href="https:\/\/privatenote\.ai\/it\/"/);
  assert.match(html, /hreflang="nl" href="https:\/\/privatenote\.ai\/nl\/"/);
  assert.match(html, /hreflang="x-default" href="https:\/\/privatenote\.ai\/"/);
  assert.doesNotMatch(html, /href="\/fr\/"/);
});

test("isLocaleHomeRoute", () => {
  assert.equal(isLocaleHomeRoute("/"), true);
  assert.equal(isLocaleHomeRoute("/de/"), true);
  assert.equal(isLocaleHomeRoute("/it/"), true);
  assert.equal(isLocaleHomeRoute("/nl/"), true);
  assert.equal(isLocaleHomeRoute("/de/about"), false);
});
