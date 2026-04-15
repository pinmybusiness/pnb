import HeroAnimationClient from "@/components/clients/HeroAnimationClient";
import LenisClient from "@/components/clients/LenisClient";
import RevealClient from "@/components/clients/RevealClient";
import ScrollProgressClient from "@/components/clients/ScrollProgressClient";
import FAQs from "@/components/home/FAQs";
import Features from "@/components/home/Features";
import FinalCTA from "@/components/home/FinalCTA";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import Industries from "@/components/home/Industries";
import Integrations from "@/components/home/Integrations";
import Pricing from "@/components/home/Pricing";
import TestimonialsSection from "@/components/home/Testimonials";
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
    <>
      <LenisClient />
      <ScrollProgressClient />
      <RevealClient />
      <HeroAnimationClient />
      <div className="min-h-screen font-sans">
        <Hero />
        <HowItWorks />
        <Features />
        <Industries />
        <Integrations />
        <TestimonialsSection />
        <Pricing />
        <FAQs />
        <FinalCTA />
      </div>
    </>
  );
}
