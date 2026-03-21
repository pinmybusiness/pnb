export default function FeaturesWidget({
  badge = "Core Features",
  title = "Everything Your Sales Team Needs",
  subtitle = "Powerful features built for Indian sales teams — simple to set up, powerful to use.",
  features = [],
}) {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-white via-gray-50 to-orange-50/20 relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-[#FF5211] rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-orange-400 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-[1100px] mx-auto relative z-10">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block px-5 py-2 bg-white/80 text-[#FF5211] rounded-full text-sm font-bold mb-4 border border-[#FF5211]/20 shadow-sm">
            {badge}
          </span>

          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-3">
            {title}
          </h2>

          <p className="text-secondary max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, idx) => {
            const Icon = f.icon;

            return (
              <div
                key={idx}
                className="group relative bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_25px_50px_rgba(0,0,0,0.1)] hover:border-[#FF5211]/30"
              >
                {/* Glow overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF5211]/0 to-orange-500/0 group-hover:from-[#FF5211]/10 group-hover:to-orange-500/5 rounded-2xl transition-all duration-300"></div>

                {/* Icon */}
                <div className="relative mb-5">
                  <div className="absolute inset-0 bg-[#FF5211]/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition"></div>

                  <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF5211]/10 text-[#FF5211] group-hover:scale-110 transition">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-primary mb-2 group-hover:text-[#FF5211] transition-colors">
                  {f.title}
                </h3>

                {/* Desc */}
                <p className="text-sm text-muted leading-relaxed">
                  {f.desc}
                </p>

                {/* Bottom line animation */}
                <div className="mt-5 h-1 w-10 bg-gradient-to-r from-[#FF5211] to-orange-400 rounded-full group-hover:w-full transition-all duration-300"></div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}