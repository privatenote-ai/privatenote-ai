import React from "react";
import { Link } from "wouter";
import { ArrowRight, BookOpen, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { blogPostPath, localizedPath } from "@/utils/localizedPath";
import { getBlogPostCrossLinks } from "@shared/blogPostCrossLinks";
import type { BlogCanonicalSlug } from "@shared/localizedBlogSlugs";
import { blogPostTitleForSlug, blogTrustLabel } from "@/components/blog/blogPostTitles";

type BlogPostCrossLinksProps = {
  slug: BlogCanonicalSlug;
  className?: string;
};

export function BlogPostCrossLinks({ slug, className }: BlogPostCrossLinksProps) {
  const { language, t } = useLanguage();
  const links = getBlogPostCrossLinks(slug);
  const trustHref = localizedPath(links.trust, language);

  return (
    <section
      className={className ?? "mt-14 border-t border-gray-200 pt-10 dark:border-gray-800 sm:mt-16"}
      aria-labelledby={`blog-cross-links-${slug}`}
    >
      <h2
        id={`blog-cross-links-${slug}`}
        data-blog-toc-ignore="true"
        className="mb-6 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
      >
        {t.blogCrossLinksHeading}
      </h2>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950">
          <span className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            <BookOpen className="h-4 w-4" aria-hidden />
            {t.blogCrossLinksRelatedLabel}
          </span>
          <ul className="grid gap-3 sm:grid-cols-2">
            {links.related.map((relatedSlug) => (
              <li key={relatedSlug}>
                <Link
                  href={blogPostPath(relatedSlug, language)}
                  className="group flex h-full items-start gap-2 rounded-xl border border-transparent px-3 py-2.5 text-sm font-medium text-primary transition-colors hover:border-primary/15 hover:bg-primary/5 dark:hover:border-primary/20 dark:hover:bg-primary/10"
                >
                  <span className="min-w-0 flex-1 leading-snug">{blogPostTitleForSlug(relatedSlug, t)}</span>
                  <ArrowRight
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <Link
          href={trustHref}
          className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-gray-50/80 p-5 transition-colors hover:border-primary/30 hover:bg-white dark:border-gray-800 dark:bg-gray-900/50 dark:hover:bg-gray-900"
        >
          <span className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            <ShieldCheck className="h-4 w-4" aria-hidden />
            {t.blogCrossLinksTrustLabel}
          </span>
          <span className="text-base font-semibold text-gray-900 dark:text-white">{blogTrustLabel(links.trust, t)}</span>
          <ArrowRight
            className="mt-auto pt-4 h-4 w-4 text-primary transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>
      </div>
    </section>
  );
}
