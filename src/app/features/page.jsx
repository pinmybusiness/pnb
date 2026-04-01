import "../specialPage.css";

import FeatureCard from "./FeatureCard";
import StepCard from "./StepCard";
import HeroSection from "./HeroSection";
import FAQWidget from "@/widget/Faq";
import PricingWidget from "@/widget/Pricing";
import TrustBarWidget from "@/widget/TrustBar";
import FinalCTA from "@/widget/FinalCTA";

export const metadata = {
  title: "FasterQ Features: Inbound Call Tracking, Missed Call Tracker, Outgoing Call Tracker & More",
  description:
    "FasterQ offers inbound call tracking, missed call alerts, outgoing call monitoring, call analytics, call recording, and CRM integration.",
    alternates: {
      canonical: "https://www.fasterq.in/features",
    },
};

// ─── DATA ────────────────────────────────────────────────────────────────────

const stats = [
  { value: "200+", label: "Businesses Trust Us" },
  { value: "50K+", label: "Calls Tracked Daily" },
  { value: "98%", label: "Customer Satisfaction" },
  { value: "3 min", label: "Average Setup Time" },
];

const features = [
  {
    icon: "📲",
    title: "Inbound Call Tracking",
    description: "Never miss an incoming lead again. Track every customer call across your team in one shared dashboard instead of scattered phone logs.",
    bullets: [
      "Centralized call log across all team members",
      "Real-time incoming call tracking",
      "Map callers to specific staff, teams, or branches",
      "Identify peak call hours and improve response time",
    ],
  },
  {
    icon: "🔔",
    title: "Missed Call Tracker",
    description: "Turn every missed call into a business opportunity. Get alerts instantly and respond before the lead goes cold.",
    bullets: [
      "Instant WhatsApp and SMS alerts for missed calls",
      "Auto-reply to customers who tried to reach you",
      "Track callback time for every sales agent",
      "Convert missed calls into CRM leads automatically",
    ],
  },
  {
    icon: "📤",
    title: "Outgoing Call Tracker",
    description: "Track every sales call your team makes without manual reporting. Get full visibility into daily performance.",
    bullets: [
      "Automatic logging of all outgoing calls",
      "Track daily call activity per salesperson",
      "Measure talk time and connection rates",
      "Tag call outcomes for better follow-ups",
    ],
  },
  {
    icon: "📊",
    title: "Call Analytics & Reports",
    description: "Make smarter decisions using real data. Understand team performance and improve results consistently.",
    bullets: [
      "Hourly and daily call performance reports",
      "Team leaderboard to track top performers",
      "Daily WhatsApp summary sent to managers",
      "Branch-level and campaign-based insights",
    ],
  },
  {
    icon: "🎙️",
    title: "Call Recording",
    description: "Improve sales quality with real call recordings. Train your team using actual customer conversations.",
    bullets: [
      "Record both sides of calls on Android devices",
      "Secure cloud storage for all recordings",
      "Link recordings directly to CRM contacts",
      "Use recordings for training and issue resolution",
    ],
  },
  {
    icon: "🔗",
    title: "CRM Integration",
    description: "Automatically sync every call with your CRM. No manual work. No missed data.",
    bullets: [
      "Works with Zoho CRM, HubSpot, Salesforce, LeadSquared",
      "Auto-create contacts from new phone numbers",
      "Attach complete call history to deals",
      "API and webhook support for custom CRM setups",
    ],
  },
];

const steps = [
  { 
    icon: "✍️", 
    title: "Sign Up", 
    description: "Create your FasterQ account and add your team members." 
  },
  { 
    icon: "📱", 
    title: "Install App", 
    description: "Each team member installs the app on their Android phone." 
  },
  { 
    icon: "📞", 
    title: "Make Calls Normally", 
    description: "Use your existing SIM and dial from your regular keypad." 
  },
  { 
    icon: "📈", 
    title: "Watch Dashboard", 
    description: "Track calls live and receive daily reports on WhatsApp." 
  },
];

