import type { Translations } from "@/utils/translations/types";
import type { BlogCanonicalSlug } from "@shared/localizedBlogSlugs";
import type { BlogTrustPath } from "@shared/blogPostCrossLinks";

const BLOG_TITLE_KEY_BY_SLUG: Record<BlogCanonicalSlug, keyof Translations> = {
  "introduction-to-private-ai": "blogIntroductionPrivateAiTitle",
  "how-to-make-a-private-note": "blogMakePrivateNoteTitle",
  "crypto-seed-phrase-one-time-link": "blogCryptoSeedTitle",
  "why-email-is-worst-for-secrets": "blogEmailSecretsTitle",
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
  "social-media-bans-children-evidence": "blogSocialMediaBansTitle",
  "how-to-share-a-password-securely": "blogSharePasswordSecurelyTitle",
  "secrets-in-cicd-env-github-leaks": "blogCicdEnvGithubSecretsTitle",
  "send-sensitive-documents-securely": "blogSendSensitiveDocumentsTitle",
  "how-to-share-ssh-keys-securely": "blogShareSshKeysSecurelyTitle",
  "android-iphone-rcs-end-to-end-encryption": "blogRcsE2eEncryptionTitle",
  "google-drive-vs-one-time-encrypted-links": "blogGoogleDriveVsOneTimeLinksTitle",
  "common-secret-handling-mistakes": "blogCommonSecretHandlingMistakesTitle",
  "mythos-ai-cryptanalysis-hawk": "blogMythosAiCryptanalysisHawkTitle",
  "how-to-share-photos-securely": "blogHowToSharePhotosSecurelyTitle",
  "how-to-send-encrypted-voice-message": "blogEncryptedVoiceMessageTitle",
  "recipient-verification-code-before-reveal": "blogRecipientVerificationCodeTitle",
  "click-to-reveal-private-notes": "blogClickToRevealPrivateNotesTitle",
  "know-when-secret-link-opened": "blogKnowWhenSecretLinkOpenedTitle",
  "revoke-unopened-note-proof-of-access": "blogRevokeUnopenedNoteProofOfAccessTitle",
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
