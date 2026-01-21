'use client';

import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import {
  Users,
  Trophy,
  Medal,
  Star,
  Phone,
  PhoneIncoming,
  PhoneMissed,
  Clock,
  AlertCircle,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  Loader2,
  RefreshCw,
  UserCheck,
  ShieldAlert,
  ArrowUpDown,
  User,
  TrendingUp,
  CheckCircle,
  MessageSquare,
  Calendar,
  Target,
  BarChart,
  Eye,
  X,
  PhoneOutgoing,
  TrendingDown,
  Download,
  FileText
} from "lucide-react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { 
  Card, 
  Input, 
  Badge, 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell, 
  Button 
} from "@/components/ui";

// ---------- Constants ----------
const PERIOD_OPTIONS = [
  { key: "today", label: "Today" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" }
];

// ---------- Components ----------
const PerformanceBadge = ({ score }) => {
  if (score >= 90) {
    return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
  } else if (score >= 75) {
    return <Badge className="bg-blue-100 text-blue-800">Good</Badge>;
  } else if (score >= 60) {
    return <Badge className="bg-yellow-100 text-yellow-800">Average</Badge>;
  } else {
    return <Badge className="bg-red-100 text-red-800">Needs Improvement</Badge>;
  }
};

const AnswerRateBar = ({ rate }) => {
  const width = Math.min(rate, 100);
  let color = "bg-red-500";
  if (rate >= 90) color = "bg-green-500";
  else if (rate >= 75) color = "bg-blue-500";
  else if (rate >= 60) color = "bg-yellow-500";

  return (
    <div className="flex items-center gap-2 w-24">
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-300`}
          style={{ width: `${width}%` }}
        />
      </div>
      <span className="text-xs font-medium text-gray-700 w-8">{rate}%</span>
    </div>
  );
};

const UserAvatar = ({ name, className = "w-8 h-8" }) => (
  <div className={`flex-shrink-0 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold ${className}`}>
    {(name || 'U').charAt(0).toUpperCase()}
  </div>
);

const LoadingState = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const ErrorState = ({ message, onRetry }) => (
  <Card className="p-12 text-center">
    <ShieldAlert className="h-12 w-12 text-red-400 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load data</h3>
    <p className="text-sm text-gray-500 mb-4">{message}</p>
    {onRetry && (
      <Button variant="outline" onClick={onRetry}>
        <RefreshCw className="h-4 w-4 mr-2" />
        Try Again
      </Button>
    )}
  </Card>
);

// Individual Member Details Modal Component
const MemberDetailsModal = ({ member, onClose }) => {
  const [period, setPeriod] = useState("today");
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [memberStats, setMemberStats] = useState(null);

  // Fetch individual member stats
  const fetchMemberStats = useCallback(async () => {
    if (!member || !member.userId) return;
    
    try {
      setDetailsLoading(true);
      const { data } = await apiClient.get(`/api/v1/calls/team/member-call-counts`, {
        params: { userId: member.userId, period }
      });
      
      if (data.success) {
        setMemberStats(data.data);
      } else {
        toast.error(data.message || "Failed to load member stats");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load member stats");
    } finally {
      setDetailsLoading(false);
    }
  }, [member, period]);

  // Fetch stats when modal opens or period changes
  useMemo(() => {
    if (member) {
      fetchMemberStats();
    }
  }, [member, period, fetchMemberStats]);

  if (!member) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-4">
            <UserAvatar name={member.userName} className="w-12 h-12" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">{member.userName}</h2>
              <p className="text-sm text-gray-500">{member.userMobile || 'No mobile'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Period Selector */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Performance Statistics</h3>
            <div className="flex gap-2">
              {PERIOD_OPTIONS.map((option) => (
                <Button
                  key={option.key}
                  variant={period === option.key ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setPeriod(option.key)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Content */}
        <div className="p-6">
          {detailsLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : memberStats ? (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <Phone className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Total Calls</p>
                      <p className="text-2xl font-bold text-gray-900">{memberStats.totalCalls || 0}</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <PhoneIncoming className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-500">Incoming Calls</p>
                      <p className="text-2xl font-bold text-gray-900">{memberStats.incoming?.total || 0}</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <PhoneOutgoing className="h-6 w-6 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-500">Outgoing Calls</p>
                      <p className="text-2xl font-bold text-gray-900">{memberStats.outgoing?.total || 0}</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-6 w-6 text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-500">Pending Follow-ups</p>
                      <p className="text-2xl font-bold text-gray-900">{memberStats.followUps || 0}</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Detailed Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Incoming Calls Breakdown */}
                <Card className="p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <PhoneIncoming className="h-5 w-5 text-green-600" />
                    Incoming Calls Breakdown
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Incoming</span>
                      <span className="font-bold text-gray-900">{memberStats.incoming?.total || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Answered</span>
                      <span className="font-bold text-green-600">{memberStats.incoming?.answered || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Missed</span>
                      <span className="font-bold text-red-600">{memberStats.incoming?.missed || 0}</span>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Answer Rate</span>
                        <span className="font-bold text-blue-600">
                          {memberStats.incoming?.total > 0 
                            ? Math.round((memberStats.incoming.answered / memberStats.incoming.total) * 100)
                            : 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Outgoing Calls Breakdown */}
                <Card className="p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <PhoneOutgoing className="h-5 w-5 text-purple-600" />
                    Outgoing Calls Breakdown
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Outgoing</span>
                      <span className="font-bold text-gray-900">{memberStats.outgoing?.total || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Connected</span>
                      <span className="font-bold text-green-600">{memberStats.outgoing?.answered || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Failed</span>
                      <span className="font-bold text-red-600">{memberStats.outgoing?.missed || 0}</span>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Connect Rate</span>
                        <span className="font-bold text-blue-600">
                          {memberStats.outgoing?.total > 0 
                            ? Math.round((memberStats.outgoing.answered / memberStats.outgoing.total) * 100)
                            : 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Overall Performance */}
              <Card className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Overall Performance</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">{memberStats.totalCalls || 0}</div>
                    <div className="text-sm text-gray-500 mt-2">Total Calls Handled</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {((memberStats.incoming?.answered || 0) + (memberStats.outgoing?.answered || 0))}
                    </div>
                    <div className="text-sm text-gray-500 mt-2">Successful Calls</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {memberStats.totalCalls > 0 
                        ? Math.round(
                            ((memberStats.incoming?.answered || 0) + (memberStats.outgoing?.answered || 0)) 
                            / memberStats.totalCalls * 100
                          )
                        : 0}%
                    </div>
                    <div className="text-sm text-gray-500 mt-2">Overall Success Rate</div>
                  </div>
                </div>
              </Card>

              {/* Period Info */}
              <div className="text-sm text-gray-500 text-center">
                Showing data for {PERIOD_OPTIONS.find(p => p.key === period)?.label}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No detailed statistics available</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

// ---------- Hooks ----------
const useTeamData = (period) => {
  return useQuery({
    queryKey: ["team-performance", period],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/v1/calls/team/performance?period=${period}`);
      if (!data.success) throw new Error(data.message);
      return data.data;
    },
    retry: 2,
    staleTime: 2 * 60 * 1000,
  });
};

