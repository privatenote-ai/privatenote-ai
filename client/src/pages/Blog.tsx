import React from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Calendar, ArrowRight, Tag, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { getQueryFn } from '@/lib/queryClient';
import { type BlogPost } from '@shared/schema';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export default function Blog() {
  const featuredPost = {
    title: 'Privacy and Security Tools We Recommend',
    excerpt: 'A practical list of tools that reduce tracking and protect sensitive information.',
    author: 'PrivateNote.ai',
    slug: 'privacy-tools',
    publishedAt: new Date().toISOString(),
    tags: ['privacy', 'tools', 'security'],
  };
  
  const { 
    data: posts, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['/api/blog'], 
    queryFn: getQueryFn<BlogPost[]>({ on401: 'returnNull' })
  });

  if (error) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8 mt-16">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            Failed to load blog posts
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            We encountered an error while loading the blog. Please try again later.
          </p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 mt-16 mb-20">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
        </Link>
        <h1 className="text-3xl font-bold mb-2">Blog</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Latest insights and tips about privacy, security, and encryption
        </p>
      </div>

      {isLoading ? (
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
      ) : posts && posts.length > 0 ? (
        <div className="space-y-8">
          <FeaturedPostCard post={featuredPost} />
          {posts.map((post) => (
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
