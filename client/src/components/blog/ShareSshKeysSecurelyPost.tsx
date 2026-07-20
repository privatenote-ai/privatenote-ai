import React from "react";
import { Link } from "wouter";
import { ArrowRight, Shield } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { blogPostPath, localizedPath } from "@/utils/localizedPath";
import { CHROME_EXTENSION_STORE_URL } from "@/utils/chromeExtensionOnboarding";
import type { SupportedLanguage } from "@/utils/translation";
import { BlogPostBackLink, BlogPostHeader, blogPostPageClass } from "@/components/blog/BlogPostChrome";
import { BlogPostCrossLinks } from "@/components/blog/BlogPostCrossLinks";
import { getBlogArticleCopy } from "@/components/blog/blogArticleLocale";
import { shareSshKeysSecurelyDe } from "@/components/blog/locale/shareSshKeysSecurely.de";
import { shareSshKeysSecurelyEn } from "@/components/blog/locale/shareSshKeysSecurely.en";
import { shareSshKeysSecurelyEs } from "@/components/blog/locale/shareSshKeysSecurely.es";
import { shareSshKeysSecurelyFr } from "@/components/blog/locale/shareSshKeysSecurely.fr";
import { shareSshKeysSecurelyHr } from "@/components/blog/locale/shareSshKeysSecurely.hr";
import { shareSshKeysSecurelyIt } from "@/components/blog/locale/shareSshKeysSecurely.it";
import { shareSshKeysSecurelyNl } from "@/components/blog/locale/shareSshKeysSecurely.nl";
import { shareSshKeysSecurelyPt } from "@/components/blog/locale/shareSshKeysSecurely.pt";
import { shareSshKeysSecurelySr } from "@/components/blog/locale/shareSshKeysSecurely.sr";
import type {
  ShareSshKeysSecurelyArticleCopy,
  ShareSshKeysSecurelyFlowStep,
} from "@/components/blog/locale/shareSshKeysSecurely.types";
import { cn } from "@/lib/utils";

const heroImagePath = "/images/blog-share-ssh-keys-securely-hero.jpg";
const slug = "how-to-share-ssh-keys-securely";

const copy: Partial<Record<SupportedLanguage, ShareSshKeysSecurelyArticleCopy>> & {
  en: ShareSshKeysSecurelyArticleCopy;
} = {
  en: shareSshKeysSecurelyEn,
  de: shareSshKeysSecurelyDe,
  fr: shareSshKeysSecurelyFr,
  es: shareSshKeysSecurelyEs,
  it: shareSshKeysSecurelyIt,
  nl: shareSshKeysSecurelyNl,
  pt: shareSshKeysSecurelyPt,
  sr: shareSshKeysSecurelySr,
  hr: shareSshKeysSecurelyHr,
};

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
        "leading-[1.85] text-gray-700 dark:text-gray-300",
        lead ? "text-xl font-medium leading-relaxed text-gray-900 dark:text-gray-100" : "text-[1.0625rem]",
      )}
    >
      {renderInlineContent(text, resolveLink)}
    </p>
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

