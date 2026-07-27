import { BLOG_CANONICAL_SLUGS } from "./localizedBlogSlugs.ts";

export type BlogTemplate = "guide" | "standard";

/** All canonical posts use Guide chrome (breadcrumbs + sticky TOC). */
const GUIDE_SLUGS = new Set<string>(BLOG_CANONICAL_SLUGS);

export function getBlogTemplate(slug: string): BlogTemplate {
  return GUIDE_SLUGS.has(slug) ? "guide" : "standard";
}
