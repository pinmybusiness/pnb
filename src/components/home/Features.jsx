import { Check, Phone, Mic, RefreshCw, MessageSquare, Users, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Phone,
    title: "SIM Call Tracking",
    description: "Automatically log every inbound, outbound, and missed call - directly from your team's SIM.",
    bullets: [
      "Works on existing SIM & phone number",
      "Tracks inbound, outbound & missed calls",
      "No VoIP or number change needed",
      "Real-time call logging",
    ],
  },
  {
    icon: Mic,
    title: "Call Recording",
    description: "Record both sides of every business call. Review, coach, and improve your team's conversations.",
    bullets: [
      "Records both caller & agent audio",
      "Secure cloud storage",
      "Instant playback from dashboard",
      "Use recordings for team training",
    ],
  },
  {
    icon: RefreshCw,
    title: "CRM Integration",
    description: "Auto-sync every call log to your CRM - no manual entry, no missed leads.",
    bullets: [
      "Supports LeadSquared, HubSpot, Zoho & Salesforce",
      "Calls synced automatically after every call",
      "Recording URL pushed to CRM",
      "Failed syncs retried automatically",
    ],
  },
  {
    icon: MessageSquare,
    title: "WhatsApp Call Reports",
    description: "Get your team's daily call summary delivered straight to WhatsApp - no dashboard login needed.",
    bullets: [
      "Daily summary for every manager",
      "Agent-wise call count & duration",
      "Missed call highlights",
      "Works on any Android phone",
    ],
  },
  {
    icon: Users,
    title: "Team Performance",
    description: "See exactly how each agent is performing - calls made, time spent, and activity patterns.",
    bullets: [
      "Per-agent call count & duration",
      "Compare team members side by side",
      "Identify top performers instantly",
      "Real-time activity visibility",
    ],
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "A clean web dashboard with everything your managers need - call trends, agent stats, and more.",
    bullets: [
      "Hourly & daily call distribution",
      "Call answered vs missed breakdown",
      "Export reports to Excel",
      "Access from any browser",
    ],
  },
];

export default function Features() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white via-gray-50 to-white relative">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-14" data-animate="fade-up">
          <span className="inline-block px-4 py-1.5 bg-orange-50 text-[#FF5211] rounded-full text-sm font-semibold mb-4 border border-orange-100">
            Everything in one plan
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Every feature your team needs
            <br />
            <span className="bg-gradient-to-r from-[#FF5211] via-orange-500 to-orange-600 bg-clip-text text-transparent">
              to track calls better
            </span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            From SIM call tracking to CRM sync - everything works out of the box, no complex setup.
          </p>
        </div>

        {/* Cards Grid */}
        <div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          data-stagger-parent
          data-stagger="0.08"
          data-stagger-duration="0.6"
          data-stagger-offset="28"
        >
          {features.map((feature, i) => (
            <div
              key={i}
              data-stagger-item
              className="group bg-white border border-gray-100 hover:border-[#FF5211]/30 rounded-2xl p-7 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icon */}
              <div className="w-12 h-12 bg-orange-50 group-hover:bg-[#FF5211] rounded-xl flex items-center justify-center mb-5 transition-colors duration-300">
                <feature.icon className="w-6 h-6 text-[#FF5211] group-hover:text-white transition-colors duration-300" />
              </div>

              {/* Title + Description */}
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#FF5211] transition-colors duration-200">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-5">
                {feature.description}
              </p>

              {/* Divider */}
              <div className="h-px bg-gray-100 mb-5" />

              {/* Bullets */}
              <ul className="space-y-2.5">
                {feature.bullets.map((bullet, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <div className="w-4 h-4 bg-green-50 border border-green-200 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 text-green-600" strokeWidth={3} />
                    </div>
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="mt-12 text-center" data-animate="fade-up" data-delay="0.2">
          <p className="text-sm text-gray-400 flex items-center justify-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            All features included in every plan - no add-ons, no hidden charges
          </p>
        </div>

      </div>
    </section>
  );
}
