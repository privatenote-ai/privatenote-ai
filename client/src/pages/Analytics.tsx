import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { getQueryFn } from '@/lib/queryClient';
import { AnalyticsMetricsType, type AnalyticsData, type DailyMetrics } from '@shared/schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const today = new Date();
  
  // Date calculations
  const dailyDate = today;
  const weeklyStartDate = startOfWeek(today);
  const weeklyEndDate = endOfWeek(today);
  const monthlyStartDate = startOfMonth(today);
  const monthlyEndDate = endOfMonth(today);
  
  // Custom query function to handle admin endpoints with token
  const fetchWithAdminToken = async (url: string) => {
    const response = await fetch(url, {
      headers: { 'x-admin-token': 'admin-secret-token' },
      credentials: 'include',
    });
    
    if (response.status === 401) {
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
    queryFn: () => fetchWithAdminToken('/api/admin/analytics/daily'),
    enabled: timeRange === 'daily'
  });
  
  const weeklyQuery = useQuery({
    queryKey: ['/api/admin/analytics/weekly'],
    queryFn: () => fetchWithAdminToken('/api/admin/analytics/weekly'),
    enabled: timeRange === 'weekly'
  });
  
  const monthlyQuery = useQuery({
    queryKey: ['/api/admin/analytics/monthly'],
    queryFn: () => fetchWithAdminToken('/api/admin/analytics/monthly'),
    enabled: timeRange === 'monthly'
  });
  
  // Determine which query to use based on the selected time range
  const currentQuery = timeRange === 'daily' 
    ? dailyQuery 
    : timeRange === 'weekly' 
      ? weeklyQuery 
      : monthlyQuery;
  
  const isLoading = currentQuery.isLoading;
  const error = currentQuery.error;
  const data = currentQuery.data as AnalyticsData | undefined;
  const metrics = data?.metrics as DailyMetrics | undefined;
  
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
  
  if (error) {
    return (
      <div className="container mx-auto p-6">
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
    <div className="container mx-auto p-6">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <Select value={timeRange} onValueChange={(value) => setTimeRange(value as any)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
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
                  Overview of note creation and views for the {timeRange} period
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
                        {prepareViewLimitsData().map((entry, index) => (
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
                  Distribution of note lengths created by users
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
                        {prepareContentLengthData().map((entry, index) => (
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
          </div>
        )}
      </div>
    </div>
  );
}