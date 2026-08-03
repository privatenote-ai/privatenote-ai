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
import { howToSharePhotosSecurelyEn } from "@/components/blog/locale/howToSharePhotosSecurely.en";
import type { HowToSharePhotosSecurelyArticleCopy } from "@/components/blog/locale/howToSharePhotosSecurely.types";
import { cn } from "@/lib/utils";

const heroImagePath = "/images/blog-how-to-share-photos-securely-hero.jpg";
const slug = "how-to-share-photos-securely";

const copy: Partial<Record<SupportedLanguage, HowToSharePhotosSecurelyArticleCopy>> & {
  en: HowToSharePhotosSecurelyArticleCopy;
} = {
  en: howToSharePhotosSecurelyEn,
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
        lead ? "text-xl font-medium leading-relaxed text-gray-900 dark:text-gray-100" : "text-lg",
      )}
    >
      {renderInlineContent(text, resolveLink)}
    </p>
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
    <ul className="space-y-3">
      {items.map((item) => (
        <li className="flex gap-3" key={item}>
          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
          <span className="text-lg leading-[1.85] text-gray-700 dark:text-gray-300">
            {renderInlineContent(item, resolveLink)}
          </span>
        </li>
      ))}
    </ul>
  );
}

function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="m-0 list-none space-y-3 p-0">
      {items.map((item) => (
        <li
          key={item}
          className="flex gap-3 rounded-xl border border-primary/15 bg-primary/[0.03] px-4 py-3 dark:border-primary/20 dark:bg-primary/[0.06]"
        >
          <span
            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-primary/40 bg-white text-[0.65rem] font-bold text-primary dark:bg-gray-950"
            aria-hidden
          >
            ✓
          </span>
          <span className="min-w-0 text-base leading-relaxed text-gray-800 dark:text-gray-200">
            {item}
          </span>
        </li>
      ))}
    </ul>
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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
        {takeaway ? (
          <p className="text-sm font-medium leading-snug text-primary sm:text-[0.95rem]">{takeaway}</p>
        ) : null}
      </div>
      <div className="space-y-5 sm:space-y-6">{children}</div>
    </section>
  );
}

export const HowToSharePhotosSecurelyPost: React.FC = () => {
  const { t, language } = useLanguage();
  const article = getBlogArticleCopy(copy, language);
  const homePath = localizedPath("/", language);
  const fileTransferPath = localizedPath("/secure-file-transfer", language);
  const faqs = article.sections.flatMap((section) => section.faqs ?? []);

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
    if (href.startsWith("http://") || href.startsWith("https://")) {
      return { to: href, external: true };
    }
    return { to: localizedPath(href.startsWith("/") ? href : `/${href}`, language), external: false };
  };

  return (
    <BlogGuideArticle slug={slug}>
      <article>
        <BlogPostHeader
          slug={slug}
          title={t.blogHowToSharePhotosSecurelyTitle}
          subtitle={t.blogHowToSharePhotosSecurelySubtitle}
          excerpt={t.blogHowToSharePhotosSecurelyExcerpt}
          excerptClassName="max-w-3xl text-xl leading-relaxed text-gray-700 dark:text-gray-300 sm:text-[1.35rem] sm:leading-[1.65]"
          faqs={faqs}
          headerClassName="mb-14 sm:mb-16"
        >
          <figure className="mt-10 sm:mt-12">
            <img
              src={heroImagePath}
              alt={article.heroAlt}
              width={1400}
              height={933}
              className="aspect-video w-full rounded-2xl border border-gray-200 object-cover shadow-sm dark:border-gray-800"
            />
            <figcaption className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
              {article.heroCaption}
            </figcaption>
          </figure>
        </BlogPostHeader>

        <BlogArticleTakeaways slug={slug} />

        <div className="space-y-12 text-lg leading-[1.85] text-gray-700 dark:text-gray-300 sm:space-y-14">
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
            <ArticleSection key={section.title} title={section.title} takeaway={section.takeaway}>
              {section.paragraphs?.map((paragraph) => (
                <ArticleParagraph key={paragraph} text={paragraph} resolveLink={resolveLink} />
              ))}

              {section.bullets ? <BulletList items={section.bullets} resolveLink={resolveLink} /> : null}

              {section.checklist ? <Checklist items={section.checklist} /> : null}

              {section.paragraphsAfterChecklist?.map((paragraph) => (
                <ArticleParagraph key={paragraph} text={paragraph} resolveLink={resolveLink} />
              ))}

              {section.comparisonTable ? (
                <div className="space-y-5">
                  <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800">
                    <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-900/60">
                        <tr>
                          {section.comparisonTable.headers.map((header, headerIndex) => (
                            <th
                              key={`${header}-${headerIndex}`}
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

              {section.paragraphsAfterTable?.map((paragraph) => (
                <ArticleParagraph key={paragraph} text={paragraph} resolveLink={resolveLink} />
              ))}

              {section.midCta ? (
                <div className="rounded-2xl border border-primary/20 bg-primary/[0.04] px-5 py-5 dark:border-primary/25 dark:bg-primary/[0.08] sm:px-6">
                  <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-200">
                    {section.midCta.body}
                  </p>
                  <Link
                    href={fileTransferPath}
                    className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary/90"
                  >
                    {section.midCta.button}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              ) : null}

              {section.callout ? (
                <blockquote className="rounded-2xl border border-gray-200 bg-gray-50/80 px-5 py-4 text-lg leading-relaxed text-gray-800 dark:border-gray-800 dark:bg-gray-900/40 dark:text-gray-200 sm:px-6">
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
                <p className="mt-4 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                  {article.ctaBody}
                </p>
                <Link
                  href={fileTransferPath}
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
