export type SocialMediaBansChildrenArticleCopy = {
  heroAlt: string;
  heroCaption: string;
  intro: string[];
  sections: Array<{
    title: string;
    paragraphs: string[];
    bullets?: string[];
    callout?: string;
  }>;
  preneelEyebrow: string;
  preneelTitle: string;
  preneelParagraphs: string[];
  preneelVideoLabel: string;
  preneelReportLabel: string;
  referencesTitle: string;
  references: Array<{ label: string; href: string }>;
  closingTitle: string;
  closingParagraphs: string[];
  ctaTitle: string;
  ctaBody: string;
  ctaButton: string;
};
