"use client";
import CombinedDashboard from "@/components/dashboard/CombinedDashboard";
import Skeleton from "@/components/ui/Skeleton";
import React from "react";
import { useSelector } from "react-redux";

const DashboardSkeleton = () => (
  <div className="space-y-6 p-4">
    {/* Header */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64 rounded-lg" />
        <Skeleton className="h-4 w-40 rounded" />
      </div>
      <div className="flex gap-1">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-lg" />
        ))}
      </div>
    </div>

    {/* KPI Cards */}
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm p-6 space-y-3">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-8 w-16 rounded" />
        </div>
      ))}
    </div>

    {/* Metrics + Quick Actions */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="grid grid-cols-2 md:col-span-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center gap-2">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-3 w-20 rounded" />
            <Skeleton className="h-6 w-12 rounded" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <Skeleton className="h-5 w-32 rounded" />
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-lg" />
        ))}
      </div>
    </div>
  </div>
);

function DashboardPage() {
  // Get user from Redux state (auth slice)
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);

  // Show skeleton while auth is being checked
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Show message for non-branch-manager roles
  if (!isAuthenticated) {
    return (
      <div className="text-center mt-10 text-xl font-semibold">
        Please log in to access the dashboard.
      </div>
    );
  }

  return (
    <>
      {user?.role === 6 || user?.role === 7 ? (
        <CombinedDashboard />
      ) : (
        <div className="text-center mt-10 text-xl font-semibold">
          Welcome, {user?.name || "User"}
        </div>
      )}
    </>
  );
}

export default DashboardPage;
