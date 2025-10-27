"use client";
import CombinedDashboard from "@/components/dashboard/CombinedDashboard";
import StatsDashboard from "@/components/dashboard/StatsDashboard";
import TeamPerformance from "@/components/dashboard/TeamPerformance";
import React from "react";
import { useSelector } from "react-redux";

function DashboardPage() {
  // Get user from Redux state (auth slice)
  const { user } = useSelector((state) => state.auth);
  // const panel = roleNames[user?.role];

  return (
    <>
       <CombinedDashboard />
    </>
  );
}

export default DashboardPage;
