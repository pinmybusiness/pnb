'use client';

import { useState, useMemo } from "react";
import { 
  BarChart, 
  LineChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  Area,
  AreaChart
} from "recharts";
import {
  useHourlyDistribution,
  useTrendsData,
  useTopCallers
} from "@/hooks/useDashboardHeavyData";
import {
  Calendar,
  Filter,
  Download,
  RefreshCw,
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  X,
  Search
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { toast } from "react-hot-toast";

// Constants
const PERIOD_OPTIONS = [
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
];

const TREND_TYPE_OPTIONS = [
  { value: "hourly", label: "Hourly" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" }
];

const TOP_CALLERS_TYPE = [
  { value: "all", label: "All Calls" },
  { value: "answered", label: "Answered Only" },
  { value: "missed", label: "Missed Only" },
  { value: "outgoing", label: "Outgoing Only" }
];

// Custom Select Component
const CustomSelect = ({ value, onChange, options, disabled = false, className = "" }) => {
  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${className}`}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

// Custom Date Input Component
const CustomDateInput = ({ value, onChange, disabled = false }) => {
  return (
    <div className="relative">
      <input
        type="date"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
      />
      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  );
};

// Helper Functions
const formatHour12 = (hour) => {
  const h = parseInt(hour);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12} ${suffix}`;
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  } catch {
    return "Invalid Date";
  }
};

// Main Component
const HeavyChartsPage = () => {
  const [activeTab, setActiveTab] = useState("hourly");
  const [period, setPeriod] = useState("today");
  const [trendType, setTrendType] = useState("daily");
  const [selectedDate, setSelectedDate] = useState(null);
  const [topCallersType, setTopCallersType] = useState("all");
  const [topCallersLimit, setTopCallersLimit] = useState("20");
  
  // API Hooks
  const {
    data: hourlyData,
    isLoading: hourlyLoading,
    error: hourlyError,
    refetch: refetchHourly
  } = useHourlyDistribution(period, selectedDate);
  
  const {
    data: trendsData,
    isLoading: trendsLoading,
    error: trendsError,
    refetch: refetchTrends
  } = useTrendsData(period, trendType, selectedDate);
  
  const {
    data: topCallersData,
    isLoading: topCallersLoading,
    error: topCallersError,
    refetch: refetchTopCallers
  } = useTopCallers(parseInt(topCallersLimit), period, topCallersType);
  
  // Handle refresh
  const handleRefresh = () => {
    switch (activeTab) {
      case "hourly":
        refetchHourly();
        toast.success("Hourly data refreshed");
        break;
      case "trends":
        refetchTrends();
        toast.success("Trends data refreshed");
        break;
      case "callers":
        refetchTopCallers();
        toast.success("Top callers refreshed");
        break;
    }
  };
  
  // Format data for charts
  const formattedHourlyData = useMemo(() => {
    if (!hourlyData || !hourlyData.distribution) return [];
    
    return hourlyData.distribution.map(item => ({
      name: item.hourLabel,
      hour: item.hour,
      calls: item.calls,
      answered: item.answeredCalls || 0,
      missed: item.missedCalls || 0,
      outgoing: item.outgoingCalls || 0,
      answerRate: item.answerRate || 0
    }));
  }, [hourlyData]);
  
  const formattedTrendsData = useMemo(() => {
    if (!trendsData || !trendsData.trends) return [];
    
    return trendsData.trends.map(item => ({
      name: item.label,
      total: item.callCount,
      answered: item.answeredCount || 0,
      missed: item.missedCount || 0,
      outgoing: item.outgoingCount || 0,
      answerRate: item.answerRate || 0
    }));
  }, [trendsData]);
  
  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4 mb-1">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-600">{entry.name}:</span>
              </div>
              <span className="font-semibold text-gray-900">
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };
  
  // Loading state
  const isLoading = hourlyLoading || trendsLoading || topCallersLoading;
  const hasError = hourlyError || trendsError || topCallersError;
  
  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-red-600">Failed to load chart data</p>
        <Button variant="outline" onClick={handleRefresh}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Advanced Analytics</h1>
          <p className="text-gray-600">
            Detailed call analytics and insights
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {/* Tab Navigation */}
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {[
              { id: "hourly", label: "Hourly", icon: BarChart3 },
              { id: "trends", label: "Trends", icon: TrendingUp },
              { id: "callers", label: "Top Callers", icon: Users }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === id 
                    ? "bg-white shadow-sm text-blue-600" 
                    : "text-gray-600 hover:text-gray-900"
                }`}
                disabled={isLoading}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
          
          {/* Refresh Button */}
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Period Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Period
              </label>
              <CustomSelect
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                disabled={isLoading}
                options={PERIOD_OPTIONS}
              />
            </div>
            
            {/* Date Picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specific Date
              </label>
              <CustomDateInput
                value={selectedDate}
                onChange={setSelectedDate}
                disabled={isLoading}
              />
            </div>
            
            {/* Additional Filters */}
            {activeTab === "trends" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trend Type
                </label>
                <CustomSelect
                  value={trendType}
                  onChange={(e) => setTrendType(e.target.value)}
                  disabled={isLoading}
                  options={TREND_TYPE_OPTIONS}
                />
              </div>
            )}
            
            {activeTab === "callers" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Call Type
                  </label>
                  <CustomSelect
                    value={topCallersType}
                    onChange={(e) => setTopCallersType(e.target.value)}
                    disabled={isLoading}
                    options={TOP_CALLERS_TYPE}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Show Top
                  </label>
                  <CustomSelect
                    value={topCallersLimit}
                    onChange={(e) => setTopCallersLimit(e.target.value)}
                    disabled={isLoading}
                    options={[
                      { value: "10", label: "10 Callers" },
                      { value: "20", label: "20 Callers" },
                      { value: "30", label: "30 Callers" },
                      { value: "50", label: "50 Callers" }
                    ]}
                  />
                </div>
              </>
            )}
          </div>
          
          {/* Clear Filters */}
          {(selectedDate || period !== "today") && (
            <Button
              variant="ghost"
              onClick={() => {
                setSelectedDate(null);
                setPeriod("today");
              }}
              disabled={isLoading}
              className="h-fit"
            >
              <X className="w-4 h-4 mr-1" />
              Clear Filters
            </Button>
          )}
        </div>
      </Card>
      
      {/* Charts Content */}
      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-[400px] w-full rounded-lg" />
          <Skeleton className="h-[200px] w-full rounded-lg" />
        </div>
      ) : (
        <>
          {activeTab === "hourly" && (
            <div className="space-y-6">
              {/* Summary Stats */}
              {hourlyData?.summary && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">Peak Hour</p>
                    <p className="text-xl font-bold text-gray-900">
                      {hourlyData.summary.peakHour || "N/A"}
                    </p>
                  </Card>
                  <Card className="p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">Lowest Hour</p>
                    <p className="text-xl font-bold text-gray-900">
                      {hourlyData.summary.lowestHour || "N/A"}
                    </p>
                  </Card>
                  <Card className="p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">Total Incoming</p>
                    <p className="text-xl font-bold text-gray-900">
                      {hourlyData.summary.totalIncoming || 0}
                    </p>
                  </Card>
                  <Card className="p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">Answer Rate</p>
                    <p className="text-xl font-bold text-gray-900">
                      {hourlyData.summary.overallAnswerRate || 0}%
                    </p>
                  </Card>
                </div>
              )}
              
              {/* Main Chart */}
              <Card className="p-6">
                
                {/* Detailed Chart */}
                <div className="mt-8">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">
                    Hourly Call Distribution
                  </h4>
                  
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={formattedHourlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="name"
                          tick={{ fontSize: 11 }}
                          stroke="#888"
                        />
                        <YAxis 
                          tick={{ fontSize: 11 }}
                          stroke="#888"
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar 
                          dataKey="answered" 
                          name="Answered"
                          stackId="a"
                          fill="#10b981"
                        />
                        <Bar 
                          dataKey="missed" 
                          name="Missed"
                          stackId="a"
                          fill="#ef4444"
                        />
                        <Bar 
                          dataKey="outgoing" 
                          name="Outgoing"
                          fill="#8b5cf6"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </Card>
            </div>
          )}
          
          {activeTab === "trends" && (
            <div className="space-y-6">
              {/* Summary Stats */}
              {trendsData?.summary && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">Total Calls</p>
                    <p className="text-xl font-bold text-gray-900">
                      {trendsData.summary.totalCalls || 0}
                    </p>
                  </Card>
                  <Card className="p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">Answered</p>
                    <p className="text-xl font-bold text-gray-900">
                      {trendsData.summary.totalAnswered || 0}
                    </p>
                  </Card>
                  <Card className="p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">Missed</p>
                    <p className="text-xl font-bold text-gray-900">
                      {trendsData.summary.totalMissed || 0}
                    </p>
                  </Card>
                  <Card className="p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">Avg Answer Rate</p>
                    <p className="text-xl font-bold text-gray-900">
                      {trendsData.summary.avgAnswerRate || 0}%
                    </p>
                  </Card>
                </div>
              )}
              
              {/* Main Chart */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Call Trends Analysis
                    </h3>
                    <p className="text-sm text-gray-600">
                      {period === "today" && "Hourly trends"}
                      {period === "week" && "Daily trends for the week"}
                      {period === "month" && "Daily trends for the month"}
                      {period === "year" && "Monthly trends for the year"}
                    </p>
                  </div>
                  
                  {trendsData?.pagination && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={trendsData.pagination.currentPage === 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-sm text-gray-600">
                        Page {trendsData.pagination.currentPage} of {trendsData.pagination.totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={trendsData.pagination.currentPage === trendsData.pagination.totalPages}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={formattedTrendsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="name"
                        tick={{ fontSize: 12 }}
                        stroke="#888"
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        stroke="#888"
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line 
                        type="monotone"
                        dataKey="total"
                        name="Total Calls"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line 
                        type="monotone"
                        dataKey="answered"
                        name="Answered"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                      <Line 
                        type="monotone"
                        dataKey="missed"
                        name="Missed"
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                      <Line 
                        type="monotone"
                        dataKey="outgoing"
                        name="Outgoing"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Area Chart for Answer Rate */}
                <div className="mt-8">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">
                    Answer Rate Trend
                  </h4>
                  
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={formattedTrendsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="name"
                          tick={{ fontSize: 11 }}
                          stroke="#888"
                        />
                        <YAxis 
                          tick={{ fontSize: 11 }}
                          stroke="#888"
                        />
                        <Tooltip 
                          formatter={(value) => [`${value}%`, "Answer Rate"]}
                          contentStyle={{ borderRadius: 8 }}
                        />
                        <Area 
                          type="monotone"
                          dataKey="answerRate"
                          name="Answer Rate"
                          stroke="#f59e0b"
                          fill="url(#colorAnswerRate)"
                          strokeWidth={2}
                        />
                        <defs>
                          <linearGradient id="colorAnswerRate" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </Card>
            </div>
          )}
          
          {activeTab === "callers" && (
            <div className="space-y-6">
              {/* Summary Stats */}
              {topCallersData?.summary && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">Unique Callers</p>
                    <p className="text-xl font-bold text-gray-900">
                      {topCallersData.summary.totalUniqueCallers || 0}
                    </p>
                  </Card>
                  <Card className="p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">Total Calls</p>
                    <p className="text-xl font-bold text-gray-900">
                      {topCallersData.summary.totalCalls || 0}
                    </p>
                  </Card>
                  <Card className="p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">Avg Calls/Caller</p>
                    <p className="text-xl font-bold text-gray-900">
                      {topCallersData.summary.avgCallsPerCaller || 0}
                    </p>
                  </Card>
                  <Card className="p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">Top Caller Calls</p>
                    <p className="text-xl font-bold text-gray-900">
                      {topCallersData.summary.topCaller?.callCount || 0}
                    </p>
                  </Card>
                </div>
              )}
              
              {/* Top Callers Table */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Top Callers Analysis
                    </h3>
                    <p className="text-sm text-gray-600">
                      Showing top {topCallersLimit} callers
                      {topCallersType !== "all" && 
                        ` (${topCallersType} calls only)`}
                    </p>
                  </div>
                  
                  {topCallersData?.pagination && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={topCallersData.pagination.currentPage === 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-sm text-gray-600">
                        Page {topCallersData.pagination.currentPage} of {topCallersData.pagination.totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={topCallersData.pagination.currentPage === topCallersData.pagination.totalPages}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
                
                {topCallersData?.callers?.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No callers data available</p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Rank</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Caller Details</th>
                            <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Total Calls</th>
                            <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Answered</th>
                            <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Missed</th>
                            <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Outgoing</th>
                            <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Answer Rate</th>
                            <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Avg Duration</th>
                            <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Last Call</th>
                          </tr>
                        </thead>
                        <tbody>
                          {topCallersData?.callers?.map((caller, index) => (
                            <tr key={caller.phoneNumber || index} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-3 px-4">
                                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                                  <span className="font-semibold text-gray-700">
                                    {index + 1}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {caller.callerName || caller.phoneNumber || "Unknown"}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {caller.phoneNumber}
                                  </div>
                                </div>
                              </td>
                              <td className="text-center py-3 px-4">
                                <div className="font-semibold text-gray-900">
                                  {caller.callCount || 0}
                                </div>
                              </td>
                              <td className="text-center py-3 px-4">
                                <div className="text-green-600 font-semibold">
                                  {caller.answeredCount || 0}
                                </div>
                              </td>
                              <td className="text-center py-3 px-4">
                                <div className="text-red-600 font-semibold">
                                  {caller.missedCount || 0}
                                </div>
                              </td>
                              <td className="text-center py-3 px-4">
                                <div className="text-purple-600 font-semibold">
                                  {caller.outgoingCount || 0}
                                </div>
                              </td>
                              <td className="text-center py-3 px-4">
                                <div className={`font-semibold ${
                                  (caller.answerRate || 0) >= 80 ? 'text-green-600' :
                                  (caller.answerRate || 0) >= 50 ? 'text-yellow-600' :
                                  'text-red-600'
                                }`}>
                                  {caller.answerRate || 0}%
                                </div>
                              </td>
                              <td className="text-center py-3 px-4 text-sm text-gray-600">
                                {caller.avgDurationFormatted || "0:00"}
                              </td>
                              <td className="text-center py-3 px-4 text-sm text-gray-600">
                                {formatDate(caller.lastCall)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Bar Chart for Top 10 */}
                    {topCallersData?.callers?.slice(0, 10).length > 0 && (
                      <div className="mt-8">
                        <h4 className="text-md font-semibold text-gray-900 mb-4">
                          Top 10 Callers - Call Volume
                        </h4>
                        
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart 
                              data={topCallersData.callers.slice(0, 10)}
                              layout="vertical"
                              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                              <XAxis type="number" />
                              <YAxis 
                                type="category" 
                                dataKey="callerName"
                                tick={{ fontSize: 12 }}
                                width={90}
                              />
                              <Tooltip 
                                formatter={(value) => [value, 'Calls']}
                                contentStyle={{ borderRadius: 8 }}
                              />
                              <Bar 
                                dataKey="callCount" 
                                name="Total Calls"
                                radius={[0, 4, 4, 0]}
                                fill="#3b82f6"
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HeavyChartsPage;