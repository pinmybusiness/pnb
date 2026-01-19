'use client';
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { 
  PhoneMissed, 
  Search, 
  ArrowUpDown, 
  User, 
  PhoneOutgoing, 
  PhoneIncoming, 
  Filter,
  Check,
  Shield,
  Ban,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import apiClient from "@/lib/apiClient";
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

// ---------- REUSABLE COMPONENTS ----------

// StatusBadge Component (from CallTracking)
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

// DirectionBadge Component (from CallTracking)
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



// CallerDisplay Component (from CallTracking with updates)
const CallerDisplay = ({ caller }) => {
  const { name, phone, formattedPhone } = caller || {};
  
  const cleanName = name?.trim() || "";
  const displayName = cleanName !== "" && cleanName !== phone ? cleanName : null;
  
  const MAX_LEN = 20;
  const shortName =
    displayName && displayName.length > MAX_LEN
      ? displayName.substring(0, MAX_LEN) + "..."
      : displayName;

  return (
    <div className="flex flex-col items-start max-w-[150px] md:max-w-[90px]">
      {displayName && (
        <div
          className="text-sm font-medium text-gray-900 truncate"
          title={displayName}
        >
          {shortName}
        </div>
      )}
      {formattedPhone && (
        <div
          className={`${displayName ? "text-xs text-gray-500" : "text-sm text-gray-900"} truncate`}
          title={formattedPhone}
        >
          {formattedPhone}
        </div>
      )}
    </div>
  );
};

// TimeDisplay Component (from CallTracking)
const TimeDisplay = ({ startTime }) => {
  const indianTime = new Date(startTime);
  
  const timeString = indianTime.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata'
  });
  
  const dateString = indianTime.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    timeZone: 'Asia/Kolkata'
  });

  return (
    <div className="text-xs sm:text-sm">
      <div className="font-medium text-gray-900">{timeString}</div>
      <div className="text-xs text-gray-500">{dateString}</div>
    </div>
  );
};

// FollowUpBadge Component (updated to match design)
const FollowUpBadge = ({ followUp }) => {
  const attempts = followUp?.attempts || 0;
  const status = followUp?.status || 0;

  const followUpConfig = {
    0: { className: "bg-gray-100 text-gray-800 border-gray-300", label: "None" },
    1: { className: "bg-yellow-100 text-yellow-800 border-yellow-300", label: "Pending" },
    2: { className: "bg-blue-100 text-blue-800 border-blue-300", label: "Done" },
    3: { className: "bg-green-100 text-green-800 border-green-300", label: "Resolved" },
    4: { className: "bg-red-100 text-red-800 border-red-300", label: "Ignored" }
  };

  const { className, label } = followUpConfig[status] || followUpConfig[0];

  return (
    <Badge className={`px-2 py-1 text-xs font-medium rounded-full ${className}`}>
      {attempts > 0 ? `${label} (${attempts})` : label}
    </Badge>
  );
};

