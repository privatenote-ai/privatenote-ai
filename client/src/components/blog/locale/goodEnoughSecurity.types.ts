export type GoodEnoughSecuritySection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
  ordered?: string[];
};

export type GoodEnoughSecurityArticleCopy = {
  intro: string[];
  sections: GoodEnoughSecuritySection[];
};
