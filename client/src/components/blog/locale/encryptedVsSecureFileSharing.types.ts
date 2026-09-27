export type EncryptedFileSharingSection = {
  title: string;
  level?: "primary" | "secondary";
  paragraphs: string[];
  bullets?: string[];
  callout?: string;
  flow?: "tls" | "browser";
};

export type EncryptedFileSharingArticleCopy = {
  intro: string[];
  sections: EncryptedFileSharingSection[];
  closingTitle: string;
  closingBody: string;
  ctaLabel: string;
  relatedReading: string;
};
