import React from "react";
import { Link } from "wouter";
import { AlertTriangle, CheckCircle2, Eye, Lock, Scale, ShieldAlert, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { blogPostPath, localizedPath } from "@/utils/localizedPath";
import type { SupportedLanguage } from "@/utils/translation";
import { BlogPostBackLink, BlogPostHeader, blogPostPageClass } from "@/components/blog/BlogPostChrome";
import { BlogPostCrossLinks } from "@/components/blog/BlogPostCrossLinks";
import { getBlogArticleCopy } from "@/components/blog/blogArticleLocale";
import { chatControlCryptographersDe } from "@/components/blog/locale/chatControlCryptographers.de";
import { chatControlCryptographersEn } from "@/components/blog/locale/chatControlCryptographers.en";
import { chatControlCryptographersEs } from "@/components/blog/locale/chatControlCryptographers.es";
import { chatControlCryptographersFr } from "@/components/blog/locale/chatControlCryptographers.fr";
import { chatControlCryptographersIt } from "@/components/blog/locale/chatControlCryptographers.it";
import { chatControlCryptographersHr } from "@/components/blog/locale/chatControlCryptographers.hr";
import { chatControlCryptographersNl } from "@/components/blog/locale/chatControlCryptographers.nl";
import { chatControlCryptographersPt } from "@/components/blog/locale/chatControlCryptographers.pt";
import { chatControlCryptographersSr } from "@/components/blog/locale/chatControlCryptographers.sr";
import type { ChatControlCryptographersArticleCopy } from "@/components/blog/locale/chatControlCryptographers.types";
import { cn } from "@/lib/utils";

const heroImagePath = "/images/blog-chat-control-is-back-hero.jpg";
const bartPreneelLinkedInPostUrl =
  "https://www.linkedin.com/feed/update/urn:li:activity:7480027993994768384/";
const scientistOpenLetterSep2025Url = "https://csa-scientist-open-letter.org/Sep2025";
const scientistOpenLetterNov2025Url = "https://csa-scientist-open-letter.org/Nov2025";

const concernIcons = [Eye, ShieldAlert, Lock, Scale];

const copy: Partial<Record<SupportedLanguage, ChatControlCryptographersArticleCopy>> & {
  en: ChatControlCryptographersArticleCopy;
} = {
  en: chatControlCryptographersEn,
  de: chatControlCryptographersDe,
  es: chatControlCryptographersEs,
  fr: chatControlCryptographersFr,
  it: chatControlCryptographersIt,
  nl: chatControlCryptographersNl,
  pt: chatControlCryptographersPt,
  hr: chatControlCryptographersHr,
  sr: chatControlCryptographersSr,
};

function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, index) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={index} className="font-semibold text-gray-900 dark:text-white">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <React.Fragment key={index}>{part}</React.Fragment>
        ),
      )}
    </>
  );
}

function ArticleSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-5 sm:space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
      <div className="space-y-5 sm:space-y-6">{children}</div>
    </section>
  );
}

