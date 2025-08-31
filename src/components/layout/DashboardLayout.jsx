"use client"
import { useSelector } from "react-redux";
import { allMenus, panelInfo } from "@/config/menus";
import SideNav from "./SideNav";
import TopNav from "./TopNav";

export default function DashboardLayout({ children, panel }) {
  // Define menus and titles based on panel
  const panelConfig = {
    companyAdmin: {
      title: "ListenLift AI",
      subtitle: "Company Admin",
      menus: [
        { name: "Dashboard", href: "/company/admin", icon: Home },
        { name: "Restaurants", href: "/company/admin/restaurants", icon: Store },
        { name: "Branches", href: "/company/admin/branches", icon: MapPin },
        { name: "Teams", href: "/company/admin/teams", icon: Users },
        { name: "Reports", href: "/company/admin/reports", icon: BarChart3 },
        { name: "Settings", href: "/company/admin/settings", icon: Settings },
      ]
    },
    companyCRM: {
      title: "CRM System",
      subtitle: "Sales Dashboard",
      menus: [
        { name: "Dashboard", href: "/company/crm", icon: Building2 },
        { name: "Leads", href: "/company/crm/leads", icon: BarChart3 },
        { name: "Customers", href: "/company/crm/customers", icon: Users },
      ]
    },
    restaurantAdmin: {
      title: "Restaurant Hub",
      subtitle: "Admin Portal",
      menus: [
        { name: "Dashboard", href: "/restaurant/admin", icon: Building2 },
        { name: "Branches", href: "/restaurant/admin/branches", icon: Store },
        { name: "Teams", href: "/restaurant/admin/teams", icon: Users },
        { name: "Reports", href: "/restaurant/admin/reports", icon: BarChart3 },
        { name: "Settings", href: "/restaurant/admin/settings", icon: Settings },
      ]
    },
    manager: {
      title: "Manager Console",
      subtitle: "Operations Dashboard",
      menus: [
        { name: "Dashboard", href: "/restaurant/manager", icon: Building2 },
        { name: "Orders", href: "/restaurant/manager/orders", icon: BarChart3 },
        { name: "Reports", href: "/restaurant/manager/reports", icon: Users },
      ]
    },
  };

  const config = panelConfig[panel] || {
    title: "Dashboard",
    subtitle: "Portal",
    menus: []
  };

  return (
    <div className="flex h-screen">
      <SideNav 
        navigation={roleMenus} 
        title={config.title} 
        subtitle={config.subtitle} 
      />
      <div className="flex-1 flex flex-col">
        <TopNav navigation={roleMenus} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
