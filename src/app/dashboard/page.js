"use client";
import CombinedDashboard from "@/components/dashboard/CombinedDashboard";
import React from "react";
import { useSelector } from "react-redux";

function DashboardPage() {
  // Get user from Redux state (auth slice)
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);

  // Show loading while auth is being checked
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
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
