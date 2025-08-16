"use client";
// components/layout/DashboardLayout.jsx
import React from "react";
import SideNav from "./SideNav";
import TopNav from "./TopNav";
import { Building2, Store, Users, BarChart3, Home, MapPin, Settings, Menu, X, UserCircle } from "lucide-react";

export default function DashboardLayout({ children, panel }) {
   const { user } = useAuth();
  const panel = getFrontendPanel(user?.role);
  const config = DASHBOARD_CONFIG[panel] || {
    title: "Dashboard",
    subtitle: "Portal",
    menus: []
  };

  return (
    <div className="flex h-screen">
      <SideNav 
        navigation={config.menus} 
        title={config.title} 
        subtitle={config.subtitle} 
      />
      <div className="flex-1 flex flex-col">
        <TopNav navigation={config.menus} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}