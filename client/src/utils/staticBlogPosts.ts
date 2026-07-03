import type { BlogPost } from "@shared/schema";
import type { Translations } from "@/utils/translations/types";
import { parseBlogPostTags } from "@/utils/blogPostTags";

/** First commit that wired each static post into the site (git history). */
export const STATIC_BLOG_PUBLISHED_AT: Record<string, string> = {
  "secrets-never-send-in-chat": "2026-07-03T14:00:00.000Z",
  "send-secret-message-without-account": "2026-07-03T12:00:00.000Z",
  "encrypted-vs-secure-file-sharing": "2026-07-01T12:00:00.000Z",
  "one-time-secret-links": "2026-06-06T12:00:00.000Z",
  "privacy-tools": "2026-01-11T12:00:00.000Z",
  "myth-good-enough-security": "2026-01-21T12:00:00.000Z",
  "how-we-generate-passwords": "2026-01-21T12:00:00.000Z",
  "workplace-texts-private-note": "2026-05-08T12:00:00.000Z",
  "privatenote-for-developers": "2026-05-20T12:00:00.000Z",
  "privatenote-codex": "2026-05-21T12:00:00.000Z",
  "securing-ai-agents-like-employees": "2026-06-06T12:00:00.000Z",
};

export const STATIC_BLOG_SLUGS = Object.keys(STATIC_BLOG_PUBLISHED_AT) as readonly string[];

const STATIC_BLOG_READ_MINUTES: Record<string, 4 | 5 | 6 | 7> = {
  "secrets-never-send-in-chat": 7,
  "send-secret-message-without-account": 7,
  "encrypted-vs-secure-file-sharing": 6,
  "one-time-secret-links": 7,
  "privacy-tools": 4,
  "myth-good-enough-security": 5,
  "how-we-generate-passwords": 6,
  "workplace-texts-private-note": 6,
  "privatenote-for-developers": 6,
  "privatenote-codex": 5,
  "securing-ai-agents-like-employees": 6,
};

export function getStaticBlogReadTime(slug: string, t: Translations): string | undefined {
  const minutes = STATIC_BLOG_READ_MINUTES[slug];
  if (!minutes) return undefined;
  return t[`homeBlogReadTime${minutes}`];
}

export function staticBlogPublishedAt(slug: string): Date {
  return new Date(STATIC_BLOG_PUBLISHED_AT[slug] ?? STATIC_BLOG_PUBLISHED_AT["privacy-tools"]);
}

/** Topic badges and publish date for static blog article pages. */
export function getStaticBlogMeta(
  slug: string,
  t: Translations,
): { publishedAt: Date; tags: string[] } {
  const post = buildStaticBlogPosts(t).find((entry) => entry.slug === slug);
  if (post) {
    return {
      publishedAt: staticBlogPublishedAt(slug),
      tags: parseBlogPostTags(post.tags),
    };
  }

  if (slug === "workplace-texts-private-note") {
    return {
      publishedAt: staticBlogPublishedAt(slug),
      tags: [t.blogTagPrivacy, t.blogTagSecurity],
    };
  }

  return {
    publishedAt: staticBlogPublishedAt(slug),
    tags: [t.blogTagSecurity],
  };
}

