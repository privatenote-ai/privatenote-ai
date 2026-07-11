import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Fingerprint,
  KeyRound,
  Lock,
  MinusCircle,
  Share2,
  Shield,
  Sparkles,
  XCircle,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { PASSWORDS_LU_PARTNER_URLS } from "@/config/passwordsLuPartner";
import { joinPublicPath, localizedPath } from "@/utils/localizedPath";
import { buildDocumentTitle, setDocumentMeta } from "@/utils/documentMeta";
import { PasswordVaultAnimation } from "@/components/security-guides/PasswordVaultAnimation";
import {
  ManagerTierHeader,
  PasswordManagerBrandMark,
  type PasswordManagerBrand,
} from "@/components/security-guides/PasswordManagerBrandMark";

const REVEAL = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-8%" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
} as const;

function SectionRule() {
  return <hr className="my-16 border-0 border-t border-gray-200/80 dark:border-gray-800/80" aria-hidden />;
}

const REUSE_EXAMPLES = ["Summer2026!", "Summer2026!Amazon", "Summer2026!Facebook"] as const;

const ESSENTIAL_BENEFITS = [
  "Generate long, random passwords instantly",
  "Store every password inside an encrypted vault",
  "Automatically fill login forms",
  "Detect reused or weak passwords",
  "Receive alerts when credentials appear in known breaches",
  "Synchronize passwords across your devices",
  "Store passkeys alongside passwords",
  "Securely share credentials when necessary",
] as const;

const CRYPTO_POINTS = ["AES-256 encryption", "Argon2id or PBKDF2 for key derivation", "Authenticated encryption to detect tampering"] as const;

const VAULT_FEATURES = [
  "Autofill usernames and passwords",
  "Generate secure passwords",
  "Save newly created credentials",
  "Synchronize changes across devices",
  "Store secure notes and passkeys",
] as const;

const BENEFIT_BLOCKS = [
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
] as const;

const PASSWORDS_LU_TOOLS = [
  "Strong password generator",
  "Passphrase generator",
  "Secure PIN generator",
  "Password strength checker",
  "Username generator",
  "Hash generators (Argon2id, bcrypt, scrypt and more)",
  "Educational security tools",
] as const;

type ManagerEntry = {
  name: string;
  brand: PasswordManagerBrand;
  verdict: string;
  accent: string;
  caution?: boolean;
  link: string;
  description: string;
  highlights: readonly string[];
};

type ManagerTier = {
  id: string;
  step: string;
  title: string;
  subtitle: string;
  intro: string;
  pros: readonly string[];
  cons: readonly string[];
  managers: readonly ManagerEntry[];
};

