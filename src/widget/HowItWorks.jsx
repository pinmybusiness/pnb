import CtaButton from "../components/CtaButton";

export default function HowItWorksWidget({
  badge = "Setup in Minutes",
  title = "4 Simple Steps to Full Visibility",
  subtitle = "No IT team. No complex configuration. Just a 10-minute setup and you're live.",
  steps = [],
  showCTA = true,
  ctaText = "Get Started in 2 Minutes",
  ctaLink = "/contact",
}) {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-gray-50 to-orange-50/30 px-4 relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#FF5211] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[#FF5211] rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-[1100px] mx-auto relative z-10">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-xs font-bold tracking-wider text-[#F79533] uppercase mb-2">
            {badge}
          </div>

          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-3">
            {title}
          </h2>

          <p className="text-secondary max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* line (desktop only) */}
          <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#FF5211]/20 to-transparent"></div>

          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, idx) => {
              const Icon = step.icon;

              return (
                <div
                  key={idx}
                  className="relative group bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]"
                >
                  {/* Number */}
                  {/* <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#F79533] text-white font-bold shadow-lg group-hover:scale-110 transition">
                    {step.num || String(idx + 1).padStart(2, "0")}
                  </div> */}

                  {/* Icon (optional) */}
                  {Icon && (
                    <div className="mb-4 flex justify-center">
                      <div className="bg-[#FF5211]/10 p-3 rounded-xl">
                        <Icon className="w-6 h-6 text-[#FF5211]" />
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <h3 className="font-bold text-primary mb-2 group-hover:text-[#FF5211] transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-xs text-muted">
                    {step.desc}
                  </p>

                  {/* Bottom line animation */}
                  <div className="mt-4 h-1 w-8 mx-auto bg-gradient-to-r from-[#FF5211] to-orange-400 rounded-full group-hover:w-full transition-all duration-300"></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        {showCTA && (
          <div className="text-center mt-12">
            <CtaButton
              href={ctaLink}
              text={ctaText}
              className="bg-[#FF5211] text-white hover:bg-orange-600 hover:shadow-xl hover:scale-105"
            />
          </div>
        )}
      </div>
    </section>
  );
}