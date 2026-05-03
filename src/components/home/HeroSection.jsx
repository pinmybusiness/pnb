import Link from 'next/link';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { TOOLS } from '@/lib/tools';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Soft ambient gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 50% 100%, rgba(124,58,237,0.06) 0%, transparent 60%)',
        }}
      />
      {/* Fine grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.04) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 30%, transparent 100%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-24 sm:pb-32">
        <div className="max-w-3xl mx-auto text-center">

          {/* Eyebrow pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-8 rounded-full bg-white border border-slate-200 shadow-sm">
            <Sparkles size={12} className="text-indigo-500" strokeWidth={2.25} />
            <span className="text-[12px] font-semibold text-slate-600 tracking-tight">
              Free forever · No accounts · Privacy-first
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-black text-slate-900 tracking-[-0.035em] leading-[1.02] mb-7"
              style={{ fontSize: 'clamp(40px, 6vw, 76px)' }}>
            Free business tools,
            <br />
            <span className="gradient-text-dark">made beautifully simple.</span>
          </h1>

          {/* Sub */}
          <p className="text-[17px] sm:text-[19px] text-slate-600 leading-[1.55] max-w-2xl mx-auto mb-10 font-normal">
            WhatsApp links, QR codes, invoices, email signatures, and password generators —
            trusted by founders, freelancers, and small business owners across the US, UK, and beyond.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
            <Link
              href="/tools"
              className="inline-flex items-center gap-1.5 px-6 py-3.5 text-[15px] font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-md hover:shadow-lg hover:shadow-slate-300/50"
            >
              Open a Tool
              <ArrowUpRight size={15} strokeWidth={2.5} />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 px-5 py-3.5 text-[14.5px] font-semibold text-slate-700 hover:text-slate-900 rounded-xl transition-all"
            >
              See how it works →
            </Link>
          </div>

          {/* Trust line */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12.5px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Used in 50+ countries
            </span>
            <span className="text-slate-300">·</span>
            <span>Runs in your browser</span>
            <span className="text-slate-300">·</span>
            <span>Zero data ever stored</span>
          </div>
        </div>

        {/* Tool quick links */}
        <div className="mt-20">
          <p className="text-center text-[11px] font-bold text-slate-400 uppercase tracking-[0.14em] mb-6">
            Five free tools, ready in seconds
          </p>
          <div className="flex flex-wrap justify-center gap-2.5 max-w-3xl mx-auto">
            {TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.slug}
                  href={tool.href}
                  className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all"
                >
                  <span className={`flex items-center justify-center w-5 h-5 rounded-md ${tool.bgLight}`}>
                    <Icon size={11} className={tool.textColor} strokeWidth={2} />
                  </span>
                  <span className="text-[13px] font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                    {tool.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
