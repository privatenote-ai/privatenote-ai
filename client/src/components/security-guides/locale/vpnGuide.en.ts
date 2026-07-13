import type { VpnGuideCopy } from "./types";

export const vpnGuideEn: VpnGuideCopy = {
  metaTitle: "VPN Services Guide",
  metaDescription:
    "Choose a reputable VPN with confidence. Compare Proton VPN, Mullvad, and NymVPN — what they protect, what they cannot fix, and secure secret sharing.",
  heroLabel: "Security guide",
  heroTitle: "VPN Services Guide",
  heroSubtitle:
    "A practical guide to choosing a reputable VPN — what they protect, what they cannot fix, and why Proton VPN, Mullvad, and NymVPN stand out for privacy-conscious users.",
  whatItDoesTitle: "What a VPN actually does",
  whatItDoesBody:
    "A Virtual Private Network creates an encrypted tunnel between your device and a VPN server. Traffic leaving your device is encrypted, and websites see the VPN server's IP address instead of yours — reducing what your ISP, the café Wi‑Fi operator, or someone on the same network can observe.",
  benefits: [
    "Encrypts traffic between your device and the VPN server",
    "Hides your real IP from sites and services you visit",
    "Protects against passive snooping on untrusted Wi‑Fi",
    "Reduces ISP-level DNS and destination metadata tracking",
  ],
  withoutVpnLabel: "Without VPN",
  withoutVpnBody:
    "Your device talks directly to the website. The Wi‑Fi operator and ISP can see connection metadata — and on hostile networks, traffic may be intercepted.",
  withoutVpnItems: [
    "Real IP visible to sites",
    "ISP sees destinations & DNS",
    "Public Wi‑Fi exposure",
  ],
  withVpnLabel: "With VPN",
  withVpnBody:
    "Traffic is wrapped in encryption to the VPN server first. Observers on the local network see encrypted packets — not which sites you visit.",
  withVpnItems: [
    "Sites see VPN exit IP",
    "Encrypted tunnel to server",
    "Safer on untrusted networks",
  ],
  limitationsTitle: "What a VPN does not do",
  limitationsIntro: "VPNs are useful, but not a magic invisibility cloak — especially when sharing secrets.",
  limitations: [
    "Does not make you anonymous if you stay logged into Google, Facebook, or work accounts",
    "Does not stop phishing, malware, or weak passwords",
    "Does not encrypt chat content unless the app already uses end-to-end encryption",
    "Does not replace secure sharing for passwords, API keys, or recovery codes",
  ],
  limitationsCallout:
    "For one-time secrets — passwords, seed phrases, API keys — use end-to-end encrypted sharing like PrivateNote. A VPN protects the pipe; it does not protect what you paste into email, Slack, or SMS.",
  whenToUseTitle: "When to use a VPN",
  whenToUseIntro:
    "You do not need one 24/7 unless your threat model calls for it — but these are the situations where a reputable VPN earns its place.",
  useCases: [
    { label: "Public Wi‑Fi", detail: "Airports, hotels, cafés" },
    { label: "Travel", detail: "Foreign networks & roaming" },
    { label: "ISP metadata", detail: "Less home-network logging" },
    { label: "Sensitive work", detail: "Research & journalism" },
  ],
  trustTitle: "How to spot a reputable VPN",
  trustSignals: [
    "Independently audited no-logs policy",
    "Transparent ownership and jurisdiction",
    "WireGuard or OpenVPN with strong encryption",
    "Open-source or reproducible client builds",
    "Honest metadata and billing disclosures",
    "No “100% anonymous” marketing hype",
  ],
  providersTitle: "Recommended providers",
  providersIntro:
    "Three privacy-first VPNs from reputable teams — pick based on Swiss law, anonymous signup, or mixnet-level routing.",
  providers: {
    proton: {
      tagline: "Swiss privacy law · audited no-logs · Proton ecosystem",
      description:
        "Built by Proton AG — the team behind Proton Mail. Open-source apps, independent audits, Secure Core routing, and optional Tor-over-VPN.",
      highlights: ["Swiss jurisdiction", "Audited no-logs", "Free tier available", "Open-source clients"],
      visitLabel: "Visit Proton VPN",
    },
    mullvad: {
      tagline: "No email · account number only · cash & crypto",
      description:
        "Swedish VPN with anonymous account numbers, flat pricing, and payment options that keep your identity separate from your subscription.",
      highlights: ["No email signup", "WireGuard + OpenVPN", "Cash & crypto accepted", "Audited infrastructure"],
      visitLabel: "Visit Mullvad",
    },
    nym: {
      tagline: "Mixnet routing · beyond standard tunneling",
      description:
        "Adds mixnet technology on top of VPN encryption — breaking and reordering packets to resist traffic analysis, not just hide your IP.",
      highlights: [
        "WireGuard + mixnet modes",
        "Decentralized routing",
        "Traffic-analysis resistant",
        "Research-backed team",
      ],
      visitLabel: "Visit NymVPN",
    },
  },
  comparisonHeaders: {
    bestFor: "Best for",
    proton: "Proton VPN",
    mullvad: "Mullvad",
    nym: "NymVPN",
  },
  comparisonRows: {
    privacyJurisdiction: {
      label: "Privacy jurisdiction",
      proton: "Switzerland",
      mullvad: "Sweden",
      nym: "Decentralized mixnet",
    },
    signup: {
      label: "Signup",
      proton: "Email account",
      mullvad: "Random account #",
      nym: "Standard account",
    },
    standout: {
      label: "Stand-out feature",
      proton: "Secure Core + Tor",
      mullvad: "Cash/crypto payment",
      nym: "Mixnet routing",
    },
    idealUser: {
      label: "Ideal user",
      proton: "Proton ecosystem fans",
      mullvad: "Maximum signup anonymity",
      nym: "Traffic-analysis resistance",
    },
  },
  ctaTitle: "VPN + PrivateNote: different jobs",
  ctaBody:
    "A VPN protects your connection. PrivateNote protects the secret itself — encrypted in your browser before upload, self-destructing after one read.",
  ctaButton: "Create a secure one-time note",
  exploreOther: "Explore other guides",
  allResources: "All resources",
  affiliateDisclaimer:
    "Educational guide only. We may earn a commission from affiliate links when you use recommended services, which helps support this free privacy resource.",
  otherGuides: [
    { id: "password", title: "Password Managers" },
    { id: "messenger", title: "Secure Messaging" },
    { id: "email", title: "Secure Email" },
    { id: "browser", title: "Privacy Browsers" },
  ],
};
