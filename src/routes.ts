import { CompositeStorage } from "./storage";
import type { Note } from "@shared/schema";
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
function normalizeOrigin(origin: string): string {
  return origin.replace(/\/$/, '');
}

function getAllowedOrigin(request: Request): string | null {
  const origin = request.headers.get('Origin');
  if (!origin) return ALLOWED_ORIGINS[0]; // Default to first allowed origin

  const normalized = normalizeOrigin(origin);
  const normalizedAllowed = ALLOWED_ORIGINS.map(normalizeOrigin);

  // Check if origin is in allowed list
  if (normalizedAllowed.includes(normalized)) {
    return origin;
  }

  // For development, allow localhost variations
  if (normalized.includes('localhost') || normalized.includes('127.0.0.1')) {
    return origin;
  }

  // Allow Pages preview and custom subdomains
  if (normalized.endsWith('.pages.dev') || normalized.endsWith('.privatenote.ai')) {
    return origin;
  }
  
  return null; // Origin not allowed
}

// Get Content Security Policy header
function getCSPHeader(): string {
  // Strict CSP to prevent XSS and code injection
  // Note: 'unsafe-inline' for styles is needed for React/Vite, but we avoid it for scripts
  return [
    "default-src 'self'",
    "script-src 'self' https://challenges.cloudflare.com", // Turnstile only on creation page
    "style-src 'self' 'unsafe-inline'", // React inline styles
    "font-src 'self'",
    "connect-src 'self' https://privatenote-api.marjan-skrobot.workers.dev https://privatenote-ai.pages.dev https://privatenote.ai https://api.openai.com https://challenges.cloudflare.com", // API endpoints
    "img-src 'self' data: https:", // Images (data: for inline images, https: for external)
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'", // Prevent clickjacking
    "object-src 'none'", // Block plugins
    "upgrade-insecure-requests", // Upgrade HTTP to HTTPS
  ].join("; ");
}

// Get CORS headers
function getCorsHeaders(request: Request): Record<string, string> {
  const allowedOrigin = getAllowedOrigin(request);
  
  return {
    "Access-Control-Allow-Origin": allowedOrigin || ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-admin-token",
    "Content-Security-Policy": getCSPHeader(),
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

async function verifyTurnstile(
  token: string | undefined,
  request: Request,
  env: Env,
): Promise<boolean> {
  if (!token || !env.TURNSTILE_SECRET_KEY) {
    return false;
  }

  const formData = new FormData();
  formData.append("secret", env.TURNSTILE_SECRET_KEY);
  formData.append("response", token);

  const ip = request.headers.get("CF-Connecting-IP");
  if (ip) {
    formData.append("remoteip", ip);
  }

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      return false;
    }
    const data = await response.json<{ success?: boolean }>();
    return !!data.success;
  } catch {
    return false;
  }
}

