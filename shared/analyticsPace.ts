import type { DailyMetrics } from "./schema";
import { migrateLegacyPageKey } from "./pageEngagement";

export const ANALYTICS_PACE_WINDOWS = {
  today: 1,
  last7: 7,
  last30: 30,
} as const;

export type AnalyticsPaceWindow = keyof typeof ANALYTICS_PACE_WINDOWS;

export type AnalyticsPaceCounts = {
  homepageVisitors: number;
  notesCreated: number;
  notesViewed: number;
  filesShared: number;
  pricingViews: number;
  signups: number;
  /** Null when the product does not yet record paid conversions in daily analytics. */
  paidConversions: number | null;
};

export const ANALYTICS_PACE_ROWS: ReadonlyArray<{
  key: keyof AnalyticsPaceCounts;
  label: string;
}> = [
  { key: "homepageVisitors", label: "Homepage visitors" },
  { key: "notesCreated", label: "Notes created" },
  { key: "notesViewed", label: "Notes viewed" },
  { key: "filesShared", label: "Files shared" },
  { key: "pricingViews", label: "Pricing views" },
  { key: "signups", label: "Signups" },
  { key: "paidConversions", label: "Paid conversions" },
];

export function emptyAnalyticsPaceCounts(): AnalyticsPaceCounts {
  return {
    homepageVisitors: 0,
    notesCreated: 0,
    notesViewed: 0,
    filesShared: 0,
    pricingViews: 0,
    signups: 0,
    paidConversions: null,
  };
}

export function homepageVisitCount(visits: Record<string, number> | undefined): number {
  let total = 0;
  for (const [page, count] of Object.entries(visits || {})) {
    const key = migrateLegacyPageKey(page);
    if (key === "/" || key === "home") {
      total += Math.floor(Number(count) || 0);
    }
  }
  return total;
}

export function pricingVisitCount(visits: Record<string, number> | undefined): number {
  let total = 0;
  for (const [page, count] of Object.entries(visits || {})) {
    const key = migrateLegacyPageKey(page);
    if (key === "/premium" || key === "premium" || key.endsWith("/premium")) {
      total += Math.floor(Number(count) || 0);
    }
  }
  return total;
}

export function paceCountsFromSources(
  metrics: DailyMetrics | null | undefined,
  visits: Record<string, number> | undefined,
): AnalyticsPaceCounts {
  return {
    homepageVisitors: homepageVisitCount(visits),
    notesCreated: metrics?.notesCreated ?? 0,
    notesViewed: metrics?.notesViewed ?? 0,
    filesShared: metrics?.notesWithFileAttachment ?? 0,
    pricingViews: pricingVisitCount(visits),
    signups: metrics?.accountSignups ?? 0,
    paidConversions: null,
  };
}

export function averagePerDay(total: number, days: number): number {
  if (days <= 0) return 0;
  return total / days;
}

export function formatPaceInteger(value: number): string {
  return Math.round(value).toLocaleString();
}

export function formatPaceAverage(value: number): string {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}
