import { 
  users, 
  notes, 
  blogPosts, 
  analyticsData,
  type User, 
  type InsertUser, 
  type Note, 
  type InsertNote, 
  type BlogPost, 
  type InsertBlogPost, 
  type UpdateBlogPost,
  type AnalyticsData,
  type InsertAnalytics,
  type DailyMetrics,
  AnalyticsMetricsType
} from "@shared/schema";
import { randomBytes } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Note methods
  getNoteById(id: string): Promise<Note | undefined>;
  createNote(note: Omit<InsertNote, "id">): Promise<Note>;
  updateNoteReadCount(id: string): Promise<Note | undefined>;
  deleteNote(id: string): Promise<void>;
  
  // Blog methods
  getBlogPosts(includeUnpublished?: boolean): Promise<BlogPost[]>;
  getBlogPostById(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<UpdateBlogPost>): Promise<BlogPost | undefined>;
  publishBlogPost(id: number): Promise<BlogPost | undefined>;
  unpublishBlogPost(id: number): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<void>;
  
  // Analytics methods
  getDailyMetrics(date: Date): Promise<AnalyticsData | undefined>;
  getWeeklyMetrics(date: Date): Promise<AnalyticsData | undefined>;
  getMonthlyMetrics(date: Date): Promise<AnalyticsData | undefined>;
  saveMetrics(metrics: InsertAnalytics): Promise<AnalyticsData>;
  trackNoteCreation(note: Note): Promise<void>;
  trackNoteView(note: Note): Promise<void>;
  trackBlogView(slug: string): Promise<void>;
  getAnalyticsData(startDate: Date, endDate: Date, metricsType: AnalyticsMetricsType): Promise<AnalyticsData[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private notes: Map<string, Note>;
  private blogPosts: Map<number, BlogPost>;
  private analytics: Map<string, AnalyticsData>; // key: `${metricType}_${dateString}`
  private dailyMetrics: Map<string, DailyMetrics>; // key: ISO date string
  private currentAnalyticsId: number;
  currentId: number;
  currentBlogId: number;

  constructor() {
    this.users = new Map();
    this.notes = new Map();
    this.blogPosts = new Map();
    this.analytics = new Map();
    this.dailyMetrics = new Map();
    this.currentId = 1;
    this.currentBlogId = 1;
    this.currentAnalyticsId = 1;
    
    // Initialize today's metrics with an empty object
    // We'll populate it after constructor
    const today = new Date();
    const todayKey = today.toISOString().split('T')[0];
    this.dailyMetrics.set(todayKey, {
      notesCreated: 0,
      notesViewed: 0,
      passwordProtectedNotes: 0,
      aiEnhancedNotes: 0,
      blogViews: {},
      averageExpirationDays: 0,
      viewLimitsDistribution: {
        once: 0,
        twice: 0,
        threeToFive: 0,
        moreThanFive: 0,
        unlimited: 0
      },
      contentLengthDistribution: {
        short: 0,
        medium: 0,
        long: 0
      }
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id,
      isAdmin: false 
    };
    this.users.set(id, user);
    return user;
  }
  
  // Note methods
  async getNoteById(id: string): Promise<Note | undefined> {
    return this.notes.get(id);
  }
  
  async createNote(noteData: Omit<InsertNote, "id">): Promise<Note> {
    // Generate a unique ID for the note using hex encoding
    const id = randomBytes(8).toString('hex');
    
    const note: Note = {
      id,
      content: noteData.content,
      iv: noteData.iv,
      expiresAt: noteData.expiresAt,
      maxReads: noteData.maxReads || 1,
      currentReads: 0,
      createdAt: new Date(),
      // Password protection fields
      isPasswordProtected: noteData.isPasswordProtected || false,
      encryptedKey: noteData.encryptedKey || null,
      encryptedKeyIv: noteData.encryptedKeyIv || null,
      salt: noteData.salt || null
    };
    
    this.notes.set(id, note);
    return note;
  }
  
  async updateNoteReadCount(id: string): Promise<Note | undefined> {
    const note = this.notes.get(id);
    if (!note) return undefined;
    
    // Increment the read count
    note.currentReads = (note.currentReads || 0) + 1;
    
    // Update the note in the map
    this.notes.set(id, note);
    
    return note;
  }
  
  async deleteNote(id: string): Promise<void> {
    this.notes.delete(id);
  }

  // Blog methods
  async getBlogPosts(includeUnpublished: boolean = false): Promise<BlogPost[]> {
    const posts = Array.from(this.blogPosts.values());
    if (includeUnpublished) {
      return posts;
    }
    return posts.filter(post => post.published);
  }

  async getBlogPostById(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(
      (post) => post.slug === slug
    );
  }

  async createBlogPost(postData: InsertBlogPost): Promise<BlogPost> {
    const id = this.currentBlogId++;
    
    const post: BlogPost = {
      id,
      title: postData.title,
      slug: postData.slug,
      content: postData.content,
      excerpt: postData.excerpt,
      author: postData.author,
      coverImage: postData.coverImage || null,
      tags: postData.tags || [],
      published: postData.published || false,
      publishedAt: postData.published ? new Date() : null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.blogPosts.set(id, post);
    return post;
  }

  async updateBlogPost(id: number, postData: Partial<UpdateBlogPost>): Promise<BlogPost | undefined> {
    const post = this.blogPosts.get(id);
    if (!post) return undefined;
    
    const updatedPost = {
      ...post,
      ...postData,
      updatedAt: new Date()
    };
    
    this.blogPosts.set(id, updatedPost);
    return updatedPost;
  }

  async publishBlogPost(id: number): Promise<BlogPost | undefined> {
    const post = this.blogPosts.get(id);
    if (!post) return undefined;
    
    const publishedPost = {
      ...post,
      published: true,
      publishedAt: new Date(),
      updatedAt: new Date()
    };
    
    this.blogPosts.set(id, publishedPost);
    return publishedPost;
  }

  async unpublishBlogPost(id: number): Promise<BlogPost | undefined> {
    const post = this.blogPosts.get(id);
    if (!post) return undefined;
    
    const unpublishedPost = {
      ...post,
      published: false,
      updatedAt: new Date()
    };
    
    this.blogPosts.set(id, unpublishedPost);
    return unpublishedPost;
  }

  async deleteBlogPost(id: number): Promise<void> {
    this.blogPosts.delete(id);
  }

  // Analytics helper methods
  private createEmptyDailyMetrics(): DailyMetrics {
    return {
      notesCreated: 0,
      notesViewed: 0,
      passwordProtectedNotes: 0,
      aiEnhancedNotes: 0,
      blogViews: {},
      averageExpirationDays: 0,
      viewLimitsDistribution: {
        once: 0,
        twice: 0,
        threeToFive: 0,
        moreThanFive: 0,
        unlimited: 0
      },
      contentLengthDistribution: {
        short: 0,
        medium: 0,
        long: 0
      }
    };
  }

  private getDateKey(date: Date): string {
    return date.toISOString().split('T')[0] || '';
  }

  private getOrCreateDailyMetrics(date: Date): DailyMetrics {
    const dateKey = this.getDateKey(date);
    if (!this.dailyMetrics.has(dateKey)) {
      this.dailyMetrics.set(dateKey, this.createEmptyDailyMetrics());
    }
    return this.dailyMetrics.get(dateKey)!;
  }

  // Analytics methods
  async getDailyMetrics(date: Date): Promise<AnalyticsData | undefined> {
    const dateKey = this.getDateKey(date);
    const analyticsKey = `${AnalyticsMetricsType.DAILY}_${dateKey}`;
    return this.analytics.get(analyticsKey) || undefined;
  }

  async getWeeklyMetrics(date: Date): Promise<AnalyticsData | undefined> {
    const dateKey = this.getDateKey(date);
    const analyticsKey = `${AnalyticsMetricsType.WEEKLY}_${dateKey}`;
    return this.analytics.get(analyticsKey) || undefined;
  }

  async getMonthlyMetrics(date: Date): Promise<AnalyticsData | undefined> {
    const dateKey = this.getDateKey(date);
    const analyticsKey = `${AnalyticsMetricsType.MONTHLY}_${dateKey}`;
    return this.analytics.get(analyticsKey) || undefined;
  }

  async saveMetrics(metricsData: InsertAnalytics): Promise<AnalyticsData> {
    const id = this.currentAnalyticsId++;
    const metricDate = metricsData.date ? new Date(metricsData.date) : new Date();
    
    const metrics: AnalyticsData = {
      id,
      date: metricDate,
      metricsType: metricsData.metricsType || AnalyticsMetricsType.DAILY,
      metrics: metricsData.metrics
    };
    
    const analyticsKey = `${metrics.metricsType}_${this.getDateKey(metricDate)}`;
    this.analytics.set(analyticsKey, metrics);
    return metrics;
  }

  async trackNoteCreation(note: Note): Promise<void> {
    const today = new Date();
    const metrics = this.getOrCreateDailyMetrics(today);
    
    // Increment note creation count
    metrics.notesCreated++;
    
    // Track password protection
    if (note.isPasswordProtected) {
      metrics.passwordProtectedNotes++;
    }
    
    // Track expiration days
    const expirationDate = new Date(note.expiresAt);
    const expirationDays = Math.ceil((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    // Recalculate average expiration days
    const totalExpirationDays = metrics.averageExpirationDays * (metrics.notesCreated - 1) + expirationDays;
    metrics.averageExpirationDays = totalExpirationDays / metrics.notesCreated;
    
    // Track view limits distribution
    const maxReads = note.maxReads || 1;
    if (maxReads === 1) {
      metrics.viewLimitsDistribution.once++;
    } else if (maxReads === 2) {
      metrics.viewLimitsDistribution.twice++;
    } else if (maxReads >= 3 && maxReads <= 5) {
      metrics.viewLimitsDistribution.threeToFive++;
    } else if (maxReads > 5) {
      metrics.viewLimitsDistribution.moreThanFive++;
    } else {
      metrics.viewLimitsDistribution.unlimited++;
    }
    
    // Track content length distribution
    const contentLength = note.content.length;
    if (contentLength < 100) {
      metrics.contentLengthDistribution.short++;
    } else if (contentLength >= 100 && contentLength <= 1000) {
      metrics.contentLengthDistribution.medium++;
    } else {
      metrics.contentLengthDistribution.long++;
    }
    
    // Save daily metrics to analytics storage
    await this.saveDailyMetrics(today);
  }
  
  private async saveDailyMetrics(date: Date): Promise<void> {
    const dateKey = this.getDateKey(date);
    const metrics = this.dailyMetrics.get(dateKey);
    
    if (metrics) {
      await this.saveMetrics({
        date,
        metricsType: AnalyticsMetricsType.DAILY,
        metrics: metrics
      });
    }
  }

  async trackNoteView(note: Note): Promise<void> {
    const today = new Date();
    const metrics = this.getOrCreateDailyMetrics(today);
    
    // Increment note view count
    metrics.notesViewed++;
    
    // Save daily metrics to analytics storage
    await this.saveDailyMetrics(today);
  }

  async trackBlogView(slug: string): Promise<void> {
    const today = new Date();
    const metrics = this.getOrCreateDailyMetrics(today);
    
    // Initialize blog view count if not exists
    if (!metrics.blogViews[slug]) {
      metrics.blogViews[slug] = 0;
    }
    
    // Increment blog view count
    metrics.blogViews[slug]++;
    
    // Save daily metrics to analytics storage
    await this.saveDailyMetrics(today);
  }

  async getAnalyticsData(startDate: Date, endDate: Date, metricsType: AnalyticsMetricsType): Promise<AnalyticsData[]> {
    return Array.from(this.analytics.values()).filter(data => {
      const dataDate = new Date(data.date);
      return data.metricsType === metricsType && 
             dataDate >= startDate && 
             dataDate <= endDate;
    });
  }
}

export const storage = new MemStorage();
