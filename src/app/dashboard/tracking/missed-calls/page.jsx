'use client';
import { useState, useEffect, useMemo } from "react";
import { Phone, PhoneMissed, Search, Plus, CheckCircle, Star, Edit3, ArrowUpDown, User, PhoneOutgoing, PhoneIncoming } from "lucide-react";
import KPICard from "@/components/ui/KPICard";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card, Button, Input, Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui";

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

// StatusBadge component
const StatusBadge = ({ status }) => {
  const getStatusStyles = (status) => {
    switch (status) {
      case "missed":
        return { className: "bg-red-100 text-red-800", label: "Missed" };
      default:
        return { className: "bg-gray-100 text-gray-800", label: status };
    }
  };

  const { className, label } = getStatusStyles(status);

  return (
    <Badge className={`px-2 py-1 text-xs font-medium rounded-full ${className}`}>
      {label}
    </Badge>
  );
};

const MissedCalls = () => {
  const router = useRouter();
  const [calls, setCalls] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("timestamp");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(true);

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
        name: call.receiver?.name || "Unknown",
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
      outgoingAttempts: call.outgoingAttempts || 0, // 👈 Added here
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
        const matchesSearch =
          call.caller.phone.includes(searchTerm) ||
          call.notes.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
      })
      .sort((a, b) => {
        let aValue, bValue;
        switch (sortBy) {
          case "timestamp":
            aValue = new Date(a.timestamp).getTime();
            bValue = new Date(b.timestamp).getTime();
            break;
          default:
            return 0;
        }
        if (typeof aValue === "string") {
          return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      });
  }, [calls, searchTerm, sortBy, sortOrder]);

  // Handle actions
  const handleUpdateStatus = async (callId, status) => {
    try {
      const statusMap = { missed: 0, answered: 1, resolved: 2, ended: 3 };
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/calls/${callId}/status`,
        { status: statusMap[status] },
        { withCredentials: true }
      );
      setCalls(calls.filter((call) => call.id !== callId));
      toast.success("Call status updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const addNote = async (callId, note) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/calls/${callId}/notes`,
        { notes: note },
        { withCredentials: true }
      );
      setCalls(calls.map((call) => (call.id === callId ? { ...call, notes: note } : call)));
      toast.success("Note added successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add note");
    }
  };

  const markPriority = async (callId, priority) => {
    try {
      const priorityMap = { normal: 0, high: 1 };
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/calls/${callId}/priority`,
        { priority: priorityMap[priority] },
        { withCredentials: true }
      );
      setCalls(calls.map((call) => (call.id === callId ? { ...call, priority } : call)));
      toast.success("Priority updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update priority");
    }
  };

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("desc");
    }
  };

  const calculateKPIs = () => ({ missedCalls: calls.length });
  const kpiData = calculateKPIs();

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
          <p className="text-sm sm:text-base text-gray-500">Monitor and manage missed restaurant calls</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Missed Calls" value={kpiData.missedCalls} icon={PhoneIncoming} />
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search calls, numbers, notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-sm sm:text-base"
            />
          </div>
        </div>
      </Card>

      {/* Calls Table */}
      <Card>
        {/* Desktop Table */}
        <div className="hidden sm:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Caller</TableHead>
                <TableHead>Receiver</TableHead>
                <TableHead>Status</TableHead>
                <TableHead onClick={() => handleSort("timestamp")} className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    Time
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Outgoing Attempts</TableHead> {/* 👈 Added */}
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
                      <div className="flex-shrink-0 h-8 w-8 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                        {call.receiver.avatar ? (
                          <Image
                            src={call.receiver.avatar}
                            alt={call.receiver.name}
                            width={32}
                            height={32}
                            className="object-cover"
                          />
                        ) : (
                          <User className="h-4 w-4 text-gray-400" />
                        )}
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
                    <Badge className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      {call.outgoingAttempts}
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

        {/* Mobile Card Layout */}
        <div className="block sm:hidden space-y-4 p-4">
          {filteredAndSortedCalls.map((call) => (
            <Card key={call.id} className="p-4 shadow-sm">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium text-gray-900">{call.caller.phone}</div>
                    <CallStatusIcon status={call.status} direction={call.direction} />
                  </div>
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
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0 h-8 w-8 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                    {call.receiver.avatar ? (
                      <Image
                        src={call.receiver.avatar}
                        alt={call.receiver.name}
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    ) : (
                      <User className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{call.receiver.name}</span>
                </div>
                <div className="text-sm">
                  <div>{call.timestamp.split(", ")[1]}</div>
                  <div className="text-xs text-gray-500">{call.timestamp.split(", ")[0]}</div>
                </div>
                <div className="text-sm text-gray-500">
                  <span className="font-medium">Notes:</span> {call.notes || "No notes"}
                </div>
                <div className="text-sm text-gray-500">
                  <span className="font-medium">Outgoing Attempts:</span>{" "}
                  <Badge className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    {call.outgoingAttempts}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredAndSortedCalls.length === 0 && (
          <div className="p-12 text-center">
            <PhoneMissed className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No missed calls found</h3>
            <p className="text-gray-500">
              {searchTerm ? "Try adjusting your search criteria" : "All missed calls have been resolved or followed up"}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default MissedCalls;
