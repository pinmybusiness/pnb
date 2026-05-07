import Link from 'next/link';
import { ArrowLeft, Check, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TOOLS, SITE } from '@/lib/tools';

export default function ToolPageLayout({ tool, children }) {
  const ToolIcon = tool.icon;
  const related = TOOLS.filter((t) => t.slug !== tool.slug).slice(0, 4);
  const toolUrl = `${SITE.url}${tool.href}`;

  // 1) Primary tool schema — SoftwareApplication is more specific than WebApplication
  //    for SaaS tools and supports aggregateRating/screenshot if added later.
  const appLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${toolUrl}#software`,
    name: tool.name,
    url: toolUrl,
    description: tool.longDescription || tool.description,
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: tool.category,
    operatingSystem: 'Any (Web)',
    browserRequirements: 'Requires a modern browser with JavaScript enabled.',
    isAccessibleForFree: true,
    inLanguage: 'en',
    image: `${toolUrl}/opengraph-image`,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${SITE.url}#organization`,
      name: SITE.name,
      url: SITE.url,
    },
    keywords: tool.keywords?.join(', '),
  };

  // 2) Breadcrumb schema (visible breadcrumb is also rendered below)
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',  item: SITE.url },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE.url}/tools` },
      { '@type': 'ListItem', position: 3, name: tool.name, item: toolUrl },
    ],
  };

  // 3) HowTo schema — eligible for Google "How to" rich result
  const howToLd = tool.howTo
    ? {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: `How to use the ${tool.name}`,
        description: tool.description,
        totalTime: 'PT1M',
        tool: { '@type': 'HowToTool', name: tool.name },
        step: tool.howTo.map((s, i) => ({
          '@type': 'HowToStep',
          position: i + 1,
          name: s.name,
          text: s.text,
          url: `${toolUrl}#step-${i + 1}`,
        })),
      }
    : null;

  // 4) FAQ schema — eligible for Google FAQ rich result
  const faqLd =
    tool.faqs && tool.faqs.length
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: tool.faqs.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        }
      : null;

  return (
    <div className="min-h-screen">
      {/* Schemas — emit only ONE FAQPage globally (this page wins) and HowTo. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {howToLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }}
        />
      )}
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}

      {/* Tool header */}
      <div className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8 py-7 sm:py-9">
          {/* Visible breadcrumb (also crawlable) */}
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-1.5 text-[12.5px] text-slate-500">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight size={11} className="text-slate-600" />
              </li>
              <li>
                <Link href="/tools" className="hover:text-white transition-colors">
                  Tools
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight size={11} className="text-slate-600" />
              </li>
              <li className="text-slate-300 truncate max-w-[60vw]" aria-current="page">
                {tool.name}
              </li>
            </ol>
          </nav>

          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-slate-500 hover:text-white transition-colors mb-5 group"
          >
            <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
            All free tools
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <span className={cn(
              'flex items-center justify-center w-12 h-12 rounded-lg shrink-0 border',
              tool.tintBg, tool.tintBorder
            )}>
              <ToolIcon size={20} className={tool.tintText} strokeWidth={1.75} />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-[22px] sm:text-[26px] font-semibold text-white tracking-tight">
                  {tool.name}
                </h1>
                <span className={cn(
                  'text-[10px] font-medium uppercase tracking-[0.12em] px-2 py-0.5 rounded-full border',
                  tool.tintBg, tool.tintText, tool.tintBorder
                )}>
                  Free
                </span>
              </div>
              <p className="text-[13.5px] text-slate-400">{tool.tagline}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-8">
            {children}

            {/* HowTo (visible — feeds users + reinforces HowTo schema) */}
            {tool.howTo && (
              <section
                aria-labelledby="how-to-heading"
                className="rounded-xl surface p-5 sm:p-6"
              >
                <h2
                  id="how-to-heading"
                  className="text-[16px] font-semibold text-white tracking-tight mb-4"
                >
                  How to use the {tool.name}
                </h2>
                <ol className="space-y-3">
                  {tool.howTo.map((s, i) => (
                    <li
                      key={s.name}
                      id={`step-${i + 1}`}
                      className="flex gap-3"
                    >
                      <span className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/15 border border-indigo-400/30 text-[11px] font-semibold text-indigo-200 mt-0.5">
                        {i + 1}
                      </span>
                      <div>
                        <h3 className="text-[14px] font-semibold text-white mb-0.5">
                          {s.name}
                        </h3>
                        <p className="text-[13px] text-slate-400 leading-[1.65]">
                          {s.text}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* FAQs (visible — feeds users + reinforces FAQ schema) */}
            {tool.faqs && tool.faqs.length > 0 && (
              <section
                aria-labelledby="faq-heading"
                className="rounded-xl surface p-5 sm:p-6"
              >
                <h2
                  id="faq-heading"
                  className="text-[16px] font-semibold text-white tracking-tight mb-4"
                >
                  Frequently asked questions
                </h2>
                <div className="divide-y divide-white/[0.05]">
                  {tool.faqs.map((f) => (
                    <details key={f.q} className="group py-3.5">
                      <summary className="flex items-center justify-between gap-4 cursor-pointer list-none">
                        <span className="text-[14px] font-medium text-white">
                          {f.q}
                        </span>
                        <ChevronRight
                          size={14}
                          className="shrink-0 text-slate-500 transition-transform group-open:rotate-90"
                        />
                      </summary>
                      <p className="mt-2 text-[13px] text-slate-400 leading-[1.7] pr-6">
                        {f.a}
                      </p>
                    </details>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="rounded-xl surface p-5">
              <p className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-[0.14em] mb-3">
                About this tool
              </p>
              <p className="text-[13px] text-slate-300 leading-[1.7]">
                {tool.longDescription || tool.description}
              </p>
              <div className="mt-4 pt-4 border-t border-white/[0.05] flex flex-wrap gap-1.5">
                {tool.keywords?.slice(0, 4).map((kw) => (
                  <span
                    key={kw}
                    className="px-2 py-0.5 text-[11px] bg-white/[0.03] text-slate-400 rounded-full border border-white/[0.06]"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-xl surface p-5">
              <p className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-[0.14em] mb-3">
                Guaranteed
              </p>
              <ul className="space-y-2">
                {[
                  'Free — no credit card',
                  'No signup needed',
                  'Zero data stored',
                  'Works on any device',
                  'Instant results',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[12.5px] text-slate-300">
                    <Check size={13} className="text-emerald-400 shrink-0 mt-0.5" strokeWidth={2.5} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl surface p-5">
              <p className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-[0.14em] mb-3">
                More free tools
              </p>
              <div className="space-y-1">
                {related.map((t) => {
                  const Icon = t.icon;
                  return (
                    <Link
                      key={t.slug}
                      href={t.href}
                      title={t.tagline}
                      className="flex items-center gap-2.5 p-2 rounded-md hover:bg-white/[0.04] transition-colors group"
                    >
                      <span className={cn(
                        'flex items-center justify-center w-7 h-7 rounded-md shrink-0 border',
                        t.tintBg, t.tintBorder
                      )}>
                        <Icon size={13} className={t.tintText} />
                      </span>
                      <span className="text-[12.5px] font-medium text-slate-300 group-hover:text-white transition-colors">
                        {t.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
