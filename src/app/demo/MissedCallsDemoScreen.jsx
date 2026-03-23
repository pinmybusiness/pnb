"use client";

import { useState, useMemo } from "react";
import { 
  PhoneMissed, 
  Search, 
  ArrowUpDown, 
  User, 
  Check,
  Ban,
  AlertCircle,
  Loader2,
  Phone,
  PhoneIncoming,
  Clock,
  X
} from "lucide-react";

// ─── Orange color constant ─────────────────────────────────────────────
const ORANGE = "#ff5a1f";

// ─── Card Component ───────────────────────────────────────────────
const Card = ({ className = "", children }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>
    {children}
  </div>
);

// ─── Input Component ──────────────────────────────────────────────
const Input = ({ className = "", icon, ...props }) => (
  <div className="relative">
    {icon && (
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </div>
    )}
    <input
      className={`border border-gray-200 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 ${icon ? 'pl-10' : ''} ${className}`}
      {...props}
    />
  </div>
);

// ─── Table Components ─────────────────────────────────────────────
const Table = ({ children }) => <table className="w-full">{children}</table>;
const TableHeader = ({ children }) => <thead className="bg-gray-50 border-y border-gray-200">{children}</thead>;
const TableBody = ({ children }) => <tbody className="divide-y divide-gray-100">{children}</tbody>;
const TableRow = ({ children, className = "" }) => <tr className={`hover:bg-gray-50 transition-colors ${className}`}>{children}</tr>;
const TableHead = ({ children, sortable = true, onClick, className = "" }) => (
  <th
    scope="col"
    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${sortable ? 'cursor-pointer hover:text-gray-700' : ''} ${className}`}
    onClick={onClick}
  >
    <div className="flex items-center gap-2">
      {children}
    </div>
  </th>
);
const TableCell = ({ children, className = "" }) => (
  <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-700 ${className}`}>{children}</td>
);

// ─── Badge Component ──────────────────────────────────────────────
const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    yellow: "bg-yellow-100 text-yellow-800",
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
    blue: "bg-blue-100 text-blue-800",
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

