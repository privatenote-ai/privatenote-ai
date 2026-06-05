/**
 * Fire a lightweight analytics event to the backend.
 * Always non-blocking — never throws, never awaited in critical paths.
 */
export function fireAnalyticsEvent(event: "qr_share" | "wrong_password"): void {
  const base = (import.meta.env.VITE_API_URL || "").trim();
  fetch(`${base}/api/analytics/event`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event }),
    credentials: "include",
  }).catch(() => {});
}
