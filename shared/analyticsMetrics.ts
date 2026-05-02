import type { DailyMetrics } from "./schema";

/** UTC calendar day as YYYY-MM-DD (matches KV keys `analytics:daily:`). */
export function getAnalyticsDateKeyUtc(date: Date): string {
  return date.toISOString().split("T")[0] || "";
}

export function createEmptyDailyMetrics(): DailyMetrics {
  return {
    notesCreated: 0,
    notesViewed: 0,
    passwordProtectedNotes: 0,
    aiEnhancedNotes: 0,
    blogViews: {},
    referrerCounts: {},
    averageExpirationDays: 0,
    expiryRangeDistribution: {
      oneHourOrLess: 0,
      oneDayOrLess: 0,
      oneWeekOrLess: 0,
      moreThanWeek: 0,
    },
    viewLimitsDistribution: {
      once: 0,
      twice: 0,
      threeToFive: 0,
      moreThanFive: 0,
      unlimited: 0,
    },
    contentLengthDistribution: {
      short: 0,
      medium: 0,
      long: 0,
    },
  };
}

export function normalizeDailyMetrics(metrics?: DailyMetrics | null): DailyMetrics {
  const base = createEmptyDailyMetrics();
  if (!metrics) {
    return base;
  }
  return {
    ...base,
    ...metrics,
    blogViews: metrics.blogViews || {},
    referrerCounts: metrics.referrerCounts || {},
    expiryRangeDistribution: {
      ...base.expiryRangeDistribution,
      ...(metrics.expiryRangeDistribution || {}),
    },
    viewLimitsDistribution: {
      ...base.viewLimitsDistribution,
      ...(metrics.viewLimitsDistribution || {}),
    },
    contentLengthDistribution: {
      ...base.contentLengthDistribution,
      ...(metrics.contentLengthDistribution || {}),
    },
  };
}

export function mergeDailyMetrics(baseMetrics: DailyMetrics, addMetrics: DailyMetrics): DailyMetrics {
  const base = normalizeDailyMetrics(baseMetrics);
  const add = normalizeDailyMetrics(addMetrics);
  const totalNotes = base.notesCreated + add.notesCreated;
  const totalExpirationDays =
    base.averageExpirationDays * base.notesCreated + add.averageExpirationDays * add.notesCreated;

  const merged: DailyMetrics = {
    ...base,
    notesCreated: totalNotes,
    notesViewed: base.notesViewed + add.notesViewed,
    passwordProtectedNotes: base.passwordProtectedNotes + add.passwordProtectedNotes,
    aiEnhancedNotes: base.aiEnhancedNotes + add.aiEnhancedNotes,
    averageExpirationDays: totalNotes > 0 ? totalExpirationDays / totalNotes : 0,
    blogViews: { ...base.blogViews },
    referrerCounts: { ...(base.referrerCounts || {}) },
    expiryRangeDistribution: {
      oneHourOrLess: base.expiryRangeDistribution.oneHourOrLess + add.expiryRangeDistribution.oneHourOrLess,
      oneDayOrLess: base.expiryRangeDistribution.oneDayOrLess + add.expiryRangeDistribution.oneDayOrLess,
      oneWeekOrLess: base.expiryRangeDistribution.oneWeekOrLess + add.expiryRangeDistribution.oneWeekOrLess,
      moreThanWeek: base.expiryRangeDistribution.moreThanWeek + add.expiryRangeDistribution.moreThanWeek,
    },
    viewLimitsDistribution: {
      once: base.viewLimitsDistribution.once + add.viewLimitsDistribution.once,
      twice: base.viewLimitsDistribution.twice + add.viewLimitsDistribution.twice,
      threeToFive: base.viewLimitsDistribution.threeToFive + add.viewLimitsDistribution.threeToFive,
      moreThanFive: base.viewLimitsDistribution.moreThanFive + add.viewLimitsDistribution.moreThanFive,
      unlimited: base.viewLimitsDistribution.unlimited + add.viewLimitsDistribution.unlimited,
    },
    contentLengthDistribution: {
      short: base.contentLengthDistribution.short + add.contentLengthDistribution.short,
      medium: base.contentLengthDistribution.medium + add.contentLengthDistribution.medium,
      long: base.contentLengthDistribution.long + add.contentLengthDistribution.long,
    },
  };

  for (const [slug, views] of Object.entries(add.blogViews)) {
    merged.blogViews[slug] = (merged.blogViews[slug] || 0) + views;
  }

  for (const [ref, count] of Object.entries(add.referrerCounts || {})) {
    merged.referrerCounts[ref] = (merged.referrerCounts[ref] || 0) + count;
  }

  return merged;
}
