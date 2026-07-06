import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { AnalyticsData, DailyMetrics } from '@shared/schema';
import { NOTE_CREATION_SOURCE_LABELS, NOTE_CREATION_SOURCES } from '@shared/noteCreationSource';
import {
  FILE_SIZE_BUCKET_LABELS,
  NOTE_CREATION_ENTRY_POINT_LABELS,
  NOTE_CREATION_ENTRY_POINTS,
} from '@shared/noteCreationEntryPoint';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
const EMPTY_DAILY_METRICS: DailyMetrics = {
  notesCreated: 0,
  notesViewed: 0,
  passwordProtectedNotes: 0,
  aiEnhancedNotes: 0,
  blogViews: {},
  referrerCounts: {},
  creationSourceCounts: {},
  creationEntryPointCounts: {},
  averageExpirationDays: 0,
  expiryRangeDistribution: {
    oneHourOrLess: 0,
    oneDayOrLess: 0,
    oneWeekOrLess: 0,
    moreThanWeek: 0
  },
  viewLimitsDistribution: {
    once: 0,
    twice: 0,
    threeToFive: 0,
    moreThanFive: 0,
    unlimited: 0
  },
  contentLengthDistribution: {
    short: 0,
    medium: 0,
    long: 0
  },
  notesFailedToView: 0,
  notesDestroyedOnView: 0,
  wrongPasswordAttempts: 0,
  accountSignups: 0,
  accountLogins: 0,
  qrSharesGenerated: 0,
  localAiUsed: 0,
  cloudAiUsed: 0,
  countryDistribution: {},
  languageDistribution: {},
  fileSharePageViews: 0,
  passwordSharePageViews: 0,
  notesWithFileAttachment: 0,
  fileSizeBucketDistribution: { under5mb: 0, from5to15mb: 0, from15to25mb: 0, over25mb: 0 },
};

const normalizeMetrics = (metrics?: DailyMetrics | null): DailyMetrics => {
  if (!metrics) {
    return EMPTY_DAILY_METRICS;
  }
  return {
    ...EMPTY_DAILY_METRICS,
    ...metrics,
    blogViews: metrics.blogViews || {},
    referrerCounts: metrics.referrerCounts || {},
    creationSourceCounts: metrics.creationSourceCounts || {},
    creationEntryPointCounts: metrics.creationEntryPointCounts || {},
    fileSizeBucketDistribution: {
      ...EMPTY_DAILY_METRICS.fileSizeBucketDistribution!,
      ...(metrics.fileSizeBucketDistribution || {}),
    },
    expiryRangeDistribution: {
      ...EMPTY_DAILY_METRICS.expiryRangeDistribution,
      ...(metrics.expiryRangeDistribution || {})
    },
    viewLimitsDistribution: {
      ...EMPTY_DAILY_METRICS.viewLimitsDistribution,
      ...(metrics.viewLimitsDistribution || {})
    },
    contentLengthDistribution: {
      ...EMPTY_DAILY_METRICS.contentLengthDistribution,
      ...(metrics.contentLengthDistribution || {})
    }
  };
};

function utcYmd(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10);
}

