import React from 'react';
import { Link } from 'wouter';
import { MotionConfig } from 'framer-motion';
import {
  Lock,
  Key,
  Binary,
  Layers,
  Cpu,
  Cloud,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { localizedPath } from '@/utils/localizedPath';

const sectionHeading =
  'text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl';
const subsectionHeading =
  'text-lg font-semibold text-gray-900 dark:text-white sm:text-xl';

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
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-24 pb-16 mb-24 relative">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 blur-[120px] -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 blur-[100px] -z-10" />

        <header className="max-w-4xl mx-auto text-center mb-20 relative z-10">
          <h1 className="page-title mb-10 pb-2 leading-[1.05] bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 relative z-10">
            {t.securityHeroPrefix} <span className="text-primary italic">{t.securityHeroAccent}</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed relative z-10">
            {t.securityHeroSubtitle}
          </p>
        </header>

        <div className="relative z-10 flex flex-col gap-20 lg:gap-24">
          {/* 1. Security Model */}
          <section className="relative">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <Layers className="h-64 w-64 text-primary" />
            </div>
            <div className="mx-auto max-w-2xl space-y-8">
              <h2 className={`${sectionHeading} text-center`}>{t.securityE2eeTitle}</h2>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300 sm:text-base">
                {e2eeBullets.map((line) => (
                  <li key={line} className="flex items-start gap-3 leading-relaxed">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Lock className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                    {t.securityClientEncryptionTitle}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {t.securityClientEncryptionBody}
                  </p>
                </div>
                <div>
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Key className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                    {t.securityKeyHandlingTitle}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {t.securityKeyHandlingBody}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Cryptography */}
          <section>
            <div className="rounded-[2rem] bg-primary text-white p-8 md:p-10 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white">
                  <Binary className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-white">{t.securityCryptoTitle}</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-10">
                <div>
                  <h3 className="text-white/80 font-bold text-xs uppercase tracking-widest mb-4">
                    {t.securitySymmetricTitle}
                  </h3>
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
                  <h3 className="text-white/80 font-bold text-xs uppercase tracking-widest mb-4">
                    {t.securityKdfTitle}
                  </h3>
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

          {/* 3. Infrastructure & Operational Security */}
          <section className="mx-auto max-w-2xl space-y-10">
            <h2 className={sectionHeading}>{t.securityInfrastructureTitle}</h2>
            <div className="space-y-5">
              {infrastructureItems.map((item) => (
                <div key={item.title}>
                  <h3 className="font-semibold text-base text-gray-900 dark:text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-gray-200/80 bg-gray-50/80 p-6 dark:border-gray-700/80 dark:bg-gray-900/40 sm:p-7">
              <h3 className={subsectionHeading}>{t.securitySupplyChainTitle}</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300 sm:text-base">
                {t.securitySupplyChainIntro}
              </p>
              <ul className="mt-4 space-y-2.5 text-sm text-gray-600 dark:text-gray-300">
                {supplyChainBullets.map((line) => (
                  <li key={line} className="flex items-start gap-2.5 leading-relaxed">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary/80" aria-hidden />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* 4. AI Data Handling */}
          <section className="mx-auto max-w-2xl">
            <h2 className={`${sectionHeading} mb-8`}>{t.securityAiSectionTitle}</h2>
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
          </section>

          {/* 5. Threat Model & Limitations */}
          <section className="mx-auto max-w-2xl space-y-10">
            <div>
              <h2 className={sectionHeading}>{t.securityThreatModelTitle}</h2>
              <p className="mt-4 text-base text-gray-600 dark:text-gray-400 leading-relaxed italic">
                {t.securityThreatModelIntro}
              </p>
              <div className="mt-6 space-y-4">
                {threatItems.map((item) => (
                  <div key={item.label}>
                    <span className="font-semibold block text-gray-900 dark:text-white">{item.label}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.sub}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-amber-200/80 bg-amber-50/60 p-6 dark:border-amber-900/50 dark:bg-amber-950/20 sm:p-7">
              <h3 className={subsectionHeading}>{t.securityLinkModelTitle}</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300 sm:text-base">
                {t.securityLinkModelBody}
              </p>
            </div>
            <div>
              <h3 className={subsectionHeading}>{t.securityForwardSecrecyTitle}</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400 sm:text-base">
                {t.securityForwardSecrecyIntro}
              </p>
              <ul className="mt-4 space-y-2.5 text-sm text-gray-600 dark:text-gray-300">
                {forwardSecrecyBullets.map((line) => (
                  <li key={line} className="flex items-start gap-2.5 leading-relaxed">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary/80" aria-hidden />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <div className="p-12 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-primary/5 -z-10" />
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t.securityIntegrityTitle}</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md">{t.securityIntegrityBody}</p>
            </div>
            <Link
              href={localizedPath('/', language)}
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
