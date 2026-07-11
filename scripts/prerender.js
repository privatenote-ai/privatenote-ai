// scripts/prerender.js
// ESM (package.json "type": "module")

import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import { readFileSync } from "node:fs";
import path from "node:path";
import http from "node:http";
import https from "node:https";
import { chromium } from "playwright";
import {
  absolutePublicUrl,
  buildHomeSeoHeadMarkup,
  canonicalAbsoluteUrlForRoute,
  canonicalPathForHomeLanguage,
  homeLanguageFromRoute,
  isLocaleHomeRoute,
  PUBLIC_SITE_ORIGIN,
} from "../shared/homeSeoLinks.ts";
import {
  buildMarketingHreflangMarkup,
} from "../shared/localizedMarketingHreflang.ts";
import { injectPrerenderDocumentMeta } from "../shared/injectPrerenderDocumentMeta.ts";
import {
  isPublicMarketingPath,
  PUBLIC_MARKETING_PATHS,
} from "../shared/publicMarketingPaths.ts";
import { LOCALE_HOME_PATH_PATTERN, SUPPORTED_LANGUAGES } from "../shared/supportedLanguages.ts";
import {
  getChangedFiles,
  restoreHtmlCache,
  saveHtmlCache,
  selectRoutesToPrerender,
} from "./prerenderIncremental.js";

const OUTPUT_DIR = process.env.OUTPUT_DIR || "prerender";
const HTML_CACHE_DIR = process.env.PRERENDER_HTML_CACHE_DIR || "";
const INCREMENTAL = process.env.PRERENDER_INCREMENTAL === "1";
const BUILD_DIR = path.resolve("dist");
const DIST_DIR = path.resolve(OUTPUT_DIR);
const PREVIEW_URL = process.env.PREVIEW_URL || "http://127.0.0.1:4173";
const SITEMAP_PATH = process.env.SITEMAP_PATH || "/sitemap.xml";
const SITEMAP_URL = `${PREVIEW_URL}${SITEMAP_PATH}`;
const PREVIEW_ORIGIN = new URL(PREVIEW_URL);
const PREVIEW_HOST = PREVIEW_ORIGIN.hostname;
const PREVIEW_PORT = PREVIEW_ORIGIN.port || "4173";

// -------------------------------
// Fallback routes (public-only; keep in sync with shared/publicMarketingPaths.ts)
// -------------------------------
const FALLBACK_ROUTES = [...PUBLIC_MARKETING_PATHS];

const LANGUAGE_STORAGE_KEY = "privatenote.language";

function languageForPrerenderRoute(route) {
  const first = route.split("/").filter(Boolean)[0];
  if (first && SUPPORTED_LANGUAGES.includes(first) && first !== "en") {
    return first;
  }
  return "en";
}

// -------------------------------
// Preview server helpers
// -------------------------------
function startPreview() {
  const previewIsHttps = PREVIEW_URL.startsWith("https:");
  const child = spawn("npm", ["run", "preview", "--", "--host", PREVIEW_HOST, "--port", PREVIEW_PORT], {
    stdio: "inherit",
    shell: true,
    detached: true,
    env: {
      ...process.env,
      NODE_ENV: "production",
      // The dev server defaults to HTTPS for browser APIs, but prerendering only
      // needs a local static preview. Keep the preview protocol aligned with
      // PREVIEW_URL so CI does not wait on http:// while Vite serves https://.
      VITE_DEV_HTTP: previewIsHttps ? process.env.VITE_DEV_HTTP : "1",
    },
  });
  child.__killed = false;
  return child;
}

async function probe(url) {
  return new Promise((resolve) => {
    const lib = url.startsWith("https") ? https : http;
    const req = lib.get(url, (res) => {
      res.resume();
      resolve(res.statusCode && res.statusCode < 500);
    });
    req.on("error", () => resolve(false));
    req.end();
  });
}

async function waitForServer(url, timeoutMs = 25_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await probe(url)) return;
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error("vite preview did not start in time");
}

function killPreview(preview) {
  if (!preview || preview.__killed) return;
  try {
    process.kill(-preview.pid, "SIGINT"); // kill process group
  } catch { }
  try {
    preview.kill("SIGINT");
  } catch { }
  preview.__killed = true;
}

// -------------------------------
// Sitemap parsing
// -------------------------------
async function fetchText(url) {
  const lib = url.startsWith("https") ? https : http;
  return new Promise((resolve, reject) => {
    lib
      .get(url, (res) => {
        if (res.statusCode >= 400) {
          res.resume();
          return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        }
        let data = "";
        res.setEncoding("utf8");
        res.on("data", (c) => (data += c));
        res.on("end", () => resolve(data));
      })
      .on("error", reject);
  });
}

