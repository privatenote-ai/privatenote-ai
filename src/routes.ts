import { CompositeStorage } from "./storage";
import { insertBlogPostSchema, updateBlogPostSchema, AnalyticsMetricsType } from "@shared/schema";
import type { Env } from "./types";

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'https://privatenote-ai.pages.dev',
  'https://privatenote.ai',
  'http://localhost:5000',
  'http://localhost:5173',
  'http://127.0.0.1:5000',
  'http://127.0.0.1:5173',
];

// Rate limiting configuration
const RATE_LIMIT = {
  MAX_REQUESTS: 20, // requests per window
  WINDOW_SECONDS: 60, // 1 minute window
  KEY_PREFIX: 'rate_limit:',
};

// Get allowed origin for CORS
function getAllowedOrigin(request: Request): string | null {
  const origin = request.headers.get('Origin');
  if (!origin) return ALLOWED_ORIGINS[0]; // Default to first allowed origin
  
  // Check if origin is in allowed list
  if (ALLOWED_ORIGINS.includes(origin)) {
    return origin;
  }
  
  // For development, allow localhost variations
  if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
    return origin;
  }
  
  return null; // Origin not allowed
}

// Get CORS headers
function getCorsHeaders(request: Request): Record<string, string> {
  const allowedOrigin = getAllowedOrigin(request);
  
  return {
    "Access-Control-Allow-Origin": allowedOrigin || ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-admin-token",
    // Note: We don't include Access-Control-Allow-Credentials because we don't use credentials
    // If you need credentials later, set this to "true" and ensure Origin is specific (not *)
  };
}

// Helper to create JSON response with CORS headers
function jsonResponse(data: any, status: number = 200, request?: Request): Response {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(request ? getCorsHeaders(request) : {
      "Access-Control-Allow-Origin": ALLOWED_ORIGINS[0],
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, x-admin-token",
    }),
  };
  
  return new Response(JSON.stringify(data), {
    status,
    headers,
  });
}

// Rate limiting helper
async function checkRateLimit(
  request: Request,
  env: Env,
  identifier: string
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const kv = env.RATE_LIMIT_KV || env.NOTES_KV;
  const key = `${RATE_LIMIT.KEY_PREFIX}${identifier}`;
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - (now % RATE_LIMIT.WINDOW_SECONDS);
  
  try {
    const stored = await kv.get(key, { type: 'json' });
    
    if (stored && stored.windowStart === windowStart) {
      // Same window, check count
      if (stored.count >= RATE_LIMIT.MAX_REQUESTS) {
        return {
          allowed: false,
          remaining: 0,
          resetAt: windowStart + RATE_LIMIT.WINDOW_SECONDS,
        };
      }
      
      // Increment count
      const newCount = stored.count + 1;
      await kv.put(key, JSON.stringify({
        count: newCount,
        windowStart,
      }), {
        expirationTtl: RATE_LIMIT.WINDOW_SECONDS + 10, // Add buffer
      });
      
      return {
        allowed: true,
        remaining: RATE_LIMIT.MAX_REQUESTS - newCount,
        resetAt: windowStart + RATE_LIMIT.WINDOW_SECONDS,
      };
    } else {
      // New window, reset count
      await kv.put(key, JSON.stringify({
        count: 1,
        windowStart,
      }), {
        expirationTtl: RATE_LIMIT.WINDOW_SECONDS + 10,
      });
      
      return {
        allowed: true,
        remaining: RATE_LIMIT.MAX_REQUESTS - 1,
        resetAt: windowStart + RATE_LIMIT.WINDOW_SECONDS,
      };
    }
  } catch (error) {
    console.error('[RATE_LIMIT] Error checking rate limit:', error);
    // On error, allow the request (fail open)
    return {
      allowed: true,
      remaining: RATE_LIMIT.MAX_REQUESTS,
      resetAt: windowStart + RATE_LIMIT.WINDOW_SECONDS,
    };
  }
}

// Get client identifier for rate limiting
function getClientIdentifier(request: Request): string {
  // Try to get IP from Cloudflare headers
  const cfConnectingIp = request.headers.get('CF-Connecting-IP');
  if (cfConnectingIp) {
    return cfConnectingIp;
  }
  
  // Fallback to user agent + origin (less reliable)
  const userAgent = request.headers.get('User-Agent') || 'unknown';
  const origin = request.headers.get('Origin') || 'unknown';
  return `${origin}:${userAgent}`.substring(0, 100);
}

