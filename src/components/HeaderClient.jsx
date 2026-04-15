"use client";

import Image from "next/image";
import {
  Menu, X, User, LogOut, ChevronDown,
  Phone, BarChart3,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import LoginModal from "./auth/LoginModal";
import { logoutUser } from "@/store/authThunks";
import { toast } from "react-hot-toast";

const featureLinks = [
  { label: "Overview",                  path: "/features",                              description: "See how FasterQ works end-to-end.",    icon: <Phone className="w-4 h-4 text-[#FF5211]" /> },
  { label: "Inbound Call Tracking",     path: "/features/inbound-call-tracking",        description: "Track every incoming enquiry.",        icon: <Phone className="w-4 h-4 text-[#FF5211]" /> },
  { label: "Outbound Call Tracking",    path: "/features/outbound-call-tracking",       description: "Monitor outbound sales calls.",        icon: <Phone className="w-4 h-4 text-[#FF5211]" /> },
  { label: "Missed Call Tracker",       path: "/features/missed-call-tracker",          description: "Never lose a missed call.",             icon: <Phone className="w-4 h-4 text-[#FF5211]" /> },
  { label: "Call Analytics Dashboard",  path: "/features/call-analytics-dashboard",     description: "Real-time reports on calls & agents.", icon: <BarChart3 className="w-4 h-4 text-[#FF5211]" /> },
  { label: "Call Recording",            path: "/call-recording/call-recording-auto",    description: "Record and review conversations.",     icon: <Phone className="w-4 h-4 text-[#FF5211]" /> },
];

export default function HeaderClient({ activeLink = "" }) {
  const [mobileOpen, setMobileOpen]             = useState(false);
  const [profileOpen, setProfileOpen]           = useState(false);
  const [modalOpen, setModalOpen]               = useState(false);
  const [featuresOpen, setFeaturesOpen]         = useState(false);
  const [mobileFeaturesOpen, setMobileFeaturesOpen] = useState(false);
  const [scrolled, setScrolled]                 = useState(false);
  const featuresRef = useRef(null);

  const dispatch = useDispatch();
  const router   = useRouter();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    function handleClickOutside(e) {
      if (featuresRef.current && !featuresRef.current.contains(e.target)) {
        setFeaturesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleScroll() { setScrolled(window.scrollY > 10); }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openModal = () => { setModalOpen(true); setMobileOpen(false); };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success("Logged out successfully!");
      setMobileOpen(false);
      setProfileOpen(false);
      router.push("/");
    } catch (error) {
      toast.error(error.message || "Logout failed. Please try again.");
    }
  };

  const navLinkClass = (path) =>
    `text-base font-medium transition-colors duration-150 ${
      activeLink === path ? "text-[#FF5211]" : "text-gray-500 hover:text-gray-900"
    }`;

  return (
    <>
      <header className={`w-full sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl shadow-[0_1px_20px_rgba(0,0,0,0.06)]"
          : "bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">

            {/* Logo */}
            <a href="/" className="flex-shrink-0">
              <Image
                src="/logo.png"
                alt="FasterQ"
                width={148}
                height={38}
                className="object-contain"
              />
            </a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">

              {/* Features dropdown */}
              <div className="relative" ref={featuresRef}>
                <button
                  onMouseEnter={() => setFeaturesOpen(true)}
                  className={`flex items-center gap-1 text-base font-medium transition-colors duration-150 ${
                    featuresOpen ? "text-gray-900" : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  Features
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${featuresOpen ? "rotate-180" : ""}`} />
                </button>

                {featuresOpen && (
                  <div
                    className="absolute left-0 top-full mt-4 w-[500px] bg-white border border-gray-100 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.10)] p-3"
                    onMouseEnter={() => setFeaturesOpen(true)}
                    onMouseLeave={() => setFeaturesOpen(false)}
                  >
                    {/* Pointer arrow */}
                    <div className="absolute -top-[5px] left-6 w-2.5 h-2.5 bg-white border-l border-t border-gray-100 rotate-45" />
                    <div className="grid grid-cols-2 gap-0.5">
                      {featureLinks.map((item) => (
                        <a
                          key={item.path}
                          href={item.path}
                          onClick={() => setFeaturesOpen(false)}
                          className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0 mt-0.5">
                            {item.icon}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800 group-hover:text-[#FF5211] transition-colors">
                              {item.label}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5 leading-snug">
                              {item.description}
                            </p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <a href="/call-tracker-roi" className={navLinkClass("/call-tracker-roi")}>
                ROI Calculator
              </a>

              <a href="/blog" className={navLinkClass("/blog")}>
                Blog
              </a>

            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <div className="w-8 h-8 bg-[#FF5211] rounded-full flex items-center justify-center text-white font-bold text-xs">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span>{user.name || "Profile"}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Profile Dropdown */}
                  <div className={`absolute top-full right-0 mt-3 w-56 bg-white border border-gray-100 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.10)] overflow-hidden transition-all duration-200 ${
                    profileOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-1 invisible"
                  }`}>
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.name || "User"}</p>
                      <p className="text-xs text-gray-400 truncate">{user.mobile}</p>
                    </div>
                    <div className="p-1.5">
                      <a
                        href="/dashboard"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors"
                      >
                        <User className="w-4 h-4" /> Dashboard
                      </a>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Log Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    onClick={openModal}
                    className="flex items-center gap-1.5 text-base font-medium text-gray-500 hover:text-gray-900 transition-colors px-1"
                  >
                    <User className="w-4 h-4" />
                    Login
                  </button>
                  <a
                    href="/contact"
                    className="bg-[#FF5211] hover:bg-orange-500 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-150 hover:shadow-lg hover:shadow-orange-500/20"
                  >
                    Book a Demo
                  </a>
                </>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-gray-500 hover:text-gray-900 transition-colors p-1"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl overflow-hidden transition-all duration-300 ${
          mobileOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}>
          <nav className="px-4 py-4 flex flex-col gap-1">

            {/* Features toggle */}
            <button
              onClick={() => setMobileFeaturesOpen(!mobileFeaturesOpen)}
              className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
            >
              Features
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileFeaturesOpen ? "rotate-180" : ""}`} />
            </button>

            {mobileFeaturesOpen && (
              <div className="ml-3 mt-1 flex flex-col gap-0.5">
                {featureLinks.map((item) => (
                  <a
                    key={item.path}
                    href={item.path}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            )}

            {[
              { name: "ROI Calculator", path: "/call-tracker-roi" },
              { name: "Blog",           path: "/blog" },
              { name: "Pricing",        path: "/pricing" },
            ].map((link) => (
              <a
                key={link.path}
                href={link.path}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
              >
                {link.name}
              </a>
            ))}

            <div className="pt-3 mt-2 border-t border-gray-100 flex flex-col gap-2">
              {user ? (
                <>
                  <div className="px-3 py-2 flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#FF5211] rounded-full flex items-center justify-center text-white font-bold">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.mobile}</p>
                    </div>
                  </div>
                  <a href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
                    <User className="w-4 h-4" /> Dashboard
                  </a>
                  <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                    <LogOut className="w-4 h-4" /> Log Out
                  </button>
                </>
              ) : (
                <>
                  <button onClick={openModal} className="px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors text-left">
                    Login
                  </button>
                  <a href="/contact" onClick={() => setMobileOpen(false)} className="bg-[#FF5211] hover:bg-orange-500 text-white text-sm font-semibold px-4 py-2.5 rounded-full transition-colors text-center">
                    Book a Demo
                  </a>
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
