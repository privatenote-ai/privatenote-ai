export type ChatControl10VoteConcern = {
  title: string;
  body: string;
};

export type ChatControl10VoteArticleCopy = {
  heroAlt: string;
  heroCaption: string;
  intro: string;
  voteEyebrow: string;
  voteHeadline: string;
  voteLabels: { against: string; for: string; abstentions: string };
  voteSummary: string;
  nonE2eChannels: string[];
  privacyConcerns: ChatControl10VoteConcern[];
  e2eeCalloutTitle: string;
  e2eeCalloutBody: string;
  sections: {
    whyPassed: { title: string; paragraphs: string[]; callout: string };
    whatItDoes: { title: string; paragraphs: string[] };
    privacyExperts: { title: string; intro: string };
    chatControl20: { title: string; paragraphs: string[] };
    privateNote: { title: string; paragraphs: string[] };
    debateContinues: { title: string; paragraphs: string[] };
  };
  ctaTitle: string;
  ctaBody: string;
  ctaButton: string;
};
