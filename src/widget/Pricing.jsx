import { Check } from "lucide-react";
import CtaButton from "../components/CtaButton";

export default function PricingWidget({
  badge = "💰 Limited Time Offer",
  title = "Simple, Affordable Pricing",
  highlight = "Affordable",
  subtitle = "No hidden fees. Cancel anytime. Start saving today.",
  planName = "Pro Plan",
  price = "99",
  duration = "/month",
  note = "Valid only with yearly plan • Cancel anytime",
  features = [
    "Unlimited Call Tracking",
  "Real-Time Alerts",
  "Analytics Dashboard",
  "Team Call Reports on WhatsApp",
  "Web Dashboard",
  "Secure Storage & Support",
  ],
  ctaText = "Get Started for ₹99",
  ctaLink = "/contact",
  bottomNote = "No credit card required • Cancel anytime",
}) {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-white via-gray-50 to-orange-50/30 relative overflow-hidden">
      
      {/* Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF5211] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-orange-400 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">

        {/* Header */}
        <div className="mb-16">
          <span className="inline-block px-5 py-2 bg-white/80 text-[#FF5211] rounded-full text-sm font-bold mb-4 border border-[#FF5211]/20 shadow-sm">
            {badge}
          </span>

          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {title.split(highlight)[0]}
            <span className="bg-gradient-to-r from-[#FF5211] to-orange-600 bg-clip-text text-transparent">
              {highlight}
            </span>
            {title.split(highlight)[1]}
          </h2>

          <p className="text-gray-600 text-lg">{subtitle}</p>
        </div>

        {/* Card */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF5211] to-orange-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>

          <div className="relative bg-white border-2 border-gray-100 shadow-2xl rounded-3xl p-10 transition-all duration-500">

            {/* Plan */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF5211]/10 to-orange-100 px-6 py-2 rounded-full border border-[#FF5211]/20">
                <span className="text-gray-900 font-bold text-xl">{planName}</span>
              </div>
            </div>

            {/* Price */}
            <div className="mb-8">
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-gray-600 text-xl">₹</span>
                <span className="text-7xl font-extrabold bg-gradient-to-r from-[#FF5211] to-orange-600 bg-clip-text text-transparent">
                  {price}
                </span>
                <span className="text-gray-600 text-xl">{duration}</span>
              </div>
              <p className="text-gray-600 mt-3 font-medium">{note}</p>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-8"></div>

            {/* Features */}
            <div className="grid sm:grid-cols-2 gap-4 mb-10 text-left max-w-2xl mx-auto">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-gray-700 font-medium">{f}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="space-y-4">
              <CtaButton
                href={ctaLink}
                text={ctaText}
                className="w-full bg-gradient-to-r from-[#FF5211] to-orange-600 text-white hover:shadow-2xl hover:scale-105"
              />

              <p className="text-sm text-gray-500 text-center">
                {bottomNote}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}