import React from 'react';
import { Link } from 'wouter';
import { motion, MotionConfig, type Variants } from 'framer-motion';
import {
  Lock,
  Key,
  Binary,
  Layers,
  Cpu,
  Cloud,
  Shield,
  Server,
  AlertTriangle,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { localizedPath } from '@/utils/localizedPath';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 260, damping: 24, delay: i * 0.06 },
  }),
};

const cardPop: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 240, damping: 22, delay: i * 0.08 },
  }),
};

const sectionPanel =
  'rounded-[2rem] border border-gray-200/70 bg-white/80 p-8 shadow-sm backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-900/50 sm:p-10';

type SectionPanelProps = {
  children: React.ReactNode;
  className?: string;
  index?: number;
  icon?: React.ReactNode;
};

function SectionPanel({ children, className = '', index = 0, icon }: SectionPanelProps) {
  return (
    <motion.section
      className={`${sectionPanel} ${className}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.12 }}
      variants={fadeUp}
      custom={index}
    >
      {icon ? (
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
            {icon}
          </span>
        </div>
      ) : null}
      {children}
    </motion.section>
  );
}

function SectionTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.h2
      className={`text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl ${className}`}
      variants={fadeUp}
      custom={0}
    >
      {children}
    </motion.h2>
  );
}

const SecurityOverview: React.FC = () => {
  const { language, t } = useLanguage();
  const e2eeBullets = [
    t.securityE2eeBulletServer,
    t.securityE2eeBulletPlaintext,
    t.securityE2eeBulletKeys,
  ];
  const infrastructureItems = [
    { title: t.securityEuStorageTitle, body: t.securityEuStorageBody },
    { title: t.securityAtomicTitle, body: t.securityAtomicBody },
    { title: t.securityNoTrackingTitle, body: t.securityNoTrackingBody },
    { title: t.securityTurnstileTitle, body: t.securityTurnstileBody },
  ];
  const supplyChainBullets = [
    t.securitySupplyChainBulletImmutable,
    t.securitySupplyChainBulletCsp,
    t.securitySupplyChainBulletDeps,
    t.securitySupplyChainBulletTls,
    t.securitySupplyChainBulletSri,
    t.securitySupplyChainBulletMinimalJs,
  ];
  const threatItems = [
    { label: t.securityDeviceCompromiseTitle, sub: t.securityDeviceCompromiseBody },
    { label: t.securityBrowserExtensionsTitle, sub: t.securityBrowserExtensionsBody },
    { label: t.securityBundleManipulationTitle, sub: t.securityBundleManipulationBody },
  ];
  const forwardSecrecyBullets = [
    t.securityForwardSecrecyBulletUrl,
    t.securityForwardSecrecyBulletHistory,
    t.securityForwardSecrecyBulletClipboard,
    t.securityForwardSecrecyBulletChat,
  ];

  return (
    <MotionConfig reducedMotion="user">
      <div className="mx-auto max-w-4xl overflow-x-clip px-4 sm:px-6 lg:px-8 pt-24 pb-16 mb-24 relative">
        <div className="pointer-events-none absolute top-0 left-1/4 h-96 w-96 bg-primary/10 blur-[120px] -z-10" />
        <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-64 w-64 bg-blue-500/10 blur-[100px] -z-10" />

        <motion.header
          className="relative z-10 mx-auto mb-16 max-w-4xl text-center sm:mb-20"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <h1 className="page-title relative z-10 mb-10 bg-clip-text pb-2 leading-[1.05] text-transparent bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            {t.securityHeroPrefix} <span className="text-primary italic">{t.securityHeroAccent}</span>
          </h1>
          <p className="relative z-10 mx-auto max-w-2xl text-xl leading-relaxed text-gray-600 dark:text-gray-400">
            {t.securityHeroSubtitle}
          </p>
        </motion.header>

        <div className="relative z-10 flex flex-col gap-10 lg:gap-12">
          {/* 1. Security Model */}
          <SectionPanel index={0} icon={<Shield className="h-5 w-5" />} className="relative overflow-hidden">
            <div className="pointer-events-none absolute -right-8 -top-8 opacity-[0.04] dark:opacity-[0.06]">
              <Layers className="h-48 w-48 text-primary" />
            </div>
            <div className="relative space-y-8">
              <SectionTitle className="text-center sm:text-left">{t.securityE2eeTitle}</SectionTitle>
              <ul className="space-y-3">
                {e2eeBullets.map((line, idx) => (
                  <motion.li
                    key={line}
                    className="flex items-start gap-3 rounded-xl border border-gray-200/50 bg-gray-50/80 px-4 py-3 text-sm leading-relaxed text-gray-600 dark:border-gray-700/50 dark:bg-gray-950/40 dark:text-gray-300 sm:text-base"
                    variants={cardPop}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.4 }}
                    custom={idx}
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                    <span>{line}</span>
                  </motion.li>
                ))}
              </ul>
              <div className="grid gap-6 sm:grid-cols-2">
                {[
                  {
                    icon: <Lock className="h-5 w-5" />,
                    title: t.securityClientEncryptionTitle,
                    body: t.securityClientEncryptionBody,
                  },
                  {
                    icon: <Key className="h-5 w-5" />,
                    title: t.securityKeyHandlingTitle,
                    body: t.securityKeyHandlingBody,
                  },
                ].map((card, idx) => (
                  <motion.div
                    key={card.title}
                    className="rounded-2xl border border-gray-200/60 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md dark:border-gray-700/60 dark:bg-gray-950/60"
                    variants={cardPop}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.35 }}
                    custom={idx + 3}
                    whileHover={{ y: -2 }}
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      {card.icon}
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{card.title}</h3>
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">{card.body}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </SectionPanel>

          {/* 2. Cryptography */}
          <motion.section
            className="overflow-hidden rounded-[2rem] bg-primary p-8 text-white shadow-lg md:p-10"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={fadeUp}
            custom={0}
          >
            <motion.div
              className="mb-6 flex items-center gap-3"
              variants={fadeUp}
              custom={1}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white">
                <Binary className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">{t.securityCryptoTitle}</h2>
            </motion.div>
            <div className="grid gap-10 sm:grid-cols-2">
              {[
                {
                  label: t.securitySymmetricTitle,
                  items: [
                    { title: t.securityAesTitle, body: t.securityAesBody },
                    { title: t.securityIvTitle, body: t.securityIvBody },
                  ],
                },
                {
                  label: t.securityKdfTitle,
                  items: [
                    { title: t.securityArgonTitle, body: t.securityArgonBody },
                    { title: t.securitySaltTitle, body: t.securitySaltBody },
                  ],
                },
              ].map((col, colIdx) => (
                <motion.div
                  key={col.label}
                  variants={cardPop}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.3 }}
                  custom={colIdx + 2}
                >
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-white/80">{col.label}</h3>
                  <ul className="space-y-4">
                    {col.items.map((item) => (
                      <li key={item.title} className="flex flex-col">
                        <span className="text-sm font-semibold text-white">{item.title}</span>
                        <span className="mt-1 text-xs leading-relaxed text-blue-100">{item.body}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* 3. Infrastructure & Operational Security */}
          <SectionPanel index={1} icon={<Server className="h-5 w-5" />} className="relative overflow-hidden">
            <motion.div
              aria-hidden
              className="pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 opacity-90 lg:block"
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <svg
                className="how-visual-float h-44 w-56 drop-shadow-[0_20px_36px_rgba(37,99,235,0.12)] xl:h-52 xl:w-64"
                viewBox="0 0 160 120"
                fill="none"
              >
                <rect x="8" y="28" width="32" height="64" rx="7" className="fill-white/90 stroke-primary/25 dark:fill-gray-950/70" strokeWidth="2" />
                <rect x="120" y="28" width="32" height="64" rx="7" className="fill-white/90 stroke-primary/25 dark:fill-gray-950/70" strokeWidth="2" />
                <motion.path
                  d="M44 60 H116"
                  className="stroke-primary/35"
                  strokeWidth="2"
                  strokeDasharray="5 7"
                  animate={{ strokeDashoffset: [0, -24] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
                />
                <motion.circle
                  r="4"
                  className="fill-primary/80"
                  animate={{ cx: [44, 116, 44], cy: [60, 60, 60], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                />
              </svg>
            </motion.div>

            <div className="relative max-w-2xl space-y-8">
              <SectionTitle>{t.securityInfrastructureTitle}</SectionTitle>
              <div className="grid gap-4 sm:grid-cols-2">
                {infrastructureItems.map((item, idx) => (
                  <motion.div
                    key={item.title}
                    className="rounded-xl border border-gray-200/60 bg-gray-50/90 p-4 dark:border-gray-700/50 dark:bg-gray-950/50"
                    variants={cardPop}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.35 }}
                    custom={idx}
                  >
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.body}</p>
                  </motion.div>
                ))}
              </div>
              <motion.div
                className="rounded-2xl border border-gray-200/70 bg-gray-50/90 p-6 dark:border-gray-700/70 dark:bg-gray-950/55 sm:p-7"
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.25 }}
                custom={2}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white sm:text-xl">
                  {t.securitySupplyChainTitle}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300 sm:text-base">
                  {t.securitySupplyChainIntro}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {supplyChainBullets.map((line, idx) => (
                    <motion.li
                      key={line}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-gray-600 dark:text-gray-300"
                      variants={cardPop}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, amount: 0.2 }}
                      custom={idx}
                    >
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary/80" aria-hidden />
                      <span>{line}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </SectionPanel>

          {/* 4. AI Data Handling */}
          <SectionPanel index={2} icon={<Cpu className="h-5 w-5" />}>
            <div className="mx-auto max-w-2xl space-y-6">
              <SectionTitle className="text-center sm:text-left">{t.securityAiSectionTitle}</SectionTitle>
              <motion.div
                className="rounded-2xl border border-primary/20 bg-primary/5 p-5 shadow-sm dark:border-primary/25 dark:bg-primary/10 sm:p-6"
                variants={cardPop}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.35 }}
                custom={1}
              >
                <h3 className="text-base font-semibold text-gray-900 dark:text-white sm:text-lg">
                  {t.securityAiBoxTitle}
                </h3>
                <ul className="mt-4 space-y-4">
                  <motion.li
                    className="flex items-start gap-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300 sm:text-[0.9375rem]"
                    variants={cardPop}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.4 }}
                    custom={2}
                  >
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/20">
                      <Cpu className="h-4 w-4" aria-hidden />
                    </span>
                    <span>{t.securityAiPrivateLine}</span>
                  </motion.li>
                  <motion.li
                    className="flex items-start gap-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300 sm:text-[0.9375rem]"
                    variants={cardPop}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.4 }}
                    custom={3}
                  >
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-700 ring-1 ring-red-200/80 dark:bg-red-900/40 dark:text-red-200 dark:ring-red-800/60">
                      <Cloud className="h-4 w-4" aria-hidden />
                    </span>
                    <span>{t.securityAiCloudLine}</span>
                  </motion.li>
                </ul>
              </motion.div>
            </div>
          </SectionPanel>

          {/* 5. Threat Model & Limitations */}
          <SectionPanel index={3} icon={<AlertTriangle className="h-5 w-5" />}>
            <div className="mx-auto max-w-2xl space-y-8">
              <div>
                <SectionTitle>{t.securityThreatModelTitle}</SectionTitle>
                <motion.p
                  className="mt-4 text-base italic leading-relaxed text-gray-600 dark:text-gray-400"
                  variants={fadeUp}
                  custom={1}
                >
                  {t.securityThreatModelIntro}
                </motion.p>
                <div className="mt-6 grid gap-4">
                  {threatItems.map((item, idx) => (
                    <motion.div
                      key={item.label}
                      className="rounded-xl border border-gray-200/60 bg-gray-50/80 px-4 py-3 dark:border-gray-700/50 dark:bg-gray-950/40"
                      variants={cardPop}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, amount: 0.35 }}
                      custom={idx + 2}
                    >
                      <span className="block font-semibold text-gray-900 dark:text-white">{item.label}</span>
                      <span className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.sub}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div
                className="rounded-2xl border border-amber-200/80 bg-amber-50/70 p-6 dark:border-amber-900/50 dark:bg-amber-950/25 sm:p-7"
                variants={cardPop}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                custom={0}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white sm:text-xl">
                  {t.securityLinkModelTitle}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300 sm:text-base">
                  {t.securityLinkModelBody}
                </p>
              </motion.div>

              <motion.div
                className="rounded-2xl border border-gray-200/70 bg-white/90 p-6 dark:border-gray-700/60 dark:bg-gray-950/50 sm:p-7"
                variants={cardPop}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                custom={1}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white sm:text-xl">
                  {t.securityForwardSecrecyTitle}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400 sm:text-base">
                  {t.securityForwardSecrecyIntro}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {forwardSecrecyBullets.map((line, idx) => (
                    <motion.li
                      key={line}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-gray-600 dark:text-gray-300"
                      variants={cardPop}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, amount: 0.2 }}
                      custom={idx + 2}
                    >
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary/80" aria-hidden />
                      <span>{line}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </SectionPanel>

          <motion.div
            className="relative flex flex-col items-center justify-between gap-8 overflow-hidden rounded-[2.5rem] border border-dashed border-gray-200 p-10 text-center dark:border-gray-800 md:flex-row md:text-left sm:p-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <div className="absolute inset-0 -z-10 bg-primary/5" />
            <div>
              <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">{t.securityIntegrityTitle}</h3>
              <p className="max-w-md text-gray-500 dark:text-gray-400">{t.securityIntegrityBody}</p>
            </div>
            <Link
              href={localizedPath('/', language)}
              className="rounded-2xl bg-primary px-10 py-4 font-bold text-white transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20 active:scale-95"
            >
              {t.securityStartSession}
            </Link>
          </motion.div>
        </div>
      </div>
    </MotionConfig>
  );
};

export default SecurityOverview;
