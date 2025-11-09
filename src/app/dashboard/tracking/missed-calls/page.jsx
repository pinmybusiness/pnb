'use client';
import { useState, useEffect, useMemo, useCallback } from "react";
import { 
  PhoneMissed, 
  Search, 
  CheckCircle, 
  Star, 
  Edit3, 
  ArrowUpDown, 
  User, 
  PhoneOutgoing, 
  PhoneIncoming, 
  Users, 
  Filter,
  Check,
  X
} from "lucide-react";
import KPICard from "@/components/ui/KPICard";
import { toast } from "react-hot-toast";
import axios from "axios";
import { 
  Card, 
  Button, 
  Input, 
  Badge, 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui";

// Custom Components
const CustomSelect = ({ value, onValueChange, children, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedChild = Array.isArray(children) 
    ? children.find(child => child?.props?.value === value)
    : null;
  
  const displayText = selectedChild ? selectedChild.props.children : "Filter by team member";

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <div className="flex items-center gap-2 truncate">
          <Filter className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm truncate">
            {typeof displayText === 'string' ? displayText : "Filter by team member"}
          </span>
        </div>
        <svg 
          className={`h-4 w-4 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {children}
          </div>
        </>
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
      className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center gap-2"
    >
      {children}
    </div>
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
    {name?.charAt(0)?.toUpperCase() || 'U'}
  </div>
);

// Status Badge Component - UPDATED FOR NEW MODEL
const StatusBadge = ({ answered }) => (
  <Badge className={`px-2 py-1 text-xs font-medium ${
    answered ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }`}>
    {answered ? "Answered" : "Missed"}
  </Badge>
);

// FollowUp Badge Component - NEW
const FollowUpBadge = ({ followUp }) => {
  const followUpConfig = {
    0: { label: "No Follow-up", color: "bg-gray-100 text-gray-800" },
    1: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
    2: { label: "Contacted", color: "bg-blue-100 text-blue-800" },
    3: { label: "Resolved", color: "bg-green-100 text-green-800" },
    4: { label: "Ignored", color: "bg-red-100 text-red-800" }
  };

  const config = followUpConfig[followUp?.status] || followUpConfig[0];

  return (
    <Badge className={`px-2 py-1 text-xs ${config.color}`}>
      {config.label}
    </Badge>
  );
};

// Compact Resolve Button Component - UPDATED
const ResolveButton = ({ callId, followUpStatus, onResolve, loading }) => {
  const isResolved = followUpStatus === 3;
  
  if (isResolved) {
    return (
      <Badge className="bg-green-100 text-green-800 px-2 py-1 text-xs">
        <Check className="h-3 w-3" />
      </Badge>
    );
  }

  return (
    <button
      onClick={() => onResolve(callId)}
      disabled={loading}
      className="p-1.5 px-2 text-blue-600 rounded-full hover:bg-blue-50 border border-blue-200 transition-colors disabled:opacity-50"
      title="Mark as resolved"
    >
      {loading ? (
        <div className="h-3 w-3 border-2 border-blue-600 rounded-full animate-spin" />
      ) : (
        <Check className="h-4 w-4" />
      )}
    </button>
  );
};

// TimeDisplay Component - UPDATED FOR INDIAN TIME
const TimeDisplay = ({ startTime }) => {
  const displayDate = new Date(startTime);
  
  const timeString = displayDate.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  
  const dateString = displayDate.toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  });

  return (
    <div className="text-xs sm:text-sm">
      <div className="font-medium text-gray-900">{timeString}</div>
      <div className="text-xs text-gray-500">{dateString}</div>
    </div>
  );
};

// CallerDisplay component - UPDATED FOR NEW FIELDS
const CallerDisplay = ({ caller }) => {
  const { name, phone, formattedPhone } = caller;
  
  const displayName = name || formattedPhone || phone || "Unknown Caller";
  const displayPhone = formattedPhone || phone;

  const isDuplicate = name === phone || 
                     name === "Unknown Caller" || 
                     name?.includes(phone) || 
                     phone?.includes(name);

  return (
    <div className="flex flex-col items-start">
      <div className="text-sm font-medium text-gray-900">
        {displayName}
      </div>
      {!isDuplicate && displayPhone && (
        <div className="text-xs text-gray-500">{displayPhone}</div>
      )}
    </div>
  );
};

// Main Component
const MissedCalls = () => {
  const [calls, setCalls] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeamMember, setSelectedTeamMember] = useState("all");
  const [sortBy, setSortBy] = useState("startTime");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(true);
  const [teamLoading, setTeamLoading] = useState(true);
  const [resolvingCallId, setResolvingCallId] = useState(null);

  // Data mapping function - UPDATED FOR NEW MODEL
  const mapCallData = useCallback((call) => ({
    id: call._id,
    caller: {
      name: call.phonebookName,
      phone: call.fromNumber,
      formattedPhone: call.fromFormattedNumber
    },
    receiver: {
      name: call.userId?.name || "Unassigned",
      id: call.userId?._id || "unassigned",
    },
    duration: call.duration ? formatSeconds(call.duration) : "0:00",
    answered: call.answered,
    inbound: call.inbound,
    startTime: call.startTime,
    notes: call.notes || "",
    isSpam: call.isSpam || false,
    followUp: call.followUp || { status: 0, attempts: 0 }
  }), []);

  // Format seconds to MM:SS
  const formatSeconds = (seconds) => {
    if (!seconds || seconds <= 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Safe team members array
  const safeTeamMembers = useMemo(() => {
    if (!teamMembers) return [];
    if (Array.isArray(teamMembers)) return teamMembers;
    if (typeof teamMembers === 'object') return [teamMembers];
    return [];
  }, [teamMembers]);

  // API calls - UPDATED FOR NEW ENDPOINTS
  const fetchTeamMembers = useCallback(async () => {
    try {
      setTeamLoading(true);
      let members = [];
      
      console.log("Fetching team members...");

      // Try multiple API endpoints
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/calls/team/performance?period=today`,
          { withCredentials: true }
        );
        console.log("Team performance API response:", response.data);
        members = response.data?.data || [];
      } catch (performanceError) {
        console.log("Performance API failed, trying member-stats API");
        
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/calls/team/member-stats?period=today`,
            { withCredentials: true }
          );
          console.log("Member-stats API response:", response.data);
          members = response.data?.data?.teamStats || [];
        } catch (memberStatsError) {
          console.log("Member-stats API also failed");
        }
      }

      // Agar APIs fail hui ya data nahi mila, toh calls se extract karo
      if (!members || members.length === 0) {
        console.log("Extracting team members from calls data");
        const receiverMap = new Map();
        calls.forEach(call => {
          if (call.receiver && call.receiver.id && call.receiver.id !== "unassigned" && !receiverMap.has(call.receiver.id)) {
            receiverMap.set(call.receiver.id, true);
            members.push({
              userId: call.receiver.id,
              userName: call.receiver.name,
              userRole: 'Team Member'
            });
          }
        });
      }

      // Final safety check - ensure it's an array
      if (!Array.isArray(members)) {
        console.warn("Team members is not an array, converting:", members);
        members = members ? [members] : [];
      }

      console.log("Final team members:", members);
      setTeamMembers(members);
      
    } catch (error) {
      console.error("Error fetching team members:", error);
      toast.error("Failed to load team members");
      setTeamMembers([]);
    } finally {
      setTeamLoading(false);
    }
  }, [calls]);

  const fetchMissedCalls = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/calls/missed`,
        { withCredentials: true }
      );
      console.log("Missed calls API response:", response.data);
      
      if (response.data.success) {
        const mappedCalls = response.data.data.map(mapCallData);
        setCalls(mappedCalls);
      } else {
        toast.error(response.data.message || "Failed to fetch missed calls");
        setCalls([]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error(error.response?.data?.message || "Failed to fetch missed calls");
      setCalls([]);
    } finally {
      setLoading(false);
    }
  }, [mapCallData]);

  // Mark call as resolved - UPDATED FOR NEW FOLLOWUP
  const markAsResolved = useCallback(async (callId) => {
    try {
      setResolvingCallId(callId);
      
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/calls/${callId}/followup`,
        { 
          status: 3, // 3 = resolved in followup status
          notes: "Marked as resolved from dashboard" 
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        // Update local state
        setCalls(prev => prev.map(call => 
          call.id === callId 
            ? { 
                ...call, 
                followUp: {
                  ...call.followUp,
                  status: 3 // resolved
                }
              } 
            : call
        ));
        
        toast.success("Call marked as resolved successfully!");
      } else {
        toast.error(response.data.message || "Failed to mark as resolved");
      }
    } catch (error) {
      console.error("Resolve error:", error);
      toast.error(error.response?.data?.message || "Failed to mark call as resolved");
    } finally {
      setResolvingCallId(null);
    }
  }, []);

  // Update followup status
  const updateFollowupStatus = useCallback(async (callId, status, notes = "") => {
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/calls/${callId}/followup`,
        { status, notes },
        { withCredentials: true }
      );

      if (response.data.success) {
        setCalls(prev => prev.map(call => 
          call.id === callId 
            ? { 
                ...call, 
                followUp: {
                  ...call.followUp,
                  status: status
                },
                notes: notes || call.notes
              } 
            : call
        ));
        
        const statusNames = { 1: "pending", 2: "contacted", 3: "resolved", 4: "ignored" };
        toast.success(`Call marked as ${statusNames[status]} successfully!`);
      }
    } catch (error) {
      console.error("Update followup error:", error);
      toast.error("Failed to update call status");
    }
  }, []);

  // Effects
  useEffect(() => {
    fetchMissedCalls();
  }, [fetchMissedCalls]);

  useEffect(() => {
    if (calls.length > 0) {
      fetchTeamMembers();
    } else {
      setTeamMembers([]);
      setTeamLoading(false);
    }
  }, [calls, fetchTeamMembers]);

  // Filter and sort logic - UPDATED FOR NEW FIELDS
  const filteredAndSortedCalls = useMemo(() => {
    if (!calls || !Array.isArray(calls)) return [];
    
    return calls
      .filter((call) => {
        const matchesTeamMember = selectedTeamMember === "all" || call.receiver.id === selectedTeamMember;
        
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          call.caller.phone?.includes(searchTerm) ||
          call.caller.name?.toLowerCase().includes(searchLower) ||
          call.notes?.toLowerCase().includes(searchLower) ||
          call.receiver.name?.toLowerCase().includes(searchLower);

        return matchesTeamMember && matchesSearch;
      })
      .sort((a, b) => {
        const getSortValue = (item) => {
          switch (sortBy) {
            case "startTime": return new Date(item.startTime).getTime();
            case "receiver": return item.receiver.name;
            case "followUpAttempts": return item.followUp.attempts;
            case "answered": return item.answered;
            default: return 0;
          }
        };

        const aValue = getSortValue(a);
        const bValue = getSortValue(b);

        if (typeof aValue === "string") {
          return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      });
  }, [calls, searchTerm, selectedTeamMember, sortBy, sortOrder]);

  // KPI calculation - UPDATED
  const kpiData = useMemo(() => {
    if (!calls || !Array.isArray(calls)) return { 
      missedCalls: 0, 
      pendingFollowups: 0,
      teamMemberCalls: null 
    };
    
    const filteredCalls = calls.filter(call => 
      selectedTeamMember === "all" || call.receiver.id === selectedTeamMember
    );
    
    return { 
      missedCalls: filteredCalls.filter(call => !call.answered && call.inbound).length,
      pendingFollowups: filteredCalls.filter(call => call.followUp.status === 1).length,
      teamMemberCalls: selectedTeamMember !== "all" ? filteredCalls.length : null
    };
  }, [calls, selectedTeamMember]);

  // Helper functions
  const getSelectedMemberName = useCallback(() => {
    if (selectedTeamMember === "all") return "All Team Members";
    if (selectedTeamMember === "unassigned") return "Unassigned Calls";
    
    const member = safeTeamMembers.find(m => m.userId === selectedTeamMember);
    return member ? member.userName : "Selected Member";
  }, [selectedTeamMember, safeTeamMembers]);

  const handleTeamMemberSelect = useCallback((value) => {
    setSelectedTeamMember(value);
  }, []);

  const handleSort = useCallback((key) => {
    setSortBy(key);
    setSortOrder(prev => sortBy === key ? (prev === "asc" ? "desc" : "asc") : "desc");
  }, [sortBy]);

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedTeamMember("all");
  }, []);

  // Action handlers
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
      toast.error("Failed to add note");
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
      toast.error("Failed to mark as spam");
    }
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col justify-between items-start gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Missed Calls Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-500">
            {selectedTeamMember === "all" 
              ? "Monitor and manage all missed restaurant calls" 
              : `Missed calls for ${getSelectedMemberName()}`
            }
          </p>
        </div>
      </div>

      {/* Summary Stats - UPDATED */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <KPICard 
          title="Pending Followups" 
          value={kpiData.pendingFollowups} 
          icon={PhoneMissed}
          className="border-l-4 border-l-yellow-500"
        />
        {selectedTeamMember !== "all" && selectedTeamMember !== "unassigned" && (
          <KPICard 
            title="Team Member" 
            value={getSelectedMemberName()} 
            icon={Users}
            subtitle="Assigned to"
          />
        )}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search caller names, numbers, notes, team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <CustomSelect 
              value={selectedTeamMember} 
              onValueChange={handleTeamMemberSelect}
              className="w-[200px]"
            >
              <CustomSelectItem value="all" onSelect={handleTeamMemberSelect}>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  All Team Members
                </div>
              </CustomSelectItem>
              
              <CustomSelectItem value="unassigned" onSelect={handleTeamMemberSelect}>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Unassigned Calls
                </div>
              </CustomSelectItem>
              
              {safeTeamMembers.map((member) => (
                <CustomSelectItem key={member.userId} value={member.userId} onSelect={handleTeamMemberSelect}>
                  <div className="flex items-center gap-2">
                    <UserAvatar name={member.userName} />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{member.userName || 'Unknown Member'}</span>
                      <span className="text-xs text-gray-500">{member.userRole || 'Team Member'}</span>
                    </div>
                  </div>
                </CustomSelectItem>
              ))}
            </CustomSelect>

            {(searchTerm || selectedTeamMember !== "all") && (
              <Button variant="outline" onClick={clearFilters} className="whitespace-nowrap">
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Calls Table - UPDATED FOR NEW FIELDS */}
      <Card>
        <div className="hidden sm:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Caller</TableHead>
                <TableHead onClick={() => handleSort("receiver")} className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    Assigned To
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead onClick={() => handleSort("startTime")} className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    Time
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Follow-up</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedCalls.map((call) => (
                <TableRow key={call.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <CallStatusIcon answered={call.answered} inbound={call.inbound} />
                      <CallerDisplay caller={call.caller} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <UserAvatar name={call.receiver.name} />
                      <span className="text-sm font-medium text-gray-900">{call.receiver.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <StatusBadge answered={call.answered} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <TimeDisplay startTime={call.startTime} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FollowUpBadge followUp={call.followUp} />
                      {call.followUp.attempts > 0 && (
                        <Badge className="bg-orange-100 text-orange-800 px-2 py-1 text-xs">
                          {call.followUp.attempts} attempt{call.followUp.attempts !== 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <ResolveButton 
                        callId={call.id}
                        followUpStatus={call.followUp.status}
                        onResolve={markAsResolved}
                        loading={resolvingCallId === call.id}
                      />
                      
                      <button
                        onClick={() => addNote(call.id, prompt("Enter note:") || "New note")}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors"
                        title="Add Note"
                      >
                        <Edit3 className="h-5 w-5" />
                      </button>
                      
                      {!call.isSpam && (
                        <button
                          onClick={() => markAsSpam(call.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-md transition-colors"
                          title="Mark as Spam"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile View - UPDATED */}
        <div className="sm:hidden space-y-3 p-4">
          {filteredAndSortedCalls.map((call) => (
            <Card key={call.id} className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <CallStatusIcon answered={call.answered} inbound={call.inbound} />
                    <CallerDisplay caller={call.caller} />
                  </div>
                  <FollowUpBadge followUp={call.followUp} />
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <UserAvatar name={call.receiver.name} className="w-6 h-6" />
                  <span className="text-gray-600">Assigned to: {call.receiver.name}</span>
                </div>

                <div className="text-sm">
                  <TimeDisplay startTime={call.startTime} />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <StatusBadge answered={call.answered} />
                  {call.followUp.attempts > 0 && (
                    <Badge className="bg-orange-100 text-orange-800 px-2 py-1 text-xs">
                      {call.followUp.attempts} attempt{call.followUp.attempts !== 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2 pt-2 border-t">
                  <ResolveButton 
                    callId={call.id}
                    followUpStatus={call.followUp.status}
                    onResolve={markAsResolved}
                    loading={resolvingCallId === call.id}
                  />
                  
                  <button
                    onClick={() => addNote(call.id, prompt("Enter note:") || "New note")}
                    className="flex-1 flex items-center justify-center gap-1 p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span className="text-sm">Note</span>
                  </button>
                  
                  {!call.isSpam && (
                    <button
                      onClick={() => markAsSpam(call.id)}
                      className="flex-1 flex items-center justify-center gap-1 p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <X className="h-4 w-4" />
                      <span className="text-sm">Spam</span>
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredAndSortedCalls.length === 0 && !loading && (
          <div className="p-8 text-center text-gray-500">
            <PhoneMissed className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>No missed calls found</p>
            {(searchTerm || selectedTeamMember !== "all") && (
              <Button variant="outline" onClick={clearFilters} className="mt-2">
                Clear filters to see all calls
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default MissedCalls;