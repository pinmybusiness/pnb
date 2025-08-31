"use client";

import { Sparkles, ArrowRight, Users, Building2, CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="flex flex-col bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Hero Section */}
      <section className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Left Content */}
            <div className="lg:w-1/2 space-y-8">
              <div className="inline-flex items-center px-5 py-2.5 rounded-full bg-orange-100 text-orange-700 text-sm md:text-base font-semibold animate-fade-in">
                <Sparkles className="w-5 h-5 mr-2" />
                India’s #1 Restaurant Job Platform
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-5xl font-extrabold text-gray-900 leading-tight animate-fade-in delay-100">
                Find the Right <br/> <span className="text-orange-600">Restaurant Job</span> 
              </h1>

              <p className="text-lg  text-gray-600 leading-relaxed animate-fade-in delay-200 max-w-lg">
                Discover jobs for <span className="font-medium">chefs</span>, 
                <span className="font-medium"> waiters</span>, 
                <span className="font-medium"> managers</span> & more — all in one trusted platform for India’s hospitality industry.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 animate-fade-in delay-300">
                <Link href="/jobs">
                  <button className="px-8 py-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group">
                    <span>Find Jobs</span>
                    <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <Link href="/login">
                  <button className="px-8 py-4 border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 text-lg font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center">
                    <Building2 className="w-6 h-6 mr-2" />
                    Hire Staff
                  </button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-5 pt-4 animate-fade-in delay-400">
                 {[
                  { icon: <Users className="w-5 h-5 text-orange-600" />, text: "10,000+ Job Seekers" },
                  { icon: <Building2 className="w-5 h-5 text-green-600" />, text: "500+ Restaurants" },
                  { icon: <CheckCircle className="w-5 h-5 text-blue-600" />, text: "Fast & Easy Hiring" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {item.icon}
                    <span className="text-sm font-medium text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Image */}
            <div className="lg:w-1/2 relative animate-fade-in-left">
              <div className="relative rounded-2xl  group  duration-500">
                <Image
                  src="/images/restaurant-roles.png" // Replace with your local image path
                  alt="Restaurant Staff Jobs"
                  width={600}
                  height={400}
                  className="object-cover w-full h-[300px] md:h-[400px] lg:h-[425px] transform group-hover:scale-105 transition-transform duration-500"
                  priority
                />
                <div className="absolute -bottom-[1px] left-0 right-0 h-28 md:h-36 bg-gradient-to-t from-orange-50 to-transparent pointer-events-none group-hover:scale-118 transition-transform duration-500"></div>
              </div>
              
            </div>
          </div>
        </div>
      </section>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        .animate-fade-in.delay-100 { animation-delay: 0.1s; }
        .animate-fade-in.delay-200 { animation-delay: 0.2s; }
        .animate-fade-in.delay-300 { animation-delay: 0.3s; }
        .animate-fade-in.delay-400 { animation-delay: 0.4s; }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in-left { animation: fadeInLeft 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
}
