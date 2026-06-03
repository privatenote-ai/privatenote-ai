import React from "react";
import { Link } from "wouter";
import { motion, MotionConfig } from "framer-motion";
import {
  Check,
  Cloud,
  Cpu,
  Lock,
  PenLine,
  Share2,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { localizedPath } from "@/utils/localizedPath";

export default function HowItWorks() {
  const { t, language } = useLanguage();
  const flowSteps = [
    {
      title: t.write,
      detail: t.writeStepDetail,
      icon: <PenLine className="h-5 w-5" />,
    },
    {
      title: t.encrypt,
      detail: t.howEncryptStepDetail,
      icon: <Lock className="h-5 w-5" />,
    },
    {
      title: t.share,
      detail: t.shareStepDetail,
      icon: <Share2 className="h-5 w-5" />,
    },
  ];
  const infrastructureItems = [
    t.howInfrastructureItemCiphertext,
    t.howInfrastructureItemMinimizedData,
    t.howInfrastructureItemEuStorage,
  ];

  return (
    <MotionConfig reducedMotion="user">
    <div className="mx-auto max-w-5xl overflow-x-clip px-4 sm:px-6 lg:px-8 pt-24 pb-20 mb-20 relative">
      {/* Reduced background glows (less noise) */}
      <div className="absolute top-[-80px] right-1/4 w-80 h-80 bg-primary/10 blur-[130px] -z-10" />
      <div className="absolute bottom-[120px] left-1/4 w-56 h-56 bg-blue-500/10 blur-[120px] -z-10" />

      {/* Hero Header */}
      <div className="text-center mb-12 relative z-10">
        <h1 className="page-title mb-10 pb-2 leading-[1.05] bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 relative z-10">
          {t.howHeroPrefix} <span className="text-primary italic">{t.howHeroAccent}</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed relative z-10">
          {t.howHeroSubtitle}
        </p>
      </div>

      {/* Tighter vertical rhythm overall */}
      <div className="space-y-16">
        <section className="py-6 mt-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t.simplePrivacyFlow}
              </h2>
              <p className="mt-4 mb-6 text-sm text-gray-600 dark:text-gray-300">
                {t.clearSteps}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {flowSteps.map((step) => (
              <div key={step.title} className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
                    {step.icon}
                  </span>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {step.title}
                  </p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>

        </section>

        {/* Infrastructure & Manual Reveal */}
        <section className="relative isolate space-y-20 pt-10 lg:space-y-28">
          <div
            className="pointer-events-none absolute inset-x-0 top-8 bottom-8 -z-10 opacity-40 dark:opacity-25"
            aria-hidden
          >
            <div className="absolute left-1/2 top-[18%] h-[420px] w-[min(920px,130vw)] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute left-1/2 bottom-[12%] h-[360px] w-[min(800px,120vw)] -translate-x-1/2 rounded-full bg-blue-500/8 blur-3xl" />
            <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,#00000010_1px,transparent_1px),linear-gradient(to_bottom,#00000010_1px,transparent_1px)] [background-size:48px_48px] dark:opacity-[0.08]" />
          </div>

          <div className="grid min-w-0 items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">
                {t.howInfrastructureTitle}
              </h2>
              <p className="max-w-xl text-base text-gray-600 dark:text-gray-400 mb-5 leading-relaxed">
                {t.howInfrastructureBody}
              </p>

              <div className="space-y-3">
                {infrastructureItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 text-base text-gray-700 dark:text-gray-300"
                  >
                    <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                      <Check className="h-4 w-4 text-blue-600" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex min-w-0 justify-center overflow-visible">
              <motion.div
                className="how-visual-fade-right w-full max-w-sm overflow-visible sm:max-w-md lg:max-w-lg xl:max-w-xl"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
              <div className="relative w-full overflow-visible">
                <div className="pointer-events-none absolute inset-0 rounded-full bg-primary/10 blur-3xl" />
                <svg
                  className="how-visual-float relative block h-auto w-full drop-shadow-[0_18px_32px_rgba(37,99,235,0.14)] lg:drop-shadow-[0_24px_45px_rgba(37,99,235,0.18)]"
                  viewBox="0 0 360 200"
                  fill="none"
                  role="img"
                  aria-label={t.howInfrastructureIllustration}
                >
                  <defs>
                    <radialGradient id="infraGlow" cx="180" cy="100" r="150" gradientUnits="userSpaceOnUse">
                      <stop stopColor="hsl(var(--primary))" stopOpacity="0.16" />
                      <stop offset="0.55" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
                      <stop offset="1" stopColor="hsl(var(--primary))" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <rect x="0" y="0" width="360" height="200" fill="url(#infraGlow)" />
                  <path
                    className="how-visual-dash"
                    d="M78 118 C116 70 144 146 180 92 C218 38 244 128 286 78"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="7 7"
                    opacity="0.32"
                  />
                  <g id="servers">
                    <rect
                      x="100"
                      y="80"
                      width="45"
                      height="70"
                      rx="6"
                      fill="hsl(var(--secondary))"
                      stroke="hsl(var(--border))"
                      strokeWidth="2"
                    />
                    <rect className="how-visual-pulse" x="110" y="92" width="25" height="4" rx="2" fill="hsl(var(--primary))" />
                    <rect x="110" y="102" width="25" height="4" rx="2" fill="hsl(var(--primary))" opacity="0.6" />
                    <rect x="110" y="112" width="25" height="4" rx="2" fill="hsl(var(--primary))" opacity="0.6" />
                    <circle cx="113" cy="130" r="3" fill="hsl(var(--primary))" />
                    <circle cx="122" cy="130" r="3" fill="hsl(var(--primary))" opacity="0.5" />
                    <circle cx="132" cy="130" r="3" fill="hsl(var(--primary))" opacity="0.5" />

                    <rect
                      x="157"
                      y="50"
                      width="45"
                      height="100"
                      rx="6"
                      fill="hsl(var(--secondary))"
                      stroke="hsl(var(--border))"
                      strokeWidth="2"
                    />
                    <rect className="how-visual-pulse" x="167" y="62" width="25" height="4" rx="2" fill="hsl(var(--primary))" />
                    <rect x="167" y="72" width="25" height="4" rx="2" fill="hsl(var(--primary))" />
                    <rect x="167" y="82" width="25" height="4" rx="2" fill="hsl(var(--primary))" opacity="0.6" />
                    <rect x="167" y="92" width="25" height="4" rx="2" fill="hsl(var(--primary))" opacity="0.6" />
                    <circle cx="170" cy="110" r="3" fill="hsl(var(--primary))" />
                    <circle cx="179" cy="110" r="3" fill="hsl(var(--primary))" />
                    <circle cx="189" cy="110" r="3" fill="hsl(var(--primary))" />
                    <circle cx="170" cy="125" r="3" fill="hsl(var(--primary))" />
                    <circle cx="179" cy="125" r="3" fill="hsl(var(--primary))" opacity="0.5" />
                    <circle cx="189" cy="125" r="3" fill="hsl(var(--primary))" opacity="0.5" />

                    <rect
                      x="214"
                      y="80"
                      width="45"
                      height="70"
                      rx="6"
                      fill="hsl(var(--secondary))"
                      stroke="hsl(var(--border))"
                      strokeWidth="2"
                    />
                    <rect className="how-visual-pulse" x="224" y="92" width="25" height="4" rx="2" fill="hsl(var(--primary))" />
                    <rect x="224" y="102" width="25" height="4" rx="2" fill="hsl(var(--primary))" opacity="0.6" />
                    <rect x="224" y="112" width="25" height="4" rx="2" fill="hsl(var(--primary))" opacity="0.6" />
                    <circle cx="227" cy="130" r="3" fill="hsl(var(--primary))" />
                    <circle cx="236" cy="130" r="3" fill="hsl(var(--primary))" />
                    <circle cx="246" cy="130" r="3" fill="hsl(var(--primary))" opacity="0.5" />
                  </g>
                </svg>
              </div>
              </motion.div>
            </div>
          </div>

          <div className="grid min-w-0 items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="flex min-w-0 justify-center overflow-visible">
              <motion.div
                className="how-visual-fade-left w-full max-w-sm overflow-visible sm:max-w-md lg:max-w-lg xl:max-w-xl"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
              <div className="relative w-full overflow-visible">
                <div className="pointer-events-none absolute inset-0 rounded-full bg-red-500/10 blur-3xl" />
                <svg
                  className="how-visual-float relative block h-auto w-full drop-shadow-[0_18px_32px_rgba(220,38,38,0.1)] lg:drop-shadow-[0_24px_45px_rgba(220,38,38,0.13)]"
                  viewBox="0 0 360 200"
                  fill="none"
                  role="img"
                  aria-label={t.howManualRevealIllustration}
                >
                <defs>
                  <radialGradient id="threatGlow" cx="180" cy="100" r="150" gradientUnits="userSpaceOnUse">
                    <stop stopColor="hsl(var(--primary))" stopOpacity="0.12" />
                    <stop offset="0.55" stopColor="hsl(var(--primary))" stopOpacity="0.04" />
                    <stop offset="1" stopColor="hsl(var(--primary))" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <rect x="0" y="0" width="360" height="200" fill="url(#threatGlow)" />
                <g id="note">
                  <rect
                    x="130"
                    y="60"
                    width="100"
                    height="80"
                    rx="8"
                    fill="hsl(var(--secondary))"
                    stroke="hsl(var(--border))"
                    strokeWidth="2"
                  />
                  <rect x="145" y="80" width="70" height="4" rx="2" fill="hsl(var(--border))" />
                  <rect x="145" y="92" width="60" height="4" rx="2" fill="hsl(var(--border))" opacity="0.7" />
                  <rect x="145" y="104" width="65" height="4" rx="2" fill="hsl(var(--border))" opacity="0.7" />
                </g>

                <g id="bot">
                  <rect
                    x="80"
                    y="140"
                    width="40"
                    height="40"
                    rx="8"
                    fill="hsl(var(--primary))"
                    opacity="0.14"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                  />
                  <circle cx="90" cy="153" r="4" fill="hsl(var(--primary))" />
                  <circle cx="110" cy="153" r="4" fill="hsl(var(--primary))" />
                  <line
                    x1="100"
                    y1="140"
                    x2="100"
                    y2="128"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <circle cx="100" cy="125" r="3" fill="hsl(var(--primary))" />
                  <line
                    className="how-visual-dash"
                    x1="120"
                    y1="150"
                    x2="145"
                    y2="110"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    opacity="0.4"
                  />
                </g>

                <g id="blocked" className="how-visual-pulse">
                  <circle cx="205" cy="105" r="22" fill="hsl(var(--destructive))" opacity="0.08" />
                  <line
                    x1="195"
                    y1="95"
                    x2="215"
                    y2="115"
                    stroke="hsl(var(--destructive))"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <line
                    x1="215"
                    y1="95"
                    x2="195"
                    y2="115"
                    stroke="hsl(var(--destructive))"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </g>
                </svg>
              </div>
              </motion.div>
            </div>

            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">
                {t.howManualRevealTitle}
              </h2>
              <p className="text-base text-gray-600 dark:text-gray-400 mb-5 leading-relaxed">
                {t.howManualRevealBody}
              </p>
              <p className="text-base text-gray-600 dark:text-gray-400 italic leading-relaxed">
                “{t.howManualRevealQuote}”
              </p>
            </div>
          </div>

          <div className="max-w-4xl space-y-10 pt-4 lg:space-y-12 lg:pt-8">
            <div>
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                {t.howAiSectionTitle}
              </h2>
              <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl">
                {t.howAiIntro}
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 md:gap-10">
              <div className="rounded-2xl border border-primary/25 bg-primary/5 p-7 shadow-sm dark:border-primary/20 dark:bg-primary/10 sm:p-8">
                <div className="mb-5 flex flex-wrap items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/20">
                    <Cpu className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t.howPrivateAiTitle}
                  </h3>
                  <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary ring-1 ring-primary/20">
                    {t.howPrivateAiBadge}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed sm:text-base sm:leading-7">
                  {t.howPrivateAiBody}
                </p>
              </div>

              <div className="rounded-2xl border border-red-200/80 bg-red-50/60 p-7 shadow-sm dark:border-red-900/50 dark:bg-red-950/25 sm:p-8">
                <div className="mb-5 flex flex-wrap items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-700 ring-1 ring-red-200/80 dark:bg-red-900/40 dark:text-red-200 dark:ring-red-800/60">
                    <Cloud className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t.howCloudAssistTitle}
                  </h3>
                  <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800 ring-1 ring-red-200/80 dark:bg-red-900/50 dark:text-red-100 dark:ring-red-800/60">
                    {t.howCloudAssistBadge}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed sm:text-base sm:leading-7">
                  {t.howCloudAssistBody}
                </p>
              </div>
            </div>

            <p className="text-base text-gray-600 dark:text-gray-400 italic leading-relaxed border-l-2 border-primary/30 pl-5 pt-1">
              {t.howAiCaution}
            </p>
          </div>
        </section>

        {/* Call to Action */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-10 rounded-[2.5rem] bg-primary p-10 text-white relative overflow-hidden group sm:p-12 lg:mt-16 lg:gap-12 lg:p-14">
          <Sparkles className="absolute -right-10 -top-10 h-56 w-56 text-white/10 rotate-12 group-hover:scale-110 transition-transform duration-700" />
          <div className="relative z-10 space-y-3">
            <h3 className="text-3xl font-bold leading-tight sm:text-[2rem]">{t.howCtaTitle}</h3>
            <p className="max-w-md text-base font-medium leading-relaxed text-primary-foreground/85 sm:text-lg">
              {t.howCtaSubtitle}
            </p>
          </div>
          <div className="flex gap-4 relative z-10">
            <Link
              href={localizedPath("/", language)}
              className="px-8 py-4 bg-white text-primary rounded-2xl font-bold hover:shadow-xl transition-all hover:-translate-y-1"
            >
              {t.howCtaButton}
            </Link>
          </div>
        </div>
      </div>
    </div>
    </MotionConfig>
  );
}
