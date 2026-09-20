import React, { useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, CheckCircle2, ExternalLink } from "lucide-react";
import { MarketingDocShell } from "@/components/layout/MarketingDocShell";
import { DeveloperEncryptionFlow } from "@/components/developers/DeveloperEncryptionFlow";
import { DeveloperIntegrationPlayground } from "@/components/developers/DeveloperIntegrationPlayground";
import { DeveloperIntegrationScreenshot } from "@/components/developers/DeveloperIntegrationScreenshot";
import { DeveloperBottomCta } from "@/components/developers/DeveloperBottomCta";
import { CopyableCodeBlock } from "@/components/developers/CopyableCodeBlock";
import { DocMobileNav } from "@/components/developers/DocMobileNav";
import { DeveloperRefTable } from "@/components/developers/DeveloperRefTable";
import { DeveloperStatusBadge } from "@/components/developers/DeveloperStatusBadge";
import { NpmVersionBadge } from "@/components/developers/NpmVersionBadge";
import { EnglishOnlyDocBanner } from "@/components/developers/EnglishOnlyDocBanner";
import { RelatedIntegrations } from "@/components/developers/RelatedIntegrations";
import type { DevIntegrationContent, DevIntegrationCta } from "@/components/developers/types";
import { useLanguage } from "@/context/LanguageContext";
import { blogPostPath, localizedPath } from "@/utils/localizedPath";
import { trackNamedEvent } from "@/utils/productAnalytics";
import type { AnalyticsNamedEvent } from "@shared/analyticsEvents";

type DeveloperIntegrationPageProps = {
  content: DevIntegrationContent;
  statusLabel: string;
};

function IntegrationCtaButton({
  cta,
  lp,
  variant,
}: {
  cta: DevIntegrationCta;
  lp: (path: string) => string;
  variant: "primary" | "secondary";
}) {
  const className =
    variant === "primary"
      ? "inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-primary/90"
      : "inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-5 py-3 text-sm font-bold text-gray-800 transition-colors hover:border-primary hover:text-primary dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200";

  const icon = cta.external ? (
    <ExternalLink className="h-4 w-4" />
  ) : variant === "primary" ? (
    <ArrowRight className="h-4 w-4" />
  ) : null;

  if (!cta.external && cta.href.startsWith("/")) {
    return (
      <Link href={lp(cta.href)} className={className}>
        {cta.label}
        {icon}
      </Link>
    );
  }

  return (
    <a
      href={cta.href}
      target={cta.external ? "_blank" : undefined}
      rel={cta.external ? "noopener noreferrer" : undefined}
      className={className}
      onClick={() => {
        if (cta.href.includes("npmjs.com")) trackNamedEvent("npm_link_clicked");
        if (cta.href.includes("github.com")) trackNamedEvent("github_link_clicked");
      }}
    >
      {cta.label}
      {icon}
    </a>
  );
}

