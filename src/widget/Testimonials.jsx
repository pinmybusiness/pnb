import { Star, Quote } from "lucide-react";

export default function TestimonialsWidget({
  badge = "❤️ Loved by Sales Teams",
  title = "Trusted by India's Best",
  subtitle = "See why fast-growing companies choose us",
  highlight = "India's Best",
  testimonials = [],
  variant = "premium", // premium | simple
}) {
  return (
    <section className="py-24 px-6 bg-gradient-to-br from-[#FFF5EC] via-white to-orange-50/30 relative overflow-hidden">
      
      {/* Background */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#FF5211]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-gradient-to-r from-[#FF5211]/10 to-orange-100 text-[#FF5211] rounded-full text-sm font-semibold mb-4 border border-[#FF5211]/20">
            {badge}
          </span>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {title.split(highlight)[0]}
            <span className="bg-gradient-to-r from-[#FF5211] to-orange-600 bg-clip-text text-transparent">
              {highlight}
            </span>
            {title.split(highlight)[1]}
          </h2>

          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Cards */}
        <div className={`grid md:grid-cols-3 gap-8`}>
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`group bg-white p-6 md:p-8 rounded-2xl shadow-lg transition-all duration-500 border border-gray-100 hover:-translate-y-2 ${
                variant === "premium" ? "hover:shadow-2xl" : ""
              }`}
            >
              {/* Quote icon (only premium) */}
              {variant === "premium" && (
                <div className="absolute top-6 right-6 text-[#FF5211]/10">
                  <Quote size={40} fill="currentColor" />
                </div>
              )}

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(t.rating || 5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-700 text-sm md:text-base italic mb-6">
                "{t.quote}"
              </p>

              {/* User */}
              <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-100">
                
                {/* Image OR Initial */}
                {t.image ? (
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#FF5211] text-white flex items-center justify-center font-bold">
                    {t.initial || t.name?.[0]}
                  </div>
                )}

                <div>
                  <div className="font-bold text-sm text-gray-900">
                    {t.name || t.author}
                  </div>
                  <div className="text-xs text-gray-500">
                    {t.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}