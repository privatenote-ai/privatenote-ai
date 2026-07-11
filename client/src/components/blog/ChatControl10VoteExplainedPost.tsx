import React from "react";
import { Link } from "wouter";
import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  Eye,
  Lock,
  Scale,
  ShieldAlert,
  Vote,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { blogPostPath, localizedPath } from "@/utils/localizedPath";
import type { SupportedLanguage } from "@/utils/translation";
import { BlogPostBackLink, BlogPostHeader, blogPostPageClass } from "@/components/blog/BlogPostChrome";
import { BlogPostCrossLinks } from "@/components/blog/BlogPostCrossLinks";
import { getBlogArticleCopy } from "@/components/blog/blogArticleLocale";
import { chatControl10VoteExplainedDe } from "@/components/blog/locale/chatControl10VoteExplained.de";
import { chatControl10VoteExplainedEn } from "@/components/blog/locale/chatControl10VoteExplained.en";
import { chatControl10VoteExplainedEs } from "@/components/blog/locale/chatControl10VoteExplained.es";
import { chatControl10VoteExplainedFr } from "@/components/blog/locale/chatControl10VoteExplained.fr";
import { chatControl10VoteExplainedIt } from "@/components/blog/locale/chatControl10VoteExplained.it";
import { chatControl10VoteExplainedHr } from "@/components/blog/locale/chatControl10VoteExplained.hr";
import { chatControl10VoteExplainedNl } from "@/components/blog/locale/chatControl10VoteExplained.nl";
import { chatControl10VoteExplainedPt } from "@/components/blog/locale/chatControl10VoteExplained.pt";
import { chatControl10VoteExplainedSr } from "@/components/blog/locale/chatControl10VoteExplained.sr";
import type { ChatControl10VoteArticleCopy } from "@/components/blog/locale/chatControl10VoteExplained.types";
import { cn } from "@/lib/utils";

const heroImagePath = "/images/blog-chat-control-is-back-hero.jpg";

const voteTally = [
  { key: "against" as const, value: 314, tone: "against" as const },
  { key: "for" as const, value: 276, tone: "for" as const },
  { key: "abstentions" as const, value: 17, tone: "neutral" as const },
];

const concernIcons = [Eye, ShieldAlert, Ban, Scale];

