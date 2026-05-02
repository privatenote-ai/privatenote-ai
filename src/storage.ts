import {
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
  AnalyticsMetricsType,
} from "@shared/schema";
import {
  createEmptyDailyMetrics,
  getAnalyticsDateKeyUtc,
  mergeDailyMetrics,
  normalizeDailyMetrics,
} from "@shared/analyticsMetrics";
import { KVNoteStorage } from "./kv-storage";
import type { KVNamespace } from "@cloudflare/workers-types";

interface AnalyticsContext {
  aiEnhanced?: boolean;
  referrer?: string | null;
}

const ANALYTICS_DAILY_PREFIX = "analytics:daily:";

export type AggregatedAnalyticsResult = {
  metrics: DailyMetrics;
  startDateUtc: string;
  endDateUtc: string;
};

// Storage interface
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
  trackNoteCreation(note: Note, context?: AnalyticsContext): Promise<void>;
  trackNoteView(note: Note): Promise<void>;
  trackBlogView(slug: string): Promise<void>;
  getAnalyticsData(startDate: Date, endDate: Date, metricsType: AnalyticsMetricsType): Promise<AnalyticsData[]>;
  getAggregatedDailyMetrics(startDate: Date, endDate: Date): Promise<AggregatedAnalyticsResult>;
}

// MemStorage for blog posts and analytics (without note methods)
class MemStorage {
  private users: Map<number, User>;
  private blogPosts: Map<number, BlogPost>;
  private analytics: Map<string, AnalyticsData>; // key: `${metricType}_${dateString}`
  private dailyMetrics: Map<string, DailyMetrics>; // key: ISO date string
  private currentAnalyticsId: number;
  currentId: number;
  currentBlogId: number;

