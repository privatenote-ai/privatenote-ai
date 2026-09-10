import type { KVNamespace } from "@cloudflare/workers-types";

export const ADMIN_SESSION_TTL_SECONDS = 4 * 60 * 60;
export const ADMIN_SESSION_COOKIE_NAME = "pn_admin";
export const ADMIN_SESSION_KV_PREFIX = "admin_session:";

type AdminSessionRecord = {
  adminTokenHash: string;
  createdAt: string;
};

function constantTimeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i += 1) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function randomToken(bytes = 32): string {
  const buffer = new Uint8Array(bytes);
  crypto.getRandomValues(buffer);
  return base64UrlEncode(buffer);
}

export async function sha256Base64Url(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return base64UrlEncode(new Uint8Array(digest));
}

export function adminSessionKvKey(sessionIdHash: string): string {
  return `${ADMIN_SESSION_KV_PREFIX}${sessionIdHash}`;
}

export function adminSessionCookie(sessionId: string): string {
  return `${ADMIN_SESSION_COOKIE_NAME}=${sessionId}; HttpOnly; Secure; SameSite=Strict; Path=/api/admin; Max-Age=${ADMIN_SESSION_TTL_SECONDS}`;
}

export function clearAdminSessionCookie(): string {
  return `${ADMIN_SESSION_COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/api/admin; Max-Age=0`;
}

export async function createAdminSession(kv: KVNamespace, adminToken: string): Promise<string> {
  const sessionId = randomToken(32);
  const [sessionIdHash, adminTokenHash] = await Promise.all([
    sha256Base64Url(sessionId),
    sha256Base64Url(adminToken),
  ]);
  const record: AdminSessionRecord = {
    adminTokenHash,
    createdAt: new Date().toISOString(),
  };
  await kv.put(adminSessionKvKey(sessionIdHash), JSON.stringify(record), {
    expirationTtl: ADMIN_SESSION_TTL_SECONDS,
  });
  return sessionId;
}

export async function adminSessionIsValid(
  kv: KVNamespace,
  sessionId: string,
  adminToken: string,
): Promise<boolean> {
  if (!sessionId) return false;
  const [sessionIdHash, adminTokenHash] = await Promise.all([
    sha256Base64Url(sessionId),
    sha256Base64Url(adminToken),
  ]);
  const raw = await kv.get(adminSessionKvKey(sessionIdHash), "text");
  if (!raw) return false;
  try {
    const record = JSON.parse(raw) as AdminSessionRecord;
    return typeof record.adminTokenHash === "string" && constantTimeEquals(record.adminTokenHash, adminTokenHash);
  } catch {
    return false;
  }
}

export async function revokeAdminSession(kv: KVNamespace, sessionId: string): Promise<void> {
  if (!sessionId) return;
  const sessionIdHash = await sha256Base64Url(sessionId);
  await kv.delete(adminSessionKvKey(sessionIdHash));
}
