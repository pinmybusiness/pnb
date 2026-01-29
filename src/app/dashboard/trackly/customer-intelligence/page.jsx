'use client';

import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Users, Repeat, X, Phone, Clock, TrendingUp,
  Search, PhoneCall, PhoneMissed, PhoneIncoming, PhoneOutgoing, UserPlus,
  Loader2, CalendarDays, History, BarChart3, User, Activity
} from "lucide-react";
import apiClient from "@/lib/apiClient";
import { toast } from "react-hot-toast";
import KPICard from "@/components/ui/KPICard";
import Pagination from "@/components/ui/Pagination"; // Import reusable pagination

/* ================= UTILS ================= */
const formatDateTime = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata"
  });
};

const formatDateOnly = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-IN", {
    dateStyle: "medium",
    timeZone: "Asia/Kolkata"
  });
};

/* ================= SKELETON LOADERS ================= */
const TimelineSkeleton = () => (
  <div className="space-y-6 p-6">
    {/* Header Skeleton */}
    <div className="flex items-center gap-3 mb-6">
      <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full animate-pulse"></div>
      <div className="flex-1">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse"></div>
      </div>
    </div>

    {/* Stats Skeleton */}
    <div className="grid grid-cols-3 gap-3 mb-8">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-gradient-to-br from-white to-gray-50 border-2 border-orange-100 rounded-2xl p-4 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-100 rounded w-3/4 mx-auto"></div>
        </div>
      ))}
    </div>

    {/* Timeline Items Skeleton */}
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="relative pl-8">
          {/* Timeline Line */}
          <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-gradient-to-b from-gray-200 to-gray-300"></div>
          
          {/* Timeline Dot */}
          <div className="absolute left-0 top-3 w-6 h-6 bg-gray-300 rounded-full animate-pulse"></div>

          {/* Call Card Skeleton */}
          <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100 rounded-2xl p-4">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
            <div className="h-8 bg-gray-100 rounded w-3/4 mb-3"></div>
            <div className="flex gap-2 mb-3">
              <div className="h-6 bg-gray-200 rounded-full w-20"></div>
              <div className="h-6 bg-gray-200 rounded-full w-24"></div>
            </div>
            <div className="h-4 bg-gray-100 rounded w-full"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const EmptyTimelineState = ({ phone }) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
    {/* Animated Illustration */}
    <div className="relative mb-8">
      <div className="w-32 h-32 bg-gradient-to-br from-orange-50 to-orange-100 rounded-full flex items-center justify-center">
        <div className="relative">
          <Phone className="w-16 h-16 text-orange-300 animate-pulse" />
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
            <X className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
      <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center opacity-70">
        <User className="w-10 h-10 text-blue-300" />
      </div>
      <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-green-50 to-green-100 rounded-full flex items-center justify-center opacity-70">
        <CalendarDays className="w-8 h-8 text-green-300" />
      </div>
    </div>

    {/* Message */}
    <h3 className="text-2xl font-bold text-gray-900 mb-3">No Call History Found</h3>
    <p className="text-gray-600 mb-6 max-w-md">
      This customer <span className="font-bold text-[#FF5211]">{phone}</span> hasn't made any calls yet or 
      there are no calls recorded for this period.
    </p>

    {/* Stats Card */}
    <div className="bg-gradient-to-r from-orange-50 to-white border-2 border-orange-100 rounded-2xl p-6 mb-8 w-full max-w-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Phone Number</div>
            <div className="text-lg font-bold text-gray-900 font-mono">{phone}</div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">0</div>
          <div className="text-sm text-gray-500">Total Calls</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">0</div>
          <div className="text-sm text-gray-500">Agents</div>
        </div>
      </div>
    </div>

    {/* Suggestions */}
    <div className="bg-white border-2 border-orange-100 rounded-2xl p-6 w-full max-w-md">
      <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-[#FF5211]" />
        What you can do:
      </h4>
      <ul className="space-y-3 text-left text-gray-600">
        <li className="flex items-start gap-2">
          <div className="w-2 h-2 bg-[#FF5211] rounded-full mt-2"></div>
          <span>Check if this is a new customer</span>
        </li>
        <li className="flex items-start gap-2">
          <div className="w-2 h-2 bg-[#FF5211] rounded-full mt-2"></div>
          <span>Verify the phone number format</span>
        </li>
        <li className="flex items-start gap-2">
          <div className="w-2 h-2 bg-[#FF5211] rounded-full mt-2"></div>
          <span>Try a different time period</span>
        </li>
        <li className="flex items-start gap-2">
          <div className="w-2 h-2 bg-[#FF5211] rounded-full mt-2"></div>
          <span>Check spam calls filter</span>
        </li>
      </ul>
    </div>
  </div>
);

