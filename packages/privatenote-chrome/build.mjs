#!/usr/bin/env node
/**
 * esbuild bundler for the PrivateNote Chrome extension.
 * Bundles service worker + popup + options; copies static assets to dist/.
 */
import { build } from "../../node_modules/esbuild/lib/main.js";
import { cpSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "../..");
const distDir = resolve(__dirname, "dist");

const sharedAlias = { "@shared": resolve(repoRoot, "shared") };

const common = {
  bundle: true,
  platform: "browser",
  target: "chrome120",
  format: "esm",
  alias: sharedAlias,
  absWorkingDir: __dirname,
  logLevel: "info",
};

mkdirSync(distDir, { recursive: true });

await build({
  ...common,
  entryPoints: ["src/background.ts"],
  outfile: "dist/background.js",
});

await build({
  ...common,
  entryPoints: ["src/popup/popup.ts"],
  outfile: "dist/popup.js",
});

await build({
  ...common,
  entryPoints: ["src/options/options.ts"],
  outfile: "dist/options.js",
});

for (const file of ["popup.html", "popup.css", "options.html", "options.css"]) {
  const src = resolve(__dirname, "src", file.includes("options") ? "options" : "popup", file);
  cpSync(src, resolve(distDir, file));
}

cpSync(resolve(__dirname, "manifest.json"), resolve(distDir, "manifest.json"));
mkdirSync(resolve(distDir, "icons"), { recursive: true });
for (const icon of ["icon16.png", "icon48.png", "icon128.png"]) {
  cpSync(resolve(__dirname, "public/icons", icon), resolve(distDir, "icons", icon));
}

// Patch manifest paths for dist layout (already flat).
console.log("PrivateNote Chrome extension built → dist/");
