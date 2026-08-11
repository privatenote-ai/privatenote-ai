import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import type { SupportedLanguage } from "@/utils/translation";
import { StaticBlogGuidePost } from "@/components/blog/StaticBlogGuidePost";
import { knowWhenSecretLinkOpenedEn } from "@/components/blog/locale/knowWhenSecretLinkOpened.en";
import type { BlogGuideArticleCopy } from "@/components/blog/locale/blogGuideArticle.types";

const heroImagePath = "/images/blog-know-when-secret-link-opened-hero.jpg";
const slug = "know-when-secret-link-opened";

const copy: Partial<Record<SupportedLanguage, BlogGuideArticleCopy>> & {
  en: BlogGuideArticleCopy;
} = {
  en: knowWhenSecretLinkOpenedEn,
};

export const KnowWhenSecretLinkOpenedPost: React.FC = () => {
  const { t } = useLanguage();
  return (
    <StaticBlogGuidePost
      slug={slug}
      heroImagePath={heroImagePath}
      copy={copy}
      title={t.blogKnowWhenSecretLinkOpenedTitle}
      subtitle={t.blogKnowWhenSecretLinkOpenedSubtitle}
      excerpt={t.blogKnowWhenSecretLinkOpenedExcerpt}
      ctaAppPath="/"
    />
  );
};
