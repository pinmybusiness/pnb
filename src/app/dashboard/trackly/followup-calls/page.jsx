'use client';
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { 
  PhoneMissed, 
  Search, 
  CheckCircle, 
  Edit3, 
  ArrowUpDown, 
  User, 
  PhoneOutgoing, 
  PhoneIncoming, 
  Users, 
  Filter,
  Check,
  Shield,
  Ban,
  Clock,
  MessageSquare,
  AlertCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  X,
  Loader2,
  CheckCheck
} from "lucide-react";
import { toast } from "react-hot-toast";
import apiClient from "@/lib/apiClient";

// ---------- CUSTOM HOOKS ----------
const useTeamMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTeamMembers = useCallback(async () => {
    try {
      setLoading(true);
      
      // Try both endpoints
      const endpoints = [
        `/api/calls/team/performance?period=today`,
        `/api/calls/team/member-stats?period=today`
      ];
      
      let teamData = [];
      
      for (const endpoint of endpoints) {
        try {
          const response = await apiClient.get(endpoint);
          
          console.log("Team members response:", response.data);
          
          if (response.data?.success) {
            const data = response.data.data;
            if (Array.isArray(data)) {
              teamData = data.map(m => ({
                userId: m.userId || m._id,
                userName: m.userName || m.name || 'Unknown',
                userRole: m.userRole || 'Team Member'
              }));
              break;
            } else if (data?.teamStats && Array.isArray(data.teamStats)) {
              teamData = data.teamStats.map(m => ({
                userId: m.userId || m._id,
                userName: m.userName || m.name || 'Unknown',
                userRole: m.userRole || 'Team Member'
              }));
              break;
            }
          }
        } catch (err) {
          console.log(`Endpoint ${endpoint} failed:`, err.message);
          continue;
        }
      }
      
      setMembers(teamData);
    } catch (error) {
      console.error("Team members fetch error:", error);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

  return { members, loading, refetch: fetchTeamMembers };
};

// ---------- CUSTOM COMPONENTS ----------
const LoadingSpinner = ({ size = "md" }) => {
  const sizeClass = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12"
  }[size];

  return (
    <div className={`${sizeClass} border-2 border-blue-600 border-t-transparent rounded-full animate-spin`} />
  );
};

const CallStatusIcon = ({ answered, inbound }) => {
  if (!answered && inbound) {
    return <PhoneMissed className="h-5 w-5 text-red-600" />;
  } else if (answered && inbound) {
    return <PhoneIncoming className="h-5 w-5 text-green-600" />;
  } else {
    return <PhoneOutgoing className="h-5 w-5 text-blue-600" />;
  }
};

const UserAvatar = ({ name, className = "w-8 h-8" }) => (
  <div className={`flex-shrink-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold ${className}`}>
    {(name || 'U').charAt(0).toUpperCase()}
  </div>
);

const FollowUpBadge = ({ followUp }) => {
  const attempts = followUp?.attempts || 0;
  const status = followUp?.status || 0;
  
  if (status === 3) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
        <CheckCheck className="h-3 w-3" />
        Resolved
      </span>
    );
  }
  
  if (attempts === 0 && status === 1) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
        <AlertCircle className="h-3 w-3" />
        Needs Follow-up
      </span>
    );
  }
  
  if (attempts > 0) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
        <Clock className="h-3 w-3" />
        {attempts} attempt{attempts !== 1 ? 's' : ''}
      </span>
    );
  }
  
  return null;
};

const ResolveButton = ({ callId, followUpStatus, onResolve, loading }) => {
  const isResolved = followUpStatus === 3;
  
  if (isResolved) {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-green-100 text-green-800 border border-green-300">
        <CheckCheck className="h-4 w-4" />
        Resolved
      </span>
    );
  }

  return (
    <button
      onClick={() => onResolve(callId)}
      disabled={loading}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
      Resolve
    </button>
  );
};

const NoteButton = ({ onAddNote }) => (
  <button
    onClick={onAddNote}
    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 border border-gray-300 transition-all"
  >
    <MessageSquare className="h-4 w-4" />
    Note
  </button>
);

