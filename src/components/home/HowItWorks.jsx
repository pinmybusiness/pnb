import { Users, Phone, Zap, BarChart3 } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Get Your Account",
    description: "Contact us and we set up your team's FasterQ account - no waiting.",
    icon: Users,
  },
  {
    number: "02",
    title: "Add Your Team",
    description: "We onboard your agents. Each member gets access on their own phone.",
    icon: Phone,
  },
  {
    number: "03",
    title: "Install the App",
    description: "Agents install FasterQ on their Android phone. It runs silently in the background.",
    icon: Zap,
  },
  {
    number: "04",
    title: "Track Every Call",
    description: "Every team call shows up on your dashboard in real-time. Nothing missed.",
    icon: BarChart3,
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-white px-6">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-16" data-animate="fade-up">
          <span className="inline-block px-4 py-1.5 bg-orange-50 text-[#FF5211] rounded-full text-sm font-semibold mb-4 border border-orange-100">
            How it works
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Up and running in minutes
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            No complex setup. No IT team needed.
          </p>
        </div>

        {/* Steps */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12 md:gap-0"
          data-stagger-parent data-stagger="0.1" data-stagger-duration="0.5" data-stagger-offset="20"
        >
          {steps.map((step, i) => (
            <div key={i} data-stagger-item className="relative flex flex-col items-center text-center px-4 md:px-6 group">

              {/* Connector line — desktop only */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-px bg-gray-200 z-0" />
              )}

              {/* Icon */}
              <div className="relative z-10 w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-orange-50 border-2 border-orange-100 group-hover:border-[#FF5211] group-hover:bg-orange-100 flex items-center justify-center mb-4 transition-all duration-200">
                <step.icon className="w-6 h-6 md:w-7 md:h-7 text-[#FF5211]" />
              </div>

              {/* Step number */}
              <span className="text-xs font-bold text-[#FF5211] tracking-widest uppercase mb-1.5">
                Step {step.number}
              </span>

              {/* Title */}
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-xs md:text-sm text-gray-500 leading-relaxed max-w-[160px]">
                {step.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
