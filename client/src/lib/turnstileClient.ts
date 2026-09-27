function envFlagTrue(v: string | boolean | undefined): boolean {
  if (v === true) return true;
  if (v == null || v === false) return false;
  const s = String(v).toLowerCase();
  return s === "1" || s === "true" || s === "yes";
}

/**
 * Site key for rendering Turnstile, or undefined to skip the widget entirely.
 *
 * - In `vite` dev, Turnstile is off by default (keeps local UI work unblocked even when
 *   VITE_TURNSTILE_SITE_KEY is in .env). Set `VITE_ENABLE_TURNSTILE_IN_DEV=1` to test it.
 * - Set `VITE_DISABLE_TURNSTILE=1` to force off in any build.
 */
export function getTurnstileSiteKeyForClient(): string | undefined {
  if (envFlagTrue(import.meta.env.VITE_DISABLE_TURNSTILE)) {
    return undefined;
  }
  const key = (import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined)?.trim();
  if (!key) return undefined;
  if (import.meta.env.DEV && !envFlagTrue(import.meta.env.VITE_ENABLE_TURNSTILE_IN_DEV)) {
    return undefined;
  }
  return key;
}
