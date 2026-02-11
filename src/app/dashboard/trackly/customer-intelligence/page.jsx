'use client';

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { 
  Users, Repeat, Search, ArrowUpDown, User, PhoneCall, 
  TrendingUp, UserPlus, Calendar, X, Clock, Loader2 
} from "lucide-react";
import apiClient from "@/lib/apiClient";
import { toast } from "react-hot-toast";
import { Card, Input, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui";
import KPICard from "@/components/ui/KPICard";
import Pagination from "@/components/ui/Pagination";
import TimelineDrawer from "@/components/calls/TimelineDrawer";

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
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

/* ================= MAIN COMPONENT ================= */
const CustomerIntelligence = () => {
  // State Management - CallTracking style
  const [period, setPeriod] = useState("today");
  const [overview, setOverview] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("totalCalls");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);

  // Pagination State - CallTracking style
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
    hasMore: false
  });

  // Timeline state
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [timelineData, setTimelineData] = useState([]);
  const [timelineSummary, setTimelineSummary] = useState({});
  const [activePhone, setActivePhone] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [timelineLoading, setTimelineLoading] = useState(false);

  // Refs - CallTracking style
  const debounceTimerRef = useRef(null);
  const isMountedRef = useRef(true);

  /* ---------------- Cleanup on unmount ---------------- */
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  /* ---------------- Debounced Search - CallTracking style ---------------- */
  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchTerm(value);
    }, 1000);
  }, []);

  /* ---------------- Fetch All Data - Combined ---------------- */
  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      setListLoading(true);
      
      // Clear any pending search timeout
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      const [kpiRes, listRes] = await Promise.all([
        apiClient.get(`/api/customer-intelligence/overview?period=${period}`),
        apiClient.get(`/api/customer-intelligence/list?period=${period}&page=1&limit=${pagination.limit}&search=${debouncedSearchTerm}`)
      ]);
      
      if (kpiRes.data.success) {
        setOverview(kpiRes.data.data);
      }
      
      if (listRes.data.success) {
        const { customers: customerData, pagination: paginationData } = listRes.data.data;
        setCustomers(customerData || []);
        setPagination(paginationData || {
          page: 1,
          limit: 20,
          total: 0,
          pages: 1,
          hasMore: false
        });
      }
      
    } catch (error) {
      console.error("Fetch all data error:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
      setListLoading(false);
    }
  }, [period, pagination.limit, debouncedSearchTerm]);

  /* ---------------- Fetch Customer List ---------------- */
  const fetchCustomerList = useCallback(async (page = 1) => {
    try {
      if (!isMountedRef.current) return;
      setListLoading(true);
      
      const params = {
        page: page,
        limit: pagination.limit,
        period: period,
        search: debouncedSearchTerm,
        sortBy: sortBy,
        sortOrder: sortOrder
      };

      const res = await apiClient.get('/api/customer-intelligence/list', { params });
      
      if (res.data.success && isMountedRef.current) {
        const { customers: customerData, pagination: paginationData } = res.data.data;
        setCustomers(customerData || []);
        setPagination(paginationData || {
          page: 1,
          limit: 20,
          total: 0,
          pages: 1,
          hasMore: false
        });
      }
      
    } catch (error) {
      console.error("Fetch list error:", error);
      if (isMountedRef.current) {
        const errorMsg = error.response?.data?.message || "Failed to load customers";
        toast.error(errorMsg);
      }
    } finally {
      if (isMountedRef.current) {
        setListLoading(false);
      }
    }
  }, [period, pagination.limit, debouncedSearchTerm, sortBy, sortOrder]);

  /* ---------------- Handle Sort - CallTracking style ---------------- */
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

  /* ---------------- Handle Page Change ---------------- */
  const handlePageChange = useCallback((newPage) => {
    if (newPage < 1 || newPage > pagination.pages || listLoading) return;
    fetchCustomerList(newPage);
  }, [pagination.pages, listLoading, fetchCustomerList]);

  /* ---------------- Handle Period Change ---------------- */
  const handlePeriodChange = useCallback((newPeriod) => {
    if (newPeriod === period) return;
    
    setPeriod(newPeriod);
    setSearchTerm("");
    setDebouncedSearchTerm("");
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
    
    fetchAllData();
  }, [period, fetchAllData]);

  /* ---------------- Timeline Handler ---------------- */
  const openTimeline = useCallback(async (phone, name) => {
    try {
      setActivePhone(phone);
      setCustomerName(name || "Customer");
      setIsTimelineOpen(true);
      setTimelineData([]);
      setTimelineSummary({});
      setTimelineLoading(true);

      const res = await apiClient.get(`/api/customer-intelligence/timeline/${phone}`);
      
      if (res.data.success) {
        setTimelineData(res.data.data.calls || []);
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
  }, []);

  /* ---------------- Close Timeline ---------------- */
  const closeTimeline = useCallback(() => {
    setIsTimelineOpen(false);
    setTimelineData([]);
    setTimelineSummary({});
    setActivePhone(null);
    setCustomerName("");
  }, []);

  /* ---------------- Effects - CallTracking style ---------------- */
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Reset to page 1 when search or sort changes
    fetchCustomerList(1);
  }, [debouncedSearchTerm, sortBy, sortOrder]);

  /* ---------- LOADER ---------- */
  if (loading && !overview) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 "></div>
        <span className="ml-3 text-sm text-gray-500">Loading customer intelligence…</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in p-4 sm:p-6 md:p-8">
      {/* HEADER - CallTracking style */}
      <div className="flex justify-between items-start gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Customer Intelligence</h1>
          <p className="text-sm text-gray-500">Analyze customer calling patterns and behavior</p>
        </div>
        
        {/* Period Selector - Cleaner design */}
        <div className="flex gap-2">
          {["today", "week", "month"].map(p => (
            <button
              key={p}
              onClick={() => handlePeriodChange(p)}
              disabled={listLoading || loading}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                period === p
                  ? "bg-[#FF5211] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              } ${listLoading || loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {p === "today" && "Today"}
              {p === "week" && "This Week"}
              {p === "month" && "This Month"}
            </button>
          ))}
        </div>
      </div>

      {/* KPI GRID - Clean cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          // Skeleton loaders
          <>
            <Card className="p-4">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-3 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-100 rounded w-full animate-pulse"></div>
            </Card>
            <Card className="p-4">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-3 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-100 rounded w-full animate-pulse"></div>
            </Card>
            <Card className="p-4">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-3 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-100 rounded w-full animate-pulse"></div>
            </Card>
          </>
        ) : (
          // Actual KPI Cards
          <>
            <KPICard 
              title="Active Customers" 
              value={overview?.totalCustomers || 0} 
              icon={Users}
              description="Total customers who contacted"
              className="h-full"
            />
            <KPICard 
              title="New Customers" 
              value={overview?.newCustomers || 0} 
              icon={UserPlus}
              description="First time callers"
              className="h-full"
            />
            <KPICard 
              title="Repeat Customers" 
              value={overview?.repeatCustomers || 0} 
              icon={Repeat}
              description="Returning customers"
              className="h-full"
            />
          </>
        )}
      </div>

      {/* CUSTOMER LIST - CallTracking style table */}
      <Card>
        {/* Search Filter - CallTracking style */}
        <div className="p-4 border-b border-gray-300">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search customers by name or phone..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 text-sm"
            />
          </div>
        </div>

        {listLoading && pagination.page === 1 ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            <span className="ml-3 text-sm text-gray-500">Loading customers…</span>
          </div>
        ) : (
          <>
            {/* Desktop Table - CallTracking style */}
            <div className="hidden sm:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap cursor-pointer" onClick={() => handleSort("phonebookName")}>
                      <div className="flex items-center gap-2">
                        Customer
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="whitespace-nowrap cursor-pointer text-center" onClick={() => handleSort("totalCalls")}>
                      <div className="flex items-center gap-2 justify-center">
                        Total Calls
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="whitespace-nowrap cursor-pointer text-center" onClick={() => handleSort("answeredCalls")}>
                      <div className="flex items-center gap-2 justify-center">
                        Answered
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="whitespace-nowrap cursor-pointer text-center" onClick={() => handleSort("missedCalls")}>
                      <div className="flex items-center gap-2 justify-center">
                        Unanswered
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="whitespace-nowrap cursor-pointer" onClick={() => handleSort("lastCall")}>
                      <div className="flex items-center gap-2">
                        Last Contact
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="whitespace-nowrap text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer, index) => {
                    const answerRate = customer.totalCalls > 0 
                      ? Math.round((customer.answeredCalls / customer.totalCalls) * 100)
                      : 0;
                    
                    return (
                      <TableRow 
                        key={`${customer._id}-${index}`} 
                        className="hover:bg-gray-50"
                      >
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                              <span className="text-white text-sm font-bold">
                                {(customer.phonebookName || customer._id || "?").charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {customer.phonebookName || "Unknown"}
                              </div>
                              <div className="text-xs text-gray-500 font-mono">{customer._id}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-center">
                          <span className="font-medium text-gray-900">{customer.totalCalls || 0}</span>
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-center">
                          <div className="inline-flex flex-col items-center">
                            <span className="font-medium text-green-600">{customer.answeredCalls || 0}</span>
                            <span className="text-xs text-gray-500">({answerRate}%)</span>
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-center">
                          <span className="font-medium text-red-600">{customer.missedCalls || 0}</span>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-700">{formatDateOnly(customer.lastCall)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-center">
                          <button
                            onClick={() => openTimeline(customer._id, customer.phonebookName)}
                            className="px-3 py-1.5 bg-[#FF5211] text-white text-sm font-medium rounded-md hover:bg-orange-600 transition-colors"
                          >
                            View Timeline
                          </button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Mobile View - CallTracking style */}
            <div className="block sm:hidden space-y-3 p-3">
              {customers.map((customer, index) => {
                const answerRate = customer.totalCalls > 0 
                  ? Math.round((customer.answeredCalls / customer.totalCalls) * 100)
                  : 0;
                
                return (
                  <Card key={`${customer._id}-${index}`} className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                            <span className="text-white font-bold">
                              {(customer.phonebookName || customer._id || "?").charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{customer.phonebookName || "Unknown"}</div>
                            <div className="text-xs text-gray-500 font-mono">{customer._id}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">{customer.totalCalls || 0}</div>
                          <div className="text-xs text-gray-500">Total Calls</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-green-600 font-bold">{customer.answeredCalls || 0}</div>
                          <div className="text-xs text-gray-500">Answered ({answerRate}%)</div>
                        </div>
                        <div className="text-center">
                          <div className="text-red-600 font-bold">{customer.missedCalls || 0}</div>
                          <div className="text-xs text-gray-500">Unanswered</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-4 w-4" />
                          {formatDateOnly(customer.lastCall)}
                        </div>
                        <button
                          onClick={() => openTimeline(customer._id, customer.phonebookName)}
                          className="px-3 py-1.5 bg-[#FF5211] text-white text-sm font-medium rounded-md"
                        >
                          Timeline
                        </button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        )}

        {/* No Data State - CallTracking style */}
        {customers.length === 0 && !listLoading && (
          <div className="p-6 sm:p-12 text-center">
            <Users className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-2 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">
              {searchTerm || debouncedSearchTerm ? "No matching customers found" : "No customers found"}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500">
              {searchTerm || debouncedSearchTerm
                ? "Try adjusting your search criteria"
                : `No customer activity found for ${period}`}
            </p>
          </div>
        )}
      </Card>

      {/* Reusable Pagination Component - CallTracking style */}
      {customers.length > 0 && (
        <Pagination
          pagination={pagination}
          onPageChange={handlePageChange}
          loading={listLoading}
          itemsLabel="customers"
          showItemsCount={true}
          showPageInfo={true}
          className="mt-4"
        />
      )}

      {/* TIMELINE DRAWER */}
      <TimelineDrawer
        isOpen={isTimelineOpen}
        onClose={closeTimeline}
        timeline={timelineData}
        timelineSummary={timelineSummary}
        activePhone={activePhone}
        customerName={customerName}
        isLoading={timelineLoading}
      />
    </div>
  );
};

export default CustomerIntelligence;