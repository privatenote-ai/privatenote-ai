import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import type { SupportedLanguage } from "@/utils/translation";
import { StaticBlogGuidePost } from "@/components/blog/StaticBlogGuidePost";
import { recipientVerificationCodeEn } from "@/components/blog/locale/recipientVerificationCode.en";
import type { BlogGuideArticleCopy } from "@/components/blog/locale/blogGuideArticle.types";

const heroImagePath = "/images/blog-recipient-verification-code-hero.jpg";
const slug = "recipient-verification-code-before-reveal";

const copy: Partial<Record<SupportedLanguage, BlogGuideArticleCopy>> & {
  en: BlogGuideArticleCopy;
} = {
  en: recipientVerificationCodeEn,
};

export const RecipientVerificationCodePost: React.FC = () => {
  const { t } = useLanguage();
  return (
    <StaticBlogGuidePost
      slug={slug}
      heroImagePath={heroImagePath}
      copy={copy}
      title={t.blogRecipientVerificationCodeTitle}
      subtitle={t.blogRecipientVerificationCodeSubtitle}
      excerpt={t.blogRecipientVerificationCodeExcerpt}
      ctaAppPath="/"
    />
  );
};
