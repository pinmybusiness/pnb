import { Building2, Users, Zap } from "lucide-react";

export default function QuickStats() {
  const stats = [
    { icon: <Building2 className="w-6 h-6 text-orange-600" />, label: "500+ Verified Restaurants" },
    { icon: <Users className="w-6 h-6 text-green-600" />, label: "10,000+ Job Seekers" },
    { icon: <Zap className="w-6 h-6 text-blue-600" />, label: "Fast & Easy Hiring Process" },
  ];

  return (
    <section className="bg-white py-4 md:py-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-center sm:justify-around items-center gap-4 sm:gap-12">
        {stats.map((stat, idx) => (
          <div key={idx} className="flex items-center space-x-2 sm:space-x-2">
            {stat.icon}
            <span className="text-sm md:text-base font-medium text-gray-800 text-center sm:text-left">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
