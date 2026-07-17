import type { BlogCanonicalSlug } from "@shared/localizedBlogSlugs";

export type PrivacyToolPricing = "free" | "freemium" | "open-source" | "paid";

export type PrivacyDirectoryTool = {
  id: string;
  name: string;
  descKey: string;
  nuanceKey?: string;
  href: string;
  pricing: PrivacyToolPricing;
  /** Overrides the default pricing badge label when set. */
  pricingLabelKey?: string;
  /** In-app path; resolved with localizedPath at render time. */
  internalPath?: string;
};

export type PrivacyDirectoryCategoryId =
  | "secrets"
  | "notes"
  | "passwords"
  | "messaging"
  | "email"
  | "browsing"
  | "vpn"
  | "identity"
  | "storage";

export type PrivacyDirectoryCategory = {
  id: PrivacyDirectoryCategoryId;
  titleKey: string;
  leadKey: string;
  tools: PrivacyDirectoryTool[];
};

export const PRIVACY_CURATION_PRINCIPLE_KEYS = [
  { titleKey: "privacyToolsCuratePrinciple1Title", bodyKey: "privacyToolsCuratePrinciple1Body" },
  { titleKey: "privacyToolsCuratePrinciple2Title", bodyKey: "privacyToolsCuratePrinciple2Body" },
  { titleKey: "privacyToolsCuratePrinciple3Title", bodyKey: "privacyToolsCuratePrinciple3Body" },
  { titleKey: "privacyToolsCuratePrinciple4Title", bodyKey: "privacyToolsCuratePrinciple4Body" },
  { titleKey: "privacyToolsCuratePrinciple5Title", bodyKey: "privacyToolsCuratePrinciple5Body" },
] as const;

export const PRIVACY_DIRECTORY_EXCLUSIONS = [
  { titleKey: "privacyToolsExcludedVpnTitle", bodyKey: "privacyToolsExcludedVpnBody" },
  { titleKey: "privacyToolsExcludedTelegramTitle", bodyKey: "privacyToolsExcludedTelegramBody" },
  { titleKey: "privacyToolsExcludedWhatsappTitle", bodyKey: "privacyToolsExcludedWhatsappBody" },
] as const;

export const PRIVACY_DIRECTORY_BLOG_SLUGS: BlogCanonicalSlug[] = [
  "privacy-tools",
  "why-email-is-worst-for-secrets",
  "send-secret-message-without-account",
  "what-is-end-to-end-encryption",
  "how-to-share-api-key-securely",
  "secrets-in-cicd-env-github-leaks",
  "secrets-never-send-in-chat",
  "one-time-secret-links",
  "how-we-generate-passwords",
  "encrypted-vs-secure-file-sharing",
];

