/**
 * Ensures every public marketing page ships a self-referencing hreflang in prerender HTML.
 * Run after prerender: `tsx scripts/check-marketing-hreflang.ts prerender`
 */
import fs from "node:fs";
import path from "node:path";
import { PUBLIC_MARKETING_PATHS } from "../shared/publicMarketingPaths.ts";
import { selfReferenceHreflangForRoute } from "../shared/localizedMarketingHreflang.ts";
import { LOCALE_HOME_PATH_PATTERN } from "../shared/supportedLanguages.ts";

const LOCALE_HOME_RE = new RegExp(`^(${LOCALE_HOME_PATH_PATTERN})$`);

function htmlFilesForRoute(route: string, dir: string): string[] {
  const trimmed = route.replace(/\/+$/, "") || "/";
  const rel = trimmed.replace(/^\//, "");
  if (!rel) {
    return [path.join(dir, "index.html")];
  }
  const files = [path.join(dir, rel, "index.html")];
  if (!LOCALE_HOME_RE.test(rel)) {
    files.unshift(path.join(dir, `${rel}.html`));
  }
  return files;
}

function readHtmlForRoute(route: string, dir: string): string | null {
  for (const file of htmlFilesForRoute(route, dir)) {
    try {
      return fs.readFileSync(file, "utf8");
    } catch {
      /* try next candidate */
    }
  }
  return null;
}

function main() {
  const dir = path.resolve(process.argv[2] || "prerender");
  const failures: string[] = [];
  let checked = 0;

  for (const route of PUBLIC_MARKETING_PATHS) {
    const selfRef = selfReferenceHreflangForRoute(route);
    if (!selfRef) continue;

    const html = readHtmlForRoute(route, dir);
    if (!html) {
      failures.push(`${route}: prerender HTML missing`);
      continue;
    }

    checked++;
    const needle = `hreflang="${selfRef.hrefLang}" href="${selfRef.href}"`;
    if (!html.includes(needle)) {
      failures.push(`${route}: missing self-reference \`${needle}\``);
    }
  }

  if (failures.length) {
    console.error(
      "Marketing pages need self-referencing hreflang in prerender HTML:\n\n" +
        failures.slice(0, 40).map((f) => `  - ${f}`).join("\n") +
        (failures.length > 40 ? `\n  … and ${failures.length - 40} more` : ""),
    );
    process.exitCode = 1;
    return;
  }

  console.log(`check-marketing-hreflang: ok (${checked} marketing pages with self-referencing hreflang)`);
}

main();
