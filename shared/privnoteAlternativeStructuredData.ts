import { PUBLIC_SITE_ORIGIN } from "./homeSeoLinks.ts";
import type { PrivnoteAlternativeCopy, PrivnoteAlternativeFaqItem } from "../client/src/pages/privnoteAlternative/copy.types.ts";

export function isPrivnoteAlternativeRoute(route: string): boolean {
  const parts = route.split("/").filter(Boolean);
  return parts[parts.length - 1] === "privnote-alternative";
}

export function buildPrivnoteAlternativeFaqSchema(
  faqs: ReadonlyArray<PrivnoteAlternativeFaqItem>,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildPrivnoteAlternativePageSchema(
  copy: PrivnoteAlternativeCopy,
  pagePath = "/privnote-alternative",
  homePath = "/",
): Record<string, unknown> {
  const pageUrl = `${PUBLIC_SITE_ORIGIN}${pagePath}`;
  const homeUrl = `${PUBLIC_SITE_ORIGIN}${homePath}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: `${copy.heroTitleLine1} ${copy.heroTitleLine2}`,
        description: copy.heroBody,
        isPartOf: {
          "@type": "WebSite",
          name: "PrivateNote.ai",
          url: `${PUBLIC_SITE_ORIGIN}/`,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: homeUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: copy.breadcrumbCurrent,
            item: pageUrl,
          },
        ],
      },
    ],
  };
}
