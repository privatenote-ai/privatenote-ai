export type PrivateNoteFlowStep = {
  step: string;
  title: string;
  body: string;
};

export type PrivateNoteSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
  callout?: string;
  beforeFlowSteps?: string;
  flowSteps?: PrivateNoteFlowStep[];
  flowDiagramCaption?: string;
  afterFlowSteps?: string[];
};

export type IntroductionToPrivateAiArticleCopy = {
  heroAlt: string;
  intro: string[];
  sections: PrivateNoteSection[];
  closingTitle: string;
  closingBody: string[];
  fileSharingNote: string;
  tagline: string;
  relatedReading: string;
  relatedPosts: { slug: string; blurb: string }[];
};
