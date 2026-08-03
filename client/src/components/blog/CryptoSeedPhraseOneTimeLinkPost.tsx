import React from "react";
import { Link } from "wouter";
import { AlertTriangle, CheckCircle2, KeyRound, Lock, ShieldAlert, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { blogPostPath, localizedPath } from "@/utils/localizedPath";
import type { SupportedLanguage } from "@/utils/translation";
import { BlogPostHeader } from "@/components/blog/BlogPostChrome";
import { BlogGuideArticle } from "@/components/blog/BlogGuideArticle";
import { BlogArticleTakeaways } from "@/components/blog/BlogArticleTakeaways";
import { BlogPostCrossLinks } from "@/components/blog/BlogPostCrossLinks";
import { getBlogArticleCopy } from "@/components/blog/blogArticleLocale";
import { cryptoSeedPhraseDe } from "@/components/blog/locale/cryptoSeedPhrase.de";
import { cryptoSeedPhraseEn } from "@/components/blog/locale/cryptoSeedPhrase.en";
import { cryptoSeedPhraseEs } from "@/components/blog/locale/cryptoSeedPhrase.es";
import { cryptoSeedPhraseFr } from "@/components/blog/locale/cryptoSeedPhrase.fr";
import { cryptoSeedPhraseIt } from "@/components/blog/locale/cryptoSeedPhrase.it";
import { cryptoSeedPhraseHr } from "@/components/blog/locale/cryptoSeedPhrase.hr";
import { cryptoSeedPhraseNl } from "@/components/blog/locale/cryptoSeedPhrase.nl";
import { cryptoSeedPhrasePt } from "@/components/blog/locale/cryptoSeedPhrase.pt";
import { cryptoSeedPhraseSr } from "@/components/blog/locale/cryptoSeedPhrase.sr";
import type { CryptoSeedArticleCopy } from "@/components/blog/locale/cryptoSeedPhrase.types";
import { PASSWORDS_LU_PARTNER_URLS } from "@/config/passwordsLuPartner";
import { cn } from "@/lib/utils";

const heroImagePath = "/images/blog-encrypted-file-sharing-hero.jpg";

const FLOW_DIAGRAM = `Seed phrase
     │
     ▼
Local encryption (age / GnuPG / OpenSSL)
     │
     ▼
Encrypted ciphertext
     │
     ▼
PrivateNote`;

const AGE_EXAMPLE = `# Install age (pick your platform)
# macOS:        brew install age
# Windows:      winget install FiloSottile.age
# Linux (apt):  sudo apt install age

age --version

age -p -o seed.txt.age seed.txt    # encrypt with passphrase
age -d -o seed.txt seed.txt.age    # decrypt on a trusted machine`;

const copy: Partial<Record<SupportedLanguage, CryptoSeedArticleCopy>> & { en: CryptoSeedArticleCopy } = {
  en: cryptoSeedPhraseEn,
  de: cryptoSeedPhraseDe,
  es: cryptoSeedPhraseEs,
  fr: cryptoSeedPhraseFr,
  it: cryptoSeedPhraseIt,
  nl: cryptoSeedPhraseNl,
  pt: cryptoSeedPhrasePt,
  hr: cryptoSeedPhraseHr,
  sr: cryptoSeedPhraseSr,
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

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-gray-200 bg-gray-950 p-5 text-sm leading-relaxed text-gray-100 dark:border-gray-800">
      <code>{children}</code>
    </pre>
  );
}

