import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  analyticsPageLabel,
  analyticsPreviewPath,
  applyEngagementFlush,
  canonicalizeAnalyticsPath,
  createEmptyDailyPageEngagement,
  documentPointToCell,
  engagementLegacyKvKey,
  engagementReadKvKeys,
  engagementShardKvKey,
  ENGAGEMENT_WRITE_SHARDS,
  HEATMAP_COLS,
  HEATMAP_ROWS,
  HEATMAP_VERSION,
  heatmapCellKey,
  mergeDailyPageEngagement,
  parseHeatmapCellKey,
  parsePageEngagementFlush,
  pickEngagementWriteShard,
  scrollReachFromMaxHistogram,
  upsampleLegacyHeatmap,
} from "./pageEngagement";

describe("canonicalizeAnalyticsPath", () => {
  it("keeps the exact public page that was on screen", () => {
    assert.equal(canonicalizeAnalyticsPath("/"), "/");
    assert.equal(canonicalizeAnalyticsPath("/de"), "/");
    assert.equal(canonicalizeAnalyticsPath("/de/"), "/");
    assert.equal(canonicalizeAnalyticsPath("/fr/premium"), "/premium");
    assert.equal(canonicalizeAnalyticsPath("/password-generator?x=1"), "/password-generator");
    assert.equal(canonicalizeAnalyticsPath("/blog/category/security"), "/blog/category/security");
    assert.equal(canonicalizeAnalyticsPath("/hr/blog/some-slug"), "/blog/some-slug");
    assert.equal(canonicalizeAnalyticsPath("/security-guides/password-managers"), "/security-guides/password-managers");
    assert.equal(canonicalizeAnalyticsPath("/developers/cli"), "/developers/cli");
    assert.equal(canonicalizeAnalyticsPath("/note/abc123def"), "/note");
    assert.equal(canonicalizeAnalyticsPath("/account/security"), "/account");
    assert.equal(canonicalizeAnalyticsPath("/auth/sign-in"), "/auth");
    assert.equal(canonicalizeAnalyticsPath("/not-a-real-page"), "/not-a-real-page");
  });

  it("does not track admin or internal tools", () => {
    assert.equal(canonicalizeAnalyticsPath("/admin"), null);
    assert.equal(canonicalizeAnalyticsPath("/admin/analytics"), null);
    assert.equal(canonicalizeAnalyticsPath("/test-llm"), null);
    assert.equal(canonicalizeAnalyticsPath("/llm-ui"), null);
  });
});

describe("analyticsPageLabel + preview path", () => {
  it("labels exact paths and grouped legacy rows", () => {
    assert.equal(analyticsPageLabel("/"), "Home");
    assert.equal(analyticsPageLabel("/blog/some-slug"), "/blog/some-slug");
    assert.equal(analyticsPageLabel("blog-post"), "Blog posts (grouped)");
    assert.equal(analyticsPreviewPath("/premium"), "/premium");
    assert.equal(analyticsPreviewPath("/note"), null);
    assert.equal(analyticsPreviewPath("blog-post"), null);
  });
});

describe("parsePageEngagementFlush", () => {
  it("stores the exact blog path and drops note-page heatmaps", () => {
    const parsed = parsePageEngagementFlush({
      kind: "engagement",
      path: "/note/super-secret-id",
      hv: HEATMAP_VERSION,
      visits: 1,
      visibleMs: 4000,
      clicks: [[1, 2, 3]],
      dwell: [[4, 5, 6]],
    });
    assert.ok(parsed);
    assert.equal(parsed.page, "/note");
    assert.equal(parsed.visits, 1);
    assert.equal(parsed.clicks.length, 0);
    assert.equal(parsed.dwell.length, 0);
  });

  it("rejects admin paths and empty payloads", () => {
    assert.equal(parsePageEngagementFlush({ kind: "engagement", path: "/admin", visits: 1 }), null);
    assert.equal(parsePageEngagementFlush({ kind: "engagement", path: "/", visits: 0 }), null);
  });

  it("accepts heatmap cells on public pages at the current grid", () => {
    const parsed = parsePageEngagementFlush({
      kind: "engagement",
      path: "/premium",
      hv: HEATMAP_VERSION,
      visits: 1,
      visibleMs: 1500,
      scrollRecorded: true,
      scrollMaxPct: 72,
      clicks: [[2, 3, 1], [99, 1, 1], [2, 3, 2]],
    });
    assert.ok(parsed);
    assert.equal(parsed.page, "/premium");
    assert.equal(parsed.scrollRecorded, true);
    assert.equal(parsed.scrollMaxPct, 72);
    assert.deepEqual(parsed.clicks, [[2, 3, 1], [2, 3, 2]]);
  });

  it("upsamples legacy 24×18 beacons that omit hv", () => {
    const parsed = parsePageEngagementFlush({
      kind: "engagement",
      path: "/about",
      visits: 1,
      visibleMs: 1000,
      clicks: [[0, 0, 4]],
    });
    assert.ok(parsed);
    assert.equal(parsed.page, "/about");
    assert.ok(parsed.clicks.length >= 1);
    const [row, col, count] = parsed.clicks[0]!;
    assert.ok(row >= 0 && row < HEATMAP_ROWS);
    assert.ok(col >= 0 && col < HEATMAP_COLS);
    assert.equal(count, 4);
    assert.ok(!(row === 0 && col === 0) || HEATMAP_ROWS === 18);
  });
});

