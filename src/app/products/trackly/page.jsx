"use client";
import {
  Phone,
  PhoneCall,
  BarChart3,
  Zap,
  Shield,
  Check,
  Users,
  MessageSquare,
  Building2,
  Store,
  Scissors,
  Stethoscope,
  Hotel,
  Car,
  BookOpen,
  Download,
  Globe,
  Star,
  MapPin,
  ArrowRight,
  Volume2,
} from "lucide-react";
import { useRouter } from "next/navigation";

const CtaButton = ({ href, text, size = "lg", className = "", variant = "primary" }) => {
  const baseClasses = "inline-flex items-center justify-center font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl";
  const sizeClasses = {
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl",
  };
  const variantClasses = {
    primary: "bg-[#FF5211] text-white hover:bg-[#FF8C00]",
    secondary: "bg-transparent text-[#FF5211] border-2 border-[#FF5211] hover:bg-[#FF5211] hover:text-white",
  };
  return (
    <a
      href={href}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {text}
      {variant === "primary" && <ArrowRight className="ml-2 h-4 w-4" />}
    </a>
  );
};

export default function TracklyLanding() {
  const router = useRouter();
   const handleContactClick = () => {
    router.push("/contact");
  };

  const benefits = [
     {
    title: "No Extra Apps to Learn",
    description: "Dial from your phone's keypad. We handle logging in the background.",
    bullets: [
      "Works silently in the background", 
      "Tracks all SIM calls",
      "WhatsApp analytics for team monitoring",
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
    title: "SIM & WhatsApp in One Dashboard", 
    description: "Unified call logs across channels with WhatsApp reporting.",
    bullets: [
      "Compare call type performance",
      "Identify conversion sources", 
      "WhatsApp reports for managers",
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
  icon: Globe, // Ya koi Indian flag icon if custom
},
  ];

  const integrations = [
    { name: "Zoho", link: "#salesforce" },
    { name: "HubSpot", link: "#hubspot" },
    { name: "LeadSquared", link: "#leadsquared" },
    { name: "Microsoft Dynamics", link: "#dynamics" },
    { name: "API & Webhooks", link: "#api" },
  ];

  const steps = [
    {
      number: 1,
      title: "Sign Up for Free",
      description: "Create your Trackly account on our analytics dashboard.",
      icon: Users,
    },
    {
      number: 2,
      title: "Invite Your Team",
      description: "Add sales reps to track calls effortlessly.",
      icon: PhoneCall,
    },
    {
      number: 3,
      title: "Install the App",
      description: "Install on team phones for SIM & WhatsApp tracking.",
      icon: Download,
    },
    {
      number: 4,
      title: "Monitor Performance",
      description: "View real-time call data and insights on your dashboard.",
      icon: BarChart3,
    },
  ];

const features = [
  {
    title: "100% Accurate Call Tracking",
    description: "Automatically tracks all your phone and WhatsApp calls.",
    bullets: [
      "Works with SIM card calls",
      "Tracks WhatsApp calls",
      "Keeps your current phone number",
      "Logs all incoming, outgoing and missed calls",
      "Records exact call timings"
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
      "Real-time alerts to managers"
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
      "Identify top performers"
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
      "Improve customer conversations"
    ],
    icon: Volume2,
  },
];

  const stats = [
    { value: "1,000+", label: "Clients Worldwide", icon: Globe },
    { value: "70K+", label: "Downloads", icon: Download },
    { value: "4.7", label: "App Rating", icon: Star },
    { value: "63", label: "Countries", icon: MapPin },
  ];

const testimonials = [
  {
    quote:
      "I run a small digital agency, and Trackly made tracking client calls super easy. No more missed follow-ups!",
    author: "Kunal Mehta",
    role: "Founder",
    company: "AdBoost Media",
  },
  {
    quote:
      "As a real estate consultant, I used to forget call details. Now everything logs automatically — love the simplicity!",
    author: "Nisha Patel",
    role: "Property Consultant",
    company: "HomeVista Realty",
  },
  {
    quote:
      "I’m a freelancer handling multiple clients — Trackly’s insights helped me organize my calls and follow-ups like a pro.",
    author: "Ravi Kumar",
    role: "Freelance Marketer",
    company: "Self-employed",
  },
  {
    quote: "The WhatsApp analytics feature is a game-changer! I get daily call reports of my entire sales team directly on my phone without logging into any dashboard.",
    author: "Rajesh Kumar", 
    role: "Sales Manager",
    company: "Tech Solutions Pvt Ltd"
  }
];

  const industries = [
    { name: "Restaurants", icon: Store },
    { name: "Real Estate", icon: Building2 },
    { name: "Clinics", icon: Stethoscope },
    { name: "Salons & Spas", icon: Scissors },
    { name: "Retail", icon: Users },
    { name: "Hotels", icon: Hotel },
  ];

  const faqs = [
    {
      q: "Do I need a new phone number?",
      a: "No, Trackly works with your existing numbers-no VOIP or new lines needed.",
    },
    {
      q: "Which CRMs does it integrate with?",
      a: "We support Salesforce, HubSpot, LeadSquared, Microsoft Dynamics, and custom CRMs via API/Webhooks.",
    },
    {
      q: "How does Trackly support Make in India?",
      a: "100% developed in India with local servers, rupee billing, and full compliance to Indian data laws – empowering desi businesses to grow globally.",
    },
    {
      q: "Is call recording compliant?",
      a: "Yes, recordings are securely stored and comply with data privacy regulations.",
    },
    {
      q: "Can I cancel anytime?",
      a: "Yes, our plans are month-to-month with no hidden fees.",
    },
    {
      q: "How fast is the setup?",
      a: "Setup takes minutes-just install the app and connect your CRM.",
    },
  ];

  return (
    <div className="min-h-screen font-sans">
{/* Hero Section */}
<section className="relative bg-gradient-to-br from-[#FFF5EC] via-orange-50/40 to-white py-14 md:py-20 px-6 lg:px-8 overflow-hidden">
  {/* Animated background elements */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute top-20 -left-20 w-96 h-96 bg-[#FF5211]/10 rounded-full blur-3xl animate-pulse"></div>
    <div className="absolute bottom-20 -right-20 w-[500px] h-[500px] bg-orange-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-orange-200/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
  </div>

  {/* Decorative grid pattern */}
  <div className="absolute inset-0 opacity-[0.03]">
    <div className="absolute inset-0" style={{
      backgroundImage: 'linear-gradient(#FF5211 1px, transparent 1px), linear-gradient(90deg, #FF5211 1px, transparent 1px)',
      backgroundSize: '60px 60px'
    }}></div>
  </div>

  {/* Floating elements */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-1/4 left-10 w-4 h-4 bg-[#FF5211]/20 rounded-full animate-bounce" style={{animationDelay: '0.5s', animationDuration: '3s'}}></div>
    <div className="absolute top-1/3 right-20 w-3 h-3 bg-orange-400/20 rounded-full animate-bounce" style={{animationDelay: '1s', animationDuration: '4s'}}></div>
    <div className="absolute bottom-1/4 left-1/4 w-5 h-5 bg-[#FF5211]/15 rounded-full animate-bounce" style={{animationDelay: '1.5s', animationDuration: '3.5s'}}></div>
  </div>

  {/* Background Curve */}
  <div className="absolute inset-x-0 bottom-0 h-32">
    <svg
      viewBox="0 0 1440 120"
      className="w-full h-full text-white"
      preserveAspectRatio="none"
    >
      <path
        fill="currentColor"
        d="M0,0 C300,100 600,50 900,80 1200,110 1440,60 1440,0 L1440,120 L0,120 Z"
        opacity="0.5"
      />
      <path
        fill="currentColor"
        d="M0,20 C400,90 800,40 1200,70 1300,80 1440,50 1440,20 L1440,120 L0,120 Z"
      />
    </svg>
  </div>

  <div className="max-w-7xl mx-auto relative z-10 grid md:grid-cols-2 gap-16 items-center">
    {/* Left Content */}
    <div className="text-center lg:text-left space-y-6 sm:space-y-8">
      <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 sm:px-5 py-2.5 sm:py-3 rounded-full border border-orange-500/20 shadow-lg mb-4">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span className="text-green-600 font-bold tracking-wide text-xs sm:text-sm">
          🇮🇳 Made in India for Growing Sales Teams
        </span>
      </div>
      <h1 className="!text-4xl lg:!text-6xl font-extrabold leading-tight text-gray-900">
        Track Every Call.
        <br />
        <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 bg-clip-text text-transparent">
          Close Every Deal.
        </span>
      </h1>

<p className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto lg:mx-0">
  Trackly logs <span className="font-bold text-gray-900">all calls—missed or received</span> directly into your CRM or web dashboard. 
  <span className="text-orange-600 font-bold"> Get daily call analytics on WhatsApp for team monitoring</span>, 
  ideal for <span className="text-orange-600 font-bold">Sales, Real Estate, Clinics & Service Teams</span>.
</p>

      <div className="flex flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start">
        {[
          { icon: "📞", text: "Auto Call Logging" },
          { icon: "⚡", text: "Real-time Sync" },
          { icon: "🔒", text: "100% Secure" }
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-2 bg-white rounded-full px-3 sm:px-4 py-2 shadow-md border border-gray-100">
            <span className="text-lg sm:text-xl">{item.icon}</span>
            <span className="text-xs sm:text-sm font-semibold text-gray-700">{item.text}</span>
          </div>
        ))}
      </div>

      <div className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
          <button onClick={handleContactClick} className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-6 sm:px-8 py-4 sm:py-5 rounded-full font-bold text-base sm:text-lg hover:shadow-2xl transition-all hover:scale-105 inline-flex items-center justify-center gap-2 sm:gap-3 group shadow-xl">
            <span>Start for ₹99/month</span>
            <span className="text-xl sm:text-2xl group-hover:translate-x-1 transition-transform">→</span>
          </button>
          <button onClick={handleContactClick} className="bg-white text-orange-600 px-6 sm:px-8 py-4 sm:py-5 rounded-full font-bold text-base sm:text-lg border-2 border-orange-500/20 hover:border-orange-500 hover:shadow-xl transition-all hover:scale-105 inline-flex items-center justify-center gap-2">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
            </svg>
            <span>Watch Demo</span>
          </button>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-600 justify-center lg:justify-start">
          <div className="flex items-center gap-2">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <span className="font-medium">No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <span className="font-medium">Cancel anytime</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4 justify-center lg:justify-start">
        <div className="flex -space-x-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-600 to-orange-500 rounded-full border-2 border-white shadow-md"></div>
          ))}
        </div>
        <div className="text-left">
          <p className="text-xs sm:text-sm font-bold text-gray-900">1000+ sales teams</p>
          <p className="text-xs text-gray-600">Already tracking smarter</p>
        </div>
      </div>
    </div>

    {/* Right Side Image */}
    <div className="flex justify-center md:justify-end relative">
      <div className="relative group">
        {/* Floating badge */}
        <div className="absolute -top-6 -left-6 bg-white rounded-2xl shadow-2xl px-4 py-3 border border-gray-100 z-20 animate-bounce" style={{animationDuration: '3s'}}>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-bold text-gray-900">Live Tracking</span>
          </div>
        </div>

        {/* Floating stats */}
        <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-2xl px-5 py-3 border border-gray-100 z-20 animate-bounce" style={{animationDuration: '3s', animationDelay: '1s'}}>
          <p className="text-xs text-gray-600 mb-1">Today's Calls</p>
          <p className="text-2xl font-bold bg-gradient-to-r from-[#FF5211] to-orange-600 bg-clip-text text-transparent">+247</p>
        </div>

        {/* Main image */}
        <div className="relative">
          <img
            src="/images/trackly/hero-image.png"
            alt="Trackly dashboard preview"
            width={550}
            height={450}
            className="drop-shadow-2xl rounded-3xl transform group-hover:scale-[1.02] transition-transform duration-500 relative z-10 border-4 border-white shadow-2xl"
          />

          {/* Layered gradient glows */}
          <div className="absolute -inset-8 bg-gradient-to-tr from-[#FF5211]/30 via-orange-400/20 to-transparent rounded-3xl blur-3xl -z-10 group-hover:blur-[100px] transition-all duration-500" />
          <div className="absolute -inset-12 bg-gradient-to-br from-orange-300/20 via-[#FF5211]/10 to-transparent rounded-3xl blur-3xl -z-20 animate-pulse" />
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 -right-8 w-16 h-16 bg-[#FF5211]/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -left-8 w-20 h-20 bg-orange-400/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>
    </div>
  </div>
</section>

{/* Benefits */}
      <section className="py-20 px-4 bg-gradient-to-br from-white via-gray-50 to-orange-50/20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#FF5211] rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-orange-400 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header */}
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

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, i) => (
              <div 
                key={i} 
                className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#FF5211]/30 hover:-translate-y-2"
              >
                {/* Gradient glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF5211]/0 via-orange-500/0 to-transparent group-hover:from-[#FF5211]/5 group-hover:via-orange-500/5 rounded-3xl transition-all duration-500"></div>
                
                {/* Icon container */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-[#FF5211]/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                  <div className="relative bg-gradient-to-br from-[#FF5211]/10 to-orange-100/50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <benefit.icon className="h-10 w-10 text-[#FF5211]" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-[#FF5211] transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {benefit.description}
                  </p>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-6"></div>

                  {/* Bullets */}
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

                {/* Bottom accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF5211] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-3xl"></div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-4 bg-white rounded-full px-8 py-4 shadow-lg border border-gray-100">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-[#FF5211] to-orange-600 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-gradient-to-br from-orange-300 to-orange-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-900">Join 1000+ sales teams</p>
                <p className="text-xs text-gray-500">Already tracking smarter with Trackly</p>
              </div>
            </div>
          </div>
        </div>
      </section>

{/* Integrations */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#FFF5EC] via-white to-orange-50/30 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#FF5211]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-[#FF5211]/10 to-orange-100 text-[#FF5211] rounded-full text-sm font-semibold mb-4 border border-[#FF5211]/20">
              🔗 Powerful Integrations
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Seamless CRM <span className="bg-gradient-to-r from-[#FF5211] to-orange-600 bg-clip-text text-transparent">Integrations</span>
            </h2>
            <p className="text-gray-600 text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
              Connect Trackly effortlessly with your favorite CRM platforms — from
              Salesforce to LeadSquared. No setup headaches, just smooth syncing.
            </p>
            <div className="hidden md:flex items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live Sync</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Auto Updates</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span>Secure Connection</span>
              </div>
            </div>
          </div>

          {/* Integration Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {integrations.map((int, i) => (
              <div
                key={i}
                className="group relative bg-white p-6 rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#FF5211]/30 hover:-translate-y-2"
                style={{
                  animationDelay: `${i * 100}ms`
                }}
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF5211]/0 to-orange-500/0 group-hover:from-[#FF5211]/5 group-hover:to-orange-500/5 rounded-3xl transition-all duration-500"></div>
                
                {/* Connected badge */}
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-[#FF5211] to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                  Ready
                </div>

                {/* Logo container */}
                <div className="relative w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF5211]/10 to-orange-100/50 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative bg-gradient-to-br from-gray-50 to-white p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    <img
                      src={`/images/trackly/integrations/${int.name
                        .toLowerCase()
                        .replace(/\s/g, "-")}.png`}
                      alt={`${int.name} logo`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* Name */}
                <h3 className="font-bold text-gray-800 text-base text-center group-hover:text-[#FF5211] transition-colors duration-300">
                  {int.name}
                </h3>

                {/* Bottom accent bar */}
                <div className="mt-4 h-1 w-0 bg-gradient-to-r from-[#FF5211] to-orange-400 rounded-full mx-auto group-hover:w-12 transition-all duration-500"></div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <p className="text-gray-600 mb-6">Don't see your CRM? We're adding more integrations every month.</p>
            <button onClick={handleContactClick} className="bg-gradient-to-r from-[#FF5211] to-orange-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-2xl transition-all hover:scale-105 inline-flex items-center gap-2 group">
              <span>Request Integration</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>
      </section>


{/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-orange-50/30 px-6 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF5211] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FF5211] rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
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
            {/* Connection line */}
            <div className="hidden md:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#FF5211]/20 to-transparent"></div>
            
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { icon: Users, title: "Create Account", desc: "Sign up in seconds, no setup cost.", num: "01" },
                { icon: Phone, title: "Install App", desc: "Works silently in the background.", num: "02" },
                { icon: Zap, title: "Auto Log Calls", desc: "Every SIM & WhatsApp call tracked automatically.", num: "03" },
                { icon: BarChart3, title: "View Insights", desc: "Receive WhatsApp updates for your team.", num: "04" },
              ].map((step, i) => (
                <div key={i} className="relative group">
                  {/* Card */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                    {/* Step number */}
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-[#FF5211] to-orange-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform">
                      {step.num}
                    </div>
                    
                    {/* Icon container */}
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-[#FF5211]/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                      <div className="relative bg-gradient-to-br from-[#FF5211]/10 to-orange-100/50 p-4 rounded-2xl inline-flex">
                        <step.icon className="h-10 w-10 text-[#FF5211]" />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <h3 className="font-bold text-xl mb-3 text-gray-900">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                    
                    {/* Bottom accent */}
                    <div className="mt-6 h-1 w-12 bg-gradient-to-r from-[#FF5211] to-orange-400 rounded-full group-hover:w-full transition-all duration-300"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* CTA */}
          <div className="text-center mt-16">
            <button  onClick={handleContactClick} className="bg-[#FF5211] text-white px-8 py-4 rounded-full font-semibold hover:bg-orange-600 transition-all hover:scale-105 shadow-lg hover:shadow-xl">
              <span>Start for ₹99/month </span> 
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>
      </section>

{/* Features */}
      <section className="py-20 px-4 bg-gradient-to-br from-[#FFF5EC] via-orange-50/30 to-white relative overflow-hidden">
        {/* Animated background patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF5211] rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-orange-400 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        {/* Decorative grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(#FF5211 1px, transparent 1px), linear-gradient(90deg, #FF5211 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
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

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div 
                key={i} 
                className="group relative bg-white rounded-3xl p-6 shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#FF5211]/30 hover:-translate-y-3"
                style={{
                  animationDelay: `${i * 100}ms`
                }}
              >
                {/* Premium badge for first item */}
                {i === 0 && (
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                    ⭐ Popular
                  </div>
                )}

                {/* Gradient glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF5211]/0 to-orange-500/0 group-hover:from-[#FF5211]/10 group-hover:to-orange-500/5 rounded-3xl transition-all duration-500"></div>
                
                {/* Icon container with floating animation */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF5211]/20 to-orange-400/20 rounded-2xl blur-lg group-hover:blur-xl transition-all"></div>
                  <div className="relative bg-gradient-to-br from-[#FF5211]/10 via-orange-100/50 to-orange-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300 shadow-sm">
                    <feature.icon className="h-8 w-8 text-[#FF5211] group-hover:scale-110 transition-transform" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="text-lg font-bold mb-3 text-center text-gray-900 group-hover:text-[#FF5211] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-5 text-center leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Decorative divider */}
                  <div className="relative h-px mb-5">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FF5211] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>

                  {/* Bullets with stagger animation */}
                  <ul className="space-y-2.5">
                    {feature.bullets.map((bullet, j) => (
                      <li 
                        key={j} 
                        className="flex items-start text-xs text-gray-700 group/item"
                        style={{
                          animation: 'slideIn 0.3s ease-out forwards',
                          animationDelay: `${j * 50}ms`,
                          opacity: 0
                        }}
                      >
                        <div className="flex-shrink-0 w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-2 mt-0.5 group-hover/item:scale-125 transition-transform shadow-sm">
                          <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                        </div>
                        <span className="flex-1 leading-relaxed">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom gradient accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#FF5211] to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-b-3xl"></div>

                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#FF5211]/10 to-transparent rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="mt-16 text-center">
            <div className="inline-flex flex-col items-center gap-4 bg-white rounded-3xl px-10 py-8 shadow-xl border border-gray-100">
              <div className="flex items-center gap-2 text-sm">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-gray-600 font-medium">All features included in every plan</span>
              </div>
              {/* <button onClick={handleContactClick} className="bg-gradient-to-r from-[#FF5211] to-orange-600 text-white px-8 py-4 rounded-full font-bold hover:shadow-2xl transition-all hover:scale-105 inline-flex items-center gap-2 group">
                <span>Explore All Features</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button> */}
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-10px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}</style>
      </section>

{/* Testimonials */}
      <section className="py-20 px-4 bg-gradient-to-br from-white via-gray-50 to-orange-50/20 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-10 w-72 h-72 bg-[#FF5211] rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-orange-300 rounded-full blur-3xl"></div>
        </div>

        {/* Floating quote marks decoration */}
        <div className="absolute top-10 left-10 text-[#FF5211]/5 text-9xl font-serif">"</div>
        <div className="absolute bottom-10 right-10 text-[#FF5211]/5 text-9xl font-serif rotate-180">"</div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-5 py-2 bg-white/80 backdrop-blur-sm text-[#FF5211] rounded-full text-sm font-bold mb-4 border border-[#FF5211]/20 shadow-sm">
              💬 Customer Stories
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              What Our <span className="bg-gradient-to-r from-[#FF5211] to-orange-600 bg-clip-text text-transparent">Customers Say</span>
            </h2>
            <p className="text-gray-600 text-lg">Real results from real sales professionals</p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((t, i) => (
              <div 
                key={i} 
                className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#FF5211]/30 hover:-translate-y-2"
              >
                {/* Gradient glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF5211]/0 to-orange-500/0 group-hover:from-[#FF5211]/5 group-hover:to-orange-500/5 rounded-3xl transition-all duration-500"></div>
                
                {/* Quote mark icon */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-[#FF5211] to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                  </svg>
                </div>

                {/* Star rating */}
                <div className="flex gap-1 mb-4 ml-8">
                  {[...Array(5)].map((_, idx) => (
                    <svg key={idx} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <div className="relative mb-6">
                  <p className="text-gray-700 text-lg leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-6 group-hover:via-[#FF5211]/30 transition-colors"></div>

                {/* Author info */}
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#FF5211] to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-110 transition-transform">
                      {t.author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  
                  {/* Author details */}
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 group-hover:text-[#FF5211] transition-colors">
                      {t.author}
                    </p>
                    <p className="text-sm text-gray-600">
                      {t.role}
                    </p>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">
                      {t.company}
                    </p>
                  </div>

                  {/* Verified badge */}
                  <div className="flex-shrink-0">
                    <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border border-blue-200">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      Verified
                    </div>
                  </div>
                </div>

                {/* Bottom accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF5211] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-3xl"></div>
              </div>
            ))}
          </div>

          {/* Stats Section */}
          <div className="mt-16 hidden md:grid grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { number: "1000+", label: "Active Users" },
              { number: "4.9/5", label: "Average Rating" },
              { number: "98%", label: "Would Recommend" }
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:border-[#FF5211]/30 hover:shadow-xl transition-all hover:-translate-y-1">
                  <p className="text-3xl font-bold bg-gradient-to-r from-[#FF5211] to-orange-600 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </p>
                  <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Join thousands of satisfied customers</p>
            <button onClick={handleContactClick} className="bg-gradient-to-r from-[#FF5211] to-orange-600 text-white px-8 py-4 rounded-full font-bold hover:shadow-2xl transition-all hover:scale-105 inline-flex items-center gap-2 group">
              <span>Start for ₹99/month</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>
      </section>

{/* Industries */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-50 via-white to-orange-50/20 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-96 h-96 bg-[#FF5211] rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-orange-400 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, #FF5211 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
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

          {/* Industries Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {industries.map(({ name, icon: Icon }, i) => (
              <div 
                key={i} 
                className="group relative bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#FF5211]/30 hover:-translate-y-2 cursor-pointer"
                style={{
                  animationDelay: `${i * 50}ms`
                }}
              >
                {/* Gradient glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF5211]/0 to-orange-500/0 group-hover:from-[#FF5211]/10 group-hover:to-orange-500/5 rounded-2xl transition-all duration-500"></div>
                
                {/* Icon container */}
                <div className="relative flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-[#FF5211]/20 rounded-xl blur-lg group-hover:blur-xl transition-all"></div>
                    <div className="relative bg-gradient-to-br from-[#FF5211]/10 to-orange-100/50 w-16 h-16 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm">
                      <Icon className="h-8 w-8 text-[#FF5211] group-hover:scale-110 transition-transform" />
                    </div>
                  </div>

                  {/* Name */}
                  <p className="font-bold text-gray-900 text-center group-hover:text-[#FF5211] transition-colors duration-300">
                    {name}
                  </p>

                  {/* Hover arrow */}
                  <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-4 h-4 text-[#FF5211] animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Bottom accent bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF5211] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-2xl"></div>

                {/* Corner decoration */}
                <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-[#FF5211]/10 to-transparent rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>

          {/* Bottom Stats */}
          <div className="mt-16 bg-white rounded-3xl p-8 shadow-xl border border-gray-100 max-w-4xl mx-auto">
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

          {/* Bottom CTA */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Don't see your industry? We've got you covered!</p>
            <button onClick={handleContactClick} className="bg-gradient-to-r from-[#FF5211] to-orange-600 text-white px-8 py-4 rounded-full font-bold hover:shadow-2xl transition-all hover:scale-105 inline-flex items-center gap-2 group">
              <span>Talk to Our Team</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>
      </section>

{/* Pricing */}
      <section id="pricing" className="py-20 px-4 bg-gradient-to-br from-white via-gray-50 to-orange-50/30 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FF5211] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-orange-400 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Header */}
          <div className="mb-16">
            <span className="inline-block px-5 py-2 bg-white/80 backdrop-blur-sm text-[#FF5211] rounded-full text-sm font-bold mb-4 border border-[#FF5211]/20 shadow-sm">
              💰 Limited Time Offer
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Simple, <span className="bg-gradient-to-r from-[#FF5211] to-orange-600 bg-clip-text text-transparent">Affordable</span> Pricing
            </h2>
            <p className="text-gray-600 text-lg">No hidden fees. Cancel anytime. Start saving today.</p>
          </div>

          {/* Pricing Card */}
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF5211] to-orange-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            
            <div className="relative bg-white border-2 border-gray-100 shadow-2xl rounded-3xl p-10 hover:shadow-3xl transition-all duration-500">
              {/* Special Offer Badge */}
              <div className="absolute -top-5 min-w-[300px] left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-[#FF5211] to-orange-600 text-white px-6 py-3 rounded-full text-sm font-bold shadow-xl flex items-center gap-2 animate-bounce">
                  <span>🔥</span>
                  <span>Special Offer: ₹99/month for 4 months</span>
                  <span>🔥</span>
                </div>
              </div>

              {/* Plan name */}
              <div className="mt-6 mb-8">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF5211]/10 to-orange-100/50 px-6 py-2 rounded-full border border-[#FF5211]/20">
                  <svg className="w-5 h-5 text-[#FF5211]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <span className="text-gray-900 font-bold text-xl">Pro Plan</span>
                </div>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className="text-2xl text-gray-400 line-through font-semibold">₹299</span>
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                    Save 67%
                  </div>
                </div>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-gray-600 text-xl">₹</span>
                  <span className="text-7xl font-extrabold bg-gradient-to-r from-[#FF5211] to-orange-600 bg-clip-text text-transparent">99</span>
                  <span className="text-gray-600 text-xl">/month</span>
                </div>
                <p className="text-gray-600 mt-3 font-medium">
                  For first 4 months, then ₹299/month • Cancel anytime
                </p>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-8"></div>

              {/* Features */}
              <div className="grid sm:grid-cols-2 gap-4 mb-10 text-left max-w-2xl mx-auto">
                {[
                  "Unlimited Call Tracking",
                  "Real-Time Alerts",
                  "Analytics Dashboard",
                  "CRM Integration",
                  "Call Recording",
                  "Secure Data Storage",
                  "Multi-Channel Support",
                  "Priority Support",
                ].map((p, i) => (
                  <div 
                    key={i} 
                    className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 hover:bg-orange-50 transition-colors group/item"
                  >
                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-sm group-hover/item:scale-110 transition-transform">
                      <Check className="h-4 w-4 text-white" strokeWidth={3} />
                    </div>
                    <span className="text-gray-700 font-medium">{p}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div className="space-y-4">
                <button onClick={handleContactClick} className="w-full bg-gradient-to-r from-[#FF5211] to-orange-600 text-white px-8 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105 inline-flex items-center justify-center gap-3 group">
                  <span>Get Started for ₹99</span>
                  <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
                </button>
                <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>No credit card required • Cancel anytime</span>
                </p>
              </div>

              {/* Trust badges */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                    </svg>
                    <span className="font-medium">Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span className="font-medium">Money-back Guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional info */}
          <div className="mt-12 flex items-center justify-center gap-2 text-gray-600">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5211] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF5211]"></span>
            </span>
            <span className="font-medium">Limited spots available at this price</span>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 px-4 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-1/4 w-72 h-72 bg-[#FF5211] rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-5 py-2 bg-orange-50 text-[#FF5211] rounded-full text-sm font-bold mb-4 border border-[#FF5211]/20">
              ❓ Got Questions?
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked <span className="bg-gradient-to-r from-[#FF5211] to-orange-600 bg-clip-text text-transparent">Questions</span>
            </h2>
            <p className="text-gray-600 text-lg">Everything you need to know about Trackly</p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <div 
                key={i} 
                className="group bg-white border-2 border-gray-100 rounded-2xl p-6 hover:border-[#FF5211]/30 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#FF5211]/10 to-orange-100/50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-[#FF5211] font-bold text-lg">Q</span>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-3 text-gray-900 group-hover:text-[#FF5211] transition-colors">
                      {f.q}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{f.a}</p>
                  </div>

                  {/* Arrow indicator */}
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-5 h-5 text-[#FF5211]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact support */}
          <div className="mt-12 text-center bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-2xl p-8 border border-[#FF5211]/20">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Still have questions?</h3>
            <p className="text-gray-600 mb-4">Our team is here to help you get started</p>
            <button onClick={handleContactClick} className="bg-white text-[#FF5211] px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all hover:scale-105 border border-[#FF5211]/20">
              Contact Support →
            </button>
          </div>
        </div>
      </section>

{/* Final CTA */}
<section className="py-24 px-4 bg-gradient-to-br from-[#FF5211] via-orange-600 to-orange-700 text-white text-center relative overflow-hidden">
  {/* Animated background elements */}
  <div className="absolute inset-0 opacity-10">
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
    <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
  </div>

  {/* Floating elements */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute top-20 left-10 w-3 h-3 bg-white/30 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
    <div className="absolute top-40 right-20 w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
    <div className="absolute bottom-32 left-1/4 w-4 h-4 bg-white/30 rounded-full animate-bounce" style={{animationDelay: '1.5s'}}></div>
  </div>

  <div className="max-w-3xl mx-auto relative z-10">
    {/* Combined Badge – Merged for better flow */}
    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
      <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full text-sm font-bold border border-white/30 min-w-0 flex-1">
        <span className="flex-shrink-0">⚡</span>
        <span className="truncate">Join 1000+ professionals</span>
      </div>
      <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full text-sm font-bold border border-white/30 min-w-0 flex-1">
        <span className="flex-shrink-0">🇮🇳</span>
        <span className="truncate">Made in India – Join the Movement</span>
      </div>
    </div>

    {/* Heading */}
    <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
      Never Miss a Lead Again
    </h2>
    <p className="text-xl md:text-2xl mb-4 text-white/90 font-medium">
      Start tracking every call, get WhatsApp analytics for your team, and never miss a lead again
    </p>
    <p className="text-lg mb-10 text-white/80">Start free—no credit card required.</p>

    {/* CTA Buttons */}
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <button onClick={handleContactClick} className="bg-white text-[#FF5211] px-10 py-5 rounded-full font-bold text-lg hover:shadow-2xl transition-all hover:scale-105 inline-flex items-center gap-3 group">
        <span>Start for ₹99</span>
        <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
      </button>
      <button onClick={handleContactClick} className="bg-transparent text-white px-10 py-5 rounded-full font-bold text-lg border-2 border-white  hover:text-[#FF5211] transition-all hover:scale-105 inline-flex items-center gap-3">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
        </svg>
        <span>Book a Demo</span>
      </button>
    </div>

    {/* Trust indicators */}
    <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-white/80">
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
        </svg>
        <span>No credit card required</span>
      </div>
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
        </svg>
        <span>Cancel anytime</span>
      </div>
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
        </svg>
        <span>Setup in 2 minutes</span>
      </div>
    </div>
  </div>
</section>
    </div>
  );
}