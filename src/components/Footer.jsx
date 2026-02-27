// "use client";

import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Heart, Mail, Phone, Linkedin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 -left-20 w-64 h-64 bg-[#FF5211]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 -right-20 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Top gradient border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF5211] to-transparent"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo + Tagline */}
          <div className="flex flex-col items-start space-y-4">
            <div className="group cursor-pointer">
              <Image
                src="/logo-white.png"
                alt="Trackly Logo"
                width={160}
                height={48}
                className="object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Smart call tracking for businesses. Track every call seamlessly.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-base font-bold mb-4 flex items-center gap-2">
              <div className="w-1 h-5 bg-gradient-to-b from-[#FF5211] to-orange-600 rounded-full"></div>
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { name: "Download App", href: "/download" },
                { name: "Blog", href: "/blog" },
                { name: "About Us", href: "/about" },
                { name: "Contact", href: "/contact" },
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href} 
                    className="text-gray-400 hover:text-[#FF5211] transition-colors text-sm font-medium inline-block hover:translate-x-1 duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-white text-base font-bold mb-4 flex items-center gap-2">
              <div className="w-1 h-5 bg-gradient-to-b from-[#FF5211] to-orange-600 rounded-full"></div>
              Connect
            </h3>
            
            {/* Contact */}
            <div className="space-y-3 mb-5">
              <a href="mailto:contact@fasterq.in" className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#FF5211] transition-colors">
                <Mail className="w-4 h-4" />
                <span className="font-medium">info@fasterq.in</span>
              </a>
              
              {/* <a href="tel:+919876543210" className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#FF5211] transition-colors">
                <Phone className="w-4 h-4" />
                <span className="font-medium">+91 98765 43210</span>
              </a> */}
            </div>

            {/* Social Media */}
            <div className="flex gap-3">
              {[
                { Icon: Linkedin, href: "https://www.linkedin.com/company/fasterq", label: "linkedin" },
                { Icon: Instagram, href: "https://www.instagram.com/fasterq.in", label: "Instagram" },
                { Icon: Facebook, href: "https://www.facebook.com/fasterqin", label: "Facebook" },
              ].map(({ Icon, href, label }, index) => (
                <a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gradient-to-br hover:from-[#FF5211] hover:to-orange-600 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-orange-500/30"
                  aria-label={`Follow us on ${label}`}
                >
                  <Icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-6"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p className="text-gray-500 flex items-center gap-2 flex-wrap justify-center">
            <span>&copy; {currentYear} FasterQ</span>
            <span className="hidden md:inline">•</span>
            <span className="flex items-center gap-1">
              Built with <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" /> in Bengaluru
            </span>
          </p>
          
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <Link href="/privacy-policy" className="hover:text-[#FF5211] transition-colors">Privacy</Link>
            <Link href="/terms-and-conditions" className="hover:text-[#FF5211] transition-colors">Terms</Link>
            <Link href="/faq" className="hover:text-[#FF5211] transition-colors">FAQ</Link>
            <Link href="/data-security" className="hover:text-[#FF5211] transition-colors"> Data Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 