import { Check, BarChart3, Users, Volume2 } from "lucide-react";

const features = [
  {
    title: "100% Accurate Call Tracking",
    description: "Automatically tracks all your phone calls.",
    bullets: [
      "Works with SIM card calls",
      "Keeps your current phone number",
      "Logs all incoming, outgoing and missed calls",
      "Precise call timings",
      "Real-time call logging",
    ],
    icon: Check,
  },
  {
    title: "Smart Performance Reports",
    description: "Get clear insights to improve your team's calling.",
    bullets: [
      "See call volume and patterns",
      "Track each team member's performance",
      "Create custom reports",
      "Syncs with your CRM automatically",
      "Get daily WhatsApp reports of team calls",
      "Real-time alerts to managers",
    ],
    icon: BarChart3,
  },
  {
    title: "Better Team Management",
    description: "Complete data to train your team and manage resources.",
    bullets: [
      "Track number of calls and time spent",
      "See team activity in real-time",
      "Use recordings for training",
      "Complete visibility of team performance",
      "Identify top performers",
    ],
    icon: Users,
  },
  {
    title: "Call Recording",
    description: "Record calls to improve your team's skills.",
    bullets: [
      "Clear recordings of both sides",
      "Safe and secure storage",
      "Instant coaching feedback",
      "Personalized training for team members",
      "Improve customer conversations",
    ],
    icon: Volume2,
  },
];

// SSR-first: animations applied by clients/RevealClient via data-* attributes

export default function Features() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-[#FFF5EC] via-orange-50/30 to-white relative overflow-hidden">
      {/* Soft background glows */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF5211] rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-1/3 w-80 h-80 bg-orange-400 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-3 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(#FF5211 1px, transparent 1px), linear-gradient(90deg, #FF5211 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Heading */}
        <div
          className="text-center mb-16"
          data-animate="fade-up"
          data-duration="0.7"
        >
          <span className="inline-block px-5 py-2 bg-white/80 backdrop-blur-sm text-[#FF5211] rounded-full text-sm font-bold mb-4 border border-[#FF5211]/20 shadow-sm">
            🚀 Everything You Need
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Powerful Features for <br />
            <span className="bg-gradient-to-r from-[#FF5211] via-orange-500 to-orange-600 bg-clip-text text-transparent">
              Explosive Growth
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Built for modern sales teams who demand more from their tools
          </p>
        </div>

        {/* Cards Grid */}
        <div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          data-stagger-parent
          data-stagger="0.08"
          data-stagger-duration="0.6"
          data-stagger-offset="32"
        >
          {features.map((feature, i) => (
            <div
              key={i}
              data-stagger-item
              className="group relative bg-white rounded-3xl p-6 shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#FF5211]/30 hover:-translate-y-3"
            >
              {i === 0 && (
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                  ⭐ Popular
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF5211]/0 to-orange-500/0 group-hover:from-[#FF5211]/10 group-hover:to-orange-500/5 rounded-3xl transition-all duration-500" />
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF5211]/20 to-orange-400/20 rounded-2xl blur-lg group-hover:blur-xl transition-all" />
                <div className="relative bg-gradient-to-br from-[#FF5211]/10 via-orange-100/50 to-orange-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300 shadow-sm">
                  <feature.icon className="h-8 w-8 text-[#FF5211] group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div className="relative">
                <h3 className="text-lg font-bold mb-3 text-center text-gray-900 group-hover:text-[#FF5211] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm mb-5 text-center leading-relaxed">
                  {feature.description}
                </p>
                <div className="relative h-px mb-5">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FF5211] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <ul className="space-y-2.5" data-stagger-parent data-stagger-from="x" data-stagger-offset="10" data-stagger-duration="0.35" data-stagger="0.04">
                  {feature.bullets.map((bullet, j) => (
                    <li
                      key={j}
                      data-stagger-item
                      className="flex items-start text-xs text-gray-700 group/item"
                    >
                      <div className="flex-shrink-0 w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-2 mt-0.5 group-hover/item:scale-125 transition-transform shadow-sm">
                        <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                      </div>
                      <span className="flex-1 leading-relaxed">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#FF5211] to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-b-3xl" />
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#FF5211]/10 to-transparent rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>

        {/* Bottom CTA pill */}
        <div
          className="mt-16 text-center"
          data-animate="fade-up"
          data-duration="0.6"
          data-delay="0.1"
        >
          <div className="inline-flex flex-col items-center gap-4 bg-white rounded-3xl px-10 py-8 shadow-xl border border-gray-100">
            <div className="flex items-center gap-2 text-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-gray-600 font-medium">
                All features included in every plan
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
