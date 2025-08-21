"use client";

import { useState } from "react";
import { 
  Home, Store, MapPin, Users, BarChart3, Settings, 
  Menu, X, Building2, UserCircle, LogOut
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/store/authSlice";   // <-- import logout action

export default function SideNav({ navigation, title = "Dashboard", subtitle = "Portal" }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

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

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login"); // 🔥 apne login page ka path
  };

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
                <h4 className="font-semibold text-gray-800 leading-tight">
                  {title}
                </h4>
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

          {/* User + Logout */}
          <div className="border-t border-gray-200 px-3 py-4 space-y-3 gap-5 flex justify-around items-center">
            <div
              className={`flex items-center gap-3 ${
                !sidebarOpen && "justify-center"
              }`}
            >
              <UserCircle className="h-8 w-8 text-gray-400" />
              {sidebarOpen && (
                <div className="leading-tight">
                  <p className="text-sm font-medium text-gray-800">
                   {user?.name}
                  </p>
                  <p className="text-xs text-gray-500">{user?.mobile}</p>
                </div>
              )}
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className={`flex items-center gap-3 p-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors
                ${!sidebarOpen && "justify-center"}`}
            >
              <LogOut className="h-5 w-5" />
              {/* {sidebarOpen && <span>Logout</span>} */}
            </button>
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
