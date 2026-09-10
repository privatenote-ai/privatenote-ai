import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ANALYTICS_PACE_WINDOWS,
  averagePerDay,
  formatPaceAverage,
  homepageVisitCount,
  paceCountsFromSources,
  pricingVisitCount,
} from "./analyticsPace";
import { createEmptyDailyMetrics } from "./analyticsMetrics";

describe("homepageVisitCount", () => {
  it("sums current home path and legacy home key", () => {
    assert.equal(homepageVisitCount({ "/": 70, home: 7, "/de": 0, "/about": 3 }), 77);
  });
});

describe("pricingVisitCount", () => {
  it("sums premium path, legacy key, and leftover locale paths", () => {
    assert.equal(pricingVisitCount({ "/premium": 8, premium: 1, "/de/premium": 1, "/about": 4 }), 10);
  });
});

describe("paceCountsFromSources", () => {
  it("maps note and file counters and leaves paid conversions untracked", () => {
    const metrics = createEmptyDailyMetrics();
    metrics.notesCreated = 21;
    metrics.notesViewed = 15;
    metrics.notesWithFileAttachment = 2;
    metrics.accountSignups = 0;
    const counts = paceCountsFromSources(metrics, { "/": 77, "/premium": 10 });
    assert.equal(counts.homepageVisitors, 77);
    assert.equal(counts.notesCreated, 21);
    assert.equal(counts.notesViewed, 15);
    assert.equal(counts.filesShared, 2);
    assert.equal(counts.pricingViews, 10);
    assert.equal(counts.signups, 0);
    assert.equal(counts.paidConversions, null);
  });
});

describe("averagePerDay", () => {
  it("divides trailing window length including today", () => {
    assert.equal(averagePerDay(621, ANALYTICS_PACE_WINDOWS.last30), 20.7);
    assert.equal(formatPaceAverage(averagePerDay(54, ANALYTICS_PACE_WINDOWS.last30)), "1.8");
  });
});
