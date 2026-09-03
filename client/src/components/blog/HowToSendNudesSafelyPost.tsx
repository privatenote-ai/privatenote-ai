import React from "react";
import { Link } from "wouter";
import { ArrowRight, Shield } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { blogPostPath, localizedPath } from "@/utils/localizedPath";
import type { SupportedLanguage } from "@/utils/translation";
import { BlogPostHeader } from "@/components/blog/BlogPostChrome";
import { BlogGuideArticle } from "@/components/blog/BlogGuideArticle";
import { BlogArticleTakeaways } from "@/components/blog/BlogArticleTakeaways";
import { BlogPostCrossLinks } from "@/components/blog/BlogPostCrossLinks";
import { getBlogArticleCopy } from "@/components/blog/blogArticleLocale";
import { howToSendNudesSafelyEn } from "@/components/blog/locale/howToSendNudesSafely.en";
import type { HowToSendNudesSafelyCopy } from "@/components/blog/locale/howToSendNudesSafely.types";
import { cn } from "@/lib/utils";

const heroImagePath = "/images/blog-how-to-send-nudes-safely-hero.jpg";
const slug = "how-to-send-nudes-safely";

const copy: Partial<Record<SupportedLanguage, HowToSendNudesSafelyCopy>> & {
  en: HowToSendNudesSafelyCopy;
} = {
  en: howToSendNudesSafelyEn,
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

function Body({
  text,
  lead = false,
  className,
  resolveLink,
}: {
  text: string;
  lead?: boolean;
  className?: string;
  resolveLink: (href: string) => { to: string; external: boolean };
}) {
  return (
    <p
      className={cn(
        "leading-[1.85] text-gray-700 dark:text-gray-300",
        lead ? "text-xl font-medium leading-relaxed text-gray-900 dark:text-gray-100" : "text-lg",
        className,
      )}
    >
      {renderInlineContent(text, resolveLink)}
    </p>
  );
}

function ArticleSection({
  title,
  takeaway,
  children,
}: {
  title: string;
  takeaway?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-5 sm:space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h2>
        {takeaway ? (
          <p className="max-w-2xl text-[0.95rem] font-medium leading-snug text-gray-500 dark:text-gray-400">
            {takeaway}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export const HowToSendNudesSafelyPost: React.FC = () => {
  const { t, language } = useLanguage();
  const article = getBlogArticleCopy(copy, language);
  const homePath = localizedPath("/", language);
  const faqs = article.faqs.items;

  const resolveLink = (href: string): { to: string; external: boolean } => {
    if (href.startsWith("blog:")) {
      return { to: blogPostPath(href.slice(5), language), external: false };
    }
    if (href.startsWith("http://") || href.startsWith("https://")) {
      return { to: href, external: true };
    }
    return { to: localizedPath(href.startsWith("/") ? href : `/${href}`, language), external: false };
  };

  return (
    <BlogGuideArticle slug={slug} showMobileToc={false}>
      <article>
        <BlogPostHeader
          slug={slug}
          title={t.blogHowToSendNudesSafelyTitle}
          subtitle={t.blogHowToSendNudesSafelySubtitle}
          excerpt={t.blogHowToSendNudesSafelyExcerpt}
          excerptClassName="max-w-3xl text-xl leading-relaxed text-gray-700 dark:text-gray-300 sm:text-[1.35rem] sm:leading-[1.65]"
          faqs={faqs}
          headerClassName="mb-14 sm:mb-16"
        >
          <figure className="mt-10 sm:mt-12">
            <img
              src={heroImagePath}
              alt={article.heroAlt}
              width={1400}
              height={788}
              className="aspect-[16/9] w-full rounded-2xl border border-gray-200 object-cover shadow-sm dark:border-gray-800"
            />
            <figcaption className="mt-3 text-center text-xs leading-relaxed text-gray-500 dark:text-gray-400">
              {article.heroCaption}
            </figcaption>
          </figure>
        </BlogPostHeader>

        <BlogArticleTakeaways
          slug={slug}
          variant="quiet"
          className="mb-10 max-w-3xl sm:mb-12"
        />

        <p className="mb-12 max-w-3xl text-xl font-medium leading-relaxed text-gray-900 dark:text-gray-100 sm:mb-14">
          {article.quickAnswer}
        </p>

        <div className="max-w-3xl space-y-12 text-lg leading-[1.85] text-gray-700 dark:text-gray-300 sm:space-y-14">
          <ArticleSection title={article.consent.title} takeaway={article.consent.takeaway}>
            <div className="space-y-5">
              {article.consent.paragraphs.map((paragraph, index) => (
                <Body
                  key={paragraph}
                  text={paragraph}
                  lead={index === 0}
                  resolveLink={resolveLink}
                />
              ))}
            </div>
            <aside className="rounded-2xl border border-amber-200/80 bg-amber-50/70 px-5 py-4 dark:border-amber-900/50 dark:bg-amber-950/30 sm:px-6">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-200">
                {article.consent.warningTitle}
              </p>
              <p className="text-lg leading-[1.85] text-gray-800 dark:text-gray-200">
                {renderInlineContent(article.consent.warning, resolveLink)}
              </p>
            </aside>
          </ArticleSection>

          <ArticleSection title={article.identify.title} takeaway={article.identify.takeaway}>
            <Body text={article.identify.lead} resolveLink={resolveLink} />
            <ul className="grid gap-x-10 gap-y-3 sm:grid-cols-2">
              {article.identify.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span className="text-lg leading-[1.85] text-gray-700 dark:text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </ArticleSection>

          <ArticleSection title={article.workflow.title} takeaway={article.workflow.takeaway}>
            <ol className="rounded-2xl border border-gray-200 bg-white px-5 py-6 dark:border-gray-800 dark:bg-gray-950/40 sm:px-6">
              {article.workflow.steps.map((step, index) => (
                <li key={step.label} className="flex gap-4">
                  <div className="flex w-8 shrink-0 flex-col items-center">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                      {index + 1}
                    </span>
                    {index < article.workflow.steps.length - 1 ? (
                      <span className="mt-1 w-px flex-1 bg-primary/20" aria-hidden />
                    ) : null}
                  </div>
                  <div className={cn("min-w-0", index < article.workflow.steps.length - 1 ? "pb-6" : "pb-0")}>
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">{step.label}</p>
                    <p className="mt-1 text-lg font-medium leading-snug text-gray-900 dark:text-white">
                      {step.action}
                    </p>
                    <p className="mt-1 text-base leading-relaxed text-gray-500 dark:text-gray-400">{step.why}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Body text={article.workflow.after} resolveLink={resolveLink} />
          </ArticleSection>

          <ArticleSection title={article.rules.title} takeaway={article.rules.takeaway}>
            <div className="space-y-8">
              {article.rules.groups.map((group) => (
                <div key={group.heading} className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{group.heading}</h3>
                  <div className="space-y-4">
                    {group.paragraphs.map((paragraph) => (
                      <Body key={paragraph} text={paragraph} resolveLink={resolveLink} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-primary/20 bg-primary/[0.04] px-5 py-5 dark:border-primary/25 dark:bg-primary/[0.08] sm:px-6">
              <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-200">
                {article.rules.midCtaBody}
              </p>
              <Link
                href={homePath}
                className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary/90"
              >
                {article.rules.midCtaButton}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </ArticleSection>

          <ArticleSection title={article.screenshot.title} takeaway={article.screenshot.takeaway}>
            <div className="space-y-5">
              {article.screenshot.paragraphs.map((paragraph) => (
                <Body key={paragraph} text={paragraph} resolveLink={resolveLink} />
              ))}
            </div>
            <blockquote className="rounded-2xl border border-gray-200 bg-gray-50/80 px-5 py-4 dark:border-gray-800 dark:bg-gray-900/40 sm:px-6">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-900 dark:text-white">
                {article.screenshot.calloutTitle}
              </p>
              <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-200">
                {renderInlineContent(article.screenshot.callout, resolveLink)}
              </p>
            </blockquote>
          </ArticleSection>

          <ArticleSection title={article.product.title} takeaway={article.product.takeaway}>
            <div className="space-y-5">
              {article.product.paragraphs.map((paragraph) => (
                <Body key={paragraph} text={paragraph} resolveLink={resolveLink} />
              ))}
            </div>
            <blockquote className="rounded-2xl border border-gray-200 bg-gray-50/80 px-5 py-4 dark:border-gray-800 dark:bg-gray-900/40 sm:px-6">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-900 dark:text-white">
                {article.product.calloutTitle}
              </p>
              <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-200">
                {renderInlineContent(article.product.callout, resolveLink)}
              </p>
            </blockquote>
          </ArticleSection>

          <ArticleSection title={article.incident.title} takeaway={article.incident.takeaway}>
            <Body text={article.incident.lead} resolveLink={resolveLink} />
            <ul className="space-y-3">
              {article.incident.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span className="text-lg leading-[1.85] text-gray-700 dark:text-gray-300">
                    {renderInlineContent(item, resolveLink)}
                  </span>
                </li>
              ))}
            </ul>
            <Body text={article.incident.after} resolveLink={resolveLink} />
          </ArticleSection>

          <ArticleSection title={article.sources.title}>
            <Body text={article.sources.intro} resolveLink={resolveLink} />
            <ul className="divide-y divide-gray-200 border-y border-gray-200 dark:divide-gray-800 dark:border-gray-800">
              {article.sources.items.map((item) => (
                <li key={item.href} className="py-4">
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary hover:underline"
                  >
                    {item.label}
                  </a>
                  <p className="mt-1 text-base leading-relaxed text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                </li>
              ))}
            </ul>
          </ArticleSection>

          <ArticleSection title={article.faqs.title}>
            <div className="divide-y divide-gray-200 overflow-hidden rounded-2xl border border-gray-200 dark:divide-gray-800 dark:border-gray-800">
              {article.faqs.items.map((faq) => (
                <div key={faq.question} className="bg-white px-5 py-5 dark:bg-gray-950/40 sm:px-6 sm:py-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{faq.question}</h3>
                  <p className="mt-2 text-base leading-[1.75] text-gray-600 dark:text-gray-400">
                    {renderInlineContent(faq.answer, resolveLink)}
                  </p>
                </div>
              ))}
            </div>
          </ArticleSection>

          <ArticleSection title={article.close.title} takeaway={article.close.takeaway}>
            <div className="space-y-5">
              {article.close.paragraphs.map((paragraph) => (
                <Body key={paragraph} text={paragraph} resolveLink={resolveLink} />
              ))}
            </div>
          </ArticleSection>

          <section className="rounded-3xl border border-primary/20 bg-primary/[0.04] p-7 dark:border-primary/25 dark:bg-primary/[0.08] sm:p-8">
            <div className="flex gap-4">
              <Shield className="mt-1 h-6 w-6 shrink-0 text-primary" aria-hidden />
              <div>
                <h2
                  data-blog-toc-ignore="true"
                  className="text-xl font-bold text-gray-900 dark:text-white"
                >
                  {article.ctaTitle}
                </h2>
                <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                  {article.ctaBody}
                </p>
                <Link
                  href={homePath}
                  className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary/90"
                >
                  {article.ctaButton}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </div>
          </section>
        </div>

        <BlogPostCrossLinks slug={slug} />
      </article>
    </BlogGuideArticle>
  );
};
