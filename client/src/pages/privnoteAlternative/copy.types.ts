export type PrivnoteAlternativeFaqItem = {
  question: string;
  answer: string;
};

export type ComparisonAvailability = "yes" | "no" | "paid";

export type PrivnoteAlternativeComparisonRow = {
  feature: string;
  privnote: ComparisonAvailability;
  privatenote: ComparisonAvailability;
  privatenoteNote?: string;
};

export type PrivnoteAlternativeCopy = {
  breadcrumbCurrent: string;
  eyebrow: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroBody: string;
  primaryCta: string;
  secondaryCta: string;
  trustLine: string;

  introHeading: string;
  introBody: string;
  introBody2: string;

  compareHeading: string;
  compareIntro: string;
  compareFeatureColumn: string;
  comparePrivnoteColumn: string;
  comparePrivateNoteColumn: string;
  compareYes: string;
  compareNo: string;
  comparePaid: string;
  compareRows: PrivnoteAlternativeComparisonRow[];
  compareFootnote: string;
  compareCta: string;

  whyHeading: string;
  whyBody: string;
  whyBody2: string;
  whyClose: string;

  passwordHeading: string;
  passwordBody: string;
  passwordBody2: string;
  passwordCta: string;
  passwordArticleLink: string;

  filesHeading: string;
  filesBody: string;
  filesBody2: string;
  filesLimits: string;
  filesCta: string;
  filesArticleLink: string;

  mediaHeading: string;
  mediaBody: string;
  mediaBody2: string;
  mediaPhotoLink: string;
  mediaVoiceLink: string;

  businessHeading: string;
  businessBody: string;
  businessScenarios: string[];
  businessBody2: string;
  businessCta: string;
  businessNotifyLink: string;
  businessVerifyLink: string;

  securityHeading: string;
  securityBody: string;
  securityArchitecture: string;
  securityRecipient: string;
  securityLimitation: string;
  securityFlowWrite: string;
  securityFlowEncrypt: string;
  securityFlowCiphertext: string;
  securityFlowShare: string;
  securityFlowDecrypt: string;
  securityEncryptionLink: string;
  securityHowItWorksLink: string;
  founderHeading: string;
  founderBody: string;
  founderLink: string;

  decideHeading: string;
  decidePrivnoteTitle: string;
  decidePrivnoteItems: string[];
  decidePrivateNoteTitle: string;
  decidePrivateNoteItems: string[];
  decideOneTimeLink: string;
  decideDevelopersLink: string;

  faqHeading: string;
  faqs: PrivnoteAlternativeFaqItem[];

  finalHeading: string;
  finalBody: string;
  finalPrimaryCta: string;
  finalSecondaryCta: string;
  finalTrust: string;
};
