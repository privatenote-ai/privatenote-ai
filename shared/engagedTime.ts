/** Inclusive upper bounds in milliseconds; the last bucket is everything above the previous bound. */
export const ENGAGED_DURATION_BUCKET_MAX_MS = [
  5_000,
  15_000,
  30_000,
  60_000,
  180_000,
  600_000,
] as const;

export const ENGAGED_DURATION_BUCKET_COUNT = ENGAGED_DURATION_BUCKET_MAX_MS.length + 1;

export const ENGAGED_DURATION_BUCKET_LABELS = [
  "0–5s",
  "5–15s",
  "15–30s",
  "30–60s",
  "1–3m",
  "3–10m",
  "10m+",
] as const;

export function emptyEngagedHistogram(): number[] {
  return Array.from({ length: ENGAGED_DURATION_BUCKET_COUNT }, () => 0);
}

export function engagedMsBucketIndex(engagedMs: number): number {
  const ms = Math.max(0, Math.floor(engagedMs));
  for (let i = 0; i < ENGAGED_DURATION_BUCKET_MAX_MS.length; i++) {
    if (ms <= ENGAGED_DURATION_BUCKET_MAX_MS[i]!) return i;
  }
  return ENGAGED_DURATION_BUCKET_MAX_MS.length;
}

export function addEngagedMsToHistogram(histogram: number[] | undefined, engagedMs: number): number[] {
  const next = histogram && histogram.length === ENGAGED_DURATION_BUCKET_COUNT
    ? histogram.slice()
    : emptyEngagedHistogram();
  const index = engagedMsBucketIndex(engagedMs);
  next[index] = (next[index] || 0) + 1;
  return next;
}

export function mergeEngagedHistograms(
  base: Record<string, number[]> | undefined,
  add: Record<string, number[]> | undefined,
): Record<string, number[]> {
  const out: Record<string, number[]> = {};
  const keys = new Set([...Object.keys(base || {}), ...Object.keys(add || {})]);
  for (const key of keys) {
    const left = base?.[key];
    const right = add?.[key];
    const merged = emptyEngagedHistogram();
    for (let i = 0; i < ENGAGED_DURATION_BUCKET_COUNT; i++) {
      merged[i] = (left?.[i] || 0) + (right?.[i] || 0);
    }
    if (merged.some((n) => n > 0)) out[key] = merged;
  }
  return out;
}

/**
 * Approximate median from a duration histogram.
 * Returns seconds. Null when there are no samples.
 */
export function medianSecondsFromHistogram(histogram: number[] | undefined): number | null {
  if (!histogram || histogram.length !== ENGAGED_DURATION_BUCKET_COUNT) return null;
  const total = histogram.reduce((sum, n) => sum + n, 0);
  if (total <= 0) return null;
  const target = (total + 1) / 2;
  let cumulative = 0;
  const bounds = [0, ...ENGAGED_DURATION_BUCKET_MAX_MS];
  for (let i = 0; i < histogram.length; i++) {
    const count = histogram[i] || 0;
    const next = cumulative + count;
    if (next >= target) {
      const low = bounds[i] ?? 0;
      const high = i < ENGAGED_DURATION_BUCKET_MAX_MS.length
        ? ENGAGED_DURATION_BUCKET_MAX_MS[i]!
        : ENGAGED_DURATION_BUCKET_MAX_MS[ENGAGED_DURATION_BUCKET_MAX_MS.length - 1]! * 2;
      const span = Math.max(1, high - low);
      const offset = count > 0 ? (target - cumulative) / count : 0;
      return Math.round((low + span * offset) / 1000);
    }
    cumulative = next;
  }
  return null;
}
