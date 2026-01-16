'use client';

import { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
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
  ArrowLeft,
  Ban,
  ChevronDown,
  ChevronUp,
  Loader2,
  RefreshCw,
  ShieldAlert,
  PhoneForwarded
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
  Legend,
  Cell
} from "recharts";
import Link from "next/link";
import { toast } from "react-hot-toast";

// ---------- Constants & Helpers ----------
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

const PERIOD_OPTIONS = [
  { key: "today", label: "Today" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" }
];

const getRankIcon = (index) => {
  switch (index) {
    case 0: return <Crown className="h-5 w-5 text-yellow-500" />;
    case 1: return <Medal className="h-4 w-4 text-gray-400" />;
    case 2: return <Star className="h-4 w-4 text-amber-600" />;
    default: return <span className="text-xs font-medium text-gray-500">{index + 1}</span>;
  }
};

const formatHour12 = (h) => {
  const hour = Number(h);
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12} ${suffix}`;
};

const formatDuration = (seconds) => {
  if (!seconds || seconds <= 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

const formatDateIST = (dateString) => {
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    }).format(d);
  } catch {
    return "-";
  }
};

// ---------- Custom Hooks ----------
const useUser = () => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // User data now comes from Redux, not localStorage
    // This hook can be removed or simplified
    setUser(null);
  }, []);
  
  return { user, isBranchManager: user?.role === 6 };
};

const usePendingFollowups = () => {
  const { user, isBranchManager } = useUser();
  
  return useQuery({
    queryKey: ["pending-followups"],
    queryFn: async () => {
      try {
        const endpoint = isBranchManager 
          ? "/api/calls/branch-followup-calls?limit=1"
          : "/api/calls/missed?limit=1";
        
        const { data } = await apiClient.get(endpoint);
        
        if (!data.success) throw new Error(data.message || "Failed to fetch followups");
        
        // Return both count and data for detailed view
        return {
          count: data.total || data.data?.length || 0,
          data: data.data || [],
          isBranchManager
        };
      } catch (error) {
        console.error("Error fetching pending followups:", error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false
  });
};

const useDashboardData = (period) => {
  return useQuery({
    queryKey: ["dashboard-stats", period],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/calls/stats?period=${period}`);
      
      if (!data.success) throw new Error(data.message || "Failed to fetch dashboard stats");
      return data.data;
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  });
};

const useTeamData = (period) => {
  return useQuery({
    queryKey: ["team-data", period],
    queryFn: async () => {
      // Fetch both team performance and member stats in parallel
      const [teamRes, memberRes] = await Promise.all([
        apiClient.get(`/api/calls/team/performance?period=${period}`),
        apiClient.get(`/api/calls/team/member-stats?period=${period}`)
      ]);
      
      if (!teamRes.data.success || !memberRes.data.success) {
        throw new Error("Failed to fetch team data");
      }
      
      return {
        teamPerformance: teamRes.data.data,
        memberStats: memberRes.data.data
      };
    },
    retry: 1,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false
  });
};

// ---------- Data Transformers ----------
const transformTrendsData = (trends = [], period = "today") => {
  if (!Array.isArray(trends) || trends.length === 0) {
    // Return empty dataset with proper structure
    if (period === "today") {
      return Array.from({ length: 24 }, (_, h) => ({
        name: formatHour12(h),
        total: 0,
        answered: 0,
        missed: 0,
        outgoing: 0
      }));
    }
    return [];
  }

  const byKey = new Map();
  
  trends.forEach(item => {
    const total = Number(item.callCount || 0);
    const answered = Number(item.answeredCount || 0);
    const missed = Number(item.missedCount || 0);
    const outgoing = Math.max(total - answered - missed, 0);
    
    if (period === "today") {
      const hour = Number(item._id);
      if (hour >= 0 && hour <= 23) {
        byKey.set(hour, { 
          name: formatHour12(hour), 
          total, answered, missed, outgoing 
        });
      }
    } else if (period === "week") {
      const dayIdx = Number(item._id);
      const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      if (dayIdx >= 0 && dayIdx <= 6) {
        byKey.set(dayIdx, {
          name: dayLabels[dayIdx],
          total, answered, missed, outgoing
        });
      }
    } else if (period === "month") {
      const day = Number(item._id);
      if (day >= 1 && day <= 31) {
        byKey.set(day, {
          name: `Day ${day}`,
          total, answered, missed, outgoing
        });
      }
    }
  });
  
  // Fill missing data points
  if (period === "today") {
    return Array.from({ length: 24 }, (_, h) => {
      const data = byKey.get(h) || { name: formatHour12(h), total: 0, answered: 0, missed: 0, outgoing: 0 };
      return { ...data, hour: h };
    });
  }
  
  if (period === "week") {
    const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return dayLabels.map((label, idx) => {
      const data = byKey.get(idx) || { name: label, total: 0, answered: 0, missed: 0, outgoing: 0 };
      return { ...data, dayIndex: idx };
    });
  }
  
  // Month - return what we have
  return Array.from(byKey.values()).sort((a, b) => {
    const aDay = parseInt(a.name.replace("Day ", ""));
    const bDay = parseInt(b.name.replace("Day ", ""));
    return aDay - bDay;
  });
};

