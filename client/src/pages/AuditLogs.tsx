import React, { useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  RefreshCw,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  Users,
  Clock,
  Globe,
  Filter,
  ChevronLeft,
  ChevronRight,
  Search
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ADMIN_TOKEN_STORAGE_KEY = 'admin_token';

// Get API base URL
const getApiUrl = (url: string): string => {
  const apiBaseUrl = import.meta.env.VITE_API_URL || '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return apiBaseUrl + url;
};

// Event type labels and colors
const EVENT_TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  session_created: { label: 'Session Created', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  session_revoked: { label: 'Session Revoked', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
  session_rotated: { label: 'Session Rotated', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  session_expired: { label: 'Session Expired', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' },
  login_success: { label: 'Login Success', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  login_failed: { label: 'Login Failed', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  passkey_registered: { label: 'Passkey Registered', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
  passkey_used: { label: 'Passkey Used', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
  passkey_reset: { label: 'Passkey Reset', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
  recovery_code_generated: { label: 'Recovery Codes Generated', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  recovery_code_used: { label: 'Recovery Code Used', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  recovery_code_failed: { label: 'Recovery Code Failed', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  account_deleted: { label: 'Account Deleted', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  magic_link_sent: { label: 'Magic Link Sent', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  magic_link_used: { label: 'Magic Link Used', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  magic_link_failed: { label: 'Magic Link Failed', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  rate_limit_exceeded: { label: 'Rate Limit Exceeded', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  ip_mismatch: { label: 'IP Mismatch', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
  step_up_required: { label: 'Step-up Required', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  step_up_success: { label: 'Step-up Success', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  maintenance_cleanup: { label: 'Maintenance Cleanup', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' },
};

const STATUS_CONFIG: Record<string, { icon: React.ReactNode; color: string }> = {
  success: { icon: <CheckCircle className="h-4 w-4" />, color: 'text-green-600 dark:text-green-400' },
  failure: { icon: <XCircle className="h-4 w-4" />, color: 'text-red-600 dark:text-red-400' },
  warning: { icon: <AlertTriangle className="h-4 w-4" />, color: 'text-yellow-600 dark:text-yellow-400' },
};

interface AuditLog {
  id: string;
  user_id: string | null;
  event_type: string;
  event_status: string;
  details: Record<string, unknown> | null;
  ip: string | null;
  user_agent: string | null;
  created_at: string;
}

interface AuditLogStats {
  ok: boolean;
  period: { days: number; since: string };
  summary: { total: number; successes: number; failures: number; warnings: number };
  byEventType: Array<{ event_type: string; event_status: string; count: number }>;
  byDay: Array<{ date: string; count: number }>;
  topFailureIps: Array<{ ip: string; count: number }>;
}

interface AuditLogsResponse {
  ok: boolean;
  logs: AuditLog[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export default function AuditLogs() {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(() => typeof window !== 'undefined' && !!sessionStorage.getItem(ADMIN_TOKEN_STORAGE_KEY));
  const [token, setToken] = useState(() => (typeof window !== 'undefined' ? sessionStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) ?? '' : ''));

  // Filters
  const [eventType, setEventType] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [ipFilter, setIpFilter] = useState('');
  const [offset, setOffset] = useState(0);
  const limit = 50;

  // Stats period
  const [statsDays, setStatsDays] = useState(7);

  // Query for fetching audit logs
  const {
    data: logsData,
    isLoading: logsLoading,
    error: logsError,
    refetch: refetchLogs
  } = useQuery<AuditLogsResponse>({
    queryKey: ['/api/admin/audit-logs', eventType, status, ipFilter, offset],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set('limit', limit.toString());
      params.set('offset', offset.toString());
      if (eventType) params.set('eventType', eventType);
      if (status) params.set('status', status);
      if (ipFilter) params.set('ip', ipFilter);

      const response = await fetch(getApiUrl(`/api/admin/audit-logs?${params.toString()}`), {
        headers: { 'X-Admin-Token': token }
      });

      if (!response.ok) throw new Error('Failed to fetch audit logs');
      return response.json();
    },
    enabled: isAuthenticated
  });

  // Query for stats
  const {
    data: statsData,
    isLoading: statsLoading,
    refetch: refetchStats
  } = useQuery<AuditLogStats>({
    queryKey: ['/api/admin/audit-logs/stats', statsDays],
    queryFn: async () => {
      const response = await fetch(getApiUrl(`/api/admin/audit-logs/stats?days=${statsDays}`), {
        headers: { 'X-Admin-Token': token }
      });

      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json();
    },
    enabled: isAuthenticated
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      toast({ variant: "destructive", title: "Authentication failed", description: "Enter your admin token." });
      return;
    }
    const response = await fetch(getApiUrl('/api/admin/audit-logs?limit=1'), {
      headers: { 'X-Admin-Token': token.trim() },
    });
    if (response.ok) {
      sessionStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token.trim());
      setIsAuthenticated(true);
      toast({ title: "Authenticated", description: "You now have access to the audit logs." });
    } else {
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: "Invalid admin token. Please try again.",
      });
    }
  };

  const handleRefresh = () => {
    refetchLogs();
    refetchStats();
    toast({ title: "Refreshed", description: "Audit logs have been refreshed." });
  };

  const handleClearFilters = () => {
    setEventType('');
    setStatus('');
    setIpFilter('');
    setOffset(0);
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto max-w-md px-4 pt-24 pb-16 mb-20">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
          </Link>
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Security Audit Logs</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Authentication required to view audit logs
          </p>
        </div>

        <Card className="backdrop-blur-sm border border-gray-100 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Admin Login
            </CardTitle>
            <CardDescription>
              Enter your admin token to access the security audit logs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="token">Admin Token</Label>
                <Input
                  id="token"
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Enter admin token"
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 pt-24 pb-16 mb-20">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
        </Link>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Shield className="h-8 w-8" />
              Security Audit Logs
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Monitor authentication events and security activities
            </p>
          </div>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dashboard">
        <TabsList className="mb-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="logs">All Logs</TabsTrigger>
          <TabsTrigger value="security">Security Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          {/* Stats Period Selector */}
          <div className="flex items-center gap-4 mb-6">
            <Label>Time Period:</Label>
            <Select value={statsDays.toString()} onValueChange={(v) => setStatsDays(parseInt(v))}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Last 24h</SelectItem>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Events</CardDescription>
                <CardTitle className="text-3xl flex items-center gap-2">
                  <Activity className="h-6 w-6 text-blue-500" />
                  {statsLoading ? <Skeleton className="h-8 w-20" /> : statsData?.summary.total || 0}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Successful</CardDescription>
                <CardTitle className="text-3xl flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-6 w-6" />
                  {statsLoading ? <Skeleton className="h-8 w-20" /> : statsData?.summary.successes || 0}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Failures</CardDescription>
                <CardTitle className="text-3xl flex items-center gap-2 text-red-600">
                  <XCircle className="h-6 w-6" />
                  {statsLoading ? <Skeleton className="h-8 w-20" /> : statsData?.summary.failures || 0}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Warnings</CardDescription>
                <CardTitle className="text-3xl flex items-center gap-2 text-yellow-600">
                  <AlertTriangle className="h-6 w-6" />
                  {statsLoading ? <Skeleton className="h-8 w-20" /> : statsData?.summary.warnings || 0}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Event Type Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Events by Type</CardTitle>
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-8 w-full" />)}
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {statsData?.byEventType.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                        <div className="flex items-center gap-2">
                          <Badge className={EVENT_TYPE_CONFIG[item.event_type]?.color || 'bg-gray-100'}>
                            {EVENT_TYPE_CONFIG[item.event_type]?.label || item.event_type}
                          </Badge>
                          <span className={STATUS_CONFIG[item.event_status]?.color}>
                            {STATUS_CONFIG[item.event_status]?.icon}
                          </span>
                        </div>
                        <span className="font-mono text-sm">{item.count}</span>
                      </div>
                    ))}
                    {(!statsData?.byEventType || statsData.byEventType.length === 0) && (
                      <p className="text-gray-500 text-center py-4">No events in this period</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Top IPs with Failures
                </CardTitle>
                <CardDescription>Potential malicious activity</CardDescription>
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-8 w-full" />)}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {statsData?.topFailureIps.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
                        <code className="text-sm">{item.ip}</code>
                        <Badge variant="destructive">{item.count} failures</Badge>
                      </div>
                    ))}
                    {(!statsData?.topFailureIps || statsData.topFailureIps.length === 0) && (
                      <p className="text-gray-500 text-center py-4">No failures from any IP</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Daily Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Daily Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-32 w-full" />
              ) : (
                <div className="flex items-end gap-1 h-32">
                  {statsData?.byDay.slice().reverse().map((day, idx) => {
                    const maxCount = Math.max(...(statsData?.byDay.map(d => d.count) || [1]));
                    const height = Math.max((day.count / maxCount) * 100, 4);
                    return (
                      <div
                        key={idx}
                        className="flex-1 bg-blue-500 dark:bg-blue-600 rounded-t hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors cursor-pointer group relative"
                        style={{ height: `${height}%` }}
                        title={`${day.date}: ${day.count} events`}
                      >
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                          {day.date}: {day.count}
                        </div>
                      </div>
                    );
                  })}
                  {(!statsData?.byDay || statsData.byDay.length === 0) && (
                    <p className="text-gray-500 w-full text-center py-8">No activity data</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          {/* Filters */}
          <Card className="mb-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>Event Type</Label>
                  <Select value={eventType} onValueChange={(v) => { setEventType(v); setOffset(0); }}>
                    <SelectTrigger>
                      <SelectValue placeholder="All events" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All events</SelectItem>
                      {Object.entries(EVENT_TYPE_CONFIG).map(([key, config]) => (
                        <SelectItem key={key} value={key}>{config.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={status} onValueChange={(v) => { setStatus(v); setOffset(0); }}>
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All statuses</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="failure">Failure</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>IP Address</Label>
                  <Input
                    placeholder="Filter by IP"
                    value={ipFilter}
                    onChange={(e) => { setIpFilter(e.target.value); setOffset(0); }}
                  />
                </div>
                <div className="flex items-end">
                  <Button variant="outline" onClick={handleClearFilters} className="w-full">
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logs Table */}
          <AuditLogsTable
            logs={logsData?.logs}
            isLoading={logsLoading}
            error={logsError}
          />

          {/* Pagination */}
          {logsData?.pagination && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500">
                Showing {offset + 1} - {Math.min(offset + limit, logsData.pagination.total)} of {logsData.pagination.total}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={offset === 0}
                  onClick={() => setOffset(Math.max(0, offset - limit))}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!logsData.pagination.hasMore}
                  onClick={() => setOffset(offset + limit)}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="security">
          {/* Security Alerts - Filter for failures and warnings */}
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Security Monitoring</AlertTitle>
            <AlertDescription>
              This view shows failed authentication attempts, rate limit violations, and other security-related events.
            </AlertDescription>
          </Alert>

          <SecurityAlertsView isAuthenticated={isAuthenticated} token={token} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AuditLogsTable({
  logs,
  isLoading,
  error
}: {
  logs?: AuditLog[];
  isLoading: boolean;
  error: unknown;
}) {
  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load audit logs. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>User</TableHead>
              <TableHead>IP</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-40" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Activity className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <h2 className="text-xl font-medium mb-2">No audit logs found</h2>
        <p className="text-gray-600 dark:text-gray-400">
          No events match your current filters.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>User</TableHead>
            <TableHead>IP</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="whitespace-nowrap">
                <div className="text-sm">{format(new Date(log.created_at), 'MMM d, HH:mm:ss')}</div>
                <div className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                </div>
              </TableCell>
              <TableCell>
                <Badge className={EVENT_TYPE_CONFIG[log.event_type]?.color || 'bg-gray-100'}>
                  {EVENT_TYPE_CONFIG[log.event_type]?.label || log.event_type}
                </Badge>
              </TableCell>
              <TableCell>
                <div className={`flex items-center gap-1 ${STATUS_CONFIG[log.event_status]?.color}`}>
                  {STATUS_CONFIG[log.event_status]?.icon}
                  <span className="capitalize">{log.event_status}</span>
                </div>
              </TableCell>
              <TableCell>
                {log.user_id ? (
                  <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
                    {log.user_id.slice(0, 8)}...
                  </code>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </TableCell>
              <TableCell>
                {log.ip ? (
                  <code className="text-xs">{log.ip}</code>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </TableCell>
              <TableCell className="max-w-xs">
                {log.details ? (
                  <code className="text-xs text-gray-600 dark:text-gray-400 block truncate">
                    {JSON.stringify(log.details)}
                  </code>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

function SecurityAlertsView({ isAuthenticated, token }: { isAuthenticated: boolean; token: string }) {
  const { data, isLoading, error } = useQuery<AuditLogsResponse>({
    queryKey: ['/api/admin/audit-logs/security', token],
    queryFn: async () => {
      // Fetch failures and warnings
      const params = new URLSearchParams();
      params.set('limit', '100');
      params.set('status', 'failure');

      const failuresResponse = await fetch(getApiUrl(`/api/admin/audit-logs?${params.toString()}`), {
        headers: { 'X-Admin-Token': token }
      });

      if (!failuresResponse.ok) throw new Error('Failed to fetch');
      const failures = await failuresResponse.json();

      // Also get warnings
      params.set('status', 'warning');
      const warningsResponse = await fetch(getApiUrl(`/api/admin/audit-logs?${params.toString()}`), {
        headers: { 'X-Admin-Token': token }
      });

      if (!warningsResponse.ok) throw new Error('Failed to fetch');
      const warnings = await warningsResponse.json();

      // Combine and sort by date
      const combined = [...(failures.logs || []), ...(warnings.logs || [])];
      combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      return {
        ok: true,
        logs: combined.slice(0, 100),
        pagination: { total: combined.length, limit: 100, offset: 0, hasMore: false }
      };
    },
    enabled: isAuthenticated
  });

  return (
    <AuditLogsTable
      logs={data?.logs}
      isLoading={isLoading}
      error={error}
    />
  );
}
