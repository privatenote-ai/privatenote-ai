import React, { useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { localizedPath } from "@/utils/localizedPath";
import { buildStaticBlogPosts, getStaticBlogMeta, getStaticBlogReadTime } from "@/utils/staticBlogPosts";
import { setStructuredDataScript } from "@/utils/documentMeta";
import { buildBlogArticleStructuredData } from "@shared/blogStructuredData";
import { isBlogCanonicalSlug } from "@shared/localizedBlogSlugs";

/** Shared outer padding for static blog article pages. */
export const blogPostPageClass = "container mx-auto max-w-4xl px-4 pt-24 pb-8 mb-20 sm:px-6 lg:px-8";

export function BlogPostBackLink({ className }: { className?: string }) {
  const { t, language } = useLanguage();
  const blogPath = localizedPath("/blog", language);

  return (
    <Link
      href={blogPath}
      className={cn(
        "mb-8 inline-flex items-center text-sm font-medium text-primary transition-colors hover:text-primary/80 sm:mb-10",
        className,
      )}
    >
      <ArrowLeft className="mr-1.5 h-4 w-4" aria-hidden />
      {t.blogBackToBlog}
    </Link>
  );
}

function BlogCategoryPill({ label }: { label: string }) {
  return (
    <span className="inline-flex rounded-full bg-primary/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-primary dark:bg-primary/15">
      {label}
    </span>
  );
}

export function BlogPostHeader({
  slug,
  title,
  excerpt,
  titleClassName,
  headerClassName,
  publishedAt,
  tags,
  readTime,
  children,
  mediaClassName,
}: {
  slug?: string;
  title: string;
  excerpt?: string;
  titleClassName?: string;
  headerClassName?: string;
  publishedAt?: Date;
  tags?: string[];
  readTime?: string;
  children?: React.ReactNode;
  mediaClassName?: string;
}) {
  const { language, t } = useLanguage();
  const staticMeta = slug ? getStaticBlogMeta(slug, t) : null;
  const staticPost = slug ? buildStaticBlogPosts(t).find((post) => post.slug === slug) : null;
  const resolvedDate = publishedAt ?? staticMeta?.publishedAt;
  const resolvedTags = tags ?? staticMeta?.tags ?? [];
  const resolvedReadTime = readTime ?? (slug ? getStaticBlogReadTime(slug, t) : undefined);
  const formattedDate = resolvedDate
    ? new Intl.DateTimeFormat(language, { dateStyle: "long" }).format(resolvedDate)
    : "";

  useEffect(() => {
    if (!slug || !isBlogCanonicalSlug(slug)) return;
    const schema = buildBlogArticleStructuredData({
      slug,
      language,
      title,
      description: excerpt ?? staticPost?.excerpt,
      author: staticPost?.author ?? "PrivateNote.ai",
      publishedAt: resolvedDate,
      updatedAt: staticPost?.updatedAt ?? resolvedDate,
      image: staticPost?.coverImage,
      tags: resolvedTags,
    });
    setStructuredDataScript("blog-article", schema);
  }, [excerpt, language, resolvedDate, resolvedTags, slug, staticPost, title]);

  return (
    <header className={cn("mb-12 sm:mb-14", excerpt && "mb-14 sm:mb-16", headerClassName)}>
      {resolvedTags.length > 0 ? (
        <div className="mb-7 flex flex-wrap gap-2 sm:mb-8">
          {resolvedTags.map((tag) => (
            <BlogCategoryPill key={tag} label={tag} />
          ))}
        </div>
      ) : null}

      <h1
        className={cn(
          "mb-5 max-w-4xl text-4xl font-bold leading-[1.12] tracking-tight text-gray-900 dark:text-white sm:mb-6 sm:text-[2.625rem] sm:leading-[1.1]",
          titleClassName,
        )}
      >
        {title}
      </h1>

      {formattedDate || resolvedReadTime ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {formattedDate}
          {formattedDate && resolvedReadTime ? (
            <span className="px-2 text-gray-300 dark:text-gray-600" aria-hidden>
              ·
            </span>
          ) : null}
          {resolvedReadTime ? <span>{resolvedReadTime}</span> : null}
        </p>
      ) : null}

      {excerpt ? (
        <p className="mt-7 max-w-3xl text-lg leading-relaxed text-gray-600 dark:text-gray-400 sm:mt-8">{excerpt}</p>
      ) : null}

      {children ? (
        <div className={cn(mediaClassName ?? (!excerpt && "mt-8 sm:mt-10"))}>{children}</div>
      ) : null}
    </header>
  );
}
