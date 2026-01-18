'use client';

import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import {
  Users,
  Trophy,
  Medal,
  Star,
  Crown,
  TrendingUp,
  TrendingDown,
  Phone,
  PhoneIncoming,
  PhoneMissed,
  Clock,
  AlertCircle,
  ArrowLeft,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  Loader2,
  RefreshCw,
  UserCheck,
  ShieldAlert
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import Input from "@/components/ui/Input";
import { toast } from "react-hot-toast";
import Link from "next/link";

// ---------- Constants ----------
const PERIOD_OPTIONS = [
  { key: "today", label: "Today" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" }
];

const SORT_OPTIONS = [
  { key: "performance", label: "Performance" },
  { key: "calls", label: "Total Calls" },
  { key: "answerRate", label: "Answer Rate" },
  { key: "name", label: "Name" }
];

const getRankIcon = (index) => {
  switch (index) {
    case 0: return <Crown className="h-6 w-6 text-yellow-500" />;
    case 1: return <Medal className="h-5 w-5 text-gray-400" />;
    case 2: return <Star className="h-5 w-5 text-amber-600" />;
    default: return <span className="text-sm font-medium text-gray-500">{index + 1}</span>;
  }
};

// ---------- Hooks ----------
const useTeamData = (period, sortBy) => {
  return useQuery({
    queryKey: ["team-performance", period, sortBy],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/v1/calls/team/performance?period=${period}&sortBy=${sortBy}`);
      
      if (!data.success) throw new Error(data.message || "Failed to fetch team data");
      return data.data;
    },
    retry: 2,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false
  });
};

const usePendingFollowups = () => {
  return useQuery({
    queryKey: ["team-pending-followups"],
    queryFn: async () => {
      const { data } = await apiClient.get("/api/calls/branch-followup-calls?limit=50");
      
      if (!data.success) throw new Error(data.message || "Failed to fetch followups");
      return {
        count: data.total || 0,
        data: data.data || []
      };
    },
    retry: 1,
    staleTime: 2 * 60 * 1000
  });
};

// ---------- Components ----------
const LoadingOverlay = ({ message = "Loading team data..." }) => (
  <div className="flex flex-col items-center justify-center py-20 space-y-4">
    <div className="relative">
      <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-pulse" />
      </div>
    </div>
    <p className="text-gray-600 font-medium">{message}</p>
  </div>
);

const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-20 space-y-4">
    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
      <ShieldAlert className="w-10 h-10 text-red-600" />
    </div>
    <p className="text-red-600 text-center max-w-md">{message}</p>
    {onRetry && (
      <Button variant="outline" onClick={onRetry} className="flex items-center gap-2">
        <RefreshCw className="w-4 h-4" />
        Retry
      </Button>
    )}
  </div>
);

const TeamMemberCard = ({ member, rank, pendingCount, onViewDetails }) => {
  const performanceScore = useMemo(() => {
    const answerRate = member.answerRate || 0;
    const totalCalls = member.totalCalls || 0;
    const pendingPenalty = (pendingCount || 0) * 3;
    return Math.max(0, (answerRate * 0.8) - pendingPenalty + (totalCalls * 0.05));
  }, [member, pendingCount]);

  const metrics = {
    totalCalls: member.totalCalls || 0,
    answered: member.answeredCalls || 0,
    missed: member.missedCalls || 0,
    outgoing: member.outgoingCalls || 0,
    answerRate: member.answerRate || 0,
    avgDuration: member.averageDuration || "0:00",
    efficiency: Math.round((member.answeredCalls || 0) / (member.totalCalls || 1) * 100)
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300 border border-gray-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: Rank & Profile */}
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            {getRankIcon(rank)}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {member.userName?.charAt(0)?.toUpperCase() || "U"}
              </div>
              {pendingCount > 0 && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {pendingCount}
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-gray-900">{member.userName}</h3>
              <p className="text-sm text-gray-500">{member.userMobile || "No mobile"}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  performanceScore > 80 ? 'bg-green-100 text-green-800' :
                  performanceScore > 60 ? 'bg-blue-100 text-blue-800' :
                  performanceScore > 40 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  Score: {Math.round(performanceScore)}/100
                </div>
                {pendingCount > 0 && (
                  <span className="text-xs text-orange-600 font-medium">
                    {pendingCount} pending
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Center: Metrics */}
        <div className="grid grid-cols-4 md:grid-cols-5 gap-4 md:gap-6 flex-1">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{metrics.totalCalls}</div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{metrics.answered}</div>
            <div className="text-xs text-gray-500">Answered</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{metrics.missed}</div>
            <div className="text-xs text-gray-500">Missed</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{metrics.answerRate}%</div>
            <div className="text-xs text-gray-500">Rate</div>
          </div>
          
          <div className="hidden md:block text-center">
            <div className="text-2xl font-bold text-purple-600">{metrics.avgDuration}</div>
            <div className="text-xs text-gray-500">Avg Time</div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onViewDetails}
            className="flex items-center gap-2"
          >
            <UserCheck className="w-4 h-4" />
            Details
          </Button>
          
          <Button
            variant="primary"
            size="sm"
            onClick={onViewDetails}
          >
            View Performance
          </Button>
        </div>
      </div>
    </Card>
  );
};

const MemberDetailsModal = ({ member, onClose, period }) => {
  const [activeTab, setActiveTab] = useState("overview");

  const metrics = useMemo(() => ({
    totalCalls: member.totalCalls || 0,
    answered: member.answeredCalls || 0,
    missed: member.missedCalls || 0,
    outgoing: member.outgoingCalls || 0,
    answerRate: member.answerRate || 0,
    avgDuration: member.averageDuration || "0:00",
    lastActivity: member.lastActivity || null,
    efficiency: Math.round((member.answeredCalls || 0) / (member.totalCalls || 1) * 100)
  }), [member]);

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
                {member.userName?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{member.userName}</h2>
                <p className="text-gray-500">{member.userMobile || 'No mobile'} • Period: {PERIOD_OPTIONS.find(p => p.key === period)?.label}</p>
              </div>
            </div>
            <Button variant="outline" onClick={onClose} size="sm">
              Close
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4 text-center">
              <div className="text-3xl font-bold text-gray-900">{metrics.totalCalls}</div>
              <div className="text-sm text-gray-500">Total Calls</div>
            </Card>
            
            <Card className="p-4 text-center">
              <div className="text-3xl font-bold text-green-600">{metrics.answered}</div>
              <div className="text-sm text-gray-500">Answered</div>
            </Card>
            
            <Card className="p-4 text-center">
              <div className="text-3xl font-bold text-blue-600">{metrics.answerRate}%</div>
              <div className="text-sm text-gray-500">Answer Rate</div>
            </Card>
            
            <Card className="p-4 text-center">
              <div className="text-3xl font-bold text-purple-600">{metrics.avgDuration}</div>
              <div className="text-sm text-gray-500">Avg Duration</div>
            </Card>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Incoming Calls</span>
                  <span className="font-semibold">{metrics.answered + metrics.missed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Outgoing Calls</span>
                  <span className="font-semibold">{metrics.outgoing}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Missed Calls</span>
                  <span className="font-semibold text-red-600">{metrics.missed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Call Efficiency</span>
                  <span className={`font-semibold ${
                    metrics.efficiency > 80 ? 'text-green-600' :
                    metrics.efficiency > 60 ? 'text-blue-600' :
                    metrics.efficiency > 40 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {metrics.efficiency}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Activity</span>
                  <span className="font-semibold">
                    {metrics.lastActivity ? formatDateIST(metrics.lastActivity) : "No activity"}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribution</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Answered ({metrics.answered})</span>
                    <span>{metrics.totalCalls > 0 ? Math.round((metrics.answered / metrics.totalCalls) * 100) : 0}%</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 transition-all duration-500"
                      style={{ width: `${metrics.totalCalls > 0 ? (metrics.answered / metrics.totalCalls) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Missed ({metrics.missed})</span>
                    <span>{metrics.totalCalls > 0 ? Math.round((metrics.missed / metrics.totalCalls) * 100) : 0}%</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500 transition-all duration-500"
                      style={{ width: `${metrics.totalCalls > 0 ? (metrics.missed / metrics.totalCalls) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Outgoing ({metrics.outgoing})</span>
                    <span>{metrics.totalCalls > 0 ? Math.round((metrics.outgoing / metrics.totalCalls) * 100) : 0}%</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500 transition-all duration-500"
                      style={{ width: `${metrics.totalCalls > 0 ? (metrics.outgoing / metrics.totalCalls) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------- Main Component ----------
const TeamManagementPage = () => {
  const [period, setPeriod] = useState("today");
  const [sortBy, setSortBy] = useState("performance");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch data
  const { 
    data: teamData, 
    isLoading: teamLoading, 
    error: teamError, 
    refetch: refetchTeam 
  } = useTeamData(period, sortBy);
  
  const { 
    data: pendingData, 
    isLoading: pendingLoading 
  } = usePendingFollowups();

  // Handle refresh
  const handleRefresh = useCallback(() => {
    refetchTeam();
    toast.success("Team data refreshed");
  }, [refetchTeam]);

  // Filter and sort members
  const filteredMembers = useMemo(() => {
    if (!teamData) return [];
    
    let members = [...teamData];
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      members = members.filter(member => 
        member.userName?.toLowerCase().includes(query) ||
        member.userMobile?.includes(query)
      );
    }
    
    // Sort
    members.sort((a, b) => {
      switch (sortBy) {
        case "performance":
          const scoreA = (a.answerRate || 0) + (a.totalCalls || 0) / 100;
          const scoreB = (b.answerRate || 0) + (b.totalCalls || 0) / 100;
          return scoreB - scoreA;
        
        case "calls":
          return (b.totalCalls || 0) - (a.totalCalls || 0);
        
        case "answerRate":
          return (b.answerRate || 0) - (a.answerRate || 0);
        
        case "name":
          return (a.userName || "").localeCompare(b.userName || "");
        
        default:
          return 0;
      }
    });
    
    return members;
  }, [teamData, searchQuery, sortBy]);

  // Calculate pending counts by user
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

  // Calculate team summary
  const teamSummary = useMemo(() => {
    if (!filteredMembers.length) return null;
    
    const totalCalls = filteredMembers.reduce((sum, m) => sum + (m.totalCalls || 0), 0);
    const totalAnswered = filteredMembers.reduce((sum, m) => sum + (m.answeredCalls || 0), 0);
    const totalPending = Object.values(pendingByUser).reduce((sum, count) => sum + count, 0);
    const avgAnswerRate = Math.round(
      filteredMembers.reduce((sum, m) => sum + (m.answerRate || 0), 0) / filteredMembers.length
    );
    
    return {
      totalMembers: filteredMembers.length,
      totalCalls,
      totalAnswered,
      totalPending,
      avgAnswerRate,
      topPerformer: filteredMembers[0]?.userName || "N/A"
    };
  }, [filteredMembers, pendingByUser]);

  // Error handling
  if (teamError) {
    return (
      <ErrorState 
        message="Failed to load team data. Please check your connection."
        onRetry={handleRefresh}
      />
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/dashboard" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Team Management</h1>
            <p className="text-gray-600 mt-2">Monitor and manage your team's performance</p>
          </div>
          
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={teamLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${teamLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Filters Bar */}
        <Card className="p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search team members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
                {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
                  <div className="flex flex-wrap gap-2">
                    {PERIOD_OPTIONS.map(({ key, label }) => (
                      <Button
                        key={key}
                        variant={period === key ? "primary" : "outline"}
                        size="sm"
                        onClick={() => setPeriod(key)}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <div className="flex flex-wrap gap-2">
                    {SORT_OPTIONS.map(({ key, label }) => (
                      <Button
                        key={key}
                        variant={sortBy === key ? "primary" : "outline"}
                        size="sm"
                        onClick={() => setSortBy(key)}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Team Summary */}
      {teamSummary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-10 h-10 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{teamSummary.totalMembers}</div>
                <div className="text-sm text-gray-500">Team Members</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Phone className="w-10 h-10 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{teamSummary.totalCalls}</div>
                <div className="text-sm text-gray-500">Total Calls</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-10 h-10 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{teamSummary.avgAnswerRate}%</div>
                <div className="text-sm text-gray-500">Avg Answer Rate</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-10 h-10 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{teamSummary.totalPending}</div>
                <div className="text-sm text-gray-500">Pending Follow-ups</div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Team Leaderboard */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Team Leaderboard</h2>
            <p className="text-gray-500">Ranked by performance</p>
          </div>
          
          <div className="text-sm text-gray-600">
            Showing {filteredMembers.length} members
            {searchQuery && ` for "${searchQuery}"`}
          </div>
        </div>

        {teamLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        ) : filteredMembers.length > 0 ? (
          <div className="space-y-4">
            {filteredMembers.map((member, index) => (
              <TeamMemberCard
                key={member.userId}
                member={member}
                rank={index}
                pendingCount={pendingByUser[member.userId] || 0}
                onViewDetails={() => setSelectedMember(member)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Team Members Found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery ? `No results found for "${searchQuery}"` : "No team data available"}
            </p>
            {searchQuery && (
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            )}
          </div>
        )}
      </Card>

      {/* Performance Insights */}
      {filteredMembers.length > 0 && (
        <Card className="p-6 mt-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Performance Insights</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
              <div className="text-4xl font-bold text-green-600">
                {filteredMembers.filter(m => (m.answerRate || 0) >= 80).length}
              </div>
              <div className="text-lg font-semibold text-green-800 mt-2">High Performers</div>
              <div className="text-sm text-green-600">80%+ Answer Rate</div>
            </div>
            
            <div className="text-center p-6 bg-yellow-50 rounded-xl border border-yellow-200">
              <div className="text-4xl font-bold text-yellow-600">
                {filteredMembers.filter(m => (m.answerRate || 0) >= 60 && (m.answerRate || 0) < 80).length}
              </div>
              <div className="text-lg font-semibold text-yellow-800 mt-2">Average Performers</div>
              <div className="text-sm text-yellow-600">60-80% Answer Rate</div>
            </div>
            
            <div className="text-center p-6 bg-red-50 rounded-xl border border-red-200">
              <div className="text-4xl font-bold text-red-600">
                {filteredMembers.filter(m => (m.answerRate || 0) < 60).length}
              </div>
              <div className="text-lg font-semibold text-red-800 mt-2">Needs Improvement</div>
              <div className="text-sm text-red-600">Below 60% Answer Rate</div>
            </div>
          </div>

          {teamSummary?.totalPending > 0 && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-yellow-800">Attention Required</h4>
                  <p className="text-yellow-700 mt-1">
                    There are {teamSummary.totalPending} pending follow-ups across the team that need attention.
                    Consider scheduling a team review session to address these calls.
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Member Details Modal */}
      {selectedMember && (
        <MemberDetailsModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
          period={period}
        />
      )}
    </div>
  );
};

export default TeamManagementPage;