import type { PasswordManagersGuideCopy } from "./types";

export const passwordManagersGuideEn: PasswordManagersGuideCopy = {
  metaTitle: "Password Managers Guide",
  metaDescription:
    "Create, store, and share passwords securely. Compare KeePass, Bitwarden, Apple, and Google — plus Passwords.lu generation and PrivateNote for one-time sharing.",
  heroLabel: "Security guide",
  heroTitle: "Password Managers Guide",
  heroTagline: "Create, Store, and Share Passwords Securely",
  heroSubtitle:
    "Passwords protect nearly every aspect of digital life — yet reuse and weak patterns remain one of the weakest links in cybersecurity. A password manager fixes that.",
  introLead:
    "The problem isn't passwords themselves. It's how people use them. Many still reuse the same password across dozens of sites or make only small variations:",
  reuseExamples: ["Summer2026!", "Summer2026!Amazon", "Summer2026!Facebook"],
  credentialStuffing:
    "If one website suffers a breach, attackers test those credentials everywhere — a technique called credential stuffing, responsible for millions of compromised accounts every year. A password manager generates a different password for every account. You only need to remember one strong master password.",
  essentialTitle: "Why password managers are essential",
  essentialIntro: "A good password manager dramatically improves both security and daily experience online.",
  essentialBenefits: [
    "Generate long, random passwords instantly",
    "Store every password inside an encrypted vault",
    "Automatically fill login forms",
    "Detect reused or weak passwords",
    "Receive alerts when credentials appear in known breaches",
    "Synchronize passwords across your devices",
    "Store passkeys alongside passwords",
    "Securely share credentials when necessary",
  ],
  howItWorksTitle: "How password managers work",
  howItWorksBody1:
    "Your credentials live inside an encrypted vault. When you create the vault, you choose a master password that derives the encryption keys protecting everything inside.",
  cryptoLabel: "Modern cryptography typically includes:",
  cryptoPoints: [
    "AES-256 encryption",
    "Argon2id or PBKDF2 for key derivation",
    "Authenticated encryption to detect tampering",
  ],
  howItWorksBody2:
    "Because the vault is encrypted before storage or sync, reputable providers generally cannot read your passwords.",
  unlockedLabel: "Once unlocked, your manager can:",
  vaultFeatures: [
    "Autofill usernames and passwords",
    "Generate secure passwords",
    "Save newly created credentials",
    "Synchronize changes across devices",
    "Store secure notes and passkeys",
  ],
  benefitsTitle: "Benefits of using a password manager",
  benefitBlocks: [
    {
      title: "Every account gets a unique password",
      body: "If your Netflix password is stolen, it should not also unlock your email, banking, GitHub account, or cloud storage. Password managers make unique passwords effortless.",
    },
    {
      title: "Strong password generation",
      body: "Humans are poor at inventing random passwords. Managers generate high-entropy strings like uQ8!kL#7P2@wXf9$rZm4 — extremely difficult to guess or brute-force.",
    },
    {
      title: "Automatic login",
      body: "Password managers recognize websites and fill credentials automatically. Reputable managers typically autofill only on the correct domain, which also helps protect against phishing.",
    },
    {
      title: "Password health reports",
      body: "Many managers flag reused passwords, weak passwords, compromised credentials, missing MFA, and sites that support passkeys — helping you improve security over time.",
    },
    {
      title: "Secure synchronization",
      body: "Modern managers sync your encrypted vault across desktop, laptop, phone, and tablet so passwords stay available wherever you need them.",
    },
  ],
  passwordsLuPartnerLabel: "Partner tool",
  passwordsLuTitle: "Browser-based generation with Passwords.lu",
  passwordsLuBody:
    "Sometimes you only need a strong password — not a full vault workflow. Passwords.lu runs generation directly in your browser. Passwords are not uploaded to servers; no account required.",
  passwordsLuWorkflow:
    "Recommended workflow: generate on Passwords.lu, then immediately save in your password manager.",
  passwordsLuCta: "Open password generator",
  passwordsLuTools: [
    "Strong password generator",
    "Passphrase generator",
    "Secure PIN generator",
    "Password strength checker",
    "Username generator",
    "Hash generators (Argon2id, bcrypt, scrypt and more)",
    "Educational security tools",
  ],
  recommendedTitle: "Recommended password managers",
  recommendedIntro:
    "Think in three layers: platform-built tools for stability, local open-source vaults for control, and cloud managers when you need powerful sync — accepting the extra server-side risk that comes with it.",
  tiers: {
    platform: {
      title: "Platform-built managers",
      subtitle: "Strong engineering, stable products — best default for most people",
      intro:
        "Apple and Google ship password managers with the operating system. They are backed by large security teams, receive continuous updates, and integrate passkeys, autofill, and breach alerts with minimal setup. If you live in one ecosystem, this is often the smoothest and most reliable choice.",
      strengthsLabel: "Strengths",
      tradeoffsLabel: "Trade-offs",
      pros: [
        "Polished UX with OS-level autofill and passkey support",
        "Maintained by platform security engineers at scale",
        "No separate subscription for core features",
        "Stable sync through iCloud or your Google Account",
      ],
      cons: [
        "Tied to Apple or Google account and platform choices",
        "Less flexible if you mix Windows, Linux, and mobile freely",
        "Trust model depends on your cloud account security",
      ],
      managers: {
        apple: {
          verdict: "Best for iPhone, iPad, Mac, and Vision Pro",
          description:
            "Built into Apple platforms with secure storage, generation, security alerts, passkeys, and iCloud Keychain sync — no extra app required in an all-Apple household.",
          highlights: [
            "Deep OS integration and passkey support",
            "Security alerts for known breaches",
            "Excellent UX when you stay inside Apple's stack",
          ],
          learnMore: "Learn more",
        },
        google: {
          verdict: "Best for Android and Chrome",
          description:
            "Built into Android and Chrome with generation, autofill, Password Checkup, breach alerts, passkeys, and sync through your Google Account.",
          highlights: [
            "Convenient default on Android devices",
            "Password Checkup and breach alerts",
            "Works wherever you use Chrome",
          ],
          learnMore: "Learn more",
        },
      },
    },
    local: {
      title: "Local open-source vaults",
      subtitle: "Maximum control — you own the encrypted file",
      intro:
        "KeePass stores your vault as a local encrypted database. Nothing requires a vendor cloud account: you decide where the file lives and how it syncs. The trade-off is UX — interfaces can feel dated compared with platform or cloud managers, and multi-device sync is DIY unless you add your own storage layer.",
      strengthsLabel: "Strengths",
      tradeoffsLabel: "Trade-offs",
      pros: [
        "Open source and auditable",
        "No mandatory cloud account or subscription",
        "Offline-first; vault file stays under your control",
        "Large plugin ecosystem (KeePassXC, mobile ports, etc.)",
      ],
      cons: [
        "UI and onboarding less polished than platform tools",
        "Sync across devices is manual unless you configure it",
        "More setup work for families or mixed-device households",
      ],
      managers: {
        keepass: {
          verdict: "Best for privacy purists and self-hosters",
          description:
            "The original open-source model: one encrypted .kdbx file you can store on disk, USB, NAS, or sync through your own cloud. KeePassXC is a popular cross-platform fork with a more modern interface.",
          highlights: [
            "Completely free — no vendor lock-in",
            "You choose storage and sync strategy",
            "Ideal when the cloud is optional, not default",
          ],
          learnMore: "Learn more",
        },
      },
    },
    cloud: {
      title: "Cloud-sync password managers",
      subtitle: "Powerful sync and sharing — highest server-side risk",
      intro:
        "Dedicated cloud managers like Bitwarden excel at cross-platform sync, family sharing, and team features. That convenience comes with a different threat model: your encrypted vault (and sometimes metadata) lives on someone else's servers. A breach or misconfiguration at the vendor is the main residual risk — which is why audits, open source, and a strong master password matter more here than anywhere else.",
      strengthsLabel: "Strengths",
      tradeoffsLabel: "Trade-offs",
      pros: [
        "Best cross-device sync out of the box",
        "Family and organization sharing features",
        "Works consistently across Windows, macOS, Linux, and mobile",
        "Open-source options (Bitwarden) with public security audits",
      ],
      cons: [
        "Largest attack surface if the vendor is compromised",
        "Encrypted vault backups can still be offline-cracked with weak master passwords",
        "You must trust the vendor's crypto implementation and ops",
      ],
      managers: {
        bitwarden: {
          verdict: "Best cloud option for cross-platform users",
          description:
            "Open-source software, end-to-end encrypted sync, passkey support, independent audits, and a strong free tier — the default recommendation when you need cloud sync outside Apple or Google.",
          highlights: [
            "Audited open-source clients",
            "Excellent free plan and family tiers",
            "Consistent experience across all major platforms",
          ],
          learnMore: "Learn more",
        },
        lastpass: {
          verdict: "Legacy option — prefer Bitwarden for new users",
          description:
            "Helped popularize cloud password managers, but high-profile incidents involving stolen encrypted vault backups pushed many security professionals toward Bitwarden or local KeePass for new deployments.",
          highlights: [
            "Usable with strong master password + MFA if already invested",
            "Consider migrating if you are starting fresh",
          ],
          learnMore: "Learn more",
          caution: "Caution",
        },
      },
    },
  },
  comparisonHeaders: {
    priority: "Your priority",
    recommendation: "Recommendation",
  },
  comparisonRows: [
    { priority: "Live in Apple's ecosystem", pick: "Apple Passwords" },
    { priority: "Android & Chrome daily driver", pick: "Google Password Manager" },
    { priority: "Maximum privacy and file control", pick: "KeePass (local vault)" },
    { priority: "Cross-platform cloud sync", pick: "Bitwarden" },
    { priority: "Existing LastPass user", pick: "Continue if hardened; evaluate Bitwarden or KeePass" },
  ],
  sharingTitle: "Sharing passwords securely",
  sharingBody:
    "Even strong passwords sometimes need to be shared — with colleagues, family, IT admins, contractors, or clients. Too many people still send them through messaging platforms designed for chat, not secret delivery.",
  unsafeChannels: ["Email", "Slack", "Microsoft Teams", "WhatsApp", "Discord", "SMS"],
  privateNoteSharingTitle: "Use PrivateNote instead",
  privateNoteSharingBody:
    "PrivateNote encrypts secrets in your browser before upload. The server stores only ciphertext; the decryption key travels separately in the link. Notes can self-destruct after one read or expire on a schedule.",
  privateNoteSharingItems: [
    "Passwords",
    "API keys",
    "Wi‑Fi credentials",
    "Recovery codes",
    "Temporary logins",
  ],
  privateNoteSharingCta: "Create a secure one-time note",
  passwordProtectedTitle: "Extra protection with password-protected notes",
  passwordProtectedBody1:
    "Add an optional password to a PrivateNote. The recipient needs both the link and the separate password — ideally delivered through different channels (email the link, share the password by phone or in person).",
  passwordProtectedBody2:
    "Even if someone intercepts the link, they cannot reveal the secret without the password.",
  bestPracticesTitle: "Best practices",
  bestPractices: [
    "Use a long, unique master password",
    "Enable multi-factor authentication on your password manager",
    "Never reuse passwords across websites",
    "Generate passwords with a password manager or Passwords.lu",
    "Save every password in your encrypted vault",
    "Enable passkeys whenever available",
    "Regularly review password health reports",
    "Share passwords through PrivateNote instead of email or chat",
    "For highly sensitive credentials, use PrivateNote's optional password protection and deliver the password separately",
  ],
  faqTitle: "Frequently asked questions",
  faq: [
    {
      q: "Are password managers safe?",
      a: "Yes. Reputable password managers use strong, industry-standard encryption. For almost everyone, using a password manager is significantly safer than memorizing passwords or reusing the same password across multiple websites.",
    },
    {
      q: "Can the password manager provider read my passwords?",
      a: "For modern managers such as KeePass, Bitwarden, Apple Passwords, and Google Password Manager, your vault is encrypted before storage. Assuming you use a strong master password, the provider generally cannot read your stored credentials.",
    },
    {
      q: "What happens if I forget my master password?",
      a: "Most password managers cannot recover it because they never know it. This is deliberate. Some services offer recovery options or emergency access if configured ahead of time.",
    },
    {
      q: "Should I use browser password storage?",
      a: "Built-in Apple and Google managers are strong, stable choices within their ecosystems — backed by large security teams. KeePass suits maximum control. Bitwarden fits when you need cloud sync across mixed platforms, accepting higher server-side risk.",
    },
  ],
  finalTitle: "Final recommendation",
  finalBody:
    "No single manager is perfect for everyone — but using one is among the most effective steps you can take. Pair it with Passwords.lu for fast generation and PrivateNote when you need to share secrets securely.",
  finalBullets: [
    { label: "Apple & Google", text: "stable platform defaults" },
    { label: "KeePass", text: "local control, open source" },
    { label: "Bitwarden", text: "cloud sync when you need every device" },
    { label: "Passwords.lu", text: "fast browser-local generation" },
  ],
  finalCtaPrivateNote: "Share a secret with PrivateNote",
  finalCtaPasswordsLu: "Visit passwords.lu",
  exploreOther: "Explore other guides",
  allResources: "All resources",
  affiliateDisclaimer:
    "Educational guide only. We may earn a commission from affiliate links when you use recommended services, which helps support this free privacy resource.",
  otherGuides: [
    { id: "vpn", title: "VPN Services" },
    { id: "messenger", title: "Secure Messaging" },
    { id: "email", title: "Secure Email" },
    { id: "browser", title: "Privacy Browsers" },
  ],
};
