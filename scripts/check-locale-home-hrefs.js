// Ensures locale home pages ship absolute canonical/hreflang (reciprocal return-tags for Ahrefs/Google).
// Run after prerender: `node scripts/check-locale-home-hrefs.js prerender`

import fs from "node:fs/promises";
import path from "node:path";

const ORIGIN = "https://privatenote.ai";
const LOCALE_CODES = ["de", "fr", "es", "it", "nl", "pt", "sr", "hr"];

const HOME_FILES = [
  { file: "index.html", language: "en" },
  ...LOCALE_CODES.map((language) => ({ file: `${language}/index.html`, language })),
];

const REQUIRED_HREFLANG = [
  { hrefLang: "en", href: `${ORIGIN}/` },
  ...LOCALE_CODES.map((code) => ({ hrefLang: code, href: `${ORIGIN}/${code}/` })),
  { hrefLang: "x-default", href: `${ORIGIN}/` },
];

/** In <link> tags only — avoids matching route strings buried in bundled JS */
const BAD_REL_LOCALE_ROOT = new RegExp(
  `<link\\b[^>]*\\bhref=(["'])\\/(${LOCALE_CODES.join("|")})\\1[^>]*>`,
  "gi",
);

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

    const ogChecks = [
      ['property="og:title"', "og:title"],
      ['property="og:description"', "og:description"],
      ['property="og:image" content="https://privatenote.ai/og-image.png"', "og:image"],
      ['property="og:image:width" content="1200"', "og:image:width"],
      ['property="og:image:height" content="630"', "og:image:height"],
      [`property="og:url" content="${canonicalHref}"`, "og:url"],
    ];
    for (const [needle, label] of ogChecks) {
      if (!html.includes(needle)) {
        failures.push(`${file}: missing ${label}`);
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
