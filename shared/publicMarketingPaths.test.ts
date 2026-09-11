import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { PUBLIC_SITE_ORIGIN } from "./homeSeoLinks.ts";
import {
  isPublicMarketingPath,
  normalizeMarketingPathname,
  PUBLIC_MARKETING_PATHS,
} from "./publicMarketingPaths.ts";
import { isLocaleHomeSegment } from "./supportedLanguages.ts";

function sitemapLocForRoute(route: string): string {
  if (route === "/") return `${PUBLIC_SITE_ORIGIN}/`;
  if (/^\/[^/]+$/.test(route) && isLocaleHomeSegment(route.slice(1))) {
    return `${PUBLIC_SITE_ORIGIN}${route}/`;
  }
  return `${PUBLIC_SITE_ORIGIN}${route}`;
}

function routeListedInSitemap(xml: string, route: string): boolean {
  return xml.includes(`<loc>${sitemapLocForRoute(route)}</loc>`);
}

test("normalizeMarketingPathname strips trailing slash except locale homes", () => {
  assert.equal(normalizeMarketingPathname("/terms/"), "/terms");
  assert.equal(normalizeMarketingPathname("/de/how-it-works/"), "/de/how-it-works");
  assert.equal(normalizeMarketingPathname("/"), "/");
  assert.equal(normalizeMarketingPathname("/de"), "/de/");
  assert.equal(normalizeMarketingPathname("/de/"), "/de/");
  assert.equal(normalizeMarketingPathname("/fr"), "/fr/");
});

test("isPublicMarketingPath matches sitemap marketing URLs", () => {
  assert.equal(isPublicMarketingPath("/developers"), true);
  assert.equal(isPublicMarketingPath("/premium"), true);
  assert.equal(isPublicMarketingPath("/de/premium"), true);
  assert.equal(isPublicMarketingPath("/fr/premium"), true);
  assert.equal(isPublicMarketingPath("/developers/cli"), true);
  assert.equal(isPublicMarketingPath("/developers/chrome"), true);
  assert.equal(isPublicMarketingPath("/secure-file-transfer"), true);
  assert.equal(isPublicMarketingPath("/one-time-link"), true);
  assert.equal(isPublicMarketingPath("/de/one-time-link"), true);
  assert.equal(isPublicMarketingPath("/fr/one-time-link"), true);
  assert.equal(isPublicMarketingPath("/hr/one-time-link"), true);
  assert.equal(isPublicMarketingPath("/tr/one-time-link"), true);
  assert.equal(isPublicMarketingPath("/blog/encrypted-vs-secure-file-sharing"), true);
  assert.equal(isPublicMarketingPath("/blog/category/secrets"), true);
  assert.equal(isPublicMarketingPath("/de/blog/category/encryption"), true);
  assert.equal(isPublicMarketingPath("/de/about/"), true);
  assert.equal(isPublicMarketingPath("/it/about/"), true);
  assert.equal(isPublicMarketingPath("/nl/blog/privatenote-met-openai-codex"), true);
  assert.equal(isPublicMarketingPath("/nl/blog/privatenote-codex"), false);
  assert.equal(isPublicMarketingPath("/de/security-guides/vpn"), true);
  assert.equal(isPublicMarketingPath("/security-guides/messenger"), true);
  assert.equal(isPublicMarketingPath("/note/abc"), false);
});

test("sitemap.xml lists every public marketing path", () => {
  const xml = readFileSync(new URL("../client/public/sitemap.xml", import.meta.url), "utf8");
  const missing = PUBLIC_MARKETING_PATHS.filter((route) => !routeListedInSitemap(xml, route));
  assert.deepEqual(
    missing,
    [],
    `Update client/public/sitemap.xml for: ${missing.join(", ")}`,
  );
});
