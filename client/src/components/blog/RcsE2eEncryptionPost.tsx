import React from "react";
import { Link } from "wouter";
import { ArrowRight, Shield } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { blogPostPath, localizedPath } from "@/utils/localizedPath";
import type { SupportedLanguage } from "@/utils/translation";
import { BlogPostBackLink, BlogPostHeader, blogPostPageClass } from "@/components/blog/BlogPostChrome";
import { BlogPostCrossLinks } from "@/components/blog/BlogPostCrossLinks";
import { getBlogArticleCopy } from "@/components/blog/blogArticleLocale";
import { rcsE2eEncryptionDe } from "@/components/blog/locale/rcsE2eEncryption.de";
import { rcsE2eEncryptionEn } from "@/components/blog/locale/rcsE2eEncryption.en";
import { rcsE2eEncryptionEs } from "@/components/blog/locale/rcsE2eEncryption.es";
import { rcsE2eEncryptionFr } from "@/components/blog/locale/rcsE2eEncryption.fr";
import { rcsE2eEncryptionHr } from "@/components/blog/locale/rcsE2eEncryption.hr";
import { rcsE2eEncryptionIt } from "@/components/blog/locale/rcsE2eEncryption.it";
import { rcsE2eEncryptionNl } from "@/components/blog/locale/rcsE2eEncryption.nl";
import { rcsE2eEncryptionPt } from "@/components/blog/locale/rcsE2eEncryption.pt";
import { rcsE2eEncryptionSr } from "@/components/blog/locale/rcsE2eEncryption.sr";
import type { RcsE2eEncryptionArticleCopy } from "@/components/blog/locale/rcsE2eEncryption.types";
import { cn } from "@/lib/utils";

const heroImagePath = "/images/blog-android-iphone-rcs-e2e-hero.jpg";
const slug = "android-iphone-rcs-end-to-end-encryption";

const copy: Partial<Record<SupportedLanguage, RcsE2eEncryptionArticleCopy>> & {
  en: RcsE2eEncryptionArticleCopy;
} = {
  en: rcsE2eEncryptionEn,
  de: rcsE2eEncryptionDe,
  fr: rcsE2eEncryptionFr,
  es: rcsE2eEncryptionEs,
  it: rcsE2eEncryptionIt,
  nl: rcsE2eEncryptionNl,
  pt: rcsE2eEncryptionPt,
  sr: rcsE2eEncryptionSr,
  hr: rcsE2eEncryptionHr,
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

export const RcsE2eEncryptionPost: React.FC = () => {
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
          title={t.blogRcsE2eEncryptionTitle}
          excerpt={t.blogRcsE2eEncryptionExcerpt}
          headerClassName="mb-14 sm:mb-16"
        >
          <figure className="mt-10 sm:mt-12">
            <img
              src={heroImagePath}
              alt={article.heroAlt}
              width={1024}
              height={682}
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

              {section.callout ? (
                <blockquote className="rounded-2xl border border-gray-200 bg-gray-50/80 px-5 py-4 text-base leading-relaxed text-gray-800 dark:border-gray-800 dark:bg-gray-900/40 dark:text-gray-200 sm:px-6">
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

          <section className="border-t border-gray-200 pt-8 dark:border-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              {article.referencesTitle}
            </h2>
            <ul className="space-y-3">
              {article.references.map((reference) => (
                <li key={reference.href}>
                  <a
                    href={reference.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {reference.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>

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
