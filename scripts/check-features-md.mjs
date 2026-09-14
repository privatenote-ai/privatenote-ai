/**
 * Fail a PR when product-capability files change without FEATURES.md.
 *
 *   node scripts/check-features-md.mjs --base origin/main
 *
 * Skip: PR label `skip-features-md`, or title containing `[skip-features]`.
 * Use that for refactors, copy-only, or style with no capability change.
 */

import { execFileSync } from "node:child_process";

export const FEATURES_MD = "FEATURES.md";

/** Prefixes / exact files that describe shipped product capabilities. */
export const CAPABILITY_PATHS = [
  "shared/planCatalog.ts",
  "shared/accountEntitlements.ts",
  "shared/noteExpiry.ts",
  "shared/noteReadLimits.ts",
  "shared/noteFileAccess.ts",
  "shared/receiptAcknowledgment.ts",
  "shared/revealBodyFont.ts",
  "shared/attachmentRecipientPermission.ts",
  "shared/businessBranding.ts",
  "shared/noteLinkDelivery.ts",
  "shared/sentNoteNotification.ts",
  "shared/sentNoteLifecycleEmail.ts",
  "shared/mcpDeviceAuth.ts",
  "shared/noteAttachments.ts",
  "shared/noteFileLimits.ts",
  "client/src/components/note/",
  "client/src/features/",
  "client/src/pages/ViewNote.tsx",
  "client/src/pages/Home.tsx",
  "client/src/pages/Premium.tsx",
  "client/src/pages/PasswordGenerator.tsx",
  "client/src/pages/SecuritySettings.tsx",
  "client/src/pages/Auth",
  "client/src/pages/account/",
  "client/src/pages/security-settings/",
  "packages/privatenote-mcp/",
  "packages/privatenote-cli/",
  "packages/privatenote-vscode/",
  "packages/privatenote-chrome/",
  "packages/privatenote-codex-plugin/",
];

const SKIP_PATH_RE =
  /\.(test|spec)\.(ts|tsx|js|mjs)$|\/(locale|__tests__|tests)\//;

export function isCapabilityPath(file) {
  const normalized = file.replaceAll("\\", "/");
  if (SKIP_PATH_RE.test(normalized)) return false;
  return CAPABILITY_PATHS.some(
    (prefix) => normalized === prefix || normalized.startsWith(prefix),
  );
}

export function featuresMdCheck(changedFiles) {
  const files = changedFiles.map((file) => file.replaceAll("\\", "/"));
  const catalogUpdated = files.includes(FEATURES_MD);
  const capabilityFiles = files.filter(isCapabilityPath);
  return {
    catalogUpdated,
    capabilityFiles,
    required: capabilityFiles.length > 0 && !catalogUpdated,
  };
}

function parseBase(argv) {
  const index = argv.indexOf("--base");
  if (index >= 0 && argv[index + 1]) return argv[index + 1];
  return process.env.FEATURES_MD_BASE || "";
}

function changedFilesFromGit(base) {
  return execFileSync("git", ["diff", "--name-only", `${base}...HEAD`], {
    encoding: "utf8",
  })
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function main(argv = process.argv.slice(2)) {
  const base = parseBase(argv);
  if (!base) {
    console.error("check-features-md: pass --base <git-ref> (e.g. origin/main)");
    process.exit(1);
  }

  const files = changedFilesFromGit(base);
  const result = featuresMdCheck(files);
  if (!result.required) {
    if (result.capabilityFiles.length === 0) {
      console.log("check-features-md: ok (no capability files in diff)");
    } else {
      console.log("check-features-md: ok (FEATURES.md updated)");
    }
    return;
  }

  console.error(
    [
      "check-features-md: capability files changed without FEATURES.md.",
      "Update FEATURES.md in this PR (New / Changed / Removed, plus plan gating if it changed).",
      "",
      "Touched:",
      ...result.capabilityFiles.map((file) => `  - ${file}`),
      "",
      "Not a capability change? Add the PR label skip-features-md, or put [skip-features] in the title.",
    ].join("\n"),
  );
  process.exit(1);
}

const isDirectRun = process.argv[1]?.endsWith("check-features-md.mjs");
if (isDirectRun) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}
