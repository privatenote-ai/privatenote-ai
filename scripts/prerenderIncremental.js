// Incremental prerender: map git changes → routes, cache/restore HTML snapshots.
import { execSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { PUBLIC_MARKETING_PATHS } from "../shared/publicMarketingPaths.ts";
import { LOCALE_HOME_PATH_PATTERN } from "../shared/supportedLanguages.ts";

const LOCALE_HOME_RE = new RegExp(`^(${LOCALE_HOME_PATH_PATTERN})$`);

/** Patterns that require a full Playwright pass for every sitemap route. */
export const FULL_PRERENDER_PATTERNS = [
  /^scripts\/prerender/,
  /^scripts\/prerenderIncremental/,
  /^shared\/injectPrerenderDocumentMeta\.ts$/,
  /^shared\/homeSeoLinks\.ts$/,
  /^shared\/localizedMarketingHreflang\.ts$/,
  /^shared\/publicMarketingPaths\.ts$/,
  /^shared\/supportedLanguages\.ts$/,
  /^client\/index\.html$/,
  /^client\/src\/App\.tsx$/,
  /^client\/src\/components\/Navbar\.tsx$/,
  /^client\/src\/components\/Footer\.tsx$/,
  /^client\/src\/utils\/resolveDocumentMeta\.ts$/,
  /^client\/src\/utils\/translations\//,
  /^client\/public\/sitemap\.xml$/,
  /^vite\.config\.ts$/,
  /^package\.json$/,
  /^package-lock\.json$/,
  /^functions\/_middleware\.ts$/,
];

/** App-only paths — changes here do not require marketing HTML refresh. */
const APP_ONLY_PATTERNS = [
  /^client\/src\/components\/note\//,
  /^client\/src\/pages\/account\//,
  /^client\/src\/pages\/security-settings\//,
  /^client\/src\/pages\/(Auth|ViewNote|CreateNote|AdminDashboard|Analytics|AuditLogs|BlogAdmin|TestClientLLM|LlmUi|not-found)/,
  /^client\/src\/pages\/Auth\.tsx$/,
  /^client\/src\/pages\/Auth[A-Za-z]*\.tsx$/,
  /^client\/src\/pages\/SecuritySettings\.tsx$/,
  /^src\//,
  /^functions\/(?!_middleware\.ts)/,
];

const PAGE_ROUTE_RULES = [
  { test: /client\/src\/pages\/Home\.tsx$|client\/src\/pages\/HomeBelowFold\.tsx$/, bases: ["/"] },
  { test: /client\/src\/pages\/About\.tsx$/, bases: ["/about"] },
  { test: /client\/src\/pages\/Blog\.tsx$/, bases: ["/blog"] },
  {
    test: /client\/src\/pages\/BlogPost\.tsx$|client\/src\/utils\/staticBlogPosts\.ts$|client\/src\/components\/blog\/.*Post\.tsx$/,
    kind: "blog",
  },
  { test: /client\/src\/pages\/Contact\.tsx$/, bases: ["/contact"] },
  { test: /client\/src\/pages\/Developers\.tsx$/, bases: ["/developers"] },
  { test: /client\/src\/pages\/HowItWorks\.tsx$/, bases: ["/how-it-works"] },
  { test: /client\/src\/pages\/PasswordGenerator\.tsx$/, bases: ["/password-generator"] },
  { test: /client\/src\/pages\/PrivacyTools\.tsx$/, bases: ["/privacy-tools"] },
  { test: /client\/src\/pages\/Privacy\.tsx$/, bases: ["/privacy"] },
  { test: /client\/src\/pages\/Terms\.tsx$/, bases: ["/terms"] },
  { test: /client\/src\/pages\/SecurityResources\.tsx$/, bases: ["/security-resources"] },
  {
    test: /client\/src\/components\/security-guides\/locale\//,
    kind: "security-guides",
  },
  {
    test: /client\/src\/components\/security-guides\/VpnServicesGuide\.tsx$/,
    kind: "security-guides",
  },
  {
    test: /client\/src\/components\/security-guides\/PasswordManagersGuide\.tsx$/,
    kind: "security-guides",
  },
  {
    test: /client\/src\/pages\/SecurityGuideDetail\.tsx$/,
    kind: "security-guides",
  },
  { test: /client\/src\/pages\/SecureFileTransfer\.tsx$/, bases: ["/secure-file-transfer"] },
  { test: /client\/src\/pages\/Premium\.tsx$/, bases: ["/premium"] },
];

const BLOG_ROUTES = PUBLIC_MARKETING_PATHS.filter(
  (p) => p === "/blog" || p.endsWith("/blog") || p.includes("/blog/"),
);
const SECURITY_GUIDE_ROUTES = PUBLIC_MARKETING_PATHS.filter((p) => p.startsWith("/security-guides/"));

function normalizeChangedFile(file) {
  return file.replace(/\\/g, "/");
}

function isZeroSha(sha) {
  if (!sha) return true;
  return /^0+$/.test(sha.replace(/[^0-9a-f]/gi, ""));
}

export function getChangedFiles(baseSha, headSha) {
  if (process.env.PRERENDER_FORCE_FULL === "1") return null;
  if (!baseSha || !headSha || baseSha === headSha || isZeroSha(baseSha)) return null;
  try {
    const out = execSync(`git diff --name-only ${baseSha} ${headSha}`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    return out.trim() ? out.trim().split("\n").filter(Boolean) : [];
  } catch {
    return null;
  }
}

export function shouldFullPrerender(changedFiles) {
  if (changedFiles === null) return true;
  return changedFiles.some((file) =>
    FULL_PRERENDER_PATTERNS.some((re) => re.test(normalizeChangedFile(file))),
  );
}


function isAppOnlyChange(file) {
  const f = normalizeChangedFile(file);
  return APP_ONLY_PATTERNS.some((re) => re.test(f));
}

/** Expand `/about` → `/about`, `/de/about`, … using the sitemap route list. */
export function expandBasePaths(basePaths) {
  const set = new Set();
  for (const route of PUBLIC_MARKETING_PATHS) {
    for (const base of basePaths) {
      if (base === "/") {
        if (route === "/" || LOCALE_HOME_RE.test(route.replace(/^\//, ""))) set.add(route);
      } else if (route === base || route.endsWith(base)) {
        set.add(route);
      }
    }
  }
  return set;
}

export function affectedRoutesFromChangedFiles(changedFiles) {
  if (shouldFullPrerender(changedFiles)) return null;

  const affected = new Set();
  let unmatchedMarketingChange = false;

  for (const raw of changedFiles) {
    const file = normalizeChangedFile(raw);
    if (isAppOnlyChange(file)) continue;

    let matched = false;
    for (const rule of PAGE_ROUTE_RULES) {
      if (!rule.test.test(file)) continue;
      matched = true;
      if (rule.kind === "blog") {
        for (const route of BLOG_ROUTES) affected.add(route);
      } else if (rule.kind === "security-guides") {
        for (const route of SECURITY_GUIDE_ROUTES) affected.add(route);
      } else {
        for (const route of expandBasePaths(rule.bases)) affected.add(route);
      }
    }

    if (matched) continue;

    if (
      (file.startsWith("client/src/") || file.startsWith("shared/") || file.startsWith("client/public/")) &&
      !isAppOnlyChange(file)
    ) {
      unmatchedMarketingChange = true;
    }
  }

  if (unmatchedMarketingChange) return null;
  return affected;
}

export async function walkHtmlFiles(dir, out = []) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
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

export async function routeHasCachedHtml(cacheDir, route) {
  if (!cacheDir) return false;
  const trimmed = route.replace(/\/+$/, "");
  const rel = trimmed.replace(/^\//, "");
  const isLocaleHome = LOCALE_HOME_RE.test(rel);
  const candidates = [];
  if (!rel) {
    candidates.push(path.join(cacheDir, "index.html"));
  } else {
    if (!isLocaleHome) candidates.push(path.join(cacheDir, `${rel}.html`));
    candidates.push(path.join(cacheDir, rel, "index.html"));
  }
  for (const candidate of candidates) {
    try {
      await fs.access(candidate);
      return true;
    } catch {
      /* try next */
    }
  }
  return false;
}

export async function restoreHtmlCache(cacheDir, distDir) {
  const files = await walkHtmlFiles(cacheDir);
  if (files.length === 0) return 0;
  for (const file of files) {
    const rel = path.relative(cacheDir, file);
    const dest = path.join(distDir, rel);
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.copyFile(file, dest);
  }
  return files.length;
}

export async function saveHtmlCache(distDir, cacheDir) {
  await fs.rm(cacheDir, { recursive: true, force: true });
  const files = await walkHtmlFiles(distDir);
  for (const file of files) {
    const rel = path.relative(distDir, file);
    const dest = path.join(cacheDir, rel);
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.copyFile(file, dest);
  }
  return files.length;
}

/**
 * @returns {{ mode: 'full' | 'incremental', routes: string[], skipped: number }}
 */
export async function selectRoutesToPrerender(allRoutes, changedFiles, cacheDir) {
  if (!cacheDir || shouldFullPrerender(changedFiles)) {
    return { mode: "full", routes: allRoutes, skipped: 0 };
  }

  const affected = affectedRoutesFromChangedFiles(changedFiles);
  if (affected === null) {
    return { mode: "full", routes: allRoutes, skipped: 0 };
  }

  const routes = [];
  for (const route of allRoutes) {
    const cached = await routeHasCachedHtml(cacheDir, route);
    if (affected.has(route) || !cached) routes.push(route);
  }

  return {
    mode: "incremental",
    routes,
    skipped: allRoutes.length - routes.length,
    affectedRoutes: affected.size,
  };
}
