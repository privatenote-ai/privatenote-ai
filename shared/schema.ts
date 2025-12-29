import { pgTable, text, serial, integer, boolean, timestamp, jsonb, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false),
});

export const notes = pgTable("notes", {
  id: text("id").primaryKey(),
  content: text("content").notNull(),
  iv: text("iv").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  maxReads: integer("max_reads").default(1),
  currentReads: integer("current_reads").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  // Password protection fields
  isPasswordProtected: boolean("is_password_protected").default(false),
  encryptedKey: text("encrypted_key"), // The encrypted version of the actual encryption key
  encryptedKeyIv: text("encrypted_key_iv"), // IV used to encrypt the key
  salt: text("salt"), // Salt used for password derivation
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  coverImage: text("cover_image"),
  author: text("author").notNull(),
  published: boolean("published").default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  tags: text("tags").array(),
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

export const analyticsData = pgTable("analytics_data", {
  id: serial("id").primaryKey(),
  date: date("date").notNull().defaultNow(),
  metricsType: text("metrics_type").notNull(),
  metrics: jsonb("metrics").notNull(),
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
