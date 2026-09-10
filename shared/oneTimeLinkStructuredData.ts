export function isOneTimeLinkRoute(route: string): boolean {
  const parts = route.split("/").filter(Boolean);
  return parts[parts.length - 1] === "one-time-link";
}

export function buildOneTimeLinkFaqSchema(
  faqs: ReadonlyArray<{ question: string; answer: string }>,
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