export function DeveloperIntegrationPage({ content, statusLabel }: DeveloperIntegrationPageProps) {
  const { language, t } = useLanguage();
  const lp = (path: string) => localizedPath(path, language);

  useEffect(() => {
    const event: AnalyticsNamedEvent =
      content.id === "mcp"
        ? "mcp_page_viewed"
        : content.id === "cli"
          ? "cli_page_viewed"
          : "developer_page_viewed";
    trackNamedEvent(event);
  }, [content.id]);

  const sectionNav = [
    { href: "#why", label: t.devSectionWhy, id: "why" },
    { href: "#quick-start", label: t.devQuickStart, id: "quick-start" },
    ...(content.playground
      ? [{ href: "#playground", label: t.devPlaygroundTitle, id: "playground" }]
      : []),
    { href: "#security", label: t.devSectionSecurity, id: "security" },
    { href: "#reference", label: t.devSectionReference, id: "reference" },
  ];

  const sidebar = (
    <nav className="flex flex-col gap-1.5">
      <Link
        href={lp("/developers")}
        className="group mb-4 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition-colors hover:text-primary dark:text-gray-400"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {t.devBackToHub}
      </Link>
      {sectionNav.map(({ href, label }) => (
        <a
          key={href}
          href={href}
          className="rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-primary/8 hover:text-primary dark:text-gray-400 dark:hover:bg-primary/10"
        >
          {label}
        </a>
      ))}
    </nav>
  );

  const mobileNav = (
    <DocMobileNav title={t.devOnThisPage} entries={sectionNav}>
      <Link
        href={lp("/developers")}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
      >
        <ArrowLeft className="h-3 w-3" />
        {t.devBackToHub}
      </Link>
    </DocMobileNav>
  );

  return (
    <MarketingDocShell sidebar={sidebar}>
      <EnglishOnlyDocBanner />

      <section className="mb-14 lg:mb-16">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <DeveloperStatusBadge status={content.status} label={statusLabel} />
          {content.npmPackage ? <NpmVersionBadge packageName={content.npmPackage} /> : null}
        </div>
        <h1 className="page-title mb-5 max-w-none pb-1 leading-[1.08]">{content.heroTitle}</h1>
        <p className="max-w-3xl text-lg leading-loose text-gray-600 dark:text-gray-400">{content.heroSubtitle}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <IntegrationCtaButton cta={content.primaryCta} lp={lp} variant="primary" />
          {content.secondaryCta ? (
            <IntegrationCtaButton cta={content.secondaryCta} lp={lp} variant="secondary" />
          ) : null}
          {content.blogLink ? (
            <Link
              href={blogPostPath(content.blogLink.slug, language)}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-5 py-3 text-sm font-bold text-gray-800 transition-colors hover:border-primary hover:text-primary dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200"
            >
              {content.blogLink.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : null}
        </div>
      </section>

      {content.screenshot ? (
        <DeveloperIntegrationScreenshot
          src={content.screenshot.src}
          alt={content.screenshot.alt}
          caption={content.screenshot.caption}
        />
      ) : null}

      {mobileNav}

      <section id="why" className="scroll-mt-28 mb-14 lg:mb-16">
        <h2 className="mb-5 text-2xl font-bold text-gray-950 dark:text-white">{content.whyTitle}</h2>
        <div className="max-w-3xl space-y-5 text-base leading-loose text-gray-700 dark:text-gray-300">
          {content.whyBody.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section id="quick-start" className="scroll-mt-28 mb-14 lg:mb-16">
        <h2 className="mb-5 text-2xl font-bold text-gray-950 dark:text-white">{content.quickStartTitle}</h2>
        {content.quickStartNote ? (
          <p className="mb-4 max-w-3xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
            {content.quickStartNote}
          </p>
        ) : null}
        <CopyableCodeBlock
          code={content.quickStartCode}
          analyticsEvent="install_command_copied"
        />
      </section>

      {content.playground ? (
        <DeveloperIntegrationPlayground mode={content.playground} />
      ) : null}

      <section id="security" className="scroll-mt-28">
        <h2 className="mb-5 text-2xl font-bold text-gray-950 dark:text-white">{content.securityTitle}</h2>
        <div className="max-w-3xl space-y-5 text-base leading-loose text-gray-700 dark:text-gray-300">
          {content.securityBody.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-8 max-w-4xl">
          <DeveloperEncryptionFlow variant="compact" showHubLink />
        </div>

        {content.securityBullets?.length ? (
          <ul className="mt-8 max-w-3xl space-y-4">
            {content.securityBullets.map((item) => (
              <li key={item} className="flex gap-3">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <p className="text-base leading-loose text-gray-700 dark:text-gray-300">{item}</p>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <div id="reference" className="scroll-mt-28">
        <DeveloperRefTable title={content.refTitle} rows={content.refRows} />
      </div>

      <RelatedIntegrations currentId={content.id} />

      <div className="mt-20 lg:mt-24">
        <DeveloperBottomCta variant="integration" content={content} />
      </div>
    </MarketingDocShell>
  );
}
