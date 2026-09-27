export type TitleBody = { title: string; body: string };

export type ChatControlCryptographersArticleCopy = {
  heroAlt: string;
  heroCaption: string;
  intro: string;
  updatePrefix: string;
  updateLink: string;
  updateSuffix: string;
  calloutTitle: string;
  calloutBody: string;
  expertEyebrow: string;
  expertTitle: string;
  expertParagraphs: string[];
  expertLinks: { preneel: string; sep2025: string; nov2025: string };
  technicalConcerns: TitleBody[];
  protectedGroups: string[];
  betterInvestments: TitleBody[];
  betterInvestmentEyebrow: string;
  betterInvestmentTitle: string;
  sections: {
    proposalReturns: { title: string; paragraphs: string[] };
    cryptographersObject: { title: string };
    e2eeScanning: { title: string; paragraphs: string[] };
    encryptionProtects: { title: string; intro: string };
    moreTech: { title: string; paragraphs: string[] };
    betterWays: { title: string; intro: string };
    privateNote: { title: string; paragraphs: string[] };
    policyReality: { title: string; paragraphs: string[] };
  };
  ctaTitle: string;
  ctaBody: string;
  ctaButton: string;
};
