export type SecretsNeverSendInChatCheatSheetRow = {
  neverSend: string;
  risk: string;
  better: string;
};

export type SecretsNeverSendInChatSecretEntry = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
  instead: string;
};

export type SecretsNeverSendInChatFaqEntry = {
  question: string;
  answer: string;
};

export type SecretsNeverSendInChatArticleCopy = {
  intro: string[];
  chatScreenshotCaption: string;
  cheatSheetTitle: string;
  cheatSheetHeaders: [string, string, string];
  cheatSheetRows: SecretsNeverSendInChatCheatSheetRow[];
  whyChatTitle: string;
  whyChatParagraphs: string[];
  lifetimeTitle: string;
  lifetimeIntro: string;
  chatWorkflowLabel: string;
  chatWorkflowSteps: string[];
  chatWorkflowOutcome: string;
  privateNoteWorkflowLabel: string;
  privateNoteWorkflowSteps: string[];
  privateNoteWorkflowOutcome: string;
  secretsTitle: string;
  secrets: SecretsNeverSendInChatSecretEntry[];
  lifespanTitle: string;
  lifespanParagraphs: string[];
  lifespanBullets: string[];
  underHoodTitle: string;
  underHoodParagraphs: string[];
  faqTitle: string;
  faq: SecretsNeverSendInChatFaqEntry[];
  referencesTitle: string;
  references: string[];
  closingTitle: string;
  closingBody: string[];
  tagline: string;
  relatedReading: string;
  relatedPosts: { slug: string; blurb: string }[];
};
