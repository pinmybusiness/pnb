import { Store, Building2, Stethoscope, Scissors, ShoppingBag, Hotel, Truck, GraduationCap } from "lucide-react";

const industries = [
  { name: "Restaurants", icon: Store },
  { name: "Real Estate", icon: Building2 },
  { name: "Clinics", icon: Stethoscope },
  { name: "Salons & Spas", icon: Scissors },
  { name: "Retail", icon: ShoppingBag },
  { name: "Hotels", icon: Hotel },
  { name: "Logistics", icon: Truck },
  { name: "EdTech", icon: GraduationCap },
];

export default function Industries() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-12" data-animate="fade-up">
          <span className="inline-block px-4 py-1.5 bg-orange-50 text-[#FF5211] rounded-full text-sm font-semibold mb-4 border border-orange-100">
            Industries
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Built for every team
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Any business where your team talks to customers - FasterQ works.
          </p>
        </div>

        {/* Grid */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          data-stagger-parent data-stagger="0.07" data-stagger-duration="0.5" data-stagger-offset="20"
        >
          {industries.map(({ name, icon: Icon }, i) => (
            <div
              key={i}
              data-stagger-item
              className="group flex items-center gap-3 bg-white border border-gray-100 hover:border-[#FF5211]/30 rounded-2xl px-3 py-3 md:px-5 md:py-4 transition-all duration-200 hover:shadow-md"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-orange-50 group-hover:bg-orange-100 flex items-center justify-center shrink-0 transition-colors duration-200">
                <Icon className="w-4 h-4 md:w-5 md:h-5 text-[#FF5211]" />
              </div>
              <span className="font-semibold text-gray-800 text-xs md:text-base leading-tight">
                {name}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
