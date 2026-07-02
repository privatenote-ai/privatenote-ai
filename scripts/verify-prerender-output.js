// Verifies prerender output includes flat .html files for marketing routes (200 at /about, not only /about/).
// Also ensures sitemap URLs are not shipped with noindex (404.html shell or accidental snapshots).
// Run after build:prerender: `node scripts/verify-prerender-output.js prerender`

import fs from "node:fs";
import path from "node:path";

const REQUIRED_FLAT_HTML = [
  "about.html",
  "blog.html",
  "contact.html",
  "how-it-works.html",
  "developers.html",
  "password-generator.html",
  "privacy.html",
  "privacy-tools.html",
  "security-resources.html",
  "terms.html",
  "de/index.html",
  "de/about.html",
  "de/blog.html",
  "fr/index.html",
  "fr/about.html",
  "es/index.html",
  "es/about.html",
  "it/index.html",
  "it/about.html",
  "nl/index.html",
  "nl/about.html",
  "de/terms.html",
];

const NOINDEX_META_RE = /<meta\s+[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i;
/** Canonical must not end with slash except https://privatenote.ai/ and locale homes (/de/, /fr/, /es/, /it/, /nl/) */
const BAD_CANONICAL_TRAILING_SLASH_RE =
  /<link\s+[^>]*rel=["']canonical["'][^>]*href=["']https:\/\/privatenote\.ai\/(?!(de|fr|es|it|nl)\/["'])[^"']+\/["']/i;
const DEFAULT_SHELL_TITLE = "PrivateNote.ai - Secure Encrypted Notes";

/** Routes that must not ship the index.html shell title (duplicate-title SEO issue). */
const UNIQUE_TITLE_CHECKS = [
  { file: "developers.html", mustContain: "Developer integrations" },
  { file: "contact.html", mustContain: "Contact" },
  { file: "fr/contact.html", mustContain: "Contact" },
  { file: "de/developers.html", mustContain: "Entwickler" },
  { file: "blog/how-we-generate-passwords.html", mustContain: "password" },
  { file: "blog/encrypted-vs-secure-file-sharing.html", mustContain: "Encrypted" },
];

function exists(p) {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
}

function htmlFilesForRoute(route, dir) {
  const trimmed = route.replace(/\/+$/, "");
  const rel = trimmed.replace(/^\//, "");
  if (!rel) {
    return [path.join(dir, "index.html")];
  }
  const isLocaleHome = /^(de|fr|es|it|nl)$/.test(rel);
  const files = [path.join(dir, rel, "index.html")];
  if (!isLocaleHome) {
    files.unshift(path.join(dir, `${rel}.html`));
  }
  return files;
}

function parseSitemapRoutes(sitemapPath, siteOrigin = "https://privatenote.ai") {
  const xml = fs.readFileSync(sitemapPath, "utf8");
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/gi)].map((m) => m[1].trim());
  const routes = [];
  for (const loc of locs) {
    try {
      const u = loc.startsWith("http") ? new URL(loc) : new URL(loc, siteOrigin);
      const site = new URL(siteOrigin);
      if (u.origin !== site.origin) continue;
      let p = u.pathname;
      if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
      routes.push(p || "/");
    } catch {
      /* skip */
    }
  }
  return [...new Set(routes)];
}

function main() {
  const dir = path.resolve(process.argv[2] || "prerender");
  if (!exists(dir)) {
    console.error(`verify-prerender-output: directory not found: ${dir}`);
    process.exit(1);
  }

  const missing = REQUIRED_FLAT_HTML.filter((rel) => !exists(path.join(dir, rel)));
  if (!exists(path.join(dir, "index.html"))) {
    missing.unshift("index.html");
  }

  const sitemapPath = path.join(dir, "sitemap.xml");
  const noindexInSitemap = [];
  const badCanonical = [];
  if (exists(sitemapPath)) {
    for (const route of parseSitemapRoutes(sitemapPath)) {
      const candidates = htmlFilesForRoute(route, dir);
      const htmlPath = candidates.find((p) => exists(p));
      if (!htmlPath) {
        missing.push(candidates[0].replace(`${dir}${path.sep}`, ""));
        continue;
      }
      const html = fs.readFileSync(htmlPath, "utf8");
      if (NOINDEX_META_RE.test(html)) {
        noindexInSitemap.push(route || "/");
      }
      if (BAD_CANONICAL_TRAILING_SLASH_RE.test(html)) {
        badCanonical.push(route || "/");
      }
    }
  }

  if (missing.length) {
    console.error(
      "Prerender output is missing HTML files (crawlers expect 200 on /about, not only /about/):\n\n" +
        missing.map((m) => `  - ${m}`).join("\n"),
    );
    process.exit(1);
  }

  if (noindexInSitemap.length) {
    console.error(
      "Prerender output contains noindex on sitemap URLs (remove from sitemap or fix prerender):\n\n" +
        noindexInSitemap.map((r) => `  - ${r}`).join("\n"),
    );
    process.exit(1);
  }

  if (badCanonical.length) {
    console.error(
      "Prerender canonical uses trailing-slash URLs (301 targets):\n\n" +
        badCanonical.map((r) => `  - ${r}`).join("\n"),
    );
    process.exit(1);
  }

  const badTitles = [];
  for (const { file, mustContain } of UNIQUE_TITLE_CHECKS) {
    const htmlPath = path.join(dir, file);
    if (!exists(htmlPath)) {
      badTitles.push(`${file} (missing file)`);
      continue;
    }
    const html = fs.readFileSync(htmlPath, "utf8");
    const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
    const title = titleMatch?.[1] ?? "";
    if (title === DEFAULT_SHELL_TITLE || !title.toLowerCase().includes(mustContain.toLowerCase())) {
      badTitles.push(`${file} (title: ${title || "(empty)"})`);
    }
  }
  if (badTitles.length) {
    console.error(
      "Prerender HTML still uses generic shell <title> or wrong page title:\n\n" +
        badTitles.map((r) => `  - ${r}`).join("\n"),
    );
    process.exit(1);
  }

  const routeCount = exists(sitemapPath) ? parseSitemapRoutes(sitemapPath).length : 0;
  console.log(
    `verify-prerender-output: OK (${REQUIRED_FLAT_HTML.length + 1} key files, ${routeCount} sitemap URLs without noindex in ${dir})`,
  );
}

main();
