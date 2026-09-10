import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { DailyMetrics } from "@shared/schema";
import type { AggregatedPageEngagement } from "@shared/pageEngagement";
import {
  ANALYTICS_PACE_ROWS,
  ANALYTICS_PACE_WINDOWS,
  averagePerDay,
  emptyAnalyticsPaceCounts,
  formatPaceAverage,
  formatPaceInteger,
  paceCountsFromSources,
} from "@shared/analyticsPace";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function apiUrl(path: string): string {
  const base = (import.meta.env.VITE_API_URL || "").trim();
  return base + path;
}

function utcYmd(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10);
}

function addUtcDays(ymd: string, delta: number): string {
  const d = new Date(`${ymd}T12:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + delta);
  return utcYmd(d);
}

function parseStoredMetrics(raw: unknown): DailyMetrics | null {
  if (!raw || typeof raw !== "object") return null;
  const record = raw as { metrics?: unknown; message?: string };
  if (!("metrics" in record) || record.metrics == null) return null;
  if (typeof record.metrics === "string") {
    try {
      return JSON.parse(record.metrics) as DailyMetrics;
    } catch {
      return null;
    }
  }
  return record.metrics as DailyMetrics;
}

function formatPaceCell(value: number | null, kind: "today" | "average"): string {
  if (value == null) return "—";
  return kind === "today" ? formatPaceInteger(value) : formatPaceAverage(value);
}

export function AnalyticsPaceTable({
  onUnauth,
  fetchAdmin,
}: {
  onUnauth: () => void;
  fetchAdmin?: (url: string) => Promise<unknown>;
}) {
  const todayUtc = utcYmd();
  const start7 = addUtcDays(todayUtc, 1 - ANALYTICS_PACE_WINDOWS.last7);
  const start30 = addUtcDays(todayUtc, 1 - ANALYTICS_PACE_WINDOWS.last30);

  const load = fetchAdmin ?? (async (url: string) => {
    const res = await fetch(apiUrl(url), { credentials: "include" });
    if (res.status === 401) {
      onUnauth();
      return null;
    }
    if (!res.ok) throw new Error(`${res.status}`);
    return res.json();
  });

  const todayMetricsQ = useQuery({
    queryKey: ["/api/admin/analytics/pace", "metrics", "today", todayUtc],
    queryFn: () => load("/api/admin/analytics/daily"),
  });
  const weekMetricsQ = useQuery({
    queryKey: ["/api/admin/analytics/pace", "metrics", "7d", todayUtc],
    queryFn: () =>
      load(
        `/api/admin/analytics/aggregate?startDate=${encodeURIComponent(start7)}&endDate=${encodeURIComponent(todayUtc)}`,
      ),
  });
  const monthMetricsQ = useQuery({
    queryKey: ["/api/admin/analytics/pace", "metrics", "30d", todayUtc],
    queryFn: () =>
      load(
        `/api/admin/analytics/aggregate?startDate=${encodeURIComponent(start30)}&endDate=${encodeURIComponent(todayUtc)}`,
      ),
  });
  const todayEngQ = useQuery({
    queryKey: ["/api/admin/analytics/pace", "engagement", "today", todayUtc],
    queryFn: () =>
      load(
        `/api/admin/analytics/engagement?startDate=${encodeURIComponent(todayUtc)}&endDate=${encodeURIComponent(todayUtc)}`,
      ),
  });
  const weekEngQ = useQuery({
    queryKey: ["/api/admin/analytics/pace", "engagement", "7d", todayUtc],
    queryFn: () =>
      load(
        `/api/admin/analytics/engagement?startDate=${encodeURIComponent(start7)}&endDate=${encodeURIComponent(todayUtc)}`,
      ),
  });
  const monthEngQ = useQuery({
    queryKey: ["/api/admin/analytics/pace", "engagement", "30d", todayUtc],
    queryFn: () =>
      load(
        `/api/admin/analytics/engagement?startDate=${encodeURIComponent(start30)}&endDate=${encodeURIComponent(todayUtc)}`,
      ),
  });

  const loading = [todayMetricsQ, weekMetricsQ, monthMetricsQ, todayEngQ, weekEngQ, monthEngQ].some(
    (q) => q.isLoading,
  );
  const error = [todayMetricsQ, weekMetricsQ, monthMetricsQ, todayEngQ, weekEngQ, monthEngQ].some((q) => q.isError);

  const rows = useMemo(() => {
    const visitsOf = (data: unknown) => (data as AggregatedPageEngagement | null)?.engagement?.visits;
    const today = paceCountsFromSources(parseStoredMetrics(todayMetricsQ.data), visitsOf(todayEngQ.data));
    const last7 = paceCountsFromSources(parseStoredMetrics(weekMetricsQ.data), visitsOf(weekEngQ.data));
    const last30 = paceCountsFromSources(parseStoredMetrics(monthMetricsQ.data), visitsOf(monthEngQ.data));
    const fallback = emptyAnalyticsPaceCounts();
    return ANALYTICS_PACE_ROWS.map((row) => {
      const todayValue = today[row.key] ?? fallback[row.key];
      const seven = last7[row.key];
      const thirty = last30[row.key];
      return {
        ...row,
        today: todayValue,
        avg7: seven == null ? null : averagePerDay(seven, ANALYTICS_PACE_WINDOWS.last7),
        avg30: thirty == null ? null : averagePerDay(thirty, ANALYTICS_PACE_WINDOWS.last30),
      };
    });
  }, [
    todayMetricsQ.data,
    weekMetricsQ.data,
    monthMetricsQ.data,
    todayEngQ.data,
    weekEngQ.data,
    monthEngQ.data,
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pace</CardTitle>
        <CardDescription>
          Today against trailing UTC averages. 7-day and 30-day columns are per calendar day,
          including today — more useful than cumulative totals while volume is still small. Paid
          conversions are not recorded in daily analytics yet.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : error ? (
          <p className="py-6 text-center text-sm text-gray-500">Could not load pace metrics.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                <TableHead className="text-right">Today</TableHead>
                <TableHead className="text-right">7d avg/day</TableHead>
                <TableHead className="text-right">30d avg/day</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.key}>
                  <TableCell className="font-medium text-gray-900 dark:text-gray-100">{row.label}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatPaceCell(row.today, "today")}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatPaceCell(row.avg7, "average")}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatPaceCell(row.avg30, "average")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