// Helper to check admin authentication
function requireAdmin(request: Request): Response | null {
  const adminToken = request.headers.get("x-admin-token");
  
  if (!adminToken || adminToken !== "admin-secret-token") {
    return jsonResponse({ message: "Unauthorized - Admin access required" }, 401, request);
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
  console.log(`[ROUTES] ========== REGISTER ROUTES ==========`);
  console.log(`[ROUTES] Request method: ${request.method}`);
  console.log(`[ROUTES] Request URL: ${request.url}`);
  console.log(`[ROUTES] Request headers:`, JSON.stringify(Object.fromEntries(request.headers.entries())));
  
  // Check CORS origin
  const allowedOrigin = getAllowedOrigin(request);
  if (!allowedOrigin && request.headers.get('Origin')) {
    console.log(`[ROUTES] ❌ CORS: Origin not allowed: ${request.headers.get('Origin')}`);
    return new Response(JSON.stringify({ 
      error: 'CORS policy: Origin not allowed' 
    }), {
      status: 403,
      headers: {
        "Content-Type": "application/json",
        ...getCorsHeaders(request),
      },
    });
  }
  
  // Handle CORS preflight requests
  if (request.method === "OPTIONS") {
    console.log(`[ROUTES] Handling OPTIONS preflight request`);
    return new Response(null, {
      status: 204,
      headers: {
        ...getCorsHeaders(request),
        "Access-Control-Max-Age": "86400",
      },
    });
  }
  
  // Apply rate limiting to POST requests (note creation)
  if (request.method === "POST") {
    const clientId = getClientIdentifier(request);
    console.log(`[ROUTES] Checking rate limit for: ${clientId}`);
    
    const rateLimit = await checkRateLimit(request, env, clientId);
    
    if (!rateLimit.allowed) {
      console.log(`[ROUTES] ❌ Rate limit exceeded for: ${clientId}`);
      return jsonResponse({
        error: 'Rate limit exceeded',
        message: `Too many requests. Please try again in ${rateLimit.resetAt - Math.floor(Date.now() / 1000)} seconds.`,
        resetAt: rateLimit.resetAt,
      }, 429, request);
    }
    
    console.log(`[ROUTES] ✅ Rate limit OK. Remaining: ${rateLimit.remaining}`);
  }

  const url = new URL(request.url);
  const pathname = url.pathname;
  const method = request.method;
  console.log(`[ROUTES] Pathname: ${pathname}, Method: ${method}`);
  
  const storage = new CompositeStorage(env.NOTES_KV);
  console.log(`[ROUTES] Storage initialized`);

  // AI API routes
  if (pathname === "/api/ai/config" && method === "GET") {
    if (env.OPENAI_API_KEY) {
      return jsonResponse({ apiKey: env.OPENAI_API_KEY }, 200, request);
    } else {
      return jsonResponse({ message: "OpenAI API key not configured on server" }, 500, request);
    }
  }

  // Notes API routes
  console.log(`[ROUTES] Checking notes route: pathname=${pathname}, method=${method}`);
  if (pathname === "/api/notes" && method === "POST") {
    console.log(`[ROUTES] ✅ Matched POST /api/notes route`);
    try {
      console.log(`[ROUTES] Attempting to parse request body...`);
      const body = await request.json();
      console.log(`[ROUTES] ✅ Successfully parsed JSON body`);
      console.log(`[ROUTES] Body keys:`, Object.keys(body));
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
        return jsonResponse({ message: "Content and IV are required" }, 400, request);
      }
      
      // Check if password protection fields are provided when needed
      if (isPasswordProtected && (!salt || !encryptedKey || !encryptedKeyIv)) {
        return jsonResponse({ 
          message: "Salt, encryptedKey, and encryptedKeyIv are required for password-protected notes" 
        }, 400, request);
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
      console.log(`[ROUTES] Tracking note creation in analytics...`);
      await storage.trackNoteCreation(note);
      console.log(`[ROUTES] ✅ Note created successfully with ID: ${note.id}`);
      
      return jsonResponse({ id: note.id }, 201, request);
    } catch (error) {
      console.error(`[ROUTES] ❌❌❌ ERROR CREATING NOTE ❌❌❌`);
      console.error(`[ROUTES] Error type: ${error?.constructor?.name || 'Unknown'}`);
      console.error(`[ROUTES] Error message: ${error instanceof Error ? error.message : String(error)}`);
      console.error(`[ROUTES] Error stack:`, error instanceof Error ? error.stack : 'No stack trace');
      return jsonResponse({ 
        message: "Failed to create note",
        error: error instanceof Error ? error.message : String(error)
      }, 500, request);
    }
  } else {
    console.log(`[ROUTES] ❌ No route matched for pathname=${pathname}, method=${method}`);
  }

  // GET /api/notes/:id
  const noteParams = parsePathParams(pathname, "/api/notes/:id");
  if (noteParams && method === "GET") {
    try {
      const { id } = noteParams;
      
      // Get note by ID
      let note = await storage.getNoteById(id);
      
      if (!note) {
        return jsonResponse({ message: "Note not found" }, 404, request);
      }
      
      // Check if note has expired (KV should handle this, but double-check)
      if (note.expiresAt && new Date(note.expiresAt) < new Date()) {
        await storage.deleteNote(id);
        return jsonResponse({ message: "Note has expired" }, 404, request);
      }
      
      // Check read count limit (note: maxReads 0 means unlimited)
      if (note.maxReads && note.maxReads > 0 && note.currentReads && note.currentReads >= note.maxReads) {
        return jsonResponse({ message: "Note has reached maximum read count" }, 404, request);
      }
      
      // Increment read count
      const updatedNote = await storage.updateNoteReadCount(id);
      
      if (!updatedNote) {
        return jsonResponse({ message: "Failed to update note read count" }, 404, request);
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
      }, 200, request);
    } catch (error) {
      console.error("Error fetching note:", error);
      return jsonResponse({ message: "Failed to fetch note" }, 500, request);
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
        headers: getCorsHeaders(request),
      });
    } catch (error) {
      console.error("Error deleting note:", error);
      return jsonResponse({ message: "Failed to delete note" }, 500, request);
    }
  }

  // Blog API routes - Public
  if (pathname === "/api/blog" && method === "GET") {
    try {
      // Only get published posts for public endpoint
      const posts = await storage.getBlogPosts(false);
      return jsonResponse(posts, 200, request);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      return jsonResponse({ message: "Failed to fetch blog posts" }, 500, request);
    }
  }

  // GET /api/blog/:slug
  const blogSlugParams = parsePathParams(pathname, "/api/blog/:slug");
  if (blogSlugParams && method === "GET") {
    try {
      const { slug } = blogSlugParams;
      const post = await storage.getBlogPostBySlug(slug);
      
      if (!post) {
        return jsonResponse({ message: "Blog post not found" }, 404, request);
      }
      
      // Only return published posts to the public
      if (!post.published) {
        return jsonResponse({ message: "Blog post not found" }, 404, request);
      }
      
      // Track blog post view in analytics
      await storage.trackBlogView(post.slug);
      
      return jsonResponse(post, 200, request);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      return jsonResponse({ message: "Failed to fetch blog post" }, 500, request);
    }
  }

  // Blog API routes - Admin
  if (pathname === "/api/admin/blog" && method === "GET") {
    const authError = requireAdmin(request);
    if (authError) return authError;
    
    try {
      // Admin can see all posts including unpublished
      const posts = await storage.getBlogPosts(true);
      return jsonResponse(posts, 200, request);
    } catch (error) {
      console.error("Error fetching admin blog posts:", error);
      return jsonResponse({ message: "Failed to fetch blog posts" }, 500, request);
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
        }, 400, request);
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
        }, 400, request);
      }
      
      // Create new blog post (default to unpublished)
      const post = await storage.createBlogPost({
        ...result.data,
        published: false
      });
      
      return jsonResponse(post, 201, request);
    } catch (error) {
      console.error("Error creating blog post:", error);
      return jsonResponse({ message: "Failed to create blog post" }, 500, request);
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
        return jsonResponse({ message: "Invalid ID format" }, 400, request);
      }
      
      const post = await storage.getBlogPostById(id);
      
      if (!post) {
        return jsonResponse({ message: "Blog post not found" }, 404, request);
      }
      
      return jsonResponse(post, 200, request);
    } catch (error) {
      console.error("Error fetching admin blog post:", error);
      return jsonResponse({ message: "Failed to fetch blog post" }, 500, request);
    }
  }

  // PUT /api/admin/blog/:id
  if (adminBlogIdParams && method === "PUT") {
    const authError = requireAdmin(request);
    if (authError) return authError;
    
    try {
      const id = parseInt(adminBlogIdParams.id, 10);
      
      if (isNaN(id)) {
        return jsonResponse({ message: "Invalid ID format" }, 400, request);
      }
      
      const body = await request.json();
      // Validate the request body
      const result = updateBlogPostSchema.safeParse(body);
      
      if (!result.success) {
        return jsonResponse({ 
          message: "Invalid blog post data", 
          errors: result.error.errors 
        }, 400, request);
      }
      
      // Check if the post exists
      const existing = await storage.getBlogPostById(id);
      if (!existing) {
        return jsonResponse({ message: "Blog post not found" }, 404, request);
      }
      
      // If slug is being changed, check it doesn't conflict
      if (result.data.slug && result.data.slug !== existing.slug) {
        const slugExists = await storage.getBlogPostBySlug(result.data.slug);
        if (slugExists && slugExists.id !== id) {
          return jsonResponse({ 
            message: "A blog post with this slug already exists" 
          }, 400, request);
        }
      }
      
      // Update the blog post
      const updated = await storage.updateBlogPost(id, result.data);
      
      if (!updated) {
        return jsonResponse({ message: "Failed to update blog post" }, 404, request);
      }
      
      return jsonResponse(updated, 200, request);
    } catch (error) {
      console.error("Error updating blog post:", error);
      return jsonResponse({ message: "Failed to update blog post" }, 500, request);
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
        return jsonResponse({ message: "Invalid ID format" }, 400, request);
      }
      
      // Publish the blog post
      const post = await storage.publishBlogPost(id);
      
      if (!post) {
        return jsonResponse({ message: "Blog post not found" }, 404, request);
      }
      
      return jsonResponse(post, 200, request);
    } catch (error) {
      console.error("Error publishing blog post:", error);
      return jsonResponse({ message: "Failed to publish blog post" }, 500, request);
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
        return jsonResponse({ message: "Invalid ID format" }, 400, request);
      }
      
      // Unpublish the blog post
      const post = await storage.unpublishBlogPost(id);
      
      if (!post) {
        return jsonResponse({ message: "Blog post not found" }, 404, request);
      }
      
      return jsonResponse(post, 200, request);
    } catch (error) {
      console.error("Error unpublishing blog post:", error);
      return jsonResponse({ message: "Failed to unpublish blog post" }, 500, request);
    }
  }

  // DELETE /api/admin/blog/:id
  if (adminBlogIdParams && method === "DELETE") {
    const authError = requireAdmin(request);
    if (authError) return authError;
    
    try {
      const id = parseInt(adminBlogIdParams.id, 10);
      
      if (isNaN(id)) {
        return jsonResponse({ message: "Invalid ID format" }, 400, request);
      }
      
      // Delete the blog post
      await storage.deleteBlogPost(id);
      
      return new Response(null, {
        status: 204,
        headers: getCorsHeaders(request),
      });
    } catch (error) {
      console.error("Error deleting blog post:", error);
      return jsonResponse({ message: "Failed to delete blog post" }, 500, request);
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
        return jsonResponse({ message: "Invalid date format" }, 400, request);
      }
      
      const metrics = await storage.getDailyMetrics(date);
      return jsonResponse(metrics || { message: "No metrics available for this date" }, 200, request);
    } catch (error) {
      console.error("Error fetching daily metrics:", error);
      return jsonResponse({ message: "Failed to fetch metrics" }, 500, request);
    }
  }

  if (pathname === "/api/admin/analytics/weekly" && method === "GET") {
    const authError = requireAdmin(request);
    if (authError) return authError;
    
    try {
      const dateParam = url.searchParams.get("date");
      const date = dateParam ? new Date(dateParam) : new Date();
      
      if (isNaN(date.getTime())) {
        return jsonResponse({ message: "Invalid date format" }, 400, request);
      }
      
      const metrics = await storage.getWeeklyMetrics(date);
      return jsonResponse(metrics || { message: "No metrics available for this week" }, 200, request);
    } catch (error) {
      console.error("Error fetching weekly metrics:", error);
      return jsonResponse({ message: "Failed to fetch metrics" }, 500, request);
    }
  }

  if (pathname === "/api/admin/analytics/monthly" && method === "GET") {
    const authError = requireAdmin(request);
    if (authError) return authError;
    
    try {
      const dateParam = url.searchParams.get("date");
      const date = dateParam ? new Date(dateParam) : new Date();
      
      if (isNaN(date.getTime())) {
        return jsonResponse({ message: "Invalid date format" }, 400, request);
      }
      
      const metrics = await storage.getMonthlyMetrics(date);
      return jsonResponse(metrics || { message: "No metrics available for this month" }, 200, request);
    } catch (error) {
      console.error("Error fetching monthly metrics:", error);
      return jsonResponse({ message: "Failed to fetch metrics" }, 500, request);
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
        }, 400, request);
      }
      
      const start = new Date(startDate);
      const end = new Date(endDate);
      const metricsType = type as AnalyticsMetricsType;
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return jsonResponse({ message: "Invalid date format" }, 400, request);
      }
      
      if (!Object.values(AnalyticsMetricsType).includes(metricsType)) {
        return jsonResponse({ 
          message: "Invalid metrics type. Must be daily, weekly, or monthly"
        }, 400, request);
      }
      
      const metrics = await storage.getAnalyticsData(start, end, metricsType);
      return jsonResponse(metrics, 200, request);
    } catch (error) {
      console.error("Error fetching analytics range:", error);
      return jsonResponse({ message: "Failed to fetch analytics" }, 500, request);
    }
  }

  // 404 for unmatched routes
  console.log(`[ROUTES] ❌ No route handler matched. Returning 404`);
  console.log(`[ROUTES] Pathname: ${pathname}, Method: ${method}`);
  return jsonResponse({ message: "Not Found", pathname, method }, 404, request);
}

