export type RcsE2eEncryptionArticleCopy = {
  heroAlt: string;
  heroCaption: string;
  intro: string[];
  sections: Array<{
    title: string;
    paragraphs?: string[];
    callout?: string;
    faqs?: Array<{ question: string; answer: string }>;
  }>;
  referencesTitle: string;
  references: Array<{ label: string; href: string }>;
  ctaTitle: string;
  ctaBody: string;
  ctaButton: string;
};
