import { Check } from "lucide-react";
import CtaButton from "./CtaButton";

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 px-4 bg-gradient-to-br from-white via-gray-50 to-orange-50/30 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF5211] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-orange-400 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="mb-16">
          <span className="inline-block px-5 py-2 bg-white/80 backdrop-blur-sm text-[#FF5211] rounded-full text-sm font-bold mb-4 border border-[#FF5211]/20 shadow-sm">
            💰 Limited Time Offer
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, <span className="bg-gradient-to-r from-[#FF5211] to-orange-600 bg-clip-text text-transparent">Affordable</span> Pricing
          </h2>
          <p className="text-gray-600 text-lg">No hidden fees. Cancel anytime. Start saving today.</p>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF5211] to-orange-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <div className="relative bg-white border-2 border-gray-100 shadow-2xl rounded-3xl p-10 hover:shadow-3xl transition-all duration-500">
            <div className="absolute -top-5 min-w-[300px] left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-[#FF5211] to-orange-600 text-white px-6 py-3 rounded-full text-sm font-bold shadow-xl flex items-center gap-2 animate-bounce">
                <span>🔥</span>
                <span>Special Offer: ₹99/month for 4 months</span>
                <span>🔥</span>
              </div>
            </div>
            <div className="mt-6 mb-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF5211]/10 to-orange-100/50 px-6 py-2 rounded-full border border-[#FF5211]/20">
                <svg className="w-5 h-5 text-[#FF5211]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <span className="text-gray-900 font-bold text-xl">Pro Plan</span>
              </div>
            </div>
            <div className="mb-8">
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-2xl text-gray-400 line-through font-semibold">₹299</span>
                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                  Save 67%
                </div>
              </div>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-gray-600 text-xl">₹</span>
                <span className="text-7xl font-extrabold bg-gradient-to-r from-[#FF5211] to-orange-600 bg-clip-text text-transparent">99</span>
                <span className="text-gray-600 text-xl">/month</span>
              </div>
              <p className="text-gray-600 mt-3 font-medium">
                For first 4 months, then ₹299/month • Cancel anytime
              </p>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-8"></div>
            <div className="grid sm:grid-cols-2 gap-4 mb-10 text-left max-w-2xl mx-auto">
             {[
                  "Unlimited Call Tracking",
                  "Real-Time Alerts",
                  "Analytics Dashboard",
                  "Team Call Reports on WhatsApp",
                  "Web Dashboard",
                  // "Call Recording",
                  "Secure Storage & Support"
                  // "Multi-Channel Support",
                ].map((p, i) => (
                  <div 
                    key={i} 
                    className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 hover:bg-orange-50 transition-colors group/item"
                  >
                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-sm group-hover/item:scale-110 transition-transform">
                      <Check className="h-4 w-4 text-white" strokeWidth={3} />
                    </div>
                    <span className="text-gray-700 font-medium">{p}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <CtaButton
                  href="/contact"
                  text="Get Started for ₹99"
                  className="w-full bg-gradient-to-r from-[#FF5211] to-orange-600 text-white hover:shadow-2xl hover:scale-105"
                />
                <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>No credit card required • Cancel anytime</span>
                </p>
              </div>
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                    </svg>
                    <span className="font-medium">Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span className="font-medium">Money-back Guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex items-center justify-center gap-2 text-gray-600">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5211] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF5211]"></span>
            </span>
            <span className="font-medium">Limited spots available at this price</span>
          </div>
        </div>
      </section>
    );
}