const transformHourlyDistribution = (distribution = []) => {
  if (!Array.isArray(distribution)) {
    return Array.from({ length: 24 }, (_, h) => ({
      hourLabel: formatHour12(h),
      hour: h,
      calls: 0
    }));
  }
  
  return distribution
    .map(item => {
      let hour;
      if (typeof item._id === "number") {
        hour = item._id;
      } else if (typeof item.hour === "number") {
        hour = item.hour;
      } else if (typeof item.hour === "string") {
        hour = parseInt(item.hour.split(":")[0]) || 0;
      } else {
        hour = 0;
      }
      
      return {
        hourLabel: formatHour12(hour),
        hour,
        calls: Number(item.calls || item.count || 0)
      };
    })
    .sort((a, b) => a.hour - b.hour);
};

// ---------- Components ----------
const LoadingOverlay = ({ message = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center py-12 space-y-4">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-pulse" />
      </div>
    </div>
    <p className="text-gray-600 font-medium">{message}</p>
  </div>
);

const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-12 space-y-4">
    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
      <ShieldAlert className="w-8 h-8 text-red-600" />
    </div>
    <p className="text-red-600 text-center">{message}</p>
    {onRetry && (
      <Button variant="outline" onClick={onRetry} className="flex items-center gap-2">
        <RefreshCw className="w-4 h-4" />
        Retry
      </Button>
    )}
  </div>
);

const MetricTile = ({ icon, label, value, trend, color = "text-gray-900", loading = false }) => (
  <Card className="p-4 text-center transition-all hover:shadow-md">
    {loading ? (
      <Skeleton className="h-8 w-8 mx-auto mb-2 rounded-full" />
    ) : (
      <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${color.replace('text-')} bg-opacity-10`}>
        {icon}
      </div>
    )}
    <h3 className="text-sm font-medium text-gray-500 mb-1">{label}</h3>
    {loading ? (
      <Skeleton className="h-6 w-16 mx-auto" />
    ) : (
      <>
        <p className={`text-xl font-bold ${color}`}>{value}</p>
        {trend && (
          <div className={`inline-flex items-center gap-1 text-xs mt-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend)}%
          </div>
        )}
      </>
    )}
  </Card>
);

