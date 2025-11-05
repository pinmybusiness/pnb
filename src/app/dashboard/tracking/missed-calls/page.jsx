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

const CallStatusIcon = ({ status, direction }) => {
  const getIconProps = () => {
    if (status === "missed") {
      return direction === "incoming"
        ? { icon: <PhoneIncoming className="h-5 w-5 text-red-600" />, label: "Incoming Missed" }
        : { icon: <PhoneOutgoing className="h-5 w-5 text-blue-600" />, label: "Outgoing Missed" };
    } else if (status === "resolved") {
      return { icon: <CheckCircle className="h-5 w-5 text-green-600" />, label: "Resolved" };
    } else {
      return direction === "incoming"
        ? { icon: <PhoneIncoming className="h-5 w-5 text-green-600" />, label: "Incoming Answered" }
        : { icon: <PhoneOutgoing className="h-5 w-5 text-green-600" />, label: "Outgoing Answered" };
    }
  };

  const { icon, label } = getIconProps();

  return (
    <div className="flex items-center gap-2" title={label}>
      {icon}
    </div>
  );
};

const UserAvatar = ({ name, className = "w-8 h-8" }) => (
  <div className={`flex-shrink-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold ${className}`}>
    {name?.charAt(0)?.toUpperCase() || 'U'}
  </div>
);

// NEW: Status Badge Component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    missed: { label: "Missed", color: "bg-red-100 text-red-800" },
    answered: { label: "Answered", color: "bg-green-100 text-green-800" },
    resolved: { label: "Resolved", color: "bg-blue-100 text-blue-800" },
    ended: { label: "Ended", color: "bg-gray-100 text-gray-800" }
  };

  const config = statusConfig[status] || statusConfig.missed;

  return (
    <Badge className={`px-2 py-1 text-xs font-medium ${config.color}`}>
      {config.label}
    </Badge>
  );
};

