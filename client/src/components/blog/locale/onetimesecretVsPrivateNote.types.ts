export type OnetimesecretVsPrivateNoteArticleCopy = {
  intro: string[];
  sections: Array<{
    title: string;
    paragraphs?: string[];
    bullets?: string[];
    paragraphsAfterBullets?: string[];
    diagrams?: Array<{
      label: string;
      intro?: string;
      caption?: string;
      columns: Array<Array<{ text: string; via?: string }>>;
    }>;
    comparisonTable?: {
      lead?: string;
      headers: [string, string, string];
      rows: Array<[string, string, string]>;
    };
    paragraphsAfterTable?: string[];
    calloutTitle?: string;
    callout?: string;
    faqs?: Array<{ question: string; answer: string }>;
  }>;
  ctaTitle: string;
  ctaBody: string;
  ctaPrimary: string;
  ctaSecondary: string;
};
