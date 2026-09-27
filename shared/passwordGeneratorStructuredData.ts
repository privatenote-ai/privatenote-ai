import type { Translations } from "../client/src/utils/translations/types.ts";

export const PASSWORD_GENERATOR_FAQ_IDS = [
  "random",
  "length",
  "symbols",
  "share",
  "store",
  "entropy",
  "memorable",
  "passphrase",
  "similar",
  "server",
  "account",
  "delivery",
] as const;

export type PasswordGeneratorFaqId = (typeof PASSWORD_GENERATOR_FAQ_IDS)[number];

export function isPasswordGeneratorRoute(route: string): boolean {
  const parts = route.split("/").filter(Boolean);
  return parts[parts.length - 1] === "password-generator";
}

function faqAnswerText(id: PasswordGeneratorFaqId, t: Translations): string {
  if (id === "memorable") {
    return [
      t.passwordFaq_memorable_answerLead,
      t.passwordFaq_memorable_answerMaster,
      `${t.passwordFaq_memorable_generatorLink}${t.passwordFaq_memorable_answerGeneratorTail}`,
    ].join(" ");
  }
  return t[`passwordFaq_${id}_answer`];
}

export function buildPasswordGeneratorFaqSchema(t: Translations): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: PASSWORD_GENERATOR_FAQ_IDS.map((id) => ({
      "@type": "Question",
      name: t[`passwordFaq_${id}_question`],
      acceptedAnswer: {
        "@type": "Answer",
        text: faqAnswerText(id, t),
      },
    })),
  };
}
