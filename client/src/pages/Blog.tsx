import React, { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Calendar, ArrowRight, Tag, Clock } from "lucide-react";
import { getQueryFn } from "@/lib/queryClient";
import { type BlogPost } from "@shared/schema";
import { parseBlogPostTags } from "@/utils/blogPostTags";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";
import { blogPostPath, localizedPath } from "@/utils/localizedPath";
import type { SupportedLanguage } from "@/utils/translation";
import { buildFeaturedBlogPost, buildStaticBlogPosts } from "@/utils/staticBlogPosts";
import { cn } from "@/lib/utils";

const pageContainerClass =
  "mx-auto max-w-[1150px] px-4 pb-8 pt-24 sm:px-6 lg:px-8 lg:pt-28";

function blogPostHref(slug: string, language: SupportedLanguage) {
  return blogPostPath(slug, language);
}

function formatBlogDate(language: string, publishedAt: Date | string | null | undefined) {
  if (!publishedAt) return "";
  return new Intl.DateTimeFormat(language, { dateStyle: "long" }).format(new Date(publishedAt));
}

function BlogMetadataRow({
  date,
  tags,
  featured,
  compact = false,
  activeTag,
  onTagClick,
}: {
  date: string;
  tags: string[];
  featured?: boolean;
  compact?: boolean;
  activeTag?: string | null;
  onTagClick?: (tag: string) => void;
}) {
  const { t } = useLanguage();

  const renderTag = (tag: string) => {
    const isActive = activeTag === tag;
    const className = cn(
      "text-xs font-medium capitalize",
      isActive
        ? "border-primary bg-primary text-primary-foreground"
        : "border-primary/20 bg-primary/5 text-primary dark:border-primary/30 dark:bg-primary/10",
      onTagClick && "cursor-pointer transition-colors hover:border-primary/40 hover:bg-primary/10",
    );

    if (onTagClick) {
      return (
        <button
          key={tag}
          type="button"
          onClick={() => onTagClick(tag)}
          className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-0.5",
            className,
          )}
        >
          {tag}
        </button>
      );
    }

    return (
      <Badge key={tag} variant="outline" className={className}>
        {tag}
      </Badge>
    );
  };

  return (
    <div
      className={cn(
        "flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400",
        compact ? "mb-3 gap-2" : "mb-4 gap-4",
      )}
    >
      {date ? (
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="h-4 w-4 shrink-0" aria-hidden />
          <time>{date}</time>
        </span>
      ) : null}
      {featured ? (
        <Badge className="text-xs" variant="default">
          {t.blogFeatured}
        </Badge>
      ) : null}
      {tags.length > 0 ? (
        <div className={cn("flex flex-wrap items-center", compact ? "gap-2" : "gap-2 sm:ml-auto")}>
          <Tag className="hidden h-4 w-4 sm:block" aria-hidden />
          {tags.slice(0, compact ? 2 : 3).map((tag) => renderTag(tag))}
          {tags.length > (compact ? 2 : 3) ? (
            <Badge variant="outline" className="text-xs">
              +{tags.length - (compact ? 2 : 3)}
            </Badge>
          ) : null}
        </div>
      ) : null}
    </div>
  );
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

