'use client';

import { useState, useCallback, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import { Users, Search, Eye, PhoneOutgoing, PhoneIncoming, PhoneMissed } from "lucide-react";
import { 
  Card, 
  Input, 
  Button,
  Badge
} from "@/components/ui";
import MemberDetailsModal from "@/components/team/MemberDetailsModal";
import TeamStatsExport from "@/components/team/TeamStatsExport";
import Pagination from "@/components/ui/Pagination";

// Constants
const PERIOD_OPTIONS = [
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" }
];

const UserAvatar = ({ name }) => (
  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm">
    {(name || 'U').charAt(0).toUpperCase()}
  </div>
);

// Custom Hook for Team Data with Pagination
const useTeamData = (period, page, limit) => {
  return useQuery({
    queryKey: ["team-performance", period, page, limit],
    queryFn: async () => {
      const { data } = await apiClient.get(
        `/api/v1/calls/team/performance?period=${period}&page=${page}&limit=${limit}`
      );
      if (!data.success) throw new Error(data.message);
      return data;
    },
    retry: 1,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
    keepPreviousData: true
  });
};

// Main Component
const TeamManagementPage = () => {
  const [period, setPeriod] = useState("week");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [showExport, setShowExport] = useState(false);
  
  // Pagination State
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
    hasMore: false
  });

  // Fetch data with pagination
  const { 
    data: response, 
    isLoading, 
    error,
    refetch,
    isFetching
  } = useTeamData(period, pagination.page, pagination.limit);

  // ✅ FIXED: useEffect instead of useState
// useEffect mein yeh add karo debug ke liye
useEffect(() => {
  if (response?.pagination) {
    console.log("📊 Pagination from API:", {
      page: response.pagination.page,
      limit: response.pagination.limit,
      total: response.pagination.total,
      totalPages: response.pagination.totalPages,
      hasMore: response.pagination.hasMore
    });
    
    setPagination({
      page: response.pagination.page,
      limit: response.pagination.limit,
      total: response.pagination.total,
      pages: response.pagination.totalPages, // ✅ Ye important hai
      hasMore: response.pagination.hasMore
    });
  }
}, [response]);

