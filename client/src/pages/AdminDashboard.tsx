import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { AnalyticsData, DailyMetrics } from '@shared/schema';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import {
  Lock, Loader2, AlertCircle, RefreshCw, ChevronLeft, ChevronRight,
  FileText, Eye, Shield, Sparkles, Activity, CheckCircle, XCircle, AlertTriangle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { format, formatDistanceToNow } from 'date-fns';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

function apiUrl(path: string): string {
  const base = (import.meta.env.VITE_API_URL || '').trim();
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

const ANALYTICS_ALL_TIME_START = '2020-01-01';

const EMPTY_METRICS: DailyMetrics = {
  notesCreated: 0, notesViewed: 0, passwordProtectedNotes: 0, aiEnhancedNotes: 0,
  blogViews: {}, referrerCounts: {}, averageExpirationDays: 0,
  expiryRangeDistribution: { oneHourOrLess: 0, oneDayOrLess: 0, oneWeekOrLess: 0, moreThanWeek: 0 },
  viewLimitsDistribution: { once: 0, twice: 0, threeToFive: 0, moreThanFive: 0, unlimited: 0 },
  contentLengthDistribution: { short: 0, medium: 0, long: 0 },
};

function normalizeMetrics(m?: DailyMetrics | null): DailyMetrics {
  if (!m) return EMPTY_METRICS;
  return {
    ...EMPTY_METRICS, ...m,
    blogViews: m.blogViews || {},
    referrerCounts: m.referrerCounts || {},
    expiryRangeDistribution: { ...EMPTY_METRICS.expiryRangeDistribution, ...(m.expiryRangeDistribution || {}) },
    viewLimitsDistribution: { ...EMPTY_METRICS.viewLimitsDistribution, ...(m.viewLimitsDistribution || {}) },
    contentLengthDistribution: { ...EMPTY_METRICS.contentLengthDistribution, ...(m.contentLengthDistribution || {}) },
  };
}

// ─── Audit log types ──────────────────────────────────────────────────────────

type AuditEvent = {
  id: string; eventType: string; status: string; actorId?: string;
  ipAddress?: string; userAgent?: string; metadata?: Record<string, unknown>;
  createdAt: string;
};

const EVENT_LABEL: Record<string, string> = {
  session_created: 'Session Created', session_revoked: 'Session Revoked',
  login_success: 'Login Success', login_failed: 'Login Failed',
  passkey_registered: 'Passkey Registered', passkey_used: 'Passkey Used',
  magic_link_sent: 'Magic Link Sent', magic_link_used: 'Magic Link Used',
  magic_consume_success: 'Magic Consume Success', magic_link_failed: 'Magic Link Failed',
  recovery_code_generated: 'Recovery Codes Generated', recovery_code_used: 'Recovery Code Used',
  rate_limit_exceeded: 'Rate Limit Exceeded', step_up_success: 'Step-up Success',
  account_deleted: 'Account Deleted', maintenance_cleanup: 'Maintenance Cleanup',
};

const STATUS_COLOR: Record<string, string> = {
  success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  failure: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
};

// ─── Login screen ─────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(apiUrl('/api/admin/auth'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ token: token.trim() }),
      });
      if (res.ok) {
        setToken('');
        onLogin();
        toast({ title: 'Authenticated', description: 'Welcome to the admin dashboard.' });
      } else {
        const body = await res.json().catch(() => ({})) as { message?: string };
        toast({
          variant: 'destructive',
          title: 'Authentication failed',
          description: body.message || 'Invalid token.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Enter your admin token to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="admin-token">Admin token</Label>
            <Input
              id="admin-token"
              type="password"
              placeholder="Paste your ADMIN_TOKEN"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              autoComplete="current-password"
              disabled={loading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading || !token.trim()}>
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Verifying…</> : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  );
}

// ─── Analytics tab ────────────────────────────────────────────────────────────

function AnalyticsTab({ onUnauth }: { onUnauth: () => void }) {
  // Default to last 30 days so historical data is visible immediately
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly' | 'custom'>('custom');
  const [customStart, setCustomStart] = useState(() => addUtcDays(utcYmd(), -30));
  const [customEnd, setCustomEnd] = useState(() => utcYmd());

  const fetchAdmin = async (url: string) => {
    const res = await fetch(apiUrl(url), { credentials: 'include' });
    if (res.status === 401) { onUnauth(); return null; }
    if (!res.ok) throw new Error(`${res.status}`);
    return res.json();
  };

  const dailyQ = useQuery({ queryKey: ['/api/admin/analytics/daily'], queryFn: () => fetchAdmin('/api/admin/analytics/daily'), enabled: timeRange === 'daily' });
  const weeklyQ = useQuery({ queryKey: ['/api/admin/analytics/weekly'], queryFn: () => fetchAdmin('/api/admin/analytics/weekly'), enabled: timeRange === 'weekly' });
  const monthlyQ = useQuery({ queryKey: ['/api/admin/analytics/monthly'], queryFn: () => fetchAdmin('/api/admin/analytics/monthly'), enabled: timeRange === 'monthly' });
  const customQ = useQuery({
    queryKey: ['/api/admin/analytics/aggregate', customStart, customEnd],
    queryFn: () => fetchAdmin(`/api/admin/analytics/aggregate?startDate=${encodeURIComponent(customStart)}&endDate=${encodeURIComponent(customEnd)}`),
    enabled: timeRange === 'custom',
  });

  const currentQ = timeRange === 'daily' ? dailyQ : timeRange === 'weekly' ? weeklyQ : timeRange === 'monthly' ? monthlyQ : customQ;
  const rawData = currentQ.data as AnalyticsData | { startDateUtc: string; endDateUtc: string; metrics: DailyMetrics } | null | undefined;

  let parsedMetrics: DailyMetrics | null = null;
  let periodLabel = '';
  const todayUtc = utcYmd();

  if (timeRange === 'custom') {
    const agg = rawData as { startDateUtc: string; endDateUtc: string; metrics: DailyMetrics } | null | undefined;
    if (agg?.metrics) { parsedMetrics = agg.metrics; periodLabel = `UTC ${agg.startDateUtc} – ${agg.endDateUtc}`; }
  } else if (rawData && 'metrics' in rawData && rawData.metrics) {
    const m = rawData.metrics;
    parsedMetrics = typeof m === 'string' ? (() => { try { return JSON.parse(m); } catch { return null; } })() : m;
    periodLabel = timeRange === 'daily' ? `UTC day: ${todayUtc}` : timeRange === 'weekly' ? `UTC ${addUtcDays(todayUtc, -6)} – ${todayUtc}` : `UTC month to date`;
  }

  const metrics = normalizeMetrics(parsedMetrics);

  const statCards = [
    { label: 'Notes Created', value: metrics.notesCreated, icon: FileText, color: 'text-blue-600 dark:text-blue-400' },
    { label: 'Notes Viewed', value: metrics.notesViewed, icon: Eye, color: 'text-green-600 dark:text-green-400' },
    { label: 'Password Protected', value: metrics.passwordProtectedNotes, icon: Shield, color: 'text-amber-600 dark:text-amber-400' },
    { label: 'AI Enhanced', value: metrics.aiEnhancedNotes, icon: Sparkles, color: 'text-violet-600 dark:text-violet-400' },
  ];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <Label className="mb-1.5 block text-xs text-gray-500">Time range</Label>
          <Select value={timeRange} onValueChange={(v) => setTimeRange(v as typeof timeRange)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Today (UTC)</SelectItem>
              <SelectItem value="weekly">Last 7 days (UTC)</SelectItem>
              <SelectItem value="monthly">Month to date (UTC)</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {timeRange === 'custom' && (
          <>
            <div>
              <Label htmlFor="cs" className="mb-1.5 block text-xs text-gray-500">Start</Label>
              <input id="cs" type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)}
                className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm" />
            </div>
            <div>
              <Label htmlFor="ce" className="mb-1.5 block text-xs text-gray-500">End</Label>
              <input id="ce" type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)}
                className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm" />
            </div>
            <Button variant="outline" size="sm" onClick={() => { setCustomStart(ANALYTICS_ALL_TIME_START); setCustomEnd(utcYmd()); }}>
              All time
            </Button>
          </>
        )}
      </div>

      {periodLabel && <p className="text-xs text-gray-500 dark:text-gray-400">Period: {periodLabel}</p>}

      {currentQ.isLoading ? (
        <div className="flex h-48 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>
      ) : currentQ.error ? (
        <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>Failed to load analytics data.</AlertDescription></Alert>
      ) : !parsedMetrics ? (
        <div className="flex h-48 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 text-center px-6">
          <AlertCircle className="h-8 w-8 text-gray-300 dark:text-gray-600" />
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No data for this period</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {timeRange === 'daily'
              ? 'No notes were created or viewed today (UTC). Try "Last 7 days" or a custom date range.'
              : 'No analytics data found for the selected range. Try widening the date range or click "All time".'}
          </p>
          {timeRange === 'daily' && (
            <Button variant="outline" size="sm" onClick={() => { setTimeRange('custom'); setCustomStart(addUtcDays(utcYmd(), -30)); setCustomEnd(utcYmd()); }}>
              Show last 30 days
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {statCards.map(({ label, value, icon: Icon, color }) => (
              <Card key={label}>
                <CardContent className="pt-5">
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 shrink-0 ${color}`} />
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">{value}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card>
                <CardHeader><CardTitle className="text-sm font-medium">Note Activity</CardTitle></CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[{ name: 'Created', value: metrics.notesCreated }, { name: 'Viewed', value: metrics.notesViewed }, { name: 'Password', value: metrics.passwordProtectedNotes }, { name: 'AI', value: metrics.aiEnhancedNotes }]}>
                        <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" fill="#6366f1" name="Count" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-sm font-medium">View Limits</CardTitle></CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={[{ name: 'Once', value: metrics.viewLimitsDistribution.once }, { name: 'Twice', value: metrics.viewLimitsDistribution.twice }, { name: '3–5', value: metrics.viewLimitsDistribution.threeToFive }, { name: '>5', value: metrics.viewLimitsDistribution.moreThanFive }, { name: '∞', value: metrics.viewLimitsDistribution.unlimited }]}
                          cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                          {CHART_COLORS.map((c, i) => <Cell key={i} fill={c} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-sm font-medium">Content Length</CardTitle></CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={[{ name: 'Short', value: metrics.contentLengthDistribution.short }, { name: 'Medium', value: metrics.contentLengthDistribution.medium }, { name: 'Long', value: metrics.contentLengthDistribution.long }]}
                          cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                          {CHART_COLORS.map((c, i) => <Cell key={i} fill={c} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {Object.keys(metrics.blogViews).length > 0 && (
                <Card>
                  <CardHeader><CardTitle className="text-sm font-medium">Blog Views</CardTitle></CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={Object.entries(metrics.blogViews).map(([slug, views]) => ({ name: slug.length > 18 ? slug.slice(0, 18) + '…' : slug, views }))}>
                          <CartesianGrid strokeDasharray="3 3" /><XAxis type="number" /><YAxis dataKey="name" type="category" width={110} /><Tooltip /><Bar dataKey="views" fill="#22c55e" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="md:col-span-2">
                <CardHeader><CardTitle className="text-sm font-medium">Avg. Expiration</CardTitle></CardHeader>
                <CardContent className="flex items-center gap-2">
                  <span className="text-5xl font-bold text-primary tabular-nums">{metrics.averageExpirationDays.toFixed(1)}</span>
                  <span className="text-lg text-gray-500">days</span>
                </CardContent>
              </Card>

              {Object.keys(metrics.referrerCounts).length > 0 && (
                <Card className="md:col-span-2">
                  <CardHeader><CardTitle className="text-sm font-medium">Partner Referrers</CardTitle></CardHeader>
                  <CardContent>
                    <table className="w-full text-sm">
                      <thead><tr className="border-b text-left text-xs text-gray-500"><th className="pb-2">Partner</th><th className="pb-2 text-right">Notes</th></tr></thead>
                      <tbody>
                        {Object.entries(metrics.referrerCounts).sort(([, a], [, b]) => b - a).map(([ref, count]) => (
                          <tr key={ref} className="border-b border-border/40 last:border-0">
                            <td className="py-1.5 font-mono text-xs">{ref}</td>
                            <td className="py-1.5 text-right tabular-nums">{count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              )}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Audit logs tab ───────────────────────────────────────────────────────────

const PAGE_SIZE = 25;

function AuditLogsTab({ onUnauth }: { onUnauth: () => void }) {
  const [offset, setOffset] = useState(0);
  const [eventTypeFilter, setEventTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { toast } = useToast();

  const fetchAdmin = async (url: string) => {
    const res = await fetch(apiUrl(url), { credentials: 'include' });
    if (res.status === 401) { onUnauth(); return null; }
    if (!res.ok) throw new Error(`${res.status}`);
    return res.json();
  };

  const buildUrl = () => {
    const params = new URLSearchParams({ limit: String(PAGE_SIZE), offset: String(offset) });
    if (eventTypeFilter) params.set('eventType', eventTypeFilter);
    if (statusFilter) params.set('status', statusFilter);
    return `/api/admin/audit-logs?${params}`;
  };

  const logsQ = useQuery({
    queryKey: ['/api/admin/audit-logs', offset, eventTypeFilter, statusFilter],
    queryFn: () => fetchAdmin(buildUrl()),
  });

  const logsData = logsQ.data as { events?: AuditEvent[]; total?: number; hasMore?: boolean } | null;
  const events = logsData?.events ?? [];
  const total = logsData?.total ?? 0;

  const handleRefresh = () => {
    logsQ.refetch();
    toast({ title: 'Refreshed' });
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <Label className="mb-1.5 block text-xs text-gray-500">Event type</Label>
          <Select value={eventTypeFilter || '_all'} onValueChange={(v) => { setEventTypeFilter(v === '_all' ? '' : v); setOffset(0); }}>
            <SelectTrigger className="w-52"><SelectValue placeholder="All events" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="_all">All events</SelectItem>
              {Object.entries(EVENT_LABEL).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-1.5 block text-xs text-gray-500">Status</Label>
          <Select value={statusFilter || '_all'} onValueChange={(v) => { setStatusFilter(v === '_all' ? '' : v); setOffset(0); }}>
            <SelectTrigger className="w-36"><SelectValue placeholder="All" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="_all">All</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="failure">Failure</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={logsQ.isFetching}>
          <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${logsQ.isFetching ? 'animate-spin' : ''}`} /> Refresh
        </Button>
        {total > 0 && <span className="ml-auto text-xs text-gray-500">{total} total events</span>}
      </div>

      {logsQ.isLoading ? (
        <div className="flex h-48 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>
      ) : logsQ.error ? (
        <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>Failed to load audit logs.</AlertDescription></Alert>
      ) : events.length === 0 ? (
        <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500">No events found.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((ev) => {
                  let timeAgo = '';
                  let timeAbsolute = '';
                  try {
                    const d = new Date(ev.createdAt);
                    timeAgo = formatDistanceToNow(d, { addSuffix: true });
                    timeAbsolute = format(d, 'MMM d, HH:mm:ss');
                  } catch { timeAgo = ev.createdAt; }
                  return (
                    <TableRow key={ev.id}>
                      <TableCell>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {EVENT_LABEL[ev.eventType] ?? ev.eventType.replace(/_/g, ' ')}
                        </span>
                        {ev.actorId && <p className="mt-0.5 font-mono text-xs text-gray-400">{ev.actorId.slice(0, 16)}…</p>}
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-xs ${STATUS_COLOR[ev.status] ?? 'bg-gray-100 text-gray-700'}`}>
                          {ev.status === 'success' ? <CheckCircle className="mr-1 h-3 w-3" /> : ev.status === 'failure' ? <XCircle className="mr-1 h-3 w-3" /> : <AlertTriangle className="mr-1 h-3 w-3" />}
                          {ev.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-xs text-gray-500">{ev.ipAddress ?? '—'}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-gray-700 dark:text-gray-300" title={timeAbsolute}>{timeAgo}</span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))} disabled={offset === 0}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-gray-500">
              {offset + 1}–{Math.min(offset + PAGE_SIZE, total)} of {total}
            </span>
            <Button variant="outline" size="sm" onClick={() => setOffset(offset + PAGE_SIZE)} disabled={offset + PAGE_SIZE >= total}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Dashboard shell ──────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">Analytics and security audit logs</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => {
          fetch(apiUrl('/api/admin/logout'), { method: 'POST', credentials: 'include' });
          setIsAuthenticated(false);
        }}>
          Sign out
        </Button>
      </div>

      <Tabs defaultValue="analytics">
        <TabsList className="mb-6">
          <TabsTrigger value="analytics">
            <Activity className="mr-1.5 h-4 w-4" /> Analytics
          </TabsTrigger>
          <TabsTrigger value="audit">
            <Shield className="mr-1.5 h-4 w-4" /> Audit Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics">
          <AnalyticsTab onUnauth={() => setIsAuthenticated(false)} />
        </TabsContent>

        <TabsContent value="audit">
          <AuditLogsTab onUnauth={() => setIsAuthenticated(false)} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
