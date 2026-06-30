import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
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
  aad: text("aad"),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  maxReads: integer("max_reads").default(1),
  currentReads: integer("current_reads").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  // Password protection fields
  isPasswordProtected: integer("is_password_protected", { mode: "boolean" }).default(false),
  encryptedKey: text("encrypted_key"), // The encrypted version of the actual encryption key
  encryptedKeyIv: text("encrypted_key_iv"), // IV used to encrypt the key
  salt: text("salt"), // Salt used for password derivation
  kdfVersion: integer("kdf_version"),
  kdfIterations: integer("kdf_iterations"),
  // KDF policy/profile tag (e.g. "argon2id-m65536-p1"), not a hash algorithm identifier.
  kdfPolicyTag: text("kdf_policy_tag"),
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
  referrerCounts: Record<string, number>; // sanitized referrer name -> note count
  averageExpirationDays: number;
  expiryRangeDistribution: {
    oneHourOrLess: number;
    oneDayOrLess: number;
    oneWeekOrLess: number;
    moreThanWeek: number;
  };
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

  // --- Engagement & funnel ---
  /** Reveal attempts that returned 404 (note expired, exhausted, or never existed). */
  notesFailedToView: number;
  /** Notes consumed on their final allowed read (max-reads reached or view-once). */
  notesDestroyedOnView: number;
  /** Wrong-password decryption failures reported by the client. */
  wrongPasswordAttempts: number;

  // --- Accounts ---
  /** New account registrations (magic-link first-consume or passkey register). */
  accountSignups: number;
  /** Successful logins (all auth methods combined). */
  accountLogins: number;

  // --- Feature adoption ---
  /** QR code share events reported by the client. */
  qrSharesGenerated: number;
  /** Notes enhanced with the local (on-device) AI. */
  localAiUsed: number;
  /** Notes enhanced with the hosted cloud AI. */
  cloudAiUsed: number;

  // --- Geo & language ---
  /** ISO 3166-1 alpha-2 country code → note-creation count (from CF-IPCountry). */
  countryDistribution: Record<string, number>;
  /** UI language active at note-creation time → count. */
  languageDistribution: Record<string, number>;

  // --- File attachments ---
  /** Notes created that included an encrypted file attachment. */
  notesWithFileAttachment?: number;
  /**
   * Coarse plaintext file-size buckets (no exact sizes stored).
   * Buckets match the free-tier limit (25 MB) for easy capacity analysis.
   */
  fileSizeBucketDistribution?: {
    under5mb: number;    // < 5 MB
    from5to15mb: number; // 5 MB – 14.99 MB
    from15to25mb: number; // 15 MB – 24.99 MB
    over25mb: number;    // ≥ 25 MB (premium)
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
