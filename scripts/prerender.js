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
  buildHomeSeoHeadMarkup,
  canonicalAbsoluteUrlForRoute,
  homeLanguageFromRoute,
  isLocaleHomeRoute,
  PUBLIC_SITE_ORIGIN,
} from "../shared/homeSeoLinks.ts";
import { injectPrerenderDocumentMeta } from "../shared/injectPrerenderDocumentMeta.ts";
import { PUBLIC_MARKETING_PATHS } from "../shared/publicMarketingPaths.ts";

const OUTPUT_DIR = process.env.OUTPUT_DIR || "prerender";
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
    // Keep pathname only; strip trailing slash except for root
    let p = u.pathname;
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
  try {
    const xml = await fetchText(SITEMAP_URL);
    // Simple loc extraction (no external deps)
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/gi)].map((m) => m[1].trim());

    const paths = locs
      .map((loc) => normalizeRoutePath(loc, PREVIEW_URL))
      .filter(Boolean);

    const unique = uniq(paths);
    if (unique.length > 0) {
      console.log(`🧭 Found ${unique.length} route(s) from sitemap.`);
      return unique;
    }
    console.warn("🧭 Found 0 route(s) from sitemap (empty after normalization). Using fallback.");
  } catch (e) {
    console.warn(`🧭 Could not read sitemap: ${e?.message || e}. Using fallback.`);
  }
  return uniq(FALLBACK_ROUTES);
}

// -------------------------------
// Output + HTML tweaks
// -------------------------------
async function prepareOutputDir() {
  if (BUILD_DIR === DIST_DIR) return;

  await fs.rm(DIST_DIR, { recursive: true, force: true });
  await fs.cp(BUILD_DIR, DIST_DIR, { recursive: true });
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
  const isPublicSitemapRoute =
    route === "/" ||
    /^\/(de|fr|es|it|nl)(\/|$)/.test(route) ||
    /^\/(about|blog|contact|developers|how-it-works|password-generator|privacy|privacy-tools|security-resources|terms)(\/|$)/.test(
      route,
    ) ||
    /^\/blog\//.test(route) ||
    /^\/security-guides\//.test(route);

  // React may snapshot canonical/og:url with a trailing slash; crawlers need the 200 URL shape.
  out = out.replace(/<link\b[^>]*\brel=["']canonical["'][^>]*>/gi, "");
  out = out.replace(/<meta\s+property=["']og:url["'][^>]*>/gi, "");

  if (isLocaleHomeRoute(route)) {
    out = out.replace(
      /<link\b[^>]*\bdata-privatenote-home-locale=["']true["'][^>]*>/gi,
      "",
    );
    const seoBlock = buildHomeSeoHeadMarkup(homeLanguageFromRoute(route));
    out = out.replace("</head>", `${seoBlock}\n</head>`);
  } else if (isPublicSitemapRoute) {
    const pageUrl = canonicalAbsoluteUrlForRoute(route);
    out = out.replace(
      "</head>",
      `<link rel="canonical" href="${pageUrl}" />\n<meta property="og:url" content="${pageUrl}" />\n</head>`,
    );
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

const ENTRY_SCRIPT_RE = /\/assets\/index-[A-Za-z0-9_-]+\.js/g;
const ASSET_REF_RE = /\/assets\/([A-Za-z0-9_.-]+\.(?:js|css))/g;

function readCanonicalEntryScript() {
  const shellPath = path.join(BUILD_DIR, "index.html");
  const shell = readFileSync(shellPath, "utf8");
  const match = shell.match(/src="(\/assets\/index-[A-Za-z0-9_-]+\.js)"/);
  if (!match) {
    throw new Error(`Could not find Vite entry script in ${shellPath}`);
  }
  return match[1];
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

/** Align every prerendered page with the current Vite entry (avoids stale hashed JS after redeploy). */
async function syncEntryScriptRefs(canonicalEntry) {
  const files = await walkHtmlFiles(DIST_DIR);
  let updated = 0;
  for (const file of files) {
    const html = await fs.readFile(file, "utf8");
    const next = html.replace(ENTRY_SCRIPT_RE, canonicalEntry);
    if (next !== html) {
      await fs.writeFile(file, next, "utf8");
      updated++;
    }
  }
  if (updated > 0) {
    console.log(`🔧 Synced entry script to ${canonicalEntry} in ${updated} HTML file(s).`);
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

  const isLocaleHome = /^(de|fr|es|it|nl)$/.test(rel);

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
    const canonicalEntryScript = readCanonicalEntryScript();

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
    for (const route of routes) {
      const url = `${PREVIEW_URL}${route}`;
      console.log(`→ prerendering ${url}`);
      try {
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45_000 });
        await waitForStableAboveTheFold();
        const html = await page.content();
        await saveHTML(route, html);
        console.log(`✓ prerendered: ${route}`);
      } catch (err) {
        console.warn(`⚠ skipped: ${route} -> ${err?.message ?? err}`);
      }
    }

    await syncEntryScriptRefs(canonicalEntryScript);
    await verifyPrerenderAssetRefs();
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
