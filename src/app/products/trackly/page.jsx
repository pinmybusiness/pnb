import Benefits from "@/components/trackly/Benefits";
import FAQs from "@/components/trackly/FAQs";
import Features from "@/components/trackly/Features";
import FinalCTA from "@/components/trackly/FinalCTA";
import Hero from "@/components/trackly/Hero";
import HowItWorks from "@/components/trackly/HowItWorks";
import Industries from "@/components/trackly/Industries";
import Integrations from "@/components/trackly/Integrations";
import Pricing from "@/components/trackly/Pricing";
import TestimonialsSection from "@/components/trackly/Testimonials";

// Generate dynamic metadata
export async function generateMetadata() {
  return {
    title: "Call Tracking Software India | Track & Record All Sales Calls",
    description:
      "Automatically track and record all SIMs. Get real-time call logs, CRM sync, and insights for your sales team — no VoIP, no number change.",
    alternates: {
      canonical: "https://www.fasterq.in/products/trackly",
    },
  };
}


export default function TracklyLanding() {
  return (
    <div className="min-h-screen font-sans">
    {/* Hero Section */}
    <Hero />

    {/* Benefits */}
    <Benefits />

          {/* Industries */}
    <Industries />

    {/* How It Works */}
    <HowItWorks />

    {/* Features */}
    <Features />

          {/* Integrations */}
    <Integrations />

    {/* Testimonials */}
    <TestimonialsSection />

    {/* Pricing */}
    <Pricing />

          {/* FAQs */}
    <FAQs />

    {/* Final CTA */}
    <FinalCTA />
    </div>
  );
}