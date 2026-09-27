/**
 * Constrain which local files create_private_note may read.
 *
 * Encryption of an arbitrary path is equivalent to exfiltration if the agent
 * can then send the returned URL. Allowlist + deny-list + realpath close that
 * confused-deputy path. Deny always wins.
 */

import { realpath } from "node:fs/promises";
import { homedir } from "node:os";
import {
  isAbsolute,
  join,
  relative,
  resolve,
  sep,
} from "node:path";
import { mcpSessionFilePath } from "./sessionStore.ts";

export const PATH_NOT_ALLOWED_MESSAGE =
  "Path is not allowed. Files must be inside PRIVATENOTE_MCP_ALLOWED_ROOTS or the current working directory. Credential locations (SSH keys, cloud config, the MCP session file) are always blocked.";

export const NO_ALLOWED_ROOTS_MESSAGE =
  "No allowed file roots. Set PRIVATENOTE_MCP_ALLOWED_ROOTS to the directories this server may read (for example your project folder). The home directory and filesystem root are not allowed by default.";

export class PathNotAllowedError extends Error {
  constructor(message = PATH_NOT_ALLOWED_MESSAGE) {
    super(message);
    this.name = "PathNotAllowedError";
  }
}

export type PathGuardContext = {
  env?: NodeJS.ProcessEnv;
  cwd?: string;
  home?: string;
};

function envOf(ctx: PathGuardContext): NodeJS.ProcessEnv {
  return ctx.env ?? process.env;
}

function cwdOf(ctx: PathGuardContext): string {
  return ctx.cwd ?? process.cwd();
}

function homeOf(ctx: PathGuardContext): string {
  return ctx.home ?? homedir();
}

function expandUser(raw: string, home: string): string {
  if (raw === "~") return home;
  if (raw.startsWith("~/") || raw.startsWith("~\\")) {
    return join(home, raw.slice(2));
  }
  return raw;
}

/** Split PRIVATENOTE_MCP_ALLOWED_ROOTS. `:` is not a separator on Windows (drive letters). */
export function parseAllowedRootsEnv(raw: string | undefined): string[] {
  if (!raw?.trim()) return [];
  const splitter = process.platform === "win32" ? /[;\n]+/ : /[:;\n]+/;
  return raw
    .split(splitter)
    .map((part) => part.trim())
    .filter(Boolean);
}

function uniqueResolved(paths: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of paths) {
    const resolved = resolve(p);
    const key = normalizeForCompare(resolved);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(resolved);
  }
  return out;
}

function normalizeForCompare(p: string): string {
  return process.platform === "win32" ? p.toLowerCase() : p;
}

/**
 * True when `file` is `root` or a descendant. `root` and `file` should already
 * be resolved (no `.` / `..`).
 */
export function isPathInsideRoot(file: string, root: string): boolean {
  const rel = relative(normalizeForCompare(root), normalizeForCompare(file));
  if (rel === "") return true;
  if (isAbsolute(rel)) return false;
  return rel !== ".." && !rel.startsWith(`..${sep}`);
}

export function defaultAllowedRoots(ctx: PathGuardContext = {}): string[] {
  const env = envOf(ctx);
  const explicit = parseAllowedRootsEnv(env["PRIVATENOTE_MCP_ALLOWED_ROOTS"]);
  if (explicit.length > 0) {
    return uniqueResolved(explicit.map((p) => expandUser(p, homeOf(ctx))));
  }

  const cwd = resolve(cwdOf(ctx));
  const home = resolve(homeOf(ctx));
  if (isFilesystemRoot(cwd) || normalizeForCompare(cwd) === normalizeForCompare(home)) {
    return [];
  }
  return [cwd];
}

function isFilesystemRoot(cwd: string): boolean {
  if (cwd === sep || cwd === resolve(sep)) return true;
  return process.platform === "win32" && /^[a-z]:\\$/i.test(cwd);
}