const MANAGER_TIERS: readonly ManagerTier[] = [
  {
    id: "platform",
    step: "1",
    title: "Platform-built managers",
    subtitle: "Strong engineering, stable products — best default for most people",
    intro:
      "Apple and Google ship password managers with the operating system. They are backed by large security teams, receive continuous updates, and integrate passkeys, autofill, and breach alerts with minimal setup. If you live in one ecosystem, this is often the smoothest and most reliable choice.",
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
    managers: [
      {
        name: "Apple Passwords",
        brand: "apple",
        verdict: "Best for iPhone, iPad, Mac, and Vision Pro",
        accent: "from-[#A2AAAD]/20 via-[#1d1d1f]/5 to-white border-[#A2AAAD]/45 dark:from-[#A2AAAD]/15 dark:via-[#1d1d1f]/20 dark:to-gray-950",
        link: "https://support.apple.com/120758",
        description:
          "Built into Apple platforms with secure storage, generation, security alerts, passkeys, and iCloud Keychain sync — no extra app required in an all-Apple household.",
        highlights: [
          "Deep OS integration and passkey support",
          "Security alerts for known breaches",
          "Excellent UX when you stay inside Apple’s stack",
        ],
      },
      {
        name: "Google Password Manager",
        brand: "google",
        verdict: "Best for Android and Chrome",
        accent: "from-[#4285F4]/15 via-[#34A853]/5 to-white border-[#4285F4]/35 dark:from-[#4285F4]/15 dark:via-[#34A853]/5 dark:to-gray-950",
        link: "https://passwords.google.com/",
        description:
          "Built into Android and Chrome with generation, autofill, Password Checkup, breach alerts, passkeys, and sync through your Google Account.",
        highlights: [
          "Convenient default on Android devices",
          "Password Checkup and breach alerts",
          "Works wherever you use Chrome",
        ],
      },
    ],
  },
  {
    id: "local",
    step: "2",
    title: "Local open-source vaults",
    subtitle: "Maximum control — you own the encrypted file",
    intro:
      "KeePass stores your vault as a local encrypted database. Nothing requires a vendor cloud account: you decide where the file lives and how it syncs. The trade-off is UX — interfaces can feel dated compared with platform or cloud managers, and multi-device sync is DIY unless you add your own storage layer.",
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
    managers: [
      {
        name: "KeePass",
        brand: "keepass",
        verdict: "Best for privacy purists and self-hosters",
        accent: "from-[#6CA338]/20 via-[#6CA338]/5 to-white border-[#6CA338]/40 dark:from-[#6CA338]/15 dark:via-[#6CA338]/5 dark:to-gray-950",
        link: "https://keepass.info/",
        description:
          "The original open-source model: one encrypted .kdbx file you can store on disk, USB, NAS, or sync through your own cloud. KeePassXC is a popular cross-platform fork with a more modern interface.",
        highlights: [
          "Completely free — no vendor lock-in",
          "You choose storage and sync strategy",
          "Ideal when the cloud is optional, not default",
        ],
      },
    ],
  },
  {
    id: "cloud",
    step: "3",
    title: "Cloud-sync password managers",
    subtitle: "Powerful sync and sharing — highest server-side risk",
    intro:
      "Dedicated cloud managers like Bitwarden excel at cross-platform sync, family sharing, and team features. That convenience comes with a different threat model: your encrypted vault (and sometimes metadata) lives on someone else’s servers. A breach or misconfiguration at the vendor is the main residual risk — which is why audits, open source, and a strong master password matter more here than anywhere else.",
    pros: [
      "Best cross-device sync out of the box",
      "Family and organization sharing features",
      "Works consistently across Windows, macOS, Linux, and mobile",
      "Open-source options (Bitwarden) with public security audits",
    ],
    cons: [
      "Largest attack surface if the vendor is compromised",
      "Encrypted vault backups can still be offline-cracked with weak master passwords",
      "You must trust the vendor’s crypto implementation and ops",
    ],
    managers: [
      {
        name: "Bitwarden",
        brand: "bitwarden",
        verdict: "Best cloud option for cross-platform users",
        accent: "from-[#175DDC]/20 to-[#175DDC]/5 border-[#175DDC]/35",
        link: "https://bitwarden.com/",
        description:
          "Open-source software, end-to-end encrypted sync, passkey support, independent audits, and a strong free tier — the default recommendation when you need cloud sync outside Apple or Google.",
        highlights: [
          "Audited open-source clients",
          "Excellent free plan and family tiers",
          "Consistent experience across all major platforms",
        ],
      },
      {
        name: "LastPass",
        brand: "lastpass",
        verdict: "Legacy option — prefer Bitwarden for new users",
        accent: "from-[#D32D27]/15 to-[#D32D27]/5 border-[#D32D27]/35",
        caution: true,
        link: "https://www.lastpass.com/",
        description:
          "Helped popularize cloud password managers, but high-profile incidents involving stolen encrypted vault backups pushed many security professionals toward Bitwarden or local KeePass for new deployments.",
        highlights: [
          "Usable with strong master password + MFA if already invested",
          "Consider migrating if you are starting fresh",
        ],
      },
    ],
  },
] as const;

const COMPARISON_ROWS = [
  { priority: "Live in Apple’s ecosystem", pick: "Apple Passwords" },
  { priority: "Android & Chrome daily driver", pick: "Google Password Manager" },
  { priority: "Maximum privacy and file control", pick: "KeePass (local vault)" },
  { priority: "Cross-platform cloud sync", pick: "Bitwarden" },
  { priority: "Existing LastPass user", pick: "Continue if hardened; evaluate Bitwarden or KeePass" },
] as const;

const UNSAFE_SHARING = ["Email", "Slack", "Microsoft Teams", "WhatsApp", "Discord", "SMS"] as const;

