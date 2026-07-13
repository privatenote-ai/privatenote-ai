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
import { vpnGuideCopy } from "@/components/security-guides/locale";
import { joinPublicPath, localizedPath } from "@/utils/localizedPath";
import { buildDocumentTitle, setDocumentMeta } from "@/utils/documentMeta";
import { isLocalizedSecurityGuideTopic } from "@shared/localizedSecurityGuides";
import { VpnTunnelAnimation } from "@/components/security-guides/VpnTunnelAnimation";

const REVEAL = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-8%" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
} as const;

const PROVIDER_LAYOUT = [
  {
    id: "proton" as const,
    name: "Proton VPN",
    accent: "from-[#6d4aff]/20 to-[#6d4aff]/5 border-[#6d4aff]/30",
    link: "https://protonvpn.com/",
  },
  {
    id: "mullvad" as const,
    name: "Mullvad",
    accent: "from-[#294338]/25 to-[#294338]/5 border-emerald-500/30",
    link: "https://mullvad.net/",
  },
  {
    id: "nym" as const,
    name: "NymVPN",
    accent: "from-[#00d4aa]/20 to-[#00d4aa]/5 border-teal-400/30",
    link: "https://nymvpn.com/",
  },
] as const;

const USE_CASE_ICONS = [Wifi, MapPin, EyeOff, Shield] as const;

