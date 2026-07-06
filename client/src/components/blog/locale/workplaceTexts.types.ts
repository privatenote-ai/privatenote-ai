export type WorkplaceTextsArticleCopy = {
  sourceLabel: string;
  intro: string[];
  sections: Array<{ title: string; body: string[]; bullets?: string[] }>;
  ctaTitle: string;
  ctaBody: string;
  ctaButton: string;
};
