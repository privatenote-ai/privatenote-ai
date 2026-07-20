export type SendSensitiveDocumentsSecurelyFlowStep = {
  step: string;
  title: string;
  body: string;
};

export type SendSensitiveDocumentsSecurelyArticleCopy = {
  heroAlt: string;
  heroCaption: string;
  intro: string[];
  sections: Array<{
    title: string;
    takeaway?: string;
    paragraphs?: string[];
    calloutTitle?: string;
    callout?: string;
    midCta?: { body: string; button: string };
    flowIntro?: string;
    flowSteps?: SendSensitiveDocumentsSecurelyFlowStep[];
    checklist?: string[];
    paragraphsAfterChecklist?: string[];
    comparisonTable?: {
      headers: [string, string, string];
      rows: Array<[string, string, string]>;
      after?: string[];
    };
    useCaseTable?: {
      headers: [string, string];
      rows: Array<[string, string]>;
    };
    paragraphsAfterTable?: string[];
    subsections?: Array<{
      title: string;
      paragraphs: string[];
    }>;
    faqs?: Array<{ question: string; answer: string }>;
  }>;
  ctaTitle: string;
  ctaBody: string;
  ctaButton: string;
};
