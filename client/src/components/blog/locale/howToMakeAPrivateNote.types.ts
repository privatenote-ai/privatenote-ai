export type PrivateNoteFlowStep = {
  step: string;
  title: string;
  body: string;
};

export type PrivateNoteTableRow = {
  dataType: string;
  scenario: string;
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
  table?: PrivateNoteTableRow[];
};

export type HowToMakeAPrivateNoteArticleCopy = {
  heroAlt: string;
  intro: string[];
  sections: PrivateNoteSection[];
  tableHeaders: {
    dataType: string;
    scenario: string;
  };
  closingTitle: string;
  closingBody: string[];
  fileSharingNote: string;
  chromeExtensionNote: string;
  tagline: string;
  relatedReading: string;
  relatedPosts: { slug: string; blurb: string }[];
};