// NEW: Compact Resolve Button Component
const ResolveButton = ({ callId, currentStatus, onResolve, loading }) => {
  const isResolved = currentStatus === "resolved";
  
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
      className="p-1.5 px-2 text-blue-600  rounded-full hover:bg-blue-50 border border-blue-200 transition-colors disabled:opacity-50"
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

// CallerDisplay component
const CallerDisplay = ({ caller }) => {
  const { name, phone } = caller;
  
  // Check if name and phone are the same
  const isDuplicate = name === phone || 
                     name === "Unknown" || 
                     name?.includes(phone) || 
                     phone?.includes(name);

  return (
    <div className="flex flex-col items-start">
      <div className="text-sm font-medium text-gray-900">
        {name}
      </div>
      {!isDuplicate && (
        <div className="text-sm text-gray-500">{phone}</div>
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
  const [sortBy, setSortBy] = useState("timestamp");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(true);
  const [teamLoading, setTeamLoading] = useState(true);
  const [resolvingCallId, setResolvingCallId] = useState(null);

  // Constants - UPDATED FOR NEW FOLLOWUP FIELD
  const STATUS_MAP = { 0: "missed", 1: "answered", 2: "resolved", 3: "ended" };
  const STATUS_REVERSE_MAP = { missed: 0, answered: 1, resolved: 2, ended: 3 };
  const DIRECTION_MAP = { 0: "incoming", 1: "outgoing" };
  const PRIORITY_MAP = { 0: "normal", 1: "high" };
  const FOLLOWUP_STATUS_MAP = { 0: "not_required", 1: "pending", 2: "contacted", 3: "resolved", 4: "ignored" };

  // Data mapping function - UPDATED FOR NEW FIELDS
  const mapCallData = useCallback((call) => ({
    id: call._id,
    caller: {
      name: call.callerName || call.callerPhone || "Unknown",
      phone: call.callerPhone,
    },
    receiver: {
      name: call.receiver?.name || "Unassigned",
      id: call.receiver?._id || "unassigned",
    },
    status: STATUS_MAP[call.status] || "missed",
    direction: DIRECTION_MAP[call.direction] || "incoming",
    timestamp: new Date(call.timestamp).toLocaleString("en-IN", {
      dateStyle: "short",
      timeStyle: "short",
    }),
    notes: call.notes || "",
    priority: PRIORITY_MAP[call.priority] || "normal",
    // 🔥 UPDATED: Use new followup fields
    followupStatus: call.followup?.status || 0,
    followupAttempts: call.followup?.attempts || 0,
    rawStatus: call.status,
    rawTimestamp: call.timestamp // For proper sorting
  }), []);

  // Safe team members array (same as before)
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

  // 🔥 UPDATED: Mark call as resolved using new followup endpoint
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
                followupStatus: 3, // resolved
                status: "resolved" // update main status for display
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

  // 🔥 NEW: Update followup status (contacted, ignored, etc.)
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
                followupStatus: status,
                notes: notes || call.notes
              } 
            : call
        ));
        
        const statusName = FOLLOWUP_STATUS_MAP[status] || "updated";
        toast.success(`Call marked as ${statusName} successfully!`);
      }
    } catch (error) {
      console.error("Update followup error:", error);
      toast.error("Failed to update call status");
    }
  }, []);

  // Effects (same as before)
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
          call.caller.phone.includes(searchTerm) ||
          call.caller.name.toLowerCase().includes(searchLower) ||
          call.notes.toLowerCase().includes(searchLower) ||
          call.receiver.name.toLowerCase().includes(searchLower);

        return matchesTeamMember && matchesSearch;
      })
      .sort((a, b) => {
        const getSortValue = (item) => {
          switch (sortBy) {
            case "timestamp": return new Date(item.rawTimestamp).getTime();
            case "receiver": return item.receiver.name;
            case "followupAttempts": return item.followupAttempts;
            case "status": return item.status;
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

  // KPI calculation - UPDATED FOR NEW LOGIC
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
      missedCalls: filteredCalls.filter(call => call.status === "missed").length,
      pendingFollowups: filteredCalls.filter(call => call.followupStatus === 1).length,
      teamMemberCalls: selectedTeamMember !== "all" ? filteredCalls.length : null
    };
  }, [calls, selectedTeamMember]);

  // Helper functions (same as before)
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

  // Action handlers - UPDATED FOR NEW APIS
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
      toast.error("Failed to update priority");
    }
  }, []);

  // 🔥 NEW: Quick action buttons for followup status
  // const QuickActionButtons = ({ call }) => {
  //   if (call.followupStatus === 3) { // already resolved
  //     return (
  //       <Badge className="bg-green-100 text-green-800 px-2 py-1 text-xs">
  //         Resolved
  //       </Badge>
  //     );
  //   }

  //   return (
  //     <div className="flex gap-1">
  //       <button
  //         onClick={() => updateFollowupStatus(call.id, 2, "Customer contacted")}
  //         className="p-1.5 text-blue-600 rounded-full hover:bg-blue-50 border border-blue-200 transition-colors"
  //         title="Mark as contacted"
  //       >
  //         <PhoneOutgoing className="h-4 w-4" />
  //       </button>
  //       <button
  //         onClick={() => updateFollowupStatus(call.id, 4, "Call ignored")}
  //         className="p-1.5 text-gray-600 rounded-full hover:bg-gray-50 border border-gray-200 transition-colors"
  //         title="Mark as ignored"
  //       >
  //         <X className="h-4 w-4" />
  //       </button>
  //     </div>
  //   );
  // };

  // Loading state (same as before)
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          title="Pending Followups" 
          value={kpiData.pendingFollowups} 
          icon={PhoneMissed}
          className="border-l-4 border-l-red-500"
        />
        {/* <KPICard 
          title="Total Missed Calls" 
          value={kpiData.missedCalls} 
          icon={PhoneMissed}
          className="border-l-4 border-l-orange-500"
        /> */}
        {selectedTeamMember !== "all" && selectedTeamMember !== "unassigned" && (
          <KPICard 
            title="Team Member" 
            value={getSelectedMemberName()} 
            icon={Users}
            subtitle="Assigned to"
          />
        )}
      </div>

      {/* Filters (same as before) */}
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
                <TableHead onClick={() => handleSort("status")} className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    Status
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort("timestamp")} className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    Time
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Notes</TableHead>
                <TableHead onClick={() => handleSort("followupAttempts")} className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    Follow-up Attempts
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                {/* <TableHead>Quick Actions</TableHead> */}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedCalls.map((call) => (
                <TableRow key={call.id} className="hover:bg-gray-50">
                  <TableCell>
                    <CallerDisplay caller={call.caller} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <UserAvatar name={call.receiver.name} />
                      <span className="text-sm font-medium text-gray-900">{call.receiver.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CallStatusIcon status={call.status} direction={call.direction} />
                      <Badge className={`px-2 py-1 text-xs ${
                        call.followupStatus === 1 ? "bg-yellow-100 text-yellow-800" :
                        call.followupStatus === 2 ? "bg-blue-100 text-blue-800" :
                        call.followupStatus === 3 ? "bg-green-100 text-green-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {FOLLOWUP_STATUS_MAP[call.followupStatus] || "unknown"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{call.timestamp.split(", ")[1]}</div>
                      <div className="text-xs text-gray-500">{call.timestamp.split(", ")[0]}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-500 truncate max-w-[200px]">
                      {call.notes || "No notes"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`px-2 py-1 rounded-full text-xs ${
                      call.followupAttempts > 0 
                        ? "bg-orange-100 text-orange-800" 
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      {call.followupAttempts} attempt{call.followupAttempts !== 1 ? 's' : ''}
                    </Badge>
                  </TableCell>
                  {/* <TableCell>
                    <QuickActionButtons call={call} />
                  </TableCell> */}
                  <TableCell>
                    <div className="flex gap-2">
                      {/* Resolve Button */}
                      {call.followupStatus !== 3 && (
                        <ResolveButton 
                          callId={call.id}
                          currentStatus={call.status}
                          onResolve={markAsResolved}
                          loading={resolvingCallId === call.id}
                        />
                      )}
                      
                      <button
                        onClick={() => addNote(call.id, prompt("Enter note:") || "New note")}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors"
                        title="Add Note"
                      >
                        <Edit3 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => markPriority(call.id, call.priority === "high" ? "normal" : "high")}
                        className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-gray-100 rounded-md transition-colors"
                        title="Toggle Priority"
                      >
                        <Star className={`h-5 w-5 ${call.priority === "high" ? "fill-yellow-600 text-yellow-600" : ""}`} />
                      </button>
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
                    <CallStatusIcon status={call.status} direction={call.direction} />
                    <div>
                      <div className="font-medium text-gray-900">{call.caller.name}</div>
                      {(call.caller.name !== call.caller.phone && 
                        call.caller.name !== "Unknown" && 
                        !call.caller.name.includes(call.caller.phone) && 
                        !call.caller.phone.includes(call.caller.name)) && (
                        <div className="text-sm text-gray-500">{call.caller.phone}</div>
                      )}
                    </div>
                  </div>
                  <Badge className={`px-2 py-1 text-xs ${
                    call.followupStatus === 1 ? "bg-yellow-100 text-yellow-800" :
                    call.followupStatus === 3 ? "bg-green-100 text-green-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {FOLLOWUP_STATUS_MAP[call.followupStatus] || "unknown"}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <UserAvatar name={call.receiver.name} className="w-6 h-6" />
                  <span className="text-gray-600">Assigned to: {call.receiver.name}</span>
                </div>

                <div className="text-sm text-gray-500">
                  {call.timestamp}
                </div>

                <div className="text-sm text-gray-600">
                  {call.notes || "No notes"}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Badge className={`px-2 py-1 text-xs ${
                    call.followupAttempts > 0 ? "bg-orange-100 text-orange-800" : "bg-blue-100 text-blue-800"
                  }`}>
                    {call.followupAttempts} attempt{call.followupAttempts !== 1 ? 's' : ''}
                  </Badge>

                  {/* <QuickActionButtons call={call} /> */}
                </div>

                <div className="flex gap-2 pt-2 border-t">
                  {call.followupStatus !== 3 && (
                    <button
                      onClick={() => markAsResolved(call.id)}
                      disabled={resolvingCallId === call.id}
                      className="flex-1 flex items-center justify-center gap-1 p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors disabled:opacity-50"
                    >
                      {resolvingCallId === call.id ? (
                        <div className="h-4 w-4 border-2 border-green-600 rounded-full animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                      <span className="text-sm">Resolve</span>
                    </button>
                  )}
                  <button
                    onClick={() => addNote(call.id, prompt("Enter note:") || "New note")}
                    className="flex-1 flex items-center justify-center gap-1 p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span className="text-sm">Note</span>
                  </button>
                  <button
                    onClick={() => markPriority(call.id, call.priority === "high" ? "normal" : "high")}
                    className="flex-1 flex items-center justify-center gap-1 p-2 text-gray-600 hover:text-yellow-600 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <Star className={`h-4 w-4 ${call.priority === "high" ? "fill-yellow-600 text-yellow-600" : ""}`} />
                    <span className="text-sm">Priority</span>
                  </button>
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