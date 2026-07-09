import { BLOG_CANONICAL_SLUGS, type BlogCanonicalSlug } from "./localizedBlogSlugs.ts";

/** Trust, privacy, and security pages for blog cross-links. */
export type BlogTrustPath =
  | "/security-resources"
  | "/privacy"
  | "/how-it-works"
  | "/about"
  | "/terms"
  | "/security-guides/password";

export type BlogPostCrossLinks = {
  related: readonly BlogCanonicalSlug[];
  trust: BlogTrustPath;
};

const MIN_RELATED_POSTS = 2;
const MAX_RELATED_POSTS = 6;

/**
 * Per-post internal linking: related blog posts plus one trust/security page.
 * Product CTAs live in each post's closing section, so they are not duplicated here.
 */
export const BLOG_POST_CROSS_LINKS: Record<BlogCanonicalSlug, BlogPostCrossLinks> = {
  "chat-control-1-0-vote-explained": {
    related: [
      "chat-control-europe-cryptographers",
      "what-is-end-to-end-encryption",
      "secrets-never-send-in-chat",
      "one-time-secret-links",
    ],
    trust: "/security-resources",
  },
  "chat-control-europe-cryptographers": {
    related: [
      "chat-control-1-0-vote-explained",
      "what-is-end-to-end-encryption",
      "secrets-never-send-in-chat",
      "privacy-tools",
    ],
    trust: "/security-resources",
  },
  "how-to-share-api-key-securely": {
    related: [
      "privatenote-for-developers",
      "privatenote-codex",
      "one-time-secret-links",
      "securing-ai-agents-like-employees",
    ],
    trust: "/security-resources",
  },
  "what-is-end-to-end-encryption": {
    related: [
      "chat-control-1-0-vote-explained",
      "chat-control-europe-cryptographers",
      "encrypted-vs-secure-file-sharing",
      "one-time-secret-links",
      "send-secret-message-without-account",
    ],
    trust: "/security-resources",
  },
  "secrets-never-send-in-chat": {
    related: [
      "send-secret-message-without-account",
      "how-we-generate-passwords",
      "one-time-secret-links",
      "myth-good-enough-security",
    ],
    trust: "/security-resources",
  },
  "send-secret-message-without-account": {
    related: [
      "one-time-secret-links",
      "secrets-never-send-in-chat",
      "what-is-end-to-end-encryption",
      "workplace-texts-private-note",
    ],
    trust: "/privacy",
  },
  "encrypted-vs-secure-file-sharing": {
    related: [
      "one-time-secret-links",
      "what-is-end-to-end-encryption",
      "how-to-share-api-key-securely",
      "send-secret-message-without-account",
    ],
    trust: "/how-it-works",
  },
  "one-time-secret-links": {
    related: [
      "send-secret-message-without-account",
      "how-to-share-api-key-securely",
      "secrets-never-send-in-chat",
      "workplace-texts-private-note",
    ],
    trust: "/how-it-works",
  },
  "securing-ai-agents-like-employees": {
    related: [
      "privatenote-for-developers",
      "privatenote-codex",
      "how-to-share-api-key-securely",
      "secrets-never-send-in-chat",
    ],
    trust: "/security-resources",
  },
  "privatenote-codex": {
    related: [
      "privatenote-for-developers",
      "securing-ai-agents-like-employees",
      "how-to-share-api-key-securely",
    ],
    trust: "/security-resources",
  },
  "privatenote-for-developers": {
    related: [
      "how-to-share-api-key-securely",
      "privatenote-codex",
      "securing-ai-agents-like-employees",
      "one-time-secret-links",
    ],
    trust: "/security-resources",
  },
  "privacy-tools": {
    related: [
      "myth-good-enough-security",
      "what-is-end-to-end-encryption",
      "secrets-never-send-in-chat",
      "chat-control-europe-cryptographers",
    ],
    trust: "/privacy",
  },
  "myth-good-enough-security": {
    related: [
      "privacy-tools",
      "secrets-never-send-in-chat",
      "workplace-texts-private-note",
      "one-time-secret-links",
    ],
    trust: "/security-resources",
  },
  "how-we-generate-passwords": {
    related: [
      "secrets-never-send-in-chat",
      "send-secret-message-without-account",
      "myth-good-enough-security",
    ],
    trust: "/security-guides/password",
  },
  "workplace-texts-private-note": {
    related: [
      "one-time-secret-links",
      "myth-good-enough-security",
      "send-secret-message-without-account",
      "privacy-tools",
    ],
    trust: "/privacy",
  },
};

export function getBlogPostCrossLinks(slug: BlogCanonicalSlug): BlogPostCrossLinks {
  return BLOG_POST_CROSS_LINKS[slug];
}

export function isBlogTrustPath(path: string): path is BlogTrustPath {
  return (
    path === "/security-resources" ||
    path === "/privacy" ||
    path === "/how-it-works" ||
    path === "/about" ||
    path === "/terms" ||
    path === "/security-guides/password"
  );
}

/** Ensures every canonical blog slug has a complete cross-link config. */
export function validateBlogPostCrossLinks(): string[] {
  const errors: string[] = [];

  for (const slug of BLOG_CANONICAL_SLUGS) {
    const entry = BLOG_POST_CROSS_LINKS[slug];
    if (!entry) {
      errors.push(`Missing cross-links for ${slug}`);
      continue;
    }
    if (!isBlogTrustPath(entry.trust)) {
      errors.push(`${slug}: invalid trust path ${entry.trust}`);
    }
    if (entry.related.length < MIN_RELATED_POSTS || entry.related.length > MAX_RELATED_POSTS) {
      errors.push(
        `${slug}: expected ${MIN_RELATED_POSTS}-${MAX_RELATED_POSTS} related posts, got ${entry.related.length}`,
      );
    }
    if (new Set(entry.related).size !== entry.related.length) {
      errors.push(`${slug}: related posts must be distinct`);
    }
    for (const related of entry.related) {
      if (related === slug) {
        errors.push(`${slug}: related post cannot be the current post`);
      }
      if (!BLOG_CANONICAL_SLUGS.includes(related)) {
        errors.push(`${slug}: unknown related slug ${related}`);
      }
    }
  }

  return errors;
}