  constructor() {
    this.users = new Map();
    this.blogPosts = new Map();
    this.analytics = new Map();
    this.dailyMetrics = new Map();
    this.currentId = 1;
    this.currentBlogId = 1;
    this.currentAnalyticsId = 1;
    
    // Initialize today's metrics with an empty object
    const today = new Date();
    const todayKey = getAnalyticsDateKeyUtc(today);
    this.dailyMetrics.set(todayKey, createEmptyDailyMetrics());
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

    let tagsSerialized: string | null = null;
    const rawTags = postData.tags;
    if (typeof rawTags === "string" && rawTags.length > 0) {
      tagsSerialized = rawTags;
    } else if (Array.isArray(rawTags)) {
      tagsSerialized = JSON.stringify(rawTags);
    }

    const post: BlogPost = {
      id,
      title: postData.title,
      slug: postData.slug,
      content: postData.content,
      excerpt: postData.excerpt,
      author: postData.author,
      coverImage: postData.coverImage || null,
      tags: tagsSerialized,
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

    let nextTags: string | null = post.tags;
    if (postData.tags !== undefined) {
      const t = postData.tags;
      if (t == null || t === "") {
        nextTags = null;
      } else if (typeof t === "string") {
        nextTags = t;
      } else if (Array.isArray(t)) {
        nextTags = JSON.stringify(t);
      }
    }

    const updatedPost = {
      ...post,
      ...postData,
      tags: nextTags,
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

  private getOrCreateDailyMetrics(date: Date): DailyMetrics {
    const dateKey = getAnalyticsDateKeyUtc(date);
    if (!this.dailyMetrics.has(dateKey)) {
      this.dailyMetrics.set(dateKey, createEmptyDailyMetrics());
    }
    return this.dailyMetrics.get(dateKey)!;
  }

  // Analytics methods
  async getDailyMetrics(date: Date): Promise<AnalyticsData | undefined> {
    const dateKey = getAnalyticsDateKeyUtc(date);
    const analyticsKey = `${AnalyticsMetricsType.DAILY}_${dateKey}`;
    return this.analytics.get(analyticsKey) || undefined;
  }

  async getWeeklyMetrics(date: Date): Promise<AnalyticsData | undefined> {
    const dateKey = getAnalyticsDateKeyUtc(date);
    const analyticsKey = `${AnalyticsMetricsType.WEEKLY}_${dateKey}`;
    return this.analytics.get(analyticsKey) || undefined;
  }

  async getMonthlyMetrics(date: Date): Promise<AnalyticsData | undefined> {
    const dateKey = getAnalyticsDateKeyUtc(date);
    const analyticsKey = `${AnalyticsMetricsType.MONTHLY}_${dateKey}`;
    return this.analytics.get(analyticsKey) || undefined;
  }

  async saveMetrics(metricsData: InsertAnalytics): Promise<AnalyticsData> {
    const id = this.currentAnalyticsId++;
    const metricDate = metricsData.date ? new Date(metricsData.date) : new Date();
    const dateKey = getAnalyticsDateKeyUtc(metricDate);

    // Handle metrics - convert object to JSON string if needed
    const metricsValue = typeof metricsData.metrics === 'string' 
      ? metricsData.metrics 
      : JSON.stringify(metricsData.metrics);
    
    const metrics: AnalyticsData = {
      id,
      date: dateKey,
      metricsType: metricsData.metricsType || AnalyticsMetricsType.DAILY,
      metrics: metricsValue
    };
    
    const analyticsKey = `${metrics.metricsType}_${dateKey}`;
    this.analytics.set(analyticsKey, metrics);
    return metrics;
  }

  async trackNoteCreation(note: Note, context?: AnalyticsContext): Promise<void> {
    const today = new Date();
    const metrics = this.getOrCreateDailyMetrics(today);
    
    // Increment note creation count
    metrics.notesCreated++;
    
    // Track password protection
    if (note.isPasswordProtected) {
      metrics.passwordProtectedNotes++;
    }

    if (context?.aiEnhanced) {
      metrics.aiEnhancedNotes++;
    }

    if (context?.referrer) {
      if (!metrics.referrerCounts) metrics.referrerCounts = {};
      metrics.referrerCounts[context.referrer] =
        (metrics.referrerCounts[context.referrer] ?? 0) + 1;
    }
    
    // Track expiration days
    const expirationDate = new Date(note.expiresAt);
    const expirationDays = Math.ceil((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    // Recalculate average expiration days
    const totalExpirationDays = metrics.averageExpirationDays * (metrics.notesCreated - 1) + expirationDays;
    metrics.averageExpirationDays = totalExpirationDays / metrics.notesCreated;

    const expirySeconds = Math.max(0, Math.floor((expirationDate.getTime() - today.getTime()) / 1000));
    if (expirySeconds <= 60 * 60) {
      metrics.expiryRangeDistribution.oneHourOrLess++;
    } else if (expirySeconds <= 24 * 60 * 60) {
      metrics.expiryRangeDistribution.oneDayOrLess++;
    } else if (expirySeconds <= 7 * 24 * 60 * 60) {
      metrics.expiryRangeDistribution.oneWeekOrLess++;
    } else {
      metrics.expiryRangeDistribution.moreThanWeek++;
    }
    
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
    const dateKey = getAnalyticsDateKeyUtc(date);
    const metrics = this.dailyMetrics.get(dateKey);
    
    if (metrics) {
      await this.saveMetrics({
        date: getAnalyticsDateKeyUtc(date),
        metricsType: AnalyticsMetricsType.DAILY,
        metrics: JSON.stringify(metrics),
      });
    }
  }

  async trackNoteView(_note: Note): Promise<void> {
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

  async getAggregatedDailyMetrics(start: Date, end: Date): Promise<AggregatedAnalyticsResult> {
    return {
      metrics: createEmptyDailyMetrics(),
      startDateUtc: getAnalyticsDateKeyUtc(start),
      endDateUtc: getAnalyticsDateKeyUtc(end),
    };
  }
}

function addDaysUtc(date: Date, days: number): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + days));
}

class KVAnalyticsStorage {
  constructor(private kv: KVNamespace) {}

  private getDailyKey(date: Date): string {
    return `${ANALYTICS_DAILY_PREFIX}${getAnalyticsDateKeyUtc(date)}`;
  }

  private async loadDailyMetrics(date: Date): Promise<DailyMetrics | null> {
    const key = this.getDailyKey(date);
    const stored = await this.kv.get<DailyMetrics>(key, { type: "json" });
    return stored ? normalizeDailyMetrics(stored) : null;
  }

  private async saveDailyMetrics(date: Date, metrics: DailyMetrics): Promise<void> {
    const key = this.getDailyKey(date);
    await this.kv.put(key, JSON.stringify(metrics));
  }

  private buildAnalyticsData(date: Date, metricsType: AnalyticsMetricsType, metrics: DailyMetrics): AnalyticsData {
    return {
      id: 0,
      date: getAnalyticsDateKeyUtc(date),
      metricsType,
      metrics: JSON.stringify(metrics),
    };
  }

  private async aggregateRange(startDate: Date, endDate: Date): Promise<DailyMetrics | null> {
    let cursor = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate()));
    const end = new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate()));
    let aggregated: DailyMetrics | null = null;

    while (cursor <= end) {
      const daily = await this.loadDailyMetrics(cursor);
      if (daily) {
        aggregated = aggregated ? mergeDailyMetrics(aggregated, daily) : normalizeDailyMetrics(daily);
      }
      cursor = addDaysUtc(cursor, 1);
    }

