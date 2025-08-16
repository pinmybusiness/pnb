"use client";

import { useState } from "react";
import { Home, Store, MapPin, Users, BarChart3, Settings, Menu, X, Building2, UserCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideNav({ navigation, title = "Dashboard", subtitle = "Portal" }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  // Default nav if not provided
  const defaultNavigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Restaurants", href: "/restaurants", icon: Store },
    { name: "Branches", href: "/branches", icon: MapPin },
    { name: "Teams", href: "/teams", icon: Users },
    { name: "Reports", href: "/reports", icon: BarChart3 },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const links = navigation?.length ? navigation : defaultNavigation;

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transition-all duration-300
          ${sidebarOpen ? "w-64" : "w-16"}`}
      >
 {/* Header */}
        <div className="flex items-center justify-between h-16 px-3 border-b border-gray-200">
          <div
            className={`flex items-center gap-3 transition-all ${
              !sidebarOpen && "justify-center w-full"
            }`}
          >
            <div className="p-2 rounded-lg bg-primary flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="font-semibold text-gray-800 leading-tight">
                  {title}
                </h1>
                <p className="text-xs text-gray-500">{subtitle}</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {sidebarOpen ? (
              <X className="h-4 w-4 text-gray-600" />
            ) : (
              <Menu className="h-4 w-4 text-gray-600" />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col justify-between h-[calc(100dvh-64px)]">
          {/* Nav Links */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {links.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${
                      isActive
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                >
                  <div className="flex items-center justify-center w-6 min-w-[24px]">
                    <item.icon
                      className={`h-5 w-5 ${
                        isActive ? "text-white" : "text-gray-600"
                      }`}
                    />
                  </div>
                  {sidebarOpen && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          {/* User */}
          <div className="border-t border-gray-200 px-3 py-4">
            <div
              className={`flex items-center gap-3 ${
                !sidebarOpen && "justify-center"
              }`}
            >
              <UserCircle className="h-8 w-8 text-gray-400" />
              {sidebarOpen && (
                <div className="leading-tight">
                  <p className="text-sm font-medium text-gray-800">
                    John Admin
                  </p>
                  <p className="text-xs text-gray-500">admin@company.com</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        {/* Page content goes here */}
      </div>
    </div>
  );
}
