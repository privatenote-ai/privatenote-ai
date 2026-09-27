import type { SupportedLanguage } from "@shared/supportedLanguages";

export type SecurityGuideOtherLink = {
  id: string;
  title: string;
};

export type VpnProviderCopy = {
  tagline: string;
  description: string;
  highlights: string[];
  visitLabel: string;
};

export type VpnGuideCopy = {
  metaTitle: string;
  metaDescription: string;
  heroLabel: string;
  heroTitle: string;
  heroSubtitle: string;
  whatItDoesTitle: string;
  whatItDoesBody: string;
  benefits: string[];
  withoutVpnLabel: string;
  withoutVpnBody: string;
  withoutVpnItems: string[];
  withVpnLabel: string;
  withVpnBody: string;
  withVpnItems: string[];
  limitationsTitle: string;
  limitationsIntro: string;
  limitations: string[];
  limitationsCallout: string;
  whenToUseTitle: string;
  whenToUseIntro: string;
  useCases: { label: string; detail: string }[];
  trustTitle: string;
  trustSignals: string[];
  providersTitle: string;
  providersIntro: string;
  providers: {
    proton: VpnProviderCopy;
    mullvad: VpnProviderCopy;
    nym: VpnProviderCopy;
  };
  comparisonHeaders: { bestFor: string; proton: string; mullvad: string; nym: string };
  comparisonRows: {
    privacyJurisdiction: { label: string; proton: string; mullvad: string; nym: string };
    signup: { label: string; proton: string; mullvad: string; nym: string };
    standout: { label: string; proton: string; mullvad: string; nym: string };
    idealUser: { label: string; proton: string; mullvad: string; nym: string };
  };
  ctaTitle: string;
  ctaBody: string;
  ctaButton: string;
  exploreOther: string;
  allResources: string;
  affiliateDisclaimer: string;
  otherGuides: SecurityGuideOtherLink[];
};

export type PasswordManagerEntryCopy = {
  verdict: string;
  description: string;
  highlights: string[];
  learnMore: string;
  caution?: string;
};

export type PasswordManagerTierCopy = {
  title: string;
  subtitle: string;
  intro: string;
  strengthsLabel: string;
  tradeoffsLabel: string;
  pros: string[];
  cons: string[];
  managers: Record<string, PasswordManagerEntryCopy>;
};

export type PasswordManagersGuideCopy = {
  metaTitle: string;
  metaDescription: string;
  heroLabel: string;
  heroTitle: string;
  heroTagline: string;
  heroSubtitle: string;
  introLead: string;
  reuseExamples: string[];
  credentialStuffing: string;
  essentialTitle: string;
  essentialIntro: string;
  essentialBenefits: string[];
  howItWorksTitle: string;
  howItWorksBody1: string;
  cryptoLabel: string;
  cryptoPoints: string[];
  howItWorksBody2: string;
  unlockedLabel: string;
  vaultFeatures: string[];
  benefitsTitle: string;
  benefitBlocks: { title: string; body: string }[];
  passwordsLuPartnerLabel: string;
  passwordsLuTitle: string;
  passwordsLuBody: string;
  passwordsLuWorkflow: string;
  passwordsLuCta: string;
  passwordsLuTools: string[];
  recommendedTitle: string;
  recommendedIntro: string;
  tiers: Record<string, PasswordManagerTierCopy>;
  comparisonHeaders: { priority: string; recommendation: string };
  comparisonRows: { priority: string; pick: string }[];
  sharingTitle: string;
  sharingBody: string;
  unsafeChannels: string[];
  privateNoteSharingTitle: string;
  privateNoteSharingBody: string;
  privateNoteSharingItems: string[];
  privateNoteSharingCta: string;
  passwordProtectedTitle: string;
  passwordProtectedBody1: string;
  passwordProtectedBody2: string;
  bestPracticesTitle: string;
  bestPractices: string[];
  faqTitle: string;
  faq: { q: string; a: string }[];
  finalTitle: string;
  finalBody: string;
  finalBullets: { label: string; text: string }[];
  finalCtaPrivateNote: string;
  finalCtaPasswordsLu: string;
  exploreOther: string;
  allResources: string;
  affiliateDisclaimer: string;
  otherGuides: SecurityGuideOtherLink[];
};

export type SecurityGuideLocaleMap<T> = Record<SupportedLanguage, T>;