export const PRIVACY_DIRECTORY_CATEGORIES: PrivacyDirectoryCategory[] = [
  {
    id: "secrets",
    titleKey: "privacyToolsCatSecretsTitle",
    leadKey: "privacyToolsCatSecretsLead",
    tools: [
      {
        id: "privatenote",
        name: "PrivateNote.ai",
        descKey: "privacyToolsDescPrivatenote",
        href: "/",
        internalPath: "/",
        pricing: "free",
      },
    ],
  },
  {
    id: "notes",
    titleKey: "privacyToolsCatNotesTitle",
    leadKey: "privacyToolsCatNotesLead",
    tools: [
      {
        id: "standard-notes",
        name: "Standard Notes",
        descKey: "privacyToolsDescStandardNotes",
        nuanceKey: "privacyToolsNuanceStandardNotes",
        href: "https://standardnotes.com/",
        pricing: "freemium",
        pricingLabelKey: "privacyToolsPricingFreemiumOpenSource",
      },
      {
        id: "cryptomator",
        name: "Cryptomator",
        descKey: "privacyToolsDescCryptomatorNotes",
        nuanceKey: "privacyToolsNuanceCryptomatorNotes",
        href: "https://cryptomator.org/",
        pricing: "open-source",
        pricingLabelKey: "privacyToolsPricingFreeOpenSource",
      },
    ],
  },
  {
    id: "passwords",
    titleKey: "privacyToolsCatPasswordsTitle",
    leadKey: "privacyToolsCatPasswordsLead",
    tools: [
      {
        id: "bitwarden",
        name: "Bitwarden",
        descKey: "privacyToolsDescBitwarden",
        href: "https://bitwarden.com/",
        pricing: "freemium",
      },
      {
        id: "keepassxc",
        name: "KeePassXC",
        descKey: "privacyToolsDescKeePassxc",
        href: "https://keepassxc.org/",
        pricing: "open-source",
      },
      {
        id: "1password",
        name: "1Password",
        descKey: "privacyToolsDesc1password",
        nuanceKey: "privacyToolsNuance1password",
        href: "https://1password.com/",
        pricing: "paid",
        pricingLabelKey: "privacyToolsPricingPaidProprietary",
      },
    ],
  },
  {
    id: "messaging",
    titleKey: "privacyToolsCatMessagingTitle",
    leadKey: "privacyToolsCatMessagingLead",
    tools: [
      {
        id: "signal",
        name: "Signal",
        descKey: "privacyToolsDescSignal",
        nuanceKey: "privacyToolsNuanceSignal",
        href: "https://signal.org/",
        pricing: "free",
        pricingLabelKey: "privacyToolsPricingFreeOpenSource",
      },
    ],
  },
  {
    id: "email",
    titleKey: "privacyToolsCatEmailTitle",
    leadKey: "privacyToolsCatEmailLead",
    tools: [
      {
        id: "proton-mail",
        name: "Proton Mail",
        descKey: "privacyToolsDescProtonMail",
        href: "https://proton.me/mail",
        pricing: "freemium",
      },
      {
        id: "tuta",
        name: "Tuta",
        descKey: "privacyToolsDescTuta",
        href: "https://tuta.com/",
        pricing: "freemium",
      },
      {
        id: "firefox-relay",
        name: "Firefox Relay",
        descKey: "privacyToolsDescFirefoxRelay",
        nuanceKey: "privacyToolsNuanceFirefoxRelay",
        href: "https://relay.firefox.com/",
        pricing: "freemium",
      },
      {
        id: "simplelogin",
        name: "SimpleLogin",
        descKey: "privacyToolsDescSimplelogin",
        nuanceKey: "privacyToolsNuanceSimplelogin",
        href: "https://simplelogin.io/",
        pricing: "freemium",
        pricingLabelKey: "privacyToolsPricingFreemiumOpenSource",
      },
    ],
  },
  {
    id: "browsing",
    titleKey: "privacyToolsCatBrowsingTitle",
    leadKey: "privacyToolsCatBrowsingLead",
    tools: [
      {
        id: "firefox",
        name: "Firefox",
        descKey: "privacyToolsDescFirefox",
        href: "https://www.mozilla.org/firefox/",
        pricing: "free",
      },
      {
        id: "tor-browser",
        name: "Tor Browser",
        descKey: "privacyToolsDescTorBrowser",
        nuanceKey: "privacyToolsNuanceTorBrowser",
        href: "https://www.torproject.org/download/",
        pricing: "open-source",
        pricingLabelKey: "privacyToolsPricingFreeOpenSource",
      },
      {
        id: "ublock",
        name: "uBlock Origin",
        descKey: "privacyToolsDescUblock",
        href: "https://ublockorigin.com/",
        pricing: "open-source",
      },
      {
        id: "brave",
        name: "Brave",
        descKey: "privacyToolsDescBrave",
        nuanceKey: "privacyToolsNuanceBrave",
        href: "https://brave.com/",
        pricing: "free",
        pricingLabelKey: "privacyToolsPricingFreeOpenSource",
      },
      {
        id: "duckduckgo",
        name: "DuckDuckGo",
        descKey: "privacyToolsDescDuckduckgo",
        href: "https://duckduckgo.com/",
        pricing: "free",
      },
    ],
  },
  {
    id: "vpn",
    titleKey: "privacyToolsCatVpnTitle",
    leadKey: "privacyToolsCatVpnLead",
    tools: [
      {
        id: "mullvad",
        name: "Mullvad VPN",
        descKey: "privacyToolsDescMullvad",
        href: "https://mullvad.net/",
        pricing: "paid",
      },
      {
        id: "proton-vpn",
        name: "Proton VPN",
        descKey: "privacyToolsDescProtonVpn",
        href: "https://proton.me/vpn",
        pricing: "freemium",
      },
      {
        id: "ivpn",
        name: "IVPN",
        descKey: "privacyToolsDescIvpn",
        href: "https://www.ivpn.net/",
        pricing: "paid",
      },
    ],
  },
  {
    id: "identity",
    titleKey: "privacyToolsCatIdentityTitle",
    leadKey: "privacyToolsCatIdentityLead",
    tools: [
      {
        id: "hibp",
        name: "Have I Been Pwned",
        descKey: "privacyToolsDescHibp",
        href: "https://haveibeenpwned.com/",
        pricing: "free",
      },
      {
        id: "2fa-directory",
        name: "2FA Directory",
        descKey: "privacyToolsDesc2fa",
        href: "https://2fa.directory/",
        pricing: "free",
      },
      {
        id: "yubico",
        name: "Yubico",
        descKey: "privacyToolsDescYubico",
        href: "https://www.yubico.com/",
        pricing: "paid",
      },
    ],
  },
  {
    id: "storage",
    titleKey: "privacyToolsCatStorageTitle",
    leadKey: "privacyToolsCatStorageLead",
    tools: [
      {
        id: "veracrypt",
        name: "VeraCrypt",
        descKey: "privacyToolsDescVeracrypt",
        href: "https://www.veracrypt.fr/",
        pricing: "open-source",
      },
    ],
  },
];

export const PRIVACY_DIRECTORY_EXTERNAL_ORGS = [
  { href: "https://www.eff.org/issues/privacy", labelKey: "privacyToolsOrgEff" },
  { href: "https://ssd.eff.org/", labelKey: "privacyToolsOrgSsd" },
  { href: "https://www.mozilla.org/en-US/privacy/", labelKey: "privacyToolsOrgMozilla" },
  { href: "https://www.privacyguides.org/", labelKey: "privacyToolsOrgPrivacyGuides" },
] as const;
