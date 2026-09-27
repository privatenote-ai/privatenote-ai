import React from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useMountWhenInView } from "@/hooks/useMountWhenInView";
import type { Translations } from "@/utils/translation";
import { useLanguage } from "@/context/LanguageContext";
import { blogPostPath } from "@/utils/localizedPath";

type BlogPostCard = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
};

type HomeBlogCarouselProps = {
  t: Translations;
  blogPath: string;
  blogPosts: BlogPostCard[];
};

function BlogPostLink({
  post,
  readLabel,
  className,
}: {
  post: BlogPostCard;
  readLabel: string;
  className?: string;
}) {
  const { language } = useLanguage();

  return (
    <Link
      href={blogPostPath(post.slug, language)}
      className={
        className ??
        "group flex h-full min-h-[270px] flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
      }
    >
      <div className="mb-4 flex items-center justify-between gap-3 text-xs font-medium">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">{post.category}</span>
        <span className="whitespace-nowrap text-gray-500 dark:text-gray-400">{post.readTime}</span>
      </div>
      <h4 className="text-xl font-semibold leading-snug text-gray-950 transition-colors group-hover:text-primary dark:text-white">
        {post.title}
      </h4>
      <p className="mt-4 flex-1 text-sm leading-6 text-gray-600 dark:text-gray-300">{post.excerpt}</p>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-950 dark:text-gray-100">
        {readLabel}
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

/** Native horizontal scroll — same layout as Embla slides without layout measurement. */
function BlogCarouselStatic({
  blogPosts,
  readLabel,
}: {
  blogPosts: BlogPostCard[];
  readLabel: string;
}) {
  return (
    <div
      className="flex snap-x snap-mandatory gap-0 overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] sm:overflow-hidden [&::-webkit-scrollbar]:hidden"
    >
      {blogPosts.map((post) => (
        <div
          key={post.slug}
          className="min-w-0 shrink-0 grow-0 basis-[88%] snap-start pr-3 sm:basis-1/2 sm:pr-4 lg:basis-1/2"
        >
          <BlogPostLink post={post} readLabel={readLabel} />
        </div>
      ))}
    </div>
  );
}

/**
 * Blog post carousel — Embla mounts only when the section is near the viewport
 * so slide measurement does not run during the initial homepage paint.
 */
export function HomeBlogCarousel({ t, blogPath, blogPosts }: HomeBlogCarouselProps) {
  const [sectionRef, carouselReady] = useMountWhenInView({ rootMargin: "400px" });

  return (
    <div ref={sectionRef}>
      {carouselReady ? (
        <Carousel opts={{ align: "start" }} className="relative w-full px-9 sm:px-10">
          <CarouselContent className="ml-0 gap-3 sm:gap-4">
            {blogPosts.map((post) => (
              <CarouselItem key={post.slug} className="basis-[88%] pl-0 sm:basis-[calc(50%-0.5rem)] lg:basis-[calc(50%-0.5rem)]">
                <BlogPostLink post={post} readLabel={t.homeBlogReadArticle} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            aria-label={t.homeBlogCarouselPrev}
            className="!left-0 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 border-gray-300 bg-white/95 text-gray-950 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900/95 dark:text-gray-100 dark:hover:bg-gray-800 sm:inline-flex"
          />
          <CarouselNext
            aria-label={t.homeBlogCarouselNext}
            className="!right-0 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 border-gray-300 bg-white/95 text-gray-950 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900/95 dark:text-gray-100 dark:hover:bg-gray-800 sm:inline-flex"
          />
        </Carousel>
      ) : (
        <BlogCarouselStatic
          blogPosts={blogPosts}
          readLabel={t.homeBlogReadArticle}
        />
      )}
    </div>
  );
}
