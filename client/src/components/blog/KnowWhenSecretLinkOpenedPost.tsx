import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import type { SupportedLanguage } from "@/utils/translation";
import { StaticBlogGuidePost } from "@/components/blog/StaticBlogGuidePost";
import { knowWhenSecretLinkOpenedDe } from "@/components/blog/locale/knowWhenSecretLinkOpened.de";
import { knowWhenSecretLinkOpenedEn } from "@/components/blog/locale/knowWhenSecretLinkOpened.en";
import { knowWhenSecretLinkOpenedEs } from "@/components/blog/locale/knowWhenSecretLinkOpened.es";
import { knowWhenSecretLinkOpenedFr } from "@/components/blog/locale/knowWhenSecretLinkOpened.fr";
import { knowWhenSecretLinkOpenedHr } from "@/components/blog/locale/knowWhenSecretLinkOpened.hr";
import { knowWhenSecretLinkOpenedIt } from "@/components/blog/locale/knowWhenSecretLinkOpened.it";
import { knowWhenSecretLinkOpenedNl } from "@/components/blog/locale/knowWhenSecretLinkOpened.nl";
import { knowWhenSecretLinkOpenedPt } from "@/components/blog/locale/knowWhenSecretLinkOpened.pt";
import { knowWhenSecretLinkOpenedSr } from "@/components/blog/locale/knowWhenSecretLinkOpened.sr";
import type { BlogGuideArticleCopy } from "@/components/blog/locale/blogGuideArticle.types";

const heroImagePath = "/images/blog-know-when-secret-link-opened-hero.jpg";
const slug = "know-when-secret-link-opened";

const copy: Partial<Record<SupportedLanguage, BlogGuideArticleCopy>> & {
  en: BlogGuideArticleCopy;
} = {
  en: knowWhenSecretLinkOpenedEn,
  de: knowWhenSecretLinkOpenedDe,
  fr: knowWhenSecretLinkOpenedFr,
  es: knowWhenSecretLinkOpenedEs,
  it: knowWhenSecretLinkOpenedIt,
  nl: knowWhenSecretLinkOpenedNl,
  pt: knowWhenSecretLinkOpenedPt,
  sr: knowWhenSecretLinkOpenedSr,
  hr: knowWhenSecretLinkOpenedHr,
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
