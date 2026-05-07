import Link from 'next/link';
import { SITE, TOOLS } from '@/lib/tools';
import { Zap, Shield, Globe, Heart, ArrowUpRight } from 'lucide-react';

export const metadata = {
  title: 'About Us',
  description: `Learn about ${SITE.name} - our mission to provide free, privacy-first business tools for entrepreneurs worldwide.`,
  alternates: { canonical: '/about' },
  openGraph: {
    title: `About ${SITE.name}`,
    description: `Learn about ${SITE.name} - our mission to provide free, privacy-first business tools.`,
    url: `${SITE.url}/about`,
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <section className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-10">
          <p className="section-label mb-4 fade-up">About us</p>
          <h1 className="text-[32px] sm:text-[44px] font-semibold text-white tracking-[-0.025em] leading-[1.1] mb-3 fade-up delay-1">
            Built for the world&apos;s small businesses.
          </h1>
          <p className="text-[15.5px] text-slate-400 leading-[1.6] fade-up delay-2">
            {SITE.name} is a collection of free, instant business tools designed to save
            entrepreneurs time and money - with zero strings attached.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-8 py-12 space-y-12">
        <section className="fade-up">
          <h2 className="text-[20px] font-semibold text-white tracking-tight mb-4">Our mission</h2>
          <div className="space-y-3 text-[14.5px] text-slate-300 leading-[1.75]">
            <p>
              Small businesses and freelancers power the global economy - but they&apos;re often
              underserved by expensive, bloated software that requires subscriptions, accounts,
              and lengthy onboarding.
            </p>
            <p>
              We built {SITE.name} on a simple belief: the most useful tools should be free,
              fast, and accessible to everyone - from a freelancer in Lagos to a bakery owner
              in Portland to a startup in Singapore.
            </p>
            <p>
              Every tool runs entirely in your browser. No accounts. No data collection. No fees.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-[20px] font-semibold text-white tracking-tight mb-5">Our values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: Zap,    title: 'Speed first',         desc: 'Every tool loads instantly. No spinners - your time is valuable.' },
              { icon: Shield, title: 'Privacy by design',   desc: 'All processing happens in your browser. We have zero access.' },
              { icon: Globe,  title: 'Built for everyone',  desc: 'International phone formats, global currencies - truly global.' },
              { icon: Heart,  title: 'Free forever',        desc: 'Core tools will always be free. Built on advertising, not subscriptions.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-xl surface card-hover p-4">
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-md bg-indigo-500/10 border border-indigo-400/25">
                    <Icon size={14} className="text-indigo-300" strokeWidth={1.75} />
                  </span>
                  <h3 className="text-[14px] font-semibold text-white">{title}</h3>
                </div>
                <p className="text-[13px] text-slate-400 leading-[1.6]">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-[20px] font-semibold text-white tracking-tight mb-5">What we&apos;ve built</h2>
          <div className="space-y-2">
            {TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.slug}
                  href={tool.href}
                  className="flex items-center gap-3 p-3 rounded-lg surface card-hover group"
                >
                  <span className={`flex items-center justify-center w-9 h-9 rounded-md border ${tool.tintBg} ${tool.tintBorder}`}>
                    <Icon size={15} className={tool.tintText} strokeWidth={1.75} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-white">{tool.name}</p>
                    <p className="text-[12.5px] text-slate-500 truncate">{tool.tagline}</p>
                  </div>
                  <ArrowUpRight size={14} className="text-slate-500 group-hover:text-white shrink-0 transition-colors" />
                </Link>
              );
            })}
          </div>
        </section>

        <section className="rounded-xl surface p-7 text-center">
          <h2 className="text-[18px] font-semibold text-white tracking-tight mb-2">
            Have a tool idea?
          </h2>
          <p className="text-[13.5px] text-slate-400 mb-5 max-w-md mx-auto">
            We&apos;re always building. Tell us what tool would help your business most.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-[13.5px] font-medium text-white bg-indigo-500 hover:bg-indigo-400 rounded-md transition-colors"
          >
            Get in touch
            <ArrowUpRight size={13} />
          </Link>
        </section>
      </div>
    </div>
  );
}
