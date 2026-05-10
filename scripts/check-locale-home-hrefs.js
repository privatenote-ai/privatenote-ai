// Ensures locale home canonical/alternate uses /de/ (200), not /de (308 on CDN).
// Run after prerender: `node scripts/check-locale-home-hrefs.js prerender`

import fs from "node:fs/promises";
import path from "node:path";

/** In <link> tags only — avoids matching route strings buried in bundled JS */

const BAD_REL_LOCALE_ROOT =
  /<link\b[^>]*\bhref=(["'])\/(de|fr|es)\1[^>]*>/gi;

const BAD_ABS_LOCALE_ROOT =
  /<link\b[^>]*\bhref=(["'])https?:\/\/[^/"']+\/(de|fr|es)\1[^>]*>/gi;

async function walkHtmlFiles(dir, out = []) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      await walkHtmlFiles(p, out);
    } else if (e.name.endsWith(".html")) {
      out.push(p);
    }
  }
  return out;
}

function collectBadHrefs(html) {
  const hits = [];
  for (const re of [BAD_REL_LOCALE_ROOT, BAD_ABS_LOCALE_ROOT]) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(html)) !== null) {
      hits.push(m[0]);
    }
  }
  return [...new Set(hits)];
}

async function main() {
  const argvDirs = process.argv.slice(2);
  const useDefaultDir = argvDirs.length === 0;
  const dirs = useDefaultDir ? ["prerender"] : argvDirs;
  const requireHtml = !useDefaultDir;

  let scanned = 0;
  const failures = [];

  for (const d of dirs) {
    const abs = path.resolve(d);
    const files = await walkHtmlFiles(abs);
    for (const file of files) {
      scanned++;
      const html = await fs.readFile(file, "utf8");
      const bad = collectBadHrefs(html);
      if (bad.length) {
        failures.push(`${path.relative(process.cwd(), file)}: ${bad.join(", ")}`);
      }
    }
  }

  if (failures.length) {
    console.error(
      "Locale root hrefs must use a trailing slash (e.g. /de/) so hreflang/canonical do not target 308 redirects:\n\n" +
        failures.join("\n"),
    );
    process.exitCode = 1;
    return;
  }

  if (scanned === 0 && requireHtml) {
    console.error("check-locale-home-hrefs: no HTML files found under:", dirs.join(", "));
    process.exitCode = 1;
    return;
  }

  if (scanned === 0) {
    console.warn("check-locale-home-hrefs: no HTML files under:", dirs.join(", "));
  } else {
    console.log(`check-locale-home-hrefs: ok (${scanned} HTML file(s) under ${dirs.join(", ")})`);
  }
}

await main();
