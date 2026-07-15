import React from "react";
import { Link } from "wouter";
import { ArrowRight, ExternalLink, LayoutGrid, Shield } from "lucide-react";
import type { DevIntegrationContent, DevIntegrationCta } from "@/components/developers/types";
import { useLanguage } from "@/context/LanguageContext";
import { localizedPath } from "@/utils/localizedPath";

type DeveloperBottomCtaProps =
  | { variant: "hub" }
  | { variant: "integration"; content: DevIntegrationContent };

function BottomCtaButton({
  cta,
  lp,
  variant,
}: {
  cta: DevIntegrationCta | { label: string; href: string; external?: boolean };
  lp: (path: string) => string;
  variant: "primary" | "secondary";
}) {
  const className =
    variant === "primary"
      ? "inline-flex items-center justify-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-bold text-primary transition-colors hover:bg-white/90"
      : "inline-flex items-center justify-center gap-2 rounded-md border border-white/30 bg-white/10 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/20";

  const icon =
    cta.external ? (
      <ExternalLink className="h-4 w-4" />
    ) : variant === "secondary" ? (
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

  if (cta.href.startsWith("#")) {
    return (
      <a href={cta.href} className={className}>
        {cta.label}
        {icon}
      </a>
    );
  }

  return (
    <a
      href={cta.href}
      target={cta.external ? "_blank" : undefined}
      rel={cta.external ? "noopener noreferrer" : undefined}
      className={className}
    >
      {cta.label}
      {icon}
    </a>
  );
}

export function DeveloperBottomCta(props: DeveloperBottomCtaProps) {
  const { language, t } = useLanguage();
  const lp = (path: string) => localizedPath(path, language);
  const compareHref = `${lp("/developers")}#which-tool`;

  const title = props.variant === "hub" ? t.devCtaTitle : props.content.heroTitle;
  const body = props.variant === "hub" ? t.devCtaBody : props.content.heroSubtitle;

  const primaryCta =
    props.variant === "integration" ? props.content.primaryCta : null;

  return (
    <section className="rounded-2xl bg-primary px-9 py-14 text-white sm:px-11 sm:py-16 lg:py-20">
      <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12">
        <div>
          <h2 className="mb-4 text-3xl font-bold leading-snug">{title}</h2>
          <p className="max-w-2xl text-base leading-loose text-white/85">{body}</p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
          {props.variant === "hub" ? (
            <Link
              href={lp("/developers/vscode")}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-bold text-primary transition-colors hover:bg-white/90"
            >
              <Shield className="h-4 w-4" />
              {t.devInstallExtension}
            </Link>
          ) : primaryCta ? (
            <BottomCtaButton cta={primaryCta} lp={lp} variant="primary" />
          ) : null}
          <Link
            href={compareHref}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-white/30 bg-white/10 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/20"
          >
            <LayoutGrid className="h-4 w-4" />
            {t.devCompareAllTools}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
