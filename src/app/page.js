import HeroSection from '@/components/home/HeroSection';
import Header from '@/components/Header';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import FeaturedJobs from '@/components/home/FeaturedJobs';
import Testimonials from '@/components/home/Testimonials';
import CTASection from '@/components/home/CTASection';
import PopularJobRoles from '@/components/home/PopularJobRoles';
import QuickStats from '@/components/home/QuickStats';

export default function Home() {
  return (
  <main className="min-h-screen bg-[#FFF5EC]">
    <Header activeLink="/" />
    <HeroSection />          {/* Grab attention */}
    <QuickStats />
    <PopularJobRoles />      {/* Show opportunities */}
    <WhyChooseUs />          {/* Build trust */}
    {/* <HowItWorks />            */}
    <FeaturedJobs />         {/* Actual jobs */}
    <Testimonials />         {/* Social proof */}
    <CTASection />           {/* Final call-to-action */}
  </main>
  );
}