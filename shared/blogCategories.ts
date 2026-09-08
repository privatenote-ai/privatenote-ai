import {
  BLOG_CANONICAL_SLUGS,
  isBlogListingSlug,
  type BlogCanonicalSlug,
} from "./localizedBlogSlugs.ts";
import {
  isSupportedLanguage,
  NON_ENGLISH_LANGUAGE_CODES,
  type SupportedLanguage,
} from "./supportedLanguages.ts";

/** Primary blog categories in business-importance order (nav / filters). */
export const BLOG_CATEGORIES = ["secrets", "encryption", "privacy", "ai", "developers"] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

/** Reserved URL segment under `/blog/category/:id` (English IDs; labels are translated). */
export const BLOG_CATEGORY_PATH_SEGMENT = "category" as const;

/**
 * One primary category per canonical post.
 * Intent-based: Secrets (handoff), Encryption (concepts), Privacy (policy),
 * AI (agents/local models), Developers (integrations).
 */
export const BLOG_POST_CATEGORY: Record<BlogCanonicalSlug, BlogCategory> = {
  // Secrets — sharing & handoff pillar
  "how-to-share-api-key-securely": "secrets",
  "how-to-share-ssh-keys-securely": "secrets",
  "how-to-share-a-password-securely": "secrets",
  "send-sensitive-documents-securely": "secrets",
  "secrets-in-cicd-env-github-leaks": "secrets",
  "crypto-seed-phrase-one-time-link": "secrets",
  "why-email-is-worst-for-secrets": "secrets",
  "secrets-never-send-in-chat": "secrets",
  "send-secret-message-without-account": "secrets",
  "one-time-secret-links": "secrets",
  "encrypted-vs-secure-file-sharing": "secrets",
  "google-drive-vs-one-time-encrypted-links": "secrets",
  "common-secret-handling-mistakes": "secrets",
  "how-to-share-photos-securely": "secrets",
  "how-to-send-encrypted-voice-message": "secrets",
  "recipient-verification-code-before-reveal": "secrets",
  "click-to-reveal-private-notes": "secrets",
  "know-when-secret-link-opened": "secrets",
  "revoke-unopened-note-proof-of-access": "secrets",
  "delayed-reveal-scheduled-secret-links": "secrets",
  "how-to-make-a-private-note": "secrets",
  "how-we-generate-passwords": "secrets",

  // Encryption — educational concepts
  "what-is-end-to-end-encryption": "encryption",
  "android-iphone-rcs-end-to-end-encryption": "encryption",
  "myth-good-enough-security": "encryption",
  "mythos-ai-cryptanalysis-hawk": "encryption",

  // Privacy — policy, workplace, stacks
  "chat-control-1-0-vote-explained": "privacy",
  "chat-control-europe-cryptographers": "privacy",
  "social-media-bans-children-evidence": "privacy",
  "workplace-texts-private-note": "privacy",
  "secure-client-delivery-for-lawyers": "privacy",
  "privacy-tools": "privacy",

  // AI
  "introduction-to-private-ai": "ai",
  "securing-ai-agents-like-employees": "ai",

  // Developers
  "privatenote-for-developers": "developers",
  "privatenote-codex": "developers",
};

export function isBlogCategory(value: string): value is BlogCategory {
  return (BLOG_CATEGORIES as readonly string[]).includes(value);
}

export function getBlogCategory(slug: string): BlogCategory | null {
  if (!(BLOG_CANONICAL_SLUGS as readonly string[]).includes(slug)) return null;
  return BLOG_POST_CATEGORY[slug as BlogCanonicalSlug] ?? null;
}

export function blogSlugsInCategory(category: BlogCategory): BlogCanonicalSlug[] {
  return BLOG_CANONICAL_SLUGS.filter(
    (slug) => BLOG_POST_CATEGORY[slug] === category && isBlogListingSlug(slug),
  );
}

/** Public category landing path, e.g. `/blog/category/secrets` or `/de/blog/category/secrets`. */
export function blogCategoryPath(category: BlogCategory, language: SupportedLanguage = "en"): string {
  const base = `/blog/${BLOG_CATEGORY_PATH_SEGMENT}/${category}`;
  return language === "en" ? base : `/${language}${base}`;
}

export function allBlogCategoryMarketingPaths(): string[] {
  const paths: string[] = [];
  for (const category of BLOG_CATEGORIES) {
    paths.push(blogCategoryPath(category, "en"));
    for (const language of NON_ENGLISH_LANGUAGE_CODES) {
      paths.push(blogCategoryPath(category, language));
    }
  }
  return paths;
}

/** Parse `/blog/category/:id` (with optional locale prefix). */
export function parseBlogCategoryFromPath(pathname: string): BlogCategory | null {
  const parts = pathname.split(/[?#]/)[0]?.split("/").filter(Boolean) ?? [];
  let rest = parts;
  if (parts[0] && isSupportedLanguage(parts[0]) && parts[0] !== "en") {
    rest = parts.slice(1);
  }
  if (
    rest.length === 3 &&
    rest[0] === "blog" &&
    rest[1] === BLOG_CATEGORY_PATH_SEGMENT &&
    isBlogCategory(rest[2]!)
  ) {
    return rest[2]!;
  }
  return null;
}

/** Returns errors if any canonical slug is missing a category (or unexpected keys exist). */
export function validateBlogPostCategories(): string[] {
  const errors: string[] = [];
  for (const slug of BLOG_CANONICAL_SLUGS) {
    if (!BLOG_POST_CATEGORY[slug]) {
      errors.push(`missing category for ${slug}`);
    }
  }
  for (const slug of Object.keys(BLOG_POST_CATEGORY) as BlogCanonicalSlug[]) {
    if (!(BLOG_CANONICAL_SLUGS as readonly string[]).includes(slug)) {
      errors.push(`category map has unknown slug ${slug}`);
    }
  }
  return errors;
}
