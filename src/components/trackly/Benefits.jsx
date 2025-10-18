import { Check, Download, Phone, MessageSquare, Volume2, Shield, Globe } from "lucide-react";

const benefits = [
  {
    title: "No Extra Apps to Learn",
    description: "Dial from your phone's keypad. We handle logging in the background.",
    bullets: [
      "Works silently in the background", 
      "Tracks all SIM calls",
      "Daily performance reports",
      "No disruptions to daily workflow"
    ],
    icon: Download,
  },
  {
    title: "Use Your Current Number",
    description: "No VOIP or cloud telephony-use your existing number.",
    bullets: ["Higher pickup rates", "Builds customer trust", "Zero setup hassle"],
    icon: Phone,
  },
  {
    title: "SIM Calls in One Dashboard",
    description: "Unified call logs across channels with easy reporting.",
    bullets: [
      "Compare call type performance",
      "Identify conversion sources",
      "Manager-friendly reports",
      "All-in-one analytics"
    ],
    icon: MessageSquare,
  },
  {
    title: "Crystal Clear Calls",
    description: "Mobile network quality ensures no spam flags or lag.",
    bullets: ["No VOIP drops", "Professional call experience", "Better follow-up success"],
    icon: Volume2,
  },
  {
    title: "Skip Complex Tech",
    description: "Works on your team’s existing phones-no PBX needed.",
    bullets: ["Quick setup", "Cost-effective for teams", "Install and start"],
    icon: Shield,
  },
  {
    title: "Made in India Excellence",
    description: "Built by Indian innovators for Indian businesses – faster, compliant, and cost-effective.",
    bullets: ["Data stays within India’s borders", "24/7 IST support from local team", "Rupee-based pricing, no forex hassles"],
    icon: Globe,
  },
];

export default function Benefits() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-white via-gray-50 to-orange-50/20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#FF5211] rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-orange-400 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-white/80 backdrop-blur-sm text-[#FF5211] rounded-full text-sm font-semibold mb-4 border border-[#FF5211]/20 shadow-sm">
            ⚡ Zero Effort, Maximum Results
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Use Your Phone <span className="bg-gradient-to-r from-[#FF5211] to-orange-600 bg-clip-text text-transparent">Normally</span>
            <br />
            <span className="text-gray-700">We Handle the Rest</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Trackly logs calls in the background and syncs to your CRM. Works with SIM cards—no cloud phone needed.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, i) => (
            <div 
              key={i} 
              className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#FF5211]/30 hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF5211]/0 via-orange-500/0 to-transparent group-hover:from-[#FF5211]/5 group-hover:via-orange-500/5 rounded-3xl transition-all duration-500"></div>
              
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-[#FF5211]/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                <div className="relative bg-gradient-to-br from-[#FF5211]/10 to-orange-100/50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <benefit.icon className="h-10 w-10 text-[#FF5211]" />
                </div>
              </div>

              <div className="relative">
                <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-[#FF5211] transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {benefit.description}
                </p>
                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-6"></div>
                <ul className="space-y-3">
                  {benefit.bullets.map((bullet, j) => (
                    <li 
                      key={j} 
                      className="flex items-start text-sm text-gray-700 group/item hover:text-gray-900 transition-colors"
                    >
                      <div className="flex-shrink-0 w-5 h-5 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-3 mt-0.5 group-hover/item:scale-110 transition-transform">
                        <Check className="h-3 w-3 text-white" strokeWidth={3} />
                      </div>
                      <span className="flex-1">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF5211] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-3xl"></div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
  <div className="inline-flex items-center gap-4 bg-white rounded-full px-8 py-4 shadow-lg border border-gray-100">
    {/* Avatar Stack */}
    <div className="flex -space-x-2">
      {[
        "/images/trackly/avatars/user3.webp",
      "/images/trackly/avatars/user2.webp",
      "/images/trackly/avatars/user4.webp",
      ].map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`User ${i + 1}`}
          className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm"
        />
      ))}

      {/* Optional gradient fallback */}
      <div className="w-8 h-8 bg-gradient-to-br from-[#FF5211] to-orange-600 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-white text-xs font-bold">
        +
      </div>
    </div>

    {/* Text content */}
    <div className="text-left">
      <p className="text-sm font-semibold text-gray-900">Join 200+ sales teams</p>
      <p className="text-xs text-gray-500">Already tracking smarter with Trackly</p>
    </div>
  </div>
</div>

      </div>
    </section>
  );
}