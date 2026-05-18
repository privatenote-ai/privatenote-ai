// scripts/prerender.js
// ESM (package.json "type": "module")

import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import http from "node:http";
import https from "node:https";
import { chromium } from "playwright";

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
// Fallback routes (public-only)
// -------------------------------
const FALLBACK_ROUTES = [
  "/",
  "/de/",
  "/fr/",
  "/es/",
  "/de/password-generator",
  "/de/privacy-tools",
  "/de/security-resources",
  "/de/how-it-works",
  "/de/about",
  "/de/contact",
  "/de/blog",
  "/de/blog/privacy-tools",
  "/de/blog/myth-good-enough-security",
  "/de/blog/how-we-generate-passwords",
  "/de/blog/workplace-texts-private-note",
  "/de/privacy",
  "/de/terms",
  "/fr/password-generator",
  "/fr/privacy-tools",
  "/fr/security-resources",
  "/fr/how-it-works",
  "/fr/about",
  "/fr/contact",
  "/fr/blog",
  "/fr/blog/privacy-tools",
  "/fr/blog/myth-good-enough-security",
  "/fr/blog/how-we-generate-passwords",
  "/fr/blog/workplace-texts-private-note",
  "/fr/privacy",
  "/fr/terms",
  "/es/password-generator",
  "/es/privacy-tools",
  "/es/security-resources",
  "/es/how-it-works",
  "/es/about",
  "/es/contact",
  "/es/blog",
  "/es/blog/privacy-tools",
  "/es/blog/myth-good-enough-security",
  "/es/blog/how-we-generate-passwords",
  "/es/blog/workplace-texts-private-note",
  "/es/privacy",
  "/es/terms",
  "/privacy",
  "/terms",
  "/how-it-works",
  "/about",
  "/contact",
  "/password-generator",
  "/privacy-tools",
  "/security-resources",
  "/security-guides/vpn",
  "/security-guides/password",
  "/security-guides/messenger",
  "/security-guides/email",
  "/security-guides/browser",
  "/blog",
  "/blog/privacy-tools",
  "/blog/myth-good-enough-security",
  "/blog/how-we-generate-passwords",
  "/blog/workplace-texts-private-note",
];

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

function postProcessHTML(html) {
  let out = html;

  // Rewrite preview absolute URLs -> root-relative
  out = out.replace(/https?:\/\/(?:localhost|127\.0\.0\.1):4173/gi, "");

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

/**
 * Write prerendered HTML so both URL shapes work on Cloudflare Pages:
 * - `about.html` → GET /about returns 200 (crawlers, navbar links)
 * - `about/index.html` → GET /about/ returns 200
 * Locale homes stay directory-only (`de/index.html` → /de/).
 */
async function saveHTML(route, html) {
  const cleaned = postProcessHTML(html);
  const trimmed = route.replace(/\/+$/, "");
  const rel = trimmed.replace(/^\//, "");

  if (!rel) {
    await fs.writeFile(path.join(DIST_DIR, "index.html"), cleaned, "utf8");
    return;
  }

  const isLocaleHome = /^(de|fr|es)$/.test(rel);

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
        // you already render an LCP marker; wait for it if present
        await page.waitForSelector("[data-lcp-element]", { timeout: 3000 });
      } catch {
        // not found; small settle time so helmet/meta can commit
        await page.waitForTimeout(200);
      }
      // one last tiny tick for microtasks
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
