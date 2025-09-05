"use client";
import { Bell } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopNav({ navigation }) {
  const pathname = usePathname();

  return (
    <header className="w-full bg-white border-b border-gray-200 p-4 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">
          {navigation.find((nav) => nav?.href === pathname)?.name || "Dashboard"}
        </h2>
        <p className="text-sm text-gray-500">
          Manage your restaurant network performance
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded hover:bg-gray-100 cursor-pointer">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
        </button>
        <Link href='/dashboard/branch' className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 cursor-pointer">
          Branch Details
        </Link>
      </div>
    </header>
  );
}
