"use client";

import Image from "next/image";
import { Menu, X, User, Building, LogOut } from "lucide-react";
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
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("candidate"); // "candidate" or "restaurant"
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);

  const links = [
    { name: "Home", path: "/" },
    { name: "Jobs", path: "/jobs" },
    { name: "About", path: "/about" },
  ];

  const openModal = (tab) => {
    setActiveTab(tab);
    setModalOpen(true);
    setMobileOpen(false);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success("Logged out successfully!");
      setMobileOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error.message || "Logout failed. Please try again.");
    }
  };

  return (
    <>
      <header className="w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <a href="/" className="flex items-center group">
              <Image
                src="/logo.png"
                alt="Hirewaala Logo"
                width={185}
                height={48}
                className="object-contain"
              />
            </a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-8">
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`text-sm md:!text-[21px] font-medium transition-colors duration-300 ${
                    activeLink === link.path
                      ? "text-orange-600 border-b-2 font-bold border-orange-600"
                      : "text-gray-700 hover:text-orange-600"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-3">
              {user ? (
                <div className="relative">
                  <CtaButton
                    text={user.name || "Profile"}
                    icon={User}
                    size="md"
                    variant="filled"
                    className="bg-orange-50/50 hover:bg-orange-100 text-gray-700 hover:text-orange-600"
                    onClick={() =>
                      router.push(user.role === 10 ? "/candidate-profile" : "/dashboard")
                    }
                    asButton={true}
                  />
                  <div
                    className={`absolute top-full right-0 mt-2 w-56 z-50 bg-white rounded-xl shadow-xl border border-orange-100 ${
                      mobileOpen ? "block" : "hidden"
                    }`}
                  >
                    <div className="py-2">
                      <a
                        href={user.role === 10 ? "/candidate-profile" : "/dashboard"}
                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      >
                        <User className="w-4 h-4 mr-2" />
                        {user.role === 10 ? "Candidate Profile" : "Restaurant Dashboard"}
                      </a>
                      <CtaButton
                        text="Logout"
                        icon={LogOut}
                        size="sm"
                        variant="outline"
                        className="w-full text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                        onClick={handleLogout}
                        asButton={true}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative flex gap-4">
                  <CtaButton
                    text="Login"
                    icon={User}
                    size="md"
                    variant="outline"
                    onClick={() => openModal("candidate")}
                    asButton={true}
                  />
                  <CtaButton
                    text="Register"
                    icon={Building}
                    size="md"
                    variant="filled"
                    className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    asButton={true}
                  />
                  <div
                    className={`absolute top-full right-0 mt-2 w-56 z-50 bg-white rounded-xl shadow-xl border border-orange-100 ${
                      mobileOpen ? "block" : "hidden"
                    }`}
                  >
                    <div className="p-2 flex flex-col gap-2">
                      <CtaButton
                        text="Candidate Register"
                        icon={User}
                        size="sm"
                        variant="outline"
                        href="/candidate-register"
                        onClick={() => setMobileOpen(false)}
                        asButton={false}
                      />
                      <CtaButton
                        text="Restaurant Register"
                        icon={Building}
                        size="sm"
                        variant="outline"
                        href="/restaurant-register"
                        onClick={() => setMobileOpen(false)}
                        asButton={false}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <CtaButton
              icon={mobileOpen ? X : Menu}
              size="md"
              variant="outline"
              className="md:hidden text-gray-700 hover:text-orange-600 hover:bg-orange-50"
              onClick={() => setMobileOpen(!mobileOpen)}
              asButton={true}
            />
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-orange-100 shadow-lg">
            <nav className="flex flex-col p-4 space-y-3">
              {links.map((link) => (
                <a
                  key={link.name}
                  href={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`text-sm font-medium py-2 px-3 rounded-lg transition-colors ${
                    activeLink === link.path
                      ? "text-orange-600 bg-orange-50"
                      : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                  }`}
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-2 border-t border-orange-100 flex flex-col gap-2">
                {user ? (
                  <>
                    <a
                      href={user.role === 10 ? "/candidate-profile" : "/dashboard"}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center w-full py-2 px-3 text-sm text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                    >
                      <User className="w-5 h-5 mr-2" />
                      {user.role === 10 ? "Candidate Profile" : "Restaurant Dashboard"}
                    </a>
                    <CtaButton
                      text="Logout"
                      icon={LogOut}
                      size="md"
                      variant="outline"
                      className="w-full text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                      onClick={handleLogout}
                      asButton={true}
                    />
                  </>
                ) : (
                  <>
                    <CtaButton
                      text="Login"
                      icon={User}
                      size="md"
                      variant="outline"
                      className="w-full text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                      onClick={() => openModal("candidate")}
                      asButton={true}
                    />
                    <CtaButton
                      text="Candidate Register"
                      icon={User}
                      size="md"
                      variant="outline"
                      href="/candidate-register"
                      className="w-full text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                      onClick={() => setMobileOpen(false)}
                      asButton={false}
                    />
                    <CtaButton
                      text="Restaurant Register"
                      icon={Building}
                      size="md"
                      variant="filled"
                      href="/restaurant-register"
                      className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white"
                      onClick={() => setMobileOpen(false)}
                      asButton={false}
                    />
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      <LoginModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialTab={activeTab}
      />
    </>
  );
}