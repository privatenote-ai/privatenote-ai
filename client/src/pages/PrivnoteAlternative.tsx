import React, { useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight, Check, Minus } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "@/context/LanguageContext";
import { blogPostPath, localizedPath } from "@/utils/localizedPath";
import { fireAnalyticsEvent } from "@/utils/analyticsEvent";
import { setStructuredDataScript } from "@/utils/documentMeta";
import { getPrivnoteAlternativeCopy } from "@/pages/privnoteAlternative/copy";
import { EncryptionFlow } from "@/pages/privnoteAlternative/EncryptionFlow";
import type {
  ComparisonAvailability,
  PrivnoteAlternativeComparisonRow,
} from "@/pages/privnoteAlternative/copy.types";
import {
  NOTE_FILE_BUSINESS_MAX_BYTES,
  NOTE_FILE_BUSINESS_MAX_COUNT,
  NOTE_FILE_FREE_MAX_BYTES,
  NOTE_FILE_FREE_MAX_COUNT,
  NOTE_FILE_STARTER_MAX_BYTES,
  NOTE_FILE_STARTER_MAX_COUNT,
  formatNoteFileSize,
} from "@shared/noteFileLimits";
import { PLAN_CATALOG } from "@shared/planCatalog";
import {
  buildPrivnoteAlternativeFaqSchema,
  buildPrivnoteAlternativePageSchema,
} from "@shared/privnoteAlternativeStructuredData";

const sectionClass = "scroll-mt-28 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8";

const primaryCtaClass =
  "inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 py-3 text-[15px] font-semibold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40";
const secondaryCtaClass =
  "inline-flex min-h-11 items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3 text-[15px] font-semibold text-gray-900 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800";

function interpolate(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_match, key: string) => values[key] ?? "");
}

function availabilityLabel(
  value: ComparisonAvailability,
  copy: ReturnType<typeof getPrivnoteAlternativeCopy>,
  note?: string,
): string {
  if (value === "yes") return copy.compareYes;
  if (value === "no") return copy.compareNo;
  return note ?? copy.comparePaid;
}

function AvailabilityCell({
  value,
  label,
}: {
  value: ComparisonAvailability;
  label: string;
}) {
  if (value === "no") {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
        <Minus className="h-4 w-4 shrink-0" aria-hidden />
        {label}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-900 dark:text-white">
      <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden />
      {label}
    </span>
  );
}

function ComparisonTableRow({
  row,
  copy,
}: {
  row: PrivnoteAlternativeComparisonRow;
  copy: ReturnType<typeof getPrivnoteAlternativeCopy>;
}) {
  const privnoteLabel = availabilityLabel(row.privnote, copy);
  const privatenoteLabel = availabilityLabel(row.privatenote, copy, row.privatenoteNote);
  return (
    <tr className="border-t border-gray-200/80 dark:border-gray-800/80">
      <th scope="row" className="px-5 py-3.5 text-left text-sm font-medium text-gray-900 dark:text-white">
        {row.feature}
      </th>
      <td className="px-5 py-3.5 align-top">
        <AvailabilityCell value={row.privnote} label={privnoteLabel} />
      </td>
      <td className="px-5 py-3.5 align-top">
        <AvailabilityCell value={row.privatenote} label={privatenoteLabel} />
      </td>
    </tr>
  );
}

function ComparisonMobileCard({
  row,
  copy,
}: {
  row: PrivnoteAlternativeComparisonRow;
  copy: ReturnType<typeof getPrivnoteAlternativeCopy>;
}) {
  const privnoteLabel = availabilityLabel(row.privnote, copy);
  const privatenoteLabel = availabilityLabel(row.privatenote, copy, row.privatenoteNote);
  return (
    <article className="rounded-xl border border-gray-200/80 bg-white p-4 shadow-sm dark:border-gray-700/80 dark:bg-gray-900">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{row.feature}</h3>
      <dl className="mt-3 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <dt className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {copy.comparePrivnoteColumn}
          </dt>
          <dd>
            <AvailabilityCell value={row.privnote} label={privnoteLabel} />
          </dd>
        </div>
        <div className="flex items-start justify-between gap-3">
          <dt className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {copy.comparePrivateNoteColumn}
          </dt>
          <dd>
            <AvailabilityCell value={row.privatenote} label={privatenoteLabel} />
          </dd>
        </div>
      </dl>
    </article>
  );
}

