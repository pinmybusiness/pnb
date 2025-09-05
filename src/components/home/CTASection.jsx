"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import CtaButton from "../CtaButton";

export default function CTASection() {
  return (
    <section className="bg-white py-16 sm:py-24 relative overflow-hidden">
      {/* Background shape for visual interest */}      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-br from-orange-50 to-white rounded-3xl shadow-2xl px-6 md:px-10 pt-10 md:pt-0">
          <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 md:gap-16 lg:gap-24">
            {/* Left Side: Image */}
            <div className="md:w-1/2 flex justify-center animate-slide-in-left">
              <img
                src="/images/restaurant-staff-cta.webp" // You can replace this with a higher-quality or different image if needed
                alt="Restaurant staff smiling"
                className="w-full max-w-xs sm:max-w-sm md:max-w-md h-auto rounded-xl transform hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Right Side: Content */}
            <div className="md:w-1/2 text-center md:text-left animate-slide-in-right">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
                Grow Your{" "}
                <span className="text-orange-600 relative">
                  Restaurant Team
                  <span className="absolute -bottom-1 left-0 w-full h-1 bg-orange-600/70 rounded-full" />
                </span>
              </h2>
              <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-gray-700 max-w-xl mx-auto md:mx-0 leading-relaxed">
                Quickly find top chefs, waiters, and managers to strengthen your restaurant team.
              </p>

              {/* Solid CTA Button with Gradient */}
              <div className="mt-8 sm:mt-12 flex justify-center md:justify-start">
              <CtaButton href="/dashboard" text="Post Job" variant="outline" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}