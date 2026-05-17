import { isPagesStagingBranchHost } from "@shared/pagesAppHosts";

/**
 * Internal tooling (/test-llm, /llm-ui, /admin/*) — not exposed on production privatenote.ai.
 * Available in Vite dev and on long-lived staging branch deploys (premium, develop).
 */
export function canAccessInternalAppRoutes(): boolean {
  if (import.meta.env.DEV) return true;
  if (typeof window === "undefined") return false;
  return isPagesStagingBranchHost(window.location.hostname);
}