const SpamButton = ({ isSpam, onMarkSpam }) => {
  if (isSpam) {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-red-100 text-red-800 border border-red-300">
        <Shield className="h-4 w-4" />
        Spam
      </span>
    );
  }

  return (
    <button
      onClick={onMarkSpam}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-gradient-to-r from-red-50 to-red-100 text-red-700 hover:from-red-100 hover:to-red-200 border border-red-300 transition-all"
    >
      <Ban className="h-4 w-4" />
      Spam
    </button>
  );
};

const TimeDisplay = ({ startTime }) => {
  if (!startTime) return <span className="text-gray-400 text-sm">N/A</span>;
  
  try {
    const date = new Date(startTime);
    
    const timeString = date.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
    const dateString = date.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    return (
      <div className="flex flex-col">
        <div className="font-medium text-gray-900 text-sm">{timeString}</div>
        <div className="text-xs text-gray-500">{dateString}</div>
      </div>
    );
  } catch {
    return <span className="text-gray-400 text-sm">Invalid</span>;
  }
};

const CallerDisplay = ({ caller }) => {
  const { name, phone, formattedPhone } = caller || {};
  
  const displayName = name || formattedPhone || phone || "Unknown Caller";
  const displayPhone = formattedPhone || phone;

  const isDuplicate = name === phone || 
                     name === "Unknown Caller" || 
                     (name && phone && (name.includes(phone) || phone.includes(name)));

  return (
    <div className="flex flex-col">
      <div className="font-medium text-gray-900 text-sm">
        {displayName}
      </div>
      {!isDuplicate && displayPhone && (
        <div className="text-xs text-gray-500 font-mono">{displayPhone}</div>
      )}
    </div>
  );
};

