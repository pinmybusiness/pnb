import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="bg-gradient-to-b from-white via-orange-50/50 to-white py-28 px-4 relative overflow-hidden">
      {/* Soft orange glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#FF5211]/8 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10 text-center" data-animate="fade-up">

        {/* Eyebrow */}
        <p className="text-xs uppercase tracking-widest text-[#FF5211] font-semibold mb-5">
          Built for every team
        </p>

        {/* Heading */}
        <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
          Never miss a call.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5211] to-orange-400">
            Never miss a lead.
          </span>
        </h2>

        {/* Subtext */}
        <p className="text-gray-500 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
          Your team is already making calls. FasterQ makes sure none of them go untracked.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link
            href="/contact"
            className="bg-[#FF5211] hover:bg-orange-500 text-white px-8 py-4 rounded-xl font-bold text-base transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20"
          >
            Start for ₹99 / month
          </Link>
          <Link
            href="/contact"
            className="border-2 border-gray-300 hover:border-[#FF5211] text-gray-700 hover:text-[#FF5211] px-8 py-4 rounded-xl font-bold text-base transition-all duration-200 hover:scale-105"
          >
            Talk to our team
          </Link>
        </div>

        {/* Trust strip */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
          <span className="text-gray-400">✓ No credit card required</span>
          <span className="text-gray-400">✓ Cancel anytime</span>
          <span className="text-gray-400">✓ Setup in 2 minutes</span>
        </div>

      </div>
    </section>
  );
}
