// No "use client" here → this page is fully SSR rendered

import RoiCalculatorClient from "./RoiCalculatorClient";

export const metadata = {
  title: "Call Tracker ROI Calculator – FasterQ",
  description:
    "Calculate how much revenue you can recover with FasterQ using our advanced ROI calculator.",
};

export default function CallTrackerRoiPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50/30 -mt-5 py-16 px-4 sm:px-6 lg:px-8">
      <div className="md:max-w-7xl mx-auto">

        {/* -------- HERO SECTION -------- */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-bold rounded-full mb-6 shadow-lg shadow-orange-500/30">
            ROI Calculator
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Calculate Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5211] to-orange-600">
              Revenue Recovery
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            See exactly how much money you're losing to missed calls - and how FasterQ can help you recover it
          </p>
        </div>

        {/* 🔥 FULL CLIENT CALCULATOR UI (SSR + Client logic mixed) */}
        <RoiCalculatorClient />

        {/* -------- CTA SECTION -------- */}
        <div className="mt-16 bg-gradient-to-br from-white to-orange-50 rounded-3xl border-2 border-orange-100 p-8 md:p-12 text-center shadow-xl">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to Recover Your Lost Revenue?
            </h2>

            <p className="text-lg text-gray-600 mb-8">
              Join hundreds of businesses already maximizing their call conversion with FasterQ
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-[#FF5211] to-orange-600 rounded-xl shadow-lg hover:scale-105 transition-all"
              >
                Start Free Trial →
              </a>

              <a
                href="/call-tracker"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-gray-700 bg-white border-2 border-orange-200 rounded-xl hover:shadow-lg transition-all"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 max-w-4xl mx-auto">
            *This calculator provides estimates for illustration purposes only. Actual results may vary based on your industry, team performance, call quality, and other business-specific factors. Individual outcomes depend on various factors unique to your business operations.
          </p>
        </div>
      </div>
    </main>
  );
}
