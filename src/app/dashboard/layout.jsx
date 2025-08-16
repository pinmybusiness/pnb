"use client"
// app/dashboard/layout.jsx
import SideNav from "@/components/layout/SideNav";
import TopNav from "@/components/layout/TopNav";
import {
  Home,
  Store,
  MapPin,
  Users,
  BarChart3,
  Settings,
} from "lucide-react";

export default function DashboardLayout({ children }) {
    const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Restaurants", href: "/restaurants", icon: Store },
    { name: "Branches", href: "/branches", icon: MapPin },
    { name: "Teams", href: "/teams", icon: Users },
    { name: "Reports", href: "/reports", icon: BarChart3 },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
     <div className="flex h-screen">
      <SideNav navigation={navigation} />
      <div className="flex-1 flex flex-col">
        <TopNav navigation={navigation} />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
