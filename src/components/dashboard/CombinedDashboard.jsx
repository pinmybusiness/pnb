// components/dashboard/CombinedDashboard.jsx
"use client";

import { useState, useMemo } from "react";
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
  UserCheck,
  AlertCircle,
  CheckCircle,
  Calendar,
  ArrowLeft
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

const getPerformanceBadge = (score) => {
  if (score >= 80) return { color: "text-green-600", bg: "bg-green-100", label: "Excellent" };
  if (score >= 60) return { color: "text-yellow-600", bg: "bg-yellow-100", label: "Good" };
  if (score >= 40) return { color: "text-orange-600", bg: "bg-orange-100", label: "Average" };
  return { color: "text-red-600", bg: "bg-red-100", label: "Needs Improvement" };
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

// Format date to "17 Jul 2025 02:45 PM"
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('en', { month: 'short' });
  const year = date.getFullYear();
  const time = date.toLocaleString('en', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
  return `${day} ${month} ${year} ${time}`;
};

const CombinedDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [period, setPeriod] = useState("today");
  const [selectedTeamMember, setSelectedTeamMember] = useState(null);

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

  // Fetch team member detailed stats
  const { data: teamMemberStats, isLoading: memberStatsLoading } = useQuery({
    queryKey: ['team-member-stats', period],
    queryFn: async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/calls/team/member-stats?period=${period}`,
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        return response.data.data;
      } catch (error) {
        console.error('Error fetching team member stats:', error);
        throw error;
      }
    },
    retry: 2
  });

  // Fetch missed calls (pending follow-ups)
  const { data: missedCallsData, isLoading: missedCallsLoading } = useQuery({
    queryKey: ['missed-calls', period],
    queryFn: async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/calls/missed`,
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        return response.data.data;
      } catch (error) {
        console.error('Error fetching missed calls:', error);
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

  // Calculate real team stats from actual data
  const teamSummary = teamData && teamData.length > 0 ? {
    totalMembers: teamData.length,
    totalCalls: teamData.reduce((sum, member) => sum + (member.totalCalls || 0), 0),
    topPerformer: teamData[0]?.userName || 'N/A',
    avgAnswerRate: teamData.length > 0 ? Math.round(teamData.reduce((sum, member) => sum + (member.answerRate || 0), 0) / teamData.length) : 0
  } : null;

  // Calculate pending follow-ups count for each team member from missedCallsData
  const memberPendingFollowups = useMemo(() => {
    if (!missedCallsData || !Array.isArray(missedCallsData)) return {};
    
    const pendingCounts = {};
    
    missedCallsData.forEach(call => {
      if (call.receiver && call.receiver._id) {
        const receiverId = call.receiver._id;
        pendingCounts[receiverId] = (pendingCounts[receiverId] || 0) + 1;
      }
    });
    
    return pendingCounts;
  }, [missedCallsData]);

  // Get pending follow-ups count for a specific member
  const getMemberPendingFollowups = (userId) => {
    return memberPendingFollowups[userId] || 0;
  };

  // Handle team member click
  const handleTeamMemberClick = (member) => {
    setSelectedTeamMember(member);
    setActiveTab("overview");
  };

  // Handle back to team view
  const handleBackToTeam = () => {
    setSelectedTeamMember(null);
  };

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
        <div className="flex items-center gap-3">
          {selectedTeamMember && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackToTeam}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Team
            </Button>
          )}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {selectedTeamMember ? `${selectedTeamMember.userName}'s Performance` : "Call Center Dashboard"}
            </h1>
            <p className="text-sm sm:text-base text-gray-500">
              {selectedTeamMember 
                ? "Individual performance analytics and insights" 
                : activeTab === "overview" 
                  ? "Complete call analytics and insights" 
                  : "Team performance and rankings"
              }
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Tab Switcher - Only show when no team member is selected */}
          {!selectedTeamMember && (
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
          )}

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

      {/* INDIVIDUAL TEAM MEMBER VIEW */}
      {selectedTeamMember && (
        <IndividualMemberView
          member={selectedTeamMember}
          stats={teamMemberStats?.teamStats?.find(m => m.userId === selectedTeamMember.userId)}
          loading={memberStatsLoading}
          period={period}
          pendingFollowups={getMemberPendingFollowups(selectedTeamMember.userId)}
        />
      )}

      {/* OVERVIEW TAB - Only show when no team member is selected */}
      {!selectedTeamMember && activeTab === "overview" && (
        <OverviewTab
          stats={stats}
          statsLoading={statsLoading}
          teamData={teamData}
          teamLoading={teamLoading}
          teamMemberStats={teamMemberStats}
          memberStatsLoading={memberStatsLoading}
          missedCallsData={missedCallsData}
          missedCallsLoading={missedCallsLoading}
          period={period}
          onTeamMemberClick={handleTeamMemberClick}
          getMemberPendingFollowups={getMemberPendingFollowups}
          setActiveTab={setActiveTab}
        />
      )}

      {/* TEAM PERFORMANCE TAB - Only show when no team member is selected */}
      {!selectedTeamMember && activeTab === "team" && (
        <TeamPerformanceTab
          teamData={teamData}
          teamLoading={teamLoading}
          onTeamMemberClick={handleTeamMemberClick}
          getMemberPendingFollowups={getMemberPendingFollowups}
        />
      )}
    </div>
  );
};

