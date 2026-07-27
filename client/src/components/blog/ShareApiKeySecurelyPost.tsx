import React, { useMemo } from "react";
import { Link } from "wouter";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Link2,
  Lock,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { blogPostPath, localizedPath } from "@/utils/localizedPath";
import type { SupportedLanguage } from "@/utils/translation";
import { BlogPostHeader } from "@/components/blog/BlogPostChrome";
import { BlogPostCrossLinks } from "@/components/blog/BlogPostCrossLinks";
import { BlogGuideLayout, BlogGuideMobileToc } from "@/components/blog/BlogGuideLayout";
import { BlogKeyTakeaways } from "@/components/blog/BlogKeyTakeaways";
import { getBlogArticleCopy } from "@/components/blog/blogArticleLocale";
import { shareApiKeySecurelyDe } from "@/components/blog/locale/shareApiKeySecurely.de";
import { shareApiKeySecurelyEn } from "@/components/blog/locale/shareApiKeySecurely.en";
import { shareApiKeySecurelyEs } from "@/components/blog/locale/shareApiKeySecurely.es";
import { shareApiKeySecurelyFr } from "@/components/blog/locale/shareApiKeySecurely.fr";
import { shareApiKeySecurelyIt } from "@/components/blog/locale/shareApiKeySecurely.it";
import { shareApiKeySecurelyHr } from "@/components/blog/locale/shareApiKeySecurely.hr";
import { shareApiKeySecurelyNl } from "@/components/blog/locale/shareApiKeySecurely.nl";
import { shareApiKeySecurelyPt } from "@/components/blog/locale/shareApiKeySecurely.pt";
import { shareApiKeySecurelySr } from "@/components/blog/locale/shareApiKeySecurely.sr";
import type { ShareApiKeyArticleCopy } from "@/components/blog/locale/shareApiKeySecurely.types";
import { PASSWORDS_LU_PARTNER_URLS } from "@/config/passwordsLuPartner";

const heroImagePath = "/images/blog-api-key-sharing-hero.png";

const handoffIcons = {
  scope: KeyRound,
  encrypt: Lock,
  send: Link2,
  revoke: RotateCcw,
} as const;

const copy: Partial<Record<SupportedLanguage, ShareApiKeyArticleCopy>> & { en: ShareApiKeyArticleCopy } = {
  en: shareApiKeySecurelyEn,
  de: shareApiKeySecurelyDe,
  es: shareApiKeySecurelyEs,
  fr: shareApiKeySecurelyFr,
  it: shareApiKeySecurelyIt,
  nl: shareApiKeySecurelyNl,
  pt: shareApiKeySecurelyPt,
  hr: shareApiKeySecurelyHr,
  sr: shareApiKeySecurelySr,
};

const sectionClass = "scroll-mt-28 space-y-4";

function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={index} className="font-semibold text-gray-900 dark:text-white">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code key={index} className="rounded bg-gray-100 px-1.5 py-0.5 text-sm dark:bg-gray-800">
              {part.slice(1, -1)}
            </code>
          );
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </>
  );
}

function renderInlineContent(
  text: string,
  resolveLink: (href: string) => { to: string; external: boolean },
): React.ReactNode {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, index) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (!match) {
      return <RichText key={index} text={part} />;
    }
    const [, label, href] = match;
    const { to, external } = resolveLink(href);
    if (external) {
      return (
        <a key={index} href={to} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">
          {label}
        </a>
      );
    }
    return (
      <Link key={index} href={to} className="font-semibold text-primary hover:underline">
        {label}
      </Link>
    );
  });
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{children}</h2>;
}

function BoldParagraph({ title, body }: { title: string; body: string }) {
  return (
    <p>
      <strong className="font-semibold text-gray-900 dark:text-white">{title}.</strong> {body}
    </p>
  );
}

function HandoffFlowNode({
  icon: Icon,
  label,
  detail,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  detail: string;
}) {
  return (
    <div className="flex h-full min-h-[8.25rem] w-full flex-col items-center justify-start rounded-2xl border border-gray-200/90 bg-white px-3 py-4 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <div className="mb-2.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
        <Icon className="h-5 w-5 text-primary" aria-hidden />
      </div>
      <p className="flex min-h-[2.5rem] items-start justify-center text-sm font-semibold leading-snug text-gray-900 dark:text-white">
        {label}
      </p>
      <p className="mt-1 min-h-[2.5rem] text-xs leading-relaxed text-gray-600 dark:text-gray-400">{detail}</p>
    </div>
  );
}

function HandoffFlowArrow() {
  return (
    <div className="flex shrink-0 items-start justify-center self-stretch px-0.5 pt-7 sm:px-1" aria-hidden>
      <ArrowRight className="hidden h-5 w-5 text-gray-400 sm:block" />
      <ArrowRight className="h-5 w-5 rotate-90 text-gray-400 sm:hidden" />
    </div>
  );
}