function BlogPostCard({
  post,
  blogPath,
  activeTag,
  onTagClick,
}: {
  post: BlogPost;
  blogPath: string;
  activeTag?: string | null;
  onTagClick?: (tag: string) => void;
}) {
  const { language, t } = useLanguage();
  const formattedDate = formatBlogDate(language, post.publishedAt);
  const tagList = parseBlogPostTags(post.tags);
  const href = blogPostHref(post.slug, language);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="h-2 bg-primary/15 dark:bg-primary/25" aria-hidden />
      <div className="flex flex-1 flex-col p-6">
        <BlogMetadataRow
          date={formattedDate}
          tags={tagList}
          compact
          activeTag={activeTag}
          onTagClick={onTagClick}
        />
        <h3 className="mb-3 text-lg font-semibold leading-snug text-gray-900 dark:text-white">
          <Link href={href} className="transition-colors hover:text-primary">
            <span className="line-clamp-2">{post.title}</span>
          </Link>
        </h3>
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

function FeaturedPostCard({
  post,
  blogPath,
  activeTag,
  onTagClick,
}: {
  post: {
    title: string;
    excerpt: string;
    author: string;
    slug: string;
    publishedAt: string;
    tags: string[];
  };
  blogPath: string;
  activeTag?: string | null;
  onTagClick?: (tag: string) => void;
}) {
  const { language } = useLanguage();
  const formattedDate = formatBlogDate(language, post.publishedAt);
  const href = blogPostHref(post.slug, language);

  return (
    <article className="overflow-hidden rounded-2xl border border-primary/25 bg-primary/[0.04] shadow-sm dark:border-primary/30 dark:bg-primary/10">
      <div className="h-2 bg-primary" aria-hidden />
      <div className="p-8 lg:p-10">
        <BlogMetadataRow
          date={formattedDate}
          tags={post.tags}
          featured
          activeTag={activeTag}
          onTagClick={onTagClick}
        />
        <h2 className="mb-4 text-2xl font-bold leading-tight text-gray-900 dark:text-white sm:text-3xl">
          <Link href={href} className="transition-colors hover:text-primary">
            <span className="line-clamp-2">{post.title}</span>
          </Link>
        </h2>
        <p className="mb-6 max-w-3xl leading-relaxed text-gray-600 dark:text-gray-300 sm:text-[17px] sm:leading-7">
          {post.excerpt}
        </p>
        <ReadLink href={href} />
      </div>
    </article>
  );
}

function collectUniqueTags(posts: BlogPost[], extraTags: string[] = []): string[] {
  const tagSet = new Set<string>();
  for (const post of posts) {
    parseBlogPostTags(post.tags).forEach((tag) => tagSet.add(tag));
  }
  extraTags.forEach((tag) => tagSet.add(tag));
  return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
}

function readTagFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get("tag");
}

function BlogTagFilter({
  tags,
  selectedTag,
  onSelectTag,
}: {
  tags: string[];
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
}) {
  const { t } = useLanguage();

  if (tags.length === 0) return null;

  return (
    <div className="mb-8">
      <p className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">
        {t.blogFilterByTopic}
      </p>
      <div className="flex flex-wrap gap-2" role="group" aria-label={t.blogFilterByTopic}>
        <button
          type="button"
          aria-pressed={selectedTag === null}
          onClick={() => onSelectTag(null)}
          className={cn(
            "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
            selectedTag === null
              ? "bg-primary text-primary-foreground"
              : "border border-gray-200 bg-white text-gray-700 hover:border-primary/30 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300",
          )}
        >
          {t.blogFilterAll}
        </button>
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            aria-pressed={selectedTag === tag}
            onClick={() => onSelectTag(selectedTag === tag ? null : tag)}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm font-medium capitalize transition-colors",
              selectedTag === tag
                ? "bg-primary text-primary-foreground"
                : "border border-gray-200 bg-white text-gray-700 hover:border-primary/30 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300",
            )}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}