// ---------- MAIN COMPONENT ----------
const MissedCalls = () => {
  const [calls, setCalls] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedTeamMember, setSelectedTeamMember] = useState("all");
  const [sortBy, setSortBy] = useState("startTime");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [resolvingCallId, setResolvingCallId] = useState(null);

  // Refs
  const debounceTimerRef = useRef(null);

  // Format seconds
  const formatSeconds = useCallback((seconds) => {
    if (!seconds || seconds <= 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }, []);

  // Map call data
const mapCallData = useCallback((call) => {
  if (!call.groupKey) {
    console.warn("Missing groupKey", call);
    return null;
  }

  return {
    id: call.groupKey,
    caller: {
      name: call.phonebookName || "Unknown Caller",
      phone: call.groupKey,
      formattedPhone: call.fromFormattedNumber
    },
    receiver: {
      name: call.userId?.name || "Unassigned"
    },
    answered: call.answered,
    inbound: call.inbound,
    startTime: call.startTime,
    isSpam: call.isSpam,
    followUp: call.followUp || { status: 1, attempts: 0 }
  };
}, []);

  // Debounced search
  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchTerm(value);
    }, 1000);
  }, []);

  // Fetch missed calls
  const fetchMissedCalls = useCallback(async (pageNum = 1, shouldAppend = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      console.log("Fetching missed calls...");
      
      const response = await apiClient.get(`/api/v1/calls/branch-followup-calls`, {
        params: { 
          page: pageNum,
          limit: 20,
          search: debouncedSearchTerm,
          agent: selectedTeamMember !== "all" ? selectedTeamMember : undefined,
          sortBy: sortBy,
          sortOrder: sortOrder
        }
      });
      
      if (response.data.success) {
        const callsData = response.data.data || [];
        const mappedCalls = callsData.map(mapCallData).filter(call => call !== null);
        
        if (shouldAppend) {
          setCalls(prev => [...prev, ...mappedCalls]);
        } else {
          setCalls(mappedCalls);
        }
        
        // For infinite scroll
        const totalPages = Math.ceil((response.data.total || 0) / 20);
        setHasMore(pageNum < totalPages);
        setPage(pageNum);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error(error.response?.data?.message || "Failed to fetch missed calls");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [debouncedSearchTerm, selectedTeamMember, sortBy, sortOrder, mapCallData]);

// refreshCalls FIRST
const refreshCalls = useCallback(() => {
  setPage(1);
  setHasMore(true);
  fetchMissedCalls(1, false);
}, [fetchMissedCalls]);

// then markAsResolved
const markAsResolved = useCallback(async (callId) => {
  try {
    setResolvingCallId(callId);

    const response = await apiClient.patch(
      `/api/v1/calls/followup/by-number/${callId}`
    );

    if (response.data.success) {
      toast.success("Call resolved successfully");
      refreshCalls(); // ✅ safe
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to resolve call");
  } finally {
    setResolvingCallId(null);
  }
}, [refreshCalls]);

// 🔥 3️⃣ then markAsSpam
const markAsSpam = useCallback(async (callId) => {
  if (!window.confirm('Mark this number as spam?')) return;

  try {
    const response = await apiClient.patch(
      `/api/v1/calls/spam/by-number/${encodeURIComponent(callId)}`
    );

    if (response.data.success) {
      toast.success("Number marked as spam");
      refreshCalls(); // ✅ safe
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to mark as spam");
  }
}, [refreshCalls]);


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

  // Load more for infinite scroll
  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchMissedCalls(page + 1, true);
    }
  }, [loadingMore, hasMore, page, fetchMissedCalls]);

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
    fetchMissedCalls(1, false);
  }, [debouncedSearchTerm, selectedTeamMember, sortBy, sortOrder, fetchMissedCalls]);

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


  // KPI data
  const kpiData = useMemo(() => {
    const pending = calls.filter(call => call.followUp.status === 1).length;
    const resolved = calls.filter(call => call.followUp.status === 3).length;
    const total = calls.length;
    const spam = calls.filter(call => call.isSpam).length;
    
    return { total, pending, resolved, spam };
  }, [calls]);

  // Loading state
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
      <div className="flex justify-between items-start gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Missed Calls Dashboard</h1>
          <p className="text-sm text-gray-500">Track and manage missed calls requiring follow-up</p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 sm:gap-4">        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Follow-up</p>
              <p className="text-2xl font-bold text-gray-900">{kpiData.pending}</p>
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
              placeholder="Search caller, phone..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 text-sm"
            />
          </div>
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
                <TableHead className="whitespace-nowrap">Agent</TableHead>
                <TableHead className="whitespace-nowrap">Status</TableHead>
                <TableHead className="whitespace-nowrap">Direction</TableHead>
                <TableHead onClick={() => handleSort("startTime")} className="cursor-pointer whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    Call Time
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="whitespace-nowrap">Follow-up</TableHead>
                <TableHead className="whitespace-nowrap">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {calls.map((call, index) => (
                <TableRow key={call.id} className="hover:bg-gray-50">
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
                    <FollowUpBadge followUp={call.followUp} />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 sm:gap-2">
                      {call.followUp.status !== 3 && (
                        <button
                          onClick={() => markAsResolved(call.id)}
                          disabled={resolvingCallId === call.id}
                          className="p-1 sm:p-2 text-green-600 hover:text-green-800 hover:bg-gray-100 rounded-md transition-colors"
                          title="Mark as Resolved"
                        >
                          {resolvingCallId === call.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                        </button>
                      )}
  
                      {!call.isSpam && (
                        <button
                          onClick={() => markAsSpam(call.id)}
                          className="p-1 sm:p-2 text-red-600 hover:text-red-800 hover:bg-gray-100 rounded-md transition-colors"
                          title="Mark as Spam"
                        >
                          <Ban className="h-4 w-4" />
                        </button>
                      )}
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
            <Card key={call.id} className="p-3 shadow-sm">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <StatusBadge answered={call.answered} />
                      <FollowUpBadge followUp={call.followUp} />
                    </div>
                    <CallerDisplay caller={call.caller} />
                  </div>
                  <TimeDisplay startTime={call.startTime} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex-shrink-0 h-6 w-6 rounded-md bg-gray-100 flex items-center justify-center">
                      <User className="h-3 w-3 text-gray-400" />
                    </div>
                    <span className="text-xs font-medium text-gray-900">{call.receiver.name}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 justify-end pt-2 border-t">
                  {call.followUp.status !== 3 && (
                    <button
                      onClick={() => markAsResolved(call.id)}
                      disabled={resolvingCallId === call.id}
                      className="px-2 py-1 text-sm bg-green-600 text-white rounded flex items-center gap-1"
                    >
                      {resolvingCallId === call.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Check className="h-3 w-3" />
                      )}
                      Resolve
                    </button>
                  )}
                  {!call.isSpam && (
                    <button
                      onClick={() => markAsSpam(call.id)}
                      className="px-2 py-1 text-sm bg-red-600 text-white rounded flex items-center gap-1"
                    >
                      <Ban className="h-3 w-3" />
                      Spam
                    </button>
                  )}
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
            <PhoneMissed className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-2 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">No missed calls found</h3>
            <p className="text-xs sm:text-sm text-gray-500">
              {searchTerm || selectedTeamMember !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Great! All missed calls have been followed up"}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default MissedCalls;