import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import type { SupportedLanguage } from "@/utils/translation";
import { StaticBlogGuidePost } from "@/components/blog/StaticBlogGuidePost";
import { clickToRevealPrivateNotesDe } from "@/components/blog/locale/clickToRevealPrivateNotes.de";
import { clickToRevealPrivateNotesEn } from "@/components/blog/locale/clickToRevealPrivateNotes.en";
import { clickToRevealPrivateNotesEs } from "@/components/blog/locale/clickToRevealPrivateNotes.es";
import { clickToRevealPrivateNotesFr } from "@/components/blog/locale/clickToRevealPrivateNotes.fr";
import { clickToRevealPrivateNotesHr } from "@/components/blog/locale/clickToRevealPrivateNotes.hr";
import { clickToRevealPrivateNotesIt } from "@/components/blog/locale/clickToRevealPrivateNotes.it";
import { clickToRevealPrivateNotesNl } from "@/components/blog/locale/clickToRevealPrivateNotes.nl";
import { clickToRevealPrivateNotesPt } from "@/components/blog/locale/clickToRevealPrivateNotes.pt";
import { clickToRevealPrivateNotesSr } from "@/components/blog/locale/clickToRevealPrivateNotes.sr";
import type { BlogGuideArticleCopy } from "@/components/blog/locale/blogGuideArticle.types";

const heroImagePath = "/images/blog-click-to-reveal-hero.jpg";
const slug = "click-to-reveal-private-notes";

const copy: Partial<Record<SupportedLanguage, BlogGuideArticleCopy>> & {
  en: BlogGuideArticleCopy;
} = {
  en: clickToRevealPrivateNotesEn,
  de: clickToRevealPrivateNotesDe,
  fr: clickToRevealPrivateNotesFr,
  es: clickToRevealPrivateNotesEs,
  it: clickToRevealPrivateNotesIt,
  nl: clickToRevealPrivateNotesNl,
  pt: clickToRevealPrivateNotesPt,
  sr: clickToRevealPrivateNotesSr,
  hr: clickToRevealPrivateNotesHr,
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
