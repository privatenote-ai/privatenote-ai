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
