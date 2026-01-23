'use client';
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { 
  Phone, PhoneCall, PhoneIncoming, PhoneOutgoing, 
  Search, Edit3, ArrowUpDown, User
} from "lucide-react";
import { toast } from "react-hot-toast";
import apiClient from "@/lib/apiClient";
import { 
  Card, Input, Badge, Table, TableHeader, TableBody, 
  TableRow, TableHead, TableCell, Button
} from "@/components/ui";
import { useSelector } from "react-redux";
import CallExport from "@/components/calls/CallExport";
import AudioPlayer from "@/components/calls/AudioPlayer";
import CallerDisplay from "@/components/calls/CallerDisplay";
import TimeDisplay from "@/components/calls/TimeDisplay";
import Pagination from "@/components/ui/Pagination"; // Import reusable pagination

// StatusBadge Component
const StatusBadge = ({ answered }) => {
  const statusConfig = {
    true: { className: "bg-green-100 text-green-800", label: "Answered" },
    false: { className: "bg-red-100 text-red-800", label: "Missed" }
  };

  const { className, label } = statusConfig[answered] || statusConfig.false;

  return (
    <Badge className={`px-2 py-1 text-xs font-medium rounded-full ${className}`}>
      {label}
    </Badge>
  );
};

// DirectionBadge Component
const DirectionBadge = ({ inbound }) => {
  const directionConfig = {
    true: { className: "bg-blue-100 text-blue-800", icon: PhoneIncoming, label: "Incoming" },
    false: { className: "bg-purple-100 text-purple-800", icon: PhoneOutgoing, label: "Outgoing" }
  };

  const { className, icon: Icon, label } = directionConfig[inbound] || directionConfig.true;

  return (
    <Badge className={`px-2 py-1 text-xs font-medium rounded-full ${className}`}>
      <div className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {label}
      </div>
    </Badge>
  );
};

