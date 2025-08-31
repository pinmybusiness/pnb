"use client";

import { Sparkles, Briefcase, LogIn, Menu, X, User, Building } from "lucide-react";
import { useState } from "react";
import LoginModal from "./auth/LoginModal";

export default function Header({ activeLink = '' }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('candidate');

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Jobs', path: '/jobs' },
    // { name: 'For Restaurants', path: '/for-restaurants' },
    { name: 'About', path: '/about' },
  ];

  const openModal = (tab) => {
    setActiveTab(tab);
    setModalOpen(true);
    setLoginDropdownOpen(false); // Close dropdown if open
    setMobileOpen(false); // Close mobile menu if open
  };

  return (
    <>
      <header className="w-full z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <a href="/" className="flex items-center group">
              <Sparkles className="h-8 w-8 text-orange-600 group-hover:text-orange-700 transition-colors" />
              <span className="ml-2 text-xl md:text-2xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                Hirewaala
              </span>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-8">
              {links.map((link) => (
                <a
                  key={link.name}
                  href={link.path}
                  className={`text-sm font-medium transition-colors duration-300 ${
                    activeLink === link.path
                      ? 'text-orange-600 border-b-2 border-orange-600'
                      : 'text-gray-700 hover:text-orange-600'
                  }`}
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative group">
                <button
                  onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                  className="flex items-center px-4 py-2 text-gray-700 hover:text-orange-600 font-medium rounded-lg transition-colors bg-orange-50/50 hover:bg-orange-100"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Login
                </button>
                <div
                  className={`absolute top-full right-0 mt-2 w-56 z-100 bg-white rounded-xl shadow-xl border border-orange-100 transition-all duration-300 transform ${
                    loginDropdownOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
                  }`}
                >
                  <div className="py-2">
                    <button
                      onClick={() => openModal('candidate')}
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Candidate Login
                    </button>
                    <button
                      onClick={() => openModal('restaurant')}
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    >
                      <Building className="w-4 h-4 mr-2" />
                      Restaurant Login
                    </button>
                  </div>
                </div>
              </div>
              <a
                href="/book-demo"
                className="px-6 py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg font-medium hover:from-orange-700 hover:to-amber-700 transition-all shadow-md hover:shadow-lg flex items-center"
              >
                <Briefcase className="w-5 h-5 mr-2" />
                Book Demo
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-700 hover:text-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-orange-100 shadow-lg animate-slide-down">
            <nav className="flex flex-col p-4 space-y-3">
              {links.map((link) => (
                <a
                  key={link.name}
                  href={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`text-sm font-medium py-2 px-3 rounded-lg transition-colors ${
                    activeLink === link.path
                      ? 'text-orange-600 bg-orange-50'
                      : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                  }`}
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-2 border-t border-orange-100">
                <button
                  onClick={() => openModal('candidate')}
                  className="flex items-center w-full py-2 px-3 text-sm text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                >
                  <User className="w-5 h-5 mr-2" />
                  Candidate Login
                </button>
                <button
                  onClick={() => openModal('restaurant')}
                  className="flex items-center w-full py-2 px-3 text-sm text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                >
                  <Building className="w-5 h-5 mr-2" />
                  Restaurant Login
                </button>
                <a
                  href="/book-demo"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center py-2 px-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg font-medium hover:from-orange-700 hover:to-amber-700 transition-all"
                >
                  <Briefcase className="w-5 h-5 mr-2" />
                  Book Demo
                </a>
              </div>
            </nav>
          </div>
        )}

        {/* Animation Styles */}
        <style jsx>{`
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-slide-down {
            animation: slideDown 0.3s ease-out forwards;
          }
        `}</style>
      </header>

      <LoginModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialTab={activeTab}
      />
    </>
  );
}