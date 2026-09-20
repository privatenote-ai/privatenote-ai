import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { medianSecondsFromHistogram } from "@shared/engagedTime";
import {
  analyticsPageLabel,
  isLegacyEngagementKey,
  SEO_LANDING_PATHS,
  type AggregatedPageEngagement,
  type DailyPageEngagement,
} from "@shared/pageEngagement";
import { REFERRER_TYPES } from "@shared/referrerCategory";
import type { DailyMetrics } from "@shared/schema";
import { AlertCircle, Clock, Eye, Loader2, Users } from "lucide-react";
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

function formatPct(part: number, whole: number): string {
  if (whole <= 0) return "—";
  return `${((part / whole) * 100).toFixed(1)}%`;
}

function formatRatio(part: number, whole: number): string {
  if (whole <= 0) return "—";
  return `${part.toLocaleString()} / ${whole.toLocaleString()}`;
}

function parseStoredMetrics(raw: unknown): DailyMetrics | null {
  if (!raw || typeof raw !== "object") return null;
  const record = raw as { metrics?: unknown };
  if (record.metrics == null) return null;
  if (typeof record.metrics === "string") {
    try {
      return JSON.parse(record.metrics) as DailyMetrics;
    } catch {
      return null;
    }
  }
  return record.metrics as DailyMetrics;
}

const RANGE_PRESETS = [
  { id: "1d", label: "24 hours", days: 1 },
  { id: "7d", label: "7 days", days: 7 },
  { id: "30d", label: "30 days", days: 30 },
] as const;

const DEVELOPER_EVENT_KEYS = [
  "developer_page_viewed",
  "mcp_page_viewed",
  "cli_page_viewed",
  "npm_link_clicked",
  "github_link_clicked",
  "install_command_copied",
  "mcp_demo_started",
  "mcp_demo_completed",
] as const;

