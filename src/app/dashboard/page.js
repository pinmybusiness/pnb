"use client";
import React from "react";
import { useSelector } from "react-redux";

function DashboardPage() {
  // Get user from Redux state (auth slice)
  const { user } = useSelector((state) => state.auth);
  // const panel = roleNames[user?.role]; 

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">
        {user ? `Welcome, ${user?.name}!` : "Welcome to Dashboard"}
      </h1>
    </div>
  );
}

export default DashboardPage;
