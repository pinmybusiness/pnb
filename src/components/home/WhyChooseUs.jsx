"use client";

import { ArrowRight } from "lucide-react";

export default function WhyChooseUs() {
  return (
    <section className="bg-gradient-to-b from-white to-orange-50/30 py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-16 text-left">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight animate-slide-in">
            Why We’re <span className="text-orange-600 relative">
              Your Top Pick
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-orange-600/50 rounded-full animate-scale-in" />
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-lg animate-slide-in" style={{ animationDelay: "0.2s" }}>
            The ultimate platform to land restaurant jobs or hire top talent, fast and hassle-free.
          </p>
        </div>

        {/* Features List */}
        <div className="space-y-8">
          {[
            {
              title: "Unrivaled Network",
              subtitle: "Connect with India’s Best",
              description: "Link up with 10,000+ job seekers and 500+ restaurants, with new openings daily.",
            },
            {
              title: "Perfect Fit Jobs",
              subtitle: "Tailored for You",
              description: "Discover chef, waiter, or manager roles that match your skills and goals effortlessly.",
            },
            {
              title: "Lightning-Fast Hiring",
              subtitle: "Hire with Ease",
              description: "Restaurants find top talent in no time with our smart, streamlined platform.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="group relative flex items-center gap-8 py-8 pl-6 pr-4 bg-white/80 rounded-lg shadow-sm hover:shadow-lg hover:bg-orange-50/70 transition-all duration-500 ease-out animate-slide-in"
              style={{ animationDelay: `${0.3 * (index + 1)}s` }}
            >
              <div className="absolute left-0 top-0 h-full w-2 bg-orange-600 group-hover:w-3 transition-all duration-500" />
              <div className="flex-1">
                <span className="text-sm font-semibold text-orange-600 uppercase tracking-wide">{item.subtitle}</span>
                <h3 className="text-2xl font-bold text-gray-900 mt-1 tracking-tight">{item.title}</h3>
                <p className="mt-2 text-base text-gray-600 leading-relaxed max-w-md">{item.description}</p>
              </div>
              <div className="flex-shrink-0 relative">
                <ArrowRight className="w-7 h-7 text-orange-600 group-hover:translate-x-3 transition-transform duration-500" />
                <div className="absolute inset-0 -z-10 bg-orange-200/20 rounded-full blur-xl group-hover:bg-orange-200/30 transition-all duration-500" />
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        {/* <div className="mt-16 flex items-center gap-6 animate-slide-in" style={{ animationDelay: "0.9s" }}>
          <a
            href="/jobs"
            className="inline-flex items-center px-8 py-3.5 bg-orange-600 text-white text-lg font-semibold rounded-lg hover:bg-orange-700 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Grab Your Job
            <ArrowRight className="w-5 h-5 ml-2" />
          </a>
          <a
            href="/login"
            className="inline-flex items-center px-8 py-3.5 border-2 border-orange-600 text-orange-600 text-lg font-semibold rounded-lg hover:bg-orange-50 hover:scale-105 transition-all duration-300"
          >
            Hire Top Talent
          </a>
        </div> */}
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
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