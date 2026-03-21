import CtaButton from "../components/CtaButton";

export default function IndustriesWidget({
  badge = "🏢 Built for India",
  title = "Trusted Across Industries",
  highlight = "Industries",
  subtitle = "From real estate to restaurants — any business with a phone-based sales team wins with Fasterq.",
  industries = [],
  showCTA = true,
  ctaText = "Start for ₹99/month",
  ctaLink = "/contact",
}) {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-white via-gray-50 to-orange-50/20 relative overflow-hidden">

      {/* Background glow (premium feel) */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-72 h-72 bg-[#FF5211] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-orange-400 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-[1100px] mx-auto px-4 relative z-10">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-5 py-2 bg-white/80 text-[#FF5211] rounded-full text-sm font-bold mb-4 border border-[#FF5211]/20 shadow-sm">
            {badge}
          </span>

          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-3">
            {title.split(highlight)[0]}
            <span className="bg-gradient-to-r from-[#FF5211] to-orange-600 bg-clip-text text-transparent">
              {highlight}
            </span>
            {title.split(highlight)[1]}
          </h2>

          <p className="text-secondary max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Cards (simple layout + premium hover) */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {industries.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group flex items-start gap-4 border border-gray-100 rounded-2xl p-5 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:border-[#FF5211]/30"
              >
                <div className="text-[#FF5211] bg-[#FF5211]/10 p-3 rounded-xl group-hover:scale-110 transition">
                  <Icon className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="font-bold text-primary group-hover:text-[#FF5211] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        {showCTA && (
          <div className="text-center mt-10">
            <CtaButton
              href={ctaLink}
              text={ctaText}
              className="bg-gradient-to-r from-[#FF5211] to-orange-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-xl hover:scale-105"
            />
          </div>
        )}

      </div>
    </section>
  );
}