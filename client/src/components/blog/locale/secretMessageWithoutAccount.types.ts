export type SecretMessageFlowStep = { title: string; body: string };

export type SecretMessageSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
  callout?: string;
  beforeFlowSteps?: string;
  flowSteps?: SecretMessageFlowStep[];
  afterFlowSteps?: string[];
};

export type SecretMessageArticleCopy = {
  intro: string[];
  sections: SecretMessageSection[];
  closingTitle: string;
  closingBody: string[];
  fileSharingNote: string;
  tagline: string;
  relatedReading: string;
  relatedPosts: { slug: string; blurb: string }[];
};