function normalizeRoutePath(input, siteOrigin) {
  try {
    // handle absolute <loc> or relative
    const u = input.startsWith("http") ? new URL(input) : new URL(input, siteOrigin);
    // Only keep same-origin paths
    const site = new URL(siteOrigin);
    if (u.origin !== site.origin) return null;
    let p = u.pathname;
    const bare = p.replace(/\/+$/, "") || "/";
    const parts = bare.split("/").filter(Boolean);
    if (parts.length === 1 && new RegExp(`^(${LOCALE_HOME_PATH_PATTERN})$`).test(parts[0])) {
      return `/${parts[0]}/`;
    }
    // Keep pathname only; strip trailing slash except for root
    if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
    return p || "/";
  } catch {
    return null;
  }
}

function uniq(arr) {
  return [...new Set(arr)];
}

async function discoverRoutesFromSitemapOrFallback() {
  const marketingRoutes = uniq(FALLBACK_ROUTES);
  let sitemapRoutes = [];

  try {
    const xml = await fetchText(SITEMAP_URL);
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/gi)].map((m) => m[1].trim());
    sitemapRoutes = uniq(
      locs.map((loc) => normalizeRoutePath(loc, PREVIEW_URL)).filter(Boolean),
    );
  } catch (e) {
    console.warn(`🧭 Could not read sitemap: ${e?.message || e}. Using marketing path list only.`);
  }

  const merged = uniq([...sitemapRoutes, ...marketingRoutes]);
  if (merged.length === 0) return marketingRoutes;

  const addedFromMarketing = marketingRoutes.filter((route) => !sitemapRoutes.includes(route));
  console.log(
    `🧭 Prerender routes: ${merged.length} total (${sitemapRoutes.length} sitemap` +
      `${addedFromMarketing.length ? ` + ${addedFromMarketing.length} from publicMarketingPaths` : ""}).`,
  );
  if (addedFromMarketing.length > 0) {
    console.warn(
      "🧭 Sitemap is missing marketing routes (update client/public/sitemap.xml):\n" +
        addedFromMarketing.slice(0, 12).map((route) => `   - ${route}`).join("\n") +
        (addedFromMarketing.length > 12 ? `\n   … and ${addedFromMarketing.length - 12} more` : ""),
    );
  }
  return merged;
}

// -------------------------------
// Output + HTML tweaks
// -------------------------------
async function prepareOutputDir() {
  if (BUILD_DIR === DIST_DIR) return;

  await fs.rm(DIST_DIR, { recursive: true, force: true });
  await fs.cp(BUILD_DIR, DIST_DIR, { recursive: true });

  if (INCREMENTAL && HTML_CACHE_DIR) {
    const restored = await restoreHtmlCache(HTML_CACHE_DIR, DIST_DIR);
    if (restored > 0) {
      console.log(`📦 Restored ${restored} cached HTML file(s) from ${HTML_CACHE_DIR}`);
    } else {
      console.log(`📦 No cached HTML in ${HTML_CACHE_DIR} — first incremental run will prerender all routes.`);
    }
  }
}

function routeOutDir(route) {
  const rel = route.replace(/^\/+/, ""); // drop leading slash(es)
  return rel ? path.join(DIST_DIR, rel) : DIST_DIR;
}

/**
 * Remove <link rel="modulepreload"> tags for feature chunks that were injected
 * by Vite's module-preload polyfill at render time.  These chunks (CreateNote,
 * NoteSettingsPanel, analyticsEvent, qr-code, …) are only needed on the
 * interactive home/note pages, so preloading them on static marketing pages
 * (blog posts, pricing, about…) wastes bandwidth and triggers browser warnings:
 * "preloaded using link preload but not used within a few seconds".
 *
 * We keep:
 *  • the Vite entry script (<script type="module" src="/assets/index-*.js">)
 *  • stylesheet <link rel="stylesheet"> tags
 *  • vendor-react and vendor-query shared chunks (nearly always needed)
 *  • font preloads
 *
 * Everything else (<link rel="modulepreload"> for feature chunks) is removed.
 */
function stripStaleModulePreloads(html) {
  return html.replace(
    /<link\s+rel="modulepreload"[^>]*href="\/assets\/(?!vendor-react-|vendor-query-|index-)[^"]*\.js"[^>]*\/?>/gi,
    "",
  );
}

