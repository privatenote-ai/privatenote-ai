import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, ChevronDown, ChevronUp, Edit, Eye, MoreHorizontal, Plus, Trash2, Clock, Calendar, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { apiRequest, getQueryFn } from '@/lib/queryClient';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type BlogPost, insertBlogPostSchema } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Admin token (in a real app, this would be handled by authentication)
// This is a simple implementation for demonstration purposes
const ADMIN_TOKEN = 'admin-secret-token';

// Get API base URL from environment variable
const getApiUrl = (url: string): string => {
  const apiBaseUrl = import.meta.env.VITE_API_URL || '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return apiBaseUrl + url;
};

// Extend the blog post form schema with validation
const blogPostFormSchema = insertBlogPostSchema.extend({
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens only"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters"),
  author: z.string().min(2, "Author name is required"),
  tags: z.array(z.string()).optional().default([]),
  coverImage: z.string().optional().default(""),
});

export default function BlogAdmin() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  
  // Query for fetching blog posts (only when authenticated)
  const { 
    data: posts, 
    isLoading: postsLoading, 
    error: postsError,
    refetch: refetchPosts
  } = useQuery({
    queryKey: ['/api/admin/blog'], 
    queryFn: async () => {
      // Add admin token to request headers
      const apiBaseUrl = import.meta.env.VITE_API_URL || '';
      const url = apiBaseUrl + '/api/admin/blog';
      const response = await fetch(url, {
        headers: {
          'X-Admin-Token': ADMIN_TOKEN
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
      }
      
      return response.json();
    },
    enabled: isAuthenticated // Only fetch when authenticated
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (token === ADMIN_TOKEN) {
      setIsAuthenticated(true);
      toast({
        title: "Authenticated",
        description: "You now have admin access to the blog management.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: "Invalid admin token. Please try again.",
      });
    }
  };

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto max-w-md px-4 py-8 mt-16 mb-20">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
          </Link>
          <h1 className="text-3xl font-bold mb-2">Blog Admin</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Authentication required to manage blog posts
          </p>
        </div>
        
        <Card className="backdrop-blur-sm border border-gray-100 dark:border-gray-800">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>
              Enter your admin token to access the blog management interface
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="token">Admin Token</Label>
                <Input 
                  id="token" 
                  type="password" 
                  value={token} 
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Enter admin token"
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 mt-16 mb-20">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
        </Link>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Blog Management</h1>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <BlogPostsTable 
            posts={posts}
            isLoading={postsLoading}
            error={postsError}
            filter="all"
            onEdit={(post) => {
              setSelectedPost(post);
              setEditDialogOpen(true);
            }}
            onDelete={(post) => {
              setSelectedPost(post);
              setDeleteDialogOpen(true);
            }}
            refetchPosts={refetchPosts}
          />
        </TabsContent>
        
        <TabsContent value="published">
          <BlogPostsTable 
            posts={posts?.filter((post: BlogPost) => post.published)}
            isLoading={postsLoading}
            error={postsError}
            filter="published"
            onEdit={(post) => {
              setSelectedPost(post);
              setEditDialogOpen(true);
            }}
            onDelete={(post) => {
              setSelectedPost(post);
              setDeleteDialogOpen(true);
            }}
            refetchPosts={refetchPosts}
          />
        </TabsContent>
        
        <TabsContent value="drafts">
          <BlogPostsTable 
            posts={posts?.filter((post: BlogPost) => !post.published)}
            isLoading={postsLoading}
            error={postsError}
            filter="drafts"
            onEdit={(post) => {
              setSelectedPost(post);
              setEditDialogOpen(true);
            }}
            onDelete={(post) => {
              setSelectedPost(post);
              setDeleteDialogOpen(true);
            }}
            refetchPosts={refetchPosts}
          />
        </TabsContent>
      </Tabs>

      {/* Create Post Dialog */}
      <CreatePostDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen}
        onSuccess={() => {
          refetchPosts();
          setCreateDialogOpen(false);
        }}
      />

      {/* Edit Post Dialog */}
      {selectedPost && (
        <EditPostDialog 
          open={editDialogOpen} 
          onOpenChange={setEditDialogOpen}
          post={selectedPost}
          onSuccess={() => {
            refetchPosts();
            setEditDialogOpen(false);
            setSelectedPost(null);
          }}
        />
      )}

      {/* Delete Post Dialog */}
      {selectedPost && (
        <DeletePostDialog 
          open={deleteDialogOpen} 
          onOpenChange={setDeleteDialogOpen}
          post={selectedPost}
          onSuccess={() => {
            refetchPosts();
            setDeleteDialogOpen(false);
            setSelectedPost(null);
          }}
        />
      )}
    </div>
  );
}

