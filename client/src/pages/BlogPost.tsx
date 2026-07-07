import React, { useEffect } from 'react';
import { Link, useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { BlogPostBackLink, BlogPostHeader, blogPostPageClass } from '@/components/blog/BlogPostChrome';
import { getStaticBlogReadTime } from '@/utils/staticBlogPosts';
import { getQueryFn } from '@/lib/queryClient';
import { type BlogPost } from '@shared/schema';
import { parseBlogPostTags } from '@/utils/blogPostTags';
import { escapeHtml } from '@shared/escapeHtml';
import { Skeleton } from '@/components/ui/skeleton';
import { PrivacyToolsPost } from '@/components/blog/PrivacyToolsPost';
import { GoodEnoughSecurityPost } from '@/components/blog/GoodEnoughSecurityPost';
import { PasswordGenerationPost } from '@/components/blog/PasswordGenerationPost';
import { WorkplaceTextsPost } from '@/components/blog/WorkplaceTextsPost';
import { PrivateNoteForDevelopersPost } from '@/components/blog/PrivateNoteForDevelopersPost';
import { PrivateNoteCodexPost } from '@/components/blog/PrivateNoteCodexPost';
import { AgentSecurityPost } from '@/components/blog/AgentSecurityPost';
import { OneTimeSecretLinksPost } from '@/components/blog/OneTimeSecretLinksPost';
import { EncryptedVsSecureFileSharingPost } from '@/components/blog/EncryptedVsSecureFileSharingPost';
import { SecretMessageWithoutAccountPost } from '@/components/blog/SecretMessageWithoutAccountPost';
import { SecretsNeverSendInChatPost } from '@/components/blog/SecretsNeverSendInChatPost';
import { EndToEndEncryptionDefinitionPost } from '@/components/blog/EndToEndEncryptionDefinitionPost';
import { ShareApiKeySecurelyPost } from '@/components/blog/ShareApiKeySecurelyPost';
import { useLanguage } from '@/context/LanguageContext';
import { localizedPath } from '@/utils/localizedPath';
import { buildDocumentTitle, setDocumentMeta } from '@/utils/documentMeta';
import { resolveCanonicalBlogSlug } from '@shared/localizedBlogSlugs';

import { STATIC_BLOG_SLUGS } from '@/utils/staticBlogPosts';

export default function BlogPostPage() {
  const { language, t } = useLanguage();
  const [_, params] = useRoute('/:language/blog/:slug');
  const [, fallbackParams] = useRoute('/blog/:slug');
  const blogPath = localizedPath('/blog', language);
  const urlSlug = params?.slug ?? fallbackParams?.slug;
  const slug = urlSlug ? resolveCanonicalBlogSlug(urlSlug) ?? urlSlug : undefined;

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
  if (slug === 'how-to-share-api-key-securely') {
    return <ShareApiKeySecurelyPost />;
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
  if (slug === 'one-time-secret-links') {
    return <OneTimeSecretLinksPost />;
  }
  if (slug === 'encrypted-vs-secure-file-sharing') {
    return <EncryptedVsSecureFileSharingPost />;
  }
  if (slug === 'send-secret-message-without-account') {
    return <SecretMessageWithoutAccountPost />;
  }
  if (slug === 'secrets-never-send-in-chat') {
    return <SecretsNeverSendInChatPost />;
  }
  if (slug === 'what-is-end-to-end-encryption') {
    return <EndToEndEncryptionDefinitionPost />;
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

  const tagList = parseBlogPostTags(post.tags);
  const readTime = slug ? getStaticBlogReadTime(slug, t) : undefined;

  return (
    <div className={blogPostPageClass}>
      <BlogPostBackLink />
      <article>
        <BlogPostHeader
          slug={slug}
          title={post.title}
          excerpt={post.excerpt || undefined}
          publishedAt={post.publishedAt ? new Date(post.publishedAt) : undefined}
          tags={tagList}
          readTime={readTime}
        />

        {post.coverImage && (
          <div className="mb-8 overflow-hidden rounded-lg">
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-auto w-full object-cover"
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
