"use client";

import { Sparkles, BookOpen, LogIn, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Header({ activeLink = '' }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Internship', path: '/internships' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <header className="bg-white  relative z-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
         <Link href='/'>
          <div className="flex items-center">
            <Sparkles className="h-8 w-8 text-primary" />
            <span className="ml-2 text-xl font-bold text-gray-900">ListenLift.ai</span>
          </div>
         </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={`${activeLink === link.path ? 'text-primary font-medium' : 'text-gray-500 hover:text-gray-900'} transition-colors`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/auth/login" 
              className="flex items-center px-4 py-2 text-gray-700 hover:text-primary transition-colors"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Login
            </Link>
            <Link 
              href="/book-demo" 
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Book Demo
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-700 hover:text-primary"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-t border-soft shadow-md">
          <nav className="flex flex-col space-y-2 p-4">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                onClick={() => setMobileOpen(false)}
                className={`${activeLink === link.path ? 'text-primary font-medium' : 'text-gray-700 hover:text-gray-900'} transition-colors`}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex flex-col space-y-2 mt-4">
              <Link 
                href="/auth/login" 
                onClick={() => setMobileOpen(false)}
                className="flex items-center px-4 py-2 text-gray-700 hover:text-primary transition-colors"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Login
              </Link>
              <Link 
                href="/book-demo" 
                onClick={() => setMobileOpen(false)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Book Demo
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
