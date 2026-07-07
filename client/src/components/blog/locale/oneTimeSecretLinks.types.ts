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
};

export type OneTimeSecretLinksArticleCopy = {
  intro: string[];
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
};
