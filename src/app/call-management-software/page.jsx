// app/page.jsx
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Smartphone,
  LayoutDashboard,
  MessageSquare,
  Mic,
  Zap,
  Bell,
  Building2,
  Stethoscope,
  Shield,
  GraduationCap,
  ShoppingBag,
  Utensils,
  Star,
  ChevronDown,
  IndianRupee,
  Wrench,
  Flag,
  Play,
  ArrowRight,
  PhoneCall,
  Users,
  Calendar,
  Clock,
  Phone,
  BarChart3,
} from "lucide-react";
import FAQWidget from "@/widget/Faq";
import FinalCTA from "@/widget/FinalCTA";
import PricingWidget from "@/widget/Pricing";
import TestimonialsWidget from "@/widget/Testimonials";
import IndustriesWidget from "@/widget/Industries";
import HowItWorksWidget from "@/widget/HowItWorks";
import ComparisonWidget from "@/widget/Comparison";
import FeaturesWidget from "@/widget/Features";
import TrustBarWidget from "@/widget/TrustBar";
import ProblemSolutionWidget from "@/widget/ProblemSolution";
import Hero from "./Hero";

const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "Sales Director, TechFlow India",
    image: "/images/trackly/avatars/user1.webp",
    quote: "Trackly transformed our sales process. We now track every lead from SIM calls without any manual entry. The WhatsApp reports are a game-changer for my morning reviews.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Founder, EstatePro",
    image: "/images/trackly/avatars/user2.webp",
    quote: "Finally, a solution that works with our existing mobile numbers! No more VOIP quality issues. My team loves that they don't have to learn a new app.",
    rating: 5,
  },
  {
    name: "Amit Patel",
    role: "VP Sales, GrowthX",
    image: "/images/trackly/avatars/user3.webp",
    quote: "The integration with Salesforce is seamless. We've seen a 30% increase in lead retention since we started using Trackly. Highly recommended for Indian sales teams.",
    rating: 5,
  },
];

const industriesData = [
  {
    icon: Building2,
    title: "Real Estate",
    desc: "Track broker & site visit follow-up calls.",
  },
  {
    icon: Stethoscope,
    title: "Healthcare",
    desc: "Monitor appointment booking calls & patient follow-ups.",
  },
  {
    icon: Shield,
    title: "Insurance",
    desc: "Ensure policy advisors follow through on every prospect call.",
  },
  {
    icon: GraduationCap,
    title: "EdTech & Education",
    desc: "Track counsellor calls & student inquiries.",
  },
  {
    icon: ShoppingBag,
    title: "Retail & E-commerce",
    desc: "Manage customer service & order follow-ups.",
  },
  {
    icon: Utensils,
    title: "Restaurants & F&B",
    desc: "Track reservation calls & delivery queries.",
  },
];

const columns = [
  "Feature",
  "✅ Fasterq",
  "Callyzer",
  "Exotel",
  "VoIP Tools",
];

const rows = [
  ["Monthly Price", "₹99/month", "₹999–₹2999", "₹3000+", "₹2000–₹8000"],
  ["Works on SIM", "✔ Yes", "✔ Yes", "✘ VoIP only", "✘ VoIP only"],
  ["Hardware Required", "✔ None", "✔ None", "✘ IP phone", "✘ Headset"],
  ["WhatsApp Reports", "✔ Daily", "✘ No", "✘ No", "✘ No"],
  ["Data Stored in India", "✔ Yes", "—", "—", "✘ Often US"],
  ["Setup Time", "< 10 mins", "30–60 mins", "1–3 days", "Days–weeks"],
  ["Free Trial", "✔ Yes", "✔ Limited", "✘ No", "✘ No"],
];