export function VpnServicesGuide() {
  const { language } = useLanguage();
  const copy = vpnGuideCopy(language);

  React.useEffect(() => {
    setDocumentMeta(buildDocumentTitle(copy.metaTitle), copy.metaDescription);
  }, [copy.metaTitle, copy.metaDescription]);

  return (
    <div className="relative overflow-hidden pb-20">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute top-[40%] -right-20 h-72 w-72 rounded-full bg-blue-500/10 blur-[100px]" />
        <div className="absolute bottom-0 -left-16 h-64 w-64 rounded-full bg-teal-500/10 blur-[90px]" />
      </div>

      <section className="mx-auto max-w-6xl px-4 pt-24 sm:px-6 lg:px-8">
        <motion.div {...REVEAL} className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary">{copy.heroLabel}</p>
          <h1 className="page-title text-gray-900 dark:text-white">{copy.heroTitle}</h1>
          <p className="mt-5 text-lg leading-relaxed text-gray-600 dark:text-gray-400 sm:text-xl">{copy.heroSubtitle}</p>
        </motion.div>

        <motion.div {...REVEAL} transition={{ ...REVEAL.transition, delay: 0.12 }} className="mt-10">
          <VpnTunnelAnimation />
        </motion.div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <motion.div {...REVEAL}>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              {copy.whatItDoesTitle}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-gray-600 dark:text-gray-400">{copy.whatItDoesBody}</p>
          </motion.div>

          <motion.ul {...REVEAL} transition={{ ...REVEAL.transition, delay: 0.08 }} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {copy.benefits.map((item, i) => (
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

      <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div {...REVEAL} className="overflow-hidden rounded-[2rem] border border-gray-200/70 dark:border-gray-800/70">
          <div className="grid md:grid-cols-2">
            <div className="border-b border-gray-200/70 bg-red-50/60 p-6 md:border-b-0 md:border-r dark:border-gray-800/70 dark:bg-red-950/20 sm:p-8">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-800 dark:bg-red-900/40 dark:text-red-200">
                <ShieldAlert className="h-3.5 w-3.5" />
                {copy.withoutVpnLabel}
              </div>
              <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">{copy.withoutVpnBody}</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                {copy.withoutVpnItems.map((item) => (
                  <li key={item} className="flex gap-2">
                    <XCircle className="h-4 w-4 shrink-0 text-red-500" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-primary/[0.08] to-blue-500/[0.06] p-6 sm:p-8 dark:from-primary/[0.12] dark:to-blue-500/[0.08]">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                <Shield className="h-3.5 w-3.5" />
                {copy.withVpnLabel}
              </div>
              <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">{copy.withVpnBody}</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                {copy.withVpnItems.map((item) => (
                  <li key={item} className="flex gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div {...REVEAL}>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">{copy.limitationsTitle}</h2>
          <p className="mt-3 max-w-3xl text-gray-600 dark:text-gray-400">{copy.limitationsIntro}</p>
        </motion.div>

        <motion.div {...REVEAL} transition={{ ...REVEAL.transition, delay: 0.06 }} className="mt-6 grid gap-3 sm:grid-cols-2">
          {copy.limitations.map((item) => (
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
          <p className="text-sm leading-relaxed text-amber-950 dark:text-amber-100">{copy.limitationsCallout}</p>
        </motion.div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div {...REVEAL} className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">{copy.whenToUseTitle}</h2>
          <p className="mt-3 max-w-2xl text-gray-600 dark:text-gray-400">{copy.whenToUseIntro}</p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {copy.useCases.map((item, i) => {
            const Icon = USE_CASE_ICONS[i] ?? Shield;
            return (
              <motion.div
                key={item.label}
                {...REVEAL}
                transition={{ ...REVEAL.transition, delay: i * 0.06 }}
                className="group rounded-2xl border border-gray-200/70 bg-white/50 p-5 backdrop-blur-sm transition-colors hover:border-primary/30 dark:border-gray-800/70 dark:bg-gray-900/30"
              >
                <Icon className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
                <p className="mt-3 font-semibold text-gray-900 dark:text-white">{item.label}</p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{item.detail}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div {...REVEAL} className="border-y border-gray-200/80 py-10 dark:border-gray-800/80">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">{copy.trustTitle}</h2>
          <div className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {copy.trustSignals.map((item) => (
              <div key={item} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div {...REVEAL} className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">{copy.providersTitle}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600 dark:text-gray-400">{copy.providersIntro}</p>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-3">
          {PROVIDER_LAYOUT.map((provider, i) => {
            const providerCopy = copy.providers[provider.id];
            return (
              <motion.article
                key={provider.id}
                {...REVEAL}
                transition={{ ...REVEAL.transition, delay: i * 0.08 }}
                className={`relative flex flex-col overflow-hidden rounded-[1.75rem] border bg-gradient-to-b p-6 ${provider.accent}`}
              >
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{provider.name}</h3>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wide text-primary">{providerCopy.tagline}</p>
                </div>
                <p className="flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{providerCopy.description}</p>
                <ul className="mt-5 space-y-2 border-t border-gray-200/50 pt-4 dark:border-gray-700/50">
                  {providerCopy.highlights.map((h) => (
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
                  {providerCopy.visitLabel}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div {...REVEAL} className="overflow-x-auto rounded-2xl border border-gray-200/70 dark:border-gray-800/70">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200/70 bg-gray-50/80 dark:border-gray-800/70 dark:bg-gray-900/50">
                <th className="px-5 py-4 font-semibold text-gray-900 dark:text-white">{copy.comparisonHeaders.bestFor}</th>
                <th className="px-5 py-4 font-semibold text-gray-900 dark:text-white">{copy.comparisonHeaders.proton}</th>
                <th className="px-5 py-4 font-semibold text-gray-900 dark:text-white">{copy.comparisonHeaders.mullvad}</th>
                <th className="px-5 py-4 font-semibold text-gray-900 dark:text-white">{copy.comparisonHeaders.nym}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/70 dark:divide-gray-800/70">
              {(
                [
                  copy.comparisonRows.privacyJurisdiction,
                  copy.comparisonRows.signup,
                  copy.comparisonRows.standout,
                  copy.comparisonRows.idealUser,
                ] as const
              ).map((row) => (
                <tr key={row.label}>
                  <td className="px-5 py-4 text-gray-600 dark:text-gray-400">{row.label}</td>
                  <td className="px-5 py-4">{row.proton}</td>
                  <td className="px-5 py-4">{row.mullvad}</td>
                  <td className="px-5 py-4">{row.nym}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          {...REVEAL}
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary via-primary to-blue-600 px-6 py-10 text-white sm:px-10 sm:py-12"
        >
          <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="relative max-w-2xl">
            <h2 className="text-2xl font-bold sm:text-3xl">{copy.ctaTitle}</h2>
            <p className="mt-4 leading-relaxed text-white/90">{copy.ctaBody}</p>
            <Link
              href={localizedPath("/", language)}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-primary transition hover:bg-white/90"
            >
              {copy.ctaButton}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-4 text-center sm:px-6 lg:px-8">
        <p className="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">{copy.exploreOther}</p>
        <div className="flex flex-wrap justify-center gap-2">
          {copy.otherGuides.map((g) => (
            <Link
              key={g.id}
              href={
                isLocalizedSecurityGuideTopic(g.id)
                  ? localizedPath(`/security-guides/${g.id}`, language)
                  : joinPublicPath("security-guides", g.id)
              }
              className="rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:border-primary/40 hover:text-primary dark:border-gray-700 dark:text-gray-300"
            >
              {g.title}
            </Link>
          ))}
          <Link
            href={localizedPath("/security-resources", language)}
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            {copy.allResources}
          </Link>
        </div>
        <p className="mx-auto mt-10 max-w-xl text-xs text-gray-500 dark:text-gray-400">{copy.affiliateDisclaimer}</p>
      </section>
    </div>
  );
}