function BlogPostsTable({ 
  posts, 
  isLoading, 
  error, 
  filter, 
  onEdit, 
  onDelete,
  refetchPosts
}: { 
  posts?: BlogPost[]; 
  isLoading: boolean; 
  error: unknown; 
  filter: 'all' | 'published' | 'drafts';
  onEdit: (post: BlogPost) => void;
  onDelete: (post: BlogPost) => void;
  refetchPosts: () => void;
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mutations for publish/unpublish
  const publishMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(getApiUrl(`/api/admin/blog/${id}/publish`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': ADMIN_TOKEN
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to publish post');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog'] });
      toast({
        title: "Post published",
        description: "The blog post is now live on your site."
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Failed to publish",
        description: "There was an error publishing the blog post."
      });
    }
  });

  const unpublishMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(getApiUrl(`/api/admin/blog/${id}/unpublish`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': ADMIN_TOKEN
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to unpublish post');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog'] });
      toast({
        title: "Post unpublished",
        description: "The blog post has been removed from your site."
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Failed to unpublish",
        description: "There was an error unpublishing the blog post."
      });
    }
  });

  const handlePublishToggle = (post: BlogPost) => {
    if (post.published) {
      unpublishMutation.mutate(post.id);
    } else {
      publishMutation.mutate(post.id);
    }
  };

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load blog posts. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="backdrop-blur-sm border border-gray-100 dark:border-gray-800 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3].map((i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="backdrop-blur-sm border border-gray-100 dark:border-gray-800 rounded-lg p-8 text-center">
        <h2 className="text-xl font-medium mb-2">No blog posts found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {filter === 'all' && "You haven't created any blog posts yet."}
          {filter === 'published' && "You don't have any published posts."}
          {filter === 'drafts' && "You don't have any draft posts."}
        </p>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-sm border border-gray-100 dark:border-gray-800 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell className="font-medium">{post.title}</TableCell>
              <TableCell>
                <Badge variant={post.published ? "default" : "outline"}>
                  {post.published ? "Published" : "Draft"}
                </Badge>
              </TableCell>
              <TableCell>
                {post.publishedAt 
                  ? format(new Date(post.publishedAt), 'MMM d, yyyy')
                  : format(new Date(post.createdAt), 'MMM d, yyyy')
                }
              </TableCell>
              <TableCell>{post.author}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={post.published || false}
                    onCheckedChange={() => handlePublishToggle(post)}
                    aria-label={post.published ? "Unpublish" : "Publish"}
                  />
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(post)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(post)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                      {post.published && (
                        <DropdownMenuItem asChild>
                          <Link href={`/blog/${post.slug}`} target="_blank">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Link>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function CreatePostDialog({ 
  open, 
  onOpenChange, 
  onSuccess 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const { toast } = useToast();
  const [tagsInput, setTagsInput] = useState('');
  
  // Form validation
  const form = useForm<z.infer<typeof blogPostFormSchema>>({
    resolver: zodResolver(blogPostFormSchema),
    defaultValues: {
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      author: '',
      tags: [],
      coverImage: '',
    }
  });
  
  // Handle form submission
  const handleSubmit = async (values: z.infer<typeof blogPostFormSchema>) => {
    try {
      const response = await fetch(getApiUrl('/api/admin/blog'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': ADMIN_TOKEN
        },
        body: JSON.stringify(values)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create blog post');
      }
      
      toast({
        title: "Blog post created",
        description: "Your new blog post has been saved as a draft."
      });
      
      form.reset();
      onSuccess();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to create blog post",
        description: "There was an error creating your blog post. Please try again."
      });
    }
  };
  
  // Handle tags input
  const handleAddTag = () => {
    if (!tagsInput.trim()) return;
    
    const currentTags = form.getValues('tags') || [];
    form.setValue('tags', [...currentTags, tagsInput.trim()]);
    setTagsInput('');
  };
  
  const handleRemoveTag = (tag: string) => {
    const currentTags = form.getValues('tags') || [];
    form.setValue('tags', currentTags.filter(t => t !== tag));
  };
  
  // Generate slug from title
  const generateSlug = () => {
    const title = form.getValues('title');
    if (!title) return;
    
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
    
    form.setValue('slug', slug);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Blog Post</DialogTitle>
          <DialogDescription>
            Create a new blog post. It will be saved as a draft until you publish it.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title*</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Post title" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(e);
                          if (!form.getValues('slug')) {
                            setTimeout(generateSlug, 500);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug*</FormLabel>
                    <div className="flex space-x-2">
                      <FormControl>
                        <Input 
                          placeholder="post-slug" 
                          {...field} 
                        />
                      </FormControl>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={generateSlug}
                      >
                        Generate
                      </Button>
                    </div>
                    <FormDescription>
                      The URL-friendly version of the title
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author*</FormLabel>
                    <FormControl>
                      <Input placeholder="Author name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="coverImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormDescription>
                      URL to the cover image (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt*</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief summary of the post" 
                      className="resize-none"
                      rows={2}
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    A short summary displayed in blog listings
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content*</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Blog post content" 
                      className="resize-none"
                      rows={12}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add tag"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleAddTag}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value?.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                        <button
                          type="button"
                          className="ml-1 text-gray-400 hover:text-gray-600"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit">Create Post</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function EditPostDialog({ 
  open, 
  onOpenChange, 
  post,
  onSuccess 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  post: BlogPost;
  onSuccess: () => void;
}) {
  const { toast } = useToast();
  const [tagsInput, setTagsInput] = useState('');
  
  // Form validation
  const form = useForm<z.infer<typeof blogPostFormSchema>>({
    resolver: zodResolver(blogPostFormSchema),
    defaultValues: {
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      author: post.author,
      tags: post.tags || [],
      coverImage: post.coverImage || '',
    }
  });
  
  // Handle form submission
  const handleSubmit = async (values: z.infer<typeof blogPostFormSchema>) => {
    try {
      const response = await fetch(getApiUrl(`/api/admin/blog/${post.id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': ADMIN_TOKEN
        },
        body: JSON.stringify(values)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update blog post');
      }
      
      toast({
        title: "Blog post updated",
        description: "Your changes have been saved successfully."
      });
      
      onSuccess();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to update blog post",
        description: "There was an error updating your blog post. Please try again."
      });
    }
  };
  
  // Handle tags input
  const handleAddTag = () => {
    if (!tagsInput.trim()) return;
    
    const currentTags = form.getValues('tags') || [];
    form.setValue('tags', [...currentTags, tagsInput.trim()]);
    setTagsInput('');
  };
  
  const handleRemoveTag = (tag: string) => {
    const currentTags = form.getValues('tags') || [];
    form.setValue('tags', currentTags.filter(t => t !== tag));
  };
  
  // Generate slug from title
  const generateSlug = () => {
    const title = form.getValues('title');
    if (!title) return;
    
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
    
    form.setValue('slug', slug);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Blog Post</DialogTitle>
          <DialogDescription>
            Make changes to your blog post. 
            {post.published ? " This will update the published post." : " Your changes will be saved as a draft."}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title*</FormLabel>
                    <FormControl>
                      <Input placeholder="Post title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug*</FormLabel>
                    <div className="flex space-x-2">
                      <FormControl>
                        <Input placeholder="post-slug" {...field} />
                      </FormControl>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={generateSlug}
                      >
                        Generate
                      </Button>
                    </div>
                    <FormDescription>
                      The URL-friendly version of the title
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author*</FormLabel>
                    <FormControl>
                      <Input placeholder="Author name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="coverImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormDescription>
                      URL to the cover image (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt*</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief summary of the post" 
                      className="resize-none"
                      rows={2}
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    A short summary displayed in blog listings
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content*</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Blog post content" 
                      className="resize-none"
                      rows={12}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add tag"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleAddTag}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value?.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                        <button
                          type="button"
                          className="ml-1 text-gray-400 hover:text-gray-600"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function DeletePostDialog({ 
  open, 
  onOpenChange, 
  post,
  onSuccess 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  post: BlogPost;
  onSuccess: () => void;
}) {
  const { toast } = useToast();
  
  const handleDelete = async () => {
    try {
      const response = await fetch(getApiUrl(`/api/admin/blog/${post.id}`), {
        method: 'DELETE',
        headers: {
          'X-Admin-Token': ADMIN_TOKEN
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete blog post');
      }
      
      toast({
        title: "Blog post deleted",
        description: "The blog post has been permanently deleted."
      });
      
      onSuccess();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to delete blog post",
        description: "There was an error deleting your blog post. Please try again."
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Blog Post</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this blog post? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <div className="border border-gray-100 dark:border-gray-800 rounded-lg p-4 mb-4">
          <h3 className="font-medium">{post.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {post.published ? "Published" : "Draft"} • by {post.author}
          </p>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}