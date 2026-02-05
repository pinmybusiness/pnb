"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Clock,
  UserCheck,
  UserX,
  ArrowLeft,
  BarChart3,
  Calendar,
  TrendingDown,
  DollarSign,
  RefreshCw
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAnalytics } from "@/store/analyticsSlice";

export default function Analytics() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { data: stats, loading } = useSelector((state) => state.analytics);
  const avgCustomerValue = 650;
  const currentBranch = user?.branch;
  const { items: waitingCustomers } = useSelector((state) => state.customers);
  const [revenueFilter, setRevenueFilter] = useState("week");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (currentBranch) {
      dispatch(fetchAnalytics({ branchId: currentBranch, period: revenueFilter }));
    }
  }, [dispatch, currentBranch, revenueFilter]);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (currentBranch) {
      await dispatch(fetchAnalytics({ branchId: currentBranch, period: revenueFilter }));
    }
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleAvgValueChange = (value) => {
    const numValue = parseInt(value) || 650;
    // dispatch(setAvgCustomerValue(numValue));
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const StatCard = ({ title, value, icon: Icon, description, variant = "default" }) => {
    const variantStyles = {
      default: "border border-soft bg-white",
      warning: "border border-yellow-400 bg-yellow-50",
      success: "border border-green-custom bg-green-light",
      danger: "border border-red-400 bg-red-50",
    };

    const iconColors = {
      default: "text-primary",
      warning: "text-yellow-600",
      success: "text-green-custom",
      danger: "text-red-600",
    };

    return (
      <div className={`rounded-xl p-4 ${variantStyles[variant]}`}>
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${iconColors[variant]}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="text-xl font-bold text-dark">{value}</div>
            <div className="text-sm font-medium text-dark">{title}</div>
            <div className="text-xs text-gray-500">{description}</div>
          </div>
        </div>
      </div>
    );
  };

  if (!currentBranch) {
    return (
      <div className="min-h-screen bg-gray-light p-4 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-dark">No branch selected</h3>
          <p className="text-gray-500">Please select a branch to view analytics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/dashboard/waiting-list")}
              className="p-2 border border-soft rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5 text-dark" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-dark">Analytics Dashboard</h1>
              <p className="text-gray-500">Real-time waiting list insights</p>
              {/* <p className="text-sm text-primary font-medium">
                Branch: {currentBranch}
              </p> */}
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 rounded-lg bg-primary-light text-primary hover:bg-primary/90 disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        )}

        {!loading && stats && (
          <>
            {/* Date and Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-soft rounded-xl p-4 flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary-light text-primary">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-dark">{getCurrentDate()}</h2>
                  <p className="text-sm text-gray-500">Today's overview</p>
                </div>
              </div>

              <div className="bg-white border border-soft rounded-xl p-4">
                <h3 className="font-semibold text-dark mb-2">Revenue Period</h3>
                <div className="flex gap-2">
                  {["day", "week", "month"].map((period) => (
                    <button
                      key={period}
                      onClick={() => setRevenueFilter(period)}
                      className={`flex-1 py-1 px-2 rounded text-xs font-medium ${
                        revenueFilter === period
                          ? "bg-primary text-primary-foreground"
                          : "bg-gray-100 text-dark hover:bg-gray-200"
                      }`}
                    >
                      {period.charAt(0).toUpperCase() + period.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-soft rounded-xl p-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-dark mb-2">
                  <DollarSign className="w-4 h-4 text-primary" />
                  Avg Customer Value
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-dark">₹</span>
                  <input
                    type="number"
                    value={avgCustomerValue}
                    onChange={(e) => handleAvgValueChange(e.target.value)}
                    className="text-lg font-bold border border-soft rounded px-2 py-1 w-20"
                    min="1"
                  />
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard 
                title="Total Waiting" 
                value={stats.waitingCustomers || 0} 
                icon={Users} 
                description="Currently in queue" 
              />
              <StatCard
                title="Served Today"
                value={stats.servedCustomers || 0}
                icon={UserCheck}
                description="Customers served successfully"
                variant="success"
              />
              <StatCard
                title="Left Without Service"
                value={stats.leftCustomers || 0}
                icon={UserX}
                description="Customers who left"
                variant="danger"
              />
              <StatCard
                title="Avg Wait Time"
                value={`${stats.avgWaitTime || 0}m`}
                icon={Clock}
                description="Average serving time"
                variant={stats.avgWaitTime > 10 ? "warning" : "default"}
              />
              <StatCard
                title="Total Today"
                value={stats.totalCustomers || 0}
                icon={Users}
                description="All customers today"
              />
              <StatCard
                title="Revenue Lost"
                value={`₹${((stats.leftCustomers || 0) * avgCustomerValue).toLocaleString()}`}
                icon={TrendingDown}
                description="Estimated lost revenue"
                variant="danger"
              />
            </div>

            {/* Current Queue Summary */}
            {waitingCustomers.length > 0 && (
              <div className="bg-white border border-soft rounded-xl p-6">
                <h3 className="text-lg font-semibold text-dark mb-4">Current Queue</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium text-dark mb-2">Longest Waiting:</h4>
                    <p className="text-2xl font-bold text-red-600">
                      {Math.max(...waitingCustomers.map(c => 
                        Math.floor((new Date() - new Date(c.createdAt)) / 60000)
                      ))}
                      m
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-dark mb-2">Total People:</h4>
                    <p className="text-2xl font-bold text-primary">
                      {waitingCustomers.reduce((sum, c) => sum + c.adults + c.children, 0)}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-dark mb-2">Average Party:</h4>
                    <p className="text-2xl font-bold text-green-custom">
                      {(
                        waitingCustomers.reduce((sum, c) => sum + c.adults + c.children, 0) / 
                        (waitingCustomers.length || 1)
                      ).toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Performance Chart Placeholder */}
            <div className="bg-white border border-soft rounded-xl p-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-dark mb-4">
                <BarChart3 className="w-5 h-5 text-primary" />
                Performance Overview
              </h3>
              <div className="h-64 bg-gray-light rounded-lg flex items-center justify-center">
                <div className="text-center space-y-2">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto" />
                  <p className="text-gray-500 font-medium">Analytics Chart</p>
                  <p className="text-sm text-gray-400">Visual performance metrics</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Navigation */}
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/dashboard/waiting-list")}
            className="flex-1 py-3 rounded-lg border border-soft bg-white text-dark hover:bg-gray-50"
          >
            Back to Queue
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
