import type { SupportedLanguage } from "../../utils/translations/types";
import type { OneTimeLinkCopy } from "./copy.types";
import { oneTimeLinkDe } from "./copy.de";
import { oneTimeLinkEn } from "./copy.en";
import { oneTimeLinkEs } from "./copy.es";
import { oneTimeLinkFr } from "./copy.fr";
import { oneTimeLinkHr } from "./copy.hr";
import { oneTimeLinkIt } from "./copy.it";
import { oneTimeLinkNl } from "./copy.nl";
import { oneTimeLinkPt } from "./copy.pt";
import { oneTimeLinkSr } from "./copy.sr";
import { oneTimeLinkTr } from "./copy.tr";

const oneTimeLinkCopy: Record<SupportedLanguage, OneTimeLinkCopy> = {
  en: oneTimeLinkEn,
  de: oneTimeLinkDe,
  es: oneTimeLinkEs,
  nl: oneTimeLinkNl,
  fr: oneTimeLinkFr,
  it: oneTimeLinkIt,
  pt: oneTimeLinkPt,
  hr: oneTimeLinkHr,
  sr: oneTimeLinkSr,
  tr: oneTimeLinkTr,
};

export function getOneTimeLinkCopy(language: SupportedLanguage): OneTimeLinkCopy {
  return oneTimeLinkCopy[language] ?? oneTimeLinkCopy.en;
}
