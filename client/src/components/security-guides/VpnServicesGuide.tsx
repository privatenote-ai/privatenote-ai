import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  EyeOff,
  MapPin,
  Shield,
  ShieldAlert,
  Wifi,
  XCircle,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { joinPublicPath, localizedPath } from "@/utils/localizedPath";
import { buildDocumentTitle, setDocumentMeta } from "@/utils/documentMeta";
import { VpnTunnelAnimation } from "@/components/security-guides/VpnTunnelAnimation";

const REVEAL = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-8%" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
} as const;

const PROVIDERS = [
  {
    name: "Proton VPN",
    accent: "from-[#6d4aff]/20 to-[#6d4aff]/5 border-[#6d4aff]/30",
    tagline: "Swiss privacy law · audited no-logs · Proton ecosystem",
    description:
      "Built by Proton AG — the team behind Proton Mail. Open-source apps, independent audits, Secure Core routing, and optional Tor-over-VPN.",
    link: "https://protonvpn.com/",
    highlights: ["Swiss jurisdiction", "Audited no-logs", "Free tier available", "Open-source clients"],
  },
  {
    name: "Mullvad",
    accent: "from-[#294338]/25 to-[#294338]/5 border-emerald-500/30",
    tagline: "No email · account number only · cash & crypto",
    description:
      "Swedish VPN with anonymous account numbers, flat pricing, and payment options that keep your identity separate from your subscription.",
    link: "https://mullvad.net/",
    highlights: ["No email signup", "WireGuard + OpenVPN", "Cash & crypto accepted", "Audited infrastructure"],
  },
  {
    name: "NymVPN",
    accent: "from-[#00d4aa]/20 to-[#00d4aa]/5 border-teal-400/30",
    tagline: "Mixnet routing · beyond standard tunneling",
    description:
      "Adds mixnet technology on top of VPN encryption — breaking and reordering packets to resist traffic analysis, not just hide your IP.",
    link: "https://nymvpn.com/",
    highlights: ["WireGuard + mixnet modes", "Decentralized routing", "Traffic-analysis resistant", "Research-backed team"],
  },
] as const;

const BENEFITS = [
  "Encrypts traffic between your device and the VPN server",
  "Hides your real IP from sites and services you visit",
  "Protects against passive snooping on untrusted Wi‑Fi",
  "Reduces ISP-level DNS and destination metadata tracking",
] as const;

const LIMITATIONS = [
  "Does not make you anonymous if you stay logged into Google, Facebook, or work accounts",
  "Does not stop phishing, malware, or weak passwords",
  "Does not encrypt chat content unless the app already uses end-to-end encryption",
  "Does not replace secure sharing for passwords, API keys, or recovery codes",
] as const;

const USE_CASES = [
  { icon: Wifi, label: "Public Wi‑Fi", detail: "Airports, hotels, cafés" },
  { icon: MapPin, label: "Travel", detail: "Foreign networks & roaming" },
  { icon: EyeOff, label: "ISP metadata", detail: "Less home-network logging" },
  { icon: Shield, label: "Sensitive work", detail: "Research & journalism" },
] as const;

const TRUST_SIGNALS = [
  "Independently audited no-logs policy",
  "Transparent ownership and jurisdiction",
  "WireGuard or OpenVPN with strong encryption",
  "Open-source or reproducible client builds",
  "Honest metadata and billing disclosures",
  "No “100% anonymous” marketing hype",
] as const;

const OTHER_GUIDES = [
  { id: "password", title: "Password Managers" },
  { id: "messenger", title: "Secure Messaging" },
  { id: "email", title: "Secure Email" },
  { id: "browser", title: "Privacy Browsers" },
] as const;

