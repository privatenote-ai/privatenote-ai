/**
 * Validate and align API / share-link origins before any network or URL output.
 */

export type ResolveEndpointsOptions = {
  apiBaseUrlRaw?: string;
  webOriginRaw?: string;
  defaultApiBaseUrl: string;
  allowInsecure?: boolean;
  allowOriginMismatch?: boolean;
  /** Comma-separated hostnames (env: PRIVATENOTE_ALLOWED_HOSTS). Subdomains are allowed. */
  allowedHostsRaw?: string;
};

export type ResolvedEndpoints = {
  apiBaseUrl: string;
  webOrigin: string;
};

function parseOriginInput(raw: string, label: string): URL {
  let parsed: URL;
  try {
    parsed = new URL(raw.trim());
  } catch {
    throw new Error(`${label} is not a valid URL: ${raw}`);
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new Error(`${label} must use http:// or https://`);
  }

  if (parsed.username || parsed.password) {
    throw new Error(`${label} must not include credentials`);
  }

  if (parsed.search || parsed.hash) {
    throw new Error(`${label} must not include query parameters or fragments`);
  }

  const path = parsed.pathname;
  if (path && path !== "/") {
    throw new Error(`${label} must be an origin only (no path). Use ${parsed.origin} instead of ${raw}`);
  }

  return parsed;
}

function originWithoutTrailingSlash(url: URL): string {
  return url.origin;
}

function assertHttpsAllowed(parsed: URL, label: string, allowInsecure: boolean): void {
  if (parsed.protocol === "https:") return;

  if (!allowInsecure) {
    throw new Error(
      `${label} must use HTTPS (${parsed.origin}). For local HTTP dev only, pass --insecure.`,
    );
  }
}

export function parseAllowedHosts(raw: string | undefined): string[] | null {
  if (!raw?.trim()) return null;
  const hosts = raw
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
  return hosts.length > 0 ? hosts : null;
}

function hostnameMatchesAllowlist(hostname: string, allowedHosts: string[]): boolean {
  const host = hostname.toLowerCase();
  return allowedHosts.some((entry) => host === entry || host.endsWith(`.${entry}`));
}

function assertHostnameAllowed(parsed: URL, label: string, allowedHosts: string[] | null): void {
  if (!allowedHosts) return;

  if (!hostnameMatchesAllowlist(parsed.hostname, allowedHosts)) {
    throw new Error(
      `${label} host "${parsed.hostname}" is not allowed. ` +
        `Set PRIVATENOTE_ALLOWED_HOSTS to include it (current: ${allowedHosts.join(", ")}).`,
    );
  }
}

export function resolveEndpoints(options: ResolveEndpointsOptions): ResolvedEndpoints {
  const allowedHosts = parseAllowedHosts(options.allowedHostsRaw);

  const apiRaw = options.apiBaseUrlRaw?.trim() || options.defaultApiBaseUrl;
  const apiParsed = parseOriginInput(apiRaw, "API base URL");
  assertHttpsAllowed(apiParsed, "API base URL", options.allowInsecure === true);
  assertHostnameAllowed(apiParsed, "API base URL", allowedHosts);

  const webRaw = options.webOriginRaw?.trim();
  const webParsed = webRaw ? parseOriginInput(webRaw, "Web origin") : apiParsed;
  assertHttpsAllowed(webParsed, "Web origin", options.allowInsecure === true);
  assertHostnameAllowed(webParsed, "Web origin", allowedHosts);

  const apiBaseUrl = originWithoutTrailingSlash(apiParsed);
  const webOrigin = originWithoutTrailingSlash(webParsed);

  if (!options.allowOriginMismatch && apiBaseUrl !== webOrigin) {
    throw new Error(
      `API base URL (${apiBaseUrl}) and web origin (${webOrigin}) must match. ` +
        "Share links must point to the same host that received the ciphertext. " +
        "Pass --allow-origin-mismatch only if you understand the phishing risk.",
    );
  }

  return { apiBaseUrl, webOrigin };
}