const CallTracking = () => {
  // State Management
  const [calls, setCalls] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [answeredFilter, setAnsweredFilter] = useState("all");
  const [inboundFilter, setInboundFilter] = useState("all");
  const [agentFilter, setAgentFilter] = useState("all");
  const [sortBy, setSortBy] = useState("startTime");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState([]);
  const [agentsLoading, setAgentsLoading] = useState(false);
  const [showExport, setShowExport] = useState(false);
  
  // Pagination State
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
    hasMore: false
  });

  const { user } = useSelector((state) => state.auth);

  // Refs
  const debounceTimerRef = useRef(null);

  // Filter Options
  const answeredOptions = [
    { value: "all", label: "All Status" },
    { value: "true", label: "Answered" },
    { value: "false", label: "Missed" },
  ];

  const inboundOptions = [
    { value: "all", label: "All Directions" },
    { value: "true", label: "Incoming" },
    { value: "false", label: "Outgoing" },
  ];

  // Data Mapping - WITH RECORDING SUPPORT
  const mapCallData = useCallback((call) => {
    // Handle recordingUrl - could be string or array
    let recordingUrl = null;
    if (call.recordingUrl) {
      if (Array.isArray(call.recordingUrl) && call.recordingUrl.length > 0) {
        recordingUrl = call.recordingUrl[0]; // Take first recording
      } else if (typeof call.recordingUrl === 'string') {
        recordingUrl = call.recordingUrl;
      }
    }

    return {
      id: call._id,
      caller: {
        name: call.phonebookName,
        phone: call.fromNumber,
        formattedPhone: call.fromFormattedNumber
      },
      receiver: {
        name: call.userId?.name || "Unknown",
        id: call.userId?._id
      },
      duration: call.duration ? formatSeconds(call.duration) : "0:00",
      answered: call.answered,
      inbound: call.inbound,
      startTime: call.startTime,
      notes: call.notes || "",
      isSpam: call.isSpam || false,
      recordingUrl: recordingUrl, // Processed recording URL
      followUp: call.followUp || { status: 0, attempts: 0 }
    };
  }, []);

  // Format seconds to MM:SS
  const formatSeconds = (seconds) => {
    if (!seconds || seconds <= 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Debounced Search
  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchTerm(value);
    }, 1000);
  }, []);

  // Fetch Agents
  const fetchAgents = useCallback(async () => {
    try {
      setAgentsLoading(true);
      const res = await apiClient.get("/api/v1/calls/branch-agents");

      console.log("AGENTS API RESPONSE 👉", res.data);

      setAgents(res.data.data || []);
    } catch (error) {
      console.error("AGENT API ERROR 👉", error.response || error);
      toast.error("Failed to load agents");
    } finally {
      setAgentsLoading(false);
    }
  }, []);

  // Agent Options
  const agentOptions = useMemo(() => {
    return [
      { value: "all", label: "All Agents" },
      ...agents.map(agent => ({
        value: agent._id,   // 🔑 THIS IS IMPORTANT
        label: agent.name,
      })),
    ];
  }, [agents]);

  // API Calls
  const fetchCalls = useCallback(async (pageNum = 1) => {
    try {
      setLoading(true);

      const params = {
        page: pageNum,
        limit: pagination.limit,
        search: debouncedSearchTerm,
        answered: answeredFilter !== "all" ? answeredFilter : undefined,
        inbound: inboundFilter !== "all" ? inboundFilter : undefined,
        agent: agentFilter !== "all" ? agentFilter : undefined,
        sortBy: sortBy, 
        sortOrder: sortOrder,
      };

      const response = await apiClient.get('/api/v1/calls/branch', {
        params,
      });

      const { data: callsData, total, currentPage, totalPages } = response.data;
      const mappedCalls = callsData.map(mapCallData);

      setCalls(mappedCalls);
      
      // Update pagination state
      setPagination(prev => ({
        ...prev,
        page: currentPage,
        total: total,
        pages: totalPages,
        hasMore: currentPage < totalPages
      }));

    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch call data");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, answeredFilter, inboundFilter, agentFilter, sortBy, sortOrder, mapCallData, pagination.limit]);

  // Handle Page Change
  const handlePageChange = useCallback((newPage) => {
    if (newPage < 1 || newPage > pagination.pages || loading) return;
    fetchCalls(newPage);
  }, [pagination.pages, loading, fetchCalls]);

  const addNote = useCallback(async (callId, note) => {
    try {
      await apiClient.patch(`/api/calls/${callId}/notes`, { notes: note });
      setCalls(prev => prev.map(call => 
        call.id === callId ? { ...call, notes: note } : call
      ));
      toast.success("Note added successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add note");
    }
  }, []);

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

  // Effects
  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Reset to page 1 when filters change
    fetchCalls(1);
  }, [debouncedSearchTerm, answeredFilter, inboundFilter, agentFilter, sortBy, sortOrder]);

  return (
    <div className="space-y-4 animate-fade-in p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-start gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Call Tracking Dashboard</h1>
          <p className="text-sm text-gray-500">Monitor and manage all restaurant calls</p>
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

      {/* ================= Export Options UI ================= */}
      {showExport && <CallExport />}

      {/* Filters */}
      <Card className="p-3 sm:p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search calls, numbers, notes..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 text-sm"
            />
          </div>
          <select
            value={answeredFilter}
            onChange={(e) => setAnsweredFilter(e.target.value)}
            className="px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 rounded-md bg-white text-gray-900 text-sm"
          >
            {answeredOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            value={inboundFilter}
            onChange={(e) => setInboundFilter(e.target.value)}
            className="px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 rounded-md bg-white text-gray-900 text-sm"
          >
            {inboundOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            value={agentFilter}
            onChange={(e) => setAgentFilter(e.target.value)}
            className="px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 rounded-md bg-white text-gray-900 text-sm"
          >
            {agentOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Calls Table */}
      <Card>
        {loading && pagination.page === 1 ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            <span className="ml-3 text-sm text-gray-500">Loading calls…</span>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead onClick={() => handleSort("caller")} className="cursor-pointer whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        Caller
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="whitespace-nowrap">Agent</TableHead>
                    <TableHead onClick={() => handleSort("duration")} className="cursor-pointer whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        Duration
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead onClick={() => handleSort("answered")} className="cursor-pointer whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        Status
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="whitespace-nowrap">Direction</TableHead>
                    <TableHead className="cursor-pointer whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        Call At
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="whitespace-nowrap">Recording</TableHead>
                    <TableHead className="whitespace-nowrap">Notes</TableHead>
                    <TableHead className="whitespace-nowrap">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {calls.map((call, index) => (
                    <TableRow key={call.id || index} className="hover:bg-gray-50">
                      <TableCell className="whitespace-nowrap">
                        <CallerDisplay caller={call.caller} />
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="flex-shrink-0 h-6 w-6 sm:h-8 sm:w-8 rounded-md bg-gray-100 flex items-center justify-center">
                            <User className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                          </div>
                          <span className="text-xs sm:text-sm font-medium text-gray-900">{call.receiver.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="text-xs sm:text-sm font-mono text-gray-900">{call.duration}</div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge answered={call.answered} />
                      </TableCell>
                      <TableCell>
                        <DirectionBadge inbound={call.inbound} />
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <TimeDisplay startTime={call.startTime} />
                      </TableCell>
                      <TableCell>
                        <AudioPlayer 
                          recordingUrl={call.recordingUrl} 
                          callId={call.id} 
                        />
                      </TableCell>
                      <TableCell>
                        <div className="text-xs sm:text-sm text-gray-500 truncate max-w-[150px] sm:max-w-[200px]">
                          {call.notes || "No notes"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 sm:gap-2">
                          <button
                            onClick={() => addNote(call.id, prompt("Enter note:") || "New note")}
                            className="p-1 sm:p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors"
                            title="Add Note"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile View */}
            <div className="block sm:hidden space-y-2 p-2">
              {calls.map((call, index) => (
                <Card key={call.id || index} className="p-3 shadow-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <StatusBadge answered={call.answered} />
                        </div>
                        <CallerDisplay caller={call.caller} />
                      </div>
                      <TimeDisplay startTime={call.startTime} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-900">{call.receiver.name}</span>
                        <span className="text-xs text-gray-500">• {call.duration}</span>
                      </div>
                      <DirectionBadge inbound={call.inbound} />
                    </div>
                    
                    {/* Recording in Mobile */}
                    <div className="border-t pt-2">
                      <AudioPlayer 
                        recordingUrl={call.recordingUrl} 
                        callId={call.id} 
                      />
                    </div>

                    <div className="text-xs text-gray-500 truncate">
                      <strong>Notes:</strong> {call.notes || "No notes"}
                    </div>
                    <div className="flex gap-2 justify-end mt-1">
                      <button
                        onClick={() => addNote(call.id, prompt("Enter note:") || "New note")}
                        className="p-1 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded transition-colors"
                        title="Add Note"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* No Data State */}
        {calls.length === 0 && !loading && (
          <div className="p-6 sm:p-12 text-center">
            <PhoneCall className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-2 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">No calls found</h3>
            <p className="text-xs sm:text-sm text-gray-500">
              {searchTerm || answeredFilter !== "all" || inboundFilter !== "all" || agentFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Get started by adding your first call"}
            </p>
          </div>
        )}
      </Card>

      {/* Reusable Pagination Component */}
      {calls.length > 0 && (
        <Pagination
          pagination={pagination}
          onPageChange={handlePageChange}
          loading={loading}
          itemsLabel="calls"
          showItemsCount={true}
          showPageInfo={true}
          className="mt-4"
        />
      )}
    </div>
  );
};

export default CallTracking;