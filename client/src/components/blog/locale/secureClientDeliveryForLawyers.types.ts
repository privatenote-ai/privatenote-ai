export type SecureClientDeliveryForLawyersArticleCopy = {
  /** Optional hero kicker; replaces the default privacy/security pills. */
  heroKicker?: string;
  intro: string[];
  sections: Array<{
    title: string;
    paragraphs?: string[];
    bullets?: string[];
    paragraphsAfterBullets?: string[];
    comparisonTable?: {
      headers: [string, string, string];
      rows: Array<[string, string, string]>;
    };
    paragraphsAfterTable?: string[];
    midCta?: { body: string; button: string };
    orderedIntro?: string;
    ordered?: string[];
    paragraphsAfterOrdered?: string[];
    faqs?: Array<{ question: string; answer: string }>;
  }>;
  ctaTitle: string;
  ctaBody: string;
  ctaPrimary: string;
  ctaSecondary: string;
};
