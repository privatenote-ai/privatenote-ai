/**
 * Loose format check for UX guardrails and simple API rejection.
 * Not a full RFC 5322 / HTML5 address validator.
 */
export function isPlausibleEmailFormat(email: string): boolean {
  const trimmed = email.trim();
  if (!trimmed) return false;
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmed);
}
