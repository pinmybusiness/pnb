import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { TOOLS } from '@/lib/tools';
import { cn } from '@/lib/utils';

export default function HeroSection() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-16 sm:pb-24 text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-2.5 py-1 mb-7 rounded-full border border-white/[0.08] bg-white/[0.03] fade-up">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-[12px] font-medium text-slate-400">
            5 free tools · no signup · always free
          </span>
        </div>

        {/* Headline */}
        <h1
          className="font-semibold text-white tracking-[-0.025em] leading-[1.05] mb-5 fade-up delay-1"
          style={{ fontSize: 'clamp(34px, 5.5vw, 60px)' }}
        >
          Free business tools that{' '}
          <span className="gradient-text-accent">actually work.</span>
        </h1>

        {/* Sub */}
        <p
          className="text-slate-400 leading-[1.6] mb-8 mx-auto fade-up delay-2"
          style={{ fontSize: 'clamp(15px, 1.5vw, 17px)', maxWidth: '36rem' }}
        >
          QR codes, WhatsApp links, invoices, email signatures, and password generators -
          all in your browser. No accounts, no upsells, no catch.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12 fade-up delay-3">
          <Link
            href="/tools"
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-[14px] font-medium text-white bg-indigo-500 hover:bg-indigo-400 rounded-md transition-colors w-full sm:w-auto"
          >
            Open a tool
            <ArrowRight size={14} />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-[14px] font-medium text-slate-300 hover:text-white rounded-md transition-colors w-full sm:w-auto"
          >
            Learn more
          </Link>
        </div>

        {/* Tool chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 fade-up delay-4">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.slug}
                href={tool.href}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] text-[12.5px] font-medium text-slate-300 hover:bg-white/[0.05] hover:border-white/15 hover:text-white transition-colors"
              >
                <Icon size={12} className={cn(tool.tintText)} strokeWidth={1.75} />
                {tool.name.replace(' Generator', '').replace(' Link', ' link')}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