export const ShareApiKeySecurelyPost: React.FC = () => {
  const { t, language } = useLanguage();
  const homePath = localizedPath("/", language);
  const article = getBlogArticleCopy(copy, language);
  const blogHref = (slug: string) => blogPostPath(slug, language);
  const resolveLink = (href: string) => {
    if (href.startsWith("blog:")) {
      return { to: blogHref(href.slice(5)), external: false };
    }
    return { to: href, external: true };
  };

  const toc = useMemo(
    () => [
      { id: "treat-like-passwords", label: article.sections.treatLikePasswords.title },
      { id: "never-paste", label: article.sections.neverPaste.title },
      { id: "where-keys-leak", label: article.sections.whereLeak.title },
      { id: "before-you-share", label: article.sections.beforeShare.title },
      { id: "high-risk-keys", label: article.sections.highRisk.title },
      { id: "safer-handoff", label: article.sections.handoff.title },
      { id: "how-privatenote-fits", label: article.sections.privateNote.title },
      { id: "faq", label: article.sections.faq.title },
    ],
    [article],
  );

  return (
    <BlogGuideLayout
      slug="how-to-share-api-key-securely"
      tocHeading={t.securityTocTitle}
      toc={toc}
    >
      <article>
        <BlogPostHeader
          slug="how-to-share-api-key-securely"
          title={t.blogApiKeySharingTitle}
          subtitle={t.blogApiKeySharingSubtitle}
          excerpt={t.blogApiKeySharingExcerpt}
          faqs={article.faqs}
          headerClassName="mb-12 max-w-none sm:mb-14"
        />

        <div className="max-w-3xl space-y-10 text-[1.0625rem] leading-[1.8] text-gray-700 dark:text-gray-300">
          <BlogKeyTakeaways heading={article.takeawaysHeading} items={article.takeaways} />

          <BlogGuideMobileToc />

          <p className="text-xl font-medium leading-relaxed text-gray-900 dark:text-gray-100">{article.intro}</p>

          <figure>
            <img
              src={heroImagePath}
              alt={article.heroAlt}
              width={1024}
              height={682}
              className="h-auto w-full rounded-2xl border border-gray-200 object-cover shadow-sm dark:border-gray-800"
            />
            <figcaption className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
              {article.heroCaption}
            </figcaption>
          </figure>

          <section id="treat-like-passwords" className={sectionClass}>
            <SectionHeading>{article.sections.treatLikePasswords.title}</SectionHeading>
            {article.sections.treatLikePasswords.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>

          <hr className="border-gray-200 dark:border-gray-800" />

          <section id="never-paste" className={sectionClass}>
            <SectionHeading>{article.sections.neverPaste.title}</SectionHeading>
            <p>{article.sections.neverPaste.intro}</p>
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900/60 dark:bg-red-950/20">
              <div className="mb-3 flex items-center gap-2 font-bold text-red-800 dark:text-red-200">
                <AlertTriangle className="h-5 w-5" aria-hidden />
                {article.sections.neverPaste.avoidHeading}
              </div>
              <ul className="space-y-2">
                {article.avoidChannels.map((item) => (
                  <li className="flex items-start gap-2 text-sm leading-relaxed text-red-950 dark:text-red-100" key={item}>
                    <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600 dark:text-red-300" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <hr className="border-gray-200 dark:border-gray-800" />

          <section id="where-keys-leak" className={sectionClass}>
            <SectionHeading>{article.sections.whereLeak.title}</SectionHeading>
            <p>{article.sections.whereLeak.intro}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {article.leakSources.map((source) => (
                <div
                  key={source.title}
                  className="rounded-2xl border border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-gray-950/40 sm:px-5"
                >
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{source.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{source.body}</p>
                </div>
              ))}
            </div>
          </section>

          <hr className="border-gray-200 dark:border-gray-800" />

          <section id="before-you-share" className={sectionClass}>
            <SectionHeading>{article.sections.beforeShare.title}</SectionHeading>
            <p>{article.sections.beforeShare.intro}</p>
            <div className="space-y-4">
              {article.prepSteps.map((step) => (
                <BoldParagraph key={step.title} title={step.title} body={step.body} />
              ))}
            </div>
            <div className="rounded-2xl border border-primary/20 bg-primary/[0.04] px-5 py-4 dark:border-primary/25 dark:bg-primary/[0.08] sm:px-6 sm:py-5">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {article.sections.beforeShare.newKeyTitle}
              </p>
              <p className="mt-2 leading-relaxed text-gray-700 dark:text-gray-300">
                {article.sections.beforeShare.newKeyBefore}{" "}
                <a
                  href={PASSWORDS_LU_PARTNER_URLS.apiKeyGenerator}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-gray-400 underline-offset-2 transition-colors hover:decoration-primary dark:decoration-gray-600"
                >
                  {article.sections.beforeShare.newKeyLink}
                </a>{" "}
                {article.sections.beforeShare.newKeyAfter}
              </p>
            </div>
          </section>

          <hr className="border-gray-200 dark:border-gray-800" />

          <section id="high-risk-keys" className={sectionClass}>
            <SectionHeading>{article.sections.highRisk.title}</SectionHeading>
            <p>{article.sections.highRisk.p1}</p>
            <p>{renderInlineContent(article.sections.highRisk.p2, resolveLink)}</p>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/60 dark:bg-amber-950/20">
              <div className="mb-3 flex items-center gap-2 font-bold text-amber-900 dark:text-amber-100">
                <Lock className="h-5 w-5" aria-hidden />
                {article.sections.highRisk.calloutHeading}
              </div>
              <ul className="space-y-2 text-sm leading-relaxed text-amber-950 dark:text-amber-100">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-700 dark:text-amber-300" aria-hidden />
                  <span>{renderInlineContent(article.sections.highRisk.ageBullet, resolveLink)}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-700 dark:text-amber-300" aria-hidden />
                  <span>{renderInlineContent(article.sections.highRisk.opensslBullet, resolveLink)}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-700 dark:text-amber-300" aria-hidden />
                  <span>{renderInlineContent(article.sections.highRisk.separateChannelBullet, resolveLink)}</span>
                </li>
              </ul>
            </div>
            <p>{renderInlineContent(article.sections.highRisk.outro, resolveLink)}</p>
          </section>

          <hr className="border-gray-200 dark:border-gray-800" />

          <section id="safer-handoff" className={sectionClass}>
            <SectionHeading>{article.sections.handoff.title}</SectionHeading>
            <p className="text-pretty">{article.sections.handoff.intro}</p>
            <figure className="overflow-hidden rounded-2xl border border-primary/20 bg-primary/[0.04] p-5 dark:border-primary/25 dark:bg-primary/[0.07] sm:p-6">
              <figcaption className="mb-4 text-xs font-semibold uppercase tracking-wider text-primary/80 dark:text-primary/70">
                {article.sections.handoff.diagramCaption}
              </figcaption>
              <div className="flex flex-col gap-2 sm:grid sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-stretch sm:gap-x-1 sm:gap-y-0">
                {article.handoffSteps.map((step, index) => (
                  <React.Fragment key={step.key}>
                    <HandoffFlowNode
                      icon={handoffIcons[step.key]}
                      label={step.label}
                      detail={step.detail}
                    />
                    {index < article.handoffSteps.length - 1 ? <HandoffFlowArrow /> : null}
                  </React.Fragment>
                ))}
              </div>
              <p className="mt-4 text-center text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {article.sections.handoff.diagramFootnote}
              </p>
            </figure>
          </section>

          <hr className="border-gray-200 dark:border-gray-800" />

          <section id="how-privatenote-fits" className={sectionClass}>
            <SectionHeading>{article.sections.privateNote.title}</SectionHeading>
            <p>{article.sections.privateNote.p1}</p>
            <p>{renderInlineContent(article.sections.privateNote.relatedSsh, resolveLink)}</p>
            <p>{renderInlineContent(article.sections.privateNote.p2, resolveLink)}</p>
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
              <p className="mb-3 font-mono text-sm text-gray-800 dark:text-gray-100">
                {article.sections.privateNote.urlExample}
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" aria-hidden />
                  <span>{article.sections.privateNote.bullet1}</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" aria-hidden />
                  <span>{article.sections.privateNote.bullet2}</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" aria-hidden />
                  <span>{article.sections.privateNote.bullet3}</span>
                </li>
              </ul>
            </div>
            <p>{article.sections.privateNote.p3}</p>
          </section>

          <hr className="border-gray-200 dark:border-gray-800" />

          <section id="faq" className={sectionClass}>
            <SectionHeading>{article.sections.faq.title}</SectionHeading>
            <div className="space-y-4">
              {article.faqs.map((faq) => (
                <div key={faq.question}>
                  <p>
                    <strong className="font-semibold text-gray-900 dark:text-white">{faq.question}</strong>
                  </p>
                  <p className="mt-1">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <hr className="border-gray-200 dark:border-gray-800" />

          <section className="space-y-4">
            <SectionHeading>{article.sections.bottomLine.title}</SectionHeading>
            <p>{article.sections.bottomLine.body}</p>
          </section>
        </div>

        <div className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-6">
          <h2 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">{article.ctaTitle}</h2>
          <p className="mb-5 text-gray-700 dark:text-gray-300">{article.ctaBody}</p>
          <Link
            href={homePath}
            className="inline-flex items-center rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-primary/90"
          >
            {article.ctaButton}
          </Link>
        </div>

        <BlogPostCrossLinks slug="how-to-share-api-key-securely" />
      </article>
    </BlogGuideLayout>
  );
};
