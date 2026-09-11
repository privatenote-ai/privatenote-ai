import type { SupportedLanguage } from "@shared/supportedLanguages";
import type { PasswordManagersGuideCopy, VpnGuideCopy } from "./types";
import { vpnGuideEn } from "./vpnGuide.en";
import { vpnGuideDe } from "./vpnGuide.de";
import { vpnGuideFr } from "./vpnGuide.fr";
import { vpnGuideEs } from "./vpnGuide.es";
import { vpnGuideIt } from "./vpnGuide.it";
import { vpnGuideNl } from "./vpnGuide.nl";
import { vpnGuidePt } from "./vpnGuide.pt";
import { vpnGuideSr } from "./vpnGuide.sr";
import { vpnGuideHr } from "./vpnGuide.hr";
import { vpnGuideTr } from "./vpnGuide.tr";
import { passwordManagersGuideEn } from "./passwordManagersGuide.en";
import { passwordManagersGuideDe } from "./passwordManagersGuide.de";
import { passwordManagersGuideFr } from "./passwordManagersGuide.fr";
import { passwordManagersGuideEs } from "./passwordManagersGuide.es";
import { passwordManagersGuideIt } from "./passwordManagersGuide.it";
import { passwordManagersGuideNl } from "./passwordManagersGuide.nl";
import { passwordManagersGuidePt } from "./passwordManagersGuide.pt";
import { passwordManagersGuideSr } from "./passwordManagersGuide.sr";
import { passwordManagersGuideHr } from "./passwordManagersGuide.hr";
import { passwordManagersGuideTr } from "./passwordManagersGuide.tr";

const VPN_GUIDE_BY_LANGUAGE: Record<SupportedLanguage, VpnGuideCopy> = {
  en: vpnGuideEn,
  de: vpnGuideDe,
  fr: vpnGuideFr,
  es: vpnGuideEs,
  it: vpnGuideIt,
  nl: vpnGuideNl,
  pt: vpnGuidePt,
  sr: vpnGuideSr,
  hr: vpnGuideHr,
  tr: vpnGuideTr,
};

const PASSWORD_MANAGERS_GUIDE_BY_LANGUAGE: Record<SupportedLanguage, PasswordManagersGuideCopy> = {
  en: passwordManagersGuideEn,
  de: passwordManagersGuideDe,
  fr: passwordManagersGuideFr,
  es: passwordManagersGuideEs,
  it: passwordManagersGuideIt,
  nl: passwordManagersGuideNl,
  pt: passwordManagersGuidePt,
  sr: passwordManagersGuideSr,
  hr: passwordManagersGuideHr,
  tr: passwordManagersGuideTr,
};

export function vpnGuideCopy(language: SupportedLanguage): VpnGuideCopy {
  return VPN_GUIDE_BY_LANGUAGE[language] ?? vpnGuideEn;
}

export function passwordManagersGuideCopy(language: SupportedLanguage): PasswordManagersGuideCopy {
  return PASSWORD_MANAGERS_GUIDE_BY_LANGUAGE[language] ?? passwordManagersGuideEn;
}

export function localizedSecurityGuideMeta(
  topic: "vpn" | "password",
  language: SupportedLanguage,
): { title: string; description: string } {
  const copy = topic === "vpn" ? vpnGuideCopy(language) : passwordManagersGuideCopy(language);
  return { title: copy.metaTitle, description: copy.metaDescription };
}
