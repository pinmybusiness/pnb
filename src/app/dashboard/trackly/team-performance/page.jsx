'use client';

import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import {
  Users,
  Phone,
  Search,
  RefreshCw,
  ShieldAlert,
  ArrowUpDown,
  TrendingUp,
  Eye,
} from "lucide-react";
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
import MemberDetailsModal from "@/components/team/MemberDetailsModal";
import TeamStatsExport from "@/components/team/TeamStatsExport";

// ---------- Constants ----------
const PERIOD_OPTIONS = [
  { key: "today", label: "Today" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" }
];

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

// ---------- Main Component ----------
const TeamManagementPage = () => {
  const [period, setPeriod] = useState("week");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("performance");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedMember, setSelectedMember] = useState(null);
    const [showExport, setShowExport] = useState(false);
  

  // Fetch data
  const { 
    data: teamData, 
    isLoading: teamLoading, 
    error: teamError, 
    refetch: refetchTeam 
  } = useTeamData(period);

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
        
        case "calls":
          aValue = a.totalCalls || 0;
          bValue = b.totalCalls || 0;
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

  // Error handling
  if (teamError) {
    return (
      <ErrorState 
        message="Failed to load team data. Please check your connection."
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

           {/* Toggle Export Button */}
            <div className="flex justify-end mt-2">
              <Button
                variant="outline"
                onClick={() => setShowExport(!showExport)}
              >
                {showExport ? "Hide Export Options" : "Show Export Options"}
              </Button>
            </div>
        </div>

        {showExport &&  <TeamStatsExport />}
     
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
                  </div>

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