import React from "react";
import { Link } from "wouter";
import { ArrowRight, Building2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { blogPostPath, localizedPath } from "@/utils/localizedPath";
import type { SupportedLanguage } from "@/utils/translation";
import { BlogPostHeader } from "@/components/blog/BlogPostChrome";
import { BlogGuideArticle } from "@/components/blog/BlogGuideArticle";
import { BlogArticleTakeaways } from "@/components/blog/BlogArticleTakeaways";
import { BlogPostCrossLinks } from "@/components/blog/BlogPostCrossLinks";
import { getBlogArticleCopy } from "@/components/blog/blogArticleLocale";
import { secureClientDeliveryForLawyersDe } from "@/components/blog/locale/secureClientDeliveryForLawyers.de";
import { secureClientDeliveryForLawyersEn } from "@/components/blog/locale/secureClientDeliveryForLawyers.en";
import { secureClientDeliveryForLawyersEs } from "@/components/blog/locale/secureClientDeliveryForLawyers.es";
import { secureClientDeliveryForLawyersFr } from "@/components/blog/locale/secureClientDeliveryForLawyers.fr";
import { secureClientDeliveryForLawyersHr } from "@/components/blog/locale/secureClientDeliveryForLawyers.hr";
import { secureClientDeliveryForLawyersIt } from "@/components/blog/locale/secureClientDeliveryForLawyers.it";
import { secureClientDeliveryForLawyersNl } from "@/components/blog/locale/secureClientDeliveryForLawyers.nl";
import { secureClientDeliveryForLawyersPt } from "@/components/blog/locale/secureClientDeliveryForLawyers.pt";
import { secureClientDeliveryForLawyersSr } from "@/components/blog/locale/secureClientDeliveryForLawyers.sr";
import type { SecureClientDeliveryForLawyersArticleCopy } from "@/components/blog/locale/secureClientDeliveryForLawyers.types";

const SLUG = "secure-client-delivery-for-lawyers";

const copy: Partial<Record<SupportedLanguage, SecureClientDeliveryForLawyersArticleCopy>> & {
  en: SecureClientDeliveryForLawyersArticleCopy;
} = {
  en: secureClientDeliveryForLawyersEn,
  de: secureClientDeliveryForLawyersDe,
  es: secureClientDeliveryForLawyersEs,
  fr: secureClientDeliveryForLawyersFr,
  hr: secureClientDeliveryForLawyersHr,
  it: secureClientDeliveryForLawyersIt,
  nl: secureClientDeliveryForLawyersNl,
  pt: secureClientDeliveryForLawyersPt,
  sr: secureClientDeliveryForLawyersSr,
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
  resolveLink,
}: {
  text: string;
  resolveLink: (href: string) => { to: string; external: boolean };
}) {
  return <p>{renderInlineContent(text, resolveLink)}</p>;
}

/**
 * Practice-management article: branded, ephemeral delivery for counsel and clients
 * who will not (or should not) keep confidential matter in consumer chat.
 * German and French copy follow DACH / French professional-secrecy doctrine,
 * not US attorney-client privilege.
 */
