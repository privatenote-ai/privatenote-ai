/**
 * Append sitemap URL blocks for new locale codes by cloning an existing locale block.
 * Usage: node scripts/extend-sitemap-locales.mjs pt sr hr
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITEMAP = path.join(__dirname, "../client/public/sitemap.xml");
const TEMPLATE_LOCALE = "nl";
const LASTMOD = "2026-07-02";

async function main() {
  const newLocales = process.argv.slice(2);
  if (newLocales.length === 0) {
    console.error("Usage: node scripts/extend-sitemap-locales.mjs pt sr hr");
    process.exit(1);
  }

  let xml = await fs.readFile(SITEMAP, "utf8");
  for (const locale of newLocales) {
    if (xml.includes(`https://privatenote.ai/${locale}/`)) {
      console.log(`Skip ${locale} — already in sitemap`);
      continue;
    }

    const homeBlock = `  <url>
    <loc>https://privatenote.ai/${locale}/</loc>
    <lastmod>${LASTMOD}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;

    xml = xml.replace(
      `  <url>
    <loc>https://privatenote.ai/nl/</loc>`,
      `  <url>
    <loc>https://privatenote.ai/nl/</loc>`,
    );

    // Insert home after nl home
    if (!xml.includes(`https://privatenote.ai/${locale}/`)) {
      xml = xml.replace(
        `<loc>https://privatenote.ai/nl/</loc>
    <lastmod>2026-05-07</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`,
        `<loc>https://privatenote.ai/nl/</loc>
    <lastmod>2026-05-07</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
${homeBlock}`,
      );
    }

    const localeLines = xml
      .split("\n")
      .filter(
        (line) =>
          line.startsWith("  <url><loc>") &&
          line.includes(`https://privatenote.ai/${TEMPLATE_LOCALE}/`),
      );

    const cloned = localeLines
      .map((line) => line.replaceAll(`/${TEMPLATE_LOCALE}/`, `/${locale}/`))
      .join("\n");

    xml = xml.replace(
      localeLines[localeLines.length - 1],
      `${localeLines[localeLines.length - 1]}\n${cloned}`,
    );

    console.log(`Added ${locale} (${localeLines.length} routes + home)`);
  }

  await fs.writeFile(SITEMAP, xml, "utf8");
  console.log(`Updated ${SITEMAP}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