describe("applyEngagementFlush + merge", () => {
  it("sums visits, visible time, and sparse heatmaps on exact paths", () => {
    let day = createEmptyDailyPageEngagement();
    day = applyEngagementFlush(day, {
      page: "/",
      visits: 1,
      visibleMs: 2500,
      scrollRecorded: true,
      scrollMaxPct: 40,
      clicks: [[1, 1, 2]],
      dwell: [],
    });
    day = applyEngagementFlush(day, {
      page: "/",
      visits: 1,
      visibleMs: 1000,
      scrollRecorded: true,
      scrollMaxPct: 90,
      clicks: [[1, 1, 1]],
      dwell: [[3, 4, 5]],
    });
    assert.equal(day.visits["/"], 2);
    assert.equal(day.visibleSeconds["/"], 4);
    assert.equal(day.clicks["/"]!["1,1"], 3);
    assert.equal(day.dwell["/"]!["3,4"], 5);
    const reach = scrollReachFromMaxHistogram(day.scrollMax["/"]);
    assert.equal(reach[0], 2);
    assert.equal(reach[9], 1);
  });

  it("migrates legacy home keys onto /", () => {
    const a = applyEngagementFlush(createEmptyDailyPageEngagement(), {
      page: "home",
      visits: 3,
      visibleMs: 5000,
      scrollRecorded: false,
      scrollMaxPct: 0,
      clicks: [],
      dwell: [],
    });
    const b = applyEngagementFlush(createEmptyDailyPageEngagement(), {
      page: "/",
      visits: 1,
      visibleMs: 2000,
      scrollRecorded: false,
      scrollMaxPct: 0,
      clicks: [],
      dwell: [],
    });
    const m = mergeDailyPageEngagement(a, b);
    assert.equal(m.visits["/"], 4);
    assert.equal(m.visibleSeconds["/"], 7);
    assert.equal(m.visits.home, undefined);
  });

  it("keeps distinct blog posts separate", () => {
    let day = createEmptyDailyPageEngagement();
    day = applyEngagementFlush(day, {
      page: "/blog/alpha",
      visits: 2,
      visibleMs: 4000,
      scrollRecorded: false,
      scrollMaxPct: 0,
      clicks: [],
      dwell: [],
    });
    day = applyEngagementFlush(day, {
      page: "/blog/beta",
      visits: 1,
      visibleMs: 1000,
      scrollRecorded: false,
      scrollMaxPct: 0,
      clicks: [],
      dwell: [],
    });
    assert.equal(day.visits["/blog/alpha"], 2);
    assert.equal(day.visits["/blog/beta"], 1);
  });
});

describe("documentPointToCell", () => {
  it("maps the origin and far corner into the grid", () => {
    assert.deepEqual(documentPointToCell(0, 0, 1000, 2000), { row: 0, col: 0 });
    const far = documentPointToCell(999, 1999, 1000, 2000);
    assert.deepEqual(far, { row: HEATMAP_ROWS - 1, col: HEATMAP_COLS - 1 });
  });
});

describe("upsampleLegacyHeatmap", () => {
  it("preserves counts when moving from 24×18 into the finer grid", () => {
    const up = upsampleLegacyHeatmap({ "0,0": 5, "17,23": 2 });
    const total = Object.values(up).reduce((s, n) => s + n, 0);
    assert.equal(total, 7);
    for (const key of Object.keys(up)) {
      assert.ok(parseHeatmapCellKey(key));
    }
    assert.equal(heatmapCellKey(0, 0) in up || Object.keys(up).length > 0, true);
  });
});

describe("engagement KV shards", () => {
  it("writes to numbered shards and still reads the unsharded legacy key", () => {
    const keys = engagementReadKvKeys("2026-09-09");
    assert.equal(keys[0], engagementLegacyKvKey("2026-09-09"));
    assert.equal(keys.length, ENGAGEMENT_WRITE_SHARDS + 1);
    assert.equal(engagementShardKvKey("2026-09-09", 0), "analytics:engagement:2026-09-09:s0");
    assert.equal(engagementShardKvKey("2026-09-09", ENGAGEMENT_WRITE_SHARDS), engagementShardKvKey("2026-09-09", 0));
    assert.equal(pickEngagementWriteShard(17) % ENGAGEMENT_WRITE_SHARDS, pickEngagementWriteShard(17));
  });

  it("merges visits from separate shard documents the way admin reads do", () => {
    const a = applyEngagementFlush(createEmptyDailyPageEngagement(), {
      page: "/",
      visits: 2,
      visibleMs: 1000,
      scrollRecorded: false,
      scrollMaxPct: 0,
      clicks: [[1, 1, 1]],
      dwell: [],
    });
    const b = applyEngagementFlush(createEmptyDailyPageEngagement(), {
      page: "/",
      visits: 3,
      visibleMs: 2000,
      scrollRecorded: false,
      scrollMaxPct: 0,
      clicks: [[1, 1, 4]],
      dwell: [],
    });
    const merged = mergeDailyPageEngagement(a, b);
    assert.equal(merged.visits["/"], 5);
    assert.equal(merged.visibleSeconds["/"], 3);
    assert.equal(merged.clicks["/"]!["1,1"], 5);
  });
});
