export type LabelBody = { label: string; body: string };

export type CryptoSeedArticleCopy = {
  heroAlt: string;
  intro: string[];
  ruleTitle: string;
  ruleParagraphs: string[];
  offlineAlternatives: LabelBody[];
  seedPhraseTraits: LabelBody[];
  oneTimeLinkFit: string[];
  localEncryptFirst: string[];
  philosophySteps: string[];
  sections: {
    sendAtAll: { title: string; question: string; outro: string };
    different: { title: string; p1: string; listIntro: string; outro: string };
    browserEncryption: { title: string; paragraphs: string[] };
    encryptLocal: { title: string; intro: string; outro: string; callout: string };
    whichTool: { title: string; age: string; gnupg: string; openssl: string };
    ageExample: {
      title: string;
      passphraseTitle: string;
      passphraseBefore: string;
      passphraseLink: string;
      passphraseAfter: string;
      p1: string;
      p2: string;
      docsLabel: string;
    };
    separateChannels: { title: string; intro: string; steps: string[]; outro: string };
    recommend: {
      title: string;
      intro: string;
      oneTimeTitle: string;
      oneTimeSubtitle: string;
      localTitle: string;
      localSubtitle: string;
      outro: string;
    };
    matchTool: { title: string; body: string };
    philosophy: { title: string; p1: string; listIntro: string; closingQuote: string };
  };
  ctaTitle: string;
  ctaBody: string;
  ctaButton: string;
};
