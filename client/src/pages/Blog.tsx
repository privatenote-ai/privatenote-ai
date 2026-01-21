import React from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Calendar, ArrowRight, Tag, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { getQueryFn } from '@/lib/queryClient';
import { type BlogPost } from '@shared/schema';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export default function Blog() {
  const featuredPost = {
    title: 'Why Privacy Matters',
    excerpt: 'Privacy is not paranoia; it is good engineering and a basic human need for autonomy, experimentation, and dignity.',
    author: 'PrivateNote.ai',
    slug: 'privacy-tools',
    publishedAt: new Date().toISOString(),
    tags: ['privacy', 'tools', 'security'],
  };
  const staticPosts: BlogPost[] = [
    {
      id: -1,
      title: 'The Myth of "Good Enough" Security',
      excerpt: 'Why modern threats demand architectural security, not just better habits.',
      author: 'PrivateNote.ai',
      slug: 'myth-good-enough-security',
      publishedAt: new Date().toISOString(),
      tags: ['security', 'privacy', 'authentication'],
      content: '',
      coverImage: null,
      published: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: -2,
      title: 'How We Generate Secure Passwords',
      excerpt: 'Learn how we use cryptographic randomness, unbiased selection, and intelligent strength analysis to create secure passwords.',
      author: 'PrivateNote.ai',
      slug: 'how-we-generate-passwords',
      publishedAt: new Date().toISOString(),
      tags: ['passwords', 'security', 'cryptography'],
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
    <div className="container mx-auto max-w-4xl px-4 py-16 mb-24">
      <div className="max-w-4xl mx-auto text-center mb-12 relative z-10">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-12 pb-2 leading-[1.1] tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-primary to-blue-500 dark:from-blue-300 dark:to-blue-500 relative z-10">
          Blog
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed relative z-10">
          Latest insights and tips about privacy, security, and encryption
        </p>
      </div>

      {hasError ? (
        <div className="space-y-8">
          <FeaturedPostCard post={featuredPost} />
          {staticPosts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
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
          <FeaturedPostCard post={featuredPost} />
          {combinedPosts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          <FeaturedPostCard post={featuredPost} />
          <div className="backdrop-blur-sm border border-gray-100 dark:border-gray-800 rounded-lg p-8 text-center">
            <h2 className="text-xl font-medium mb-2">No posts yet</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We're working on creating some great content. Check back soon!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function BlogPostCard({ post }: { post: BlogPost }) {
  const formattedDate = post.publishedAt
    ? format(new Date(post.publishedAt), 'MMMM d, yyyy')
    : '';

  return (
    <Card className="backdrop-blur-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{formattedDate}</span>
          {post.tags && post.tags.length > 0 && (
            <div className="ml-auto flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <div className="flex gap-1">
                {post.tags.slice(0, 3).map((tag, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {post.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{post.tags.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
        <CardTitle className="text-xl font-bold">
          <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
            {post.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-gray-600 dark:text-gray-400">{post.excerpt}</p>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between items-center">
        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          <span>by {post.author}</span>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/blog/${post.slug}`} className="flex items-center">
            Read more <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function FeaturedPostCard({ post }: { post: { title: string; excerpt: string; author: string; slug: string; publishedAt: string; tags: string[] } }) {
  const formattedDate = format(new Date(post.publishedAt), 'MMMM d, yyyy');

  return (
    <Card className="backdrop-blur-sm border border-primary/30 bg-primary/5 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{formattedDate}</span>
          <div className="ml-auto flex items-center gap-2">
            <Badge className="text-xs" variant="default">Featured</Badge>
          </div>
        </div>
        <CardTitle className="text-xl font-bold">
          <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
            {post.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-gray-600 dark:text-gray-400">{post.excerpt}</p>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between items-center">
        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          <span>by {post.author}</span>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/blog/${post.slug}`} className="flex items-center">
            Read more <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
