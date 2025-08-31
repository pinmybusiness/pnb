"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CTASection() {
  return (
    <section
      className="bg-gradient-to-b from-orange-100 to-orange-200/30 py-24 relative overflow-hidden"
    //   style={{
    //     backgroundImage: "url('/images/food-pattern.png')",
    //     backgroundSize: "cover",
    //     backgroundPosition: "center",
    //     backgroundBlendMode: "soft-light",
    //   }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-white/50 backdrop-blur-sm pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Content */}
        <div className="text-center">
          <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight animate-slide-in">
            Launch Your <span className="text-orange-600 relative">
              Restaurant Career
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-orange-600/70 rounded-full animate-scale-in" />
            </span>
          </h2>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-slide-in" style={{ animationDelay: "0.2s" }}>
            Find your dream role as a chef, waiter, or manager, or hire top talent for your restaurant today with India’s leading job platform.
          </p>

          {/* CTA Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-8 animate-slide-in" style={{ animationDelay: "0.4s" }}>
            <Link
              href="/jobs"
              className="inline-flex items-center px-10 py-4 bg-orange-600 text-white text-xl font-semibold rounded-lg hover:bg-orange-700 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Find Jobs Now
              <ArrowRight className="w-6 h-6 ml-3" />
            </Link>
            <Link
              href="/employers"
              className="inline-flex items-center px-10 py-4 border-2 border-orange-600 text-orange-600 text-xl font-semibold rounded-lg hover:bg-orange-100 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Hire Talent Now
            </Link>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { width: 0; }
          to { width: 100%; }
        }
        .animate-slide-in {
          animation: slideIn 0.8s ease-out forwards;
        }
        .animate-scale-in {
          animation: scaleIn 0.8s ease-out forwards;
        }
      `}</style>
    </section>
  );
}