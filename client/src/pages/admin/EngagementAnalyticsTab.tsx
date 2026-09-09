import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  analyticsPageLabel,
  analyticsPreviewPath,
  isLegacyEngagementKey,
  pageAllowsHeatmap,
  scrollReachFromMaxHistogram,
  SCROLL_BUCKETS,
  type AggregatedPageEngagement,
  type DailyPageEngagement,
} from "@shared/pageEngagement";
import {
  AlertCircle,
  Clock,
  Eye,
  Flame,
  Loader2,
  MousePointerClick,
  ScrollText,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeatmapPreview, type HeatMode } from "@/pages/admin/PageHeatmapPreview";

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
  const [selectedPage, setSelectedPage] = useState<string>("/");
  const [mode, setMode] = useState<HeatMode>("clicks");

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
    scrollMax: {},
    clicks: {},
    dwell: {},
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
        const reach = scrollReachFromMaxHistogram(engagement.scrollMax[page]);
        const peak = reach[0] || 0;
        const avgScroll =
          peak > 0
            ? Math.round(
                reach.reduce((sum, n, i) => {
                  const prev = i === SCROLL_BUCKETS - 1 ? 0 : reach[i + 1] || 0;
                  const inBucket = n - prev;
                  return sum + inBucket * ((i + 0.5) * (100 / SCROLL_BUCKETS));
                }, 0) / peak,
              )
            : 0;
        const label = analyticsPageLabel(page);
        const path = page.startsWith("/") ? page : null;
        return {
          page,
          label,
          path,
          grouped: isLegacyEngagementKey(page) && !page.startsWith("/"),
          visits,
          visible,
          avgVisible: visits > 0 ? Math.round(visible / visits) : 0,
          avgScroll,
        };
      })
      .sort((a, b) => b.visits - a.visits || b.visible - a.visible);
  }, [engagement]);

  const totalVisits = rows.reduce((s, r) => s + r.visits, 0);
  const totalVisible = rows.reduce((s, r) => s + r.visible, 0);

  const activePage = rows.some((r) => r.page === selectedPage)
    ? selectedPage
    : rows[0]?.page || "/";
  const activeRow = rows.find((r) => r.page === activePage);
  const previewPath = analyticsPreviewPath(activePage);
  const heatmapAllowed = pageAllowsHeatmap(activePage);
  const clickCells = Object.keys(engagement.clicks[activePage] || {}).length;
  const dwellCells = Object.keys(engagement.dwell[activePage] || {}).length;

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
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setCustomStart(addUtcDays(utcYmd(), -30));
            setCustomEnd(utcYmd());
          }}
        >
          Last 30 days
        </Button>
      </div>

      {payload?.startDateUtc && (
        <p className="text-xs text-gray-500">
          Period: UTC {payload.startDateUtc} – {payload.endDateUtc}. First-party only: no third-party
          pixels, no session replay, no note IDs. Locales are folded so /de/premium and /premium are the
          same page.
        </p>
      )}

      {query.isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : query.error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load page engagement data.</AlertDescription>
        </Alert>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="pt-5">
                <div className="flex items-center gap-3">
                  <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-2xl font-bold tabular-nums text-gray-900 dark:text-white">{totalVisits}</p>
                    <p className="text-xs text-gray-500">Page visits</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <p className="text-2xl font-bold tabular-nums text-gray-900 dark:text-white">
                      {formatDuration(totalVisible)}
                    </p>
                    <p className="text-xs text-gray-500">Time visible</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5">
                <div className="flex items-center gap-3">
                  <Flame className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  <div>
                    <p className="text-2xl font-bold tabular-nums text-gray-900 dark:text-white">
                      {clickCells + dwellCells}
                    </p>
                    <p className="text-xs text-gray-500">Heatmap cells (selected page)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Pages</CardTitle>
              <CardDescription>
                Each row is the public URL that was on screen (locale prefix stripped). Blog posts and
                security guides are listed individually. Click a row to open its heatmap. Visible time
                counts only while the tab is in the foreground.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {rows.length === 0 ? (
                <p className="py-8 text-center text-sm text-gray-500">
                  No page visits in this range yet. Open the public site after this deploy to start collecting
                  data.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Page</TableHead>
                      <TableHead className="text-right">Visits</TableHead>
                      <TableHead className="text-right">Time visible</TableHead>
                      <TableHead className="text-right">Avg. visible</TableHead>
                      <TableHead className="text-right">Avg. furthest scroll</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow
                        key={row.page}
                        className={row.page === activePage ? "bg-primary/5" : "cursor-pointer"}
                        onClick={() => setSelectedPage(row.page)}
                      >
                        <TableCell>
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            {row.path || row.label}
                          </div>
                          {row.path && row.label !== row.path && (
                            <div className="text-xs text-gray-500">{row.label}</div>
                          )}
                          {row.grouped && (
                            <div className="text-xs text-amber-700 dark:text-amber-400">
                              Older grouped data (before exact URLs)
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">{row.visits}</TableCell>
                        <TableCell className="text-right tabular-nums">{formatDuration(row.visible)}</TableCell>
                        <TableCell className="text-right tabular-nums">{formatDuration(row.avgVisible)}</TableCell>
                        <TableCell className="text-right tabular-nums">{row.avgScroll}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Heatmaps · {activeRow?.path || analyticsPageLabel(activePage)}
              </CardTitle>
              <CardDescription>
                Overlay on the live page that visitors saw. Scroll the preview like a normal page; the map
                stays locked to the content.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={mode === "clicks" ? "default" : "outline"}
                  onClick={() => setMode("clicks")}
                >
                  <MousePointerClick className="mr-1.5 h-4 w-4" />
                  Clicks
                </Button>
                <Button
                  size="sm"
                  variant={mode === "dwell" ? "default" : "outline"}
                  onClick={() => setMode("dwell")}
                >
                  <Flame className="mr-1.5 h-4 w-4" />
                  Attention
                </Button>
                <Button
                  size="sm"
                  variant={mode === "scroll" ? "default" : "outline"}
                  onClick={() => setMode("scroll")}
                >
                  <ScrollText className="mr-1.5 h-4 w-4" />
                  Scroll reach
                </Button>
              </div>

              {!heatmapAllowed && mode !== "scroll" ? (
                <p className="rounded-md border border-dashed p-4 text-sm text-gray-500">
                  Click and attention heatmaps are disabled on note pages so on-screen secret content is never
                  sampled. Visits, visible time, and scroll depth are still collected.
                </p>
              ) : (
                <PageHeatmapPreview
                  path={previewPath}
                  mode={mode}
                  clickMap={engagement.clicks[activePage]}
                  dwellMap={engagement.dwell[activePage]}
                  scrollMax={engagement.scrollMax[activePage]}
                />
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
