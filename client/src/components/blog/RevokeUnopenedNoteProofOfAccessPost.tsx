import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import type { SupportedLanguage } from "@/utils/translation";
import { StaticBlogGuidePost } from "@/components/blog/StaticBlogGuidePost";
import { revokeUnopenedNoteProofOfAccessDe } from "@/components/blog/locale/revokeUnopenedNoteProofOfAccess.de";
import { revokeUnopenedNoteProofOfAccessEn } from "@/components/blog/locale/revokeUnopenedNoteProofOfAccess.en";
import { revokeUnopenedNoteProofOfAccessEs } from "@/components/blog/locale/revokeUnopenedNoteProofOfAccess.es";
import { revokeUnopenedNoteProofOfAccessFr } from "@/components/blog/locale/revokeUnopenedNoteProofOfAccess.fr";
import { revokeUnopenedNoteProofOfAccessHr } from "@/components/blog/locale/revokeUnopenedNoteProofOfAccess.hr";
import { revokeUnopenedNoteProofOfAccessIt } from "@/components/blog/locale/revokeUnopenedNoteProofOfAccess.it";
import { revokeUnopenedNoteProofOfAccessNl } from "@/components/blog/locale/revokeUnopenedNoteProofOfAccess.nl";
import { revokeUnopenedNoteProofOfAccessPt } from "@/components/blog/locale/revokeUnopenedNoteProofOfAccess.pt";
import { revokeUnopenedNoteProofOfAccessSr } from "@/components/blog/locale/revokeUnopenedNoteProofOfAccess.sr";
import type { BlogGuideArticleCopy } from "@/components/blog/locale/blogGuideArticle.types";

const heroImagePath = "/images/blog-revoke-proof-of-access-hero.jpg";
const slug = "revoke-unopened-note-proof-of-access";

const copy: Partial<Record<SupportedLanguage, BlogGuideArticleCopy>> & {
  en: BlogGuideArticleCopy;
} = {
  en: revokeUnopenedNoteProofOfAccessEn,
  de: revokeUnopenedNoteProofOfAccessDe,
  fr: revokeUnopenedNoteProofOfAccessFr,
  es: revokeUnopenedNoteProofOfAccessEs,
  it: revokeUnopenedNoteProofOfAccessIt,
  nl: revokeUnopenedNoteProofOfAccessNl,
  pt: revokeUnopenedNoteProofOfAccessPt,
  sr: revokeUnopenedNoteProofOfAccessSr,
  hr: revokeUnopenedNoteProofOfAccessHr,
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
