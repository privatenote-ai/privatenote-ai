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
    notesFailedToView: 0,
    notesDestroyedOnView: 0,
    wrongPasswordAttempts: 0,
    accountSignups: 0,
    accountLogins: 0,
    qrSharesGenerated: 0,
    localAiUsed: 0,
    cloudAiUsed: 0,
    countryDistribution: {},
    languageDistribution: {},
    notesWithFileAttachment: 0,
    fileSizeBucketDistribution: {
      under5mb: 0,
      from5to15mb: 0,
      from15to25mb: 0,
      over25mb: 0,
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
    countryDistribution: metrics.countryDistribution || {},
    languageDistribution: metrics.languageDistribution || {},
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
    notesWithFileAttachment: metrics.notesWithFileAttachment ?? 0,
    fileSizeBucketDistribution: {
      ...base.fileSizeBucketDistribution!,
      ...(metrics.fileSizeBucketDistribution || {}),
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
    countryDistribution: { ...(base.countryDistribution || {}) },
    languageDistribution: { ...(base.languageDistribution || {}) },
    notesFailedToView: base.notesFailedToView + add.notesFailedToView,
    notesDestroyedOnView: base.notesDestroyedOnView + add.notesDestroyedOnView,
    wrongPasswordAttempts: base.wrongPasswordAttempts + add.wrongPasswordAttempts,
    accountSignups: base.accountSignups + add.accountSignups,
    accountLogins: base.accountLogins + add.accountLogins,
    qrSharesGenerated: base.qrSharesGenerated + add.qrSharesGenerated,
    localAiUsed: base.localAiUsed + add.localAiUsed,
    cloudAiUsed: base.cloudAiUsed + add.cloudAiUsed,
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
    notesWithFileAttachment: (base.notesWithFileAttachment ?? 0) + (add.notesWithFileAttachment ?? 0),
    fileSizeBucketDistribution: {
      under5mb: (base.fileSizeBucketDistribution?.under5mb ?? 0) + (add.fileSizeBucketDistribution?.under5mb ?? 0),
      from5to15mb: (base.fileSizeBucketDistribution?.from5to15mb ?? 0) + (add.fileSizeBucketDistribution?.from5to15mb ?? 0),
      from15to25mb: (base.fileSizeBucketDistribution?.from15to25mb ?? 0) + (add.fileSizeBucketDistribution?.from15to25mb ?? 0),
      over25mb: (base.fileSizeBucketDistribution?.over25mb ?? 0) + (add.fileSizeBucketDistribution?.over25mb ?? 0),
    },
  };

  for (const [slug, views] of Object.entries(add.blogViews)) {
    merged.blogViews[slug] = (merged.blogViews[slug] || 0) + views;
  }
  for (const [ref, count] of Object.entries(add.referrerCounts || {})) {
    merged.referrerCounts[ref] = (merged.referrerCounts[ref] || 0) + count;
  }
  for (const [country, count] of Object.entries(add.countryDistribution || {})) {
    merged.countryDistribution[country] = (merged.countryDistribution[country] || 0) + count;
  }
  for (const [lang, count] of Object.entries(add.languageDistribution || {})) {
    merged.languageDistribution[lang] = (merged.languageDistribution[lang] || 0) + count;
  }

  return merged;
}
