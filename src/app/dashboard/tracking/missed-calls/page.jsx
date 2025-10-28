'use client';
import { useState, useEffect, useMemo } from "react";
import { Phone, PhoneMissed, Search, Plus, CheckCircle, Star, Edit3, ArrowUpDown, User, PhoneOutgoing, PhoneIncoming, Users, Filter } from "lucide-react";
import KPICard from "@/components/ui/KPICard";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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

// Custom Select Component
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

// Custom CallStatusIcon component
const CallStatusIcon = ({ status, direction }) => {
  const getIconProps = () => {
    if (status === "missed") {
      return direction === "incoming"
        ? { icon: <PhoneIncoming className="h-5 w-5 text-red-600" />, label: "Incoming Missed" }
        : { icon: <PhoneOutgoing className="h-5 w-5 text-blue-600" />, label: "Outgoing Missed" };
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

const MissedCalls = () => {
  const router = useRouter();
  const [calls, setCalls] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeamMember, setSelectedTeamMember] = useState("all");
  const [sortBy, setSortBy] = useState("timestamp");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(true);
  const [teamLoading, setTeamLoading] = useState(true);

  // Fetch team members - DIFFERENT API TRY KARENGE
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setTeamLoading(true);
        
        // Pehle team performance API try karte hain
        let members = [];
        
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/calls/team/performance?period=today`,
            { withCredentials: true }
          );
          members = response.data.data || [];
          console.log("Team members from performance API:", members);
        } catch (performanceError) {
          console.log("Performance API failed, trying member-stats API");
          
          // Agar performance API fail hua toh member-stats try karte hain
          try {
            const response = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/api/calls/team/member-stats?period=today`,
              { withCredentials: true }
            );
            members = response.data.data?.teamStats || [];
            console.log("Team members from member-stats API:", members);
          } catch (memberStatsError) {
            console.log("Member-stats API also failed");
          }
        }

        // Agar dono APIs fail hui toh calls data se team members extract karte hain
        if (members.length === 0) {
          console.log("Extracting team members from calls data");
          // Temporary calls data se team members extract karenge
          const uniqueReceivers = [];
          const receiverMap = new Map();
          
          calls.forEach(call => {
            if (call.receiver && call.receiver.id && !receiverMap.has(call.receiver.id)) {
              receiverMap.set(call.receiver.id, true);
              uniqueReceivers.push({
                userId: call.receiver.id,
                userName: call.receiver.name,
                userRole: 'Team Member'
              });
            }
          });
          
          members = uniqueReceivers;
          console.log("Team members extracted from calls:", members);
        }

        setTeamMembers(members);
        
      } catch (error) {
        console.error("Error fetching team members:", error);
        toast.error("Failed to load team members");
      } finally {
        setTeamLoading(false);
      }
    };

    fetchTeamMembers();
  }, [calls]); // calls dependency add ki

  // Map numeric backend values to strings
  const mapCallData = (call) => {
    const statusMap = { 0: "missed", 1: "answered", 2: "resolved", 3: "ended" };
    const directionMap = { 0: "incoming", 1: "outgoing" };
    const priorityMap = { 0: "normal", 1: "high" };

    return {
      id: call._id,
      caller: {
        name: call.callerName || call.callerPhone || "Unknown",
        phone: call.callerPhone,
        avatar: "",
      },
      receiver: {
        name: call.receiver?.name || "Unassigned",
        id: call.receiver?._id || "unassigned",
        avatar: "",
      },
      status: statusMap[call.status] || "missed",
      direction: directionMap[call.direction] || "incoming",
      timestamp: new Date(call.timestamp).toLocaleString("en-IN", {
        dateStyle: "short",
        timeStyle: "short",
      }),
      notes: call.notes || "",
      priority: priorityMap[call.priority] || "normal",
      outgoingAttempts: call.outgoingAttempts || 0,
    };
  };

  // Fetch missed calls
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/calls/missed`, {
          withCredentials: true,
        });
        const mappedCalls = response.data.data.map(mapCallData);
        console.log("Fetched calls:", mappedCalls);
        setCalls(mappedCalls);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch missed calls");
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter and sort
  const filteredAndSortedCalls = useMemo(() => {
    return calls
      .filter((call) => {
        // Team member filter
        const matchesTeamMember = 
          selectedTeamMember === "all" || 
          call.receiver.id === selectedTeamMember;

        // Search filter
        const matchesSearch =
          call.caller.phone.includes(searchTerm) ||
          call.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
          call.receiver.name.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesTeamMember && matchesSearch;
      })
      .sort((a, b) => {
        let aValue, bValue;
        switch (sortBy) {
          case "timestamp":
            aValue = new Date(a.timestamp).getTime();
            bValue = new Date(b.timestamp).getTime();
            break;
          case "receiver":
            aValue = a.receiver.name;
            bValue = b.receiver.name;
            break;
          case "outgoingAttempts":
            aValue = a.outgoingAttempts;
            bValue = b.outgoingAttempts;
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

  // Calculate KPIs based on filtered data
  const calculateKPIs = () => {
    const filteredCalls = calls.filter(call => 
      selectedTeamMember === "all" || call.receiver.id === selectedTeamMember
    );
    
    return { 
      missedCalls: filteredCalls.length,
      teamMemberCalls: selectedTeamMember !== "all" ? 
        filteredCalls.length : 
        null
    };
  };

  const kpiData = calculateKPIs();

  // Get selected team member name
  const getSelectedMemberName = () => {
    if (selectedTeamMember === "all") return "All Team Members";
    if (selectedTeamMember === "unassigned") return "Unassigned Calls";
    
    const member = teamMembers.find(m => m.userId === selectedTeamMember);
    return member ? member.userName : "Selected Member";
  };

  // Handle select change
  const handleTeamMemberSelect = (value) => {
    setSelectedTeamMember(value);
  };

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

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          title={selectedTeamMember === "all" ? "Total Missed Calls" : "Member's Missed Calls"} 
          value={kpiData.missedCalls} 
          icon={PhoneIncoming} 
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
              placeholder="Search calls, numbers, notes, team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-sm sm:text-base"
            />
          </div>
          
          <div className="flex gap-2">
            {/* Team Member Filter - FIXED */}
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
              
              {/* Unassigned calls option */}
              <CustomSelectItem value="unassigned" onSelect={handleTeamMemberSelect}>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Unassigned Calls
                </div>
              </CustomSelectItem>
              
              {/* Team members list */}
              {teamMembers.map((member) => (
                <CustomSelectItem key={member.userId} value={member.userId} onSelect={handleTeamMemberSelect}>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {member.userName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{member.userName || 'Unknown Member'}</span>
                      <span className="text-xs text-gray-500">{member.userRole || 'Team Member'}</span>
                    </div>
                  </div>
                </CustomSelectItem>
              ))}
            </CustomSelect>

            {/* Clear Filters */}
            {(searchTerm || selectedTeamMember !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedTeamMember("all");
                }}
                className="whitespace-nowrap"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Rest of the table code remains the same */}
      <Card>
        {/* Desktop Table */}
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
                <TableHead onClick={() => handleSort("timestamp")} className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    Time
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Notes</TableHead>
                <TableHead onClick={() => handleSort("outgoingAttempts")} className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    Follow-up Attempts
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedCalls.map((call) => (
                <TableRow key={call.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex flex-col items-start">
                      <div className="text-sm font-medium text-gray-900">{call.caller.name}</div>
                      <div className="text-sm text-gray-500">{call.caller.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {call.receiver.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{call.receiver.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <CallStatusIcon status={call.status} direction={call.direction} />
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
                      call.outgoingAttempts > 0 
                        ? "bg-orange-100 text-orange-800" 
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      {call.outgoingAttempts} attempt{call.outgoingAttempts !== 1 ? 's' : ''}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <button
                        onClick={() => addNote(call.id, prompt("Enter note:") || "New note")}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-md"
                        title="Add Note"
                      >
                        <Edit3 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => markPriority(call.id, call.priority === "high" ? "normal" : "high")}
                        className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-gray-100 rounded-md"
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

        {/* Mobile layout code... */}
      </Card>
    </div>
  );
};

export default MissedCalls;