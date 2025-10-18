'use client';

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
  const [profileOpen, setProfileOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const [registerDropdownOpen, setRegisterDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("candidate");
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);

const links = [
  { name: "Home", path: "/" },
  // { 
  //   name: "Products", 
  //   submenu: [
  //     { name: "Trackly", path: "/products/missed-call-tracker" },
  //   ],
  // },
  { name: "Trackly", path: "/products/trackly" },
  { name: "Pricing", path: "/pricing" },
  { name: "Jobs", path: "/jobs" },
  { name: "About", path: "/about" },
];

  const openModal = (tab) => {
    setActiveTab(tab);
    setModalOpen(true);
    setMobileOpen(false);
    setLoginDropdownOpen(false);
    setRegisterDropdownOpen(false);
  };

  const handleLoginClick = () => {
    setLoginDropdownOpen(!loginDropdownOpen);
    setRegisterDropdownOpen(false);
  };

  const handleRegisterClick = () => {
    setRegisterDropdownOpen(!registerDropdownOpen);
    setLoginDropdownOpen(false);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success("Logged out successfully!");
      setMobileOpen(false);
      setProfileOpen(false);
      setLoginDropdownOpen(false);
      setRegisterDropdownOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error.message || "Logout failed. Please try again.");
    }
  };

  return (
    <>
      <header className="w-full !z-50 bg-[#FFF5EC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <a href="/" className="flex items-center group">
              <Image
                src="/logo.png"
                alt="FasterQ.in Logo"
                width={185}
                height={48}
                className="object-contain"
              />
            </a>

            {/* Desktop Nav */}
<nav className="hidden md:flex items-center space-x-10">
  {links.map((link) => (
    <div key={link.name} className="relative group">
      {!link.submenu ? (
        <Link
          href={link.path}
          className={`text-sm md:text-lg font-medium transition-colors duration-300 ${
            activeLink === link.path
              ? "text-orange-600 border-b-2 font-bold border-orange-600"
              : "text-gray-700 hover:text-orange-600"
          }`}
        >
          {link.name}
          {link.name === "Jobs" && (
            <span className="ml-1 text-[10px] font-bold uppercase text-white bg-orange-600 rounded-full px-1.5 py-0.5 shadow-sm">
              Free
            </span>
          )}
        </Link>
      ) : (
        <>
          <button
            className={`text-sm md:text-lg font-medium transition-colors duration-300 text-gray-700 hover:text-orange-600 flex items-center space-x-1`}
          >
            <span>{link.name}</span>
            <svg
              className="w-3 h-3 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Submenu */}
          <div className="absolute left-0 top-full mt-2 w-48 bg-white border border-orange-100 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-50">
            {link.submenu.map((sublink) => (
              <Link
                key={sublink.name}
                href={sublink.path}
                className="block px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors text-sm"
              >
                {sublink.name}
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
                  <CtaButton
                    text={user.name || "Profile"}
                    icon={User}
                    size="sm"
                    variant="filled"
                    className="bg-orange-50/50 hover:bg-orange-100 text-gray-700 hover:text-orange-600"
                    onClick={() => setProfileOpen(!profileOpen)}
                    asButton={true}
                  />
                  <div
                    className={`absolute top-full right-0 mt-2 w-56 z-50 bg-white rounded-xl shadow-xl border border-orange-100 ${
                      profileOpen ? "block" : "hidden"
                    }`}
                  >
                    <div className="p-2">
                      <a
                        href={user.role === 10 ? "/candidate/applications" : "/dashboard"}
                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        onClick={() => setProfileOpen(false)}
                      >
                        <User className="w-4 h-4 mr-2" />
                        {user.role === 10 ? "My Applications" : "Restaurant Dashboard"}
                      </a>
                      <CtaButton
                        text="Log Out"
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
                  <div className="relative">
                    <CtaButton
                      text="Login"
                      icon={User}
                      size="sm"
                      variant="outline"
                      onClick={handleLoginClick}
                      asButton={true}
                    />
                    <div
                      className={`absolute top-full right-0 mt-2 w-56 z-50 bg-white rounded-xl shadow-xl border border-orange-100 ${
                        loginDropdownOpen ? "block" : "hidden"
                      }`}
                    >
                      <div className="p-2 flex flex-col gap-2">
                        <CtaButton
                          text="Candidate Login"
                          icon={User}
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            openModal("candidate");
                            setLoginDropdownOpen(false);
                          }}
                          asButton={true}
                        />
                        <CtaButton
                          text="Restaurant Login"
                          icon={Building}
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            openModal("restaurant");
                            setLoginDropdownOpen(false);
                          }}
                          asButton={true}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <CtaButton
                      text="Register"
                      icon={Building}
                      size="sm"
                      variant="filled"
                      className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white"
                      onClick={handleRegisterClick}
                      asButton={true}
                    />
                    <div
                      className={`absolute top-full right-0 mt-2 w-56 z-50 bg-white rounded-xl shadow-xl border border-orange-100 ${
                        registerDropdownOpen ? "block" : "hidden"
                      }`}
                    >
                      <div className="p-2 flex flex-col gap-2">
                        <a
                          href="/candidate/register"
                          className="flex items-center justify-center w-full px-4 py-2 text-sm text-gray-700 border border-orange-200 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors"
                          onClick={() => setRegisterDropdownOpen(false)}
                        >
                          <User className="w-4 h-4 mr-2" />
                          Candidate Register
                        </a>
                        <a
                          href="/restaurant/register"
                          className="flex items-center justify-center w-full px-4 py-2 text-sm text-gray-700 border border-orange-200 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors"
                          onClick={() => setRegisterDropdownOpen(false)}
                        >
                          <Building className="w-4 h-4 mr-2" />
                          Restaurant Register
                        </a>
                      </div>
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
  <div key={link.name} className="flex flex-col">
    {!link.submenu ? (
      <a
        href={link.path}
        onClick={() => setMobileOpen(false)}
        className={`text-sm font-medium py-2 px-3 rounded-lg transition-colors flex items-center ${
          activeLink === link.path
            ? "text-orange-600 bg-orange-50"
            : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
        }`}
      >
        {link.name}
      </a>
    ) : (
      <details className="group">
        <summary className="cursor-pointer flex items-center justify-between py-2 px-3 rounded-lg text-gray-700 hover:text-orange-600 hover:bg-orange-50">
          {link.name}
          <svg
            className="w-3 h-3 ml-2 transition-transform group-open:rotate-180"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div className="flex flex-col pl-5 mt-2 space-y-1">
          {link.submenu.map((sublink) => (
            <a
              key={sublink.name}
              href={sublink.path}
              onClick={() => setMobileOpen(false)}
              className="text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg py-2 px-3 transition-colors text-sm"
            >
              {sublink.name}
            </a>
          ))}
        </div>
      </details>
    )}
  </div>
))}

              <div className="pt-2 border-t border-orange-100 flex flex-col gap-2">
                {user ? (
                  <>
                    <a
                      href={user.role === 10 ? "/candidate/applications" : "/dashboard"}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center w-full py-2 px-3 text-sm text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                    >
                      <User className="w-5 h-5 mr-2" />
                      {user.role === 10 ? "My Applications" : "Restaurant Dashboard"}
                    </a>
                    <CtaButton
                      text="Log Out"
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
                      text="Candidate Login"
                      icon={User}
                      size="md"
                      variant="outline"
                      className="w-full text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                      onClick={() => openModal("candidate")}
                      asButton={true}
                    />
                    <CtaButton
                      text="Restaurant Login"
                      icon={Building}
                      size="md"
                      variant="outline"
                      className="w-full text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                      onClick={() => openModal("restaurant")}
                      asButton={true}
                    />
                    <a
                      href="/candidate/register"
                      className="flex items-center justify-center w-full py-2 px-3 text-sm text-gray-700 border border-orange-200 rounded-lg hover:text-orange-600 hover:bg-orange-50 transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      <User className="w-5 h-5 mr-2" />
                      Candidate Register
                    </a>
                    <a
                      href="/restaurant/register"
                      className="flex items-center justify-center w-full py-2 px-3 text-sm text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 rounded-lg transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Building className="w-5 h-5 mr-2" />
                      Restaurant Register
                    </a>
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