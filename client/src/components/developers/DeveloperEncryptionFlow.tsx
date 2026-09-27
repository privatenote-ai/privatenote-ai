import React from "react";
import { Link } from "wouter";
import { ArrowRight, CloudUpload, Link2, Lock } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { localizedPath } from "@/utils/localizedPath";
import type { LucideIcon } from "lucide-react";

type DeveloperEncryptionFlowProps = {
  variant?: "full" | "compact";
  id?: string;
  showHubLink?: boolean;
};

const STEPS: { icon: LucideIcon; titleKey: string; bodyKey: string; hint?: string }[] = [
  {
    icon: Lock,
    titleKey: "devArchStep1Title",
    bodyKey: "devArchStep1Body",
  },
  {
    icon: CloudUpload,
    titleKey: "devArchStep2Title",
    bodyKey: "devArchStep2Body",
  },
  {
    icon: Link2,
    titleKey: "devArchStep3Title",
    bodyKey: "devArchStep3Body",
    hint: "privatenote.ai/note/…#key",
  },
];

function FlowArrow({ compact }: { compact: boolean }) {
  return (
    <div
      className={
        compact
          ? "flex shrink-0 items-center justify-center text-gray-300 dark:text-gray-600"
          : "flex shrink-0 items-center justify-center px-1 text-gray-300 dark:text-gray-600 sm:px-2"
      }
      aria-hidden
    >
      <ArrowRight className={compact ? "h-4 w-4 rotate-90 sm:rotate-0" : "h-5 w-5"} />
    </div>
  );
}

export function DeveloperEncryptionFlow({
  variant = "full",
  id,
  showHubLink = false,
}: DeveloperEncryptionFlowProps) {
  const { language, t } = useLanguage();
  const lp = (path: string) => localizedPath(path, language);
  const compact = variant === "compact";

  return (
    <div
      id={id}
      className={compact ? "scroll-mt-28" : "scroll-mt-28 mb-10 lg:mb-12"}
    >
      {!compact ? (
        <div className="mb-6 max-w-3xl">
          <p className="mb-2 text-sm font-semibold text-primary">{t.devArchFlowLabel}</p>
          <h3 className="text-xl font-bold text-gray-950 dark:text-white sm:text-2xl">{t.devArchFlowTitle}</h3>
          <p className="mt-3 text-base leading-relaxed text-gray-600 dark:text-gray-400">{t.devArchFlowIntro}</p>
        </div>
      ) : null}

      <div
        className={
          compact
            ? "flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50/80 p-4 dark:border-gray-800 dark:bg-gray-900/40 sm:flex-row sm:items-stretch sm:gap-2 sm:p-5"
            : "rounded-2xl border border-gray-200 bg-gray-50/80 p-5 dark:border-gray-800 dark:bg-gray-900/40 sm:p-6 lg:p-8"
        }
      >
        <div
          className={
            compact
              ? "flex flex-col gap-3 sm:flex-1 sm:flex-row sm:items-stretch sm:gap-2"
              : "flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-3"
          }
        >
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <React.Fragment key={step.titleKey}>
                <div
                  className={
                    compact
                      ? "flex flex-1 flex-col rounded-lg border border-gray-200 bg-white p-3.5 dark:border-gray-800 dark:bg-gray-950/60"
                      : "flex flex-1 flex-col rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950/60 sm:p-5"
                  }
                >
                  <div className="mb-3 flex items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="text-sm font-bold text-gray-950 dark:text-white">{t[step.titleKey]}</p>
                  </div>
                  <p className="flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    {t[step.bodyKey]}
                  </p>
                  {step.hint ? (
                    <p className="mt-3 font-mono text-xs text-primary/90 dark:text-primary/80">{step.hint}</p>
                  ) : null}
                </div>
                {index < STEPS.length - 1 ? <FlowArrow compact={compact} /> : null}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {showHubLink ? (
        <Link
          href={`${lp("/developers")}#encryption-flow`}
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          {t.devArchFlowHubLink}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      ) : null}
    </div>
  );
}
