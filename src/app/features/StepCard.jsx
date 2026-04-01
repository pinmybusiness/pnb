export default function StepCard({ step, icon, title, description, isLast }) {
  return (
    <div className="relative flex flex-col items-center text-center">
      {/* Connecting line */}
      {!isLast && (
        <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] right-[calc(-50%+2rem)] h-px bg-gradient-to-r from-[#FF5211]/40 via-orange-200 to-[#FF5211]/40 z-0" />
      )}

      {/* Step bubble */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF5211] to-[#FF8C5A] shadow-[0_6px_24px_rgba(255,82,17,0.35)] flex items-center justify-center text-white text-2xl mb-3">
          {icon}
        </div>
        <span className="text-xs font-bold text-[#FF5211] tracking-widest uppercase mb-2">
          Step {step}
        </span>
        <h4 className="text-gray-900 font-bold text-base mb-1">{title}</h4>
        <p className="text-gray-500 text-sm max-w-[180px] leading-relaxed">{description}</p>
      </div>
    </div>
  );
}