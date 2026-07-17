export type PrivacyToolsGuideArticleCopy = {
  intro: string[];
  sections: Array<{
    title: string;
    paragraphs?: string[];
    calloutTitle?: string;
    callout?: string;
    midCta?: { body: string; button: string; href?: string };
    comparisonTable?: {
      headers: [string, string, string];
      rows: Array<[string, string, string]>;
      after?: string[];
    };
    useCaseTable?: {
      headers: [string, string];
      rows: Array<[string, string]>;
    };
    bullets?: string[];
    subsections?: Array<{
      title: string;
      paragraphs: string[];
      bullets?: string[];
    }>;
    faqs?: Array<{ question: string; answer: string }>;
  }>;
  ctaTitle: string;
  ctaBody: string;
  ctaButton: string;
  ctaSecondaryLabel?: string;
  ctaSecondaryHref?: string;
};
