import HeroSection from '@/components/home/HeroSection';
import Header from '@/components/Header';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import FeaturedJobs from '@/components/home/FeaturedJobs';
import Testimonials from '@/components/home/Testimonials';
import CTASection from '@/components/home/CTASection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
     <Header activeLink="/" />
     <HeroSection />
     <WhyChooseUs />
     <FeaturedJobs />
     <Testimonials />
     <CTASection />
     <Footer />
    </main>
  );
}