    return aggregated;
  }

  async getDailyMetrics(date: Date): Promise<AnalyticsData | undefined> {
    const metrics = await this.loadDailyMetrics(date);
    if (!metrics) {
      return undefined;
    }
    return this.buildAnalyticsData(date, AnalyticsMetricsType.DAILY, metrics);
  }

  async getWeeklyMetrics(date: Date): Promise<AnalyticsData | undefined> {
    const endDate = new Date(date);
    const startDate = addDaysUtc(endDate, -6);
    const metrics = await this.aggregateRange(startDate, endDate);
    if (!metrics) {
      return undefined;
    }
    return this.buildAnalyticsData(endDate, AnalyticsMetricsType.WEEKLY, metrics);
  }

  async getMonthlyMetrics(date: Date): Promise<AnalyticsData | undefined> {
    const startDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
    const metrics = await this.aggregateRange(startDate, date);
    if (!metrics) {
      return undefined;
    }
    return this.buildAnalyticsData(date, AnalyticsMetricsType.MONTHLY, metrics);
  }

  async saveMetrics(metricsData: InsertAnalytics): Promise<AnalyticsData> {
    const metricDate = metricsData.date ? new Date(metricsData.date) : new Date();
    let metricsValue: DailyMetrics | null = null;

    if (typeof metricsData.metrics === "string") {
      try {
        metricsValue = JSON.parse(metricsData.metrics) as DailyMetrics;
      } catch {
        metricsValue = null;
      }
    } else if (metricsData.metrics) {
      metricsValue = metricsData.metrics as DailyMetrics;
    }

    const normalized = normalizeDailyMetrics(metricsValue);
    await this.saveDailyMetrics(metricDate, normalized);
    return this.buildAnalyticsData(metricDate, AnalyticsMetricsType.DAILY, normalized);
  }

  async trackNoteCreation(note: Note, context?: AnalyticsContext): Promise<void> {
    const today = new Date();
    const metrics = normalizeDailyMetrics(await this.loadDailyMetrics(today));

    metrics.notesCreated++;
    if (note.isPasswordProtected) {
      metrics.passwordProtectedNotes++;
    }
    if (context?.aiEnhanced) {
      metrics.aiEnhancedNotes++;
    }

    if (context?.referrer) {
      if (!metrics.referrerCounts) metrics.referrerCounts = {};
      metrics.referrerCounts[context.referrer] =
        (metrics.referrerCounts[context.referrer] ?? 0) + 1;
    }

    const expirationDate = new Date(note.expiresAt);
    const expirationDays = Math.ceil((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const totalExpirationDays = metrics.averageExpirationDays * (metrics.notesCreated - 1) + expirationDays;
    metrics.averageExpirationDays = metrics.notesCreated > 0
      ? totalExpirationDays / metrics.notesCreated
      : 0;

    const expirySeconds = Math.max(0, Math.floor((expirationDate.getTime() - today.getTime()) / 1000));
    if (expirySeconds <= 60 * 60) {
      metrics.expiryRangeDistribution.oneHourOrLess++;
    } else if (expirySeconds <= 24 * 60 * 60) {
      metrics.expiryRangeDistribution.oneDayOrLess++;
    } else if (expirySeconds <= 7 * 24 * 60 * 60) {
      metrics.expiryRangeDistribution.oneWeekOrLess++;
    } else {
      metrics.expiryRangeDistribution.moreThanWeek++;
    }

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

    const contentLength = note.content.length;
    if (contentLength < 100) {
      metrics.contentLengthDistribution.short++;
    } else if (contentLength >= 100 && contentLength <= 1000) {
      metrics.contentLengthDistribution.medium++;
    } else {
      metrics.contentLengthDistribution.long++;
    }

    await this.saveDailyMetrics(today, metrics);
  }

  async trackNoteView(_note: Note): Promise<void> {
    const today = new Date();
    const metrics = normalizeDailyMetrics(await this.loadDailyMetrics(today));
    metrics.notesViewed++;
    await this.saveDailyMetrics(today, metrics);
  }

  async trackBlogView(slug: string): Promise<void> {
    const today = new Date();
    const metrics = normalizeDailyMetrics(await this.loadDailyMetrics(today));
    metrics.blogViews[slug] = (metrics.blogViews[slug] || 0) + 1;
    await this.saveDailyMetrics(today, metrics);
  }

  async getAnalyticsData(startDate: Date, endDate: Date, metricsType: AnalyticsMetricsType): Promise<AnalyticsData[]> {
    if (metricsType !== AnalyticsMetricsType.DAILY) {
      return [];
    }
    let cursor = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate()));
    const end = new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate()));
    const results: AnalyticsData[] = [];

    while (cursor <= end) {
      const metrics = await this.loadDailyMetrics(cursor);
      if (metrics) {
        results.push(this.buildAnalyticsData(cursor, AnalyticsMetricsType.DAILY, metrics));
      }
      cursor = addDaysUtc(cursor, 1);
    }

    return results;
  }

  async getAggregatedDailyMetrics(startDate: Date, endDate: Date): Promise<AggregatedAnalyticsResult> {
    const a = new Date(
      Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate()),
    );
    const b = new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate()));
    const start = a <= b ? a : b;
    const end = a <= b ? b : a;
    const merged = await this.aggregateRange(start, end);
    return {
      metrics: merged ?? createEmptyDailyMetrics(),
      startDateUtc: getAnalyticsDateKeyUtc(start),
      endDateUtc: getAnalyticsDateKeyUtc(end),
    };
  }
}

