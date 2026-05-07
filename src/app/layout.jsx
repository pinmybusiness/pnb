import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { SITE, TOOLS } from '@/lib/tools';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
});

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  category: 'Business Tools',
  keywords: [
    'free business tools',
    'whatsapp link generator',
    'qr code generator',
    'invoice generator',
    'email signature generator',
    'password generator',
    'free tools for small business',
    'online business tools',
    'wa.me link generator',
    'free invoice maker',
  ],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  manifest: '/manifest.json',
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  twitter: {
    card: 'summary_large_image',
    site: SITE.twitter,
    creator: SITE.twitter,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': [
        // Placeholder for future blog RSS — keep header tidy if/when added
      ],
    },
  },
  verification: {
    // Add Google/Bing verification tokens here when configured:
    // google: 'xxxx',
    // other: { 'msvalidate.01': 'xxxx' },
  },
};

// Organization schema (anchored with @id so other schemas can reference it)
const ORG_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE.url}#organization`,
  name: SITE.name,
  alternateName: 'PinMyBusiness Tools',
  url: SITE.url,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE.url}/icon1`,
    width: 512,
    height: 512,
  },
  description: SITE.description,
  foundingDate: SITE.founded,
  sameAs: [
    // Add real profiles when ready:
    // 'https://twitter.com/pinmybusiness',
    // 'https://github.com/pinmybusiness',
    // 'https://linkedin.com/company/pinmybusiness',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    email: `hello@${SITE.domain}`,
    contactType: 'customer support',
    availableLanguage: ['English'],
    url: `${SITE.url}/contact`,
  },
};

// WebSite schema with potentialAction (rich SERP eligibility)
const WEBSITE_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE.url}#website`,
  name: SITE.name,
  alternateName: SITE.tagline,
  url: SITE.url,
  description: SITE.description,
  inLanguage: 'en',
  publisher: { '@id': `${SITE.url}#organization` },
};

// Featured ItemList of all tools — surfaces in SERP for navigational queries
const ITEMLIST_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  '@id': `${SITE.url}#tools`,
  name: 'Free Business Tools',
  description: `${TOOLS.length} free, browser-based business tools.`,
  numberOfItems: TOOLS.length,
  itemListElement: TOOLS.map((tool, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    url: `${SITE.url}${tool.href}`,
    name: tool.name,
  })),
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0e1015',
  colorScheme: 'dark',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSON_LD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSON_LD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ITEMLIST_JSON_LD) }}
        />
      </head>
      <body className="font-sans antialiased min-h-screen text-slate-100 selection:bg-indigo-500/40 selection:text-white">
        <Header />
        <main className="relative">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
