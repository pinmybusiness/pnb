'use client';
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { 
  Phone, PhoneCall, PhoneMissed, PhoneIncoming, PhoneOutgoing, 
  Search, CheckCircle, Star, Edit3, ArrowUpDown, User, Play, Pause, Download
} from "lucide-react";
import KPICard from "@/components/ui/KPICard";
import { toast } from "react-hot-toast";
import axios from "axios";
import { 
  Card, Input, Badge, Table, TableHeader, TableBody, 
  TableRow, TableHead, TableCell, Button
} from "@/components/ui";

// Audio Player Component
const AudioPlayer = ({ recordingUrl, callId }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
        console.error("Audio play failed:", error);
        toast.error("Failed to play recording");
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      const duration = audioRef.current.duration || 1;
      setProgress((currentTime / duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    if (!audioRef.current) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    
    audioRef.current.currentTime = newTime;
    setProgress(percent * 100);
  };

  const handleDownload = () => {
    if (recordingUrl) {
      const link = document.createElement('a');
      link.href = recordingUrl;
      link.download = `recording-${callId}.mp3`;
      link.click();
    }
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!recordingUrl) {
    return (
      <div className="text-xs text-gray-400 italic">No recording</div>
    );
  }

  return (
    <div className="flex flex-col gap-1 w-full max-w-[200px]">
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
      >
        <source src={recordingUrl} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Player Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={togglePlayPause}
          disabled={!recordingUrl}
          className="p-1 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
        </button>

        {/* Progress Bar */}
        <div 
          className="flex-1 bg-gray-200 rounded-full h-1.5 cursor-pointer"
          onClick={handleSeek}
        >
          <div 
            className="bg-blue-600 h-1.5 rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          disabled={!recordingUrl}
          className="p-1 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
          title="Download Recording"
        >
          <Download className="h-3 w-3" />
        </button>
      </div>

      {/* Time Display */}
      <div className="flex justify-between text-xs text-gray-500">
        <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
        <span>{formatTime(duration)}</span>
      </div>
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

// CallerDisplay Component
const CallerDisplay = ({ caller }) => {
  const { name, phone, formattedPhone } = caller;
  
  const displayName = name || formattedPhone || phone || "Unknown Caller";
  const displayPhone = formattedPhone || phone;

  return (
    <div className="flex flex-col items-start">
      <div className="text-sm font-medium text-gray-900">{displayName}</div>
      {displayPhone && (
        <div className="text-xs text-gray-500">{displayPhone}</div>
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

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/calls/branch`, {
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
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/calls/${callId}/followup`,
        { status },
        { withCredentials: true }
      );
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

  const markAsSpam = useCallback(async (callId) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/calls/${callId}/spam`,
        {},
        { withCredentials: true }
      );
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
        <KPICard title="Answered Calls" value={kpiStats.answeredCalls} icon={Phone} />
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
                    Time
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="whitespace-nowrap">Recording</TableHead>
                <TableHead className="whitespace-nowrap">Follow-up</TableHead>
                <TableHead className="whitespace-nowrap">Notes</TableHead>
                <TableHead className="whitespace-nowrap">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {calls.map((call, index) => (
                <TableRow key={call._id || index} className="hover:bg-gray-50">
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
                    <FollowUpBadge followUp={call.followUp} />
                  </TableCell>
                  <TableCell>
                    <div className="text-xs sm:text-sm text-gray-500 truncate max-w-[150px] sm:max-w-[200px]">
                      {call.notes || "No notes"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 sm:gap-2">
                      {!call.answered && call.inbound && call.followUp.status === 1 && (
                        <button
                          onClick={() => handleUpdateFollowUp(call.id, 2)}
                          className="p-1 sm:p-2 text-green-600 hover:text-green-800 hover:bg-gray-100 rounded-md transition-colors"
                          title="Mark Follow-up Done"
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