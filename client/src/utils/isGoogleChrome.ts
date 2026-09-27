/**
 * True when the user is on desktop Google Chrome (or Chromium) — browsers that can
 * install extensions from the Chrome Web Store. Excludes Edge, Opera, Brave, and mobile.
 */
export function isGoogleChrome(): boolean {
  if (typeof navigator === "undefined") return false;

  const ua = navigator.userAgent;
  if (/Android|iPhone|iPad|iPod|Mobile/i.test(ua)) return false;
  if (/Edg\//i.test(ua) || /OPR\//i.test(ua) || /Brave/i.test(ua)) return false;

  return /Chrome|Chromium|CriOS/i.test(ua);
}
