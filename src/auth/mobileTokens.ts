/**
 * iOS / native mobile auth tokens.
 *
 * Access tokens are short-lived HS256 JWTs (15 minutes). Refresh tokens are
 * opaque, stored only as SHA-256 hashes, and rotated on every use.
 */

export const MOBILE_ACCESS_TOKEN_TTL_SECONDS = 900;
export const MOBILE_REFRESH_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 30;
export const MOBILE_ACCESS_TOKEN_TYP = "pn_mobile_access";
export const MOBILE_WEBAUTHN_ORIGIN = "https://privatenote.ai";
export const MOBILE_WEBAUTHN_RP_ID = "privatenote.ai";

export const MOBILE_CLIENT_TYPES = ["ios"] as const;
export type MobileClientType = (typeof MOBILE_CLIENT_TYPES)[number];

export type MobileAccessClaims = {
  v: 1;
  typ: typeof MOBILE_ACCESS_TOKEN_TYP;
  sub: string;
  sid: string;
  exp: number;
  iat: number;
};

export type MobileTokenPair = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: "Bearer";
};

export type MobileRefreshTokenRow = {
  id: string;
  token_hash: string;
  user_id: string;
  session_row_id: string;
  family_id: string;
  client_type: string;
  expires_at: string;
  revoked_at: string | null;
  replaced_by_id: string | null;
};

export type RefreshTokenClass = "ok" | "expired" | "revoked" | "reuse";

export function parseMobileClientType(value: unknown): MobileClientType | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  return (MOBILE_CLIENT_TYPES as readonly string[]).includes(normalized)
    ? (normalized as MobileClientType)
    : null;
}

export function isCompactJwt(token: string): boolean {
  const parts = token.split(".");
  return parts.length === 3 && parts.every((part) => part.length > 0);
}

export function classifyRefreshTokenRow(
  row: Pick<MobileRefreshTokenRow, "expires_at" | "revoked_at" | "replaced_by_id">,
  nowMs: number = Date.now(),
): RefreshTokenClass {
  if (row.revoked_at) {
    return row.replaced_by_id ? "reuse" : "revoked";
  }
  const expiresAt = Date.parse(row.expires_at);
  if (!Number.isFinite(expiresAt) || expiresAt <= nowMs) {
    return "expired";
  }
  return "ok";
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

export async function signMobileAccessToken(
  secret: string,
  claims: Omit<MobileAccessClaims, "v" | "typ" | "iat" | "exp"> & {
    nowMs?: number;
    ttlSeconds?: number;
  },
): Promise<string> {
  const nowSec = Math.floor((claims.nowMs ?? Date.now()) / 1000);
  const ttl = claims.ttlSeconds ?? MOBILE_ACCESS_TOKEN_TTL_SECONDS;
  const payload: MobileAccessClaims = {
    v: 1,
    typ: MOBILE_ACCESS_TOKEN_TYP,
    sub: claims.sub,
    sid: claims.sid,
    iat: nowSec,
    exp: nowSec + ttl,
  };
  const header = base64UrlEncode(new TextEncoder().encode(JSON.stringify({ alg: "HS256", typ: "JWT" })));
  const body = base64UrlEncode(new TextEncoder().encode(JSON.stringify(payload)));
  const unsigned = `${header}.${body}`;
  const signature = await hmacSha256(secret, unsigned);
  return `${unsigned}.${signature}`;
}

export async function verifyMobileAccessToken(
  secret: string,
  token: string,
  nowMs: number = Date.now(),
): Promise<MobileAccessClaims | null> {
  if (!isCompactJwt(token)) return null;
  const [headerB64, payloadB64, signature] = token.split(".");
  if (!headerB64 || !payloadB64 || !signature) return null;
  const expected = await hmacSha256(secret, `${headerB64}.${payloadB64}`);
  if (!constantTimeEquals(signature, expected)) return null;
  let payload: unknown;
  try {
    payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(payloadB64)));
  } catch {
    return null;
  }
  if (!isMobileAccessClaims(payload)) return null;
  const nowSec = Math.floor(nowMs / 1000);
  if (payload.exp <= nowSec) return null;
  if (payload.iat > nowSec + 60) return null;
  return payload;
}

export function isMobileAccessClaims(value: unknown): value is MobileAccessClaims {
  if (!value || typeof value !== "object") return false;
  const rec = value as Record<string, unknown>;
  return (
    rec.v === 1 &&
    rec.typ === MOBILE_ACCESS_TOKEN_TYP &&
    typeof rec.sub === "string" &&
    rec.sub.length > 0 &&
    typeof rec.sid === "string" &&
    rec.sid.length > 0 &&
    typeof rec.exp === "number" &&
    Number.isFinite(rec.exp) &&
    typeof rec.iat === "number" &&
    Number.isFinite(rec.iat)
  );
}

export function mobileTokenPair(
  accessToken: string,
  refreshToken: string,
  expiresIn: number = MOBILE_ACCESS_TOKEN_TTL_SECONDS,
): MobileTokenPair {
  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_in: expiresIn,
    token_type: "Bearer",
  };
}

function constantTimeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i += 1) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

async function hmacSha256(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return base64UrlEncode(new Uint8Array(signature));
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((value.length + 3) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
