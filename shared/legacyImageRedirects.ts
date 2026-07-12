/**
 * Blog heroes converted from PNG → JPEG (c92d61a). Old PNG URLs may still exist in
 * crawler queues or stale deploy artifacts — redirect to the optimized JPEG.
 */
export const LEGACY_IMAGE_REDIRECTS: Readonly<Record<string, string>> = {
  "/images/blog-chat-control-is-back-hero.png": "/images/blog-chat-control-is-back-hero.jpg",
  "/images/blog-secret-message-no-account-hero.png": "/images/blog-secret-message-no-account-hero.jpg",
};

export function resolveLegacyImageRedirect(pathname: string): string | null {
  return LEGACY_IMAGE_REDIRECTS[pathname] ?? null;
}