const TeamMemberRow = ({ member, rank, pendingFollowups, onClick }) => {
  const performanceScore = useMemo(() => {
    const answerRate = member.answerRate || 0;
    const totalCalls = member.totalCalls || 0;
    const pendingPenalty = (pendingFollowups || 0) * 5;
    return Math.max(0, (answerRate * 0.7) - pendingPenalty + (totalCalls * 0.1));
  }, [member, pendingFollowups]);
  
  return (
    <div
      className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all group"
      onClick={() => onClick(member)}
    >
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="flex-shrink-0 w-8 text-center">
          {getRankIcon(rank)}
        </div>
        
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
              {member.userName?.charAt(0)?.toUpperCase() || "U"}
            </div>
            {pendingFollowups > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {pendingFollowups}
              </div>
            )}
          </div>
          
          <div className="min-w-0">
            <h4 className="font-semibold text-gray-900 truncate">{member.userName}</h4>
            <p className="text-xs text-gray-500 truncate">{member.userMobile || "No mobile"}</p>
          </div>
        </div>
      </div>
      
      <div className="flex gap-4 sm:gap-6 text-sm w-full sm:w-auto justify-between sm:justify-end">
        <div className="text-center">
          <div className="font-bold text-gray-900">{member.totalCalls || 0}</div>
          <div className="text-xs text-gray-500">Total</div>
        </div>
        
        <div className="text-center">
          <div className="font-bold text-green-600">{member.answeredCalls || 0}</div>
          <div className="text-xs text-gray-500">Answered</div>
        </div>
        
        <div className="text-center">
          <div className="font-bold text-blue-600">{member.answerRate ? `${Math.round(member.answerRate)}%` : "0%"}</div>
          <div className="text-xs text-gray-500">Rate</div>
        </div>
        
        <div className="text-center">
          <div className="font-bold text-purple-600">{member.averageDuration || "0:00"}</div>
          <div className="text-xs text-gray-500">Avg Time</div>
        </div>
        
        <div className="hidden sm:block">
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            performanceScore > 80 ? 'bg-green-100 text-green-800' :
            performanceScore > 60 ? 'bg-blue-100 text-blue-800' :
            performanceScore > 40 ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {Math.round(performanceScore)}/100
          </div>
        </div>
      </div>
    </div>
  );
};

