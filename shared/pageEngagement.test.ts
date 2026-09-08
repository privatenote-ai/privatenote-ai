import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  applyEngagementFlush,
  canonicalizeAnalyticsPath,
  createEmptyDailyPageEngagement,
  documentPointToCell,
  HEATMAP_COLS,
  HEATMAP_ROWS,
  mergeDailyPageEngagement,
  parsePageEngagementFlush,
  scrollReachFromMaxHistogram,
} from "./pageEngagement";

describe("canonicalizeAnalyticsPath", () => {
  it("maps locale homes and marketing routes", () => {
    assert.equal(canonicalizeAnalyticsPath("/"), "home");
    assert.equal(canonicalizeAnalyticsPath("/de"), "home");
    assert.equal(canonicalizeAnalyticsPath("/de/"), "home");
    assert.equal(canonicalizeAnalyticsPath("/fr/premium"), "premium");
    assert.equal(canonicalizeAnalyticsPath("/password-generator?x=1"), "password-generator");
    assert.equal(canonicalizeAnalyticsPath("/blog/category/security"), "blog-category");
    assert.equal(canonicalizeAnalyticsPath("/hr/blog/some-slug"), "blog-post");
    assert.equal(canonicalizeAnalyticsPath("/note/abc123def"), "note");
    assert.equal(canonicalizeAnalyticsPath("/account/security"), "account");
    assert.equal(canonicalizeAnalyticsPath("/auth/sign-in"), "auth");
    assert.equal(canonicalizeAnalyticsPath("/developers/cli"), "developers");
    assert.equal(canonicalizeAnalyticsPath("/security-guides/password-managers"), "security-guide");
    assert.equal(canonicalizeAnalyticsPath("/not-a-real-page"), "other");
  });

  it("does not track admin or internal tools", () => {
    assert.equal(canonicalizeAnalyticsPath("/admin"), null);
    assert.equal(canonicalizeAnalyticsPath("/admin/analytics"), null);
    assert.equal(canonicalizeAnalyticsPath("/test-llm"), null);
    assert.equal(canonicalizeAnalyticsPath("/llm-ui"), null);
  });
});

describe("parsePageEngagementFlush", () => {
  it("re-canonicalizes path and drops note-page heatmaps", () => {
    const parsed = parsePageEngagementFlush({
      kind: "engagement",
      path: "/note/super-secret-id",
      visits: 1,
      visibleMs: 4000,
      clicks: [[1, 2, 3]],
      dwell: [[4, 5, 6]],
    });
    assert.ok(parsed);
    assert.equal(parsed.page, "note");
    assert.equal(parsed.visits, 1);
    assert.equal(parsed.clicks.length, 0);
    assert.equal(parsed.dwell.length, 0);
  });

  it("rejects admin paths and empty payloads", () => {
    assert.equal(parsePageEngagementFlush({ kind: "engagement", path: "/admin", visits: 1 }), null);
    assert.equal(parsePageEngagementFlush({ kind: "engagement", path: "/", visits: 0 }), null);
  });

  it("accepts heatmap cells on public pages", () => {
    const parsed = parsePageEngagementFlush({
      kind: "engagement",
      path: "/premium",
      visits: 1,
      visibleMs: 1500,
      scrollRecorded: true,
      scrollMaxPct: 72,
      clicks: [[2, 3, 1], [99, 1, 1], [2, 3, 2]],
    });
    assert.ok(parsed);
    assert.equal(parsed.page, "premium");
    assert.equal(parsed.scrollRecorded, true);
    assert.equal(parsed.scrollMaxPct, 72);
    assert.deepEqual(parsed.clicks, [[2, 3, 1], [2, 3, 2]]);
  });
});

describe("applyEngagementFlush + merge", () => {
  it("sums visits, visible time, and sparse heatmaps", () => {
    let day = createEmptyDailyPageEngagement();
    day = applyEngagementFlush(day, {
      page: "home",
      visits: 1,
      visibleMs: 2500,
      scrollRecorded: true,
      scrollMaxPct: 40,
      clicks: [[1, 1, 2]],
      dwell: [],
    });
    day = applyEngagementFlush(day, {
      page: "home",
      visits: 1,
      visibleMs: 1000,
      scrollRecorded: true,
      scrollMaxPct: 90,
      clicks: [[1, 1, 1]],
      dwell: [[3, 4, 5]],
    });
    assert.equal(day.visits.home, 2);
    assert.equal(day.visibleSeconds.home, 4);
    assert.equal(day.clicks.home!["1,1"], 3);
    assert.equal(day.dwell.home!["3,4"], 5);
    const reach = scrollReachFromMaxHistogram(day.scrollMax.home);
    assert.equal(reach[0], 2);
    assert.equal(reach[9], 1);
  });

  it("merges two days", () => {
    const a = applyEngagementFlush(createEmptyDailyPageEngagement(), {
      page: "blog",
      visits: 3,
      visibleMs: 5000,
      scrollRecorded: false,
      scrollMaxPct: 0,
      clicks: [],
      dwell: [],
    });
    const b = applyEngagementFlush(createEmptyDailyPageEngagement(), {
      page: "blog",
      visits: 1,
      visibleMs: 2000,
      scrollRecorded: false,
      scrollMaxPct: 0,
      clicks: [],
      dwell: [],
    });
    const m = mergeDailyPageEngagement(a, b);
    assert.equal(m.visits.blog, 4);
    assert.equal(m.visibleSeconds.blog, 7);
  });
});

describe("documentPointToCell", () => {
  it("maps the origin and far corner into the grid", () => {
    assert.deepEqual(documentPointToCell(0, 0, 1000, 2000), { row: 0, col: 0 });
    const far = documentPointToCell(999, 1999, 1000, 2000);
    assert.deepEqual(far, { row: HEATMAP_ROWS - 1, col: HEATMAP_COLS - 1 });
  });
});
