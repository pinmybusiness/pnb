'use client';

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import {
  Phone,
  PhoneMissed,
  PhoneIncoming,
  PhoneOutgoing,
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  BarChart3,
  AlertCircle,
  ArrowLeft,
  Ban,
  ChevronDown,
  ChevronUp,
  Loader2,
  RefreshCw,
  ShieldAlert,
  PhoneForwarded
} from "lucide-react";
import KPICard from "@/components/ui/KPICard";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import Link from "next/link";
import { toast } from "react-hot-toast";

// ---------- Constants & Helpers ----------
const PERIOD_OPTIONS = [
  { key: "today", label: "Today" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" }
];
// ---------- Custom Hooks ----------
const useUser = () => {
  const [user] = useState(null);
  return { user, isBranchManager: user?.role === 6 };
};

const useDashboardData = (period) => {
  return useQuery({
    queryKey: ["dashboard-stats", period],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/v1/calls/stats?period=${period}`);
      
      if (!data.success) throw new Error(data.message || "Failed to fetch dashboard stats");
      return data.data;
    },
    retry: 2,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  });
};


const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-12 space-y-4">
    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
      <ShieldAlert className="w-8 h-8 text-red-600" />
    </div>
    <p className="text-red-600 text-center">{message}</p>
    {onRetry && (
      <Button variant="outline" onClick={onRetry} className="flex items-center gap-2">
        <RefreshCw className="w-4 h-4" />
        Retry
      </Button>
    )}
  </div>
);

const MetricTile = ({ icon, label, value, trend, color = "text-gray-900", loading = false }) => (
  <Card className="p-4 text-center transition-all hover:shadow-md">
    {loading ? (
      <Skeleton className="h-8 w-8 mx-auto mb-2 rounded-full" />
    ) : (
      <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${color.replace('text-')} bg-opacity-10`}>
        {icon}
      </div>
    )}
    <h3 className="text-sm font-medium text-gray-500 mb-1">{label}</h3>
    {loading ? (
      <Skeleton className="h-6 w-16 mx-auto" />
    ) : (
      <>
        <p className={`text-xl font-bold ${color}`}>{value}</p>
        {trend && (
          <div className={`inline-flex items-center gap-1 text-xs mt-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend)}%
          </div>
        )}
      </>
    )}
  </Card>
);

// ---------- Main Component ----------
const CombinedDashboard = () => {
  const [period, setPeriod] = useState("today");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { isBranchManager } = useUser();
  
  // Data hooks - REMOVED team data
  const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError, refetch: refetchDashboard } = useDashboardData(period);
  
  // Refresh all data - REMOVED team refresh
  const handleRefreshAll = () => {
    refetchDashboard();
    toast.success("Dashboard refreshed");
  };
  
  // Error handling
  if (dashboardError) {
    return (
      <ErrorState 
        message="Failed to load dashboard data. Please check your connection."
        onRetry={handleRefreshAll}
      />
    );
  }
  
  return (
    <div className="space-y-6 animate-fade-in p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Call Center Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            {isBranchManager ? "Branch Manager Dashboard" : "Agent Performance Dashboard"}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Mobile Menu Toggle */}
          <div className="sm:hidden">
            <Button
              variant="outline"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-full flex items-center justify-between"
            >
              <span>{isMobileMenuOpen ? "Close Menu" : "Open Menu"}</span>
              {isMobileMenuOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
          
          
          {/* Period Selector */}
          <div className={`${isMobileMenuOpen ? 'flex' : 'hidden'} sm:flex gap-1 bg-gray-100 p-1 rounded-lg flex-col sm:flex-row`}>
            {PERIOD_OPTIONS.map(({ key, label }) => (
              <Button
                key={key}
                variant={period === key ? "primary" : "outline"}
                onClick={() => {
                  setPeriod(key);
                  setIsMobileMenuOpen(false);
                }}
                size="sm"
                disabled={dashboardLoading}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Main Content - Only overview now */}
      <OverviewTab
        dashboardData={dashboardData}
        dashboardLoading={dashboardLoading}
        period={period}
        isBranchManager={isBranchManager}
      />
    </div>
  );
};

// ---------- Tab Components ----------
const OverviewTab = ({
  dashboardData,
  dashboardLoading,
}) => {
  const stats = dashboardData?.overview || {};
  
  return (
    <>
      {/* KPIs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Link href="/dashboard/trackly" className="col-span-1">
          <KPICard
            title="Total Calls"
            value={stats.totalCalls || 0}
            icon={Phone}
            loading={dashboardLoading}
            trend={5}
          />
        </Link>
        
        <KPICard
          title="Answered"
          value={stats.answeredCalls || 0}
          icon={PhoneIncoming}
          loading={dashboardLoading}
          color="green"
          trend={2}
        />
        
        <KPICard
          title="Missed"
          value={stats.missedCalls || 0}
          icon={PhoneMissed}
          loading={dashboardLoading}
          color="red"
          trend={-1}
        />
        
        <Link href="/dashboard/trackly/followup-calls" className="col-span-1">
          <KPICard
            title="Pending Follow-ups"
            value={stats.pendingFollowUps || 0}
            icon={AlertCircle}
            loading={dashboardLoading}
            color="yellow"
          />
        </Link>
      </div>
      
      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="grid grid-cols-2 md:grid-cols-2 md:col-span-2 gap-4">
          <MetricTile
            icon={<Clock className="w-6 h-6 text-blue-600" />}
            label="Avg Duration"
            value={dashboardData?.duration?.average || "0:00"}
            loading={dashboardLoading}
            color="text-blue-600"
          />
          
          <MetricTile
            icon={<TrendingUp className="w-6 h-6 text-green-600" />}
            label="Answer Rate"
            value={`${stats.answerRate || 0}%`}
            loading={dashboardLoading}
            color="text-green-600"
          />
          
          <MetricTile
            icon={<PhoneOutgoing className="w-6 h-6 text-purple-600" />}
            label="Outgoing"
            value={stats.outgoingCalls || 0}
            loading={dashboardLoading}
            color="text-purple-600"
          />
          
          <MetricTile
            icon={<TrendingDown className="w-6 h-6 text-red-600" />}
            label="Missed Rate"
            value={`${stats.missedRate || 0}%`}
            loading={dashboardLoading}
            color="text-red-600"
          />
        </div>
        
        {/* Quick Actions Card - Replaced Team Summary */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          
          <div className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-start"
            >
              <Link href="/dashboard/trackly/team-performance" className="flex items-center ">
                <Users className="w-4 h-4 mr-2" />
                View Team Performance
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
            >
              <Link href="/dashboard/trackly/followup-calls" className="flex items-center ">
                <AlertCircle className="w-4 h-4 mr-2" />
                Manage Follow-ups ({stats.pendingFollowUps || 0})
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
            >
              <Link href="/dashboard/trackly/spam-numbers" className="flex items-center ">
                <Ban className="w-4 h-4 mr-2" />
                Spam Numbers ({stats.spamCalls || 0})
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
};

export default CombinedDashboard;