import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import type { SupportedLanguage } from "@/utils/translation";
import { StaticBlogGuidePost } from "@/components/blog/StaticBlogGuidePost";
import { clickToRevealPrivateNotesEn } from "@/components/blog/locale/clickToRevealPrivateNotes.en";
import type { BlogGuideArticleCopy } from "@/components/blog/locale/blogGuideArticle.types";

const heroImagePath = "/images/blog-click-to-reveal-hero.jpg";
const slug = "click-to-reveal-private-notes";

const copy: Partial<Record<SupportedLanguage, BlogGuideArticleCopy>> & {
  en: BlogGuideArticleCopy;
} = {
  en: clickToRevealPrivateNotesEn,
};

export const ClickToRevealPrivateNotesPost: React.FC = () => {
  const { t } = useLanguage();
  return (
    <StaticBlogGuidePost
      slug={slug}
      heroImagePath={heroImagePath}
      copy={copy}
      title={t.blogClickToRevealPrivateNotesTitle}
      subtitle={t.blogClickToRevealPrivateNotesSubtitle}
      excerpt={t.blogClickToRevealPrivateNotesExcerpt}
      ctaAppPath="/"
    />
  );
};