function applyCorsHeaders(response: Response, request: Request): Response {
  const headers = new Headers(response.headers);
  const corsHeaders = getCorsHeaders(request);
  for (const [key, value] of Object.entries(corsHeaders)) {
    headers.set(key, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
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
  const url = new URL(request.url);
  const pathname = url.pathname;
  const method = request.method;
  const isAiRequest = pathname.startsWith("/api/ai/");

  console.log(`[ROUTES] ========== REGISTER ROUTES ==========`);
  console.log(`[ROUTES] Request method: ${method}`);
  console.log(`[ROUTES] Request URL: ${request.url}`);
  if (!isAiRequest) {
    console.log(`[ROUTES] Request headers:`, JSON.stringify(Object.fromEntries(request.headers.entries())));
  } else {
    console.log(`[ROUTES] Request headers: [redacted for AI request]`);
  }
  
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

  console.log(`[ROUTES] Pathname: ${pathname}, Method: ${method}`);
  
  const analyticsKv = env.ANALYTICS_KV || env.NOTES_KV;
  const storage = new CompositeStorage(env.NOTES_KV, analyticsKv);
  console.log(`[ROUTES] Storage initialized`);

  // AI API routes
  if (pathname === "/api/ai/enhance" && method === "POST") {
    if (!env.OPENAI_API_KEY) {
      return jsonResponse({ message: "OpenAI API key not configured on server" }, 500, request);
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ message: "Invalid JSON payload" }, 400, request);
    }

    const content = typeof body?.content === "string" ? body.content.trim() : "";
    const enhancementType = body?.enhancementType;
    const turnstileToken = body?.turnstileToken;

    if (!content) {
      return jsonResponse({ message: "Content is required" }, 400, request);
    }

    const MAX_INPUT_CHARS = 4000;
    if (content.length > MAX_INPUT_CHARS) {
      return jsonResponse({ message: `Content is too long (max ${MAX_INPUT_CHARS} characters)` }, 413, request);
    }

    if (!["improve", "summarize", "secure"].includes(enhancementType)) {
      return jsonResponse({ message: "Invalid enhancement type" }, 400, request);
    }

    const isHuman = await verifyTurnstile(turnstileToken, request, env);
    if (!isHuman) {
      return jsonResponse({ error: "Human verification failed" }, 403, request);
    }

    const systemPrompts: Record<string, string> = {
      improve: "You are an expert editor. Improve the text by fixing grammar, enhancing clarity, and making it more professional while maintaining the original meaning. Return only the improved text with no additional explanations.",
      summarize: "You are a skilled summarizer. Create a concise summary of the text while preserving all key points. Return only the summary with no additional explanations.",
      secure: "You are a security expert. Analyze the text and remove any potentially sensitive information (like personal data, passwords, credit card numbers, etc.) while maintaining the main message. Return only the sanitized text with no additional explanations.",
    };

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompts[enhancementType] },
            { role: "user", content },
          ],
          response_format: { type: "text" },
          max_tokens: 800,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[AI] OpenAI error:", response.status, errorText);
        return jsonResponse({ message: "AI request failed" }, 502, request);
      }

      const data = await response.json<{ choices?: Array<{ message?: { content?: string } }> }>();
      const output = data.choices?.[0]?.message?.content?.trim();
      if (!output) {
        return jsonResponse({ message: "AI response was empty" }, 502, request);
      }

      return jsonResponse({ content: output }, 200, request);
    } catch (error) {
      console.error("[AI] Error calling OpenAI:", error);
      return jsonResponse({ message: "AI request failed" }, 502, request);
    }
  }

  // Notes API routes (Durable Object authority)
  if (pathname === "/api/notes" && method === "POST") {
    let requestBody: any | null = null;
    let noteForAnalytics: Note | null = null;
    try {
      requestBody = await request.clone().json();
      const expirySecondsRaw = Number(requestBody?.expirySeconds ?? NaN);
      const expiryDaysRaw = Number(requestBody?.expiryDays ?? 1);
      const expirySeconds = Number.isFinite(expirySecondsRaw)
        ? expirySecondsRaw
        : expiryDaysRaw * 24 * 60 * 60;
      const maxReads = Number(requestBody?.maxReads ?? 1);
      if (requestBody?.content && requestBody?.iv) {
        noteForAnalytics = {
          id: "pending",
          content: requestBody.content,
          iv: requestBody.iv,
          expiresAt: new Date(Date.now() + expirySeconds * 1000),
          maxReads,
          currentReads: 0,
          createdAt: new Date(),
          isPasswordProtected: !!requestBody?.isPasswordProtected,
          salt: requestBody?.salt ?? null,
          encryptedKey: requestBody?.encryptedKey ?? null,
          encryptedKeyIv: requestBody?.encryptedKeyIv ?? null,
        };
      }
    } catch (error) {
      console.warn("[ROUTES] Skipping analytics for note creation:", error);
    }

    const aiMode = !!requestBody?.aiMode;
    if (aiMode) {
      const isHuman = await verifyTurnstile(requestBody?.turnstileToken, request, env);
      if (!isHuman) {
        return jsonResponse({ error: "Human verification failed" }, 403, request);
      }
    }

    const id = crypto.randomUUID();
    const doId = env.SECURE_NOTES.idFromName(id);
    const stub = env.SECURE_NOTES.get(doId);
    const doUrl = new URL(request.url);
    doUrl.pathname = `/api/notes/${id}`;

    const doResponse = await stub.fetch(
      new Request(doUrl.toString(), {
        method: "POST",
        headers: request.headers,
        body: request.body,
      }),
    );

    if (doResponse.ok && noteForAnalytics) {
      noteForAnalytics.id = id;
      await storage.trackNoteCreation(noteForAnalytics, { aiEnhanced: aiMode });
    }

    return applyCorsHeaders(doResponse, request);
  }

  const noteRevealParams = parsePathParams(pathname, "/api/notes/:id/reveal");
  if (noteRevealParams && method === "POST") {
    const { id } = noteRevealParams;
    const clientId = getClientIdentifier(request);
    const revealKey = `${clientId}:reveal:${id}`;
    const revealLimit = await checkRateLimit(request, env, revealKey);

    if (!revealLimit.allowed) {
      return jsonResponse({
        error: 'Rate limit exceeded',
        message: `Too many reveal attempts. Please try again in ${revealLimit.resetAt - Math.floor(Date.now() / 1000)} seconds.`,
        resetAt: revealLimit.resetAt,
      }, 429, request);
    }

    const doId = env.SECURE_NOTES.idFromName(id);
    const stub = env.SECURE_NOTES.get(doId);
    const doResponse = await stub.fetch(request);

    if (doResponse.ok) {
      try {
        const data = await doResponse.clone().json();
        const noteForAnalytics: Note = {
          id,
          content: data.content,
          iv: data.iv,
          expiresAt: new Date(data.expiresAt),
          maxReads: data.maxReads ?? 0,
          currentReads: data.readCount ?? 0,
          createdAt: new Date(),
          isPasswordProtected: !!data.isPasswordProtected,
          salt: data.salt ?? null,
          encryptedKey: data.encryptedKey ?? null,
          encryptedKeyIv: data.encryptedKeyIv ?? null,
        };
        await storage.trackNoteView(noteForAnalytics);
      } catch (error) {
        console.warn("[ROUTES] Skipping analytics for note reveal:", error);
      }
    }

    return applyCorsHeaders(doResponse, request);
  }

  const noteParams = parsePathParams(pathname, "/api/notes/:id");
  if (noteParams && (method === "GET" || method === "DELETE")) {
    const { id } = noteParams;
    const doId = env.SECURE_NOTES.idFromName(id);
    const stub = env.SECURE_NOTES.get(doId);
    const doResponse = await stub.fetch(request);
    return applyCorsHeaders(doResponse, request);
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
