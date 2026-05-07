import HeroSection from '@/components/home/HeroSection';
import ToolsGrid from '@/components/home/ToolsGrid';
import FeaturesSection from '@/components/home/FeaturesSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import TrustSection from '@/components/home/TrustSection';
import { SITE, TOOLS } from '@/lib/tools';

export const metadata = {
  title: `${SITE.name} — ${SITE.tagline}`,
  description: SITE.description,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
};

// CollectionPage on home anchors content as the primary entity
const HOME_PAGE_LD = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${SITE.url}#home`,
  url: SITE.url,
  name: `${SITE.name} — Free Business Tools`,
  description: SITE.description,
  isPartOf: { '@id': `${SITE.url}#website` },
  about: { '@id': `${SITE.url}#organization` },
  inLanguage: 'en',
  hasPart: TOOLS.map((tool) => ({
    '@type': 'SoftwareApplication',
    name: tool.name,
    url: `${SITE.url}${tool.href}`,
    applicationCategory: 'BusinessApplication',
    isAccessibleForFree: true,
    operatingSystem: 'Any (Web)',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  })),
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(HOME_PAGE_LD) }}
      />
      <HeroSection />
      <ToolsGrid />
      <FeaturesSection />
      <TestimonialsSection />
      <TrustSection />
    </>
  );
}
