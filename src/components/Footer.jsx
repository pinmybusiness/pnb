// "use client";

import Image from "next/image";
import Link from "next/link";
import { Linkedin, Facebook, Instagram } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-gray-700 pb-12">
          {/* Logo + Tagline */}
          <div className="flex flex-col items-start space-y-4">
            <Image
              src="/logo-white.png" // Ensure you have this logo file
              alt="Job Portal Logo"
              width={180}
              height={64}
              className="object-contain"
            />
            <p className="text-sm text-gray-400 max-w-xs">
              Connecting Talent with Opportunities
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4 tracking-wide">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/jobs" className="text-gray-300 hover:text-orange-500 transition-colors duration-200 font-medium text-sm">
                  Find Jobs
                </Link>
              </li>
              {/* <li>
                <Link href="/employers" className="text-gray-300 hover:text-orange-500 transition-colors duration-200 font-medium text-sm">
                  For Employers
                </Link>
              </li> */}
              <li>
                <Link href="/about" className="text-gray-300 hover:text-orange-500 transition-colors duration-200 font-medium text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-orange-500 transition-colors duration-200 font-medium text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4 tracking-wide">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-orange-500 transition-colors duration-200 font-medium text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-orange-500 transition-colors duration-200 font-medium text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-orange-500 transition-colors duration-200 font-medium text-sm">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4 tracking-wide">Follow Us</h3>
            <div className="flex space-x-3">
              {[
                // { Icon: Linkedin, href: "#linkedin" },
                { Icon: Facebook, href: "https://www.facebook.com/fasterqin" },
                { Icon: Instagram, href: "https://www.instagram.com/fasterq.in" },
              ].map(({ Icon, href }, index) => (
                <a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-700 hover:bg-orange-600 transition-colors duration-300"
                  aria-label={`Follow us on ${Icon.name}`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 text-center text-sm text-gray-400">
        <p>&copy; {currentYear} FasterQ.in. All rights reserved.</p>
      </div>
    </footer>
  );
}