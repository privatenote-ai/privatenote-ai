export type OneTimeSecretLinksBulletItem = {
  label: string;
  body: string;
};

export type OneTimeSecretLinksFlowStep = {
  title: string;
  step: string;
  body: string;
};

export type OneTimeSecretLinksTableRow = {
  channel: string;
  encrypted: string;
  persistent: string;
  verdict: string;
};

export type OneTimeSecretLinksFaq = {
  question: string;
  answer: string;
};

export type OneTimeSecretLinksSection = {
  title: string;
  paragraphs: string[];
  bullets?: OneTimeSecretLinksBulletItem[];
  callout?: string;
  chromeExtensionCta?: string;
  beforeFlowSteps?: string;
  flowSteps?: OneTimeSecretLinksFlowStep[];
  afterFlowSteps?: string[];
  table?: OneTimeSecretLinksTableRow[];
  goodFits?: string[];
  poorFits?: string[];
  subsections?: Array<{ title: string; paragraphs: string[] }>;
  numberedSteps?: Array<{ title: string; body: string }>;
  checklist?: string[];
  closingNote?: string;
  midCta?: { body: string; button: string };
  faqs?: OneTimeSecretLinksFaq[];
  comparisonTable?: { headers: string[]; rows: string[][] };
};

export type OneTimeSecretLinksArticleCopy = {
  intro: string[];
  earlyCta?: { body: string; linkLabel: string };
  sections: OneTimeSecretLinksSection[];
  tableHeaders: {
    channel: string;
    encrypted: string;
    persistent: string;
    verdict: string;
  };
  goodFitsLabel: string;
  poorFitsLabel: string;
  closingTitle: string;
  closingBody: string;
  encryptLu: string;
  tagline: string;
  relatedReading: string;
  ctaTitle?: string;
  ctaBody?: string;
  ctaButton?: string;
};