export function EngagementAnalyticsTab({ onUnauth }: { onUnauth: () => void }) {
  const [customStart, setCustomStart] = useState(() => addUtcDays(utcYmd(), -7));
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

  const metricsQuery = useQuery({
    queryKey: ["/api/admin/analytics/aggregate", customStart, customEnd],
    queryFn: () =>
      fetchAdmin(
        `/api/admin/analytics/aggregate?startDate=${encodeURIComponent(customStart)}&endDate=${encodeURIComponent(customEnd)}`,
      ),
  });

  const payload = query.data as AggregatedPageEngagement | null | undefined;
  const engagement: DailyPageEngagement = payload?.engagement || { visits: {}, visibleSeconds: {} };
  const metrics = parseStoredMetrics(metricsQuery.data) || (metricsQuery.data as { metrics?: DailyMetrics } | null)?.metrics;

  const rows = useMemo(() => {
    const keys = new Set([
      ...Object.keys(engagement.visits || {}),
      ...Object.keys(engagement.visibleSeconds || {}),
      ...Object.keys(engagement.uniqueSessions || {}),
    ]);
    return [...keys]
      .map((page) => {
        const visits = engagement.visits?.[page] || 0;
        const visible = engagement.visibleSeconds?.[page] || 0;
        const sessions = engagement.uniqueSessions?.[page] || 0;
        const bounces = engagement.bounces?.[page] || 0;
        const median = medianSecondsFromHistogram(engagement.engagedHistogram?.[page]);
        return {
          page,
          label: analyticsPageLabel(page),
          grouped: isLegacyEngagementKey(page) && !page.startsWith("/"),
          visits,
          sessions,
          visible,
          avgVisible: visits > 0 ? Math.round(visible / visits) : 0,
          median,
          bounceRate: formatPct(bounces, sessions),
          smallSample: sessions > 0 && sessions < 20,
        };
      })
      .sort((a, b) => b.visits - a.visits || b.visible - a.visible);
  }, [engagement]);

  const seoRows = useMemo(() => {
    return SEO_LANDING_PATHS.map((page) => {
      const sessions = engagement.uniqueSessions?.[page] || 0;
      const search = engagement.searchOriginSessions?.[page] || 0;
      const visits = engagement.visits?.[page] || 0;
      const bounces = engagement.bounces?.[page] || 0;
      const ctas = engagement.ctaClicks?.[page] || 0;
      const notes = engagement.noteCreationsByLanding?.[page] || 0;
      const signups = engagement.signupsByLanding?.[page] || 0;
      const premium = engagement.premiumByLanding?.[page] || 0;
      return {
        page,
        sessions,
        search,
        median: medianSecondsFromHistogram(engagement.engagedHistogram?.[page]),
        bounce: formatPct(bounces, sessions),
        cta: formatPct(ctas, visits),
        notes: formatPct(notes, sessions),
        signup: formatPct(signups, sessions),
        premium: formatPct(premium, sessions),
        smallSample: sessions > 0 && sessions < 20,
      };
    }).filter((row) => row.sessions > 0 || (engagement.visits?.[row.page] || 0) > 0);
  }, [engagement]);

  const referrerRows = useMemo(() => {
    return REFERRER_TYPES.map((type) => {
      const sessions = engagement.referrerSessions?.[type] || 0;
      return {
        type,
        sessions,
        notes: engagement.notesByReferrer?.[type] || 0,
        signups: engagement.signupsByReferrer?.[type] || 0,
        premium: engagement.premiumByReferrer?.[type] || 0,
      };
    }).filter((row) => row.sessions > 0 || row.notes > 0);
  }, [engagement]);

  const transitionRows = useMemo(() => {
    return Object.entries(engagement.transitions || {})
      .map(([key, count]) => {
        const [from, to] = key.split("\t");
        return { from: from || "/", to: to || "/", count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
  }, [engagement]);

  const utmRows = useMemo(() => {
    return Object.entries(engagement.utmCampaignSessions || {})
      .map(([campaign, sessions]) => ({ campaign, sessions }))
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, 20);
  }, [engagement]);

  const totalVisits = rows.reduce((s, r) => s + r.visits, 0);
  const totalVisible = rows.reduce((s, r) => s + r.visible, 0);
  const totalSessions = Object.values(engagement.uniqueSessions || {}).reduce((s, n) => s + n, 0);
  const opened = engagement.sessionsOpenedNote || 0;
  const loop = engagement.recipientLoopCompleted || 0;
  const created = engagement.sessionsCreatedNote || 0;
  const reveals = metrics?.clientEventCounts?.note_reveal_requested || 0;
  const recipientCreateClicks = metrics?.clientEventCounts?.["cta:recipient_create_note"] || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-wrap gap-2">
          {RANGE_PRESETS.map((preset) => (
            <Button
              key={preset.id}
              variant="outline"
              size="sm"
              onClick={() => {
                setCustomStart(addUtcDays(utcYmd(), 1 - preset.days));
                setCustomEnd(utcYmd());
              }}
            >
              {preset.label}
            </Button>
          ))}
        </div>
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

      <p className="text-xs text-gray-500">
        Aggregates only: no session IDs, no note IDs, no advertising. Ranges are capped at 31 UTC days.
        Rates with fewer than 20 sessions show the sample size so they are not over-read.
      </p>

      {query.isError ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Could not load page analytics</AlertTitle>
          <AlertDescription>Check the date range (max 31 UTC days) and try again.</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            <CardDescription>Anonymous sessions</CardDescription>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Users className="h-5 w-5 text-gray-400" />
              {totalSessions.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Engaged time</CardDescription>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Clock className="h-5 w-5 text-gray-400" />
              {formatDuration(totalVisible)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Recipient Create New Note</CardDescription>
            <CardTitle className="text-2xl">{formatRatio(recipientCreateClicks, reveals)}</CardTitle>
            <CardDescription className="pt-1">
              {formatPct(recipientCreateClicks, reveals)} of reveals clicked Create New Note.
              Same-session note created: {formatRatio(loop, opened)} ({formatPct(loop, opened)} of
              note-open sessions). Aggregates only — not unique people, not joined to a note id.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>SEO landing pages</CardTitle>
          <CardDescription>
            Search-origin is Google or Bing referrer category on session start. Conversion rates use the
            landing page of that anonymous session, not a stored identity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {seoRows.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-500">No landing-page sessions in this range.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Landing page</TableHead>
                  <TableHead className="text-right">Sessions</TableHead>
                  <TableHead className="text-right">Search</TableHead>
                  <TableHead className="text-right">Median engaged</TableHead>
                  <TableHead className="text-right">Bounce</TableHead>
                  <TableHead className="text-right">CTA</TableHead>
                  <TableHead className="text-right">Note created</TableHead>
                  <TableHead className="text-right">Signup</TableHead>
                  <TableHead className="text-right">Premium</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {seoRows.map((row) => (
                  <TableRow key={row.page}>
                    <TableCell className="font-medium">
                      {row.page}
                      {row.smallSample ? (
                        <div className="text-xs text-amber-700 dark:text-amber-400">n={row.sessions}</div>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{row.sessions.toLocaleString()}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.search.toLocaleString()}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {row.median == null ? "—" : formatDuration(row.median)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{row.bounce}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.cta}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.notes}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.signup}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.premium}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Acquisition</CardTitle>
          <CardDescription>
            Referrer category on session start. Notes/signups/premium are same-session outcomes, not
            cross-device attribution.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {referrerRows.length === 0 && utmRows.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-500">No referrer sessions yet.</p>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Source</TableHead>
                    <TableHead className="text-right">Sessions</TableHead>
                    <TableHead className="text-right">Notes</TableHead>
                    <TableHead className="text-right">Signup</TableHead>
                    <TableHead className="text-right">Premium</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {referrerRows.map((row) => (
                    <TableRow key={row.type}>
                      <TableCell className="capitalize">{row.type}</TableCell>
                      <TableCell className="text-right tabular-nums">{row.sessions.toLocaleString()}</TableCell>
                      <TableCell className="text-right tabular-nums">{row.notes.toLocaleString()}</TableCell>
                      <TableCell className="text-right tabular-nums">{row.signups.toLocaleString()}</TableCell>
                      <TableCell className="text-right tabular-nums">{row.premium.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {utmRows.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campaign (utm)</TableHead>
                      <TableHead className="text-right">Sessions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {utmRows.map((row) => (
                      <TableRow key={row.campaign}>
                        <TableCell className="font-mono text-xs">{row.campaign}</TableCell>
                        <TableCell className="text-right tabular-nums">{row.sessions.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Next page</CardTitle>
          <CardDescription>Aggregate from→to counts. Individual journeys are not stored.</CardDescription>
        </CardHeader>
        <CardContent>
          {transitionRows.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-500">No route transitions yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transitionRows.map((row) => (
                  <TableRow key={`${row.from}->${row.to}`}>
                    <TableCell>{row.from}</TableCell>
                    <TableCell>{row.to}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.count.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Developer / MCP</CardTitle>
          <CardDescription>
            Named events only. MCP-created notes stay on the Analytics tab as creationSource=mcp — that is
            not joined to a campaign click.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead className="text-right">Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DEVELOPER_EVENT_KEYS.map((key) => (
                <TableRow key={key}>
                  <TableCell className="font-mono text-xs">{key}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {(metrics?.clientEventCounts?.[key] || 0).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell>Notes created (any source)</TableCell>
                <TableCell className="text-right tabular-nums">
                  {(metrics?.notesCreated || 0).toLocaleString()}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>MCP-created notes</TableCell>
                <TableCell className="text-right tabular-nums">
                  {(metrics?.creationSourceCounts?.mcp || 0).toLocaleString()}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Same-session note creates</TableCell>
                <TableCell className="text-right tabular-nums">{created.toLocaleString()}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pages</CardTitle>
          <CardDescription>
            Visits and engaged time (visible, focused, and recently interactive; idle time is excluded).
            Median comes from duration buckets, not a stored timeline. Note IDs collapse to /note.
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
                  <TableHead className="text-right">Sessions</TableHead>
                  <TableHead className="text-right">Engaged time</TableHead>
                  <TableHead className="text-right">Avg / visit</TableHead>
                  <TableHead className="text-right">Median</TableHead>
                  <TableHead className="text-right">Bounce</TableHead>
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
                      {row.smallSample ? (
                        <div className="text-xs text-amber-700 dark:text-amber-400">n={row.sessions}</div>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{row.visits.toLocaleString()}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.sessions.toLocaleString()}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatDuration(row.visible)}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatDuration(row.avgVisible)}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {row.median == null ? "—" : formatDuration(row.median)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{row.bounceRate}</TableCell>
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