function FlowSteps({
  steps,
  resolveLink,
}: {
  steps: ShareSshKeysSecurelyFlowStep[];
  resolveLink: (href: string) => { to: string; external: boolean };
}) {
  return (
    <ol className="m-0 list-none space-y-0 p-0">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        return (
          <li className="relative flex gap-4 sm:gap-5" key={step.title}>
            <div className="flex w-10 shrink-0 flex-col items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white shadow-sm">
                {index + 1}
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
  );
}

export const ShareSshKeysSecurelyPost: React.FC = () => {
  const { t, language } = useLanguage();
  const article = getBlogArticleCopy(copy, language);
  const homePath = localizedPath("/", language);

  const resolveLink = (href: string): { to: string; external: boolean } => {
    if (href.startsWith("blog:")) {
      return { to: blogPostPath(href.slice(5), language), external: false };
    }
    if (href.startsWith("app:")) {
      const path = href.slice(4).replace(/^\/+/, "");
      if (!path || path === "home") {
        return { to: homePath, external: false };
      }
      return { to: localizedPath(`/${path}`, language), external: false };
    }
    if (href.startsWith("chrome:")) {
      return { to: CHROME_EXTENSION_STORE_URL, external: true };
    }
    if (href.startsWith("http://") || href.startsWith("https://")) {
      return { to: href, external: true };
    }
    return { to: localizedPath(href.startsWith("/") ? href : `/${href}`, language), external: false };
  };

  return (
    <div className={cn(blogPostPageClass, "pb-12 mb-28")}>
      <BlogPostBackLink />

      <article>
        <BlogPostHeader
          slug={slug}
          title={t.blogShareSshKeysSecurelyTitle}
          excerpt={t.blogShareSshKeysSecurelyExcerpt}
          headerClassName="mb-14 sm:mb-16"
        >
          <figure className="mt-10 sm:mt-12">
            <img
              src={heroImagePath}
              alt={article.heroAlt}
              width={1000}
              height={666}
              className="aspect-[3/2] w-full rounded-2xl border border-gray-200 object-cover shadow-sm dark:border-gray-800"
            />
            <figcaption className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
              {article.heroCaption}
            </figcaption>
          </figure>
        </BlogPostHeader>

        <div className="space-y-12 text-[1.0625rem] leading-[1.85] text-gray-700 dark:text-gray-300 sm:space-y-14">
          <div className="space-y-5 sm:space-y-6">
            {article.intro.map((paragraph, index) => (
              <ArticleParagraph
                key={paragraph}
                text={paragraph}
                lead={index === 0}
                resolveLink={resolveLink}
              />
            ))}
          </div>

          {article.sections.map((section) => (
            <ArticleSection key={section.title} title={section.title}>
              {section.paragraphs?.map((paragraph) => (
                <ArticleParagraph key={paragraph} text={paragraph} resolveLink={resolveLink} />
              ))}

              {section.flowIntro ? (
                <ArticleParagraph text={section.flowIntro} resolveLink={resolveLink} />
              ) : null}

              {section.flowSteps ? (
                <div className="rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/[0.04] via-white to-gray-50 px-5 py-6 dark:border-primary/20 dark:from-primary/[0.06] dark:via-gray-950 dark:to-gray-900/40 sm:px-6 sm:py-7">
                  <FlowSteps steps={section.flowSteps} resolveLink={resolveLink} />
                </div>
              ) : null}

              {section.midCta ? (
                <div className="rounded-2xl border border-primary/20 bg-primary/[0.04] px-5 py-5 dark:border-primary/25 dark:bg-primary/[0.08] sm:px-6">
                  <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                    {section.midCta.body}
                  </p>
                  <Link
                    href={homePath}
                    className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary/90"
                  >
                    {section.midCta.button}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              ) : null}

              {section.comparisonTable ? (
                <div className="space-y-5">
                  <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800">
                    <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-900/60">
                        <tr>
                          {section.comparisonTable.headers.map((header) => (
                            <th
                              key={header}
                              className="border-b border-gray-200 px-4 py-3 font-semibold text-gray-900 dark:border-gray-800 dark:text-white"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {section.comparisonTable.rows.map((row) => (
                          <tr key={row[0]} className="align-top">
                            {row.map((cell, cellIndex) => (
                              <td
                                key={`${row[0]}-${cellIndex}`}
                                className="border-b border-gray-200 px-4 py-3 text-gray-700 dark:border-gray-800 dark:text-gray-300"
                              >
                                {cellIndex === 0 ? (
                                  <span className="font-medium text-gray-900 dark:text-white">{cell}</span>
                                ) : (
                                  cell
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {section.comparisonTable.after?.map((paragraph) => (
                    <ArticleParagraph key={paragraph} text={paragraph} resolveLink={resolveLink} />
                  ))}
                </div>
              ) : null}

              {section.useCaseTable ? (
                <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800">
                  <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-900/60">
                      <tr>
                        {section.useCaseTable.headers.map((header) => (
                          <th
                            key={header}
                            className="border-b border-gray-200 px-4 py-3 font-semibold text-gray-900 dark:border-gray-800 dark:text-white"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.useCaseTable.rows.map((row) => (
                        <tr key={row[0]} className="align-top">
                          <td className="border-b border-gray-200 px-4 py-3 font-medium text-gray-900 dark:border-gray-800 dark:text-white">
                            {row[0]}
                          </td>
                          <td className="border-b border-gray-200 px-4 py-3 text-gray-700 dark:border-gray-800 dark:text-gray-300">
                            {row[1]}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}

              {section.subsections?.map((subsection) => (
                <div key={subsection.title} className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{subsection.title}</h3>
                  {subsection.paragraphs.map((paragraph) => (
                    <ArticleParagraph key={paragraph} text={paragraph} resolveLink={resolveLink} />
                  ))}
                </div>
              ))}

              {section.callout ? (
                <blockquote className="rounded-2xl border border-gray-200 bg-gray-50/80 px-5 py-4 text-base leading-relaxed text-gray-800 dark:border-gray-800 dark:bg-gray-900/40 dark:text-gray-200 sm:px-6">
                  {section.calloutTitle ? (
                    <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-900 dark:text-white">
                      {section.calloutTitle}
                    </p>
                  ) : null}
                  {renderInlineContent(section.callout, resolveLink)}
                </blockquote>
              ) : null}

              {section.faqs ? (
                <div className="space-y-6">
                  {section.faqs.map((faq) => (
                    <div key={faq.question} className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{faq.question}</h3>
                      <ArticleParagraph text={faq.answer} resolveLink={resolveLink} />
                    </div>
                  ))}
                </div>
              ) : null}
            </ArticleSection>
          ))}

          <section className="rounded-3xl border border-primary/20 bg-primary/[0.04] p-7 dark:border-primary/25 dark:bg-primary/[0.08] sm:p-8">
            <div className="flex gap-4">
              <Shield className="mt-1 h-6 w-6 shrink-0 text-primary" aria-hidden />
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{article.ctaTitle}</h2>
                <p className="mt-4 text-base leading-relaxed text-gray-700 dark:text-gray-300">
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
    </div>
  );
};