// Generate random ID using Web Crypto API (available in Workers)
function generateNoteId(): string {
  const array = new Uint8Array(8);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Composite storage that uses KV for notes and MemStorage for everything else
export class CompositeStorage implements IStorage {
  private kvNoteStorage: KVNoteStorage;
  private memStorage: MemStorage;
  private analyticsStorage: KVAnalyticsStorage;

  constructor(notesKv: KVNamespace, analyticsKv?: KVNamespace) {
    this.kvNoteStorage = new KVNoteStorage(notesKv);
    this.memStorage = new MemStorage();
    this.analyticsStorage = new KVAnalyticsStorage(analyticsKv || notesKv);
  }

  // User methods - delegate to MemStorage
  async getUser(id: number): Promise<User | undefined> {
    return this.memStorage.getUser(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.memStorage.getUserByUsername(username);
  }

  async createUser(user: InsertUser): Promise<User> {
    return this.memStorage.createUser(user);
  }

  // Note methods - delegate to KVNoteStorage
  async getNoteById(id: string): Promise<Note | undefined> {
    return this.kvNoteStorage.getNoteById(id);
  }

  async createNote(note: Omit<InsertNote, "id">): Promise<Note> {
    const id = generateNoteId();
    return this.kvNoteStorage.createNote(note, id);
  }

  async updateNoteReadCount(id: string): Promise<Note | undefined> {
    return this.kvNoteStorage.updateNoteReadCount(id);
  }

  async deleteNote(id: string): Promise<void> {
    return this.kvNoteStorage.deleteNote(id);
  }

  // Blog methods - delegate to MemStorage
  async getBlogPosts(includeUnpublished?: boolean): Promise<BlogPost[]> {
    return this.memStorage.getBlogPosts(includeUnpublished);
  }

  async getBlogPostById(id: number): Promise<BlogPost | undefined> {
    return this.memStorage.getBlogPostById(id);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return this.memStorage.getBlogPostBySlug(slug);
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    return this.memStorage.createBlogPost(post);
  }

  async updateBlogPost(id: number, post: Partial<UpdateBlogPost>): Promise<BlogPost | undefined> {
    return this.memStorage.updateBlogPost(id, post);
  }

  async publishBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.memStorage.publishBlogPost(id);
  }

  async unpublishBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.memStorage.unpublishBlogPost(id);
  }

  async deleteBlogPost(id: number): Promise<void> {
    return this.memStorage.deleteBlogPost(id);
  }

  // Analytics methods - delegate to MemStorage
  async getDailyMetrics(date: Date): Promise<AnalyticsData | undefined> {
    return this.analyticsStorage.getDailyMetrics(date);
  }

  async getWeeklyMetrics(date: Date): Promise<AnalyticsData | undefined> {
    return this.analyticsStorage.getWeeklyMetrics(date);
  }

  async getMonthlyMetrics(date: Date): Promise<AnalyticsData | undefined> {
    return this.analyticsStorage.getMonthlyMetrics(date);
  }

  async saveMetrics(metrics: InsertAnalytics): Promise<AnalyticsData> {
    return this.analyticsStorage.saveMetrics(metrics);
  }

  async trackNoteCreation(note: Note, context?: AnalyticsContext): Promise<void> {
    return this.analyticsStorage.trackNoteCreation(note, context);
  }

  async trackNoteView(note: Note): Promise<void> {
    return this.analyticsStorage.trackNoteView(note);
  }

  async trackBlogView(slug: string): Promise<void> {
    return this.analyticsStorage.trackBlogView(slug);
  }

  async getAnalyticsData(startDate: Date, endDate: Date, metricsType: AnalyticsMetricsType): Promise<AnalyticsData[]> {
    return this.analyticsStorage.getAnalyticsData(startDate, endDate, metricsType);
  }

  async getAggregatedDailyMetrics(startDate: Date, endDate: Date): Promise<AggregatedAnalyticsResult> {
    return this.analyticsStorage.getAggregatedDailyMetrics(startDate, endDate);
  }
}
