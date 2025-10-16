import { Sparkles, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import CtaButton from "../CtaButton";

export default function HeroSection() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:w-1/2 space-y-8">
              <div className="inline-flex items-center px-5 py-2.5 rounded-full bg-white text-sm md:text-base font-semibold animate-fade-in shadow-sm">
                <Sparkles className="w-5 h-5 mr-2 text-primary" />
                Smarter Tools for Modern Businesses
              </div>

              <h1 className="!text-4xl md:!text-5xl lg:!text-5xl !font-extrabold leading-tight animate-fade-in delay-100">
                Track Calls. Hire Faster.  
                <br />
                <span className="text-primary">Grow Without Limits.</span>
              </h1>

              <p className="text-lg text-gray-600 leading-relaxed animate-fade-in delay-200 max-w-lg">
                FasterQ is your all-in-one SaaS suite — from <strong>Missed Call Tracking</strong> to
                <strong> Job Management</strong> and <strong>CRM Tools</strong>.  
                Automate customer follow-ups, manage teams, and drive business growth — all from one dashboard.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 animate-fade-in delay-300">
                <CtaButton href="/products" text="Explore Products" />
                <CtaButton href="/missed-call-tracker" text="Try Missed Call Tracker" variant="outline" />
              </div>
            </div>

            {/* Right Content - Image */}
            <div className="lg:w-1/2 relative animate-fade-in-left">
              <div className="relative rounded-2xl group duration-500">
                <Image
                  src="/images/business-dashboard.webp" // transparent PNG you’ll generate
                  alt="Missed Call Tracker Dashboard"
                  width={600}
                  height={400}
                  className="object-contain w-full h-[300px] md:h-[400px] lg:h-[425px] transform group-hover:scale-105 transition-transform duration-500 rounded-2xl"
                  priority
                />
                <div className="absolute -bottom-[1px] left-0 right-0 h-28 md:h-36 bg-gradient-to-t from-orange-50 to-transparent pointer-events-none group-hover:scale-105 transition-transform duration-500"></div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
