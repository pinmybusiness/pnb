import { Check } from "lucide-react";
import Link from "next/link";

const features = [
  "Unlimited Call Tracking",
  "Call Recording",
  "WhatsApp Daily Reports",
  "Analytics Dashboard",
  "Team Performance Reports",
  "Secure Cloud Storage",
  "Dedicated Support",
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 px-4 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="max-w-4xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-14" data-animate="fade-up">
          <span className="inline-block px-4 py-1.5 bg-white text-[#FF5211] rounded-full text-sm font-semibold mb-4 border border-orange-100">
            Pricing
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Simple pricing
          </h2>
          <p className="text-gray-500 text-lg">
            Simple, transparent pricing. No hidden fees.
          </p>
        </div>

        {/* Card */}
        <div
          data-animate="fade-up"
          data-delay="0.1"
          className="bg-white rounded-3xl overflow-hidden grid md:grid-cols-2"
          style={{
            boxShadow: "0 0 0 1px rgba(0,0,0,0.06), 0 24px 48px -8px rgba(0,0,0,0.10)",
          }}
        >
          {/* Left — Price + CTA */}
          <div className="px-10 py-12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-100">
            <div>
              <span className="inline-block text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">
                Pro Plan
              </span>

              {/* Price */}
              <div className="flex items-start gap-0.5 mb-1">
                <span className="text-xl font-bold text-gray-400 mt-3">₹</span>
                <span className="text-8xl font-extrabold text-gray-900 leading-none tracking-tight">99</span>
              </div>
              <p className="text-gray-400 text-sm mb-10">
                per agent / month · billed annually
              </p>

              {/* Trust points */}
              <div className="space-y-3">
                {[
                  "No credit card required",
                  "Setup in minutes",
                  "Money-back guarantee",
                ].map((item) => (
                  <p key={item} className="flex items-center gap-2.5 text-sm text-gray-500">
                    <span className="w-4 h-4 rounded-full bg-green-50 border border-green-200 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-green-600" strokeWidth={3} />
                    </span>
                    {item}
                  </p>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-12">
              <Link
                href="/contact"
                className="block w-full text-center font-semibold py-3.5 rounded-xl text-white bg-[#FF5211] hover:bg-orange-500 transition-colors duration-150"
              >
                Get Started
              </Link>
              <p className="text-center text-xs text-gray-400 mt-3">
                Talk to us · we'll set everything up
              </p>
            </div>
          </div>

          {/* Right — Features */}
          <div className="px-10 py-12 bg-gray-50/60">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-7">
              Everything included
            </p>
            <ul className="space-y-4">
              {features.map((f, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-orange-50 border border-orange-200">
                    <Check className="w-2.5 h-2.5 text-[#FF5211]" strokeWidth={3} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{f}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom trust */}
        <p className="text-center text-sm text-gray-400 mt-6" data-animate="fade-up" data-delay="0.2">
          Secure payment · Used by 500+ business teams across India
        </p>

      </div>
    </section>
  );
}
