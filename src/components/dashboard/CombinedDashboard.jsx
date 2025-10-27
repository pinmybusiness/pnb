// components/dashboard/CombinedDashboard.jsx
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Phone,
  PhoneMissed,
  PhoneIncoming,
  PhoneOutgoing,
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  Trophy,
  Medal,
  Star,
  Crown,
  BarChart3,
  UserCheck
} from "lucide-react";
import KPICard from "@/components/ui/KPICard";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
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
} from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const CombinedDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [period, setPeriod] = useState("today");

  // Fetch dashboard stats
  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['dashboard-stats', period],
    queryFn: async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/calls/stats?period=${period}`,
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        return response.data.data;
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        throw error;
      }
    },
    retry: 2
  });

  // Fetch team performance
  const { data: teamData, isLoading: teamLoading, error: teamError } = useQuery({
    queryKey: ['team-performance', period],
    queryFn: async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/calls/team/performance?period=${period}`,
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        return response.data.data;
      } catch (error) {
        console.error('Error fetching team performance:', error);
        throw error;
      }
    },
    retry: 2
  });

  const periodButtons = [
    { key: "today", label: "Today" },
    { key: "week", label: "This Week" },
    { key: "month", label: "This Month" },
  ];

  const tabButtons = [
    { key: "overview", label: "Overview", icon: BarChart3 },
    { key: "team", label: "Team Performance", icon: Users },
  ];

  // Helper functions
  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 1:
        return <Medal className="h-4 w-4 text-gray-400" />;
      case 2:
        return <Star className="h-4 w-4 text-amber-600" />;
      default:
        return <span className="text-xs font-medium text-gray-500">{index + 1}</span>;
    }
  };

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

  const formatHourlyData = (distribution) => {
    if (!distribution || !Array.isArray(distribution)) return [];
    return distribution.map(item => ({
      hour: item.hour,
      calls: item.calls || 0
    }));
  };

  // Calculate quick team stats for overview tab
  const teamSummary = teamData && teamData.length > 0 ? {
    totalMembers: teamData.length,
    totalCalls: teamData.reduce((sum, member) => sum + (member.totalCalls || 0), 0),
    topPerformer: teamData[0]?.userName?.split(' ')[0] || 'N/A',
    avgAnswerRate: Math.round(teamData.reduce((sum, member) => sum + (member.answerRate || 0), 0) / teamData.length)
  } : null;

  // Show errors if any
  if (statsError || teamError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-red-500 text-lg">Error loading dashboard data</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Reload Page
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Call Center Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-500">
            {activeTab === "overview" ? "Complete call analytics and insights" : "Team performance and rankings"}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Tab Switcher */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            {tabButtons.map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                variant={activeTab === key ? "primary" : "outline"}
                onClick={() => setActiveTab(key)}
                size="sm"
                className="text-xs"
                disabled={statsLoading || teamLoading}
              >
                <Icon className="h-3 w-3 mr-1" />
                {label}
              </Button>
            ))}
          </div>

          {/* Period Selector */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            {periodButtons.map(({ key, label }) => (
              <Button
                key={key}
                variant={period === key ? "primary" : "outline"}
                onClick={() => setPeriod(key)}
                size="sm"
                className="text-xs"
                disabled={statsLoading || teamLoading}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <>
          {/* Main KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title="Total Calls"
              value={stats?.overview?.totalCalls || 0}
              change="+12%"
              trend="up"
              icon={Phone}
              loading={statsLoading}
            />
            <KPICard
              title="Answered"
              value={stats?.overview?.answeredCalls || 0}
              change="+8%"
              trend="up"
              icon={PhoneIncoming}
              loading={statsLoading}
            />
            <KPICard
              title="Missed Calls"
              value={stats?.overview?.missedCalls || 0}
              change="-5%"
              trend="down"
              icon={PhoneMissed}
              loading={statsLoading}
            />
            <KPICard
              title="Spam Calls"
              value={stats?.overview?.spamCalls || 0}
              change="-15%"
              trend="down"
              icon={PhoneOutgoing}
              loading={statsLoading}
            />
          </div>

          {/* Performance Metrics & Team Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Performance Metrics */}
            <div className="lg:col-span-2 grid grid-cols-2 gap-4">
              <Card className="p-4 text-center">
                {statsLoading ? (
                  <Skeleton className="h-8 w-8 mx-auto mb-2 rounded-full" />
                ) : (
                  <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                )}
                <h3 className="text-sm font-medium text-gray-500">Avg Duration</h3>
                {statsLoading ? (
                  <Skeleton className="h-6 w-16 mx-auto mt-1" />
                ) : (
                  <p className="text-xl font-bold text-gray-900">
                    {stats?.duration?.average || '0:00'}
                  </p>
                )}
              </Card>
              
              <Card className="p-4 text-center">
                {statsLoading ? (
                  <Skeleton className="h-8 w-8 mx-auto mb-2 rounded-full" />
                ) : (
                  <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                )}
                <h3 className="text-sm font-medium text-gray-500">Answer Rate</h3>
                {statsLoading ? (
                  <Skeleton className="h-6 w-16 mx-auto mt-1" />
                ) : (
                  <p className="text-xl font-bold text-gray-900">
                    {stats?.overview?.answerRate || 0}%
                  </p>
                )}
              </Card>
              
              <Card className="p-4 text-center">
                {statsLoading ? (
                  <Skeleton className="h-8 w-8 mx-auto mb-2 rounded-full" />
                ) : (
                  <UserCheck className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                )}
                <h3 className="text-sm font-medium text-gray-500">Outgoing Calls</h3>
                {statsLoading ? (
                  <Skeleton className="h-6 w-16 mx-auto mt-1" />
                ) : (
                  <p className="text-xl font-bold text-gray-900">
                    {stats?.overview?.outgoingCalls || 0}
                  </p>
                )}
              </Card>
              
              <Card className="p-4 text-center">
                {statsLoading ? (
                  <Skeleton className="h-8 w-8 mx-auto mb-2 rounded-full" />
                ) : (
                  <TrendingDown className="h-8 w-8 text-red-600 mx-auto mb-2" />
                )}
                <h3 className="text-sm font-medium text-gray-500">Missed Rate</h3>
                {statsLoading ? (
                  <Skeleton className="h-6 w-16 mx-auto mt-1" />
                ) : (
                  <p className="text-xl font-bold text-gray-900">
                    {stats?.overview?.missedRate || 0}%
                  </p>
                )}
              </Card>
            </div>

            {/* Team Quick Summary */}
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Team Summary</h3>
              </div>
              
              {teamLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ) : teamSummary ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Team Members</span>
                    <span className="font-semibold">{teamSummary.totalMembers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Calls</span>
                    <span className="font-semibold">{teamSummary.totalCalls}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Avg Answer Rate</span>
                    <span className="font-semibold text-green-600">{teamSummary.avgAnswerRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Top Performer</span>
                    <span className="font-semibold text-orange-600">{teamSummary.topPerformer}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No team data available</p>
              )}
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-4"
                onClick={() => setActiveTab("team")}
                disabled={teamLoading}
              >
                View Full Team Report
              </Button>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Call Trends Chart */}
            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Call Trends</h3>
              {statsLoading ? (
                <Skeleton className="h-64 w-full rounded-lg" />
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={formatTrendsData(stats?.trends)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="total" stroke="#0088FE" strokeWidth={2} name="Total Calls" />
                    <Line type="monotone" dataKey="answered" stroke="#00C49F" strokeWidth={2} name="Answered" />
                    <Line type="monotone" dataKey="missed" stroke="#FF8042" strokeWidth={2} name="Missed" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </Card>

            {/* Hourly Distribution */}
            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Hourly Distribution</h3>
              {statsLoading ? (
                <Skeleton className="h-64 w-full rounded-lg" />
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={formatHourlyData(stats?.distribution)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="calls" fill="#8884d8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card>
          </div>

          {/* Quick Team Leaderboard */}
          {!teamLoading && teamData && teamData.length > 0 && (
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Top Performers</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setActiveTab("team")}
                >
                  View All
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {teamData.slice(0, 3).map((member, index) => (
                  <div key={member.userId} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                      {getRankIcon(index)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-gray-900 truncate text-sm">
                        {member.userName}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {member.totalCalls} calls • {Math.round(member.answerRate || 0)}% rate
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}

      {/* TEAM PERFORMANCE TAB */}
      {activeTab === "team" && (
        <>
          {/* Team Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title="Team Members"
              value={teamData?.length || 0}
              icon={Users}
              loading={teamLoading}
            />
            <KPICard
              title="Total Calls"
              value={teamData?.reduce((sum, member) => sum + (member.totalCalls || 0), 0) || 0}
              icon={Phone}
              loading={teamLoading}
            />
            <KPICard
              title="Avg Answer Rate"
              value={`${
                teamData && teamData.length > 0 
                  ? Math.round(teamData.reduce((sum, member) => sum + (member.answerRate || 0), 0) / teamData.length)
                  : 0
              }%`}
              icon={TrendingUp}
              loading={teamLoading}
            />
            <KPICard
              title="Best Performer"
              value={teamData && teamData.length > 0 ? teamData[0]?.userName?.split(' ')[0] : 'N/A'}
              icon={Trophy}
              loading={teamLoading}
            />
          </div>

          {/* Top 3 Performers */}
          {!teamLoading && teamData && teamData.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {teamData.slice(0, 3).map((member, index) => (
                <Card key={member.userId} className="p-4 text-center relative">
                  {index === 0 && <Trophy className="h-5 w-5 text-yellow-500 absolute top-3 right-3" />}
                  
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-3">
                    {getRankIcon(index)}
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">
                    {member.userName}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">
                    {member.totalCalls} calls • {Math.round(member.answerRate || 0)}% rate
                  </p>
                  
                  <div className="flex justify-center gap-4 text-xs">
                    <div>
                      <div className="font-semibold text-green-600">{member.answeredCalls}</div>
                      <div className="text-gray-500">Answered</div>
                    </div>
                    <div>
                      <div className="font-semibold text-red-600">{member.missedCalls}</div>
                      <div className="text-gray-500">Missed</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Full Team Table */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Team Leaderboard</h3>
            
            {teamLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <Skeleton key={i} className="h-12 w-full rounded-lg" />
                ))}
              </div>
            ) : teamData && teamData.length > 0 ? (
              <div className="space-y-3">
                {teamData.map((member, index) => (
                  <div key={member.userId} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex-shrink-0 w-6 text-center">
                      {getRankIcon(index)}
                    </div>
                    
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {member.userName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm truncate">
                        {member.userName}
                      </h4>
                      <p className="text-xs text-gray-500 truncate">
                        {member.userMobile || 'No mobile'}
                      </p>
                    </div>
                    
                    <div className="flex gap-6 text-right">
                      <div>
                        <div className="font-semibold text-gray-900">{member.totalCalls}</div>
                        <div className="text-xs text-gray-500">Total</div>
                      </div>
                      <div>
                        <div className="font-semibold text-green-600">{member.answeredCalls}</div>
                        <div className="text-xs text-gray-500">Answered</div>
                      </div>
                      <div>
                        <div className="font-semibold text-orange-600">{Math.round(member.answerRate || 0)}%</div>
                        <div className="text-xs text-gray-500">Rate</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No team data available</p>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
};

export default CombinedDashboard;