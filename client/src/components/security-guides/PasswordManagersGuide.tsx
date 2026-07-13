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
import { passwordManagersGuideCopy } from "@/components/security-guides/locale";
import { PASSWORDS_LU_PARTNER_URLS } from "@/config/passwordsLuPartner";
import { joinPublicPath, localizedPath } from "@/utils/localizedPath";
import { buildDocumentTitle, setDocumentMeta } from "@/utils/documentMeta";
import { isLocalizedSecurityGuideTopic } from "@shared/localizedSecurityGuides";
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

const TIER_LAYOUT = [
  {
    id: "platform" as const,
    step: "1",
    managers: [
      {
        id: "apple" as const,
        name: "Apple Passwords",
        brand: "apple" as PasswordManagerBrand,
        accent:
          "from-[#A2AAAD]/20 via-[#1d1d1f]/5 to-white border-[#A2AAAD]/45 dark:from-[#A2AAAD]/15 dark:via-[#1d1d1f]/20 dark:to-gray-950",
        link: "https://support.apple.com/120758",
      },
      {
        id: "google" as const,
        name: "Google Password Manager",
        brand: "google" as PasswordManagerBrand,
        accent:
          "from-[#4285F4]/15 via-[#34A853]/5 to-white border-[#4285F4]/35 dark:from-[#4285F4]/15 dark:via-[#34A853]/5 dark:to-gray-950",
        link: "https://passwords.google.com/",
      },
    ],
  },
  {
    id: "local" as const,
    step: "2",
    managers: [
      {
        id: "keepass" as const,
        name: "KeePass",
        brand: "keepass" as PasswordManagerBrand,
        accent:
          "from-[#6CA338]/20 via-[#6CA338]/5 to-white border-[#6CA338]/40 dark:from-[#6CA338]/15 dark:via-[#6CA338]/5 dark:to-gray-950",
        link: "https://keepass.info/",
      },
    ],
  },
  {
    id: "cloud" as const,
    step: "3",
    managers: [
      {
        id: "bitwarden" as const,
        name: "Bitwarden",
        brand: "bitwarden" as PasswordManagerBrand,
        accent: "from-[#175DDC]/20 to-[#175DDC]/5 border-[#175DDC]/35",
        link: "https://bitwarden.com/",
      },
      {
        id: "lastpass" as const,
        name: "LastPass",
        brand: "lastpass" as PasswordManagerBrand,
        accent: "from-[#D32D27]/15 to-[#D32D27]/5 border-[#D32D27]/35",
        link: "https://www.lastpass.com/",
        caution: true,
      },
    ],
  },
] as const;

