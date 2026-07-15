import React from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { CopyableCodeBlock } from "@/components/developers/CopyableCodeBlock";
import { DeveloperTerminalFrame, type TerminalLine } from "@/components/developers/DeveloperTerminalFrame";
import { DeveloperStatusBadge } from "@/components/developers/DeveloperStatusBadge";
import type { DevIntegrationStatus } from "@/components/developers/types";
import type { LucideIcon } from "lucide-react";

type DeveloperHubCardProps = {
  icon: LucideIcon;
  title: string;
  jtbd: string;
  status: DevIntegrationStatus;
  statusLabel: string;
  preview: string;
  docsHref: string;
  ctaLabel: string;
  screenshot?: {
    src: string;
    alt: string;
    caption?: string;
    wide?: boolean;
  };
  terminalPreview?: {
    title?: string;
    lines: TerminalLine[];
    caption?: string;
  };
};

export function DeveloperHubCard({
  icon: Icon,
  title,
  jtbd,
  status,
  statusLabel,
  preview,
  docsHref,
  ctaLabel,
  screenshot,
  terminalPreview,
}: DeveloperHubCardProps) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white/70 p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-white/5 sm:p-7">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-bold text-gray-950 dark:text-white">{title}</h2>
        </div>
        <DeveloperStatusBadge status={status} label={statusLabel} />
      </div>
      <p className="mb-5 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{jtbd}</p>
      {terminalPreview ? (
        <figure className="mb-5">
          <DeveloperTerminalFrame
            lines={terminalPreview.lines}
            title={terminalPreview.title}
          />
          {terminalPreview.caption ? (
            <figcaption className="mt-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
              {terminalPreview.caption}
            </figcaption>
          ) : null}
        </figure>
      ) : screenshot ? (
        <figure className="mb-5">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/40">
            <img
              src={screenshot.src}
              alt={screenshot.alt}
              loading="lazy"
              className={`block h-auto w-full ${screenshot.wide ? "" : "mx-auto max-w-xs"}`}
            />
          </div>
          {screenshot.caption ? (
            <figcaption className="mt-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
              {screenshot.caption}
            </figcaption>
          ) : null}
        </figure>
      ) : null}
      {!terminalPreview ? <CopyableCodeBlock code={preview} compact className="mb-6" /> : null}
      <Link
        href={docsHref}
        className="inline-flex items-center gap-2 self-start rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary/90"
      >
        {ctaLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </article>
  );
}
