"use client";

import { ArrowRight, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="bg-gradient-to-t from-orange-100 to-orange-50 py-16 relative overflow-hidden"
    //   style={{
    //     backgroundImage: "url('/images/food-pattern.png')",
    //     backgroundSize: "cover",
    //     backgroundPosition: "center",
    //     backgroundBlendMode: "overlay",
    //   }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-md pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="animate-slide-in" style={{ animationDelay: "0.2s" }}>
            <h3 className="text-2xl font-bold text-gray-900">RestoJobs</h3>
            <p className="mt-4 text-gray-600 text-sm leading-relaxed">
              India’s #1 platform for restaurant jobs, connecting chefs, waiters, managers, and restaurant owners.
            </p>
            <div className="mt-6 flex gap-4">
              {[
                { icon: <Facebook className="h-5 w-5 text-gray-600 hover:text-orange-600 transition-colors" />, href: "#" },
                { icon: <Twitter className="h-5 w-5 text-gray-600 hover:text-orange-600 transition-colors" />, href: "#" },
                { icon: <Instagram className="h-5 w-5 text-gray-600 hover:text-orange-600 transition-colors" />, href: "#" },
                { icon: <Linkedin className="h-5 w-5 text-gray-600 hover:text-orange-600 transition-colors" />, href: "#" },
              ].map((social, index) => (
                <Link key={index} href={social.href} className="focus:outline-none">
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Job Seekers Links */}
          <div className="animate-slide-in" style={{ animationDelay: "0.4s" }}>
            <h4 className="text-lg font-semibold text-gray-900">For Job Seekers</h4>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/jobs" className="hover:text-orange-600 transition-colors">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link href="/jobs/chef" className="hover:text-orange-600 transition-colors">
                  Chef Jobs
                </Link>
              </li>
              <li>
                <Link href="/jobs/waiter" className="hover:text-orange-600 transition-colors">
                  Waiter Jobs
                </Link>
              </li>
              <li>
                <Link href="/jobs/manager" className="hover:text-orange-600 transition-colors">
                  Manager Jobs
                </Link>
              </li>
            </ul>
          </div>

          {/* Employers Links */}
          <div className="animate-slide-in" style={{ animationDelay: "0.6s" }}>
            <h4 className="text-lg font-semibold text-gray-900">For Employers</h4>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/employers" className="hover:text-orange-600 transition-colors">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link href="/employers/hire" className="hover:text-orange-600 transition-colors">
                  Hire Talent
                </Link>
              </li>
              <li>
                <Link href="/employers/pricing" className="hover:text-orange-600 transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="animate-slide-in" style={{ animationDelay: "0.8s" }}>
            <h4 className="text-lg font-semibold text-gray-900">Get in Touch</h4>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li>Email: <a href="mailto:support@RestoJobs.in" className="hover:text-orange-600 transition-colors">support@RestoJobs.in</a></li>
              <li>Phone: <a href="tel:+919876543210" className="hover:text-orange-600 transition-colors">+91 98765 43210</a></li>
              <li>Address: 123 Food Street, Mumbai, Maharashtra</li>
            </ul>
            <Link
              href="/contact"
              className="mt-4 inline-flex items-center text-orange-600 text-sm font-semibold hover:underline"
            >
              Contact Us
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center animate-slide-in" style={{ animationDelay: "1s" }}>
          <p className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} RestoJobs. All rights reserved.
          </p>
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-in {
          animation: slideIn 0.8s ease-out forwards;
        }
      `}</style>
    </footer>
  );
}