// ---------- CUSTOM SELECT ----------
const CustomSelect = ({ value, onValueChange, children, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const selectedChild = Array.isArray(children) 
    ? children.find(child => child?.props?.value === value)
    : null;
  
  const displayText = selectedChild ? selectedChild.props.children : "Filter by team member";

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
      >
        <div className="flex items-center gap-2 truncate">
          <Filter className="h-4 w-4 flex-shrink-0 text-gray-500" />
          <span className="truncate text-gray-700">
            {typeof displayText === 'string' ? displayText : "Filter by team member"}
          </span>
        </div>
        <ChevronDown className={`h-4 w-4 flex-shrink-0 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {children}
        </div>
      )}
    </div>
  );
};

const CustomSelectItem = ({ value, children, onSelect }) => {
  const handleClick = () => {
    onSelect(value);
  };

  return (
    <div
      onClick={handleClick}
      className="px-3 py-2.5 text-sm hover:bg-gray-100 cursor-pointer flex items-center gap-2 transition-colors"
    >
      {children}
    </div>
  );
};

// ---------- MAIN COMPONENT ----------
const MissedCalls = () => {
  const [calls, setCalls] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeamMember, setSelectedTeamMember] = useState("all");
  const [sortBy, setSortBy] = useState("startTime");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [resolvingCallId, setResolvingCallId] = useState(null);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [noteText, setNoteText] = useState("");

  const { members: teamMembers, loading: teamLoading, refetch: refetchTeam } = useTeamMembers();

  // Format seconds
  const formatSeconds = useCallback((seconds) => {
    if (!seconds || seconds <= 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }, []);

  // Map call data from backend
  const mapCallData = useCallback((call) => {
    try {
      return {
        id: call._id || call.id,
        caller: {
          name: call.phonebookName || call.callerName || "Unknown Caller",
          formattedPhone: call.fromFormattedNumber || call.formattedPhone
        },
        receiver: {
          name: call.userId?.name || call.userInfo?.name || call.assignedTo || "Unassigned",
          id: call.userId?._id || call.userId || call.assignedToId || "unassigned",
        },
        startTime: call.startTime || call.startTimeIST || call.createdAt,
        notes: call.notes || "",
        followUp: call.followUp || { status: 0, attempts: 0 }
      };
    } catch (error) {
      console.error("Error mapping call:", error, call);
      return null;
    }
  }, [formatSeconds]);

  // Fetch missed calls from backend
  const fetchMissedCalls = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      else setRefreshing(true);
      
      console.log("Fetching missed calls from:", `/api/calls/branch-followup-calls`);
      
      const response = await apiClient.get(`/api/calls/branch-followup-calls`, {
        params: { 
          limit: 100,
          page: 1
        }
      });
      
      console.log("Missed calls response:", response.data);
      
      if (response.data.success) {
        const callsData = response.data.data || [];
        const mappedCalls = callsData.map(mapCallData).filter(call => call !== null);
        setCalls(mappedCalls);
        toast.success(`Loaded ${mappedCalls.length} missed calls`);
      } else {
        toast.error(response.data.message || "Failed to fetch missed calls");
        setCalls([]);
      }
    } catch (error) {
      console.error("Fetch error details:", error);
      console.error("Error response:", error.response?.data);
      
      let message = "Failed to fetch missed calls";
      if (error.response?.status === 401) {
        message = "Please login again";
      } else if (error.response?.status === 403) {
        message = "Access denied";
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      
      toast.error(message);
      setCalls([]);
    } finally {
      if (showLoading) setLoading(false);
      setRefreshing(false);
    }
  }, [mapCallData]);

  // Refresh data
  const handleRefresh = useCallback(() => {
    fetchMissedCalls(false);
    refetchTeam();
  }, [fetchMissedCalls, refetchTeam]);

  // Mark as resolved - CORRECTED API CALL
  const markAsResolved = useCallback(async (callId) => {
    try {
      setResolvingCallId(callId);
      
      console.log("Marking as resolved:", callId);
      
      const response = await apiClient.patch(`/api/calls/${callId}/followup`, {
        status: 3, // 3 = resolved
        notes: "Marked as resolved from dashboard",
        updateAll: true 
      });
      
      console.log("Resolve response:", response.data);

      if (response.data.success) {
        const updatedCount = response.data.data?.updatedCount || 1;
        toast.success(`✓ Resolved ${updatedCount} call${updatedCount > 1 ? 's' : ''}`);
        
        // Update local state
        setCalls(prev => prev.map(call => 
          call.id === callId 
            ? { 
                ...call, 
                followUp: { 
                  ...call.followUp, 
                  status: 3,
                  attempts: call.followUp.attempts || 0
                } 
              }
            : call
        ));
        
      } else {
        toast.error(response.data.message || "Failed to resolve");
      }
    } catch (error) {
      console.error("Resolve error details:", error);
      console.error("Error response:", error.response?.data);
      
      let message = "Failed to resolve";
      if (error.response?.status === 404) {
        message = "Call not found";
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      
      toast.error(message);
    } finally {
      setResolvingCallId(null);
    }
  }, []);

  // Mark as spam - CORRECTED API CALL
  const markAsSpam = useCallback(async (callId) => {
    if (!window.confirm('Are you sure you want to mark this number as spam? This will mark ALL calls from this number as spam.')) {
      return;
    }
    
    try {
      const response = await apiClient.patch(`/api/calls/${callId}/spam`, {});
      
      if (response.data.success) {
        setCalls(prev => prev.map(call => 
          call.id === callId ? { ...call, isSpam: true } : call
        ));
        toast.success("✓ Marked as spam");
      } else {
        toast.error(response.data.message || "Failed to mark as spam");
      }
    } catch (error) {
      console.error("Spam error:", error);
      toast.error(error.response?.data?.message || "Failed to mark as spam");
    }
  }, []);

  // Add note - CORRECTED API CALL
  const addNote = useCallback(async (callId, note) => {
    if (!note.trim()) return;
    
    try {
      const response = await apiClient.patch(`/api/calls/${callId}/notes`, {
        notes: note
      });
      
      if (response.data.success) {
        setCalls(prev => prev.map(call => 
          call.id === callId ? { ...call, notes: note } : call
        ));
        toast.success("✓ Note saved");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save note");
    }
  }, []);

  // Note editing functions
  const startNoteEditing = useCallback((callId, currentNote = "") => {
    setEditingNoteId(callId);
    setNoteText(currentNote);
  }, []);

  const saveNote = useCallback((callId) => {
    addNote(callId, noteText);
    setEditingNoteId(null);
    setNoteText("");
  }, [addNote, noteText]);

  const cancelNoteEditing = useCallback(() => {
    setEditingNoteId(null);
    setNoteText("");
  }, []);

  // Effects
  useEffect(() => {
    fetchMissedCalls();
  }, [fetchMissedCalls]);

  // Filter and sort logic
  const filteredAndSortedCalls = useMemo(() => {
    if (!Array.isArray(calls)) return [];
    
    const filtered = calls.filter((call) => {
      // Filter by team member
      if (selectedTeamMember !== "all" && call.receiver.id !== selectedTeamMember) {
        return false;
      }
      
      // Filter by search
      if (!searchTerm.trim()) return true;
      
      const term = searchTerm.toLowerCase();
      return (
        (call.caller.name || "").toLowerCase().includes(term) ||
        (call.caller.phone || "").includes(term) ||
        (call.caller.formattedPhone || "").includes(term) ||
        (call.receiver.name || "").toLowerCase().includes(term) ||
        (call.notes || "").toLowerCase().includes(term)
      );
    });
    
    // Sort
    return filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case "startTime":
          aValue = new Date(a.startTime).getTime();
          bValue = new Date(b.startTime).getTime();
          break;
        case "receiver":
          aValue = a.receiver.name.toLowerCase();
          bValue = b.receiver.name.toLowerCase();
          break;
        case "followUpAttempts":
          aValue = a.followUp.attempts || 0;
          bValue = b.followUp.attempts || 0;
          break;
        case "caller":
          aValue = a.caller.name?.toLowerCase() || "";
          bValue = b.caller.name?.toLowerCase() || "";
          break;
        default:
          return 0;
      }
      
      if (typeof aValue === "string") {
        return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    });
  }, [calls, searchTerm, selectedTeamMember, sortBy, sortOrder]);

  // KPI data
  const kpiData = useMemo(() => {
    const total = filteredAndSortedCalls.length;
    const pending = filteredAndSortedCalls.filter(call => call.followUp.status === 1).length;
    const resolved = filteredAndSortedCalls.filter(call => call.followUp.status === 3).length;
    const spam = filteredAndSortedCalls.filter(call => call.isSpam).length;
    
    return { total, pending, resolved, spam };
  }, [filteredAndSortedCalls]);

  // Handlers
  const handleTeamMemberSelect = (value) => {
    setSelectedTeamMember(value);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedTeamMember("all");
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-blue-100 rounded-full"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
          </div>
        </div>
        <p className="text-gray-600 text-lg">Loading missed calls...</p>
        <p className="text-gray-500 text-sm">Fetching data from server</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-4 md:p-6">
      <div className="">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Missed Calls Dashboard</h1>
            <p className="text-gray-600 mt-2">
              {selectedTeamMember === "all" 
                ? "Track and manage all missed calls requiring follow-up" 
                : `Missed calls assigned to ${teamMembers.find(m => m.userId === selectedTeamMember)?.userName || "selected team member"}`
              }
            </p>
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20"
          >
            <RefreshCw className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`} />
            <span className="font-medium">Refresh Data</span>
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                <PhoneMissed className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{kpiData.total}</div>
                <div className="text-sm text-gray-500">Total Calls</div>
              </div>
            </div>
          </div> */}
          
          <div className="bg-gradient-to-br from-white to-gray-50 border border-yellow-200 rounded-2xl p-5 shadow-sm border-l-4 border-l-yellow-500">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{kpiData.pending}</div>
                <div className="text-sm text-gray-500">Pending Follow-up</div>
              </div>
            </div>
          </div>
          
          {/* <div className="bg-gradient-to-br from-white to-gray-50 border border-green-200 rounded-2xl p-5 shadow-sm border-l-4 border-l-green-500">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{kpiData.resolved}</div>
                <div className="text-sm text-gray-500">Resolved</div>
              </div>
            </div>
          </div> */}
          
          {/* <div className="bg-gradient-to-br from-white to-gray-50 border border-red-200 rounded-2xl p-5 shadow-sm border-l-4 border-l-red-500">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{kpiData.spam}</div>
                <div className="text-sm text-gray-500">Spam Calls</div>
              </div>
            </div>
          </div> */}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-8 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by caller name, phone number, notes, or team member..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            
            <div className="flex flex-col md:flex-row gap-3 md:items-center">
              <CustomSelect 
                value={selectedTeamMember} 
                onValueChange={handleTeamMemberSelect} 
                className="w-full md:w-[240px]"
              >
                <CustomSelectItem value="all" onSelect={handleTeamMemberSelect}>
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-gray-500" />
                    <div className="flex flex-col">
                      <span className="font-medium">All Team Members</span>
                      <span className="text-xs text-gray-500">Show all calls</span>
                    </div>
                  </div>
                </CustomSelectItem>
                
                <CustomSelectItem value="unassigned" onSelect={handleTeamMemberSelect}>
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-gray-500" />
                    <div className="flex flex-col">
                      <span className="font-medium">Unassigned Calls</span>
                      <span className="text-xs text-gray-500">No team member assigned</span>
                    </div>
                  </div>
                </CustomSelectItem>
                
                {teamMembers.map((member) => (
                  <CustomSelectItem key={member.userId} value={member.userId} onSelect={handleTeamMemberSelect}>
                    <div className="flex items-center gap-3">
                      <UserAvatar name={member.userName} className="w-8 h-8" />
                      <div className="flex flex-col">
                        <span className="font-medium">{member.userName}</span>
                        <span className="text-xs text-gray-500">{member.userRole}</span>
                      </div>
                    </div>
                  </CustomSelectItem>
                ))}
              </CustomSelect>

              {(searchTerm || selectedTeamMember !== "all") && (
                <button 
                  onClick={clearFilters} 
                  className="px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 font-medium transition-all"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Table Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <div className="min-w-full">
              {/* Table Header */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <div className="grid grid-cols-12 gap-4 px-6 py-4">
                  <div className="col-span-3">
                    <button
                      onClick={() => handleSort("caller")}
                      className="flex items-center gap-2 font-semibold text-gray-700 hover:text-gray-900"
                    >
                      Caller Information
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="col-span-2">
                    <button
                      onClick={() => handleSort("receiver")}
                      className="flex items-center gap-2 font-semibold text-gray-700 hover:text-gray-900"
                    >
                      Assigned To
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="col-span-2">
                    <button
                      onClick={() => handleSort("startTime")}
                      className="flex items-center gap-2 font-semibold text-gray-700 hover:text-gray-900"
                    >
                      Call Time
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="col-span-2">
                    <button
                      onClick={() => handleSort("followUpAttempts")}
                      className="flex items-center gap-2 font-semibold text-gray-700 hover:text-gray-900"
                    >
                      Follow-up Status
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="col-span-3 text-right font-semibold text-gray-700">
                    Actions
                  </div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-100">
                {filteredAndSortedCalls.map((call) => (
                  <div key={call.id} className="hover:bg-gray-50/50 transition-colors">
                    <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
                      {/* Caller Column */}
                      <div className="col-span-3">
                        <div className="flex items-center gap-3">
                          <CallStatusIcon answered={call.answered} inbound={call.inbound} />
                          <CallerDisplay caller={call.caller} />
                        </div>
                      </div>

                      {/* Assigned To Column */}
                      <div className="col-span-2">
                        <div className="flex items-center gap-2">
                          <UserAvatar name={call.receiver.name} />
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{call.receiver.name}</div>
                            {call.duration !== "0:00" && (
                              <div className="text-xs text-gray-500">Duration: {call.duration}</div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Time Column */}
                      <div className="col-span-2">
                        <TimeDisplay startTime={call.startTime} />
                      </div>

                      {/* Status Column */}
                      <div className="col-span-2">
                        <FollowUpBadge followUp={call.followUp} />
                      </div>

                      {/* Actions Column */}
                      <div className="col-span-3">
                        <div className="flex items-center gap-2 justify-end">
                          {/* <ResolveButton 
                            callId={call.id}
                            followUpStatus={call.followUp.status}
                            onResolve={markAsResolved}
                            loading={resolvingCallId === call.id}
                          /> */}
                          
                          {editingNoteId === call.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                placeholder="Type note..."
                                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm w-32"
                                autoFocus
                              />
                              <button 
                                onClick={() => saveNote(call.id)} 
                                className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                              >
                                Save
                              </button>
                              <button 
                                onClick={cancelNoteEditing}
                                className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <NoteButton 
                              onAddNote={() => startNoteEditing(call.id, call.notes)}
                            />
                          )}
                          
                          <SpamButton 
                            isSpam={call.isSpam}
                            onMarkSpam={() => markAsSpam(call.id)}
                          />
                        </div>
                        
                        {/* Notes display */}
                        {call.notes && !editingNoteId && (
                          <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
                            <div className="flex items-center gap-1 mb-1">
                              <MessageSquare className="h-3 w-3" />
                              <span className="font-medium">Note:</span>
                            </div>
                            <p className="truncate">{call.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden">
            <div className="p-4 space-y-4">
              {filteredAndSortedCalls.map((call) => (
                <div key={call.id} className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-5 shadow-sm">
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <CallStatusIcon answered={call.answered} inbound={call.inbound} />
                      <CallerDisplay caller={call.caller} />
                    </div>
                    <FollowUpBadge followUp={call.followUp} />
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="h-4 w-4" />
                        <span className="text-sm font-medium">Assigned To</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <UserAvatar name={call.receiver.name} className="w-6 h-6" />
                        <span className="font-medium text-gray-900">{call.receiver.name}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm font-medium">Call Time</span>
                      </div>
                      <TimeDisplay startTime={call.startTime} />
                    </div>
                  </div>

                  {/* Duration */}
                  {call.duration !== "0:00" && (
                    <div className="mb-4">
                      <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm">
                        <Clock className="h-3 w-3" />
                        Duration: {call.duration}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {call.notes && !editingNoteId && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <MessageSquare className="h-4 w-4" />
                        <span className="text-sm font-medium">Note</span>
                      </div>
                      <p className="text-gray-700">{call.notes}</p>
                    </div>
                  )}

                  {/* Note Editing */}
                  {editingNoteId === call.id && (
                    <div className="mb-4 space-y-2">
                      <textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Type your note here..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        rows="2"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button 
                          onClick={() => saveNote(call.id)} 
                          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                        >
                          Save Note
                        </button>
                        <button 
                          onClick={cancelNoteEditing}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t">
                    <ResolveButton 
                      callId={call.id}
                      followUpStatus={call.followUp.status}
                      onResolve={markAsResolved}
                      loading={resolvingCallId === call.id}
                    />
                    
                    {!editingNoteId && (
                      <NoteButton 
                        onAddNote={() => startNoteEditing(call.id, call.notes)}
                      />
                    )}
                    
                    <SpamButton 
                      isSpam={call.isSpam}
                      onMarkSpam={() => markAsSpam(call.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Empty State */}
          {filteredAndSortedCalls.length === 0 && !loading && (
            <div className="py-16 text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <PhoneMissed className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No missed calls found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchTerm || selectedTeamMember !== "all" 
                  ? "No calls match your current search or filter criteria"
                  : "Great job! All missed calls have been followed up or there are no pending calls."
                }
              </p>
              {(searchTerm || selectedTeamMember !== "all") && (
                <button 
                  onClick={clearFilters}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 transition-all"
                >
                  Clear filters to see all calls
                </button>
              )}
            </div>
          )}

          {/* Loading Overlay */}
          {refreshing && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-700 font-medium">Refreshing data...</p>
                <p className="text-gray-500 text-sm">Updating from server</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        {filteredAndSortedCalls.length > 0 && (
          <div className="mt-6 text-center text-gray-500 text-sm">
            Showing {filteredAndSortedCalls.length} of {calls.length} missed calls
            {selectedTeamMember !== "all" && ` for selected team member`}
          </div>
        )}
      </div>
    </div>
  );
};

export default MissedCalls;