const PrivnoteAlternative: React.FC = () => {
  const { language } = useLanguage();
  const copy = getPrivnoteAlternativeCopy(language);

  const homePath = localizedPath("/", language);
  const howItWorksPath = localizedPath("/how-it-works", language);
  const filePath = localizedPath("/secure-file-transfer", language);
  const passwordToolPath = localizedPath("/password-generator", language);
  const premiumPath = localizedPath("/premium", language);
  const developersPath = localizedPath("/developers", language);
  const passwordArticlePath = blogPostPath("how-to-share-a-password-securely", language);
  const photosArticlePath = blogPostPath("how-to-share-photos-securely", language);
  const voiceArticlePath = blogPostPath("how-to-send-encrypted-voice-message", language);
  const documentsArticlePath = blogPostPath("send-sensitive-documents-securely", language);
  const e2eePath = blogPostPath("what-is-end-to-end-encryption", language);
  const oneTimeArticlePath = blogPostPath("one-time-secret-links", language);
  const notifyArticlePath = blogPostPath("know-when-secret-link-opened", language);
  const verifyArticlePath = blogPostPath("recipient-verification-code-before-reveal", language);

  const filesLimits = interpolate(copy.filesLimits, {
    freeSize: formatNoteFileSize(NOTE_FILE_FREE_MAX_BYTES),
    starterSize: formatNoteFileSize(NOTE_FILE_STARTER_MAX_BYTES),
    businessSize: formatNoteFileSize(NOTE_FILE_BUSINESS_MAX_BYTES),
    freeCount: String(NOTE_FILE_FREE_MAX_COUNT),
    starterCount: String(NOTE_FILE_STARTER_MAX_COUNT),
    businessCount: String(NOTE_FILE_BUSINESS_MAX_COUNT),
    freeTransfers: String(PLAN_CATALOG.free.features.maxAttachmentTransfersPerMonth ?? 10),
  });

  useEffect(() => {
    fireAnalyticsEvent("privnote_alternative_view");
  }, []);

  useEffect(() => {
    setStructuredDataScript("privnote-alternative-faq", buildPrivnoteAlternativeFaqSchema(copy.faqs));
    setStructuredDataScript(
      "privnote-alternative-page",
      buildPrivnoteAlternativePageSchema(copy, localizedPath("/privnote-alternative", language), homePath),
    );
    return () => {
      setStructuredDataScript("privnote-alternative-faq", null);
      setStructuredDataScript("privnote-alternative-page", null);
    };
  }, [copy]);

  return (
    <div className="relative min-w-0 max-w-full overflow-x-clip pb-20 pt-24">
      <section className="relative isolate mx-auto max-w-4xl px-4 pb-12 text-center sm:px-6 sm:pb-16 lg:px-8">
        <h1 className="page-title text-gray-900 dark:text-white">
          <span className="block">{copy.heroTitleLine1}</span>
          <span className="mt-1 block text-primary">{copy.heroTitleLine2}</span>
        </h1>
        <p className="mx-auto mt-5 max-w-3xl text-base text-gray-500 dark:text-gray-400 md:mt-6 md:text-xl">
          {copy.heroBody}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={homePath}
            className={primaryCtaClass}
            onClick={() => fireAnalyticsEvent("privnote_alternative_create_note_click")}
          >
            {copy.primaryCta}
          </Link>
          <a href="#how-private-note-protects" className={secondaryCtaClass}>
            {copy.secondaryCta}
          </a>
        </div>
        <p className="mx-auto mt-5 max-w-xl text-xs leading-relaxed text-gray-500 dark:text-gray-400 sm:text-sm">
          {copy.trustLine}
        </p>
      </section>

      <section className={`${sectionClass} pt-6 pb-16 sm:pt-10 sm:pb-20`}>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{copy.introHeading}</h2>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-gray-600 dark:text-gray-300">{copy.introBody}</p>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-600 dark:text-gray-300">{copy.introBody2}</p>
      </section>

      <section className="border-y border-gray-200/70 bg-gray-50/60 py-14 dark:border-gray-800/70 dark:bg-gray-950/40 sm:py-16">
        <div className={sectionClass}>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{copy.compareHeading}</h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-600 dark:text-gray-300">{copy.compareIntro}</p>

          <div className="mt-8 hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950 md:block">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">{copy.compareHeading}</caption>
              <thead>
                <tr className="bg-gray-50/80 dark:bg-gray-900/60">
                  <th scope="col" className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                    {copy.compareFeatureColumn}
                  </th>
                  <th scope="col" className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                    {copy.comparePrivnoteColumn}
                  </th>
                  <th scope="col" className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                    {copy.comparePrivateNoteColumn}
                  </th>
                </tr>
              </thead>
              <tbody>
                {copy.compareRows.map((row) => (
                  <ComparisonTableRow key={row.feature} row={row} copy={copy} />
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 space-y-3 md:hidden">
            {copy.compareRows.map((row) => (
              <ComparisonMobileCard key={row.feature} row={row} copy={copy} />
            ))}
          </div>

          <p className="mt-4 text-xs leading-relaxed text-gray-500 dark:text-gray-400">{copy.compareFootnote}</p>
          <p className="mt-6">
            <Link
              href={homePath}
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              onClick={() => fireAnalyticsEvent("privnote_alternative_create_note_click")}
            >
              {copy.compareCta}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </p>
        </div>
      </section>

      <section className={`${sectionClass} py-14 sm:py-16`}>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{copy.whyHeading}</h2>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-gray-600 dark:text-gray-300">{copy.whyBody}</p>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-600 dark:text-gray-300">{copy.whyBody2}</p>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-700 dark:text-gray-200">{copy.whyClose}</p>
      </section>

      <section className="border-y border-gray-200/70 bg-gray-50/60 py-14 dark:border-gray-800/70 dark:bg-gray-950/40 sm:py-16">
        <div className={sectionClass}>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{copy.passwordHeading}</h2>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-gray-600 dark:text-gray-300">{copy.passwordBody}</p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-600 dark:text-gray-300">{copy.passwordBody2}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href={passwordToolPath} className={primaryCtaClass}>
              {copy.passwordCta}
            </Link>
            <Link
              href={passwordArticlePath}
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              {copy.passwordArticleLink}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <section className={`${sectionClass} py-14 sm:py-16`}>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{copy.filesHeading}</h2>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-gray-600 dark:text-gray-300">{copy.filesBody}</p>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-600 dark:text-gray-300">{copy.filesBody2}</p>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-500 dark:text-gray-400">{filesLimits}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href={filePath}
            className={primaryCtaClass}
            onClick={() => fireAnalyticsEvent("privnote_alternative_file_cta_click")}
          >
            {copy.filesCta}
          </Link>
          <Link
            href={documentsArticlePath}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            {copy.filesArticleLink}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      </section>

      <section className="border-y border-gray-200/70 bg-gray-50/60 py-14 dark:border-gray-800/70 dark:bg-gray-950/40 sm:py-16">
        <div className={sectionClass}>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{copy.mediaHeading}</h2>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-gray-600 dark:text-gray-300">{copy.mediaBody}</p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-600 dark:text-gray-300">{copy.mediaBody2}</p>
          <p className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
            <Link
              href={photosArticlePath}
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              {copy.mediaPhotoLink}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
            <Link
              href={voiceArticlePath}
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              {copy.mediaVoiceLink}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </p>
        </div>
      </section>

      <section className={`${sectionClass} py-14 sm:py-16`}>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{copy.businessHeading}</h2>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-gray-600 dark:text-gray-300">{copy.businessBody}</p>
        <ul className="mt-6 max-w-3xl space-y-2 text-base leading-relaxed text-gray-600 dark:text-gray-300">
          {copy.businessScenarios.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-3xl text-base leading-relaxed text-gray-600 dark:text-gray-300">{copy.businessBody2}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href={premiumPath}
            className={primaryCtaClass}
            onClick={() => fireAnalyticsEvent("privnote_alternative_business_click")}
          >
            {copy.businessCta}
          </Link>
        </div>
        <p className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
          <Link
            href={notifyArticlePath}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            {copy.businessNotifyLink}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
          <Link
            href={verifyArticlePath}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            {copy.businessVerifyLink}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </p>
      </section>

      <section
        id="how-private-note-protects"
        className="scroll-mt-28 border-y border-gray-200/70 bg-gray-50/60 py-14 dark:border-gray-800/70 dark:bg-gray-950/40 sm:py-16"
      >
        <div className={sectionClass}>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{copy.securityHeading}</h2>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-gray-600 dark:text-gray-300">{copy.securityBody}</p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-600 dark:text-gray-300">{copy.securityArchitecture}</p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-600 dark:text-gray-300">{copy.securityRecipient}</p>
          <EncryptionFlow copy={copy} />
          <p className="mt-8 max-w-3xl text-base leading-relaxed text-gray-600 dark:text-gray-300">{copy.securityLimitation}</p>
          <p className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
            <Link
              href={e2eePath}
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              {copy.securityEncryptionLink}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
            <Link
              href={howItWorksPath}
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              {copy.securityHowItWorksLink}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </p>
          <aside className="mt-10 max-w-3xl rounded-2xl border border-gray-200/80 bg-white p-5 dark:border-gray-700/80 dark:bg-gray-900">
            <h3 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">{copy.founderHeading}</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{copy.founderBody}</p>
            <p className="mt-3">
              <Link
                href={e2eePath}
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                {copy.founderLink}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </p>
          </aside>
        </div>
      </section>

      <section className={`${sectionClass} py-14 sm:py-16`}>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{copy.decideHeading}</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2 md:gap-6">
          <article className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-700/80 dark:bg-gray-900">
            <h3 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
              {copy.decidePrivnoteTitle}
            </h3>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              {copy.decidePrivnoteItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="rounded-2xl border border-primary/25 bg-white p-6 shadow-sm ring-1 ring-primary/10 dark:border-primary/30 dark:bg-gray-900">
            <h3 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
              {copy.decidePrivateNoteTitle}
            </h3>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              {copy.decidePrivateNoteItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          <Link href={oneTimeArticlePath} className="font-semibold text-primary hover:underline">
            {copy.decideOneTimeLink}
          </Link>
          {" · "}
          <Link href={developersPath} className="font-semibold text-primary hover:underline">
            {copy.decideDevelopersLink}
          </Link>
        </p>
      </section>

      <section className="border-y border-gray-200/70 bg-gray-50/60 py-14 dark:border-gray-800/70 dark:bg-gray-950/40 sm:py-16">
        <div className={sectionClass}>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{copy.faqHeading}</h2>
          <Accordion type="single" collapsible className="mt-6">
            {copy.faqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={`faq-${index}`}>
                <AccordionTrigger className="text-left text-base font-semibold text-gray-900 dark:text-white">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className={`${sectionClass} py-16 text-center sm:py-20`}>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{copy.finalHeading}</h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-300">
          {copy.finalBody}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={homePath}
            className={primaryCtaClass}
            onClick={() => fireAnalyticsEvent("privnote_alternative_create_note_click")}
          >
            {copy.finalPrimaryCta}
          </Link>
          <Link
            href={premiumPath}
            className={secondaryCtaClass}
            onClick={() => fireAnalyticsEvent("privnote_alternative_pricing_click")}
          >
            {copy.finalSecondaryCta}
          </Link>
        </div>
        <p className="mt-5 text-sm text-gray-500 dark:text-gray-400">{copy.finalTrust}</p>
      </section>
    </div>
  );
};

export default PrivnoteAlternative;
