#!/usr/bin/env node
/**
 * Assemble and publish the public privatenote-ai/privatenote GitHub repository.
 * Excludes the full web app, secrets, and build artifacts.
 */
import { cpSync, mkdirSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const publishRoot = join(repoRoot, ".publish", "privatenote");
const orgRepo = process.env.GITHUB_ORG_REPO || "marjanskrobot/privatenote-ai";

const COPY_PATHS = [
  "README.md",
  "SECURITY.md",
  "LICENSE",
  "shared",
  "client/src/utils/encryption.ts",
  "packages/privatenote-chrome",
  "packages/privatenote-vscode",
  "packages/privatenote-codex-plugin",
];

const SKIP_DIR_NAMES = new Set(["node_modules", "dist", ".wrangler", "__pycache__"]);
const SKIP_FILE_NAMES = new Set(["privatenote-chrome.zip", ".DS_Store"]);

function shouldSkip(name) {
  return SKIP_DIR_NAMES.has(name) || SKIP_FILE_NAMES.has(name);
}

function copyFiltered(src, dest) {
  cpSync(src, dest, {
    recursive: true,
    filter: (source) => {
      const parts = source.split(/[/\\]/);
      return !parts.some(shouldSkip);
    },
  });
}

function main() {
  console.log(`Publishing public repo to ${orgRepo} …`);
  rmSync(publishRoot, { recursive: true, force: true });
  mkdirSync(publishRoot, { recursive: true });

  for (const rel of COPY_PATHS) {
    const src = join(repoRoot, rel);
    if (!existsSync(src)) {
      throw new Error(`Missing required path: ${rel}`);
    }
    const dest = join(publishRoot, rel);
    mkdirSync(dirname(dest), { recursive: true });
    copyFiltered(src, dest);
    console.log(`  + ${rel}`);
  }

  writeFileSync(
    join(publishRoot, ".gitignore"),
    ["node_modules", "dist", "*.log", ".DS_Store", "*.zip", "*.vsix", ".env", ".env.*"].join("\n") + "\n",
  );

  writeFileSync(
    join(publishRoot, "package.json"),
    JSON.stringify(
      {
        name: "privatenote",
        private: true,
        description: "PrivateNote developer tools and shared crypto utilities",
        homepage: "https://privatenote.ai",
        repository: {
          type: "git",
          url: `https://github.com/${orgRepo}.git`,
        },
        license: "MIT",
        scripts: {
          "build:chrome": "node packages/privatenote-chrome/build.mjs",
        },
        devDependencies: {
          "@types/chrome": "^0.0.287",
          "@types/node": "^20.19.0",
          esbuild: "^0.25.0",
          typescript: "5.6.3",
        },
        dependencies: {
          "@noble/hashes": "^1.8.0",
        },
      },
      null,
      2,
    ) + "\n",
  );

  execSync("git init -b main", { cwd: publishRoot, stdio: "inherit" });
  execSync("git add -A", { cwd: publishRoot, stdio: "inherit" });
  execSync('git commit -m "Initial public release: extensions and shared crypto utilities"', {
    cwd: publishRoot,
    stdio: "inherit",
  });

  const repoExists = (() => {
    try {
      execSync(`gh repo view ${orgRepo}`, { stdio: "pipe" });
      return true;
    } catch {
      return false;
    }
  })();

  if (repoExists) {
    console.log(`Repo ${orgRepo} exists — pushing to main …`);
    execSync(`git remote add origin https://github.com/${orgRepo}.git`, { cwd: publishRoot });
    execSync("git push -u origin main --force", { cwd: publishRoot, stdio: "inherit" });
  } else {
    console.log(`Creating public repo ${orgRepo} …`);
    execSync(
      `gh repo create ${orgRepo} --public --description "PrivateNote developer tools — encrypted notes & files" --homepage https://privatenote.ai --source "${publishRoot}" --remote origin --push`,
      { cwd: publishRoot, stdio: "inherit" },
    );
  }

  console.log(`\nDone: https://github.com/${orgRepo}`);
}

main();
