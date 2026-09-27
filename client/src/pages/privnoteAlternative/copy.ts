import type { SupportedLanguage } from "../../utils/translations/types";
import type { PrivnoteAlternativeCopy } from "./copy.types";
import { privnoteAlternativeDe } from "./copy.de";
import { privnoteAlternativeEn } from "./copy.en";
import { privnoteAlternativeEs } from "./copy.es";
import { privnoteAlternativeFr } from "./copy.fr";
import { privnoteAlternativeHr } from "./copy.hr";
import { privnoteAlternativeIt } from "./copy.it";
import { privnoteAlternativeNl } from "./copy.nl";
import { privnoteAlternativePl } from "./copy.pl";
import { privnoteAlternativePt } from "./copy.pt";
import { privnoteAlternativeSr } from "./copy.sr";
import { privnoteAlternativeTr } from "./copy.tr";

const privnoteAlternativeCopy: Record<SupportedLanguage, PrivnoteAlternativeCopy> = {
  en: privnoteAlternativeEn,
  de: privnoteAlternativeDe,
  es: privnoteAlternativeEs,
  nl: privnoteAlternativeNl,
  fr: privnoteAlternativeFr,
  it: privnoteAlternativeIt,
  pt: privnoteAlternativePt,
  hr: privnoteAlternativeHr,
  sr: privnoteAlternativeSr,
  tr: privnoteAlternativeTr,
  pl: privnoteAlternativePl,
};

export function getPrivnoteAlternativeCopy(language: SupportedLanguage): PrivnoteAlternativeCopy {
  return privnoteAlternativeCopy[language] ?? privnoteAlternativeEn;
}