const integrations = [
  { name: "Zoho CRM", color: "#E42527" },
  { name: "HubSpot", color: "#FF7A59" },
  { name: "Salesforce", color: "#00A1E0" },
  { name: "WhatsApp", color: "#25D366" },
  { name: "Freshdesk", color: "#1F9AFF" },
  { name: "Pipedrive", color: "#1A1A1A" },
  { name: "Google Sheets", color: "#34A853" },
  { name: "Slack", color: "#4A154B" },
];

const comparisonRows = [
  { feature: "See all team calls in one place", fasterq: true, manual: false },
  { feature: "Instant alert for missed calls", fasterq: true, manual: false },
  { feature: "Average call duration tracking", fasterq: true, manual: false },
  { feature: "Track callback time per agent", fasterq: true, manual: false },
  { feature: "Works with existing SIM", fasterq: true, manual: true },
  { feature: "CRM sync automation", fasterq: true, manual: false },
  { feature: "Daily performance reports", fasterq: true, manual: false },
  { feature: "Call recording with insights", fasterq: true, manual: false },
];

const faqs = [
  {
    q: "Does FasterQ work with my existing SIM card and mobile number?",
    a: "Yes. FasterQ tracks calls directly from your existing SIM card. No new number, VoIP, or hardware is required.",
  },
  {
    q: "Which Android phones and Indian networks are supported?",
    a: "FasterQ supports major networks like Jio, Airtel, Vi, and BSNL and works on most Android devices including Samsung, OnePlus, Xiaomi, and Realme.",
  },
  {
    q: "Can I track calls across multiple teams or branches?",
    a: "Yes. You can organize users by team, region, or branch and track performance separately.",
  },
  {
    q: "How does the WhatsApp daily report work?",
    a: "Every morning, you receive a summary of total calls, missed calls, top performers, and pending callbacks on WhatsApp.",
  },
  {
    q: "What CRM tools does FasterQ integrate with?",
    a: "FasterQ integrates with Zoho CRM, HubSpot, Salesforce, LeadSquared, Microsoft Dynamics, and also supports custom integrations via API.",
  },
];

// ─── SECTION COMPONENTS ──────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-[#FF5211] text-xs font-bold uppercase tracking-widest mb-4">
      <span className="w-1.5 h-1.5 rounded-full bg-[#FF5211] animate-pulse" />
      {children}
    </span>
  );
}

