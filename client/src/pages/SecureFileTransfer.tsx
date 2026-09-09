import React, { Suspense, lazy, useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, FileCheck, FileLock2, FolderArchive, ServerOff, ShieldCheck } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "@/context/LanguageContext";
import { apiRequest } from "@/lib/queryClient";
import { localizedPath } from "@/utils/localizedPath";
import {
  buildSecureFileTransferFaqSchema,
  SFT_FAQ_KEYS,
} from "@shared/secureFileTransferStructuredData";
import { setStructuredDataScript } from "@/utils/documentMeta";

const CreateNote = lazy(() =>
  import("@/components/note/CreateNote").then((m) => ({ default: m.CreateNote })),
);

function CreateNoteMountPlaceholder() {
  return <div className="min-h-[28rem] w-full" aria-hidden />;
}

const SecureFileTransfer: React.FC = () => {
  const { t, language } = useLanguage();
  const [isCreateSuccessView, setIsCreateSuccessView] = useState(false);
  const [mountCreateNote, setMountCreateNote] = useState(false);

  const features = [
    { icon: FileLock2, title: t.sftFeatureEncryptionTitle, text: t.sftFeatureEncryptionText },
    { icon: FolderArchive, title: t.sftFeatureFolderTitle, text: t.sftFeatureFolderText },
    { icon: ShieldCheck, title: t.sftFeatureAccessTitle, text: t.sftFeatureAccessText },
    { icon: FileCheck, title: t.sftFeatureSignInTitle, text: t.sftFeatureSignInText },
  ];

  const faqs = SFT_FAQ_KEYS.map(([questionKey, answerKey]) => ({
    q: t[questionKey],
    a: t[answerKey],
  }));

  useEffect(() => {
    apiRequest("/api/analytics/event", "POST", { page: "file-share" }).catch(() => {});
  }, []);

  useEffect(() => {
    setStructuredDataScript("secure-file-transfer-faq", buildSecureFileTransferFaqSchema(t));
    return () => setStructuredDataScript("secure-file-transfer-faq", null);
  }, [t]);

  useEffect(() => {
    let cancelled = false;
    const mount = () => {
      if (!cancelled) setMountCreateNote(true);
    };
    if (typeof requestIdleCallback === "function") {
      const id = requestIdleCallback(mount, { timeout: 600 });
      return () => {
        cancelled = true;
        cancelIdleCallback(id);
      };
    }
    const id = requestAnimationFrame(mount);
    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
    };
  }, []);

  const howItWorksPath = localizedPath("/how-it-works", language);
  const privacyPath = localizedPath("/privacy", language);
  const passwordGeneratorPath = localizedPath("/password-generator", language);

  return (
    <div className={`${isCreateSuccessView ? "pt-16" : "pt-24"} min-w-0 max-w-full overflow-x-clip pb-24`}>
      <div
        className={
          isCreateSuccessView
            ? undefined
            : "lg:flex lg:min-h-[calc(100svh-6rem)] lg:flex-col"
        }
      >
        {!isCreateSuccessView ? (
          <section className="relative isolate mx-auto max-w-4xl px-4 pb-2 pt-2 text-center sm:px-6 sm:pb-4 lg:px-8">
            <h1 className="page-title text-gray-900 dark:text-white">
              <span className="md:hidden">{t.sftHeroMobileTitle ?? t.sftHeroPrefix}</span>
              <span className="hidden md:block">
                <span className="block animate-in fade-in-0 duration-500 fill-mode-both">
                  {t.sftHeroPrefix}
                </span>
                <span className="mt-1 block animate-in fade-in-0 text-primary duration-500 fill-mode-both [animation-delay:120ms]">
                  {t.sftHeroAccent}
                </span>
              </span>
            </h1>
            <p className="mx-auto mt-3 max-w-3xl text-base text-gray-500 dark:text-gray-400 md:hidden">
              {t.sftHeroMobileSubtitle ?? t.sftHeroSubtitle}
            </p>
            <p className="mx-auto mt-6 hidden max-w-3xl text-xl text-gray-500 dark:text-gray-400 md:block">
              {t.sftHeroSubtitle}
            </p>
          </section>
        ) : null}

        <div
          className={`${isCreateSuccessView ? "mt-0" : "mt-5 md:mt-10 lg:mt-12"} px-4 py-4 pb-14 sm:px-6 lg:flex-1 lg:px-8`}
        >
          <div className="mx-auto min-w-0 max-w-4xl">
            {mountCreateNote ? (
              <Suspense fallback={<CreateNoteMountPlaceholder />}>
                <CreateNote mode="file-transfer" onSuccessStateChange={setIsCreateSuccessView} />
              </Suspense>
            ) : (
              <CreateNoteMountPlaceholder />
            )}
          </div>
        </div>
      </div>

      {!isCreateSuccessView ? (
        <>
          <section className="relative isolate overflow-x-clip border-b border-gray-200/40 bg-gradient-to-b from-background via-gray-50/50 to-gray-50/25 px-4 py-14 dark:border-gray-800/40 dark:from-background dark:via-gray-950/55 dark:to-gray-950/25 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 z-0 h-20 bg-gradient-to-b from-background to-transparent sm:h-28 dark:from-background"
            />

            <div className="relative z-10 mx-auto max-w-4xl">
              <div className="mb-10 text-center sm:mb-14">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {t.sftFeaturesHeading}
                </h2>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {t.sftFeaturesSubtitle}
                </p>
              </div>

              {/* Card grid — medium+ screens */}
              <div className="hidden sm:grid grid-cols-2 items-stretch gap-6 md:grid-cols-2 md:gap-7">
                {features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={feature.title}
                      className="group relative isolate flex h-full min-h-[180px] transform-gpu flex-col overflow-hidden rounded-xl border border-gray-200/70 bg-white p-5 shadow-sm transition-[transform,border-color,background-color] duration-200 ease-out hover:translate-y-0.5 hover:border-primary/30 hover:bg-primary/[0.015] dark:border-gray-700/70 dark:bg-gray-900 dark:hover:bg-primary/[0.04]"
                    >
                      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100">
                        <div className="absolute inset-x-0 top-0 h-px bg-primary/25" />
                      </div>
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" aria-hidden />
                      </div>
                      <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">{feature.text}</p>
                    </div>
                  );
                })}
              </div>

              {/* List view — mobile only */}
              <div className="space-y-4 sm:hidden">
                {features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={feature.title}
                      className="flex items-start gap-4 rounded-lg border border-gray-200/70 bg-white p-4 shadow-sm dark:border-gray-700/70 dark:bg-gray-900"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" aria-hidden />
                      </div>
                      <div>
                        <h3 className="mb-1 text-base font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{feature.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative z-10 mx-auto mt-14 max-w-3xl sm:mt-16 lg:mt-20">
              <div className="border-t border-gray-200/70 pt-10 dark:border-gray-800/70">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-primary dark:bg-primary/15">
                  <ServerOff className="h-3.5 w-3.5" aria-hidden />
                  Temporary encrypted transfer
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                  {t.sftSeoHeading}
                </h2>
                <div className="mt-5 space-y-4 text-base leading-relaxed text-gray-600 dark:text-gray-300">
                  <p>{t.sftSeoBody1}</p>
                  <p>{t.sftSeoBody2}</p>
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  {[
                    { href: howItWorksPath, label: t.howItWorks },
                    { href: privacyPath, label: t.privacyPolicy },
                    { href: passwordGeneratorPath, label: t.sharePassword },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm transition-colors hover:border-primary/40 hover:text-primary dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:hover:border-primary/50 dark:hover:text-primary"
                    >
                      {link.label}
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="relative overflow-hidden bg-gradient-to-b from-gray-50/25 via-gray-50/60 to-gray-50/40 px-4 py-16 dark:from-gray-950/25 dark:via-gray-900/40 dark:to-gray-950/30 sm:px-6 sm:py-20 lg:px-8">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-24 right-1/4 h-72 w-72 rounded-full bg-primary/10 blur-[120px]" />
              <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-blue-500/10 blur-[120px]" />
            </div>
            <div className="relative z-10 mx-auto max-w-4xl">
              <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="bg-gradient-to-r from-primary via-violet-500 to-blue-500 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
                    {t.sftFaqHeading}
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
                    {t.sftFaqSubtitle}
                  </p>
                </div>
              </div>

              <Accordion
                type="single"
                collapsible
                className="rounded-3xl border border-primary/20 bg-white/85 shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_10px_40px_rgba(15,23,42,0.09)] ring-1 ring-primary/10 backdrop-blur dark:border-primary/15 dark:bg-gray-950/80 dark:ring-primary/5"
              >
                {faqs.map((item, index) => (
                  <AccordionItem
                    key={item.q}
                    value={`faq-${index}`}
                    className={`group overflow-hidden border-b border-gray-200/70 transition-colors duration-150 data-[state=open]:bg-primary/[0.035] dark:border-gray-800/70 dark:data-[state=open]:bg-primary/[0.07] ${index === faqs.length - 1 ? "border-b-0" : ""}`}
                  >
                    <AccordionTrigger className="items-start gap-3 px-6 py-5 text-left text-sm transition-colors hover:bg-gray-50/70 hover:no-underline data-[state=open]:text-primary sm:text-base [&>svg]:mt-1.5 [&>svg]:shrink-0 [&>svg]:text-gray-400 data-[state=open]:[&>svg]:text-primary dark:hover:bg-gray-900/50">
                      <div className="flex min-w-0 flex-1 items-start gap-4">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-violet-500/15 text-xs font-semibold tabular-nums leading-none text-primary shadow-[0_0_8px_rgba(99,102,241,0.15)] ring-1 ring-primary/25">
                          {index + 1}
                        </span>
                        <span className="min-w-0 flex-1 pt-1.5 leading-snug text-gray-900 dark:text-white">{item.q}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 pt-6 text-base leading-relaxed text-gray-600 dark:text-gray-300">
                      <div className="ml-4 border-l-2 border-primary/25 pl-12">
                        {item.a}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
};

export default SecureFileTransfer;
