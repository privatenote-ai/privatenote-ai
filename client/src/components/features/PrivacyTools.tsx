import React, { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  BookOpen,
  ExternalLink,
  Eye,
  FileKey,
  FileText,
  Globe,
  HardDrive,
  KeyRound,
  Lock,
  Mail,
  MessageCircle,
  OctagonMinus,
  Search,
  Shield,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { blogPostPath, localizedPath } from "@/utils/localizedPath";
import { blogPostTitleForSlug } from "@/components/blog/blogPostTitles";
import {
  PRIVACY_CURATION_PRINCIPLE_KEYS,
  PRIVACY_DIRECTORY_BLOG_SLUGS,
  PRIVACY_DIRECTORY_CATEGORIES,
  PRIVACY_DIRECTORY_EXCLUSIONS,
  PRIVACY_DIRECTORY_EXTERNAL_ORGS,
  type PrivacyDirectoryCategoryId,
  type PrivacyDirectoryTool,
  type PrivacyToolPricing,
} from "@/data/privacyToolsDirectory";

const SCROLL_OFFSET = "scroll-mt-28";

type TocEntry = { id: string; label: string; icon: LucideIcon };

const CATEGORY_ICONS: Record<PrivacyDirectoryCategoryId, LucideIcon> = {
  secrets: Lock,
  notes: FileText,
  passwords: KeyRound,
  messaging: MessageCircle,
  email: Mail,
  browsing: Globe,
  vpn: Shield,
  identity: ShieldCheck,
  storage: HardDrive,
};

function useActiveSection(sectionIds: string[]) {
  const [active, setActive] = useState(sectionIds[0] ?? "");
  const idKey = sectionIds.join("|");

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
        if (visible[0]?.target.id) setActive(visible[0].target.id);
      },
      { rootMargin: "-12% 0px -62% 0px", threshold: [0, 0.12, 0.35, 0.6] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [idKey, sectionIds]);

  return active;
}

function TocNav({ entries, activeId, className = "" }: { entries: TocEntry[]; activeId: string; className?: string }) {
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
                ? "bg-primary/10 font-semibold text-primary dark:bg-primary/15"
                : "font-medium text-gray-600 hover:bg-gray-100/80 hover:text-gray-950 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-white")
            }
            aria-current={isActive ? "location" : undefined}
          >
            <Icon
              className={`h-3.5 w-3.5 shrink-0 ${isActive ? "text-primary" : "opacity-50 group-hover:opacity-80"}`}
              aria-hidden
            />
            <span className="leading-snug">{label}</span>
          </a>
        );
      })}
    </nav>
  );
}

