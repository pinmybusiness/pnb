import HeroSection from '@/components/home/HeroSection';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import FeaturedJobs from '@/components/home/FeaturedJobs';
import Testimonials from '@/components/home/Testimonials';
import CTASection from '@/components/home/CTASection';
import PopularJobRoles from '@/components/home/PopularJobRoles';
import QuickStats from '@/components/home/QuickStats';

export const metadata = {
  title: "Find Restaurant Jobs & Hire Staff Fast | FasterQ.in",
  description: "Discover chef, waiter, and steward jobs or hire staff quickly. FasterQ.in connects restaurants and job seekers—free and fast.",
  alternates: {
    canonical: "https://www.fasterq.in",
  },
};

export default function Home() {
  return (
  <main className="min-h-screen bg-[#FFF5EC]">
    {/* <Header activeLink="/" /> */}
    <HeroSection />          {/* Grab attention */}
    <QuickStats />
    <FeaturedJobs />         {/* Actual jobs */}
    <WhyChooseUs />          {/* Build trust */}
    <PopularJobRoles />      {/* Show opportunities */}
    <Testimonials />         {/* Social proof */}
    <CTASection />           {/* Final call-to-action */}
  </main>
  );
}