/**
 * Parses `createdAt` from `/api/auth/account/activity`.
 * D1 stores UTC via `datetime('now')` as `YYYY-MM-DD HH:MM:SS` without a zone; browsers
 * treat naive strings inconsistently (often as local wall time). Normalize to UTC instant first.
 */
export function parseActivityCreatedAt(raw: string): Date {
  const s = raw.trim();
  if (!s) return new Date(Number.NaN);
  if (s.endsWith("Z")) return new Date(s);
  if (/[+-]\d{2}:\d{2}$/.test(s) || /[+-]\d{4}$/.test(s)) return new Date(s);

  let candidate = s;
  if (/^\d{4}-\d{2}-\d{2} \d/.test(candidate)) {
    candidate = `${candidate.slice(0, 10)}T${candidate.slice(11)}`;
  }
  const m = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2})(\.\d+)?/.exec(candidate);
  if (m) return new Date(`${m[1]}T${m[2]}${m[3] ?? ""}Z`);

  return new Date(s);
}
