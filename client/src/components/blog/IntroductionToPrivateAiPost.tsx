import React from "react";
import { Link } from "wouter";
import { ArrowRight, Globe, Laptop, Server, Shield, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { blogPostPath, localizedPath } from "@/utils/localizedPath";
import type { SupportedLanguage } from "@/utils/translation";
import { BlogPostBackLink, BlogPostHeader, blogPostPageClass } from "@/components/blog/BlogPostChrome";
import { BlogPostCrossLinks } from "@/components/blog/BlogPostCrossLinks";
import { getBlogArticleCopy } from "@/components/blog/blogArticleLocale";
import { introductionToPrivateAiDe } from "@/components/blog/locale/introductionToPrivateAi.de";
import { introductionToPrivateAiEn } from "@/components/blog/locale/introductionToPrivateAi.en";
import { introductionToPrivateAiEs } from "@/components/blog/locale/introductionToPrivateAi.es";
import { introductionToPrivateAiFr } from "@/components/blog/locale/introductionToPrivateAi.fr";
import { introductionToPrivateAiHr } from "@/components/blog/locale/introductionToPrivateAi.hr";
import { introductionToPrivateAiIt } from "@/components/blog/locale/introductionToPrivateAi.it";
import { introductionToPrivateAiNl } from "@/components/blog/locale/introductionToPrivateAi.nl";
import { introductionToPrivateAiPt } from "@/components/blog/locale/introductionToPrivateAi.pt";
import { introductionToPrivateAiSr } from "@/components/blog/locale/introductionToPrivateAi.sr";
import type { IntroductionToPrivateAiArticleCopy } from "@/components/blog/locale/introductionToPrivateAi.types";

const heroImagePath = "/images/blog-introduction-to-private-ai-hero.jpg";
const DEPLOYMENT_FLOW_ICONS: LucideIcon[] = [Laptop, Globe, Server];

type ArticleCopy = IntroductionToPrivateAiArticleCopy;
type FlowStep = NonNullable<ArticleCopy["sections"][number]["flowSteps"]>[number];

function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
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
        if (part.startsWith("*") && part.endsWith("*")) {
          return (
            <em key={index} className="italic">
              {part.slice(1, -1)}
            </em>
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
        <a
          key={index}
          href={to}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary hover:underline"
        >
          {label}
        </a>
      );
    }
    return (
      <Link key={index} href={to} className="font-medium text-primary hover:underline">
        {label}
      </Link>
    );
  });
}

function ArticleParagraph({
  text,
  lead = false,
  resolveLink,
}: {
  text: string;
  lead?: boolean;
  resolveLink: (href: string) => { to: string; external: boolean };
}) {
  return (
    <p
      className={cn(
        "leading-[1.8] text-gray-700 dark:text-gray-300",
        lead ? "text-xl font-medium leading-relaxed text-gray-900 dark:text-gray-100" : "text-[1.0625rem]",
      )}
    >
      {renderInlineContent(text, resolveLink)}
    </p>
  );
}

function CalloutBox({
  text,
  resolveLink,
}: {
  text: string;
  resolveLink: (href: string) => { to: string; external: boolean };
}) {
  return (
    <blockquote className="my-2 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.07] to-violet-500/[0.05] px-6 py-5 dark:border-primary/25 dark:from-primary/10 dark:to-violet-500/10">
      <p className="text-[1.0625rem] leading-[1.75] text-gray-800 dark:text-gray-100">
        {renderInlineContent(text, resolveLink)}
      </p>
    </blockquote>
  );
}

function BulletList({
  items,
  resolveLink,
}: {
  items: string[];
  resolveLink: (href: string) => { to: string; external: boolean };
}) {
  return (
    <ul className="space-y-3.5">
      {items.map((item) => (
        <li className="flex gap-3.5" key={item}>
          <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" aria-hidden />
          <span className="text-[1.0625rem] leading-[1.75] text-gray-700 dark:text-gray-300">
            {renderInlineContent(item, resolveLink)}
          </span>
        </li>
      ))}
    </ul>
  );
}

