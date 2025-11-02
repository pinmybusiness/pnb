"use client";
import CombinedDashboard from "@/components/dashboard/CombinedDashboard";
import React from "react";
import { useSelector } from "react-redux";

function DashboardPage() {
  // Get user from Redux state (auth slice)
  const { user } = useSelector((state) => state.auth);

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
