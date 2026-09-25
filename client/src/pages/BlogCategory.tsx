import React, { useEffect, useMemo } from "react";
import { Link, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Calendar, Clock, Tag } from "lucide-react";
import { getQueryFn } from "@/lib/queryClient";
import { type BlogPost } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";
import { blogCategoryPath, blogPostPath, localizedPath } from "@/utils/localizedPath";
import { formatLocalizedLongDate } from "@/utils/formatLocalizedDate";
import type { SupportedLanguage } from "@/utils/translation";
import { buildStaticBlogPosts } from "@/utils/staticBlogPosts";
import { cn } from "@/lib/utils";
import {
  BLOG_CATEGORIES,
  getBlogCategory,
  isBlogCategory,
  type BlogCategory,
} from "@shared/blogCategories";
import { isBlogListingSlug } from "@shared/localizedBlogSlugs";
import { blogCategoryDescription, blogCategoryLabel } from "@/utils/blogCategoryLabel";
import { BlogPostBreadcrumbs } from "@/components/blog/BlogPostChrome";
import { buildDocumentTitle, setDocumentMeta, setStructuredDataScript } from "@/utils/documentMeta";
import { buildBlogCategoryStructuredData } from "@shared/blogStructuredData";
import NotFound from "@/pages/not-found";

const pageContainerClass =
  "mx-auto max-w-[1150px] px-4 pb-8 pt-24 sm:px-6 lg:px-8 lg:pt-28";

function formatBlogDate(language: string, publishedAt: Date | string | null | undefined) {
  return formatLocalizedLongDate(language, publishedAt);
}

function ReadLink({ href, className }: { href: string; className?: string }) {
  const { t } = useLanguage();

  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80",
        className,
      )}
    >
      {t.homeBlogReadArticle}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
    </Link>
  );
}

function BlogPostCard({ post, categoryLabel }: { post: BlogPost; categoryLabel: string }) {
  const { language, t } = useLanguage();
  const formattedDate = formatBlogDate(language, post.publishedAt);
  const href = blogPostPath(post.slug, language);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="h-2 bg-primary/15 dark:bg-primary/25" aria-hidden />
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          {formattedDate ? (
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4 shrink-0" aria-hidden />
              <time>{formattedDate}</time>
            </span>
          ) : null}
          <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
            <Tag className="hidden h-4 w-4 sm:block" aria-hidden />
            <Badge
              variant="outline"
              className="border-primary/20 bg-primary/5 text-xs font-medium text-primary dark:border-primary/30 dark:bg-primary/10"
            >
              {categoryLabel}
            </Badge>
          </div>
        </div>
        <h2 className="mb-3 text-lg font-semibold leading-snug text-gray-900 dark:text-white">
          <Link href={href} className="transition-colors hover:text-primary">
            <span className="line-clamp-2">{post.title}</span>
          </Link>
        </h2>
        <p className="mb-4 flex-1 line-clamp-3 leading-relaxed text-gray-600 dark:text-gray-400">
          {post.excerpt}
        </p>
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-gray-200 pt-4 dark:border-gray-800">
          <div className="flex min-w-0 items-center text-sm text-gray-500 dark:text-gray-400">
            <Clock className="mr-1 h-4 w-4 shrink-0" aria-hidden />
            <span className="truncate">
              {t.blogByAuthor} {post.author}
            </span>
          </div>
          <ReadLink href={href} className="shrink-0" />
        </div>
      </div>
    </article>
  );
}

function CategoryNav({ active }: { active: BlogCategory }) {
  const { t, language } = useLanguage();
  const blogPath = localizedPath("/blog", language);

  return (
    <div className="mb-8">
      <p className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">
        {t.blogFilterByTopic}
      </p>
      <div className="flex flex-wrap gap-2" role="navigation" aria-label={t.blogFilterByTopic}>
        <Link
          href={blogPath}
          className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:border-primary/30 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
        >
          {t.blogFilterAll}
        </Link>
        {BLOG_CATEGORIES.map((category) => {
          const href = blogCategoryPath(category, language);
          const isActive = category === active;
          return (
            <Link
              key={category}
              href={href}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "border border-gray-200 bg-white text-gray-700 hover:border-primary/30 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300",
              )}
            >
              {blogCategoryLabel(category, t)}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function BlogCategory() {
  const { language, t } = useLanguage();
  const [, localeParams] = useRoute("/:language/blog/category/:category");
  const [, enParams] = useRoute("/blog/category/:category");
  const categoryParam = localeParams?.category ?? enParams?.category;
  const category = categoryParam && isBlogCategory(categoryParam) ? categoryParam : null;

  const staticPosts = buildStaticBlogPosts(t);
  const { data: posts } = useQuery({
    queryKey: ["/api/blog"],
    queryFn: getQueryFn<BlogPost[]>({ on401: "returnNull" }),
    enabled: Boolean(category),
  });

  const categoryPosts = useMemo(() => {
    if (!category) return [];
    const allPosts = [
      ...staticPosts,
      ...(posts ?? []).filter((post) => !staticPosts.some((staticPost) => staticPost.slug === post.slug)),
    ];
    return allPosts
      .filter((post) => isBlogListingSlug(post.slug) && getBlogCategory(post.slug) === category)
      .sort((a, b) => {
        const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return bTime - aTime;
      });
  }, [category, staticPosts, posts]);

  useEffect(() => {
    if (!category) return;
    const label = blogCategoryLabel(category, t);
    const description = blogCategoryDescription(category, t);
    setDocumentMeta(buildDocumentTitle(`${label} · ${t.blog}`), description);
    setStructuredDataScript(
      "blog-category",
      buildBlogCategoryStructuredData({
        category,
        language: language as SupportedLanguage,
        name: label,
        description,
        posts: categoryPosts.map((post) => ({
          slug: post.slug,
          title: post.title,
        })),
      }),
    );
    return () => setStructuredDataScript("blog-category", null);
  }, [category, categoryPosts, language, t]);

  if (!category) {
    return <NotFound />;
  }

  const label = blogCategoryLabel(category, t);
  const description = blogCategoryDescription(category, t);
  const blogPath = localizedPath("/blog", language);

  return (
    <div className={pageContainerClass}>
      <div className="mb-8">
        <BlogPostBreadcrumbs section={label} />
      </div>

      <header className="mb-10 max-w-3xl">
        <h1 className="page-title text-primary">{label}</h1>
        <p className="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-400 sm:text-[17px] sm:leading-7">
          {description}
        </p>
      </header>

      <CategoryNav active={category} />

      {categoryPosts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categoryPosts.map((post) => (
            <BlogPostCard key={post.id} post={post} categoryLabel={label} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 p-8 text-center dark:border-gray-800">
          <h2 className="mb-2 text-xl font-medium text-gray-900 dark:text-white">
            {t.blogFilterNoResults}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {t.blogFilterNoResultsBody}{" "}
            <Link href={blogPath} className="font-medium text-primary hover:text-primary/80">
              {t.blogFilterAll}
            </Link>
          </p>
        </div>
      )}

      <div className="mt-12 text-center">
        <Link
          href={blogPath}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80"
        >
          {t.blogViewAllArticles}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