const BEST_PRACTICES = [
  "Use a long, unique master password",
  "Enable multi-factor authentication on your password manager",
  "Never reuse passwords across websites",
  "Generate passwords with a password manager or Passwords.lu",
  "Save every password in your encrypted vault",
  "Enable passkeys whenever available",
  "Regularly review password health reports",
  "Share passwords through PrivateNote instead of email or chat",
  "For highly sensitive credentials, use PrivateNote’s optional password protection and deliver the password separately",
] as const;

const FAQ = [
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
] as const;

const OTHER_GUIDES = [
  { id: "vpn", title: "VPN Services" },
  { id: "messenger", title: "Secure Messaging" },
  { id: "email", title: "Secure Email" },
  { id: "browser", title: "Privacy Browsers" },
] as const;

export function PasswordManagersGuide() {
  const { language } = useLanguage();

  React.useEffect(() => {
    setDocumentMeta(
      buildDocumentTitle("Password Managers Guide"),
      "Create, store, and share passwords securely. Compare KeePass, Bitwarden, Apple, and Google — plus Passwords.lu generation and PrivateNote for one-time secret sharing.",
    );
  }, []);

  return (
    <div className="relative overflow-hidden pb-20">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/3 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute top-[35%] -right-16 h-72 w-72 rounded-full bg-violet-500/10 blur-[100px]" />
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-24 sm:px-6 lg:px-8">
        <motion.div {...REVEAL} className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
            Security guide
          </p>
          <h1 className="page-title text-gray-900 dark:text-white">Password Managers Guide</h1>
          <p className="mt-4 text-xl font-medium text-gray-800 dark:text-gray-200 sm:text-2xl">
            Create, Store, and Share Passwords Securely
          </p>
          <p className="mt-5 text-lg leading-relaxed text-gray-600 dark:text-gray-400">
            Passwords protect nearly every aspect of digital life — yet reuse and weak patterns remain
            one of the weakest links in cybersecurity. A password manager fixes that.
          </p>
        </motion.div>

        <motion.div {...REVEAL} transition={{ ...REVEAL.transition, delay: 0.1 }} className="mt-10">
          <PasswordVaultAnimation />
        </motion.div>
      </section>

      {/* Intro — credential stuffing */}
      <section className="mx-auto mt-20 max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div {...REVEAL} className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
            The problem isn&apos;t passwords themselves. It&apos;s how people use them. Many still reuse
            the same password across dozens of sites or make only small variations:
          </p>
        </motion.div>

        <motion.div
          {...REVEAL}
          transition={{ ...REVEAL.transition, delay: 0.06 }}
          className="mt-6 flex flex-wrap justify-center gap-2"
        >
          {REUSE_EXAMPLES.map((pw) => (
            <code
              key={pw}
              className="rounded-lg border border-red-200/80 bg-red-50/80 px-3 py-1.5 text-sm font-mono text-red-900 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200"
            >
              {pw}
            </code>
          ))}
        </motion.div>

        <motion.p
          {...REVEAL}
          transition={{ ...REVEAL.transition, delay: 0.1 }}
          className="mt-6 text-lg leading-relaxed text-gray-600 dark:text-gray-400"
        >
          If one website suffers a breach, attackers test those credentials everywhere — a technique
          called <strong className="text-gray-900 dark:text-white">credential stuffing</strong>,
          responsible for millions of compromised accounts every year. A password manager generates a
          different password for every account. You only need to remember one strong master password.
        </motion.p>
      </section>

      <SectionRule />

      {/* Why essential */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div {...REVEAL}>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Why password managers are essential
          </h2>
          <p className="mt-4 max-w-2xl text-gray-600 dark:text-gray-400">
            A good password manager dramatically improves both security and daily experience online.
          </p>
        </motion.div>

        <motion.ul
          {...REVEAL}
          transition={{ ...REVEAL.transition, delay: 0.06 }}
          className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          {ESSENTIAL_BENEFITS.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2.5 rounded-xl border border-indigo-200/50 bg-indigo-50/40 px-4 py-3 dark:border-indigo-900/40 dark:bg-indigo-950/20"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{item}</span>
            </li>
          ))}
        </motion.ul>
      </section>

      <SectionRule />

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div {...REVEAL}>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              How password managers work
            </h2>
            <p className="mt-4 leading-relaxed text-gray-600 dark:text-gray-400">
              Your credentials live inside an encrypted vault. When you create the vault, you choose a
              master password that derives the encryption keys protecting everything inside.
            </p>
            <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Modern cryptography typically includes:
            </p>
            <ul className="mt-3 space-y-2">
              {CRYPTO_POINTS.map((point) => (
                <li key={point} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <Lock className="h-4 w-4 shrink-0 text-indigo-600" />
                  {point}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              Because the vault is encrypted before storage or sync, reputable providers generally
              cannot read your passwords.
            </p>
          </motion.div>

          <motion.div {...REVEAL} transition={{ ...REVEAL.transition, delay: 0.08 }}>
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-primary">
              Once unlocked, your manager can:
            </p>
            <ul className="space-y-3">
              {VAULT_FEATURES.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 rounded-xl border border-gray-200/70 bg-white/60 px-4 py-3 dark:border-gray-800/70 dark:bg-gray-900/40"
                >
                  <KeyRound className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      <SectionRule />

      {/* Benefits bento */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.h2 {...REVEAL} className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
          Benefits of using a password manager
        </motion.h2>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {BENEFIT_BLOCKS.map((block, i) => (
            <motion.div
              key={block.title}
              {...REVEAL}
              transition={{ ...REVEAL.transition, delay: i * 0.05 }}
              className={`rounded-2xl border border-gray-200/70 p-5 dark:border-gray-800/70 ${
                i === 0 ? "md:col-span-2 lg:col-span-2 bg-gradient-to-br from-indigo-50/80 to-white dark:from-indigo-950/20 dark:to-gray-900/30" : "bg-white/50 dark:bg-gray-900/30"
              }`}
            >
              <h3 className="font-bold text-gray-900 dark:text-white">{block.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{block.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <SectionRule />

      {/* Passwords.lu partner */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          {...REVEAL}
          className="overflow-hidden rounded-[2rem] border border-[#6366f1]/25 bg-gradient-to-br from-[#6366f1]/10 via-white to-white p-6 sm:p-10 dark:from-[#6366f1]/15 dark:via-gray-950 dark:to-gray-950"
        >
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="flex items-center gap-3">
                <PasswordManagerBrandMark brand="passwords-lu" tile className="!p-2" />
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6366f1]">Partner tool</p>
              </div>
              <h2 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                Browser-based generation with Passwords.lu
              </h2>
              <p className="mt-4 leading-relaxed text-gray-600 dark:text-gray-400">
                Sometimes you only need a strong password — not a full vault workflow. Passwords.lu runs
                generation directly in your browser. Passwords are not uploaded to servers; no account
                required.
              </p>
              <p className="mt-4 text-sm font-medium text-gray-800 dark:text-gray-200">
                Recommended workflow: generate on Passwords.lu, then immediately save in your password manager.
              </p>
              <a
                href={PASSWORDS_LU_PARTNER_URLS.passwordGenerator}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#6366f1] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6366f1]/90"
              >
                Open password generator
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {PASSWORDS_LU_TOOLS.map((tool) => (
                <li key={tool} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <Sparkles className="h-4 w-4 shrink-0 text-[#6366f1]" />
                  {tool}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </section>

      <SectionRule />

      {/* Recommended managers — three paradigms */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div {...REVEAL} className="mb-12 max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Recommended password managers
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-gray-600 dark:text-gray-400">
            Think in three layers: platform-built tools for stability, local open-source vaults for
            control, and cloud managers when you need powerful sync — accepting the extra server-side
            risk that comes with it.
          </p>
        </motion.div>

        <div className="space-y-16">
          {MANAGER_TIERS.map((tier, tierIndex) => (
            <motion.div
              key={tier.id}
              {...REVEAL}
              transition={{ ...REVEAL.transition, delay: tierIndex * 0.06 }}
            >
              <ManagerTierHeader
                step={tier.step}
                title={tier.title}
                subtitle={tier.subtitle}
                tierId={tier.id}
              />

              <p className="mb-6 mt-6 max-w-3xl text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {tier.intro}
              </p>

              <div className="mb-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-emerald-200/60 bg-emerald-50/40 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
                    Strengths
                  </p>
                  <ul className="space-y-1.5">
                    {tier.pros.map((pro) => (
                      <li key={pro} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-amber-200/60 bg-amber-50/40 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-300">
                    Trade-offs
                  </p>
                  <ul className="space-y-1.5">
                    {tier.cons.map((con) => (
                      <li key={con} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
                        <MinusCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className={`grid gap-5 ${tier.managers.length > 1 ? "lg:grid-cols-2" : ""}`}>
                {tier.managers.map((manager) => (
                  <article
                    key={manager.name}
                    className={`rounded-[1.75rem] border bg-gradient-to-br p-6 ${manager.accent} ${
                      manager.caution ? "ring-1 ring-amber-300/50 dark:ring-amber-800/40" : ""
                    }`}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="max-w-xl">
                        <div className="flex flex-wrap items-center gap-3">
                          <PasswordManagerBrandMark brand={manager.brand} tile />
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-lg font-bold text-gray-900 dark:text-white">{manager.name}</h4>
                              {manager.caution && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-900 dark:bg-amber-950/50 dark:text-amber-200">
                                  <AlertTriangle className="h-3 w-3" />
                                  Caution
                                </span>
                              )}
                            </div>
                            <p className="mt-0.5 text-sm font-medium text-primary">{manager.verdict}</p>
                          </div>
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                          {manager.description}
                        </p>
                        <ul className="mt-4 space-y-1.5">
                          {manager.highlights.map((h) => (
                            <li key={h} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
                              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                              {h}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <a
                        href={manager.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
                      >
                        Learn more
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Comparison table */}
      <section className="mx-auto mt-16 max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          {...REVEAL}
          className="overflow-x-auto rounded-2xl border border-gray-200/70 dark:border-gray-800/70"
        >
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200/70 bg-gray-50/80 dark:border-gray-800/70 dark:bg-gray-900/50">
                <th className="px-5 py-4 font-semibold text-gray-900 dark:text-white">Your priority</th>
                <th className="px-5 py-4 font-semibold text-gray-900 dark:text-white">Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/70 dark:divide-gray-800/70">
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.priority}>
                  <td className="px-5 py-4 text-gray-600 dark:text-gray-400">{row.priority}</td>
                  <td className="px-5 py-4 font-medium text-gray-900 dark:text-white">{row.pick}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </section>

      <SectionRule />

      {/* Sharing securely */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <motion.div {...REVEAL}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              Sharing passwords securely
            </h2>
            <p className="mt-4 leading-relaxed text-gray-600 dark:text-gray-400">
              Even strong passwords sometimes need to be shared — with colleagues, family, IT admins,
              contractors, or clients. Too many people still send them through messaging platforms
              designed for chat, not secret delivery.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {UNSAFE_SHARING.map((channel) => (
                <span
                  key={channel}
                  className="inline-flex items-center gap-1 rounded-full border border-red-200/70 bg-red-50/60 px-3 py-1 text-xs font-medium text-red-800 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200"
                >
                  <XCircle className="h-3 w-3" />
                  {channel}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            {...REVEAL}
            transition={{ ...REVEAL.transition, delay: 0.08 }}
            className="rounded-2xl border border-primary/20 bg-primary/[0.04] p-6 dark:border-primary/25 dark:bg-primary/[0.08]"
          >
            <div className="flex items-center gap-2 text-primary">
              <Share2 className="h-5 w-5" />
              <span className="font-semibold">Use PrivateNote instead</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              PrivateNote encrypts secrets in your browser before upload. The server stores only
              ciphertext; the decryption key travels separately in the link. Notes can self-destruct
              after one read or expire on a schedule.
            </p>
            <ul className="mt-4 space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
              {["Passwords", "API keys", "Wi‑Fi credentials", "Recovery codes", "Temporary logins"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href={localizedPath("/", language)}
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              Create a secure one-time note
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Password-protected notes */}
      <section className="mx-auto mt-16 max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          {...REVEAL}
          className="rounded-2xl border border-gray-200/70 bg-white/60 p-6 dark:border-gray-800/70 dark:bg-gray-900/40 sm:p-8"
        >
          <div className="flex items-start gap-3">
            <Fingerprint className="mt-1 h-6 w-6 shrink-0 text-primary" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Extra protection with password-protected notes
              </h2>
              <p className="mt-3 leading-relaxed text-gray-600 dark:text-gray-400">
                Add an optional password to a PrivateNote. The recipient needs both the link and the
                separate password — ideally delivered through different channels (email the link, share
                the password by phone or in person).
              </p>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                Even if someone intercepts the link, they cannot reveal the secret without the password.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      <SectionRule />

      {/* Best practices */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div {...REVEAL}>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">Best practices</h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {BEST_PRACTICES.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                <Shield className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </section>

      <SectionRule />

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.h2 {...REVEAL} className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          Frequently asked questions
        </motion.h2>
        <div className="mt-8 space-y-3">
          {FAQ.map((item, i) => (
            <motion.details
              key={item.q}
              {...REVEAL}
              transition={{ ...REVEAL.transition, delay: i * 0.04 }}
              className="group rounded-xl border border-gray-200/70 bg-white/50 open:border-primary/30 dark:border-gray-800/70 dark:bg-gray-900/30"
            >
              <summary className="cursor-pointer list-none px-5 py-4 font-semibold text-gray-900 dark:text-white [&::-webkit-details-marker]:hidden">
                {item.q}
              </summary>
              <p className="border-t border-gray-200/70 px-5 py-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400 dark:border-gray-800/70">
                {item.a}
              </p>
            </motion.details>
          ))}
        </div>
      </section>

      {/* Final recommendation CTA */}
      <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          {...REVEAL}
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 via-primary to-violet-600 px-6 py-10 text-white sm:px-10 sm:py-12"
        >
          <div className="relative max-w-3xl">
            <h2 className="text-2xl font-bold sm:text-3xl">Final recommendation</h2>
            <p className="mt-4 leading-relaxed text-white/90">
              No single manager is perfect for everyone — but using one is among the most effective
              steps you can take. Pair it with Passwords.lu for fast generation and PrivateNote when
              you need to share secrets securely.
            </p>
            <ul className="mt-5 space-y-2.5 text-sm text-white/90">
              <li className="flex items-center gap-3">
                <div className="flex shrink-0 -space-x-1">
                  <PasswordManagerBrandMark brand="apple" tile className="!h-9 !w-9 !p-1.5" />
                  <PasswordManagerBrandMark brand="google" tile className="!h-9 !w-9 !p-1.5" />
                </div>
                <span><strong>Apple &amp; Google</strong> — stable platform defaults</span>
              </li>
              <li className="flex items-center gap-3">
                <PasswordManagerBrandMark brand="keepass" tile className="!h-9 !w-9 !p-1.5" />
                <span><strong>KeePass</strong> — local control, open source</span>
              </li>
              <li className="flex items-center gap-3">
                <PasswordManagerBrandMark brand="bitwarden" tile className="!h-9 !w-9 !p-1.5" />
                <span><strong>Bitwarden</strong> — cloud sync when you need every device</span>
              </li>
              <li className="flex items-center gap-3">
                <PasswordManagerBrandMark brand="passwords-lu" tile className="!h-9 !w-9 !p-1.5" />
                <span><strong>Passwords.lu</strong> — fast browser-local generation</span>
              </li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={localizedPath("/", language)}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-primary transition hover:bg-white/90"
              >
                Share a secret with PrivateNote
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={PASSWORDS_LU_PARTNER_URLS.site}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <PasswordManagerBrandMark brand="passwords-lu" className="h-5 w-5" />
                Visit passwords.lu
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <section className="mx-auto mt-16 max-w-6xl px-4 text-center sm:px-6 lg:px-8">
        <p className="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">Explore other guides</p>
        <div className="flex flex-wrap justify-center gap-2">
          {OTHER_GUIDES.map((g) => (
            <Link
              key={g.id}
              href={joinPublicPath("security-guides", g.id)}
              className="rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:border-primary/40 hover:text-primary dark:border-gray-700 dark:text-gray-300"
            >
              {g.title}
            </Link>
          ))}
          <Link
            href={localizedPath("/security-resources", language)}
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            All resources
          </Link>
        </div>
        <p className="mx-auto mt-10 max-w-xl text-xs text-gray-500 dark:text-gray-400">
          Educational guide only. We may earn a commission from affiliate links when you use
          recommended services, which helps support this free privacy resource.
        </p>
      </section>
    </div>
  );
}