function postProcessHTML(html, route) {
  let out = injectPrerenderDocumentMeta(html, route);

  // Rewrite preview absolute URLs -> root-relative (except locale-home SEO links; fixed below).
  out = out.replace(/https?:\/\/(?:localhost|127\.0\.0\.1):4173/gi, "");

  // Crawlers (X, LinkedIn) require absolute HTTPS image URLs in prerendered HTML.
  out = out.replace(
    /(<meta\s+(?:property="og:image"|name="twitter:image")\s+content=")\/([^"]+)"/gi,
    `$1${PUBLIC_SITE_ORIGIN}/$2"`,
  );
  const isPublicSitemapRoute = isPublicMarketingPath(route);

  // React may snapshot canonical/og:url with a trailing slash; crawlers need the 200 URL shape.
  out = out.replace(/<link\b[^>]*\brel=["']canonical["'][^>]*>/gi, "");
  out = out.replace(/<meta\s+property=["']og:url["'][^>]*>/gi, "");

  if (isLocaleHomeRoute(route)) {
    out = out.replace(
      /<link\b[^>]*\bdata-privatenote-home-locale=["']true["'][^>]*>/gi,
      "",
    );
    const language = homeLanguageFromRoute(route);
    const pageUrl = absolutePublicUrl(canonicalPathForHomeLanguage(language));
    const seoBlock = [
      buildHomeSeoHeadMarkup(language),
      `<meta property="og:url" content="${pageUrl}" />`,
    ].join("\n");
    out = out.replace("</head>", `${seoBlock}\n</head>`);
  } else if (isPublicSitemapRoute) {
    out = out.replace(
      /<link\b[^>]*\bdata-privatenote-localized-marketing=["']true["'][^>]*>/gi,
      "",
    );
    const pageUrl = canonicalAbsoluteUrlForRoute(route);
    const hreflang = buildMarketingHreflangMarkup(route);
    const seoExtras = [
      `<link rel="canonical" href="${pageUrl}" />`,
      `<meta property="og:url" content="${pageUrl}" />`,
      hreflang,
    ]
      .filter(Boolean)
      .join("\n");
    out = out.replace("</head>", `${seoExtras}\n</head>`);
  }

  // Strip feature-chunk modulepreload hints baked in by Vite's polyfill at render time.
  // Keeps vendor-react, vendor-query, and the entry chunk; removes everything else.
  out = stripStaleModulePreloads(out);

  // Never ship sitemap marketing HTML with 404-shell noindex (historical /* → /404.html deploys).
  out = out.replace(/<meta\s+name=["']robots["']\s+content=["'][^"']*noindex[^"']*["'][^>]*>/gi, "");

  if (isPublicSitemapRoute && !/<meta\s+name=["']robots["']/i.test(out)) {
    out = out.replace("</head>", '<meta name="robots" content="index, follow" /></head>');
  }

  // (Optional) hide cookie banners in the static snapshot (keeps HTML clean for bots)
  out = out.replace(
    "</head>",
    `<style id="__prerender_hide_cookie">
      .cookie-banner, [aria-label="Cookie Preferences"],
      .cookie-consent,
      .fixed.bottom-0.left-0.right-0.z-50.p-4.bg-black\\/80 { display: none !important; }
    </style></head>`
  );

  return out;
}

/** Re-apply SEO head injection for every marketing route (fixes stale cached HTML snapshots). */
async function repostProcessAllMarketingHtml(routes) {
  let updated = 0;
  for (const route of routes) {
    const trimmed = route.replace(/\/+$/, "") || "/";
    const rel = trimmed.replace(/^\//, "");
    const files = [];
    if (!rel) {
      files.push(path.join(DIST_DIR, "index.html"));
    } else {
      const isLocaleHome = new RegExp(`^(${LOCALE_HOME_PATH_PATTERN})$`).test(rel);
      files.push(path.join(DIST_DIR, rel, "index.html"));
      if (!isLocaleHome) {
        files.push(path.join(DIST_DIR, `${rel}.html`));
      }
    }
    for (const file of files) {
      try {
        const html = await fs.readFile(file, "utf8");
        const cleaned = postProcessHTML(html, route);
        if (cleaned !== html) {
          await fs.writeFile(file, cleaned, "utf8");
          updated++;
        }
      } catch {
        /* route file may not exist for every path shape */
      }
    }
  }
  if (updated > 0) {
    console.log(`🔁 Re-post-processed SEO markup in ${updated} HTML file(s).`);
  }
}

const INDEX_SCRIPT_RE = /\/assets\/index-[A-Za-z0-9_-]+\.js/g;
const INDEX_STYLESHEET_RE = /\/assets\/index-[A-Za-z0-9_-]+\.css/g;
const ASSET_REF_RE = /\/assets\/([A-Za-z0-9_.-]+\.(?:js|css))/g;

function readCanonicalShellAssets() {
  const shellPath = path.join(BUILD_DIR, "index.html");
  const shell = readFileSync(shellPath, "utf8");
  const scriptMatch = shell.match(/src="(\/assets\/index-[A-Za-z0-9_-]+\.js)"/);
  const stylesheetMatch = shell.match(/href="(\/assets\/index-[A-Za-z0-9_-]+\.css)"/);
  if (!scriptMatch) {
    throw new Error(`Could not find Vite entry script in ${shellPath}`);
  }
  if (!stylesheetMatch) {
    throw new Error(`Could not find Vite entry stylesheet in ${shellPath}`);
  }
  return {
    entryScript: scriptMatch[1],
    entryStylesheet: stylesheetMatch[1],
  };
}

async function walkHtmlFiles(dir, out = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkHtmlFiles(full, out);
    } else if (entry.name.endsWith(".html")) {
      out.push(full);
    }
  }
  return out;
}

/** Align cached prerender HTML with the current Vite shell assets (JS + CSS hashes). */
async function syncShellAssetRefs({ entryScript, entryStylesheet }) {
  const files = await walkHtmlFiles(DIST_DIR);
  let scriptUpdates = 0;
  let stylesheetUpdates = 0;
  for (const file of files) {
    const html = await fs.readFile(file, "utf8");
    const withScript = html.replace(INDEX_SCRIPT_RE, entryScript);
    const next = withScript.replace(INDEX_STYLESHEET_RE, entryStylesheet);
    if (next !== html) {
      await fs.writeFile(file, next, "utf8");
      if (withScript !== html) scriptUpdates++;
      if (next !== withScript) stylesheetUpdates++;
    }
  }
  if (scriptUpdates > 0 || stylesheetUpdates > 0) {
    console.log(
      `🔧 Synced shell assets to ${entryScript} + ${entryStylesheet}` +
        ` (${scriptUpdates} script, ${stylesheetUpdates} stylesheet HTML file(s)).`,
    );
  }
}

async function verifyPrerenderAssetRefs() {
  const files = await walkHtmlFiles(DIST_DIR);
  const missing = new Map();
  for (const file of files) {
    const html = await fs.readFile(file, "utf8");
    const refs = new Set([...html.matchAll(ASSET_REF_RE)].map((m) => m[1]));
    for (const ref of refs) {
      const assetPath = path.join(DIST_DIR, "assets", ref);
      try {
        await fs.access(assetPath);
      } catch {
        const rel = path.relative(process.cwd(), file);
        if (!missing.has(ref)) missing.set(ref, []);
        missing.get(ref).push(rel);
      }
    }
  }
  if (missing.size > 0) {
    const lines = [...missing.entries()].flatMap(([asset, htmlFiles]) =>
      htmlFiles.map((f) => `  - ${asset} (referenced in ${f})`),
    );
    throw new Error(
      "Prerender HTML references assets that are not in the deploy output:\n\n" + lines.join("\n"),
    );
  }
  console.log(`✓ All asset references resolve under ${DIST_DIR}/assets/`);
}

/**
 * Write prerendered HTML so both URL shapes work on Cloudflare Pages:
 * - `about.html` → GET /about returns 200 (crawlers, navbar links)
 * - `about/index.html` → GET /about/ returns 200
 * Locale homes stay directory-only (`de/index.html` → /de/).
 */
async function saveHTML(route, html) {
  const cleaned = postProcessHTML(html, route);
  const trimmed = route.replace(/\/+$/, "");
  const rel = trimmed.replace(/^\//, "");

  if (!rel) {
    await fs.writeFile(path.join(DIST_DIR, "index.html"), cleaned, "utf8");
    return;
  }

  const isLocaleHome = new RegExp(`^(${LOCALE_HOME_PATH_PATTERN})$`).test(rel);

  if (!isLocaleHome) {
    const flatFile = path.join(DIST_DIR, `${rel}.html`);
    await fs.mkdir(path.dirname(flatFile), { recursive: true });
    await fs.writeFile(flatFile, cleaned, "utf8");
  }

  const outDir = routeOutDir(trimmed === "" ? "/" : `/${rel}`);
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(path.join(outDir, "index.html"), cleaned, "utf8");
}

// -------------------------------
// Main
// -------------------------------
async function main() {
  const preview = startPreview();
  let browser;

  try {
    await waitForServer(PREVIEW_URL);
    await prepareOutputDir();
    const canonicalShellAssets = readCanonicalShellAssets();

    browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-gpu"],
    });

    const page = await browser.newPage({
      viewport: { width: 390, height: 844 },
      isMobile: true,
    });

    // Static prerendering runs without the Worker/API process. Public pages may
    // still ask for auth or account preference state while booting; answer those
    // locally so Vite does not proxy to localhost:8787 and spam/fail CI.
    await page.route("**/api/**", async (route) => {
      const url = new URL(route.request().url());
      const json = (status, body) =>
        route.fulfill({
          status,
          contentType: "application/json",
          body: JSON.stringify(body),
        });

      if (url.pathname === "/api/auth/session") {
        return json(200, { authenticated: false, user: null });
      }

      if (url.pathname === "/api/auth/account/summary") {
        return json(200, { ok: false, preferredLanguage: null });
      }

      return json(404, { ok: false, error: "API unavailable during prerender" });
    });

    // Set flags before your app boots
    await page.addInitScript(() => {
      try {
        // let app skip cookie walls/trackers/etc during prerender
        window.__PRERENDER__ = true;

        // many apps check this before showing cookie UI
        localStorage.setItem(
          "cookieConsent",
          JSON.stringify({
            necessary: true,
            analytics: false,
            marketing: false,
            timestamp: Date.now(),
          })
        );
      } catch { }
    });

    const waitForStableAboveTheFold = async () => {
      try {
        await page.waitForSelector("[data-lcp-element]", { timeout: 3000 });
      } catch {
        await page.waitForTimeout(200);
      }
      try {
        await page.waitForFunction(
          () => document.title !== "PrivateNote.ai - Secure Encrypted Notes",
          { timeout: 4000 },
        );
      } catch {
        /* postProcessHTML injects route meta if React did not update title in time */
      }
      await page.waitForTimeout(100);
    };

    const routes = await discoverRoutesFromSitemapOrFallback();

    const baseSha = process.env.PRERENDER_BASE_SHA || process.env.GITHUB_EVENT_BEFORE || "";
    const headSha = process.env.PRERENDER_HEAD_SHA || process.env.GITHUB_SHA || "HEAD";
    const changedFiles = INCREMENTAL ? getChangedFiles(baseSha, headSha) : null;

    const selection = INCREMENTAL
      ? await selectRoutesToPrerender(routes, changedFiles, HTML_CACHE_DIR)
      : { mode: "full", routes, skipped: 0 };

    if (INCREMENTAL) {
      if (changedFiles === null) {
        console.log("📋 Incremental: no git base (or force full) — prerendering all routes.");
      } else {
        console.log(`📋 Incremental: ${changedFiles.length} changed file(s) in git diff.`);
      }
      console.log(
        `📋 Prerender mode: ${selection.mode}; Playwright ${selection.routes.length}/${routes.length} route(s)` +
          (selection.skipped ? ` (${selection.skipped} reused from cache)` : ""),
      );
    }

    // Establish preview origin before route loop so localStorage writes are allowed.
    await page.goto(`${PREVIEW_URL}/`, { waitUntil: "domcontentloaded", timeout: 45_000 });

    for (const route of selection.routes) {
      const url = `${PREVIEW_URL}${route}`;
      console.log(`→ prerendering ${url}`);
      try {
        await page.evaluate(
          ({ lang, storageKey }) => {
            localStorage.setItem(storageKey, lang);
          },
          { lang: languageForPrerenderRoute(route), storageKey: LANGUAGE_STORAGE_KEY },
        );
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45_000 });
        await waitForStableAboveTheFold();
        const html = await page.content();
        await saveHTML(route, html);
        console.log(`✓ prerendered: ${route}`);
      } catch (err) {
        console.warn(`⚠ skipped: ${route} -> ${err?.message ?? err}`);
      }
    }

    await syncShellAssetRefs(canonicalShellAssets);
    await repostProcessAllMarketingHtml(routes);
    await verifyPrerenderAssetRefs();

    if (INCREMENTAL && HTML_CACHE_DIR) {
      const saved = await saveHtmlCache(DIST_DIR, HTML_CACHE_DIR);
      console.log(`💾 Saved ${saved} HTML file(s) to cache ${HTML_CACHE_DIR}`);
    }
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch { }
    }
    killPreview(preview);
    setTimeout(() => process.exit(0), 500);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
