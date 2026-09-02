import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import type { SupportedLanguage } from "@/utils/translation";
import { StaticBlogGuidePost } from "@/components/blog/StaticBlogGuidePost";
import { howToSendNudesSafelyEn } from "@/components/blog/locale/howToSendNudesSafely.en";
import type { BlogGuideArticleCopy } from "@/components/blog/locale/blogGuideArticle.types";

const heroImagePath = "/images/blog-how-to-send-nudes-safely-hero.jpg";
const slug = "how-to-send-nudes-safely";

const copy: Partial<Record<SupportedLanguage, BlogGuideArticleCopy>> & {
  en: BlogGuideArticleCopy;
} = {
  en: howToSendNudesSafelyEn,
};

export const HowToSendNudesSafelyPost: React.FC = () => {
  const { t } = useLanguage();
  return (
    <StaticBlogGuidePost
      slug={slug}
      heroImagePath={heroImagePath}
      copy={copy}
      title={t.blogHowToSendNudesSafelyTitle}
      subtitle={t.blogHowToSendNudesSafelySubtitle}
      excerpt={t.blogHowToSendNudesSafelyExcerpt}
      ctaAppPath="/"
    />
  );
};
