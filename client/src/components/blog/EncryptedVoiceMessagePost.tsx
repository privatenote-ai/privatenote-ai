import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import type { SupportedLanguage } from "@/utils/translation";
import { StaticBlogGuidePost } from "@/components/blog/StaticBlogGuidePost";
import { encryptedVoiceMessageEn } from "@/components/blog/locale/encryptedVoiceMessage.en";
import type { BlogGuideArticleCopy } from "@/components/blog/locale/blogGuideArticle.types";

const heroImagePath = "/images/blog-encrypted-voice-message-hero.jpg";
const slug = "how-to-send-encrypted-voice-message";

const copy: Partial<Record<SupportedLanguage, BlogGuideArticleCopy>> & {
  en: BlogGuideArticleCopy;
} = {
  en: encryptedVoiceMessageEn,
};

export const EncryptedVoiceMessagePost: React.FC = () => {
  const { t } = useLanguage();
  return (
    <StaticBlogGuidePost
      slug={slug}
      heroImagePath={heroImagePath}
      copy={copy}
      title={t.blogEncryptedVoiceMessageTitle}
      subtitle={t.blogEncryptedVoiceMessageSubtitle}
      excerpt={t.blogEncryptedVoiceMessageExcerpt}
      ctaAppPath="/"
    />
  );
};
