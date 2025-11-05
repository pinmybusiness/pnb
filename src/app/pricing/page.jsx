"use client";

import TestimonialsSection from "@/components/home/Testimonials";
import { Check, Crown, Zap, Users, Shield, Star, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const router = useRouter();

  const PlanCard = ({
    title,
    monthlyPrice,
    annualPrice,
    description,
    features,
    cta,
    popular = false,
    addOn = false,
  }) => {
    // ---- Pricing Logic ----
    let currentPrice;
    let promoDetails = null;

    if (billingCycle === "monthly") {
      if (typeof monthlyPrice === "object") {
        currentPrice = monthlyPrice.promoPrice;
        promoDetails = {
          promoPrice: monthlyPrice.promoPrice,
          regularPrice: monthlyPrice.regularPrice,
          duration: monthlyPrice.promoDuration,
        };
      } else {
        currentPrice = monthlyPrice;
      }
    } else {
      currentPrice = annualPrice;
    }

    const isCustom = typeof currentPrice === "string";
    const savings =
      billingCycle === "annual" && typeof monthlyPrice === "number"
        ? Math.round(((monthlyPrice * 12 - annualPrice) / (monthlyPrice * 12)) * 100)
        : 0;

    // ---- UI ----
    return (
      <div
        className={`relative bg-white rounded-3xl p-6 md:p-8 hover:shadow-2xl transition-all duration-500 border-2 ${
          popular
            ? "border-[#FF5211] shadow-xl scale-105"
            : "border-gray-100 shadow-lg hover:-translate-y-2"
        } group`}
      >
        {popular && (
          <div className="absolute -top-4 min-w-[150px] left-1/2 transform -translate-x-1/2 z-10">
            <div className="bg-gradient-to-r from-[#FF5211] to-orange-600 text-white text-xs font-bold px-5 py-2 rounded-full flex items-center gap-2 shadow-lg animate-pulse">
              <Crown className="w-4 h-4" />
              Most Popular
            </div>
          </div>
        )}

        {/* Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF5211]/0 to-orange-500/0 group-hover:from-[#FF5211]/5 group-hover:to-orange-500/5 rounded-3xl transition-all duration-500"></div>

        <div className="relative">
          {/* Header */}
          <div className="text-center mb-6">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">{title}</h3>

{/* Price */}
<div className="mb-4 text-center">
  {title === "Essential" ? (
    <>
      <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#FF5211] to-orange-600 bg-clip-text text-transparent">
        ₹99
        <span className="text-base text-gray-500 font-medium">/mo</span>
      </div>
      <div className="text-sm text-gray-500 mt-2 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full inline-block font-semibold">
        for first 4 months, then ₹299/mo (billed yearly)
      </div>
    </>
  ) : isCustom ? (
    <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#FF5211] to-orange-600 bg-clip-text text-transparent">
      {currentPrice}
    </div>
  ) : (
    <>
      <div className="flex items-baseline justify-center gap-1">
        <span className="text-gray-600 text-xl">₹</span>
        <span className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#FF5211] to-orange-600 bg-clip-text text-transparent">
          {currentPrice}
        </span>
      </div>
      <div className="text-sm text-gray-500 mt-2">
        per user / {billingCycle}
      </div>

      {/* Promo info */}
      {billingCycle === "monthly" && promoDetails && (
        <div className="text-xs text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full inline-block mt-3 font-semibold">
          ₹{promoDetails.promoPrice}/month for first {promoDetails.duration} months, then ₹{promoDetails.regularPrice}/month
        </div>
      )}
    </>
  )}
</div>


            <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-6"></div>

          {/* Features */}
          <ul className="space-y-3 mb-8">
            {features.map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-700 group/item">
                <div className="flex-shrink-0 w-5 h-5 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mt-0.5 group-hover/item:scale-110 transition-transform shadow-sm">
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
                <span className="flex-1">{feature}</span>
              </li>
            ))}
          </ul>

          {/* CTA Button → redirect to /contact */}
          <button
            onClick={() => router.push("/contact")}
            className={`w-full py-4 rounded-full font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2 ${
              popular
                ? "bg-gradient-to-r from-[#FF5211] to-orange-600 text-white"
                : "bg-gray-50 text-[#FF5211] border-2 border-[#FF5211]/20 hover:border-[#FF5211] hover:bg-[#FF5211] hover:text-white"
            }`}
          >
            {cta}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Accent */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF5211] to-transparent ${
            popular ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          } transition-opacity duration-500 rounded-b-3xl`}
        ></div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5EC] via-orange-50/40 to-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-[#FF5211]/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 -right-20 w-[500px] h-[500px] bg-orange-300/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-orange-200/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(#FF5211 1px, transparent 1px), linear-gradient(90deg, #FF5211 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block px-5 py-2 bg-white/80 backdrop-blur-sm text-[#FF5211] rounded-full text-sm font-bold mb-4 border border-[#FF5211]/20 shadow-sm">
            💰 Simple Pricing
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 md:mb-6 leading-tight">
            Choose the Plan That's
            <br />
            <span className="bg-gradient-to-r from-[#FF5211] to-orange-600 bg-clip-text text-transparent">
              Best for You
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Simple pricing for Android SIM call tracking with WhatsApp team reports. No setup fees, cancel anytime.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12 md:mb-16">
          <div className="bg-white p-1.5 rounded-full border-2 border-gray-200 shadow-lg inline-flex">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 md:px-8 py-3 md:py-4 rounded-full text-sm md:text-base font-bold transition-all ${
                billingCycle === "monthly"
                  ? "bg-gradient-to-r from-[#FF5211] to-orange-600 text-white shadow-lg scale-105"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-6 md:px-8 py-3 md:py-4 rounded-full text-sm md:text-base font-bold transition-all flex items-center gap-2 ${
                billingCycle === "annual"
                  ? "bg-gradient-to-r from-[#FF5211] to-orange-600 text-white shadow-lg scale-105"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Annual
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  billingCycle === "annual"
                    ? "bg-white/20 text-white"
                    : "bg-green-50 text-green-700 border border-green-200"
                }`}
              >
                Save 30%
              </span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-20">
          {/* Essential Plan with updated yearly display */}
          <PlanCard
            title="Essential"
            monthlyPrice={{ promoPrice: 99, regularPrice: 299, promoDuration: 4 }}
            annualPrice="₹99/mo for 4 months → ₹299/mo after"
            description="Track SIM calls to your analytics dashboard with WhatsApp reports."
            features={[
              "Auto-tracking for SIM calls",
              "Analytics dashboard with trends", 
              "Individual rep performance",
              "Daily WhatsApp reports for managers",
              "Unlimited call logging",
              "Android app only",
            ]}
            cta="Get Started"
            popular={true}
          />

          {/* <PlanCard
            title="Call Recording"
            monthlyPrice={148}
            annualPrice={105}
            description="Add crystal-clear call recordings to your Essential plan."
            features={[
              "Dual-side call recordings",
              "Secure, compliant storage",
              "Real-time coaching access",
              "Android device support",
              "Easy playback in dashboard",
            ]}
            cta="Add to Plan"
            addOn={true}
          /> */}

          <PlanCard
            title="CRM Integration"
            monthlyPrice={248}
            annualPrice={175}
            description="Seamlessly sync call data to your CRM."
            features={[
              "Integration with Zoho, HubSpot, LeadSquared",
              "Microsoft Dynamics & custom API",
              "Auto-log calls to CRM",
              "Real-time notifications",
              "Bi-directional sync",
            ]}
            cta="Add to Plan"
            addOn={true}
          />

          <PlanCard
            title="Enterprise"
            monthlyPrice="Custom"
            annualPrice="Custom"
            description="Custom solution for large teams (30+ users)."
            features={[
              "All Essential features",
              "Daily WhatsApp call reports",
              "Custom onboarding & training",
              "Dedicated support & SLA",
              "Advanced analytics & insights",
            ]}
            cta="Get a Quote"
          />
        </div>

        {/* Trust Section */}
        <div className="mb-16 md:mb-20">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
            <div className="grid md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-200">
              {[{ icon: Users, stat: "1,000+", label: "Active Teams" },
                { icon: Zap, stat: "98%", label: "Uptime SLA" },
                { icon: Shield, stat: "Bank-Level", label: "Security" },
                { icon: Star, stat: "4.9/5", label: "Customer Rating" },
              ].map((item, i) => (
                <div key={i} className="text-center pt-6 md:pt-0 first:pt-0">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#FF5211]/10 to-orange-100/50 rounded-xl mb-3">
                    <item.icon className="w-6 h-6 text-[#FF5211]" />
                  </div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-[#FF5211] to-orange-600 bg-clip-text text-transparent mb-1">
                    {item.stat}
                  </p>
                  <p className="text-sm text-gray-600 font-medium">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <TestimonialsSection />

        {/* FAQ */}
        <div className="max-w-4xl mx-auto mb-16 md:mb-20">
          <div className="text-center mb-12">
            <span className="inline-block px-5 py-2 bg-white/80 backdrop-blur-sm text-[#FF5211] rounded-full text-sm font-bold mb-4 border border-[#FF5211]/20 shadow-sm">
              ❓ Got Questions?
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-[#FF5211] to-orange-600 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
          </div>

          <div className="space-y-4">
            {[{
                q: "What happens after my Trackly free trial ends?",
                a: "Once your trial ends, access is limited but data is preserved. No auto-charges—upgrade anytime via dashboard.",
              },
              {
                q: "What pricing plans does Trackly offer?",
                a: "Essential plan includes core tracking. Add-ons for recording and CRM. Flexible, no hidden fees.",
              },
              {
                q: "Does Trackly offer discounts for annual or team subscriptions?",
                a: "Yes! 30% off annual billing. Volume discounts for 50+ users. Contact info@fasterq.in for quotes.",
              },
              {
                q: "Are there any hidden fees or extra costs with Trackly?",
                a: "No setup or storage fees. Pay only for chosen plan and add-ons. Fully transparent.",
              },
              {
                q: "How do I purchase Trackly licenses after the trial?",
                a: "From dashboard: Subscription > Purchase. Select plan, add features. One admin per org.",
              },
              {
                q: "How can I modify or cancel my Trackly subscription?",
                a: "Add licenses anytime. For reductions/cancellation, email info@fasterq.in. 30-day notice for monthly.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="group bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-[#FF5211]/30 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#FF5211]/10 to-orange-100/50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-[#FF5211] font-bold text-lg">Q</span>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-[#FF5211] transition-colors">
                      {faq.q}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>

                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg
                      className="w-5 h-5 text-[#FF5211]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-2xl p-8 border border-[#FF5211]/20">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-4">
              Our team is here to help you get started
            </p>
            <a
              onClick={() => router.push("/contact")}
              className="inline-flex cursor-pointer items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#FF5211] to-orange-600 text-white font-bold hover:shadow-xl transition-all"
            >
              Contact Support
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
