export type HowToSharePhotosSecurelyArticleCopy = {
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
    checklist?: string[];
    paragraphsAfterChecklist?: string[];
    midCta?: {
      body: string;
      button: string;
    };
    comparisonTable?: {
      headers: string[];
      rows: string[][];
      after?: string[];
    };
    paragraphsAfterTable?: string[];
    faqs?: Array<{ question: string; answer: string }>;
  }>;
  ctaTitle: string;
  ctaBody: string;
  ctaButton: string;
};
