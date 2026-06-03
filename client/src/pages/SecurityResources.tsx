import React from 'react';
import { Link } from 'wouter';
import { motion, MotionConfig } from 'framer-motion';
import {
  Lock,
  Database,
  Key,
  Binary,
  Layers,
  Cpu,
  Cloud,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { localizedPath } from '@/utils/localizedPath';

const SecurityOverview: React.FC = () => {
  const { language, t } = useLanguage();
  const e2eeBullets = [
    t.securityE2eeBulletServer,
    t.securityE2eeBulletPlaintext,
    t.securityE2eeBulletKeys,
  ];
  const infrastructureItems = [
    {
      title: t.securityEuStorageTitle,
      body: t.securityEuStorageBody,
    },
    {
      title: t.securityCspTitle,
      body: t.securityCspBody,
    },
    {
      title: t.securityNoTrackingTitle,
      body: t.securityNoTrackingBody,
    },
    {
      title: t.securityTurnstileTitle,
      body: t.securityTurnstileBody,
    },
  ];
  const threatItems = [
    { label: t.securityDeviceCompromiseTitle, sub: t.securityDeviceCompromiseBody },
    { label: t.securityBrowserExtensionsTitle, sub: t.securityBrowserExtensionsBody },
    { label: t.securityBundleManipulationTitle, sub: t.securityBundleManipulationBody },
  ];

  return (
    <MotionConfig reducedMotion="user">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-24 pb-16 mb-24 relative">
        {/* Ambient Background Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 blur-[120px] -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 blur-[100px] -z-10" />

        {/* Header Section */}
        <div className="max-w-4xl mx-auto text-center mb-24 relative z-10">
          <h1 className="page-title mb-10 pb-2 leading-[1.05] bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 relative z-10">
            {t.securityHeroPrefix} <span className="text-primary italic">{t.securityHeroAccent}</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed relative z-10">
            {t.securityHeroSubtitle}
          </p>
        </div>

        <div className="grid gap-20">

          {/* 1. Core Architecture Section */}
          <section className="relative">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <Layers className="h-64 w-64 text-primary" />
            </div>

            <div className="relative z-10 space-y-24">
              <div className="mx-auto max-w-2xl space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{t.securityE2eeTitle}</h2>
                </div>

                <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300 sm:text-base">
                  {e2eeBullets.map((line) => (
                    <li key={line} className="flex items-start gap-3 leading-relaxed">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>

                <div className="rounded-2xl border border-gray-200/80 bg-gray-50/90 p-5 shadow-sm dark:border-gray-700/80 dark:bg-gray-900/50 sm:p-6">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white sm:text-lg">
                    {t.securityAiBoxTitle}
                  </h3>
                  <ul className="mt-4 space-y-4">
                    <li className="flex items-start gap-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300 sm:text-[0.9375rem]">
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/15">
                        <Cpu className="h-4 w-4" aria-hidden />
                      </span>
                      <span>{t.securityAiPrivateLine}</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300 sm:text-[0.9375rem]">
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-700 ring-1 ring-red-200/80 dark:bg-red-900/40 dark:text-red-200 dark:ring-red-800/60">
                        <Cloud className="h-4 w-4" aria-hidden />
                      </span>
                      <span>{t.securityAiCloudLine}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="grid gap-8 md:grid-cols-3">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3">
                    <Lock className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{t.securityClientEncryptionTitle}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {t.securityClientEncryptionBody}
                  </p>
                </div>
                <div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3">
                    <Database className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{t.securityAtomicTitle}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {t.securityAtomicBody}
                  </p>
                </div>
                <div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3">
                    <Key className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{t.securityKeyHandlingTitle}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {t.securityKeyHandlingBody}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Cryptographic Specifications */}
          <section className=" py-10 max-w-4xl mx-auto">
            <div className="rounded-[2rem] bg-primary text-white p-8 md:p-10 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-white/15 text-white flex items-center justify-center">
                  <Binary className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-white">{t.securityCryptoTitle}</h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-10">
                <div>
                  <h3 className="text-white/80 font-bold text-xs uppercase tracking-widest mb-4">{t.securitySymmetricTitle}</h3>
                  <ul className="space-y-4">
                    <li className="flex flex-col">
                      <span className="text-sm font-semibold text-white">{t.securityAesTitle}</span>
                      <span className="text-xs text-blue-100 mt-1 leading-relaxed">{t.securityAesBody}</span>
                    </li>
                    <li className="flex flex-col">
                      <span className="text-sm font-semibold text-white">{t.securityIvTitle}</span>
                      <span className="text-xs text-blue-100 mt-1">{t.securityIvBody}</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-white/80 font-bold text-xs uppercase tracking-widest mb-4">{t.securityKdfTitle}</h3>
                  <ul className="space-y-4">
                    <li className="flex flex-col">
                      <span className="text-sm font-semibold text-white">{t.securityArgonTitle}</span>
                      <span className="text-xs text-blue-100 mt-1 leading-relaxed">{t.securityArgonBody}</span>
                    </li>
                    <li className="flex flex-col">
                      <span className="text-sm font-semibold text-white">{t.securitySaltTitle}</span>
                      <span className="text-xs text-blue-100 mt-1">{t.securitySaltBody}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>



          {/* 3. Operational Security Section */}
          <section className="relative flex flex-col gap-14 py-10 lg:-mx-20 xl:-mx-32">
            {/* Ambient accents for this section */}
            <div className="pointer-events-none absolute -left-10 top-8 h-36 w-36 rounded-full bg-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-6 bottom-6 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />

            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute left-[calc(52%+2rem)] top-[calc(2rem+2cm)] z-0 hidden lg:block xl:left-[calc(50%+5rem)]"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="relative">
                <div className="absolute inset-6 rounded-full bg-primary/10 blur-3xl" />
                <svg
                  className="relative h-56 w-64 xl:h-64 xl:w-72 drop-shadow-[0_24px_40px_rgba(37,99,235,0.12)]"
                  viewBox="0 0 160 120"
                  fill="none"
                >
                  {/* Left server — fixed */}
                  <rect x="8" y="28" width="32" height="64" rx="7" className="fill-white/90 stroke-primary/25 dark:fill-gray-950/70" strokeWidth="2" />
                  <rect x="20" y="40" width="12" height="4" rx="2" className="fill-primary/60" />
                  <rect x="20" y="50" width="12" height="4" rx="2" className="fill-primary/45" />
                  <circle cx="18" cy="74" r="3" className="fill-primary/55" />
                  <circle cx="30" cy="74" r="3" className="fill-primary/35" />

                  {/* Right server — fixed, separated */}
                  <rect x="120" y="28" width="32" height="64" rx="7" className="fill-white/90 stroke-primary/25 dark:fill-gray-950/70" strokeWidth="2" />
                  <rect x="132" y="40" width="12" height="4" rx="2" className="fill-primary/60" />
                  <rect x="132" y="50" width="12" height="4" rx="2" className="fill-primary/45" />
                  <circle cx="130" cy="74" r="3" className="fill-primary/55" />
                  <circle cx="142" cy="74" r="3" className="fill-primary/35" />

                  {/* Encrypted link between servers */}
                  <motion.path
                    d="M44 60 H116"
                    className="stroke-primary/35"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="5 7"
                    animate={{ strokeDashoffset: [0, -24] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.path
                    d="M44 68 H116"
                    className="stroke-primary/20"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeDasharray="4 8"
                    animate={{ strokeDashoffset: [0, 24] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
                  />
                  {/* Data packets traveling left → right */}
                  <motion.circle
                    r="4"
                    className="fill-primary/80"
                    animate={{ cx: [44, 116, 44], cy: [60, 60, 60], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.circle
                    r="3"
                    className="fill-primary/50"
                    animate={{ cx: [116, 44, 116], cy: [68, 68, 68], opacity: [0.3, 0.85, 0.3] }}
                    transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                  />
                </svg>
              </div>
            </motion.div>

            <div className="relative z-10 w-full py-8 lg:w-[52%] lg:max-w-xl lg:self-start lg:pr-8">
              <motion.h2
                className="text-3xl font-bold text-gray-900 dark:text-white mb-6"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {t.securityInfrastructureTitle}
              </motion.h2>
              <div className="space-y-5">
                {infrastructureItems.map((item, idx) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: idx * 0.05 }}
                  >
                    <h4 className="font-semibold text-base text-gray-900 dark:text-white">{item.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">{item.body}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute right-[calc(53%+2rem)] top-[calc(56%+3cm)] z-0 hidden -translate-y-1/2 lg:block xl:right-[calc(51%+5rem)]"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="relative">
                <div className="absolute inset-8 rounded-full bg-blue-500/10 blur-3xl" />
                <svg className="relative h-60 w-60 xl:h-72 xl:w-72 drop-shadow-[0_24px_40px_rgba(37,99,235,0.12)]" viewBox="0 0 220 220" fill="none">
                  <circle cx="110" cy="110" r="72" className="fill-white/90 stroke-primary/20 dark:fill-gray-950/70" strokeWidth="2" />
                  <circle cx="110" cy="110" r="46" className="fill-primary/10 stroke-primary/30" strokeWidth="2" />
                  <path
                    d="M42 110H90M130 110H178M110 42V90M110 130V178"
                    className="stroke-primary/40"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  {/* Outbound pulses — hub stays fixed */}
                  <motion.circle
                    cx="110"
                    cy="110"
                    r="84"
                    className="stroke-primary/20"
                    strokeWidth="2"
                    fill="none"
                    animate={{ r: [72, 88, 72], opacity: [0.45, 0.15, 0.45] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeOut" }}
                  />
                  <circle cx="110" cy="110" r="8" className="fill-primary/70" />
                  <circle cx="42" cy="110" r="4" className="fill-primary/50" />
                  <circle cx="178" cy="110" r="4" className="fill-primary/50" />
                  <circle cx="110" cy="42" r="4" className="fill-primary/50" />
                  <circle cx="110" cy="178" r="4" className="fill-primary/50" />
                  {/* Traffic along spokes */}
                  {[
                    { cx: 110, cy: 110, tx: 42, ty: 110, delay: 0 },
                    { cx: 110, cy: 110, tx: 178, ty: 110, delay: 0.8 },
                    { cx: 110, cy: 110, tx: 110, ty: 42, delay: 1.6 },
                    { cx: 110, cy: 110, tx: 110, ty: 178, delay: 2.4 },
                  ].map((pulse, i) => (
                    <motion.circle
                      key={i}
                      r="3"
                      className="fill-primary/70"
                      animate={{
                        cx: [pulse.cx, pulse.tx, pulse.cx],
                        cy: [pulse.cy, pulse.ty, pulse.cy],
                        opacity: [0.2, 1, 0.2],
                      }}
                      transition={{
                        duration: 2.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: pulse.delay,
                      }}
                    />
                  ))}
                </svg>
              </div>
            </motion.div>

            <div className="relative z-10 w-full py-8 lg:w-[52%] lg:max-w-xl lg:self-end lg:pl-8">
              <motion.h2
                className="text-3xl font-bold text-gray-900 dark:text-white mb-6"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {t.securityThreatModelTitle}
              </motion.h2>
              <motion.p
                className="text-base text-gray-600 dark:text-gray-400 mb-6 italic"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
              >
                {t.securityThreatModelIntro}
              </motion.p>
              <div className="space-y-4 w-full">
                {threatItems.map((item, idx) => (
                  <motion.div
                    key={item.label}
                    className="text-base"
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 + idx * 0.06 }}
                  >
                    <span className="font-semibold block text-gray-900 dark:text-white">{item.label}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.sub}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* 4. Footer & Trust Footer */}
          <div className="p-12 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-primary/5 -z-10" />
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t.securityIntegrityTitle}</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md">{t.securityIntegrityBody}</p>
            </div>
            <Link
              href={localizedPath("/", language)}
              className="px-10 py-4 bg-primary text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-primary/20 transition-all hover:-translate-y-1 active:scale-95"
            >
              {t.securityStartSession}
            </Link>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
};

export default SecurityOverview;
