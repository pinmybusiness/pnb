import { Users, Phone, Zap, BarChart3 } from "lucide-react";
import CtaButton from "./CtaButton";

const steps = [
  {
    number: 1,
    title: "Sign Up",
    description: "Create your Trackly account on our analytics dashboard.",
    icon: Users,
  },
  {
    number: 2,
    title: "Invite Your Team",
    description: "Add sales reps to track calls effortlessly.",
    icon: Phone,
  },
  {
    number: 3,
    title: "Install the App",
    description: "Install on team phones for SIM & WhatsApp tracking.",
    icon: Zap,
  },
  {
    number: 4,
    title: "View Insights",
    description: "View real-time call data and insights on your dashboard.",
    icon: BarChart3,
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-orange-50/30 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF5211] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FF5211] rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16" data-animate="fade-up">
          <span className="inline-block px-4 py-2 bg-[#FF5211]/10 text-[#FF5211] rounded-full text-sm font-semibold mb-4">
            Simple Process
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Get Started in Minutes
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Four simple steps to transform your call tracking experience
          </p>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#FF5211]/20 to-transparent"></div>
          
          <div className="grid md:grid-cols-4 gap-8" data-stagger-parent data-stagger="0.1" data-stagger-duration="0.6" data-stagger-offset="24">
            {steps.map((step, i) => (
              <div key={i} data-stagger-item className="relative group">
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-[#FF5211] to-orange-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform">
                    {String(step.number).padStart(2, "0")}
                  </div>
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-[#FF5211]/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                    <div className="relative bg-gradient-to-br from-[#FF5211]/10 to-orange-100/50 p-4 rounded-2xl inline-flex">
                      <step.icon className="h-10 w-10 text-[#FF5211]" />
                    </div>
                  </div>
                  <h3 className="font-bold text-xl mb-3 text-gray-900">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  <div className="mt-6 h-1 w-12 bg-gradient-to-r from-[#FF5211] to-orange-400 rounded-full group-hover:w-full transition-all duration-300"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-center mt-16" data-animate="fade-up" data-delay="0.4">
          <CtaButton
            href="/contact"
            text="Start for ₹99/month"
            className="bg-[#FF5211] text-white hover:bg-orange-600 hover:shadow-xl hover:scale-105"
          />
        </div>
      </div>
    </section>
  );
}