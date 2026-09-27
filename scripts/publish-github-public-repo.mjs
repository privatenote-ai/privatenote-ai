#!/usr/bin/env node
/**
 * Assemble and publish the public privatenote-ai/privatenote-ai GitHub repository.
 *
 * Includes developer tools + minimal shared crypto. Excludes the web app,
 * Worker/API, secrets, and build artifacts.
 *
 * Usage:
 *   GITHUB_ORG_REPO=privatenote-ai/privatenote-ai node scripts/publish-github-public-repo.mjs
 */
import { cpSync, mkdirSync, rmSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const publishRoot = join(repoRoot, ".publish", "privatenote");
const orgRepo = process.env.GITHUB_ORG_REPO || "privatenote-ai/privatenote-ai";
const githubHttps = `https://github.com/${orgRepo}`;

const PACKAGE_DIRS = [
  "packages/privatenote-chrome",
  "packages/privatenote-vscode",
  "packages/privatenote-cli",
  "packages/privatenote-mcp",
  "packages/privatenote-codex-plugin",
];

/** Minimal shared slice required to build the packages above. */
const SHARED_FILES = [
  "noteCrypto.ts",
  "noteAad.ts",
  "noteAad.test.ts",
  "noteExpiry.ts",
  "noteExpiry.test.ts",
  "noteSizeLimits.ts",
  "noteReadLimits.ts",
  "urlFragmentKey.ts",
  "urlFragmentKey.test.ts",
  "noteId.ts",
  "noteId.test.ts",
  "noteCreationSource.ts",
  "noteCreationSource.test.ts",
];

const SKIP_DIR_NAMES = new Set([
  "node_modules",
  "dist",
  ".wrangler",
  "__pycache__",
  ".codex-history",
]);
const SKIP_FILE_NAMES = new Set([
  "privatenote-chrome.zip",
  ".DS_Store",
]);
const SKIP_FILE_SUFFIXES = [".vsix", ".zip"];

function shouldSkip(name) {
  if (SKIP_DIR_NAMES.has(name) || SKIP_FILE_NAMES.has(name)) return true;
  return SKIP_FILE_SUFFIXES.some((suffix) => name.endsWith(suffix));
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

function rewriteGithubUrls(text) {
  // Only rewrite the legacy `/privatenote` repo path, not `/privatenote-ai`.
  return text
    .replaceAll(
      "git+https://github.com/privatenote-ai/privatenote.git",
      `git+${githubHttps}.git`,
    )
    .replace(/(https:\/\/github\.com\/privatenote-ai\/privatenote)(?!-ai)\b/g, githubHttps)
    .replaceAll("https://github.com/marjanskrobot/privatenote-ai", githubHttps);
}

function rewritePackageJsonRepos(dir) {
  const pkgPath = join(dir, "package.json");
  if (!existsSync(pkgPath)) return;
  const raw = readFileSync(pkgPath, "utf8");
  writeFileSync(pkgPath, rewriteGithubUrls(raw));
}

function writePublicReadme() {
  writeFileSync(
    join(publishRoot, "README.md"),
    `# PrivateNote.ai

**Share secrets. Leave no trail.**

End-to-end encrypted notes and file attachments — encrypted in your browser (or editor) before upload. PrivateNote stores ciphertext only.

🌐 **[privatenote.ai](https://privatenote.ai)** · 📦 **[This repository](${githubHttps})**

## Developer tools

| Tool | Package | Description |
|------|---------|-------------|
| [CLI](./packages/privatenote-cli/) | \`privatenote-cli\` | Create encrypted links from the terminal / CI |
| [MCP](./packages/privatenote-mcp/) | \`privatenote-mcp\` | Local MCP server (\`create_private_note\`) for agents |
| [VS Code / Cursor](./packages/privatenote-vscode/) | \`privatenote-vscode\` | Encrypt selection without the AI seeing plaintext |
| [Chrome](./packages/privatenote-chrome/) | \`privatenote-chrome\` | Create encrypted notes from any page |
| [Codex plugin](./packages/privatenote-codex-plugin/) | — | MCP + skill bundle for Codex |

## Security model (summary)

- **Client-side encryption** before anything is uploaded
- **Keys in the URL fragment** — never sent to the server
- **Read-once / expiry** — notes can burn after reading or expire on a timer
- Shared crypto lives in [\`shared/\`](./shared/) (\`noteCrypto\`, AAD binding, URL fragment keys)

See [SECURITY.md](./SECURITY.md) for vulnerability reporting.

## Open source scope

This repository publishes **developer tools and the shared crypto utilities** they need.

The hosted web application, API Worker, auth, and billing code are **not** open-sourced here.

## Build

From the repository root:

\`\`\`bash
npm install
npm run build:chrome   # → packages/privatenote-chrome/dist
npm run build:cli      # → packages/privatenote-cli/dist
npm run build:vscode   # → packages/privatenote-vscode/dist
npm run build:mcp      # → packages/privatenote-mcp/dist
\`\`\`

See each package README for install and usage.

## Links

- Website: [privatenote.ai](https://privatenote.ai)
- Developers: [privatenote.ai/developers](https://privatenote.ai/developers)
- Security: [security@privatenote.ai](mailto:security@privatenote.ai)

## License

MIT — see [LICENSE](./LICENSE).
`,
  );
}

function main() {
  console.log(`Publishing public repo to ${orgRepo} …`);
  rmSync(publishRoot, { recursive: true, force: true });
  mkdirSync(publishRoot, { recursive: true });

  for (const rel of ["SECURITY.md", "LICENSE"]) {
    const src = join(repoRoot, rel);
    if (!existsSync(src)) throw new Error(`Missing required path: ${rel}`);
    cpSync(src, join(publishRoot, rel));
    console.log(`  + ${rel}`);
  }

  const sharedDest = join(publishRoot, "shared");
  mkdirSync(sharedDest, { recursive: true });
  for (const file of SHARED_FILES) {
    const src = join(repoRoot, "shared", file);
    if (!existsSync(src)) {
      console.warn(`  ! skip missing shared/${file}`);
      continue;
    }
    cpSync(src, join(sharedDest, file));
    console.log(`  + shared/${file}`);
  }

  for (const rel of PACKAGE_DIRS) {
    const src = join(repoRoot, rel);
    if (!existsSync(src)) throw new Error(`Missing required path: ${rel}`);
    const dest = join(publishRoot, rel);
    mkdirSync(dirname(dest), { recursive: true });
    copyFiltered(src, dest);
    rewritePackageJsonRepos(dest);
    console.log(`  + ${rel}`);
  }

  writePublicReadme();
  console.log("  + README.md (generated)");

  writeFileSync(
    join(publishRoot, ".gitignore"),
    ["node_modules", "dist", "*.log", ".DS_Store", "*.zip", "*.vsix", ".env", ".env.*"].join("\n") + "\n",
  );

  writeFileSync(
    join(publishRoot, "package.json"),
    JSON.stringify(
      {
        name: "privatenote-ai",
        private: true,
        description: "PrivateNote developer tools — encrypted notes & files",
        homepage: "https://privatenote.ai",
        repository: {
          type: "git",
          url: `${githubHttps}.git`,
        },
        bugs: {
          url: `${githubHttps}/issues`,
        },
        license: "MIT",
        scripts: {
          "build:chrome": "node packages/privatenote-chrome/build.mjs",
          "build:cli": "node packages/privatenote-cli/build.mjs",
          "build:vscode": "node packages/privatenote-vscode/build.mjs",
          "build:mcp": "node packages/privatenote-mcp/build.mjs",
        },
        devDependencies: {
          "@types/chrome": "^0.0.287",
          "@types/node": "^20.19.0",
          esbuild: "^0.25.0",
          typescript: "5.6.3",
        },
      },
      null,
      2,
    ) + "\n",
  );
  console.log("  + package.json (generated)");

  // Ensure package build scripts resolve esbuild from the public repo root.
  for (const rel of PACKAGE_DIRS) {
    const buildPath = join(publishRoot, rel, "build.mjs");
    if (!existsSync(buildPath)) continue;
    let build = readFileSync(buildPath, "utf8");
    // Prefer root node_modules/esbuild (already the pattern); leave as-is.
    writeFileSync(buildPath, rewriteGithubUrls(build));
  }

  execSync("git init -b main", { cwd: publishRoot, stdio: "inherit" });
  execSync("git add -A", { cwd: publishRoot, stdio: "inherit" });
  execSync('git commit -m "Public release: CLI, MCP, Chrome, VS Code, Codex + shared crypto"', {
    cwd: publishRoot,
    stdio: "inherit",
  });

  if (process.env.ASSEMBLE_ONLY === "1") {
    console.log(`\nAssembled only (ASSEMBLE_ONLY=1): ${publishRoot}`);
    console.log(`Push later with: cd .publish/privatenote && git push -u origin main --force`);
    return;
  }

  const repoExists = (() => {
    try {
      execSync(`gh repo view ${orgRepo}`, { stdio: "pipe" });
      return true;
    } catch {
      return false;
    }
  })();

  if (repoExists) {
    console.log(`Repo ${orgRepo} exists — force-pushing main …`);
    execSync(`git remote add origin ${githubHttps}.git`, { cwd: publishRoot });
    execSync("git push -u origin main --force", { cwd: publishRoot, stdio: "inherit" });
  } else {
    console.log(`Creating public repo ${orgRepo} …`);
    execSync(
      `gh repo create ${orgRepo} --public --description "PrivateNote developer tools — encrypted notes & files" --homepage https://privatenote.ai --source "${publishRoot}" --remote origin --push`,
      { cwd: publishRoot, stdio: "inherit" },
    );
  }

  console.log(`\nDone: ${githubHttps}`);
}

main();
