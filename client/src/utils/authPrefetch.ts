/** Paths where signed-in UI must be correct on first paint. */
const AUTH_EAGER_PREFIXES = ["/account", "/auth", "/magic"] as const;

export function shouldEagerPrefetchAuth(pathname: string): boolean {
  const path = pathname || "/";
  return AUTH_EAGER_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  );
}

/**
 * Bridges the full-page reload that sign-in flows do (`window.location.href = returnTo`).
 * Set right before the redirect so the destination page checks the session eagerly
 * instead of deferring it until the first user interaction (which made the navbar
 * appear logged-out for a few seconds after a passkey / magic-link sign-in).
 */
const JUST_SIGNED_IN_KEY = "pn_just_signed_in";

export function markJustSignedIn(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(JUST_SIGNED_IN_KEY, "1");
  } catch {
    /* sessionStorage unavailable (private mode / blocked) — non-fatal */
  }
}

/** Reads and clears the just-signed-in marker. Returns true only once per sign-in. */
export function consumeJustSignedIn(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (window.sessionStorage.getItem(JUST_SIGNED_IN_KEY) === "1") {
      window.sessionStorage.removeItem(JUST_SIGNED_IN_KEY);
      return true;
    }
  } catch {
    /* sessionStorage unavailable — non-fatal */
  }
  return false;
}

/**
 * Last-known signed-in hint (email only). Lets AuthContext optimistically render the
 * profile on a cold reload — before the deferred session check resolves — so the navbar
 * doesn't flash "Sign in" for an already-authenticated user on every page reload.
 *
 * This is a UI hint only (never an auth decision): the real session check still runs and
 * clears it if the session has actually expired. Persisted (not session-scoped) so it
 * survives a full browser restart the way a session cookie does.
 */
const AUTH_HINT_KEY = "pn_auth_hint";

export type AuthHint = { email: string | null };

export function readAuthHint(): AuthHint | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AUTH_HINT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { email?: unknown };
    return { email: typeof parsed.email === "string" ? parsed.email : null };
  } catch {
    return null;
  }
}

export function writeAuthHint(email: string | null): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(AUTH_HINT_KEY, JSON.stringify({ email }));
  } catch {
    /* localStorage unavailable — non-fatal */
  }
}

export function clearAuthHint(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(AUTH_HINT_KEY);
  } catch {
    /* localStorage unavailable — non-fatal */
  }
}
