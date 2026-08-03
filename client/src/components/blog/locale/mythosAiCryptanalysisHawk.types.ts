export type MythosAiCryptanalysisHawkArticleCopy = {
  heroAlt: string;
  heroCaption: string;
  intro: string[];
  sections: Array<{
    title: string;
    takeaway?: string;
    paragraphs?: string[];
    bullets?: string[];
    calloutTitle?: string;
    callout?: string;
    /** Rendered after the section callout (e.g. follow-on expert commentary). */
    paragraphsAfterCallout?: string[];
    faqs?: Array<{ question: string; answer: string }>;
  }>;
  ctaTitle: string;
  ctaBody: string;
  ctaButton: string;
};
