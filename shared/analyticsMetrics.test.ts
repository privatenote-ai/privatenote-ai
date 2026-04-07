import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getAnalyticsDateKeyUtc,
  mergeDailyMetrics,
  normalizeDailyMetrics,
} from "./analyticsMetrics";
import type { DailyMetrics } from "./schema";

const sampleDay = (over: Partial<DailyMetrics>): DailyMetrics =>
  normalizeDailyMetrics({
    notesCreated: 0,
    notesViewed: 0,
    passwordProtectedNotes: 0,
    aiEnhancedNotes: 0,
    blogViews: {},
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
    ...over,
  });

describe("getAnalyticsDateKeyUtc", () => {
  it("uses UTC calendar day", () => {
    const d = new Date("2026-03-25T15:00:00.000Z");
    assert.equal(getAnalyticsDateKeyUtc(d), "2026-03-25");
  });

  it("rolls UTC date near midnight boundary", () => {
    const d = new Date("2026-01-09T23:00:00.000-05:00");
    assert.equal(getAnalyticsDateKeyUtc(d), "2026-01-10");
  });
});

describe("mergeDailyMetrics", () => {
  it("sums counters and weighted-average expiration", () => {
    const a = sampleDay({
      notesCreated: 2,
      notesViewed: 1,
      averageExpirationDays: 1,
      passwordProtectedNotes: 1,
      blogViews: { x: 1 },
    });
    const b = sampleDay({
      notesCreated: 2,
      notesViewed: 3,
      averageExpirationDays: 2,
      blogViews: { x: 2, y: 1 },
    });
    const m = mergeDailyMetrics(a, b);
    assert.equal(m.notesCreated, 4);
    assert.equal(m.notesViewed, 4);
    assert.equal(m.passwordProtectedNotes, 1);
    assert.equal(m.blogViews.x, 3);
    assert.equal(m.blogViews.y, 1);
    assert.ok(Math.abs(m.averageExpirationDays - 1.5) < 1e-9);
  });
});

describe("normalizeDailyMetrics", () => {
  it("fills missing nested keys", () => {
    const m = normalizeDailyMetrics({
      notesCreated: 1,
      notesViewed: 0,
      passwordProtectedNotes: 0,
      aiEnhancedNotes: 0,
      blogViews: {},
      averageExpirationDays: 1,
      expiryRangeDistribution: {} as DailyMetrics["expiryRangeDistribution"],
      viewLimitsDistribution: {} as DailyMetrics["viewLimitsDistribution"],
      contentLengthDistribution: {} as DailyMetrics["contentLengthDistribution"],
    });
    assert.equal(m.expiryRangeDistribution.oneDayOrLess, 0);
    assert.equal(m.viewLimitsDistribution.once, 0);
  });
});
