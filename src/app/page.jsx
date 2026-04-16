import HeroSection from '@/components/home/HeroSection';
import ToolsGrid from '@/components/home/ToolsGrid';
import FeaturesSection from '@/components/home/FeaturesSection';
import TrustSection from '@/components/home/TrustSection';
import { SITE } from '@/lib/tools';

export const metadata = {
  title: `${SITE.name} - ${SITE.tagline}`,
  description: SITE.description,
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ToolsGrid />
      <FeaturesSection />
      <TrustSection />
    </>
  );
}