const stepsData = [
  {
    num: "01",
    title: "Sign Up Free",
    desc: "Create your Fasterq account in under 2 minutes.",
    icon: Users,
  },
  {
    num: "02",
    title: "Add Your Team",
    desc: "Invite agents and assign roles.",
    icon: Phone,
  },
  {
    num: "03",
    title: "Install the App",
    desc: "Install app on Android phones.",
    icon: Zap,
  },
  {
    num: "04",
    title: "Track Every Call",
    desc: "Monitor calls in real-time dashboard.",
    icon: BarChart3,
  },
];
const featuresData = [
  {
    icon: Smartphone,
    title: "SIM-Based Call Tracking",
    desc: "Works directly on Jio/Airtel/Vi SIM cards. No hardware needed.",
  },
  {
    icon: LayoutDashboard,
    title: "Live Manager Dashboard",
    desc: "Monitor all calls in real-time.",
  },
  {
    icon: MessageSquare,
    title: "WhatsApp Reports",
    desc: "Get daily reports on WhatsApp.",
  },
  {
    icon: Mic,
    title: "Call Recording",
    desc: "Record and review calls easily.",
  },
  {
    icon: Zap,
    title: "CRM Integrations",
    desc: "Connect with Zoho & Salesforce.",
  },
  {
    icon: Bell,
    title: "Missed Call Alerts",
    desc: "Never miss a lead again.",
  },
];

const faqs = [
{
q: "Does Fasterq work on iPhone?",
a: "Fasterq's agent call tracking app runs on Android devices..."
},
{
q: "Is call recording legal in India?",
a: "Yes — recording calls for business..."
},
{
q: "What's the difference between Fasterq and Exotel?",
a: "Exotel is a VoIP platform..."
},
{
q: "Does Fasterq work on Jio and Airtel SIMs?",
a: "Absolutely! Fasterq is fully compatible..."
},
{
q: "Can I give access to multiple team members?",
a: "Yes — and at ₹99/month..."
},
{
q: "Can I cancel my Fasterq subscription anytime?",
a: "Yes — Fasterq is month-to-month..."
}
];

const statsData = [
  { value: "500+", label: "Sales Teams" },
  { value: "50K+", label: "Calls Tracked" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "₹99", label: "Per Month Flat" },
];

const problems = [
  "Excel sheets & manual call logs",
  "No real-time call tracking",
  "Missed calls go unnoticed",
  "Expensive VoIP setup (₹3000+/month)",
  "No WhatsApp reports",
  "Zero visibility",
];

const solutions = [
  "Auto SIM-based call tracking",
  "Live dashboard",
  "Instant missed call alerts",
  "Just ₹99/month",
  "Daily WhatsApp reports",
  "Full visibility",
];

export default function LandingPage() {
  return (
    <>
      {/* SEO */}
      <title>Fasterq | India's Smartest Call Management Software — ₹99/month, No VoIP</title>
      <meta
        name="description"
        content="Fasterq is India's smartest call management software for sales teams. Track SIM calls, get WhatsApp reports & live dashboards — starting at just ₹99/month. No hardware. No VoIP."
      />
      <meta name="keywords" content="call management software India, SIM call tracking app India, call tracking software sales teams" />

      {/* HERO SECTION */}
      <Hero/>

      {/* TRUST BAR */}
     <TrustBarWidget stats={statsData} />

      {/* PROBLEM VS SOLUTION */}
<ProblemSolutionWidget
  problems={problems}
  solutions={solutions}
/>

      {/* FEATURES */}
<FeaturesWidget features={featuresData} />

      {/* HOW IT WORKS */}
<HowItWorksWidget steps={stepsData} />

      {/* INDUSTRIES */}
<IndustriesWidget industries={industriesData} />

      {/* TESTIMONIALS */}
<TestimonialsWidget testimonials={testimonials} />

      {/* COMPARISON TABLE */}
<ComparisonWidget columns={columns} rows={rows} />
<PricingWidget />

      {/* FAQ */}
        <FAQWidget
        faqs={faqs}
        subtitle="Got questions? We've got answers. If you don't find what you're looking for, chat with our team."
        />

    <FinalCTA
    title="Stop Losing Sales Calls Today"
    subtitle="Track every call & boost your conversions instantly"
    primaryText="Start for ₹99/month"
    primaryLink="/start"
    secondaryText="Call Now"
    secondaryLink="tel:+919798288748"
    />
    </>
  );
}
