import { PhoneCall, Briefcase, Globe2 } from "lucide-react";

export default function QuickStats() {
  const stats = [
    {
      icon: <PhoneCall className="w-6 h-6 text-orange-500" />,
      label: "Instant Missed Call Alerts",
    },
    {
      icon: <Briefcase className="w-6 h-6 text-emerald-600" />,
      label: "Smart Job & CRM Automation",
    },
    {
      icon: <Globe2 className="w-6 h-6 text-blue-600" />,
      label: "Built for Indian Businesses",
    },
  ];

  return (
    <section className="bg-white py-6 md:py-8 border-t border-gray-100">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-6 sm:gap-12 px-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 text-gray-800 hover:text-primary transition-colors"
          >
            <div className="flex items-center justify-center w-10 h-10 bg-gray-50 rounded-full shadow-sm">
              {stat.icon}
            </div>
            <span className="text-base font-medium">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
