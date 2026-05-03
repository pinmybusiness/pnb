import Link from 'next/link';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { TOOLS } from '@/lib/tools';
import { cn } from '@/lib/utils';

export default function ToolsGrid() {
  const [hero, ...rest] = TOOLS;
  const HeroIcon = hero.icon;

  return (
    <section className="py-24 sm:py-32 bg-white relative overflow-hidden">
      {/* Subtle radial accent */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background: 'radial-gradient(ellipse 50% 40% at 50% 0%, rgba(99,102,241,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14 sm:mb-16">
          <div className="max-w-2xl">
            <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-[0.14em] mb-4">
              The toolkit
            </p>
            <h2 className="text-[36px] sm:text-[52px] font-black text-slate-900 tracking-[-0.04em] leading-[1.02] mb-5">
              Five tools.{' '}
              <span className="gradient-text-dark">No subscriptions.</span>
            </h2>
            <p className="text-[16.5px] text-slate-600 leading-[1.55] max-w-xl">
              Each tool is a tightly focused, single-page utility. Open it, get your output, get on with your day. No setup, no learning curve, no surprise paywalls.
            </p>
          </div>
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 px-5 py-3 text-[14px] font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shrink-0"
          >
            View all tools
            <ArrowUpRight size={14} strokeWidth={2.5} />
          </Link>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">

          {/* Hero card — spans 2 cols + 2 rows */}
          <Link
            href={hero.href}
            className="group relative md:col-span-2 lg:col-span-3 lg:row-span-2 rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 p-8 sm:p-10 min-h-[380px] flex flex-col justify-between hover:from-slate-800 hover:to-slate-700 transition-all duration-300"
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 60% 50% at 80% 20%, rgba(16,185,129,0.4) 0%, transparent 60%)',
              }}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />

            <div className="relative">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles size={13} className="text-amber-400" />
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-[0.12em]">
                  Most popular
                </span>
              </div>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${hero.gradient} shadow-lg`}>
                <HeroIcon size={26} className="text-white" strokeWidth={1.75} />
              </div>
              <h3 className="text-[28px] sm:text-[32px] font-black text-white tracking-tight mb-3 leading-tight">
                {hero.name}
              </h3>
              <p className="text-[15px] text-slate-300 leading-[1.55] max-w-md">
                {hero.description}
              </p>
            </div>

            <div className="relative flex items-center justify-between pt-8 mt-8 border-t border-white/10">
              <div className="flex flex-wrap gap-1.5">
                {hero.keywords?.slice(0, 3).map((kw) => (
                  <span
                    key={kw}
                    className="px-2.5 py-1 text-[10.5px] font-medium text-slate-400 bg-white/5 border border-white/10 rounded-full"
                  >
                    {kw}
                  </span>
                ))}
              </div>
              <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-white group-hover:gap-2 transition-all">
                Try free
                <ArrowUpRight size={14} strokeWidth={2.5} />
              </span>
            </div>
          </Link>

          {/* 4 standard cards */}
          {rest.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.slug}
                href={tool.href}
                className="group relative md:col-span-1 lg:col-span-3 rounded-3xl bg-slate-50/70 border border-slate-200/60 p-7 hover:bg-white hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-200 flex flex-col"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br',
                    tool.gradient
                  )}>
                    <Icon size={22} className="text-white" strokeWidth={1.75} />
                  </div>
                  <ArrowUpRight
                    size={16}
                    className="text-slate-300 group-hover:text-slate-900 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-200"
                  />
                </div>
                <h3 className="text-[18px] font-bold text-slate-900 mb-2 tracking-tight">
                  {tool.name}
                </h3>
                <p className="text-[14px] text-slate-600 leading-[1.55] mb-5 flex-1">
                  {tool.tagline}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-200/70">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    {tool.category}
                  </span>
                  <span className={cn(
                    'text-[10.5px] font-bold px-2 py-0.5 rounded-full',
                    tool.bgLight, tool.textColor
                  )}>
                    {tool.badge}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
