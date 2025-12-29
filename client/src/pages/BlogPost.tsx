import React from 'react';
import { Link, useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Calendar, Tag, User } from 'lucide-react';
import { format } from 'date-fns';
import { getQueryFn } from '@/lib/queryClient';
import { type BlogPost } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export default function BlogPostPage() {
  const [_, params] = useRoute('/blog/:slug');
  const slug = params?.slug;
  
  const { 
    data: post, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['/api/blog', slug], 
    queryFn: getQueryFn<BlogPost>({ on401: 'returnNull' }),
    enabled: !!slug
  });

  if (error) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8 mt-16">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            Failed to load blog post
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            We encountered an error while loading this article. Please try again later.
          </p>
          <Link href="/blog" className="text-primary hover:underline">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8 mt-16">
        <Link href="/blog" className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Blog
        </Link>
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
      <div className="container mx-auto max-w-3xl px-4 py-8 mt-16">
        <Link href="/blog" className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Blog
        </Link>
        <div className="backdrop-blur-sm border border-gray-100 dark:border-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-xl font-medium mb-2">Blog post not found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The article you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const formattedDate = post.publishedAt 
    ? format(new Date(post.publishedAt), 'MMMM d, yyyy')
    : '';

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 mt-16 mb-20">
      <Link href="/blog" className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary mb-4">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Blog
      </Link>
      
      <article>
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-3">{post.title}</h1>
          
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
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag, i) => (
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

// Helper function to format the post content
// This converts line breaks to HTML and could be expanded with Markdown support
function formatPostContent(content: string): string {
  // Simple conversion of line breaks to <p> tags
  // In a real app, you'd likely use a Markdown parser here
  return content
    .split('\n\n')
    .map(paragraph => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
    .join('');
}