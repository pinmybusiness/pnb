'use client';
import { useState, useEffect, useMemo } from "react";
import { Phone, PhoneCall, PhoneMissed, PhoneIncoming, PhoneOutgoing, Search, Plus, CheckCircle, Star, Edit3, ArrowUpDown, User } from "lucide-react";
import KPICard from "@/components/ui/KPICard";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card, Button, Input, Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui";

// StatusBadge component to display status with proper styling
const StatusBadge = ({ status }) => {
  const getStatusStyles = (status) => {
    switch (status) {
      case "missed":
        return { className: "bg-red-100 text-red-800", label: "Missed" };
      case "answered":
        return { className: "bg-blue-100 text-blue-800", label: "Answered" };
      case "resolved":
        return { className: "bg-green-100 text-green-800", label: "Resolved" };
      case "ended":
        return { className: "bg-gray-100 text-gray-800", label: "Ended" };
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

const CallTracking = () => {
  const router = useRouter();
  const [calls, setCalls] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [directionFilter, setDirectionFilter] = useState("all");
  const [agentFilter, setAgentFilter] = useState("all");
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
        avatar: "", // Add avatar logic if available in backend
      },
      receiver: {
        name: call.receiver?.name || "Unknown",
        avatar: "", // Add avatar logic if available
      },
      duration: call.duration || "0:00",
      status: statusMap[call.status] || "answered",
      direction: directionMap[call.direction] || "incoming",
      timestamp: new Date(call.timestamp).toLocaleString("en-IN", {
        dateStyle: "short",
        timeStyle: "short",
      }),
      notes: call.notes || "",
      priority: priorityMap[call.priority] || "normal",
    };
  };

  // Fetch calls from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/calls`, {
          withCredentials: true, // For JWT cookie
        });
        const mappedCalls = response.data.data.map(mapCallData);
        setCalls(mappedCalls);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch call data");
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter and sort calls
  const filteredAndSortedCalls = useMemo(() => {
    return calls
      .filter((call) => {
        const matchesSearch =
          call.caller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          call.caller.phone.includes(searchTerm) ||
          call.notes.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || call.status === statusFilter;
        const matchesDirection = directionFilter === "all" || call.direction === directionFilter;
        const matchesAgent = agentFilter === "all" || call.receiver.name === agentFilter;
        return matchesSearch && matchesStatus && matchesDirection && matchesAgent;
      })
      .sort((a, b) => {
        let aValue, bValue;
        switch (sortBy) {
          case "caller":
            aValue = a.caller.name || "";
            bValue = b.caller.name || "";
            break;
          case "duration":
            aValue = parseDuration(a.duration);
            bValue = parseDuration(b.duration);
            break;
          case "timestamp":
            aValue = new Date(a.timestamp).getTime();
            bValue = new Date(b.timestamp).getTime();
            break;
          case "status":
            aValue = a.status || "";
            bValue = b.status || "";
            break;
          default:
            return 0;
        }
        if (typeof aValue === "string") {
          return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      });
  }, [calls, searchTerm, statusFilter, directionFilter, agentFilter, sortBy, sortOrder]);

  // Helper to parse duration to seconds for sorting
  const parseDuration = (duration) => {
    const [minutes, seconds] = duration.split(":").map(Number);
    return minutes * 60 + seconds || 0;
  };

  // Calculate KPI stats
  const calculateKPIs = () => {
    if (calls.length === 0) return { totalCalls: 0, missedCalls: 0, answeredCalls: 0, resolvedCalls: 0 };
    const totalCalls = calls.length;
    const missedCalls = calls.filter((c) => c.status === "missed").length;
    const answeredCalls = calls.filter((c) => c.status === "answered").length;
    const resolvedCalls = calls.filter((c) => c.status === "resolved").length;
    return { totalCalls, missedCalls, answeredCalls, resolvedCalls };
  };

  // Handle status update
  const handleUpdateStatus = async (callId, status) => {
    try {
      const statusMap = { missed: 0, answered: 1, resolved: 2, ended: 3 };
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/calls/${callId}/status`,
        { status: statusMap[status] },
        { withCredentials: true }
      );
      setCalls(
        calls.map((call) =>
          call.id === callId ? { ...call, status } : call
        )
      );
      toast.success("Call status updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  // Handle adding a note
  const addNote = async (callId, note) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/calls/${callId}/notes`,
        { notes: note },
        { withCredentials: true }
      );
      setCalls(
        calls.map((call) =>
          call.id === callId ? { ...call, notes: note } : call
        )
      );
      toast.success("Note added successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add note");
    }
  };

  // Handle marking priority
  const markPriority = async (callId, priority) => {
    try {
      const priorityMap = { normal: 0, high: 1 };
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/calls/${callId}/priority`,
        { priority: priorityMap[priority] },
        { withCredentials: true }
      );
      setCalls(
        calls.map((call) =>
          call.id === callId ? { ...call, priority } : call
        )
      );
      toast.success("Priority updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update priority");
    }
  };

  // Handle sorting
  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("desc");
    }
  };

  // Status, direction, and agent options
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

  // Fetch unique agents from calls
  const agentOptions = useMemo(() => {
    const agents = [...new Set(calls.map((call) => call.receiver.name))].filter(Boolean);
    return [
      { value: "all", label: "All Agents" },
      ...agents.map((name) => ({ value: name, label: name })),
    ];
  }, [calls]);

  const kpiData = calculateKPIs();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Call Tracking Dashboard</h1>
          <p className="text-gray-500">Monitor and manage all restaurant calls</p>
        </div>
        {/* <Link href="/dashboard/calls/add">
          <Button className="rounded-lg">
            <Plus className="h-4 w-4 mr-2" />
            Add Call
          </Button>
        </Link> */}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Calls" value={kpiData.totalCalls} icon={PhoneCall} />
        <KPICard title="Missed Calls" value={kpiData.missedCalls} icon={PhoneMissed} />
        <KPICard title="Answered Calls" value={kpiData.answeredCalls} icon={Phone} />
        <KPICard title="Resolved Calls" value={kpiData.resolvedCalls} icon={CheckCircle} />
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search calls, numbers, notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"
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
            className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"
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
            className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort("caller")} className="cursor-pointer">
                <div className="flex items-center gap-2">
                  Caller
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Receiver</TableHead>
              <TableHead onClick={() => handleSort("duration")} className="cursor-pointer">
                <div className="flex items-center gap-2">
                  Duration
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead onClick={() => handleSort("status")} className="cursor-pointer">
                <div className="flex items-center gap-2">
                  Status
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Direction</TableHead>
              <TableHead onClick={() => handleSort("timestamp")} className="cursor-pointer">
                <div className="flex items-center gap-2">
                  Time
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedCalls.map((call) => (
              <TableRow key={call.id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                      {call.caller.avatar ? (
                        <Image
                          src={call.caller.avatar}
                          alt={call.caller.name}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{call.caller.name}</div>
                      <div className="text-sm text-gray-500">{call.caller.phone}</div>
                    </div>
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
                  <div className="text-sm font-mono text-gray-900">{call.duration}</div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <StatusBadge status={call.status} />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {call.direction === "incoming" ? (
                      <PhoneIncoming className="h-4 w-4 text-green-600" />
                    ) : (
                      <PhoneOutgoing className="h-4 w-4 text-blue-600" />
                    )}
                    <span className="text-sm capitalize">{call.direction}</span>
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
                  <div className="flex gap-2">
                    {call.status === "missed" && (
                      <button
                        onClick={() => handleUpdateStatus(call.id, "resolved")}
                        className="p-2 text-green-600 hover:text-green-800 hover:bg-gray-100 rounded-md"
                        title="Resolve"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => addNote(call.id, prompt("Enter note:") || "New note")}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-md"
                      title="Add Note"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => markPriority(call.id, call.priority === "high" ? "normal" : "high")}
                      className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-gray-100 rounded-md"
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

        {filteredAndSortedCalls.length === 0 && (
          <div className="p-12 text-center">
            <PhoneCall className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No calls found</h3>
            <p className="text-gray-500">
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