export function VpnServicesGuide() {
  const { language } = useLanguage();

  React.useEffect(() => {
    setDocumentMeta(
      buildDocumentTitle("VPN Services Guide"),
      "Choose a reputable VPN with confidence. Compare Proton VPN, Mullvad, and NymVPN — what VPNs protect, what they cannot fix, and how they fit with secure secret sharing.",
    );
  }, []);

  return (
    <div className="relative overflow-hidden pb-20">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute top-[40%] -right-20 h-72 w-72 rounded-full bg-blue-500/10 blur-[100px]" />
        <div className="absolute bottom-0 -left-16 h-64 w-64 rounded-full bg-teal-500/10 blur-[90px]" />
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-24 sm:px-6 lg:px-8">
        <motion.div {...REVEAL} className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Security guide
          </p>
          <h1 className="page-title text-gray-900 dark:text-white">VPN Services Guide</h1>
          <p className="mt-5 text-lg leading-relaxed text-gray-600 dark:text-gray-400 sm:text-xl">
            A practical guide to choosing a reputable VPN — what they protect, what they cannot fix,
            and why Proton VPN, Mullvad, and NymVPN stand out for privacy-conscious users.
          </p>
        </motion.div>

        <motion.div {...REVEAL} transition={{ ...REVEAL.transition, delay: 0.12 }} className="mt-10">
          <VpnTunnelAnimation />
        </motion.div>
      </section>

      {/* What it does — editorial, not a card */}
      <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <motion.div {...REVEAL}>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              What a VPN actually does
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-gray-600 dark:text-gray-400">
              A Virtual Private Network creates an encrypted tunnel between your device and a VPN
              server. Traffic leaving your device is encrypted, and websites see the VPN server&apos;s
              IP address instead of yours — reducing what your ISP, the café Wi‑Fi operator, or
              someone on the same network can observe.
            </p>
          </motion.div>

          <motion.ul {...REVEAL} transition={{ ...REVEAL.transition, delay: 0.08 }} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {BENEFITS.map((item, i) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-primary/15 bg-primary/[0.04] px-4 py-3.5 dark:border-primary/20 dark:bg-primary/[0.07]"
              >
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                  {i + 1}
                </span>
                <span className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{item}</span>
              </li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* Without vs With VPN contrast band */}
      <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          {...REVEAL}
          className="overflow-hidden rounded-[2rem] border border-gray-200/70 dark:border-gray-800/70"
        >
          <div className="grid md:grid-cols-2">
            <div className="border-b border-gray-200/70 bg-red-50/60 p-6 md:border-b-0 md:border-r dark:border-gray-800/70 dark:bg-red-950/20 sm:p-8">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-800 dark:bg-red-900/40 dark:text-red-200">
                <ShieldAlert className="h-3.5 w-3.5" />
                Without VPN
              </div>
              <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                Your device talks directly to the website. The Wi‑Fi operator and ISP can see
                connection metadata — and on hostile networks, traffic may be intercepted.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex gap-2"><XCircle className="h-4 w-4 shrink-0 text-red-500" /> Real IP visible to sites</li>
                <li className="flex gap-2"><XCircle className="h-4 w-4 shrink-0 text-red-500" /> ISP sees destinations &amp; DNS</li>
                <li className="flex gap-2"><XCircle className="h-4 w-4 shrink-0 text-red-500" /> Public Wi‑Fi exposure</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-primary/[0.08] to-blue-500/[0.06] p-6 sm:p-8 dark:from-primary/[0.12] dark:to-blue-500/[0.08]">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                <Shield className="h-3.5 w-3.5" />
                With VPN
              </div>
              <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                Traffic is wrapped in encryption to the VPN server first. Observers on the local
                network see encrypted packets — not which sites you visit.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-primary" /> Sites see VPN exit IP</li>
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-primary" /> Encrypted tunnel to server</li>
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-primary" /> Safer on untrusted networks</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Limitations — warning strip */}
      <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div {...REVEAL}>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            What a VPN does not do
          </h2>
          <p className="mt-3 max-w-3xl text-gray-600 dark:text-gray-400">
            VPNs are useful, but not a magic invisibility cloak — especially when sharing secrets.
          </p>
        </motion.div>

        <motion.div
          {...REVEAL}
          transition={{ ...REVEAL.transition, delay: 0.06 }}
          className="mt-6 grid gap-3 sm:grid-cols-2"
        >
          {LIMITATIONS.map((item) => (
            <div
              key={item}
              className="flex items-start gap-3 rounded-xl border border-amber-200/60 bg-amber-50/50 px-4 py-3.5 dark:border-amber-900/40 dark:bg-amber-950/20"
            >
              <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
              <span className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{item}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          {...REVEAL}
          transition={{ ...REVEAL.transition, delay: 0.1 }}
          className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-300/50 bg-gradient-to-r from-amber-50 to-orange-50/50 p-5 dark:border-amber-800/40 dark:from-amber-950/30 dark:to-orange-950/20"
        >
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-sm leading-relaxed text-amber-950 dark:text-amber-100">
            For one-time secrets — passwords, seed phrases, API keys — use end-to-end encrypted
            sharing like PrivateNote. A VPN protects the pipe; it does not protect what you paste
            into email, Slack, or SMS.
          </p>
        </motion.div>
      </section>

      {/* When to use — icon grid */}
      <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div {...REVEAL} className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">When to use a VPN</h2>
          <p className="mt-3 max-w-2xl text-gray-600 dark:text-gray-400">
            You do not need one 24/7 unless your threat model calls for it — but these are the
            situations where a reputable VPN earns its place.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {USE_CASES.map((item, i) => (
            <motion.div
              key={item.label}
              {...REVEAL}
              transition={{ ...REVEAL.transition, delay: i * 0.06 }}
              className="group rounded-2xl border border-gray-200/70 bg-white/50 p-5 backdrop-blur-sm transition-colors hover:border-primary/30 dark:border-gray-800/70 dark:bg-gray-900/30"
            >
              <item.icon className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
              <p className="mt-3 font-semibold text-gray-900 dark:text-white">{item.label}</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{item.detail}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust checklist — horizontal rule layout */}
      <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div {...REVEAL} className="border-y border-gray-200/80 py-10 dark:border-gray-800/80">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            How to spot a reputable VPN
          </h2>
          <div className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {TRUST_SIGNALS.map((item) => (
              <div key={item} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Providers — bento-style, not uniform cards */}
      <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div {...REVEAL} className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Recommended providers
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600 dark:text-gray-400">
            Three privacy-first VPNs from reputable teams — pick based on Swiss law, anonymous
            signup, or mixnet-level routing.
          </p>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-3">
          {PROVIDERS.map((provider, i) => (
            <motion.article
              key={provider.name}
              {...REVEAL}
              transition={{ ...REVEAL.transition, delay: i * 0.08 }}
              className={`relative flex flex-col overflow-hidden rounded-[1.75rem] border bg-gradient-to-b p-6 ${provider.accent}`}
            >
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{provider.name}</h3>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-primary">{provider.tagline}</p>
              </div>
              <p className="flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {provider.description}
              </p>
              <ul className="mt-5 space-y-2 border-t border-gray-200/50 pt-4 dark:border-gray-700/50">
                {provider.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {h}
                  </li>
                ))}
              </ul>
              <a
                href={provider.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
              >
                Visit {provider.name}
                <ExternalLink className="h-4 w-4" />
              </a>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Comparison table */}
      <section className="mx-auto mt-16 max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          {...REVEAL}
          className="overflow-x-auto rounded-2xl border border-gray-200/70 dark:border-gray-800/70"
        >
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200/70 bg-gray-50/80 dark:border-gray-800/70 dark:bg-gray-900/50">
                <th className="px-5 py-4 font-semibold text-gray-900 dark:text-white">Best for</th>
                <th className="px-5 py-4 font-semibold text-gray-900 dark:text-white">Proton VPN</th>
                <th className="px-5 py-4 font-semibold text-gray-900 dark:text-white">Mullvad</th>
                <th className="px-5 py-4 font-semibold text-gray-900 dark:text-white">NymVPN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/70 dark:divide-gray-800/70">
              <tr>
                <td className="px-5 py-4 text-gray-600 dark:text-gray-400">Privacy jurisdiction</td>
                <td className="px-5 py-4">Switzerland</td>
                <td className="px-5 py-4">Sweden</td>
                <td className="px-5 py-4">Decentralized mixnet</td>
              </tr>
              <tr>
                <td className="px-5 py-4 text-gray-600 dark:text-gray-400">Signup</td>
                <td className="px-5 py-4">Email account</td>
                <td className="px-5 py-4">Random account #</td>
                <td className="px-5 py-4">Standard account</td>
              </tr>
              <tr>
                <td className="px-5 py-4 text-gray-600 dark:text-gray-400">Stand-out feature</td>
                <td className="px-5 py-4">Secure Core + Tor</td>
                <td className="px-5 py-4">Cash/crypto payment</td>
                <td className="px-5 py-4">Mixnet routing</td>
              </tr>
              <tr>
                <td className="px-5 py-4 text-gray-600 dark:text-gray-400">Ideal user</td>
                <td className="px-5 py-4">Proton ecosystem fans</td>
                <td className="px-5 py-4">Maximum signup anonymity</td>
                <td className="px-5 py-4">Traffic-analysis resistance</td>
              </tr>
            </tbody>
          </table>
        </motion.div>
      </section>

      {/* PrivateNote CTA */}
      <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          {...REVEAL}
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary via-primary to-blue-600 px-6 py-10 text-white sm:px-10 sm:py-12"
        >
          <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="relative max-w-2xl">
            <h2 className="text-2xl font-bold sm:text-3xl">VPN + PrivateNote: different jobs</h2>
            <p className="mt-4 leading-relaxed text-white/90">
              A VPN protects your connection. PrivateNote protects the secret itself — encrypted
              in your browser before upload, self-destructing after one read.
            </p>
            <Link
              href={localizedPath("/", language)}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-primary transition hover:bg-white/90"
            >
              Create a secure one-time note
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer links */}
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
