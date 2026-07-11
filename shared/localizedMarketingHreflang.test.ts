import assert from "node:assert/strict";
import test from "node:test";
import {
  buildLocalizedMarketingHreflangMarkup,
  buildMarketingHreflangMarkup,
  isLocalizedMarketingHreflangRoute,
  localizedMarketingHreflangAlternates,
  marketingHreflangAlternatesForRoute,
  selfReferenceHreflangForRoute,
} from "./localizedMarketingHreflang.ts";

test("isLocalizedMarketingHreflangRoute matches mirrored marketing paths", () => {
  assert.equal(isLocalizedMarketingHreflangRoute("/how-it-works"), true);
  assert.equal(isLocalizedMarketingHreflangRoute("/de/security-resources"), true);
  assert.equal(isLocalizedMarketingHreflangRoute("/fr/blog"), true);
  assert.equal(isLocalizedMarketingHreflangRoute("/blog/privacy-tools"), true);
  assert.equal(isLocalizedMarketingHreflangRoute("/security-guides/browser"), false);
  assert.equal(isLocalizedMarketingHreflangRoute("/"), false);
});

test("localizedMarketingHreflangAlternates includes localized blog slugs", () => {
  const alternates = localizedMarketingHreflangAlternates("/blog/privacy-tools");
  assert.ok(alternates);
  const de = alternates.find((alternate) => alternate.hrefLang === "de");
  assert.ok(de);
  assert.equal(de.path, "/de/blog/datenschutz-tools");
});

test("buildLocalizedMarketingHreflangMarkup uses absolute production URLs", () => {
  const html = buildLocalizedMarketingHreflangMarkup("/de/how-it-works");
  assert.ok(html);
  assert.match(html, /hreflang="en" href="https:\/\/privatenote\.ai\/how-it-works"/);
  assert.match(html, /hreflang="de" href="https:\/\/privatenote\.ai\/de\/how-it-works"/);
  assert.match(html, /hreflang="x-default" href="https:\/\/privatenote\.ai\/how-it-works"/);
});

test("marketingHreflangAlternatesForRoute includes Spanish self-reference", () => {
  const selfRef = selfReferenceHreflangForRoute("/es/about");
  assert.deepEqual(selfRef, {
    hrefLang: "es",
    href: "https://privatenote.ai/es/about",
  });
  const html = buildMarketingHreflangMarkup("/es/about");
  assert.ok(html);
  assert.match(html, /hreflang="es" href="https:\/\/privatenote\.ai\/es\/about"/);
});

test("buildMarketingHreflangMarkup adds en self-reference for security guides", () => {
  const html = buildMarketingHreflangMarkup("/security-guides/vpn");
  assert.match(html, /hreflang="en" href="https:\/\/privatenote\.ai\/security-guides\/vpn"/);
  assert.match(html, /hreflang="x-default" href="https:\/\/privatenote\.ai\/security-guides\/vpn"/);
});
