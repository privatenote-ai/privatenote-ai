import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  analyticsPageLabel,
  applyEngagementFlush,
  canonicalizeAnalyticsPath,
  createEmptyDailyPageEngagement,
  engagementLegacyKvKey,
  engagementReadKvKeys,
  engagementShardKvKey,
  ENGAGEMENT_WRITE_SHARDS,
  mergeDailyPageEngagement,
  parsePageEngagementFlush,
  pickEngagementWriteShard,
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

describe("analyticsPageLabel", () => {
  it("labels exact paths and grouped legacy rows", () => {
    assert.equal(analyticsPageLabel("/"), "Home");
    assert.equal(analyticsPageLabel("/blog/some-slug"), "/blog/some-slug");
    assert.equal(analyticsPageLabel("blog-post"), "Blog posts (grouped)");
  });
});

describe("parsePageEngagementFlush", () => {
  it("collapses note IDs and ignores leftover heatmap fields", () => {
    const parsed = parsePageEngagementFlush({
      kind: "engagement",
      path: "/note/super-secret-id",
      visits: 1,
      visibleMs: 4000,
      clicks: [[1, 2, 3]],
      dwell: [[4, 5, 6]],
      scrollRecorded: true,
      scrollMaxPct: 80,
    });
    assert.ok(parsed);
    assert.equal(parsed.page, "/note");
    assert.equal(parsed.visits, 1);
    assert.equal(parsed.visibleMs, 4000);
    assert.equal("clicks" in parsed, false);
    assert.equal("dwell" in parsed, false);
  });

  it("rejects admin paths and empty payloads", () => {
    assert.equal(parsePageEngagementFlush({ kind: "engagement", path: "/admin", visits: 1 }), null);
    assert.equal(parsePageEngagementFlush({ kind: "engagement", path: "/", visits: 0 }), null);
  });

  it("stores public page visits without click grids", () => {
    const parsed = parsePageEngagementFlush({
      kind: "engagement",
      path: "/premium",
      visits: 1,
      visibleMs: 1500,
    });
    assert.ok(parsed);
    assert.equal(parsed.page, "/premium");
    assert.equal(parsed.visits, 1);
    assert.equal(parsed.visibleMs, 1500);
  });
});

describe("applyEngagementFlush + merge", () => {
  it("sums visits and visible time on exact paths", () => {
    let day = createEmptyDailyPageEngagement();
    day = applyEngagementFlush(day, {
      page: "/",
      visits: 1,
      visibleMs: 2500,
    });
    day = applyEngagementFlush(day, {
      page: "/",
      visits: 1,
      visibleMs: 1500,
    });
    assert.equal(day.visits["/"], 2);
    assert.equal(day.visibleSeconds["/"], 5);

    const other = applyEngagementFlush(createEmptyDailyPageEngagement(), {
      page: "/premium",
      visits: 1,
      visibleMs: 1000,
    });
    const merged = mergeDailyPageEngagement(day, other);
    assert.equal(merged.visits["/"], 2);
    assert.equal(merged.visits["/premium"], 1);
  });
});

describe("engagement KV keys", () => {
  it("shards writes and reads legacy plus shard keys", () => {
    assert.equal(engagementLegacyKvKey("2026-09-10"), "analytics:engagement:2026-09-10");
    assert.equal(engagementShardKvKey("2026-09-10", 3), "analytics:engagement:2026-09-10:s3");
    assert.equal(pickEngagementWriteShard(19), 19 % ENGAGEMENT_WRITE_SHARDS);
    const keys = engagementReadKvKeys("2026-09-10");
    assert.equal(keys.length, ENGAGEMENT_WRITE_SHARDS + 1);
    assert.equal(keys[0], "analytics:engagement:2026-09-10");
  });
});
