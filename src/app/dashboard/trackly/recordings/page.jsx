'use client';
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Mic, Search, ArrowUpDown, User, Phone, Calendar, Download, Clock, Play, Pause, X, Filter } from "lucide-react";
import { toast } from "react-hot-toast";
import apiClient from "@/lib/apiClient";
import { Card, Input, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Button } from "@/components/ui";
import { useSelector } from "react-redux";
import Pagination from "@/components/ui/Pagination";
import AudioPlayer from "@/components/calls/AudioPlayer";
import TimeDisplay from "@/components/calls/TimeDisplay";
import { format } from "date-fns";

// Status Badge Component for Recordings
const RecordingStatusBadge = ({ status }) => {
  const statusConfig = {
    0: { label: "Processing", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    1: { label: "Linked", className: "bg-green-100 text-green-800 border-green-200" },
    2: { label: "Review", className: "bg-orange-100 text-orange-800 border-orange-200" },
    3: { label: "Failed", className: "bg-red-100 text-red-800 border-red-200" }
  };

  const config = statusConfig[status] || statusConfig[0];

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.className}`}>
      {config.label}
    </span>
  );
};

// Recording Card Component for Mobile
const RecordingCard = ({ recording, onPlay }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <Card className="p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Phone className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{recording.fromFormattedNumber || recording.fromNumber}</p>
              <p className="text-xs text-gray-500">{recording.fileName || "Call Recording"}</p>
            </div>
          </div>
          <RecordingStatusBadge status={recording.status} />
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <User className="h-3.5 w-3.5" />
            <span className="truncate">{recording.userId?.name || "Unknown Agent"}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-3.5 w-3.5" />
            <span>{format(new Date(recording.startTime), 'dd MMM yyyy')}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 col-span-2">
            <Clock className="h-3.5 w-3.5" />
            <span>{format(new Date(recording.startTime), 'hh:mm a')}</span>
          </div>
        </div>

        {/* Audio Player */}
        <div className="pt-2 border-t border-gray-100">
          <AudioPlayer 
            recordingUrl={recording.recordingUrl} 
            callId={recording._id}
            onPlayStateChange={setIsPlaying}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-1">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-gray-600 hover:text-gray-900"
            onClick={() => window.open(recording.recordingUrl, '_blank')}
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-blue-600 hover:text-blue-700"
            onClick={() => onPlay(recording)}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            <span className="ml-1">{isPlaying ? 'Pause' : 'Play'}</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

// Filter Bar Component - Updated with only Agent Filter
const FilterBar = ({ filters, onFilterChange, onClearFilters, agents = [], agentsLoading }) => {
  const hasActiveFilters = filters.agent !== 'all' || filters.search;

  // Agent Options
  const agentOptions = useMemo(() => {
    return [
      { value: 'all', label: 'All Agents' },
      ...agents.map(agent => ({
        value: agent._id,
        label: agent.name,
      })),
    ];
  }, [agents]);

  return (
    <Card className="p-4">
      <div className="flex  gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by phone number..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="pl-10 pr-10 text-sm"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange('search', '')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Agent Filter - Only Additional Filter */}
          <div className="relative min-w-[180px]">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <select
              value={filters.agent}
              onChange={(e) => onFilterChange('agent', e.target.value)}
              disabled={agentsLoading}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              {agentOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-gray-600 hover:text-gray-900"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

// Main Component
const CallRecordings = () => {
  // State Management
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState([]);
  const [agentsLoading, setAgentsLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    agent: 'all'
  });
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Pagination State
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
    hasMore: false
  });

  const { user } = useSelector((state) => state.auth);
  const debounceTimerRef = useRef(null);

  // Handle Filter Changes
  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      search: '',
      agent: 'all'
    });
    setDebouncedSearch('');
  }, []);

  // Debounced Search
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 1000);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [filters.search]);

  // Fetch Agents
  const fetchAgents = useCallback(async () => {
    try {
      setAgentsLoading(true);
      const res = await apiClient.get("/api/v1/calls/branch-agents");
      setAgents(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch agents:", error);
      toast.error("Failed to load agents");
    } finally {
      setAgentsLoading(false);
    }
  }, []);

  // Fetch Recordings
  const fetchRecordings = useCallback(async (pageNum = 1) => {
    try {
      setLoading(true);

      const params = {
        page: pageNum,
        limit: pagination.limit,
        search: debouncedSearch,
        agent: filters.agent !== 'all' ? filters.agent : undefined
      };

      const response = await apiClient.get('/api/v1/calls/recordings', { params });

      const { data, pagination: responsePagination } = response.data;

      setRecordings(data);
      setPagination(prev => ({
        ...prev,
        page: responsePagination.page,
        total: responsePagination.total,
        pages: responsePagination.totalPages,
        hasMore: responsePagination.page < responsePagination.totalPages
      }));

    } catch (error) {
      console.error('Fetch recordings error:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch recordings');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, filters.agent, pagination.limit]);

  // Handle Page Change
  const handlePageChange = useCallback((newPage) => {
    if (newPage < 1 || newPage > pagination.pages || loading) return;
    fetchRecordings(newPage);
  }, [pagination.pages, loading, fetchRecordings]);

  // Handle Sort
  const [sortConfig, setSortConfig] = useState({ key: 'startTime', order: 'desc' });

  const handleSort = useCallback((key) => {
    setSortConfig(prev => ({
      key,
      order: prev.key === key && prev.order === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  // Initial Fetch
  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  useEffect(() => {
    fetchRecordings(1);
  }, [debouncedSearch, filters.agent]);

  // Sort Recordings
  const sortedRecordings = useMemo(() => {
    if (!recordings.length) return [];

    return [...recordings].sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      if (sortConfig.key === 'startTime') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }

      if (sortConfig.key === 'status') {
        aVal = a.status;
        bVal = b.status;
      }

      if (aVal < bVal) return sortConfig.order === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [recordings, sortConfig]);

  return (
    <div className="space-y-4 animate-fade-in p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Call Recordings</h1>
          {/* <p className="text-sm text-gray-500">Access and manage all your call recordings</p> */}
        </div>
        
        {/* Stats Summary */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="text-right">
            <p className="text-2xl font-semibold text-gray-900">{pagination.total}</p>
            <p className="text-xs text-gray-500">Total Recordings</p>
          </div>
        </div>
      </div>

      {/* Filters - Updated with only Agent Filter */}
      <FilterBar 
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        agents={agents}
        agentsLoading={agentsLoading}
      />

      {/* Recordings Table/Grid */}
      <Card className="overflow-hidden">
        {loading && pagination.page === 1 ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            <span className="ml-3 text-sm text-gray-500">Loading recordings…</span>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead onClick={() => handleSort('fromNumber')} className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        Phone Number
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead onClick={() => handleSort('userId')} className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        Agent
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    {/* <TableHead onClick={() => handleSort('status')} className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        Status
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead> */}
                    <TableHead onClick={() => handleSort('startTime')} className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        Date & Time
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Recording</TableHead>
                    {/* <TableHead className="text-right">Actions</TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedRecordings.map((recording) => (
                    <TableRow key={recording._id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
                            <Phone className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{recording.fromFormattedNumber || recording.fromNumber}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center">
                            <User className="h-3 w-3 text-gray-600" />
                          </div>
                          <span className="text-sm text-gray-900">{recording.userId?.name || 'Unknown'}</span>
                        </div>
                      </TableCell>
                      {/* <TableCell>
                        <RecordingStatusBadge status={recording.status} />
                      </TableCell> */}
                      <TableCell>
                        <TimeDisplay startTime={recording.startTime} />
                      </TableCell>
                      <TableCell>
                        <AudioPlayer 
                          recordingUrl={recording.recordingUrl} 
                          callId={recording._id}
                        />
                      </TableCell>
                      {/* <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(recording.recordingUrl, '_blank')}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Grid View */}
            <div className="md:hidden space-y-3 p-3">
              {sortedRecordings.map((recording) => (
                <RecordingCard 
                  key={recording._id} 
                  recording={recording}
                  onPlay={(rec) => {
                    // Handle play action if needed
                    console.log('Play recording:', rec);
                  }}
                />
              ))}
            </div>
          </>
        )}

        {/* No Data State */}
        {recordings.length === 0 && !loading && (
          <div className="p-12 text-center">
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Mic className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No recordings found</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              {filters.search || filters.agent !== 'all'
                ? "Try adjusting your search or agent filter to see more results"
                : "Recordings will appear here once calls are recorded"}
            </p>
          </div>
        )}
      </Card>

      {/* Pagination */}
      {recordings.length > 0 && (
        <Pagination
          pagination={pagination}
          onPageChange={handlePageChange}
          loading={loading}
          itemsLabel="recordings"
          showItemsCount={true}
          showPageInfo={true}
          className="mt-4"
        />
      )}
    </div>
  );
};

export default CallRecordings;