import React from "react";
import { Link } from "wouter";
import {
  Archive,
  Bot,
  Forward,
  Inbox,
  Lock,
  Mail,
  Search,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { blogPostPath, localizedPath } from "@/utils/localizedPath";
import type { SupportedLanguage } from "@/utils/translation";
import { BlogPostHeader } from "@/components/blog/BlogPostChrome";
import { BlogGuideArticle } from "@/components/blog/BlogGuideArticle";
import { BlogArticleTakeaways } from "@/components/blog/BlogArticleTakeaways";
import { BlogPostCrossLinks } from "@/components/blog/BlogPostCrossLinks";
import { getBlogArticleCopy } from "@/components/blog/blogArticleLocale";
import { emailWorstForSecretsDe } from "@/components/blog/locale/emailWorstForSecrets.de";
import { emailWorstForSecretsEn } from "@/components/blog/locale/emailWorstForSecrets.en";
import { emailWorstForSecretsEs } from "@/components/blog/locale/emailWorstForSecrets.es";
import { emailWorstForSecretsFr } from "@/components/blog/locale/emailWorstForSecrets.fr";
import { emailWorstForSecretsIt } from "@/components/blog/locale/emailWorstForSecrets.it";
import { emailWorstForSecretsHr } from "@/components/blog/locale/emailWorstForSecrets.hr";
import { emailWorstForSecretsNl } from "@/components/blog/locale/emailWorstForSecrets.nl";
import { emailWorstForSecretsPt } from "@/components/blog/locale/emailWorstForSecrets.pt";
import { emailWorstForSecretsSr } from "@/components/blog/locale/emailWorstForSecrets.sr";
import type { EmailWorstForSecretsArticleCopy } from "@/components/blog/locale/emailWorstForSecrets.types";
import { cn } from "@/lib/utils";

const heroImagePath = "/images/blog-email-secrets-hero.jpg";

const copy: Partial<Record<SupportedLanguage, EmailWorstForSecretsArticleCopy>> & {
  en: EmailWorstForSecretsArticleCopy;
} = {
  en: emailWorstForSecretsEn,
  de: emailWorstForSecretsDe,
  es: emailWorstForSecretsEs,
  fr: emailWorstForSecretsFr,
  it: emailWorstForSecretsIt,
  nl: emailWorstForSecretsNl,
  pt: emailWorstForSecretsPt,
  hr: emailWorstForSecretsHr,
  sr: emailWorstForSecretsSr,
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
          className="font-semibold text-primary hover:underline"
        >
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
        "leading-[1.85] text-gray-700 dark:text-gray-300 sm:leading-[1.9]",
        lead
          ? "text-xl font-medium leading-relaxed text-gray-900 dark:text-gray-100 sm:text-[1.35rem] sm:leading-[1.75]"
          : "text-[1.0625rem]",
      )}
    >
      {renderInlineContent(text, resolveLink)}
    </p>
  );
}

