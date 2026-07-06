export type PrivateNoteCodexSectionLink = { label: string; href: string };

export type PrivateNoteCodexSection = {
  title: string;
  body: string[];
  bullets?: string[];
  code?: string;
  codeLabel?: string;
  links?: PrivateNoteCodexSectionLink[];
};

export type PrivateNoteCodexArticleCopy = {
  intro: string[];
  sections: PrivateNoteCodexSection[];
  ctaTitle: string;
  ctaBody: string;
  ctaButton: string;
};
