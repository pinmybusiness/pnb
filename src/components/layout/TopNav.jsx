"use client";
import { Bell, Menu, PanelLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopNav({ navigation, setSidebarOpen }) {
  const pathname = usePathname();

  return (
    <header className="w-full bg-white border-b border-gray-200 px-3 py-2 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* <button
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="p-3 rounded-lg hover:bg-gray-100 md:hidden"
        >
          <Menu className="h-6 w-6 text-gray-600" />
        </button> */}
         <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="rounded-lg hover:bg-gray-100 transition-colors"
          >
            { <PanelLeft className="h-5 w-5 text-gray-600" />}
          </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-gray-800 truncate">
            {navigation.find((nav) => nav?.href === pathname)?.name || "Dashboard"}
          </h2>
          {/* <p className="hidden md:block text-sm text-gray-500">
            Manage your restaurant network performance
          </p> */}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-3 rounded hover:bg-gray-100 cursor-pointer">
          <Bell className="h-6 w-6 text-gray-600" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
        </button>
        <Link
          href="/dashboard/branch"
          className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 cursor-pointer"
        >
          Branch
        </Link>
      </div>
    </header>
  );
}