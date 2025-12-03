import { Store, Building2, Stethoscope, Scissors, Users, Hotel } from "lucide-react";
import CtaButton from "./CtaButton";

const industries = [
  { name: "Restaurants", icon: Store },
  { name: "Real Estate", icon: Building2 },
  { name: "Clinics", icon: Stethoscope },
  { name: "Salons & Spas", icon: Scissors },
  { name: "Retail", icon: Users },
  { name: "Hotels", icon: Hotel },
];

export default function Industries() {
  return (
    <section className="py-20 px-6 bg-gradient-to-br from-gray-50 via-white to-orange-50/20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#FF5211] rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-orange-400 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
      </div>
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, #FF5211 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16" data-animate="fade-up">
          <span className="inline-block px-5 py-2 bg-white/80 backdrop-blur-sm text-[#FF5211] rounded-full text-sm font-bold mb-4 border border-[#FF5211]/20 shadow-sm">
            🏢 Universal Solution
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Built for <span className="bg-gradient-to-r from-[#FF5211] to-orange-600 bg-clip-text text-transparent">Every Industry</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Trusted by professionals across diverse sectors to streamline their workflows
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6" data-stagger-parent data-stagger="0.08" data-stagger-duration="0.6" data-stagger-offset="20">
          {industries.map(({ name, icon: Icon }, i) => (
            <div 
              key={i} 
              data-stagger-item
              className="group relative bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#FF5211]/30 hover:-translate-y-2 cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF5211]/0 to-orange-500/0 group-hover:from-[#FF5211]/10 group-hover:to-orange-500/5 rounded-2xl transition-all duration-500"></div>
              <div className="relative flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-[#FF5211]/20 rounded-xl blur-lg group-hover:blur-xl transition-all"></div>
                  <div className="relative bg-gradient-to-br from-[#FF5211]/10 to-orange-100/50 w-16 h-16 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm">
                    <Icon className="h-8 w-8 text-[#FF5211] group-hover:scale-110 transition-transform" />
                  </div>
                </div>
                <p className="font-bold text-gray-900 text-center group-hover:text-[#FF5211] transition-colors duration-300">
                  {name}
                </p>
                <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-4 h-4 text-[#FF5211] animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF5211] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-2xl"></div>
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-[#FF5211]/10 to-transparent rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-3xl p-8 shadow-xl border border-gray-100 max-w-4xl mx-auto" data-animate="fade-up" data-delay="0.4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            {[
              { icon: "🏢", stat: "100+", label: "Businesses Onboarded" },
              { icon: "📞", stat: "50K+", label: "Calls Tracked Monthly" },
              { icon: "🤝", stat: "98%", label: "Customer Satisfaction" }
            ].map((item, i) => (
              <div key={i} className="text-center pt-6 md:pt-0 first:pt-0">
                <div className="text-3xl mb-2">{item.icon}</div>
                <p className="text-3xl font-bold bg-gradient-to-r from-[#FF5211] to-orange-600 bg-clip-text text-transparent mb-1">
                  {item.stat}
                </p>
                <p className="text-sm text-gray-600 font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center" data-animate="fade-up" data-delay="0.6">
          <p className="text-gray-600 mb-4">Don't see your industry? We've got you covered!</p>
          <CtaButton
            href="/contact"
            text="Talk to Our Team"
            className="bg-gradient-to-r from-[#FF5211] to-orange-600 text-white hover:shadow-2xl hover:scale-105"
          />
        </div>
      </div>
    </section>
  );
}