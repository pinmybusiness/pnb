import Link from 'next/link';
import { TOOLS, SITE } from '@/lib/tools';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'All Free Business Tools',
  description: `Browse all ${TOOLS.length} free online tools from ${SITE.name}: WhatsApp links, QR codes, invoices, email signatures, password generator. No signup, instant results.`,
  alternates: { canonical: '/tools' },
  keywords: [
    'free business tools',
    'online tools for small business',
    'free saas tools',
    'free generator tools',
    ...TOOLS.map((t) => t.keywords[0]),
  ],
  openGraph: {
    type: 'website',
    title: `All Free Business Tools | ${SITE.name}`,
    description: `${TOOLS.length} free tools for small businesses, freelancers, and creators.`,
    url: `${SITE.url}/tools`,
    siteName: SITE.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: `All Free Business Tools | ${SITE.name}`,
    description: `${TOOLS.length} free tools for small businesses, freelancers, and creators.`,
  },
};

const COLLECTION_LD = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${SITE.url}/tools#page`,
  url: `${SITE.url}/tools`,
  name: `All Free Business Tools — ${SITE.name}`,
  description: `Browse all ${TOOLS.length} free online business tools.`,
  inLanguage: 'en',
  isPartOf: { '@id': `${SITE.url}#website` },
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: TOOLS.length,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    itemListElement: TOOLS.map((tool, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE.url}${tool.href}`,
      name: tool.name,
      description: tool.tagline,
    })),
  },
};

const BREADCRUMB_LD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home',  item: SITE.url },
    { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE.url}/tools` },
  ],
};

export default function ToolsIndexPage() {
  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(COLLECTION_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_LD) }}
      />

      <section className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-10">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-5 fade-up">
            <ol className="flex items-center gap-1.5 text-[12.5px] text-slate-500">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight size={11} className="text-slate-600" />
              </li>
              <li className="text-slate-300" aria-current="page">Tools</li>
            </ol>
          </nav>
          <p className="section-label mb-4 fade-up">Free tools</p>
          <h1 className="text-[32px] sm:text-[44px] font-semibold text-white tracking-[-0.025em] leading-[1.1] mb-3 fade-up delay-1">
            All free business tools
          </h1>
          <p className="text-[15px] text-slate-400 max-w-xl leading-[1.6] fade-up delay-2">
            {TOOLS.length} tools for small businesses, freelancers, and creators. No signup required, no fees, all results instant.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.slug}
                  href={tool.href}
                  title={tool.tagline}
                  className="group flex flex-col rounded-xl surface card-hover p-5"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span
                      className={cn(
                        'flex items-center justify-center w-10 h-10 rounded-md border',
                        tool.tintBg, tool.tintBorder
                      )}
                      aria-hidden="true"
                    >
                      <Icon size={18} className={tool.tintText} strokeWidth={1.75} />
                    </span>
                    <span className={cn('text-[10.5px] font-medium', tool.tintText)}>
                      {tool.badge}
                    </span>
                  </div>
                  <h2 className="text-[15.5px] font-semibold text-white mb-1.5 tracking-tight">
                    {tool.name}
                  </h2>
                  <p className="text-[13px] text-slate-400 leading-[1.6] mb-4 flex-1">
                    {tool.description}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
                    <span className="text-[10.5px] font-medium text-slate-500 uppercase tracking-[0.12em]">
                      {tool.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[12.5px] font-medium text-indigo-300 group-hover:text-white transition-colors">
                      Use free <ArrowUpRight size={12} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
