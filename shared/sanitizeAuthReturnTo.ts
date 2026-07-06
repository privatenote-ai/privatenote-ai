/** Allow only same-site relative paths (no scheme, host, or protocol-relative URLs). */
export function sanitizeAuthReturnTo(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return null;
  if (trimmed.includes("://") || trimmed.includes("\\") || trimmed.includes("..")) return null;
  if (/[\0-\x1f\x7f]/.test(trimmed)) return null;
  return trimmed;
}

export function appendMagicLinkReturnTo(magicUrl: string, returnTo: string | null): string {
  if (!returnTo) return magicUrl;
  const url = new URL(magicUrl);
  url.searchParams.set("returnTo", returnTo);
  return url.toString();
}
