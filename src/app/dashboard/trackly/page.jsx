'use client';
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { 
  Phone, PhoneCall, PhoneMissed, PhoneIncoming, PhoneOutgoing, 
  Search, CheckCircle, Star, Edit3, ArrowUpDown, User, Play, Pause, Download
} from "lucide-react";
import KPICard from "@/components/ui/KPICard";
import { toast } from "react-hot-toast";
import apiClient from "@/lib/apiClient";
import { 
  Card, Input, Badge, Table, TableHeader, TableBody, 
  TableRow, TableHead, TableCell, Button
} from "@/components/ui";
import { useSelector } from "react-redux";

// Audio Player Component
// Audio Player Component (Screenshot Style)
const AudioPlayer = ({ recordingUrl, callId }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlayPause = () => {
    if (!recordingUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => toast.error("Failed to play recording"));
    }
  };

  const handleDownload = () => {
    if (!recordingUrl) return;

    const link = document.createElement('a');
    link.href = recordingUrl;
    link.download = `recording-${callId}.mp3`;
    link.click();
  };

  return (
    <div className="flex items-center gap-1 justify-between w-[160px]">

      {/* hidden audio element */}
      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
      >
        <source src={recordingUrl} type="audio/mpeg" />
      </audio>

      {/* LEFT SIDE: Play Button + Text */}
      <button
        onClick={togglePlayPause}
        disabled={!recordingUrl}
        className={`flex items-center gap-1 px-2 py-1 rounded-md border 
          transition-all text-sm
          ${recordingUrl
            ? isPlaying
              ? "text-orange-600 border-orange-300 bg-orange-50"
              : "text-gray-700 border-gray-300 bg-white hover:bg-gray-100"
            : "text-gray-400 border-gray-200 bg-gray-100 cursor-not-allowed"
          }
        `}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
        <span>{recordingUrl ? "Play Recording" : "Play Recording"}</span>
      </button>

      {/* RIGHT SIDE: Download */}
      <button
        onClick={handleDownload}
        disabled={!recordingUrl}
        className={`px-2 py-[6px] rounded-md border transition 
          ${recordingUrl
            ? "border-gray-300 hover:bg-gray-100 text-gray-600"
            : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
          }
        `}
      >
        <Download className="h-4 w-4" />
      </button>

    </div>
  );
};

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

// FollowUpBadge Component
const FollowUpBadge = ({ followUp }) => {
  const followUpConfig = {
    0: { className: "bg-gray-100 text-gray-800", label: "None" },
    1: { className: "bg-yellow-100 text-yellow-800", label: "Pending" },
    2: { className: "bg-blue-100 text-blue-800", label: "Done" },
    3: { className: "bg-green-100 text-green-800", label: "Resolved" },
    4: { className: "bg-red-100 text-red-800", label: "Ignored" }
  };

  const status = followUp?.status || 0;
  const { className, label } = followUpConfig[status] || followUpConfig[0];

  return (
    <Badge className={`px-2 py-1 text-xs font-medium rounded-full ${className}`}>
      {label}
    </Badge>
  );
};

