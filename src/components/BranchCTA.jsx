import Image from "next/image";
import CtaButton from "@/components/CtaButton"; // Adjust path as needed

export default function BranchCTA() {
  return (
    <section className="bg-white py-16 sm:py-24 relative overflow-hidden">
      {/* Background shape for visual interest */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-br from-orange-50 to-white rounded-3xl shadow-2xl px-6 md:px-10 pt-10 md:pt-0">
          <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 md:gap-16 lg:gap-24">
            {/* Left Side: Image */}
            <div className="md:w-1/2 flex justify-center animate-slide-in-left">
              <Image
                src="/images/restaurant-owner-cta.webp" // Replace with your actual image path
                alt="Restaurant owner managing team"
                width={400}
                height={300}
                className="w-full max-w-xs sm:max-w-sm md:max-w-md h-auto rounded-xl transform hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Right Side: Content */}
            <div className="md:w-1/2 text-center md:text-left animate-slide-in-right">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
                Hire Top Talent for Your Restaurant
              </h2>
              <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-gray-700 max-w-xl mx-auto md:mx-0 leading-relaxed">
                Looking to build your dream team? Post job openings to find top chefs, waiters, and managers, or register as a new restaurant owner with FasterQ to get started. Need to update your profile? Contact our support team.
              </p>

              {/* CTA Buttons */}
              <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                <CtaButton href="/dashboard/post-job" text="Post New Job" />
                <CtaButton href="/register?role=owner" text="Register as Owner" variant="outline" />
                <CtaButton href="/contact" text="Contact Support" variant="outline" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}