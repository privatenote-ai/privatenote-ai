import React, { useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { localizedPath } from "@/utils/localizedPath";
import { buildStaticBlogPosts, getStaticBlogMeta, getStaticBlogReadTime } from "@/utils/staticBlogPosts";
import { setStructuredDataScript } from "@/utils/documentMeta";
import { buildBlogArticleStructuredData } from "@shared/blogStructuredData";
import { isBlogCanonicalSlug } from "@shared/localizedBlogSlugs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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

/** Guide chrome: Home › Blog › cluster (no article title — keeps the trail short). */
export function BlogPostBreadcrumbs({
  section,
  sectionHref,
  className,
}: {
  /** Topic cluster label, e.g. "Secrets" — not the article title. */
  section: string;
  /** Optional link (e.g. blog index filtered by primary category). */
  sectionHref?: string;
  className?: string;
}) {
  const { t, language } = useLanguage();
  const homePath = localizedPath("/", language);
  const blogPath = localizedPath("/blog", language);

  return (
    <Breadcrumb className={cn(className)}>
      <BreadcrumbList className="text-sm text-gray-500 dark:text-gray-400">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={homePath} className="hover:text-gray-900 dark:hover:text-white">
              {t.blogBreadcrumbHome}
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="text-primary [&>svg]:h-4 [&>svg]:w-4 [&>svg]:stroke-[2.5]" />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={blogPath} className="hover:text-gray-900 dark:hover:text-white">
              {t.blog}
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="text-primary [&>svg]:h-4 [&>svg]:w-4 [&>svg]:stroke-[2.5]" />
        <BreadcrumbItem>
          {sectionHref ? (
            <BreadcrumbLink asChild>
              <Link
                href={sectionHref}
                className="font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                {section}
              </Link>
            </BreadcrumbLink>
          ) : (
            <BreadcrumbPage className="font-medium text-gray-700 dark:text-gray-300">{section}</BreadcrumbPage>
          )}
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
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
  subtitle,
  excerpt,
  titleClassName,
  headerClassName,
  publishedAt,
  tags,
  readTime,
  faqs,
  children,
  mediaClassName,
}: {
  slug?: string;
  title: string;
  /** Short line under the H1 (not the excerpt/dek). */
  subtitle?: string;
  excerpt?: string;
  titleClassName?: string;
  headerClassName?: string;
  publishedAt?: Date;
  tags?: string[];
  readTime?: string;
  faqs?: { question: string; answer: string }[];
  children?: React.ReactNode;
  mediaClassName?: string;
}) {
  const { language, t } = useLanguage();
  const staticMeta = slug ? getStaticBlogMeta(slug, t) : null;
  const staticPost = slug ? buildStaticBlogPosts(t).find((post) => post.slug === slug) : null;
  const resolvedDate = publishedAt ?? staticMeta?.publishedAt;
  const resolvedTags = tags ?? staticMeta?.tags ?? [];
  const resolvedReadTime = readTime ?? (slug ? getStaticBlogReadTime(slug, t) : undefined);
  const resolvedAuthor = staticPost?.author?.trim() || undefined;
  const updatedAt = staticPost?.updatedAt ?? resolvedDate;
  const formattedDate = updatedAt
    ? new Intl.DateTimeFormat(language, { dateStyle: "long" }).format(
        updatedAt instanceof Date ? updatedAt : new Date(updatedAt),
      )
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
      faqs,
    });
    setStructuredDataScript("blog-article", schema);
  }, [excerpt, faqs, language, resolvedDate, resolvedTags, slug, staticPost, title]);

  return (
    <header className={cn("mb-12 sm:mb-14", excerpt && "mb-14 sm:mb-16", headerClassName)}>
      {resolvedTags.length > 0 ? (
        <div className="mb-4 flex flex-wrap gap-2 sm:mb-5">
          {resolvedTags.map((tag) => (
            <BlogCategoryPill key={tag} label={tag} />
          ))}
        </div>
      ) : null}

      <h1
        data-privatenote-prerender-h1="true"
        className={cn(
          "mb-4 text-[2.5rem] font-bold leading-[1.1] tracking-tight text-gray-900 dark:text-white sm:mb-5 sm:text-5xl sm:leading-[1.08] lg:text-[3.25rem] lg:leading-[1.06]",
          titleClassName,
          subtitle && "mb-3 sm:mb-3.5",
        )}
      >
        {title}
      </h1>

      {subtitle ? (
        <p className="mb-5 max-w-3xl text-xl font-medium leading-snug text-gray-600 dark:text-gray-300 sm:mb-6 sm:text-2xl sm:leading-snug">
          {subtitle}
        </p>
      ) : null}

      {formattedDate || resolvedReadTime || resolvedAuthor ? (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
          {formattedDate ? (
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
              <span>
                <span className="text-gray-400 dark:text-gray-500">{t.blogUpdatedLabel}</span> {formattedDate}
              </span>
            </span>
          ) : null}
          {resolvedReadTime ? (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
              {resolvedReadTime}
            </span>
          ) : null}
          {resolvedAuthor ? (
            <span className="inline-flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
              {resolvedAuthor}
            </span>
          ) : null}
        </div>
      ) : null}

      {excerpt ? (
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-gray-600 dark:text-gray-400 sm:mt-6">{excerpt}</p>
      ) : null}

      {children ? (
        <div className={cn(mediaClassName ?? (!excerpt && "mt-8 sm:mt-10"))}>{children}</div>
      ) : null}
    </header>
  );
}
