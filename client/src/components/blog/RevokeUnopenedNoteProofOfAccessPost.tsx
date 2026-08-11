import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import type { SupportedLanguage } from "@/utils/translation";
import { StaticBlogGuidePost } from "@/components/blog/StaticBlogGuidePost";
import { revokeUnopenedNoteProofOfAccessEn } from "@/components/blog/locale/revokeUnopenedNoteProofOfAccess.en";
import type { BlogGuideArticleCopy } from "@/components/blog/locale/blogGuideArticle.types";

const heroImagePath = "/images/blog-revoke-proof-of-access-hero.jpg";
const slug = "revoke-unopened-note-proof-of-access";

const copy: Partial<Record<SupportedLanguage, BlogGuideArticleCopy>> & {
  en: BlogGuideArticleCopy;
} = {
  en: revokeUnopenedNoteProofOfAccessEn,
};

export const RevokeUnopenedNoteProofOfAccessPost: React.FC = () => {
  const { t } = useLanguage();
  return (
    <StaticBlogGuidePost
      slug={slug}
      heroImagePath={heroImagePath}
      copy={copy}
      title={t.blogRevokeUnopenedNoteProofOfAccessTitle}
      subtitle={t.blogRevokeUnopenedNoteProofOfAccessSubtitle}
      excerpt={t.blogRevokeUnopenedNoteProofOfAccessExcerpt}
      ctaAppPath="/"
    />
  );
};
