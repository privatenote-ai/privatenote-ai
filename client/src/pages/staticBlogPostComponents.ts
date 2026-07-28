import { lazy, type ComponentType, type LazyExoticComponent } from "react";

function lazyPost(
  loader: () => Promise<{ [key: string]: ComponentType }>,
  exportName: string,
): LazyExoticComponent<ComponentType> {
  return lazy(() => loader().then((module) => ({ default: module[exportName] })));
}

/** One dynamic import per static article — avoids a single multi‑MB BlogPost chunk. */
export const STATIC_BLOG_POST_BY_SLUG: Record<string, LazyExoticComponent<ComponentType>> = {
  "privacy-tools": lazyPost(() => import("@/components/blog/PrivacyToolsPost"), "PrivacyToolsPost"),
  "how-to-share-api-key-securely": lazyPost(
    () => import("@/components/blog/ShareApiKeySecurelyPost"),
    "ShareApiKeySecurelyPost",
  ),
  "crypto-seed-phrase-one-time-link": lazyPost(
    () => import("@/components/blog/CryptoSeedPhraseOneTimeLinkPost"),
    "CryptoSeedPhraseOneTimeLinkPost",
  ),
  "why-email-is-worst-for-secrets": lazyPost(
    () => import("@/components/blog/EmailWorstForSecretsPost"),
    "EmailWorstForSecretsPost",
  ),
  "chat-control-1-0-vote-explained": lazyPost(
    () => import("@/components/blog/ChatControl10VoteExplainedPost"),
    "ChatControl10VoteExplainedPost",
  ),
  "chat-control-europe-cryptographers": lazyPost(
    () => import("@/components/blog/ChatControlCryptographersPost"),
    "ChatControlCryptographersPost",
  ),
  "myth-good-enough-security": lazyPost(
    () => import("@/components/blog/GoodEnoughSecurityPost"),
    "GoodEnoughSecurityPost",
  ),
  "how-we-generate-passwords": lazyPost(
    () => import("@/components/blog/PasswordGenerationPost"),
    "PasswordGenerationPost",
  ),
  "workplace-texts-private-note": lazyPost(
    () => import("@/components/blog/WorkplaceTextsPost"),
    "WorkplaceTextsPost",
  ),
  "privatenote-for-developers": lazyPost(
    () => import("@/components/blog/PrivateNoteForDevelopersPost"),
    "PrivateNoteForDevelopersPost",
  ),
  "privatenote-codex": lazyPost(
    () => import("@/components/blog/PrivateNoteCodexPost"),
    "PrivateNoteCodexPost",
  ),
  "securing-ai-agents-like-employees": lazyPost(
    () => import("@/components/blog/AgentSecurityPost"),
    "AgentSecurityPost",
  ),
  "one-time-secret-links": lazyPost(
    () => import("@/components/blog/OneTimeSecretLinksPost"),
    "OneTimeSecretLinksPost",
  ),
  "encrypted-vs-secure-file-sharing": lazyPost(
    () => import("@/components/blog/EncryptedVsSecureFileSharingPost"),
    "EncryptedVsSecureFileSharingPost",
  ),
  "send-secret-message-without-account": lazyPost(
    () => import("@/components/blog/SecretMessageWithoutAccountPost"),
    "SecretMessageWithoutAccountPost",
  ),
  "secrets-never-send-in-chat": lazyPost(
    () => import("@/components/blog/SecretsNeverSendInChatPost"),
    "SecretsNeverSendInChatPost",
  ),
  "what-is-end-to-end-encryption": lazyPost(
    () => import("@/components/blog/EndToEndEncryptionDefinitionPost"),
    "EndToEndEncryptionDefinitionPost",
  ),
  "how-to-make-a-private-note": lazyPost(
    () => import("@/components/blog/HowToMakeAPrivateNotePost"),
    "HowToMakeAPrivateNotePost",
  ),
  "introduction-to-private-ai": lazyPost(
    () => import("@/components/blog/IntroductionToPrivateAiPost"),
    "IntroductionToPrivateAiPost",
  ),
  "social-media-bans-children-evidence": lazyPost(
    () => import("@/components/blog/SocialMediaBansChildrenPost"),
    "SocialMediaBansChildrenPost",
  ),
  "how-to-share-a-password-securely": lazyPost(
    () => import("@/components/blog/SharePasswordSecurelyPost"),
    "SharePasswordSecurelyPost",
  ),
  "secrets-in-cicd-env-github-leaks": lazyPost(
    () => import("@/components/blog/CicdEnvGithubSecretsPost"),
    "CicdEnvGithubSecretsPost",
  ),
  "send-sensitive-documents-securely": lazyPost(
    () => import("@/components/blog/SendSensitiveDocumentsSecurelyPost"),
    "SendSensitiveDocumentsSecurelyPost",
  ),
  "how-to-share-ssh-keys-securely": lazyPost(
    () => import("@/components/blog/ShareSshKeysSecurelyPost"),
    "ShareSshKeysSecurelyPost",
  ),
  "android-iphone-rcs-end-to-end-encryption": lazyPost(
    () => import("@/components/blog/RcsE2eEncryptionPost"),
    "RcsE2eEncryptionPost",
  ),
  "google-drive-vs-one-time-encrypted-links": lazyPost(
    () => import("@/components/blog/GoogleDriveVsOneTimeEncryptedLinksPost"),
    "GoogleDriveVsOneTimeEncryptedLinksPost",
  ),
  "common-secret-handling-mistakes": lazyPost(
    () => import("@/components/blog/CommonSecretHandlingMistakesPost"),
    "CommonSecretHandlingMistakesPost",
  ),
};