function SectionHeading({ children }) {
  return (
    <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight tracking-tight">
      {children}
    </h2>
  );
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://www.fasterq.in",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Features",
      item: "https://www.fasterq.in/features",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.a,
    },
  })),
};

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function FeaturesPage() {
  return (
    <>
    {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

    <main className="bg-white font-sans antialiased overflow-x-hidden">

      {/* ── 1. HERO (your existing section - placeholder) ─────────────────── */}
      <HeroSection />

      {/* ── 2. SOCIAL PROOF STATS ─────────────────────────────────────────── */}
      <TrustBarWidget badgeText='Trusted by teams across India' title='Trusted by teams across India' stats={stats} />

      {/* ── 3. CORE FEATURES ──────────────────────────────────────────────── */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-orange-100 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <SectionLabel>Core Features</SectionLabel>
            <SectionHeading>Built for how Indian sales teams actually work</SectionHeading>
            <p className="mt-4 text-gray-500 text-base leading-relaxed">
              Use your existing SIM cards. No VoIP. No number changes. Install on any Android phone and start tracking calls from day one.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <FeatureCard key={i} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. SETUP STEPS ────────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-b from-[#FFF5EC] to-white relative overflow-hidden">
        <div className="absolute -top-40 right-0 w-[500px] h-[500px] rounded-full bg-[#FF5211]/5 blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <SectionLabel>Quick Setup</SectionLabel>
            <SectionHeading>Up and running in 4 simple steps</SectionHeading>
            <p className="mt-4 text-gray-500 text-base">No IT team needed. No complicated configurations.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <StepCard key={i} step={i + 1} isLast={i === steps.length - 1} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. INTEGRATIONS ───────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14 max-w-xl mx-auto">
            <SectionLabel>Integrations</SectionLabel>
            <SectionHeading>Works with your existing tools</SectionHeading>
            <p className="mt-4 text-gray-500 text-sm">Connect to the tools your team already uses - in one click.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {integrations.map((intg, i) => (
              <div
                key={i}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-[0_4px_24px_rgba(255,82,17,0.12)] hover:border-orange-200 transition-all duration-300 p-6 flex flex-col items-center justify-center gap-2 cursor-pointer"
              >
                {/* Colored dot as logo stand-in */}
                {/* <div
                  className="w-10 h-10 rounded-xl grayscale group-hover:grayscale-0 transition-all duration-300"
                  style={{ background: intg.color }}
                /> */}
                <span className="text-sm font-semibold text-gray-600 group-hover:text-gray-900 transition-colors duration-200">
                  {intg.name}
                </span>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-gray-400 mt-8">+ 30 more integrations available via Zapier &amp; webhooks</p>
        </div>
      </section>

      {/* ── 6. COMPARISON ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-b from-[#FFF5EC] to-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-14 max-w-xl mx-auto">
            <SectionLabel>Why FasterQ</SectionLabel>
            <SectionHeading>FasterQ vs Manual Call Tracking</SectionHeading>
            <p className="mt-4 text-gray-500 text-sm">Most sales teams still rely on Excel sheets and WhatsApp chats. That leads to missed data and lost sales.</p>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-[0_8px_48px_rgba(255,82,17,0.12)] border border-orange-100">
            {/* Table header */}
            <div className="grid grid-cols-3 bg-gradient-to-r from-[#FF5211] to-[#FF8C5A] text-white">
              <div className="px-6 py-4 text-sm font-bold">Feature</div>
              <div className="px-6 py-4 text-sm font-bold text-center border-l border-white/20">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white" />
                  FasterQ
                </span>
              </div>
              <div className="px-6 py-4 text-sm font-bold text-center border-l border-white/20 opacity-80">Manual</div>
            </div>

            {comparisonRows.map((row, i) => (
              <div
                key={i}
                className={`grid grid-cols-3 border-b border-orange-50 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-[#FFF5EC]/40"}`}
              >
                <div className="px-6 py-4 text-sm text-gray-700 font-medium flex items-center">{row.feature}</div>
                <div className="px-6 py-4 flex items-center justify-center border-l border-orange-50">
                  {row.fasterq ? (
                    <span className="w-7 h-7 rounded-full bg-gradient-to-br from-[#FF5211] to-[#FF8C5A] flex items-center justify-center shadow-[0_2px_8px_rgba(255,82,17,0.3)]">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l4 4 6-6" />
                      </svg>
                    </span>
                  ) : (
                    <span className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center">
                      <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4l8 8M12 4l-8 8" />
                      </svg>
                    </span>
                  )}
                </div>
                <div className="px-6 py-4 flex items-center justify-center border-l border-orange-50">
                  {row.manual ? (
                    <span className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center">
                      <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4l8 8M12 4l-8 8" />
                      </svg>
                    </span>
                  ) : (
                    <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4l8 8M12 4l-8 8" />
                      </svg>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    {/* ── 7. PRICING ────────────────────────────────────────────────────── */}
    <PricingWidget />

    {/* ── 8. FAQ ────────────────────────────────────────────────────────── */}
    <FAQWidget
    faqs={faqs}
    // subtitle="Got questions? We've got answers. Chat with our team anytime."
    />

    {/* ── CTA BANNER ────────────────────────────────────────────────────── */}
        <FinalCTA
            title="Ready to stop losing leads to missed calls?"
            subtitle="Join 200+ businesses already using FasterQ to close more deals."
            primaryText="Start for ₹99/month"
            secondaryText="Book a Demo"
            secondaryLink="/contact"
        />
    </main>
    </>
  );
}