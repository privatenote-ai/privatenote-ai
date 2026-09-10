import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  analyticsPageLabel,
  isLegacyEngagementKey,
  type AggregatedPageEngagement,
  type DailyPageEngagement,
} from "@shared/pageEngagement";
import { AlertCircle, Clock, Eye, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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

function formatDuration(seconds: number): string {
  if (seconds <= 0) return "0s";
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m < 60) return s ? `${m}m ${s}s` : `${m}m`;
  const h = Math.floor(m / 60);
  const rm = m % 60;
  return rm ? `${h}h ${rm}m` : `${h}h`;
}

export function EngagementAnalyticsTab({ onUnauth }: { onUnauth: () => void }) {
  const [customStart, setCustomStart] = useState(() => addUtcDays(utcYmd(), -30));
  const [customEnd, setCustomEnd] = useState(() => utcYmd());

  const fetchAdmin = async (url: string) => {
    const res = await fetch(apiUrl(url), { credentials: "include" });
    if (res.status === 401) {
      onUnauth();
      return null;
    }
    if (!res.ok) throw new Error(`${res.status}`);
    return res.json();
  };

  const query = useQuery({
    queryKey: ["/api/admin/analytics/engagement", customStart, customEnd],
    queryFn: () =>
      fetchAdmin(
        `/api/admin/analytics/engagement?startDate=${encodeURIComponent(customStart)}&endDate=${encodeURIComponent(customEnd)}`,
      ),
  });

  const payload = query.data as AggregatedPageEngagement | null | undefined;
  const engagement: DailyPageEngagement = payload?.engagement || {
    visits: {},
    visibleSeconds: {},
  };

  const rows = useMemo(() => {
    const keys = new Set([
      ...Object.keys(engagement.visits),
      ...Object.keys(engagement.visibleSeconds),
    ]);
    return [...keys]
      .map((page) => {
        const visits = engagement.visits[page] || 0;
        const visible = engagement.visibleSeconds[page] || 0;
        return {
          page,
          label: analyticsPageLabel(page),
          grouped: isLegacyEngagementKey(page) && !page.startsWith("/"),
          visits,
          visible,
          avgVisible: visits > 0 ? Math.round(visible / visits) : 0,
        };
      })
      .sort((a, b) => b.visits - a.visits || b.visible - a.visible);
  }, [engagement]);

  const totalVisits = rows.reduce((s, r) => s + r.visits, 0);
  const totalVisible = rows.reduce((s, r) => s + r.visible, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <Label htmlFor="eng-start" className="mb-1.5 block text-xs text-gray-500">
            Start
          </Label>
          <input
            id="eng-start"
            type="date"
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
          />
        </div>
        <div>
          <Label htmlFor="eng-end" className="mb-1.5 block text-xs text-gray-500">
            End
          </Label>
          <input
            id="eng-end"
            type="date"
            value={customEnd}
            onChange={(e) => setCustomEnd(e.target.value)}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
          />
        </div>
        <Button variant="outline" size="sm" onClick={() => query.refetch()} disabled={query.isFetching}>
          {query.isFetching ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : null}
          Refresh
        </Button>
      </div>

      {query.isError ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Could not load page analytics</AlertTitle>
          <AlertDescription>Check the date range (max 31 UTC days) and try again.</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Page visits</CardDescription>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Eye className="h-5 w-5 text-gray-400" />
              {totalVisits.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Visible time</CardDescription>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Clock className="h-5 w-5 text-gray-400" />
              {formatDuration(totalVisible)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pages</CardTitle>
          <CardDescription>
            Aggregated first-party visits and foreground time. Note IDs are collapsed to /note. No click
            maps, cursor tracking, or session recordings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {query.isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : rows.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">No page visits in this range.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Page</TableHead>
                  <TableHead className="text-right">Visits</TableHead>
                  <TableHead className="text-right">Visible time</TableHead>
                  <TableHead className="text-right">Avg / visit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.page}>
                    <TableCell>
                      <div className="font-medium text-gray-900 dark:text-gray-100">{row.label}</div>
                      {row.grouped ? (
                        <div className="text-xs text-gray-500">Grouped legacy key</div>
                      ) : row.page !== row.label ? (
                        <div className="text-xs text-gray-500">{row.page}</div>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{row.visits.toLocaleString()}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatDuration(row.visible)}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatDuration(row.avgVisible)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