function RecommendationColumn({
  title,
  subtitle,
  items,
  tone,
  icon: Icon,
}: {
  title: string;
  subtitle: string;
  items: readonly string[];
  tone: "emerald" | "amber";
  icon: LucideIcon;
}) {
  const toneStyles =
    tone === "emerald"
      ? {
          border: "border-emerald-200 dark:border-emerald-900/50",
          header: "border-emerald-100 bg-emerald-50/80 dark:border-emerald-900/40 dark:bg-emerald-950/25",
          icon: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
          bullet: "text-emerald-600 dark:text-emerald-400",
        }
      : {
          border: "border-amber-200 dark:border-amber-900/50",
          header: "border-amber-100 bg-amber-50/80 dark:border-amber-900/40 dark:bg-amber-950/25",
          icon: "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
          bullet: "text-amber-600 dark:text-amber-400",
        };

  return (
    <div className={cn("overflow-hidden rounded-2xl border shadow-sm", toneStyles.border)}>
      <div className={cn("border-b px-5 py-5 sm:px-6 sm:py-6", toneStyles.header)}>
        <div className="flex items-start gap-3">
          <span
            className={cn(
              "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl",
              toneStyles.icon,
            )}
          >
            <Icon className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <h3 className="text-lg font-bold leading-snug text-gray-900 dark:text-white">{title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{subtitle}</p>
          </div>
        </div>
      </div>
      <ul className="divide-y divide-gray-100 dark:divide-gray-800">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 px-5 py-3.5 sm:px-6 sm:py-4">
            <Icon className={cn("mt-0.5 h-4 w-4 flex-shrink-0", toneStyles.bullet)} aria-hidden />
            <span className="text-[0.98rem] leading-relaxed text-gray-800 dark:text-gray-200">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const CryptoSeedPhraseOneTimeLinkPost: React.FC = () => {
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

  const askPrefix = language === "de" ? "Vor der Verschlüsselung fragen: " : "Before encryption, ask: ";

  return (
    <BlogGuideArticle slug="crypto-seed-phrase-one-time-link">
      <article>
        <BlogPostHeader
          slug="crypto-seed-phrase-one-time-link"
          title={t.blogCryptoSeedTitle}
          excerpt={t.blogCryptoSeedExcerpt}
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

        <BlogArticleTakeaways slug="crypto-seed-phrase-one-time-link" />

        <div className="space-y-12 text-[1.0625rem] leading-[1.85] text-gray-700 dark:text-gray-300 sm:space-y-14 sm:leading-[1.9]">
          {article.intro.map((paragraph, index) => (
            <ArticleParagraph key={paragraph} text={paragraph} lead={index === 0} resolveLink={resolveLink} />
          ))}

          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-7 dark:border-amber-900/60 dark:bg-amber-950/20 sm:p-8">
            <div className="flex gap-5">
              <AlertTriangle
                className="mt-1 h-6 w-6 flex-shrink-0 text-amber-700 dark:text-amber-300"
                aria-hidden
              />
              <div>
                <h2 className="text-xl font-bold text-amber-950 dark:text-amber-100">{article.ruleTitle}</h2>
                {article.ruleParagraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="mt-4 text-base leading-relaxed text-amber-950/90 dark:text-amber-100/90"
                  >
                    {renderInlineContent(paragraph, resolveLink)}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <ArticleSection title={article.sections.sendAtAll.title}>
            <p>
              {askPrefix}
              {renderInlineContent(article.sections.sendAtAll.question, resolveLink)}
            </p>
            <ul className="space-y-3">
              {article.offlineAlternatives.map((item) => (
                <li key={item.label} className="flex gap-3 text-gray-800 dark:text-gray-200">
                  <KeyRound className="mt-1 h-4 w-4 flex-shrink-0 text-primary" aria-hidden />
                  <span>
                    <strong className="font-semibold text-gray-900 dark:text-white">{item.label}</strong>
                    {" — "}
                    {item.body}
                  </span>
                </li>
              ))}
            </ul>
            <ArticleParagraph text={article.sections.sendAtAll.outro} resolveLink={resolveLink} />
          </ArticleSection>

          <ArticleSection title={article.sections.different.title}>
            <ArticleParagraph text={article.sections.different.p1} resolveLink={resolveLink} />
            <p>{article.sections.different.listIntro}</p>
            <ul className="space-y-3">
              {article.seedPhraseTraits.map((item) => (
                <li key={item.label} className="flex gap-3 text-gray-800 dark:text-gray-200">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" aria-hidden />
                  <span>
                    <strong className="font-semibold text-gray-900 dark:text-white">{item.label}</strong>
                    {" — "}
                    {item.body}
                  </span>
                </li>
              ))}
            </ul>
            <ArticleParagraph text={article.sections.different.outro} resolveLink={resolveLink} />
          </ArticleSection>

          <ArticleSection title={article.sections.browserEncryption.title}>
            {article.sections.browserEncryption.paragraphs.map((paragraph) => (
              <ArticleParagraph key={paragraph} text={paragraph} resolveLink={resolveLink} />
            ))}
          </ArticleSection>

          <ArticleSection title={article.sections.encryptLocal.title}>
            <p>{article.sections.encryptLocal.intro}</p>
            <CodeBlock>{FLOW_DIAGRAM}</CodeBlock>
            <ArticleParagraph text={article.sections.encryptLocal.outro} resolveLink={resolveLink} />
            <div className="rounded-2xl border border-primary/20 bg-primary/[0.04] p-6 dark:border-primary/25 dark:bg-primary/[0.08] sm:p-7">
              <div className="flex gap-4">
                <Lock className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" aria-hidden />
                <p className="leading-relaxed">
                  {renderInlineContent(article.sections.encryptLocal.callout, resolveLink)}
                </p>
              </div>
            </div>
          </ArticleSection>

          <ArticleSection title={article.sections.whichTool.title}>
            <ul className="space-y-4">
              <li>{renderInlineContent(article.sections.whichTool.age, resolveLink)}</li>
              <li>{renderInlineContent(article.sections.whichTool.gnupg, resolveLink)}</li>
              <li>{renderInlineContent(article.sections.whichTool.openssl, resolveLink)}</li>
            </ul>
          </ArticleSection>

          <ArticleSection title={article.sections.ageExample.title}>
            <CodeBlock>{AGE_EXAMPLE}</CodeBlock>
            <div className="rounded-2xl border border-primary/20 bg-primary/[0.04] px-5 py-4 dark:border-primary/25 dark:bg-primary/[0.08] sm:px-6 sm:py-5">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {article.sections.ageExample.passphraseTitle}
              </p>
              <p className="mt-2 leading-relaxed text-gray-700 dark:text-gray-300">
                {renderInlineContent(article.sections.ageExample.passphraseBefore, resolveLink)}{" "}
                <a
                  href={PASSWORDS_LU_PARTNER_URLS.passphraseGenerator}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-gray-400 underline-offset-2 transition-colors hover:decoration-primary dark:decoration-gray-600"
                >
                  {article.sections.ageExample.passphraseLink}
                </a>{" "}
                {article.sections.ageExample.passphraseAfter}
              </p>
            </div>
            <ArticleParagraph text={article.sections.ageExample.p1} resolveLink={resolveLink} />
            <ArticleParagraph text={article.sections.ageExample.p2} resolveLink={resolveLink} />
            <p>
              {article.sections.ageExample.docsLabel}{" "}
              <a
                href="https://github.com/FiloSottile/age"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline"
              >
                age
              </a>
              {" · "}
              <a
                href="https://www.gnupg.org/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline"
              >
                GnuPG
              </a>
              {" · "}
              <a
                href="https://docs.openssl.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline"
              >
                OpenSSL
              </a>
            </p>
          </ArticleSection>

          <ArticleSection title={article.sections.separateChannels.title}>
            <ArticleParagraph text={article.sections.separateChannels.intro} resolveLink={resolveLink} />
            <ol className="list-decimal space-y-2 pl-6 text-gray-800 dark:text-gray-200">
              {article.sections.separateChannels.steps.map((step) => (
                <li key={step}>{renderInlineContent(step, resolveLink)}</li>
              ))}
            </ol>
            <ArticleParagraph text={article.sections.separateChannels.outro} resolveLink={resolveLink} />
          </ArticleSection>

          <ArticleSection title={article.sections.recommend.title}>
            <ArticleParagraph text={article.sections.recommend.intro} resolveLink={resolveLink} />
            <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
              <RecommendationColumn
                title={article.sections.recommend.oneTimeTitle}
                subtitle={article.sections.recommend.oneTimeSubtitle}
                items={article.oneTimeLinkFit}
                tone="emerald"
                icon={CheckCircle2}
              />
              <RecommendationColumn
                title={article.sections.recommend.localTitle}
                subtitle={article.sections.recommend.localSubtitle}
                items={article.localEncryptFirst}
                tone="amber"
                icon={Lock}
              />
            </div>
            <ArticleParagraph text={article.sections.recommend.outro} resolveLink={resolveLink} />
          </ArticleSection>

          <ArticleSection title={article.sections.matchTool.title}>
            <ArticleParagraph text={article.sections.matchTool.body} resolveLink={resolveLink} />
          </ArticleSection>

          <ArticleSection title={article.sections.philosophy.title}>
            <ArticleParagraph text={article.sections.philosophy.p1} resolveLink={resolveLink} />
            <p>{article.sections.philosophy.listIntro}</p>
            <ul className="list-disc space-y-2 pl-6 text-gray-800 dark:text-gray-200">
              {article.philosophySteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950 sm:p-7">
              <div className="flex gap-4">
                <ShieldAlert className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" aria-hidden />
                <p className="text-lg font-medium leading-relaxed text-gray-900 dark:text-white">
                  {article.sections.philosophy.closingQuote}
                </p>
              </div>
            </div>
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

        <BlogPostCrossLinks slug="crypto-seed-phrase-one-time-link" />
      </article>
    </BlogGuideArticle>
  );
};
