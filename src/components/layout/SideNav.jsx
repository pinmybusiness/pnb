"use client";

import { useState } from "react";
import { 
  Home, Store, MapPin, Users, BarChart3, Settings, 
  Menu, X, Building2, UserCircle, LogOut, ChevronDown, ChevronRight,
  PanelLeft
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "@/store/authThunks";
import toast from "react-hot-toast";

export default function SideNav({ navigation, title = "Dashboard", subtitle = "Portal", sidebarOpen, setSidebarOpen }) {
  const [openMenus, setOpenMenus] = useState({});
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success("Logged out successfully!");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error.message || "Logout failed. Please try again.");
    }
  };

  const toggleSubMenu = (name) => {
    setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transition-all duration-300
          ${sidebarOpen ? "w-64" : "w-0 md:w-16"} overflow-hidden md:overflow-visible`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-3 border-b border-gray-200">
          <div className={`flex items-center gap-3 ${!sidebarOpen && "justify-center w-full"}`}>
            <div className="p-2 rounded-lg bg-primary flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            {sidebarOpen && (
              <div>
                <h4 className="font-semibold text-gray-800 leading-tight">{title}</h4>
                <p className="text-xs text-gray-500">{subtitle}</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg hover:bg-gray-100 transition-colors"
          >
            {sidebarOpen ? <X className="h-6 w-6 md:hidden text-gray-600" /> : <PanelLeft className="h-6 w-6 hidden text-gray-600" />}
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col justify-between h-[calc(100dvh-64px)]">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const hasChildren = item.children?.length > 0;
              const isOpen = openMenus[item.name];

              return (
                <div key={item.name}>
                  {hasChildren ? (
                    <div
                      onClick={() => toggleSubMenu(item.name)}
                       className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer
                        ${
                          isActive
                            ? "bg-primary text-white"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-6 min-w-[24px]">
                          {item.icon && (
                            <item.icon
                              className={`h-5 w-5 ${
                                isActive ? "text-white" : "text-gray-600"
                              }`}
                            />
                          )}
                        </div>
                        {sidebarOpen && <span>{item.name}</span>}
                      </div>
                      {sidebarOpen && (isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
                    </div>
                  ) : (
                     /* 👉 Parent without Children (normal Link) */
                    <Link
                      href={item.href}
                       className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                        ${
                          isActive
                            ? "bg-primary text-white"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                    >
                      <div className="flex items-center justify-center w-6 min-w-[24px]">
                        {item.icon && (
                          <item.icon
                            className={`h-5 w-5 ${isActive ? "text-white" : "text-gray-600"}`}
                          />
                        )}
                      </div>
                      {sidebarOpen && <span>{item.name}</span>}
                    </Link>
                  )}

                  {hasChildren && isOpen && sidebarOpen && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.children
                        .filter((sub) => !sub.roles || sub.roles.includes(user?.role))
                        .map((sub) => {
                          const subActive = pathname === sub.href;
                          return (
                            <Link
                              key={sub.name}
                              href={sub.href}
                              className={`block px-4 py-2 rounded-lg text-sm transition-colors
                                ${
                                  subActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                }`}
                            >
                              <span className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                                {sub.name}
                              </span>
                            </Link>
                          );
                        })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="border-t border-gray-200 px-3 py-4 flex justify-around items-center">
            <div className={`flex items-center gap-3 ${!sidebarOpen && "justify-center"}`}>
              <UserCircle className="h-8 w-8 text-gray-400" />
              {sidebarOpen && (
                <div className="leading-tight">
                  <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.mobile}</p>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors
                ${!sidebarOpen && "justify-center"}`}
            >
              <LogOut className="h-6 w-6" />
            </button>
          </div>
        </div>
      </aside>

      <div
        className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-0 md:ml-64" : "ml-0 md:ml-16"}`}
      />
    </div>
  );
}