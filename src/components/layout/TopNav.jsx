"use client";
import {PanelLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopNav({ navigation, setSidebarOpen }) {
  const pathname = usePathname();

  return (
    <header className="w-full bg-white border-b border-gray-200 px-3 py-2 flex items-center justify-between">
      <div className="flex items-center gap-3">
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
        </div>
      </div>

      <div className="flex items-center gap-3 md:pr-4">
        <Link
          href="/dashboard/branch"
          className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 cursor-pointer"
        >
          Profile
        </Link>
      </div>
    </header>
  );
}