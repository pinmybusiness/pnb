'use client';
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { 
  Phone, PhoneCall, PhoneMissed, PhoneIncoming, PhoneOutgoing, 
  Search, CheckCircle, Star, Edit3, ArrowUpDown, User 
} from "lucide-react";
import KPICard from "@/components/ui/KPICard";
import { toast } from "react-hot-toast";
import axios from "axios";
import { 
  Card, Input, Badge, Table, TableHeader, TableBody, 
  TableRow, TableHead, TableCell 
} from "@/components/ui";

// StatusBadge Component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    missed: { className: "bg-red-100 text-red-800", label: "Missed" },
    answered: { className: "bg-blue-100 text-blue-800", label: "Answered" },
    resolved: { className: "bg-green-100 text-green-800", label: "Resolved" },
    ended: { className: "bg-gray-100 text-gray-800", label: "Ended" }
  };

  const { className, label } = statusConfig[status] || statusConfig.ended;

  return (
    <Badge className={`px-2 py-1 text-xs font-medium rounded-full ${className}`}>
      {label}
    </Badge>
  );
};

// CallerDisplay Component to handle duplicate name/phone
const CallerDisplay = ({ caller }) => {
  const { name, phone } = caller;
  
  const isDuplicate = name === phone || 
                     name === "Unknown" || 
                     name?.includes(phone) || 
                     phone?.includes(name);

  return (
    <div className="flex flex-col items-start">
      <div className="text-sm font-medium text-gray-900">{name}</div>
      {!isDuplicate && (
        <div className="text-xs sm:text-sm text-gray-500">{phone}</div>
      )}
    </div>
  );
};

