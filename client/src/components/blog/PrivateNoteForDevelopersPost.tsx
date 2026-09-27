import React from "react";
import { Link } from "wouter";
import { useLanguage } from "@/context/LanguageContext";
import { localizedPath } from "@/utils/localizedPath";
import type { SupportedLanguage } from "@/utils/translation";
import { BlogPostHeader } from "@/components/blog/BlogPostChrome";
import { BlogGuideArticle } from "@/components/blog/BlogGuideArticle";
import { BlogArticleTakeaways } from "@/components/blog/BlogArticleTakeaways";
import { BlogPostCrossLinks } from "@/components/blog/BlogPostCrossLinks";
import { getBlogArticleCopy } from "@/components/blog/blogArticleLocale";
import { privateNoteForDevelopersDe } from "@/components/blog/locale/privateNoteForDevelopers.de";
import { privateNoteForDevelopersEn } from "@/components/blog/locale/privateNoteForDevelopers.en";
import { privateNoteForDevelopersEs } from "@/components/blog/locale/privateNoteForDevelopers.es";
import { privateNoteForDevelopersFr } from "@/components/blog/locale/privateNoteForDevelopers.fr";
import { privateNoteForDevelopersHr } from "@/components/blog/locale/privateNoteForDevelopers.hr";
import { privateNoteForDevelopersIt } from "@/components/blog/locale/privateNoteForDevelopers.it";
import { privateNoteForDevelopersNl } from "@/components/blog/locale/privateNoteForDevelopers.nl";
import { privateNoteForDevelopersPt } from "@/components/blog/locale/privateNoteForDevelopers.pt";
import { privateNoteForDevelopersSr } from "@/components/blog/locale/privateNoteForDevelopers.sr";
import type { PrivateNoteForDevelopersArticleCopy } from "@/components/blog/locale/privateNoteForDevelopers.types";

const copy: Partial<Record<SupportedLanguage, PrivateNoteForDevelopersArticleCopy>> & {
  en: PrivateNoteForDevelopersArticleCopy;
} = {
  en: privateNoteForDevelopersEn,
  de: privateNoteForDevelopersDe,
  fr: privateNoteForDevelopersFr,
  es: privateNoteForDevelopersEs,
  it: privateNoteForDevelopersIt,
  nl: privateNoteForDevelopersNl,
  pt: privateNoteForDevelopersPt,
  hr: privateNoteForDevelopersHr,
  sr: privateNoteForDevelopersSr,
};

export const PrivateNoteForDevelopersPost: React.FC = () => {
  const { language, t } = useLanguage();
  const article = getBlogArticleCopy(copy, language);
  const homePath = localizedPath("/", language);

  return (
    <BlogGuideArticle slug="privatenote-for-developers">
      <article>
        <BlogPostHeader
          slug="privatenote-for-developers"
          title={t.blogDevelopersTitle}
          subtitle={t.blogDevelopersSubtitle}
          excerpt={t.blogDevelopersExcerpt}
          headerClassName="mb-10"
        />

        <BlogArticleTakeaways slug="privatenote-for-developers" />

        <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">
          {article.intro.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}

          {article.sections.map((section) => (
            <section className="space-y-4" key={section.title}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{section.title}</h2>
              {section.body.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
              {section.code && (
                <div className="rounded-xl bg-gray-900 dark:bg-gray-950 p-4 font-mono text-sm text-green-400 overflow-x-auto">
                  <pre>{section.code}</pre>
                </div>
              )}
              {section.bullets && (
                <ul className="list-disc pl-5 space-y-2">
                  {section.bullets.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{article.ctaTitle}</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-5">{article.ctaBody}</p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={homePath}
              className="inline-flex items-center rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-primary/90"
            >
              {article.ctaButton}
            </Link>
            <a
              href="https://marketplace.visualstudio.com/items?itemName=PrivateNote.privatenote-vscode"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-xl border border-primary/30 bg-transparent px-5 py-3 text-sm font-bold text-primary transition-colors hover:bg-primary/5"
            >
              Install VS Code extension
            </a>
          </div>
        </div>

        <BlogPostCrossLinks slug="privatenote-for-developers" />
      </article>
    </BlogGuideArticle>
  );
};
