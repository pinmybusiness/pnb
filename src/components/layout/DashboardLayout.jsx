"use client"
import { useSelector } from "react-redux";
import { allMenus, panelInfo } from "@/config/menus";
import SideNav from "./SideNav";
import TopNav from "./TopNav";

export default function DashboardLayout({ children }) {
  const { user } = useSelector((state) => state.auth);
  const roleNumber = user?.role;

  // ✅ fast filter using number
  const roleMenus = allMenus.filter(menu => menu.roles.includes(roleNumber));
  const config = panelInfo[roleNumber] || { title: "Dashboard", subtitle: "Portal" };

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