const IndividualMemberView = ({ member, onBack, period }) => {
  const { data: memberStats, isLoading } = useQuery({
    queryKey: ["member-details", member.userId, period],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/calls/team/member-stats?period=${period}`);
      
      if (data.success) {
        return data.data.teamStats?.find(m => m.userId === member.userId) || member;
      }
      return member;
    },
    initialData: member
  });
  
  const stats = memberStats || member;
  
  const metrics = useMemo(() => {
    const totalCalls = Number(stats.totalCalls || 0);
    const answered = Number(stats.answeredCalls || 0);
    const missed = Number(stats.missedCalls || 0);
    const outgoing = Number(stats.outgoingCalls || 0);
    const incomingTotal = answered + missed;
    const answerRate = Number(stats.answerRate || 0);
    const avgDuration = stats.averageDuration || "0:00";
    
    return {
      totalCalls,
      answered,
      missed,
      outgoing,
      incomingTotal,
      answerRate,
      avgDuration,
      efficiency: totalCalls > 0 ? Math.round((answered / totalCalls) * 100) : 0
    };
  }, [stats]);
  
  if (isLoading) {
    return <LoadingOverlay message="Loading member details..." />;
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Team
        </Button>
        
        <div className="text-sm text-gray-500">
          Period: {PERIOD_OPTIONS.find(p => p.key === period)?.label}
        </div>
      </div>
      
      {/* Profile Card */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {stats.userName?.charAt(0)?.toUpperCase() || "U"}
              </div>
              {/* <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-lg">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  metrics.efficiency > 80 ? 'bg-green-100 text-green-600' :
                  metrics.efficiency > 60 ? 'bg-blue-100 text-blue-600' :
                  metrics.efficiency > 40 ? 'bg-yellow-100 text-yellow-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  {metrics.efficiency}%
                </div>
              </div> */}
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{stats.userName}</h2>
              <p className="text-gray-500 text-sm">{stats.userMobile || 'No mobile'}</p>
            </div>
          </div>
          
          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{metrics.totalCalls}</div>
              <div className="text-sm text-gray-500">Total Calls</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{metrics.answered}</div>
              <div className="text-sm text-gray-500">Answered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{metrics.missed}</div>
              <div className="text-sm text-gray-500">Missed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{metrics.answerRate}%</div>
              <div className="text-sm text-gray-500">Answer Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{metrics.avgDuration}</div>
              <div className="text-sm text-gray-500">Avg Duration</div>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Breakdown</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Incoming Calls Total</span>
              <span className="font-semibold">{metrics.incomingTotal}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Outgoing Calls</span>
              <span className="font-semibold">{metrics.outgoing}</span>
            </div>
            {/* <div className="flex justify-between items-center">
              <span className="text-gray-600">Call Efficiency</span>
              <span className={`font-semibold ${
                metrics.efficiency > 80 ? 'text-green-600' :
                metrics.efficiency > 60 ? 'text-blue-600' :
                metrics.efficiency > 40 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {metrics.efficiency}%
              </span>
            </div> */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Last Activity</span>
              <span className="font-semibold">
                {stats.lastActivity ? formatDateIST(stats.lastActivity) : "No activity"}
              </span>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Call Distribution</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Answered Calls</span>
                <span className="font-medium">{metrics.answered} ({metrics.totalCalls > 0 ? Math.round((metrics.answered / metrics.totalCalls) * 100) : 0}%)</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${metrics.totalCalls > 0 ? (metrics.answered / metrics.totalCalls) * 100 : 0}%` }}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Missed Calls</span>
                <span className="font-medium">{metrics.missed} ({metrics.totalCalls > 0 ? Math.round((metrics.missed / metrics.totalCalls) * 100) : 0}%)</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500 rounded-full transition-all duration-500"
                  style={{ width: `${metrics.totalCalls > 0 ? (metrics.missed / metrics.totalCalls) * 100 : 0}%` }}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Outgoing Calls</span>
                <span className="font-medium">{metrics.outgoing} ({metrics.totalCalls > 0 ? Math.round((metrics.outgoing / metrics.totalCalls) * 100) : 0}%)</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${metrics.totalCalls > 0 ? (metrics.outgoing / metrics.totalCalls) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

// ---------- Main Component ----------
const CombinedDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [period, setPeriod] = useState("today");
  const [selectedTeamMember, setSelectedTeamMember] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { user, isBranchManager } = useUser();
  
  // Data hooks
  const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError, refetch: refetchDashboard } = useDashboardData(period);
  const { data: teamData, isLoading: teamLoading, error: teamError, refetch: refetchTeam } = useTeamData(period);
  const { data: pendingData, isLoading: pendingLoading, error: pendingError, refetch: refetchPending } = usePendingFollowups();
  
  // Handle team member selection
  const handleTeamMemberClick = useCallback((member) => {
    setSelectedTeamMember(member);
    setActiveTab("overview");
  }, []);
  
  const handleBackToTeam = useCallback(() => {
    setSelectedTeamMember(null);
  }, []);
  
  // Refresh all data
  const handleRefreshAll = useCallback(() => {
    refetchDashboard();
    refetchTeam();
    refetchPending();
    toast.success("Dashboard refreshed");
  }, [refetchDashboard, refetchTeam, refetchPending]);
  
  // Calculate team summary
  const teamSummary = useMemo(() => {
    if (!teamData?.teamPerformance || !Array.isArray(teamData.teamPerformance)) {
      return null;
    }
    
    const team = teamData.teamPerformance;
    const totalCalls = team.reduce((sum, m) => sum + (m.totalCalls || 0), 0);
    const totalAnswered = team.reduce((sum, m) => sum + (m.answeredCalls || 0), 0);
    const totalMissed = team.reduce((sum, m) => sum + (m.missedCalls || 0), 0);
    const avgAnswerRate = team.length > 0 
      ? Math.round(team.reduce((sum, m) => sum + (m.answerRate || 0), 0) / team.length)
      : 0;
    
    return {
      totalMembers: team.length,
      totalCalls,
      totalAnswered,
      totalMissed,
      avgAnswerRate,
      topPerformer: team[0]?.userName || "N/A",
      totalPending: pendingData?.count || 0
    };
  }, [teamData, pendingData]);
  
  // Transform chart data
  const trendsData = useMemo(() => 
    transformTrendsData(dashboardData?.trends, period),
    [dashboardData?.trends, period]
  );
  
  const hourlyData = useMemo(() => 
    transformHourlyDistribution(dashboardData?.distribution),
    [dashboardData?.distribution]
  );
  
  // Top callers for branch manager
  const topCallers = useMemo(() => 
    dashboardData?.topCallers?.slice(0, 5) || [],
    [dashboardData?.topCallers]
  );
  
  // Error handling
  if (dashboardError || teamError) {
    return (
      <ErrorState 
        message="Failed to load dashboard data. Please check your connection."
        onRetry={handleRefreshAll}
      />
    );
  }
  
  // Show individual member view
  if (selectedTeamMember) {
    return (
      <IndividualMemberView
        member={selectedTeamMember}
        onBack={handleBackToTeam}
        period={period}
      />
    );
  }
  
  return (
    <div className="space-y-6 animate-fade-in p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Call Center Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            {isBranchManager ? "Branch Manager Dashboard" : "Agent Performance Dashboard"}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Mobile Menu Toggle */}
          <div className="sm:hidden">
            <Button
              variant="outline"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-full flex items-center justify-between"
            >
              <span>{isMobileMenuOpen ? "Close Menu" : "Open Menu"}</span>
              {isMobileMenuOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
          
          {/* Tab Switcher */}
          <div className={`${isMobileMenuOpen ? 'flex' : 'hidden'} sm:flex gap-2 bg-gray-100 p-1 rounded-lg flex-col sm:flex-row`}>
            {[
              { key: "overview", label: "Overview", icon: BarChart3 },
              { key: "team", label: "Team", icon: Users }
            ].map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                variant={activeTab === key ? "primary" : "outline"}
                onClick={() => {
                  setActiveTab(key);
                  setIsMobileMenuOpen(false);
                }}
                size="sm"
                className="flex items-center gap-2 justify-center"
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Button>
            ))}
            
            <Button
              variant="outline"
              onClick={handleRefreshAll}
              size="sm"
              className="flex items-center gap-2 justify-center"
              disabled={dashboardLoading || teamLoading}
            >
              <RefreshCw className={`w-4 h-4 ${dashboardLoading || teamLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
          </div>
          
          {/* Period Selector */}
          <div className={`${isMobileMenuOpen ? 'flex' : 'hidden'} sm:flex gap-1 bg-gray-100 p-1 rounded-lg flex-col sm:flex-row`}>
            {PERIOD_OPTIONS.map(({ key, label }) => (
              <Button
                key={key}
                variant={period === key ? "primary" : "outline"}
                onClick={() => {
                  setPeriod(key);
                  setIsMobileMenuOpen(false);
                }}
                size="sm"
                disabled={dashboardLoading || teamLoading}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      {activeTab === "overview" ? (
        <OverviewTab
          dashboardData={dashboardData}
          dashboardLoading={dashboardLoading}
          teamSummary={teamSummary}
          teamData={teamData}
          teamLoading={teamLoading}
          pendingData={pendingData}
          pendingLoading={pendingLoading}
          period={period}
          trendsData={trendsData}
          hourlyData={hourlyData}
          topCallers={topCallers}
          isBranchManager={isBranchManager}
          onTeamMemberClick={handleTeamMemberClick}
          onViewTeam={() => setActiveTab("team")}
        />
      ) : (
        <TeamPerformanceTab
          teamData={teamData}
          teamLoading={teamLoading}
          pendingData={pendingData}
          onTeamMemberClick={handleTeamMemberClick}
          isBranchManager={isBranchManager}
        />
      )}
    </div>
  );
};

// ---------- Tab Components ----------
const OverviewTab = ({
  dashboardData,
  dashboardLoading,
  teamSummary,
  teamData,
  teamLoading,
  pendingData,
  pendingLoading,
  period,
  trendsData,
  hourlyData,
  topCallers,
  isBranchManager,
  onTeamMemberClick,
  onViewTeam
}) => {
  const stats = dashboardData?.overview || {};
  
  return (
    <>
      {/* KPIs Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Link href="/dashboard/trackly" className="col-span-1">
          <KPICard
            title="Total Calls"
            value={stats.totalCalls || 0}
            icon={Phone}
            loading={dashboardLoading}
            trend={5}
          />
        </Link>
        
        <KPICard
          title="Answered"
          value={stats.answeredCalls || 0}
          icon={PhoneIncoming}
          loading={dashboardLoading}
          color="green"
          trend={2}
        />
        
        <KPICard
          title="Missed"
          value={stats.missedCalls || 0}
          icon={PhoneMissed}
          loading={dashboardLoading}
          color="red"
          trend={-1}
        />
        
        <Link href="/dashboard/trackly/spam-numbers" className="col-span-1">
          <KPICard
            title="Spam"
            value={stats.spamCalls || 0}
            icon={Ban}
            loading={dashboardLoading}
            color="orange"
          />
        </Link>
        
        <Link href="/dashboard/trackly/followup-calls" className="col-span-1">
          <KPICard
            title="Pending Follow-ups"
            value={pendingData?.count || 0}
            icon={AlertCircle}
            loading={pendingLoading}
            color="yellow"
          />
        </Link>
      </div>
      
      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="grid grid-cols-2 md:grid-cols-2 md:col-span-2 gap-4">
          <MetricTile
            icon={<Clock className="w-6 h-6 text-blue-600" />}
            label="Avg Duration"
            value={dashboardData?.duration?.average || "0:00"}
            loading={dashboardLoading}
            color="text-blue-600"
          />
          
          <MetricTile
            icon={<TrendingUp className="w-6 h-6 text-green-600" />}
            label="Answer Rate"
            value={`${stats.answerRate || 0}%`}
            loading={dashboardLoading}
            color="text-green-600"
          />
          
          <MetricTile
            icon={<PhoneOutgoing className="w-6 h-6 text-purple-600" />}
            label="Outgoing"
            value={stats.outgoingCalls || 0}
            loading={dashboardLoading}
            color="text-purple-600"
          />
          
          <MetricTile
            icon={<TrendingDown className="w-6 h-6 text-red-600" />}
            label="Missed Rate"
            value={`${stats.missedRate || 0}%`}
            loading={dashboardLoading}
            color="text-red-600"
          />
        </div>
        
        {/* Team Summary */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">Team Summary</h3>
          </div>
          
          {teamLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : teamSummary ? (
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Team Members</span>
                <span className="font-semibold">{teamSummary.totalMembers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Calls</span>
                <span className="font-semibold">{teamSummary.totalCalls}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Answer Rate</span>
                <span className="font-semibold text-green-600">{teamSummary.avgAnswerRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pending Follow-ups</span>
                <span className="font-semibold text-orange-600">{teamSummary.totalPending}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Top Performer</span>
                <span className="font-semibold text-blue-600">{teamSummary.topPerformer}</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No team data available</p>
          )}
          
          <Button
            variant="outline"
            className="w-full mt-6"
            onClick={onViewTeam}
            disabled={teamLoading}
          >
            View Full Team Report
          </Button>
        </Card>
      </div>
      
      {/* Top Performers */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Top Performers</h3>
            <p className="text-sm text-gray-500">Best performing team members this period</p>
          </div>
          <Button variant="outline" size="sm" onClick={onViewTeam}>
            View All Team
          </Button>
        </div>
        
        {teamLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : teamData?.teamPerformance?.length ? (
          <div className="space-y-3">
            {teamData.teamPerformance.slice(0, 3).map((member, index) => (
              <TeamMemberRow
                key={member.userId}
                member={member}
                rank={index}
                pendingFollowups={pendingData?.data?.filter(call => call.userId === member.userId).length || 0}
                onClick={onTeamMemberClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No team performance data available</p>
          </div>
        )}
      </Card>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Call Trends */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Call Trends</h3>
            <span className="text-sm text-gray-500 capitalize">{period}</span>
          </div>
          
          {dashboardLoading ? (
            <Skeleton className="h-64 w-full rounded-lg" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  stroke="#888"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#888"
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  name="Total Calls"
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="answered" 
                  name="Answered"
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="missed" 
                  name="Missed"
                  stroke="#ef4444" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="outgoing" 
                  name="Outgoing"
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>
        
        {/* Hourly Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Hourly Distribution</h3>
          
          {dashboardLoading ? (
            <Skeleton className="h-64 w-full rounded-lg" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="hourLabel" 
                  tick={{ fontSize: 12 }}
                  stroke="#888"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#888"
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value) => [`${value} calls`, 'Call Volume']}
                  labelFormatter={(label) => `Hour: ${label}`}
                />
                <Bar 
                  dataKey="calls" 
                  name="Calls"
                  radius={[4, 4, 0, 0]}
                >
                  {hourlyData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={entry.calls > 10 ? '#3b82f6' : entry.calls > 5 ? '#60a5fa' : '#93c5fd'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>
      
      {/* Top Callers (Branch Manager Only) */}
      {isBranchManager && topCallers.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Callers</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Caller</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Total Calls</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Missed</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Last Call</th>
                </tr>
              </thead>
              <tbody>
                {topCallers.map((caller, index) => (
                  <tr key={caller.phoneNumber} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <PhoneForwarded className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{caller.callerName}</div>
                          <div className="text-sm text-gray-500">{caller.phoneNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">
                      <div className="font-semibold">{caller.callCount}</div>
                    </td>
                    <td className="text-center py-3 px-4">
                      <div className={`font-semibold ${caller.missedCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {caller.missedCount}
                      </div>
                    </td>
                    <td className="text-center py-3 px-4 text-sm text-gray-600">
                      {caller.lastCall ? formatDateIST(caller.lastCall) : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </>
  );
};

const TeamPerformanceTab = ({
  teamData,
  teamLoading,
  pendingData,
  onTeamMemberClick,
  isBranchManager
}) => {
  const teamMembers = teamData?.teamPerformance || [];
  const pendingByUser = useMemo(() => {
    const map = {};
    if (pendingData?.data) {
      pendingData.data.forEach(call => {
        const userId = call.userId?._id || call.userId;
        if (userId) {
          map[userId] = (map[userId] || 0) + 1;
        }
      });
    }
    return map;
  }, [pendingData]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard 
          title="Team Members" 
          value={teamMembers.length} 
          icon={Users} 
          loading={teamLoading} 
        />
        <KPICard 
          title="Total Calls" 
          value={teamMembers.reduce((sum, m) => sum + (m.totalCalls || 0), 0)} 
          icon={Phone} 
          loading={teamLoading} 
        />
        <KPICard 
          title="Avg Answer Rate" 
          value={`${
            teamMembers.length 
              ? Math.round(teamMembers.reduce((s, m) => s + (m.answerRate || 0), 0) / teamMembers.length)
              : 0
          }%`} 
          icon={TrendingUp} 
          loading={teamLoading} 
        />
        <KPICard 
          title="Pending Follow-ups" 
          value={pendingData?.count || 0} 
          icon={AlertCircle} 
          loading={false} 
          color="yellow"
        />
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Team Leaderboard</h3>
            <p className="text-gray-500">Ranked by overall performance score</p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-100 rounded-full"></div>
              <span className="text-xs">Answered</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-100 rounded-full"></div>
              <span className="text-xs">Missed</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-100 rounded-full"></div>
              <span className="text-xs">Pending</span>
            </div>
          </div>
        </div>

        {teamLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : teamMembers.length > 0 ? (
          <div className="space-y-3">
            {teamMembers.map((member, index) => (
              <TeamMemberRow
                key={member.userId}
                member={member}
                rank={index}
                pendingFollowups={pendingByUser[member.userId] || 0}
                onClick={onTeamMemberClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No Team Data</h4>
            <p className="text-gray-500 mb-6">No team performance data available for this period</p>
          </div>
        )}

        {teamMembers.length > 10 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Showing {teamMembers.length} team members
            </p>
          </div>
        )}
      </Card>

      {/* Performance Insights */}
      {teamMembers.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {teamMembers.filter(m => (m.answerRate || 0) >= 80).length}
              </div>
              <div className="text-sm text-gray-500">High Performers (80%+)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {teamMembers.filter(m => (m.answerRate || 0) >= 60 && (m.answerRate || 0) < 80).length}
              </div>
              <div className="text-sm text-gray-500">Average Performers (60-80%)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">
                {teamMembers.filter(m => (m.answerRate || 0) < 60).length}
              </div>
              <div className="text-sm text-gray-500">Needs Improvement (60%)</div>
            </div>
          </div>
          
          {isBranchManager && pendingData?.count > 0 && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <div>
                  <h4 className="font-medium text-yellow-800">Attention Required</h4>
                  <p className="text-sm text-yellow-700">
                    There are {pendingData.count} pending follow-ups that need attention.
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}
    </>
  );
};

export default CombinedDashboard;