"use client";

import { useState, useMemo } from "react";
import { 
  Users, 
  Repeat, 
  Search, 
  ArrowUpDown, 
  UserPlus, 
  Calendar, 
  X, 
  Loader2,
  Phone,
  PhoneCall,
  PhoneMissed,
  TrendingUp,
  Clock,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import ReactDOM from 'react-dom';
import TimelineDrawer from "./TimelineDrawer";

// ─── Orange color constant ─────────────────────────────────────────────
const ORANGE = "#ff5a1f";
const ORANGE_LIGHT = "#fff1e6";

// ─── Card Component ───────────────────────────────────────────────
const Card = ({ className = "", children }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>
    {children}
  </div>
);

// ─── Button Component ─────────────────────────────────────────────
const Button = ({ children, variant = "primary", size = "default", onClick, className = "", disabled = false }) => {
  const variants = {
    primary: "bg-orange-600 text-white hover:bg-orange-700",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    outline: "border border-gray-200 bg-white hover:bg-gray-50 text-gray-700",
  };
  
  const sizes = {
    default: "px-4 py-2 text-sm",
    sm: "px-3 py-1.5 text-xs",
  };
  
  return (
    <button
      className={`inline-flex items-center justify-center font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

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

// ─── KPICard Component ────────────────────────────────────────────
const KPICard = ({ title, value, icon: Icon, description, trend }) => (
  <Card className="p-5 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {description && (
          <p className="text-xs text-gray-400">{description}</p>
        )}
      </div>
      <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
        <Icon size={24} color={ORANGE} />
      </div>
    </div>
    {trend && (
      <div className="mt-3 flex items-center gap-1 text-xs">
        <TrendingUp className="w-3 h-3 text-green-500" />
        <span className="text-green-600">{trend}</span>
      </div>
    )}
  </Card>
);

// ─── Pagination Component ─────────────────────────────────────────
const Pagination = ({ pagination, onPageChange, loading }) => {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
      <p className="text-sm text-gray-500">
        Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{" "}
        <span className="font-medium">
          {Math.min(pagination.page * pagination.limit, pagination.total)}
        </span>{" "}
        of <span className="font-medium">{pagination.total}</span> customers
      </p>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={pagination.page === 1 || loading}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        {[...Array(Math.min(3, pagination.pages))].map((_, i) => {
          let pageNum;
          if (pagination.pages <= 3) {
            pageNum = i + 1;
          } else if (pagination.page === 1) {
            pageNum = i + 1;
          } else if (pagination.page === pagination.pages) {
            pageNum = pagination.pages - 2 + i;
          } else {
            pageNum = pagination.page - 1 + i;
          }
          
          return (
            <Button
              key={pageNum}
              variant={pagination.page === pageNum ? "primary" : "outline"}
              size="sm"
              onClick={() => onPageChange(pageNum)}
              disabled={loading}
            >
              {pageNum}
            </Button>
          );
        })}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pagination.page + 1)}
          disabled={pagination.page === pagination.pages || loading}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};


// ─── Customer Intelligence Demo Data ──────────────────────────────
const CUSTOMER_DATA = [
  {
    _id: "+919876543210",
    phonebookName: "Rajesh Kumar",
    totalCalls: 24,
    answeredCalls: 18,
    missedCalls: 6,
    lastCall: "2026-03-14T10:30:00Z",
    firstCall: "2026-01-05T09:15:00Z",
    avgDuration: 185,
    preferredTime: "Morning",
  },
  {
    _id: "+919876543211",
    phonebookName: "Priya Sharma",
    totalCalls: 18,
    answeredCalls: 15,
    missedCalls: 3,
    lastCall: "2026-03-14T09:45:00Z",
    firstCall: "2026-02-10T14:20:00Z",
    avgDuration: 210,
    preferredTime: "Afternoon",
  },
  {
    _id: "+919876543212",
    phonebookName: "Amit Patel",
    totalCalls: 32,
    answeredCalls: 28,
    missedCalls: 4,
    lastCall: "2026-03-13T16:20:00Z",
    firstCall: "2025-12-15T11:30:00Z",
    avgDuration: 165,
    preferredTime: "Evening",
  },
  {
    _id: "+919876543213",
    phonebookName: "Sneha Gupta",
    totalCalls: 12,
    answeredCalls: 8,
    missedCalls: 4,
    lastCall: "2026-03-13T14:15:00Z",
    firstCall: "2026-02-20T10:45:00Z",
    avgDuration: 140,
    preferredTime: "Afternoon",
  },
  {
    _id: "+919876543214",
    phonebookName: "Vikram Singh",
    totalCalls: 45,
    answeredCalls: 38,
    missedCalls: 7,
    lastCall: "2026-03-12T18:30:00Z",
    firstCall: "2025-11-01T09:00:00Z",
    avgDuration: 195,
    preferredTime: "Evening",
  },
  {
    _id: "+919876543215",
    phonebookName: "Neha Verma",
    totalCalls: 8,
    answeredCalls: 6,
    missedCalls: 2,
    lastCall: "2026-03-12T11:20:00Z",
    firstCall: "2026-03-01T13:15:00Z",
    avgDuration: 120,
    preferredTime: "Morning",
  },
  {
    _id: "+919876543216",
    phonebookName: "Rahul Mehta",
    totalCalls: 29,
    answeredCalls: 22,
    missedCalls: 7,
    lastCall: "2026-03-11T15:45:00Z",
    firstCall: "2026-01-15T16:30:00Z",
    avgDuration: 175,
    preferredTime: "Afternoon",
  },
  {
    _id: "+919876543217",
    phonebookName: "Pooja Desai",
    totalCalls: 16,
    answeredCalls: 14,
    missedCalls: 2,
    lastCall: "2026-03-11T10:10:00Z",
    firstCall: "2026-02-05T12:00:00Z",
    avgDuration: 155,
    preferredTime: "Morning",
  },
];

// ─── Overview Data ─────────────────────────────────────────────────
const OVERVIEW_DATA = {
  totalCustomers: 156,
  newCustomers: 23,
  repeatCustomers: 133,
  avgCallsPerCustomer: 4.2,
  totalCalls: 184,
  answeredRate: 78.5,
  missedRate: 21.5,
};

// Mock timeline data with exact structure
const mockTimelineData = [
  {
    startTime: "2026-03-14T10:30:00",
    answered: true,
    inbound: true,
    duration: 185,
    userId: { name: "Rajesh" },
    recordingUrl: "https://example.com/recording1.mp3"
  },
  {
    startTime: "2026-03-13T15:45:00",
    answered: false,
    inbound: false,
    duration: 0,
    userId: { name: "Priya" },
    recordingUrl: null
  },
  {
    startTime: "2026-03-12T09:20:00",
    answered: true,
    inbound: true,
    duration: 272,
    userId: { name: "Amit" },
    recordingUrl: "https://example.com/recording2.mp3"
  },
  {
    startTime: "2026-03-11T14:10:00",
    answered: true,
    inbound: false,
    duration: 124,
    userId: { name: "Neha" },
    recordingUrl: null
  },
  {
    startTime: "2026-03-10T11:55:00",
    answered: false,
    inbound: true,
    duration: 0,
    userId: { name: "Rajesh" },
    recordingUrl: null
  }
];

// ─── Main Customer Intelligence Demo Screen ───────────────────────
export default function CustomerIntelligenceDemoScreen() {
  const [period, setPeriod] = useState("month");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("totalCalls");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [timelineData, setTimelineData] = useState([]);

  
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: CUSTOMER_DATA.length,
    pages: Math.ceil(CUSTOMER_DATA.length / 5),
  });

  // Filter and sort customers
  const filteredCustomers = useMemo(() => {
    let filtered = [...CUSTOMER_DATA];

    // Apply search
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(customer =>
        customer.phonebookName.toLowerCase().includes(search) ||
        customer._id.includes(search)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === "phonebookName") {
        aValue = a.phonebookName;
        bValue = b.phonebookName;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [CUSTOMER_DATA, searchTerm, sortBy, sortOrder]);

  // Get current page data
  const currentPageCustomers = useMemo(() => {
    const start = (pagination.page - 1) * pagination.limit;
    const end = start + pagination.limit;
    return filteredCustomers.slice(start, end);
  }, [filteredCustomers, pagination.page, pagination.limit]);

  // Update pagination when filters change
  useMemo(() => {
    setPagination(prev => ({
      ...prev,
      total: filteredCustomers.length,
      pages: Math.ceil(filteredCustomers.length / prev.limit),
      page: 1
    }));
  }, [filteredCustomers.length]);

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("desc");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  const openTimeline = (customer) => {
    setSelectedCustomer(customer);
    const customerTimeline = mockTimelineData; // In real app, filter by customer._id
  setTimelineData(customerTimeline);
  setIsTimelineOpen(true);
};

  const closeTimeline = () => {
    setIsTimelineOpen(false);
    setSelectedCustomer(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const getSortIcon = (key) => {
    if (sortBy !== key) return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    return sortOrder === "asc" ? "↑" : "↓";
  };

  // Mock timeline data
  const mockTimeline = [
    {
      direction: "incoming",
      answered: true,
      time: "10:30 AM",
      duration: "4:32",
      agent: "Rajesh",
    },
    {
      direction: "outgoing",
      answered: true,
      time: "09:15 AM",
      duration: "2:18",
      agent: "Priya",
    },
    {
      direction: "incoming",
      answered: false,
      time: "Yesterday",
      duration: "0:00",
      agent: "Amit",
    },
  ];

  const mockSummary = {
    totalCalls: 24,
    answered: 18,
    missed: 6,
  };

  return (
    <div className="space-y-6 animate-fade-in p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Customer Intelligence</h3>
          <p className="text-gray-500">Analyze customer calling patterns and behavior</p>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          {[
            { key: "today", label: "Today" },
            { key: "yesterday", label: "Yesterday" },
            { key: "week", label: "Week" },
            { key: "month", label: "Month" }
          ].map(p => (
            <button
              key={p.key}
              onClick={() => handlePeriodChange(p.key)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                period === p.key
                  ? "bg-orange-600 text-white"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <KPICard
          title="Active Customers"
          value={OVERVIEW_DATA.totalCustomers}
          icon={Users}
          description="Total customers"
        />
        <KPICard
          title="New Customers"
          value={OVERVIEW_DATA.newCustomers}
          icon={UserPlus}
          description="First time callers"
        />
        <KPICard
          title="Repeat Customers"
          value={OVERVIEW_DATA.repeatCustomers}
          icon={Repeat}
          description="Returning customers"
        />
      </div>

      {/* Customer List Card */}
      <Card>
        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search customers by name or phone..."
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
        </div>

        {/* Loading State */}
        {listLoading ? (
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
                    <TableHead onClick={() => handleSort("phonebookName")}>
                      Customer {getSortIcon("phonebookName")}
                    </TableHead>
                    <TableHead onClick={() => handleSort("totalCalls")} className="text-center">
                      Calls
                    </TableHead>
                    <TableHead onClick={() => handleSort("answeredCalls")} className="text-center">
                      Answered
                    </TableHead>
                    <TableHead onClick={() => handleSort("missedCalls")} className="text-center">
                      Missed
                    </TableHead>
                    <TableHead onClick={() => handleSort("lastCall")}>
                      Last Calls {getSortIcon("lastCall")}
                    </TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentPageCustomers.map((customer) => {
                    const answerRate = Math.round((customer.answeredCalls / customer.totalCalls) * 100);
                    
                    return (
                      <TableRow key={customer._id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-medium">
                              {customer.phonebookName.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{customer.phonebookName}</div>
                              <div className="text-xs text-gray-400 font-mono">{customer._id}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-medium">
                          {customer.totalCalls}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="inline-flex flex-col items-center">
                            <span className="font-medium text-green-600">{customer.answeredCalls}</span>
                            <span className="text-xs text-gray-400">({answerRate}%)</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-medium text-red-600">{customer.missedCalls}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{formatDate(customer.lastCall)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => openTimeline(customer)}
                          >
                            Timeline
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Mobile View */}
            <div className="block sm:hidden space-y-3 p-3">
              {currentPageCustomers.map((customer) => {
                const answerRate = Math.round((customer.answeredCalls / customer.totalCalls) * 100);
                
                return (
                  <Card key={customer._id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-lg">
                          {customer.phonebookName.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-gray-900">{customer.phonebookName}</div>
                          <div className="text-xs text-gray-400 font-mono">{customer._id}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <div className="text-lg font-bold text-gray-900">{customer.totalCalls}</div>
                          <div className="text-xs text-gray-500">Total</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-green-600">{customer.answeredCalls}</div>
                          <div className="text-xs text-gray-500">Answered</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-red-600">{customer.missedCalls}</div>
                          <div className="text-xs text-gray-500">Missed</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {formatDate(customer.lastCall)}
                        </div>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => openTimeline(customer)}
                        >
                          Timeline
                        </Button>
                      </div>

                      <div className="text-xs text-gray-400">
                        Answer Rate: {answerRate}% • Avg Duration: {Math.floor(customer.avgDuration / 60)}:{customer.avgDuration % 60}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        )}

        {/* No Data State */}
        {currentPageCustomers.length === 0 && !listLoading && (
          <div className="py-20 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
            <p className="text-sm text-gray-500">
              {searchTerm ? "Try adjusting your search" : "No customer activity found for this period"}
            </p>
          </div>
        )}

        {/* Pagination */}
        {currentPageCustomers.length > 0 && (
          <Pagination
            pagination={{
              ...pagination,
              total: filteredCustomers.length
            }}
            onPageChange={handlePageChange}
            loading={listLoading}
          />
        )}
      </Card>

      {/* Timeline Drawer */}
      <TimelineDrawer
        isOpen={isTimelineOpen}
        onClose={closeTimeline}
        timeline={timelineData}
        activePhone={selectedCustomer?._id}
        customerName={selectedCustomer?.phonebookName}
        isLoading={false}
        />
    </div>
  );
} 