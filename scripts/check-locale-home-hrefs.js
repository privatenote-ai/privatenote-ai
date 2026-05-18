// Ensures locale home pages ship absolute canonical/hreflang (reciprocal return-tags for Ahrefs/Google).
// Run after prerender: `node scripts/check-locale-home-hrefs.js prerender`

import fs from "node:fs/promises";
import path from "node:path";

const ORIGIN = "https://privatenote.ai";

const HOME_FILES = [
  { file: "index.html", language: "en" },
  { file: "de/index.html", language: "de" },
  { file: "fr/index.html", language: "fr" },
  { file: "es/index.html", language: "es" },
];

const REQUIRED_HREFLANG = [
  { hrefLang: "en", href: `${ORIGIN}/` },
  { hrefLang: "de", href: `${ORIGIN}/de/` },
  { hrefLang: "fr", href: `${ORIGIN}/fr/` },
  { hrefLang: "es", href: `${ORIGIN}/es/` },
  { hrefLang: "x-default", href: `${ORIGIN}/` },
];

/** In <link> tags only — avoids matching route strings buried in bundled JS */
const BAD_REL_LOCALE_ROOT =
  /<link\b[^>]*\bhref=(["'])\/(de|fr|es)\1[^>]*>/gi;

const BAD_REL_ROOT_CANONICAL = /<link\b[^>]*\brel=["']canonical["'][^>]*\bhref=(["'])\/\1/i;

async function main() {
  const dir = path.resolve(process.argv[2] || "prerender");
  const failures = [];

  for (const { file, language } of HOME_FILES) {
    const absFile = path.join(dir, file);
    let html;
    try {
      html = await fs.readFile(absFile, "utf8");
    } catch {
      failures.push(`${file}: missing`);
      continue;
    }

    const canonicalHref = language === "en" ? `${ORIGIN}/` : `${ORIGIN}/${language}/`;
    if (!html.includes(`rel="canonical" href="${canonicalHref}"`)) {
      failures.push(`${file}: missing canonical ${canonicalHref}`);
    }

    for (const { hrefLang, href } of REQUIRED_HREFLANG) {
      const needle = `hreflang="${hrefLang}" href="${href}"`;
      if (!html.includes(needle)) {
        failures.push(`${file}: missing ${needle}`);
      }
    }

    for (const re of [BAD_REL_LOCALE_ROOT, BAD_REL_ROOT_CANONICAL]) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(html)) !== null) {
        failures.push(`${file}: relative SEO link ${m[0]}`);
      }
    }
  }

  if (failures.length) {
    console.error(
      "Locale home pages need absolute reciprocal hreflang (https://privatenote.ai/…):\n\n" +
        failures.map((f) => `  - ${f}`).join("\n"),
    );
    process.exitCode = 1;
    return;
  }

  console.log(`check-locale-home-hrefs: ok (${HOME_FILES.length} locale home HTML files)`);
}

await main();
