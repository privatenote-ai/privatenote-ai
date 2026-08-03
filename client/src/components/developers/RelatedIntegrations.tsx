import React from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { localizedPath } from "@/utils/localizedPath";
import {
  DEVELOPER_INTEGRATIONS,
  getDeveloperIntegration,
} from "@/pages/developers/integrationContent";
import type { EnglishOnlyDeveloperIntegration } from "@shared/englishOnlyDeveloperIntegrations";

type RelatedIntegrationsProps = {
  currentId: EnglishOnlyDeveloperIntegration;
};

export function RelatedIntegrations({ currentId }: RelatedIntegrationsProps) {
  const { language, t } = useLanguage();
  const lp = (path: string) => localizedPath(path, language);

  const others = DEVELOPER_INTEGRATIONS.filter((item) => item.id !== currentId);

  return (
    <section className="mt-20 border-t border-gray-200 pt-14 dark:border-gray-800 lg:mt-24 lg:pt-16">
      <h2 className="mb-8 text-2xl font-bold text-gray-950 dark:text-white">{t.devRelatedIntegrations}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {others.map((item) => {
          const content = getDeveloperIntegration(item.id);
          if (!content) return null;
          const Icon = content.icon;
          return (
            <Link
              key={item.id}
              href={lp(`/developers/${item.id}`)}
              className="group flex items-start gap-4 rounded-xl border border-gray-200 bg-white/60 p-5 transition-colors hover:border-primary/40 hover:bg-primary/5 dark:border-gray-800 dark:bg-white/5 dark:hover:border-primary/30"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-950 dark:text-white">{content.heroTitle}</p>
                <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {content.heroSubtitle}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  {t.devViewDocs}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
      <div className="mt-8">
        <Link
          href={lp("/developers")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          {t.devBackToHub}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
}
