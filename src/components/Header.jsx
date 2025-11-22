"use client";

import Image from "next/image";
import { Menu, X, User, Building, LogOut, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import LoginModal from "./auth/LoginModal";
import { logoutUser } from "@/store/authThunks";
import { toast } from "react-hot-toast";
import Link from "next/link";
import CtaButton from "./CtaButton";

export default function Header({ activeLink = "" }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);

  const links = [
    { name: "Home", path: "/" },
    { 
    name: "Call Tracker",
    dropdown: [
      { label: "Overview", path: "/call-tracker" },
      { label: "Incoming", path: "/call-tracker/incoming-call-tracker" },
      { label: "Outgoing", path: "/call-tracker/outgoing-call-tracker" },
      { label: "Missed", path: "/call-tracker/missed-call-tracker" },
      { label: "Analytics", path: "/call-tracker/call-tracker-analytics" },
    ]
  },
    // { name: "Trackly", path: "/products/trackly" },
    // { name: "Jobs", path: "/jobs" },
    { name: "About", path: "/about" },
  ];

  const openModal = () => {
    setModalOpen(true);
    setMobileOpen(false);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success("Logged out successfully!");
      setMobileOpen(false);
      setProfileOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error.message || "Logout failed. Please try again.");
    }
  };

  return (
    <>
      <header className="w-full !z-50 sticky top-0 backdrop-blur-xl bg-[#FFF5EC]/20">
        {/* Animated gradient line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#FF5211] to-transparent opacity-50"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo with hover effect */}
            <a href="/" className="flex items-center group relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-[#FF5211]/0 via-[#FF5211]/5 to-[#FF5211]/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
              <Image
                src="/logo.png"
                alt="FasterQ.in Logo"
                width={185}
                height={48}
                className="object-contain relative z-10 group-hover:scale-105 transition-transform duration-300"
              />
            </a>

            {/* Desktop Nav - Modern Pills */}
            <nav className="hidden md:flex items-center space-x-2">
              {links.map((link) => (
                <div key={link.name} className="relative group">
                  {!link.dropdown ? (
                    <Link
                      href={link.path}
                      className={`relative px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ${
                        activeLink === link.path
                          ? "text-white bg-gradient-to-r from-[#FF5211] to-orange-600 shadow-lg shadow-orange-500/30"
                          : "text-gray-700 hover:text-[#FF5211] hover:bg-orange-50/80"
                      }`}
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <>
                      {/* Call Tracker parent button */}
                      <button
                        className={`relative px-5 py-2.5 text-sm font-semibold rounded-xl flex items-center gap-1 transition-all duration-300 text-gray-700 hover:text-[#FF5211] hover:bg-orange-50/80`}
                      >
                        {link.name}
                        <ChevronDown className="w-4 h-4 mt-0.5 group-hover:rotate-180 transition-transform" />
                      </button>

                      {/* Dropdown menu */}
                      <div className="absolute left-0 mt-2 w-52 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-orange-100 opacity-0 group-hover:opacity-100 group-hover:translate-y-2 translate-y-0 invisible group-hover:visible transition-all duration-300">
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.label}
                            href={item.path}
                            className="block px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#FF5211] transition rounded-lg"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-3">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white/80 backdrop-blur-sm hover:bg-white border-2 border-orange-100 hover:border-orange-200 rounded-xl transition-all duration-300 hover:shadow-lg group"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-[#FF5211] to-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span className="group-hover:text-[#FF5211] transition-colors">
                      {user.name || "Profile"}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div
                    className={`absolute top-full right-0 mt-3 w-64 z-50 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-orange-100 overflow-hidden transition-all duration-300 ${
                      profileOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-2 invisible"
                    }`}
                  >
                    {/* User Info Card */}
                    <div className="p-4 bg-gradient-to-br from-orange-50 to-white border-b border-orange-100">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#FF5211] to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {user.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 truncate">{user.name || "User"}</p>
                          <p className="text-xs text-gray-600 truncate">{user.mobile}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      <a
                        href="/dashboard"
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100/50 hover:text-[#FF5211] rounded-xl transition-all duration-200 group"
                        onClick={() => setProfileOpen(false)}
                      >
                        <div className="w-8 h-8 bg-orange-100 group-hover:bg-orange-200 rounded-lg flex items-center justify-center transition-colors">
                          <User className="w-4 h-4" />
                        </div>
                        <span>Dashboard</span>
                      </a>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 mt-1 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100/50 hover:text-red-600 rounded-xl transition-all duration-200 group"
                      >
                        <div className="w-8 h-8 bg-red-100 group-hover:bg-red-200 rounded-lg flex items-center justify-center transition-colors">
                          <LogOut className="w-4 h-4" />
                        </div>
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    onClick={openModal}
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white/80 backdrop-blur-sm hover:bg-white border-2 border-orange-100 hover:border-orange-200 rounded-xl transition-all duration-300 hover:shadow-lg group"
                  >
                    <User className="w-4 h-4 group-hover:text-[#FF5211] transition-colors" />
                    <span className="group-hover:text-[#FF5211] transition-colors">Login</span>
                  </button>

                  {/* <a
                    href="/register"
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#FF5211] to-orange-600 hover:from-[#FF5211] hover:to-orange-700 rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:scale-105 group"
                  >
                    <Building className="w-4 h-4" />
                    <span>Register</span>
                  </a> */}
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex items-center justify-center w-11 h-11 text-gray-700 hover:text-[#FF5211] bg-white/80 hover:bg-white border-2 border-orange-100 hover:border-orange-200 rounded-xl transition-all duration-300 hover:shadow-lg"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden bg-white/95 backdrop-blur-xl border-t-2 border-orange-100 shadow-2xl transition-all duration-300 overflow-hidden ${
            mobileOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="flex flex-col p-4 space-y-2">
            {links.map((link) => (
              <div key={link.name}>
                {!link.dropdown ? (
                  <a
                    href={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={`relative flex items-center justify-between px-5 py-3.5 text-sm font-semibold rounded-xl transition-all duration-300 ${
                      activeLink === link.path
                        ? "text-white bg-gradient-to-r from-[#FF5211] to-orange-600 shadow-lg shadow-orange-500/30"
                        : "text-gray-700 hover:text-[#FF5211] hover:bg-orange-50"
                    }`}
                  >
                    {link.name}
                  </a>
                ) : (
                  <>
                    {/* Call Tracker mobile toggle */}
                    <button
                      onClick={() =>
                        setDropdownOpen((prev) => ({
                          ...prev,
                          [link.name]: !prev[link.name],
                        }))
                      }
                      className="flex items-center justify-between w-full px-5 py-3.5 text-sm font-semibold rounded-xl text-gray-700 hover:bg-orange-50 transition"
                    >
                      {link.name}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          dropdownOpen?.[link.name] ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Mobile dropdown items */}
                    <div
                      className={`overflow-hidden transition-all ${
                        dropdownOpen?.[link.name] ? "max-h-96" : "max-h-0"
                      }`}
                    >
                      {link.dropdown.map((item) => (
                        <a
                          key={item.label}
                          href={item.path}
                          onClick={() => setMobileOpen(false)}
                          className="block ml-6 mt-1 px-4 py-3 text-sm text-gray-700 rounded-lg hover:bg-orange-50 hover:text-[#FF5211] transition"
                        >
                          {item.label}
                        </a>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}

            <div className="pt-3 border-t-2 border-orange-100 flex flex-col gap-2">
              {user ? (
                <>
                  {/* User Info Card Mobile */}
                  <div className="p-4 bg-gradient-to-br from-orange-50 to-white rounded-xl border-2 border-orange-100 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#FF5211] to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 truncate">{user.name || "User"}</p>
                        <p className="text-xs text-gray-600 truncate">{user.mobile}</p>
                      </div>
                    </div>
                  </div>

                  <a
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 w-full px-5 py-3.5 text-sm font-semibold text-gray-700 hover:text-[#FF5211] bg-orange-50/50 hover:bg-orange-50 rounded-xl transition-all duration-300"
                  >
                    <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <User className="w-5 h-5" />
                    </div>
                    <span>Dashboard</span>
                  </a>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-5 py-3.5 text-sm font-semibold text-gray-700 hover:text-red-600 bg-red-50/50 hover:bg-red-50 rounded-xl transition-all duration-300"
                  >
                    <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <LogOut className="w-5 h-5" />
                    </div>
                    <span>Log Out</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={openModal}
                    className="flex items-center gap-3 w-full px-5 py-3.5 text-sm font-semibold text-gray-700 hover:text-[#FF5211] bg-orange-50/50 hover:bg-orange-50 rounded-xl transition-all duration-300"
                  >
                    <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <User className="w-5 h-5" />
                    </div>
                    <span>Login</span>
                  </button>

                 
                </>
              )}
            </div>
          </nav>
        </div>
      </header>

      <LoginModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}