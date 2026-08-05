export function entitlementRefreshDelayMs(
  expiresAt: string | null,
  nowMs = Date.now(),
): number | null {
  if (!expiresAt) return null;
  const expiresMs = new Date(expiresAt).getTime();
  if (!Number.isFinite(expiresMs)) return null;
  const untilExpiry = expiresMs - nowMs + 250;
  if (untilExpiry <= 0) return 0;
  return Math.min(untilExpiry, 24 * 60 * 60 * 1000);
}