export const SecureClientDeliveryForLawyersPost: React.FC = () => {
  const { language, t } = useLanguage();
  const article = getBlogArticleCopy(copy, language);
  const createHref = localizedPath("/", language);
  const premiumHref = localizedPath("/premium", language);
  const faqs = article.sections.flatMap((section) => section.faqs ?? []);

  const resolveLink = (href: string): { to: string; external: boolean } => {
    if (href.startsWith("blog:")) {
      return { to: blogPostPath(href.slice(5), language), external: false };
    }
    if (href.startsWith("app:")) {
      const path = href.slice(4).replace(/^\/+/, "");
      if (!path || path === "home") {
        return { to: createHref, external: false };
      }
      return { to: localizedPath(`/${path}`, language), external: false };
    }
    if (href.startsWith("http://") || href.startsWith("https://")) {
      return { to: href, external: true };
    }
    return { to: localizedPath(href.startsWith("/") ? href : `/${href}`, language), external: false };
  };

  return (
    <BlogGuideArticle slug={SLUG}>
      <article>
        <BlogPostHeader
          slug={SLUG}
          title={
            t.blogSecureClientDeliveryForLawyersTitle ??
            "Privileged Communications Without a Lasting Chat Transcript"
          }
          subtitle={
            t.blogSecureClientDeliveryForLawyersSubtitle ??
            "A branded, one-time channel for counsel whose clients will not install Signal or WhatsApp"
          }
          excerpt={
            t.blogSecureClientDeliveryForLawyersExcerpt ??
            "Consumer chat keeps a record. Privilege often requires the opposite. How law firms—especially in criminal and penal practice—can deliver instructions and papers under their own name, without asking a lay client to install another app."
          }
          tags={article.heroKicker ? [article.heroKicker] : undefined}
          headerClassName="mb-8"
          faqs={faqs}
        />

        <BlogArticleTakeaways slug={SLUG} />

        <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">
          {article.intro.map((paragraph) => (
            <ArticleParagraph key={paragraph} text={paragraph} resolveLink={resolveLink} />
          ))}

          {article.sections.map((section) => (
            <React.Fragment key={section.title}>
              <hr className="border-gray-200 dark:border-gray-700" />
              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{section.title}</h2>
                {section.paragraphs?.map((paragraph) => (
                  <ArticleParagraph key={paragraph} text={paragraph} resolveLink={resolveLink} />
                ))}
                {section.bullets ? (
                  <ul className="list-disc space-y-2 pl-5">
                    {section.bullets.map((item) => (
                      <li key={item}>{renderInlineContent(item, resolveLink)}</li>
                    ))}
                  </ul>
                ) : null}
                {section.paragraphsAfterBullets?.map((paragraph) => (
                  <ArticleParagraph key={paragraph} text={paragraph} resolveLink={resolveLink} />
                ))}
                {section.comparisonTable ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
                    <table className="w-full min-w-[36rem] text-left text-sm">
                      <thead className="bg-gray-50 text-gray-900 dark:bg-gray-900/60 dark:text-white">
                        <tr>
                          {section.comparisonTable.headers.map((header) => (
                            <th key={header} className="px-4 py-3 font-semibold">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="text-gray-700 dark:text-gray-300">
                        {section.comparisonTable.rows.map((row) => (
                          <tr
                            key={row[0]}
                            className="border-t border-gray-200 dark:border-gray-800"
                          >
                            {row.map((cell, cellIndex) => (
                              <td
                                key={`${row[0]}-${cellIndex}`}
                                className={
                                  cellIndex === 0
                                    ? "px-4 py-3 font-medium text-gray-900 dark:text-white"
                                    : "px-4 py-3"
                                }
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null}
                {section.paragraphsAfterTable?.map((paragraph) => (
                  <ArticleParagraph key={paragraph} text={paragraph} resolveLink={resolveLink} />
                ))}
                {section.midCta ? (
                  <div className="rounded-2xl border border-primary/20 bg-primary/[0.04] px-5 py-5 dark:border-primary/25 dark:bg-primary/[0.08] sm:px-6">
                    <div className="flex gap-4">
                      <Building2 className="mt-1 h-6 w-6 shrink-0 text-primary" aria-hidden />
                      <div>
                        <p className="text-base leading-relaxed text-gray-800 dark:text-gray-200">
                          {section.midCta.body}
                        </p>
                        <Link
                          href={premiumHref}
                          className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary/90"
                        >
                          {section.midCta.button}
                          <ArrowRight className="h-4 w-4" aria-hidden />
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : null}
                {section.orderedIntro ? <p>{section.orderedIntro}</p> : null}
                {section.ordered ? (
                  <ol className="list-decimal space-y-2 pl-5">
                    {section.ordered.map((item) => (
                      <li key={item}>{renderInlineContent(item, resolveLink)}</li>
                    ))}
                  </ol>
                ) : null}
                {section.paragraphsAfterOrdered?.map((paragraph) => (
                  <ArticleParagraph key={paragraph} text={paragraph} resolveLink={resolveLink} />
                ))}
                {section.faqs ? (
                  <div className="space-y-6">
                    {section.faqs.map((faq) => (
                      <div key={faq.question} className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {faq.question}
                        </h3>
                        <ArticleParagraph text={faq.answer} resolveLink={resolveLink} />
                      </div>
                    ))}
                  </div>
                ) : null}
              </section>
            </React.Fragment>
          ))}
        </div>

        <section className="mt-10 rounded-3xl border border-primary/20 bg-primary/[0.04] p-7 dark:border-primary/25 dark:bg-primary/[0.08] sm:p-8">
          <h2
            data-blog-toc-ignore="true"
            className="text-xl font-bold text-gray-900 dark:text-white"
          >
            {article.ctaTitle}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-700 dark:text-gray-300">
            {article.ctaBody}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={premiumHref}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary/90"
            >
              {article.ctaPrimary}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href={createHref}
              className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-900"
            >
              {article.ctaSecondary}
            </Link>
          </div>
        </section>

        <BlogPostCrossLinks slug={SLUG} />
      </article>
    </BlogGuideArticle>
  );
};
