"use client";
// components/layout/DashboardLayout.jsx
import React from "react";
import SideNav from "./SideNav";
import TopNav from "./TopNav";
import { Building2, Store, Users, BarChart3, Home, MapPin, Settings, UserPlus, Hourglass, FileBarChart, LayoutDashboard, GraduationCap, ChartArea } from "lucide-react";
import { useSelector } from "react-redux";
import { roleNames } from "@/utils/roles";

const panelConfig = {
  company_admin: {
    title: "Wait Pro",
    subtitle: "Company Admin",
    menus: [
      { name: "Dashboard", href: "/dashboard", icon: Home },
      { name: "Restaurants", href: "/dashboard/restaurants", icon: Store },
      { 
        name: "Branches", 
        icon: MapPin, 
        children: [
          { name: "Add Branch", href: "/dashboard/branches/add" },
          { name: "List Branches", href: "/dashboard/branches" },
        ]
      },
      { name: "Teams", href: "/dashboard/teams", icon: Users },
      { name: "Reports", href: "/dashboard/reports", icon: BarChart3 },
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
  company_crm: {
    title: "CRM System",
    subtitle: "Sales Dashboard",
    menus: [
      { name: "Dashboard", href: "/dashboard", icon: Building2 },
      { name: "Leads", href: "/dashboard/leads", icon: BarChart3 },
      { name: "Customers", href: "/dashboard/customers", icon: Users },
    ],
  },
  restaurant_admin: {
    title: "Restaurant Hub",
    subtitle: "Admin Portal",
    menus: [
      { name: "Dashboard", href: "/dashboard", icon: Building2 },
      { name: "Branches", href: "/dashboard/branches", icon: Store },
      { name: "Teams", href: "/dashboard/teams", icon: Users },
      { name: "Reports", href: "/dashboard/reports", icon: BarChart3 },
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
  restaurant_manager: {
    title: "Manager Console",
    subtitle: "Operations Dashboard",
    menus: [
      { name: "Dashboard", href: "/dashboard", icon: Building2 },
      { name: "Orders", href: "/dashboard/orders", icon: BarChart3 },
      { name: "Reports", href: "/dashboard/reports", icon: Users },
    ],
  },
  branch_manager: {
    title: "Branch Manager",
    subtitle: "Operations Dashboard",
    menus: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Entry", href: "/dashboard/entry", icon: UserPlus },
      { name: "Waiting List", href: "/dashboard/waiting-list", icon: Hourglass },
      { name: "Internship", href: "/dashboard/internship", icon: GraduationCap },
      { name: "Analytics", href: "/dashboard/analytics ", icon: ChartArea },
      { name: "Reports", href: "/dashboard/reports", icon: FileBarChart },
    ],
  },
  branch_team: {
    title: "Branch Team",
    subtitle: "Operations Dashboard",
    menus: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Entry", href: "/dashboard/entry", icon: UserPlus },
      { name: "Waiting List", href: "/dashboard/waiting-list", icon: Hourglass },
      { name: "Internship", href: "/dashboard/internship", icon: GraduationCap },
      { name: "Reports", href: "/dashboard/reports", icon: FileBarChart },
    ],
  },
  // 👇 add more roles here (branch_manager, branch_team, etc.)
};


export default function DashboardLayout({ children, panel }) {
  const { user } = useSelector((state) => state.auth);
  
  // Direct user.role number use
  const roleNumber = user?.role; // 3 (restaurant_admin)
  const roleKey = roleNames[roleNumber]; // 'restaurant_admin'
  
  const config = panelConfig[roleKey] || {
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