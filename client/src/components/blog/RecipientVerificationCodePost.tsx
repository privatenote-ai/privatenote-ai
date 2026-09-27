import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import type { SupportedLanguage } from "@/utils/translation";
import { StaticBlogGuidePost } from "@/components/blog/StaticBlogGuidePost";
import { recipientVerificationCodeDe } from "@/components/blog/locale/recipientVerificationCode.de";
import { recipientVerificationCodeEn } from "@/components/blog/locale/recipientVerificationCode.en";
import { recipientVerificationCodeEs } from "@/components/blog/locale/recipientVerificationCode.es";
import { recipientVerificationCodeFr } from "@/components/blog/locale/recipientVerificationCode.fr";
import { recipientVerificationCodeHr } from "@/components/blog/locale/recipientVerificationCode.hr";
import { recipientVerificationCodeIt } from "@/components/blog/locale/recipientVerificationCode.it";
import { recipientVerificationCodeNl } from "@/components/blog/locale/recipientVerificationCode.nl";
import { recipientVerificationCodePt } from "@/components/blog/locale/recipientVerificationCode.pt";
import { recipientVerificationCodeSr } from "@/components/blog/locale/recipientVerificationCode.sr";
import type { BlogGuideArticleCopy } from "@/components/blog/locale/blogGuideArticle.types";

const heroImagePath = "/images/blog-recipient-verification-code-hero.jpg";
const slug = "recipient-verification-code-before-reveal";

const copy: Partial<Record<SupportedLanguage, BlogGuideArticleCopy>> & {
  en: BlogGuideArticleCopy;
} = {
  en: recipientVerificationCodeEn,
  de: recipientVerificationCodeDe,
  fr: recipientVerificationCodeFr,
  es: recipientVerificationCodeEs,
  it: recipientVerificationCodeIt,
  nl: recipientVerificationCodeNl,
  pt: recipientVerificationCodePt,
  sr: recipientVerificationCodeSr,
  hr: recipientVerificationCodeHr,
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
