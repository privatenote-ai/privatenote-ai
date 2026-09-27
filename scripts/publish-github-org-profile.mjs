#!/usr/bin/env node
/**
 * Publish privatenote-ai/.github org profile repository.
 */
import { cpSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const publishRoot = join(repoRoot, ".publish", "dot-github");
const orgProfileRepo = process.env.GITHUB_PROFILE_REPO || "marjanskrobot/privatenote-ai-profile";

function main() {
  const profileSrc = join(repoRoot, ".github", "profile", "README.md");
  if (!existsSync(profileSrc)) {
    throw new Error("Missing .github/profile/README.md");
  }

  rmSync(publishRoot, { recursive: true, force: true });
  mkdirSync(join(publishRoot, "profile"), { recursive: true });
  cpSync(profileSrc, join(publishRoot, "profile", "README.md"));

  execSync("git init -b main", { cwd: publishRoot, stdio: "inherit" });
  execSync("git add -A", { cwd: publishRoot, stdio: "inherit" });
  execSync('git commit -m "Add organization profile README"', { cwd: publishRoot, stdio: "inherit" });

  const repoExists = (() => {
    try {
      execSync(`gh repo view ${orgProfileRepo}`, { stdio: "pipe" });
      return true;
    } catch {
      return false;
    }
  })();

  if (repoExists) {
    execSync(`git remote add origin https://github.com/${orgProfileRepo}.git`, { cwd: publishRoot });
    execSync("git push -u origin main --force", { cwd: publishRoot, stdio: "inherit" });
  } else {
    execSync(
      `gh repo create ${orgProfileRepo} --public --description "PrivateNote.ai organization profile" --source "${publishRoot}" --remote origin --push`,
      { cwd: publishRoot, stdio: "inherit" },
    );
  }

  console.log(`\nProfile repo: https://github.com/${orgProfileRepo}`);
  console.log("After creating org privatenote-ai, rename/transfer this repo to privatenote-ai/.github");
}

main();
