export type CommonSecretHandlingMistakesArticleCopy = {
  heroAlt: string;
  heroCaption: string;
  intro: string[];
  sections: Array<{
    title: string;
    takeaway?: string;
    paragraphs?: string[];
    calloutTitle?: string;
    callout?: string;
    checklist?: string[];
    paragraphsAfterChecklist?: string[];
    comparisonTable?: {
      headers: [string, string, string];
      rows: Array<[string, string, string]>;
      after?: string[];
    };
    paragraphsAfterTable?: string[];
    faqs?: Array<{ question: string; answer: string }>;
  }>;
  ctaTitle: string;
  ctaBody: string;
  ctaButton: string;
};