export function defaultDeniedRoots(ctx: PathGuardContext = {}): string[] {
  const home = resolve(homeOf(ctx));
  const env = envOf(ctx);
  const dirs = [
    join(home, ".ssh"),
    join(home, ".gnupg"),
    join(home, ".aws"),
    join(home, ".azure"),
    join(home, ".kube"),
    join(home, ".docker"),
    join(home, ".password-store"),
    join(home, ".pki"),
    join(home, ".config", "gcloud"),
    join(home, ".config", "gh"),
    join(home, ".config", "privatenote"),
    join(home, "Library", "Application Support", "gcloud"),
    join(home, "Library", "Application Support", "gh"),
  ];

  const appData = env["APPDATA"]?.trim();
  if (appData) {
    dirs.push(join(appData, "privatenote"));
    dirs.push(join(appData, "gcloud"));
    dirs.push(join(appData, "gnupg"));
  }

  const xdg = env["XDG_CONFIG_HOME"]?.trim();
  if (xdg) {
    dirs.push(join(xdg, "gcloud"));
    dirs.push(join(xdg, "gh"));
    dirs.push(join(xdg, "privatenote"));
  }

  return uniqueResolved(dirs);
}

export function defaultDeniedFiles(ctx: PathGuardContext = {}): string[] {
  const home = resolve(homeOf(ctx));
  const files = [
    join(home, ".netrc"),
    join(home, ".git-credentials"),
    join(home, ".npmrc"),
  ];
  try {
    const override = envOf(ctx)["PRIVATENOTE_MCP_SESSION_PATH"]?.trim();
    files.push(resolve(expandUser(override || mcpSessionFilePath(), homeOf(ctx))));
  } catch {
    /* ignore */
  }
  return uniqueResolved(files);
}

async function canonicalizeExisting(path: string): Promise<string[]> {
  const logical = resolve(path);
  try {
    const real = await realpath(logical);
    if (normalizeForCompare(real) === normalizeForCompare(logical)) {
      return [logical];
    }
    return uniqueResolved([logical, real]);
  } catch {
    return [logical];
  }
}

async function expandRootList(roots: string[]): Promise<string[]> {
  const out: string[] = [];
  for (const root of roots) {
    out.push(...(await canonicalizeExisting(root)));
  }
  return uniqueResolved(out);
}

function isDenied(
  candidate: string,
  deniedRoots: string[],
  deniedFiles: string[],
): boolean {
  for (const file of deniedFiles) {
    if (normalizeForCompare(candidate) === normalizeForCompare(file)) {
      return true;
    }
  }
  for (const root of deniedRoots) {
    if (isPathInsideRoot(candidate, root)) {
      return true;
    }
  }
  return false;
}

function isAllowed(candidate: string, allowedRoots: string[]): boolean {
  if (allowedRoots.length === 0) return false;
  return allowedRoots.some((root) => isPathInsideRoot(candidate, root));
}

/**
 * Resolve `rawPath` and throw if it is outside the allowlist or inside a
 * denied credential location. Returns the canonical path when the file exists,
 * otherwise the lexically resolved path (the caller still has to read it).
 */
export async function assertReadableSecretPath(
  rawPath: string,
  ctx: PathGuardContext = {},
): Promise<string> {
  const trimmed = rawPath.trim();
  if (!trimmed) {
    throw new PathNotAllowedError(PATH_NOT_ALLOWED_MESSAGE);
  }

  const home = homeOf(ctx);
  const logical = resolve(cwdOf(ctx), expandUser(trimmed, home));
  const allowedRoots = await expandRootList(defaultAllowedRoots(ctx));
  const deniedRoots = await expandRootList(defaultDeniedRoots(ctx));
  const deniedFiles = await expandRootList(defaultDeniedFiles(ctx));

  if (allowedRoots.length === 0) {
    throw new PathNotAllowedError(NO_ALLOWED_ROOTS_MESSAGE);
  }

  const check = (candidate: string) => {
    if (isDenied(candidate, deniedRoots, deniedFiles) || !isAllowed(candidate, allowedRoots)) {
      throw new PathNotAllowedError(PATH_NOT_ALLOWED_MESSAGE);
    }
  };

  check(logical);

  let canonical = logical;
  try {
    canonical = await realpath(logical);
  } catch {
    return logical;
  }

  if (normalizeForCompare(canonical) !== normalizeForCompare(logical)) {
    check(canonical);
  }
  return canonical;
}
