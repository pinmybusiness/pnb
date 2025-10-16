import {
  Phone,
  PhoneCall,
  BarChart3,
  GitBranch,
  Shield,
  Check,
  Zap,
  Bell,
  Users,
  MessageSquare,
  Building2,
  Store,
  Scissors,
  Stethoscope,
  Hotel,
  Car,
  BookOpen,
} from "lucide-react";
import CtaButton from "@/components/CtaButton";

export default function ProductLanding() {
  const features = [
    {
      icon: Phone,
      title: "Real-Time Alerts",
      description:
        "Get instant notifications for every missed call — never lose a customer or lead again.",
    },
    {
      icon: PhoneCall,
      title: "Smart Callbacks",
      description:
        "Call back in one tap with auto-logging, CRM sync, and smart reminders.",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description:
        "Track call trends, team performance, pending callbacks, and response times in one powerful dashboard.",
    },
    {
      icon: GitBranch,
      title: "Multi-Branch Support",
      description:
        "Easily manage calls from multiple offices, stores, or business branches.",
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description:
        "Your customer data stays protected with enterprise-grade encryption and privacy compliance.",
    },
    {
      icon: Zap,
      title: "Boost Conversions",
      description:
        "Respond 3× faster and turn every missed call into a sales opportunity.",
    },
    {
      icon: MessageSquare,
      title: "Spam Filtering",
      description:
        "Block spam calls with one tap, keeping your team focused on real customers.",
    },
    {
      icon: Bell,
      title: "Smart Reminders",
      description:
        "Get alerts every few minutes to ensure no missed call is forgotten.",
    },
  ];
  const industries = [
    { name: "Restaurants", icon: Store },
    { name: "Real Estate", icon: Building2 },
    { name: "Salons & Spas", icon: Scissors },
    { name: "Clinics & Healthcare", icon: Stethoscope },
    { name: "Retail Stores", icon: Users },
    { name: "Hotels & Hospitality", icon: Hotel },
    { name: "Automobile Dealers", icon: Car },
    { name: "Educational Institutes", icon: BookOpen },
  ];
  const steps = [
    {
      icon: Phone,
      title: "1. Missed Call Detected",
      desc: "FasterQ automatically tracks every missed call from your business number.",
    },
    {
      icon: Bell,
      title: "2. Instant Alert",
      desc: "Alerts the right team member with customer details and call time.",
    },
    {
      icon: PhoneCall,
      title: "3. One-Tap Callback",
      desc: "Call back instantly and convert that missed call into a sale or booking.",
    },
  ];
  const pricingFeatures = [
    "Unlimited Call Tracking",
    "Advanced Analytics Dashboard",
    "Team Activity Reports",
    "Spam Filtering",
    "Multi-Branch Access",
    "AI-Powered Insights",
    "Priority Support",
    "Secure Cloud Backup",
  ];
  const faqs = [
    {
      q: "Do I need new hardware or phone setup?",
      a: "No! FasterQ works with your existing phone system. Just connect and start tracking instantly.",
    },
    {
      q: "Can I use it on mobile?",
      a: "Yes, you can access your missed call dashboard and alerts from any device.",
    },
    {
      q: "Can I cancel anytime?",
      a: "Yes, it’s month-to-month. Cancel anytime — no hidden fees.",
    },
    {
      q: "What happens after 4 months?",
      a: "You’ll automatically move to ₹299/month with full access. No action needed.",
    },
    {
      q: "How does FasterQ handle spam calls?",
      a: "Mark a call as spam once, and FasterQ filters it out for your entire team.",
    },
    {
      q: "Will I be reminded about pending missed calls?",
      a: "Yes, FasterQ sends smart reminders every few minutes to ensure no call is forgotten.",
    },
  ];
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-[85vh] bg-[#FFF5EC] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto pt-20 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Image */}
            <div className="order-2 lg:order-1 flex justify-center">
              <img
                src="/images/hero-phone.png"
                alt="Missed Call Tracker interface"
                width={420}
                height={520}
                className="drop-shadow-xl"
              />
            </div>
            {/* Hero Content */}
            <div className="order-1 lg:order-2 text-center lg:text-left">
              <h1 className="!text-4xl lg:!text-6xl font-bold leading-tight mb-6">
                Never Miss a Call, Never Miss a Customer
              </h1>
              <p className="text-lg sm:text-xl text-gray-700 mb-6">
                Don’t let missed calls frustrate your customers or cost you sales. Designed for{" "}
                <span className="text-primary font-semibold">
                  Restaurants, Real Estate, Clinics & Salons
                </span>{" "}
                — FasterQ turns every missed call into an opportunity.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                <span className="font-semibold text-primary">
                  First 4 months at just ₹99/month
                </span>{" "}
                — then ₹299/month after. Cancel anytime.
              </p>
              <div className="space-y-3">
                <CtaButton
                  href="#pricing"
                  text="Start for ₹99"
                  size="lg"
                  className="mx-auto lg:mx-0 hover:shadow-xl"
                />
                <p className="text-sm text-gray-500">
                  No credit card required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* How It Works */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-12 tracking-tight">
            How <span className="text-[#FF5211]">FasterQ</span> Works
          </h2>
          <div className="relative">
            {/* SVG Timeline for Desktop */}
            <div className="hidden md:block absolute inset-0 z-0">
              <svg className="w-full h-full" viewBox="0 0 600 100" preserveAspectRatio="none">
                <path
                  d="M 50 50 Q 300 20 550 50"
                  fill="none"
                  stroke="url(#timelineGradient)"
                  strokeWidth="4"
                  className="animate-draw"
                />
                <defs>
                  <linearGradient id="timelineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: '#FF5211', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#FF8C00', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            {/* Vertical Line for Mobile */}
            <div className="md:hidden absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#FF5211] to-[#FF8C00] transform -translate-x-1/2 z-0" />
            {/* Steps */}
            <div className="relative z-10 flex flex-col md:grid md:grid-cols-3 gap-12 md:gap-8">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className="relative flex md:flex-col items-center md:items-center text-center animate-fade-in"
                  style={{ animationDelay: `${i * 200}ms` }}
                >
                  {/* Step Indicator */}
                  <div className="relative flex-shrink-0 w-12 h-12 bg-white border-4 border-[#FF5211] text-[#FF5211] font-extrabold text-lg flex items-center justify-center rounded-full mr-6 md:mr-0 md:mb-6 z-10 shadow-md">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  {/* Card Content */}
                  <div className="flex flex-col items-center bg-white rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-[#FFF5EC] hover:border-[#FF5211] group">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#FF5211] to-[#FF8C00] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:animate-pulse transition-transform duration-300">
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-extrabold text-xl md:text-2xl mb-3 text-gray-900 tracking-tight">{step.title}</h3>
                    <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-xs">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* CSS for Animations */}
        <style>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes draw {
            to { stroke-dashoffset: 0; }
          }
          .animate-fade-in {
            animation: fade-in 0.6s ease-out forwards;
          }
          .animate-draw {
            stroke-dasharray: 600;
            stroke-dashoffset: 600;
            animation: draw 2s ease-out forwards;
          }
        `}</style>
      </section>
      {/* Industries Section */}
      <section className="py-20 px-6 bg-[#FFF5EC]">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Built for Every Industry</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {industries.map(({ name, icon: Icon }, i) => (
              <div
                key={i}
                className="bg-white shadow-md hover:shadow-xl rounded-2xl p-6"
              >
                <Icon className="h-8 w-8 text-[#FF5211] mx-auto mb-3" />
                <p className="font-medium text-gray-800">{name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-24 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Growing Businesses
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Capture every opportunity — track, analyze, and convert effortlessly in today’s fast-paced world.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-[#FFF5EC] hover:bg-white shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl p-8 text-center hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <f.icon className="h-8 w-8 text-[#FF5211]" />
                </div>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-[#FFF5EC] px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-16">Simple Pricing</h2>
          <div className="bg-white border shadow-2xl rounded-3xl p-10 relative">
            <span className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 bg-red-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow">
              Intro Offer ₹99/month
            </span>
            <h3 className="text-2xl font-bold mb-6">Pro Plan</h3>
            <div className="text-6xl font-extrabold mb-3">₹99</div>
            <p className="text-gray-700 mb-8">
              For first 4 months, then ₹299/month
            </p>
            <div className="grid sm:grid-cols-2 gap-y-5 gap-x-8 mb-10 text-left max-w-md mx-auto">
              {pricingFeatures.map((p, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">{p}</span>
                </div>
              ))}
            </div>
            <CtaButton
              href="/contact"
              text="Get Started for ₹99"
              size="xl"
              className="w-full font-bold"
            />
          </div>
        </div>
      </section>
      {/* FAQ Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((f, i) => (
              <div key={i} className="border rounded-xl p-6 hover:shadow-md transition">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  {f.q}
                </h3>
                <p className="text-gray-600">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Final CTA */}
      <section className="py-20 text-center bg-[#FFF5EC]">
        <h2 className="text-3xl sm:text-4xl font-bold mb-8">
          Never Miss a Customer Again
        </h2>
        <CtaButton href="#pricing" text="Start for ₹99" size="lg" />
        <p className="text-gray-500 mt-4 text-sm">
          Offer valid for a limited time. Cancel anytime.
        </p>
      </section>
    </div>
  );
}