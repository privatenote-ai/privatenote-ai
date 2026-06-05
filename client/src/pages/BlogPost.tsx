import React, { useEffect } from 'react';
import { Link, useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Calendar, User } from 'lucide-react';
import { getQueryFn } from '@/lib/queryClient';
import { type BlogPost } from '@shared/schema';
import { parseBlogPostTags } from '@/utils/blogPostTags';
import { escapeHtml } from '@shared/escapeHtml';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { PrivacyToolsPost } from '@/components/blog/PrivacyToolsPost';
import { GoodEnoughSecurityPost } from '@/components/blog/GoodEnoughSecurityPost';
import { PasswordGenerationPost } from '@/components/blog/PasswordGenerationPost';
import { WorkplaceTextsPost } from '@/components/blog/WorkplaceTextsPost';
import { PrivateNoteForDevelopersPost } from '@/components/blog/PrivateNoteForDevelopersPost';
import { PrivateNoteCodexPost } from '@/components/blog/PrivateNoteCodexPost';
import { AgentSecurityPost } from '@/components/blog/AgentSecurityPost';
import { useLanguage } from '@/context/LanguageContext';
import { localizedPath } from '@/utils/localizedPath';
import { buildDocumentTitle, setDocumentMeta } from '@/utils/documentMeta';

const STATIC_BLOG_SLUGS = [
  'privacy-tools',
  'myth-good-enough-security',
  'how-we-generate-passwords',
  'workplace-texts-private-note',
  'privatenote-for-developers',
  'privatenote-codex',
  'securing-ai-agents-like-employees',
] as const;

export default function BlogPostPage() {
  const { language, t } = useLanguage();
  const [_, params] = useRoute('/:language/blog/:slug');
  const [, fallbackParams] = useRoute('/blog/:slug');
  const blogPath = localizedPath('/blog', language);
  const slug = params?.slug ?? fallbackParams?.slug;

  const isStaticSlug =
    !!slug && (STATIC_BLOG_SLUGS as readonly string[]).includes(slug);

  const {
    data: post,
    isLoading,
    error
  } = useQuery({
    queryKey: ['/api/blog', slug],
    queryFn: getQueryFn<BlogPost>({ on401: 'returnNull' }),
    enabled: !!slug && !isStaticSlug
  });

  useEffect(() => {
    if (!slug || isStaticSlug) return;
    if (error) {
      setDocumentMeta(buildDocumentTitle(t.blogLoadFailedTitle), t.blogLoadFailedBody);
      return;
    }
    if (isLoading) return;
    if (!post) {
      setDocumentMeta(buildDocumentTitle(t.blogNotFoundTitle), t.blogNotFoundBody);
      return;
    }
    const publishedIso = toIsoString(post.publishedAt);
    const modifiedIso = toIsoString(post.updatedAt);
    setDocumentMeta(buildDocumentTitle(post.title), post.excerpt || t.blogSubtitle, {
      ogType: "article",
      image: post.coverImage ?? undefined,
      articlePublishedTime: publishedIso,
      articleModifiedTime: modifiedIso,
      articleAuthor: post.author,
    });
  }, [slug, isStaticSlug, error, isLoading, post, t]);

  if (slug === 'privacy-tools') {
    return <PrivacyToolsPost />;
  }
  if (slug === 'myth-good-enough-security') {
    return <GoodEnoughSecurityPost />;
  }
  if (slug === 'how-we-generate-passwords') {
    return <PasswordGenerationPost />;
  }
  if (slug === 'workplace-texts-private-note') {
    return <WorkplaceTextsPost />;
  }
  if (slug === 'privatenote-for-developers') {
    return <PrivateNoteForDevelopersPost />;
  }
  if (slug === 'privatenote-codex') {
    return <PrivateNoteCodexPost />;
  }
  if (slug === 'securing-ai-agents-like-employees') {
    return <AgentSecurityPost />;
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-4xl px-4 pt-24 pb-16">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            {t.blogLoadFailedTitle}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {t.blogLoadFailedBody}
          </p>
          <Link href={blogPath} className="text-primary hover:underline">
            {t.blogBackToBlog}
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-3xl px-4 pt-24 pb-16">
        <Skeleton className="h-10 w-3/4 mb-4" />
        <div className="flex items-center mb-6">
          <Skeleton className="h-4 w-32 mr-4" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto max-w-3xl px-4 pt-24 pb-16">
        <div className="backdrop-blur-sm border border-gray-100 dark:border-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-xl font-medium mb-2">{t.blogNotFoundTitle}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t.blogNotFoundBody}
          </p>
        </div>
      </div>
    );
  }

  const formattedDate = post.publishedAt
    ? new Intl.DateTimeFormat(language, { dateStyle: "long" }).format(new Date(post.publishedAt))
    : '';
  const tagList = parseBlogPostTags(post.tags);

  return (
    <div className="container mx-auto max-w-3xl px-4 pt-24 pb-16 mb-20">
      <article>
        <header className="mb-8">
          <Link href={blogPath} className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary mb-4">
            {t.blogBackToBlog}
          </Link>
          <h1 className="page-title mb-3">{post.title}</h1>
          {post.excerpt && (
            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300 mb-5">
              {post.excerpt}
            </p>
          )}

          <div className="flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 gap-4 mb-6">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              <span>{post.author}</span>
            </div>
          </div>

          {tagList.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {tagList.map((tag, i) => (
                <Badge key={i} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </header>

        {post.coverImage && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        <div
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: formatPostContent(post.content) }}
        />
      </article>
    </div>
  );
}

function toIsoString(value: unknown): string | undefined {
  if (value == null) return undefined;
  const d = value instanceof Date ? value : new Date(value as number | string);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}

// Plain text → paragraphs; escape so stored content cannot break out into HTML/JS.
function formatPostContent(content: string): string {
  return content
    .split('\n\n')
    .map((paragraph) => {
      const escaped = paragraph.split('\n').map(escapeHtml).join('<br>');
      return `<p>${escaped}</p>`;
    })
    .join('');
}