export function buildStaticBlogPosts(t: Translations): BlogPost[] {
  const at = (slug: string) => staticBlogPublishedAt(slug);

  return [
    {
      id: -11,
      title: t.blogChatSecretsTitle,
      excerpt: t.blogChatSecretsExcerpt,
      author: "PrivateNote.ai",
      slug: "secrets-never-send-in-chat",
      publishedAt: at("secrets-never-send-in-chat"),
      tags: JSON.stringify([t.blogTagSecurity, t.blogTagWorkplace, t.blogTagPrivacy, t.blogTagPasswords]),
      content: "",
      coverImage: null,
      published: true,
      createdAt: at("secrets-never-send-in-chat"),
      updatedAt: at("secrets-never-send-in-chat"),
    },
    {
      id: -10,
      title: t.blogSecretNoAccountTitle,
      excerpt: t.blogSecretNoAccountExcerpt,
      author: "PrivateNote.ai",
      slug: "send-secret-message-without-account",
      publishedAt: at("send-secret-message-without-account"),
      tags: JSON.stringify([t.blogTagSecurity, t.blogTagPrivacy, t.blogTagCryptography]),
      content: "",
      coverImage: null,
      published: true,
      createdAt: at("send-secret-message-without-account"),
      updatedAt: at("send-secret-message-without-account"),
    },
    {
      id: -9,
      title: t.blogEncryptedFileSharingTitle,
      excerpt: t.blogEncryptedFileSharingExcerpt,
      author: "PrivateNote.ai",
      slug: "encrypted-vs-secure-file-sharing",
      publishedAt: at("encrypted-vs-secure-file-sharing"),
      tags: JSON.stringify([t.blogTagSecurity, t.blogTagPrivacy, t.blogTagCryptography]),
      content: "",
      coverImage: null,
      published: true,
      createdAt: at("encrypted-vs-secure-file-sharing"),
      updatedAt: at("encrypted-vs-secure-file-sharing"),
    },
    {
      id: -8,
      title: t.blogOneTimeLinksTitle,
      excerpt: t.blogOneTimeLinksExcerpt,
      author: "PrivateNote.ai",
      slug: "one-time-secret-links",
      publishedAt: at("one-time-secret-links"),
      tags: JSON.stringify([t.blogTagSecurity, t.blogTagPrivacy, t.blogTagCryptography]),
      content: "",
      coverImage: null,
      published: true,
      createdAt: at("one-time-secret-links"),
      updatedAt: at("one-time-secret-links"),
    },
    {
      id: -7,
      title: t.blogAgentSecurityTitle,
      excerpt: t.blogAgentSecurityExcerpt,
      author: "PrivateNote.ai",
      slug: "securing-ai-agents-like-employees",
      publishedAt: at("securing-ai-agents-like-employees"),
      tags: JSON.stringify([t.blogTagSecurity, t.blogTagPrivacy, t.blogTagAi]),
      content: "",
      coverImage: null,
      published: true,
      createdAt: at("securing-ai-agents-like-employees"),
      updatedAt: at("securing-ai-agents-like-employees"),
    },
    {
      id: -6,
      title: t.blogCodexTitle,
      excerpt: t.blogCodexExcerpt,
      author: "PrivateNote.ai",
      slug: "privatenote-codex",
      publishedAt: at("privatenote-codex"),
      tags: JSON.stringify([t.blogTagDeveloper, t.blogTagMcp, t.blogTagIntegration, t.blogTagSecurity]),
      content: "",
      coverImage: null,
      published: true,
      createdAt: at("privatenote-codex"),
      updatedAt: at("privatenote-codex"),
    },
    {
      id: -5,
      title: t.blogDevelopersTitle,
      excerpt: t.blogDevelopersExcerpt,
      author: "PrivateNote.ai",
      slug: "privatenote-for-developers",
      publishedAt: at("privatenote-for-developers"),
      tags: JSON.stringify([t.blogTagDeveloper, t.blogTagIntegration, t.blogTagSecurity]),
      content: "",
      coverImage: null,
      published: true,
      createdAt: at("privatenote-for-developers"),
      updatedAt: at("privatenote-for-developers"),
    },
    {
      id: -4,
      title: t.blogPrivacyTitle,
      excerpt: t.blogPrivacyExcerpt,
      author: "PrivateNote.ai",
      slug: "privacy-tools",
      publishedAt: at("privacy-tools"),
      tags: JSON.stringify([t.blogTagPrivacy, t.blogTagTools, t.blogTagSecurity]),
      content: "",
      coverImage: null,
      published: true,
      createdAt: at("privacy-tools"),
      updatedAt: at("privacy-tools"),
    },
    {
      id: -1,
      title: t.blogGoodEnoughTitle,
      excerpt: t.blogGoodEnoughExcerpt,
      author: "PrivateNote.ai",
      slug: "myth-good-enough-security",
      publishedAt: at("myth-good-enough-security"),
      tags: JSON.stringify([t.blogTagSecurity, t.blogTagPrivacy, t.blogTagAuthentication]),
      content: "",
      coverImage: null,
      published: true,
      createdAt: at("myth-good-enough-security"),
      updatedAt: at("myth-good-enough-security"),
    },
    {
      id: -2,
      title: t.blogPasswordTitle,
      excerpt: t.blogPasswordExcerpt,
      author: "PrivateNote.ai",
      slug: "how-we-generate-passwords",
      publishedAt: at("how-we-generate-passwords"),
      tags: JSON.stringify([t.blogTagPasswords, t.blogTagSecurity, t.blogTagCryptography]),
      content: "",
      coverImage: null,
      published: true,
      createdAt: at("how-we-generate-passwords"),
      updatedAt: at("how-we-generate-passwords"),
    },
  ];
}

export function buildFeaturedBlogPost(t: Translations) {
  return {
    title: t.blogOneTimeLinksTitle,
    excerpt: t.blogOneTimeLinksExcerpt,
    author: "PrivateNote.ai",
    slug: "one-time-secret-links",
    publishedAt: STATIC_BLOG_PUBLISHED_AT["one-time-secret-links"],
    tags: [t.blogTagSecurity, t.blogTagPrivacy, t.blogTagCryptography],
  };
}