function addUtcDaysFromYmd(ymd: string, deltaDays: number): string {
  const d = new Date(`${ymd}T12:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + deltaDays);
  return utcYmd(d);
}

const ANALYTICS_ALL_TIME_START = '2020-01-01';

type AggregateResponse = {
  startDateUtc: string;
  endDateUtc: string;
  metrics: DailyMetrics;
};

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly' | 'custom'>('daily');
  const [customStart, setCustomStart] = useState(() => addUtcDaysFromYmd(utcYmd(), -30));
  const [customEnd, setCustomEnd] = useState(() => utcYmd());

  // Get API base URL
  const getApiUrl = (url: string): string => {
    const apiBaseUrl = import.meta.env.VITE_API_URL || '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return apiBaseUrl + url;
  };

  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const fetchWithAdminCookie = async (url: string) => {
    const response = await fetch(getApiUrl(url), {
      credentials: 'include',
    });

    if (response.status === 401) {
      setIsAuthenticated(false);
      return null;
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    return response.json();
  };

  // Queries
  const dailyQuery = useQuery({
    queryKey: ['/api/admin/analytics/daily'],
    queryFn: () => fetchWithAdminCookie('/api/admin/analytics/daily'),
    enabled: isAuthenticated && timeRange === 'daily'
  });

  const weeklyQuery = useQuery({
    queryKey: ['/api/admin/analytics/weekly'],
    queryFn: () => fetchWithAdminCookie('/api/admin/analytics/weekly'),
    enabled: isAuthenticated && timeRange === 'weekly'
  });

  const monthlyQuery = useQuery({
    queryKey: ['/api/admin/analytics/monthly'],
    queryFn: () => fetchWithAdminCookie('/api/admin/analytics/monthly'),
    enabled: isAuthenticated && timeRange === 'monthly'
  });

  const aggregateQuery = useQuery({
    queryKey: ['/api/admin/analytics/aggregate', customStart, customEnd],
    queryFn: () =>
      fetchWithAdminCookie(
        `/api/admin/analytics/aggregate?startDate=${encodeURIComponent(customStart)}&endDate=${encodeURIComponent(customEnd)}`,
      ),
    enabled: isAuthenticated && timeRange === 'custom',
  });

  const currentQuery =
    timeRange === 'daily'
      ? dailyQuery
      : timeRange === 'weekly'
        ? weeklyQuery
        : timeRange === 'monthly'
          ? monthlyQuery
          : aggregateQuery;

  const isLoading = currentQuery.isLoading;
  const error = currentQuery.error;
  const data = (timeRange === 'custom' ? null : currentQuery.data) as AnalyticsData | undefined;

  let parsedMetrics: DailyMetrics | null = null;
  let periodUtcLabel = '';

  if (timeRange === 'custom') {
    const agg = aggregateQuery.data as AggregateResponse | null | undefined;
    if (agg?.metrics) {
      parsedMetrics = agg.metrics;
      periodUtcLabel = `UTC ${agg.startDateUtc} through ${agg.endDateUtc} (inclusive)`;
    }
  } else if (data?.metrics) {
    if (typeof data.metrics === 'string') {
      try {
        parsedMetrics = JSON.parse(data.metrics) as DailyMetrics;
      } catch {
        parsedMetrics = null;
      }
    } else {
      parsedMetrics = data.metrics as DailyMetrics;
    }
    const todayUtc = utcYmd();
    if (timeRange === 'daily') {
      periodUtcLabel = `Single UTC day: ${todayUtc}`;
    } else if (timeRange === 'weekly') {
      periodUtcLabel = `UTC ${addUtcDaysFromYmd(todayUtc, -6)} through ${todayUtc} (7 days)`;
    } else {
      const now = new Date();
      const monthStart = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-01`;
      periodUtcLabel = `UTC month slice: ${monthStart} through ${todayUtc}`;
    }
  }

  const metrics = parsedMetrics ? normalizeMetrics(parsedMetrics) : undefined;

  // Convert metrics to chart data
  const prepareViewLimitsData = () => {
    if (!metrics) return [];

    return [
      { name: 'Once', value: metrics.viewLimitsDistribution.once },
      { name: 'Twice', value: metrics.viewLimitsDistribution.twice },
      { name: 'Three to Five', value: metrics.viewLimitsDistribution.threeToFive },
      { name: 'More Than Five', value: metrics.viewLimitsDistribution.moreThanFive },
      { name: 'Unlimited', value: metrics.viewLimitsDistribution.unlimited }
    ];
  };

  const prepareContentLengthData = () => {
    if (!metrics) return [];

    return [
      { name: 'Short', value: metrics.contentLengthDistribution.short },
      { name: 'Medium', value: metrics.contentLengthDistribution.medium },
      { name: 'Long', value: metrics.contentLengthDistribution.long }
    ];
  };

  const prepareBlogViewsData = () => {
    if (!metrics?.blogViews) return [];

    return Object.entries(metrics.blogViews).map(([slug, views]) => ({
      name: slug.length > 15 ? slug.substring(0, 15) + '...' : slug,
      views
    }));
  };

  const prepareNoteCreationData = () => {
    if (!metrics) return [];

    return [
      { name: 'Notes Created', value: metrics.notesCreated },
      { name: 'Notes Viewed', value: metrics.notesViewed },
      { name: 'Password Protected', value: metrics.passwordProtectedNotes },
      { name: 'AI Enhanced', value: metrics.aiEnhancedNotes }
    ];
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-6 pt-24 pb-16">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Admin authentication required</AlertTitle>
          <AlertDescription>
            Log in at Audit Logs or Blog Admin first, then return here to view analytics.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 pt-24 pb-16">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load analytics data. Please ensure you have admin access.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 pt-24 pb-16">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
          <h1 className="page-title text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <Select
            value={timeRange}
            onValueChange={(value) => setTimeRange(value as 'daily' | 'weekly' | 'monthly' | 'custom')}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily (UTC)</SelectItem>
              <SelectItem value="weekly">Weekly (UTC)</SelectItem>
              <SelectItem value="monthly">Monthly (UTC)</SelectItem>
              <SelectItem value="custom">Custom UTC range</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>UTC buckets</AlertTitle>
          <AlertDescription>
            All day totals use <strong>UTC</strong> calendar dates, matching KV keys{' '}
            <code className="text-xs">analytics:daily:YYYY-MM-DD</code>. &quot;Notes viewed&quot; counts
            successful opens on that UTC day (not the day the note was created).
          </AlertDescription>
        </Alert>

        {timeRange === 'custom' ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
            <div className="flex flex-col gap-1">
              <label htmlFor="analytics-start" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Start (UTC date)
              </label>
              <input
                id="analytics-start"
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="analytics-end" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                End (UTC date)
              </label>
              <input
                id="analytics-end"
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-fit"
              onClick={() => {
                setCustomStart(ANALYTICS_ALL_TIME_START);
                setCustomEnd(utcYmd());
              }}
            >
              All time (UTC)
            </Button>
          </div>
        ) : null}

        {periodUtcLabel ? (
          <p className="text-sm text-gray-600 dark:text-gray-400 m-0">
            <span className="font-medium text-gray-800 dark:text-gray-200">Period:</span> {periodUtcLabel}
          </p>
        ) : null}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : !metrics ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Data</AlertTitle>
            <AlertDescription>
              No analytics data available for the selected time period.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Notes Created vs. Viewed */}
            <Card>
              <CardHeader>
                <CardTitle>Note Activity</CardTitle>
                <CardDescription>
                  Notes created vs. opened successfully (reveal) in this UTC window
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={prepareNoteCreationData()}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" name="Count" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* View Limits Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>View Limits Distribution</CardTitle>
                <CardDescription>
                  How many times users allow their notes to be viewed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={prepareViewLimitsData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {prepareViewLimitsData().map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} notes`, 'Count']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Content Length Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Content Length Distribution</CardTitle>
                <CardDescription>
                  By encrypted payload string length (base64 ciphertext), not plaintext size
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={prepareContentLengthData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {prepareContentLengthData().map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} notes`, 'Count']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Blog Post Views */}
            <Card>
              <CardHeader>
                <CardTitle>Blog Post Views</CardTitle>
                <CardDescription>
                  Number of views per blog post
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={prepareBlogViewsData()}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="views" fill="#82ca9d" name="Views" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Average Expiration Days */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Average Expiration Days</CardTitle>
                <CardDescription>
                  Average number of days users set for note expiration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-24">
                  <div className="text-6xl font-bold text-primary">
                    {metrics.averageExpirationDays.toFixed(1)}
                  </div>
                  <div className="ml-2 text-xl">days</div>
                </div>
              </CardContent>
            </Card>

            {/* Partner / Referrer Breakdown */}
            {Object.keys(metrics.referrerCounts || {}).length > 0 && (
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Notes Created via Partners</CardTitle>
                  <CardDescription>
                    Websites using the <code className="text-xs bg-muted px-1 py-0.5 rounded">#text=…&amp;from=</code> prefill integration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-left text-muted-foreground">
                          <th className="pb-2 font-medium">Partner / Referrer</th>
                          <th className="pb-2 font-medium text-right">Notes Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(metrics.referrerCounts)
                          .sort(([, a], [, b]) => b - a)
                          .map(([ref, count]) => (
                            <tr key={ref} className="border-b border-border/50 last:border-0">
                              <td className="py-2 font-mono text-xs">{ref}</td>
                              <td className="py-2 text-right tabular-nums">{count}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {Object.keys(metrics.creationSourceCounts || {}).length > 0 && (
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Note Creation Source</CardTitle>
                  <CardDescription>
                    Where notes were created: web app vs VS Code / Cursor extension
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={NOTE_CREATION_SOURCES
                          .map((source) => ({
                            name: NOTE_CREATION_SOURCE_LABELS[source],
                            count: metrics.creationSourceCounts?.[source] ?? 0,
                          }))
                          .filter(({ count }) => count > 0)}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#6366f1" name="Notes" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {Object.keys(metrics.creationEntryPointCounts || {}).length > 0 && (
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Note Entry Point</CardTitle>
                  <CardDescription>
                    Which page or flow started the note: home, password share, file share, or extension
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={NOTE_CREATION_ENTRY_POINTS
                          .map((entryPoint) => ({
                            name: NOTE_CREATION_ENTRY_POINT_LABELS[entryPoint],
                            count: metrics.creationEntryPointCounts?.[entryPoint] ?? 0,
                          }))
                          .filter(({ count }) => count > 0)}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#14b8a6" name="Notes" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {((metrics.passwordSharePageViews ?? 0) > 0 ||
              (metrics.fileSharePageViews ?? 0) > 0 ||
              (metrics.creationEntryPointCounts?.['password-share'] ?? 0) > 0 ||
              (metrics.creationEntryPointCounts?.['file-share'] ?? 0) > 0) && (
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Feature Funnel</CardTitle>
                  <CardDescription>
                    Page visits vs notes created from Share a password and Share a file
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 pb-4 sm:grid-cols-4">
                    <div>
                      <p className="text-2xl font-bold tabular-nums">{metrics.passwordSharePageViews ?? 0}</p>
                      <p className="text-xs text-muted-foreground">Password page views</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold tabular-nums">
                        {metrics.creationEntryPointCounts?.['password-share'] ?? 0}
                      </p>
                      <p className="text-xs text-muted-foreground">Passwords shared</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold tabular-nums">{metrics.fileSharePageViews ?? 0}</p>
                      <p className="text-xs text-muted-foreground">File page views</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold tabular-nums">
                        {metrics.creationEntryPointCounts?.['file-share'] ?? 0}
                      </p>
                      <p className="text-xs text-muted-foreground">File notes created</p>
                    </div>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          {
                            name: 'Share a password',
                            pageViews: metrics.passwordSharePageViews ?? 0,
                            notesCreated: metrics.creationEntryPointCounts?.['password-share'] ?? 0,
                          },
                          {
                            name: 'Share a file',
                            pageViews: metrics.fileSharePageViews ?? 0,
                            notesCreated: metrics.creationEntryPointCounts?.['file-share'] ?? 0,
                          },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="pageViews" fill="#f59e0b" name="Page views" />
                        <Bar dataKey="notesCreated" fill="#6366f1" name="Notes created" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {(metrics.notesWithFileAttachment ?? 0) > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>File Attachment Sizes</CardTitle>
                  <CardDescription>
                    {metrics.notesWithFileAttachment ?? 0} notes included an encrypted file attachment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={Object.entries(metrics.fileSizeBucketDistribution ?? {})
                            .filter(([, count]) => count > 0)
                            .map(([bucket, value]) => ({
                              name: FILE_SIZE_BUCKET_LABELS[bucket as keyof typeof FILE_SIZE_BUCKET_LABELS],
                              value,
                            }))}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {COLORS.map((color, index) => (
                            <Cell key={`cell-${index}`} fill={color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
