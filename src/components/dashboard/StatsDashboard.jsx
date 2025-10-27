// components/dashboard/StatsDashboard.jsx
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  Phone,
  PhoneMissed,
  PhoneIncoming,
  PhoneOutgoing,
  TrendingUp,
  TrendingDown,
  Clock,
  Users
} from 'lucide-react';
import KPICard from '@/components/ui/KPICard';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Skeleton  from '@/components/ui/Skeleton';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';

const StatsDashboard = () => {
  const [period, setPeriod] = useState('today');

  const { data: stats, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboard-stats', period],
    queryFn: async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/calls/stats?period=${period}`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.data.success) {
          throw new Error(response.data.message || 'Failed to fetch dashboard stats');
        }
        
        return response.data.data;
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        throw error;
      }
    },
    refetchInterval: 300000,
    retry: 2,
  });

  const periodButtons = [
    { key: 'today', label: 'Today' },
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
    { key: 'custom', label: 'Last 30 Days' }
  ];

  // Format trends data for better display
  const formatTrendsData = (trends) => {
    if (!trends || !Array.isArray(trends)) return [];
    
    return trends.map(item => ({
      ...item,
      name: item._id?.toString() || '0',
      total: item.totalCalls || 0,
      answered: item.answeredCalls || 0,
      missed: item.missedCalls || 0
    }));
  };

  // Format hourly distribution data
  const formatHourlyData = (distribution) => {
    if (!distribution || !Array.isArray(distribution)) return [];
    
    return distribution.map(item => ({
      hour: item.hour,
      calls: item.calls || 0
    }));
  };

  // Calculate trends for KPI cards
  const calculateTrends = () => {
    // This would typically come from your API comparing with previous period
    return {
      totalTrend: 'up',
      answeredTrend: 'up', 
      missedTrend: 'down',
      spamTrend: 'down'
    };
  };

  const trends = calculateTrends();

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-red-500 text-lg">Error loading dashboard statistics</p>
        <p className="text-gray-500 text-sm">{error.message}</p>
        <Button onClick={() => refetch()} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Call Analytics Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-500">Monitor your call center performance in real-time</p>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {periodButtons.map(({ key, label }) => (
            <Button
              key={key}
              variant={period === key ? 'primary' : 'outline'}
              onClick={() => setPeriod(key)}
              size="sm"
              disabled={isLoading}
              className="text-sm"
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Calls"
          value={stats?.overview?.totalCalls || 0}
          change="+12%"
          trend={trends.totalTrend}
          icon={Phone}
        />
        <KPICard
          title="Answered Calls"
          value={stats?.overview?.answeredCalls || 0}
          change="+8%"
          trend={trends.answeredTrend}
          icon={PhoneIncoming}
        />
        <KPICard
          title="Missed Calls"
          value={stats?.overview?.missedCalls || 0}
          change="-5%"
          trend={trends.missedTrend}
          icon={PhoneMissed}
        />
        <KPICard
          title="Spam Calls"
          value={stats?.overview?.spamCalls || 0}
          change="-15%"
          trend={trends.spamTrend}
          icon={PhoneOutgoing}
        />
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="flex flex-col items-center space-y-2">
            <Clock className="h-8 w-8 text-blue-600" />
            <h3 className="text-sm font-medium text-gray-500">Avg Duration</h3>
            <p className="text-2xl font-bold text-gray-900">
              {stats?.duration?.average || '0:00'}
            </p>
          </div>
        </Card>

        <Card className="p-4 text-center">
          <div className="flex flex-col items-center space-y-2">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <h3 className="text-sm font-medium text-gray-500">Answer Rate</h3>
            <p className="text-2xl font-bold text-gray-900">
              {stats?.overview?.answerRate || 0}%
            </p>
          </div>
        </Card>

        <Card className="p-4 text-center">
          <div className="flex flex-col items-center space-y-2">
            <Users className="h-8 w-8 text-orange-600" />
            <h3 className="text-sm font-medium text-gray-500">Outgoing Calls</h3>
            <p className="text-2xl font-bold text-gray-900">
              {stats?.overview?.outgoingCalls || 0}
            </p>
          </div>
        </Card>

        <Card className="p-4 text-center">
          <div className="flex flex-col items-center space-y-2">
            <TrendingDown className="h-8 w-8 text-red-600" />
            <h3 className="text-sm font-medium text-gray-500">Missed Rate</h3>
            <p className="text-2xl font-bold text-gray-900">
              {stats?.overview?.missedRate || 0}%
            </p>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Call Trends Chart */}
        <Card className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Call Trends</h3>
            <p className="text-sm text-gray-500">Call volume distribution over {period}</p>
          </div>
          {isLoading ? (
            <Skeleton className="h-80 w-full rounded-lg" />
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={formatTrendsData(stats?.trends)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#0088FE" 
                  strokeWidth={2}
                  name="Total Calls"
                  dot={{ r: 3 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="answered" 
                  stroke="#00C49F" 
                  strokeWidth={2}
                  name="Answered Calls"
                  dot={{ r: 3 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="missed" 
                  stroke="#FF8042" 
                  strokeWidth={2}
                  name="Missed Calls"
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Hourly Distribution */}
        <Card className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Hourly Distribution</h3>
            <p className="text-sm text-gray-500">Calls by hour of day</p>
          </div>
          {isLoading ? (
            <Skeleton className="h-80 w-full rounded-lg" />
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={formatHourlyData(stats?.distribution)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="hour" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="calls" 
                  fill="#8884d8" 
                  radius={[4, 4, 0, 0]}
                  name="Calls"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Callers */}
        <Card className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Callers</h3>
            <p className="text-sm text-gray-500">Most frequent callers this {period}</p>
          </div>
          {isLoading ? (
            <Skeleton className="h-64 w-full rounded-lg" />
          ) : stats?.topCallers?.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {stats.topCallers.slice(0, 8).map((caller, index) => (
                <div 
                  key={caller.phoneNumber || index} 
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-sm font-medium text-white flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 truncate">
                        {caller.callerName || 'Unknown Caller'}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {caller.phoneNumber || 'No number'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-gray-900">{caller.callCount} calls</p>
                    {caller.missedCount > 0 && (
                      <p className="text-xs text-red-500">{caller.missedCount} missed</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-gray-500">
              <Users className="h-8 w-8 mb-2" />
              <p>No caller data available</p>
            </div>
          )}
        </Card>

        {/* Duration Analytics */}
        <Card className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Call Duration Analytics</h3>
            <p className="text-sm text-gray-500">Performance metrics for answered calls</p>
          </div>
         
        </Card>
      </div>
    </div>
  );
};

const DurationStat = ({ label, value }) => (
  <div className="text-center p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
    <p className="text-sm font-medium text-gray-600 mb-2">{label}</p>
    <p className="text-xl font-bold text-gray-900">{value}</p>
  </div>
);

export default StatsDashboard;