const CallTracking = () => {
  // State Management
  const [calls, setCalls] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [directionFilter, setDirectionFilter] = useState("all");
  const [agentFilter, setAgentFilter] = useState("all");
  const [sortBy, setSortBy] = useState("timestamp");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [kpiStats, setKpiStats] = useState({
    totalCalls: 0,
    missedCalls: 0,
    answeredCalls: 0,
    resolvedCalls: 0
  });

  // Refs
  const debounceTimerRef = useRef(null);

  // Constants
  const STATUS_MAP = { 0: "missed", 1: "answered", 2: "resolved", 3: "ended" };
  const DIRECTION_MAP = { 0: "incoming", 1: "outgoing" };
  const PRIORITY_MAP = { 0: "normal", 1: "high" };

  // Filter Options
  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "missed", label: "Missed" },
    { value: "answered", label: "Answered" },
    { value: "resolved", label: "Resolved" },
    { value: "ended", label: "Ended" },
  ];

  const directionOptions = [
    { value: "all", label: "All Directions" },
    { value: "incoming", label: "Incoming" },
    { value: "outgoing", label: "Outgoing" },
  ];

  // Data Mapping
  const mapCallData = useCallback((call) => ({
    id: call._id,
    caller: {
      name: call.callerName || call.callerPhone || "Unknown",
      phone: call.callerPhone,
    },
    receiver: {
      name: call.receiver?.name || "Unknown",
    },
    duration: call.duration || "0:00",
    status: STATUS_MAP[call.status] || "answered",
    direction: DIRECTION_MAP[call.direction] || "incoming",
    timestamp: new Date(call.timestamp).toLocaleString("en-IN", {
      dateStyle: "short",
      timeStyle: "short",
    }),
    notes: call.notes || "",
    priority: PRIORITY_MAP[call.priority] || "normal",
  }), []);

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

  // API Calls
  const fetchCalls = useCallback(async (pageNum = 1, shouldAppend = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const params = {
        page: pageNum,
        limit: 20,
        search: debouncedSearchTerm,
        status: statusFilter !== "all" ? statusFilter : undefined,
        direction: directionFilter !== "all" ? directionFilter : undefined,
        agent: agentFilter !== "all" ? agentFilter : undefined,
        sortBy,
        sortOrder,
      };

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/calls`, {
        params,
        withCredentials: true,
      });

      const { data: callsData, stats, total, currentPage, totalPages } = response.data;
      const mappedCalls = callsData.map(mapCallData);

      if (shouldAppend) {
        setCalls(prev => [...prev, ...mappedCalls]);
      } else {
        setCalls(mappedCalls);
      }

      setKpiStats(stats);
      setHasMore(currentPage < totalPages);
      setPage(currentPage);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch call data");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [debouncedSearchTerm, statusFilter, directionFilter, agentFilter, sortBy, sortOrder, mapCallData]);

  // Agent Options
  const agentOptions = useMemo(() => {
    const agents = [...new Set(calls.map((call) => call.receiver.name))].filter(Boolean);
    return [
      { value: "all", label: "All Agents" },
      ...agents.map((name) => ({ value: name, label: name })),
    ];
  }, [calls]);

  // Action Handlers
  const handleUpdateStatus = useCallback(async (callId, status) => {
    try {
      const statusMap = { missed: 0, answered: 1, resolved: 2, ended: 3 };
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/calls/${callId}/status`,
        { status: statusMap[status] },
        { withCredentials: true }
      );
      setCalls(prev => prev.map(call => 
        call.id === callId ? { ...call, status } : call
      ));
      toast.success("Call status updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  }, []);

  const addNote = useCallback(async (callId, note) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/calls/${callId}/notes`,
        { notes: note },
        { withCredentials: true }
      );
      setCalls(prev => prev.map(call => 
        call.id === callId ? { ...call, notes: note } : call
      ));
      toast.success("Note added successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add note");
    }
  }, []);

  const markPriority = useCallback(async (callId, priority) => {
    try {
      const priorityMap = { normal: 0, high: 1 };
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/calls/${callId}/priority`,
        { priority: priorityMap[priority] },
        { withCredentials: true }
      );
      setCalls(prev => prev.map(call => 
        call.id === callId ? { ...call, priority } : call
      ));
      toast.success("Priority updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update priority");
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

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchCalls(page + 1, true);
    }
  }, [loadingMore, hasMore, page, fetchCalls]);

  // Effects
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setPage(1);
    fetchCalls(1, false);
  }, [debouncedSearchTerm, statusFilter, directionFilter, agentFilter, sortBy, sortOrder, fetchCalls]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop 
          >= document.documentElement.offsetHeight - 100) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore]);

  // Loading State
  if (loading && page === 1) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col justify-between items-start gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Call Tracking Dashboard</h1>
          <p className="text-sm text-gray-500">Monitor and manage all restaurant calls</p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 sm:gap-4">
        <KPICard title="Total Calls" value={kpiStats.totalCalls} icon={PhoneCall} />
        <KPICard title="Missed Calls" value={kpiStats.missedCalls} icon={PhoneMissed} />
        <KPICard title="Incoming Answered Calls" value={kpiStats.answeredCalls} icon={Phone} />
        <KPICard title="Resolved Calls" value={kpiStats.resolvedCalls} icon={CheckCircle} />
      </div>

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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 rounded-md bg-white text-gray-900 text-sm"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            value={directionFilter}
            onChange={(e) => setDirectionFilter(e.target.value)}
            className="px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 rounded-md bg-white text-gray-900 text-sm"
          >
            {directionOptions.map((option) => (
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
                <TableHead className="whitespace-nowrap">Receiver</TableHead>
                <TableHead onClick={() => handleSort("duration")} className="cursor-pointer whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    Duration
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort("status")} className="cursor-pointer whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    Status
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="whitespace-nowrap">Direction</TableHead>
                <TableHead onClick={() => handleSort("timestamp")} className="cursor-pointer whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    Time
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="whitespace-nowrap">Notes</TableHead>
                <TableHead className="whitespace-nowrap">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {calls.map((call, index) => (
                <TableRow key={index} className="hover:bg-gray-50">
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 rounded-md bg-gray-100 flex items-center justify-center">
                        <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      </div>
                      <CallerDisplay caller={call.caller} />
                    </div>
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
                    <StatusBadge status={call.status} />
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      {call.direction === "incoming" ? (
                        <PhoneIncoming className="h-4 w-4 text-green-600" />
                      ) : (
                        <PhoneOutgoing className="h-4 w-4 text-blue-600" />
                      )}
                      <span className="text-xs sm:text-sm capitalize">{call.direction}</span>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="text-xs sm:text-sm">
                      <div>{call.timestamp.split(", ")[1]}</div>
                      <div className="text-xs text-gray-500">{call.timestamp.split(", ")[0]}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs sm:text-sm text-gray-500 truncate max-w-[150px] sm:max-w-[200px]">
                      {call.notes || "No notes"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 sm:gap-2">
                      {call.status === "missed" && (
                        <button
                          onClick={() => handleUpdateStatus(call.id, "resolved")}
                          className="p-1 sm:p-2 text-green-600 hover:text-green-800 hover:bg-gray-100 rounded-md transition-colors"
                          title="Resolve"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => addNote(call.id, prompt("Enter note:") || "New note")}
                        className="p-1 sm:p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors"
                        title="Add Note"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => markPriority(call.id, call.priority === "high" ? "normal" : "high")}
                        className="p-1 sm:p-2 text-gray-600 hover:text-yellow-600 hover:bg-gray-100 rounded-md transition-colors"
                        title="Toggle Priority"
                      >
                        <Star className={`h-4 w-4 ${call.priority === "high" ? "fill-yellow-600 text-yellow-600" : ""}`} />
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
            <Card key={index} className="p-3 shadow-sm">
              <div className="space-y-1">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={call.status} />
                    </div>
                    <CallerDisplay caller={call.caller} />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="text-xs text-gray-900">{call.timestamp.split(", ")[1]}</div>
                    <div className="text-xs text-gray-500">{call.timestamp.split(", ")[0]}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-900">{call.receiver.name}</span>
                    <span className="text-xs text-gray-500">• {call.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {call.direction === "incoming" ? (
                      <PhoneIncoming className="h-3 w-3 text-green-600" />
                    ) : (
                      <PhoneOutgoing className="h-3 w-3 text-blue-600" />
                    )}
                    <span className="text-xs capitalize text-gray-600">{call.direction}</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 truncate">
                  Notes: {call.notes || "No notes"}
                </div>
                <div className="flex gap-2 justify-end mt-1">
                  {call.status === "missed" && (
                    <button
                      onClick={() => handleUpdateStatus(call.id, "resolved")}
                      className="p-1 text-green-600 hover:text-green-800 hover:bg-gray-100 rounded transition-colors"
                      title="Resolve"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => addNote(call.id, prompt("Enter note:") || "New note")}
                    className="p-1 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded transition-colors"
                    title="Add Note"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => markPriority(call.id, call.priority === "high" ? "normal" : "high")}
                    className="p-1 text-gray-600 hover:text-yellow-600 hover:bg-gray-100 rounded transition-colors"
                    title="Toggle Priority"
                  >
                    <Star className={`h-4 w-4 ${call.priority === "high" ? "fill-yellow-600 text-yellow-600" : ""}`} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Loading States */}
        {loadingMore && (
          <div className="flex justify-center items-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
            <span className="ml-2 text-sm text-gray-500">Loading more calls...</span>
          </div>
        )}

        {calls.length === 0 && !loading && (
          <div className="p-6 sm:p-12 text-center">
            <PhoneCall className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-2 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">No calls found</h3>
            <p className="text-xs sm:text-sm text-gray-500">
              {searchTerm || statusFilter !== "all" || directionFilter !== "all" || agentFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Get started by adding your first call"}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CallTracking;