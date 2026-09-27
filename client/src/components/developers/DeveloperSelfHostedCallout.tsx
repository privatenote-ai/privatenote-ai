import React from "react";
import { Link } from "wouter";
import { ArrowRight, ExternalLink, Server } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { localizedPath } from "@/utils/localizedPath";

const SELF_HOST_DOCKER_DOCS_URL =
  "https://github.com/privatenote-ai/privatenote-ai/blob/main/docs/self-hosted-docker-compose.md";

export function DeveloperSelfHostedCallout() {
  const { language, t } = useLanguage();
  const lp = (path: string) => localizedPath(path, language);

  const linkClass =
    "inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3.5 py-2 text-sm font-semibold text-gray-800 transition-colors hover:border-primary hover:text-primary dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200";

  return (
    <section className="mb-20 rounded-2xl border border-gray-200 bg-gray-50/80 px-6 py-6 dark:border-gray-800 dark:bg-gray-900/40 sm:px-8 lg:mb-24">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
        <div className="flex gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Server className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-gray-950 dark:text-white">{t.devSelfHostedTitle}</h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600 dark:text-gray-400 md:text-base">
              {t.devSelfHostedBody}
            </p>
            <div className="mt-3 max-w-2xl overflow-x-auto rounded-lg bg-gray-950 px-3 py-2 font-mono text-xs text-green-400">
              {t.devSelfHostedDockerSnippet}
            </div>
            <p className="mt-3 max-w-2xl text-xs leading-relaxed text-gray-500 dark:text-gray-500">
              {t.devSelfHostedNote}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2 lg:max-w-md lg:justify-end">
          <Link href={lp("/developers/cli")} className={linkClass}>
            {t.devSelfHostedCliLink}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link href={lp("/developers/mcp")} className={linkClass}>
            {t.devSelfHostedMcpLink}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link href={lp("/developers/vscode")} className={linkClass}>
            {t.devSelfHostedVscodeLink}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <a
            href={SELF_HOST_DOCKER_DOCS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            {t.devSelfHostedDockerLink}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <Link href={lp("/contact")} className={linkClass}>
            {t.devSelfHostedContactLink}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
