import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBlogPostSchema, updateBlogPostSchema, AnalyticsMetricsType, DailyMetrics } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // AI API routes
  app.get('/api/ai/config', (req, res) => {
    // Only send the API key if it exists in the environment
    if (process.env.OPENAI_API_KEY) {
      res.json({ apiKey: process.env.OPENAI_API_KEY });
    } else {
      res.status(500).json({ message: 'OpenAI API key not configured on server' });
    }
  });
  
  // Notes API routes
  app.post('/api/notes', async (req, res) => {
    try {
      const { 
        content, 
        iv, 
        expiryDays = 1, 
        maxReads = 1,
        isPasswordProtected = false,
        salt = null,
        encryptedKey = null,
        encryptedKeyIv = null
      } = req.body;
      
      if (!content || !iv) {
        return res.status(400).json({ message: 'Content and IV are required' });
      }
      
      // Check if password protection fields are provided when needed
      if (isPasswordProtected && (!salt || !encryptedKey || !encryptedKeyIv)) {
        return res.status(400).json({ 
          message: 'Salt, encryptedKey, and encryptedKeyIv are required for password-protected notes' 
        });
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
      
      res.status(201).json({ id: note.id });
    } catch (error) {
      console.error('Error creating note:', error);
      res.status(500).json({ message: 'Failed to create note' });
    }
  });
  
  app.get('/api/notes/:id', async (req, res) => {
    try {
      const { id } = req.params;
      
      // Get note by ID
      let note = await storage.getNoteById(id);
      
      if (!note) {
        return res.status(404).json({ message: 'Note not found' });
      }
      
      // Check if note has expired
      if (note.expiresAt && new Date(note.expiresAt) < new Date()) {
        await storage.deleteNote(id);
        return res.status(404).json({ message: 'Note has expired' });
      }
      
      // Check read count limit (note: maxReads 0 means unlimited)
      if (note.maxReads && note.maxReads > 0 && note.currentReads && note.currentReads >= note.maxReads) {
        return res.status(404).json({ message: 'Note has reached maximum read count' });
      }

      // Return metadata only (no ciphertext, no consumption)
      res.json({
        readCount: note.currentReads || 0,
        maxReads: note.maxReads || 0,
        expiresAt: note.expiresAt,
        isPasswordProtected: note.isPasswordProtected || false,
      });
    } catch (error) {
      console.error('Error fetching note:', error);
      res.status(500).json({ message: 'Failed to fetch note' });
    }
  });

  app.post('/api/notes/:id/reveal', async (req, res) => {
    try {
      const { id } = req.params;

      // Get note by ID
      let note = await storage.getNoteById(id);

      if (!note) {
        return res.status(404).json({ message: 'Note not found' });
      }

      // Check if note has expired
      if (note.expiresAt && new Date(note.expiresAt) < new Date()) {
        await storage.deleteNote(id);
        return res.status(404).json({ message: 'Note has expired' });
      }

      // Check read count limit (note: maxReads 0 means unlimited)
      if (note.maxReads && note.maxReads > 0 && note.currentReads && note.currentReads >= note.maxReads) {
        return res.status(404).json({ message: 'Note has reached maximum read count' });
      }

      // Increment read count
      const updatedNote = await storage.updateNoteReadCount(id);

      if (!updatedNote) {
        return res.status(404).json({ message: 'Failed to update note read count' });
      }

      // If note has reached max reads, delete it
      if (updatedNote.maxReads && updatedNote.maxReads > 0 && 
          updatedNote.currentReads && updatedNote.currentReads >= updatedNote.maxReads) {
        setTimeout(() => {
          storage.deleteNote(id).catch(err => 
            console.error(`Error deleting note after reaching read limit: ${err}`)
          );
        }, 100);
      }

      note = updatedNote;

      // Track note view in analytics
      await storage.trackNoteView(note);

      // Return encrypted content and IV
      res.json({
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
      console.error('Error revealing note:', error);
      res.status(500).json({ message: 'Failed to reveal note' });
    }
  });
  
  app.delete('/api/notes/:id', async (req, res) => {
    try {
      const { id } = req.params;
      
      // Delete note by ID
      await storage.deleteNote(id);
      
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting note:', error);
      res.status(500).json({ message: 'Failed to delete note' });
    }
  });

  // Simple admin authentication middleware
  const requireAdmin = async (req: Request, res: Response, next: Function) => {
    // In a real app, this would validate a session/token and check user permissions
    // For development, we'll create a simple mechanism
    const adminToken = req.headers['x-admin-token'];
    
    if (!adminToken || adminToken !== 'admin-secret-token') {
      return res.status(401).json({ message: 'Unauthorized - Admin access required' });
    }
    
    next();
  };

  // Blog API routes - Public
  app.get('/api/blog', async (req, res) => {
    try {
      // Only get published posts for public endpoint
      const posts = await storage.getBlogPosts(false);
      res.json(posts);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      res.status(500).json({ message: 'Failed to fetch blog posts' });
    }
  });

  app.get('/api/blog/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      const post = await storage.getBlogPostBySlug(slug);
      
      if (!post) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      
      // Only return published posts to the public
      if (!post.published) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      
      // Track blog post view in analytics
      await storage.trackBlogView(post.slug);
      
      res.json(post);
    } catch (error) {
      console.error('Error fetching blog post:', error);
      res.status(500).json({ message: 'Failed to fetch blog post' });
    }
  });

  // Blog API routes - Admin
  app.get('/api/admin/blog', requireAdmin, async (req, res) => {
    try {
      // Admin can see all posts including unpublished
      const posts = await storage.getBlogPosts(true);
      res.json(posts);
    } catch (error) {
      console.error('Error fetching admin blog posts:', error);
      res.status(500).json({ message: 'Failed to fetch blog posts' });
    }
  });

  app.post('/api/admin/blog', requireAdmin, async (req, res) => {
    try {
      // Validate the request body
      const result = insertBlogPostSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: 'Invalid blog post data', 
          errors: result.error.errors 
        });
      }
      
      // Create slug from title if not provided
      if (!result.data.slug) {
        result.data.slug = result.data.title
          .toLowerCase()
          .replace(/[^\w\s]/gi, '')
          .replace(/\s+/g, '-');
      }
      
      // Check if slug already exists
      const existing = await storage.getBlogPostBySlug(result.data.slug);
      if (existing) {
        return res.status(400).json({ 
          message: 'A blog post with this slug already exists' 
        });
      }
      
      // Create new blog post (default to unpublished)
      const post = await storage.createBlogPost({
        ...result.data,
        published: false
      });
      
      res.status(201).json(post);
    } catch (error) {
      console.error('Error creating blog post:', error);
      res.status(500).json({ message: 'Failed to create blog post' });
    }
  });

  app.get('/api/admin/blog/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
      }
      
      const post = await storage.getBlogPostById(id);
      
      if (!post) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      
      res.json(post);
    } catch (error) {
      console.error('Error fetching admin blog post:', error);
      res.status(500).json({ message: 'Failed to fetch blog post' });
    }
  });

  app.put('/api/admin/blog/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
      }
      
      // Validate the request body
      const result = updateBlogPostSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: 'Invalid blog post data', 
          errors: result.error.errors 
        });
      }
      
      // Check if the post exists
      const existing = await storage.getBlogPostById(id);
      if (!existing) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      
      // If slug is being changed, check it doesn't conflict
      if (result.data.slug && result.data.slug !== existing.slug) {
        const slugExists = await storage.getBlogPostBySlug(result.data.slug);
        if (slugExists && slugExists.id !== id) {
          return res.status(400).json({ 
            message: 'A blog post with this slug already exists' 
          });
        }
      }
      
      // Update the blog post
      const updated = await storage.updateBlogPost(id, result.data);
      
      if (!updated) {
        return res.status(404).json({ message: 'Failed to update blog post' });
      }
      
      res.json(updated);
    } catch (error) {
      console.error('Error updating blog post:', error);
      res.status(500).json({ message: 'Failed to update blog post' });
    }
  });

  app.post('/api/admin/blog/:id/publish', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
      }
      
      // Publish the blog post
      const post = await storage.publishBlogPost(id);
      
      if (!post) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      
      res.json(post);
    } catch (error) {
      console.error('Error publishing blog post:', error);
      res.status(500).json({ message: 'Failed to publish blog post' });
    }
  });

  app.post('/api/admin/blog/:id/unpublish', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
      }
      
      // Unpublish the blog post
      const post = await storage.unpublishBlogPost(id);
      
      if (!post) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      
      res.json(post);
    } catch (error) {
      console.error('Error unpublishing blog post:', error);
      res.status(500).json({ message: 'Failed to unpublish blog post' });
    }
  });

  app.delete('/api/admin/blog/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
      }
      
      // Delete the blog post
      await storage.deleteBlogPost(id);
      
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting blog post:', error);
      res.status(500).json({ message: 'Failed to delete blog post' });
    }
  });

  // Analytics API routes - Admin
  app.get('/api/admin/analytics/daily', requireAdmin, async (req, res) => {
    try {
      const date = req.query.date ? new Date(req.query.date as string) : new Date();
      
      if (isNaN(date.getTime())) {
        return res.status(400).json({ message: 'Invalid date format' });
      }
      
      const metrics = await storage.getDailyMetrics(date);
      res.json(metrics || { message: 'No metrics available for this date' });
    } catch (error) {
      console.error('Error fetching daily metrics:', error);
      res.status(500).json({ message: 'Failed to fetch metrics' });
    }
  });

  app.get('/api/admin/analytics/weekly', requireAdmin, async (req, res) => {
    try {
      const date = req.query.date ? new Date(req.query.date as string) : new Date();
      
      if (isNaN(date.getTime())) {
        return res.status(400).json({ message: 'Invalid date format' });
      }
      
      const metrics = await storage.getWeeklyMetrics(date);
      res.json(metrics || { message: 'No metrics available for this week' });
    } catch (error) {
      console.error('Error fetching weekly metrics:', error);
      res.status(500).json({ message: 'Failed to fetch metrics' });
    }
  });

  app.get('/api/admin/analytics/monthly', requireAdmin, async (req, res) => {
    try {
      const date = req.query.date ? new Date(req.query.date as string) : new Date();
      
      if (isNaN(date.getTime())) {
        return res.status(400).json({ message: 'Invalid date format' });
      }
      
      const metrics = await storage.getMonthlyMetrics(date);
      res.json(metrics || { message: 'No metrics available for this month' });
    } catch (error) {
      console.error('Error fetching monthly metrics:', error);
      res.status(500).json({ message: 'Failed to fetch metrics' });
    }
  });

  app.get('/api/admin/analytics/range', requireAdmin, async (req, res) => {
    try {
      const { startDate, endDate, type } = req.query;
      
      if (!startDate || !endDate || !type) {
        return res.status(400).json({ 
          message: 'Start date, end date, and metrics type are required' 
        });
      }
      
      const start = new Date(startDate as string);
      const end = new Date(endDate as string);
      const metricsType = type as AnalyticsMetricsType;
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({ message: 'Invalid date format' });
      }
      
      if (!Object.values(AnalyticsMetricsType).includes(metricsType)) {
        return res.status(400).json({ 
          message: 'Invalid metrics type. Must be daily, weekly, or monthly'
        });
      }
      
      const metrics = await storage.getAnalyticsData(start, end, metricsType);
      res.json(metrics);
    } catch (error) {
      console.error('Error fetching analytics range:', error);
      res.status(500).json({ message: 'Failed to fetch analytics' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