function PrivateAiFlowDiagram({
  steps,
  caption,
  resolveLink,
}: {
  steps: FlowStep[];
  caption?: string;
  resolveLink: (href: string) => { to: string; external: boolean };
}) {
  return (
    <figure className="rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/[0.04] via-white to-violet-500/[0.03] px-5 py-6 shadow-sm dark:border-primary/20 dark:from-primary/[0.06] dark:via-gray-950 dark:to-violet-500/[0.04] sm:px-6 sm:py-7">
      {caption ? (
        <figcaption className="mb-5 text-sm font-semibold tracking-tight text-gray-800 dark:text-gray-200">
          {caption}
        </figcaption>
      ) : null}
      <ol className="m-0 list-none space-y-0 p-0">
        {steps.map((step, index) => {
          const Icon = DEPLOYMENT_FLOW_ICONS[index] ?? Server;
          const isLast = index === steps.length - 1;

          return (
            <li className="relative flex gap-4 sm:gap-5" key={step.title}>
              <div className="flex w-10 shrink-0 flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-primary/20 dark:bg-gray-950 dark:ring-primary/30">
                  <Icon className="h-4 w-4 text-primary" aria-hidden />
                </div>
                {!isLast ? (
                  <div
                    className="my-2 w-px flex-1 min-h-[1.5rem] bg-gradient-to-b from-primary/35 to-gray-200 dark:to-gray-700"
                    aria-hidden
                  />
                ) : null}
              </div>
              <div className={cn("min-w-0 flex-1", isLast ? "pb-0" : "pb-6 sm:pb-7")}>
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-primary/80 dark:text-primary/70">
                  {step.step}
                </p>
                <p className="mt-1.5 text-base font-semibold leading-snug text-gray-900 dark:text-white">
                  {step.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {renderInlineContent(step.body, resolveLink)}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </figure>
  );
}

const copy: Partial<Record<SupportedLanguage, ArticleCopy>> & { en: ArticleCopy } = {
  en: introductionToPrivateAiEn,
  de: introductionToPrivateAiDe,
  es: introductionToPrivateAiEs,
  fr: introductionToPrivateAiFr,
  it: introductionToPrivateAiIt,
  nl: introductionToPrivateAiNl,
  pt: introductionToPrivateAiPt,
  hr: introductionToPrivateAiHr,
  sr: introductionToPrivateAiSr,
};

export const IntroductionToPrivateAiPost: React.FC = () => {
  const { t, language } = useLanguage();
  const homePath = localizedPath("/", language);
  const article = getBlogArticleCopy(copy, language);
  const blogHref = (slug: string) => blogPostPath(slug, language);
  const resolveLink = (href: string) => {
    if (href.startsWith("blog:")) {
      return { to: blogHref(href.slice(5)), external: false };
    }
    if (href.startsWith("app:")) {
      const path = href.slice(4).replace(/^\/+/, "");
      if (!path || path === "home") {
        return { to: localizedPath("/", language), external: false };
      }
      return { to: localizedPath(`/${path}`, language), external: false };
    }
    return { to: href, external: true };
  };

  return (
    <div className={blogPostPageClass}>
      <BlogPostBackLink />

      <article>
        <BlogPostHeader
          slug="introduction-to-private-ai"
          title={t.blogIntroductionPrivateAiTitle}
          excerpt={t.blogIntroductionPrivateAiExcerpt}
          headerClassName="mb-12"
        >
          <figure className="mt-8 flex flex-col items-center">
            <img
              src={heroImagePath}
              alt={article.heroAlt}
              width={900}
              height={599}
              className="mx-auto w-full max-w-2xl rounded-2xl border border-gray-200 dark:border-gray-800"
            />
            <figcaption className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
              {article.heroAlt}
            </figcaption>
          </figure>
        </BlogPostHeader>

        <div className="space-y-6 leading-relaxed">
          {article.intro.map((paragraph, index) => (
            <ArticleParagraph key={paragraph} text={paragraph} lead={index === 0} resolveLink={resolveLink} />
          ))}
        </div>

        <div className="mt-14 space-y-14">
          {article.sections.map((section) => (
            <section className="space-y-5 border-t border-gray-200 pt-10 dark:border-gray-800" key={section.title}>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{section.title}</h2>

              {section.paragraphs.map((paragraph) => (
                <ArticleParagraph key={paragraph} text={paragraph} resolveLink={resolveLink} />
              ))}

              {section.bullets ? <BulletList items={section.bullets} resolveLink={resolveLink} /> : null}

              {section.beforeFlowSteps ? (
                <ArticleParagraph text={section.beforeFlowSteps} resolveLink={resolveLink} />
              ) : null}

              {section.flowSteps ? (
                <PrivateAiFlowDiagram
                  steps={section.flowSteps}
                  caption={section.flowDiagramCaption}
                  resolveLink={resolveLink}
                />
              ) : null}

              {section.afterFlowSteps?.map((paragraph) => (
                <ArticleParagraph key={paragraph} text={paragraph} resolveLink={resolveLink} />
              ))}

              {section.callout ? <CalloutBox text={section.callout} resolveLink={resolveLink} /> : null}
            </section>
          ))}
        </div>

        <div className="mt-14 border-t border-gray-200 pt-8 dark:border-gray-800">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
            <Shield className="h-4 w-4 text-primary/70" />
            {article.closingTitle}
          </h2>
          {article.closingBody.map((paragraph) => (
            <p key={paragraph} className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
              {renderInlineContent(paragraph, resolveLink)}
            </p>
          ))}
          <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
            {renderInlineContent(article.fileSharingNote, resolveLink)}
          </p>
          <p className="mb-6 leading-relaxed text-gray-700 dark:text-gray-300">
            <RichText text={article.tagline} />
          </p>
          <Link
            href={homePath}
            className="group inline-flex items-center gap-2.5 rounded-xl border border-primary/25 bg-primary/5 px-6 py-3.5 text-lg font-semibold text-primary transition-colors hover:border-primary/40 hover:bg-primary/10 dark:border-primary/30 dark:bg-primary/10 dark:hover:bg-primary/15"
          >
            {t.createNewNote}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <BlogPostCrossLinks slug="introduction-to-private-ai" />
      </article>
    </div>
  );
};
