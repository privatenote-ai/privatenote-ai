import React from "react";
import { KeyRound, LockKeyhole, Server, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import type { SupportedLanguage } from "@/utils/translation";
import { BlogPostBackLink, BlogPostHeader, blogPostPageClass } from "@/components/blog/BlogPostChrome";
import { BlogPostCrossLinks } from "@/components/blog/BlogPostCrossLinks";
import { getBlogArticleCopy } from "@/components/blog/blogArticleLocale";
import { endToEndEncryptionDefinitionDe } from "@/components/blog/locale/endToEndEncryptionDefinition.de";
import { endToEndEncryptionDefinitionEn } from "@/components/blog/locale/endToEndEncryptionDefinition.en";
import { endToEndEncryptionDefinitionEs } from "@/components/blog/locale/endToEndEncryptionDefinition.es";
import { endToEndEncryptionDefinitionFr } from "@/components/blog/locale/endToEndEncryptionDefinition.fr";
import { endToEndEncryptionDefinitionHr } from "@/components/blog/locale/endToEndEncryptionDefinition.hr";
import { endToEndEncryptionDefinitionIt } from "@/components/blog/locale/endToEndEncryptionDefinition.it";
import { endToEndEncryptionDefinitionNl } from "@/components/blog/locale/endToEndEncryptionDefinition.nl";
import { endToEndEncryptionDefinitionPt } from "@/components/blog/locale/endToEndEncryptionDefinition.pt";
import type { E2eeDefinitionArticleCopy } from "@/components/blog/locale/endToEndEncryptionDefinition.types";
import { endToEndEncryptionDefinitionSr } from "@/components/blog/locale/endToEndEncryptionDefinition.sr";

const copy: Partial<Record<SupportedLanguage, E2eeDefinitionArticleCopy>> & { en: E2eeDefinitionArticleCopy } = {
  en: endToEndEncryptionDefinitionEn,
  de: endToEndEncryptionDefinitionDe,
  es: endToEndEncryptionDefinitionEs,
  fr: endToEndEncryptionDefinitionFr,
  hr: endToEndEncryptionDefinitionHr,
  it: endToEndEncryptionDefinitionIt,
  nl: endToEndEncryptionDefinitionNl,
  pt: endToEndEncryptionDefinitionPt,
  sr: endToEndEncryptionDefinitionSr,
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

function ArticleParagraph({ text, lead = false }: { text: string; lead?: boolean }) {
  return (
    <p
      className={cn(
        "leading-[1.8] text-gray-700 dark:text-gray-300",
        lead ? "text-xl font-medium leading-relaxed text-gray-900 dark:text-gray-100" : "text-[1.0625rem]",
      )}
    >
      <RichText text={text} />
    </p>
  );
}

function CalloutBox({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/[0.06] px-6 py-5 dark:border-primary/25 dark:bg-primary/[0.1]">
      <p className="text-[1.0625rem] leading-[1.75] text-gray-800 dark:text-gray-100">
        <RichText text={text} />
      </p>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3.5">
      {items.map((item) => (
        <li className="flex gap-3.5" key={item}>
          <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" aria-hidden />
          <span className="text-[1.0625rem] leading-[1.75] text-gray-700 dark:text-gray-300">
            <RichText text={item} />
          </span>
        </li>
      ))}
    </ul>
  );
}

function DefinitionCard({ article }: { article: E2eeDefinitionArticleCopy }) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950 sm:p-7">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <KeyRound className="h-5 w-5" aria-hidden />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">{article.definitionTitle}</h2>
      </div>
      <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">{article.definitionBody}</p>
    </section>
  );
}

function ModelComparisonTable({ article }: { article: E2eeDefinitionArticleCopy }) {
  const [model, encryption, plaintext, keys] = article.tableHeaders;
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
      <div className="grid grid-cols-4 bg-gray-50 text-xs font-semibold uppercase tracking-[0.08em] text-gray-500 dark:bg-gray-900 dark:text-gray-400">
        <div className="px-4 py-3">{model}</div>
        <div className="px-4 py-3">{encryption}</div>
        <div className="px-4 py-3">{plaintext}</div>
        <div className="px-4 py-3">{keys}</div>
      </div>
      {article.tableRows.map((row) => (
        <div className="grid grid-cols-1 border-t border-gray-200 text-sm dark:border-gray-800 sm:grid-cols-4" key={row.model}>
          <div className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{row.model}</div>
          <div className="px-4 py-3 text-gray-700 dark:text-gray-300">{row.happens}</div>
          <div className="px-4 py-3 text-gray-700 dark:text-gray-300">{row.plaintext}</div>
          <div className="px-4 py-3 text-gray-700 dark:text-gray-300">{row.keys}</div>
        </div>
      ))}
    </div>
  );
}

function EndpointFlow({ article }: { article: E2eeDefinitionArticleCopy }) {
  const icons = [LockKeyhole, Server, ShieldCheck];
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {article.flowNodes.map(({ title, body }, index) => {
        const Icon = icons[index] ?? Server;
        return (
          <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-5 dark:border-gray-800 dark:bg-gray-900/45" key={title}>
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-primary shadow-sm dark:bg-gray-950">
              <Icon className="h-5 w-5" aria-hidden />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{body}</p>
          </div>
        );
      })}
    </div>
  );
}

export const EndToEndEncryptionDefinitionPost: React.FC = () => {
  const { t, language } = useLanguage();
  const article = getBlogArticleCopy(copy, language);
  const urlFragmentSectionTitle = copy.en.sections[3]?.title ?? "";

  return (
    <div className={blogPostPageClass}>
      <BlogPostBackLink />

      <article>
        <BlogPostHeader
          slug="what-is-end-to-end-encryption"
          title={t.blogE2eeDefinitionTitle}
          excerpt={t.blogE2eeDefinitionExcerpt}
          headerClassName="mb-12"
        />

        <div className="space-y-6 leading-relaxed">
          {article.intro.map((paragraph, index) => (
            <ArticleParagraph key={paragraph} text={paragraph} lead={index === 0} />
          ))}
        </div>

        <div className="mt-10 space-y-8">
          <DefinitionCard article={article} />
          <ModelComparisonTable article={article} />
        </div>

        <div className="mt-14 space-y-14">
          {article.sections.map((section) => (
            <section className="space-y-5 border-t border-gray-200 pt-10 dark:border-gray-800" key={section.title}>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{section.title}</h2>
              {section.paragraphs.map((paragraph) => (
                <ArticleParagraph key={paragraph} text={paragraph} />
              ))}
              {section.title === urlFragmentSectionTitle ? <EndpointFlow article={article} /> : null}
              {section.bullets ? <BulletList items={section.bullets} /> : null}
              {section.callout ? <CalloutBox text={section.callout} /> : null}
            </section>
          ))}
        </div>

        <section className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{article.referencesTitle}</h2>
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

        <BlogPostCrossLinks slug="what-is-end-to-end-encryption" />
      </article>
    </div>
  );
};
