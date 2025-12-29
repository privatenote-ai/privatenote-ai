import { sqliteTable, text, integer, blob } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: integer("is_admin", { mode: "boolean" }).default(false),
});

export const notes = sqliteTable("notes", {
  id: text("id").primaryKey(),
  content: text("content").notNull(),
  iv: text("iv").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  maxReads: integer("max_reads").default(1),
  currentReads: integer("current_reads").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  // Password protection fields
  isPasswordProtected: integer("is_password_protected", { mode: "boolean" }).default(false),
  encryptedKey: text("encrypted_key"), // The encrypted version of the actual encryption key
  encryptedKeyIv: text("encrypted_key_iv"), // IV used to encrypt the key
  salt: text("salt"), // Salt used for password derivation
});

export const blogPosts = sqliteTable("blog_posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  coverImage: text("cover_image"),
  author: text("author").notNull(),
  published: integer("published", { mode: "boolean" }).default(false),
  publishedAt: integer("published_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  tags: text("tags"), // Store as JSON string in SQLite
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertNoteSchema = createInsertSchema(notes).omit({
  id: true,
  createdAt: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  publishedAt: true,
});

export const updateBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertNote = z.infer<typeof insertNoteSchema>;
export type Note = typeof notes.$inferSelect;

export const analyticsData = sqliteTable("analytics_data", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull().$defaultFn(() => new Date().toISOString().split('T')[0]),
  metricsType: text("metrics_type").notNull(),
  metrics: text("metrics").notNull(), // Store as JSON string in SQLite
});

// Analytics types
export enum AnalyticsMetricsType {
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly"
}

export interface DailyMetrics {
  notesCreated: number;
  notesViewed: number;
  passwordProtectedNotes: number;
  aiEnhancedNotes: number;
  blogViews: Record<string, number>; // slug -> views
  averageExpirationDays: number;
  viewLimitsDistribution: {
    once: number;
    twice: number;
    threeToFive: number;
    moreThanFive: number;
    unlimited: number;
  };
  contentLengthDistribution: {
    short: number;  // < 100 chars
    medium: number; // 100-1000 chars
    long: number;   // > 1000 chars
  };
}

export const insertAnalyticsSchema = createInsertSchema(analyticsData).omit({
  id: true,
});

export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type AnalyticsData = typeof analyticsData.$inferSelect;

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type UpdateBlogPost = z.infer<typeof updateBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