// Individual Team Member View Component
const IndividualMemberView = ({ member, stats, loading, period, pendingFollowups }) => {
  const performance = getPerformanceBadge(member.performanceScore || 0);

  return (
    <>
      {/* Member Header Card */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {member.userName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{member.userName}</h2>
              <p className="text-gray-600">{member.userRole || 'Team Member'} • {member.userMobile || 'No mobile'}</p>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${performance.bg} ${performance.color}`}>
                {performance.label} • {Math.round(member.performanceScore || 0)}% Performance
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">{member.totalCalls || 0}</div>
              <div className="text-sm text-gray-500">Total Calls</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{member.answeredCalls || 0}</div>
              <div className="text-sm text-gray-500">Answered</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{member.missedCalls || 0}</div>
              <div className="text-sm text-gray-500">Missed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{member.answerRate || 0}%</div>
              <div className="text-sm text-gray-500">Answer Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{pendingFollowups || 0}</div>
              <div className="text-sm text-gray-500">Pending Follow-ups</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Member Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-4 w-full" />)}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Call Duration</span>
                <span className="font-semibold">{stats?.averageDuration || member.averageDuration || '0:00'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Outgoing Calls</span>
                <span className="font-semibold">{member.outgoingCalls || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Last Activity</span>
                <span className="font-semibold">
                  {member.lastActivity ? formatDate(member.lastActivity) : 'No activity'}
                </span>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Overall Performance Score</span>
                  <span className="font-semibold">{Math.round(member.performanceScore || 0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="h-3 rounded-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-500" 
                    style={{ width: `${Math.min(member.performanceScore || 0, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Recent Activity & Trends */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Summary</h3>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-4 w-full" />)}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <PhoneIncoming className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Successful Calls</span>
                </div>
                <span className="font-semibold text-green-600">{member.answeredCalls || 0}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <PhoneMissed className="h-4 w-4 text-red-600" />
                  <span className="text-sm">Missed Calls</span>
                </div>
                <span className="font-semibold text-red-600">{member.missedCalls || 0}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <PhoneOutgoing className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">Outgoing Calls</span>
                </div>
                <span className="font-semibold text-orange-600">{member.outgoingCalls || 0}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm">Pending Follow-ups</span>
                </div>
                <span className="font-semibold text-yellow-600">{pendingFollowups || 0}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  <span className="text-sm">Answer Rate</span>
                </div>
                <span className="font-semibold text-purple-600">{member.answerRate || 0}%</span>
              </div>
            </div>
          )}
        </Card>
      </div>
    </>
  );
};

// Overview Tab Component
const OverviewTab = ({ 
  stats, 
  statsLoading, 
  teamData, 
  teamLoading, 
  teamMemberStats, 
  memberStatsLoading, 
  missedCallsData,
  missedCallsLoading,
  period, 
  onTeamMemberClick,
  getMemberPendingFollowups,
  setActiveTab
}) => {
  const teamSummary = teamData && teamData.length > 0 ? {
    totalMembers: teamData.length,
    totalCalls: teamData.reduce((sum, member) => sum + (member.totalCalls || 0), 0),
    topPerformer: teamData[0]?.userName || 'N/A',
    avgAnswerRate: teamData.length > 0 ? Math.round(teamData.reduce((sum, member) => sum + (member.answerRate || 0), 0) / teamData.length) : 0
  } : null;

  return (
    <>
      {/* Main KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Calls"
          value={stats?.overview?.totalCalls || 0}
          icon={Phone}
          loading={statsLoading}
        />
        <KPICard
          title="Answered"
          value={stats?.overview?.answeredCalls || 0}
          icon={PhoneIncoming}
          loading={statsLoading}
        />
        <KPICard
          title="Unanswered Incoming Calls"
          value={stats?.overview?.missedCalls || 0}
          icon={PhoneMissed}
          loading={statsLoading}
        />
        <KPICard
          title="Pending Follow-ups"
          value={missedCallsData?.length || 0}
          icon={AlertCircle}
          loading={missedCallsLoading}
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

      {/* Team Member Performance - ROW STYLE */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Team Member Performance</h3>
          <div className="flex gap-2">
            <span className="text-sm text-gray-500">
              {missedCallsData?.length || 0} pending follow-ups
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setActiveTab("team")}
            >
              View All Team
            </Button>
          </div>
        </div>

        {memberStatsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : teamMemberStats?.teamStats && teamMemberStats.teamStats.length > 0 ? (
          <div className="space-y-3">
            {teamMemberStats.teamStats.map((member, index) => {
              const performance = getPerformanceBadge(member.performanceScore);
              const pendingFollowups = getMemberPendingFollowups(member.userId);
              
              return (
                <div 
                  key={member.userId} 
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onTeamMemberClick(member)}
                >
                  <div className="flex-shrink-0 w-6 text-center">
                    {getRankIcon(index)}
                  </div>
                  
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {member.userName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm">{member.userName}</h4>
                    <p className="text-xs text-gray-500">{member.userRole || 'Team Member'}</p>
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${performance.bg} ${performance.color}`}>
                    {performance.label}
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
                      <div className="font-semibold text-red-600">{member.missedCalls}</div>
                      <div className="text-xs text-gray-500">Missed</div>
                    </div>
                    <div>
                      <div className="font-semibold text-blue-600">{member.answerRate}%</div>
                      <div className="text-xs text-gray-500">Rate</div>
                    </div>
                    <div>
                      <div className="font-semibold text-orange-600">{pendingFollowups}</div>
                      <div className="text-xs text-gray-500">Pending</div>
                    </div>
                    <div>
                      <div className="font-semibold text-purple-600">{Math.round(member.performanceScore)}%</div>
                      <div className="text-xs text-gray-500">Score</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No team member data available</p>
          </div>
        )}
      </Card>

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
    </>
  );
};

// Team Performance Tab Component - SIMPLIFIED WITHOUT CARDS
const TeamPerformanceTab = ({ 
  teamData, 
  teamLoading, 
  onTeamMemberClick,
  getMemberPendingFollowups
}) => {
  return (
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
          value={`${teamData?.length > 0 ? Math.round(teamData.reduce((sum, member) => sum + (member.answerRate || 0), 0) / teamData.length) : 0}%`}
          icon={TrendingUp}
          loading={teamLoading}
        />
        <KPICard
          title="Best Performer"
          value={teamData?.[0]?.userName || 'N/A'}
          icon={Trophy}
          loading={teamLoading}
        />
      </div>

      {/* Team Leaderboard - CLEAN ROW STYLE */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Team Leaderboard</h3>
        
        {teamLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : teamData && teamData.length > 0 ? (
          <div className="space-y-3">
            {teamData.map((member, index) => {
              const pendingFollowups = getMemberPendingFollowups(member.userId);
              const performance = getPerformanceBadge(member.performanceScore);
              
              return (
                <div 
                  key={member.userId} 
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onTeamMemberClick(member)}
                >
                  <div className="flex-shrink-0 w-6 text-center">
                    {getRankIcon(index)}
                  </div>
                  
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {member.userName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900">{member.userName}</h4>
                    <p className="text-sm text-gray-500">{member.userMobile || 'No mobile'}</p>
                  </div>

                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${performance.bg} ${performance.color}`}>
                    {performance.label}
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
                    <div>
                      <div className="font-semibold text-yellow-600">{pendingFollowups}</div>
                      <div className="text-xs text-gray-500">Pending</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No team data available</p>
          </div>
        )}
      </Card>
    </>
  );
};

export default CombinedDashboard; 