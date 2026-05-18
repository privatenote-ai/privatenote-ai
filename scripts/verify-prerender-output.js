// Verifies prerender output includes flat .html files for marketing routes (200 at /about, not only /about/).
// Run after build:prerender: `node scripts/verify-prerender-output.js prerender`

import fs from "node:fs";
import path from "node:path";

const REQUIRED_FLAT_HTML = [
  "about.html",
  "blog.html",
  "contact.html",
  "how-it-works.html",
  "password-generator.html",
  "privacy.html",
  "privacy-tools.html",
  "security-resources.html",
  "terms.html",
  "de/terms.html",
];

function exists(p) {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
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

  if (missing.length) {
    console.error(
      "Prerender output is missing flat HTML files (crawlers expect 200 on /about, not only /about/):\n\n" +
        missing.map((m) => `  - ${m}`).join("\n"),
    );
    process.exit(1);
  }

  console.log(`verify-prerender-output: OK (${REQUIRED_FLAT_HTML.length + 1} key files in ${dir})`);
}

main();