function BlogSecondaryCta() {
  const { t, language } = useLanguage();
  const homePath = localizedPath("/", language);
  const howItWorksPath = localizedPath("/how-it-works", language);

  return (
    <section className="mx-auto mb-12 max-w-[450px] text-center">
      <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
        {t.createNewNote}
      </h2>
      <p className="mb-5 leading-relaxed text-gray-600 dark:text-gray-400">
        {t.authSignUpSubtitle}
      </p>
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href={homePath}
          className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {t.createNewNote}
        </Link>
        <Link
          href={howItWorksPath}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80"
        >
          {t.howItWorks}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}

export default function Blog() {
  const { language, t } = useLanguage();
  const blogPath = localizedPath("/blog", language);
  const featuredPost = buildFeaturedBlogPost(t);
  const staticPosts = buildStaticBlogPosts(t);
  const [selectedTag, setSelectedTag] = useState<string | null>(() => readTagFromUrl());

  const { data: posts } = useQuery({
    queryKey: ["/api/blog"],
    queryFn: getQueryFn<BlogPost[]>({ on401: "returnNull" }),
  });


  const allPosts = useMemo(
    () => [
      ...staticPosts,
      ...(posts ?? []).filter((post) => !staticPosts.some((staticPost) => staticPost.slug === post.slug)),
    ],
    [staticPosts, posts],
  );

  const gridPosts = useMemo(
    () =>
      allPosts
        .filter((post) => post.slug !== featuredPost.slug)
        .sort((a, b) => {
          const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
          const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
          return bTime - aTime;
        }),
    [allPosts, featuredPost.slug],
  );

  const availableTags = useMemo(
    () => collectUniqueTags(allPosts, featuredPost.tags),
    [allPosts, featuredPost.tags],
  );

  const filteredPosts = useMemo(() => {
    if (!selectedTag) return gridPosts;
    return gridPosts.filter((post) => parseBlogPostTags(post.tags).includes(selectedTag));
  }, [gridPosts, selectedTag]);

  const showFeatured =
    !selectedTag || featuredPost.tags.includes(selectedTag);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (selectedTag) {
      url.searchParams.set("tag", selectedTag);
    } else {
      url.searchParams.delete("tag");
    }
    const next = `${url.pathname}${url.search}${url.hash}`;
    const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (next !== current) {
      window.history.replaceState(null, "", next);
    }
  }, [selectedTag]);

  useEffect(() => {
    if (selectedTag && !availableTags.includes(selectedTag)) {
      setSelectedTag(null);
    }
  }, [availableTags, selectedTag]);

  const handleTagSelect = (tag: string) => {
    setSelectedTag((current) => (current === tag ? null : tag));
  };

  const articlesHeading = t.homeBlogEyebrow;

  return (
    <div className={pageContainerClass}>
      <header className="py-10 text-center">
        <h1 className="page-title mx-auto max-w-4xl text-primary">
          <span className="line-clamp-2">{t.blog}</span>
        </h1>
        <p className="mx-auto mt-4 max-w-[670px] text-base leading-relaxed text-gray-600 dark:text-gray-400 sm:text-[17px] sm:leading-7">
          {t.blogSubtitle}
        </p>
      </header>

      {showFeatured ? (
        <section className="mb-16">
          <FeaturedPostCard
            post={featuredPost}
            blogPath={blogPath}
            activeTag={selectedTag}
            onTagClick={handleTagSelect}
          />
        </section>
      ) : null}

      <section>
        <h2 className="mb-8 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {articlesHeading}
        </h2>

        <BlogTagFilter
          tags={availableTags}
          selectedTag={selectedTag}
          onSelectTag={setSelectedTag}
        />

        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <BlogPostCard
                key={post.id}
                post={post}
                blogPath={blogPath}
                activeTag={selectedTag}
                onTagClick={handleTagSelect}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 p-8 text-center dark:border-gray-800">
            <h3 className="mb-2 text-xl font-medium text-gray-900 dark:text-white">
              {selectedTag ? t.blogFilterNoResults : t.blogEmptyTitle}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {selectedTag ? (
                <>
                  {t.blogFilterNoResultsBody}{" "}
                  <button
                    type="button"
                    onClick={() => setSelectedTag(null)}
                    className="font-medium text-primary hover:text-primary/80"
                  >
                    {t.blogFilterAll}
                  </button>
                </>
              ) : (
                t.blogEmptyBody
              )}
            </p>
          </div>
        )}
      </section>

      <div className="mt-16">
        <BlogSecondaryCta />
      </div>
    </div>
  );
}
