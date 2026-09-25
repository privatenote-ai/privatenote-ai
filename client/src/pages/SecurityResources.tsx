import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  Binary,
  Check,
  ChevronDown,
  Clock,
  Cloud,
  Cpu,
  Eye,
  FileText,
  Key,
  KeyRound,
  Layers,
  Link2,
  Lock,
  PenLine,
  Server,
  Share2,
  Shield,
  ShieldCheck,
  UserCircle,
  XCircle,
  type LucideIcon,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { localizedPath } from '@/utils/localizedPath';
import { HowAiFlowSteps } from '@/components/features/HowAiFlow';

const SCROLL_OFFSET = 'scroll-mt-28';
const THREAT_REVEAL_EASE = [0.22, 1, 0.36, 1] as const;

const threatPanelReveal = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: THREAT_REVEAL_EASE, staggerChildren: 0.07, delayChildren: 0.04 },
  },
} as const;

const threatPanelRevealSlow = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.58, ease: THREAT_REVEAL_EASE, staggerChildren: 0.11, delayChildren: 0.08 },
  },
} as const;

const threatRowReveal = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: THREAT_REVEAL_EASE },
  },
} as const;

const threatRowRevealSlow = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.44, ease: THREAT_REVEAL_EASE },
  },
} as const;

const THREAT_PATIENT_ROW = {
  duration: 0.68,
  ease: THREAT_REVEAL_EASE,
} as const;

const SECURITY_AI_CARD_REVEAL = {
  duration: 0.72,
  ease: THREAT_REVEAL_EASE,
} as const;

function ThreatSectionRule() {
  return (
    <hr
      className="my-10 border-0 border-t border-gray-200/70 sm:my-12 dark:border-gray-800/70"
      aria-hidden
    />
  );
}

type TocEntry = {
  id: string;
  label: string;
  icon: LucideIcon;
};

function useActiveSection(sectionIds: string[]) {
  const [active, setActive] = useState(sectionIds[0] ?? '');
  const idKey = sectionIds.join('|');

  useEffect(() => {
    if (!sectionIds.length) return;
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el != null);
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: '-15% 0px -60% 0px', threshold: [0, 0.15, 0.4, 0.7] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [idKey, sectionIds]);

  return active;
}

function SectionNumber({ children, className = '' }: { children: string; className?: string }) {
  return (
    <p
      className={`mb-4 text-6xl font-bold tabular-nums leading-none tracking-tight sm:text-7xl lg:text-8xl ${className}`}
      aria-hidden
    >
      {children}
    </p>
  );
}

function SectionHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <header className="min-w-0">
      <SectionNumber className="text-primary/35 dark:text-primary/45">{eyebrow}</SectionNumber>
      <h2 className="text-2xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-3xl">{title}</h2>
      {lead ? (
        <p className="mt-4 max-w-none text-base leading-relaxed text-gray-600 dark:text-gray-400">{lead}</p>
      ) : null}
    </header>
  );
}

/** Renders translation strings with **bold** markers as <strong>. */
function renderBoldMarkers(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} className="font-semibold text-gray-950 dark:text-white">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    ),
  );
}

function BulletCheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((line, idx) => (
        <li
          key={idx}
          className="flex items-start gap-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300 sm:text-[0.9375rem]"
        >
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/15">
            <Check className="h-3.5 w-3.5" aria-hidden />
          </span>
          <span>{renderBoldMarkers(line)}</span>
        </li>
      ))}
    </ul>
  );
}

function AiDetailRows({
  rows,
  variant = 'primary',
}: {
  rows: { label: string; body: string }[];
  variant?: 'primary' | 'danger';
}) {
  const labelClass =
    variant === 'primary'
      ? 'text-primary/80 dark:text-primary/70'
      : 'text-red-700/85 dark:text-red-300/80';
  return (
    <div className="space-y-4 break-words text-pretty">
      {rows.map((row) => (
        <div key={row.label}>
          <p className={`text-xs font-semibold uppercase tracking-widest ${labelClass}`}>{row.label}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {renderBoldMarkers(row.body)}
          </p>
        </div>
      ))}
    </div>
  );
}

