export default function TrustBarWidget({
  stats = [],
  showBadge = true,
  badgeText = "🚀 Trusted by Growing Teams Across India",
}) {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-white via-gray-50 to-orange-50/20 relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/3 w-64 h-64 bg-[#FF5211] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-orange-400 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-[1100px] mx-auto relative z-10">

        {/* Badge */}
        {showBadge && (
          <div className="text-center mb-10">
            <span className="inline-block px-5 py-2 bg-white/80 text-[#FF5211] rounded-full text-sm font-bold border border-[#FF5211]/20 shadow-sm">
              {badgeText}
            </span>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="group relative bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-2"
            >
              {/* Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF5211]/0 to-orange-500/0 group-hover:from-[#FF5211]/10 group-hover:to-orange-500/5 rounded-2xl transition"></div>

              {/* Value */}
              <div className="relative text-3xl md:text-4xl font-bold text-[#FF5211] group-hover:scale-110 transition-transform">
                {stat.value}
              </div>

              {/* Label */}
              <div className="relative text-sm text-gray-600 mt-2 font-medium">
                {stat.label}
              </div>

              {/* Bottom line */}
              <div className="mt-4 h-1 w-8 mx-auto bg-gradient-to-r from-[#FF5211] to-orange-400 rounded-full group-hover:w-full transition-all duration-300"></div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}