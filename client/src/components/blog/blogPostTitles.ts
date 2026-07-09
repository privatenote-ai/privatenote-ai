import type { Translations } from "@/utils/translations/types";
import type { BlogCanonicalSlug } from "@shared/localizedBlogSlugs";
import type { BlogTrustPath } from "@shared/blogPostCrossLinks";

const BLOG_TITLE_KEY_BY_SLUG: Record<BlogCanonicalSlug, keyof Translations> = {
  "chat-control-1-0-vote-explained": "blogChatControl10VoteTitle",
  "chat-control-europe-cryptographers": "blogChatControlTitle",
  "how-to-share-api-key-securely": "blogApiKeySharingTitle",
  "what-is-end-to-end-encryption": "blogE2eeDefinitionTitle",
  "secrets-never-send-in-chat": "blogChatSecretsTitle",
  "send-secret-message-without-account": "blogSecretNoAccountTitle",
  "encrypted-vs-secure-file-sharing": "blogEncryptedFileSharingTitle",
  "one-time-secret-links": "blogOneTimeLinksTitle",
  "securing-ai-agents-like-employees": "blogAgentSecurityTitle",
  "privatenote-codex": "blogCodexTitle",
  "privatenote-for-developers": "blogDevelopersTitle",
  "privacy-tools": "blogPrivacyTitle",
  "myth-good-enough-security": "blogGoodEnoughTitle",
  "how-we-generate-passwords": "blogPasswordTitle",
  "workplace-texts-private-note": "blogWorkplaceTextsTitle",
};

export function blogPostTitleForSlug(slug: BlogCanonicalSlug, t: Translations): string {
  const key = BLOG_TITLE_KEY_BY_SLUG[slug];
  return t[key] ?? slug;
}

export function blogTrustLabel(path: BlogTrustPath, t: Translations): string {
  switch (path) {
    case "/security-resources":
      return `${t.securityHeroPrefix} ${t.securityHeroAccent}`;
    case "/privacy":
      return t.privacyPolicy;
    case "/how-it-works":
      return t.howItWorks;
    case "/about":
      return t.about;
    case "/terms":
      return t.termsOfUse;
    case "/security-guides/password":
      return t.documentMetaSecurityGuideTitle;
  }
}