function FeatureBlock({
  icon: Icon,
  title,
  body,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <div className="min-w-0">
        <h3 className="text-base font-semibold text-gray-950 dark:text-white">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{body}</p>
      </div>
    </div>
  );
}

function ThreatSubheading({ children }: { children: string }) {
  return (
    <h3 className="text-xl font-semibold tracking-tight text-gray-950 dark:text-white sm:text-2xl">{children}</h3>
  );
}

function ThreatAssetItem({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-gray-200/70 bg-white/70 px-4 py-3.5 shadow-sm dark:border-gray-800/70 dark:bg-gray-950/45">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/15">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <p className="min-w-0 text-sm font-medium leading-snug text-gray-800 dark:text-gray-200">{label}</p>
    </li>
  );
}

function ThreatListPanel({
  items,
  variant,
  renderIcon,
  pace = 'default',
}: {
  items: string[];
  variant: 'assumption' | 'covered' | 'excluded';
  renderIcon: () => React.ReactNode;
  pace?: 'default' | 'slow' | 'patient';
}) {
  const panelClass =
    variant === 'covered'
      ? 'border-emerald-200/65 bg-emerald-50/20 dark:border-emerald-900/45 dark:bg-emerald-950/12'
      : variant === 'excluded'
        ? 'border-red-200/65 bg-red-50/15 dark:border-red-900/45 dark:bg-red-950/12'
        : 'border-gray-200/70 bg-white/55 dark:border-gray-800/70 dark:bg-gray-950/40';

  const divideClass =
    variant === 'covered'
      ? 'divide-emerald-200/50 dark:divide-emerald-900/35'
      : variant === 'excluded'
        ? 'divide-red-200/50 dark:divide-red-900/35'
        : 'divide-gray-200/65 dark:divide-gray-800/65';

  if (pace === 'patient') {
    return (
      <div className={`overflow-hidden rounded-xl border shadow-sm ${panelClass}`}>
        <ul className={`divide-y ${divideClass}`}>
          {items.map((item, idx) => (
            <motion.li
              key={idx}
              className="flex items-start gap-3 px-4 py-3.5 sm:px-5 sm:py-4"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.72, margin: '0px 0px -6% 0px' }}
              transition={THREAT_PATIENT_ROW}
            >
              <span className="mt-0.5 shrink-0">{renderIcon()}</span>
              <span className="min-w-0 flex-1 text-sm leading-relaxed text-gray-700 dark:text-gray-300">{item}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    );
  }

  const panelVariants = pace === 'slow' ? threatPanelRevealSlow : threatPanelReveal;
  const rowVariants = pace === 'slow' ? threatRowRevealSlow : threatRowReveal;

  return (
    <div className={`overflow-hidden rounded-xl border shadow-sm ${panelClass}`}>
      <motion.ul
        className={`divide-y ${divideClass}`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.12 }}
        variants={panelVariants}
      >
        {items.map((item, idx) => (
          <motion.li
            key={idx}
            className="flex items-start gap-3 px-4 py-3.5 sm:px-5 sm:py-4"
            variants={rowVariants}
          >
            <span className="mt-0.5 shrink-0">{renderIcon()}</span>
            <span className="min-w-0 flex-1 text-sm leading-relaxed text-gray-700 dark:text-gray-300">{item}</span>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}

function ThreatCoveredList({ items }: { items: string[] }) {
  return (
    <ThreatListPanel
      items={items}
      pace="slow"
      variant="covered"
      renderIcon={() => (
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
        </span>
      )}
    />
  );
}

function ThreatExcludedGrid({ items }: { items: string[] }) {
  return (
    <ThreatListPanel
      items={items}
      variant="excluded"
      renderIcon={() => (
        <XCircle className="h-4 w-4 text-red-500/90 dark:text-red-400/90" aria-hidden />
      )}
    />
  );
}

function ThreatAssumptionList({ items }: { items: string[] }) {
  return (
    <ThreatListPanel
      items={items}
      pace="patient"
      renderIcon={() => (
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/15">
          <Check className="h-3.5 w-3.5" aria-hidden />
        </span>
      )}
      variant="assumption"
    />
  );
}

function TocNav({
  entries,
  activeId,
  className = '',
}: {
  entries: TocEntry[];
  activeId: string;
  className?: string;
}) {
  return (
    <nav className={`flex flex-col gap-0.5 ${className}`} aria-label="Table of contents">
      {entries.map(({ id, label, icon: Icon }) => {
        const isActive = activeId === id;
        return (
          <a
            key={id}
            href={`#${id}`}
            className={
              `group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ` +
              (isActive
                ? 'bg-primary/10 font-semibold text-primary dark:bg-primary/15'
                : 'font-medium text-gray-600 hover:bg-gray-100/80 hover:text-gray-950 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-white')
            }
            aria-current={isActive ? 'location' : undefined}
          >
            <Icon
              className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-primary' : 'opacity-50 group-hover:opacity-80'}`}
              aria-hidden
            />
            <span className="leading-snug">{label}</span>
          </a>
        );
      })}
    </nav>
  );
}

const SecurityOverview: React.FC = () => {
  const { language, t } = useLanguage();
  const lp = (path: string) => localizedPath(path, language);

  const e2eeBullets = [
    t.securityE2eeBulletBrowser,
    t.securityE2eeBulletKeys,
    t.securityE2eeBulletServer,
  ];
  const infrastructureItems = [
    { icon: Server, title: t.securityEuStorageTitle, body: t.securityEuStorageBody },
    { icon: Shield, title: t.securityAtomicTitle, body: t.securityAtomicBody },
    { icon: Layers, title: t.securityNoTrackingTitle, body: t.securityNoTrackingBody },
    { icon: Lock, title: t.securityTurnstileTitle, body: t.securityTurnstileBody },
  ];
  const supplyChainBullets = [
    t.securitySupplyChainBulletImmutable,
    t.securitySupplyChainBulletCsp,
    t.securitySupplyChainBulletDeps,
    t.securitySupplyChainBulletTls,
    t.securitySupplyChainBulletMinimalJs,
  ];
  const threatAssetItems = [
    { icon: FileText, label: t.securityThreatAssetPlaintext },
    { icon: Key, label: t.securityThreatAssetKeys },
    { icon: Eye, label: t.securityThreatAssetReadOnce },
    { icon: Clock, label: t.securityThreatAssetExpiry },
    { icon: UserCircle, label: t.securityThreatAssetAccount },
    { icon: KeyRound, label: t.securityThreatAssetAuth },
  ];
  const threatAdvCovered = [
    t.securityThreatAdvCovered1,
    t.securityThreatAdvCovered2,
    t.securityThreatAdvCovered3,
    t.securityThreatAdvCovered4,
    t.securityThreatAdvCovered5,
    t.securityThreatAdvCovered6,
    t.securityThreatAdvCovered7,
    t.securityThreatAdvCovered8,
  ];
  const threatAssumptions = [
    t.securityThreatAssumption1,
    t.securityThreatAssumption2,
    t.securityThreatAssumption3,
    t.securityThreatAssumption4,
    t.securityThreatAssumption5,
  ];
  const threatOutOfScope = [
    t.securityThreatOut1,
    t.securityThreatOut2,
    t.securityThreatOut3,
    t.securityThreatOut4,
    t.securityThreatOut5,
    t.securityThreatOut6,
    t.securityThreatOut7,
    t.securityThreatOut8,
    t.securityThreatOut9,
    t.securityThreatOut10,
  ];
  const tocEntries: TocEntry[] = useMemo(
    () => [
      { id: 'model', label: t.securityE2eeTitle, icon: Shield },
      { id: 'cryptography', label: t.securityCryptoTitle, icon: Binary },
      { id: 'infrastructure', label: t.securityInfrastructureTitle, icon: Server },
      { id: 'ai', label: t.securityAiSectionTitle, icon: Cpu },
      { id: 'threats', label: t.securityThreatModelTitle, icon: AlertTriangle },
    ],
    [t],
  );

  const sectionIds = useMemo(() => tocEntries.map((e) => e.id), [tocEntries]);
  const activeSection = useActiveSection(sectionIds);

  const privateAiFlowSteps = useMemo(
    () => [
      {
        icon: <ArrowDown className="h-4 w-4" aria-hidden />,
        label: t.howAiPrivateStepDownload,
        variant: 'primary' as const,
      },
      {
        icon: <Cpu className="h-4 w-4" aria-hidden />,
        label: t.howAiPrivateStepLoad,
        variant: 'primary' as const,
      },
      {
        icon: <PenLine className="h-4 w-4" aria-hidden />,
        label: t.howAiPrivateStepRequest,
        variant: 'primary' as const,
      },
      {
        icon: <Check className="h-4 w-4" aria-hidden />,
        label: t.howAiPrivateStepAccept,
        variant: 'primary' as const,
      },
      {
        icon: <Lock className="h-4 w-4" aria-hidden />,
        label: t.encrypt,
        variant: 'primary' as const,
      },
      {
        icon: <Share2 className="h-4 w-4" aria-hidden />,
        label: t.share,
        variant: 'primary' as const,
      },
    ],
    [t],
  );

  const cloudAssistFlowSteps = useMemo(
    () => [
      {
        icon: <FileText className="h-4 w-4" aria-hidden />,
        label: t.howCloudAssistFlowStepTemplate,
        variant: 'primary' as const,
      },
      {
        icon: <Cloud className="h-4 w-4" aria-hidden />,
        label: t.howCloudAssistTitle,
        variant: 'cloud' as const,
      },
      {
        icon: <Check className="h-4 w-4" aria-hidden />,
        label: t.howAiPrivateStepAccept,
        variant: 'primary' as const,
      },
      {
        icon: <Lock className="h-4 w-4" aria-hidden />,
        label: t.encrypt,
        variant: 'primary' as const,
      },
      {
        icon: <Share2 className="h-4 w-4" aria-hidden />,
        label: t.share,
        variant: 'primary' as const,
      },
    ],
    [t],
  );

  const cryptoColumns = [
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
  ];

  return (
    <div className="relative mx-auto max-w-7xl overflow-x-clip px-4 pt-24 pb-28 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute top-0 left-1/4 h-96 w-96 bg-primary/8 blur-[120px] -z-10" />
      <div className="pointer-events-none absolute bottom-1/3 right-0 h-72 w-72 bg-blue-500/8 blur-[100px] -z-10" />

      <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[240px_minmax(0,1fr)] xl:gap-16">
        {/* Desktop TOC */}
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              {t.securityTocTitle}
            </p>
            <TocNav entries={tocEntries} activeId={activeSection} />
          </div>
        </aside>

        <div className="min-w-0">
          {/* Mobile TOC */}
          <div className="sticky top-[4.5rem] z-20 -mx-4 mb-10 border-b border-gray-200/80 bg-background/90 px-4 py-3 backdrop-blur-md dark:border-gray-800/80 lg:hidden">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">{t.securityTocTitle}</p>
            <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {tocEntries.map(({ id, label }) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    className={
                      `shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ` +
                      (activeSection === id
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300')
                    }
                  >
                    {label}
                  </a>
                ))}
            </div>
          </div>

          {/* Hero */}
          <header className="mb-16 max-w-3xl lg:mb-20">
            <h1 className="page-title mb-6 max-w-3xl pb-2 leading-[1.05] bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
              {t.securityHeroPrefix}{' '}
              <span className="text-primary not-italic">{t.securityHeroAccent}</span>
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-400 md:text-xl">
              {t.securityHeroSubtitle}
            </p>
          </header>

          <div className="space-y-28 lg:space-y-32 xl:space-y-36">
            {/* 1. Security model */}
            <section id="model" className={`${SCROLL_OFFSET} space-y-8`}>
              <SectionHeader eyebrow="01" title={t.securityE2eeTitle} />
              <BulletCheckList items={e2eeBullets} />
              <div className="grid gap-10 border-t border-gray-200/80 pt-10 dark:border-gray-800/80 md:grid-cols-2 md:gap-12">
                <div id="client-encryption" className={SCROLL_OFFSET}>
                  <FeatureBlock
                    icon={Lock}
                    title={t.securityClientEncryptionTitle}
                    body={t.securityClientEncryptionBody}
                  />
                </div>
                <div id="key-handling" className={SCROLL_OFFSET}>
                  <FeatureBlock icon={Key} title={t.securityKeyHandlingTitle} body={t.securityKeyHandlingBody} />
                </div>
              </div>
              <div className="flex gap-4 rounded-xl border border-primary/25 border-l-4 border-l-primary bg-primary/[0.05] px-5 py-5 shadow-sm shadow-primary/5 dark:border-primary/35 dark:bg-primary/10 sm:px-6 sm:py-6">
                <Link2
                  className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                  aria-hidden
                />
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 sm:text-base">
                  {renderBoldMarkers(t.securityE2eeLinkNote)}
                </p>
              </div>
            </section>

            {/* 2. Cryptography */}
            <section
              id="cryptography"
              className={`${SCROLL_OFFSET} overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-blue-700 px-6 py-10 text-white shadow-lg shadow-primary/15 sm:px-10`}
            >
              <header className="mb-8 min-w-0">
                <SectionNumber className="text-white/40">02</SectionNumber>
                <h2 className="text-2xl font-bold sm:text-3xl">{t.securityCryptoTitle}</h2>
              </header>
              <div className="grid gap-10 sm:grid-cols-2">
                {cryptoColumns.map((col) => (
                  <div key={col.label}>
                    <h3 className="mb-5 text-xs font-bold uppercase tracking-widest text-white/75">{col.label}</h3>
                    <ul className="space-y-5">
                      {col.items.map((item) => (
                        <li key={item.title}>
                          <p className="text-sm font-semibold text-white">{item.title}</p>
                          <p className="mt-1.5 text-sm leading-relaxed text-blue-100/95">{item.body}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* 3. Infrastructure */}
          <section id="infrastructure" className={`${SCROLL_OFFSET} mt-16 space-y-10 lg:mt-20 xl:mt-24`}>
              <SectionHeader eyebrow="03" title={t.securityInfrastructureTitle} />
              <div className="grid gap-8 sm:grid-cols-2">
                {infrastructureItems.map((item) => (
                  <FeatureBlock key={item.title} icon={item.icon} title={item.title} body={item.body} />
                ))}
              </div>

              <div
                id="supply-chain"
                className={`${SCROLL_OFFSET} rounded-2xl border border-primary/35 bg-white/60 p-6 dark:border-primary/40 dark:bg-gray-950/30 sm:p-8`}
              >
                <h3 className="text-xl font-semibold tracking-tight text-gray-950 dark:text-white sm:text-2xl">
                  {t.securitySupplyChainTitle}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400 sm:text-base">
                  {t.securitySupplyChainIntro}
                </p>
                <details className="group mt-5 rounded-xl border border-primary/20 bg-primary/[0.02] dark:border-primary/25 dark:bg-primary/5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-sm font-medium text-gray-800 transition-colors hover:text-primary dark:text-gray-200 dark:hover:text-primary [&::-webkit-details-marker]:hidden">
                    <span>{t.securitySupplyChainDetailsToggle}</span>
                    <ChevronDown
                      className="h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 group-open:rotate-180 group-open:text-primary"
                      aria-hidden
                    />
                  </summary>
                  <ul className="space-y-2.5 border-t border-primary/15 px-4 pb-4 pt-3 dark:border-primary/20">
                    {supplyChainBullets.map((line) => (
                      <li
                        key={line}
                        className="flex items-start gap-2.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400"
                      >
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </details>
              </div>
            </section>

          <div className="mt-28 space-y-20 lg:mt-32 lg:space-y-24 xl:mt-36">
            {/* 4. AI */}
            <section id="ai" className={`${SCROLL_OFFSET} min-w-0 space-y-8`}>
              <SectionHeader eyebrow="04" title={t.securityAiSectionTitle} lead={t.securityAiIntro} />
              <div className="min-w-0 space-y-12 md:space-y-16 lg:space-y-20">
                <motion.div
                  className="min-w-0 rounded-2xl border border-primary/25 bg-primary/[0.03] p-5 dark:border-primary/30 dark:bg-primary/10 sm:p-7"
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.18, margin: "0px 0px -8% 0px" }}
                  transition={SECURITY_AI_CARD_REVEAL}
                >
                  <div className="mb-6 flex items-center justify-center gap-3 sm:mb-8 sm:gap-3.5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/15 sm:h-12 sm:w-12">
                      <Cpu className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden />
                    </span>
                    <h3 className="text-xl font-semibold tracking-tight text-gray-950 dark:text-white sm:text-2xl">
                      {t.securityAiPrivateTitle}
                    </h3>
                  </div>
                  <HowAiFlowSteps
                    className="how-ai-flow-stage--private how-ai-flow-stage--bare mb-6"
                    cycleDurationS={18}
                    steps={privateAiFlowSteps}
                  />
                  <AiDetailRows
                    variant="primary"
                    rows={[
                      { label: t.securityAiPrivatePrivacyLabel, body: t.securityAiPrivatePrivacyBody },
                      { label: t.securityAiPrivateUploadLabel, body: t.securityAiPrivateUploadBody },
                      { label: t.securityAiPrivateDevicesLabel, body: t.securityAiPrivateDevicesBody },
                      { label: t.securityAiPrivateDownloadLabel, body: t.securityAiPrivateDownloadBody },
                    ]}
                  />
                </motion.div>
                <motion.div
                  className="min-w-0 rounded-2xl border border-red-200/80 bg-red-50/40 p-5 dark:border-red-900/45 dark:bg-red-950/20 sm:p-7"
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.18, margin: "0px 0px -8% 0px" }}
                  transition={{ ...SECURITY_AI_CARD_REVEAL, delay: 0.08 }}
                >
                  <div className="mb-6 flex items-center justify-center gap-3 sm:mb-8 sm:gap-3.5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-700 ring-1 ring-red-200/80 dark:bg-red-900/50 dark:text-red-200 dark:ring-red-900/60 sm:h-12 sm:w-12">
                      <Cloud className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden />
                    </span>
                    <h3 className="text-xl font-semibold tracking-tight text-gray-950 dark:text-white sm:text-2xl">
                      {t.securityAiCloudTitle}
                    </h3>
                  </div>
                  <HowAiFlowSteps
                    className="how-ai-flow-stage--cloud how-ai-flow-stage--bare mb-6"
                    cycleDurationS={15}
                    steps={cloudAssistFlowSteps}
                  />
                  <AiDetailRows
                    variant="danger"
                    rows={[
                      { label: t.securityAiCloudPrivacyLabel, body: t.securityAiCloudPrivacyBody },
                      { label: t.securityAiCloudUploadLabel, body: t.securityAiCloudUploadBody },
                      { label: t.securityAiCloudDevicesLabel, body: t.securityAiCloudDevicesBody },
                      { label: t.securityAiCloudDownloadLabel, body: t.securityAiCloudDownloadBody },
                    ]}
                  />
                </motion.div>
              </div>
            </section>

            {/* 5. Threat model */}
            <section id="threats" className={`${SCROLL_OFFSET} min-w-0 space-y-12 sm:space-y-14`}>
              <SectionHeader
                eyebrow="05"
                title={t.securityThreatModelTitle}
                lead={t.securityThreatModelIntro}
              />

              <div className="space-y-5">
                <ThreatSubheading>{t.securityThreatAssetsTitle}</ThreatSubheading>
                <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {threatAssetItems.map(({ icon, label }) => (
                    <ThreatAssetItem key={label} icon={icon} label={label} />
                  ))}
                </ul>
              </div>

              <ThreatSectionRule />

              <div className="space-y-5">
                <ThreatSubheading>{t.securityThreatAssumptionsTitle}</ThreatSubheading>
                <ThreatAssumptionList items={threatAssumptions} />
              </div>

              <ThreatSectionRule />

              <div className="grid gap-8 lg:grid-cols-2 lg:gap-10 xl:gap-12">
                <div className="space-y-5">
                  <ThreatSubheading>{t.securityThreatAdvCoveredTitle}</ThreatSubheading>
                  <ThreatCoveredList items={threatAdvCovered} />
                </div>
                <div className="space-y-5">
                  <ThreatSubheading>{t.securityThreatAdvNotTitle}</ThreatSubheading>
                  <ThreatExcludedGrid items={threatOutOfScope} />
                </div>
              </div>
            </section>

            {/* CTA */}
            <section className="rounded-2xl bg-primary px-8 py-10 text-white sm:px-10 sm:py-12">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-xl">
                  <h2 className="text-2xl font-bold sm:text-3xl">{t.securityIntegrityTitle}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-white/85 sm:text-base">{t.securityIntegrityBody}</p>
                </div>
                <Link
                  href={lp('/')}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-primary transition-colors hover:bg-white/95"
                >
                  {t.securityStartSession}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityOverview;