// Component mein yeh debug add karo
console.log("📱 Frontend pagination state:", pagination);

  const teamData = response?.data || [];

  // Filter members client-side (search only)
  const filteredMembers = useMemo(() => {
    if (!teamData.length) return [];
    
    let members = [...teamData];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      members = members.filter(member => 
        member.name?.toLowerCase().includes(query) ||
        member.mobile?.includes(query)
      );
    }
    
    return members;
  }, [teamData, searchQuery]);

  // Handlers
  const handleViewDetails = useCallback((member) => {
    setSelectedMember(member);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setSelectedMember(null);
  }, []);

  // Handle Page Change
  const handlePageChange = useCallback((newPage) => {
    if (newPage < 1 || newPage > pagination.pages || isLoading || isFetching) return;
    console.log("Changing to page:", newPage); // Debug log
    setPagination(prev => ({ ...prev, page: newPage }));
  }, [pagination.pages, isLoading, isFetching]);

  // Handle Period Change
  const handlePeriodChange = useCallback((newPeriod) => {
    setPeriod(newPeriod);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1
  }, []);

  // Loading State
  if (isLoading && !response) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="text-sm text-gray-500">Loading team data...</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <Card className="p-8 text-center max-w-md mx-auto mt-8">
        <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load data</h3>
        <p className="text-sm text-gray-600 mb-6">Please check your connection and try again</p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
          <Button onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  // Debug log
  console.log("Current pagination state:", pagination);
  console.log("Should show pagination?", pagination.total > 0 && pagination.pages > 1);

  return (
    <>
      <style jsx>{`
        .team-table {
          table-layout: fixed;
          width: 100%;
        }
        .team-table th, .team-table td {
          vertical-align: middle;
          padding: 0.75rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .member-cell {
          min-width: 200px;
          max-width: 200px;
        }
        .stat-cell {
          min-width: 120px;
          max-width: 120px;
        }
        .action-cell {
          min-width: 80px;
          max-width: 80px;
        }
        @media (max-width: 768px) {
          .member-cell {
            min-width: 150px;
            max-width: 150px;
          }
          .stat-cell {
            min-width: 100px;
            max-width: 100px;
          }
        }
      `}</style>

      <div className="space-y-6 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Team Activity Overview</h1>
            {/* Summary Stats */}
            <div className="flex items-center gap-3 text-sm">
              <Badge variant="outline" className="px-3 py-1">
                {pagination.total} Members
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                Total Calls: {filteredMembers.reduce((sum, m) => sum + (m.totalCalls || 0), 0)}
              </Badge>
            </div>
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

        {showExport && <TeamStatsExport />}

        {/* Filters */}
        <Card className="p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name or mobile number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Period:</label>
                <select
                  value={period}
                  onChange={(e) => handlePeriodChange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {PERIOD_OPTIONS.map((option) => (
                    <option key={option.key} value={option.key}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="h-11"
                >
                  Clear Search
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Team Table */}
        <Card className="overflow-hidden border shadow-sm">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="team-table">
              <thead className="bg-gray-50 border-b border-gray-400">
                <tr>
                  <th className="member-cell text-left px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-semibold text-gray-700">Team Member</span>
                    </div>
                  </th>
                  <th className="stat-cell text-center px-4 py-3">
                    <span className="text-sm font-semibold text-gray-700">Total Calls</span>
                  </th>
                  <th className="stat-cell text-center px-4 py-3">
                    <span className="text-sm font-semibold text-gray-700">Outgoing</span>
                  </th>
                  <th className="stat-cell text-center px-4 py-3">
                    <span className="text-sm font-semibold text-gray-700">Connected</span>
                  </th>
                  <th className="stat-cell text-center px-4 py-3">
                    <span className="text-sm font-semibold text-gray-700">Incoming</span>
                  </th>
                  <th className="stat-cell text-center px-4 py-3">
                    <span className="text-sm font-semibold text-gray-700">Missed</span>
                  </th>
                  <th className="action-cell text-center px-4 py-3">
                    <span className="text-sm font-semibold text-gray-700">Actions</span>
                  </th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-gray-100">
                {filteredMembers.map((member, index) => (
                  <tr key={member.userId || index} className="hover:bg-blue-50/30 transition-colors">
                    <td className="member-cell px-4 py-3">
                      <div className="flex items-center gap-3">
                        <UserAvatar name={member.name} />
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-gray-900 truncate">{member.name}</div>
                          <div className="text-sm text-gray-500 truncate">{member.mobile || 'No mobile'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="stat-cell px-4 py-3 text-center">
                      <span className="text-lg font-bold text-gray-900">{member.totalCalls || 0}</span>
                    </td>
                    <td className="stat-cell px-4 py-3 text-center">
                      <span className="text-lg font-semibold text-blue-600">{member.totalOutgoing || 0}</span>
                    </td>
                    <td className="stat-cell px-4 py-3 text-center">
                      <span className="text-lg font-semibold text-green-600">{member.totalOutgoingConnected || 0}</span>
                    </td>
                    <td className="stat-cell px-4 py-3 text-center">
                      <span className="text-lg font-semibold text-purple-600">{member.totalIncoming || 0}</span>
                    </td>
                    <td className="stat-cell px-4 py-3 text-center">
                      <span className="text-lg font-semibold text-red-600">{member.totalIncomingMissed || 0}</span>
                    </td>
                    <td className="action-cell px-4 py-3 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(member)}
                        className="h-9 w-9 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="block md:hidden">
            <div className="p-4 border-b bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Team Members ({filteredMembers.length})</h3>
                <Badge variant="outline">
                  {period === 'today' ? 'Today' : period === 'week' ? 'This Week' : 'This Month'}
                </Badge>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {filteredMembers.map((member, index) => (
                <div key={member.userId || index} className="p-4 hover:bg-gray-50">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <UserAvatar name={member.name} />
                        <div>
                          <div className="font-semibold text-gray-900">{member.name}</div>
                          <div className="text-sm text-gray-500">{member.mobile || 'No mobile'}</div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(member)}
                        className="h-8 w-8 rounded-full"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="text-2xl font-bold text-gray-900">{member.totalCalls || 0}</div>
                        <div className="text-xs text-gray-600 mt-1">Total Calls</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="text-xl font-semibold text-blue-600">{member.totalOutgoing || 0}</div>
                        <div className="text-xs text-gray-600 mt-1">Outgoing</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
                        <div className="text-xl font-semibold text-green-600">{member.totalOutgoingConnected || 0}</div>
                        <div className="text-xs text-gray-600 mt-1">Connected</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-100">
                        <div className="text-xl font-semibold text-purple-600">{member.totalIncoming || 0}</div>
                        <div className="text-xs text-gray-600 mt-1">Incoming</div>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg border border-red-100">
                        <div className="text-xl font-semibold text-red-600">{member.totalIncomingMissed || 0}</div>
                        <div className="text-xs text-gray-600 mt-1">Missed</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Empty State */}
          {filteredMembers.length === 0 && !isLoading && (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gray-100 mb-4">
                <Users className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery ? "No matching team members" : "No team data available"}
              </h3>
              <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
                {searchQuery 
                  ? "Try adjusting your search terms or clear the search"
                  : "No call data found for the selected period. Try selecting a different period."}
              </p>
              {searchQuery && (
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
              )}
            </div>
          )}

          {/* ✅ FIXED: Pagination - Always show if total > 0 */}
          {!isLoading && pagination.total > 0 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <Pagination
                pagination={pagination}
                onPageChange={handlePageChange}
                loading={isLoading || isFetching}
                itemsLabel="team members"
                showItemsCount={true}
                showPageInfo={true}
              />
            </div>
          )}
        </Card>
      </div>

      {/* Member Details Modal */}
      {selectedMember && (
        <MemberDetailsModal
          member={selectedMember}
          onClose={handleCloseDetails}
          period={period}
        />
      )}
    </>
  );
};

export default TeamManagementPage; 