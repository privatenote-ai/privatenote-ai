import React from "react";
import { Link } from "wouter";
import { ArrowRight, ExternalLink, Scale, Shield } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { blogPostPath, localizedPath } from "@/utils/localizedPath";
import type { SupportedLanguage } from "@/utils/translation";
import { BlogPostBackLink, BlogPostHeader, blogPostPageClass } from "@/components/blog/BlogPostChrome";
import { BlogPostCrossLinks } from "@/components/blog/BlogPostCrossLinks";
import { getBlogArticleCopy } from "@/components/blog/blogArticleLocale";
import { socialMediaBansChildrenDe } from "@/components/blog/locale/socialMediaBansChildren.de";
import { socialMediaBansChildrenEn } from "@/components/blog/locale/socialMediaBansChildren.en";
import { socialMediaBansChildrenEs } from "@/components/blog/locale/socialMediaBansChildren.es";
import { socialMediaBansChildrenFr } from "@/components/blog/locale/socialMediaBansChildren.fr";
import { socialMediaBansChildrenHr } from "@/components/blog/locale/socialMediaBansChildren.hr";
import { socialMediaBansChildrenIt } from "@/components/blog/locale/socialMediaBansChildren.it";
import { socialMediaBansChildrenNl } from "@/components/blog/locale/socialMediaBansChildren.nl";
import { socialMediaBansChildrenPt } from "@/components/blog/locale/socialMediaBansChildren.pt";
import { socialMediaBansChildrenSr } from "@/components/blog/locale/socialMediaBansChildren.sr";
import type { SocialMediaBansChildrenArticleCopy } from "@/components/blog/locale/socialMediaBansChildren.types";
import { cn } from "@/lib/utils";

const heroImagePath = "/images/blog-social-media-bans-children-hero.jpg";
const bartPreneelYoutubeUrl = "https://www.youtube.com/watch?v=Ios3SQoPqbo";
const informationLabsReportUrl =
  "https://informationlabs.org/wp-content/uploads/2026/07/SMB-Report.pdf";

const copy: Partial<Record<SupportedLanguage, SocialMediaBansChildrenArticleCopy>> & {
  en: SocialMediaBansChildrenArticleCopy;
} = {
  en: socialMediaBansChildrenEn,
  de: socialMediaBansChildrenDe,
  es: socialMediaBansChildrenEs,
  fr: socialMediaBansChildrenFr,
  it: socialMediaBansChildrenIt,
  nl: socialMediaBansChildrenNl,
  pt: socialMediaBansChildrenPt,
  hr: socialMediaBansChildrenHr,
  sr: socialMediaBansChildrenSr,
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

export const SocialMediaBansChildrenPost: React.FC = () => {
  const { t, language } = useLanguage();
  const article = getBlogArticleCopy(copy, language);
  const homePath = localizedPath("/", language);

  const resolveLink = (href: string): { to: string; external: boolean } => {
    if (href.startsWith("blog:")) {
      return { to: blogPostPath(href.slice(5), language), external: false };
    }
    if (href.startsWith("app:")) {
      return { to: homePath, external: false };
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
          slug="social-media-bans-children-evidence"
          title={t.blogSocialMediaBansTitle}
          excerpt={t.blogSocialMediaBansExcerpt}
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

        <div className="space-y-12 text-[1.0625rem] leading-[1.85] text-gray-700 dark:text-gray-300 sm:space-y-14">
          {article.intro.map((paragraph, index) => (
            <ArticleParagraph
              key={paragraph}
              text={paragraph}
              lead={index === 0}
              resolveLink={resolveLink}
            />
          ))}

          {article.sections.map((section) => (
            <ArticleSection key={section.title} title={section.title}>
              {section.paragraphs.map((paragraph) => (
                <ArticleParagraph key={paragraph} text={paragraph} resolveLink={resolveLink} />
              ))}
              {section.bullets ? (
                <ul className="list-disc space-y-2 pl-5 text-[1.0625rem] leading-relaxed text-gray-700 dark:text-gray-300">
                  {section.bullets.map((item) => (
                    <li key={item}>{renderInlineContent(item, resolveLink)}</li>
                  ))}
                </ul>
              ) : null}
              {section.callout ? (
                <blockquote className="rounded-2xl border border-gray-200 bg-gray-50/80 px-5 py-4 text-base leading-relaxed text-gray-800 dark:border-gray-800 dark:bg-gray-900/40 dark:text-gray-200 sm:px-6">
                  {renderInlineContent(section.callout, resolveLink)}
                </blockquote>
              ) : null}
            </ArticleSection>
          ))}

          <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm dark:border-gray-800 dark:bg-gray-950 sm:p-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              {article.preneelEyebrow}
            </p>
            <h2 className="text-2xl font-bold leading-tight text-gray-900 dark:text-white">
              {article.preneelTitle}
            </h2>
            {article.preneelParagraphs.map((paragraph) => (
              <p className="mt-5 text-[1.0625rem] leading-[1.85] text-gray-700 dark:text-gray-300" key={paragraph}>
                <RichText text={paragraph} />
              </p>
            ))}
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={bartPreneelYoutubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-primary/25 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
              >
                <ExternalLink className="h-4 w-4 shrink-0" aria-hidden />
                {article.preneelVideoLabel}
              </a>
              <a
                href={informationLabsReportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-primary/25 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
              >
                <Scale className="h-4 w-4 shrink-0" aria-hidden />
                {article.preneelReportLabel}
              </a>
            </div>
          </div>

          <ArticleSection title={article.closingTitle}>
            {article.closingParagraphs.map((paragraph) => (
              <ArticleParagraph key={paragraph} text={paragraph} resolveLink={resolveLink} />
            ))}
          </ArticleSection>

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

          <section className="border-t border-gray-200 pt-10 dark:border-gray-800">
            <h2 className="mb-5 text-lg font-bold text-gray-900 dark:text-white">{article.referencesTitle}</h2>
            <ol className="list-decimal space-y-3 pl-5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              {article.references.map((ref) => (
                <li key={ref.href}>
                  <a
                    href={ref.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:underline"
                  >
                    {ref.label}
                  </a>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <BlogPostCrossLinks slug="social-media-bans-children-evidence" />
      </article>
    </div>
  );
};
