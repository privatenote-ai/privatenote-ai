/**
 * Browser ↔ VS Code / Cursor extension sign-in handshake (PKCE + vscode:// redirect).
 * Keep redirect-URI rules tight so a stolen pending state cannot bounce the
 * browser to an arbitrary handler.
 */

export const VSCODE_EXTENSION_ID = "PrivateNote.privatenote-vscode";
export const VSCODE_AUTH_CALLBACK_PATH = "/auth";
export const VSCODE_LOGIN_KV_PREFIX = "vscode_login:";
export const VSCODE_LOGIN_TTL_SECONDS = 10 * 60;
export const VSCODE_STATE_PATTERN = /^[A-Za-z0-9_-]{16,128}$/;
export const VSCODE_PKCE_VERIFIER_PATTERN = /^[A-Za-z0-9._~-]{43,128}$/;
export const VSCODE_PKCE_CHALLENGE_PATTERN = /^[A-Za-z0-9_-]{43}$/;

const ALLOWED_URI_SCHEMES = new Set([
  "vscode",
  "vscode-insiders",
  "cursor",
  "cursor-insiders",
  "windsurf",
  "antigravity",
]);

/** Chrome Web Store / unpacked extension IDs are 32 chars in a–p. */
const CHROME_IDENTITY_HOST = /^[a-p]{32}\.chromiumapp\.org$/i;

export type PluginAuthClient = "vscode" | "chrome";

export function isAllowedChromeIdentityRedirectUri(raw: unknown): raw is string {
  if (typeof raw !== "string") return false;
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return false;
  }
  if (parsed.protocol !== "https:") return false;
  if (!CHROME_IDENTITY_HOST.test(parsed.hostname)) return false;
  if (parsed.username || parsed.password || parsed.port) return false;
  const path =
    parsed.pathname.length > 1 && parsed.pathname.endsWith("/")
      ? parsed.pathname.slice(0, -1)
      : parsed.pathname;
  if (path !== "/" && path !== "/auth") return false;
  if (parsed.search || parsed.hash) return false;
  return true;
}

export function isAllowedPluginRedirectUri(raw: unknown): raw is string {
  return isAllowedVscodeExtensionRedirectUri(raw) || isAllowedChromeIdentityRedirectUri(raw);
}

export function pluginClientForRedirectUri(redirectUri: string): PluginAuthClient {
  return isAllowedChromeIdentityRedirectUri(redirectUri) ? "chrome" : "vscode";
}

export function isAllowedVscodeExtensionRedirectUri(raw: unknown): raw is string {
  if (typeof raw !== "string") return false;
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return false;
  }
  if (!ALLOWED_URI_SCHEMES.has(parsed.protocol.replace(":", "").toLowerCase())) {
    return false;
  }
  if (parsed.username || parsed.password || parsed.port) return false;
  if (parsed.hostname !== VSCODE_EXTENSION_ID) return false;
  if (parsed.pathname !== VSCODE_AUTH_CALLBACK_PATH) return false;
  if (parsed.search || parsed.hash) return false;
  return true;
}

export function buildVscodeExtensionAuthRedirectUri(
  redirectUri: string,
  params: { code: string; state: string },
): string {
  const url = new URL(redirectUri);
  url.searchParams.set("code", params.code);
  url.searchParams.set("state", params.state);
  return url.toString();
}

export function isVscodeExtensionRedirectUriSafeForBrowser(raw: unknown): boolean {
  if (typeof raw !== "string") return false;
  try {
    const parsed = new URL(raw);
    const hasGrant = Boolean(parsed.searchParams.get("code") && parsed.searchParams.get("state"));
    if (!hasGrant) return false;
    if (isAllowedChromeIdentityRedirectUri(`${parsed.origin}${parsed.pathname}`)) {
      return parsed.protocol === "https:";
    }
    if (!ALLOWED_URI_SCHEMES.has(parsed.protocol.replace(":", "").toLowerCase())) {
      return false;
    }
    if (parsed.hostname !== VSCODE_EXTENSION_ID) return false;
    if (parsed.pathname !== VSCODE_AUTH_CALLBACK_PATH) return false;
    return true;
  } catch {
    return false;
  }
}

export function vscodeLoginKvKey(state: string): string {
  return `${VSCODE_LOGIN_KV_PREFIX}${state}`;
}

export function bytesToBase64Url(bytes: Uint8Array): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(bytes)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/g, "");
  }
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return globalThis
    .btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

export async function pkceS256Challenge(verifier: string): Promise<string> {
  const digest = await globalThis.crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(verifier),
  );
  return bytesToBase64Url(new Uint8Array(digest));
}

export function randomVscodeState(): string {
  const bytes = new Uint8Array(32);
  globalThis.crypto.getRandomValues(bytes);
  return bytesToBase64Url(bytes);
}

export function randomPkceVerifier(): string {
  const bytes = new Uint8Array(32);
  globalThis.crypto.getRandomValues(bytes);
  return bytesToBase64Url(bytes);
}

export type VscodeLoginRecord = {
  v: 1;
  codeChallenge: string;
  redirectUri: string;
  status: "pending" | "approved";
  userId?: string;
  codeHash?: string;
};

export function parseVscodeLoginRecord(raw: unknown): VscodeLoginRecord | null {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return null;
  const record = raw as Record<string, unknown>;
  if (record.v !== 1) return null;
  if (typeof record.codeChallenge !== "string" || !VSCODE_PKCE_CHALLENGE_PATTERN.test(record.codeChallenge)) {
    return null;
  }
  if (!isAllowedPluginRedirectUri(record.redirectUri)) return null;
  if (record.status !== "pending" && record.status !== "approved") return null;
  const parsed: VscodeLoginRecord = {
    v: 1,
    codeChallenge: record.codeChallenge,
    redirectUri: record.redirectUri,
    status: record.status,
  };
  if (typeof record.userId === "string" && record.userId.length > 0) {
    parsed.userId = record.userId;
  }
  if (typeof record.codeHash === "string" && record.codeHash.length > 0) {
    parsed.codeHash = record.codeHash;
  }
  return parsed;
}