// ─── TimeDisplay Component ────────────────────────────────────────
const TimeDisplay = ({ startTime }) => {
  const date = new Date(startTime);
  return (
    <div className="text-sm">
      <div className="font-medium text-gray-900">
        {date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
      </div>
      <div className="text-xs text-gray-400">
        {date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
      </div>
    </div>
  );
};

// ─── DirectionBadge Component ─────────────────────────────────────
const DirectionBadge = ({ inbound }) => (
  <Badge variant={inbound ? "blue" : "default"}>
    {inbound ? 'Incoming' : 'Outgoing'}
  </Badge>
);

// ─── StatusBadge Component ────────────────────────────────────────
const StatusBadge = ({ answered }) => (
  <Badge variant={answered ? "green" : "red"}>
    {answered ? 'Answered' : 'Missed'}
  </Badge>
);

// ─── FollowUpBadge Component ──────────────────────────────────────
const FollowUpBadge = ({ followUp }) => {
  const status = followUp?.status || 0;

  const followUpConfig = {
    0: { variant: "default", label: "None" },
    1: { variant: "yellow", label: "Pending" },
    2: { variant: "blue", label: "Done" },
    3: { variant: "green", label: "Resolved" },
    4: { variant: "red", label: "Ignored" }
  };

  const { variant, label } = followUpConfig[status] || followUpConfig[0];

  return (
    <Badge variant={variant}>
      {label}
    </Badge>
  );
};

// ─── Missed Calls Demo Data ───────────────────────────────────────
const MISSED_CALLS_DATA = [
  {
    id: "+919876543210",
    caller: {
      name: "Rajesh",
      phone: "9876543210",
      formattedPhone: "9876543210"
    },
    receiver: {
      name: "Amit"
    },
    answered: false,
    inbound: true,
    startTime: "2026-03-14T10:30:00",
    isSpam: false,
    followUp: { status: 1 }
  },
  {
    id: "+919876543211",
    caller: {
      name: "Priya",
      phone: "8765432109",
      formattedPhone: "8765432109"
    },
    receiver: {
      name: "Neha"
    },
    answered: false,
    inbound: true,
    startTime: "2026-03-14T09:15:00",
    isSpam: false,
    followUp: { status: 1 }
  },
  {
    id: "+919876543212",
    caller: {
      name: "Amit Patel",
      phone: "7654321098",
      formattedPhone: "7654321098"
    },
    receiver: {
      name: "Rohit"
    },
    answered: false,
    inbound: true,
    startTime: "2026-03-13T16:45:00",
    isSpam: false,
    followUp: { status: 1}
  },
  {
    id: "+919876543213",
    caller: {
      name: "Sneha Gupta",
      phone: "6543210987",
      formattedPhone: "6543210987"
    },
    receiver: {
      name: "Priya"
    },
    answered: false,
    inbound: true,
    startTime: "2026-03-13T14:20:00",
    isSpam: false,
    followUp: { status: 1 }
  },
  {
    id: "+919876543214",
    caller: {
      name: "Vikram Singh",
      phone: "6432109876",
      formattedPhone: "5432109876"
    },
    receiver: {
      name: "Amit"
    },
    answered: false,
    inbound: true,
    startTime: "2026-03-12T18:30:00",
    isSpam: false,
    followUp: { status: 2 }
  },
  {
    id: "+919876543215",
    caller: {
      name: "Neha Verma",
      phone: "8321098765",
      formattedPhone: "4321098765"
    },
    receiver: {
      name: "Rahul"
    },
    answered: false,
    inbound: true,
    startTime: "2026-03-12T11:10:00",
    isSpam: false,
    followUp: { status: 1 }
  },
  {
    id: "+919876543216",
    caller: {
      name: "Rahul Mehta",
      phone: "9210987654",
      formattedPhone: "3210987654"
    },
    receiver: {
      name: "Neha"
    },
    answered: false,
    inbound: true,
    startTime: "2026-03-11T15:55:00",
    isSpam: false,
    followUp: { status: 3 }
  },
  {
    id: "+919876543217",
    caller: {
      name: "Pooja Desai",
      phone: "7109876543",
      formattedPhone: "2109876543"
    },
    receiver: {
      name: "Rohit"
    },
    answered: false,
    inbound: true,
    startTime: "2026-03-11T10:30:00",
    isSpam: true,
    followUp: { status: 4 }
  },
];

// ─── Main Missed Calls Demo Screen ────────────────────────────────
export default function MissedCallsDemoScreen() {
  const [calls, setCalls] = useState(MISSED_CALLS_DATA);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("startTime");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(false);
  const [resolvingCallId, setResolvingCallId] = useState(null);
  const [daysLimit, setDaysLimit] = useState(3);

  // Filter and sort calls
  const filteredCalls = useMemo(() => {
    let filtered = [...calls];

    // Apply search
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(call =>
        call.caller.phone.toLowerCase().includes(search) ||
        call.receiver.name.toLowerCase().includes(search)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const multiplier = sortOrder === "asc" ? 1 : -1;
      
      if (sortBy === "startTime") {
        return multiplier * (new Date(a.startTime) - new Date(b.startTime));
      }
      if (sortBy === "caller") {
        return multiplier * a.caller.name.localeCompare(b.caller.name);
      }
      return 0;
    });

    return filtered;
  }, [calls, searchTerm, sortBy, sortOrder]);

  // KPI Data
  const kpiData = useMemo(() => {
    const pending = filteredCalls.filter(call => call.followUp.status === 1).length;
    const resolved = filteredCalls.filter(call => call.followUp.status === 3).length;
    const spam = filteredCalls.filter(call => call.isSpam).length;
    const total = filteredCalls.length;
    
    return { total, pending, resolved, spam };
  }, [filteredCalls]);

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("desc");
    }
  };

  const markAsResolved = (callId) => {
    setResolvingCallId(callId);
    setTimeout(() => {
      setCalls(prev => prev.map(call => 
        call.id === callId 
          ? { ...call, followUp: { status: 3 } }
          : call
      ));
      setResolvingCallId(null);
    }, 1000);
  };

  const markAsSpam = (callId) => {
    if (!window.confirm('Mark this number as spam?')) return;
    
    setCalls(prev => prev.map(call => 
      call.id === callId 
        ? { ...call, isSpam: true, followUp: { status: 4 } }
        : call
    ));
  };

  const handleDaysChange = (days) => {
    setDaysLimit(days);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  const getSortIcon = (key) => {
    if (sortBy !== key) return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    return sortOrder === "asc" ? "↑" : "↓";
  };

  return (
    <div className="space-y-6 animate-fade-in p-4">

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
       

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Pending Follow-up</p>
              <p className="text-2xl font-bold text-gray-900">{kpiData.pending}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
              <AlertCircle size={24} color="#eab308" />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Resolved</p>
              <p className="text-2xl font-bold text-gray-900">{kpiData.resolved}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <Check size={24} color="#22c55e" />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Marked as Spam</p>
              <p className="text-2xl font-bold text-gray-900">{kpiData.spam}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
              <Ban size={24} color="#ef4444" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by caller name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <select
            value={daysLimit}
            onChange={(e) => handleDaysChange(Number(e.target.value))}
            className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
          >
            <option value={3}>Last 3 Days</option>
            <option value={5}>Last 5 Days</option>
            <option value={7}>Last 7 Days</option>
          </select>
        </div>
      </Card>

      {/* Calls Table */}
      <Card>
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead onClick={() => handleSort("caller")}>
                      Caller {getSortIcon("caller")}
                    </TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead>Direction</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead onClick={() => handleSort("startTime")}>
                      Call Time {getSortIcon("startTime")}
                    </TableHead>
                    <TableHead>Follow-up</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCalls.map((call) => (
                    <TableRow key={call.id}>
                      <TableCell>
                        <div className="text-sm text-gray-700 font-mono">{call.caller.phone}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{call.receiver.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DirectionBadge inbound={call.inbound} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge answered={call.answered} />
                      </TableCell>
                      <TableCell>
                        <TimeDisplay startTime={call.startTime} />
                      </TableCell>
                      <TableCell>
                        <FollowUpBadge followUp={call.followUp} />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {call.followUp.status !== 3 && !call.isSpam && (
                            <button
                              onClick={() => markAsResolved(call.id)}
                              disabled={resolvingCallId === call.id}
                              className="p-2 text-green-600 hover:text-white hover:bg-green-600 rounded-md transition-colors"
                              title="Mark as Resolved"
                            >
                              {resolvingCallId === call.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Check className="w-4 h-4" />
                              )}
                            </button>
                          )}

                          {!call.isSpam && (
                            <button
                              onClick={() => markAsSpam(call.id)}
                              className="p-2 text-red-600 hover:text-white hover:bg-red-600 rounded-md transition-colors"
                              title="Mark as Spam"
                            >
                              <Ban className="w-4 h-4" />
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
            <div className="block sm:hidden space-y-3 p-3">
              {filteredCalls.map((call) => (
                <Card key={call.id} className="p-4">
                  <div className="space-y-3">
                    {/* Caller Info */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-lg">
                        {call.caller.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-900">{call.caller.name}</div>
                        <div className="text-xs text-gray-400 font-mono">{call.caller.phone}</div>
                      </div>
                      <TimeDisplay startTime={call.startTime} />
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{call.receiver.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <DirectionBadge inbound={call.inbound} />
                      </div>
                    </div>

                    {/* Status and Follow-up */}
                    <div className="flex items-center justify-between">
                      <StatusBadge answered={call.answered} />
                      <FollowUpBadge followUp={call.followUp} />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
                      {call.followUp.status !== 3 && !call.isSpam && (
                        <button
                          onClick={() => markAsResolved(call.id)}
                          disabled={resolvingCallId === call.id}
                          className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg flex items-center gap-1"
                        >
                          {resolvingCallId === call.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Check className="w-3 h-3" />
                          )}
                          Resolve
                        </button>
                      )}
                      {!call.isSpam && (
                        <button
                          onClick={() => markAsSpam(call.id)}
                          className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg flex items-center gap-1"
                        >
                          <Ban className="w-3 h-3" />
                          Spam
                        </button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* No Data State */}
        {filteredCalls.length === 0 && !loading && (
          <div className="py-20 text-center">
            <PhoneMissed className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No missed calls found</h3>
            <p className="text-sm text-gray-500">
              {searchTerm 
                ? "Try adjusting your search criteria" 
                : "Great! All missed calls have been followed up"}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}