// Flags <a href> links to slashless locale homes (/de → 308 /de/) in prerender HTML.
// Run after prerender: `node scripts/check-locale-home-anchor-hrefs.js prerender`

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const LOCALE_CODES = ["de", "fr", "es", "it", "nl", "pt", "sr", "hr", "tr"];

/** <a href="/de"> or <a href="https://privatenote.ai/de"> — not /de/ or /de/about */
export const BAD_SLASHLESS_LOCALE_HOME_ANCHOR_RE = new RegExp(
  `<a\\s[^>]*\\bhref=(["'])(?:https:\\/\\/privatenote\\.ai)?\\/(${LOCALE_CODES.join("|")})\\1`,
  "gi",
);

/** Rewrite cached/stale <a href="/de"> → <a href="/de/"> in prerender snapshots. */
export function fixSlashlessLocaleHomeAnchorHrefs(html) {
  BAD_SLASHLESS_LOCALE_HOME_ANCHOR_RE.lastIndex = 0;
  return html.replace(BAD_SLASHLESS_LOCALE_HOME_ANCHOR_RE, (match, quote) => {
    return `${match.slice(0, -quote.length)}/${quote}`;
  });
}

const MAX_FAILURES = 40;

async function walkHtmlFiles(dir) {
  const files = [];
  async function walk(current) {
    const entries = await fs.readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const abs = path.join(current, entry.name);
      if (entry.isDirectory()) {
        await walk(abs);
      } else if (entry.isFile() && entry.name.endsWith(".html")) {
        files.push(abs);
      }
    }
  }
  await walk(dir);
  return files.sort();
}

function findBadAnchors(html) {
  const hits = [];
  BAD_SLASHLESS_LOCALE_HOME_ANCHOR_RE.lastIndex = 0;
  let match;
  while ((match = BAD_SLASHLESS_LOCALE_HOME_ANCHOR_RE.exec(html)) !== null) {
    hits.push(match[0]);
  }
  return hits;
}

async function main() {
  const dir = path.resolve(process.argv[2] || "prerender");
  let files;
  try {
    files = await walkHtmlFiles(dir);
  } catch {
    console.error(`check-locale-home-anchor-hrefs: directory not found: ${dir}`);
    process.exitCode = 1;
    return;
  }

  if (files.length === 0) {
    console.error(`check-locale-home-anchor-hrefs: no HTML files in ${dir}`);
    process.exitCode = 1;
    return;
  }

  const failures = [];
  for (const file of files) {
    const html = await fs.readFile(file, "utf8");
    const hits = findBadAnchors(html);
    if (hits.length === 0) continue;
    const rel = path.relative(dir, file);
    failures.push({ rel, count: hits.length, sample: hits[0] });
  }

  if (failures.length === 0) {
    console.log(
      `check-locale-home-anchor-hrefs: ok (${files.length} HTML files, no slashless locale home <a href>)`,
    );
    return;
  }

  const shown = failures.slice(0, MAX_FAILURES);
  console.error(
    "Prerender HTML links to slashless locale homes (use /de/ not /de — avoids 308 redirects):\n\n" +
      shown
        .map((f) => `  - ${f.rel}: ${f.count} bad link(s), e.g. ${f.sample}`)
        .join("\n") +
      (failures.length > MAX_FAILURES
        ? `\n\n  … and ${failures.length - MAX_FAILURES} more file(s)`
        : ""),
  );
  process.exitCode = 1;
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
  await main();
}