// CallerDisplay Component (Updated with character limit)
const CallerDisplay = ({ caller }) => {
  const { name, phone, formattedPhone } = caller;

  const cleanName = name?.trim() || "";
  const displayName = cleanName !== "" && cleanName !== phone ? cleanName : null;

  // LIMIT name length to 20 characters
  const MAX_LEN = 20;
  const shortName =
    displayName && displayName.length > MAX_LEN
      ? displayName.substring(0, MAX_LEN) + "..."
      : displayName;

  return (
    <div className="flex flex-col items-start max-w-[150px] md:max-w-[90px]">

      {/* Display Name Only If Valid */}
      {displayName && (
        <div
          className="text-sm font-medium text-gray-900 truncate"
          title={displayName} // full tooltip
        >
          {shortName}
        </div>
      )}

      {/* Phone Number */}
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

// SIMPLE TimeDisplay Component - DIRECT INDIAN TIME
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
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [kpiStats, setKpiStats] = useState({
    totalCalls: 0,
    missedCalls: 0,
    answeredCalls: 0,
    resolvedCalls: 0
  });
  // EXPORT state
  const [showExport, setShowExport] = useState(false);
const [customStart, setCustomStart] = useState("");
const [customEnd, setCustomEnd] = useState("");
 const { user, token } = useSelector((state) => state.auth);

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
        answered: answeredFilter !== "all" ? answeredFilter : undefined,
        inbound: inboundFilter !== "all" ? inboundFilter : undefined,
        agent: agentFilter !== "all" ? agentFilter : undefined,
        sortBy: sortBy, 
        sortOrder: sortOrder,
      };

      const response = await apiClient.get('/api/calls/branch', {
        params,
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
  }, [debouncedSearchTerm, answeredFilter, inboundFilter, agentFilter, sortBy, sortOrder, mapCallData]);

  // Agent Options
  const agentOptions = useMemo(() => {
    const agents = [...new Set(calls.map((call) => call.receiver.name))].filter(Boolean);
    return [
      { value: "all", label: "All Agents" },
      ...agents.map((name) => ({ value: name, label: name })),
    ];
  }, [calls]);

  // Action Handlers
  const handleUpdateFollowUp = useCallback(async (callId, status) => {
    try {
      await apiClient.patch(`/api/calls/${callId}/followup`, { status });
      setCalls(prev => prev.map(call => 
        call.id === callId ? { 
          ...call, 
          followUp: { ...call.followUp, status } 
        } : call
      ));
      toast.success("Follow-up status updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update follow-up status");
    }
  }, []);

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

  const markAsSpam = useCallback(async (callId) => {
    try {
      await apiClient.patch(`/api/calls/${callId}/spam`, {});
      setCalls(prev => prev.map(call => 
        call.id === callId ? { ...call, isSpam: true } : call
      ));
      toast.success("Call marked as spam");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to mark as spam");
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
  }, [debouncedSearchTerm, answeredFilter, inboundFilter, agentFilter, sortBy, sortOrder, fetchCalls]);

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

  // ====================== EXPORT HELPERS ======================
const formatDate = (date) => date.toISOString().split("T")[0];

const getDateRange = (type) => {
  const today = new Date();
  let start, end;

  switch (type) {
    case "today":
      start = end = today;
      break;

    case "week":
      start = new Date(today);
      start.setDate(today.getDate() - today.getDay());
      end = today;
      break;

    case "month":
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      end = today;
      break;

    case "last_month":
      start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      end = new Date(today.getFullYear(), today.getMonth(), 0);
      break;

    default:
      start = end = today;
  }

  return {
    startDate: formatDate(start),
    endDate: formatDate(end),
  };
};

const downloadExcel = (startDate, endDate) => {
  try {
    const branchId = user?.branch;
    if (!branchId) {
      return toast.error("Branch ID missing (user.branch)");
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/calls/export/excel?branchId=${branchId}&startDate=${startDate}&endDate=${endDate}`;

    window.open(url, "_blank");
  } catch (err) {
    console.log(err);
    toast.error("Export failed");
  }
};


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

      {/* KPI Stats */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 sm:gap-4">
        <KPICard title="Total Calls" value={kpiStats.totalCalls} icon={PhoneCall} />
        <KPICard title="Missed Calls" value={kpiStats.missedCalls} icon={PhoneMissed} />
        <KPICard title="Answered Calls" value={kpiStats.answeredCalls} icon={Phone} />
        <KPICard title="Resolved Calls" value={kpiStats.resolvedCalls} icon={CheckCircle} />
      </div> */}

      {/* ================= Export Options UI ================= */}
      {showExport && (
        <Card className="p-3 sm:p-4 mt-4 animate-fade-in">
          <h2 className="text-md font-semibold mb-3">Export Calls</h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                const { startDate, endDate } = getDateRange("today");
                downloadExcel(startDate, endDate);
              }}
            >
              Today
            </Button>

            <Button 
              variant="outline"
              onClick={() => {
                const { startDate, endDate } = getDateRange("week");
                downloadExcel(startDate, endDate);
              }}
            >
              This Week
            </Button>

            <Button 
              variant="outline" 
              onClick={() => {
                const { startDate, endDate } = getDateRange("month");
                downloadExcel(startDate, endDate);
              }}
            >
              This Month
            </Button>

            <Button 
              variant="outline"
              onClick={() => {
                const { startDate, endDate } = getDateRange("last_month");
                downloadExcel(startDate, endDate);
              }}
            >
              Last Month
            </Button>
          </div>

          {/* Custom Date Range */}
          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <Input
              type="date"
              className="flex-1"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
            />
            <Input
              type="date"
              className="flex-1"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
            />
            <Button 
              onClick={() => {
                if (!customStart || !customEnd) {
                  return toast.error("Please select both dates");
                }
                downloadExcel(customStart, customEnd);
              }}
            >
              Export
            </Button>
          </div>
        </Card>
      )}

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
                {/* <TableHead className="whitespace-nowrap">Follow-up</TableHead> */}
                <TableHead className="whitespace-nowrap">Notes</TableHead>
                <TableHead className="whitespace-nowrap">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {calls.map((call, index) => (
                <TableRow key={call._id || index} className="hover:bg-gray-50">
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
                  {/* <TableCell>
                    <FollowUpBadge followUp={call.followUp} />
                  </TableCell> */}
                  <TableCell>
                    <div className="text-xs sm:text-sm text-gray-500 truncate max-w-[150px] sm:max-w-[200px]">
                      {call.notes || "No notes"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 sm:gap-2">
                      {/* {!call.answered && call.inbound && call.followUp.status === 1 && (
                        <button
                          onClick={() => handleUpdateFollowUp(call.id, 2)}
                          className="p-1 sm:p-2 text-green-600 hover:text-green-800 hover:bg-gray-100 rounded-md transition-colors"
                          title="Mark Follow-up Done"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )} */}
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
            <Card key={call._id || index} className="p-3 shadow-sm">
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
                    <span className="text-xs font-medium text-gray-900">{call.receiver.name}</span>
                    <span className="text-xs text-gray-500">• {call.duration}</span>
                  </div>
                  <DirectionBadge inbound={call.inbound} />
                </div>
                
                {/* Recording in Mobile */}
                <div className="border-t pt-2">
                  <div className="text-xs font-medium text-gray-700 mb-1">Recording:</div>
                  <AudioPlayer 
                    recordingUrl={call.recordingUrl} 
                    callId={call.id} 
                  />
                </div>

                <div className="text-xs text-gray-500 truncate">
                  Notes: {call.notes || "No notes"}
                </div>
                <div className="flex gap-2 justify-end mt-1">
                  {!call.answered && call.inbound && call.followUp.status === 1 && (
                    <button
                      onClick={() => handleUpdateFollowUp(call.id, 2)}
                      className="p-1 text-green-600 hover:text-green-800 hover:bg-gray-100 rounded transition-colors"
                      title="Mark Follow-up Done"
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
              {searchTerm || answeredFilter !== "all" || inboundFilter !== "all" || agentFilter !== "all"
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