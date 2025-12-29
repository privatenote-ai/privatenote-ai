import { CompositeStorage } from "./storage";
import { insertBlogPostSchema, updateBlogPostSchema, AnalyticsMetricsType } from "@shared/schema";
import type { Env } from "./types";

// Helper to create JSON response with CORS headers
function jsonResponse(data: any, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, x-admin-token",
    },
  });
}

// Helper to check admin authentication
function requireAdmin(request: Request): Response | null {
  const adminToken = request.headers.get("x-admin-token");
  
  if (!adminToken || adminToken !== "admin-secret-token") {
    return jsonResponse({ message: "Unauthorized - Admin access required" }, 401);
  }
  
  return null;
}

// Helper to parse URL parameters
function parsePathParams(pathname: string, pattern: string): Record<string, string> | null {
  const patternParts = pattern.split("/");
  const pathParts = pathname.split("/");
  
  if (patternParts.length !== pathParts.length) {
    return null;
  }
  
  const params: Record<string, string> = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(":")) {
      const paramName = patternParts[i].slice(1);
      params[paramName] = pathParts[i];
    } else if (patternParts[i] !== pathParts[i]) {
      return null;
    }
  }
  
  return params;
}

export async function registerRoutes(request: Request, env: Env): Promise<Response> {
  // Handle CORS preflight requests
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, x-admin-token",
      },
    });
  }

  const url = new URL(request.url);
  const pathname = url.pathname;
  const method = request.method;
  const storage = new CompositeStorage(env.NOTES_KV);

  // AI API routes
  if (pathname === "/api/ai/config" && method === "GET") {
    if (env.OPENAI_API_KEY) {
      return jsonResponse({ apiKey: env.OPENAI_API_KEY });
    } else {
      return jsonResponse({ message: "OpenAI API key not configured on server" }, 500);
    }
  }

  // Notes API routes
  if (pathname === "/api/notes" && method === "POST") {
    try {
      const body = await request.json();
      const { 
        content, 
        iv, 
        expiryDays = 1, 
        maxReads = 1,
        isPasswordProtected = false,
        salt = null,
        encryptedKey = null,
        encryptedKeyIv = null
      } = body;
      
      if (!content || !iv) {
        return jsonResponse({ message: "Content and IV are required" }, 400);
      }
      
      // Check if password protection fields are provided when needed
      if (isPasswordProtected && (!salt || !encryptedKey || !encryptedKeyIv)) {
        return jsonResponse({ 
          message: "Salt, encryptedKey, and encryptedKeyIv are required for password-protected notes" 
        }, 400);
      }
      
      // Calculate expiration date based on expiryDays
      const expiresAt = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000);
      
      // Create a new note with encrypted content
      const note = await storage.createNote({
        content,
        iv,
        expiresAt,
        maxReads: maxReads || 0, // 0 means no limit, default is 1
        currentReads: 0,
        isPasswordProtected,
        ...(isPasswordProtected && {
          salt,
          encryptedKey,
          encryptedKeyIv
        })
      });
      
      // Track note creation in analytics
      await storage.trackNoteCreation(note);
      
      return jsonResponse({ id: note.id }, 201);
    } catch (error) {
      console.error("Error creating note:", error);
      return jsonResponse({ message: "Failed to create note" }, 500);
    }
  }

  // GET /api/notes/:id
  const noteParams = parsePathParams(pathname, "/api/notes/:id");
  if (noteParams && method === "GET") {
    try {
      const { id } = noteParams;
      
      // Get note by ID
      let note = await storage.getNoteById(id);
      
      if (!note) {
        return jsonResponse({ message: "Note not found" }, 404);
      }
      
      // Check if note has expired (KV should handle this, but double-check)
      if (note.expiresAt && new Date(note.expiresAt) < new Date()) {
        await storage.deleteNote(id);
        return jsonResponse({ message: "Note has expired" }, 404);
      }
      
      // Check read count limit (note: maxReads 0 means unlimited)
      if (note.maxReads && note.maxReads > 0 && note.currentReads && note.currentReads >= note.maxReads) {
        return jsonResponse({ message: "Note has reached maximum read count" }, 404);
      }
      
      // Increment read count
      const updatedNote = await storage.updateNoteReadCount(id);
      
      if (!updatedNote) {
        return jsonResponse({ message: "Failed to update note read count" }, 404);
      }
      
      // If note has reached max reads, delete it (use waitUntil for background task)
      if (updatedNote.maxReads && updatedNote.maxReads > 0 && 
          updatedNote.currentReads && updatedNote.currentReads >= updatedNote.maxReads) {
        // Delete after a short delay (use waitUntil for background task)
        // Note: In Workers, we can't use setTimeout, so we'll delete it immediately after response
        // The client will get the note, then it will be deleted
        storage.deleteNote(id).catch(err => 
          console.error(`Error deleting note after reaching read limit: ${err}`)
        );
      }
      
      // Use the updated note for the response
      note = updatedNote;
      
      // Track note view in analytics
      await storage.trackNoteView(note);
      
      // Return the encrypted content and IV, and any password protection fields
      return jsonResponse({
        content: note.content,
        iv: note.iv,
        readCount: note.currentReads,
        maxReads: note.maxReads,
        expiresAt: note.expiresAt,
        isPasswordProtected: note.isPasswordProtected || false,
        ...(note.isPasswordProtected && {
          salt: note.salt,
          encryptedKey: note.encryptedKey,
          encryptedKeyIv: note.encryptedKeyIv
        })
      });
    } catch (error) {
      console.error("Error fetching note:", error);
      return jsonResponse({ message: "Failed to fetch note" }, 500);
    }
  }

  // DELETE /api/notes/:id
  if (noteParams && method === "DELETE") {
    try {
      const { id } = noteParams;
      
      // Delete note by ID
      await storage.deleteNote(id);
      
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (error) {
      console.error("Error deleting note:", error);
      return jsonResponse({ message: "Failed to delete note" }, 500);
    }
  }

  // Blog API routes - Public
  if (pathname === "/api/blog" && method === "GET") {
    try {
      // Only get published posts for public endpoint
      const posts = await storage.getBlogPosts(false);
      return jsonResponse(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      return jsonResponse({ message: "Failed to fetch blog posts" }, 500);
    }
  }

  // GET /api/blog/:slug
  const blogSlugParams = parsePathParams(pathname, "/api/blog/:slug");
  if (blogSlugParams && method === "GET") {
    try {
      const { slug } = blogSlugParams;
      const post = await storage.getBlogPostBySlug(slug);
      
      if (!post) {
        return jsonResponse({ message: "Blog post not found" }, 404);
      }
      
      // Only return published posts to the public
      if (!post.published) {
        return jsonResponse({ message: "Blog post not found" }, 404);
      }
      
      // Track blog post view in analytics
      await storage.trackBlogView(post.slug);
      
      return jsonResponse(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      return jsonResponse({ message: "Failed to fetch blog post" }, 500);
    }
  }

  // Blog API routes - Admin
  if (pathname === "/api/admin/blog" && method === "GET") {
    const authError = requireAdmin(request);
    if (authError) return authError;
    
    try {
      // Admin can see all posts including unpublished
      const posts = await storage.getBlogPosts(true);
      return jsonResponse(posts);
    } catch (error) {
      console.error("Error fetching admin blog posts:", error);
      return jsonResponse({ message: "Failed to fetch blog posts" }, 500);
    }
  }

  if (pathname === "/api/admin/blog" && method === "POST") {
    const authError = requireAdmin(request);
    if (authError) return authError;
    
    try {
      const body = await request.json();
      // Validate the request body
      const result = insertBlogPostSchema.safeParse(body);
      
      if (!result.success) {
        return jsonResponse({ 
          message: "Invalid blog post data", 
          errors: result.error.errors 
        }, 400);
      }
      
      // Create slug from title if not provided
      if (!result.data.slug) {
        result.data.slug = result.data.title
          .toLowerCase()
          .replace(/[^\w\s]/gi, "")
          .replace(/\s+/g, "-");
      }
      
      // Check if slug already exists
      const existing = await storage.getBlogPostBySlug(result.data.slug);
      if (existing) {
        return jsonResponse({ 
          message: "A blog post with this slug already exists" 
        }, 400);
      }
      
      // Create new blog post (default to unpublished)
      const post = await storage.createBlogPost({
        ...result.data,
        published: false
      });
      
      return jsonResponse(post, 201);
    } catch (error) {
      console.error("Error creating blog post:", error);
      return jsonResponse({ message: "Failed to create blog post" }, 500);
    }
  }

  // GET /api/admin/blog/:id
  const adminBlogIdParams = parsePathParams(pathname, "/api/admin/blog/:id");
  if (adminBlogIdParams && method === "GET") {
    const authError = requireAdmin(request);
    if (authError) return authError;
    
    try {
      const id = parseInt(adminBlogIdParams.id, 10);
      
      if (isNaN(id)) {
        return jsonResponse({ message: "Invalid ID format" }, 400);
      }
      
      const post = await storage.getBlogPostById(id);
      
      if (!post) {
        return jsonResponse({ message: "Blog post not found" }, 404);
      }
      
      return jsonResponse(post);
    } catch (error) {
      console.error("Error fetching admin blog post:", error);
      return jsonResponse({ message: "Failed to fetch blog post" }, 500);
    }
  }

  // PUT /api/admin/blog/:id
  if (adminBlogIdParams && method === "PUT") {
    const authError = requireAdmin(request);
    if (authError) return authError;
    
    try {
      const id = parseInt(adminBlogIdParams.id, 10);
      
      if (isNaN(id)) {
        return jsonResponse({ message: "Invalid ID format" }, 400);
      }
      
      const body = await request.json();
      // Validate the request body
      const result = updateBlogPostSchema.safeParse(body);
      
      if (!result.success) {
        return jsonResponse({ 
          message: "Invalid blog post data", 
          errors: result.error.errors 
        }, 400);
      }
      
      // Check if the post exists
      const existing = await storage.getBlogPostById(id);
      if (!existing) {
        return jsonResponse({ message: "Blog post not found" }, 404);
      }
      
      // If slug is being changed, check it doesn't conflict
      if (result.data.slug && result.data.slug !== existing.slug) {
        const slugExists = await storage.getBlogPostBySlug(result.data.slug);
        if (slugExists && slugExists.id !== id) {
          return jsonResponse({ 
            message: "A blog post with this slug already exists" 
          }, 400);
        }
      }
      
      // Update the blog post
      const updated = await storage.updateBlogPost(id, result.data);
      
      if (!updated) {
        return jsonResponse({ message: "Failed to update blog post" }, 404);
      }
      
      return jsonResponse(updated);
    } catch (error) {
      console.error("Error updating blog post:", error);
      return jsonResponse({ message: "Failed to update blog post" }, 500);
    }
  }

  // POST /api/admin/blog/:id/publish
  const publishParams = parsePathParams(pathname, "/api/admin/blog/:id/publish");
  if (publishParams && method === "POST") {
    const authError = requireAdmin(request);
    if (authError) return authError;
    
    try {
      const id = parseInt(publishParams.id, 10);
      
      if (isNaN(id)) {
        return jsonResponse({ message: "Invalid ID format" }, 400);
      }
      
      // Publish the blog post
      const post = await storage.publishBlogPost(id);
      
      if (!post) {
        return jsonResponse({ message: "Blog post not found" }, 404);
      }
      
      return jsonResponse(post);
    } catch (error) {
      console.error("Error publishing blog post:", error);
      return jsonResponse({ message: "Failed to publish blog post" }, 500);
    }
  }

  // POST /api/admin/blog/:id/unpublish
  const unpublishParams = parsePathParams(pathname, "/api/admin/blog/:id/unpublish");
  if (unpublishParams && method === "POST") {
    const authError = requireAdmin(request);
    if (authError) return authError;
    
    try {
      const id = parseInt(unpublishParams.id, 10);
      
      if (isNaN(id)) {
        return jsonResponse({ message: "Invalid ID format" }, 400);
      }
      
      // Unpublish the blog post
      const post = await storage.unpublishBlogPost(id);
      
      if (!post) {
        return jsonResponse({ message: "Blog post not found" }, 404);
      }
      
      return jsonResponse(post);
    } catch (error) {
      console.error("Error unpublishing blog post:", error);
      return jsonResponse({ message: "Failed to unpublish blog post" }, 500);
    }
  }

  // DELETE /api/admin/blog/:id
  if (adminBlogIdParams && method === "DELETE") {
    const authError = requireAdmin(request);
    if (authError) return authError;
    
    try {
      const id = parseInt(adminBlogIdParams.id, 10);
      
      if (isNaN(id)) {
        return jsonResponse({ message: "Invalid ID format" }, 400);
      }
      
      // Delete the blog post
      await storage.deleteBlogPost(id);
      
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (error) {
      console.error("Error deleting blog post:", error);
      return jsonResponse({ message: "Failed to delete blog post" }, 500);
    }
  }

  // Analytics API routes - Admin
  if (pathname === "/api/admin/analytics/daily" && method === "GET") {
    const authError = requireAdmin(request);
    if (authError) return authError;
    
    try {
      const dateParam = url.searchParams.get("date");
      const date = dateParam ? new Date(dateParam) : new Date();
      
      if (isNaN(date.getTime())) {
        return jsonResponse({ message: "Invalid date format" }, 400);
      }
      
      const metrics = await storage.getDailyMetrics(date);
      return jsonResponse(metrics || { message: "No metrics available for this date" });
    } catch (error) {
      console.error("Error fetching daily metrics:", error);
      return jsonResponse({ message: "Failed to fetch metrics" }, 500);
    }
  }

  if (pathname === "/api/admin/analytics/weekly" && method === "GET") {
    const authError = requireAdmin(request);
    if (authError) return authError;
    
    try {
      const dateParam = url.searchParams.get("date");
      const date = dateParam ? new Date(dateParam) : new Date();
      
      if (isNaN(date.getTime())) {
        return jsonResponse({ message: "Invalid date format" }, 400);
      }
      
      const metrics = await storage.getWeeklyMetrics(date);
      return jsonResponse(metrics || { message: "No metrics available for this week" });
    } catch (error) {
      console.error("Error fetching weekly metrics:", error);
      return jsonResponse({ message: "Failed to fetch metrics" }, 500);
    }
  }

  if (pathname === "/api/admin/analytics/monthly" && method === "GET") {
    const authError = requireAdmin(request);
    if (authError) return authError;
    
    try {
      const dateParam = url.searchParams.get("date");
      const date = dateParam ? new Date(dateParam) : new Date();
      
      if (isNaN(date.getTime())) {
        return jsonResponse({ message: "Invalid date format" }, 400);
      }
      
      const metrics = await storage.getMonthlyMetrics(date);
      return jsonResponse(metrics || { message: "No metrics available for this month" });
    } catch (error) {
      console.error("Error fetching monthly metrics:", error);
      return jsonResponse({ message: "Failed to fetch metrics" }, 500);
    }
  }

  if (pathname === "/api/admin/analytics/range" && method === "GET") {
    const authError = requireAdmin(request);
    if (authError) return authError;
    
    try {
      const startDate = url.searchParams.get("startDate");
      const endDate = url.searchParams.get("endDate");
      const type = url.searchParams.get("type");
      
      if (!startDate || !endDate || !type) {
        return jsonResponse({ 
          message: "Start date, end date, and metrics type are required" 
        }, 400);
      }
      
      const start = new Date(startDate);
      const end = new Date(endDate);
      const metricsType = type as AnalyticsMetricsType;
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return jsonResponse({ message: "Invalid date format" }, 400);
      }
      
      if (!Object.values(AnalyticsMetricsType).includes(metricsType)) {
        return jsonResponse({ 
          message: "Invalid metrics type. Must be daily, weekly, or monthly"
        }, 400);
      }
      
      const metrics = await storage.getAnalyticsData(start, end, metricsType);
      return jsonResponse(metrics);
    } catch (error) {
      console.error("Error fetching analytics range:", error);
      return jsonResponse({ message: "Failed to fetch analytics" }, 500);
    }
  }

  // 404 for unmatched routes
  return jsonResponse({ message: "Not Found" }, 404);
}

