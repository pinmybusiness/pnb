import CtaButton from "@/components/CtaButton";
import { XCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ProblemSolutionWidget({
  title = "Stop Guessing. Start Knowing.",
  subtitle = "Most Indian sales teams still manage calls through Excel and WhatsApp chats. There's a smarter way.",
  problems = [],
  solutions = [],
  ctaText = "Start Tracking Calls Now",
  ctaLink = "/contact",
}) {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-white via-gray-50 to-orange-50/20 relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/3 w-80 h-80 bg-red-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-green-300 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-[1100px] mx-auto relative z-10">

        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-3">
            {title}
          </h2>
          <p className="text-secondary max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8 relative">

          {/* Divider line (desktop) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>

          {/* OLD WAY */}
          <div className="group bg-red-50/40 border border-red-200 rounded-3xl p-6 md:p-8 transition-all hover:-translate-y-2 hover:shadow-lg">
            <h3 className="text-xl font-bold text-red-700 mb-6 flex items-center gap-2">
              😩 The Old Way
            </h3>

            <div className="space-y-3">
              {problems.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 text-red-800 border-b border-red-200/60 pb-2"
                >
                  <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* NEW WAY */}
          <div className="group bg-green-50/40 border border-green-200 rounded-3xl p-6 md:p-8 transition-all hover:-translate-y-2 hover:shadow-xl relative">

            {/* Highlight glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-100/0 to-green-200/20 rounded-3xl opacity-0 group-hover:opacity-100 transition"></div>

            <h3 className="text-xl font-bold text-green-700 mb-6 flex items-center gap-2">
              ✨ The Fasterq Way
            </h3>

            <div className="space-y-3">
              {solutions.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 text-green-800 border-b border-green-200/60 pb-2"
                >
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>

            {/* Badge */}
            <div className="mt-6 inline-block px-4 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
              🚀 Recommended Choice
            </div>
          </div>
        </div>

        {/* CTA */}
        
        <div className="text-center mt-12">
           <CtaButton
              href={ctaLink}
              text={ctaText}
              className="bg-gradient-to-r from-[#FF5211] to-orange-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-xl hover:scale-105"
            />
        </div>

      </div>
    </section>
  );
}