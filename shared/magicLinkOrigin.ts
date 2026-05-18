import { isPagesStagingBranchHost } from "./pagesAppHosts";

/**
 * Ephemeral Pages deployment URLs (e.g. `958aa19e.privatenote-ai.pages.dev`) break when that
 * deployment is replaced. Prefer stable branch hosts or `PUBLIC_WEB_APP_ORIGIN` for emailed links.
 */
export function canonicalizeMagicLinkOrigin(
  allowedOrigin: string,
  options: {
    configuredPublicOrigin?: string | null;
    isPreviewOrigin: (origin: string) => boolean;
    isTrustedOrigin: (origin: string) => boolean;
    normalizeOrigin: (origin: string) => string;
  },
): string {
  const normalized = options.normalizeOrigin(allowedOrigin);
  if (!options.isPreviewOrigin(normalized)) {
    return normalized;
  }

  try {
    const host = new URL(normalized).hostname;
    if (isPagesStagingBranchHost(host)) {
      return normalized;
    }
  } catch {
    return normalized;
  }

  const configured = options.configuredPublicOrigin?.trim() || "";
  if (configured && options.isTrustedOrigin(configured)) {
    return options.normalizeOrigin(configured);
  }

  return normalized;
}