export const EmailWorstForSecretsPost: React.FC = () => {
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
      return { to: localizedPath(`/${path}`, language), external: false };
    }
    return { to: href, external: true };
  };

  const [
    multiPlace,
    secretsAge,
    searchable,
    forwarding,
    aiSection,
    regulatory,
    betterWay,
    browserEncryption,
    rightTool,
  ] = article.sections;

  return (
    <BlogGuideArticle slug="why-email-is-worst-for-secrets">
      <article>
        <BlogPostHeader
          slug="why-email-is-worst-for-secrets"
          title={t.blogEmailSecretsTitle}
          excerpt={t.blogEmailSecretsExcerpt}
          headerClassName="mb-14 sm:mb-16"
        >
          <figure className="mt-10 sm:mt-12">
            <img
              src={heroImagePath}
              alt={article.heroAlt}
              width={1000}
              height={666}
              className="aspect-[16/9] w-full rounded-2xl border border-gray-200 object-cover shadow-sm dark:border-gray-800"
            />
          </figure>
        </BlogPostHeader>

        <BlogArticleTakeaways slug="why-email-is-worst-for-secrets" />

        <div className="space-y-12 text-[1.0625rem] leading-[1.85] text-gray-700 dark:text-gray-300 sm:space-y-14 sm:leading-[1.9]">
          <ArticleParagraph text={article.intro} lead resolveLink={resolveLink} />

          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-7 dark:border-amber-900/60 dark:bg-amber-950/20 sm:p-8">
            <div className="flex gap-5">
              <Mail className="mt-1 h-6 w-6 flex-shrink-0 text-amber-700 dark:text-amber-300" aria-hidden />
              <div>
                <h2 className="text-xl font-bold text-amber-950 dark:text-amber-100">{article.calloutTitle}</h2>
                <p className="mt-4 text-base leading-relaxed text-amber-950/90 dark:text-amber-100/90">
                  {article.calloutBody}
                </p>
              </div>
            </div>
          </div>

          <ArticleSection title={multiPlace.title}>
            <ArticleParagraph text={multiPlace.paragraphs[0]} resolveLink={resolveLink} />
            <ul className="grid gap-3 sm:grid-cols-2">
              {article.emailCopies.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-xl bg-gray-50 p-4 text-sm leading-relaxed text-gray-800 dark:bg-gray-900/70 dark:text-gray-200"
                >
                  <Inbox className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <ArticleParagraph text={multiPlace.paragraphs[1]} resolveLink={resolveLink} />
          </ArticleSection>

          <ArticleSection title={secretsAge.title}>
            <ArticleParagraph text={secretsAge.paragraphs[0]} resolveLink={resolveLink} />
            <ul className="space-y-2">
              {article.agedSecretsExamples.map((item) => (
                <li key={item} className="flex items-start gap-3 text-gray-800 dark:text-gray-200">
                  <Archive className="mt-1 h-4 w-4 flex-shrink-0 text-primary" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <ArticleParagraph text={secretsAge.paragraphs[1]} resolveLink={resolveLink} />
          </ArticleSection>

          <ArticleSection title={searchable.title}>
            <p>
              {language === "de" ? (
                <>
                  Moderne E-Mail-Clients finden alte Nachrichten erstaunlich gut. Suchen Sie nach{" "}
                  <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm dark:bg-gray-800">password</code>,{" "}
                  <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm dark:bg-gray-800">API</code> oder{" "}
                  <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm dark:bg-gray-800">confidential</code>
                  —und Nachrichten von vor Jahren erscheinen fast sofort.
                </>
              ) : (
                <>
                  Modern email clients are incredibly good at finding old messages. Search for{" "}
                  <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm dark:bg-gray-800">password</code>,{" "}
                  <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm dark:bg-gray-800">API</code>, or{" "}
                  <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm dark:bg-gray-800">confidential</code>
                  , and messages from years ago appear almost instantly.
                </>
              )}
            </p>
            {searchable.callout ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950 sm:p-7">
                <div className="flex gap-4">
                  <Search className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" aria-hidden />
                  <p className="leading-relaxed">
                    {renderInlineContent(searchable.callout, resolveLink)}
                  </p>
                </div>
              </div>
            ) : null}
          </ArticleSection>

          <ArticleSection title={forwarding.title}>
            <ArticleParagraph text={forwarding.paragraphs[0]} resolveLink={resolveLink} />
            <ul className="grid gap-3 sm:grid-cols-2">
              {article.forwardingPaths.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-xl bg-gray-50 p-4 text-sm leading-relaxed text-gray-800 dark:bg-gray-900/70 dark:text-gray-200"
                >
                  <Forward className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <ArticleParagraph text={forwarding.paragraphs[1]} resolveLink={resolveLink} />
          </ArticleSection>

          <ArticleSection title={aiSection.title}>
            <ArticleParagraph text={aiSection.paragraphs[0]} resolveLink={resolveLink} />
            <ul className="grid gap-3 sm:grid-cols-2">
              {article.aiProcessingUses.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-xl bg-gray-50 p-4 text-sm leading-relaxed text-gray-800 dark:bg-gray-900/70 dark:text-gray-200"
                >
                  <Bot className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <ArticleParagraph text={aiSection.paragraphs[1]} resolveLink={resolveLink} />
          </ArticleSection>

          <ArticleSection title={regulatory.title}>
            <ArticleParagraph text={regulatory.paragraphs[0]} resolveLink={resolveLink} />
            <ArticleParagraph text={regulatory.paragraphs[1]} resolveLink={resolveLink} />
            {regulatory.callout ? (
              <div className="rounded-3xl border border-primary/20 bg-primary/[0.04] p-7 dark:border-primary/25 dark:bg-primary/[0.08] sm:p-8">
                <div className="flex gap-4">
                  <ShieldAlert className="mt-1 h-6 w-6 flex-shrink-0 text-primary" aria-hidden />
                  <p className="leading-relaxed">
                    {renderInlineContent(regulatory.callout, resolveLink)}
                  </p>
                </div>
              </div>
            ) : null}
          </ArticleSection>

          <ArticleSection title={betterWay.title}>
            <ArticleParagraph text={betterWay.paragraphs[0]} resolveLink={resolveLink} />
            <ul className="grid gap-3 sm:grid-cols-2">
              {article.oneTimeSecretExamples.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-xl bg-gray-50 p-4 text-sm leading-relaxed text-gray-800 dark:bg-gray-900/70 dark:text-gray-200"
                >
                  <Trash2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <ArticleParagraph text={betterWay.paragraphs[1]} resolveLink={resolveLink} />
            <ul className="space-y-2 text-gray-800 dark:text-gray-200">
              {article.oneTimeBenefits.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </ArticleSection>

          <ArticleSection title={browserEncryption.title}>
            <ArticleParagraph text={browserEncryption.paragraphs[0]} resolveLink={resolveLink} />
            <ArticleParagraph text={browserEncryption.paragraphs[1]} resolveLink={resolveLink} />
            {browserEncryption.callout ? (
              <div className="rounded-3xl border border-primary/20 bg-white p-7 shadow-sm dark:border-primary/25 dark:bg-gray-950 sm:p-8">
                <div className="flex gap-4">
                  <Lock className="mt-1 h-6 w-6 flex-shrink-0 text-primary" aria-hidden />
                  <p className="leading-relaxed">
                    {renderInlineContent(browserEncryption.callout, resolveLink)}
                  </p>
                </div>
              </div>
            ) : null}
          </ArticleSection>

          <ArticleSection title={rightTool.title}>
            {rightTool.paragraphs.map((paragraph) => (
              <ArticleParagraph key={paragraph} text={paragraph} resolveLink={resolveLink} />
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

        <BlogPostCrossLinks slug="why-email-is-worst-for-secrets" />
      </article>
    </BlogGuideArticle>
  );
};
