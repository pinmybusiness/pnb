"use client";

import { roleNames } from "@/utils/roles";
import React from "react";
import { useSelector } from "react-redux";

function DashboardPage() {
  // Get user from Redux state (auth slice)
  const { role } = useSelector((state) => state.auth);
  const panel = roleNames[role]; // 👈 roleId comes from DB

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">
        {panel ? `Welcome, ${panel}!` : "Welcome to Dashboard"}
      </h1>
    </div>
  );
}

export default DashboardPage;
