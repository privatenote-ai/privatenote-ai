/**
 * Device-authorization helpers for MCP / CLI sign-in (OAuth-style user code).
 * The high-entropy device code stays on the local MCP process; the short user
 * code is typed or opened in the browser.
 */

export const MCP_DEVICE_USER_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export const MCP_DEVICE_USER_CODE_LENGTH = 8;
export const MCP_DEVICE_TTL_SECONDS = 10 * 60;
export const MCP_DEVICE_POLL_INTERVAL_SECONDS = 3;
export const MCP_DEVICE_KV_PREFIX = "mcp_device:";
/** Approve links for MCP/CLI must open the stable app, never a Pages preview host. */
export const MCP_DEVICE_PRODUCTION_ORIGIN = "https://privatenote.ai";

export type McpDeviceAuthStatus = "pending" | "authorized" | "denied";

export type McpDeviceAuthRecord = {
  v: 1;
  userCode: string;
  status: McpDeviceAuthStatus;
  createdAt: string;
  expiresAt: string;
  clientName: string;
  userId?: string;
  sessionId?: string;
};

export function mcpDeviceCodeKvKey(deviceCodeHash: string): string {
  return `${MCP_DEVICE_KV_PREFIX}dc:${deviceCodeHash}`;
}

export function mcpUserCodeKvKey(normalizedUserCode: string): string {
  return `${MCP_DEVICE_KV_PREFIX}uc:${normalizedUserCode}`;
}

export function normalizeMcpUserCode(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const compact = raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (compact.length !== MCP_DEVICE_USER_CODE_LENGTH) return null;
  for (const ch of compact) {
    if (!MCP_DEVICE_USER_CODE_ALPHABET.includes(ch)) return null;
  }
  return compact;
}

export function formatMcpUserCode(normalized: string): string {
  const compact = normalizeMcpUserCode(normalized);
  if (!compact) return normalized;
  return `${compact.slice(0, 4)}-${compact.slice(4)}`;
}

export function generateMcpUserCode(randomBytes: Uint8Array): string {
  if (randomBytes.byteLength < MCP_DEVICE_USER_CODE_LENGTH) {
    throw new Error("Not enough entropy for a user code");
  }
  let out = "";
  for (let i = 0; i < MCP_DEVICE_USER_CODE_LENGTH; i += 1) {
    out += MCP_DEVICE_USER_CODE_ALPHABET[randomBytes[i]! % MCP_DEVICE_USER_CODE_ALPHABET.length];
  }
  return out;
}

function originFromCandidate(raw: string): string | null {
  const trimmed = raw.trim().replace(/\/$/, "");
  if (!trimmed) return null;
  try {
    const url = new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`);
    const host = url.hostname.toLowerCase();
    if (host === "localhost" || host === "127.0.0.1") {
      return `${url.protocol}//${url.host}`;
    }
    if (host === "privatenote.ai" || host === "app.privatenote.ai") {
      return `${url.protocol}//${host}`;
    }
    if (host === "www.privatenote.ai") {
      return MCP_DEVICE_PRODUCTION_ORIGIN;
    }
    if (host === "premium.privatenote.ai") {
      return `${url.protocol}//${host}`;
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Origin for `/auth/device` links. MCP has no browser Origin, and
 * `PUBLIC_WEB_APP_ORIGIN` is often `*.pages.dev` — never send users there.
 */
export function resolveMcpDeviceVerificationOrigin(input: {
  requestOrigin?: string | null;
  configuredPublicOrigin?: string | null;
}): string {
  return (
    originFromCandidate(input.requestOrigin ?? "") ||
    originFromCandidate(input.configuredPublicOrigin ?? "") ||
    MCP_DEVICE_PRODUCTION_ORIGIN
  );
}

/** First successful poll returns the session id; later polls must not. */
export function takeMcpDeviceSessionId(
  record: McpDeviceAuthRecord,
): { accessToken: string; consumed: McpDeviceAuthRecord } | null {
  if (record.status !== "authorized" || typeof record.sessionId !== "string" || !record.sessionId) {
    return null;
  }
  const { sessionId, ...rest } = record;
  return { accessToken: sessionId, consumed: { ...rest } };
}

export function mcpDeviceVerificationPath(userCode: string, client = "mcp"): string {
  const formatted = formatMcpUserCode(userCode);
  const params = new URLSearchParams({
    user_code: formatted,
    client,
  });
  return `/auth/device?${params.toString()}`;
}

export function isMcpDeviceAuthRecord(value: unknown): value is McpDeviceAuthRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const rec = value as Record<string, unknown>;
  return (
    rec.v === 1 &&
    typeof rec.userCode === "string" &&
    (rec.status === "pending" || rec.status === "authorized" || rec.status === "denied") &&
    typeof rec.createdAt === "string" &&
    typeof rec.expiresAt === "string" &&
    typeof rec.clientName === "string"
  );
}
