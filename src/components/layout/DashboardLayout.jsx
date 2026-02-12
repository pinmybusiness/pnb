"use client"
import { useSelector } from "react-redux";
import { allMenus, panelInfo } from "@/config/menus";
import SideNav from "./SideNav";
import TopNav from "./TopNav";
import { useState } from "react";

// DashboardLayout.jsx
export default function DashboardLayout({ children }) {
  const { user } = useSelector((state) => state.auth);
  const roleNumber = user?.role;
  const roleMenus = allMenus.filter((menu) => menu.roles.includes(roleNumber));
  const config = panelInfo[roleNumber] || { title: "Dashboard", subtitle: "Portal" };
  const [sidebarOpen, setSidebarOpen] = useState(true); // Add state here

  return (
    <div className="dashboard-root flex h-screen">
      <SideNav
        navigation={roleMenus}
        title={config.title}
        subtitle={config.subtitle}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col">
        <TopNav navigation={roleMenus} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
