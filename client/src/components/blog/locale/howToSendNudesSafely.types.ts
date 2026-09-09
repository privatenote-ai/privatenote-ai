/** Layout-specific copy for the intimate-photo privacy guide. */
export type HowToSendNudesSafelyCopy = {
  heroAlt: string;
  heroCaption: string;
  quickAnswer: string;
  consent: {
    title: string;
    takeaway: string;
    paragraphs: string[];
    warningTitle: string;
    warning: string;
  };
  identify: {
    title: string;
    takeaway: string;
    lead: string;
    items: string[];
    after: string;
  };
  rules: {
    title: string;
    takeaway: string;
    groups: Array<{
      heading: string;
      paragraphs: string[];
    }>;
    midCtaBody: string;
    midCtaButton: string;
  };
  screenshot: {
    title: string;
    takeaway: string;
    paragraphs: string[];
    calloutTitle: string;
    callout: string;
  };
  workflow: {
    title: string;
    takeaway: string;
    steps: Array<{ label: string; action: string; why: string }>;
    after: string;
  };
  product: {
    title: string;
    takeaway: string;
    paragraphs: string[];
    calloutTitle: string;
    callout: string;
  };
  incident: {
    title: string;
    takeaway: string;
    lead: string;
    items: string[];
    after: string;
  };
  sources: {
    title: string;
    intro: string;
    items: Array<{ label: string; description: string; href: string }>;
  };
  faqs: {
    title: string;
    items: Array<{ question: string; answer: string }>;
  };
  close: {
    title: string;
    takeaway: string;
    paragraphs: string[];
  };
  ctaTitle: string;
  ctaBody: string;
  ctaButton: string;
};
