import Benefits from "@/components/home/Benefits";
import FAQs from "@/components/home/FAQs";
import Features from "@/components/home/Features";
import FinalCTA from "@/components/home/FinalCTA";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import Industries from "@/components/home/Industries";
import Integrations from "@/components/home/Integrations";
import Pricing from "@/components/home/Pricing";
import TestimonialsSection from "@/components/home/Testimonials";

// Generate dynamic metadata
export async function generateMetadata() {
  return {
    title: "Call Tracking Software India | Track & Record All Sales Calls",
    description:
      "Automatically track and record all SIMs. Get real-time call logs, CRM sync, and insights for your sales team — no VoIP, no number change.",
    alternates: {
      canonical: "https://www.fasterq.in",
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