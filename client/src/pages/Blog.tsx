import React from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Calendar, ArrowRight, Tag, Clock } from 'lucide-react';
import { getQueryFn } from '@/lib/queryClient';
import { type BlogPost } from '@shared/schema';
import { parseBlogPostTags } from '@/utils/blogPostTags';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/context/LanguageContext';
import { joinPublicPath, localizedPath } from '@/utils/localizedPath';

export default function Blog() {
  const { language, t } = useLanguage();
  const lp = (path: string) => localizedPath(path, language);
  const featuredPost = {
    title: t.blogWorkplaceTextsTitle,
    excerpt: t.blogWorkplaceTextsExcerpt,
    author: 'PrivateNote.ai',
    slug: 'workplace-texts-private-note',
    publishedAt: new Date().toISOString(),
    tags: [t.blogTagPrivacy, t.blogTagWorkplace, t.blogTagSecurity],
  };
  const staticPosts: BlogPost[] = [
    {
      id: -4,
      title: t.blogPrivacyTitle,
      excerpt: t.blogPrivacyExcerpt,
      author: 'PrivateNote.ai',
      slug: 'privacy-tools',
      publishedAt: new Date(),
      tags: JSON.stringify([t.blogTagPrivacy, t.blogTagTools, t.blogTagSecurity]),
      content: '',
      coverImage: null,
      published: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: -1,
      title: t.blogGoodEnoughTitle,
      excerpt: t.blogGoodEnoughExcerpt,
      author: 'PrivateNote.ai',
      slug: 'myth-good-enough-security',
      publishedAt: new Date(),
      tags: JSON.stringify([t.blogTagSecurity, t.blogTagPrivacy, t.blogTagAuthentication]),
      content: '',
      coverImage: null,
      published: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: -2,
      title: t.blogPasswordTitle,
      excerpt: t.blogPasswordExcerpt,
      author: 'PrivateNote.ai',
      slug: 'how-we-generate-passwords',
      publishedAt: new Date(),
      tags: JSON.stringify([t.blogTagPasswords, t.blogTagSecurity, t.blogTagCryptography]),
      content: '',
      coverImage: null,
      published: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const {
    data: posts,
    isLoading,
    error
  } = useQuery({
    queryKey: ['/api/blog'],
    queryFn: getQueryFn<BlogPost[]>({ on401: 'returnNull' })
  });
  const hasError = Boolean(error);
  const combinedPosts = [
    ...staticPosts,
    ...(posts ?? []).filter((post) => !staticPosts.some((staticPost) => staticPost.slug === post.slug)),
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-24 pb-16 mb-24">
      <div className="max-w-4xl mx-auto text-center mb-12 relative z-10">
        <h1 className="page-title mb-12 pb-2 leading-[1.1] text-primary relative z-10">
          {t.blog}
        </h1>
        <p className="mx-auto max-w-2xl text-base leading-relaxed text-gray-600 dark:text-gray-400 sm:text-[17px] sm:leading-7 relative z-10">
          {t.blogSubtitle}
        </p>
      </div>

      {hasError ? (
        <div className="space-y-8">
          <FeaturedPostCard post={featuredPost} blogPath={lp("/blog")} />
          {staticPosts.map((post) => (
            <BlogPostCard key={post.id} post={post} blogPath={lp("/blog")} />
          ))}
        </div>
      ) : isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="backdrop-blur-sm rounded-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="p-6">
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-4 w-1/4 mb-2" />
                <div className="space-y-2 mt-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : combinedPosts.length > 0 ? (
        <div className="space-y-8">
          <FeaturedPostCard post={featuredPost} blogPath={lp("/blog")} />
          {combinedPosts.map((post) => (
            <BlogPostCard key={post.id} post={post} blogPath={lp("/blog")} />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          <FeaturedPostCard post={featuredPost} blogPath={lp("/blog")} />
          <div className="backdrop-blur-sm border border-gray-100 dark:border-gray-800 rounded-lg p-8 text-center">
            <h2 className="text-xl font-medium mb-2">{t.blogEmptyTitle}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {t.blogEmptyBody}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function BlogPostCard({ post, blogPath }: { post: BlogPost; blogPath: string }) {
  const { language, t } = useLanguage();
  const formattedDate = post.publishedAt
    ? new Intl.DateTimeFormat(language, { dateStyle: "long" }).format(new Date(post.publishedAt))
    : '';
  const tagList = parseBlogPostTags(post.tags);

  return (
    <Card className="backdrop-blur-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{formattedDate}</span>
          {tagList.length > 0 && (
            <div className="ml-auto flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <div className="flex gap-1">
                {tagList.slice(0, 3).map((tag, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {tagList.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{tagList.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
        <CardTitle className="text-xl font-bold leading-tight">
          <Link href={joinPublicPath("blog", post.slug)} className="hover:text-primary transition-colors">
            <span className="line-clamp-2">{post.title}</span>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="line-clamp-3 text-gray-600 dark:text-gray-400">{post.excerpt}</p>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between items-center">
        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          <span>{t.blogByAuthor} {post.author}</span>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href={joinPublicPath("blog", post.slug)} className="flex items-center">
            {t.blogReadMore} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function FeaturedPostCard({ post, blogPath }: { post: { title: string; excerpt: string; author: string; slug: string; publishedAt: string; tags: string[] }; blogPath: string }) {
  const { language, t } = useLanguage();
  const formattedDate = new Intl.DateTimeFormat(language, { dateStyle: "long" }).format(new Date(post.publishedAt));

  return (
    <Card className="backdrop-blur-sm border border-primary/30 bg-primary/5 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{formattedDate}</span>
          <div className="ml-auto flex items-center gap-2">
            <Badge className="text-xs" variant="default">{t.blogFeatured}</Badge>
          </div>
        </div>
        <CardTitle className="text-xl font-bold leading-tight">
          <Link href={joinPublicPath("blog", post.slug)} className="hover:text-primary transition-colors">
            <span className="line-clamp-2">{post.title}</span>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="line-clamp-3 text-gray-600 dark:text-gray-400">{post.excerpt}</p>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between items-center">
        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          <span>{t.blogByAuthor} {post.author}</span>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href={joinPublicPath("blog", post.slug)} className="flex items-center">
            {t.blogReadMore} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
