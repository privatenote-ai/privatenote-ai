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
  "introduction-to-private-ai": {
    related: [
      "securing-ai-agents-like-employees",
      "privatenote-for-developers",
      "how-to-make-a-private-note",
      "what-is-end-to-end-encryption",
      "privacy-tools",
      "workplace-texts-private-note",
    ],
    trust: "/how-it-works",
  },
  "how-to-make-a-private-note": {
    related: [
      "one-time-secret-links",
      "why-email-is-worst-for-secrets",
      "how-to-share-api-key-securely",
      "what-is-end-to-end-encryption",
      "send-secret-message-without-account",
      "workplace-texts-private-note",
    ],
    trust: "/how-it-works",
  },
  "crypto-seed-phrase-one-time-link": {
    related: [
      "one-time-secret-links",
      "how-to-share-api-key-securely",
      "why-email-is-worst-for-secrets",
      "what-is-end-to-end-encryption",
      "send-secret-message-without-account",
      "secrets-never-send-in-chat",
    ],
    trust: "/how-it-works",
  },
  "why-email-is-worst-for-secrets": {
    related: [
      "crypto-seed-phrase-one-time-link",
      "one-time-secret-links",
      "how-to-share-api-key-securely",
      "secrets-never-send-in-chat",
      "send-secret-message-without-account",
      "what-is-end-to-end-encryption",
    ],
    trust: "/how-it-works",
  },
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
      "secrets-in-cicd-env-github-leaks",
      "how-to-share-ssh-keys-securely",
      "why-email-is-worst-for-secrets",
      "privatenote-for-developers",
      "one-time-secret-links",
    ],
    trust: "/security-resources",
  },
  "what-is-end-to-end-encryption": {
    related: [
      "android-iphone-rcs-end-to-end-encryption",
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
      "android-iphone-rcs-end-to-end-encryption",
      "why-email-is-worst-for-secrets",
      "send-secret-message-without-account",
      "one-time-secret-links",
      "how-we-generate-passwords",
    ],
    trust: "/security-resources",
  },
  "send-secret-message-without-account": {
    related: [
      "how-to-make-a-private-note",
      "one-time-secret-links",
      "secrets-never-send-in-chat",
      "what-is-end-to-end-encryption",
      "workplace-texts-private-note",
    ],
    trust: "/privacy",
  },
  "encrypted-vs-secure-file-sharing": {
    related: [
      "google-drive-vs-one-time-encrypted-links",
      "send-sensitive-documents-securely",
      "one-time-secret-links",
      "what-is-end-to-end-encryption",
      "how-to-share-api-key-securely",
      "send-secret-message-without-account",
    ],
    trust: "/how-it-works",
  },
  "one-time-secret-links": {
    related: [
      "how-to-share-a-password-securely",
      "crypto-seed-phrase-one-time-link",
      "why-email-is-worst-for-secrets",
      "send-secret-message-without-account",
      "how-to-share-api-key-securely",
    ],
    trust: "/how-it-works",
  },
  "securing-ai-agents-like-employees": {
    related: [
      "introduction-to-private-ai",
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
      "how-to-share-ssh-keys-securely",
      "secrets-in-cicd-env-github-leaks",
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
      "how-to-share-a-password-securely",
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
  "social-media-bans-children-evidence": {
    related: [
      "privacy-tools",
      "chat-control-europe-cryptographers",
      "what-is-end-to-end-encryption",
      "myth-good-enough-security",
      "one-time-secret-links",
      "secrets-never-send-in-chat",
    ],
    trust: "/privacy",
  },
  "how-to-share-a-password-securely": {
    related: [
      "one-time-secret-links",
      "why-email-is-worst-for-secrets",
      "secrets-never-send-in-chat",
      "how-we-generate-passwords",
      "how-to-share-api-key-securely",
      "send-secret-message-without-account",
    ],
    trust: "/security-guides/password",
  },
  "secrets-in-cicd-env-github-leaks": {
    related: [
      "how-to-share-api-key-securely",
      "how-to-share-ssh-keys-securely",
      "privatenote-for-developers",
      "one-time-secret-links",
      "why-email-is-worst-for-secrets",
      "secrets-never-send-in-chat",
    ],
    trust: "/security-resources",
  },
  "send-sensitive-documents-securely": {
    related: [
      "google-drive-vs-one-time-encrypted-links",
      "encrypted-vs-secure-file-sharing",
      "one-time-secret-links",
      "why-email-is-worst-for-secrets",
      "how-to-make-a-private-note",
      "send-secret-message-without-account",
    ],
    trust: "/how-it-works",
  },
  "how-to-share-ssh-keys-securely": {
    related: [
      "how-to-share-api-key-securely",
      "privatenote-for-developers",
      "secrets-in-cicd-env-github-leaks",
      "one-time-secret-links",
      "secrets-never-send-in-chat",
      "how-to-share-a-password-securely",
    ],
    trust: "/security-resources",
  },
  "android-iphone-rcs-end-to-end-encryption": {
    related: [
      "what-is-end-to-end-encryption",
      "secrets-never-send-in-chat",
      "one-time-secret-links",
      "how-to-share-a-password-securely",
      "chat-control-europe-cryptographers",
      "send-secret-message-without-account",
    ],
    trust: "/security-resources",
  },
  "google-drive-vs-one-time-encrypted-links": {
    related: [
      "send-sensitive-documents-securely",
      "encrypted-vs-secure-file-sharing",
      "one-time-secret-links",
      "why-email-is-worst-for-secrets",
      "what-is-end-to-end-encryption",
      "common-secret-handling-mistakes",
    ],
    trust: "/how-it-works",
  },
  "common-secret-handling-mistakes": {
    related: [
      "why-email-is-worst-for-secrets",
      "secrets-never-send-in-chat",
      "one-time-secret-links",
      "how-to-share-a-password-securely",
      "google-drive-vs-one-time-encrypted-links",
      "how-to-share-photos-securely",
    ],
    trust: "/security-resources",
  },
  "mythos-ai-cryptanalysis-hawk": {
    related: [
      "what-is-end-to-end-encryption",
      "introduction-to-private-ai",
      "myth-good-enough-security",
      "securing-ai-agents-like-employees",
      "chat-control-europe-cryptographers",
    ],
    trust: "/security-resources",
  },
  "how-to-share-photos-securely": {
    related: [
      "send-sensitive-documents-securely",
      "one-time-secret-links",
      "encrypted-vs-secure-file-sharing",
      "google-drive-vs-one-time-encrypted-links",
      "why-email-is-worst-for-secrets",
      "common-secret-handling-mistakes",
    ],
    trust: "/how-it-works",
  },
  "delayed-reveal-scheduled-secret-links": {
    related: [
      "one-time-secret-links",
      "how-to-make-a-private-note",
      "send-sensitive-documents-securely",
      "why-email-is-worst-for-secrets",
      "how-to-share-a-password-securely",
      "common-secret-handling-mistakes",
    ],
    trust: "/how-it-works",
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