export const ChatControlCryptographersPost: React.FC = () => {
  const { t, language } = useLanguage();
  const homePath = localizedPath("/", language);
  const article = getBlogArticleCopy(copy, language);

  return (
    <div className={cn(blogPostPageClass, "pb-12 mb-28")}>
      <BlogPostBackLink />

      <article>
        <BlogPostHeader
          slug="chat-control-europe-cryptographers"
          title={t.blogChatControlTitle}
          excerpt={t.blogChatControlExcerpt}
          headerClassName="mb-14 sm:mb-16"
        >
          <figure className="mt-10 sm:mt-12">
            <img
              src={heroImagePath}
              alt={article.heroAlt}
              width={1000}
              height={562}
              className="aspect-[16/9] w-full rounded-2xl border border-gray-200 object-cover shadow-sm dark:border-gray-800"
            />
            <figcaption className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
              {article.heroCaption}
            </figcaption>
          </figure>
        </BlogPostHeader>

        <div className="space-y-12 text-[1.0625rem] leading-[1.85] text-gray-700 dark:text-gray-300 sm:space-y-14 sm:leading-[1.9]">
          <p className="text-xl font-medium leading-relaxed text-gray-900 dark:text-gray-100 sm:text-[1.35rem] sm:leading-[1.75]">
            {article.intro}
          </p>

          <div className="rounded-2xl border border-primary/20 bg-primary/[0.04] p-5 dark:border-primary/25 dark:bg-primary/[0.08] sm:p-6">
            <p className="text-base leading-relaxed text-gray-800 dark:text-gray-200">
              <RichText text={article.updatePrefix} />{" "}
              <Link
                href={blogPostPath("chat-control-1-0-vote-explained", language)}
                className="font-semibold text-primary hover:underline"
              >
                {article.updateLink}
              </Link>
              {article.updateSuffix}
            </p>
          </div>

          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-7 dark:border-amber-900/60 dark:bg-amber-950/20 sm:p-8">
            <div className="flex gap-5">
              <AlertTriangle className="mt-1 h-6 w-6 flex-shrink-0 text-amber-700 dark:text-amber-300" aria-hidden />
              <div>
                <h2 className="text-xl font-bold text-amber-950 dark:text-amber-100">{article.calloutTitle}</h2>
                <p className="mt-4 text-base leading-relaxed text-amber-950/90 dark:text-amber-100/90">
                  {article.calloutBody}
                </p>
              </div>
            </div>
          </div>

          <ArticleSection title={article.sections.proposalReturns.title}>
            {article.sections.proposalReturns.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </ArticleSection>

          <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm dark:border-gray-800 dark:bg-gray-950 sm:p-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              {article.expertEyebrow}
            </p>
            <h2 className="text-2xl font-bold leading-tight text-gray-900 dark:text-white">{article.expertTitle}</h2>
            {article.expertParagraphs.map((paragraph) => (
              <p className="mt-5" key={paragraph}>
                {paragraph}
              </p>
            ))}
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={bartPreneelLinkedInPostUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-full border border-primary/25 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
              >
                {article.expertLinks.preneel}
              </a>
              <a
                href={scientistOpenLetterSep2025Url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-full border border-primary/25 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
              >
                {article.expertLinks.sep2025}
              </a>
              <a
                href={scientistOpenLetterNov2025Url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-full border border-primary/25 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
              >
                {article.expertLinks.nov2025}
              </a>
            </div>
          </div>

          <ArticleSection title={article.sections.cryptographersObject.title}>
            <div className="space-y-5">
              {article.technicalConcerns.map((concern, index) => {
                const Icon = concernIcons[index];
                return (
                  <div
                    className="group flex gap-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md dark:border-gray-800 dark:bg-gray-950 sm:p-7"
                    key={concern.title}
                  >
                    <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition duration-300 group-hover:bg-primary group-hover:text-white">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-bold leading-snug text-gray-900 dark:text-white">{concern.title}</h3>
                      <p className="mt-3 text-base leading-relaxed text-gray-700 dark:text-gray-300">
                        {concern.body}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ArticleSection>

          <ArticleSection title={article.sections.e2eeScanning.title}>
            {article.sections.e2eeScanning.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </ArticleSection>

          <ArticleSection title={article.sections.encryptionProtects.title}>
            <p>{article.sections.encryptionProtects.intro}</p>
            <ul className="grid gap-4 sm:grid-cols-2">
              {article.protectedGroups.map((item) => (
                <li
                  className="flex items-start gap-3 rounded-xl bg-gray-50 p-4 text-sm leading-relaxed text-gray-800 dark:bg-gray-900/70 dark:text-gray-200"
                  key={item}
                >
                  <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </ArticleSection>

          <ArticleSection title={article.sections.moreTech.title}>
            {article.sections.moreTech.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </ArticleSection>

          <ArticleSection title={article.sections.betterWays.title}>
            <p>{article.sections.betterWays.intro}</p>
            <div className="mt-8 overflow-hidden rounded-3xl border border-primary/20 bg-white shadow-sm dark:border-primary/25 dark:bg-gray-950">
              <div className="border-b border-primary/15 bg-primary/[0.055] px-7 py-6 dark:bg-primary/[0.09] sm:px-8 sm:py-7">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                  {article.betterInvestmentEyebrow}
                </p>
                <h3 className="mt-3 text-xl font-bold leading-tight text-gray-900 dark:text-white">
                  {article.betterInvestmentTitle}
                </h3>
              </div>
              <div className="grid divide-y divide-gray-200 dark:divide-gray-800 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                {article.betterInvestments.map((item, index) => (
                  <div
                    className="group flex gap-4 p-6 transition duration-300 hover:bg-primary/[0.035] dark:hover:bg-primary/[0.08] sm:p-7"
                    key={item.title}
                  >
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-xs font-bold tabular-nums text-primary transition duration-300 group-hover:bg-primary group-hover:text-white">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <h4 className="font-bold leading-snug text-gray-900 dark:text-white">{item.title}</h4>
                      <p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ArticleSection>

          <ArticleSection title={article.sections.privateNote.title}>
            {article.sections.privateNote.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </ArticleSection>

          <ArticleSection title={article.sections.policyReality.title}>
            {article.sections.policyReality.paragraphs.map((paragraph) => (
              <p key={paragraph}>
                <RichText text={paragraph} />
              </p>
            ))}
          </ArticleSection>
        </div>

        <div className="mt-16 rounded-2xl border border-primary/20 bg-primary/5 p-7 sm:mt-20 sm:p-8">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">{article.ctaTitle}</h2>
          <p className="mb-6 text-gray-700 dark:text-gray-300">{article.ctaBody}</p>
          <Link
            href={homePath}
            className="inline-flex items-center rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-primary/90"
          >
            {article.ctaButton}
          </Link>
        </div>

        <BlogPostCrossLinks slug="chat-control-europe-cryptographers" />
      </article>
    </div>
  );
};
