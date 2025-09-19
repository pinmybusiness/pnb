import { Sparkles, ArrowRight, Users, Building2, CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import CtaButton from "../CtaButton";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Left Content */}
            <div className="lg:w-1/2 space-y-8">
              <div className="inline-flex items-center px-5 py-2.5 rounded-full bg-white text-sm md:text-base font-semibold animate-fade-in">
                <Sparkles className="w-5 h-5 mr-2" />
                India’s Leading Restaurant Job Platform
              </div>

              <h1 className="!text-4xl md:!text-5xl lg:!text-5xl !font-extrabold  leading-tight animate-fade-in delay-100">
               Restaurant Jobs & Hiring<br/> <span className="text-primary">Made Faster</span> 
              </h1>

              <p className="text-lg  text-gray-600 leading-relaxed animate-fade-in delay-200 max-w-lg">
                Find verified restaurant jobs across India for chefs, waiters, managers, baristas, and more. Apply easily and grow your hospitality career with FasterQ.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 animate-fade-in delay-300">
                 <CtaButton href="/jobs" text="Find Jobs" />
                 <CtaButton href="/dashboard" text="Hire Staff" variant="outline"/>
              </div>
            </div>

            {/* Right Content - Image */}
            <div className="lg:w-1/2 relative animate-fade-in-left">
              <div className="relative rounded-2xl  group  duration-500">
                <Image
                  src="/images/restaurant-roles.webp" 
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
      {/* <style jsx>{`
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
      `}</style> */}
    </div>
  );
}