export function PasswordManagersGuide() {
  const { language } = useLanguage();
  const copy = passwordManagersGuideCopy(language);

  React.useEffect(() => {
    setDocumentMeta(buildDocumentTitle(copy.metaTitle), copy.metaDescription);
  }, [copy.metaTitle, copy.metaDescription]);

  return (
    <div className="relative overflow-hidden pb-20">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/3 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute top-[35%] -right-16 h-72 w-72 rounded-full bg-violet-500/10 blur-[100px]" />
      </div>

      <section className="mx-auto max-w-6xl px-4 pt-24 sm:px-6 lg:px-8">
        <motion.div {...REVEAL} className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
            {copy.heroLabel}
          </p>
          <h1 className="page-title text-gray-900 dark:text-white">{copy.heroTitle}</h1>
          <p className="mt-4 text-xl font-medium text-gray-800 dark:text-gray-200 sm:text-2xl">{copy.heroTagline}</p>
          <p className="mt-5 text-lg leading-relaxed text-gray-600 dark:text-gray-400">{copy.heroSubtitle}</p>
        </motion.div>

        <motion.div {...REVEAL} transition={{ ...REVEAL.transition, delay: 0.1 }} className="mt-10">
          <PasswordVaultAnimation />
        </motion.div>
      </section>

      <section className="mx-auto mt-20 max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div {...REVEAL} className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">{copy.introLead}</p>
        </motion.div>

        <motion.div {...REVEAL} transition={{ ...REVEAL.transition, delay: 0.06 }} className="mt-6 flex flex-wrap justify-center gap-2">
          {copy.reuseExamples.map((pw) => (
            <code
              key={pw}
              className="rounded-lg border border-red-200/80 bg-red-50/80 px-3 py-1.5 text-sm font-mono text-red-900 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200"
            >
              {pw}
            </code>
          ))}
        </motion.div>

        <motion.p {...REVEAL} transition={{ ...REVEAL.transition, delay: 0.1 }} className="mt-6 text-lg leading-relaxed text-gray-600 dark:text-gray-400">
          {copy.credentialStuffing}
        </motion.p>
      </section>

      <SectionRule />

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div {...REVEAL}>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">{copy.essentialTitle}</h2>
          <p className="mt-4 max-w-2xl text-gray-600 dark:text-gray-400">{copy.essentialIntro}</p>
        </motion.div>

        <motion.ul {...REVEAL} transition={{ ...REVEAL.transition, delay: 0.06 }} className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {copy.essentialBenefits.map((item) => (
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

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div {...REVEAL}>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{copy.howItWorksTitle}</h2>
            <p className="mt-4 leading-relaxed text-gray-600 dark:text-gray-400">{copy.howItWorksBody1}</p>
            <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{copy.cryptoLabel}</p>
            <ul className="mt-3 space-y-2">
              {copy.cryptoPoints.map((point) => (
                <li key={point} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <Lock className="h-4 w-4 shrink-0 text-indigo-600" />
                  {point}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{copy.howItWorksBody2}</p>
          </motion.div>

          <motion.div {...REVEAL} transition={{ ...REVEAL.transition, delay: 0.08 }}>
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-primary">{copy.unlockedLabel}</p>
            <ul className="space-y-3">
              {copy.vaultFeatures.map((feature) => (
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

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.h2 {...REVEAL} className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
          {copy.benefitsTitle}
        </motion.h2>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {copy.benefitBlocks.map((block, i) => (
            <motion.div
              key={block.title}
              {...REVEAL}
              transition={{ ...REVEAL.transition, delay: i * 0.05 }}
              className={`rounded-2xl border border-gray-200/70 p-5 dark:border-gray-800/70 ${
                i === 0
                  ? "md:col-span-2 lg:col-span-2 bg-gradient-to-br from-indigo-50/80 to-white dark:from-indigo-950/20 dark:to-gray-900/30"
                  : "bg-white/50 dark:bg-gray-900/30"
              }`}
            >
              <h3 className="font-bold text-gray-900 dark:text-white">{block.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{block.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <SectionRule />

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          {...REVEAL}
          className="overflow-hidden rounded-[2rem] border border-[#6366f1]/25 bg-gradient-to-br from-[#6366f1]/10 via-white to-white p-6 sm:p-10 dark:from-[#6366f1]/15 dark:via-gray-950 dark:to-gray-950"
        >
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="flex items-center gap-3">
                <PasswordManagerBrandMark brand="passwords-lu" tile className="!p-2" />
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6366f1]">{copy.passwordsLuPartnerLabel}</p>
              </div>
              <h2 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">{copy.passwordsLuTitle}</h2>
              <p className="mt-4 leading-relaxed text-gray-600 dark:text-gray-400">{copy.passwordsLuBody}</p>
              <p className="mt-4 text-sm font-medium text-gray-800 dark:text-gray-200">{copy.passwordsLuWorkflow}</p>
              <a
                href={PASSWORDS_LU_PARTNER_URLS.passwordGenerator}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#6366f1] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6366f1]/90"
              >
                {copy.passwordsLuCta}
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {copy.passwordsLuTools.map((tool) => (
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

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div {...REVEAL} className="mb-12 max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">{copy.recommendedTitle}</h2>
          <p className="mt-4 text-lg leading-relaxed text-gray-600 dark:text-gray-400">{copy.recommendedIntro}</p>
        </motion.div>

        <div className="space-y-16">
          {TIER_LAYOUT.map((tierLayout, tierIndex) => {
            const tier = copy.tiers[tierLayout.id];
            return (
              <motion.div key={tierLayout.id} {...REVEAL} transition={{ ...REVEAL.transition, delay: tierIndex * 0.06 }}>
                <ManagerTierHeader step={tierLayout.step} title={tier.title} subtitle={tier.subtitle} tierId={tierLayout.id} />
                <p className="mb-6 mt-6 max-w-3xl text-sm leading-relaxed text-gray-600 dark:text-gray-400">{tier.intro}</p>

                <div className="mb-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-emerald-200/60 bg-emerald-50/40 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
                      {tier.strengthsLabel}
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
                      {tier.tradeoffsLabel}
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

                <div className={`grid gap-5 ${tierLayout.managers.length > 1 ? "lg:grid-cols-2" : ""}`}>
                  {tierLayout.managers.map((managerLayout) => {
                    const manager = tier.managers[managerLayout.id];
                    return (
                      <article
                        key={managerLayout.id}
                        className={`rounded-[1.75rem] border bg-gradient-to-br p-6 ${managerLayout.accent} ${
                          managerLayout.caution ? "ring-1 ring-amber-300/50 dark:ring-amber-800/40" : ""
                        }`}
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="max-w-xl">
                            <div className="flex flex-wrap items-center gap-3">
                              <PasswordManagerBrandMark brand={managerLayout.brand} tile />
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">{managerLayout.name}</h4>
                                  {managerLayout.caution && manager.caution && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-900 dark:bg-amber-950/50 dark:text-amber-200">
                                      <AlertTriangle className="h-3 w-3" />
                                      {manager.caution}
                                    </span>
                                  )}
                                </div>
                                <p className="mt-0.5 text-sm font-medium text-primary">{manager.verdict}</p>
                              </div>
                            </div>
                            <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{manager.description}</p>
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
                            href={managerLayout.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
                          >
                            {manager.learnMore}
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div {...REVEAL} className="overflow-x-auto rounded-2xl border border-gray-200/70 dark:border-gray-800/70">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200/70 bg-gray-50/80 dark:border-gray-800/70 dark:bg-gray-900/50">
                <th className="px-5 py-4 font-semibold text-gray-900 dark:text-white">{copy.comparisonHeaders.priority}</th>
                <th className="px-5 py-4 font-semibold text-gray-900 dark:text-white">{copy.comparisonHeaders.recommendation}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/70 dark:divide-gray-800/70">
              {copy.comparisonRows.map((row) => (
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

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <motion.div {...REVEAL}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">{copy.sharingTitle}</h2>
            <p className="mt-4 leading-relaxed text-gray-600 dark:text-gray-400">{copy.sharingBody}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {copy.unsafeChannels.map((channel) => (
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
              <span className="font-semibold">{copy.privateNoteSharingTitle}</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">{copy.privateNoteSharingBody}</p>
            <ul className="mt-4 space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
              {copy.privateNoteSharingItems.map((item) => (
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
              {copy.privateNoteSharingCta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div {...REVEAL} className="rounded-2xl border border-gray-200/70 bg-white/60 p-6 dark:border-gray-800/70 dark:bg-gray-900/40 sm:p-8">
          <div className="flex items-start gap-3">
            <Fingerprint className="mt-1 h-6 w-6 shrink-0 text-primary" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{copy.passwordProtectedTitle}</h2>
              <p className="mt-3 leading-relaxed text-gray-600 dark:text-gray-400">{copy.passwordProtectedBody1}</p>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{copy.passwordProtectedBody2}</p>
            </div>
          </div>
        </motion.div>
      </section>

      <SectionRule />

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div {...REVEAL}>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">{copy.bestPracticesTitle}</h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {copy.bestPractices.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
                <Shield className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </section>

      <SectionRule />

      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.h2 {...REVEAL} className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          {copy.faqTitle}
        </motion.h2>
        <div className="mt-8 space-y-3">
          {copy.faq.map((item, i) => (
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

      <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          {...REVEAL}
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 via-primary to-violet-600 px-6 py-10 text-white sm:px-10 sm:py-12"
        >
          <div className="relative max-w-3xl">
            <h2 className="text-2xl font-bold sm:text-3xl">{copy.finalTitle}</h2>
            <p className="mt-4 leading-relaxed text-white/90">{copy.finalBody}</p>
            <ul className="mt-5 space-y-2.5 text-sm text-white/90">
              {copy.finalBullets.map((bullet) => (
                <li key={bullet.label} className="flex items-center gap-3">
                  {bullet.label === "Apple & Google" && (
                    <div className="flex shrink-0 -space-x-1">
                      <PasswordManagerBrandMark brand="apple" tile className="!h-9 !w-9 !p-1.5" />
                      <PasswordManagerBrandMark brand="google" tile className="!h-9 !w-9 !p-1.5" />
                    </div>
                  )}
                  {bullet.label === "KeePass" && (
                    <PasswordManagerBrandMark brand="keepass" tile className="!h-9 !w-9 !p-1.5" />
                  )}
                  {bullet.label === "Bitwarden" && (
                    <PasswordManagerBrandMark brand="bitwarden" tile className="!h-9 !w-9 !p-1.5" />
                  )}
                  {bullet.label === "Passwords.lu" && (
                    <PasswordManagerBrandMark brand="passwords-lu" tile className="!h-9 !w-9 !p-1.5" />
                  )}
                  <span>
                    <strong>{bullet.label}</strong> — {bullet.text}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={localizedPath("/", language)}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-primary transition hover:bg-white/90"
              >
                {copy.finalCtaPrivateNote}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={PASSWORDS_LU_PARTNER_URLS.site}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <PasswordManagerBrandMark brand="passwords-lu" className="h-5 w-5" />
                {copy.finalCtaPasswordsLu}
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
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
