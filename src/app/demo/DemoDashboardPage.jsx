"use client";

import React, { useState } from "react";
import {
  Phone,
  LayoutDashboard,
  ChevronDown,
  TrendingUp,
  Users,
  Key,
  BarChart,
  History,
} from "lucide-react";
import RecordingScreen from "./RecordingScreen";
import { DashboardScreen } from "./DashboardScreen";
import TeamPerformanceScreen from "./TeamPerformanceScreen";
import HistoryScreen from "./HistoryScreen";
import IntegrationsDemoScreen from "./Integrations";
import BranchTeamsDemoScreen from "./BranchTeamsDemoScreen";
import CustomerIntelligenceDemoScreen from "./CustomerIntelligenceDemoScreen";
import MissedCallsDemoScreen from "./MissedCallsDemoScreen";

// ─── Color (orange primary) ─────────────────────────────────────────────
export const ORANGE = "#ff5a1f";
const ORANGE_GRADIENT = "linear-gradient(135deg, #ff5a1f 0%, #ff8a5c 100%)";

// ─── Sidebar menu items ────────────────────────────────────────────────
const MENU_ITEMS = [
  { name: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
  { name: "Follow-Ups", icon: Phone, id: "folloups" },
  { name: "Calls History", icon: History, id: "history" },
  { name: "Team Performance", icon: Users, id: "team_performance" },
  { name: "Recordings", icon: BarChart, id: "recordings" },
  { name: "Customer Intelligence", icon: TrendingUp, id: "intelligence" },
  { name: "Teams", icon: Users, id: "teams" },
  { name: "Integrations", icon: Key, id: "integrations" },
];

// ─── Main Dashboard Component ──────────────────────────────────────────
const DashboardContent = () => {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  const handleMenuClick = (id) => {
    setActiveMenu(id);
  };

  return (
    <div className="flex h-full w-full bg-gray-50 font-sans overflow-hidden relative">
      {/* ===== SIDEBAR - FIXED HEIGHT ===== */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm h-full flex-shrink-0 relative z-20">
        {/* Logo area - fixed top */}
        <div className="h-20 flex items-center px-6 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: ORANGE_GRADIENT }}>
              <Phone size={20} className="text-white" />
            </div>
            <div>
              <span className="font-bold text-gray-800 text-xl">FasterQ</span>
              <span className="block text-xs text-gray-400">Call Center</span>
            </div>
          </div>
        </div>

        {/* Navigation - scrollable if needed */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
                style={{ backgroundColor: isActive ? ORANGE : "transparent" }}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* bottom profile - fixed bottom */}
        <div className="border-t border-gray-100 p-5 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-white text-sm font-bold">
              S
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-800">Sanjeev Kumar</div>
              <div className="text-xs text-gray-400">Admin</div>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          </div>
        </div>
      </aside>

      {/* ===== MAIN CONTENT - FIXED HEIGHT ===== */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* ===== TOP NAVBAR - FIXED ===== */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0 relative z-30">
          <div>
            <h4 className="text-2xl font-bold text-gray-800">
              {MENU_ITEMS.find((m) => m.id === activeMenu)?.name || "Dashboard"}
            </h4>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-sm font-bold">
                AR
              </div>
              <ChevronDown size={18} className="text-gray-400" />
            </div>
          </div>
        </header>

        {/* ===== CONTENT AREA - SCROLLABLE ===== */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative" style={{ position: 'relative' }}>
          <div className="p-4 min-h-full">
            {activeMenu === "dashboard" && <DashboardScreen searchQuery={searchQuery} />}
            {activeMenu === "folloups" && <MissedCallsDemoScreen />}
            {activeMenu === "history" && <HistoryScreen />}
            {activeMenu === "team_performance" && <TeamPerformanceScreen  />}
            {activeMenu === "recordings" && <RecordingScreen  />}
            {activeMenu === "intelligence" && <CustomerIntelligenceDemoScreen  />}
            {activeMenu === "teams" && <BranchTeamsDemoScreen  />}
            {activeMenu === "integrations" && <IntegrationsDemoScreen  />}
          </div>
        </div>
      </main>

      {/* Timeline Drawer Portal - Yeh laptop ke andar hi rahega */}
      <div id="timeline-portal" className="absolute inset-0 pointer-events-none z-50">
        {/* Portal container for timeline drawer - yeh content area ke upar overlay karega but laptop ke andar */}
      </div>
    </div>
  );
};

// ─── Main Laptop Demo Component ─────────────────────────────────────────
export default function CompleteLaptopDemo() {
  return (
    <section className="relative w-full py-6 flex items-center justify-center">
      {/* Enhanced laptop mockup with 3D effect */}
      <div className="relative perspective-2000 z-20 w-full max-w-6xl mx-auto">
        <div className="relative">
          {/* Laptop screen with premium finish */}
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-t-2xl rounded-b-sm p-3 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.1)_inset]">
            {/* Camera and sensor bar */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-700 border border-gray-600"></div>
              <div className="w-10 h-1.5 bg-gray-800 rounded-full border border-gray-700"></div>
              <div className="w-2 h-2 rounded-full bg-gray-700 border border-gray-600"></div>
            </div>
            
            {/* Screen with reflective effect */}
            <div className="relative bg-black rounded-xl overflow-hidden border-4 border-gray-700 shadow-[0_0_0_1px_rgba(255,255,255,0.2)_inset]">
              {/* Ambient light reflection */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none z-10"></div>
              
              {/* Screen content - FIXED HEIGHT */}
              <div className="h-[600px] lg:h-[650px] overflow-hidden relative">
                <DashboardContent />
              </div>
            </div>
          </div>

          {/* Enhanced laptop base */}
          <div className="relative">
            {/* Hinge mechanism */}
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-32 h-3 bg-gradient-to-b from-gray-800 to-gray-900 rounded-t-lg shadow-[0_-2px_5px_rgba(0,0,0,0.3)]"></div>
            
            {/* Main base with keyboard detail */}
            <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-b-xl h-5 relative overflow-hidden">
              {/* Keyboard texture */}
              <div className="absolute inset-0 grid grid-cols-10 gap-1 px-4 opacity-20">
                {[...Array(50)].map((_, i) => (
                  <div key={i} className="w-1 h-1 bg-gray-400 rounded-sm"></div>
                ))}
              </div>
              
              {/* Touchpad indicator */}
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-gray-700 to-gray-600 rounded-full"></div>
            </div>
            
            {/* Enhanced shadow with gradient */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[95%] h-8 bg-gradient-to-b from-black/30 via-black/20 to-transparent blur-xl rounded-full"></div>
          </div>

          {/* Glare effect */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* Reflection effect */}
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[80%] h-12 bg-gradient-to-b from-white/30 via-white/10 to-transparent blur-2xl"></div>
      </div>
    </section>
  );
}