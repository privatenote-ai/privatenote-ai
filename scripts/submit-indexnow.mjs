/**
 * Submit changed URLs to IndexNow (Bing, Yandex, Naver, Seznam, Yep).
 *
 * Endpoint: POST https://api.indexnow.org/indexnow
 * Docs: https://www.indexnow.org/documentation
 *
 * Prerequisites:
 * - Key file must be live at https://privatenote.ai/{key}.txt (same body as the key)
 *
 * Usage:
 *   node scripts/submit-indexnow.mjs --url https://privatenote.ai/blog/foo
 *   node scripts/submit-indexnow.mjs --path /blog/foo /de/blog/foo
 *   node scripts/submit-indexnow.mjs --sitemap
 *   node scripts/submit-indexnow.mjs --sitemap --since 2026-07-01
 *   node scripts/submit-indexnow.mjs --dry-run --sitemap
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SITEMAP = path.join(ROOT, "client/public/sitemap.xml");

const HOST = "privatenote.ai";
const ORIGIN = `https://${HOST}`;
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const KEY = "03be1389d138fb25469729d327f2f166";
const KEY_LOCATION = `${ORIGIN}/${KEY}.txt`;
const BATCH_SIZE = 10_000;

function parseArgs(argv) {
  const out = {
    dryRun: false,
    sitemap: false,
    since: null,
    urls: [],
    paths: [],
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--dry-run") out.dryRun = true;
    else if (arg === "--sitemap") out.sitemap = true;
    else if (arg === "--since") {
      out.since = argv[++i];
      if (!out.since) throw new Error("--since requires a YYYY-MM-DD date");
    } else if (arg === "--url") {
      const value = argv[++i];
      if (!value) throw new Error("--url requires a full URL");
      out.urls.push(value);
    } else if (arg === "--path") {
      while (argv[i + 1] && !argv[i + 1].startsWith("--")) {
        out.paths.push(argv[++i]);
      }
    } else if (arg === "--help" || arg === "-h") {
      out.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return out;
}

function normalizeUrl(input) {
  const url = new URL(input);
  if (url.hostname !== HOST && url.hostname !== `www.${HOST}`) {
    throw new Error(`URL host must be ${HOST}: ${input}`);
  }
  url.hostname = HOST;
  url.protocol = "https:";
  url.hash = "";
  return url.toString();
}

function pathToUrl(route) {
  const cleaned = route.startsWith("/") ? route : `/${route}`;
  return normalizeUrl(`${ORIGIN}${cleaned}`);
}

async function urlsFromSitemap(since) {
  const xml = await fs.readFile(SITEMAP, "utf8");
  const blocks = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)];
  const urls = [];

  for (const [, block] of blocks) {
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1]?.trim();
    if (!loc) continue;
    const lastmod = block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1]?.trim();
    if (since && (!lastmod || lastmod < since)) continue;
    urls.push(normalizeUrl(loc));
  }

  return urls;
}

function chunk(items, size) {
  const batches = [];
  for (let i = 0; i < items.length; i += size) {
    batches.push(items.slice(i, i + size));
  }
  return batches;
}

async function submitBatch(urlList) {
  const body = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  };

  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });

  const text = await res.text().catch(() => "");
  return { status: res.status, text };
}

function printHelp() {
  console.log(`Submit URLs to IndexNow (${INDEXNOW_ENDPOINT})

Usage:
  node scripts/submit-indexnow.mjs --url https://privatenote.ai/blog/foo
  node scripts/submit-indexnow.mjs --path /blog/foo /de/blog/bar
  node scripts/submit-indexnow.mjs --sitemap
  node scripts/submit-indexnow.mjs --sitemap --since 2026-07-01
  node scripts/submit-indexnow.mjs --dry-run --sitemap

Key file (must be deployed): ${KEY_LOCATION}`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  const collected = new Set();

  for (const url of args.urls) collected.add(normalizeUrl(url));
  for (const route of args.paths) collected.add(pathToUrl(route));

  if (args.sitemap) {
    for (const url of await urlsFromSitemap(args.since)) collected.add(url);
  }

  const urlList = [...collected];
  if (urlList.length === 0) {
    printHelp();
    console.error("\nNo URLs to submit. Pass --url, --path, and/or --sitemap.");
    process.exitCode = 1;
    return;
  }

  console.log(`IndexNow host: ${HOST}`);
  console.log(`Key location: ${KEY_LOCATION}`);
  console.log(`URLs: ${urlList.length}`);

  if (args.dryRun) {
    for (const url of urlList) console.log(`  ${url}`);
    console.log("Dry run only — no POST sent.");
    return;
  }

  for (const [index, batch] of chunk(urlList, BATCH_SIZE).entries()) {
    const { status, text } = await submitBatch(batch);
    const ok = status === 200 || status === 202;
    console.log(
      `Batch ${index + 1}: ${batch.length} URL(s) → HTTP ${status}${text ? ` ${text.slice(0, 200)}` : ""}`,
    );
    if (!ok) {
      process.exitCode = 1;
      return;
    }
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