const copy: Partial<Record<SupportedLanguage, ChatControl10VoteArticleCopy>> & {
  en: ChatControl10VoteArticleCopy;
} = {
  en: chatControl10VoteExplainedEn,
  de: chatControl10VoteExplainedDe,
  es: chatControl10VoteExplainedEs,
  fr: chatControl10VoteExplainedFr,
  it: chatControl10VoteExplainedIt,
  nl: chatControl10VoteExplainedNl,
  pt: chatControl10VoteExplainedPt,
  hr: chatControl10VoteExplainedHr,
  sr: chatControl10VoteExplainedSr,
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

export const ChatControl10VoteExplainedPost: React.FC = () => {
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

  const voteLabel = (key: "against" | "for" | "abstentions") => article.voteLabels[key];

  return (
    <div className={cn(blogPostPageClass, "pb-12 mb-28")}>
      <BlogPostBackLink />

      <article>
        <BlogPostHeader
          slug="chat-control-1-0-vote-explained"
          title={t.blogChatControl10VoteTitle}
          excerpt={t.blogChatControl10VoteExcerpt}
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

        <div className="space-y-12 text-[1.0625rem] leading-[1.85] text-gray-700 dark:text-gray-300 sm:space-y-14 sm:leading-[1.9]">
          <ArticleParagraph text={article.intro} lead resolveLink={resolveLink} />

          <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm dark:border-gray-800 dark:bg-gray-950 sm:p-8">
            <div className="flex items-start gap-4">
              <Vote className="mt-1 h-6 w-6 flex-shrink-0 text-primary" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                  {article.voteEyebrow}
                </p>
                <h2 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
                  {article.voteHeadline}
                </h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {voteTally.map((item) => (
                    <div
                      key={item.key}
                      className={cn(
                        "rounded-2xl border px-5 py-4 text-center",
                        item.tone === "against" &&
                          "border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/20",
                        item.tone === "for" &&
                          "border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/20",
                        item.tone === "neutral" &&
                          "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/70",
                      )}
                    >
                      <p className="text-3xl font-bold tabular-nums text-gray-900 dark:text-white">
                        {item.value}
                      </p>
                      <p className="mt-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                        {voteLabel(item.key)}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-base leading-relaxed text-gray-700 dark:text-gray-300">
                  {article.voteSummary}
                </p>
              </div>
            </div>
          </div>

          <ArticleSection title={article.sections.whyPassed.title}>
            {article.sections.whyPassed.paragraphs.map((paragraph) => (
              <ArticleParagraph key={paragraph} text={paragraph} resolveLink={resolveLink} />
            ))}
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/60 dark:bg-amber-950/20 sm:p-7">
              <div className="flex gap-4">
                <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-700 dark:text-amber-300" aria-hidden />
                <p className="text-base leading-relaxed text-amber-950/90 dark:text-amber-100/90">
                  {article.sections.whyPassed.callout}
                </p>
              </div>
            </div>
          </ArticleSection>

          <ArticleSection title={article.sections.whatItDoes.title}>
            <ArticleParagraph text={article.sections.whatItDoes.paragraphs[0]} resolveLink={resolveLink} />
            <ArticleParagraph text={article.sections.whatItDoes.paragraphs[1]} resolveLink={resolveLink} />
            <ul className="grid gap-3 sm:grid-cols-2">
              {article.nonE2eChannels.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-xl bg-gray-50 p-4 text-sm leading-relaxed text-gray-800 dark:bg-gray-900/70 dark:text-gray-200"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <ArticleParagraph text={article.sections.whatItDoes.paragraphs[2]} resolveLink={resolveLink} />
          </ArticleSection>

          <ArticleSection title={article.sections.privacyExperts.title}>
            <ArticleParagraph text={article.sections.privacyExperts.intro} resolveLink={resolveLink} />
            <div className="space-y-5">
              {article.privacyConcerns.map((concern, index) => {
                const Icon = concernIcons[index];
                return (
                  <div
                    className="group flex gap-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md dark:border-gray-800 dark:bg-gray-950 sm:p-7"
                    key={concern.title}
                  >
                    <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition duration-300 group-hover:bg-primary group-hover:text-white">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-bold leading-snug text-gray-900 dark:text-white">{concern.title}</h3>
                      <p className="mt-3 text-base leading-relaxed text-gray-700 dark:text-gray-300">
                        {concern.body}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ArticleSection>

          <ArticleSection title={article.sections.chatControl20.title}>
            {article.sections.chatControl20.paragraphs.map((paragraph) => (
              <ArticleParagraph key={paragraph} text={paragraph} resolveLink={resolveLink} />
            ))}
            <div className="rounded-3xl border border-primary/20 bg-primary/[0.04] p-7 dark:border-primary/25 dark:bg-primary/[0.08] sm:p-8">
              <div className="flex gap-4">
                <Lock className="mt-1 h-6 w-6 flex-shrink-0 text-primary" aria-hidden />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{article.e2eeCalloutTitle}</h3>
                  <p className="mt-4 leading-relaxed">{article.e2eeCalloutBody}</p>
                </div>
              </div>
            </div>
          </ArticleSection>

          <ArticleSection title={article.sections.privateNote.title}>
            {article.sections.privateNote.paragraphs.map((paragraph) => (
              <ArticleParagraph key={paragraph} text={paragraph} resolveLink={resolveLink} />
            ))}
          </ArticleSection>

          <ArticleSection title={article.sections.debateContinues.title}>
            {article.sections.debateContinues.paragraphs.map((paragraph) => (
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

        <BlogPostCrossLinks slug="chat-control-1-0-vote-explained" />
      </article>
    </div>
  );
};
