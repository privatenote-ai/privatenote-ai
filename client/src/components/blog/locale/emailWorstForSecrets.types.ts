export type EmailWorstForSecretsSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
  callout?: string;
};

export type EmailWorstForSecretsArticleCopy = {
  heroAlt: string;
  intro: string;
  calloutTitle: string;
  calloutBody: string;
  emailCopies: string[];
  agedSecretsExamples: string[];
  forwardingPaths: string[];
  aiProcessingUses: string[];
  oneTimeSecretExamples: string[];
  oneTimeBenefits: string[];
  sections: EmailWorstForSecretsSection[];
  ctaTitle: string;
  ctaBody: string;
  ctaButton: string;
};
