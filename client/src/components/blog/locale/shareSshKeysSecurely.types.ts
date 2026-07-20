export type ShareSshKeysSecurelyFlowStep = {
  step: string;
  title: string;
  body: string;
};

export type ShareSshKeysSecurelyArticleCopy = {
  heroAlt: string;
  heroCaption: string;
  intro: string[];
  sections: Array<{
    title: string;
    paragraphs?: string[];
    calloutTitle?: string;
    callout?: string;
    midCta?: { body: string; button: string };
    flowIntro?: string;
    flowSteps?: ShareSshKeysSecurelyFlowStep[];
    comparisonTable?: {
      headers: [string, string, string];
      rows: Array<[string, string, string]>;
      after?: string[];
    };
    useCaseTable?: {
      headers: [string, string];
      rows: Array<[string, string]>;
    };
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