/* ================= MAIN COMPONENT ================= */
const CustomerIntelligence = () => {
  const [period, setPeriod] = useState("today");
  const [overview, setOverview] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1
  });
  const [loading, setLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [showTimeline, setShowTimeline] = useState(false);
  const [timeline, setTimeline] = useState([]);
  const [timelineSummary, setTimelineSummary] = useState({});
  const [activePhone, setActivePhone] = useState(null);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [customerName, setCustomerName] = useState("");

  /* ---------------- Fetch Customer List ---------------- */
  const fetchCustomerList = useCallback(async (page = 1) => {
    try {
      setListLoading(true);
      
      const params = new URLSearchParams({
        period,
        page: page.toString(),
        limit: pagination.limit.toString()
      });
      
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }
      
      const res = await apiClient.get(`/api/customer-intelligence/list?${params}`);
      
      if (res.data.success) {
        setCustomers(res.data.data.customers || []);
        setPagination(res.data.data.pagination || {
          page: 1,
          limit: 20,
          total: 0,
          pages: 1
        });
      }
      
    } catch (error) {
      console.error("Fetch list error:", error);
      const errorMsg = error.response?.data?.message || "Failed to load customers";
      toast.error(errorMsg);
    } finally {
      setListLoading(false);
    }
  }, [period, pagination.limit, searchQuery]);

  /* ---------------- Fetch Intelligence ---------------- */
  const fetchIntelligence = useCallback(async () => {
    try {
      setLoading(true);
      
      const [overviewRes] = await Promise.all([
        apiClient.get(`/api/customer-intelligence/overview?period=${period}`),
      ]);

      if (overviewRes.data.success) setOverview(overviewRes.data.data);
    } catch (error) {
      console.error("Fetch error:", error);
      const errorMsg = error.response?.data?.message || "Failed to load intelligence";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [period]);

  /* ---------------- Initial Load ---------------- */
  useEffect(() => {
    fetchIntelligence();
    fetchCustomerList(1);
  }, [fetchIntelligence]);

  /* ---------------- Handle Page Change ---------------- */
  const handlePageChange = useCallback((newPage) => {
    if (newPage < 1 || newPage > pagination.pages || listLoading) return;
    fetchCustomerList(newPage);
  }, [pagination.pages, listLoading, fetchCustomerList]);

  /* ---------------- Handle Search ---------------- */
  const handleSearch = useCallback((e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Debounced search
    const timeoutId = setTimeout(() => {
      fetchCustomerList(1);
    }, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [fetchCustomerList]);

  /* ---------------- Handle Period Change ---------------- */
  const handlePeriodChange = useCallback((newPeriod) => {
    setPeriod(newPeriod);
    setSearchQuery("");
    
    Promise.all([
      apiClient.get(`/api/customer-intelligence/overview?period=${newPeriod}`),
      apiClient.get(`/api/customer-intelligence/list?period=${newPeriod}&page=1&limit=${pagination.limit}`),
    ]).then(([overviewRes, listRes]) => {
      if (overviewRes.data.success) setOverview(overviewRes.data.data);
      if (listRes.data.success) {
        setCustomers(listRes.data.data.customers || []);
        setPagination(listRes.data.data.pagination || {
          page: 1,
          limit: 20,
          total: 0,
          pages: 1
        });
      }
    }).catch(error => {
      console.error("Period change error:", error);
      toast.error("Failed to update data");
    });
  }, [pagination.limit]);

  /* ---------------- Timeline ---------------- */
  const openTimeline = useCallback(async (phone, name) => {
    try {
      setActivePhone(phone);
      setCustomerName(name || "Customer");
      setShowTimeline(true);
      setTimeline([]);
      setTimelineSummary({});
      setTimelineLoading(true);

      // Show immediate loading state
      setTimeout(async () => {
        try {
          const res = await apiClient.get(`/api/customer-intelligence/timeline/${phone}`);
          
          if (res.data.success) {
            setTimeline(res.data.data.calls || []);
            setTimelineSummary(res.data.data.summary || {});
          } else {
            throw new Error(res.data.message || "Failed to load timeline");
          }
        } catch (error) {
          console.error("Timeline error:", error);
          const errorMsg = error.response?.data?.message || "Failed to load customer timeline";
          toast.error(errorMsg);
        } finally {
          setTimelineLoading(false);
        }
      }, 100); // Small delay for smooth transition
      
    } catch (error) {
      console.error("Timeline error:", error);
      setTimelineLoading(false);
      toast.error("Failed to load customer timeline");
    }
  }, []);

  /* ---------- Calculate Timeline Stats ---------- */
  const timelineStats = useMemo(() => {
    if (timelineLoading || timeline.length === 0) {
      return {
        totalCalls: 0,
        answeredCalls: 0,
        missedCalls: 0,
        answerRate: 0,
        totalDuration: 0,
        avgDuration: 0,
        firstCall: null,
        lastCall: null
      };
    }

    const answeredCalls = timeline.filter(c => c.answered).length;
    const missedCalls = timeline.filter(c => !c.answered).length;
    const answerRate = timeline.length > 0 ? (answeredCalls / timeline.length) * 100 : 0;
    
    const totalDuration = timeline.reduce((sum, call) => sum + (call.duration || 0), 0);
    const avgDuration = timeline.length > 0 ? Math.round(totalDuration / timeline.length) : 0;
    
    const callsWithDate = timeline.filter(c => c.startTimeIST);
    const firstCall = callsWithDate.length > 0 
      ? new Date(Math.min(...callsWithDate.map(c => new Date(c.startTimeIST).getTime())))
      : null;
    const lastCall = callsWithDate.length > 0 
      ? new Date(Math.max(...callsWithDate.map(c => new Date(c.startTimeIST).getTime())))
      : null;

    return {
      totalCalls: timeline.length,
      answeredCalls,
      missedCalls,
      answerRate,
      totalDuration,
      avgDuration,
      firstCall,
      lastCall
    };
  }, [timeline, timelineLoading]);

  /* ---------- LOADER ---------- */
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 border-4 border-orange-100 border-t-[#FF5211] rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Users className="w-10 h-10 text-[#FF5211] animate-pulse" />
            </div>
          </div>
          <p className="text-gray-600 font-medium text-lg">Loading customer intelligence...</p>
          <p className="text-gray-500 text-sm mt-2">Analyzing customer data patterns</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Customer Intelligence</h1>
            <p className="text-gray-600 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#FF5211]" />
              Understand customers, not just calls
            </p>
          </div>
          
          {/* Period Selector */}
          <div className="flex gap-2 p-1 bg-white border-2 border-orange-100 rounded-xl">
            {["today", "week", "month"].map(p => (
              <button
                key={p}
                onClick={() => handlePeriodChange(p)}
                disabled={listLoading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                  period === p
                    ? "bg-gradient-to-r from-[#FF5211] to-orange-600 text-white shadow-lg shadow-orange-500/30"
                    : "text-gray-700 hover:bg-orange-50"
                } ${listLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {p === "today" && "Today"}
                {p === "week" && "This Week"}
                {p === "month" && "This Month"}
              </button>
            ))}
          </div>
        </div>

        {/* KPI GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
           <KPICard 
                title="Active Customers" 
                value={overview?.totalCustomers || 0} 
                icon={Users}
                description="Total customers who contacted"
            />
            <KPICard 
                title="New Customers" 
                value={overview?.newCustomers || 0} 
                icon={UserPlus}
                description="First time callers"
            />
            <KPICard 
                title="Repeat Customers" 
                value={overview?.repeatCustomers || 0} 
                icon={Repeat}
                description="Returning customers"
            />
        </div>

        {/* CUSTOMER LIST */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-1 border-orange-100 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b-2 border-orange-100 bg-gradient-to-r from-orange-50 to-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Users className="w-6 h-6 text-[#FF5211]" />
                  Customer Directory
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Click any customer to view their complete call history
                </p>
              </div>
              
              {/* Search */}
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchQuery}
                  onChange={handleSearch}
                  disabled={listLoading}
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 focus:border-[#FF5211] focus:ring-4 focus:ring-orange-500/10 rounded-xl transition-all duration-300 outline-none text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="relative min-h-[400px]">
            {listLoading && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center">
                <div className="text-center">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 border-4 border-orange-100 border-t-[#FF5211] rounded-full animate-spin mx-auto"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Users className="w-8 h-8 text-[#FF5211] animate-pulse" />
                    </div>
                  </div>
                  <p className="text-gray-600 font-medium">Loading customers...</p>
                  <p className="text-gray-500 text-sm mt-2">Fetching and analyzing data</p>
                </div>
              </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b-2 border-orange-100">
                    <th className="text-left p-4 font-bold text-gray-700 text-sm">Customer</th>
                    <th className="text-center p-4 font-bold text-gray-700 text-sm">Total Calls</th>
                    <th className="text-center p-4 font-bold text-gray-700 text-sm">Answered</th>
                    <th className="text-center p-4 font-bold text-gray-700 text-sm">Missed</th>
                    <th className="text-left p-4 font-bold text-gray-700 text-sm">Last Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c, i) => {
                    const answerRate = c.totalCalls > 0 
                      ? Math.round((c.answeredCalls / c.totalCalls) * 100)
                      : 0;
                    
                    return (
                      <tr 
                        key={`${c._id}-${i}`}
                        className="border-b border-gray-100 hover:bg-orange-50/50 transition-colors duration-200 cursor-pointer"
                        onClick={() => openTimeline(c._id, c.phonebookName)}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                              {(c.phonebookName || c._id || "?").charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900 hover:text-[#FF5211] transition-colors">
                                {c.phonebookName || "Unknown"}
                              </div>
                              <div className="text-xs text-gray-500">{c._id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-lg">
                            <span className="font-bold text-gray-900">{c.totalCalls}</span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 rounded-lg">
                            <span className="font-bold text-green-700">{c.answeredCalls}</span>
                            <span className="text-xs text-green-600">({answerRate}%)</span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 rounded-lg">
                            <span className="font-bold text-red-700">{c.missedCalls}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm text-gray-600">
                            {formatDateTime(c.lastCall)}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {customers.length === 0 && !listLoading && (
                <div className="text-center py-16">
                  <div className="relative mb-8">
                    <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto">
                      <Search className="w-16 h-16 text-orange-400" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No customers found</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Try adjusting your search, changing the time period, or check if there are any new calls for this period.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Reusable Pagination Component */}
          <Pagination
            pagination={pagination}
            onPageChange={handlePageChange}
            loading={listLoading}
            itemsLabel="customers"
            showItemsCount={true}
            showPageInfo={true}
          />
        </div>

        {/* TIMELINE DRAWER */}
        {showTimeline && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-fade-in">
            <div className="w-full sm:w-[500px] h-full bg-white shadow-2xl overflow-y-auto">
              {/* Header - Always visible */}
              <div className="sticky top-0 bg-gradient-to-r from-[#FF5211] to-orange-600 text-white p-6 shadow-lg z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-1">
                      {customerName || "Customer"}
                    </h3>
                    <div className="text-sm text-white/90 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {activePhone}
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowTimeline(false)}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Stats - Show even when loading */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold">
                      {timelineLoading ? (
                        <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                      ) : timelineStats.totalCalls}
                    </div>
                    <div className="text-xs text-white/90 font-medium">Total Calls</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold">
                      {timelineLoading ? (
                        <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                      ) : `${Math.round(timelineStats.answerRate)}%`}
                    </div>
                    <div className="text-xs text-white/90 font-medium">Answer Rate</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold">
                      {timelineLoading ? (
                        <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                      ) : timelineSummary.uniqueAgentsCount || "1"}
                    </div>
                    <div className="text-xs text-white/90 font-medium">Agents</div>
                  </div>
                </div>
              </div>

              {/* Timeline Content */}
              <div className="p-6">
                {timelineLoading ? (
                  <TimelineSkeleton />
                ) : timeline.length === 0 ? (
                  <EmptyTimelineState phone={activePhone} />
                ) : (
                  <>
                    {/* Timeline Summary Card */}
                    <div className="bg-gradient-to-r from-orange-50 to-white border-2 border-orange-100 rounded-2xl p-6 mb-8 shadow-lg">
                      <div className="flex items-center justify-between">

                        <div className="text-left">
                          <div className="text-xs text-gray-500">Activity Period</div>
                          <div className="text-sm font-bold text-gray-900">
                            {timelineStats.firstCall && timelineStats.lastCall 
                              ? `${formatDateOnly(timelineStats.firstCall)} - ${formatDateOnly(timelineStats.lastCall)}`
                              : "N/A"}
                          </div>
                        </div>
                        <div className="text-center">
                        <div className="text-xs text-gray-500">Avg Duration</div>
                          <div className="text-sm font-bold text-gray-900">
                            {Math.floor(timelineStats.avgDuration / 60)}m {timelineStats.avgDuration % 60}s
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Timeline Items */}
                    <div className="space-y-6">
                      <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <History className="w-5 h-5 text-[#FF5211]" />
                        Call History
                      </h4>
                      
                      <div className="space-y-4">
                        {timeline.map((call, i) => (
                          <div key={i} className="relative pl-8">
                            {/* Timeline Line */}
                            {i !== timeline.length - 1 && (
                              <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-gradient-to-b from-[#FF5211] to-orange-600"></div>
                            )}
                            
                            {/* Timeline Dot */}
                            <div className={`absolute left-0 top-3 w-6 h-6 rounded-full flex items-center justify-center shadow-lg ${
                              call.answered 
                                ? "bg-gradient-to-br from-green-500 to-green-600" 
                                : "bg-gradient-to-br from-red-500 to-red-600"
                            }`}>
                              {call.answered ? (
                                <PhoneCall className="w-3 h-3 text-white" />
                              ) : (
                                <PhoneMissed className="w-3 h-3 text-white" />
                              )}
                            </div>

                            {/* Call Card */}
                            <div className="bg-white border-2 border-orange-100 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
                              {/* Time */}
                              <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                                <Clock className="w-3 h-3" />
                                {formatDateTime(call.startTime)}
                              </div>

                              {/* Agent */}
                              {call.userId && (
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                                    {(call.userId?.name || "?").charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <div className="text-sm font-bold text-gray-900">
                                      {call.userId?.name || "Unknown Agent"}
                                    </div>
                                    <div className="text-xs text-gray-500">Agent</div>
                                  </div>
                                </div>
                              )}

                              {/* Badges */}
                              <div className="flex flex-wrap gap-2 mb-3">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full ${
                                  call.answered 
                                    ? "bg-green-100 text-green-700" 
                                    : "bg-red-100 text-red-700"
                                }`}>
                                  {call.answered ? <PhoneCall className="w-3 h-3" /> : <PhoneMissed className="w-3 h-3" />}
                                  {call.answered ? "Answered" : "Missed"}
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                                  {call.inbound ? <PhoneIncoming className="w-3 h-3" /> : <PhoneOutgoing className="w-3 h-3" />}
                                  {call.inbound ? "Incoming" : "Outgoing"}
                                </span>
                                {call.duration && (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                                    <Clock className="w-3 h-3" />
                                    {Math.floor(call.duration / 60)}m {call.duration % 60}s
                                  </span>
                                )}
                              </div>

                              {/* Recording */}
                              {call.recordingUrl && (
                                <audio controls className="w-full mb-3 rounded-lg">
                                  <source src={call.recordingUrl} type="audio/mpeg" />
                                  Your browser does not support the audio element.
                                </audio>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerIntelligence;