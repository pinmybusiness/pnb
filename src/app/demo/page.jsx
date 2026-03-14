"use client";

import React from "react";
import DemoDashboardPage from "./DemoDashboardPage"; // Adjust the import path as needed

export default function DashboardLaptopDemo() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 py-10 md:py-18">
      {/* Premium background effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated gradient orbs */}
        <div className="absolute top-0 -left-40 w-[500px] h-[500px] bg-orange-200/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 -right-40 w-[600px] h-[600px] bg-blue-200/20 rounded-full blur-3xl animate-pulse-slower" />
        
        {/* Grid pattern with fade */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8881_1px,transparent_1px),linear-gradient(to_bottom,#8881_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        
        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.4)_0%,transparent_70%)]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced header with animated badge */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-50 to-orange-100/50 border border-orange-200/50 text-orange-600 text-sm font-medium px-5 py-2 rounded-full mb-8 shadow-lg shadow-orange-500/10 backdrop-blur-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
            </span>
            <span className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent font-semibold">
              LIVE DEMO
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight mb-6">
            Experience{" "}
            <span className="relative whitespace-nowrap">
              <span className="relative z-10 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient">
                CallFlow
              </span>
              <span className="absolute -bottom-2 left-0 w-full h-3 bg-orange-200/50 -skew-x-12 blur-sm"></span>
            </span>{" "}
            in Action
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            See how our intelligent call center platform transforms your team's productivity 
            with real-time analytics, seamless integrations, and actionable insights.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-10">
            {[
              { label: "99.9% Uptime", icon: "⚡" },
              { label: "24/7 Support", icon: "🎧" },
              { label: "500+ Enterprise Clients", icon: "🏢" },
            ].map((badge) => (
              <div key={badge.label} className="flex items-center gap-2 text-sm text-gray-500 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-100">
                <span className="text-lg">{badge.icon}</span>
                {badge.label}
              </div>
            ))}
          </div>
        </div>

          <DemoDashboardPage />
          
          {/* Feature showcase badges */}
          <div className="mt-15 flex flex-wrap items-center justify-center gap-4 max-w-4xl mx-auto">
            {[
              { icon: Zap, label: "Real-time Sync", color: "orange" },
              { icon: Shield, label: "Enterprise Security", color: "blue" },
              { icon: Users, label: "Team Collaboration", color: "green" },
              { icon: BarChart2, label: "Advanced Analytics", color: "purple" },
              { icon: Cloud, label: "Cloud Native", color: "sky" },
              { icon: Headphones, label: "24/7 Support", color: "pink" },
            ].map(({ icon: Icon, label, color }) => (
              <div
                key={label}
                className="group relative"
              >
                <div className={`absolute inset-0 bg-${color}-500 rounded-full blur-lg opacity-0 group-hover:opacity-30 transition-opacity`}></div>
                <div className="relative flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-600 text-sm px-5 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-orange-200">
                  <Icon size={16} className={`text-${color}-500`} />
                  <span className="font-medium">{label}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" />
              <span>Instant setup</span>
            </div>
          </div>
        
      </div>

    </section>
  );
}

// Import icons
import { 
  Zap, 
  Shield, 
  Users, 
  BarChart2, 
  Cloud, 
  Headphones,
  CheckCircle 
} from "lucide-react"; 