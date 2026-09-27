import React, { Suspense, lazy, useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, FileText, KeyRound, Lock, MessageSquare, ShieldAlert } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "@/context/LanguageContext";
import { blogPostPath, localizedPath } from "@/utils/localizedPath";
import { getOneTimeLinkCopy } from "@/pages/oneTimeLink/copy";
import { buildOneTimeLinkFaqSchema } from "@shared/oneTimeLinkStructuredData";
import { setStructuredDataScript } from "@/utils/documentMeta";

const CreateNote = lazy(() =>
  import("@/components/note/CreateNote").then((m) => ({ default: m.CreateNote })),
);

function CreateNoteMountPlaceholder() {
  return <div className="min-h-[28rem] w-full" aria-hidden />;
}

const sectionClass = "scroll-mt-28 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8";

const OneTimeLink: React.FC = () => {
  const { language } = useLanguage();
  const copy = getOneTimeLinkCopy(language);
  const [isCreateSuccessView, setIsCreateSuccessView] = useState(false);
  const [mountCreateNote, setMountCreateNote] = useState(false);

  const articlePath = blogPostPath("one-time-secret-links", language);
  const passwordPath = blogPostPath("how-to-share-a-password-securely", language);
  const apiPath = blogPostPath("how-to-share-api-key-securely", language);
  const secretMessagePath = blogPostPath("send-secret-message-without-account", language);
  const e2eePath = blogPostPath("what-is-end-to-end-encryption", language);
  const filePath = localizedPath("/secure-file-transfer", language);
  const howItWorksPath = localizedPath("/how-it-works", language);

  useEffect(() => {
    setStructuredDataScript("one-time-link-faq", buildOneTimeLinkFaqSchema(copy.faqs));
    return () => setStructuredDataScript("one-time-link-faq", null);
  }, [copy]);

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

  const useCases = [
    {
      icon: KeyRound,
      title: copy.usePasswordsTitle,
      body: copy.usePasswordsBody,
      href: passwordPath,
      link: copy.usePasswordsLink,
    },
    {
      icon: Lock,
      title: copy.useApiTitle,
      body: copy.useApiBody,
      href: apiPath,
      link: copy.useApiLink,
    },
    {
      icon: MessageSquare,
      title: copy.useMessagesTitle,
      body: copy.useMessagesBody,
      href: secretMessagePath,
      link: copy.useMessagesLink,
    },
    {
      icon: FileText,
      title: copy.useFilesTitle,
      body: copy.useFilesBody,
      href: filePath,
      link: copy.useFilesLink,
    },
  ];

  const steps = [
    { n: "1", title: copy.step1Title, body: copy.step1Body },
    { n: "2", title: copy.step2Title, body: copy.step2Body },
    { n: "3", title: copy.step3Title, body: copy.step3Body },
  ];

  return (
    <div className={`${isCreateSuccessView ? "pt-16" : "pt-24"} min-w-0 max-w-full overflow-x-clip pb-20`}>
      <div
        className={
          isCreateSuccessView ? undefined : "lg:flex lg:min-h-[calc(100svh-4rem)] lg:flex-col"
        }
      >
      {!isCreateSuccessView ? (
        <section className="relative isolate mx-auto max-w-4xl px-4 pb-2 text-center sm:px-6 sm:pb-4 lg:px-8">
          <h1 className="page-title text-gray-900 dark:text-white">{copy.heroTitle}</h1>
          <p className="mx-auto mt-5 max-w-3xl text-base text-gray-500 dark:text-gray-400 md:mt-6 md:text-xl">
            {copy.heroSubtitle}
          </p>
        </section>
      ) : null}

      <div
        id="create"
        className={`${isCreateSuccessView ? "mt-0" : "mt-8 sm:mt-6 md:mt-10 lg:mt-12"} scroll-mt-24 min-w-0 px-4 pb-16 sm:px-6 sm:pb-20 md:pb-24 lg:flex-1 lg:px-8`}
      >
        <div className="mx-auto min-w-0 max-w-4xl">
          {mountCreateNote ? (
            <Suspense fallback={<CreateNoteMountPlaceholder />}>
              <CreateNote creationEntryPoint="one-time-link" onSuccessStateChange={setIsCreateSuccessView} />
            </Suspense>
          ) : (
            <CreateNoteMountPlaceholder />
          )}
        </div>
      </div>
      </div>

      {!isCreateSuccessView ? (
        <>
          <section id="how-it-works" className={`${sectionClass} py-14 sm:py-16`}>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              {copy.whatHeading}
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-gray-600 dark:text-gray-300">
              {copy.whatBody}
            </p>
            <p className="mt-4">
              <Link
                href={articlePath}
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                {copy.whatLearnMore}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </p>
          </section>

          <section className="border-y border-gray-200/70 bg-gray-50/60 py-14 dark:border-gray-800/70 dark:bg-gray-950/40 sm:py-16">
            <div className={sectionClass}>
              <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                {copy.stepsHeading}
              </h2>
              <ol className="mt-10 grid gap-4 md:grid-cols-3 md:gap-6">
                {steps.map((step) => (
                  <li
                    key={step.n}
                    className="rounded-xl border border-gray-200/70 bg-white p-5 shadow-sm dark:border-gray-700/70 dark:bg-gray-900"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {step.n}
                    </span>
                    <h3 className="mt-3 text-lg font-semibold text-gray-900 dark:text-white">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{step.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section className={`${sectionClass} py-14 sm:py-16`}>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              {copy.useHeading}
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-6">
              {useCases.map((item) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.title}
                    className="rounded-xl border border-gray-200/70 bg-white p-5 shadow-sm dark:border-gray-700/70 dark:bg-gray-900"
                  >
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" aria-hidden />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{item.body}</p>
                    <Link
                      href={item.href}
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                    >
                      {item.link}
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                    </Link>
                  </article>
                );
              })}
            </div>
            <div className="mt-10 max-w-3xl">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {copy.persistHeading}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-300">
                {copy.persistBody}
              </p>
            </div>
          </section>

          <section className="border-y border-gray-200/70 bg-gray-50/60 py-14 dark:border-gray-800/70 dark:bg-gray-950/40 sm:py-16">
            <div className={sectionClass}>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                {copy.handoffHeading}
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-gray-600 dark:text-gray-300">
                {copy.handoffBody}
              </p>
              <p className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
                <Link
                  href={e2eePath}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  {copy.handoffEncryptionLink}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
                <Link
                  href={howItWorksPath}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  {copy.handoffHowItWorksLink}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              </p>
            </div>
          </section>

          <section className={`${sectionClass} py-14 sm:py-16`}>
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-1 h-6 w-6 shrink-0 text-primary" aria-hidden />
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {copy.limitsHeading}
                </h2>
                <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-600 dark:text-gray-300">
                  {copy.limitsBody}
                </p>
              </div>
            </div>
          </section>

          <section className="border-t border-gray-200/70 bg-gradient-to-b from-gray-50/25 via-gray-50/60 to-gray-50/40 px-4 py-14 dark:border-gray-800/70 dark:from-gray-950/25 dark:via-gray-900/40 dark:to-gray-950/30 sm:px-6 sm:py-16 lg:px-8">
            <div className="mx-auto max-w-4xl">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                {copy.faqHeading}
              </h2>
              <Accordion
                type="single"
                collapsible
                className="mt-8 rounded-3xl border border-primary/20 bg-white/85 shadow-sm ring-1 ring-primary/10 backdrop-blur dark:border-primary/15 dark:bg-gray-950/80 dark:ring-primary/5"
              >
                {copy.faqs.map((item, index) => (
                  <AccordionItem
                    key={item.question}
                    value={`faq-${index}`}
                    className={`border-b border-gray-200/70 dark:border-gray-800/70 ${index === copy.faqs.length - 1 ? "border-b-0" : ""}`}
                  >
                    <AccordionTrigger className="items-start gap-3 px-6 py-5 text-left text-sm hover:no-underline sm:text-base">
                      <span className="pt-0.5 leading-snug text-gray-900 dark:text-white">{item.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 text-base leading-relaxed text-gray-600 dark:text-gray-300">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>

          <section className={`${sectionClass} py-12 sm:py-14`}>
            <p>
              <Link
                href={articlePath}
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline sm:text-base"
              >
                {copy.articleLearnMore}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </p>
            <p className="mt-8">
              <a href="#create" className="text-sm font-semibold text-primary hover:underline sm:text-base">
                {copy.backToCreate}
              </a>
            </p>
          </section>
        </>
      ) : null}
    </div>
  );
};

export default OneTimeLink;