const usePendingFollowups = () => {
  return useQuery({
    queryKey: ["team-pending-followups"],
    queryFn: async () => {
      const { data } = await apiClient.get("/api/calls/branch-followup-calls?limit=50");
      if (!data.success) throw new Error(data.message);
      return {
        count: data.total || 0,
        data: data.data || []
      };
    },
    retry: 1,
    staleTime: 2 * 60 * 1000
  });
};

// ---------- Main Component ----------
const TeamManagementPage = () => {
  const [period, setPeriod] = useState("today");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("performance");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedMember, setSelectedMember] = useState(null);

  // Fetch data
  const { 
    data: teamData, 
    isLoading: teamLoading, 
    error: teamError, 
    refetch: refetchTeam 
  } = useTeamData(period);
  
  const { 
    data: pendingData 
  } = usePendingFollowups();

  // Handle refresh
  const handleRefresh = useCallback(() => {
    refetchTeam();
    toast.success("Team data refreshed");
  }, [refetchTeam]);

  // Sort handler
  const handleSort = useCallback((key) => {
    setSortBy(prev => {
      if (prev === key) {
        setSortOrder(order => order === "asc" ? "desc" : "asc");
      } else {
        setSortOrder("desc");
      }
      return key;
    });
  }, []);

  // View details handler
  const handleViewDetails = useCallback((member) => {
    setSelectedMember(member);
  }, []);

  // Close details modal
  const handleCloseDetails = useCallback(() => {
    setSelectedMember(null);
  }, []);

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
      let aValue, bValue;
      
      switch (sortBy) {
        case "performance":
          aValue = (a.answerRate || 0) + (a.totalCalls || 0) / 100;
          bValue = (b.answerRate || 0) + (b.totalCalls || 0) / 100;
          break;
        
        case "calls":
          aValue = a.totalCalls || 0;
          bValue = b.totalCalls || 0;
          break;
        
        case "answerRate":
          aValue = a.answerRate || 0;
          bValue = b.answerRate || 0;
          break;
        
        case "name":
          aValue = a.userName?.toLowerCase() || "";
          bValue = b.userName?.toLowerCase() || "";
          break;
        
        default:
          return 0;
      }
      
      if (typeof aValue === "string") {
        return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    });
    
    return members;
  }, [teamData, searchQuery, sortBy, sortOrder]);

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
    const totalMissed = filteredMembers.reduce((sum, m) => sum + (m.missedCalls || 0), 0);
    const totalPending = Object.values(pendingByUser).reduce((sum, count) => sum + count, 0);
    const avgAnswerRate = Math.round(
      filteredMembers.reduce((sum, m) => sum + (m.answerRate || 0), 0) / filteredMembers.length
    );
    
    return {
      totalMembers: filteredMembers.length,
      totalCalls,
      totalAnswered,
      totalMissed,
      totalPending,
      avgAnswerRate,
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

  if (teamLoading) {
    return <LoadingState />;
  }

  return (
    <>
      <div className="space-y-4 animate-fade-in p-4 sm:p-6 md:p-8">
        {/* Header */}
        <div className="flex justify-between items-start gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Team Management</h1>
            <p className="text-sm text-gray-500">Monitor and manage your team's performance</p>
          </div>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={teamLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${teamLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* KPI Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 sm:gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Team Members</p>
                <p className="text-2xl font-bold text-gray-900">{teamSummary?.totalMembers || 0}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <Phone className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Calls</p>
                <p className="text-2xl font-bold text-gray-900">{teamSummary?.totalCalls || 0}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Answer Rate</p>
                <p className="text-2xl font-bold text-gray-900">{teamSummary?.avgAnswerRate || 0}%</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending Follow-ups</p>
                <p className="text-2xl font-bold text-gray-900">{teamSummary?.totalPending || 0}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-3 sm:p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search team members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 rounded-md bg-white text-gray-900 text-sm"
            >
              {PERIOD_OPTIONS.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </Card>

        {/* Team Table */}
        <Card>
          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead onClick={() => handleSort("name")} className="cursor-pointer whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      Team Member
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead onClick={() => handleSort("calls")} className="cursor-pointer whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      Total Calls
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="whitespace-nowrap">Answered</TableHead>
                  <TableHead className="whitespace-nowrap">Missed</TableHead>
                  <TableHead onClick={() => handleSort("answerRate")} className="cursor-pointer whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      Answer Rate
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="whitespace-nowrap">Performance</TableHead>
                  <TableHead className="whitespace-nowrap">Pending Follow-ups</TableHead>
                  <TableHead className="whitespace-nowrap">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member, index) => (
                  <TableRow key={member.userId || index} className="hover:bg-gray-50">
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <UserAvatar name={member.userName} />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{member.userName}</div>
                          <div className="text-xs text-gray-500">{member.userMobile || 'No mobile'}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{member.totalCalls || 0}</div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="text-sm text-green-600 font-medium">{member.answeredCalls || 0}</div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="text-sm text-red-600 font-medium">{member.missedCalls || 0}</div>
                    </TableCell>
                    <TableCell>
                      <AnswerRateBar rate={member.answerRate || 0} />
                    </TableCell>
                    <TableCell>
                      <PerformanceBadge score={member.answerRate || 0} />
                    </TableCell>
                    <TableCell>
                      {pendingByUser[member.userId] ? (
                        <Badge className="bg-orange-100 text-orange-800">
                          {pendingByUser[member.userId]} pending
                        </Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-800">All clear</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleViewDetails(member)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="block sm:hidden space-y-2 p-2">
            {filteredMembers.map((member, index) => (
              <Card key={member.userId || index} className="p-3 shadow-sm">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <UserAvatar name={member.userName} />
                      <div>
                        <div className="font-medium text-gray-900">{member.userName}</div>
                        <div className="text-xs text-gray-500">{member.userMobile || 'No mobile'}</div>
                      </div>
                    </div>
                    <PerformanceBadge score={member.answerRate || 0} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{member.totalCalls || 0}</div>
                      <div className="text-xs text-gray-500">Total Calls</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{member.answeredCalls || 0}</div>
                      <div className="text-xs text-gray-500">Answered</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-600">{member.missedCalls || 0}</div>
                      <div className="text-xs text-gray-500">Missed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{member.answerRate || 0}%</div>
                      <div className="text-xs text-gray-500">Answer Rate</div>
                    </div>
                  </div>

                  {pendingByUser[member.userId] && (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                      <span className="text-sm text-orange-600">
                        {pendingByUser[member.userId]} pending follow-ups
                      </span>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2 border-t">
                    <button
                      onClick={() => handleViewDetails(member)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredMembers.length === 0 && !teamLoading && (
            <div className="p-6 sm:p-12 text-center">
              <Users className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-2 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">No team members found</h3>
              <p className="text-xs sm:text-sm text-gray-500">
                {searchQuery 
                  ? "Try adjusting your search criteria"
                  : "No team data available for the selected period"}
              </p>
            </div>
          )}
        </Card>

        {/* Performance Summary */}
        {filteredMembers.length > 0 && (
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Summary</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                <div className="flex items-center gap-3">
                  <Trophy className="h-8 w-8 text-green-600" />
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {filteredMembers.filter(m => (m.answerRate || 0) >= 80).length}
                    </div>
                    <div className="text-sm font-medium text-green-800">High Performers</div>
                    <div className="text-xs text-green-600">80%+ Answer Rate</div>
                  </div>
                </div>
              </div>
              
              <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                <div className="flex items-center gap-3">
                  <Medal className="h-8 w-8 text-yellow-600" />
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">
                      {filteredMembers.filter(m => (m.answerRate || 0) >= 60 && (m.answerRate || 0) < 80).length}
                    </div>
                    <div className="text-sm font-medium text-yellow-800">Average Performers</div>
                    <div className="text-xs text-yellow-600">60-80% Answer Rate</div>
                  </div>
                </div>
              </div>
              
              <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                  <div>
                    <div className="text-2xl font-bold text-red-600">
                      {filteredMembers.filter(m => (m.answerRate || 0) < 60).length}
                    </div>
                    <div className="text-sm font-medium text-red-800">Needs Improvement</div>
                    <div className="text-xs text-red-600">Below 60% Answer Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Member Details Modal */}
      {selectedMember && (
        <MemberDetailsModal
          member={selectedMember}
          onClose={handleCloseDetails}
        />
      )}
    </>
  );
};

export default TeamManagementPage;