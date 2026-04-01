export default function FeatureCard({ icon, title, description, bullets }) {
  return (
    <div className="group relative bg-white rounded-2xl p-6 shadow-[0_2px_24px_rgba(255,82,17,0.07)] border border-orange-100 hover:shadow-[0_8px_40px_rgba(255,82,17,0.15)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
      {/* Gradient corner accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-orange-50 to-transparent rounded-bl-full opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Icon */}
      <div className="relative inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF5211] to-[#FF8C5A] shadow-[0_4px_14px_rgba(255,82,17,0.35)] mb-4">
        <span className="text-white text-xl">{icon}</span>
      </div>

      <h3 className="text-gray-900 font-bold text-lg mb-2 leading-snug">{title}</h3>
      <p className="text-gray-500 text-sm mb-4 leading-relaxed">{description}</p>

      <ul className="space-y-2">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
            <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-orange-100 flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-[#FF5211]" fill="currentColor" viewBox="0 0 12 12">
                <path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </span>
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}