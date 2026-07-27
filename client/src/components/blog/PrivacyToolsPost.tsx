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
import { privacyToolsGuideDe } from "@/components/blog/locale/privacyToolsGuide.de";
import { privacyToolsGuideEn } from "@/components/blog/locale/privacyToolsGuide.en";
import { privacyToolsGuideEs } from "@/components/blog/locale/privacyToolsGuide.es";
import { privacyToolsGuideFr } from "@/components/blog/locale/privacyToolsGuide.fr";
import { privacyToolsGuideHr } from "@/components/blog/locale/privacyToolsGuide.hr";
import { privacyToolsGuideIt } from "@/components/blog/locale/privacyToolsGuide.it";
import { privacyToolsGuideNl } from "@/components/blog/locale/privacyToolsGuide.nl";
import { privacyToolsGuidePt } from "@/components/blog/locale/privacyToolsGuide.pt";
import { privacyToolsGuideSr } from "@/components/blog/locale/privacyToolsGuide.sr";
import type { PrivacyToolsGuideArticleCopy } from "@/components/blog/locale/privacyToolsGuide.types";
import { cn } from "@/lib/utils";

const slug = "privacy-tools";

const copy: Partial<Record<SupportedLanguage, PrivacyToolsGuideArticleCopy>> & {
  en: PrivacyToolsGuideArticleCopy;
} = {
  en: privacyToolsGuideEn,
  de: privacyToolsGuideDe,
  fr: privacyToolsGuideFr,
  es: privacyToolsGuideEs,
  it: privacyToolsGuideIt,
  nl: privacyToolsGuideNl,
  pt: privacyToolsGuidePt,
  hr: privacyToolsGuideHr,
  sr: privacyToolsGuideSr,
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

function resolveArticleHref(
  href: string,
  language: SupportedLanguage,
  homePath: string,
): { to: string; external: boolean } {
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
  if (href.startsWith("http://") || href.startsWith("https://")) {
    return { to: href, external: true };
  }
  return { to: localizedPath(href.startsWith("/") ? href : `/${href}`, language), external: false };
}

export const PrivacyToolsPost: React.FC = () => {
  const { t, language } = useLanguage();
  const article = getBlogArticleCopy(copy, language);
  const homePath = localizedPath("/", language);

  const resolveLink = (href: string) => resolveArticleHref(href, language, homePath);

  return (
    <BlogGuideArticle slug={slug}>
      <article>
        <BlogPostHeader
          slug={slug}
          title={t.blogPrivacyTitle}
          excerpt={t.blogPrivacyExcerpt}
          headerClassName="mb-14 sm:mb-16"
        />

        <BlogArticleTakeaways slug={slug} />

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

              {section.bullets ? (
                <ul className="list-disc space-y-3 pl-5 text-[1.0625rem] leading-relaxed text-gray-700 dark:text-gray-300">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{renderInlineContent(bullet, resolveLink)}</li>
                  ))}
                </ul>
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
                  {subsection.bullets ? (
                    <ul className="list-disc space-y-2 pl-5 text-[1.0625rem] leading-relaxed text-gray-700 dark:text-gray-300">
                      {subsection.bullets.map((bullet) => (
                        <li key={bullet}>{renderInlineContent(bullet, resolveLink)}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}

              {section.midCta ? (
                <div className="rounded-2xl border border-primary/20 bg-primary/[0.04] px-5 py-5 dark:border-primary/25 dark:bg-primary/[0.08] sm:px-6">
                  <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                    {section.midCta.body}
                  </p>
                  <Link
                    href={resolveLink(section.midCta.href ?? "app:home").to}
                    className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary/90"
                  >
                    {section.midCta.button}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              ) : null}

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
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link
                    href={homePath}
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary/90"
                  >
                    {article.ctaButton}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                  {article.ctaSecondaryLabel && article.ctaSecondaryHref ? (
                    <Link
                      href={resolveLink(article.ctaSecondaryHref).to}
                      className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-primary hover:underline"
                    >
                      {article.ctaSecondaryLabel}
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          </section>
        </div>

        <BlogPostCrossLinks slug={slug} />
      </article>
    </BlogGuideArticle>
  );
};