function PricingBadge({ pricing, label }: { pricing: PrivacyToolPricing; label: string }) {
  const tone =
    pricing === "open-source"
      ? "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-300"
      : pricing === "free"
        ? "bg-primary/10 text-primary ring-primary/20"
        : pricing === "freemium"
          ? "bg-blue-500/10 text-blue-700 ring-blue-500/20 dark:text-blue-300"
          : "bg-gray-500/10 text-gray-700 ring-gray-500/20 dark:text-gray-300";

  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${tone}`}>
      {label}
    </span>
  );
}

function ToolCard({
  tool,
  description,
  nuance,
  pricingLabel,
  linkLabel,
  href,
}: {
  tool: PrivacyDirectoryTool;
  description: string;
  nuance?: string;
  pricingLabel: string;
  linkLabel: string;
  href: string;
}) {
  const isInternal = Boolean(tool.internalPath);
  const LinkComponent = isInternal ? Link : "a";
  const linkProps = isInternal
    ? { href }
    : { href, target: "_blank" as const, rel: "noopener noreferrer" };

  return (
    <article className="group flex h-full flex-col rounded-xl border border-gray-200/80 bg-white/70 p-5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md dark:border-gray-800/80 dark:bg-gray-950/40 dark:hover:border-primary/35">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-gray-950 dark:text-white">{tool.name}</h3>
        <PricingBadge pricing={tool.pricing} label={pricingLabel} />
      </div>
      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{description}</p>
      {nuance ? (
        <p className="mt-3 flex-grow text-sm leading-relaxed text-gray-500 dark:text-gray-500">{nuance}</p>
      ) : (
        <div className="flex-grow" />
      )}
      <LinkComponent
        {...linkProps}
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
      >
        {linkLabel}
        {isInternal ? <ArrowRight className="h-3.5 w-3.5" aria-hidden /> : <ExternalLink className="h-3.5 w-3.5" aria-hidden />}
      </LinkComponent>
    </article>
  );
}

export const PrivacyTools: React.FC = () => {
  const { language, t } = useLanguage();
  const lp = (path: string) => localizedPath(path, language);
  const [query, setQuery] = useState("");

  const featuredArticlePath = blogPostPath("privacy-tools", language);
  const homePath = lp("/");
  const passwordPath = lp("/password-generator");
  const fileTransferPath = lp("/secure-file-transfer");
  const howItWorksPath = lp("/how-it-works");
  const securityPath = lp("/security-resources");

  const pricingLabel = (pricing: PrivacyToolPricing) => {
    switch (pricing) {
      case "free":
        return t.privacyToolsPricingFree;
      case "freemium":
        return t.privacyToolsPricingFreemium;
      case "open-source":
        return t.privacyToolsPricingOpenSource;
      case "paid":
        return t.privacyToolsPricingPaid;
    }
  };

  const resolvePricingLabel = (tool: PrivacyDirectoryTool) => {
    if (tool.pricingLabelKey) return t[tool.pricingLabelKey] ?? pricingLabel(tool.pricing);
    return pricingLabel(tool.pricing);
  };

  const normalizedQuery = query.trim().toLowerCase();
  const filteredCategories = useMemo(() => {
    if (!normalizedQuery) return PRIVACY_DIRECTORY_CATEGORIES;
    return PRIVACY_DIRECTORY_CATEGORIES.map((category) => ({
      ...category,
      tools: category.tools.filter((tool) => {
        const desc = t[tool.descKey] ?? "";
        const nuance = tool.nuanceKey ? (t[tool.nuanceKey] ?? "") : "";
        return (
          tool.name.toLowerCase().includes(normalizedQuery) ||
          desc.toLowerCase().includes(normalizedQuery) ||
          nuance.toLowerCase().includes(normalizedQuery) ||
          (t[category.titleKey] ?? "").toLowerCase().includes(normalizedQuery)
        );
      }),
    })).filter((category) => category.tools.length > 0);
  }, [normalizedQuery, t]);

  const totalVisibleTools = filteredCategories.reduce((sum, cat) => sum + cat.tools.length, 0);

  const tocEntries: TocEntry[] = useMemo(
    () => [
      { id: "start", label: t.privacyToolsTocStart, icon: Sparkles },
      { id: "tools", label: t.privacyToolsTocTools, icon: Shield },
      { id: "guides", label: t.privacyToolsTocGuides, icon: BookOpen },
    ],
    [t],
  );

  const sectionIds = useMemo(() => tocEntries.map((e) => e.id), [tocEntries]);
  const activeSection = useActiveSection(sectionIds);

  const jobCards = [
    {
      id: "secrets",
      icon: Lock,
      title: t.privacyToolsJobSecretsTitle,
      body: t.privacyToolsJobSecretsBody,
      href: homePath,
      internal: true,
    },
    {
      id: "passwords",
      icon: KeyRound,
      title: t.privacyToolsJobPasswordsTitle,
      body: t.privacyToolsJobPasswordsBody,
      href: passwordPath,
      internal: true,
    },
    {
      id: "browsing",
      icon: Eye,
      title: t.privacyToolsJobBrowseTitle,
      body: t.privacyToolsJobBrowseBody,
      href: "#cat-browsing",
      internal: false,
    },
    {
      id: "breach",
      icon: ShieldCheck,
      title: t.privacyToolsJobBreachTitle,
      body: t.privacyToolsJobBreachBody,
      href: "#cat-identity",
      internal: false,
    },
  ];

  const pnTools = [
    { href: homePath, label: t.privacyToolsPnCreateNote, icon: Lock },
    { href: passwordPath, label: t.privacyToolsPnPasswordGen, icon: KeyRound },
    { href: fileTransferPath, label: t.privacyToolsPnFileTransfer, icon: FileKey },
    { href: howItWorksPath, label: t.privacyToolsPnHowItWorks, icon: Sparkles },
    { href: securityPath, label: t.privacyToolsPnSecurity, icon: Shield },
  ];

  return (
    <div className="relative mx-auto max-w-7xl overflow-x-clip px-4 pt-24 pb-28 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute top-0 left-1/4 h-96 w-96 bg-primary/8 blur-[120px] -z-10" />
      <div className="pointer-events-none absolute bottom-1/4 right-0 h-72 w-72 bg-blue-500/8 blur-[100px] -z-10" />

      <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[240px_minmax(0,1fr)] xl:gap-16">
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              {t.privacyToolsTocTitle}
            </p>
            <TocNav entries={tocEntries} activeId={activeSection} />
          </div>
        </aside>

        <div className="min-w-0">
          <div className="sticky top-[4.5rem] z-20 -mx-4 mb-10 border-b border-gray-200/80 bg-background/90 px-4 py-3 backdrop-blur-md dark:border-gray-800/80 lg:hidden">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">{t.privacyToolsTocTitle}</p>
            <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {tocEntries.map(({ id, label }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className={
                    `shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ` +
                    (activeSection === id
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300")
                  }
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          <header className="mb-14 max-w-3xl lg:mb-16">
            <h1 className="page-title mb-6 max-w-3xl pb-2 leading-[1.05] bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
              {t.privacyToolsPageHeroPrefix}{" "}
              <span className="text-primary italic">{t.privacyToolsPageHeroAccent}</span>
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-400 md:text-xl">
              {t.privacyToolsPageHeroSubtitle}
            </p>
          </header>

          <section
            aria-labelledby="privacy-tools-curation-heading"
            className="mb-14 rounded-2xl border border-gray-200/80 bg-white/60 p-6 dark:border-gray-800/80 dark:bg-gray-950/35 sm:p-8"
          >
            <h2 id="privacy-tools-curation-heading" className="text-xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-2xl">
              {t.privacyToolsCurateTitle}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-600 dark:text-gray-400 sm:text-base">
              {t.privacyToolsCurateIntro}
            </p>
            <ol className="mt-6 space-y-4">
              {PRIVACY_CURATION_PRINCIPLE_KEYS.map(({ titleKey, bodyKey }, index) => (
                <li key={titleKey} className="flex gap-4">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary ring-1 ring-primary/15"
                    aria-hidden
                  >
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-gray-950 dark:text-white">{t[titleKey]}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{t[bodyKey]}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {t.privacyToolsCurateReviewed}
            </p>
          </section>

          <section id="start" className={`${SCROLL_OFFSET} mb-20 space-y-10`}>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary/80">01</p>
              <h2 className="text-2xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-3xl">
                {t.privacyToolsStartTitle}
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
                {t.privacyToolsStartLead}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {jobCards.map(({ id, icon: Icon, title, body, href, internal }) => {
                const className =
                  "flex h-full flex-col rounded-xl border border-gray-200/80 bg-white/60 p-5 transition-all hover:border-primary/35 hover:shadow-md dark:border-gray-800/80 dark:bg-gray-950/35 dark:hover:border-primary/40";
                const inner = (
                  <>
                    <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <h3 className="text-base font-semibold text-gray-950 dark:text-white">{title}</h3>
                    <p className="mt-2 flex-grow text-sm leading-relaxed text-gray-600 dark:text-gray-400">{body}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                      {internal ? t.privacyToolsOpenTool : t.privacyToolsTocTools}
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                    </span>
                  </>
                );
                return internal ? (
                  <Link key={id} href={href} className={className}>
                    {inner}
                  </Link>
                ) : (
                  <a key={id} href={href} className={className}>
                    {inner}
                  </a>
                );
              })}
            </div>

            <div className="rounded-2xl border border-primary/25 bg-primary/[0.04] p-6 dark:border-primary/30 dark:bg-primary/10 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">{t.privacyToolsPnEyebrow}</p>
              <h3 className="mt-2 text-xl font-bold text-gray-950 dark:text-white">{t.privacyToolsPnTitle}</h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600 dark:text-gray-400">{t.privacyToolsPnLead}</p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {pnTools.map(({ href, label, icon: Icon }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="flex items-center gap-3 rounded-lg border border-primary/15 bg-white/70 px-4 py-3 text-sm font-medium text-gray-800 transition-colors hover:border-primary/35 hover:text-primary dark:border-primary/20 dark:bg-gray-950/50 dark:text-gray-200 dark:hover:text-primary"
                    >
                      <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-primary/20 bg-white/50 p-6 dark:border-primary/25 dark:bg-gray-950/30">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">{t.privacyToolsFeaturedEyebrow}</p>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t.blogPrivacyTitle}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-3xl">{t.privacyToolsFeaturedDescription}</p>
              <Link href={featuredArticlePath} className="inline-flex items-center font-semibold text-primary hover:underline">
                {t.privacyToolsFeaturedCta} <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </section>

          <section id="tools" className={`${SCROLL_OFFSET} mb-20 space-y-12`}>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary/80">02</p>
                <h2 className="text-2xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-3xl">
                  {t.privacyToolsTocTools}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {t.privacyToolsDirectoryDisclaimer}
                </p>
              </div>
              <div className="relative w-full max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t.privacyToolsSearchPlaceholder}
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 shadow-sm outline-none ring-primary/20 transition-shadow placeholder:text-gray-400 focus:border-primary/40 focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                  aria-label={t.privacyToolsSearchPlaceholder}
                />
              </div>
            </div>

            {totalVisibleTools === 0 ? (
              <p className="rounded-xl border border-dashed border-gray-300 px-6 py-10 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                {t.privacyToolsSearchEmpty}
              </p>
            ) : (
              <div className="space-y-14">
                {filteredCategories.map((category) => {
                  const Icon = CATEGORY_ICONS[category.id];
                  return (
                    <div key={category.id} id={`cat-${category.id}`} className={SCROLL_OFFSET}>
                      <div className="mb-6 flex items-start gap-4">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
                          <Icon className="h-5 w-5" aria-hidden />
                        </span>
                        <div>
                          <h3 className="text-xl font-bold tracking-tight text-gray-950 dark:text-white">
                            {t[category.titleKey]}
                          </h3>
                          <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                            {t[category.leadKey]}
                          </p>
                        </div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {category.tools.map((tool) => {
                          const href = tool.internalPath ? lp(tool.internalPath) : tool.href;
                          return (
                            <ToolCard
                              key={tool.id}
                              tool={tool}
                              description={t[tool.descKey] ?? ""}
                              nuance={tool.nuanceKey ? (t[tool.nuanceKey] ?? undefined) : undefined}
                              pricingLabel={resolvePricingLabel(tool)}
                              linkLabel={tool.internalPath ? t.privacyToolsOpenTool : t.privacyToolsVisitSite}
                              href={href}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section id="guides" className={`${SCROLL_OFFSET} space-y-10`}>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary/80">03</p>
              <h2 className="text-2xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-3xl">
                {t.privacyToolsGuidesTitle}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {t.privacyToolsGuidesLead}
              </p>
            </div>

            <ul className="grid gap-3 sm:grid-cols-2">
              {PRIVACY_DIRECTORY_BLOG_SLUGS.map((slug) => (
                <li key={slug}>
                  <Link
                    href={blogPostPath(slug, language)}
                    className="group flex items-center justify-between gap-4 rounded-xl border border-gray-200/80 bg-white/60 px-5 py-4 transition-all hover:border-primary/30 hover:shadow-sm dark:border-gray-800/80 dark:bg-gray-950/40"
                  >
                    <span className="text-sm font-medium leading-snug text-gray-800 group-hover:text-primary dark:text-gray-200">
                      {blogPostTitleForSlug(slug, t)}
                    </span>
                    <span className="shrink-0 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100 sm:opacity-100">
                      {t.privacyToolsGuidesRead}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="rounded-2xl border border-gray-200/80 bg-white/50 p-6 dark:border-gray-800/80 dark:bg-gray-950/30 sm:p-8">
              <h3 className="text-lg font-bold text-gray-950 dark:text-white">{t.privacyToolsOrgsTitle}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{t.privacyToolsOrgsLead}</p>
              <ul className="mt-5 space-y-2.5">
                {PRIVACY_DIRECTORY_EXTERNAL_ORGS.map(({ href, labelKey }) => (
                  <li key={href}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                    >
                      {t[labelKey]}
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-red-200/70 bg-red-50/30 p-6 dark:border-red-900/40 dark:bg-red-950/15 sm:p-8">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-700 ring-1 ring-red-200/80 dark:bg-red-900/40 dark:text-red-300 dark:ring-red-900/50">
                  <OctagonMinus className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-gray-950 dark:text-white">{t.privacyToolsExcludedTitle}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{t.privacyToolsExcludedLead}</p>
                </div>
              </div>
              <ul className="space-y-4">
                {PRIVACY_DIRECTORY_EXCLUSIONS.map(({ titleKey, bodyKey }) => (
                  <li
                    key={titleKey}
                    className="rounded-xl border border-red-200/50 bg-white/60 px-4 py-4 dark:border-red-900/35 dark:bg-gray-950/40 sm:px-5"
                  >
                    <h4 className="text-sm font-semibold text-gray-950 dark:text-white">{t[titleKey]}</h4>
                    <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{t[bodyKey]}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-primary px-8 py-10 text-white sm:px-10 sm:py-12">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-xl">
                  <h2 className="text-2xl font-bold sm:text-3xl">{t.privacyToolsCtaTitle}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-white/85 sm:text-base">{t.privacyToolsCtaBody}</p>
                </div>
                <Link
                  href={homePath}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-primary transition-colors hover:bg-white/95"
                >
                  {t.privacyToolsCtaButton}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
