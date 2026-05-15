/** Paths where signed-in UI must be correct on first paint. */
const AUTH_EAGER_PREFIXES = ["/account", "/auth", "/magic"] as const;

export function shouldEagerPrefetchAuth(pathname: string): boolean {
  const path = pathname || "/";
  return AUTH_EAGER_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  );
}
