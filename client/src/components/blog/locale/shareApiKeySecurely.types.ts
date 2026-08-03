export type TitleBody = { title: string; body: string };

export type HandoffStep = { key: "scope" | "encrypt" | "send" | "revoke"; label: string; detail: string };

export type FaqItem = { question: string; answer: string };

export type ShareApiKeyArticleCopy = {
  heroAlt: string;
  heroCaption: string;
  takeawaysHeading: string;
  takeaways: string[];
  intro: string;
  sections: {
    treatLikePasswords: { title: string; paragraphs: string[] };
    neverPaste: { title: string; intro: string; avoidHeading: string };
    whereLeak: { title: string; intro: string };
    beforeShare: { title: string; intro: string; newKeyTitle: string; newKeyBefore: string; newKeyLink: string; newKeyAfter: string };
    highRisk: {
      title: string;
      p1: string;
      p2: string;
      calloutHeading: string;
      ageBullet: string;
      opensslBullet: string;
      separateChannelBullet: string;
      outro: string;
    };
    handoff: { title: string; intro: string; diagramCaption: string; diagramFootnote: string };
    privateNote: {
      title: string;
      p1: string;
      relatedSsh: string;
      p2: string;
      urlExample: string;
      bullet1: string;
      bullet2: string;
      bullet3: string;
      p3: string;
    };
    faq: { title: string };
    bottomLine: { title: string; body: string };
  };
  avoidChannels: string[];
  leakSources: TitleBody[];
  prepSteps: TitleBody[];
  handoffSteps: HandoffStep[];
  faqs: FaqItem[];
  ctaTitle: string;
  ctaBody: string;
  ctaButton: string;
};
